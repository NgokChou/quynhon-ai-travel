/**
 * Dedicated AI Pitch controller.
 * Uses the local /api/tts proxy; ElevenLabs credentials never enter the browser.
 */
(() => {
    const screen = document.querySelector('.pitch-screen');
    const orb = document.getElementById('ai-pitch-orb');
    const stopButton = document.getElementById('pitch-stop');
    const status = document.getElementById('pitch-status');
    const languageButtons = [...document.querySelectorAll('[data-language]')];

    let language = 'en';
    let isRunning = false;
    let runToken = 0;
    let currentAudio = null;
    const audioCache = new Map();
    const AI_DELAY = 16000; // 15.5 giây

    function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

    function getSegments(lang) {
        const raw = window.PITCH_SCRIPT?.[lang] ?? window.PITCH_SCRIPT?.en ?? '';
        if (Array.isArray(raw)) return raw.filter(Boolean);
        return raw ? [raw] : [];
    }

    function setStatus(message, visible = Boolean(message)) {
        status.textContent = message;
        status.classList.toggle('is-visible', visible);
    }

    function setLanguage(nextLanguage) {
        language = nextLanguage === 'vi' ? 'vi' : 'en';
        languageButtons.forEach(button => {
            button.classList.toggle('is-active', button.dataset.language === language);
        });
    }

    function stopAudio() {
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
            currentAudio = null;
        }
    }

    function stopPitch() {
        runToken += 1;
        isRunning = false;
        stopAudio();
        screen.classList.remove('is-loading', 'is-speaking');
        orb.setAttribute('aria-label', 'Start AI pitch');
        setStatus('');
    }

    async function fetchAudio(text, lang) {
        const cacheKey = `${lang}:${text}`;
        if (audioCache.has(cacheKey)) return audioCache.get(cacheKey);

        const response = await fetch('/api/tts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, language: lang })
        });

        if (!response.ok) {
            let message = 'Unable to generate AI voice.';
            try {
                const data = await response.json();
                if (data.error) message = data.error;
            } catch (_) {}
            throw new Error(message);
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        audioCache.set(cacheKey, url);
        return url;
    }

    function playAudio(url, token) {
        return new Promise((resolve, reject) => {
            if (token !== runToken || !isRunning) {
                resolve(false);
                return;
            }

            stopAudio();
            currentAudio = new Audio(url);
            currentAudio.preload = 'auto';
            currentAudio.onended = () => {
                currentAudio = null;
                resolve(true);
            };
            currentAudio.onerror = () => {
                currentAudio = null;
                reject(new Error('Audio playback failed.'));
            };
            currentAudio.play().catch(reject);
        });
    }

    async function startPitch() {
        if (isRunning) {
            stopPitch();
            return;
        }

        const segments = getSegments(language);
        if (!segments.length) {
            setStatus('No pitch script configured.', true);
            return;
        }

        stopAudio();
        isRunning = true;
        const token = ++runToken;
        screen.classList.add('is-loading');
        screen.classList.remove('is-speaking');
        orb.setAttribute('aria-label', 'Stop AI pitch');

        try {
            for (let i = 0; i < segments.length; i += 1) {
                if (token !== runToken || !isRunning) return;


await delay(AI_DELAY);

if (token !== runToken || !isRunning) return;

const audioUrl = await fetchAudio(segments[i], language);

if (token !== runToken || !isRunning) return;
screen.classList.remove('is-loading');
                screen.classList.add('is-speaking');
                setStatus('');
                await playAudio(audioUrl, token);
            }
        } catch (error) {
            if (token === runToken && isRunning) {
                console.error('[AI Pitch]', error);
                screen.classList.remove('is-loading', 'is-speaking');
                setStatus(error.message || 'Voice unavailable', true);
                setTimeout(() => {
                    if (token === runToken) setStatus('');
                }, 3500);
            }
        } finally {
            if (token === runToken) {
                isRunning = false;
                stopAudio();
                screen.classList.remove('is-loading', 'is-speaking');
                orb.setAttribute('aria-label', 'Start AI pitch');
            }
        }
    }

    orb.addEventListener('click', startPitch);
    stopButton.addEventListener('click', stopPitch);
    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const next = button.dataset.language;
            if (next !== language && isRunning) stopPitch();
            setLanguage(next);
        });
    });

    setLanguage('en');
})();
