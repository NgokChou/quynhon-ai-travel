/**
 * Quy Nhon AI Travel Assistant - Unified Travel & Budget Showroom Engine
 * Sprint C.4 Main Page Integration
 */


        function initGameBookingWizard() {
            const container = document.getElementById('pixi-map-container');
            const tooltip = document.getElementById('map-tooltip');
            const chipsGrid = document.getElementById('country-chips-grid');
            const departureAirportList = document.getElementById('departure-airport-list');
            const destinationAirportList = document.getElementById('destination-airport-list');
            const searchInput = document.getElementById('country-search-input');
            const searchDropdown = document.getElementById('search-dropdown');
            const toast = document.getElementById('toast-notify');
            const toastText = document.getElementById('toast-text');
            var toastTimer = null;

            const stepNumberBadge = document.getElementById('step-number-badge');
            const stepTitleText = document.getElementById('step-title-text');
            const crumbStep1 = document.getElementById('crumb-step-1');
            const crumbStep2 = document.getElementById('crumb-step-2');
            const step1View = document.getElementById('step-1-view');
            const step2View = document.getElementById('step-2-view');

            const btnToStep2 = document.getElementById('btn-to-step-2');
            const btnBackToStep1 = document.getElementById('btn-back-to-step-1');
            const btnConfirmFinal = document.getElementById('btn-confirm-final');
            const confirmModal = document.getElementById('confirm-modal');
            const btnCloseModal = document.getElementById('btn-close-modal');
            const modalRouteText = document.getElementById('modal-route-text');

            const summaryOrigCode = document.getElementById('summary-orig-code');
            const summaryOrigCity = document.getElementById('summary-orig-city');
            const summaryDestCode = document.getElementById('summary-dest-code');
            const summaryDestCity = document.getElementById('summary-dest-city');

            const valFps = document.getElementById('val-fps');
            const valZoom = document.getElementById('val-zoom');
            const valRoute = document.getElementById('val-route');

            let mapInstance = null;
            let currentCountry = window.SUPPORTED_COUNTRIES['DEU'];
            let currentDepartureAirport = currentCountry.airports[0];
            let currentDestination = window.VIETNAM_DESTINATIONS['UIH'];
            let currentStep = 1;

            // Initialize PixiJS Map Prototype
            mapInstance = new window.Map25DPrototype(container, {
                onReady: (inst) => {
                    window.mapInstance = inst;
                    console.log('Map25D Prototype Ready!');
                    renderCountryChips();
                    renderDepartureAirports(currentCountry);
                    renderDestinationAirports();
                    updateTelemetryAndSummary();
                },
                onHover: (country, isSupported, event) => {
                    if (currentStep !== 1) return; // Don't show world hover when focusing Vietnam destinations
                    const rect = container.getBoundingClientRect();
                    const x = event.data.global.x;
                    const y = event.data.global.y;

                    tooltip.style.left = (rect.left + x) + 'px';
                    tooltip.style.top = (rect.top + y) + 'px';
                    tooltip.style.display = 'block';

                    const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
                    if (isSupported) {
                        const sup = window.SUPPORTED_COUNTRIES[country.id];
                        const countryTitle = isVi ? `${sup.vi} (${sup.name})` : sup.name;
                        const aptText = isVi ? `✈ Hỗ trợ ${sup.airports.length} sân bay quốc tế` : `✈ ${sup.airports.length} international airport${sup.airports.length > 1 ? 's' : ''}`;
                        tooltip.innerHTML = `<strong>${sup.flag} ${countryTitle}</strong><br><span style="color:#ffd700;font-size:11px;">${aptText}</span>`;
                    } else {
                        const countryTitle = isVi ? `${country.name} (${country.vi || country.id})` : country.name;
                        const noRouteText = isVi ? 'Chưa có tuyến bay trực tiếp' : 'No direct flight routes available';
                        tooltip.innerHTML = `<strong>${countryTitle}</strong><br><span style="color:#8ea2b9;font-size:11px;">${noRouteText}</span>`;
                    }
                },
                onDestinationHover: (dest, event) => {
                    if (currentStep !== 2) return;
                    const rect = container.getBoundingClientRect();
                    const x = event && event.data ? event.data.global.x : null;
                    const y = event && event.data ? event.data.global.y : null;
                    if (x !== null && y !== null) {
                        tooltip.style.left = (rect.left + x) + 'px';
                        tooltip.style.top = (rect.top + y) + 'px';
                        tooltip.style.display = 'block';
                    }
                    const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
                    const destName = typeof dest.name === 'object' ? (isVi ? dest.name.vi : dest.name.en) : dest.name;
                    const destCity = typeof dest.city === 'object' ? (isVi ? dest.city.vi : dest.city.en) : dest.city;
                    const destDesc = typeof dest.desc === 'object' ? (isVi ? dest.desc.vi : dest.desc.en) : dest.desc;
                    tooltip.innerHTML = `<strong>✈ ${destName} (${dest.code})</strong><br><span style="color:#00e5ff;font-size:11px;">📍 ${destCity} • ${destDesc}</span>`;
                },
                onDestinationHoverOut: () => {
                    tooltip.style.display = 'none';
                },
                onHoverOut: () => {
                    tooltip.style.display = 'none';
                },
                onSelect: (countryInfo) => {
                    currentCountry = countryInfo;
                    currentDepartureAirport = countryInfo.airports[0];

                    // Auto-select currency & dynamic minimum budget based on origin country
                    const countryLimits = (window.COUNTRY_BUDGET_LIMITS && window.COUNTRY_BUDGET_LIMITS[countryInfo.code]) || { minUSD: 500, currency: 'USD' };
                    currentCurrency = countryLimits.currency;
                    if (currentBudgetUSD < countryLimits.minUSD) {
                        currentBudgetUSD = countryLimits.minUSD;
                    }

                    renderCurrencyChips();
                    updateActiveChip(countryInfo.code);
                    renderDepartureAirports(countryInfo);
                    updateTelemetryAndSummary();
                    syncBudgetUI();
                    notifyAppState();
                },
                onDestinationSelect: (destInfo) => {
                    currentDestination = destInfo;
                    updateDestinationCardsUI();
                    updateTelemetryAndSummary();
                    notifyAppState();
                },
                onNonSupportedClick: (country) => {
                    const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
                    showToast(isVi 
                        ? `Tuyến bay từ ${country.name} (${country.vi || country.id}) hiện đang được cập nhật lịch trình.`
                        : `Flight routes from ${country.name} are currently being updated.`);
                },
                onFpsUpdate: (fps, scale) => {
                    valFps.textContent = fps;
                    valZoom.textContent = scale.toFixed(1) + 'x';
                }
            });

            
            function notifyAppState() {
                if (!currentCountry) return;
                const countryKey = (window.COUNTRY_MAP_KEY && window.COUNTRY_MAP_KEY[currentCountry.code]) || 'germany';
                const meta = {
                    originIso: currentCountry.code,
                    originAirport: currentDepartureAirport,
                    originCountryName: currentCountry.name,
                    originCountryVi: currentCountry.vi,
                    isFallback: ['GBR', 'KOR', 'SGP', 'CHN', 'VNM'].includes(currentCountry.code)
                };
                if (window.App && typeof window.App.setPlannerData === 'function') {
                    const arrCode = currentDestination ? currentDestination.code : 'UIH';
                    window.App.setPlannerData(countryKey, currentBudgetUSD, arrCode, currentDepartureAirport ? currentDepartureAirport.code : null, meta);
                }
            }

            function updateGenerateButtonLabels(days, lang) {
                const isVi = (lang === 'vi');
                const d = days || currentDays || 5;
                const launchBtn = document.getElementById('btn-launch-final-plan');
                if (launchBtn && !launchBtn.disabled) {
                    const text = isVi ? `KHỞI TẠO KẾ HOẠCH ${d} NGÀY` : `GENERATE MY ${d}-DAY PLAN`;
                    launchBtn.innerHTML = `<span>${text}</span> <i class="fa-solid fa-paper-plane"></i>`;
                }
                const btnGenText = document.getElementById('btn-generate-itinerary-text');
                if (btnGenText) {
                    btnGenText.textContent = isVi
                        ? (`Khởi Tạo Kế Hoạch ${d} Ngày Bằng AI`)
                        : (`Generate My ${d}-Day Plan`);
                }
            }

            function updateDaysItinerary() {
                if (window.App && typeof window.App.getState === 'function') {
                    window.App.getState().durationDays = currentDays;
                }
                const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
                const itinSubtitle = document.getElementById('itinerary-pref-subtitle');
                if (itinSubtitle) {
                    itinSubtitle.textContent = isVi 
                        ? ('Chọn những trải nghiệm bạn yêu thích để AI tạo hành trình ' + currentDays + ' ngày tại Quy Nhơn.')
                        : ('Tell us what you enjoy and we\'ll create a personalized ' + currentDays + '-day journey in Quy Nhon.');
                }
                updateGenerateButtonLabels(currentDays, isVi ? 'vi' : 'en');
                if (window.App && typeof window.App.markPlanStale === 'function') {
                    window.App.markPlanStale();
                }
            }

            // 1. Render 11 Supported Departure Country Chips
            function renderCountryChips() {
                chipsGrid.innerHTML = '';
                const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
                Object.values(window.SUPPORTED_COUNTRIES).forEach(c => {
                    const chip = document.createElement('div');
                    chip.className = 'country-chip' + (c.code === currentCountry.code ? ' selected' : '');
                    chip.dataset.code = c.code;
                    const countryName = isVi ? (c.vi || c.name) : c.name;
                    chip.innerHTML = `
                        <span class="flag">${c.flag}</span>
                        <span class="name">${countryName}</span>
                    `;
                    chip.addEventListener('click', () => {
                        mapInstance.selectCountry(c.code, true);
                    });
                    chipsGrid.appendChild(chip);
                });
            }

            function updateActiveChip(countryCode) {
                document.querySelectorAll('.country-chip').forEach(chip => {
                    if (chip.dataset.code === countryCode) {
                        chip.classList.add('selected');
                    } else {
                        chip.classList.remove('selected');
                    }
                });
            }

            // 2. Render Departure Airport Cards
            function renderDepartureAirports(countryInfo) {
                if (!countryInfo) return;
                departureAirportList.innerHTML = '';
                const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;

                countryInfo.airports.forEach((apt, idx) => {
                    const card = document.createElement('div');
                    const isSelected = (apt.code === currentDepartureAirport.code);
                    card.className = 'airport-card' + (isSelected ? ' selected' : '');
                    const aptName = typeof apt.name === 'object' ? (isVi ? apt.name.vi : apt.name.en) : apt.name;
                    const aptCity = typeof apt.city === 'object' ? (isVi ? apt.city.vi : apt.city.en) : apt.city;
                    const aptDesc = typeof apt.desc === 'object' ? (isVi ? apt.desc.vi : apt.desc.en) : (apt.desc || aptCity);
                    card.innerHTML = `
                        <div class="airport-info-left">
                            <div class="airport-code-badge">${apt.code}</div>
                            <div class="airport-details">
                                <div class="name">${aptName}</div>
                                <div class="desc">${aptDesc}</div>
                            </div>
                        </div>
                        <div class="airport-radio"></div>
                    `;
                    card.addEventListener('click', () => {
                        currentDepartureAirport = apt;
                        document.querySelectorAll('.airport-card').forEach(c => c.classList.remove('selected'));
                        card.classList.add('selected');
                        updateTelemetryAndSummary();

                        // Short visual feedback before automatic transition
                        card.style.borderColor = '#ffd700';
                        card.style.boxShadow = '0 0 16px rgba(255, 215, 0, 0.45)';
                        showToast(isVi ? `✈ Đã chọn ${apt.code} (${aptCity}) – Đang tự động chuyển đến Việt Nam...` : `✈ Selected ${apt.code} (${aptCity}) – Advancing to Vietnam...`);
                        notifyAppState();
                        // Auto-advance to Vietnam Step 2 without needing extra button click
                        setTimeout(() => {
                            goToStep2();
                        }, 400);
                    });
                    departureAirportList.appendChild(card);
                });
            }

            // 3. Render Vietnam Destination Airport Cards
            function renderDestinationAirports() {
                destinationAirportList.innerHTML = '';
                const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;

                Object.values(window.VIETNAM_DESTINATIONS).forEach(dest => {
                    const card = document.createElement('div');
                    const isSelected = (dest.code === currentDestination.code);
                    card.className = 'destination-card' + (isSelected ? ' selected' : '') + (dest.isHero ? ' is-hero' : '');
                    card.dataset.code = dest.code;
                    const destName = typeof dest.name === 'object' ? (isVi ? dest.name.vi : dest.name.en) : dest.name;
                    const destCity = typeof dest.city === 'object' ? (isVi ? dest.city.vi : dest.city.en) : dest.city;
                    const destDesc = typeof dest.desc === 'object' ? (isVi ? dest.desc.vi : dest.desc.en) : dest.desc;
                    card.innerHTML = `
                        <div class="airport-info-left">
                            <div class="airport-code-badge dest-badge">${dest.code}</div>
                            <div class="airport-details">
                                <div class="name">${destName} (${destCity})</div>
                                <div class="desc">${destDesc}</div>
                            </div>
                        </div>
                        <div class="airport-radio"></div>
                    `;
                    card.addEventListener('click', () => {
                        currentDestination = dest;
                        mapInstance.selectDestination(dest.code);
                        updateDestinationCardsUI();
                        updateTelemetryAndSummary();
                        notifyAppState();
                    });
                    destinationAirportList.appendChild(card);
                });
            }

            function updateDestinationCardsUI() {
                document.querySelectorAll('.destination-card').forEach(card => {
                    if (card.dataset.code === currentDestination.code) {
                        card.classList.add('selected');
                    } else {
                        card.classList.remove('selected');
                    }
                });
            }

            // 4. Update Telemetry Pill & Itinerary Summary
            function updateTelemetryAndSummary() {
                const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
                const origCode = currentDepartureAirport ? currentDepartureAirport.code : 'FRA';
                const rawOrigCity = currentDepartureAirport ? (currentDepartureAirport.city || currentCountry.name) : 'Frankfurt';
                const origCity = typeof rawOrigCity === 'object' ? (isVi ? rawOrigCity.vi : rawOrigCity.en) : rawOrigCity;
                const destCode = currentDestination ? currentDestination.code : 'UIH';
                const rawDestCity = currentDestination ? (currentDestination.city || 'Quy Nhon') : 'Quy Nhon';
                const destCity = typeof rawDestCity === 'object' ? (isVi ? rawDestCity.vi : rawDestCity.en) : (isVi ? 'Quy Nhơn' : 'Quy Nhon');

                valRoute.textContent = `${origCode} → ${destCode}`;
                summaryOrigCode.textContent = origCode;
                const origCountryName = isVi ? (currentCountry.vi || currentCountry.name) : currentCountry.name;
                summaryOrigCity.textContent = `${origCity} (${origCountryName})`;
                summaryDestCode.textContent = destCode;
                summaryDestCity.textContent = `${destCity} (${isVi ? 'Việt Nam' : 'Vietnam'})`;

                // Update Showroom Route Pill
                if (showroomRouteText) {
                    showroomRouteText.textContent = `${origCode} ➔ ${destCode}`;
                }

                // Update Confirmed Modal Route Text
                if (modalRouteText) {
                    modalRouteText.textContent = `${origCode} (${origCity}) ➔ ${destCode} (${destCity})`;
                }
            }

            // =================================================================
            // STEP 3: BUDGET & 3D AIRCRAFT SHOWROOM LOGIC
            // =================================================================
            const crumbStep3 = document.getElementById('crumb-step-3');
            const step3View = document.getElementById('step-3-view');
            const mapSection = document.getElementById('stage-map-section') || document.getElementById('map-section');
            const showroomSection = document.getElementById('showroom-section');
            const btnBackToStep2 = document.getElementById('btn-back-to-step-2');
            const btnLaunchFinalPlan = document.getElementById('btn-launch-final-plan');

            const currencyChipsGrid = document.getElementById('currency-chips-grid');
            const budgetNumberInput = document.getElementById('budget-number-input');
            const budgetRangeSlider = document.getElementById('budget-range-slider');
            const budgetCurSymbol = document.getElementById('budget-cur-symbol');
            const budgetCurCode = document.getElementById('budget-cur-code');
            const budgetUsdPill = document.getElementById('budget-usd-pill');
            const sliderMinLabel = document.getElementById('slider-min-label');
            const sliderMaxLabel = document.getElementById('slider-max-label');
            const presetChipsRow = document.getElementById('preset-chips-row');

            const btnGuestMinus = document.getElementById('btn-guest-minus');
            const btnGuestPlus = document.getElementById('btn-guest-plus');
            const valGuests = document.getElementById('val-guests');
            const btnDaysMinus = document.getElementById('btn-days-minus');
            const btnDaysPlus = document.getElementById('btn-days-plus');
            const valDays = document.getElementById('val-days');

            const expTierCard = document.getElementById('exp-tier-card');
            const expTierBadge = document.getElementById('exp-tier-badge');
            const expTierUsdRange = document.getElementById('exp-tier-usd-range');
            const expTierDesc = document.getElementById('exp-tier-desc');

            const allocProgressBar = document.getElementById('alloc-progress-bar');
            const allocItemsGrid = document.getElementById('alloc-items-grid');
            const allocCheckPill = document.getElementById('alloc-check-pill');

            const hudTierTag = document.getElementById('hud-tier-tag');
            const hudModelName = document.getElementById('hud-model-name');
            const hudSpecPill = document.getElementById('hud-spec-pill');
            const showroomRouteText = document.getElementById('showroom-route-text');

            // Budget State
            let currentBudgetUSD = 2500;
            let currentCurrency = 'USD';
            let currentGuests = 1;
            let currentDays = 5;
            let showroomViewport = null;

            // Resilient Web Audio context unlock on user interaction
            function unlockAudio() {
                if (showroomViewport && showroomViewport.audio) {
                    showroomViewport.audio.init();
                    if (showroomViewport.audio.ctx && showroomViewport.audio.ctx.state === 'suspended') {
                        showroomViewport.audio.ctx.resume().catch(() => {});
                    }
                }
            }
            window.addEventListener('pointerdown', unlockAudio, { passive: true });
            window.addEventListener('touchstart', unlockAudio, { passive: true });
            window.addEventListener('keydown', unlockAudio, { passive: true });

                        function renderCurrencyChips() {
                if (!currencyChipsGrid) return;
                currencyChipsGrid.innerHTML = '';
                Object.keys(window.CURRENCIES).forEach(cKey => {
                    const c = window.CURRENCIES[cKey];
                    const chip = document.createElement('div');
                    chip.className = 'cur-chip' + (cKey === currentCurrency ? ' active' : '');
                    chip.dataset.currency = cKey;
                    chip.innerHTML = c.label;
                    chip.addEventListener('click', () => {
                        currentCurrency = cKey;
                        document.querySelectorAll('.cur-chip').forEach(el => el.classList.remove('active'));
                        chip.classList.add('active');
                        syncBudgetUI();
                    });
                    currencyChipsGrid.appendChild(chip);
                });
            }

            // Render Static Controls on Init
            function initStep3Controls() {
                // Currency Chips
                renderCurrencyChips();

                // Preset Chips ($500, $2500, $8000, $20000, $50000)
                presetChipsRow.innerHTML = '';
                window.TIERS.forEach(t => {
                    const chip = document.createElement('div');
                    chip.className = `preset-chip ${t.presetUSD === currentBudgetUSD ? 'active' : ''}`;
                    chip.dataset.usd = t.presetUSD;
                    chip.innerHTML = `
                        <strong>$${t.presetUSD.toLocaleString()}</strong>
                        <small>L${t.level}</small>
                    `;
                    chip.addEventListener('click', () => {
                        currentBudgetUSD = t.presetUSD;
                        if (showroomViewport && showroomViewport.controller) {
                            showroomViewport.controller.setBudgetUSD(currentBudgetUSD, true);
                        }
                        syncBudgetUI();
                        notifyAppState();
                    });
                    presetChipsRow.appendChild(chip);
                });

                // Steppers: Guests
                btnGuestMinus.addEventListener('click', () => {
                    if (currentGuests > window.BUDGET_CONFIG.minGuests) {
                        currentGuests--;
                        syncBudgetUI();
                        notifyAppState();
                    }
                });
                btnGuestPlus.addEventListener('click', () => {
                    if (currentGuests < window.BUDGET_CONFIG.maxGuests) {
                        currentGuests++;
                        syncBudgetUI();
                        notifyAppState();
                    }
                });

                // Steppers: Days (clamped strictly between 1 and 7 days)
                btnDaysMinus.addEventListener('click', () => {
                    if (currentDays > 1) {
                        currentDays--;
                        syncBudgetUI();
                        updateDaysItinerary();
                        notifyAppState();
                    }
                });
                btnDaysPlus.addEventListener('click', () => {
                    if (currentDays < 7) {
                        currentDays++;
                        syncBudgetUI();
                        updateDaysItinerary();
                        notifyAppState();
                    }
                });

                // Range Slider Input Handler
                budgetRangeSlider.addEventListener('input', (e) => {
                    const rawVal = parseFloat(e.target.value) || 2500;
                    const cur = window.CURRENCIES[currentCurrency] || window.CURRENCIES.USD;
                    const countryCode = currentCountry ? currentCountry.code : 'DEU';
                    const countryLimits = (window.COUNTRY_BUDGET_LIMITS && window.COUNTRY_BUDGET_LIMITS[countryCode]) || { minUSD: 500 };
                    const minUSD = countryLimits.minUSD;
                    currentBudgetUSD = Math.round(rawVal / cur.rate);
                    currentBudgetUSD = Math.max(minUSD, Math.min(50000, currentBudgetUSD));

                    if (showroomViewport && showroomViewport.controller) {
                        showroomViewport.controller.setBudgetUSD(currentBudgetUSD, true);
                    }
                    syncBudgetUI(false);
                    notifyAppState();
                });

                // Numeric Input Handler
                budgetNumberInput.addEventListener('input', (e) => {
                    const cleanStr = e.target.value.replace(/[^0-9]/g, '');
                    if (!cleanStr) return;
                    let val = parseFloat(cleanStr) || 0;
                    const cur = window.CURRENCIES[currentCurrency] || window.CURRENCIES.USD;
                    const countryCode = currentCountry ? currentCountry.code : 'DEU';
                    const countryLimits = (window.COUNTRY_BUDGET_LIMITS && window.COUNTRY_BUDGET_LIMITS[countryCode]) || { minUSD: 500 };
                    const minUSD = countryLimits.minUSD;
                    let targetUSD = Math.round(val / cur.rate);
                    if (targetUSD > 50000) targetUSD = 50000;
                    if (targetUSD < minUSD) targetUSD = minUSD;
                    currentBudgetUSD = targetUSD;

                    if (showroomViewport && showroomViewport.controller) {
                        showroomViewport.controller.setBudgetUSD(currentBudgetUSD, true);
                    }
                    syncBudgetUI(true, false);
                    notifyAppState();
                });

                budgetNumberInput.addEventListener('blur', () => {
                    syncBudgetUI();
                });
                budgetNumberInput.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter') {
                        budgetNumberInput.blur();
                    }
                });

                // Buttons wiring
                btnBackToStep2.addEventListener('click', goToStep2);
                crumbStep3.addEventListener('click', () => { if (currentStep !== 3) goToStep3(); });

                // Sound Toggle Button
                const btnSoundToggle = document.getElementById('btn-sound-toggle');
                const soundIcon = document.getElementById('sound-icon');
                const soundLabel = document.getElementById('sound-label');

                if (btnSoundToggle) {
                    btnSoundToggle.addEventListener('click', (e) => {
                        e.stopPropagation();
                        if (showroomViewport && showroomViewport.audio) {
                            const isEnabled = showroomViewport.audio.toggle();
                            if (isEnabled) {
                                btnSoundToggle.classList.remove('muted');
                                if (soundIcon) soundIcon.className = 'fa-solid fa-volume-high';
                                const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
                                if (soundLabel) soundLabel.textContent = isVi ? 'ÂM THANH' : 'SOUND';
                            } else {
                                btnSoundToggle.classList.add('muted');
                                if (soundIcon) soundIcon.className = 'fa-solid fa-volume-xmark';
                                const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
                                if (soundLabel) soundLabel.textContent = isVi ? 'TẮT' : 'MUTED';
                            }
                        }
                    });
                }

                btnLaunchFinalPlan.addEventListener('click', () => {
                    if (btnLaunchFinalPlan.disabled) return;

                    const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;

                    // 1. Validate inputs
                    if (!currentCountry) {
                        showToast(isVi ? 'Vui lòng chọn quốc gia khởi hành.' : 'Please select a departure country.');
                        goToStep1();
                        return;
                    }
                    if (!currentDepartureAirport) {
                        showToast(isVi ? 'Vui lòng chọn sân bay khởi hành.' : 'Please select a departure airport.');
                        goToStep1();
                        return;
                    }
                    if (!currentDestination) {
                        showToast(isVi ? 'Vui lòng chọn điểm đến tại Việt Nam.' : 'Please select an arrival destination in Vietnam.');
                        goToStep2();
                        return;
                    }

                    if (showroomViewport && showroomViewport.audio) {
                        try { showroomViewport.audio.playCoinDrop(); } catch (_) {}
                    }

                    const isoCode = (currentCountry && currentCountry.code) ? currentCountry.code : 'DEU';
                    const isoToKeyMap = {
                        'JPN': 'japan',
                        'DEU': 'germany',
                        'USA': 'usa',
                        'FRA': 'france',
                        'BEL': 'belgium',
                        'AUS': 'australia',
                        'GBR': 'germany',
                        'KOR': 'japan',
                        'SGP': 'japan',
                        'CHN': 'japan',
                        'VNM': 'japan'
                    };
                    const countryKey = isoToKeyMap[isoCode] || 'germany';
                    const arrCode = (currentDestination && currentDestination.code) ? currentDestination.code : 'UIH';
                    const isFallbackCountry = ['GBR', 'KOR', 'SGP', 'CHN', 'VNM'].includes(isoCode);
                    const meta = {
                        originIso: isoCode,
                        originAirport: currentDepartureAirport,
                        originCountryName: currentCountry ? currentCountry.name : isoCode,
                        originCountryVi: currentCountry ? currentCountry.vi : isoCode,
                        isFallback: isFallbackCountry
                    };

                    const app = window.App;
                    if (app) {
                        const appState = typeof app.getState === 'function' ? app.getState() : null;
                        if (appState) {
                            appState.currentCountryKey = countryKey;
                            appState.currentBudget = currentBudgetUSD;
                            appState.travelers = currentGuests;
                            appState.durationDays = currentDays;
                            appState.originIso = isoCode;
                            appState.originAirport = currentDepartureAirport;
                            appState.originCountryName = currentCountry ? currentCountry.name : isoCode;
                            appState.originCountryVi = currentCountry ? currentCountry.vi : isoCode;
                            appState.isFallback = isFallbackCountry;
                            appState.currentDestination = arrCode;
                        }
                        const cSelect = document.getElementById('country-select');
                        if (cSelect) cSelect.value = countryKey;
                        const bSelect = document.getElementById('budget-select');
                        if (bSelect) {
                            const hasOpt = Array.from(bSelect.options).some(o => o.value === String(currentBudgetUSD));
                            if (hasOpt) {
                                bSelect.value = String(currentBudgetUSD);
                            } else {
                                bSelect.value = 'custom';
                                const cInput = document.getElementById('custom-budget-input');
                                if (cInput) cInput.value = currentBudgetUSD.toLocaleString('en-US');
                                const grp = document.getElementById('custom-budget-container') || document.getElementById('custom-budget-group');
                                if (grp) grp.style.display = 'block';
                            }
                        }

                        // Trigger Plan Generation with loading state
                        if (typeof app.generateJourneyPlan === 'function') {
                            app.generateJourneyPlan(true);
                        }
                    }
                });
            }

            // Sync Budget UI elements (Inputs, slider, allocations, tier cards, HUD)
            function syncBudgetUI(updateSlider = true, updateInput = true) {
                const cur = window.CURRENCIES[currentCurrency] || window.CURRENCIES.USD;
                const converted = currentBudgetUSD * cur.rate;
                const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
                const curTier = window.getTierForUSD(currentBudgetUSD, isVi ? 'vi' : 'en');

                // Currency symbol & code
                budgetCurSymbol.textContent = cur.symbol;
                budgetCurCode.textContent = currentCurrency;

                // Converted text input
                if (updateInput) {
                    budgetNumberInput.value = Math.round(converted).toLocaleString('en-US');
                }

                // Equivalent USD Pill
                if (currentCurrency === 'USD') {
                    budgetUsdPill.textContent = isVi ? 'Đơn vị cơ sở' : 'Base currency';
                } else {
                    budgetUsdPill.textContent = `≈ $${currentBudgetUSD.toLocaleString()} USD`;
                }

                // Dynamic country minimum budget bounds
                const countryCode = currentCountry ? currentCountry.code : 'DEU';
                const countryLimits = (window.COUNTRY_BUDGET_LIMITS && window.COUNTRY_BUDGET_LIMITS[countryCode]) || { minUSD: 500, currency: 'USD' };
                const countryMinUSD = countryLimits.minUSD;

                // Range slider bounds and value
                const minSlider = Math.round(countryMinUSD * cur.rate);
                const maxSlider = Math.round(50000 * cur.rate);
                budgetRangeSlider.min = minSlider;
                budgetRangeSlider.max = maxSlider;
                budgetRangeSlider.step = cur.rate > 100 ? 50000 : 100;
                if (updateSlider) {
                    budgetRangeSlider.value = Math.round(converted);
                }
                sliderMinLabel.textContent = window.formatCurrency(countryMinUSD, currentCurrency);
                sliderMaxLabel.textContent = window.formatCurrency(50000, currentCurrency);

                // Update Preset Chips Active State
                document.querySelectorAll('.preset-chip').forEach(chip => {
                    const pUsd = parseFloat(chip.dataset.usd);
                    chip.classList.toggle('active', Math.abs(pUsd - currentBudgetUSD) < 20);
                });

                // Steppers UI
                valGuests.textContent = isVi ? (currentGuests + ' khách') : (currentGuests + (currentGuests > 1 ? ' guests' : ' guest'));
                valDays.textContent = isVi ? (currentDays + ' ngày') : (currentDays + (currentDays > 1 ? ' days' : ' day'));

                // Tier Experience Card
                expTierBadge.textContent = curTier.badge;
                expTierBadge.style.color = '#' + curTier.colorHex.toString(16).padStart(6, '0');
                expTierUsdRange.textContent = '$' + curTier.minUSD.toLocaleString() + ' – $' + curTier.maxUSD.toLocaleString() + ' USD';
                expTierDesc.textContent = curTier.experience;
                expTierCard.style.borderColor = '#' + curTier.colorHex.toString(16).padStart(6, '0') + '55';

                // Calculate 6-Category Allocation with country airfare factor & exact 100% closure
                const allocResult = window.BudgetTripCalculator.calculateAllocation(currentBudgetUSD, currentGuests, currentDays, countryCode);

                const catNames = {
                    flight: isVi ? 'Vé Máy Bay' : 'Airfare',
                    stay: isVi ? 'Lưu Trú (Khách sạn/Resort)' : 'Accommodation',
                    food: isVi ? 'Ăn Uống & Ẩm Thực' : 'Food & Dining',
                    transit: isVi ? 'Di Chuyển Nội Địa' : 'Local Transit',
                    activities: isVi ? 'Hoạt Động & Trải Nghiệm' : 'Activities & Tours',
                    buffer: isVi ? 'Quỹ Dự Phòng' : 'Contingency'
                };

                // Multi-segment progress bar
                allocProgressBar.innerHTML = allocResult.categories.map(c => {
                    const localizedName = catNames[c.id] || c.name;
                    return '<div class="alloc-seg" style="width: ' + c.pct + '%; background: ' + c.color + ';" title="' + localizedName + ': ' + window.formatCurrency(c.amountUSD, currentCurrency) + ' (' + c.pct + '%)"></div>';
                }).join('');

                // Categories list cards
                allocItemsGrid.innerHTML = allocResult.categories.map(c => {
                    const localizedName = catNames[c.id] || c.name;
                    return '<div class="alloc-item-card">' +
                        '<div class="alloc-item-top">' +
                            '<span><i class="fa-solid ' + c.icon + '" style="color: ' + c.color + ';"></i> ' + localizedName + '</span>' +
                            '<small>' + c.pct + '%</small>' +
                        '</div>' +
                        '<div class="alloc-item-amount">' + window.formatCurrency(c.amountUSD, currentCurrency) + '</div>' +
                    '</div>';
                }).join('');

                allocCheckPill.innerHTML = '<i class="fa-solid fa-check"></i> ' + (isVi ? '100% Khép kín' : '100% Balanced') + ' ($' + allocResult.totalUSD.toLocaleString() + ' USD)';

                // 3D Showroom HUD Overlay
                if (hudTierTag) {
                    hudTierTag.textContent = curTier.badge;
                    hudTierTag.style.color = `#${curTier.colorHex.toString(16).padStart(6, '0')}`;
                }
                if (hudModelName) {
                    hudModelName.textContent = curTier.modelName;
                }
                if (hudSpecPill) {
                    hudSpecPill.textContent = curTier.specDesc || curTier.experience;
                }

                // Sticky Bottom Action Bar Sync (Casual Tycoon Console)
                const stickyBudgetAmount = document.getElementById('sticky-budget-amount');
                const stickyBudgetCurrency = document.getElementById('sticky-budget-currency');
                if (stickyBudgetAmount) {
                    stickyBudgetAmount.textContent = window.formatCurrency(currentBudgetUSD, currentCurrency);
                }
                if (stickyBudgetCurrency) {
                    stickyBudgetCurrency.textContent = currentCurrency;
                }
            }

            // =================================================================
            // STEP TRANSITIONS: STEP 1 <-> STEP 2 <-> STEP 3
            // =================================================================

            // Transition to Step 3 (Budget & 3D Aircraft Showroom)
            function goToStep3() {
                currentStep = 3;
                stepNumberBadge.textContent = '3';
                const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
                stepTitleText.textContent = isVi ? 'Cấu Hình Ngân Sách & Phi Cơ 3D' : 'Configure Budget & 3D Aircraft';

                crumbStep1.className = 'crumb-item completed';
                crumbStep2.className = 'crumb-item completed';
                crumbStep3.className = 'crumb-item active';

                step1View.style.display = 'none';
                step2View.style.display = 'none';
                step3View.style.display = 'flex';

                mapSection.style.display = 'none';
                showroomSection.style.display = 'block';

                // PAUSE PixiJS Ticker to avoid dual WebGL GPU overhead
                if (mapInstance && mapInstance.app && mapInstance.app.ticker) {
                    mapInstance.app.ticker.stop();
                }

                // Initialize or Resume Three.js Viewport
                if (!showroomViewport) {
                    showroomViewport = new window.AircraftShowroomViewport();
                    showroomViewport.init(document.getElementById('showroom-canvas-container'));
                    window.showroomViewport = showroomViewport;
                } else {
                    showroomViewport.resume();
                    showroomViewport.handleResize();
                }

                if (showroomViewport && showroomViewport.controller) {
                    showroomViewport.controller.setBudgetUSD(currentBudgetUSD, false);
                }

                unlockAudio();
                updateTelemetryAndSummary();
                syncBudgetUI();
            }

            // Transition to Step 2 (Select Vietnam Destination)
            function goToStep2() {
                currentStep = 2;
                stepNumberBadge.textContent = '2';
                const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
                stepTitleText.textContent = isVi ? 'Chọn Sân Bay Đến Tại Việt Nam' : 'Select Arrival Airport in Vietnam';

                crumbStep1.className = 'crumb-item completed';
                crumbStep2.className = 'crumb-item active';
                crumbStep3.className = 'crumb-item';

                step1View.style.display = 'none';
                step2View.style.display = 'flex';
                step3View.style.display = 'none';

                showroomSection.style.display = 'none';
                mapSection.style.display = 'block';

                // PAUSE Three.js Loop & RESUME PixiJS Ticker
                if (showroomViewport) {
                    showroomViewport.pause();
                }
                if (mapInstance && mapInstance.app && mapInstance.app.ticker) {
                    mapInstance.app.ticker.start();
                    mapInstance.flyToVietnam();
                }

                updateTelemetryAndSummary();
            }

            // Transition Back to Step 1 (Select Departure)
            function goToStep1() {
                currentStep = 1;
                stepNumberBadge.textContent = '1';
                const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
                stepTitleText.textContent = isVi ? 'Chọn Điểm Khởi Hành' : 'Select Departure Location';

                crumbStep1.className = 'crumb-item active';
                crumbStep2.className = 'crumb-item';
                crumbStep3.className = 'crumb-item';

                step1View.style.display = 'flex';
                step2View.style.display = 'none';
                step3View.style.display = 'none';

                showroomSection.style.display = 'none';
                mapSection.style.display = 'block';

                // PAUSE Three.js Loop & RESUME PixiJS Ticker
                if (showroomViewport) {
                    showroomViewport.pause();
                }
                if (mapInstance && mapInstance.app && mapInstance.app.ticker) {
                    mapInstance.app.ticker.start();
                    mapInstance.flyToWorld();
                }

                updateTelemetryAndSummary();
            }

            // Buttons wiring
            btnToStep2.addEventListener('click', goToStep2);
            btnBackToStep1.addEventListener('click', goToStep1);
            crumbStep1.addEventListener('click', () => { if (currentStep !== 1) goToStep1(); });
            crumbStep2.addEventListener('click', () => { if (currentStep !== 2) goToStep2(); });

            btnConfirmFinal.addEventListener('click', () => {
                goToStep3();
            });

            btnCloseModal.addEventListener('click', () => {
                confirmModal.classList.remove('show');
                goToStep3();
            });

            // Initialize Step 3 UI Controls
            initStep3Controls();

            // Autocomplete Search Logic
            searchInput.addEventListener('input', (e) => {
                const isVi = (window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
                const query = e.target.value.trim().toLowerCase();
                if (!query) {
                    searchDropdown.style.display = 'none';
                    return;
                }

                const supported = Object.values(window.SUPPORTED_COUNTRIES);
                const matches = supported.filter(c => 
                    c.name.toLowerCase().includes(query) || 
                    c.vi.toLowerCase().includes(query) ||
                    c.code.toLowerCase().includes(query)
                );

                if (matches.length === 0) {
                    searchDropdown.innerHTML = `<div style="padding:12px;font-size:12px;color:#64748b;">${isVi ? 'Không tìm thấy quốc gia phù hợp trong 11 nước hỗ trợ.' : 'No matching country found among the 11 supported countries.'}</div>`;
                    searchDropdown.style.display = 'block';
                    return;
                }

                searchDropdown.innerHTML = '';
                matches.forEach(m => {
                    const item = document.createElement('div');
                    item.className = 'search-item';
                    const countryDisplay = isVi ? `<strong>${m.vi}</strong> (${m.name})` : `<strong>${m.name}</strong> (${m.code})`;
                    item.innerHTML = `
                        <div>${m.flag} ${countryDisplay}</div>
                        <span class="tag">${m.airports.length} ${isVi ? 'sân bay' : 'airports'}</span>
                    `;
                    item.addEventListener('click', () => {
                        searchInput.value = isVi ? m.vi : m.name;
                        searchDropdown.style.display = 'none';
                        searchInput.blur(); // Dismiss mobile on-screen keyboard
                        mapInstance.selectCountry(m.code, true);
                    });
                    searchDropdown.appendChild(item);
                });
                searchDropdown.style.display = 'block';
            });

            document.addEventListener('click', (e) => {
                if (!searchInput.contains(e.target) && !searchDropdown.contains(e.target)) {
                    searchDropdown.style.display = 'none';
                }
            });

            // Map Zoom Controls
            document.getElementById('btn-zoom-in').addEventListener('click', () => mapInstance.zoomIn());
            document.getElementById('btn-zoom-out').addEventListener('click', () => mapInstance.zoomOut());
            document.getElementById('btn-reset-view').addEventListener('click', () => {
                if (currentStep === 2) mapInstance.flyToVietnam();
                else mapInstance.resetView();
            });
            document.getElementById('btn-fullscreen').addEventListener('click', () => {
                if (!document.fullscreenElement) {
                    if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen().catch(() => {});
                    }
                } else {
                    if (document.exitFullscreen) {
                        document.exitFullscreen().catch(() => {});
                    }
                }
            });

            // Multi-Language Synchronization
            function updateWizardLanguage(lang) {
                const isVi = (lang === 'vi');
                if (currentStep === 1) {
                    stepTitleText.textContent = isVi ? 'Chọn Điểm Khởi Hành' : 'Select Departure Location';
                } else if (currentStep === 2) {
                    stepTitleText.textContent = isVi ? 'Chọn Sân Bay Đến Tại Việt Nam' : 'Select Arrival Airport in Vietnam';
                } else if (currentStep === 3) {
                    stepTitleText.textContent = isVi ? 'Cấu Hình Ngân Sách & Phi Cơ 3D' : 'Configure Budget & 3D Aircraft';
                }

                if (crumbStep1) crumbStep1.innerHTML = '<i class="fa-solid fa-plane-departure"></i> ' + (isVi ? '1. Khởi hành' : '1. Departure');
                if (crumbStep2) crumbStep2.innerHTML = '<i class="fa-solid fa-location-dot"></i> ' + (isVi ? '2. Điểm đến (VN)' : '2. Destination (VN)');
                if (crumbStep3) crumbStep3.innerHTML = '<i class="fa-solid fa-coins"></i> ' + (isVi ? '3. Ngân sách' : '3. Budget');

                if (btnToStep2) btnToStep2.innerHTML = '<span>' + (isVi ? 'Tiếp tục: Chọn sân bay đến' : 'Continue: Select Destination') + '</span> <i class="fa-solid fa-arrow-right"></i>';
                if (btnBackToStep1) btnBackToStep1.innerHTML = '<i class="fa-solid fa-arrow-left"></i> <span>' + (isVi ? 'Quay lại' : 'Change Origin') + '</span>';
                if (btnBackToStep2) btnBackToStep2.innerHTML = '<i class="fa-solid fa-arrow-left"></i> <span>' + (isVi ? 'Quay lại' : 'Change Destination') + '</span>';
                if (btnConfirmFinal) btnConfirmFinal.innerHTML = '<span>' + (isVi ? 'Xác nhận tuyến bay' : 'Confirm Route') + '</span> <i class="fa-solid fa-check"></i>';
                updateGenerateButtonLabels(currentDays, lang);

                const searchInput = document.getElementById('country-search-input');
                if (searchInput) {
                    searchInput.placeholder = isVi ? 'Nhập tên nước (ví dụ: Germany, Japan, Bỉ, Đức...)' : 'Enter country name (e.g., Germany, Japan, Belgium, France...)';
                }

                const soundBtn = document.getElementById('btn-sound-toggle');
                const sLabel = document.getElementById('sound-label');
                if (soundBtn && sLabel) {
                    const isMuted = soundBtn.classList.contains('muted');
                    sLabel.textContent = isMuted ? (isVi ? 'TẮT' : 'MUTED') : (isVi ? 'ÂM THANH' : 'SOUND');
                }

                renderCountryChips();
                renderDepartureAirports(currentCountry);
                renderDestinationAirports();
                updateTelemetryAndSummary();
                syncBudgetUI();
            }

            window.addEventListener('appLanguageChanged', (e) => {
                if (e.detail && e.detail.lang) {
                    updateWizardLanguage(e.detail.lang);
                }
            });
            window.updateWizardLanguage = updateWizardLanguage;

            // Trigger initial language sync
            const initialLang = (window.App && window.App.getState) ? window.App.getState().currentLang : ((typeof localStorage !== 'undefined' && localStorage.getItem('quynhon_language')) || 'en');
            updateWizardLanguage(initialLang);

            // Toast helper
            function showToast(msg) {
                const t = document.getElementById('toast-notify') || toast;
                const tt = document.getElementById('toast-text') || toastText;
                if (!t || !tt) return;
                tt.textContent = msg;
                t.classList.add('show');
                if (typeof toastTimer !== 'undefined' && toastTimer) clearTimeout(toastTimer);
                toastTimer = setTimeout(() => {
                    t.classList.remove('show');
                }, 3500);
            }
        }
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGameBookingWizard);
} else {
    initGameBookingWizard();
}