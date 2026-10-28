/**
 * Quy Nhon AI Travel Assistant - Local Development Static Server
 * Chạy bằng lệnh: node server.js
 * Cổng: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');
const ELEVENLABS_CONFIG = require('./js/elevenlabsConfig.js');

loadDotEnv(path.join(__dirname, '.env'));

const PORT = 3000;
const MAX_TTS_TEXT_LENGTH = 2000;
const ELEVENLABS_TTS_URL = 'https://api.elevenlabs.io/v1/text-to-speech';

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon'
};

function loadDotEnv(filePath) {
    if (!fs.existsSync(filePath)) return;

    const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) return;

        const separator = trimmed.indexOf('=');
        if (separator === -1) return;

        const key = trimmed.slice(0, separator).trim();
        let value = trimmed.slice(separator + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }

        if (!process.env[key]) process.env[key] = value;
    });
}

function sendJson(res, statusCode, payload) {
    const body = JSON.stringify(payload);
    res.writeHead(statusCode, {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'no-store'
    });
    res.end(body);
}

function getRequestBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
            if (body.length > 10000) {
                reject(new Error('Request body too large.'));
                req.destroy();
            }
        });

        req.on('end', () => {
            try {
                resolve(JSON.parse(body || '{}'));
            } catch (_) {
                reject(new Error('Invalid JSON request.'));
            }
        });

        req.on('error', reject);
    });
}

function getVoiceId(language) {
    return language === 'vi'
        ? ELEVENLABS_CONFIG.VOICE_ID_VI
        : ELEVENLABS_CONFIG.VOICE_ID_EN;
}

async function handleTextToSpeech(req, res) {
    const apiKey = process.env.ELEVENLABS_API_KEY;
    if (!apiKey) {
        console.error('[ElevenLabs] ELEVENLABS_API_KEY is missing from .env');
        sendJson(res, 503, { error: 'Voice unavailable. Configure ELEVENLABS_API_KEY in .env.' });
        return;
    }

    const body = await getRequestBody(req);
    const text = typeof body.text === 'string' ? body.text.trim() : '';
    const language = body.language === 'vi' ? 'vi' : 'en';
    const voiceId = getVoiceId(language);

    if (!text) {
        sendJson(res, 400, { error: 'Text is required.' });
        return;
    }

    if (text.length > MAX_TTS_TEXT_LENGTH) {
        sendJson(res, 400, { error: `Text is too long. Maximum ${MAX_TTS_TEXT_LENGTH} characters.` });
        return;
    }

    if (!voiceId || voiceId.startsWith('YOUR_')) {
        console.error(`[ElevenLabs] Missing ${language === 'vi' ? 'Vietnamese' : 'English'} voice ID in js/elevenlabsConfig.js`);
        sendJson(res, 503, { error: 'Voice unavailable. Configure the ElevenLabs voice ID first.' });
        return;
    }

    const response = await fetch(`${ELEVENLABS_TTS_URL}/${encodeURIComponent(voiceId)}?output_format=${encodeURIComponent(ELEVENLABS_CONFIG.OUTPUT_FORMAT)}`, {
        method: 'POST',
        headers: {
            'xi-api-key': apiKey,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg'
        },
        body: JSON.stringify({
            text,
            model_id: ELEVENLABS_CONFIG.MODEL_ID,
            language_code: language,
            voice_settings: ELEVENLABS_CONFIG.VOICE_SETTINGS
        })
    });

    if (!response.ok) {
        const providerError = await response.text();
        console.error(`[ElevenLabs] API error ${response.status}: ${providerError.slice(0, 500)}`);
        sendJson(res, 502, { error: 'Unable to generate AI voice.' });
        return;
    }

    const audioBuffer = Buffer.from(await response.arrayBuffer());
    res.writeHead(200, {
        'Content-Type': 'audio/mpeg',
        'Content-Length': audioBuffer.length,
        'Cache-Control': 'no-store'
    });
    res.end(audioBuffer);
}

const server = http.createServer(async (req, res) => {
    try {
        const requestUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

        if (requestUrl.pathname === '/api/tts') {
            if (req.method !== 'POST') {
                sendJson(res, 405, { error: 'Method not allowed.' });
                return;
            }

            await handleTextToSpeech(req, res);
            return;
        }

        let reqUrl = requestUrl.pathname;
        if (reqUrl === '/') reqUrl = '/index.html';

        const filePath = path.join(__dirname, reqUrl);

        fs.stat(filePath, (err, stats) => {
            if (err || !stats.isFile()) {
                res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
                res.end('404 Not Found');
                return;
            }

            const ext = path.extname(filePath).toLowerCase();
            const contentType = MIME_TYPES[ext] || 'application/octet-stream';

            res.writeHead(200, {
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*'
            });

            fs.createReadStream(filePath).pipe(res);
        });
    } catch (error) {
        console.error('[Server]', error.message);
        if (!res.headersSent) sendJson(res, 500, { error: 'Internal server error.' });
    }
});

server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Quy Nhon AI Travel Assistant Prototype is RUNNING!`);
    console.log(` Local URL: http://localhost:${PORT}`);
    console.log(` AI Pitch:  http://localhost:${PORT}/pitch.html`);
    console.log(` Press Ctrl + C to stop server`);
    console.log(`====================================================`);
});
