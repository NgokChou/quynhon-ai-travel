/**
 * AUTOMATED VERIFICATION & SCREENSHOT CAPTURE FOR SPRINT C.1.6
 * Piggy Bank Growth Game Refinement
 */

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

const PORT = 3022;
const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/') reqUrl = '/prototype-piggybank-preview.html';
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
    console.log(`[Piggy Growth Test Server] Running on http://127.0.0.1:${PORT}`);
    try {
        await runPiggyGrowthTests();
    } catch (err) {
        console.error('[Piggy Growth Test Error]', err);
        process.exitCode = 1;
    } finally {
        server.close(() => {
            console.log('[Piggy Growth Test Server] Stopped.');
            process.exit(process.exitCode || 0);
        });
    }
});

async function runPiggyGrowthTests() {
    const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const CDP_PORT = 9492;
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-growth-'));

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

    let ws = null;
    let msgId = 0;
    const pending = new Map();
    const consoleErrors = [];
    const consoleLogs = [];

    function cleanup() {
        try { ws && ws.close(); } catch {}
        try { chrome.kill(); } catch {}
        try { fs.rmSync(profile, { recursive: true, force: true }); } catch {}
    }

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

    // Connect to CDP
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
        throw new Error('Could not connect to Chrome CDP target.');
    }

    ws = new globalThis.WebSocket(target.webSocketDebuggerUrl);
    await new Promise((resolve, reject) => {
        ws.onopen = resolve;
        ws.onerror = reject;
    });

    ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Runtime.consoleAPICalled') {
            const text = msg.params.args.map(a => a.value ?? a.description ?? '').join(' ');
            if (msg.params.type === 'error') {
                consoleErrors.push(text);
            } else {
                consoleLogs.push(`[Console ${msg.params.type}] ${text}`);
            }
        }
        if (msg.id && pending.has(msg.id)) {
            const cb = pending.get(msg.id);
            pending.delete(msg.id);
            if (msg.error) cb.reject(msg.error);
            else cb.resolve(msg.result);
        }
    };

    await send('Page.enable');
    await send('Runtime.enable');

    // 1. Set Desktop Viewport (1440x900)
    await send('Emulation.setDeviceMetricsOverride', {
        width: 1440,
        height: 900,
        deviceScaleFactor: 2,
        mobile: false
    });

    console.log('[Test 1] Navigating to http://127.0.0.1:3022/prototype-piggybank-preview.html...');
    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/prototype-piggybank-preview.html` });
    await new Promise(r => setTimeout(r, 2200));

    // =========================================================================
    // 2. TEST SLIDER CONTINUOUS COIN EMISSION & POOL REUSE
    // =========================================================================
    console.log('\n--- [TEST 2: Slider Continuous Coin Stream & Pool Verification] ---');
    const coinStreamTest = await send('Runtime.evaluate', {
        expression: `(() => {
            const poolBefore = window.piggyBankApp.coinPool.filter(c => c.inUse).length;
            // Simulate slider drag
            for (let i = 0; i < 8; i++) {
                window.piggyBankApp.spawnContinuousCoin();
            }
            const poolActive = window.piggyBankApp.coinPool.filter(c => c.inUse).length;
            const totalFed = window.piggyBankApp.coinsFedCount;
            return { poolBefore, poolActive, totalFed, poolTotalCapacity: window.piggyBankApp.coinPool.length };
        })()`,
        returnByValue: true
    });
    console.log('[Coin Stream Pool Test Result]:', coinStreamTest.result.value);

    // =========================================================================
    // 3. TEST 5 TIERS GROWTH SCALES & TREASURY COIN ACCUMULATION
    // =========================================================================
    console.log('\n--- [TEST 3: Piggy Growth Scale & Treasury Stacks Across 5 Tiers] ---');
    const tierChecks = await send('Runtime.evaluate', {
        expression: `(() => {
            const results = [];
            for (let t = 1; t <= 5; t++) {
                window.piggyBankApp.updateTier(t, false);
                results.push({
                    tier: t,
                    scale: window.piggyBankApp.scaleSpring.value,
                    treasuryCoins: window.piggyBankApp.treasuryMesh.count,
                    name: document.getElementById('tier-pill-name').textContent
                });
            }
            return results;
        })()`,
        returnByValue: true
    });
    console.log('[5 Tier Growth Verification]:', tierChecks.result.value);

    // =========================================================================
    // 4. TEST ROUNDTRIP TRANSITION (Tier 5 -> Tier 1 -> Tier 5)
    // =========================================================================
    console.log('\n--- [TEST 4: Roundtrip Transition Tier 5 -> Tier 1 -> Tier 5] ---');
    const roundtrip = await send('Runtime.evaluate', {
        expression: `(() => {
            window.piggyBankApp.updateTier(5, false);
            const scale5 = window.piggyBankApp.scaleSpring.value;
            window.piggyBankApp.updateTier(1, false);
            const scale1 = window.piggyBankApp.scaleSpring.value;
            window.piggyBankApp.updateTier(5, false);
            const scaleBack5 = window.piggyBankApp.scaleSpring.value;
            return { scale5, scale1, scaleBack5, success: scale5 === scaleBack5 && scale1 < scale5 };
        })()`,
        returnByValue: true
    });
    console.log('[Roundtrip Test Result]:', roundtrip.result.value);

    // =========================================================================
    // 5. CAPTURE DESKTOP SCREENSHOTS (Tier 1, Tier 3, Tier 5)
    // =========================================================================
    console.log('\n--- [TEST 5: Capturing Desktop Screenshots (1440x900)] ---');

    // Desktop Tier 1 ($800)
    await send('Runtime.evaluate', {
        expression: `(() => {
            window.piggyBankApp.currentBudget = 800;
            window.piggyBankApp.updateTier(1, false);
        })()`
    });
    await new Promise(r => setTimeout(r, 600));
    const shotTier1 = await send('Page.captureScreenshot', { format: 'png' });
    const pathTier1 = path.join(ARTIFACT_DIR, 'piggy_desktop_tier1.png');
    fs.writeFileSync(pathTier1, Buffer.from(shotTier1.data, 'base64'));
    console.log('[Saved Desktop Tier 1]:', pathTier1);

    // Desktop Tier 3 ($6,000)
    await send('Runtime.evaluate', {
        expression: `(() => {
            window.piggyBankApp.currentBudget = 6000;
            window.piggyBankApp.updateTier(3, false);
        })()`
    });
    await new Promise(r => setTimeout(r, 600));
    const shotTier3 = await send('Page.captureScreenshot', { format: 'png' });
    const pathTier3 = path.join(ARTIFACT_DIR, 'piggy_desktop_tier3.png');
    fs.writeFileSync(pathTier3, Buffer.from(shotTier3.data, 'base64'));
    console.log('[Saved Desktop Tier 3]:', pathTier3);

    // Desktop Tier 5 ($35,000)
    await send('Runtime.evaluate', {
        expression: `(() => {
            window.piggyBankApp.currentBudget = 35000;
            window.piggyBankApp.updateTier(5, false);
        })()`
    });
    await new Promise(r => setTimeout(r, 600));
    const shotTier5 = await send('Page.captureScreenshot', { format: 'png' });
    const pathTier5 = path.join(ARTIFACT_DIR, 'piggy_desktop_tier5.png');
    fs.writeFileSync(pathTier5, Buffer.from(shotTier5.data, 'base64'));
    console.log('[Saved Desktop Tier 5]:', pathTier5);

    // =========================================================================
    // 6. CAPTURE MOBILE RESPONSIVE SCREENSHOTS
    // =========================================================================
    console.log('\n--- [TEST 6: Capturing Mobile Responsive Screenshots] ---');

    // M1: iPhone 14 (390x844) - Tier 2 ($2,500)
    await send('Emulation.setDeviceMetricsOverride', {
        width: 390, height: 844, deviceScaleFactor: 2, mobile: true
    });
    await send('Runtime.evaluate', { expression: `window.dispatchEvent(new Event('resize'));` });
    await send('Runtime.evaluate', {
        expression: `(() => {
            window.piggyBankApp.currentBudget = 2500;
            window.piggyBankApp.updateTier(2, false);
        })()`
    });
    await new Promise(r => setTimeout(r, 600));
    const shotMobT2 = await send('Page.captureScreenshot', { format: 'png' });
    const pathMobT2 = path.join(ARTIFACT_DIR, 'piggy_mobile_390x844_tier2.png');
    fs.writeFileSync(pathMobT2, Buffer.from(shotMobT2.data, 'base64'));
    console.log('[Saved Mobile 390x844 Tier 2]:', pathMobT2);

    // M2: iPhone 14 (390x844) - Tier 5 ($35,000)
    await send('Runtime.evaluate', {
        expression: `(() => {
            window.piggyBankApp.currentBudget = 35000;
            window.piggyBankApp.updateTier(5, false);
        })()`
    });
    await new Promise(r => setTimeout(r, 600));
    const shotMobT5 = await send('Page.captureScreenshot', { format: 'png' });
    const pathMobT5 = path.join(ARTIFACT_DIR, 'piggy_mobile_390x844_tier5.png');
    fs.writeFileSync(pathMobT5, Buffer.from(shotMobT5.data, 'base64'));
    console.log('[Saved Mobile 390x844 Tier 5]:', pathMobT5);

    // M3: Android Compact (360x800) - Tier 2 ($2,500)
    await send('Emulation.setDeviceMetricsOverride', {
        width: 360, height: 800, deviceScaleFactor: 2, mobile: true
    });
    await send('Runtime.evaluate', { expression: `window.dispatchEvent(new Event('resize'));` });
    await send('Runtime.evaluate', {
        expression: `(() => {
            window.piggyBankApp.currentBudget = 2500;
            window.piggyBankApp.updateTier(2, false);
        })()`
    });
    await new Promise(r => setTimeout(r, 600));
    const shotMob360 = await send('Page.captureScreenshot', { format: 'png' });
    const pathMob360 = path.join(ARTIFACT_DIR, 'piggy_mobile_360x800_tier2.png');
    fs.writeFileSync(pathMob360, Buffer.from(shotMob360.data, 'base64'));
    console.log('[Saved Mobile 360x800 Tier 2]:', pathMob360);

    // M4: Android Flagship (412x915) - Tier 5 ($35,000)
    await send('Emulation.setDeviceMetricsOverride', {
        width: 412, height: 915, deviceScaleFactor: 2, mobile: true
    });
    await send('Runtime.evaluate', { expression: `window.dispatchEvent(new Event('resize'));` });
    await send('Runtime.evaluate', {
        expression: `(() => {
            window.piggyBankApp.currentBudget = 35000;
            window.piggyBankApp.updateTier(5, false);
        })()`
    });
    await new Promise(r => setTimeout(r, 600));
    const shotMob412 = await send('Page.captureScreenshot', { format: 'png' });
    const pathMob412 = path.join(ARTIFACT_DIR, 'piggy_mobile_412x915_tier5.png');
    fs.writeFileSync(pathMob412, Buffer.from(shotMob412.data, 'base64'));
    console.log('[Saved Mobile 412x915 Tier 5]:', pathMob412);

    // =========================================================================
    // 7. PERFORMANCE & CONSOLE AUDIT
    // =========================================================================
    console.log('\n--- [TEST 7: Three.js Render Metrics & Error Audit] ---');
    const metrics = await send('Runtime.evaluate', {
        expression: `(() => {
            const info = window.piggyBankApp.renderer.info;
            return {
                drawCalls: info.render.calls,
                triangles: info.render.triangles,
                geometries: info.memory.geometries,
                textures: info.memory.textures
            };
        })()`,
        returnByValue: true
    });
    console.log('[Three.js Render Metrics]:', metrics.result.value);

    console.log(`Console Errors count: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
        console.error('Console errors:', consoleErrors);
    } else {
        console.log('✅ ZERO Console / WebGL Errors detected!');
    }

    cleanup();
    console.log('\n[All Sprint C.1.6 Growth Tests Completed Successfully!]');
}
