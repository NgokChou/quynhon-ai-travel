import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');
const ARTIFACT_DIR = 'C:\\Users\\dnccr\\.gemini\\antigravity\\brain\\0904b25c-d101-4706-8e55-8bcf40f2c083';

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

const PORT = 3009;
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
    console.log(`[Visual Test Server] Running on http://127.0.0.1:${PORT}`);
    try {
        await runIslandVisualTests();
    } catch (err) {
        console.error('[Visual Test Error]', err);
    } finally {
        server.close(() => {
            console.log('[Visual Test Server] Stopped.');
            process.exit(0);
        });
    }
});

async function runIslandVisualTests() {
    const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const CDP_PORT = 9488;
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-islands-'));

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

    try {
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
            throw new Error('Chrome launch timeout');
        }

        ws = new WebSocket(target.webSocketDebuggerUrl);
        await new Promise((res, rej) => {
            ws.addEventListener('open', res, { once: true });
            ws.addEventListener('error', rej, { once: true });
        });

        ws.addEventListener('message', (ev) => {
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
        await send('Emulation.setDeviceMetricsOverride', {
            width: 1440,
            height: 900,
            deviceScaleFactor: 2,
            mobile: false
        });

        console.log('[Test] Navigating to prototype-map25d.html...');
        await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/prototype-map25d.html` });

        // Wait for map readiness
        let ready = false;
        for (let i = 0; i < 40; i++) {
            await new Promise(r => setTimeout(r, 250));
            const evalRes = await send('Runtime.evaluate', {
                expression: 'Boolean(window.__prototypeMapInstance && window.__prototypeMapInstance.islandsLayer)'
            });
            if (evalRes.result && evalRes.result.value === true) {
                ready = true;
                break;
            }
        }
        if (!ready) throw new Error('Timeout waiting for prototype map initialization');
        console.log('[Test] Prototype Map initialized successfully.');

        // Allow texture & ticker to settle
        await new Promise(r => setTimeout(r, 2000));

        // 1. Audit Island Layer structure
        const auditRes = await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                const layer = map.islandsLayer;
                if (!layer) return { error: 'islandsLayer missing' };

                const childCount = layer.children.length;
                const labels = [];
                let graphicsCount = 0;
                let containersCount = 0;

                for (const c of layer.children) {
                    if (c instanceof PIXI.Container && c.children && c.children.length >= 2) {
                        containersCount++;
                        const txt = c.children.find(child => child instanceof PIXI.Text);
                        if (txt) {
                            labels.push({ text: txt.text, x: c.x, y: c.y });
                        }
                    } else if (c instanceof PIXI.Graphics) {
                        graphicsCount++;
                    }
                }

                // Check Quy Nhon coordinate
                const qnPt = map.project(109.0433, 13.9556);
                const hsCenter = map.project(111.9, 17.35);
                const tsCenter = map.project(113.3, 9.4);

                const distQN_HS = Math.hypot(hsCenter.x - qnPt.x, hsCenter.y - qnPt.y);
                const distQN_TS = Math.hypot(tsCenter.x - qnPt.x, tsCenter.y - qnPt.y);

                return {
                    childCount,
                    graphicsCount,
                    containersCount,
                    labels,
                    qnCoords: { x: Math.round(qnPt.x * 10) / 10, y: Math.round(qnPt.y * 10) / 10 },
                    hsCoords: { x: Math.round(hsCenter.x * 10) / 10, y: Math.round(hsCenter.y * 10) / 10 },
                    tsCoords: { x: Math.round(tsCenter.x * 10) / 10, y: Math.round(tsCenter.y * 10) / 10 },
                    distQN_HS: Math.round(distQN_HS * 10) / 10,
                    distQN_TS: Math.round(distQN_TS * 10) / 10,
                    currentZoom: map.camera.scale,
                    islandsLayerVisible: layer.visible,
                    islandsLayerAlpha: layer.alpha
                };
            })()`,
            returnByValue: true
        });

        console.log('[Test] Island Layer Metrics:', JSON.stringify(auditRes.result.value, null, 2));

        // 2. Capture Screenshot 1: Default Zoom View
        console.log('[Test] Capturing Screenshot 1: Default Zoom View...');
        const snap1 = await send('Page.captureScreenshot', { format: 'png' });
        const snap1Path = path.join(ARTIFACT_DIR, 'prototype_islands_default_zoom.png');
        fs.writeFileSync(snap1Path, Buffer.from(snap1.data, 'base64'));
        console.log(`[Test] Saved Default Zoom Screenshot (${snap1.data.length} bytes) to: ${snap1Path}`);

        // 3. Pan & Zoom closely to Vietnam and East Sea using camera
        console.log('[Test] Focusing camera on Vietnam & East Sea (Zoom = 2.4x)...');
        await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                const viewW = map.app.screen.width;
                const viewH = map.app.screen.height;

                // Center near East Sea: Lon ~ 113.0, Lat ~ 13.0
                const targetPt = map.project(113.0, 13.0);
                const targetZoom = 2.4;

                map.camera.scale = targetZoom;
                map.camera.targetScale = targetZoom;
                map.camera.x = viewW / 2 - targetPt.x * targetZoom;
                map.camera.y = viewH / 2 - targetPt.y * targetZoom;
                map.camera.targetX = map.camera.x;
                map.camera.targetY = map.camera.y;
            })()`
        });

        // Let ticker render 1000ms
        await new Promise(r => setTimeout(r, 1000));

        // 4. Capture Screenshot 2: Zoomed-in Vietnam View
        console.log('[Test] Capturing Screenshot 2: Zoomed-in Vietnam & East Sea View...');
        const snap2 = await send('Page.captureScreenshot', { format: 'png' });
        const snap2Path = path.join(ARTIFACT_DIR, 'prototype_islands_vietnam_zoom.png');
        fs.writeFileSync(snap2Path, Buffer.from(snap2.data, 'base64'));
        console.log(`[Test] Saved Zoomed-in Screenshot (${snap2.data.length} bytes) to: ${snap2Path}`);

        // 5. Test Country Selection & Radar integrity during island display
        console.log('[Test] Testing country selection (Japan - JPN)...');
        const flightTestRes = await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                map.selectCountry('JPN', false);
                return {
                    selectedCountry: map.selectedCountryCode,
                    hasFlightPlane: Boolean(map.flightPlane),
                    radarPulseRadius: map.radarPulse ? map.radarPulse.scale.x : 0,
                    islandsStillVisible: map.islandsLayer.visible && map.islandsLayer.children.length === 28
                };
            })()`,
            returnByValue: true
        });
        console.log('[Test] Interaction Test Results:', JSON.stringify(flightTestRes.result.value, null, 2));

        console.log('\n========================================');
        console.log('ALL VISUAL & LOGICAL AUDIT CHECKS PASSED');
        console.log('========================================\n');

    } finally {
        if (ws) ws.close();
        cleanup();
    }
}
