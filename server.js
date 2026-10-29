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

async function callGeminiApi(apiKey, userMessage, lang, context) {
    const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash';
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

    const systemInstruction = `You are the Quy Nhon AI Travel Concierge, a helpful and knowledgeable bilingual travel assistant for Quy Nhon, Binh Dinh, Vietnam.
Current Trip Configuration:
- Departure: ${context.country || 'International traveler'}
- Budget: $${context.budget || 2000} USD
- Selected Route: ${context.route || 'fastest'}
- Interests: ${(context.interests || []).join(', ') || 'beaches, food, culture'}
- Language: ${lang === 'vi' ? 'Vietnamese (Tiếng Việt)' : 'English'}

Instructions:
1. Respond strictly in ${lang === 'vi' ? 'Vietnamese' : 'English'}.
2. Focus on practical Quy Nhon travel, transit, food (Bánh xèo tôm nhảy, Bún chả cá), attractions (Ky Co, Eo Gio, Cham towers), and trip advice.
3. Distinguish confirmed facts from estimates. Avoid fabricating exact flight schedules or fares.
4. Keep answer concise, well-structured with clear bullet points (under 180 words).`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: `${systemInstruction}\n\nUser Question: ${userMessage}` }
                        ]
                    }
                ],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 350
                }
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);
        if (!response.ok) {
            console.warn(`[Gemini API] Returned status ${response.status}`);
            return null;
        }

        const data = await response.json();
        const replyText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        return typeof replyText === 'string' && replyText.trim() ? replyText.trim() : null;
    } catch (err) {
        clearTimeout(timeout);
        console.warn(`[Gemini API] Failed or timed out: ${err.message}`);
        return null;
    }
}

function generateLocalKnowledgeReply(message, lang, context) {
    const isVi = lang === 'vi';
    const q = (message || '').toLowerCase();
    const budget = context.budget || 2000;

    if (q.includes('rain') || q.includes('mưa') || q.includes('weather') || q.includes('thời tiết') || q.includes('backup')) {
        return {
            source: 'local-knowledge',
            reply: isVi
                ? `🌧️ **Kế hoạch dự phòng ngày mưa tại Quy Nhơn:**\n• **Di sản văn hóa & Lịch sử:** Tham quan quần thể **Tháp Đôi** ngay trong nội thành hoặc **Tháp Chăm Bánh Ít** và **Bảo tàng Quang Trung** để tìm hiểu tinh hoa nhạc võ Tây Sơn.\n• **Suối khoáng nóng thư giãn:** Trải nghiệm tắm khoáng nóng tại **Hội Vân** (~35km), rất phù hợp khi tiết trời se lạnh.\n• **Ẩm thực ấm nóng:** Thưởng thức **Bánh xèo tôm nhảy** giòn rụm tại Gia Vỹ / Rau Mực, sau đó nhâm nhi tách cà phê view biển có mái che tại **Surf Bar**.`
                : `🌧️ **Rainy Day Backup Plan in Quy Nhon:**\n• **Cultural Indoor Gems:** Explore the 10th-century **Banh It Cham Towers** or **Twin Towers**, plus the **Quang Trung Museum** to discover the legendary Tay Son martial arts heritage.\n• **Wellness & Rejuvenation:** Enjoy warm mineral baths at **Hoi Van Hot Springs** (~35km from center).\n• **Comforting Local Dining:** Savor sizzling **Bánh xèo tôm nhảy** (jumping shrimp pancakes) at Gia Vy or Dien Hong, followed by sheltered sea-view coffee at **Surf Bar**.`
        };
    }

    if (q.includes('airport') || q.includes('sân bay') || q.includes('phu cat') || q.includes('phù cát') || q.includes('uih')) {
        return {
            source: 'local-knowledge',
            reply: isVi
                ? `✈️ **Di chuyển từ Sân bay Phù Cát (UIH) về Quy Nhơn:**\n• **Cự ly & Thời gian:** ~35 km về hướng Nam theo Quốc lộ 19B, thời gian di chuyển khoảng 40-45 phút.\n• **Xe buýt sân bay:** Đón ngay sảnh đến, giá vé ~50.000 VNĐ/khách, trả khách tại số 1 Nguyễn Tất Thành.\n• **Taxi / Xe riêng:** Giá trọn gói khoảng 300.000 - 380.000 VNĐ (~$12 - $15 USD) đưa đón tận sảnh khách sạn/resort.`
                : `✈️ **Phu Cat Airport (UIH) Transfer to Quy Nhon:**\n• **Distance & Time:** ~35 km south via Highway 19B, taking ~40-45 minutes.\n• **Airport Shuttle Bus:** Board at the arrival terminal exit. Cost is ~50,000 VND (~$2 USD), terminating at 1 Nguyen Tat Thanh downtown.\n• **Metered Taxi / Private Car:** ~300,000 - 380,000 VND ($12 - $15 USD) directly to your hotel or beach resort.`
        };
    }

    if (q.includes('dieu tri') || q.includes('diêu trì') || q.includes('station') || q.includes('ga tàu') || q.includes('train')) {
        return {
            source: 'local-knowledge',
            reply: isVi
                ? `🚆 **Di chuyển từ Ga Diêu Trì về Quy Nhơn:**\n• **Vị trí:** Cách trung tâm Quy Nhơn khoảng 10 km (~20 phút lái xe).\n• **Phương tiện:** Taxi túc trực sẵn trước cửa ga, giá cước khoảng 120.000 - 150.000 VNĐ. Có tuyến xe buýt số T3 kết nối thẳng vào trung tâm mỗi 30 phút.\n• **Trải nghiệm:** Tuyến đường sắt ven biển đến Diêu Trì qua đèo Cù Mông ngắm cảnh biển rất ngoạn mục.`
                : `🚆 **Dieu Tri Railway Station Transfer:**\n• **Location:** Located ~10 km west of Quy Nhon downtown (~20 minutes drive).\n• **Transport:** Frequent taxis await outside (~120,000 - 150,000 VND / $5 - $6 USD). Local bus T3 connects station to downtown every 30 mins.\n• **Scenic Note:** The coastal train arriving at Dieu Tri offers panoramic ocean views along Central Vietnam.`
        };
    }

    if (q.includes('food') || q.includes('ăn') || q.includes('dish') || q.includes('món') || q.includes('ẩm thực') || q.includes('seafood') || q.includes('hải sản')) {
        return {
            source: 'local-knowledge',
            reply: isVi
                ? `🍲 **Món ngon đặc sản không thể bỏ qua tại Quy Nhơn:**\n• **Bánh xèo tôm nhảy:** Vỏ giòn rụm cuốn bánh tráng, rau sống tươi ngon. Quán nổi tiếng: *Gia Vỹ* (14 Diên Hồng), *Rau Mực*.\n• **Bún chả cá Quy Nhơn:** Nước dùng thanh ngọt nấu từ cá thu tươi. Địa chỉ: *Ngọc Liên* (379 Nguyễn Huệ).\n• **Bánh hỏi lòng heo:** Món điểm tâm sáng truyền thống với đĩa lòng luộc nóng và tô cháo huyết thanh tao.\n• **Hải sản Nhơn Lý:** Cua huỳnh đế, mực nang hấp gừng, ốc hương nướng mỡ hành ngay ven biển Kỳ Co.`
                : `🍲 **Must-Try Quy Nhon Culinary Delicacies:**\n• **Bánh xèo tôm nhảy:** Crispy jumping shrimp pancakes wrapped in rice paper with fresh herbs. Best at *Gia Vy* or *Rau Muc*.\n• **Bún chả cá:** Savory fish cake noodle soup in clear sweet broth. Try *Ngoc Lien* (379 Nguyen Hue).\n• **Bánh hỏi lòng heo:** Traditional breakfast of fine rice noodle weaves with savory pork cuts and hot congee.\n• **Fresh Seafood at Nhon Ly:** Flower crabs, steamed ginger squid, and grilled sea urchins fresh off coastal boats.`
        };
    }

    if (q.includes('ky co') || q.includes('kỳ co') || q.includes('eo gio') || q.includes('eo gió') || q.includes('beach') || q.includes('biển')) {
        return {
            source: 'local-knowledge',
            reply: isVi
                ? `🌊 **Kinh nghiệm tham quan Kỳ Co & Eo Gió:**\n• **Kỳ Co:** Thời điểm đẹp nhất là sáng từ 8:00 đến 11:30 khi nắng vàng rọi sáng mặt biển xanh hai màu. Đi cano từ bến Nhơn Lý (~350k - 450k/người bao gồm ăn trưa hải sản) hoặc đi đường bộ bằng xe điện qua đèo.\n• **Eo Gió:** Đẹp nhất lúc hoàng hôn (16:30 - 17:30). Nhớ mang giày thể thao đi bộ trên cung đường bậc thang ven biển.`
                : `🌊 **Ky Co & Eo Gio Insider Tips:**\n• **Ky Co Beach:** Visit in the morning (8:00 - 11:30 AM) when emerald waters are calmest. Reachable by a 15-min speedboat from Nhon Ly (~350k-450k VND with lunch) or road buggy.\n• **Eo Gio Strait:** Perfect for sunset sea-cliff walks around 4:30 - 5:30 PM. Wear sneakers for the stone stairway trail.`
        };
    }

    if (q.includes('budget') || q.includes('ngân sách') || q.includes('tiết kiệm') || q.includes('cost') || q.includes('optimize') || q.includes('tối ưu')) {
        return {
            source: 'local-knowledge',
            reply: isVi
                ? `💰 **Tối ưu ngân sách cho chuyến đi $${budget.toLocaleString()}:**\n• **Vé di chuyển:** Lựa chọn tuyến **Tiết Kiệm** hoặc **Dừng Chân Ngắm Cảnh** giúp bạn tiết kiệm 15-25% chi phí chặng bay, dành thêm tiền cho trải nghiệm tour biển.\n• **Lưu trú:** Khách sạn ven biển ngay trung tâm thành phố có mức giá hợp lý hơn 30-40% so với khu nghỉ dưỡng biệt lập.\n• **Ẩm thực:** Trải nghiệm hải sản tại các quán bình dân làng chài Nhơn Lý vừa tươi rói vừa có giá chỉ bằng một nửa nhà hàng resort.`
                : `💰 **Budget Optimization for your $${budget.toLocaleString()} trip:**\n• **Transit:** Choosing **Best-Value** or **Smart Stopover** saves 15-25% on long-distance travel fares, leaving more funds for activities.\n• **Stay:** Downtown beachfront hotels offer luxury comfort at 30-40% lower cost than isolated cliffside resorts.\n• **Dining:** Enjoy fresh seafood feasts in Nhon Ly fishing village at authentic local prices.`
        };
    }

    // Default contextual answer
    return {
        source: 'local-knowledge',
        reply: isVi
            ? `🌴 **Trợ lý Du lịch Quy Nhơn:**\nChào bạn! Quy Nhơn là điểm đến biển hoang sơ tuyệt đẹp của miền Trung Việt Nam với bờ biển xanh ngọc bích, tháp Chăm ngàn năm và ẩm thực hải sản phong phú. Bạn có thể nhấn vào các gợi ý nhanh bên trên (kế hoạch ngày mưa, đưa đón sân bay Phù Cát, món ngon đặc sản, tối ưu ngân sách) hoặc đặt câu hỏi bất kỳ!`
            : `🌴 **Quy Nhon AI Travel Assistant:**\nWelcome! Quy Nhon is a pristine coastal jewel in Central Vietnam famed for emerald bays, 10th-century Cham towers, and mouthwatering seafood. Feel free to use the quick prompts above (rainy-day backup, airport transit, local delicacies, budget tips) or ask any specific question!`
    };
}

async function handleChatRequest(req, res) {
    try {
        const body = await getRequestBody(req);
        const message = typeof body.message === 'string' ? body.message.trim() : '';
        const lang = body.lang === 'vi' ? 'vi' : 'en';
        const context = (typeof body.context === 'object' && body.context !== null) ? body.context : {};

        if (!message) {
            sendJson(res, 400, { error: 'Message cannot be empty.' });
            return;
        }

        if (message.length > 1000) {
            sendJson(res, 400, { error: 'Message is too long. Max 1000 characters.' });
            return;
        }

        const apiKey = process.env.GEMINI_API_KEY;
        if (apiKey) {
            const geminiReply = await callGeminiApi(apiKey, message, lang, context);
            if (geminiReply) {
                sendJson(res, 200, { success: true, reply: geminiReply, source: 'gemini' });
                return;
            }
        }

        // Always-working local fallback
        const localResult = generateLocalKnowledgeReply(message, lang, context);
        sendJson(res, 200, { success: true, reply: localResult.reply, source: localResult.source });
    } catch (err) {
        console.error('[Chat API Error]', err.message);
        sendJson(res, 500, { error: 'An error occurred while generating the assistant reply.' });
    }
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

        if (requestUrl.pathname === '/api/chat') {
            if (req.method !== 'POST') {
                sendJson(res, 405, { error: 'Method not allowed.' });
                return;
            }

            await handleChatRequest(req, res);
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

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`\n[LỖI] Cổng ${PORT} đang bị một ứng dụng khác chiếm dụng (EADDRINUSE).`);
        console.error(`Vui lòng đóng cửa sổ server đang chạy trước đó hoặc thử lại.\n`);
    } else {
        console.error('[Server Error]', err);
    }
});

server.listen(PORT, () => {
    console.log(`====================================================`);
    console.log(` Quy Nhon AI Travel Assistant is RUNNING!`);
    console.log(` Local URL: http://localhost:${PORT}`);
    console.log(` Press Ctrl + C to stop server`);
    console.log(`====================================================`);
});
