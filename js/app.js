/**
 * Quy Nhon AI Travel Assistant - Main Application Controller
 * Điều phối sự kiện, render giao diện, đồng bộ dữ liệu và các module.
 */

const App = (function() {
    // State của ứng dụng
const state = {
    currentLang: 'en',
    currentCountryKey: 'belgium',
    currentBudget: 2000,
    isAnalyzing: false,
    activeSpeechText: ''
};

    // DOM Elements
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



// 6. Hiển thị Budget sau khi có quốc gia mặc định
if (elements.budgetFormGroup) {
    elements.budgetFormGroup.style.display = 'block';
}

if (elements.budgetSelect) {
    state.currentBudget = Number(elements.budgetSelect.value);
}

        // 7. Generate initial default route (Belgium -> Quy Nhon)
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
        if (elements.countrySelect) {
    elements.countrySelect.addEventListener('change', (e) => {
        state.currentCountryKey = e.target.value;

        // Hiển thị Budget sau khi người dùng chọn nơi khởi hành
        if (elements.budgetFormGroup) {
            elements.budgetFormGroup.style.display = 'block';
        }
    });
}

if (elements.budgetSelect) {
    elements.budgetSelect.addEventListener('change', (e) => {

        const value = e.target.value;

        // Người dùng chọn Custom Budget
        if (value === 'custom') {

            if (elements.customBudgetContainer) {
                elements.customBudgetContainer.style.display = 'block';
            }

            if (elements.customBudgetInput) {
                elements.customBudgetInput.focus();
            }

            return;
        }

        // Người dùng chọn budget có sẵn
        if (elements.customBudgetContainer) {
            elements.customBudgetContainer.style.display = 'none';
        }

        state.currentBudget = Number(value);
    });
}
// for the char
if (elements.customBudgetInput) {
    elements.customBudgetInput.addEventListener('input', (e) => {

        const value = Number(e.target.value);

        if (value > 0) {
            state.currentBudget = value;
        }
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

// Nút "Generate My 3-Day Journey"
if (elements.btnGenerateItinerary) {
    elements.btnGenerateItinerary.addEventListener('click', generateItinerary);
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

    function generateItinerary() {

    const section = document.getElementById(
        'generated-itinerary-section'
    );

    const container = document.getElementById(
        'generated-itinerary'
    );

    if (!section || !container) {
        return;
    }

    const button = elements.btnGenerateItinerary;

    if (button) {
        button.disabled = true;

        button.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Creating Your Journey...</span>
        `;
    }

    // Demo delay để tạo cảm giác hệ thống đang xử lý
    setTimeout(() => {

        container.innerHTML = `
            <!-- DAY 1 -->
            <div class="itinerary-day-card">

                <div class="itinerary-day-header">

                    <div class="itinerary-day-number">
                        DAY 1
                    </div>

                    <div class="itinerary-day-heading">
                        <span class="itinerary-day-label">
                            Day 1
                        </span>

                        <h4 class="itinerary-day-title">
                            Beach & Local Flavors
                        </h4>
                    </div>

                </div>


                <div class="itinerary-activities">

                    <div class="itinerary-activity">

                        <div class="itinerary-activity-time">
                            09:00
                        </div>

                        <div class="itinerary-activity-title">
                            Quy Nhon Beach
                        </div>

                        <div class="itinerary-activity-description">
                            Start your journey with a relaxing morning by the sea.
                        </div>

                        <span class="itinerary-activity-category">
                            BEACH
                        </span>

                    </div>


                    <div class="itinerary-activity">

                        <div class="itinerary-activity-time">
                            12:00
                        </div>

                        <div class="itinerary-activity-title">
                            Local Food Experience
                        </div>

                        <div class="itinerary-activity-description">
                            Discover authentic local flavors and traditional dishes.
                        </div>

                        <span class="itinerary-activity-category">
                            FOOD
                        </span>

                    </div>


                    <div class="itinerary-activity">

                        <div class="itinerary-activity-time">
                            15:00
                        </div>

                        <div class="itinerary-activity-title">
                            Coastal Walk
                        </div>

                        <div class="itinerary-activity-description">
                            Enjoy the coastline and the atmosphere of Quy Nhon.
                        </div>

                        <span class="itinerary-activity-category">
                            BEACH
                        </span>

                    </div>

                </div>

            </div>


            <!-- DAY 2 -->
            <div class="itinerary-day-card">

                <div class="itinerary-day-header">

                    <div class="itinerary-day-number">
                        DAY 2
                    </div>

                    <div class="itinerary-day-heading">
                        <span class="itinerary-day-label">
                            Day 2
                        </span>

                        <h4 class="itinerary-day-title">
                            Culture & Heritage
                        </h4>
                    </div>

                </div>


                <div class="itinerary-activities">

                    <div class="itinerary-activity">

                        <div class="itinerary-activity-time">
                            09:00
                        </div>

                        <div class="itinerary-activity-title">
                            Binh Dinh Heritage
                        </div>

                        <div class="itinerary-activity-description">
                            Discover the history and cultural heritage of the region.
                        </div>

                        <span class="itinerary-activity-category">
                            CULTURE
                        </span>

                    </div>


                    <div class="itinerary-activity">

                        <div class="itinerary-activity-time">
                            12:30
                        </div>

                        <div class="itinerary-activity-title">
                            Traditional Lunch
                        </div>

                        <div class="itinerary-activity-description">
                            Enjoy another taste of Quy Nhon's local cuisine.
                        </div>

                        <span class="itinerary-activity-category">
                            FOOD
                        </span>

                    </div>


                    <div class="itinerary-activity">

                        <div class="itinerary-activity-time">
                            15:00
                        </div>

                        <div class="itinerary-activity-title">
                            Cultural Discovery
                        </div>

                        <div class="itinerary-activity-description">
                            Explore the stories and traditions of Binh Dinh.
                        </div>

                        <span class="itinerary-activity-category">
                            CULTURE
                        </span>

                    </div>

                </div>

            </div>


            <!-- DAY 3 -->
            <div class="itinerary-day-card">

                <div class="itinerary-day-header">

                    <div class="itinerary-day-number">
                        DAY 3
                    </div>

                    <div class="itinerary-day-heading">
                        <span class="itinerary-day-label">
                            Day 3
                        </span>

                        <h4 class="itinerary-day-title">
                            Coastal Escape
                        </h4>
                    </div>

                </div>


                <div class="itinerary-activities">

                    <div class="itinerary-activity">

                        <div class="itinerary-activity-time">
                            08:00
                        </div>

                        <div class="itinerary-activity-title">
                            Morning by the Sea
                        </div>

                        <div class="itinerary-activity-description">
                            Enjoy a peaceful morning surrounded by the coastline.
                        </div>

                        <span class="itinerary-activity-category">
                            BEACH
                        </span>

                    </div>


                    <div class="itinerary-activity">

                        <div class="itinerary-activity-time">
                            12:00
                        </div>

                        <div class="itinerary-activity-title">
                            Quy Nhon Specialties
                        </div>

                        <div class="itinerary-activity-description">
                            Finish your food journey with more local specialties.
                        </div>

                        <span class="itinerary-activity-category">
                            FOOD
                        </span>

                    </div>


                    <div class="itinerary-activity">

                        <div class="itinerary-activity-time">
                            15:30
                        </div>

                        <div class="itinerary-activity-title">
                            Final Coastal Experience
                        </div>

                        <div class="itinerary-activity-description">
                            End your journey with a relaxing experience by the sea.
                        </div>

                        <span class="itinerary-activity-category">
                            BEACH
                        </span>

                    </div>

                </div>

            </div>
        `;

        section.style.display = 'block';

        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });

        if (button) {
            button.disabled = false;

            button.innerHTML = `
                <i class="fa-solid fa-check"></i>
                <span>Journey Created</span>
            `;
        }

    }, 1200);
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
    const budget = state.currentBudget;

    /*
     * Generate Best-Value price randomly between
     * 10% and 30% below the selected budget.
     *
     * Example:
     * Budget = $2,000
     * Price can be between $1,400 and $1,800.
     *
     * Result is rounded to 1 decimal place.
     */
    const minBestValue = budget * 0.70;
    const maxBestValue = budget * 0.90;

    const bestValuePrice =
        Math.round(
            (Math.random() * (maxBestValue - minBestValue) + minBestValue) * 10
        ) / 10;

    const routes = [
        {
            id: 'fastest',
            title: {
                en: 'FASTEST ROUTE',
                vi: 'LỘ TRÌNH NHANH NHẤT'
            },
            icon: 'bolt',
            description: {
                en: 'Optimized primarily for the shortest total travel time.',
                vi: 'Tối ưu chủ yếu cho tổng thời gian di chuyển ngắn nhất.'
            },
            price: budget,
            priceLabel: {
                en: 'Estimated budget',
                vi: 'Ngân sách ước tính'
            },
            badge: {
                en: 'FASTEST',
                vi: 'NHANH NHẤT'
            }
        },
        {
            id: 'best-value',
            title: {
                en: 'BEST-VALUE ROUTE',
                vi: 'LỘ TRÌNH ĐÁNG GIÁ NHẤT'
            },
            icon: 'scale-balanced',
            description: {
                en: 'The best balance between travel cost, comfort and journey time.',
                vi: 'Cân bằng tốt nhất giữa chi phí, sự thoải mái và thời gian di chuyển.'
            },
            price: bestValuePrice,
            priceLabel: {
                en: 'Best-value estimate',
                vi: 'Chi phí tối ưu ước tính'
            },
            badge: {
                en: 'BEST VALUE',
                vi: 'ĐÁNG GIÁ NHẤT'
            }
        },
        {
            id: 'smart-stopover',
            title: {
                en: 'SMART STOPOVER',
                vi: 'DỪNG CHÂN THÔNG MINH'
            },
            icon: 'route',
            description: {
                en: 'Adds a strategic stopover to create a smoother and more flexible journey.',
                vi: 'Thêm điểm dừng chiến lược để tạo hành trình linh hoạt và thuận tiện hơn.'
            },
            price: Math.round(budget * 0.82 * 10) / 10,
            priceLabel: {
                en: 'Estimated budget',
                vi: 'Ngân sách ước tính'
            },
            badge: {
                en: 'SMART',
                vi: 'THÔNG MINH'
            }
        }
    ];

    routes.forEach((route) => {

        const routeCard = document.createElement('div');
        routeCard.className = `route-option-card route-${route.id}`;

        routeCard.innerHTML = `
            <div class="route-option-header">

                <div class="route-option-title">
                    <div class="route-option-icon">
                        <i class="fa-solid fa-${route.icon}"></i>
                    </div>

                    <div>
                        <span class="route-option-badge">
                            ${route.badge[lang]}
                        </span>

                        <h3>
                            ${route.title[lang]}
                        </h3>

                        <p>
                            ${route.description[lang]}
                        </p>
                    </div>
                </div>

                <div class="route-option-price">
                    <span>
                        ${route.priceLabel[lang]}
                    </span>

                    <strong>
                        $${route.price.toFixed(1)}
                    </strong>
                </div>

            </div>

            <div class="route-option-timeline">
                <div class="route-timeline-title">
                    <i class="fa-solid fa-route"></i>
                    <span>
                        ${lang === 'vi' ? 'Các chặng hành trình' : 'Journey stages'}
                    </span>
                </div>

                <div class="route-steps-list"></div>
            </div>
        `;

        const stepsContainer =
            routeCard.querySelector('.route-steps-list');

        /*
         * Reuse the existing mock route steps.
         * We do NOT modify mockData.js.
         */
        countryData.route.steps.forEach((step, index) => {

            const stepItem = document.createElement('div');

            stepItem.className =
                `route-mini-step step-${step.type}`;

            let tagLabel = '';

            if (
                step.type === 'flight' ||
                step.type === 'domestic-flight'
            ) {
                tagLabel = t('stepFlightTag', lang);
            }
            else if (step.type === 'transfer') {
                tagLabel = t('stepTransferTag', lang);
            }
            else if (step.type === 'hotel') {
                tagLabel = t('stepHotelTag', lang);
            }
            else if (step.type === 'explore') {
                tagLabel = t('stepExploreTag', lang);
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
                    </div>

                    <div class="route-mini-location">
                        <span>
                            ${step.from}
                        </span>

                        <i class="fa-solid fa-arrow-right-long"></i>

                        <span>
                            ${step.to}
                        </span>
                    </div>

                    <p>
                        ${step.subInfo[lang]}
                    </p>

                </div>
            `;

            stepsContainer.appendChild(stepItem);
        });

        elements.timelineList.appendChild(routeCard);
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
