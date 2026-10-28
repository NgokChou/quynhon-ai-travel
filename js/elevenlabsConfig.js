/**
 * ElevenLabs configuration shared by the browser and local Node server.
 * Voice IDs are public configuration values; the API key must stay in .env.
 * Change VOICE_ID_VI / VOICE_ID_EN here only.
 */
const ELEVENLABS_CONFIG = {
    VOICE_ID_VI: 'YOUR_VIETNAMESE_VOICE_ID',
    VOICE_ID_EN: 'hpp4J3VqNfWAUOO0d1Us',
    MODEL_ID: 'eleven_flash_v2_5',
    OUTPUT_FORMAT: 'mp3_44100_128',
    VOICE_SETTINGS: {
        stability: 0.5,
        similarity_boost: 0.75,
        speed: 0.95
    }
};

if (typeof module !== 'undefined' && module.exports) {
    module.exports = ELEVENLABS_CONFIG;
} else if (typeof window !== 'undefined') {
    window.ELEVENLABS_CONFIG = ELEVENLABS_CONFIG;
}
