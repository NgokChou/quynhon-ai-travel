/**
 * Pitch script used by the dedicated presentation screen.
 * The existing v1 pitch wording is preserved; Vietnamese is split into
 * sequential speech segments so ElevenLabs is called once per segment.
 */
const PITCH_SCRIPT = {
    en: [
        "Hi Im Q-AI, Your personal guidance asistant"
    ],
    vi: [
        "Chào mừng bạn đến với Trợ lý Du lịch Quy Nhơn AI!",
        "Tôi được thiết kế để xóa tan rào cản di chuyển quốc tế cho du khách đến với miền Trung Việt Nam.",
        "Bằng cách tối ưu hóa các chặng bay, kết hợp xe trung chuyển ven biển và lựa chọn các khu nghỉ dưỡng biệt lập, tôi biến một hành trình phức tạp thành kỳ nghỉ đáng nhớ.",
        "Hãy để tôi đồng hành cùng bạn khám phá thiên đường Quy Nhơn!"
    ]
};

if (typeof window !== 'undefined') {
    window.PITCH_SCRIPT = PITCH_SCRIPT;
}
