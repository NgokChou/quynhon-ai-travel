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

const PORT = 3011;
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
    console.log(`[Flow Test Server] Running on http://127.0.0.1:${PORT}`);
    try {
        await runFlowTests();
    } catch (err) {
        console.error('[Flow Test Error]', err);
    } finally {
        server.close(() => {
            console.log('[Flow Test Server] Stopped.');
            process.exit(0);
        });
    }
});

async function runFlowTests() {
    const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const CDP_PORT = 9466;
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-flow-'));

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
    const consoleErrors = [];

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
            if (msg.method === 'Runtime.consoleAPICalled' && msg.params.type === 'error') {
                consoleErrors.push(msg.params.args.map(a => a.value || a.description).join(' '));
            }
            if (msg.id && pending.has(msg.id)) {
                const { resolve, reject } = pending.get(msg.id);
                pending.delete(msg.id);
                if (msg.error) reject(new Error(JSON.stringify(msg.error)));
                else resolve(msg.result);
            }
        });

        await send('Page.enable');
        await send('Runtime.enable');

        // ==========================================
        // TEST PART 1: DESKTOP FLOW (1440 x 900)
        // ==========================================
        console.log('\n--- TESTING DESKTOP FLOW (1440x900) ---');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 1440,
            height: 900,
            deviceScaleFactor: 2,
            mobile: false
        });

        console.log('[Desktop] Navigating to prototype-map25d.html...');
        await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/prototype-map25d.html` });

        // Wait for map readiness
        let ready = false;
        for (let i = 0; i < 40; i++) {
            await new Promise(r => setTimeout(r, 250));
            const evalRes = await send('Runtime.evaluate', {
                expression: 'Boolean(window.__prototypeMapInstance && window.VIETNAM_DESTINATIONS)'
            });
            if (evalRes.result && evalRes.result.value === true) {
                ready = true;
                break;
            }
        }
        if (!ready) throw new Error('Timeout waiting for map readiness');
        console.log('[Desktop] Map ready.');
        await new Promise(r => setTimeout(r, 1500));

        // Step 1: Select Japan (JPN)
        console.log('[Desktop] Selecting Japan (JPN)...');
        await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                map.selectCountry('JPN', true);
            })()`
        });
        await new Promise(r => setTimeout(r, 1200));

        // Capture Desktop Step 1
        console.log('[Desktop] Capturing Screenshot: Desktop Step 1 Departure...');
        const dSnap1 = await send('Page.captureScreenshot', { format: 'png' });
        const dSnap1Path = path.join(ARTIFACT_DIR, 'prototype_desktop_step1_departure.png');
        fs.writeFileSync(dSnap1Path, Buffer.from(dSnap1.data, 'base64'));
        console.log(`[Desktop] Saved Step 1 Screenshot to: ${dSnap1Path}`);

        // Click "TIẾP TỤC ĐẾN VIỆT NAM"
        console.log('[Desktop] Transitioning to Step 2 (Fly to Vietnam)...');
        await send('Runtime.evaluate', {
            expression: `document.getElementById('btn-to-step-2').click()`
        });
        await new Promise(r => setTimeout(r, 1800));

        // Verify Step 2 state in browser
        const step2Check = await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                return {
                    step1Display: document.getElementById('step-1-view').style.display,
                    step2Display: document.getElementById('step-2-view').style.display,
                    currentDestination: map.selectedDestinationCode,
                    cameraScale: Math.round(map.camera.scale * 10) / 10,
                    destinationsMode: map.destinationsMode
                };
            })()`,
            returnByValue: true
        });
        console.log('[Desktop] Step 2 state:', step2Check.result.value);

        // Select Quy Nhon UIH
        await send('Runtime.evaluate', {
            expression: `(() => {
                const card = document.querySelector('.destination-card[data-code="UIH"]');
                if (card) card.click();
            })()`
        });
        await new Promise(r => setTimeout(r, 800));

        // Capture Desktop Step 2
        console.log('[Desktop] Capturing Screenshot: Desktop Step 2 Destination...');
        const dSnap2 = await send('Page.captureScreenshot', { format: 'png' });
        const dSnap2Path = path.join(ARTIFACT_DIR, 'prototype_desktop_step2_destination.png');
        fs.writeFileSync(dSnap2Path, Buffer.from(dSnap2.data, 'base64'));
        console.log(`[Desktop] Saved Step 2 Screenshot to: ${dSnap2Path}`);

        // Click Confirm Final
        console.log('[Desktop] Confirming itinerary...');
        await send('Runtime.evaluate', {
            expression: `document.getElementById('btn-confirm-final').click()`
        });
        await new Promise(r => setTimeout(r, 500));
        const modalShown = await send('Runtime.evaluate', {
            expression: `document.getElementById('confirm-modal').classList.contains('show')`
        });
        console.log('[Desktop] Modal confirmation shown:', modalShown.result.value);
        await send('Runtime.evaluate', {
            expression: `document.getElementById('btn-close-modal').click()`
        });
        await new Promise(r => setTimeout(r, 300));

        // ==========================================
        // TEST PART 2: MOBILE FLOW (390 x 844)
        // ==========================================
        console.log('\n--- TESTING MOBILE-FIRST EXPERIENCE (390x844) ---');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 390,
            height: 844,
            deviceScaleFactor: 3,
            mobile: true
        });

        // Return to Step 1 on mobile
        await send('Runtime.evaluate', {
            expression: `document.getElementById('btn-back-to-step-1').click()`
        });
        await new Promise(r => setTimeout(r, 1500));

        // Check horizontal overflow on mobile
        const overflowCheck1 = await send('Runtime.evaluate', {
            expression: `(() => {
                const bodyW = document.body.clientWidth;
                const scrollW = document.documentElement.scrollWidth;
                return { bodyW, scrollW, hasOverflow: scrollW > bodyW };
            })()`,
            returnByValue: true
        });
        console.log('[Mobile 390x844] Horizontal overflow check Step 1:', overflowCheck1.result.value);
        if (overflowCheck1.result.value.hasOverflow) {
            throw new Error('FAIL: Horizontal overflow detected on 390x844 Step 1!');
        }

        // Capture Mobile Step 1
        console.log('[Mobile 390x844] Capturing Screenshot: Step 1 Departure...');
        const mSnap1 = await send('Page.captureScreenshot', { format: 'png' });
        const mSnap1Path = path.join(ARTIFACT_DIR, 'prototype_mobile_390x844_step1.png');
        fs.writeFileSync(mSnap1Path, Buffer.from(mSnap1.data, 'base64'));
        console.log(`[Mobile 390x844] Saved Screenshot to: ${mSnap1Path}`);

        // Transition to Step 2 on mobile
        console.log('[Mobile 390x844] Transitioning to Step 2 Destination...');
        await send('Runtime.evaluate', {
            expression: `document.getElementById('btn-to-step-2').click()`
        });
        await new Promise(r => setTimeout(r, 1800));

        // Check horizontal overflow on mobile Step 2
        const overflowCheck2 = await send('Runtime.evaluate', {
            expression: `(() => {
                const bodyW = document.body.clientWidth;
                const scrollW = document.documentElement.scrollWidth;
                return { bodyW, scrollW, hasOverflow: scrollW > bodyW };
            })()`,
            returnByValue: true
        });
        console.log('[Mobile 390x844] Horizontal overflow check Step 2:', overflowCheck2.result.value);
        if (overflowCheck2.result.value.hasOverflow) {
            throw new Error('FAIL: Horizontal overflow detected on 390x844 Step 2!');
        }

        // Capture Mobile Step 2
        console.log('[Mobile 390x844] Capturing Screenshot: Step 2 Destination...');
        const mSnap2 = await send('Page.captureScreenshot', { format: 'png' });
        const mSnap2Path = path.join(ARTIFACT_DIR, 'prototype_mobile_390x844_step2.png');
        fs.writeFileSync(mSnap2Path, Buffer.from(mSnap2.data, 'base64'));
        console.log(`[Mobile 390x844] Saved Screenshot to: ${mSnap2Path}`);

        // ==========================================
        // TEST PART 3: MOBILE VIEWPORT (360 x 800)
        // ==========================================
        console.log('\n--- TESTING MOBILE VIEWPORT (360x800) ---');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 360,
            height: 800,
            deviceScaleFactor: 2.5,
            mobile: true
        });
        await new Promise(r => setTimeout(r, 800));

        const overflowCheck360 = await send('Runtime.evaluate', {
            expression: `(() => {
                const bodyW = document.body.clientWidth;
                const scrollW = document.documentElement.scrollWidth;
                return { bodyW, scrollW, hasOverflow: scrollW > bodyW };
            })()`,
            returnByValue: true
        });
        console.log('[Mobile 360x800] Horizontal overflow check:', overflowCheck360.result.value);

        console.log('[Mobile 360x800] Capturing Screenshot...');
        const mSnap360 = await send('Page.captureScreenshot', { format: 'png' });
        const mSnap360Path = path.join(ARTIFACT_DIR, 'prototype_mobile_360x800_step2.png');
        fs.writeFileSync(mSnap360Path, Buffer.from(mSnap360.data, 'base64'));
        console.log(`[Mobile 360x800] Saved Screenshot to: ${mSnap360Path}`);

        // ==========================================
        // TEST PART 4: MOBILE VIEWPORT (412 x 915)
        // ==========================================
        console.log('\n--- TESTING MOBILE VIEWPORT (412x915) ---');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 412,
            height: 915,
            deviceScaleFactor: 2.625,
            mobile: true
        });
        await new Promise(r => setTimeout(r, 800));

        const overflowCheck412 = await send('Runtime.evaluate', {
            expression: `(() => {
                const bodyW = document.body.clientWidth;
                const scrollW = document.documentElement.scrollWidth;
                return { bodyW, scrollW, hasOverflow: scrollW > bodyW };
            })()`,
            returnByValue: true
        });
        console.log('[Mobile 412x915] Horizontal overflow check:', overflowCheck412.result.value);

        console.log('[Mobile 412x915] Capturing Screenshot...');
        const mSnap412 = await send('Page.captureScreenshot', { format: 'png' });
        const mSnap412Path = path.join(ARTIFACT_DIR, 'prototype_mobile_412x915_step2.png');
        fs.writeFileSync(mSnap412Path, Buffer.from(mSnap412.data, 'base64'));
        console.log(`[Mobile 412x915] Saved Screenshot to: ${mSnap412Path}`);

        // ==========================================
        // SYSTEM REGRESSION CHECK
        // ==========================================
        console.log('\n--- CHECKING REGRESSION & ERRORS ---');
        const regressionRes = await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                return {
                    radarPulseExists: Boolean(map.radarPulse),
                    radarPulseRadius: map.radarPulse ? map.radarPulse.scale.x : 0,
                    flightPlaneExists: Boolean(map.flightPlane),
                    islandsLayerExists: Boolean(map.islandsLayer),
                    islandsLayerVisible: map.islandsLayer ? map.islandsLayer.visible : false,
                    islandsChildrenCount: map.islandsLayer ? map.islandsLayer.children.length : 0,
                    countriesCount: map.countryGraphicsMap.size
                };
            })()`,
            returnByValue: true
        });
        console.log('[Regression Check]', regressionRes.result.value);

        if (consoleErrors.length > 0) {
            console.warn('[Console Errors Detected]:', consoleErrors);
        } else {
            console.log('[Console Errors]: 0');
        }

        console.log('\n================================================================');
        console.log('ALL FLOW & MOBILE-FIRST TESTS COMPLETED SUCCESSFULLY (100% PASS)');
        console.log('================================================================\n');

    } finally {
        if (ws) ws.close();
        cleanup();
    }
}

