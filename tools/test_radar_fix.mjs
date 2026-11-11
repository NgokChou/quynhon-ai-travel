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

const PORT = 3008;
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
    console.log(`[Test Server] Running on http://127.0.0.1:${PORT}`);
    try {
        await runRadarTests();
    } catch (err) {
        console.error('[Test Error]', err);
    } finally {
        server.close(() => {
            console.log('[Test Server] Stopped.');
            process.exit(0);
        });
    }
});

async function runRadarTests() {
    const CHROME = process.env.CHROME_PATH || 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
    const CDP_PORT = 9499;
    const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-radar-'));

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
        throw new Error('Chrome launch timeout.');
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
    await send('Emulation.setDeviceMetricsOverride', {
        width: 1440, height: 900, deviceScaleFactor: 2, mobile: false
    });

    await send('Page.navigate', { url: `http://127.0.0.1:${PORT}/prototype-map25d.html` });
    await new Promise(r => setTimeout(r, 2000));

    // Evaluate all 7 test criteria in browser
    const evalResults = await send('Runtime.evaluate', {
        expression: `(async () => {
            const inst = window.__prototypeMapInstance;
            if (!inst || !inst.radarPulse) {
                return { error: 'Instance or radarPulse not found' };
            }

            const qnPt = inst.project(109.0433, 13.9556); // Quy Nhon coords

            // CRITERION 1 & 2: Sample local position, global position, scale, and alpha over 10 ticks
            const samples = [];
            for (let i = 0; i < 10; i++) {
                await new Promise(r => setTimeout(r, 60));
                const pulse = inst.radarPulse;
                const gPos = pulse.toGlobal({ x: 0, y: 0 });
                samples.push({
                    t: i,
                    localX: Math.round(pulse.position.x * 100) / 100,
                    localY: Math.round(pulse.position.y * 100) / 100,
                    globalX: Math.round(gPos.x * 100) / 100,
                    globalY: Math.round(gPos.y * 100) / 100,
                    scaleX: Math.round(pulse.scale.x * 1000) / 1000,
                    scaleY: Math.round(pulse.scale.y * 1000) / 1000,
                    alpha: Math.round(pulse.alpha * 1000) / 1000
                });
            }

            // Check if local position is STRICTLY invariant
            const localXDiff = Math.max(...samples.map(s => s.localX)) - Math.min(...samples.map(s => s.localX));
            const localYDiff = Math.max(...samples.map(s => s.localY)) - Math.min(...samples.map(s => s.localY));
            const isLocalPosFixed = (localXDiff === 0 && localYDiff === 0);
            const isAtQuyNhon = (Math.abs(samples[0].localX - qnPt.x) < 0.01 && Math.abs(samples[0].localY - qnPt.y) < 0.01);

            // Check scale variance (must pulsate)
            const minScale = Math.min(...samples.map(s => s.scaleX));
            const maxScale = Math.max(...samples.map(s => s.scaleX));
            const isScalePulsing = (maxScale - minScale > 0.1);

            // CRITERION 3: Pan map - radar moves with Quy Nhon
            const beforePanGlobal = inst.radarPulse.toGlobal({ x: 0, y: 0 });
            inst.camera.x += 100;
            inst.camera.y += 50;
            inst.camera.targetX = inst.camera.x;
            inst.camera.targetY = inst.camera.y;
            inst.update(0);
            const afterPanGlobal = inst.radarPulse.toGlobal({ x: 0, y: 0 });
            const panMatches = (Math.abs((afterPanGlobal.x - beforePanGlobal.x) - 100) < 0.1 && Math.abs((afterPanGlobal.y - beforePanGlobal.y) - 50) < 0.1);

            // CRITERION 4: Zoom map - radar keeps relative position
            const beforeZoomGlobal = inst.radarPulse.toGlobal({ x: 0, y: 0 });
            const beforeBeaconGlobal = inst.beaconsLayer.children[1]?.toGlobal({ x: 0, y: 0 }); // Core pin
            inst.zoomIn();
            for (let i = 0; i < 15; i++) inst.update(0);
            const afterZoomGlobal = inst.radarPulse.toGlobal({ x: 0, y: 0 });
            const afterBeaconGlobal = inst.beaconsLayer.children[1]?.toGlobal({ x: 0, y: 0 });
            const distPulseToBeacon = Math.hypot(afterZoomGlobal.x - afterBeaconGlobal.x, afterZoomGlobal.y - afterBeaconGlobal.y);
            const zoomMatches = (distPulseToBeacon < 0.1);

            // CRITERION 5: Resize window
            const prevW = inst.app.screen.width;
            inst.onResize();
            const resizeNoDeviation = (inst.radarPulse.position.x === qnPt.x && inst.radarPulse.position.y === qnPt.y);

            // CRITERION 6: No duplicate pulses after re-render
            const pulseCountBefore = inst.beaconsLayer.children.filter(c => c === inst.radarPulse).length;
            inst.renderQuyNhonBeacon();
            const pulseCountAfter = inst.beaconsLayer.children.filter(c => c === inst.radarPulse).length;
            const noDuplicates = (pulseCountBefore === 1 && pulseCountAfter === 1);

            // CRITERION 7: Does not affect flightLayer or plane animation
            const flightPlaneExists = Boolean(inst.flightPlane);
            const planePos = inst.flightPlane ? { x: Math.round(inst.flightPlane.x), y: Math.round(inst.flightPlane.y) } : null;

            return {
                qnPixelCalculated: { x: Math.round(qnPt.x * 10) / 10, y: Math.round(qnPt.y * 10) / 10 },
                c1_isAtQuyNhon: isAtQuyNhon,
                c2_isLocalPosFixed: isLocalPosFixed,
                c2_scaleRange: [minScale, maxScale],
                c2_isScalePulsing: isScalePulsing,
                c3_panMatches: panMatches,
                c4_zoomMatches: zoomMatches,
                c4_distPulseToBeacon: distPulseToBeacon,
                c5_resizeNoDeviation: resizeNoDeviation,
                c6_noDuplicates: noDuplicates,
                c7_flightPlaneActive: flightPlaneExists,
                c7_planePos: planePos,
                samples: samples.slice(0, 5)
            };
        })()`,
        awaitPromise: true,
        returnByValue: true
    });

    console.log('[Task A Verification Results]:\n', JSON.stringify(evalResults.result.value, null, 2));

    // Let's capture high-resolution screenshot focused on Vietnam / Quy Nhon
    // Trigger click on Vietnam to zoom in
    await send('Runtime.evaluate', {
        expression: `(() => {
            const vnChip = document.querySelector('.country-chip[data-code="VNM"]');
            if (vnChip) vnChip.click();
            return vnChip ? 'Clicked VNM chip' : 'VNM chip not found';
        })()`,
        returnByValue: true
    });
    await new Promise(r => setTimeout(r, 1500));

    // Capture screenshot focused on Quy Nhon after fix
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const appDataArtifactsDir = 'C:\\Users\\dnccr\\.gemini\\antigravity\\brain\\0904b25c-d101-4706-8e55-8bcf40f2c083';
    const shotPath = path.join(appDataArtifactsDir, 'prototype_radar_fixed_quynhon.png');
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log('[Saved Radar Fixed Screenshot]:', shotPath);

    cleanup();
}
