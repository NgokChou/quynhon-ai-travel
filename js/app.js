/**
 * Quy Nhon AI Travel Assistant - Main Application Controller
 * Điều phối sự kiện, render giao diện, đồng bộ dữ liệu và các module.
 */

const App = (function() {
    // State của ứng dụng
    const state = {
        currentLang: 'en',
        currentCountryKey: 'belgium',
        isAnalyzing: false,
        activeSpeechText: ''
    };

    // DOM Elements
    const elements = {
        langSelect: document.getElementById('app-lang-select'),
        countrySelect: document.getElementById('country-select'),
        planForm: document.getElementById('journey-planner-form'),
        planBtn: document.getElementById('btn-plan-journey'),
        
        // AI Assistant Card
        aiCard: document.getElementById('ai-assistant-card'),
        aiStatusBadge: document.getElementById('ai-status-badge'),
        aiStatusText: document.getElementById('ai-status-text'),
        aiProgressBar: document.getElementById('ai-progress-bar'),
        aiProgressFill: document.getElementById('ai-progress-fill'),
        aiOutputContent: document.getElementById('ai-output-content'),
        aiSpeechControls: document.getElementById('ai-speech-controls'),
        btnSpeak: document.getElementById('btn-speak'),
        btnStop: document.getElementById('btn-stop'),
        soundWaveIndicator: document.getElementById('sound-wave-indicator'),
        
        // Results Sections
        resultsContainer: document.getElementById('results-container'),
        timelineList: document.getElementById('timeline-list'),
        hotelsGrid: document.getElementById('hotels-grid'),
        roadmapGrid: document.getElementById('roadmap-grid'),

        // Modal Preview
        hotelModal: document.getElementById('hotel-detail-modal'),
        modalBody: document.getElementById('modal-body-content'),
        modalCloseBtn: document.getElementById('modal-close-btn'),

        // AI Voice Orb Widget (Pitching Communicator)
        btnAiOrb: document.getElementById('btn-ai-orb'),
        aiOrbIcon: document.getElementById('ai-orb-icon'),
        orbStatusBadge: document.getElementById('orb-status-badge'),
        aiOrbBubble: document.getElementById('ai-orb-bubble'),
        orbBubbleText: document.getElementById('orb-bubble-text'),
        btnCloseOrbBubble: document.getElementById('btn-close-orb-bubble')
    };

    function init() {
        // 1. Populate Country Dropdown
        renderCountryOptions();

        // 2. Init Leaflet Map
        MapController.init('route-map');

        // 3. Render Static Future Features
        renderRoadmap();

        // 4. Attach Event Listeners
        bindEvents();

        // 5. Update initial translations
        updateLanguage(state.currentLang);

        // 6. Generate initial default route (Belgium -> Quy Nhon)
        generateJourneyPlan(false);
    }

    function renderCountryOptions() {
        if (!elements.countrySelect) return;
        elements.countrySelect.innerHTML = '';

        Object.keys(MOCK_COUNTRIES).forEach(key => {
            const country = MOCK_COUNTRIES[key];
            const option = document.createElement('option');
            option.value = key;
            option.textContent = `${country.flag} ${country.name[state.currentLang]} (${country.city})`;
            if (key === state.currentCountryKey) {
                option.selected = true;
            }
            elements.countrySelect.appendChild(option);
        });
    }

    function bindEvents() {
        // Thay đổi ngôn ngữ từ thanh Header hoặc Form
        if (elements.langSelect) {
            elements.langSelect.addEventListener('change', (e) => {
                updateLanguage(e.target.value);
            });
        }

        // Thay đổi quốc gia xuất phát
        if (elements.countrySelect) {
            elements.countrySelect.addEventListener('change', (e) => {
                state.currentCountryKey = e.target.value;
            });
        }

        // Bấm nút "Plan My Journey"
        if (elements.planForm) {
            elements.planForm.addEventListener('submit', (e) => {
                e.preventDefault();
                generateJourneyPlan(true);
            });
        }

        // Nút phát giọng nói AI
        if (elements.btnSpeak) {
            elements.btnSpeak.addEventListener('click', () => {
                speakAIResponse();
            });
        }

        // Nút dừng giọng nói AI
        if (elements.btnStop) {
            elements.btnStop.addEventListener('click', () => {
                stopAIResponse();
            });
        }

        // Nút đóng Modal Khách sạn
        if (elements.modalCloseBtn) {
            elements.modalCloseBtn.addEventListener('click', closeModal);
        }

        // Quả bóng AI Voice Orb (Pitching Communicator)
        if (elements.btnAiOrb) {
            elements.btnAiOrb.addEventListener('click', toggleOrbSpeech);
        }

        if (elements.btnCloseOrbBubble) {
            elements.btnCloseOrbBubble.addEventListener('click', () => {
                if (elements.aiOrbBubble) elements.aiOrbBubble.classList.add('hidden');
            });
        }

        window.addEventListener('click', (e) => {
            if (e.target === elements.hotelModal) {
                closeModal();
            }
        });
    }

    function updateLanguage(newLang) {
        state.currentLang = newLang;

        // Cập nhật giá trị select ngôn ngữ nếu chưa đồng bộ
        if (elements.langSelect && elements.langSelect.value !== newLang) {
            elements.langSelect.value = newLang;
        }

        // Cập nhật tất cả text có data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                el.textContent = t(key, newLang);
            }
        });

        // Cập nhật select quốc gia (tên quốc gia hiển thị theo ngôn ngữ mới)
        renderCountryOptions();

        // Cập nhật lại roadmap và hotels
        renderRoadmap();
        renderHotels();

        // Cập nhật nội dung hành trình hiện tại nếu đã có
        const countryData = MOCK_COUNTRIES[state.currentCountryKey];
        if (countryData) {
            state.activeSpeechText = countryData.route.aiSummary[newLang];
            // Nếu không đang trong animation gõ chữ, cập nhật text luôn
            if (!state.isAnalyzing) {
                elements.aiOutputContent.textContent = state.activeSpeechText;
            }
            renderTimeline(countryData);
            MapController.updateRoute(countryData, MOCK_DESTINATION, newLang);
        }

        // Dừng giọng nói cũ nếu đang phát để tránh lệch ngôn ngữ
        VoiceController.stop();
        resetVoiceUI();
    }

    function generateJourneyPlan(shouldScroll = true) {
        if (state.isAnalyzing) return;
        state.isAnalyzing = true;

        const countryKey = elements.countrySelect.value;
        state.currentCountryKey = countryKey;
        const countryData = MOCK_COUNTRIES[countryKey];
        const lang = state.currentLang;

        // 1. Cập nhật UI trạng thái "Đang phân tích"
        elements.planBtn.disabled = true;
        elements.planBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${t('btnPlanning', lang)}</span>`;
        elements.aiProgressBar.style.display = 'block';
        elements.aiProgressFill.style.width = '15%';
        elements.aiOutputContent.innerHTML = `<span class="ai-typing-placeholder">${t('aiThinkingStep1', lang)}</span>`;
        elements.aiSpeechControls.style.display = 'none';
        VoiceController.stop();
        resetVoiceUI();

        // Cuộn mượt xuống khu vực AI Assistant nếu người dùng bấm nút
        if (shouldScroll && elements.aiCard) {
            elements.aiCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // 2. Kích hoạt Simulator từng bước AI
        AISimulator.simulateAnalysis(
            lang,
            // Callback cập nhật từng bước
            (statusText, progressPercent, isDone) => {
                elements.aiStatusText.textContent = statusText;
                elements.aiProgressFill.style.width = `${progressPercent}%`;
            },
            // Callback hoàn thành
            () => {
                state.isAnalyzing = false;
                elements.planBtn.disabled = false;
                elements.planBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> <span>${t('btnPlan', lang)}</span>`;
                elements.aiProgressBar.style.display = 'none';

                // Lấy câu tóm tắt của AI
                state.activeSpeechText = countryData.route.aiSummary[lang];

                // Hiển thị hiệu ứng gõ chữ Typewriter
                AISimulator.typewriterEffect('ai-output-content', state.activeSpeechText, 14, () => {
                    // Hiện nút bấm âm thanh sau khi gõ chữ xong
                    elements.aiSpeechControls.style.display = 'flex';
                });

                // Cập nhật Timeline & Khách sạn & Bản đồ
                renderTimeline(countryData);
                renderHotels();
                MapController.updateRoute(countryData, MOCK_DESTINATION, lang);

                // Hiển thị container kết quả
                if (elements.resultsContainer) {
                    elements.resultsContainer.classList.remove('hidden');
                }
            }
        );
    }

    function renderTimeline(countryData) {
        if (!elements.timelineList) return;
        elements.timelineList.innerHTML = '';

        const lang = state.currentLang;
        const steps = countryData.route.steps;

        steps.forEach((step, index) => {
            const stepCard = document.createElement('div');
            stepCard.className = `timeline-step-card step-${step.type}`;

            let tagLabel = '';
            if (step.type === 'flight' || step.type === 'domestic-flight') tagLabel = t('stepFlightTag', lang);
            else if (step.type === 'transfer') tagLabel = t('stepTransferTag', lang);
            else if (step.type === 'hotel') tagLabel = t('stepHotelTag', lang);
            else if (step.type === 'explore') tagLabel = t('stepExploreTag', lang);

            stepCard.innerHTML = `
                <div class="step-indicator">
                    <div class="step-number">${index + 1}</div>
                    <div class="step-icon"><i class="fa-solid fa-${step.icon}"></i></div>
                </div>
                <div class="step-content">
                    <div class="step-header">
                        <span class="step-tag tag-${step.type}">${tagLabel}</span>
                        <h4 class="step-title">${step.title[lang]}</h4>
                    </div>
                    <div class="step-locations">
                        <span class="loc-from"><i class="fa-regular fa-circle-dot"></i> ${step.from}</span>
                        <span class="loc-arrow"><i class="fa-solid fa-arrow-right-long"></i></span>
                        <span class="loc-to"><i class="fa-solid fa-location-dot"></i> ${step.to}</span>
                    </div>
                    <p class="step-subinfo">${step.subInfo[lang]}</p>
                    <div class="step-highlight">
                        <i class="fa-solid fa-lightbulb"></i> <span>${step.highlight[lang]}</span>
                    </div>
                </div>
            `;
            elements.timelineList.appendChild(stepCard);
        });
    }

    function renderHotels() {
        if (!elements.hotelsGrid) return;
        elements.hotelsGrid.innerHTML = '';

        const lang = state.currentLang;

        MOCK_HOTELS.forEach(hotel => {
            const card = document.createElement('div');
            card.className = 'hotel-card glass-card';
            card.innerHTML = `
                <div class="hotel-image-wrapper">
                    <img src="${hotel.image}" alt="${hotel.name}" loading="lazy" />
                    <span class="hotel-badge">${hotel.badge[lang]}</span>
                    <span class="hotel-mock-tag">MOCK DATA</span>
                </div>
                <div class="hotel-content">
                    <div class="hotel-rating">
                        <span class="stars"><i class="fa-solid fa-star"></i> ${hotel.rating}</span>
                        <span class="reviews">(${hotel.reviewsCount} ${lang === 'vi' ? 'đánh giá' : 'reviews'})</span>
                    </div>
                    <h4 class="hotel-name">${hotel.name}</h4>
                    <p class="hotel-location"><i class="fa-solid fa-location-dot"></i> ${hotel.location}</p>
                    <p class="hotel-desc">${hotel.description[lang]}</p>
                    <div class="hotel-features">
                        ${hotel.features[lang].slice(0, 2).map(f => `<span class="feature-tag"><i class="fa-solid fa-check"></i> ${f}</span>`).join('')}
                    </div>
                    <div class="hotel-footer">
                        <div class="hotel-price">
                            <span class="price-val">${hotel.priceMock}</span>
                            <span class="price-unit">${hotel.priceUnit[lang]}</span>
                        </div>
                        <button class="btn-hotel-detail" onclick="App.openHotelModal('${hotel.id}')">
                            ${t('btnViewHotel', lang)} <i class="fa-solid fa-chevron-right"></i>
                        </button>
                    </div>
                </div>
            `;
            elements.hotelsGrid.appendChild(card);
        });
    }

    function renderRoadmap() {
        if (!elements.roadmapGrid) return;
        elements.roadmapGrid.innerHTML = '';

        const lang = state.currentLang;

        MOCK_FUTURE_FEATURES.forEach(feature => {
            const card = document.createElement('div');
            card.className = 'roadmap-card';
            card.innerHTML = `
                <div class="roadmap-icon">
                    <i class="fa-solid fa-${feature.icon}"></i>
                </div>
                <div class="roadmap-info">
                    <h4>${feature.title[lang]}</h4>
                    <p>${feature.desc[lang]}</p>
                </div>
            `;
            elements.roadmapGrid.appendChild(card);
        });
    }

    // Xử lý Voice AI (Speak & Stop)
    function speakAIResponse() {
        if (!state.activeSpeechText) return;

        VoiceController.speak(
            state.activeSpeechText,
            state.currentLang,
            // onStart
            () => {
                if (elements.soundWaveIndicator) elements.soundWaveIndicator.classList.remove('hidden');
                if (elements.btnSpeak) elements.btnSpeak.classList.add('hidden');
                if (elements.btnStop) elements.btnStop.classList.remove('hidden');
            },
            // onEnd
            () => {
                resetVoiceUI();
            },
            // onError
            (err) => {
                console.warn("Speech error:", err);
                resetVoiceUI();
            }
        );
    }

    function stopAIResponse() {
        VoiceController.stop();
        resetVoiceUI();
    }

    function resetVoiceUI() {
        if (elements.soundWaveIndicator) elements.soundWaveIndicator.classList.add('hidden');
        if (elements.btnSpeak) elements.btnSpeak.classList.remove('hidden');
        if (elements.btnStop) elements.btnStop.classList.add('hidden');
        setOrbState(false);
    }

    // ==============================================================
    // Logic Quả bóng AI Voice Orb (Pitching Communicator)
    // ==============================================================
    let isOrbSpeaking = false;

    function toggleOrbSpeech() {
        if (isOrbSpeaking) {
            VoiceController.stop();
            setOrbState(false);
            return;
        }

        // Dừng các âm thanh khác nếu đang phát
        VoiceController.stop();
        resetVoiceUI();

        // Lấy kịch bản chuẩn bị sẵn từ js/pitchScript.js theo ngôn ngữ hiện tại
        const lang = state.currentLang;
        const scriptText = (typeof PITCH_SCRIPT !== 'undefined' && PITCH_SCRIPT[lang])
            ? PITCH_SCRIPT[lang]
            : (typeof PITCH_SCRIPT !== 'undefined' ? PITCH_SCRIPT.en : state.activeSpeechText);

        if (!scriptText) return;

        // Cập nhật phụ đề nổi trên quả bóng
        if (elements.orbBubbleText) {
            elements.orbBubbleText.textContent = scriptText;
        }
        if (elements.aiOrbBubble) {
            elements.aiOrbBubble.classList.remove('hidden');
        }

        // Kích hoạt quả bóng rung rung & phát âm thanh
        setOrbState(true);

        VoiceController.speak(
            scriptText,
            lang,
            // onStart
            () => {
                setOrbState(true);
            },
            // onEnd
            () => {
                setOrbState(false);
            },
            // onError
            (err) => {
                console.warn("Orb speech error:", err);
                setOrbState(false);
            }
        );
    }

    function setOrbState(speaking) {
        isOrbSpeaking = speaking;
        if (!elements.btnAiOrb) return;

        if (speaking) {
            elements.btnAiOrb.classList.add('is-speaking');
            if (elements.aiOrbIcon) elements.aiOrbIcon.className = 'fa-solid fa-waveform-lines fa-fade';
            if (elements.orbStatusBadge) elements.orbStatusBadge.textContent = 'Speaking...';
        } else {
            elements.btnAiOrb.classList.remove('is-speaking');
            if (elements.aiOrbIcon) elements.aiOrbIcon.className = 'fa-solid fa-microphone-lines';
            if (elements.orbStatusBadge) elements.orbStatusBadge.textContent = 'AI Pitch';
        }
    }

    // Modal Xem chi tiết khách sạn (Mock Preview)
    function openHotelModal(hotelId) {
        const hotel = MOCK_HOTELS.find(h => h.id === hotelId);
        if (!hotel || !elements.hotelModal || !elements.modalBody) return;

        const lang = state.currentLang;

        elements.modalBody.innerHTML = `
            <div class="modal-hotel-header">
                <img src="${hotel.image}" alt="${hotel.name}" class="modal-hotel-banner" />
                <div class="modal-banner-overlay">
                    <span class="hotel-badge">${hotel.badge[lang]}</span>
                    <h3>${hotel.name}</h3>
                    <p><i class="fa-solid fa-location-dot"></i> ${hotel.location}</p>
                </div>
            </div>
            <div class="modal-hotel-details">
                <div class="modal-notice-mock">
                    <i class="fa-solid fa-circle-info"></i>
                    <span>${t('mockHotelNotice', lang)}</span>
                </div>
                <p class="modal-desc">${hotel.description[lang]}</p>
                <h5>${lang === 'vi' ? 'Tiện ích nổi bật' : 'Key Amenities'}</h5>
                <ul class="modal-feature-list">
                    ${hotel.features[lang].map(f => `<li><i class="fa-solid fa-circle-check"></i> ${f}</li>`).join('')}
                </ul>
                <div class="modal-price-box">
                    <div>
                        <small>${lang === 'vi' ? 'Giá mô phỏng' : 'Simulated Fare'}</small>
                        <div class="price-val">${hotel.priceMock} ${hotel.priceUnit[lang]}</div>
                    </div>
                    <button class="btn-disabled-booking" disabled>
                        <i class="fa-solid fa-lock"></i> ${lang === 'vi' ? 'Booking API (Giai đoạn tiếp theo)' : 'Booking API (Next Phase)'}
                    </button>
                </div>
            </div>
        `;

        elements.hotelModal.classList.remove('hidden');
    }

    function closeModal() {
        if (elements.hotelModal) {
            elements.hotelModal.classList.add('hidden');
        }
    }

    // Khởi chạy khi DOM sẵn sàng
    document.addEventListener('DOMContentLoaded', init);

    return {
        init: init,
        openHotelModal: openHotelModal,
        closeModal: closeModal,
        getState: function() { return state; }
    };
})();
