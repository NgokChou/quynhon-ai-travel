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

                    if (isSupported) {
                        const sup = window.SUPPORTED_COUNTRIES[country.id];
                        tooltip.innerHTML = `<strong>${sup.flag} ${sup.vi} (${sup.name})</strong><br><span style="color:#ffd700;font-size:11px;">✈ Hỗ trợ ${sup.airports.length} sân bay quốc tế</span>`;
                    } else {
                        tooltip.innerHTML = `<strong>${country.name} (${country.vi || country.id})</strong><br><span style="color:#8ea2b9;font-size:11px;">Chưa có tuyến bay trực tiếp</span>`;
                    }
                },
                onHoverOut: () => {
                    tooltip.style.display = 'none';
                },
                onSelect: (countryInfo) => {
                    currentCountry = countryInfo;
                    currentDepartureAirport = countryInfo.airports[0];
                    updateActiveChip(countryInfo.code);
                    renderDepartureAirports(countryInfo);
                    updateTelemetryAndSummary();
                },
                onDestinationSelect: (destInfo) => {
                    currentDestination = destInfo;
                    updateDestinationCardsUI();
                    updateTelemetryAndSummary();
                },
                onNonSupportedClick: (country) => {
                    showToast(`Tuyến bay từ ${country.name} (${country.vi || country.id}) hiện đang được cập nhật lịch trình.`);
                },
                onFpsUpdate: (fps, scale) => {
                    valFps.textContent = fps;
                    valZoom.textContent = scale.toFixed(1) + 'x';
                }
            });

            // 1. Render 11 Supported Departure Country Chips
            function renderCountryChips() {
                chipsGrid.innerHTML = '';
                Object.values(window.SUPPORTED_COUNTRIES).forEach(c => {
                    const chip = document.createElement('div');
                    chip.className = 'country-chip' + (c.code === currentCountry.code ? ' selected' : '');
                    chip.dataset.code = c.code;
                    chip.innerHTML = `
                        <span class="flag">${c.flag}</span>
                        <span class="name">${c.name}</span>
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

                countryInfo.airports.forEach((apt, idx) => {
                    const card = document.createElement('div');
                    const isSelected = (apt.code === currentDepartureAirport.code);
                    card.className = 'airport-card' + (isSelected ? ' selected' : '');
                    card.innerHTML = `
                        <div class="airport-info-left">
                            <div class="airport-code-badge">${apt.code}</div>
                            <div class="airport-details">
                                <div class="name">${apt.name}</div>
                                <div class="desc">${apt.desc || apt.city}</div>
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
                        showToast(`✈ Đã chọn ${apt.code} (${apt.city}) – Đang tự động chuyển đến Việt Nam...`);

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
                Object.values(window.VIETNAM_DESTINATIONS).forEach(dest => {
                    const card = document.createElement('div');
                    const isSelected = (dest.code === currentDestination.code);
                    card.className = 'destination-card' + (isSelected ? ' selected' : '') + (dest.isHero ? ' is-hero' : '');
                    card.dataset.code = dest.code;
                    card.innerHTML = `
                        <div class="airport-info-left">
                            <div class="airport-code-badge dest-badge">${dest.code}</div>
                            <div class="airport-details">
                                <div class="name">${dest.name} (${dest.city})</div>
                                <div class="desc">${dest.desc}</div>
                            </div>
                        </div>
                        <div class="airport-radio"></div>
                    `;
                    card.addEventListener('click', () => {
                        currentDestination = dest;
                        mapInstance.selectDestination(dest.code);
                        updateDestinationCardsUI();
                        updateTelemetryAndSummary();
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
                const origCode = currentDepartureAirport ? currentDepartureAirport.code : 'FRA';
                const origCity = currentDepartureAirport ? (currentDepartureAirport.city || currentCountry.name) : 'Frankfurt';
                const destCode = currentDestination ? currentDestination.code : 'UIH';
                const destCity = currentDestination ? currentDestination.city : 'Quy Nhơn';

                valRoute.textContent = `${origCode} → ${destCode}`;
                summaryOrigCode.textContent = origCode;
                summaryOrigCity.textContent = `${origCity} (${currentCountry.flag})`;
                summaryDestCode.textContent = destCode;
                summaryDestCity.textContent = `${destCity} (🇻🇳)`;

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

            // Render Static Controls on Init
            function initStep3Controls() {
                // Currency Chips
                currencyChipsGrid.innerHTML = '';
                Object.keys(window.CURRENCIES).forEach(cKey => {
                    const c = window.CURRENCIES[cKey];
                    const chip = document.createElement('div');
                    chip.className = `cur-chip ${cKey === currentCurrency ? 'active' : ''}`;
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
                    });
                    presetChipsRow.appendChild(chip);
                });

                // Steppers: Guests
                btnGuestMinus.addEventListener('click', () => {
                    if (currentGuests > window.BUDGET_CONFIG.minGuests) {
                        currentGuests--;
                        syncBudgetUI();
                    }
                });
                btnGuestPlus.addEventListener('click', () => {
                    if (currentGuests < window.BUDGET_CONFIG.maxGuests) {
                        currentGuests++;
                        syncBudgetUI();
                    }
                });

                // Steppers: Days
                btnDaysMinus.addEventListener('click', () => {
                    if (currentDays > window.BUDGET_CONFIG.minDays) {
                        currentDays--;
                        syncBudgetUI();
                    }
                });
                btnDaysPlus.addEventListener('click', () => {
                    if (currentDays < window.BUDGET_CONFIG.maxDays) {
                        currentDays++;
                        syncBudgetUI();
                    }
                });

                // Range Slider Input Handler
                budgetRangeSlider.addEventListener('input', (e) => {
                    const rawVal = parseFloat(e.target.value) || 2500;
                    const cur = window.CURRENCIES[currentCurrency] || window.CURRENCIES.USD;
                    currentBudgetUSD = Math.round(rawVal / cur.rate);
                    currentBudgetUSD = Math.max(500, Math.min(50000, currentBudgetUSD));

                    if (showroomViewport && showroomViewport.controller) {
                        showroomViewport.controller.setBudgetUSD(currentBudgetUSD, true);
                    }
                    syncBudgetUI(false); // don't mutate slider value while dragging
                });

                // Numeric Input Handler
                budgetNumberInput.addEventListener('input', (e) => {
                    const cleanStr = e.target.value.replace(/[^0-9]/g, '');
                    if (!cleanStr) return;
                    let val = parseFloat(cleanStr) || 0;
                    const cur = window.CURRENCIES[currentCurrency] || window.CURRENCIES.USD;
                    let targetUSD = Math.round(val / cur.rate);
                    if (targetUSD > 50000) targetUSD = 50000;
                    if (targetUSD < 500) targetUSD = 500;
                    currentBudgetUSD = targetUSD;

                    if (showroomViewport && showroomViewport.controller) {
                        showroomViewport.controller.setBudgetUSD(currentBudgetUSD, true);
                    }
                    syncBudgetUI(true, false); // sync slider, don't reformat text input cursor while typing
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
                                if (soundLabel) soundLabel.textContent = 'ÂM THANH';
                            } else {
                                btnSoundToggle.classList.add('muted');
                                if (soundIcon) soundIcon.className = 'fa-solid fa-volume-xmark';
                                if (soundLabel) soundLabel.textContent = 'TẮT';
                            }
                        }
                    });
                }

                btnLaunchFinalPlan.addEventListener('click', () => {
                    const curTier = (typeof window !== 'undefined' && window.getTierForUSD) ? window.getTierForUSD(currentBudgetUSD) : { name: 'Tier', level: 2 };
                    const formatted = (typeof window !== 'undefined' && window.formatCurrency) ? window.formatCurrency(currentBudgetUSD, currentCurrency) : ('$' + currentBudgetUSD);
                    
                    if (showroomViewport && showroomViewport.audio) {
                        try { showroomViewport.audio.playCoinDrop(); } catch (_) {}
                    }

                    const isoCode = (currentCountry && currentCountry.code) ? currentCountry.code : 'JPN';
                    // Map 11 Supported Departure Countries to rich itinerary profiles in MOCK_COUNTRIES
                    const isoToKeyMap = {
                        'JPN': 'japan',
                        'DEU': 'germany',
                        'USA': 'usa',
                        'FRA': 'france',
                        'BEL': 'belgium',
                        'AUS': 'australia',
                        'GBR': 'germany',  // European hub fallback until custom UK route configured
                        'KOR': 'japan',    // East Asia hub fallback until custom Korea route configured
                        'SGP': 'japan',    // Southeast Asia hub fallback until custom Singapore route configured
                        'CHN': 'japan',    // East Asia hub fallback until custom China route configured
                        'VNM': 'japan'     // Regional hub fallback until custom Vietnam domestic route configured
                    };
                    const countryKey = isoToKeyMap[isoCode] || 'japan';
                    const arrCode = (currentDestination && currentDestination.code) ? currentDestination.code : 'UIH';
                    const isFallbackCountry = ['GBR', 'KOR', 'SGP', 'CHN', 'VNM'].includes(isoCode);
                    const meta = {
                        originIso: isoCode,
                        originAirport: currentDepartureAirport,
                        originCountryName: currentCountry ? currentCountry.name : isoCode,
                        originCountryVi: currentCountry ? currentCountry.vi : isoCode,
                        isFallback: isFallbackCountry
                    };

                    const app = (typeof window !== 'undefined' && window.App) || (typeof App !== 'undefined' ? App : null);
                    if (app) {
                        if (typeof app.setPlannerData === 'function') {
                            app.setPlannerData(countryKey, currentBudgetUSD, 'quynhon', arrCode, meta);
                        }
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
                    }

                    showToast(`🎉 Xuất xưởng ${curTier.name} (${formatted}) thành công! Đang lập kế hoạch du lịch Quy Nhơn...`);

                    if (app && typeof app.generateJourneyPlan === 'function') {
                        app.generateJourneyPlan(true);
                    } else {
                        const form = document.getElementById('journey-planner-form');
                        if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
                    }

                    const resultsTarget = document.getElementById('ai-assistant-card') || document.getElementById('results-container') || document.getElementById('generated-itinerary-section');
                    if (resultsTarget) {
                        setTimeout(() => {
                            resultsTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }, 250);
                    }
                });
            }

            // Sync Budget UI elements (Inputs, slider, allocations, tier cards, HUD)
            function syncBudgetUI(updateSlider = true, updateInput = true) {
                const cur = window.CURRENCIES[currentCurrency] || window.CURRENCIES.USD;
                const converted = currentBudgetUSD * cur.rate;
                const curTier = window.getTierForUSD(currentBudgetUSD);

                // Currency symbol & code
                budgetCurSymbol.textContent = cur.symbol;
                budgetCurCode.textContent = currentCurrency;

                // Converted text input
                if (updateInput) {
                    budgetNumberInput.value = Math.round(converted).toLocaleString('en-US');
                }

                // Equivalent USD Pill
                if (currentCurrency === 'USD') {
                    budgetUsdPill.textContent = 'Đơn vị cơ sở';
                } else {
                    budgetUsdPill.textContent = `≈ $${currentBudgetUSD.toLocaleString()} USD`;
                }

                // Range slider bounds and value
                const minSlider = Math.round(window.BUDGET_CONFIG.minUSD * cur.rate);
                const maxSlider = Math.round(window.BUDGET_CONFIG.maxUSD * cur.rate);
                budgetRangeSlider.min = minSlider;
                budgetRangeSlider.max = maxSlider;
                budgetRangeSlider.step = cur.rate > 100 ? 50000 : 100;
                if (updateSlider) {
                    budgetRangeSlider.value = Math.round(converted);
                }
                sliderMinLabel.textContent = window.formatCurrency(window.BUDGET_CONFIG.minUSD, currentCurrency);
                sliderMaxLabel.textContent = window.formatCurrency(window.BUDGET_CONFIG.maxUSD, currentCurrency);

                // Update Preset Chips Active State
                document.querySelectorAll('.preset-chip').forEach(chip => {
                    const pUsd = parseFloat(chip.dataset.usd);
                    chip.classList.toggle('active', Math.abs(pUsd - currentBudgetUSD) < 20);
                });

                // Steppers UI
                valGuests.textContent = `${currentGuests} khách`;
                valDays.textContent = `${currentDays} ngày`;

                // Tier Experience Card
                expTierBadge.textContent = curTier.badge;
                expTierBadge.style.color = `#${curTier.colorHex.toString(16).padStart(6, '0')}`;
                expTierUsdRange.textContent = `$${curTier.minUSD.toLocaleString()} – $${curTier.maxUSD.toLocaleString()} USD`;
                expTierDesc.textContent = curTier.experience;
                expTierCard.style.borderColor = `#${curTier.colorHex.toString(16).padStart(6, '0')}55`;

                // Calculate 6-Category Allocation (100% closed)
                const allocResult = window.BudgetTripCalculator.calculateAllocation(currentBudgetUSD, currentGuests, currentDays);

                // Multi-segment progress bar
                allocProgressBar.innerHTML = allocResult.categories.map(c => `
                    <div class="alloc-seg" style="width: ${c.pct}%; background: ${c.color};" title="${c.name}: ${window.formatCurrency(c.amountUSD, currentCurrency)} (${c.pct}%)"></div>
                `).join('');

                // Categories list cards
                allocItemsGrid.innerHTML = allocResult.categories.map(c => `
                    <div class="alloc-item-card">
                        <div class="alloc-item-top">
                            <span><i class="fa-solid ${c.icon}" style="color: ${c.color};"></i> ${c.name}</span>
                            <small>${c.pct}%</small>
                        </div>
                        <div class="alloc-item-amount">${window.formatCurrency(c.amountUSD, currentCurrency)}</div>
                    </div>
                `).join('');

                allocCheckPill.innerHTML = `<i class="fa-solid fa-check"></i> 100% Khép kín ($${allocResult.totalUSD.toLocaleString()} USD)`;

                // 3D Showroom HUD Overlay
                if (hudTierTag) {
                    hudTierTag.textContent = curTier.badge;
                    hudTierTag.style.color = `#${curTier.colorHex.toString(16).padStart(6, '0')}`;
                }
                if (hudModelName) {
                    hudModelName.textContent = curTier.modelName;
                }
                if (hudSpecPill) {
                    let specDesc = '16 xu vàng • 3 tờ USD • Homestay ven biển';
                    if (curTier.level === 2) specDesc = '48 xu vàng • 8 tờ USD & cọc tiền • Khách sạn 3–4 sao biển';
                    if (curTier.level === 3) specDesc = '110 xu vàng • 18 tờ USD & cọc tiền • Resort 5 sao Maia/FLC';
                    if (curTier.level === 4) specDesc = '230 xu vàng • 32 cọc tiền USD • Biệt thự hồ bơi vô cực';
                    if (curTier.level === 5) specDesc = '400 xu vàng • 50 cọc tiền USD • Dinh thự Tổng Thống & Trực thăng VIP';
                    hudSpecPill.textContent = specDesc;
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
                stepTitleText.textContent = 'Cấu Hình Ngân Sách & Phi Cơ 3D';

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
                stepTitleText.textContent = 'Chọn Sân Bay Đến Tại Việt Nam';

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
                stepTitleText.textContent = 'Chọn Điểm Khởi Hành';

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
                    searchDropdown.innerHTML = `<div style="padding:12px;font-size:12px;color:#8ea2b9;">Không tìm thấy quốc gia phù hợp trong 11 nước hỗ trợ.</div>`;
                    searchDropdown.style.display = 'block';
                    return;
                }

                searchDropdown.innerHTML = '';
                matches.forEach(m => {
                    const item = document.createElement('div');
                    item.className = 'search-item';
                    item.innerHTML = `
                        <div>${m.flag} <strong>${m.name}</strong> (${m.vi})</div>
                        <span class="tag">${m.airports.length} sân bay</span>
                    `;
                    item.addEventListener('click', () => {
                        searchInput.value = m.name;
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