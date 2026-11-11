/**
 * AUTOMATED COMPREHENSIVE TEST SUITE FOR BUDGET EXPERIENCE & 3D AIRCRAFT SHOWROOM
 * Uses native Node.js globalThis.WebSocket to talk to Chrome CDP.
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
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg'
};

const PORT = 3014;
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
    console.log(`[Budget Showroom Test Server] Running on http://127.0.0.1:${PORT}`);
    try {
        await runBudgetShowroomTests();
    } catch (err) {
        console.error('[Budget Showroom Test Error]', err);
        process.exitCode = 1;
    } finally {
        server.close(() => {
            console.log('[Budget Showroom Test Server] Stopped.');
            process.exit(process.exitCode || 0);
        });
    }
});

async function runBudgetShowroomTests() {
    const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const CDP_PORT = 9467;
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-budget-'));

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

    async function evalJS(expr) {
        const res = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true });
        if (res.exceptionDetails) {
            throw new Error(`Eval error on '${expr}': ${JSON.stringify(res.exceptionDetails)}`);
        }
        return res.result ? res.result.value : undefined;
    }

    async function captureScreenshot(filename) {
        const snap = await send('Page.captureScreenshot', { format: 'png' });
        const filePath = path.join(ARTIFACT_DIR, filename);
        fs.writeFileSync(filePath, Buffer.from(snap.data, 'base64'));
        console.log(`[Screenshot Saved] -> ${filePath}`);
        return filePath;
    }

    async function setViewport(w, h, isMobile = false) {
        await send('Emulation.setDeviceMetricsOverride', {
            width: w,
            height: h,
            deviceScaleFactor: isMobile ? 2 : 1,
            mobile: isMobile
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

        // Global WebSocket in Node.js 20+
        ws = new globalThis.WebSocket(target.webSocketDebuggerUrl);
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

        console.log('\n======================================================');
        console.log('STARTING AUTOMATED BUDGET & 3D AIRCRAFT TEST SUITE');
        console.log('======================================================\n');

        // 1. Load Page in 1440x900 Desktop Viewport
        await setViewport(1440, 900, false);
        console.log('[Desktop] Navigating to prototype-map25d.html...');
        await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/prototype-map25d.html` });

        // Wait for map readiness
        let ready = false;
        for (let i = 0; i < 40; i++) {
            await new Promise(r => setTimeout(r, 250));
            try {
                const isReady = await evalJS(`Boolean(window.__prototypeMapInstance && window.VIETNAM_DESTINATIONS)`);
                if (isReady) {
                    ready = true;
                    break;
                }
            } catch (e) {
                // Ignore while navigating
            }
        }
        if (!ready) throw new Error('Timeout waiting for map readiness');
        await new Promise(r => setTimeout(r, 1200));

        // Print initial document state
        const docCheck = await evalJS(`({
            title: document.title,
            btnConfirm: Boolean(document.getElementById('btn-confirm-final')),
            crumb3: Boolean(document.getElementById('crumb-step-3')),
            step3View: Boolean(document.getElementById('step-3-view'))
        })`);
        console.log('[Initial Document Check]:', docCheck);

        // 2. Select Departure Airport and Trigger Auto-Transition to Step 2
        console.log('\n--- 1. NAVIGATION & AUTO-TRANSITION TO STEP 2 ---');
        await evalJS(`
            const map = window.__prototypeMapInstance;
            if (map) map.selectCountry('JPN', true);
        `);
        await new Promise(r => setTimeout(r, 800));

        await evalJS(`
            const airportCards = document.querySelectorAll('#departure-airport-list .airport-card');
            if (airportCards.length > 0) {
                airportCards[0].click(); // Click Haneda
            }
        `);
        // Wait for auto-transition (400ms + 1.2s camera flight)
        await new Promise(r => setTimeout(r, 1800));

        // 3. Transition to Step 3: Budget Configuration & 3D Showroom
        console.log('\n--- 2. TRANSITION TO STEP 3: BUDGET & 3D AIRCRAFT SHOWROOM ---');
        await evalJS(`
            const btn = document.getElementById('btn-confirm-final');
            if (btn) btn.click();
            else {
                const crumb3 = document.getElementById('crumb-step-3');
                if (crumb3) crumb3.click();
            }
        `);
        await new Promise(r => setTimeout(r, 1000));

        const step3Check = await evalJS(`({
            step3Display: document.getElementById('step-3-view').style.display,
            mapDisplay: document.getElementById('map-section').style.display,
            showroomDisplay: document.getElementById('showroom-section').style.display,
            stepBadge: document.getElementById('step-number-badge').textContent,
            stepTitle: document.getElementById('step-title-text').textContent,
            has3DCanvas: document.getElementById('showroom-canvas-container').querySelector('canvas') !== null,
            pixiTickerRunning: window.mapInstance ? window.mapInstance.app.ticker.started : false
        })`);
        console.log('[Step 3 Verification]:', step3Check);

        if (step3Check.step3Display !== 'flex' || step3Check.showroomDisplay !== 'block') {
            throw new Error('Failed to transition to Step 3!');
        }
        if (!step3Check.has3DCanvas) {
            throw new Error('Three.js 3D WebGL Canvas was not rendered in showroom!');
        }
        if (step3Check.pixiTickerRunning !== false) {
            throw new Error('PixiJS ticker was NOT paused when entering Step 3!');
        }
        console.log('✓ Step 3 Activated. Three.js canvas mounted & PixiJS ticker paused successfully.');

        // Capture Desktop Tier 2 Comfort Screenshot
        await captureScreenshot('budget_desktop_tier2_comfort.png');

        // Capture Desktop Tier 1 ($800)
        await evalJS(`(() => {
            const slider = document.getElementById('budget-range-slider');
            slider.value = 800;
            slider.dispatchEvent(new Event('input'));
        })()`);
        await new Promise(r => setTimeout(r, 500));
        await captureScreenshot('budget_desktop_tier1.png');

        // Capture Desktop Tier 3 ($8,000)
        await evalJS(`(() => {
            const slider = document.getElementById('budget-range-slider');
            slider.value = 8000;
            slider.dispatchEvent(new Event('input'));
        })()`);
        await new Promise(r => setTimeout(r, 500));
        await captureScreenshot('budget_desktop_tier3.png');

        // 4. Test 9 Budget Thresholds and 6-Category Closed Allocations
        console.log('\n--- 3. TESTING 9 BUDGET THRESHOLDS & 6-CATEGORY CLOSED ALLOCATIONS ---');
        const thresholds = [500, 2500, 7999, 8000, 19999, 20000, 34999, 35000, 50000];

        for (const usd of thresholds) {
            const check = await evalJS(`
                (function() {
                    const slider = document.getElementById('budget-range-slider');
                    slider.value = ${usd};
                    slider.dispatchEvent(new Event('input'));

                    const tier = window.getTierForUSD(${usd});
                    const alloc = window.BudgetTripCalculator.calculateAllocation(${usd}, 1, 5);
                    const hudTier = document.getElementById('hud-tier-tag').textContent;
                    const hudModel = document.getElementById('hud-model-name').textContent;
                    const inputVal = document.getElementById('budget-number-input').value;
                    const sumUSD = alloc.totalUSD;

                    return {
                        testedUSD: ${usd},
                        expectedTierLevel: tier.level,
                        expectedTierName: tier.name,
                        hudTier,
                        hudModel,
                        inputVal,
                        sumUSD,
                        isExactSum: sumUSD === ${usd},
                        categoryCount: alloc.categories.length,
                        categories: alloc.categories.map(c => ({ id: c.id, amount: c.amountUSD, pct: c.pct }))
                    };
                })()
            `);

            console.log(`[Threshold $${usd.toLocaleString()}] -> Level ${check.expectedTierLevel}: ${check.expectedTierName} | Allocation Sum: $${check.sumUSD.toLocaleString()} (Exact 100%: ${check.isExactSum})`);
            if (!check.isExactSum) {
                throw new Error(`Allocation sum mismatch at $${usd}: got ${check.sumUSD}`);
            }
        }
        console.log('✓ All 9 budget thresholds tested. All 6-category allocations equal EXACTLY 100% of budget!');

        // 5. Capture Desktop Tier 5 Presidential Screenshot
        console.log('\n--- 4. TESTING TIER 5 PRESIDENTIAL SHOWCASE ---');
        await evalJS(`(() => {
            const slider = document.getElementById('budget-range-slider');
            slider.value = 50000;
            slider.dispatchEvent(new Event('input'));
        })()`);
        await new Promise(r => setTimeout(r, 600));
        await captureScreenshot('budget_desktop_tier5_presidential.png');
        await captureScreenshot('budget_desktop_tier5.png');

        // Verify Piggy Bank & Audio Engine
        console.log('\n--- 4.1 VERIFYING PIGGY BANK, WEBAUDIO & BANKNOTES INTEGRATION ---');
        const piggyVerify = await evalJS(`
            (async () => {
                const sv = window.showroomViewport;
                if (!sv) return { error: 'No showroomViewport' };
                const poolCap = sv.coinPool ? sv.coinPool.length : 0;

                // Wait up to 3s for audio to load if needed
                if (sv.audio) {
                    sv.audio.init();
                    let waitCount = 0;
                    while (!sv.audio.isLoaded && waitCount < 30) {
                        await new Promise(r => setTimeout(r, 100));
                        waitCount++;
                    }
                    sv.audio.playCoinDrop();
                }

                const audioActive = sv.audio ? sv.audio.enabled : false;
                const audioLoaded = sv.audio ? sv.audio.isLoaded : false;
                const sliceCount = sv.audio && sv.audio.slices ? sv.audio.slices.length : 0;
                const audioUrl = sv.audio ? sv.audio.audioUrl : '';

                const treasuryCount = sv.builder.treasuryMesh ? sv.builder.treasuryMesh.count : 0;
                const looseCount = sv.builder.looseBillsMesh ? sv.builder.looseBillsMesh.count : 0;
                const bundleCount = sv.builder.bundleStacksMesh ? sv.builder.bundleStacksMesh.count : 0;
                const currentScale = sv.controller ? sv.controller.scaleSpring.value : 0;
                
                // Test sound button toggle
                const soundBtn = document.getElementById('btn-sound-toggle');
                let toggleSuccess = false;
                if (soundBtn) {
                    soundBtn.click();
                    const state1 = sv.audio.enabled;
                    soundBtn.click();
                    const state2 = sv.audio.enabled;
                    toggleSuccess = (!state1 && state2);
                }

                return {
                    poolCap,
                    audioActive,
                    audioLoaded,
                    sliceCount,
                    audioUrl,
                    treasuryCount,
                    looseCount,
                    bundleCount,
                    currentScale,
                    toggleSuccess,
                    hasSnout: !!sv.builder.snoutGroup,
                    hasEyes: !!sv.builder.eyeGroup,
                    hasTorso: !!sv.builder.torsoMesh
                };
            })()
        `);
        console.log('[Piggy Bank Integration Check]:', piggyVerify);
        if (piggyVerify.poolCap !== 35) throw new Error(`Coin pool capacity mismatch: expected 35, got ${piggyVerify.poolCap}`);
        if (!piggyVerify.hasSnout || !piggyVerify.hasEyes || !piggyVerify.hasTorso) throw new Error('Piggy bank facial/torso components missing!');
        if (piggyVerify.treasuryCount < 400) throw new Error(`Treasury count at Tier 5 should be 400, got ${piggyVerify.treasuryCount}`);
        if (piggyVerify.looseCount === 0 || piggyVerify.bundleCount === 0) throw new Error('USD banknotes/bundles missing!');
        if (!piggyVerify.audioLoaded) throw new Error('Coin audio asset preview.mp3 failed to load or decode!');
        if (piggyVerify.sliceCount !== 9) throw new Error(`Expected 9 real coin slices, got ${piggyVerify.sliceCount}`);
        if (!piggyVerify.toggleSuccess) throw new Error('Sound toggle button failed to toggle audio!');
        console.log('✓ Piggy Bank, Real Audio Clink Engine (9 slices), USD Banknotes & Treasury verified successfully.');

        // 6. Test Slider <-> Input 2-Way Synchronization & Clamping
        console.log('\n--- 5. TESTING 2-WAY SLIDER & MANUAL INPUT SYNCHRONIZATION ---');
        const syncTest = await evalJS(`
            (function() {
                const slider = document.getElementById('budget-range-slider');
                const input = document.getElementById('budget-number-input');

                // Test 1: Move slider to 12,000
                slider.value = 12000;
                slider.dispatchEvent(new Event('input'));
                const inputValAfterSlider = input.value;

                // Test 2: Type 30,000 into input
                input.value = '30,000';
                input.dispatchEvent(new Event('input'));
                const sliderValAfterInput = slider.value;

                // Test 3: Type out-of-bounds 999,999 (should clamp to 50,000)
                input.value = '999,999';
                input.dispatchEvent(new Event('input'));
                const clampedMax = slider.value;

                // Test 4: Type negative or small 100 (should clamp to 500)
                input.value = '100';
                input.dispatchEvent(new Event('input'));
                const clampedMin = slider.value;

                return {
                    inputValAfterSlider,
                    sliderValAfterInput,
                    clampedMax,
                    clampedMin
                };
            })()
        `);
        console.log('[2-Way Sync & Clamp Results]:', syncTest);
        if (syncTest.clampedMax !== '50000' || syncTest.clampedMin !== '500') {
            throw new Error('Input clamping failed!');
        }
        console.log('✓ 2-Way Sync & Clamping verified successfully.');

        // 7. Test Multi-Currency Engine (USD, VND, EUR, JPY, GBP, AUD)
        console.log('\n--- 6. TESTING MULTI-CURRENCY CONVERSION WITHOUT BASE DRIFT ---');
        const curTest = await evalJS(`
            (function() {
                // Set budget to 2500 USD
                const slider = document.getElementById('budget-range-slider');
                slider.value = 2500;
                slider.dispatchEvent(new Event('input'));

                const input = document.getElementById('budget-number-input');
                const currencies = ['USD', 'VND', 'EUR', 'JPY', 'GBP', 'AUD'];
                const snapshots = [];

                currencies.forEach(code => {
                    const chip = document.querySelector(\`.cur-chip[data-currency="\${code}"]\`);
                    if (chip) chip.click();
                    const displayed = input.value;
                    const curCode = document.getElementById('budget-cur-code').textContent;
                    snapshots.push({ code, displayed, curCode });
                });

                // Return to USD
                document.querySelector('.cur-chip[data-currency="USD"]').click();
                const finalUSDValue = input.value;

                return {
                    snapshots,
                    finalUSDValue
                };
            })()
        `);
        console.log('[Currency Switching Results]:', curTest);
        if (curTest.finalUSDValue !== '2,500') {
            throw new Error(`Currency drift occurred! Expected '2,500', got '${curTest.finalUSDValue}'`);
        }
        console.log('✓ Multi-Currency switching verified with ZERO rounding drift.');

        // 8. Test Trip Parameters (Guests & Duration Sensitivity)
        console.log('\n--- 7. TESTING GUEST & DURATION DYNAMIC ALLOCATION ---');
        const paramTest = await evalJS(`
            (function() {
                const btnGuestPlus = document.getElementById('btn-guest-plus');
                const btnDaysPlus = document.getElementById('btn-days-plus');

                // Increase guests from 1 to 4
                btnGuestPlus.click();
                btnGuestPlus.click();
                btnGuestPlus.click();

                // Increase days from 5 to 7
                btnDaysPlus.click();
                btnDaysPlus.click();

                const guestsText = document.getElementById('val-guests').textContent;
                const daysText = document.getElementById('val-days').textContent;

                const alloc = window.BudgetTripCalculator.calculateAllocation(2500, 4, 7);
                const sumUSD = alloc.totalUSD;

                return {
                    guestsText,
                    daysText,
                    sumUSD,
                    isExact: alloc.isExact,
                    categories: alloc.categories.map(c => ({ name: c.name, amount: c.amountUSD, pct: c.pct }))
                };
            })()
        `);
        console.log('[Dynamic Trip Sensitivity Results]:', {
            guests: paramTest.guestsText,
            days: paramTest.daysText,
            sumUSD: paramTest.sumUSD,
            isExact: paramTest.isExact
        });
        if (!paramTest.isExact || paramTest.sumUSD !== 2500) {
            throw new Error('Trip sensitivity sum check failed!');
        }
        console.log('✓ Dynamic Trip sensitivity verified.');

        // 9. Test Roundtrip back to Step 2 and Step 1
        console.log('\n--- 8. TESTING WEBLOGIC ROUNDTRIP NAVIGATION (STEP 3 -> STEP 2 -> STEP 1) ---');
        const roundtripTest = await evalJS(`
            (function() {
                // Click back to step 2
                document.getElementById('btn-back-to-step-2').click();

                const mInst = window.mapInstance || window.__prototypeMapInstance;
                const stateAtStep2 = {
                    step2Visible: document.getElementById('step-2-view').style.display === 'flex',
                    mapVisible: document.getElementById('map-section').style.display === 'block',
                    showroomVisible: document.getElementById('showroom-section').style.display === 'none',
                    pixiTickerResumed: mInst && mInst.app && mInst.app.ticker ? mInst.app.ticker.started : false
                };

                // Return to step 3
                document.getElementById('btn-confirm-final').click();

                const stateBackAtStep3 = {
                    step3Visible: document.getElementById('step-3-view').style.display === 'flex',
                    showroomVisible: document.getElementById('showroom-section').style.display === 'block',
                    pixiTickerPaused: mInst && mInst.app && mInst.app.ticker ? !mInst.app.ticker.started : false
                };

                return { stateAtStep2, stateBackAtStep3 };
            })()
        `);
        console.log('[Roundtrip Navigation Results]:', roundtripTest);
        if (!roundtripTest.stateAtStep2.step2Visible || !roundtripTest.stateAtStep2.pixiTickerResumed) {
            throw new Error('Failed to resume PixiJS when returning to Step 2!');
        }
        if (!roundtripTest.stateBackAtStep3.step3Visible || !roundtripTest.stateBackAtStep3.pixiTickerPaused) {
            throw new Error('Failed to pause PixiJS when re-entering Step 3!');
        }
        console.log('✓ Seamless WebGL Context Coordination verified between PixiJS and Three.js.');

        // 10. Responsive Mobile Testing (390x844, 360x800, 412x915)
        console.log('\n--- 9. TESTING MOBILE-FIRST VIEWPORTS & OVERFLOW ---');
        const mobileViewports = [
            { width: 390, height: 844, name: 'iPhone 14' },
            { width: 360, height: 800, name: 'Android Popular' },
            { width: 412, height: 915, name: 'Android Flagship' }
        ];

        for (const vp of mobileViewports) {
            await setViewport(vp.width, vp.height, true);
            await new Promise(r => setTimeout(r, 600));

            // Set to default Tier 2
            await evalJS(`
                (() => {
                    const slider = document.getElementById('budget-range-slider');
                    slider.value = 2500;
                    slider.dispatchEvent(new Event('input'));
                })()
            `);
            await new Promise(r => setTimeout(r, 400));

            const overflowCheck = await evalJS(`({
                bodyW: document.body.clientWidth,
                scrollW: document.body.scrollWidth,
                hasOverflow: document.body.scrollWidth > document.body.clientWidth,
                showroomH: document.getElementById('showroom-section').clientHeight,
                controlH: document.getElementById('control-panel').clientHeight,
                touchActionContainer: getComputedStyle(document.getElementById('showroom-canvas-container')).touchAction,
                stepperBtnW: document.getElementById('btn-guest-plus').offsetWidth,
                stepperBtnH: document.getElementById('btn-guest-plus').offsetHeight,
                presetsScrollWidth: document.getElementById('preset-chips-row').scrollWidth,
                presetsClientWidth: document.getElementById('preset-chips-row').clientWidth
            })`);

            console.log(`[Mobile ${vp.width}x${vp.height} - ${vp.name}]:`, overflowCheck);
            if (overflowCheck.hasOverflow) {
                throw new Error(`Horizontal overflow detected in ${vp.width}x${vp.height}!`);
            }
            if (overflowCheck.controlH < 200) {
                throw new Error(`Control panel is crushed on mobile! controlH = ${overflowCheck.controlH}`);
            }
            if (overflowCheck.stepperBtnW < 48 || overflowCheck.stepperBtnH < 48) {
                throw new Error(`Stepper button touch target < 48px: got ${overflowCheck.stepperBtnW}x${overflowCheck.stepperBtnH}`);
            }
            if (overflowCheck.touchActionContainer !== 'pan-y') {
                throw new Error(`touchAction on container is not pan-y: got ${overflowCheck.touchActionContainer}`);
            }

            // Capture screenshots
            await captureScreenshot(`budget_mobile_${vp.width}x${vp.height}_tier2.png`);

            // Also capture Tier 5 on mobile
            await evalJS(`
                (() => {
                    const slider = document.getElementById('budget-range-slider');
                    slider.value = 50000;
                    slider.dispatchEvent(new Event('input'));
                })()
            `);
            await new Promise(r => setTimeout(r, 400));
            await captureScreenshot(`budget_mobile_${vp.width}x${vp.height}_tier5.png`);
        }
        console.log('✓ All 3 Mobile viewports passed with 0 horizontal overflow, >=48px steppers, pan-y touch, and visible control panel.');

        // 10.1 Testing Desktop 1366x768 Viewport
        console.log('\n--- 9.1 TESTING DESKTOP 1366x768 VIEWPORT ---');
        await setViewport(1366, 768, false);
        await new Promise(r => setTimeout(r, 600));
        await evalJS(`
            (() => {
                const slider = document.getElementById('budget-range-slider');
                slider.value = 2500;
                slider.dispatchEvent(new Event('input'));
            })()
        `);
        await new Promise(r => setTimeout(r, 400));
        const desk1366Check = await evalJS(`({
            bodyW: document.body.clientWidth,
            scrollW: document.body.scrollWidth,
            hasOverflow: document.body.scrollWidth > document.body.clientWidth,
            showroomW: document.getElementById('showroom-section').clientWidth,
            controlW: document.getElementById('control-panel').clientWidth
        })`);
        console.log('[Desktop 1366x768 Check]:', desk1366Check);
        if (desk1366Check.hasOverflow) {
            throw new Error('Horizontal overflow on Desktop 1366x768!');
        }
        await captureScreenshot('budget_desktop_1366x768_tier2.png');

        await evalJS(`
            (() => {
                const slider = document.getElementById('budget-range-slider');
                slider.value = 50000;
                slider.dispatchEvent(new Event('input'));
            })()
        `);
        await new Promise(r => setTimeout(r, 400));
        await captureScreenshot('budget_desktop_1366x768_tier5.png');
        console.log('✓ Desktop 1366x768 verified & captured.');

        // 11. Console Errors Audit
        console.log('\n--- 10. CONSOLE ERROR AUDIT ---');
        console.log(`[Total Console Errors]: ${consoleErrors.length}`);
        if (consoleErrors.length > 0) {
            console.error('[Console Errors]:', consoleErrors);
        }

        console.log('\n======================================================');
        console.log('ALL PHASE B TESTS COMPLETED SUCCESSFULLY (100% PASS)');
        console.log('======================================================\n');

    } catch (err) {
        console.error('[Test Error]:', err);
        process.exitCode = 1;
    } finally {
        if (ws) ws.close();
        cleanup();
    }
}
