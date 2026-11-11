import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml'
};

// 1. Start Static Server on free port (e.g., 3005)
const PORT = 3005;
const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/') reqUrl = '/prototype-map25d.html';
    const filePath = path.join(ROOT, reqUrl);

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType, 'Access-Control-Allow-Origin': '*' });
    fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '127.0.0.1', async () => {
    console.log(`[Test Server] Serving on http://127.0.0.1:${PORT}`);
    try {
        await runHeadlessChromeTests();
    } catch (err) {
        console.error('[Test Error]', err);
    } finally {
        server.close(() => {
            console.log('[Test Server] Stopped.');
            process.exit(0);
        });
    }
});

async function runHeadlessChromeTests() {
    const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const CDP_PORT = 9488;
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-proto-'));

    const chrome = spawn(CHROME, [
        '--headless=new',
        `--remote-debugging-port=${CDP_PORT}`,
        `--user-data-dir=${profile}`,
        '--no-first-run',
        '--no-default-browser-check',
        '--disable-gpu',
        '--hide-scrollbars',
        '--no-proxy-server',
        '--proxy-bypass-list=*',
        'about:blank'
    ], { stdio: 'ignore' });

    function cleanup() {
        try { ws && ws.close(); } catch {}
        try { chrome.kill(); } catch {}
        try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
    }

    let ws = null;
    let msgId = 0;
    const pending = new Map();

    function send(method, params = {}) {
        const id = ++msgId;
        ws.send(JSON.stringify({ id, method, params }));
        return new Promise((resolve, reject) => {
            pending.set(id, { resolve, reject });
            setTimeout(() => {
                if (pending.has(id)) {
                    pending.delete(id);
                    reject(new Error(`Timeout on ${method}`));
                }
            }, 30000);
        });
    }

    async function getJSON(url, method = 'GET') {
        return new Promise((resolve, reject) => {
            const req = http.request(url, { method }, (res) => {
                let d = '';
                res.on('data', c => d += c);
                res.on('end', () => {
                    try { resolve(JSON.parse(d)); } catch (e) { reject(e); }
                });
            });
            req.on('error', reject);
            req.end();
        });
    }

    // Wait for Chrome to be ready
    let target = null;
    for (let i = 0; i < 40; i++) {
        try {
            await getJSON(`http://127.0.0.1:${CDP_PORT}/json/version`);
            target = await getJSON(`http://127.0.0.1:${CDP_PORT}/json/new?about:blank`, 'PUT');
            if (target && target.webSocketDebuggerUrl) break;
        } catch {
            await new Promise(r => setTimeout(r, 150));
        }
    }

    if (!target) {
        cleanup();
        throw new Error('Chrome did not launch in time.');
    }

    ws = new WebSocket(target.webSocketDebuggerUrl);
    await new Promise((res, rej) => {
        ws.addEventListener('open', res, { once: true });
        ws.addEventListener('error', rej, { once: true });
    });

    ws.addEventListener('message', ev => {
        const msg = JSON.parse(ev.data);
        if (msg.id && pending.has(msg.id)) {
            const { resolve, reject } = pending.get(msg.id);
            pending.delete(msg.id);
            if (msg.error) reject(new Error(JSON.stringify(msg.error)));
            else resolve(msg.result);
        }
    });

    await send('Page.enable');
    await send('Runtime.enable');

    const appDataArtifactsDir = 'C:\\Users\\dnccr\\.gemini\\antigravity\\brain\\0904b25c-d101-4706-8e55-8bcf40f2c083';

    // ==========================================
    // TEST 1: Desktop Screenshot & Initial State
    // ==========================================
    console.log('[Test 1] Capturing Desktop View (1440x900)...');
    await send('Emulation.setDeviceMetricsOverride', {
        width: 1440, height: 900, deviceScaleFactor: 2, mobile: false
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/prototype-map25d.html` });
    // Wait for texture and rendering
    await new Promise(r => setTimeout(r, 2500));

    // Evaluate telemetry & errors
    const pageErrors = await send('Runtime.evaluate', {
        expression: `(() => {
            return {
                countriesRendered: window.WORLD_MAP_DATA ? window.WORLD_MAP_DATA.countries.length : 0,
                supportedCount: Object.keys(window.SUPPORTED_COUNTRIES || {}).length,
                fps: document.getElementById('val-fps')?.textContent,
                route: document.getElementById('val-route')?.textContent,
                pixiLoaded: typeof PIXI !== 'undefined'
            };
        })()`,
        returnByValue: true
    });
    console.log('[Test 1 Result]', pageErrors.result.value);

    const desktopShot = await send('Page.captureScreenshot', { format: 'png' });
    const desktopPath = path.join(appDataArtifactsDir, 'prototype_desktop.png');
    fs.writeFileSync(desktopPath, Buffer.from(desktopShot.data, 'base64'));
    console.log('[Saved Desktop Screenshot]:', desktopPath);

    // ==========================================
    // TEST 2: Click Country (Japan JPN) & Interaction Test
    // ==========================================
    console.log('[Test 2] Testing Country Click on Japan (JPN)...');
    await send('Runtime.evaluate', {
        expression: `(() => {
            const chip = document.querySelector('.country-chip[data-code="JPN"]');
            if (chip) chip.click();
            return chip ? 'Clicked JPN chip' : 'JPN chip not found';
        })()`,
        returnByValue: true
    });
    await new Promise(r => setTimeout(r, 1200));

    const jpnCheck = await send('Runtime.evaluate', {
        expression: `(() => {
            return {
                route: document.getElementById('val-route')?.textContent,
                selectedCountry: document.querySelector('.country-chip.selected .name')?.textContent,
                airportCount: document.querySelectorAll('.airport-card').length
            };
        })()`,
        returnByValue: true
    });
    console.log('[Test 2 Result - Japan Click]:', jpnCheck.result.value);

    const jpnShot = await send('Page.captureScreenshot', { format: 'png' });
    const jpnPath = path.join(appDataArtifactsDir, 'prototype_japan_selected.png');
    fs.writeFileSync(jpnPath, Buffer.from(jpnShot.data, 'base64'));
    console.log('[Saved Japan Selected Screenshot]:', jpnPath);

    // ==========================================
    // TEST 3: Zoom and Pan Interaction Test
    // ==========================================
    console.log('[Test 3] Testing Zoom In & Pan Controls...');
    await send('Runtime.evaluate', {
        expression: `(() => {
            const zoomBtn = document.getElementById('btn-zoom-in');
            if (zoomBtn) {
                zoomBtn.click();
                zoomBtn.click();
            }
            return 'Clicked Zoom In twice';
        })()`,
        returnByValue: true
    });
    await new Promise(r => setTimeout(r, 800));

    const zoomCheck = await send('Runtime.evaluate', {
        expression: `document.getElementById('val-zoom')?.textContent`,
        returnByValue: true
    });
    console.log('[Test 3 Result - Zoom Scale]:', zoomCheck.result.value);

    // ==========================================
    // TEST 4: Mobile Responsive Screenshot (390x844 iPhone 14)
    // ==========================================
    console.log('[Test 4] Capturing Mobile Responsive View (390x844)...');
    await send('Emulation.setDeviceMetricsOverride', {
        width: 390, height: 844, deviceScaleFactor: 2, mobile: true
    });
    await send('Runtime.evaluate', {
        expression: `window.dispatchEvent(new Event('resize'));`
    });
    await new Promise(r => setTimeout(r, 1200));

    const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
    const mobilePath = path.join(appDataArtifactsDir, 'prototype_mobile.png');
    fs.writeFileSync(mobilePath, Buffer.from(mobileShot.data, 'base64'));
    console.log('[Saved Mobile Screenshot]:', mobilePath);

    cleanup();
    console.log('[All Tests Finished Successfully!]');
}
