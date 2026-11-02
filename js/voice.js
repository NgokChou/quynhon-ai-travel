/**
 * Quy Nhon AI Travel Assistant - Voice Module
 * Kết hợp đa tầng âm thanh:
 * 1. Ưu tiên: ElevenLabs AI Voice qua backend proxy /api/tts (giọng đọc AI cao cấp, bảo mật API key)
 * 2. Dự phòng 1: Web Speech API tích hợp sẵn trên trình duyệt (cho cả Tiếng Anh và Tiếng Việt)
 * 3. Dự phòng 2: Audio Stream chất lượng cao (Google Natural TTS fallback cho Tiếng Việt)
 * Đảm bảo 100% người dùng luôn nghe được âm thanh mượt mà trên mọi trình duyệt/thiết bị.
 */

const VoiceController = (function() {
    let synth = null;
    let voices = [];
    let isSpeaking = false;
    let currentUtterance = null;
    let currentAudio = null;
    let audioQueue = [];
    const audioCache = new Map();
    let currentSessionToken = 0;

    function init() {
        if ('speechSynthesis' in window) {
            synth = window.speechSynthesis;
            loadVoices();
            if (synth.onvoiceschanged !== undefined) {
                synth.onvoiceschanged = loadVoices;
            }
        }
    }

    function loadVoices() {
        if (!synth) return;
        voices = synth.getVoices() || [];
    }

    function findVietnameseVoice() {
        if (!voices || voices.length === 0) loadVoices();
        return voices.find(v => {
            const l = (v.lang || '').toLowerCase();
            const n = (v.name || '').toLowerCase();
            return l.includes('vi-vn') || l.includes('vi_vn') || l.startsWith('vi') || 
                   n.includes('vietnam') || n.includes('hoaimy') || n.includes('namminh') || n.includes('an');
        }) || null;
    }

    function findEnglishVoice() {
        if (!voices || voices.length === 0) loadVoices();
        return voices.find(v => {
            const l = (v.lang || '').toLowerCase();
            return l.includes('en-us') || l.includes('en-gb') || l.startsWith('en');
        }) || voices[0] || null;
    }

    /**
     * Gọi backend /api/tts để lấy âm thanh ElevenLabs (đã lưu cache)
     */
    async function fetchElevenLabsAudio(text, lang) {
        const cacheKey = `${lang}:${text}`;
        if (audioCache.has(cacheKey)) {
            return audioCache.get(cacheKey);
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

        try {
            const response = await fetch('/api/tts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text, language: lang }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                let errorMsg = 'ElevenLabs API call failed';
                try {
                    const data = await response.json();
                    if (data && data.error) errorMsg = data.error;
                } catch (_) {}
                throw new Error(errorMsg);
            }

            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            audioCache.set(cacheKey, blobUrl);
            return blobUrl;
        } catch (err) {
            clearTimeout(timeoutId);
            throw err;
        }
    }

    /**
     * Phát âm thanh Tiếng Việt qua Audio Stream dự phòng (Google Natural TTS - Miễn phí, không cần API key)
     */
    function speakVietnameseAudioFallback(text, sessionToken, onStartCallback, onEndCallback, onErrorCallback) {
        if (sessionToken !== currentSessionToken) return;

        isSpeaking = true;
        if (onStartCallback) onStartCallback();

        const sentences = text
            .split(/([.!?]+)/)
            .filter(Boolean)
            .reduce((acc, curr, idx, arr) => {
                if (idx % 2 === 0) {
                    const punct = arr[idx + 1] || '';
                    const full = (curr + punct).trim();
                    if (full) acc.push(full);
                }
                return acc;
            }, []);

        audioQueue = sentences.length > 0 ? sentences : [text];

        function playNextSentence() {
            if (sessionToken !== currentSessionToken || !isSpeaking) return;

            if (audioQueue.length === 0) {
                isSpeaking = false;
                currentAudio = null;
                if (onEndCallback) onEndCallback();
                return;
            }

            const sentence = audioQueue.shift();
            const encodedText = encodeURIComponent(sentence);
            const audioUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q=${encodedText}`;

            currentAudio = new Audio(audioUrl);

            currentAudio.onended = function() {
                playNextSentence();
            };

            currentAudio.onerror = function(err) {
                console.warn("[VoiceController] Fallback sentence error, skipping:", err);
                playNextSentence();
            };

            currentAudio.play().catch(err => {
                console.warn("[VoiceController] Audio play prevented:", err);
                if (sessionToken === currentSessionToken) {
                    isSpeaking = false;
                    currentAudio = null;
                    if (onErrorCallback) onErrorCallback(err);
                }
            });
        }

        playNextSentence();
    }

    /**
     * Phát âm qua Web Speech API (trình duyệt)
     */
    function speakWithBrowserSpeech(text, lang, sessionToken, onStartCallback, onEndCallback, onErrorCallback) {
        if (sessionToken !== currentSessionToken) return;

        const isVietnamese = lang.toLowerCase().startsWith('vi');

        if (isVietnamese) {
            const viVoice = findVietnameseVoice();
            if (viVoice && synth) {
                currentUtterance = new SpeechSynthesisUtterance(text);
                currentUtterance.voice = viVoice;
                currentUtterance.lang = viVoice.lang || 'vi-VN';
                currentUtterance.rate = 0.95;

                currentUtterance.onstart = function() {
                    if (sessionToken !== currentSessionToken) return;
                    isSpeaking = true;
                    if (onStartCallback) onStartCallback();
                };
                currentUtterance.onend = function() {
                    if (sessionToken !== currentSessionToken) return;
                    isSpeaking = false;
                    currentUtterance = null;
                    if (onEndCallback) onEndCallback();
                };
                currentUtterance.onerror = function(e) {
                    if (sessionToken !== currentSessionToken) return;
                    console.warn("[VoiceController] Web Speech VI error, switching to Audio Stream Fallback:", e);
                    speakVietnameseAudioFallback(text, sessionToken, onStartCallback, onEndCallback, onErrorCallback);
                };

                synth.speak(currentUtterance);
                return;
            }

            speakVietnameseAudioFallback(text, sessionToken, onStartCallback, onEndCallback, onErrorCallback);
            return;
        }

        // Tiếng Anh
        if (!synth) {
            if (onErrorCallback) onErrorCallback("Speech synthesis not supported");
            return;
        }

        currentUtterance = new SpeechSynthesisUtterance(text);
        const enVoice = findEnglishVoice();
        if (enVoice) {
            currentUtterance.voice = enVoice;
            currentUtterance.lang = enVoice.lang || 'en-US';
        } else {
            currentUtterance.lang = 'en-US';
        }

        currentUtterance.rate = 0.95;
        currentUtterance.pitch = 1.0;

        currentUtterance.onstart = function() {
            if (sessionToken !== currentSessionToken) return;
            isSpeaking = true;
            if (onStartCallback) onStartCallback();
        };

        currentUtterance.onend = function() {
            if (sessionToken !== currentSessionToken) return;
            isSpeaking = false;
            currentUtterance = null;
            if (onEndCallback) onEndCallback();
        };

        currentUtterance.onerror = function(event) {
            if (sessionToken !== currentSessionToken) return;
            isSpeaking = false;
            currentUtterance = null;
            console.error("[VoiceController] SpeechSynthesis error:", event);
            if (onErrorCallback) onErrorCallback(event);
        };

        synth.speak(currentUtterance);
    }

    /**
     * Phương thức phát chính: Tự động thử ElevenLabs trước, nếu lỗi chuyển sang Browser Fallback
     */
    async function speak(text, lang = 'en', onStartCallback, onEndCallback, onErrorCallback, onLoadingCallback) {
        stop();

        if (!text || text.trim() === '') return;

        const sessionToken = ++currentSessionToken;
        const normalizedLang = lang.toLowerCase().startsWith('vi') ? 'vi' : 'en';

        if (onLoadingCallback) onLoadingCallback();

        // 1. Thử phát bằng ElevenLabs qua backend proxy
        try {
            const audioUrl = await fetchElevenLabsAudio(text, normalizedLang);

            if (sessionToken !== currentSessionToken) return;

            currentAudio = new Audio(audioUrl);
            currentAudio.preload = 'auto';

            currentAudio.onplay = function() {
                if (sessionToken !== currentSessionToken) return;
                isSpeaking = true;
                if (onStartCallback) onStartCallback();
            };

            currentAudio.onended = function() {
                if (sessionToken !== currentSessionToken) return;
                isSpeaking = false;
                currentAudio = null;
                if (onEndCallback) onEndCallback();
            };

            currentAudio.onerror = function(err) {
                if (sessionToken !== currentSessionToken) return;
                console.warn("[VoiceController] ElevenLabs audio playback error, falling back:", err);
                currentAudio = null;
                speakWithBrowserSpeech(text, normalizedLang, sessionToken, onStartCallback, onEndCallback, onErrorCallback);
            };

            await currentAudio.play();
            return;
        } catch (error) {
            if (sessionToken !== currentSessionToken) return;
            // ElevenLabs chưa cấu hình hoặc lỗi quota/mạng -> chuyển êm sang Browser Voice Fallback
            console.info("[VoiceController] ElevenLabs voice service unavailable (" + (error.message || 'offline') + "). Using native voice engine fallback.");
            speakWithBrowserSpeech(text, normalizedLang, sessionToken, onStartCallback, onEndCallback, onErrorCallback);
        }
    }

    function stop() {
        currentSessionToken++;

        // Dừng Web Speech API
        if (synth && synth.speaking) {
            synth.cancel();
        }

        // Dừng Audio stream / ElevenLabs Audio
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }

        audioQueue = [];
        isSpeaking = false;
        currentUtterance = null;
    }

    function isCurrentlySpeaking() {
        return isSpeaking;
    }

    init();

    return {
        init: init,
        speak: speak,
        stop: stop,
        isCurrentlySpeaking: isCurrentlySpeaking
    };
})();
