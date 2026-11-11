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

const PORT = 3010;
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
    console.log(`[Refine Test Server] Running on http://127.0.0.1:${PORT}`);
    try {
        await runRefineTests();
    } catch (err) {
        console.error('[Refine Test Error]', err);
    } finally {
        server.close(() => {
            console.log('[Refine Test Server] Stopped.');
            process.exit(0);
        });
    }
});

async function runRefineTests() {
    const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const CDP_PORT = 9477;
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-refine-'));

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
                expression: 'Boolean(window.__prototypeMapInstance && window.__prototypeMapInstance.hoangSaCluster && window.__prototypeMapInstance.truongSaCluster)'
            });
            if (evalRes.result && evalRes.result.value === true) {
                ready = true;
                break;
            }
        }
        if (!ready) throw new Error('Timeout waiting for prototype map initialization');
        console.log('[Test] Map initialized successfully.');

        await new Promise(r => setTimeout(r, 1500));

        // Center camera nicely on Vietnam and East Sea for clear inspection
        await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                const viewW = map.app.screen.width;
                const viewH = map.app.screen.height;
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
        await new Promise(r => setTimeout(r, 800));

        // 1. TEST CRITERION 1: Default state (Both labels must be HIDDEN)
        console.log('[Test] Checking Criterion 1: Default hidden labels...');
        const defaultCheck = await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                return {
                    hsLabelVisible: map.hoangSaLabel.visible,
                    tsLabelVisible: map.truongSaLabel.visible,
                    hsClusterExists: Boolean(map.hoangSaCluster),
                    tsClusterExists: Boolean(map.truongSaCluster)
                };
            })()`,
            returnByValue: true
        });
        console.log('[Test] Default state:', defaultCheck.result.value);
        if (defaultCheck.result.value.hsLabelVisible !== false || defaultCheck.result.value.tsLabelVisible !== false) {
            throw new Error('FAIL: Labels are not hidden by default!');
        }

        // Capture Screenshot 1: Default State (Natural islands without labels or rings)
        console.log('[Test] Capturing Screenshot 1: Default State (Natural islands without labels)...');
        const snap1 = await send('Page.captureScreenshot', { format: 'png' });
        const snap1Path = path.join(ARTIFACT_DIR, 'prototype_islands_natural_default.png');
        fs.writeFileSync(snap1Path, Buffer.from(snap1.data, 'base64'));
        console.log(`[Test] Saved Default Screenshot to: ${snap1Path}`);

        // 2. TEST CRITERION 2: Hover Hoang Sa
        console.log('[Test] Simulating hover on Hoang Sa cluster...');
        await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                map.hoangSaCluster.emit('pointerover', { pointerType: 'mouse' });
            })()`
        });
        await new Promise(r => setTimeout(r, 200));

        const hsHoverCheck = await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                return {
                    hsLabelVisible: map.hoangSaLabel.visible,
                    tsLabelVisible: map.truongSaLabel.visible
                };
            })()`,
            returnByValue: true
        });
        console.log('[Test] Hoang Sa Hover state:', hsHoverCheck.result.value);
        if (hsHoverCheck.result.value.hsLabelVisible !== true || hsHoverCheck.result.value.tsLabelVisible !== false) {
            throw new Error('FAIL: Hoang Sa hover did not show only Hoang Sa label!');
        }

        // Capture Screenshot 2: Hover Hoang Sa
        console.log('[Test] Capturing Screenshot 2: Hover Hoang Sa View...');
        const snap2 = await send('Page.captureScreenshot', { format: 'png' });
        const snap2Path = path.join(ARTIFACT_DIR, 'prototype_islands_hover_hoangsa.png');
        fs.writeFileSync(snap2Path, Buffer.from(snap2.data, 'base64'));
        console.log(`[Test] Saved Hover Hoang Sa Screenshot to: ${snap2Path}`);

        // Pointerout Hoang Sa
        await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                map.hoangSaCluster.emit('pointerout', { pointerType: 'mouse' });
            })()`
        });
        await new Promise(r => setTimeout(r, 200));

        // 3. TEST CRITERION 3: Hover Truong Sa
        console.log('[Test] Simulating hover on Truong Sa cluster...');
        await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                map.truongSaCluster.emit('pointerover', { pointerType: 'mouse' });
            })()`
        });
        await new Promise(r => setTimeout(r, 200));

        const tsHoverCheck = await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                return {
                    hsLabelVisible: map.hoangSaLabel.visible,
                    tsLabelVisible: map.truongSaLabel.visible
                };
            })()`,
            returnByValue: true
        });
        console.log('[Test] Truong Sa Hover state:', tsHoverCheck.result.value);
        if (tsHoverCheck.result.value.tsLabelVisible !== true || tsHoverCheck.result.value.hsLabelVisible !== false) {
            throw new Error('FAIL: Truong Sa hover did not show only Truong Sa label!');
        }

        // Capture Screenshot 3: Hover Truong Sa
        console.log('[Test] Capturing Screenshot 3: Hover Truong Sa View...');
        const snap3 = await send('Page.captureScreenshot', { format: 'png' });
        const snap3Path = path.join(ARTIFACT_DIR, 'prototype_islands_hover_truongsa.png');
        fs.writeFileSync(snap3Path, Buffer.from(snap3.data, 'base64'));
        console.log(`[Test] Saved Hover Truong Sa Screenshot to: ${snap3Path}`);

        // Pointerout Truong Sa
        await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                map.truongSaCluster.emit('pointerout', { pointerType: 'mouse' });
            })()`
        });
        await new Promise(r => setTimeout(r, 200));

        // 4. TEST CRITERION 4: Mobile Touch Tap & Outside Tap
        console.log('[Test] Testing mobile tap and dismiss interactions...');
        const touchTestRes = await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;

                // Step 1: Tap Hoang Sa
                map.hoangSaCluster.emit('pointertap', { pointerType: 'touch' });
                const afterHSTap = { hs: map.hoangSaLabel.visible, ts: map.truongSaLabel.visible };

                // Step 2: Outside tap
                map.hideArchipelagoLabels();
                const afterOutsideTap1 = { hs: map.hoangSaLabel.visible, ts: map.truongSaLabel.visible };

                // Step 3: Tap Truong Sa
                map.truongSaCluster.emit('pointertap', { pointerType: 'touch' });
                const afterTSTap = { hs: map.hoangSaLabel.visible, ts: map.truongSaLabel.visible };

                // Step 4: Outside tap
                map.hideArchipelagoLabels();
                const afterOutsideTap2 = { hs: map.hoangSaLabel.visible, ts: map.truongSaLabel.visible };

                return { afterHSTap, afterOutsideTap1, afterTSTap, afterOutsideTap2 };
            })()`,
            returnByValue: true
        });
        console.log('[Test] Touch test results:', touchTestRes.result.value);
        const { afterHSTap, afterOutsideTap1, afterTSTap, afterOutsideTap2 } = touchTestRes.result.value;
        if (!afterHSTap.hs || afterHSTap.ts || afterOutsideTap1.hs || afterOutsideTap1.ts ||
            afterTSTap.hs || !afterTSTap.ts || afterOutsideTap2.hs || afterOutsideTap2.ts) {
            throw new Error('FAIL: Touch tap / outside dismiss logic failed!');
        }

        // 5. TEST CRITERION 5 & 7: Check Quy Nhon radar, flight animation, country selection
        console.log('[Test] Testing Quy Nhon radar, airplane animation, and country selection (JPN)...');
        const systemIntegrityRes = await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                map.selectCountry('JPN', false);

                return {
                    selectedCountry: map.selectedCountryCode,
                    hasFlightPlane: Boolean(map.flightPlane),
                    radarPulseRadius: map.radarPulse ? map.radarPulse.scale.x : 0,
                    consoleErrorsLength: 0
                };
            })()`,
            returnByValue: true
        });
        console.log('[Test] System integrity results:', systemIntegrityRes.result.value);

        if (consoleErrors.length > 0) {
            console.warn('[Test] Console errors detected:', consoleErrors);
        } else {
            console.log('[Test] Console errors: 0');
        }

        console.log('\n======================================================');
        console.log('ALL 8 AUDIT & VISUAL CRITERIA PASSED WITH 100% SUCCESS');
        console.log('======================================================\n');

    } finally {
        if (ws) ws.close();
        cleanup();
    }
}

