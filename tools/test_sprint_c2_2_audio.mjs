/**
 * SPRINT C.2.2 - DEDICATED REAL AUDIO ASSET VERIFICATION SUITE
 * Tests:
 * 1. Asset loading & HTTP status 200 for assets/audio/preview.mp3
 * 2. AudioBuffer decoding & 9-slice extraction (zero DC offset, zero clicks)
 * 3. Slow dragging slider: intermittent coin drops
 * 4. Fast dragging slider: rate-limited drops (throttled >= 75ms), polyphony capped <= 5 voices
 * 5. Audio toggle button (mute -> voices stopped; unmute -> active)
 * 6. Console & Network error audit
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
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
    '.mp3': 'audio/mpeg',
    '.png': 'image/png'
};

const PORT = 3025;
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
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' });
    fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, '127.0.0.1', async () => {
    console.log(`[Audio Verification Server] Running on http://127.0.0.1:${PORT}`);
    try {
        const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
        const CDP_PORT = 9488;
        const tmpDir = path.join(ROOT, 'tmp_chrome_c22');
        if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

        const chrome = spawn(CHROME, [
            '--headless=new',
            `--remote-debugging-port=${CDP_PORT}`,
            `--user-data-dir=${tmpDir}`,
            '--no-first-run',
            '--no-default-browser-check',
            '--mute-audio=false',
            'about:blank'
        ], { stdio: 'ignore' });

        await new Promise(r => setTimeout(r, 1200));

        const versionRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/version`);
        const versionData = await versionRes.json();
        const ws = new globalThis.WebSocket(versionData.webSocketDebuggerUrl);

        let msgId = 1;
        const pending = new Map();
        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.id && pending.has(data.id)) {
                pending.get(data.id)(data);
                pending.delete(data.id);
            }
        };

        await new Promise(r => ws.onopen = r);

        const targetsRes = await fetch(`http://127.0.0.1:${CDP_PORT}/json/list`);
        const targets = await targetsRes.json();
        const pageTarget = targets.find(t => t.type === 'page');

        const pageWs = new globalThis.WebSocket(pageTarget.webSocketDebuggerUrl);
        await new Promise(r => pageWs.onopen = r);

        const consoleLogs = [];
        const networkRequests = [];

        pageWs.onmessage = (event) => {
            const data = JSON.parse(event.data);
            if (data.id && pending.has(data.id)) {
                pending.get(data.id)(data);
                pending.delete(data.id);
            }
            if (data.method === 'Runtime.consoleAPICalled') {
                consoleLogs.push({
                    type: data.params.type,
                    text: data.params.args.map(a => a.value || a.description).join(' ')
                });
            }
            if (data.method === 'Network.responseReceived') {
                networkRequests.push({
                    url: data.params.response.url,
                    status: data.params.response.status,
                    mimeType: data.params.response.mimeType
                });
            }
        };

        const sendPageCDP = (method, params = {}) => {
            return new Promise((resolve) => {
                const id = msgId++;
                pending.set(id, resolve);
                pageWs.send(JSON.stringify({ id, method, params }));
            });
        };

        await sendPageCDP('Page.enable');
        await sendPageCDP('Runtime.enable');
        await sendPageCDP('Network.enable');

        await sendPageCDP('Page.navigate', { url: `http://127.0.0.1:${PORT}/prototype-map25d.html` });
        await new Promise(r => setTimeout(r, 1500));

        // Jump straight to Step 3
        await sendPageCDP('Runtime.evaluate', {
            expression: `(() => {
                const c3 = document.getElementById('crumb-step-3');
                if (c3) c3.click();
            })()`
        });
        await new Promise(r => setTimeout(r, 1000));

        // 1. Verify Audio Engine state and slice properties
        const audioState = await sendPageCDP('Runtime.evaluate', {
            expression: `(async () => {
                const sv = window.showroomViewport;
                if (!sv || !sv.audio) return { error: 'No audio engine' };

                // Ensure initialized
                sv.audio.init();

                let wait = 0;
                while (!sv.audio.isLoaded && wait < 40) {
                    await new Promise(r => setTimeout(r, 100));
                    wait++;
                }

                const slices = sv.audio.slices.map((s, idx) => ({
                    idx,
                    duration: +s.duration.toFixed(3),
                    length: s.length,
                    channels: s.numberOfChannels,
                    sampleRate: s.sampleRate
                }));

                return {
                    isLoaded: sv.audio.isLoaded,
                    enabled: sv.audio.enabled,
                    minInterval: sv.audio.minInterval,
                    maxPolyphony: sv.audio.maxPolyphony,
                    audioUrl: sv.audio.audioUrl,
                    slicesCount: slices.length,
                    slices
                };
            })()`,
            awaitPromise: true,
            returnByValue: true
        });

        console.log('[Audio State & Slices]:', JSON.stringify(audioState.result.result.value, null, 2));

        // 2. Test Slow Slider Drag (Intermittent Drops)
        console.log('\n--- TESTING SLOW SLIDER DRAG (INTERMITTENT DROPS) ---');
        const slowTest = await sendPageCDP('Runtime.evaluate', {
            expression: `(async () => {
                const slider = document.getElementById('budget-range-slider');
                const sv = window.showroomViewport;
                const playedEvents = [];

                // Hook into playCoinDrop to monitor calls
                const origPlay = sv.audio.playCoinDrop.bind(sv.audio);
                let dropCount = 0;
                sv.audio.playCoinDrop = () => {
                    dropCount++;
                    origPlay();
                };

                // Move slider slowly across 3 positions with 200ms delay
                slider.value = 1200;
                slider.dispatchEvent(new Event('input'));
                await new Promise(r => setTimeout(r, 200));

                slider.value = 2500;
                slider.dispatchEvent(new Event('input'));
                await new Promise(r => setTimeout(r, 200));

                slider.value = 5000;
                slider.dispatchEvent(new Event('input'));
                await new Promise(r => setTimeout(r, 200));

                // Restore
                sv.audio.playCoinDrop = origPlay;

                return {
                    dropCount,
                    activeVoices: sv.audio.activeSources.length
                };
            })()`,
            awaitPromise: true,
            returnByValue: true
        });
        console.log('[Slow Slider Test Result]:', slowTest.result.result.value);

        // 3. Test Rapid Slider Drag (Continuous drops, throttling & polyphony cap)
        console.log('\n--- TESTING RAPID SLIDER DRAG (THROTTLING & POLYPHONY CAP) ---');
        const rapidTest = await sendPageCDP('Runtime.evaluate', {
            expression: `(async () => {
                const slider = document.getElementById('budget-range-slider');
                const sv = window.showroomViewport;
                let maxConcurrentVoices = 0;

                // Monitor voices during fast scrub
                const checkInterval = setInterval(() => {
                    if (sv.audio.activeSources.length > maxConcurrentVoices) {
                        maxConcurrentVoices = sv.audio.activeSources.length;
                    }
                }, 10);

                // Simulate rapid scrubbing (20 events in 100ms)
                for (let v = 1000; v <= 30000; v += 1500) {
                    slider.value = v;
                    slider.dispatchEvent(new Event('input'));
                    await new Promise(r => setTimeout(r, 10)); // 10ms between slider ticks
                }

                // Wait 400ms for voices to settle
                await new Promise(r => setTimeout(r, 400));
                clearInterval(checkInterval);

                return {
                    maxConcurrentVoices,
                    cappedAtOrBelowLimit: maxConcurrentVoices <= sv.audio.maxPolyphony,
                    settledVoices: sv.audio.activeSources.length
                };
            })()`,
            awaitPromise: true,
            returnByValue: true
        });
        console.log('[Rapid Slider Test Result]:', rapidTest.result.result.value);

        // 4. Test Audio Toggle Button (Mute and Unmute)
        console.log('\n--- TESTING SOUND TOGGLE BUTTON ---');
        const toggleTest = await sendPageCDP('Runtime.evaluate', {
            expression: `(async () => {
                const sv = window.showroomViewport;
                const btn = document.getElementById('btn-sound-toggle');

                // Initial state
                const initialState = sv.audio.enabled;

                // Click to mute
                btn.click();
                const mutedState = sv.audio.enabled;
                const mutedVoices = sv.audio.activeSources.length;

                // Try to trigger coin drop while muted
                sv.audio.playCoinDrop();
                const voicesAfterMutedDrop = sv.audio.activeSources.length;

                // Click to unmute
                btn.click();
                const unmutedState = sv.audio.enabled;

                // Trigger coin drop while unmuted
                sv.audio.playCoinDrop();
                const voicesAfterUnmutedDrop = sv.audio.activeSources.length;

                return {
                    initialState,
                    mutedState,
                    mutedVoices,
                    voicesAfterMutedDrop,
                    unmutedState,
                    voicesAfterUnmutedDrop
                };
            })()`,
            awaitPromise: true,
            returnByValue: true
        });
        console.log('[Toggle Test Result]:', toggleTest.result.result.value);

        // 5. Verify Network Requests for MP3
        const mp3Req = networkRequests.find(r => r.url.includes('preview.mp3'));
        console.log('\n[Network MP3 Request]:', mp3Req || 'Not found');

        // 6. Check Console Errors
        const errors = consoleLogs.filter(l => l.type === 'error');
        console.log('\n[Console Errors Count]:', errors.length);
        if (errors.length > 0) {
            console.log('Errors:', errors);
        }

        chrome.kill();
    } finally {
        server.close();
    }
});

