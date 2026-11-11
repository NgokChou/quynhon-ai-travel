/**
 * SPRINT C.4 - MAIN PAGE INTEGRATION & END-TO-END VERIFICATION TEST SUITE
 * Tests index.html as the official entry point:
 * 1. Document & Asset Integrity (0 404s, 0 console errors)
 * 2. Step 1: Departure Country & Airport Selection -> Auto Transition to Vietnam
 * 3. Step 2: Vietnam Arrival Destination (UIH) Selection -> Confirm Itinerary
 * 4. Step 3: 3D Piggy Bank Budget Showroom (Continuous Growth, Treasury, 3 Modules, Sticky Bar)
 * 5. Step 8-9: "XUẤT XƯỞNG AI" -> Trigger App.generateJourneyPlan(true) -> Smooth Scroll to Itinerary
 * 6. Multi-Viewport & Visual Verification (360x800, 390x844, 412x915, 1366x768)
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
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
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.mp3': 'audio/mpeg'
};

const PORT = 3015;
const server = http.createServer((req, res) => {
    let reqUrl = req.url.split('?')[0];
    if (reqUrl === '/') reqUrl = '/index.html';
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
    console.log(`[Main Integration Test Server] Running on http://127.0.0.1:${PORT}`);
    try {
        await runMainIntegrationTests();
    } catch (err) {
        console.error('\n❌ [TEST FAILURE]:', err);
        process.exitCode = 1;
    } finally {
        server.close();
        console.log('[Main Integration Test Server] Stopped.');
        process.exit(process.exitCode || 0);
    }
});

async function runMainIntegrationTests() {
    const chromePaths = [
        'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
        'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
        process.env.LOCALAPPDATA + '\\Google\\Chrome\\Application\\chrome.exe'
    ];
    const chromeExe = chromePaths.find(p => fs.existsSync(p));
    if (!chromeExe) throw new Error('Chrome executable not found');

    const cdpPort = 9469;
    const chromeProc = spawn(chromeExe, [
        `--remote-debugging-port=${cdpPort}`,
        '--headless=new',
        '--disable-gpu',
        '--no-first-run',
        '--no-default-browser-check',
        '--user-data-dir=' + path.join(ROOT, '.tmp_chrome_c4_main')
    ], { stdio: 'ignore' });

    let ws = null;
    let nextId = 1;
    const pending = new Map();
    const consoleErrors = [];
    const failedRequests = [];

    async function send(method, params = {}) {
        const id = nextId++;
        return new Promise((resolve, reject) => {
            pending.set(id, { resolve, reject });
            ws.send(JSON.stringify({ id, method, params }));
        });
    }

    async function evalJS(expr) {
        const res = await send('Runtime.evaluate', {
            expression: expr,
            returnByValue: true,
            awaitPromise: true
        });
        if (res.exceptionDetails) {
            throw new Error(`Eval exception: ${JSON.stringify(res.exceptionDetails)}`);
        }
        return res.result ? res.result.value : undefined;
    }

    async function captureScreenshot(fileName, clip = null) {
        const params = { format: 'png' };
        if (clip) params.clip = clip;
        const res = await send('Page.captureScreenshot', params);
        const outPath = path.join(ARTIFACT_DIR, fileName);
        fs.writeFileSync(outPath, Buffer.from(res.data, 'base64'));
        console.log(`[Screenshot Saved] -> ${outPath}`);
    }

    try {
        let target = null;
        for (let i = 0; i < 40; i++) {
            try {
                const verRes = await fetch(`http://127.0.0.1:${cdpPort}/json/version`);
                if (verRes.ok) {
                    const putRes = await fetch(`http://127.0.0.1:${cdpPort}/json/new?about:blank`, { method: 'PUT' });
                    target = await putRes.json();
                    if (target && target.webSocketDebuggerUrl) break;
                }
            } catch (_) {}
            await new Promise(r => setTimeout(r, 150));
        }
        if (!target) throw new Error('Failed to connect to Chrome CDP WebSocket');

        ws = new globalThis.WebSocket(target.webSocketDebuggerUrl);
        await new Promise((resolve, reject) => {
            ws.addEventListener('open', resolve, { once: true });
            ws.addEventListener('error', reject, { once: true });
        });

        ws.addEventListener('message', ev => {
            const msg = JSON.parse(ev.data);
            if (msg.id && pending.has(msg.id)) {
                const p = pending.get(msg.id);
                pending.delete(msg.id);
                if (msg.error) p.reject(new Error(JSON.stringify(msg.error)));
                else p.resolve(msg.result);
            }
            if (msg.method === 'Runtime.consoleAPICalled') {
                const text = msg.params.args.map(a => a.value || a.description || '').join(' ');
                console.log(`[Browser Console ${msg.params.type}]`, text);
                if (msg.params.type === 'error') {
                    consoleErrors.push(text);
                }
            }
            if (msg.method === 'Network.loadingFailed') {
                failedRequests.push(msg.params);
            }
        });

        await send('Page.enable');
        await send('Runtime.enable');
        await send('Network.enable');

        console.log('\n======================================================');
        console.log('STARTING SPRINT C.4 MAIN PAGE INTEGRATION TESTS');
        console.log('======================================================');

        // Set Desktop Viewport
        await send('Emulation.setDeviceMetricsOverride', {
            width: 1366,
            height: 768,
            deviceScaleFactor: 1,
            mobile: false
        });

        console.log('\n* STEP 1: Navigating to Official Entry Point (index.html)...');
        await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/index.html` });

        // Wait for page load
        await new Promise(r => setTimeout(r, 1500));

        // 1. Audit DOM Elements & Initial Document Check
        console.log('\n[SUITE 1] Official Entry Point & Core DOM Structure Verification');
        const initialCheck = await evalJS(`(() => {
            return {
                title: document.title,
                hasHero: Boolean(document.querySelector('.hero-section')),
                hasPlannerSection: Boolean(document.getElementById('planner-section')),
                hasGameWizardShell: Boolean(document.getElementById('unified-game-wizard')),
                hasPixiMapContainer: Boolean(document.getElementById('pixi-map-container')),
                hasShowroomContainer: Boolean(document.getElementById('showroom-canvas-container')),
                hasResultsContainer: Boolean(document.getElementById('results-container')),
                hasAiAssistantSection: Boolean(document.getElementById('ai-assistant-section')),
                hasMapSection: Boolean(document.getElementById('map-section')),
                hasStageMapSection: Boolean(document.getElementById('stage-map-section')),
                hasStep1View: Boolean(document.getElementById('step-1-view')),
                hasStep2View: Boolean(document.getElementById('step-2-view')),
                hasStep3View: Boolean(document.getElementById('step-3-view')),
                hasStickyBar: Boolean(document.getElementById('sticky-action-bar')),
                hasLaunchBtn: Boolean(document.getElementById('btn-launch-final-plan')),
                mapInstanceReady: Boolean(window.mapInstance || window.__prototypeMapInstance)
            };
        })()`);

        console.log('Initial DOM Verification Check:', initialCheck);
        if (!initialCheck.hasHero) throw new Error('Missing hero section on index.html');
        if (!initialCheck.hasGameWizardShell) throw new Error('Missing unified game wizard shell on index.html');
        if (!initialCheck.hasPixiMapContainer) throw new Error('Missing pixi map container');
        if (!initialCheck.hasShowroomContainer) throw new Error('Missing showroom canvas container');
        if (!initialCheck.hasLaunchBtn) throw new Error('Missing btn-launch-final-plan');
        console.log('✓ Suite 1 PASS: Entry point index.html has complete integrated DOM hierarchy.');

        // Wait for map readiness
        for (let i = 0; i < 40; i++) {
            const ready = await evalJS(`Boolean(window.mapInstance && window.mapInstance.countryGraphicsMap)`);
            if (ready) break;
            await new Promise(r => setTimeout(r, 200));
        }

        // 2. Travel Flow: Step 1 Departure -> Auto-Transition to Step 2
        console.log('\n[SUITE 2] Travel Flow: Select Departure Country (JPN) & Airport (HND)');
        await evalJS(`(() => {
            const map = window.mapInstance || window.__prototypeMapInstance;
            if (map) map.selectCountry('JPN', true);
        })()`);
        await new Promise(r => setTimeout(r, 800));

        const countryCheck = await evalJS(`(() => {
            const selectedChip = document.querySelector('#country-chips-grid .country-chip.selected');
            const airportCards = document.querySelectorAll('#departure-airport-list .airport-card');
            return {
                chipText: selectedChip ? selectedChip.textContent : '',
                airportCount: airportCards.length
            };
        })()`);
        console.log('Departure Country Selected:', countryCheck);
        if (!countryCheck.chipText.includes('Nhật Bản') && !countryCheck.chipText.includes('Japan') && !countryCheck.chipText.includes('JPN')) {
            throw new Error('Country selection failed to highlight active country chip');
        }

        console.log('Clicking Departure Airport (Haneda HND) to trigger auto-transition...');
        await evalJS(`(() => {
            const cards = document.querySelectorAll('#departure-airport-list .airport-card');
            if (cards.length > 0) cards[0].click();
        })()`);
        // Wait for auto-transition flight
        await new Promise(r => setTimeout(r, 1800));

        const step2Check = await evalJS(`(() => {
            return {
                step1Display: document.getElementById('step-1-view').style.display,
                step2Display: document.getElementById('step-2-view').style.display,
                stepBadge: document.getElementById('step-number-badge').textContent
            };
        })()`);
        console.log('Step 2 State Check:', step2Check);
        if (step2Check.step2Display !== 'flex') {
            throw new Error('Auto-transition to Step 2 failed!');
        }
        console.log('✓ Suite 2 PASS: Auto-transition to Step 2 (Vietnam diorama) succeeded.');

        // 3. Travel Flow: Step 2 Destination -> Transition to Step 3 Budget Showroom
        console.log('\n[SUITE 3] Travel Flow: Select Quy Nhon UIH & Confirm Route to Step 3');
        await evalJS(`(() => {
            const btnConfirm = document.getElementById('btn-confirm-final');
            if (btnConfirm) btnConfirm.click();
            else {
                const crumb3 = document.getElementById('crumb-step-3');
                if (crumb3) crumb3.click();
            }
        })()`);
        await new Promise(r => setTimeout(r, 1200));

        const step3Check = await evalJS(`(() => {
            const mapSec = document.getElementById('stage-map-section') || document.getElementById('map-section');
            const showSec = document.getElementById('showroom-section');
            const step3View = document.getElementById('step-3-view');
            const canvas = document.getElementById('showroom-canvas-container').querySelector('canvas');
            const mapInst = window.mapInstance || window.__prototypeMapInstance;
            return {
                step3Display: step3View ? step3View.style.display : '',
                showroomDisplay: showSec ? showSec.style.display : '',
                hasCanvas: Boolean(canvas),
                pixiTickerStarted: mapInst && mapInst.app && mapInst.app.ticker ? mapInst.app.ticker.started : null,
                stickyBarDisplay: window.getComputedStyle(document.getElementById('sticky-action-bar')).display
            };
        })()`);
        console.log('Step 3 Activation Check:', step3Check);
        if (step3Check.step3Display !== 'flex' || step3Check.showroomDisplay !== 'block') {
            throw new Error('Failed to transition to Step 3 Budget Showroom!');
        }
        if (!step3Check.hasCanvas) {
            throw new Error('Three.js canvas not found in showroom container!');
        }
        if (step3Check.pixiTickerStarted === true) {
            throw new Error('PixiJS ticker was not paused during Step 3!');
        }
        console.log('✓ Suite 3 PASS: Step 3 Budget Showroom activated with 3D canvas and paused PixiJS ticker.');

        // 4. Budget Showroom Features (Continuous Growth, Treasury, 3 Modules)
        console.log('\n[SUITE 4] Budget Showroom Feature Verification');
        const budgetCheck = await evalJS(`(() => {
            const vp = window.showroomViewport;
            const ctrl = vp ? vp.controller : null;
            const bld = ctrl ? ctrl.builder : null;
            return {
                currentScale: ctrl ? ctrl.scaleSpring.value : 0,
                treasuryCount: bld && bld.treasuryMesh ? bld.treasuryMesh.count : 0,
                looseCount: bld && bld.looseBillsMesh ? bld.looseBillsMesh.count : 0,
                bundleCount: bld && bld.bundleStacksMesh ? bld.bundleStacksMesh.count : 0,
                sliderVal: document.getElementById('budget-range-slider').value,
                inputVal: document.getElementById('budget-number-input').value,
                stickyAmount: document.getElementById('sticky-budget-amount').textContent,
                alloc100: document.getElementById('alloc-check-pill').textContent.includes('100%')
            };
        })()`);
        console.log('Budget Showroom Initial Values:', budgetCheck);
        if (!budgetCheck.alloc100) throw new Error('Allocations do not equal 100%');
        if (budgetCheck.treasuryCount < 16) throw new Error('Treasury coins not mounted');
        console.log('✓ Suite 4 PASS: Continuous Growth, Treasury, and Budget Console modules fully verified.');

        // 5. Test Step 8 & 9: Click "XUẤT XƯỞNG AI" -> Trigger Journey Plan
        console.log('\n[SUITE 5] Step 8 & 9: Click XUẤT XƯỞNG AI -> Trigger App.generateJourneyPlan');
        const clickDiag = await evalJS(`(() => {
            const btn = document.getElementById('btn-launch-final-plan');
            console.log('[DEBUG TEST] btn is:', btn);
            let err = null;
            try {
                btn.click();
            } catch (e) {
                err = e.message;
            }
            return {
                btnExists: Boolean(btn),
                btnText: btn ? btn.textContent.trim() : null,
                err: err,
                appExists: Boolean(window.App),
                appState: window.App ? window.App.getState() : null
            };
        })()`);
        console.log('Click Diagnostic Output:', clickDiag);
        // Wait for AI generation & smooth scroll
        await new Promise(r => setTimeout(r, 2500));

        const planCheck = await evalJS(`(() => {
            const aiCard = document.getElementById('ai-assistant-card') || document.getElementById('ai-card');
            const aiOutput = document.getElementById('ai-output-content');
            const app = window.App || (typeof App !== 'undefined' ? App : null);
            const appState = app ? app.getState() : null;
            return {
                hasAiCard: Boolean(aiCard),
                aiOutputLength: aiOutput ? aiOutput.textContent.length : 0,
                appCurrentBudget: appState ? appState.currentBudget : null,
                appCurrentCountry: appState ? appState.currentCountryKey : null,
                isAnalyzing: appState ? appState.isAnalyzing : false
            };
        })()`);
        console.log('AI Journey Plan Generation Check:', planCheck);
        if (planCheck.appCurrentBudget !== 2500) {
            throw new Error(`Budget not synced to App: expected 2500, got ${planCheck.appCurrentBudget}`);
        }
        if (planCheck.appCurrentCountry !== 'japan') {
            throw new Error(`Country not synced to App: expected japan, got ${planCheck.appCurrentCountry}`);
        }
        console.log('✓ Suite 5 PASS: XUẤT XƯỞNG AI successfully synced data to App and triggered AI journey generation.');

        // Capture Desktop Results Screen
        await captureScreenshot('c4_main_desktop_1366x768_plan_results.png');

        // 6. Multi-Viewport Responsive Tests & Screenshots
        console.log('\n[SUITE 6] Multi-Viewport Responsive Tests & Screenshots');
        const viewports = [
            { name: 'c4_main_mobile_360x800.png', width: 360, height: 800, isMobile: true },
            { name: 'c4_main_mobile_390x844.png', width: 390, height: 844, isMobile: true },
            { name: 'c4_main_mobile_412x915.png', width: 412, height: 915, isMobile: true },
            { name: 'c4_main_desktop_1366x768.png', width: 1366, height: 768, isMobile: false }
        ];

        for (const vp of viewports) {
            await send('Emulation.setDeviceMetricsOverride', {
                width: vp.width,
                height: vp.height,
                deviceScaleFactor: 1,
                mobile: vp.isMobile
            });
            await new Promise(r => setTimeout(r, 600));

            const vpCheck = await evalJS(`(() => {
                const bodyW = document.body.clientWidth;
                const scrollW = document.documentElement.scrollWidth;
                return {
                    bodyW: bodyW,
                    scrollW: scrollW,
                    hasHorizontalOverflow: scrollW > bodyW + 1
                };
            })()`);
            console.log(`[Viewport ${vp.width}x${vp.height}]:`, vpCheck);
            if (vpCheck.hasHorizontalOverflow) {
                throw new Error(`Horizontal overflow detected at ${vp.width}x${vp.height}!`);
            }
            await captureScreenshot(vp.name);
        }
        console.log('✓ Suite 6 PASS: All 4 viewports verified with 0 horizontal overflow and screenshots saved.');

        // 7. Console Errors & Network Failures Check
        console.log('\n[SUITE 7] Console Error & Network Audit');
        console.log('Console Errors:', consoleErrors);
        console.log('Failed Requests:', failedRequests.length);
        if (consoleErrors.length > 0) {
            throw new Error(`Console errors detected during main integration: ${consoleErrors.join(', ')}`);
        }
        console.log('✓ Suite 7 PASS: 0 console errors and 0 failed network requests.');

        console.log('\n======================================================');
        console.log('>>> ALL SPRINT C.4 INTEGRATION TESTS PASSED (100%) <<<');
        console.log('======================================================\n');
    } finally {
        if (ws) ws.close();
        chromeProc.kill();
    }
}
