#!/usr/bin/env node
/**
 * Minimal headless-Chrome preview helper (CDP over the built-in WebSocket).
 *
 *   node tools/preview.mjs --url http://127.0.0.1:3000 --out shots/x.png \
 *        [--w 1440] [--h 900] [--scale 2] [--clip "#map-section"] [--wait 1500] \
 *        [--js "document.querySelector('.vn-province').click()"]
 */

import { spawn } from 'node:child_process';
import fs from 'node:fs';
import http from 'node:http';
import os from 'node:os';
import path from 'node:path';

const argv = process.argv.slice(2);
const opt = {};
for (let i = 0; i < argv.length; i += 2) {
    if (argv[i].startsWith('--')) opt[argv[i].slice(2)] = argv[i + 1];
}

const CHROME = process.env.CHROME_PATH ||
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const PORT = 9400 + Math.floor(Math.random() * 400);
const W = Number(opt.w || 1440);
const H = Number(opt.h || 900);
const SCALE = Number(opt.scale || 2);
const WAIT = Number(opt.wait || 1500);

const profile = fs.mkdtempSync(path.join(os.tmpdir(), 'cdp-'));

function getJSON(url, method = 'GET') {
    return new Promise((resolve, reject) => {
        const req = http.request(url, { method }, res => {
            let data = '';
            res.on('data', c => (data += c));
            res.on('end', () => {
                try { resolve(JSON.parse(data)); } catch (e) { reject(new Error(data.slice(0, 200))); }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

async function waitFor(fn, timeout = 15000, step = 150) {
    const start = Date.now();
    for (;;) {
        try {
            const r = await fn();
            if (r) return r;
        } catch { /* keep waiting */ }
        if (Date.now() - start > timeout) throw new Error('timeout waiting for chrome');
        await new Promise(r => setTimeout(r, step));
    }
}

const chrome = spawn(CHROME, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${profile}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--disable-gpu',
    '--hide-scrollbars',
    '--no-proxy-server',
    '--proxy-bypass-list=*',
    '--force-color-profile=srgb',
    '--font-render-hinting=none',
    'about:blank'
], { stdio: 'ignore' });

let ws;
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
                reject(new Error(`CDP timeout: ${method}`));
            }
        }, 30000);
    });
}

function cleanup(code) {
    try { ws && ws.close(); } catch { }
    try { chrome.kill(); } catch { }
    try { fs.rmSync(profile, { recursive: true, force: true }); } catch { }
    process.exit(code);
}

(async () => {
    const version = await waitFor(() => getJSON(`http://127.0.0.1:${PORT}/json/version`));
    const target = await getJSON(`http://127.0.0.1:${PORT}/json/new?about:blank`, 'PUT');

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
        width: W, height: H, deviceScaleFactor: SCALE, mobile: false
    });

    await send('Page.addScriptToEvaluateOnNewDocument', {
        source: `window.__errs = [];
            window.addEventListener('error', e => window.__errs.push((e.message||'') + ' @' + (e.filename||'') + ':' + (e.lineno||0)));
            window.addEventListener('unhandledrejection', e => window.__errs.push('promise: ' + e.reason));`
    });

    await send('Page.navigate', { url: opt.url });
    await new Promise(r => setTimeout(r, WAIT));

    const errs = await send('Runtime.evaluate', {
        expression: 'JSON.stringify(window.__errs || [])',
        returnByValue: true
    });
    const list = JSON.parse(errs.result.value || '[]');
    if (list.length) console.log('page errors: ' + list.join(' | '));
    if (opt.js) {
        const res = await send('Runtime.evaluate', {
            expression: opt.js,
            awaitPromise: true,
            returnByValue: true
        });
        if (res.exceptionDetails) {
            console.error('JS error:', JSON.stringify(res.exceptionDetails).slice(0, 600));
        }
        await new Promise(r => setTimeout(r, 700));
    }

    let clip;
    if (opt.clip) {
        const res = await send('Runtime.evaluate', {
            expression: `(() => {
                const el = document.querySelector(${JSON.stringify(opt.clip)});
                if (!el) return null;
                const r = el.getBoundingClientRect();
                return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height };
            })()`,
            returnByValue: true
        });
        const r = res.result.value;
        if (!r) throw new Error('clip element not found: ' + opt.clip);
        clip = { x: r.x, y: r.y, width: r.w, height: r.h, scale: 1 };
    }

    const shot = await send('Page.captureScreenshot', {
        format: 'png',
        captureBeyondViewport: true,
        ...(clip ? { clip } : {})
    });

    fs.mkdirSync(path.dirname(opt.out), { recursive: true });
    fs.writeFileSync(opt.out, Buffer.from(shot.data, 'base64'));
    console.log(`saved ${opt.out}${clip ? ` (${Math.round(clip.width)}x${Math.round(clip.height)})` : ''}`);

    cleanup(0);
})().catch(err => {
    console.error(err.message);
    cleanup(1);
});
