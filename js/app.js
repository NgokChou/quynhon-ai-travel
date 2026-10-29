/**
 * Quy Nhon AI Travel Assistant - Main Application Controller
 * Điều phối sự kiện, kết nối dữ liệu đa phương thức, sinh nội dung động và bản đồ.
 */

const App = (function() {
    // State toàn cục của ứng dụng
    const state = {
        currentLang: 'en',
        currentCountryKey: 'belgium',
        currentBudget: 2000,
        selectedRouteType: 'fastest', // 'fastest' | 'best-value' | 'smart-stopover'
        selectedInterests: ['beaches', 'food', 'culture'],
        isAnalyzing: false,
        activeSpeechText: ''
    };

    // DOM Elements cache
    const elements = {
        langSelect: document.getElementById('app-lang-select'),
        countrySelect: document.getElementById('country-select'),
        budgetFormGroup: document.getElementById('budget-form-group'),
        budgetSelect: document.getElementById('budget-select'),
        customBudgetContainer: document.getElementById('custom-budget-container'),
        customBudgetInput: document.getElementById('custom-budget-input'),
        planForm: document.getElementById('journey-planner-form'),
        planBtn: document.getElementById('btn-plan-journey'),
        btnGenerateItinerary: document.getElementById('btn-generate-itinerary'),
        
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

        // Destination Elements & Modal
        destinationSelect: document.getElementById('destination-select'),
        btnExploreDestination: document.getElementById('btn-explore-destination'),
        destModal: document.getElementById('destination-detail-modal'),
        destModalBody: document.getElementById('dest-modal-body-content'),
        destModalCloseBtn: document.getElementById('dest-modal-close-btn'),

        // Feature 1: Budget Allocation
        budgetAllocationContainer: document.getElementById('budget-allocation-container'),

        // Feature 2: Weather Elements
        weatherWidget: document.getElementById('quynhon-weather-widget'),
        weatherStatusLabel: document.getElementById('weather-status-label'),
        weatherStatusBadge: document.getElementById('weather-data-status'),
        weatherMainIcon: document.getElementById('weather-main-icon'),
        weatherTempVal: document.getElementById('weather-temp-val'),
        weatherWindVal: document.getElementById('weather-wind-val'),
        weatherHumidityVal: document.getElementById('weather-humidity-val'),
        weatherSeasonalTip: document.getElementById('weather-seasonal-tip'),
        navWeatherPill: document.getElementById('nav-weather-pill'),
        navWeatherTemp: document.getElementById('nav-weather-temp'),
        navWeatherIcon: document.getElementById('nav-weather-icon'),
        navWeatherBadge: document.getElementById('nav-weather-badge'),

        // Feature 3: AI Concierge Chat
        conciergeToggle: document.getElementById('ai-concierge-toggle'),
        conciergeDrawer: document.getElementById('ai-concierge-drawer'),
        conciergeCloseBtn: document.getElementById('concierge-close-btn'),
        conciergeInputForm: document.getElementById('concierge-input-form'),
        conciergeInputText: document.getElementById('concierge-input-text'),
        conciergeSubmitBtn: document.getElementById('concierge-submit-btn'),
        conciergeMessagesList: document.getElementById('concierge-messages-list'),

        // Feature 4: Digital Trip Pass Modal
        btnOpenTripPass: document.getElementById('btn-open-trip-pass'),
        tripPassModal: document.getElementById('trip-pass-modal'),
        tripPassContent: document.getElementById('trip-pass-modal-content'),
        tripPassCloseBtn: document.getElementById('trip-pass-close-btn')
    };

    function init() {
        // 0. Khôi phục trạng thái từ URL query parameters (Feature 4A)
        hydrateStateFromUrl();

        // 1. Lấy sở thích từ các checkbox
        state.selectedInterests = getSelectedPreferences();

        // 2. Render danh sách quốc gia vào dropdown
        renderCountryOptions();

        // 3. Khởi tạo bản đồ tương tác Leaflet
        MapController.init('route-map');

        // 4. Render Roadmap và Hotels
        renderRoadmap();
        renderHotels();

        // 5. Gắn các sự kiện tương tác
        bindEvents();

        // 6. Cập nhật ngân sách
        if (elements.budgetFormGroup) {
            elements.budgetFormGroup.style.display = 'block';
        }
        if (elements.budgetSelect) {
            const hasOption = Array.from(elements.budgetSelect.options).some(o => o.value === String(state.currentBudget));
            if (hasOption) {
                elements.budgetSelect.value = String(state.currentBudget);
            } else {
                elements.budgetSelect.value = 'custom';
                if (elements.customBudgetContainer) elements.customBudgetContainer.style.display = 'block';
                if (elements.customBudgetInput) elements.customBudgetInput.value = state.currentBudget;
            }
        }

        // 7. Đồng bộ ngôn ngữ ban đầu
        updateLanguage(state.currentLang);

        // 8. Tạo kế hoạch lộ trình mặc định ban đầu
        generateJourneyPlan(false);

        // 9. Lấy dữ liệu thời tiết trực tiếp từ Open-Meteo (Feature 2)
        fetchQuyNhonWeather();

        // 10. Khởi tạo Trợ lý AI Concierge (Feature 3)
        initConciergeChat();

        // 11. Render phân bổ ngân sách (Feature 1C)
        renderBudgetAllocation();

        // 12. Đồng bộ URL ban đầu (Feature 4A)
        syncUrlState();
    }

    /**
     * Lấy mảng các sở thích được người dùng tích chọn
     */
    function getSelectedPreferences() {
        const checkboxes = document.querySelectorAll('input[name="travel-interest"]:checked');
        const selected = [];
        checkboxes.forEach(cb => {
            if (cb.value) selected.push(cb.value);
        });
        return selected.length > 0 ? selected : ['beaches', 'food'];
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
        // Thay đổi ngôn ngữ qua nút bấm hoặc select box
        document.querySelectorAll('.lang-btn, [data-lang]').forEach(btn => {
            btn.addEventListener('click', () => {
                const targetLang = btn.getAttribute('data-lang') || (btn.textContent.trim().toUpperCase() === 'VI' ? 'vi' : 'en');
                if (targetLang && targetLang !== state.currentLang) {
                    updateLanguage(targetLang);
                }
            });
        });

        if (elements.langSelect) {
            elements.langSelect.addEventListener('change', (e) => {
                const targetLang = e.target.value;
                if (targetLang && targetLang !== state.currentLang) {
                    updateLanguage(targetLang);
                }
            });
        }

        const formLangSelect = document.getElementById('form-lang-select');
        if (formLangSelect) {
            formLangSelect.addEventListener('change', (e) => {
                const targetLang = e.target.value;
                if (targetLang && targetLang !== state.currentLang) {
                    updateLanguage(targetLang);
                }
            });
        }

        // Thay đổi quốc gia xuất phát
        if (elements.countrySelect) {
            elements.countrySelect.addEventListener('change', (e) => {
                state.currentCountryKey = e.target.value;
                if (elements.budgetFormGroup) {
                    elements.budgetFormGroup.style.display = 'block';
                }
                onParametersChanged();
            });
        }

        // Thay đổi ngân sách từ dropdown
        if (elements.budgetSelect) {
            elements.budgetSelect.addEventListener('change', (e) => {
                const value = e.target.value;
                if (value === 'custom') {
                    if (elements.customBudgetContainer) {
                        elements.customBudgetContainer.style.display = 'block';
                    }
                    if (elements.customBudgetInput) {
                        elements.customBudgetInput.focus();
                    }
                    return;
                }

                if (elements.customBudgetContainer) {
                    elements.customBudgetContainer.style.display = 'none';
                }

                const num = Number(value);
                if (num > 0) {
                    state.currentBudget = num;
                    onParametersChanged();
                }
            });
        }

        // Nhập ngân sách tùy chỉnh
        if (elements.customBudgetInput) {
            elements.customBudgetInput.addEventListener('input', (e) => {
                const value = Number(e.target.value);
                if (value > 0) {
                    state.currentBudget = value;
                    onParametersChanged();
                }
            });
        }

        // Thay đổi các checkbox sở thích (Preferences)
        const interestCheckboxes = document.querySelectorAll('input[name="travel-interest"]');
        interestCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                state.selectedInterests = getSelectedPreferences();
                onParametersChanged();

                // Nếu khu vực lịch trình 3 ngày đang mở, tự động cập nhật lại lịch trình
                const section = document.getElementById('generated-itinerary-section');
                if (section && section.style.display !== 'none') {
                    renderItineraryContent();
                }
            });
        });

        // Bấm nút submit form "Plan My Journey"
        if (elements.planForm) {
            elements.planForm.addEventListener('submit', (e) => {
                e.preventDefault();
                generateJourneyPlan(true);
            });
        }

        // Nút "Generate My 3-Day Journey"
        if (elements.btnGenerateItinerary) {
            elements.btnGenerateItinerary.addEventListener('click', generateItinerary);
        }

        // Nút mở Digital Trip Pass (Feature 4)
        if (elements.btnOpenTripPass) {
            elements.btnOpenTripPass.addEventListener('click', openTripPassModal);
        }

        if (elements.tripPassCloseBtn) {
            elements.tripPassCloseBtn.addEventListener('click', closeTripPassModal);
        }

        // Nút phát âm thanh giọng nói AI
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

        // Nút mở modal khám phá điểm đến Quy Nhơn (Môi trường, Cảnh quan & Đánh giá)
        if (elements.btnExploreDestination) {
            elements.btnExploreDestination.addEventListener('click', () => {
                openDestinationModal('environment');
            });
        }

        if (elements.destinationSelect) {
            elements.destinationSelect.addEventListener('change', () => {
                openDestinationModal('environment');
            });
        }

        if (elements.destModalCloseBtn) {
            elements.destModalCloseBtn.addEventListener('click', closeDestinationModal);
        }

        // Nút đóng Modal Khách sạn
        if (elements.modalCloseBtn) {
            elements.modalCloseBtn.addEventListener('click', closeModal);
        }

        window.addEventListener('click', (e) => {
            if (e.target === elements.hotelModal) {
                closeModal();
            }
            if (e.target === elements.destModal) {
                closeDestinationModal();
            }
            if (e.target === elements.tripPassModal) {
                closeTripPassModal();
            }
        });

        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeModal();
                closeDestinationModal();
                closeTripPassModal();
            }
        });
    }

    /**
     * Tự động làm mới câu tóm tắt, timeline, ngân sách và URL khi người dùng thay đổi thông số
     */
    function onParametersChanged() {
        if (state.isAnalyzing) return;
        const countryData = MOCK_COUNTRIES[state.currentCountryKey];
        if (!countryData) return;

        // Sinh lại câu tóm tắt bằng JavaScript thuần
        state.activeSpeechText = generateAISummary({
            countryId: state.currentCountryKey,
            budget: state.currentBudget,
            routeType: state.selectedRouteType,
            preferences: state.selectedInterests,
            lang: state.currentLang
        });

        if (elements.aiOutputContent) {
            elements.aiOutputContent.textContent = state.activeSpeechText;
        }

        // Render lại timeline để cập nhật giá tiền theo ngân sách mới
        renderTimeline(countryData);

        // Cập nhật phân bổ ngân sách động (Feature 1C)
        renderBudgetAllocation();

        // Đồng bộ trạng thái URL (Feature 4A)
        syncUrlState();
    }

    /**
     * Chuyển đổi ngôn ngữ giao diện (EN / VI)
     */
    function updateLanguage(newLang) {
        state.currentLang = newLang;
        document.documentElement.lang = newLang;

        // Đồng bộ select box ngôn ngữ
        if (elements.langSelect && elements.langSelect.value !== newLang) {
            elements.langSelect.value = newLang;
        }
        const formLangSelect = document.getElementById('form-lang-select');
        if (formLangSelect && formLangSelect.value !== newLang) {
            formLangSelect.value = newLang;
        }
        document.querySelectorAll('.lang-btn, [data-lang]').forEach(btn => {
            const btnLang = btn.getAttribute('data-lang') || (btn.textContent.trim().toUpperCase() === 'VI' ? 'vi' : 'en');
            btn.classList.toggle('active', btnLang === newLang);
            btn.classList.toggle('is-active', btnLang === newLang);
        });

        // Cập nhật tất cả text có data-i18n
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (key) {
                el.textContent = t(key, newLang);
            }
        });

        // Cập nhật select quốc gia theo ngôn ngữ mới
        renderCountryOptions();

        // Cập nhật lại roadmap và hotels
        renderRoadmap();
        renderHotels();

        // Cập nhật tóm tắt AI và bản đồ
        const countryData = MOCK_COUNTRIES[state.currentCountryKey];
        if (countryData) {
            state.activeSpeechText = generateAISummary({
                countryId: state.currentCountryKey,
                budget: state.currentBudget,
                routeType: state.selectedRouteType,
                preferences: state.selectedInterests,
                lang: newLang
            });

            if (!state.isAnalyzing && elements.aiOutputContent) {
                elements.aiOutputContent.textContent = state.activeSpeechText;
            }

            renderTimeline(countryData);
            MapController.updateRoute(countryData, MOCK_DESTINATION, state.selectedRouteType, newLang);
        }

        // Cập nhật lại lịch trình 3 ngày nếu đang hiển thị
        const section = document.getElementById('generated-itinerary-section');
        if (section && section.style.display !== 'none') {
            renderItineraryContent();
        }

        // Cập nhật phân bổ ngân sách (Feature 1C)
        renderBudgetAllocation();

        // Cập nhật lại widget thời tiết theo ngôn ngữ mới (Feature 2)
        fetchQuyNhonWeather();

        // Cập nhật Digital Trip Pass nếu đang mở (Feature 4)
        if (elements.tripPassModal && !elements.tripPassModal.classList.contains('hidden')) {
            openTripPassModal();
        }

        // Đồng bộ URL với ngôn ngữ mới
        syncUrlState();

        // Dừng giọng nói cũ nếu đang phát để tránh lệch ngôn ngữ
        VoiceController.stop();
        resetVoiceUI();
    }

    /**
     * Khởi tạo quá trình mô phỏng phân tích lộ trình AI
     */
    function generateJourneyPlan(shouldScroll = true) {
        if (state.isAnalyzing) return;
        state.isAnalyzing = true;

        const countryKey = elements.countrySelect.value || state.currentCountryKey;
        state.currentCountryKey = countryKey;
        const countryData = MOCK_COUNTRIES[countryKey] || MOCK_COUNTRIES.belgium;
        const lang = state.currentLang;

        // 1. Cập nhật trạng thái UI
        elements.planBtn.disabled = true;
        elements.planBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${t('btnPlanning', lang)}</span>`;
        elements.aiProgressBar.style.display = 'block';
        elements.aiProgressFill.style.width = '15%';
        elements.aiOutputContent.innerHTML = `<span class="ai-typing-placeholder">${t('aiThinkingStep1', lang)}</span>`;
        elements.aiSpeechControls.style.display = 'none';
        VoiceController.stop();
        resetVoiceUI();

        if (shouldScroll && elements.aiCard) {
            elements.aiCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }

        // 2. Kích hoạt hiệu ứng mô phỏng tư duy AI từng bước
        AISimulator.simulateAnalysis(
            lang,
            (statusText, progressPercent) => {
                elements.aiStatusText.textContent = statusText;
                elements.aiProgressFill.style.width = `${progressPercent}%`;
            },
            () => {
                state.isAnalyzing = false;
                elements.planBtn.disabled = false;
                elements.planBtn.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> <span>${t('btnPlan', lang)}</span>`;
                elements.aiProgressBar.style.display = 'none';

                // Sinh nội dung tóm tắt động theo lựa chọn của người dùng
                state.activeSpeechText = generateAISummary({
                    countryId: state.currentCountryKey,
                    budget: state.currentBudget,
                    routeType: state.selectedRouteType,
                    preferences: state.selectedInterests,
                    lang: lang
                });

                // Hiệu ứng gõ chữ Typewriter
                AISimulator.typewriterEffect('ai-output-content', state.activeSpeechText, 12, () => {
                    elements.aiSpeechControls.style.display = 'flex';
                });

                // Cập nhật Timeline, Khách sạn, Bản đồ và Phân bổ ngân sách
                renderTimeline(countryData);
                renderHotels();
                renderBudgetAllocation();
                syncUrlState();
                MapController.updateRoute(countryData, MOCK_DESTINATION, state.selectedRouteType, lang);

                // Hiển thị container kết quả
                if (elements.resultsContainer) {
                    elements.resultsContainer.classList.remove('hidden');
                }
            }
        );
    }

    /**
     * Render các thẻ phương án di chuyển (Fastest, Best-Value, Smart-Stopover)
     * Cho phép click chọn phương án và cập nhật bản đồ + tóm tắt AI
     */
    function renderTimeline(countryData) {
        if (!elements.timelineList || !countryData || !countryData.routes) return;
        elements.timelineList.innerHTML = '';

        const lang = state.currentLang;
        const budget = state.currentBudget;
        const isVi = lang === 'vi';

        const routeDefs = [
            { key: 'fastest', data: countryData.routes.fastest, icon: 'bolt' },
            { key: 'bestValue', data: countryData.routes.bestValue, icon: 'scale-balanced' },
            { key: 'smartStopover', data: countryData.routes.smartStopover, icon: 'route' }
        ];

        routeDefs.forEach(({ key, data, icon }) => {
            if (!data) return;

            const isCurrentActive = (key === state.selectedRouteType);
            const routeFare = data.baseTransitCost || Math.round(budget * (data.priceRatio || 1.0) * 0.45);
            const ecoPill = data.isEcoChoice
                ? `<span class="eco-choice-pill"><i class="fa-solid fa-leaf"></i> ${data.carbonSavedPercent >= 30 ? t('ecoChoiceBadge', lang) : t('lowerEmissionBadge', lang)}</span>`
                : '';

            const carbonBarHtml = `
                <div class="route-carbon-bar">
                    <div class="route-carbon-stat">
                        <i class="fa-solid fa-smog"></i>
                        <span>${t('carbonFootprint', lang)}: <strong>${data.carbonKg || 550} kg CO₂e</strong></span>
                    </div>
                    ${ecoPill}
                </div>
                <small class="route-carbon-footnote">${(data.carbonNote && data.carbonNote[lang]) || t('carbonMethodology', lang)}</small>
            `;

            const routeCard = document.createElement('div');
            routeCard.className = `route-option-card route-${key} ${isCurrentActive ? 'is-active' : ''}`;
            routeCard.dataset.routeKey = key;

            const activeBadgeHtml = isCurrentActive
                ? `<div class="route-active-badge"><i class="fa-solid fa-circle-check"></i> ${isVi ? 'Lộ trình đang chọn' : 'Selected Active Route'}</div>`
                : `<div style="font-size: 0.72rem; color: #94a3b8; margin-bottom: 0.35rem;"><i class="fa-regular fa-hand-pointer"></i> ${isVi ? 'Nhấp để chọn lộ trình này' : 'Click to select this route'}</div>`;

            routeCard.innerHTML = `
                <div class="route-option-header">
                    <div class="route-option-title">
                        <div class="route-option-icon">
                            <i class="fa-solid fa-${icon}"></i>
                        </div>
                        <div>
                            ${activeBadgeHtml}
                            <span class="route-option-badge">
                                ${data.badge[lang]}
                            </span>
                            <h3>
                                ${data.title[lang]}
                            </h3>
                            <p>
                                ${data.description[lang]}
                            </p>
                            <div class="route-duration-pill">
                                <i class="fa-solid fa-clock"></i> ${isVi ? 'Tổng thời gian ước tính' : 'Est. Total Journey'}: <strong>${data.totalDuration}</strong>
                            </div>
                            ${carbonBarHtml}
                        </div>
                    </div>

                    <div class="route-option-price">
                        <span>
                            ${isVi ? 'Giá vé & di chuyển ước tính' : 'Est. Transit & Fare'}
                        </span>
                        <strong>
                            $${routeFare}
                        </strong>
                        <small style="display:block; font-size:0.68rem; color:var(--text-dim); margin-top:2px;">
                            ${isVi ? 'Khứ hồi + trung chuyển' : 'Round-trip + transfers'}
                        </small>
                    </div>
                </div>

                <div class="route-option-timeline">
                    <div class="route-timeline-title">
                        <i class="fa-solid fa-route"></i>
                        <span>
                            ${isVi ? 'Chi tiết các chặng hành trình' : 'Journey breakdown & connections'}
                        </span>
                    </div>

                    <div class="route-steps-list"></div>
                </div>
            `;

            // Render các chặng cụ thể của gói hành trình
            const stepsContainer = routeCard.querySelector('.route-steps-list');
            if (data.steps && Array.isArray(data.steps)) {
                data.steps.forEach((step, index) => {
                    const stepItem = document.createElement('div');
                    stepItem.className = `route-mini-step step-${step.type}`;

                    let tagLabel = '';
                    if (step.type === 'flight') tagLabel = t('stepFlightTag', lang);
                    else if (step.type === 'domestic-flight') tagLabel = isVi ? 'BAY NỐI CHUYẾN' : 'DOMESTIC FLIGHT';
                    else if (step.type === 'transfer') tagLabel = t('stepTransferTag', lang);
                    else if (step.type === 'hotel') tagLabel = t('stepHotelTag', lang);
                    else if (step.type === 'explore') tagLabel = t('stepExploreTag', lang);

                    // Badge nguồn dữ liệu mô phỏng vs xác minh
                    let dataBadgeHtml = '';
                    if (step.dataSource === 'verified') {
                        dataBadgeHtml = `<span class="data-source-tag verified"><i class="fa-solid fa-check"></i> ${step.dataSourceLabel ? step.dataSourceLabel[lang] : (isVi ? 'Lịch trình xác minh' : 'Verified Route')}</span>`;
                    } else if (step.dataSource === 'simulated') {
                        dataBadgeHtml = `<span class="data-source-tag simulated"><i class="fa-solid fa-circle-info"></i> ${step.dataSourceLabel ? step.dataSourceLabel[lang] : (isVi ? 'Dữ liệu mô phỏng' : 'Simulated Flight')}</span>`;
                    }

                    stepItem.innerHTML = `
                        <div class="route-mini-number">
                            ${index + 1}
                        </div>
                        <div class="route-mini-icon">
                            <i class="fa-solid fa-${step.icon}"></i>
                        </div>
                        <div class="route-mini-content">
                            <div class="route-mini-top">
                                <span class="step-tag tag-${step.type}">
                                    ${tagLabel}
                                </span>
                                <strong>
                                    ${step.title[lang]}
                                </strong>
                                ${dataBadgeHtml}
                            </div>
                            <div class="route-mini-location">
                                <span>${step.from}</span>
                                <i class="fa-solid fa-arrow-right-long"></i>
                                <span>${step.to}</span>
                            </div>
                            <p>${step.subInfo[lang]}</p>
                            ${step.highlight ? `<small style="color: #38bdf8; display: block; margin-top: 0.25rem;"><i class="fa-solid fa-sparkles"></i> ${step.highlight[lang]}</small>` : ''}
                        </div>
                    `;
                    stepsContainer.appendChild(stepItem);
                });
            }

            // Gắn sự kiện click để người dùng chọn hành trình này
            routeCard.addEventListener('click', () => {
                if (state.selectedRouteType === key) return;

                state.selectedRouteType = key;
                renderTimeline(countryData);
                renderBudgetAllocation();
                syncUrlState();

                // Cập nhật lại bản đồ theo phương án được chọn
                MapController.updateRoute(countryData, MOCK_DESTINATION, key, lang);

                // Cập nhật câu tóm tắt AI theo phương án này
                state.activeSpeechText = generateAISummary({
                    countryId: state.currentCountryKey,
                    budget: state.currentBudget,
                    routeType: state.selectedRouteType,
                    preferences: state.selectedInterests,
                    lang: lang
                });

                if (elements.aiOutputContent) {
                    elements.aiOutputContent.textContent = state.activeSpeechText;
                }
            });

            elements.timelineList.appendChild(routeCard);
        });
    }

    /**
     * Sinh lịch trình 3 ngày cá nhân hóa theo các sở thích thực tế (Personalized Itinerary)
     */
    function generateItinerary() {
        const button = elements.btnGenerateItinerary;
        if (button) {
            button.disabled = true;
            button.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> <span>${state.currentLang === 'vi' ? 'Đang tạo lịch trình...' : 'Creating Your Journey...'}</span>`;
        }

        setTimeout(() => {
            renderItineraryContent();

            if (button) {
                button.disabled = false;
                button.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles"></i> <span>${state.currentLang === 'vi' ? 'Làm mới lịch trình 3 ngày' : 'Refresh 3-Day Journey'}</span>`;
            }

            const section = document.getElementById('generated-itinerary-section');
            if (section) {
                section.style.display = 'block';
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        }, 400);
    }

    function renderItineraryContent() {
        const section = document.getElementById('generated-itinerary-section');
        const container = document.getElementById('generated-itinerary');
        if (!section || !container) return;

        const lang = state.currentLang;
        const days = generatePersonalizedItinerary({
            preferences: state.selectedInterests,
            budget: state.currentBudget,
            lang: lang
        });

        container.innerHTML = days.map(day => `
            <div class="itinerary-day-card">
                <div class="itinerary-day-header">
                    <div class="itinerary-day-number">
                        ${day.label.toUpperCase()}
                    </div>
                    <div class="itinerary-day-heading">
                        <span class="itinerary-day-label">${day.label}</span>
                        <h4 class="itinerary-day-title">${day.title}</h4>
                    </div>
                </div>

                <div class="itinerary-activities">
                    ${day.activities.map(act => `
                        <div class="itinerary-activity">
                            <div class="itinerary-activity-time">${act.time}</div>
                            <div class="itinerary-activity-title">${act.title[lang]}</div>
                            <div class="itinerary-activity-description">${act.desc[lang]}</div>
                            <span class="itinerary-activity-category">${act.category}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
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

    /**
     * Phát giọng nói AI với xử lý đa tầng và thông báo trạng thái
     */
    function speakAIResponse() {
        if (!state.activeSpeechText) return;

        const lang = state.currentLang;
        const isVi = lang === 'vi';

        // Trạng thái đang kết nối âm thanh
        if (elements.soundWaveIndicator) {
            elements.soundWaveIndicator.classList.remove('hidden');
            const statusSpan = elements.soundWaveIndicator.querySelector('span[data-i18n="voicePlaying"]') || elements.soundWaveIndicator.querySelector('span:last-child');
            if (statusSpan) statusSpan.textContent = isVi ? 'Đang chuẩn bị giọng đọc...' : 'Preparing audio...';
        }
        if (elements.btnSpeak) elements.btnSpeak.classList.add('hidden');
        if (elements.btnStop) elements.btnStop.classList.remove('hidden');

        VoiceController.speak(
            state.activeSpeechText,
            lang,
            // onStart
            () => {
                if (elements.soundWaveIndicator) {
                    elements.soundWaveIndicator.classList.remove('hidden');
                    const statusSpan = elements.soundWaveIndicator.querySelector('span[data-i18n="voicePlaying"]') || elements.soundWaveIndicator.querySelector('span:last-child');
                    if (statusSpan) statusSpan.textContent = isVi ? 'AI đang thuyết minh...' : 'AI is speaking...';
                }
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
            },
            // onLoading
            () => {
                if (elements.soundWaveIndicator) {
                    elements.soundWaveIndicator.classList.remove('hidden');
                    const statusSpan = elements.soundWaveIndicator.querySelector('span[data-i18n="voicePlaying"]') || elements.soundWaveIndicator.querySelector('span:last-child');
                    if (statusSpan) statusSpan.textContent = isVi ? 'Đang kết nối ElevenLabs / Trình duyệt...' : 'Connecting AI Voice...';
                }
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
    }

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

    // ==============================================================
    // Modal Khám Phá Điểm Đến: Môi Trường, Cảnh Quan & Đánh Giá
    // ==============================================================
    let currentDestinationTab = 'environment';

    function openDestinationModal(initialTab = 'environment') {
        if (!elements.destModal || !elements.destModalBody) return;

        currentDestinationTab = initialTab;
        renderDestinationModalContent();
        elements.destModal.classList.remove('hidden');
    }

    function closeDestinationModal() {
        if (elements.destModal) {
            elements.destModal.classList.add('hidden');
        }
    }

    function switchDestinationTab(tabName) {
        currentDestinationTab = tabName;

        // Cập nhật tab buttons
        document.querySelectorAll('.dest-modal-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabName);
        });

        // Cập nhật tab content
        const contentArea = document.getElementById('dest-tab-content-area');
        if (contentArea) {
            contentArea.innerHTML = getDestinationTabHtml(tabName);
        }
    }

    function renderDestinationModalContent() {
        const dest = MOCK_DESTINATION;
        const lang = state.currentLang;
        const isVi = lang === 'vi';

        elements.destModalBody.innerHTML = `
            <div class="modal-dest-header">
                <img src="${dest.bannerImage}" alt="${dest.name}" class="modal-dest-banner" />
                <div class="modal-dest-overlay">
                    <div>
                        <div class="modal-dest-badges">
                            <span class="badge-clean-city">
                                <i class="fa-solid fa-leaf"></i> ${dest.awards[lang]}
                            </span>
                            <span class="badge-rating-top">
                                <i class="fa-solid fa-star"></i> 4.88 / 5.0 (1,420+ Reviews)
                            </span>
                        </div>
                        <h2>🌊 ${dest.name}</h2>
                        <p>${dest.tagline[lang]}</p>
                    </div>
                </div>
            </div>

            <!-- Tab Navigation Buttons -->
            <div class="dest-modal-tabs">
                <button type="button" class="dest-modal-tab ${currentDestinationTab === 'environment' ? 'active' : ''}" data-tab="environment" onclick="App.switchDestinationTab('environment')">
                    <i class="fa-solid fa-wind"></i> <span>${t('tabEnvironment', lang)}</span>
                </button>
                <button type="button" class="dest-modal-tab ${currentDestinationTab === 'landscapes' ? 'active' : ''}" data-tab="landscapes" onclick="App.switchDestinationTab('landscapes')">
                    <i class="fa-solid fa-mountain-sun"></i> <span>${t('tabLandscapes', lang)}</span>
                </button>
                <button type="button" class="dest-modal-tab ${currentDestinationTab === 'ratings' ? 'active' : ''}" data-tab="ratings" onclick="App.switchDestinationTab('ratings')">
                    <i class="fa-solid fa-star-half-stroke"></i> <span>${t('tabRatings', lang)}</span>
                </button>
            </div>

            <!-- Dynamic Tab Content Area -->
            <div id="dest-tab-content-area" class="dest-tab-content-area">
                ${getDestinationTabHtml(currentDestinationTab)}
            </div>
        `;
    }

    function getDestinationTabHtml(tabName) {
        const dest = MOCK_DESTINATION;
        const lang = state.currentLang;
        const isVi = lang === 'vi';

        if (tabName === 'environment') {
            const env = dest.environment;
            return `
                <!-- 4 Metrics Overview -->
                <div class="dest-env-metrics">
                    ${env.ecoMetrics.map(m => `
                        <div class="env-metric-card">
                            <div class="env-metric-icon"><i class="fa-solid fa-${m.icon}"></i></div>
                            <div class="env-metric-val">${m.val}</div>
                            <div class="env-metric-label">${m.label[lang]}</div>
                            <div class="env-metric-status">${m.status[lang]}</div>
                        </div>
                    `).join('')}
                </div>

                <!-- Detailed Ecological Insights -->
                <div class="dest-env-details-box">
                    <h4><i class="fa-solid fa-wind"></i> ${isVi ? 'Không Khí & Sinh Thái Tự Nhiên' : 'Air Quality & Natural Ecology'}</h4>
                    <p>${env.airQuality.desc[lang]}</p>
                </div>

                <div class="dest-env-details-box">
                    <h4><i class="fa-solid fa-water"></i> ${isVi ? 'Chất Lượng Vùng Nước Biển & Rạn San Hô' : 'Marine Water Quality & Living Coral Sanctuaries'}</h4>
                    <p>${env.seaWater.desc[lang]}</p>
                </div>

                <div class="dest-env-details-box">
                    <h4><i class="fa-solid fa-sun"></i> ${isVi ? 'Khí Hậu & Mùa Du Lịch Biển Đẹp Nhất' : 'Climate & Optimal Travel Season'}</h4>
                    <p><strong>${env.climate.bestSeason[lang]}:</strong> ${env.climate.desc[lang]}</p>
                </div>
            `;
        } else if (tabName === 'landscapes') {
            return `
                <div class="dest-landscapes-list">
                    ${dest.landscapes.map(l => `
                        <div class="landscape-card">
                            <div class="landscape-img-box">
                                <img src="${l.image}" alt="${l.name[lang]}" loading="lazy" />
                                <span class="landscape-tag-pill">${l.tag[lang]}</span>
                            </div>
                            <div class="landscape-body">
                                <h4>${l.name[lang]}</h4>
                                <p>${l.desc[lang]}</p>
                            </div>
                        </div>
                    `).join('')}
                </div>
            `;
        } else if (tabName === 'ratings') {
            const r = dest.ratings;
            return `
                <!-- Ratings Summary -->
                <div class="dest-ratings-overview">
                    <div class="rating-score-large">
                        <div class="score-num">${r.overall}</div>
                        <div class="score-stars">
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                            <i class="fa-solid fa-star"></i>
                        </div>
                        <div class="score-reviews-count">${r.totalReviews.toLocaleString()} ${isVi ? 'đánh giá quốc tế đã xác minh' : 'verified global traveler reviews'}</div>
                    </div>

                    <div class="criteria-bars">
                        ${r.criteria.map(c => `
                            <div class="criteria-item">
                                <div class="criteria-header">
                                    <span>${c.name[lang]}</span>
                                    <strong>${c.score}</strong>
                                </div>
                                <div class="criteria-bar-track">
                                    <div class="criteria-bar-fill" style="width: ${c.percent}%;"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>

                <!-- Traveler Reviews -->
                <h5 style="color: white; margin-bottom: 0.85rem; font-size: 0.95rem;">
                    <i class="fa-solid fa-comments" style="color: #38bdf8;"></i> ${isVi ? 'Nhận Xét Tiêu Biểu Từ Khách Quốc Tế' : 'Featured International Traveler Reviews'}
                </h5>
                <div class="traveler-reviews-list">
                    ${r.reviews.map(rev => `
                        <div class="traveler-review-card">
                            <div class="review-user-row">
                                <div class="review-user-info">
                                    <img src="${rev.avatar}" alt="${rev.author}" class="review-user-avatar" />
                                    <div>
                                        <div class="review-user-name">${rev.author}</div>
                                        <div class="review-user-country">${rev.country} • ${rev.date}</div>
                                    </div>
                                </div>
                                <div class="review-stars">
                                    ${'<i class="fa-solid fa-star"></i>'.repeat(rev.rating)}
                                </div>
                            </div>
                            <p class="review-comment">“${rev.comment[lang]}”</p>
                        </div>
                    `).join('')}
                </div>
            `;
        }

        return '';
    }

    // ==============================================================
    // FEATURE 1C: Dynamic Budget Allocation Stacked Bar
    // ==============================================================
    function renderBudgetAllocation() {
        if (!elements.budgetAllocationContainer) return;

        const lang = state.currentLang;
        const isVi = lang === 'vi';
        const budget = Number(state.currentBudget) || 2000;
        const countryData = MOCK_COUNTRIES[state.currentCountryKey] || MOCK_COUNTRIES.belgium;
        const routeData = countryData?.routes?.[state.selectedRouteType] || countryData?.routes?.fastest;

        const transitCost = (routeData && routeData.baseTransitCost) ? routeData.baseTransitCost : 850;
        
        // Estimated 3 nights hotel & daily dining in Quy Nhon (~$120/night + $50/day dining = $510)
        const stayDiningCost = 510;
        const totalEstimatedExpenses = transitCost + stayDiningCost;
        const remaining = budget - totalEstimatedExpenses;

        let transitPct = Math.round((transitCost / budget) * 100);
        let stayPct = Math.round((stayDiningCost / budget) * 100);
        let expPct = Math.max(0, Math.round((remaining / budget) * 100));

        let alertHtml = '';
        let barHtml = '';

        if (remaining < 0) {
            const shortfall = Math.abs(remaining);
            const totalRequired = transitCost + stayDiningCost;
            const barTransitPct = Math.round((transitCost / totalRequired) * 100);
            const barStayPct = 100 - barTransitPct;

            barHtml = `
                <div class="budget-bar-track" title="Budget shortfall: -$${shortfall}">
                    <div class="budget-bar-seg seg-transit" style="width: ${barTransitPct}%;" title="Transit: $${transitCost}"></div>
                    <div class="budget-bar-seg seg-stay" style="width: ${barStayPct}%;" title="Stay & Dining: $${stayDiningCost}"></div>
                </div>
            `;

            alertHtml = `
                <div class="budget-alert-box alert-warning">
                    <i class="fa-solid fa-triangle-exclamation"></i>
                    <div>
                        <strong>${t('budgetShortfallLabel', lang)}: -$${shortfall.toLocaleString()} USD</strong> — ${t('budgetShortfallNotice', lang)}
                    </div>
                </div>
            `;
        } else {
            barHtml = `
                <div class="budget-bar-track">
                    <div class="budget-bar-seg seg-transit" style="width: ${transitPct}%;" title="Transit: $${transitCost} (${transitPct}%)"></div>
                    <div class="budget-bar-seg seg-stay" style="width: ${stayPct}%;" title="Stay & Dining: $${stayDiningCost} (${stayPct}%)"></div>
                    <div class="budget-bar-seg seg-experience" style="width: ${expPct}%;" title="Experience Savings: $${remaining} (${expPct}%)"></div>
                </div>
            `;

            alertHtml = `
                <div class="budget-alert-box alert-success">
                    <i class="fa-solid fa-circle-check"></i>
                    <div>
                        ${isVi 
                            ? `Ngân sách $${budget.toLocaleString()} rất cân đối! Bạn còn dư <strong>$${remaining.toLocaleString()} USD (${expPct}%)</strong> cho lặn ngắm san hô Kỳ Co, ẩm thực và mua sắm.`
                            : `Your $${budget.toLocaleString()} budget is well-balanced! You have <strong>$${remaining.toLocaleString()} USD (${expPct}%)</strong> remaining for Ky Co snorkeling, seafood feasts & excursions.`}
                    </div>
                </div>
            `;
        }

        elements.budgetAllocationContainer.innerHTML = `
            <div class="budget-alloc-header">
                <div class="budget-alloc-title-group">
                    <h4><i class="fa-solid fa-chart-pie"></i> ${t('budgetBreakdownTitle', lang)}</h4>
                    <p>${t('budgetBreakdownSubtitle', lang)}</p>
                </div>
                <div class="budget-total-pill">
                    ${isVi ? 'Tổng ngân sách' : 'Total Budget'}: $${budget.toLocaleString()}
                </div>
            </div>

            ${barHtml}

            <div class="budget-legend-grid">
                <div class="budget-legend-card">
                    <div class="legend-head">
                        <span class="legend-dot-sq dot-transit"></span>
                        <span>${t('transitCostLabel', lang)}</span>
                    </div>
                    <div class="legend-amt">
                        $${transitCost.toLocaleString()}
                        <span class="legend-pct">(${transitPct}%)</span>
                    </div>
                </div>

                <div class="budget-legend-card">
                    <div class="legend-head">
                        <span class="legend-dot-sq dot-stay"></span>
                        <span>${t('stayDiningCostLabel', lang)}</span>
                    </div>
                    <div class="legend-amt">
                        $${stayDiningCost.toLocaleString()}
                        <span class="legend-pct">(${stayPct}%)</span>
                    </div>
                </div>

                <div class="budget-legend-card ${remaining < 0 ? 'is-shortfall' : ''}">
                    <div class="legend-head">
                        <span class="legend-dot-sq ${remaining < 0 ? 'dot-shortfall' : 'dot-exp'}"></span>
                        <span>${remaining < 0 ? t('budgetShortfallLabel', lang) : t('experienceSavingsLabel', lang)}</span>
                    </div>
                    <div class="legend-amt ${remaining < 0 ? 'shortfall-amt' : ''}">
                        ${remaining < 0 ? `-$${Math.abs(remaining).toLocaleString()}` : `$${remaining.toLocaleString()}`}
                        <span class="legend-pct">(${remaining < 0 ? (isVi ? 'Thiếu hụt' : 'Deficit') : `${expPct}%`})</span>
                    </div>
                </div>
            </div>

            ${alertHtml}
        `;
    }

    // ==============================================================
    // FEATURE 2: Live Weather & Seasonal Intelligence Widget
    // ==============================================================
    let weatherCache = null;

    async function fetchQuyNhonWeather() {
        if (weatherCache && (Date.now() - weatherCache.timestamp < 300000)) {
            renderWeatherWidget(weatherCache.data);
            return;
        }

        const endpoint = 'https://api.open-meteo.com/v1/forecast?latitude=13.782&longitude=109.219&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m&timezone=Asia%2FHo_Chi_Minh';
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);

        try {
            const res = await fetch(endpoint, { signal: controller.signal });
            clearTimeout(timeoutId);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            const current = data.current || {};
            
            const weatherData = {
                temp: Math.round(current.temperature_2m ?? 28),
                wind: Math.round(current.wind_speed_10m ?? 12),
                humidity: Math.round(current.relative_humidity_2m ?? 78),
                code: current.weather_code ?? 0,
                isLive: true
            };

            weatherCache = { timestamp: Date.now(), data: weatherData };
            renderWeatherWidget(weatherData);
        } catch (err) {
            clearTimeout(timeoutId);
            console.warn('[Weather API] Open-Meteo offline or timed out, using sample data:', err.message);
            const fallbackData = {
                temp: 28,
                wind: 12,
                humidity: 76,
                code: 1,
                isLive: false
            };
            renderWeatherWidget(fallbackData);
        }
    }

    function getWeatherCondition(code, lang) {
        const isVi = lang === 'vi';
        if (code === 0) return { text: isVi ? 'Trời quang đãng' : 'Clear Sky', icon: 'sun' };
        if (code <= 3) return { text: isVi ? 'Mây rải rác' : 'Partly Cloudy', icon: 'cloud-sun' };
        if (code >= 51 && code <= 67) return { text: isVi ? 'Mưa phùn nhẹ' : 'Light Rain / Drizzle', icon: 'cloud-rain' };
        if (code >= 80 && code <= 82) return { text: isVi ? 'Mưa rào duyên hải' : 'Coastal Showers', icon: 'cloud-showers-heavy' };
        if (code >= 95) return { text: isVi ? 'Dông bão' : 'Thunderstorm', icon: 'bolt' };
        return { text: isVi ? 'Nắng đẹp' : 'Fair Weather', icon: 'sun' };
    }

    function getSeasonalAdvice(lang) {
        const isVi = lang === 'vi';
        const month = new Date().getMonth() + 1;

        if (month >= 3 && month <= 9) {
            return isVi
                ? `Tháng ${month} thuộc mùa khô nắng vàng tại Quy Nhơn, biển êm và nước trong xanh như ngọc bích. Rất thích hợp để tắm biển Kỳ Co, lặn ngắm san hô Hòn Khô và check-in hoàng hôn Eo Gió. Nhớ chuẩn bị kem chống nắng và kính mát!`
                : `Month ${month} is Quy Nhon's golden dry season: calm emerald seas and bright sunny skies. Perfect for Ky Co beach, coral snorkeling around Hon Kho, and Eo Gio cliff walks. Remember sun protection!`;
        } else {
            return isVi
                ? `Tháng ${month} có gió biển mát lành và thỉnh thoảng có mưa rào duyên hải. Rất lý tưởng để khám phá quần thể tháp Chăm Bánh Ít ngàn năm, tắm khoáng nóng Hội Vân và thưởng thức bánh xèo tôm nhảy nóng hổi. Nên kiểm tra tình hình sóng biển trước khi đi cano ra đảo.`
                : `Month ${month} brings refreshing coastal breezes with occasional showers. Ideal for ancient Cham towers (Banh It, Twin Towers), Hoi Van mineral hot springs, and hot jumping shrimp pancakes. Check boat advisories before visiting offshore islands.`;
        }
    }

    function renderWeatherWidget(data) {
        const lang = state.currentLang;
        const condition = getWeatherCondition(data.code, lang);
        const seasonalTip = getSeasonalAdvice(lang);

        if (elements.weatherTempVal) elements.weatherTempVal.textContent = `${data.temp}°C`;
        if (elements.weatherWindVal) elements.weatherWindVal.textContent = `${data.wind} km/h`;
        if (elements.weatherHumidityVal) elements.weatherHumidityVal.textContent = `${data.humidity}%`;
        if (elements.weatherMainIcon) elements.weatherMainIcon.innerHTML = `<i class="fa-solid fa-${condition.icon}"></i>`;
        if (elements.weatherSeasonalTip) elements.weatherSeasonalTip.textContent = seasonalTip;

        // Status badge
        if (elements.weatherStatusBadge) {
            elements.weatherStatusBadge.className = `weather-data-status ${data.isLive ? 'live' : 'sample'}`;
        }
        if (elements.weatherStatusLabel) {
            elements.weatherStatusLabel.textContent = data.isLive ? t('weatherLiveStatus', lang) : t('weatherSampleStatus', lang);
        }

        // Nav pill
        if (elements.navWeatherTemp) elements.navWeatherTemp.textContent = `${data.temp}°C`;
        if (elements.navWeatherIcon) elements.navWeatherIcon.innerHTML = `<i class="fa-solid fa-${condition.icon}"></i>`;
        if (elements.navWeatherBadge) {
            elements.navWeatherBadge.className = `weather-source-dot ${data.isLive ? 'live' : 'sample'}`;
            elements.navWeatherBadge.title = data.isLive ? t('weatherLiveStatus', lang) : t('weatherSampleStatus', lang);
        }
    }

    // ==============================================================
    // FEATURE 3: Context-Aware AI Travel Concierge (Floating Chat)
    // ==============================================================
    function initConciergeChat() {
        if (!elements.conciergeToggle || !elements.conciergeDrawer) return;

        elements.conciergeToggle.addEventListener('click', () => {
            elements.conciergeDrawer.classList.toggle('hidden');
            if (!elements.conciergeDrawer.classList.contains('hidden')) {
                if (elements.conciergeMessagesList && elements.conciergeMessagesList.children.length === 0) {
                    renderInitialConciergeGreeting();
                }
                if (elements.conciergeInputText) elements.conciergeInputText.focus();
            }
        });

        if (elements.conciergeCloseBtn) {
            elements.conciergeCloseBtn.addEventListener('click', () => {
                elements.conciergeDrawer.classList.add('hidden');
            });
        }

        // Gắn sự kiện các gợi ý nhanh (Quick Prompt Chips)
        document.querySelectorAll('.quick-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const promptKey = chip.dataset.prompt;
                const lang = state.currentLang;
                const prompts = {
                    rainy: lang === 'vi' ? 'Kế hoạch ngày mưa tại Quy Nhơn là gì?' : 'What is the rainy-day backup plan in Quy Nhon?',
                    airport: lang === 'vi' ? 'Từ sân bay Phù Cát (UIH) về trung tâm Quy Nhơn đi như thế nào?' : 'How do I transfer from Phu Cat Airport (UIH) to Quy Nhon?',
                    food: lang === 'vi' ? 'Những món đặc sản nào nhất định phải thử tại Quy Nhơn?' : 'What must-try local dishes should I eat in Quy Nhon?',
                    budget: lang === 'vi' ? `Làm sao để tối ưu ngân sách $${state.currentBudget} cho chuyến đi?` : `How can I optimize my $${state.currentBudget} budget for this trip?`
                };
                const userMsg = prompts[promptKey] || chip.textContent.trim();
                sendConciergeMessage(userMsg);
            });
        });

        // Submit form chat
        if (elements.conciergeInputForm) {
            elements.conciergeInputForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const text = elements.conciergeInputText ? elements.conciergeInputText.value.trim() : '';
                if (!text) return;
                elements.conciergeInputText.value = '';
                sendConciergeMessage(text);
            });
        }
    }

    function renderInitialConciergeGreeting() {
        if (!elements.conciergeMessagesList) return;
        const lang = state.currentLang;
        const isVi = lang === 'vi';
        const greeting = isVi
            ? `Xin chào! Tôi là Trợ Lý Du Lịch Quy Nhơn AI. Bạn có thể hỏi tôi bất kỳ điều gì về đường bay, đưa đón sân bay Phù Cát, ẩm thực bản địa hay gợi ý điểm vui chơi theo ngân sách $${state.currentBudget}!`
            : `Hello! I am your Quy Nhon AI Concierge. Ask me anything about transit routes, Phu Cat Airport transfers, authentic dining, or custom tips for your $${state.currentBudget} journey!`;

        appendChatMessage('bot', greeting, 'local');
    }

    function appendChatMessage(sender, text, source = 'local') {
        if (!elements.conciergeMessagesList) return;

        const lang = state.currentLang;
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg msg-${sender}`;

        const formattedHtml = text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\n•/g, '<br>•')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');

        const sourceLabel = source === 'gemini' ? t('chatSourceGemini', lang) : t('chatSourceLocal', lang);
        const sourceHtml = sender === 'bot'
            ? `<span class="msg-source-tag source-${source}">● ${sourceLabel}</span>`
            : '';

        msgDiv.innerHTML = `
            <div class="msg-bubble">${formattedHtml}</div>
            ${sourceHtml}
        `;

        elements.conciergeMessagesList.appendChild(msgDiv);
        elements.conciergeMessagesList.scrollTop = elements.conciergeMessagesList.scrollHeight;
    }

    async function sendConciergeMessage(userText) {
        appendChatMessage('user', userText);

        const lang = state.currentLang;
        if (elements.conciergeSubmitBtn) elements.conciergeSubmitBtn.disabled = true;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'chat-msg msg-bot chat-typing-indicator';
        typingDiv.innerHTML = `<div class="msg-bubble" style="opacity: 0.7;"><i class="fa-solid fa-spinner fa-spin"></i> ${t('chatThinking', lang)}</div>`;
        elements.conciergeMessagesList.appendChild(typingDiv);
        elements.conciergeMessagesList.scrollTop = elements.conciergeMessagesList.scrollHeight;

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userText,
                    lang: state.currentLang,
                    context: {
                        country: state.currentCountryKey,
                        budget: state.currentBudget,
                        route: state.selectedRouteType,
                        interests: state.selectedInterests
                    }
                })
            });

            typingDiv.remove();

            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            appendChatMessage('bot', data.reply || 'No response.', data.source || 'local');
        } catch (err) {
            typingDiv.remove();
            console.warn('[Concierge Chat Error]', err.message);
            const localFallback = (state.currentLang === 'vi')
                ? '🌧️ **Gợi ý nhanh từ Trợ Lý Quy Nhơn:** Bạn có thể tham quan Tháp Chăm Bánh Ít, thưởng thức Bánh xèo tôm nhảy tại Gia Vỹ (14 Diên Hồng), hoặc ngắm biển tại Surf Bar. Để tới Quy Nhơn nhanh nhất, hãy đón taxi từ Sân bay Phù Cát (khoảng 40 phút).'
                : '🌧️ **Quick Quy Nhon Travel Tip:** Visit the 10th-century Banh It Cham towers, savor jumping shrimp pancakes at Gia Vy, or relax at Surf Bar. For direct transit, grab an airport shuttle or taxi from Phu Cat Airport (UIH, ~40 mins).';
            appendChatMessage('bot', localFallback, 'local');
        } finally {
            if (elements.conciergeSubmitBtn) elements.conciergeSubmitBtn.disabled = false;
        }
    }

    // ==============================================================
    // FEATURE 4: Digital Trip Pass & Shareable URL State
    // ==============================================================
    function syncUrlState() {
        const params = new URLSearchParams();
        params.set('country', state.currentCountryKey);
        params.set('budget', state.currentBudget);
        params.set('route', state.selectedRouteType);
        params.set('interests', state.selectedInterests.join(','));
        params.set('lang', state.currentLang);

        const newUrl = `${window.location.pathname}?${params.toString()}${window.location.hash}`;
        window.history.replaceState(null, '', newUrl);
    }

    function hydrateStateFromUrl() {
        const params = new URLSearchParams(window.location.search);
        
        // 1. Language
        const urlLang = params.get('lang');
        if (urlLang === 'vi' || urlLang === 'en') {
            state.currentLang = urlLang;
        }

        // 2. Country
        const urlCountry = params.get('country');
        if (urlCountry && MOCK_COUNTRIES[urlCountry]) {
            state.currentCountryKey = urlCountry;
        }

        // 3. Budget
        const urlBudget = Number(params.get('budget'));
        if (urlBudget && urlBudget >= 100) {
            state.currentBudget = urlBudget;
        }

        // 4. Route
        const urlRoute = params.get('route');
        if (['fastest', 'bestValue', 'smartStopover', 'best-value', 'smart-stopover'].includes(urlRoute)) {
            state.selectedRouteType = (urlRoute === 'best-value') ? 'bestValue' : ((urlRoute === 'smart-stopover') ? 'smartStopover' : urlRoute);
        }

        // 5. Interests
        const urlInterests = params.get('interests');
        if (urlInterests) {
            const list = urlInterests.split(',').map(s => s.trim().toLowerCase()).filter(s => ['beaches', 'food', 'culture', 'adventure', 'nightlife'].includes(s));
            if (list.length > 0) {
                state.selectedInterests = list;
                document.querySelectorAll('input[name="travel-interest"]').forEach(cb => {
                    cb.checked = list.includes(cb.value);
                });
            }
        }
    }

    function openTripPassModal() {
        if (!elements.tripPassModal || !elements.tripPassContent) return;

        const lang = state.currentLang;
        const country = MOCK_COUNTRIES[state.currentCountryKey] || MOCK_COUNTRIES.belgium;
        const routeData = country.routes[state.selectedRouteType] || country.routes.fastest;

        const transitCost = routeData.baseTransitCost || 850;
        const carbonKg = routeData.carbonKg || 550;
        const budget = state.currentBudget;
        const stayCost = 510;
        const remaining = budget - transitCost - stayCost;

        syncUrlState();
        const shareUrl = window.location.href;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(shareUrl)}`;

        const itineraryDays = generatePersonalizedItinerary({
            preferences: state.selectedInterests,
            budget: state.currentBudget,
            lang: lang
        });

        const highlights = [
            `${itineraryDays[0].label}: ${itineraryDays[0].title}`,
            `${itineraryDays[1].label}: ${itineraryDays[1].title}`,
            `${itineraryDays[2].label}: ${itineraryDays[2].title}`
        ];

        const passSerial = `QN-${state.currentCountryKey.slice(0, 3).toUpperCase()}-${Date.now().toString().slice(-6)}`;

        elements.tripPassContent.innerHTML = `
            <div class="boarding-pass-card">
                <div class="boarding-pass-header">
                    <div class="boarding-pass-brand">
                        <div class="brand-logo-icon" style="width: 28px; height: 28px; font-size: 0.85rem; background: white; color: #0369a1;">
                            <i class="fa-solid fa-compass"></i>
                        </div>
                        <div>
                            <h3 data-i18n="tripPassTitle">${t('tripPassTitle', lang)}</h3>
                            <span data-i18n="tripPassSubtitle">${t('tripPassSubtitle', lang)}</span>
                        </div>
                    </div>
                    <div class="boarding-pass-serial">${passSerial}</div>
                </div>

                <div class="boarding-pass-route-row">
                    <div class="route-endpoint">
                        <div class="endpoint-code">${country.airport ? country.airport.slice(-4, -1) : 'DEP'}</div>
                        <div class="endpoint-label">${country.flag} ${country.name[lang]} (${country.city})</div>
                    </div>

                    <div class="route-connector-line">
                        <i class="fa-solid fa-plane"></i>
                        <span class="connector-dash"></span>
                        <small style="font-size: 0.68rem; color: var(--text-dim);">${routeData.totalDuration}</small>
                    </div>

                    <div class="route-endpoint">
                        <div class="endpoint-code">UIH</div>
                        <div class="endpoint-label">🇻🇳 Quy Nhon, Vietnam</div>
                    </div>
                </div>

                <div class="boarding-pass-grid">
                    <div class="pass-grid-item">
                        <small>${t('passRouteOption', lang)}</small>
                        <strong>${routeData.title[lang]}</strong>
                    </div>
                    <div class="pass-grid-item">
                        <small>${t('passEstCost', lang)}</small>
                        <strong>$${transitCost} USD</strong>
                    </div>
                    <div class="pass-grid-item">
                        <small>${t('passEstCarbon', lang)}</small>
                        <strong style="color: #34d399;">${carbonKg} kg CO₂e ${routeData.carbonSavedPercent > 0 ? `(-${routeData.carbonSavedPercent}%)` : ''}</strong>
                    </div>
                    <div class="pass-grid-item">
                        <small>${t('labelBudget', lang)}</small>
                        <strong>$${budget.toLocaleString()} USD</strong>
                    </div>
                    <div class="pass-grid-item">
                        <small>${t('stayDiningCostLabel', lang)}</small>
                        <strong>$${stayCost} USD</strong>
                    </div>
                    <div class="pass-grid-item">
                        <small>${remaining < 0 ? t('budgetShortfallLabel', lang) : t('experienceSavingsLabel', lang)}</small>
                        <strong style="color: ${remaining < 0 ? '#f87171' : '#34d399'};">
                            ${remaining < 0 ? `-$${Math.abs(remaining).toLocaleString()}` : `$${remaining.toLocaleString()}`}
                        </strong>
                    </div>
                </div>

                <div class="boarding-pass-itinerary-preview">
                    <h5><i class="fa-solid fa-sparkles"></i> ${t('passItineraryHighlights', lang)}</h5>
                    <ul class="pass-highlights-list">
                        ${highlights.map(h => `<li><i class="fa-solid fa-circle-check"></i> <span>${h}</span></li>`).join('')}
                    </ul>
                </div>

                <div class="boarding-pass-footer">
                    <div class="pass-qr-box">
                        <img src="${qrUrl}" alt="Digital Trip Pass QR" class="pass-qr-img" onerror="this.onerror=null; this.src='data:image/svg+xml;utf8,<svg xmlns=\\'http://www.w3.org/2000/svg\\' width=\\'110\\' height=\\'110\\' viewBox=\\'0 0 100 100\\'><rect width=\\'100\\' height=\\'100\\' fill=\\'%23eee\\'/><text x=\\'50\\' y=\\'55\\' font-size=\\'12\\' text-anchor=\\'middle\\' fill=\\'%23666\\'>Offline Link</text></svg>'; document.getElementById('qr-note-sub').textContent='${t('offlineQrNote', lang)}';" />
                        <small id="qr-note-sub">${t('passScanQr', lang)}</small>
                    </div>

                    <div class="pass-share-info">
                        <label style="font-size: 0.72rem; color: var(--text-dim); text-transform: uppercase; font-weight: 700;">Shareable Link</label>
                        <div class="pass-share-link-box">
                            <input type="text" id="pass-share-link-input" class="pass-share-input" readonly value="${shareUrl}" />
                        </div>
                    </div>
                </div>
            </div>

            <div class="pass-actions-row">
                <button type="button" class="btn-pass-action btn-copy-link" onclick="App.copyShareLink()">
                    <i class="fa-solid fa-copy"></i> <span>${t('passCopyLink', lang)}</span>
                </button>
                <button type="button" class="btn-pass-action btn-print-pass" onclick="window.print()">
                    <i class="fa-solid fa-print"></i> <span>${t('passPrintPdf', lang)}</span>
                </button>
            </div>
        `;

        elements.tripPassModal.classList.remove('hidden');
    }

    function closeTripPassModal() {
        if (elements.tripPassModal) elements.tripPassModal.classList.add('hidden');
    }

    function copyShareLink() {
        syncUrlState();
        const shareUrl = window.location.href;
        const lang = state.currentLang;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(shareUrl)
                .then(() => showToast(t('toastLinkCopied', lang)))
                .catch(() => fallbackCopy(shareUrl));
        } else {
            fallbackCopy(shareUrl);
        }
    }

    function fallbackCopy(text) {
        const lang = state.currentLang;
        const input = document.getElementById('pass-share-link-input');
        if (input) {
            input.select();
            document.execCommand('copy');
            showToast(t('toastLinkCopied', lang));
        } else {
            showToast(t('toastCopyFailed', lang));
        }
    }

    function showToast(message) {
        const container = document.getElementById('app-toast-container');
        if (!container) return;
        const toast = document.createElement('div');
        toast.className = 'toast-item';
        toast.textContent = message;
        container.appendChild(toast);
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(-10px)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }

    // Tự động khởi chạy khi DOM đã sẵn sàng
    document.addEventListener('DOMContentLoaded', init);

    return {
        init: init,
        openHotelModal: openHotelModal,
        closeModal: closeModal,
        openDestinationModal: openDestinationModal,
        closeDestinationModal: closeDestinationModal,
        switchDestinationTab: switchDestinationTab,
        updateLanguage: updateLanguage,
        openTripPassModal: openTripPassModal,
        closeTripPassModal: closeTripPassModal,
        copyShareLink: copyShareLink,
        renderBudgetAllocation: renderBudgetAllocation,
        fetchQuyNhonWeather: fetchQuyNhonWeather,
        getState: function() { return state; }
    };
})();
