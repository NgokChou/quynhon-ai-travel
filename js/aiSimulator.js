/**
 * Quy Nhon AI Travel Assistant - AI Simulator Module
 * Mô phỏng quá trình AI suy nghĩ, phân tích đa chặng và sinh lời giải thích (Typewriter effect).
 * Thiết kế để sau này có thể cắm trực tiếp SSE/Stream từ AI API thật (Gemini / OpenAI API).
 */

const AISimulator = (function() {
    let currentTypewriterTimer = null;

    /**
     * Mô phỏng các bước tư duy của AI trước khi trả ra kết quả
     */
    function simulateAnalysis(lang, onStepUpdate, onComplete) {
        const steps = [
            t('aiThinkingStep1', lang),
            t('aiThinkingStep2', lang),
            t('aiThinkingStep3', lang),
            t('aiThinkingStep4', lang)
        ];

        let currentStep = 0;
        const totalSteps = steps.length;
        const stepDelay = 650; // ms per step để tạo nhịp video pitching vừa phải, không quá chậm

        function executeStep() {
            if (currentStep < totalSteps) {
                const progressPercent = Math.round(((currentStep + 1) / totalSteps) * 100);
                if (onStepUpdate) {
                    onStepUpdate(steps[currentStep], progressPercent, false);
                }
                currentStep++;
                setTimeout(executeStep, stepDelay);
            } else {
                if (onStepUpdate) {
                    onStepUpdate(t('aiThinkingDone', lang), 100, true);
                }
                if (onComplete) {
                    onComplete();
                }
            }
        }

        executeStep();
    }

    /**
     * Hiệu ứng gõ chữ Typewriter cho câu trả lời tự nhiên của AI
     */
    function typewriterEffect(elementId, text, speed = 18, onFinished) {
        const targetElement = document.getElementById(elementId);
        if (!targetElement) return;

        // Clear ongoing timer
        if (currentTypewriterTimer) {
            clearInterval(currentTypewriterTimer);
            currentTypewriterTimer = null;
        }

        targetElement.innerHTML = '';
        let index = 0;

        currentTypewriterTimer = setInterval(() => {
            if (index < text.length) {
                targetElement.textContent += text.charAt(index);
                index++;
            } else {
                clearInterval(currentTypewriterTimer);
                currentTypewriterTimer = null;
                if (onFinished) onFinished();
            }
        }, speed);
    }

    function cancelTypewriter() {
        if (currentTypewriterTimer) {
            clearInterval(currentTypewriterTimer);
            currentTypewriterTimer = null;
        }
    }

    return {
        simulateAnalysis: simulateAnalysis,
        typewriterEffect: typewriterEffect,
        cancelTypewriter: cancelTypewriter
    };
})();
