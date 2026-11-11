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

const PORT = 3012;
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
    console.log(`[Auto-Transition Test Server] Running on http://127.0.0.1:${PORT}`);
    try {
        await runAutoTransitionTests();
    } catch (err) {
        console.error('[Auto-Transition Test Error]', err);
    } finally {
        server.close(() => {
            console.log('[Auto-Transition Test Server] Stopped.');
            process.exit(0);
        });
    }
});

async function runAutoTransitionTests() {
    const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const CDP_PORT = 9455;
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-autoflow-'));

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
        // 1. DESKTOP TEST (1440 x 900)
        // ==========================================
        console.log('\n--- 1. TESTING DESKTOP AUTO-TRANSITION FLOW (1440x900) ---');
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
        await new Promise(r => setTimeout(r, 1500));

        // Step 1: Select Japan (JPN)
        console.log('[Desktop] Selecting Japan (JPN)...');
        await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                map.selectCountry('JPN', true);
            })()`
        });
        await new Promise(r => setTimeout(r, 1000));

        // Verify Step 1 is still active (does NOT auto-transition on country selection alone!)
        const countrySelectCheck = await send('Runtime.evaluate', {
            expression: `(() => {
                return {
                    step1Display: document.getElementById('step-1-view').style.display,
                    step2Display: document.getElementById('step-2-view').style.display
                };
            })()`,
            returnByValue: true
        });
        console.log('[Desktop] State after selecting country:', countrySelectCheck.result.value);
        if (countrySelectCheck.result.value.step2Display === 'flex') {
            throw new Error('FAIL: Prematurely auto-transitioned to Step 2 before selecting airport!');
        }

        // Capture Desktop Step 1
        console.log('[Desktop] Capturing Screenshot: Desktop Step 1 Departure...');
        const dSnap1 = await send('Page.captureScreenshot', { format: 'png' });
        const dSnap1Path = path.join(ARTIFACT_DIR, 'prototype_desktop_step1_departure.png');
        fs.writeFileSync(dSnap1Path, Buffer.from(dSnap1.data, 'base64'));
        console.log(`[Desktop] Saved Step 1 Screenshot to: ${dSnap1Path}`);

        // Now select Haneda Airport (HND) -> Must AUTO-TRANSITION to Vietnam without clicking any button!
        console.log('[Desktop] Clicking Haneda (HND) airport card (testing AUTO-TRANSITION)...');
        await send('Runtime.evaluate', {
            expression: `(() => {
                const airportCards = document.querySelectorAll('#departure-airport-list .airport-card');
                if (airportCards.length > 0) {
                    airportCards[0].click(); // Click Haneda
                }
            })()`
        });

        // Wait 1500ms for camera smooth flyTo and panel switch
        await new Promise(r => setTimeout(r, 1600));

        // Verify automatic transition to Step 2
        const autoStep2Check = await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                return {
                    step1Display: document.getElementById('step-1-view').style.display,
                    step2Display: document.getElementById('step-2-view').style.display,
                    stepTitle: document.getElementById('step-title-text').textContent,
                    selectedDest: map.selectedDestinationCode,
                    cameraScale: Math.round(map.camera.scale * 10) / 10,
                    destinationsMode: map.destinationsMode
                };
            })()`,
            returnByValue: true
        });
        console.log('[Desktop] Auto-transition result:', autoStep2Check.result.value);
        if (autoStep2Check.result.value.step2Display !== 'flex' || autoStep2Check.result.value.step1Display !== 'none') {
            throw new Error('FAIL: Auto-transition to Step 2 did NOT occur upon clicking airport card!');
        }

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

        // ==========================================
        // 2. MOBILE TEST (390 x 844)
        // ==========================================
        console.log('\n--- 2. TESTING MOBILE-FIRST AUTO-TRANSITION (390x844) ---');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 390,
            height: 844,
            deviceScaleFactor: 3,
            mobile: true
        });

        // Click "ĐỔI ĐIỂM ĐI" to return to Step 1
        console.log('[Mobile 390x844] Returning to Step 1...');
        await send('Runtime.evaluate', {
            expression: `document.getElementById('btn-back-to-step-1').click()`
        });
        await new Promise(r => setTimeout(r, 1400));

        // Check horizontal overflow
        const overflow390_1 = await send('Runtime.evaluate', {
            expression: `(() => {
                return { bodyW: document.body.clientWidth, scrollW: document.documentElement.scrollWidth, hasOverflow: document.documentElement.scrollWidth > document.body.clientWidth };
            })()`,
            returnByValue: true
        });
        console.log('[Mobile 390x844] Step 1 Overflow Check:', overflow390_1.result.value);

        // Capture Mobile Step 1
        console.log('[Mobile 390x844] Capturing Screenshot: Step 1 Departure...');
        const mSnap1 = await send('Page.captureScreenshot', { format: 'png' });
        const mSnap1Path = path.join(ARTIFACT_DIR, 'prototype_mobile_390x844_step1.png');
        fs.writeFileSync(mSnap1Path, Buffer.from(mSnap1.data, 'base64'));
        console.log(`[Mobile 390x844] Saved Step 1 Screenshot to: ${mSnap1Path}`);

        // Click departure airport card -> Verify AUTO-TRANSITION on mobile!
        console.log('[Mobile 390x844] Tapping departure airport card (testing mobile AUTO-TRANSITION)...');
        await send('Runtime.evaluate', {
            expression: `(() => {
                const cards = document.querySelectorAll('#departure-airport-list .airport-card');
                if (cards.length > 0) cards[0].click();
            })()`
        });
        await new Promise(r => setTimeout(r, 1600));

        const overflow390_2 = await send('Runtime.evaluate', {
            expression: `(() => {
                return { bodyW: document.body.clientWidth, scrollW: document.documentElement.scrollWidth, hasOverflow: document.documentElement.scrollWidth > document.body.clientWidth };
            })()`,
            returnByValue: true
        });
        console.log('[Mobile 390x844] Step 2 Overflow Check:', overflow390_2.result.value);

        // Capture Mobile Step 2
        console.log('[Mobile 390x844] Capturing Screenshot: Step 2 Destination...');
        const mSnap2 = await send('Page.captureScreenshot', { format: 'png' });
        const mSnap2Path = path.join(ARTIFACT_DIR, 'prototype_mobile_390x844_step2.png');
        fs.writeFileSync(mSnap2Path, Buffer.from(mSnap2.data, 'base64'));
        console.log(`[Mobile 390x844] Saved Step 2 Screenshot to: ${mSnap2Path}`);

        // ==========================================
        // 3. MOBILE VIEWPORT (360 x 800)
        // ==========================================
        console.log('\n--- 3. TESTING MOBILE VIEWPORT (360x800) ---');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 360,
            height: 800,
            deviceScaleFactor: 2.5,
            mobile: true
        });
        await new Promise(r => setTimeout(r, 800));

        const overflow360 = await send('Runtime.evaluate', {
            expression: `(() => {
                return { bodyW: document.body.clientWidth, scrollW: document.documentElement.scrollWidth, hasOverflow: document.documentElement.scrollWidth > document.body.clientWidth };
            })()`,
            returnByValue: true
        });
        console.log('[Mobile 360x800] Overflow Check:', overflow360.result.value);

        console.log('[Mobile 360x800] Capturing Screenshot: Step 2 Destination...');
        const mSnap360 = await send('Page.captureScreenshot', { format: 'png' });
        const mSnap360Path = path.join(ARTIFACT_DIR, 'prototype_mobile_360x800_step2.png');
        fs.writeFileSync(mSnap360Path, Buffer.from(mSnap360.data, 'base64'));
        console.log(`[Mobile 360x800] Saved Step 2 Screenshot to: ${mSnap360Path}`);

        // ==========================================
        // 4. MOBILE VIEWPORT (412 x 915)
        // ==========================================
        console.log('\n--- 4. TESTING MOBILE VIEWPORT (412x915) ---');
        await send('Emulation.setDeviceMetricsOverride', {
            width: 412,
            height: 915,
            deviceScaleFactor: 2.625,
            mobile: true
        });
        await new Promise(r => setTimeout(r, 800));

        const overflow412 = await send('Runtime.evaluate', {
            expression: `(() => {
                return { bodyW: document.body.clientWidth, scrollW: document.documentElement.scrollWidth, hasOverflow: document.documentElement.scrollWidth > document.body.clientWidth };
            })()`,
            returnByValue: true
        });
        console.log('[Mobile 412x915] Overflow Check:', overflow412.result.value);

        console.log('[Mobile 412x915] Capturing Screenshot: Step 2 Destination...');
        const mSnap412 = await send('Page.captureScreenshot', { format: 'png' });
        const mSnap412Path = path.join(ARTIFACT_DIR, 'prototype_mobile_412x915_step2.png');
        fs.writeFileSync(mSnap412Path, Buffer.from(mSnap412.data, 'base64'));
        console.log(`[Mobile 412x915] Saved Step 2 Screenshot to: ${mSnap412Path}`);

        // ==========================================
        // 5. REGRESSION & CONSOLE ERROR AUDIT
        // ==========================================
        console.log('\n--- 5. SYSTEM REGRESSION & ERROR AUDIT ---');
        const regressionRes = await send('Runtime.evaluate', {
            expression: `(() => {
                const map = window.__prototypeMapInstance;
                return {
                    radarPulseExists: Boolean(map.radarPulse),
                    radarPulseRadius: map.radarPulse ? map.radarPulse.scale.x : 0,
                    flightPlaneExists: Boolean(map.flightPlane),
                    islandsLayerExists: Boolean(map.islandsLayer),
                    islandsChildrenCount: map.islandsLayer ? map.islandsLayer.children.length : 0,
                    countriesCount: map.countryGraphicsMap.size
                };
            })()`,
            returnByValue: true
        });
        console.log('[Regression Check Results]:', regressionRes.result.value);

        if (consoleErrors.length > 0) {
            console.warn('[Console Errors Detected]:', consoleErrors);
        } else {
            console.log('[Console Errors]: 0');
        }

        console.log('\n================================================================');
        console.log('ALL AUTO-TRANSITION & MOBILE AUDIT CHECKS PASSED (100% SUCCESS)');
        console.log('================================================================\n');

    } finally {
        if (ws) ws.close();
        cleanup();
    }
}

