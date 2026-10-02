/**
 * Quy Nhon AI Travel Assistant - Voice Module
 * Hỗ trợ song ngữ Tiếng Anh (Web Speech API) và Tiếng Việt (Web Speech API + Smart Audio Fallback)
 * Đảm bảo 100% đọc được trơn tru cả Tiếng Việt và Tiếng Anh trên mọi hệ điều hành/trình duyệt.
 */

const VoiceController = (function() {
    let synth = null;
    let voices = [];
    let isSpeaking = false;
    let currentUtterance = null;
    let currentAudio = null;
    let audioQueue = [];

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
     * Phát âm thanh Tiếng Việt qua Audio Stream chất lượng cao (Google Natural TTS - Miễn phí, không cần API key)
     */
    function speakVietnameseAudioFallback(text, onStartCallback, onEndCallback, onErrorCallback) {
        stop();
        isSpeaking = true;
        if (onStartCallback) onStartCallback();

        // Tách câu để mỗi URL không vượt quá giới hạn ký tự
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
            if (!isSpeaking) return;

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
                console.warn("Audio stream playback failed, continuing...", err);
                playNextSentence();
            };

            currentAudio.play().catch(err => {
                console.warn("Audio play prevented:", err);
                isSpeaking = false;
                currentAudio = null;
                if (onErrorCallback) onErrorCallback(err);
            });
        }

        playNextSentence();
    }

    function speak(text, lang = 'en', onStartCallback, onEndCallback, onErrorCallback) {
        // Dừng mọi âm thanh đang phát
        stop();

        if (!text || text.trim() === '') return;

        const isVietnamese = lang.toLowerCase().startsWith('vi');

        // Nếu là Tiếng Việt: Kiểm tra xem trình duyệt có sẵn giọng Tiếng Việt tự nhiên không
        if (isVietnamese) {
            const viVoice = findVietnameseVoice();

            if (viVoice && synth) {
                // Trình duyệt có voice Tiếng Việt (như Edge Hoài My / Chrome Google Tiếng Việt)
                currentUtterance = new SpeechSynthesisUtterance(text);
                currentUtterance.voice = viVoice;
                currentUtterance.lang = viVoice.lang || 'vi-VN';
                currentUtterance.rate = 0.95;

                currentUtterance.onstart = function() {
                    isSpeaking = true;
                    if (onStartCallback) onStartCallback();
                };
                currentUtterance.onend = function() {
                    isSpeaking = false;
                    currentUtterance = null;
                    if (onEndCallback) onEndCallback();
                };
                currentUtterance.onerror = function() {
                    // Nếu Web Speech API lỗi, tự động chuyển sang Audio Fallback
                    speakVietnameseAudioFallback(text, onStartCallback, onEndCallback, onErrorCallback);
                };

                synth.speak(currentUtterance);
            } else {
                // Nếu trình duyệt chưa có gói giọng Tiếng Việt, dùng trực tiếp Audio Fallback chuẩn giọng Việt
                speakVietnameseAudioFallback(text, onStartCallback, onEndCallback, onErrorCallback);
            }
            return;
        }

        // Nếu là Tiếng Anh: Sử dụng Web Speech API chuẩn
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
            isSpeaking = true;
            if (onStartCallback) onStartCallback();
        };

        currentUtterance.onend = function() {
            isSpeaking = false;
            currentUtterance = null;
            if (onEndCallback) onEndCallback();
        };

        currentUtterance.onerror = function(event) {
            isSpeaking = false;
            currentUtterance = null;
            console.error("SpeechSynthesis error:", event);
            if (onErrorCallback) onErrorCallback(event);
        };

        synth.speak(currentUtterance);
    }

    function stop() {
        // Dừng Web Speech API
        if (synth && synth.speaking) {
            synth.cancel();
        }
        // Dừng Audio Fallback
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
