/**
 * Quy Nhon AI Travel Assistant - Game-Style Booking Wizard (Kurzgesagt Edition v2.0)
 * Stage 1: Full 2D World Map (Soft Red/Rose Ocean), Inactive/Active Landmasses, Country Names
 * Stage 2: Theme Shift to Emerald Green, Destination Focus (Quy Nhon, Gia Lai, Hanoi)
 * Stage 3: Split-Screen Interactive Budget (up to $50,000 USD) & Modular Airplane Evolution
 */

const GameWizard = (function() {
    // 1. Web Audio API Sound Synthesizer (Zero-latency, 100% offline arcade SFX)
    const SFX = {
        ctx: null,
        enabled: true,
        init() {
            if (!this.ctx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) {
                    this.ctx = new AudioContextClass();
                }
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        },
        toggle() {
            this.enabled = !this.enabled;
            return this.enabled;
        },
        playBloop(freq = 480, duration = 0.08) {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(freq * 1.4, this.ctx.currentTime + duration);
                gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + duration);
            } catch (e) {}
        },
        playChime() {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
                notes.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(0.08, this.ctx.currentTime + idx * 0.06);
                    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.06 + 0.25);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(this.ctx.currentTime + idx * 0.06);
                    osc.stop(this.ctx.currentTime + idx * 0.06 + 0.25);
                });
            } catch (e) {}
        },
        playWhoosh() {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const bufferSize = this.ctx.sampleRate * 0.2;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = this.ctx.createBufferSource();
                noise.buffer = buffer;
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(220, this.ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(2400, this.ctx.currentTime + 0.15);
                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.14, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.2);
                noise.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);
                noise.start();
            } catch (e) {}
        },
        playThrust(ratio = 0.5) {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                const f = 100 + ratio * 240;
                osc.frequency.setValueAtTime(f, this.ctx.currentTime);
                gain.gain.setValueAtTime(0.035, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.1);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.1);
            } catch (e) {}
        },
        playHyperspace() {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(220, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1860, this.ctx.currentTime + 0.55);
                gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.6);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.6);
            } catch (e) {}
        }
    };

    // 2. Comprehensive Country & Airport Catalog
    const COUNTRIES = {
        belgium: {
            id: "belgium",
            name: { en: "Belgium", vi: "Bỉ" },
            flag: "🇧🇪",
            continent: { en: "Europe", vi: "Châu Âu" },
            badge: { en: "1 Single Gateway", vi: "1 Sân bay quốc tế duy nhất" },
            airports: [
                { code: "BRU", name: "Brussels Airport", city: "Brussels", desc: "Sân bay quốc tế thủ đô Brussels (BRU)" }
            ]
        },
        france: {
            id: "france",
            name: { en: "France", vi: "Pháp" },
            flag: "🇫🇷",
            continent: { en: "Europe", vi: "Châu Âu" },
            badge: { en: "3 Major Hubs", vi: "3 Cửa ngõ hàng không" },
            airports: [
                { code: "CDG", name: "Paris Charles de Gaulle", city: "Paris", desc: "Cửa ngõ liên lục địa lớn nhất Pháp (CDG)" },
                { code: "ORY", name: "Paris Orly Airport", city: "Paris", desc: "Sân bay quốc tế Paris Orly (ORY)" },
                { code: "NCE", name: "Nice Côte d'Azur", city: "Nice", desc: "Cửa ngõ miền Nam vùng Địa Trung Hải (NCE)" }
            ]
        },
        germany: {
            id: "germany",
            name: { en: "Germany", vi: "Đức" },
            flag: "🇩🇪",
            continent: { en: "Europe", vi: "Châu Âu" },
            badge: { en: "3 Major Hubs", vi: "3 Cửa ngõ hàng không" },
            airports: [
                { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", desc: "Trung tâm trung chuyển hàng không lớn nhất Châu Âu (FRA)" },
                { code: "MUC", name: "Munich Airport", city: "Munich", desc: "Sân bay 5 sao trung tâm Bayern (MUC)" },
                { code: "BER", name: "Berlin Brandenburg", city: "Berlin", desc: "Sân bay quốc tế thủ đô Berlin (BER)" }
            ]
        },
        usa: {
            id: "usa",
            name: { en: "United States", vi: "Hoa Kỳ" },
            flag: "🇺🇸",
            continent: { en: "North America", vi: "Bắc Mỹ" },
            badge: { en: "4 Continental Hubs", vi: "4 Cửa ngõ liên lục địa" },
            airports: [
                { code: "SFO", name: "San Francisco International", city: "San Francisco", desc: "Cửa ngõ Bờ Tây Thái Bình Dương kết nối Việt Nam (SFO)" },
                { code: "LAX", name: "Los Angeles International", city: "Los Angeles", desc: "Trung tâm hàng không lớn nhất Nam California (LAX)" },
                { code: "JFK", name: "New York John F. Kennedy", city: "New York", desc: "Cửa ngõ Bờ Đông quốc tế lớn nhất Mỹ (JFK)" },
                { code: "ORD", name: "Chicago O'Hare", city: "Chicago", desc: "Trung tâm trung chuyển xuyên lục địa trung tây (ORD)" }
            ]
        },
        japan: {
            id: "japan",
            name: { en: "Japan", vi: "Nhật Bản" },
            flag: "🇯🇵",
            continent: { en: "Asia", vi: "Châu Á" },
            badge: { en: "3 Major Hubs", vi: "3 Cửa ngõ hàng không" },
            airports: [
                { code: "HND", name: "Tokyo Haneda", city: "Tokyo", desc: "Sân bay nội đô Tokyo 5 sao quốc tế (HND)" },
                { code: "NRT", name: "Tokyo Narita", city: "Tokyo", desc: "Cửa ngõ liên lục địa lớn nhất Nhật Bản (NRT)" },
                { code: "KIX", name: "Osaka Kansai", city: "Osaka", desc: "Sân bay trên đảo nhân tạo vùng Kansai (KIX)" }
            ]
        },
        australia: {
            id: "australia",
            name: { en: "Australia", vi: "Úc" },
            flag: "🇦🇺",
            continent: { en: "Oceania", vi: "Châu Đại Dương" },
            badge: { en: "3 Major Hubs", vi: "3 Cửa ngõ hàng không" },
            airports: [
                { code: "SYD", name: "Sydney Kingsford Smith", city: "Sydney", desc: "Cửa ngõ bay thẳng kết nối Việt Nam (SYD)" },
                { code: "MEL", name: "Melbourne Airport", city: "Melbourne", desc: "Trung tâm văn hóa nghệ thuật bang Victoria (MEL)" },
                { code: "BNE", name: "Brisbane Airport", city: "Brisbane", desc: "Sân bay bờ Đông bang Queensland (BNE)" }
            ]
        },
        uk: {
            id: "uk",
            name: { en: "United Kingdom", vi: "Vương Quốc Anh" },
            flag: "🇬🇧",
            continent: { en: "Europe", vi: "Châu Âu" },
            badge: { en: "2 Major Hubs", vi: "2 Cửa ngõ hàng không" },
            airports: [
                { code: "LHR", name: "London Heathrow", city: "London", desc: "Trung tâm bay thẳng London - Hà Nội (LHR)" },
                { code: "MAN", name: "Manchester Airport", city: "Manchester", desc: "Cửa ngõ miền Bắc nước Anh (MAN)" }
            ]
        },
        korea: {
            id: "korea",
            name: { en: "South Korea", vi: "Hàn Quốc" },
            flag: "🇰🇷",
            continent: { en: "Asia", vi: "Châu Á" },
            badge: { en: "2 Major Hubs", vi: "2 Cửa ngõ hàng không" },
            airports: [
                { code: "ICN", name: "Seoul Incheon", city: "Seoul", desc: "Sân bay 5 sao Incheon - Bay thẳng tới miền Trung VN (ICN)" },
                { code: "PUS", name: "Busan Gimhae", city: "Busan", desc: "Sân bay quốc tế thành phố cảng Busan (PUS)" }
            ]
        },
        singapore: {
            id: "singapore",
            name: { en: "Singapore", vi: "Singapore" },
            flag: "🇸🇬",
            continent: { en: "Asia", vi: "Đông Nam Á" },
            badge: { en: "1 Single Gateway", vi: "1 Sân bay quốc tế duy nhất" },
            airports: [
                { code: "SIN", name: "Singapore Changi Airport", city: "Singapore", desc: "Sân bay tốt nhất thế giới Changi (SIN)" }
            ]
        },
        china: {
            id: "china",
            name: { en: "China", vi: "Trung Quốc" },
            flag: "🇨🇳",
            continent: { en: "Asia", vi: "Châu Á" },
            badge: { en: "3 Major Hubs", vi: "3 Cửa ngõ hàng không" },
            airports: [
                { code: "PVG", name: "Shanghai Pudong", city: "Shanghai", desc: "Cửa ngõ quốc tế Thượng Hải (PVG)" },
                { code: "PEK", name: "Beijing Capital", city: "Beijing", desc: "Sân bay thủ đô Bắc Kinh (PEK)" },
                { code: "CAN", name: "Guangzhou Baiyun", city: "Guangzhou", desc: "Cửa ngõ miền nam Quảng Châu (CAN)" }
            ]
        },
        vietnam: {
            id: "vietnam",
            name: { en: "Vietnam (Domestic)", vi: "Việt Nam (Nội địa)" },
            flag: "🇻🇳",
            continent: { en: "Asia", vi: "Việt Nam" },
            badge: { en: "3 Domestic Hubs", vi: "3 Cửa ngõ nội địa" },
            airports: [
                { code: "HAN", name: "Sân bay Quốc tế Nội Bài", city: "Hà Nội", desc: "Bay thẳng 1h35m tới Sân bay Phù Cát (UIH)" },
                { code: "SGN", name: "Sân bay Quốc tế Tân Sơn Nhất", city: "TP. Hồ Chí Minh", desc: "Bay thẳng 1h10m tới Sân bay Phù Cát (UIH)" },
                { code: "DAD", name: "Sân bay Quốc tế Đà Nẵng", city: "Đà Nẵng", desc: "Tàu hỏa ngắm biển ven duyên hải 5h về Quy Nhơn" }
            ]
        }
    };

    // 3. Destinations Data (Limited to Quy Nhon, Gia Lai, Hanoi)
    const DESTINATIONS = [
        {
            id: "quynhon",
            name: { en: "Quy Nhon (Binh Dinh)", vi: "Quy Nhơn (Bình Định)" },
            airportCode: "UIH",
            airportName: "Phu Cat Airport",
            badge: { en: "PRIMARY AI TRAVEL GEM", vi: "TRỌNG TÂM BIỂN NGỌC & ĐÔ THỊ SẠCH ASEAN" },
            icon: "fa-umbrella-beach",
            color: "#0284c7",
            desc: {
                en: "Emerald Ky Co bay, Eo Gio wind cliffs, 10th-century Cham towers & fresh Nhon Ly seafood.",
                vi: "Biển ngọc Kỳ Co, kỳ quan vách đá Eo Gió lộng gió, Tháp Đôi Chăm Pa cổ kính & hải sản Nhơn Lý tươi ngon."
            },
            tags: ["Kỳ Co", "Eo Gió", "Tháp Chăm", "Resort Ven Biển"]
        },
        {
            id: "gialai",
            name: { en: "Gia Lai (Pleiku)", vi: "Gia Lai (Pleiku)" },
            airportCode: "PXU",
            airportName: "Pleiku Airport",
            badge: { en: "HIGHLANDS ECO GATEWAY", vi: "ĐẠI NGÀN TÂY NGUYÊN & DU LỊCH SINH THÁI" },
            icon: "fa-mountain-sun",
            color: "#059669",
            desc: {
                en: "Sea Lake T'Nung ('The Eyes of Pleiku'), Chu Dang Ya extinct volcano & Kon Ka Kinh biosphere reserve.",
                vi: "Biển Hồ T'nưng thơ mộng ('Đôi mắt Pleiku'), núi lửa Chư Đăng Ya hoa dã quỳ & rừng nguyên sinh Kon Ka Kinh."
            },
            tags: ["Biển Hồ", "Núi Lửa Chư Đăng Ya", "Chùa Minh Thành", "Cà Phê Bazan"]
        },
        {
            id: "hanoi",
            name: { en: "Hanoi (Capital Gateway)", vi: "Hà Nội (Thủ Đô Ngàn Năm)" },
            airportCode: "HAN",
            airportName: "Noi Bai International Airport",
            badge: { en: "MILLENNIAL CULTURAL CAPITAL", vi: "THỦ ĐÔ NGHÌN NĂM VĂN HIẾN & CỬA NGÕ QUỐC TẾ" },
            icon: "fa-landmark-dome",
            color: "#d97706",
            desc: {
                en: "Historic Hoan Kiem Lake, 36 Old Quarter guilds, iconic Long Bien Bridge & legendary street food heritage.",
                vi: "Hồ Gươm Tháp Rùa cổ kính, 36 phố phường rêu phong, Cầu Long Biên lịch sử & tinh hoa ẩm thực Tràng An."
            },
            tags: ["Hồ Gươm", "Phố Cổ 36 Phố", "Cầu Long Biên", "Ẩm Thực Tràng An"]
        }
    ];

    // 4. Currency Conversion Rates (USD Base, Max 50,000 USD equivalent)
    const CURRENCIES = {
        USD: { symbol: "$", rate: 1, max: 50000, min: 100, step: 100, label: "USD ($)" },
        VND: { symbol: "₫", rate: 25000, max: 1250000000, min: 2500000, step: 5000000, label: "VND (₫)" },
        EUR: { symbol: "€", rate: 0.92, max: 46000, min: 100, step: 100, label: "EUR (€)" },
        GBP: { symbol: "£", rate: 0.79, max: 39500, min: 100, step: 100, label: "GBP (£)" },
        JPY: { symbol: "¥", rate: 152, max: 7600000, min: 15000, step: 20000, label: "JPY (¥)" },
        AUD: { symbol: "A$", rate: 1.52, max: 76000, min: 150, step: 200, label: "AUD (A$)" },
        CNY: { symbol: "¥", rate: 7.24, max: 362000, min: 700, step: 1000, label: "CNY (¥)" }
    };

    // Internal State
    const state = {
        currentStage: 1, // 1: Origin Map | 2: Destination Map | 3: Budget Split
        selectedCountry: "belgium",
        selectedAirport: "BRU",
        selectedDestination: "quynhon",
        selectedCurrency: "USD",
        currentAmount: 2000,
        usdEquivalent: 2000,
        currentTier: 2
    };

    // Calculate USD value from current amount
    function getUsdValue() {
        const cur = CURRENCIES[state.selectedCurrency] || CURRENCIES.USD;
        return state.currentAmount / cur.rate;
    }

    // Determine Airplane Visual Tier (1 to 4)
    function calculateTier(usdVal) {
        if (usdVal < 2000) return 1;       // Tier 1: Commuter Prop Hopper
        if (usdVal < 8000) return 2;       // Tier 2: Twin Jetliner
        if (usdVal < 25000) return 3;      // Tier 3: Supersonic Falcon Executive
        return 4;                          // Tier 4: Royal Celestial Cruiser (up to 50k USD)
    }

    // Format Number with currency symbol
    function formatCurrency(val, curKey) {
        const cur = CURRENCIES[curKey] || CURRENCIES.USD;
        if (curKey === 'VND') {
            return Math.round(val).toLocaleString('vi-VN') + " " + cur.symbol;
        }
        if (curKey === 'JPY') {
            return cur.symbol + Math.round(val).toLocaleString('ja-JP');
        }
        return cur.symbol + Math.round(val).toLocaleString('en-US');
    }

    // Initialize Game Wizard DOM
    function init() {
        const container = document.getElementById('game-booking-wizard-container');
        if (!container) return;

        renderWizardHTML(container);
        bindEvents();
        updateCountrySelection(state.selectedCountry);
        updateDestinationSelection(state.selectedDestination);
        updateBudgetTier();
    }

    // Render Full Wizard Skeleton
    function renderWizardHTML(container) {
        container.innerHTML = `
            <div class="game-wizard-wrapper" id="game-wizard-wrapper">
                
                <!-- TOP HUD BAR: Stage Indicator & SFX Toggle -->
                <div class="game-hud-bar">
                    <div class="game-hud-brand">
                        <span class="game-brand-icon">🎮</span>
                        <div class="game-brand-text">
                            <strong>VOYAGE BUILDER</strong>
                            <small>Kurzgesagt Interactive Engine v2.0</small>
                        </div>
                    </div>

                    <!-- Stage Progress Pills -->
                    <div class="game-stages-nav">
                        <button type="button" class="stage-nav-pill active" data-stage="1" id="nav-pill-stage-1">
                            <span class="stage-pill-num">1</span>
                            <span class="stage-pill-text">Điểm Khởi Hành</span>
                        </button>
                        <div class="stage-nav-arrow">➔</div>
                        <button type="button" class="stage-nav-pill" data-stage="2" id="nav-pill-stage-2">
                            <span class="stage-pill-num">2</span>
                            <span class="stage-pill-text">Điểm Đến</span>
                        </button>
                        <div class="stage-nav-arrow">➔</div>
                        <button type="button" class="stage-nav-pill" data-stage="3" id="nav-pill-stage-3">
                            <span class="stage-pill-num">3</span>
                            <span class="stage-pill-text">Ngân Sách Bay</span>
                        </button>
                    </div>

                    <!-- SFX Sound Toggle Button -->
                    <div class="game-hud-controls">
                        <button type="button" id="game-sfx-toggle" class="btn-game-sfx" title="Bật/Tắt hiệu ứng âm thanh game">
                            <span class="sfx-icon">🔊</span>
                            <span class="sfx-text">SFX ON</span>
                        </button>
                    </div>
                </div>

                <!-- STAGE 1 & 2: 2D INTERACTIVE WORLD MAP & SIDE PANEL -->
                <div class="game-stage-screen active" id="stage-screen-map">
                    
                    <div class="stage-instruction-banner banner-origin" id="map-stage-banner">
                        <span class="instruction-badge" id="instruction-badge">BƯỚC 1</span>
                        <span class="instruction-text" id="map-instruction-text">Chọn quốc gia điểm bắt đầu: Bản đồ thế giới thể hiện các nước hỗ trợ đang phát sáng, bấm chọn quốc gia để xem danh sách sân bay:</span>
                    </div>

                    <!-- Quick Select Country Carousel Pills -->
                    <div class="game-quick-country-strip" id="quick-country-strip">
                        ${Object.values(COUNTRIES).map(c => `
                            <button type="button" class="country-quick-chip ${c.id === state.selectedCountry ? 'active' : ''}" data-country="${c.id}">
                                <span class="chip-flag">${c.flag}</span>
                                <span class="chip-name">${c.name.vi}</span>
                            </button>
                        `).join('')}
                    </div>

                    <!-- MAP & SIDE PANEL SPLIT -->
                    <div class="game-map-layout-grid">
                        
                        <!-- LEFT / CENTER: 2D Stylized Kurzgesagt World Map -->
                        <div class="game-map-canvas-card mode-origin" id="game-map-canvas-card">
                            <div class="map-mode-indicator-tag tag-origin" id="map-mode-tag">
                                <span class="pulse-beacon-dot"></span>
                                <span id="map-mode-label">ORIGIN SELECTION • WARM CORAL RADAR</span>
                            </div>

                            <!-- SVG 2D Interactive World Map (Complete Globe) -->
                            <div class="svg-map-viewport" id="svg-map-viewport">
                                <svg viewBox="0 0 1000 500" class="kurzgesagt-world-svg" id="kurzgesagt-world-svg">
                                    <defs>
                                        <!-- Ocean Grid Pattern -->
                                        <pattern id="worldOceanGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" stroke-width="0.7"/>
                                        </pattern>
                                        
                                        <!-- Active Country Glow Filter -->
                                        <filter id="countryGlow" x="-30%" y="-30%" width="160%" height="160%">
                                            <feGaussianBlur stdDeviation="5" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>

                                        <!-- Pulse Star Filter -->
                                        <filter id="goldStarGlow" x="-50%" y="-50%" width="200%" height="200%">
                                            <feGaussianBlur stdDeviation="4" result="blur" />
                                            <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                        </filter>
                                    </defs>

                                    <!-- Ocean Background (Color shifted via CSS classes) -->
                                    <rect width="1000" height="500" rx="16" class="svg-ocean-bg" id="svg-ocean-bg" />
                                    <rect width="1000" height="500" rx="16" fill="url(#worldOceanGrid)" class="svg-ocean-grid" pointer-events="none" />

                                    <!-- Latitude & Longitude Curvature Lines -->
                                    <g class="svg-curved-grid" fill="none">
                                        <line x1="40" y1="250" x2="960" y2="250" class="equator-line" stroke-dasharray="5,5" />
                                        <line x1="40" y1="125" x2="960" y2="125" class="tropic-line" stroke-dasharray="3,6" />
                                        <line x1="40" y1="375" x2="960" y2="375" class="tropic-line" stroke-dasharray="3,6" />
                                        <ellipse cx="500" cy="250" rx="460" ry="215" class="tropic-line" />
                                        <line x1="500" y1="35" x2="500" y2="465" class="equator-line" stroke-dasharray="5,5" />
                                    </g>

                                    <!-- ==============================================
                                         GLOBAL CONTINENTS & COUNTRIES (Uniform Inactive Tone)
                                         ============================================== -->
                                    <g class="svg-world-landmasses" id="svg-world-landmasses">
                                        
                                        <!-- 1. NORTH AMERICA (Canada, Alaska, Greenland, Mexico) -->
                                        <!-- Alaska & NW Canada -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 60,85 Q 100,50 160,65 Q 210,60 250,75 L 280,105 L 260,135 L 180,135 L 120,130 L 70,110 Z" />
                                        
                                        <!-- Northern Arctic Islands & Nunavut -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 170,45 Q 230,35 290,50 L 305,80 L 250,75 Z M 270,30 L 310,35 L 300,55 Z" />

                                        <!-- Greenland -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 340,35 Q 380,25 400,45 L 390,95 Q 365,100 345,75 Z" />

                                        <!-- Mexico & Central America -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 140,215 L 175,215 L 210,240 L 235,270 L 220,275 L 180,245 L 140,225 Z" />

                                        <!-- 2. SOUTH AMERICA (Brazil, Argentina, Andes) -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 225,275 Q 275,260 315,290 Q 355,330 330,385 Q 295,440 270,480 L 255,475 Q 240,400 230,340 Q 220,300 225,275 Z" />

                                        <!-- 3. EUROPE INACTIVE REGIONS -->
                                        <!-- Scandinavia & Nordics -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 490,65 Q 520,50 540,80 L 530,120 L 505,120 L 495,85 Z" />

                                        <!-- Iberia (Spain/Portugal) -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 430,180 L 460,180 L 455,215 L 430,210 Z" />

                                        <!-- Italy & Mediterranean -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 495,185 L 515,190 L 518,225 L 505,225 Z" />

                                        <!-- Eastern Europe & Balkans -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 525,130 L 585,125 L 595,180 L 535,185 Z" />

                                        <!-- 4. AFRICA (North Africa, Sahara, Central & South) -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 440,225 Q 530,215 575,245 Q 590,290 580,345 Q 555,410 525,450 L 500,445 Q 465,370 450,315 Q 435,265 440,225 Z" />
                                        
                                        <!-- Madagascar -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 590,380 Q 605,375 605,420 L 595,435 Q 585,410 590,380 Z" />

                                        <!-- 5. ASIA INACTIVE REGIONS -->
                                        <!-- Russia & Northern Asia (Siberia) -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 560,65 Q 670,45 800,60 Q 880,75 920,85 L 905,125 Q 810,135 720,130 Q 620,120 560,115 Z" />

                                        <!-- Middle East & Arabian Peninsula -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 575,215 Q 625,210 640,245 L 620,280 L 585,270 L 575,235 Z" />

                                        <!-- Central Asia & Kazakhstan -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 595,135 L 685,135 L 685,195 L 595,195 Z" />

                                        <!-- India & South Asia -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 640,215 Q 680,210 685,245 Q 670,295 655,320 L 640,285 Q 630,245 640,215 Z" />

                                        <!-- Southeast Asia Islands (Sumatra, Java, Borneo, Philippines) -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 715,335 L 775,355 L 765,365 L 710,345 Z
                                                 M 750,315 Q 775,310 775,335 L 750,340 Z
                                                 M 785,260 Q 798,255 798,290 L 785,300 Z" />

                                        <!-- New Zealand -->
                                        <path class="map-country-path map-land-inactive" 
                                              d="M 905,425 Q 920,420 920,455 L 905,475 Z M 920,440 L 935,465 Z" />

                                        <!-- ==============================================
                                             ACTIVE SUPPORTED COUNTRIES (ILLUMINATED & LABELED)
                                             ============================================== -->

                                        <!-- 1. UNITED STATES (USA) -->
                                        <g class="interactive-country-group" data-country="usa">
                                            <path class="map-country-path interactive-country" data-country="usa" id="map-geo-usa"
                                                  d="M 115,135 Q 185,135 255,140 Q 280,165 270,205 Q 235,225 175,225 Q 130,215 110,185 Z" />
                                            <text x="185" y="180" class="map-country-label">USA</text>
                                        </g>

                                        <!-- 2. UNITED KINGDOM (UK) -->
                                        <g class="interactive-country-group" data-country="uk">
                                            <path class="map-country-path interactive-country" data-country="uk" id="map-geo-uk"
                                                  d="M 435,115 Q 455,108 458,128 Q 450,145 438,140 Z" />
                                            <text x="446" y="112" class="map-country-label">UK</text>
                                        </g>

                                        <!-- 3. BELGIUM -->
                                        <g class="interactive-country-group" data-country="belgium">
                                            <path class="map-country-path interactive-country" data-country="belgium" id="map-geo-belgium"
                                                  d="M 478,136 L 490,134 L 488,148 L 476,146 Z" />
                                            <text x="495" y="132" class="map-country-label">BELGIUM</text>
                                        </g>

                                        <!-- 4. FRANCE -->
                                        <g class="interactive-country-group" data-country="france">
                                            <path class="map-country-path interactive-country" data-country="france" id="map-geo-france"
                                                  d="M 455,145 L 482,142 L 480,175 L 452,175 Z" />
                                            <text x="466" y="162" class="map-country-label">FRANCE</text>
                                        </g>

                                        <!-- 5. GERMANY -->
                                        <g class="interactive-country-group" data-country="germany">
                                            <path class="map-country-path interactive-country" data-country="germany" id="map-geo-germany"
                                                  d="M 490,130 L 522,126 L 520,162 L 490,158 Z" />
                                            <text x="506" y="148" class="map-country-label">GERMANY</text>
                                        </g>

                                        <!-- 6. CHINA -->
                                        <g class="interactive-country-group" data-country="china">
                                            <path class="map-country-path interactive-country" data-country="china" id="map-geo-china"
                                                  d="M 685,155 Q 770,145 795,185 Q 790,235 735,245 Q 675,235 675,190 Z" />
                                            <text x="735" y="195" class="map-country-label">CHINA</text>
                                        </g>

                                        <!-- 7. SOUTH KOREA -->
                                        <g class="interactive-country-group" data-country="korea">
                                            <path class="map-country-path interactive-country" data-country="korea" id="map-geo-korea"
                                                  d="M 800,180 L 818,178 L 815,205 L 800,202 Z" />
                                            <text x="826" y="192" class="map-country-label">KOREA</text>
                                        </g>

                                        <!-- 8. JAPAN -->
                                        <g class="interactive-country-group" data-country="japan">
                                            <path class="map-country-path interactive-country" data-country="japan" id="map-geo-japan"
                                                  d="M 835,160 Q 855,150 855,175 L 840,215 Q 828,215 832,190 Z M 850,145 L 865,140 L 860,158 Z" />
                                            <text x="860" y="175" class="map-country-label">JAPAN</text>
                                        </g>

                                        <!-- 9. SINGAPORE -->
                                        <g class="interactive-country-group" data-country="singapore">
                                            <path class="map-country-path interactive-country" data-country="singapore" id="map-geo-singapore"
                                                  d="M 718,310 L 730,310 L 726,322 L 715,320 Z" />
                                            <text x="735" y="325" class="map-country-label">SINGAPORE</text>
                                        </g>

                                        <!-- 10. AUSTRALIA -->
                                        <g class="interactive-country-group" data-country="australia">
                                            <path class="map-country-path interactive-country" data-country="australia" id="map-geo-australia"
                                                  d="M 775,355 Q 855,340 875,385 Q 865,445 815,455 Q 765,435 755,395 Z" />
                                            <text x="815" y="405" class="map-country-label">AUSTRALIA</text>
                                        </g>

                                        <!-- 11. VIETNAM (Focal Landmark & Destination Focus) -->
                                        <g class="interactive-country-group landmark-vietnam-group" data-country="vietnam">
                                            <path class="map-country-path interactive-country landmark-vietnam" data-country="vietnam" id="map-geo-vietnam"
                                                  d="M 718,225 Q 734,222 730,240 Q 722,258 734,275 Q 738,290 726,305 L 716,300 Q 714,282 724,268 Q 726,250 715,238 Z" />
                                            <text x="742" y="258" class="map-country-label label-vietnam">VIỆT NAM ⭐</text>
                                        </g>

                                    </g>

                                    <!-- FLIGHT PATH ARC (Animated SVG dash array) -->
                                    <path id="svg-flight-arc" class="svg-flight-arc" d="M 480,140 Q 600,80 740,282" fill="none" />

                                    <!-- MAP PINS & BEACONS -->
                                    <!-- Origin Pin -->
                                    <g id="map-pin-origin" class="game-svg-pin pin-origin" transform="translate(480, 140)">
                                        <circle r="14" class="pin-halo" />
                                        <circle r="6" class="pin-core" />
                                        <text y="-14" text-anchor="middle" class="pin-tag-text" id="pin-origin-label">BỈ (BRU)</text>
                                    </g>

                                    <!-- Destination Interactive Pins for Vietnam (Hà Nội, Gia Lai, Quy Nhơn) -->
                                    <g id="map-destination-markers" class="destination-markers-group">
                                        
                                        <!-- Hanoi Pin (North) -->
                                        <g id="map-marker-hanoi" class="map-dest-pin" data-dest="hanoi" transform="translate(722, 230)">
                                            <circle r="5" class="pin-dest-core" />
                                            <text x="8" y="4" class="pin-dest-text">Hà Nội (HAN)</text>
                                        </g>

                                        <!-- Gia Lai Pin (Highlands) -->
                                        <g id="map-marker-gialai" class="map-dest-pin" data-dest="gialai" transform="translate(730, 268)">
                                            <circle r="5" class="pin-dest-core" />
                                            <text x="8" y="4" class="pin-dest-text">Gia Lai (PXU)</text>
                                        </g>

                                        <!-- Quy Nhon Pin (Coastal Star) -->
                                        <g id="map-marker-quynhon" class="map-dest-pin selected" data-dest="quynhon" transform="translate(740, 282)">
                                            <circle r="18" class="pin-radar-ring ring-1" />
                                            <circle r="28" class="pin-radar-ring ring-2" />
                                            <polygon points="0,-10 2.5,-3 10,-3 4,2 6,10 0,5 -6,10 -4,2 -10,-3 -2.5,-3" class="pin-gold-star" />
                                            <text x="14" y="5" class="pin-dest-text gold-text" id="pin-dest-label">QUY NHƠN ⭐ (UIH)</text>
                                        </g>
                                    </g>
                                </svg>
                            </div>

                            <!-- Map Bottom Legend -->
                            <div class="map-card-footer">
                                <div class="map-legend-pills">
                                    <span class="legend-chip"><span class="legend-dot origin-dot"></span> Điểm Khởi Hành</span>
                                    <span class="legend-chip"><span class="legend-dot dest-dot"></span> Điểm Đến (Việt Nam)</span>
                                    <span class="legend-chip"><span class="legend-dot route-dot"></span> Hành Lang Bay AI</span>
                                </div>
                                <div class="map-hint-text">
                                    <i class="fa-solid fa-crosshairs"></i> Nhấn trực tiếp trên bản đồ hoặc danh sách bên phải
                                </div>
                            </div>
                        </div>

                        <!-- RIGHT: GAME SELECTION RPG PANEL -->
                        <div class="game-rpg-panel" id="game-rpg-panel">
                            
                            <!-- PANEL CONTENT: STAGE 1 - ORIGIN SELECTION -->
                            <div class="rpg-stage-content active" id="rpg-content-stage-1">
                                <div class="rpg-panel-header">
                                    <span class="rpg-country-flag" id="rpg-country-flag">🇧🇪</span>
                                    <div class="rpg-country-meta">
                                        <h3 id="rpg-country-name">Bỉ (Belgium)</h3>
                                        <span class="rpg-continent-badge" id="rpg-continent-badge">Châu Âu • 1 Sân bay quốc tế</span>
                                    </div>
                                </div>

                                <div class="rpg-sub-header">
                                    <i class="fa-solid fa-plane-departure"></i>
                                    <span>CHỌN SÂN BAY XUẤT PHÁT:</span>
                                </div>

                                <!-- Airport List (Dynamic) -->
                                <div class="rpg-airports-list" id="rpg-airports-list">
                                    <!-- Injected via JavaScript -->
                                </div>

                                <!-- Step 1 Next Button -->
                                <div class="rpg-action-footer">
                                    <button type="button" class="btn-game-next btn-go-destination" id="btn-goto-stage-2">
                                        <span>CHỌN ĐIỂM ĐẾN (BƯỚC 2)</span>
                                        <i class="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>

                            <!-- PANEL CONTENT: STAGE 2 - DESTINATION SELECTION (Quy Nhon, Gia Lai, Hanoi) -->
                            <div class="rpg-stage-content" id="rpg-content-stage-2">
                                <div class="rpg-panel-header header-dest-theme">
                                    <span class="rpg-country-flag">🇻🇳</span>
                                    <div class="rpg-country-meta">
                                        <h3>Điểm Đến Tại Việt Nam</h3>
                                        <span class="rpg-continent-badge badge-dest">3 Điểm Đến Giới Hạn Hấp Dẫn</span>
                                    </div>
                                </div>

                                <div class="rpg-sub-header">
                                    <i class="fa-solid fa-location-dot"></i>
                                    <span>CHỌN NƠI BẠN MUỐN ĐẾN TRẢI NGHIỆM:</span>
                                </div>

                                <!-- Expandable Accordion Destination List -->
                                <div class="rpg-dest-accordion" id="rpg-dest-accordion">
                                    ${DESTINATIONS.map((d, idx) => `
                                        <div class="dest-accordion-item ${d.id === state.selectedDestination ? 'selected' : ''}" data-dest="${d.id}">
                                            <div class="dest-item-header">
                                                <div class="dest-item-brand">
                                                    <span class="dest-icon-box" style="color: ${d.color};"><i class="fa-solid ${d.icon}"></i></span>
                                                    <div>
                                                        <h4>${d.name.vi}</h4>
                                                        <small><i class="fa-solid fa-plane"></i> ${d.airportName} (${d.airportCode})</small>
                                                    </div>
                                                </div>
                                                <span class="dest-select-radio"></span>
                                            </div>
                                            
                                            <!-- Expandable Detail Body -->
                                            <div class="dest-item-body">
                                                <div class="dest-badge-pill">${d.badge.vi}</div>
                                                <p class="dest-desc-text">${d.desc.vi}</p>
                                                <div class="dest-tags-row">
                                                    ${d.tags.map(t => `<span class="dest-tag-chip">#${t}</span>`).join('')}
                                                </div>
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>

                                <!-- Step 2 Action Buttons -->
                                <div class="rpg-action-footer split-buttons">
                                    <button type="button" class="btn-game-back" id="btn-backto-stage-1">
                                        <i class="fa-solid fa-arrow-left"></i>
                                        <span>Quay Lại</span>
                                    </button>
                                    <button type="button" class="btn-game-next btn-go-budget" id="btn-goto-stage-3">
                                        <span>CHỌN NGÂN SÁCH (BƯỚC 3)</span>
                                        <i class="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <!-- STAGE 3: 50/50 SPLIT SCREEN - ANIMATED KURZGESAGT AIRPLANE & BUDGET CONTROL STUDIO -->
                <div class="game-stage-screen" id="stage-screen-budget">
                    
                    <div class="stage-instruction-banner banner-budget">
                        <span class="instruction-badge badge-budget">BƯỚC 3</span>
                        <span class="instruction-text">Chọn ngân sách chuyến đi - Chiếc máy bay bên trái sẽ tự động kéo dài, lắp thêm các bộ phận và nâng cấp toàn diện tới $50,000 USD:</span>
                    </div>

                    <div class="budget-split-grid">
                        
                        <!-- LEFT HALF (50%): THE KURZGESAGT AIRCRAFT VISUAL STAGE -->
                        <div class="aircraft-stage-card" id="aircraft-stage-card">
                            
                            <!-- Sky Atmosphere & Clouds Backdrop -->
                            <div class="aircraft-sky-canvas" id="aircraft-sky-canvas">
                                
                                <!-- Floating Clouds -->
                                <div class="cloud cloud-1"></div>
                                <div class="cloud cloud-2"></div>
                                <div class="cloud cloud-3"></div>

                                <!-- Speed Lines -->
                                <div class="sky-speed-lines" id="sky-speed-lines"></div>

                                <!-- Current Tier Badge Card -->
                                <div class="aircraft-tier-badge" id="aircraft-tier-badge">
                                    <span class="tier-crown-icon" id="tier-crown-icon">🌱</span>
                                    <div class="tier-badge-text">
                                        <span class="tier-lvl-tag" id="tier-lvl-tag">TIER 2 • STANDARD</span>
                                        <h4 id="tier-name-label">Sky Explorer Plus</h4>
                                    </div>
                                </div>

                                <!-- THE ANIMATED MODULAR AIRCRAFT (PURE SVG VECTOR) -->
                                <div class="aircraft-model-container tier-standard" id="aircraft-model-container">
                                    
                                    <svg viewBox="0 0 520 220" class="kurzgesagt-plane-svg" id="kurzgesagt-plane-svg">
                                        <defs>
                                            <!-- Standard Jet Contrail -->
                                            <linearGradient id="contrailStandard" x1="100%" y1="0%" x2="0%" y2="0%">
                                                <stop offset="0%" stop-color="#38bdf8" stop-opacity="0.95"/>
                                                <stop offset="60%" stop-color="#0284c7" stop-opacity="0.4"/>
                                                <stop offset="100%" stop-color="#bae6fd" stop-opacity="0"/>
                                            </linearGradient>

                                            <!-- Executive Golden Shockwave -->
                                            <linearGradient id="contrailBusiness" x1="100%" y1="0%" x2="0%" y2="0%">
                                                <stop offset="0%" stop-color="#f59e0b" stop-opacity="1"/>
                                                <stop offset="45%" stop-color="#d97706" stop-opacity="0.6"/>
                                                <stop offset="100%" stop-color="#fef3c7" stop-opacity="0"/>
                                            </linearGradient>

                                            <!-- Royal Celestial Rainbow Aurora Contrail (Up to 50k USD) -->
                                            <linearGradient id="contrailRainbow" x1="100%" y1="0%" x2="0%" y2="0%">
                                                <stop offset="0%" stop-color="#ec4899" stop-opacity="1"/>
                                                <stop offset="25%" stop-color="#8b5cf6" stop-opacity="0.9"/>
                                                <stop offset="50%" stop-color="#06b6d4" stop-opacity="0.8"/>
                                                <stop offset="75%" stop-color="#10b981" stop-opacity="0.6"/>
                                                <stop offset="100%" stop-color="#fbbf24" stop-opacity="0"/>
                                            </linearGradient>

                                            <!-- Fuselage Gradient -->
                                            <linearGradient id="planeFuselageGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                                <stop offset="0%" stop-color="#ffffff"/>
                                                <stop offset="65%" stop-color="#f1f5f9"/>
                                                <stop offset="100%" stop-color="#cbd5e1"/>
                                            </linearGradient>

                                            <linearGradient id="royalGoldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                                <stop offset="0%" stop-color="#fde047"/>
                                                <stop offset="50%" stop-color="#f59e0b"/>
                                                <stop offset="100%" stop-color="#d97706"/>
                                            </linearGradient>
                                        </defs>

                                        <!-- CONTRAIL / WAKE / AFTERBURNER (Back Exhaust) -->
                                        <g class="plane-contrail-group" id="plane-contrail-group">
                                            <path d="M 90,110 Q -20,110 -150,110" class="contrail-stream main-trail" />
                                            <path d="M 90,100 Q -10,95 -130,85" class="contrail-stream top-trail" />
                                            <path d="M 90,120 Q -10,125 -130,135" class="contrail-stream bottom-trail" />
                                        </g>

                                        <!-- Booster Flame / Plasma Thrust (Grows dynamically with budget) -->
                                        <ellipse cx="96" cy="110" rx="30" ry="10" class="plane-booster-flame" id="plane-booster-flame" />

                                        <!-- Supersonic Shockwave Rings (Tier 3+) -->
                                        <g class="supersonic-shockwaves" id="supersonic-shockwaves">
                                            <ellipse cx="65" cy="110" rx="12" ry="22" class="shockwave-ring ring-s1" />
                                            <ellipse cx="35" cy="110" rx="16" ry="32" class="shockwave-ring ring-s2" />
                                        </g>

                                        <!-- ==============================================
                                             MAIN AIRPLANE CHASSIS (Scales and morphs with budget)
                                             ============================================== -->
                                        <g class="fuselage-scalable" id="fuselage-scalable">
                                            
                                            <!-- Vertical Tail Fin -->
                                            <path d="M 90,110 L 65,42 C 72,36 96,40 110,50 L 150,108 Z" class="plane-tail-fin" />
                                            <path d="M 72,48 L 98,54 L 132,108 Z" class="plane-tail-accent" />

                                            <!-- Swept Main Wings -->
                                            <path d="M 220,110 L 160,185 C 172,192 195,192 215,185 L 290,114 Z" class="plane-main-wing" />
                                            <circle cx="162" cy="188" r="4" class="strobe-light" />

                                            <!-- Main Fuselage Body -->
                                            <path d="M 90,110 
                                                     C 120,92 280,88 360,96 
                                                     C 395,99 435,106 445,110 
                                                     C 435,114 395,121 360,124 
                                                     C 280,132 120,128 90,110 Z" 
                                                  class="plane-fuselage" />

                                            <!-- Cockpit Windshield -->
                                            <path d="M 380,102 C 405,104 425,107 428,110 C 425,113 405,116 380,118 Z" class="plane-cockpit-window" />

                                            <!-- Passenger Window Strip -->
                                            <g class="plane-cabin-windows">
                                                <circle cx="340" cy="110" r="3.2" />
                                                <circle cx="315" cy="110" r="3.2" />
                                                <circle cx="290" cy="110" r="3.2" />
                                                <circle cx="265" cy="110" r="3.2" />
                                                <circle cx="240" cy="110" r="3.2" />
                                                <circle cx="215" cy="110" r="3.2" />
                                                <circle cx="190" cy="110" r="3.2" />
                                                <circle cx="165" cy="110" r="3.2" />
                                            </g>

                                            <!-- ==============================================
                                                 MODULAR SNAP-ON PARTS
                                                 ============================================== -->

                                            <!-- MODULAR PART 1: Front Nose Spinning Propeller (Tier 1 Only) -->
                                            <g id="part-propeller" class="modular-part part-propeller">
                                                <ellipse cx="446" cy="110" rx="4" ry="7" fill="#0f172a" />
                                                <g class="propeller-blade-spin">
                                                    <ellipse cx="448" cy="110" rx="3" ry="28" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.5" />
                                                    <circle cx="449" cy="110" r="4" fill="#f59e0b" />
                                                </g>
                                            </g>

                                            <!-- MODULAR PART 2: Underwing Twin Turbofan Jet Engines (Tier 2+) -->
                                            <g id="part-turbofans" class="modular-part part-turbofans">
                                                <rect x="210" y="142" width="55" height="18" rx="8" class="plane-engine-pod" />
                                                <ellipse cx="265" cy="151" rx="4" ry="9" class="engine-intake" />
                                                <ellipse cx="264" cy="151" rx="2.5" ry="6" class="engine-core-glow" />
                                            </g>

                                            <!-- MODULAR PART 3: Supersonic Mach-2 Delta Nose Probe & Sweeps (Tier 3+) -->
                                            <g id="part-supersonic" class="modular-part part-supersonic">
                                                <polygon points="445,110 495,110 445,108" fill="#e2e8f0" stroke="#0f172a" stroke-width="1.5" />
                                                <!-- Delta Wing Extenders -->
                                                <polygon points="260,112 335,112 280,155" class="delta-wing-extender" />
                                            </g>

                                            <!-- MODULAR PART 4: Forward Aerodynamic Canard Wings (Tier 4) -->
                                            <g id="part-canards" class="modular-part part-canards">
                                                <polygon points="360,98 335,80 345,98" class="canard-wing" />
                                                <polygon points="360,122 335,140 345,122" class="canard-wing" />
                                            </g>

                                            <!-- MODULAR PART 5: Quad Hyperdrive Rocket Boosters (Tier 4) -->
                                            <g id="part-hyper-boosters" class="modular-part part-hyper-boosters">
                                                <rect x="80" y="86" width="30" height="12" rx="4" class="hyper-booster-pod" />
                                                <rect x="80" y="122" width="30" height="12" rx="4" class="hyper-booster-pod" />
                                                <!-- Auxiliary plasma jets -->
                                                <ellipse cx="76" cy="92" rx="14" ry="5" class="aux-plasma-jet" />
                                                <ellipse cx="76" cy="128" rx="14" ry="5" class="aux-plasma-jet" />
                                            </g>

                                            <!-- MODULAR PART 6: Royal Golden Crown Crest (Tier 4 - Up to $50,000 USD) -->
                                            <g id="part-royal-crown" class="modular-part part-royal-crown">
                                                <polygon points="62,38 68,26 74,36 80,24 86,36 92,26 98,38" fill="url(#royalGoldGrad)" stroke="#78350f" stroke-width="1.2" />
                                                <circle cx="68" cy="24" r="2" fill="#ffffff" />
                                                <circle cx="80" cy="22" r="2.5" fill="#ffffff" />
                                                <circle cx="92" cy="24" r="2" fill="#ffffff" />
                                                <!-- Golden Fuselage Decal Stripe -->
                                                <path d="M 120,110 L 410,110" stroke="url(#royalGoldGrad)" stroke-width="3" stroke-linecap="round" />
                                            </g>

                                        </g>
                                    </svg>
                                </div>

                                <!-- Live Perks Description Strip -->
                                <div class="aircraft-perks-box" id="aircraft-perks-box">
                                    <span class="perk-bullet">✨</span>
                                    <span id="aircraft-perks-text">Bao gồm vé máy bay tiện nghi, khách sạn 4 sao biển & ẩm thực đặc sắc.</span>
                                </div>
                            </div>
                        </div>

                        <!-- RIGHT HALF (50%): INTERACTIVE BUDGET CONTROL STUDIO -->
                        <div class="budget-studio-card">
                            
                            <!-- 1. Currency Selector -->
                            <div class="studio-section-group">
                                <label class="studio-label">
                                    <i class="fa-solid fa-coins"></i>
                                    <span>1. Chọn Mệnh Giá Tiền Tệ (Currency):</span>
                                </label>
                                <div class="currency-pills-row" id="currency-pills-row">
                                    ${Object.keys(CURRENCIES).map(code => `
                                        <button type="button" class="currency-chip ${code === state.selectedCurrency ? 'active' : ''}" data-currency="${code}">
                                            ${CURRENCIES[code].label}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- 2. Direct Amount Input & Live Display -->
                            <div class="studio-section-group">
                                <div class="amount-header-row">
                                    <label class="studio-label" for="budget-numeric-input">
                                        <i class="fa-solid fa-wallet"></i>
                                        <span>2. Điền Số Tiền Ngân Sách Dự Kiến:</span>
                                    </label>
                                    <span class="usd-equivalent-pill" id="usd-equivalent-pill">≈ $2,000 USD</span>
                                </div>

                                <div class="budget-input-box-wrapper">
                                    <input type="number" 
                                           id="budget-numeric-input" 
                                           class="budget-big-input" 
                                           value="${state.currentAmount}" 
                                           min="${CURRENCIES[state.selectedCurrency].min}" 
                                           max="${CURRENCIES[state.selectedCurrency].max}" 
                                           step="${CURRENCIES[state.selectedCurrency].step}" />
                                    <span class="budget-currency-symbol" id="budget-currency-symbol">$</span>
                                </div>
                            </div>

                            <!-- 3. Interactive Range Slider (0 to 50,000 USD Max Equivalent) -->
                            <div class="studio-section-group">
                                <div class="slider-meter-track">
                                    <input type="range" 
                                           id="budget-range-slider" 
                                           class="game-range-slider" 
                                           min="${CURRENCIES[state.selectedCurrency].min}" 
                                           max="${CURRENCIES[state.selectedCurrency].max}" 
                                           step="${CURRENCIES[state.selectedCurrency].step}" 
                                           value="${state.currentAmount}" />
                                </div>
                                <div class="slider-range-labels">
                                    <span id="slider-min-label">${formatCurrency(CURRENCIES[state.selectedCurrency].min, state.selectedCurrency)}</span>
                                    <span class="slider-mid-label"><i class="fa-solid fa-arrows-left-right"></i> Kéo thanh để tăng tốc & nâng cấp máy bay</span>
                                    <span id="slider-max-label">${formatCurrency(CURRENCIES[state.selectedCurrency].max, state.selectedCurrency)} (Tối đa)</span>
                                </div>
                            </div>

                            <!-- Summary Corridor Strip -->
                            <div class="budget-summary-corridor">
                                <div class="corridor-route-badge">
                                    <span id="summary-origin-pill">🇧🇪 Brussels (BRU)</span>
                                    <i class="fa-solid fa-plane"></i>
                                    <span id="summary-dest-pill">🇻🇳 Quy Nhơn (UIH)</span>
                                </div>
                                <div class="corridor-budget-badge">
                                    <span>Ngân Sách:</span>
                                    <strong id="summary-budget-display">$2,000 USD</strong>
                                </div>
                            </div>

                            <!-- 4. Grand Launch Button -->
                            <div class="studio-action-row">
                                <button type="button" class="btn-game-back" id="btn-backto-stage-2">
                                    <i class="fa-solid fa-arrow-left"></i>
                                    <span>Quay Lại Điểm Đến</span>
                                </button>
                                <button type="button" class="btn-game-launch-plan" id="btn-game-launch-plan">
                                    <i class="fa-solid fa-rocket"></i>
                                    <span>KÍCH HOẠT HÀNH TRÌNH AI</span>
                                    <i class="fa-solid fa-wand-magic-sparkles"></i>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        `;
    }

    // Bind Event Listeners
    function bindEvents() {
        // SFX Toggle
        const sfxBtn = document.getElementById('game-sfx-toggle');
        if (sfxBtn) {
            sfxBtn.addEventListener('click', () => {
                const isEnabled = SFX.toggle();
                sfxBtn.querySelector('.sfx-icon').textContent = isEnabled ? '🔊' : '🔇';
                sfxBtn.querySelector('.sfx-text').textContent = isEnabled ? 'SFX ON' : 'SFX OFF';
                sfxBtn.classList.toggle('muted', !isEnabled);
                if (isEnabled) SFX.playBloop(600);
            });
        }

        // Stage Nav Pills (Allow jumping between stages)
        const stagePills = document.querySelectorAll('.stage-nav-pill');
        stagePills.forEach(pill => {
            pill.addEventListener('click', () => {
                const targetStage = parseInt(pill.getAttribute('data-stage'));
                setStage(targetStage);
            });
        });

        // Quick Country Chips
        const countryChips = document.querySelectorAll('.country-quick-chip');
        countryChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const countryId = chip.getAttribute('data-country');
                updateCountrySelection(countryId);
                SFX.playChime();
            });
        });

        // SVG Country Map Paths & Groups
        const mapCountryGroups = document.querySelectorAll('.interactive-country-group');
        mapCountryGroups.forEach(group => {
            group.addEventListener('click', () => {
                const countryId = group.getAttribute('data-country');
                if (countryId && COUNTRIES[countryId]) {
                    updateCountrySelection(countryId);
                    SFX.playChime();
                }
            });
            group.addEventListener('mouseenter', () => {
                SFX.playBloop(340, 0.04);
            });
        });

        // Step 1: "Chọn Điểm Đến" button
        const btnGoStage2 = document.getElementById('btn-goto-stage-2');
        if (btnGoStage2) {
            btnGoStage2.addEventListener('click', () => {
                setStage(2);
                SFX.playWhoosh();
            });
        }

        // Step 2: "Quay Lại" button
        const btnBackStage1 = document.getElementById('btn-backto-stage-1');
        if (btnBackStage1) {
            btnBackStage1.addEventListener('click', () => {
                setStage(1);
                SFX.playBloop(400);
            });
        }

        // Step 2: Destination Accordion Items
        const destItems = document.querySelectorAll('.dest-accordion-item');
        destItems.forEach(item => {
            item.addEventListener('click', () => {
                const destId = item.getAttribute('data-dest');
                updateDestinationSelection(destId);
                SFX.playChime();
            });
        });

        // Step 2: SVG Map Destination Pin Clicks (Hanoi, Gia Lai, Quy Nhon)
        const destPins = document.querySelectorAll('.map-dest-pin');
        destPins.forEach(pin => {
            pin.addEventListener('click', (e) => {
                e.stopPropagation();
                const destId = pin.getAttribute('data-dest');
                if (destId) {
                    updateDestinationSelection(destId);
                    SFX.playChime();
                }
            });
        });

        // Step 2: "Chọn Ngân Sách" button
        const btnGoStage3 = document.getElementById('btn-goto-stage-3');
        if (btnGoStage3) {
            btnGoStage3.addEventListener('click', () => {
                setStage(3);
                SFX.playWhoosh();
            });
        }

        // Step 3: "Quay Lại Điểm Đến" button
        const btnBackStage2 = document.getElementById('btn-backto-stage-2');
        if (btnBackStage2) {
            btnBackStage2.addEventListener('click', () => {
                setStage(2);
                SFX.playBloop(400);
            });
        }

        // Currency Chips
        const curChips = document.querySelectorAll('.currency-chip');
        curChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const code = chip.getAttribute('data-currency');
                setCurrency(code);
                SFX.playBloop(580);
            });
        });

        // Slider & Numeric Input (Scaling up to $50,000 USD)
        const slider = document.getElementById('budget-range-slider');
        const numInput = document.getElementById('budget-numeric-input');

        if (slider && numInput) {
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value);
                state.currentAmount = val;
                numInput.value = val;
                updateBudgetTier();
                SFX.playThrust(val / CURRENCIES[state.selectedCurrency].max);
            });

            numInput.addEventListener('input', (e) => {
                let val = parseFloat(e.target.value) || 0;
                const max = CURRENCIES[state.selectedCurrency].max;
                if (val > max) val = max;
                state.currentAmount = val;
                slider.value = val;
                updateBudgetTier();
            });
        }

        // Grand Launch Button
        const btnLaunch = document.getElementById('btn-game-launch-plan');
        if (btnLaunch) {
            btnLaunch.addEventListener('click', () => {
                launchJourneyPlan();
            });
        }

        // Global Language Change Listener
        window.addEventListener('appLanguageChanged', (e) => {
            updateCountrySelection(state.selectedCountry);
            updateDestinationSelection(state.selectedDestination);
            updateBudgetTier();
        });
    }

    // Switch Wizard Stage (1, 2, 3)
    function setStage(stageNum) {
        state.currentStage = stageNum;

        // Update nav pills
        document.querySelectorAll('.stage-nav-pill').forEach(pill => {
            const num = parseInt(pill.getAttribute('data-stage'));
            pill.classList.toggle('active', num === stageNum);
            pill.classList.toggle('completed', num < stageNum);
        });

        const screenMap = document.getElementById('stage-screen-map');
        const screenBudget = document.getElementById('stage-screen-budget');
        const mapCanvas = document.getElementById('game-map-canvas-card');
        const mapModeTag = document.getElementById('map-mode-tag');
        const mapModeLabel = document.getElementById('map-mode-label');
        const instructionBadge = document.getElementById('instruction-badge');
        const instructionText = document.getElementById('map-instruction-text');
        const rpgStage1 = document.getElementById('rpg-content-stage-1');
        const rpgStage2 = document.getElementById('rpg-content-stage-2');

        if (stageNum === 1) {
            // Stage 1: Origin Map (Soft Red/Rose background)
            if (screenMap) screenMap.classList.add('active');
            if (screenBudget) screenBudget.classList.remove('active');
            if (mapCanvas) {
                mapCanvas.classList.remove('mode-destination');
                mapCanvas.classList.add('mode-origin');
            }
            if (mapModeTag) mapModeTag.className = "map-mode-indicator-tag tag-origin";
            if (mapModeLabel) mapModeLabel.textContent = "ORIGIN SELECTION • WARM CORAL RADAR";
            if (instructionBadge) instructionBadge.textContent = "BƯỚC 1";
            if (instructionText) instructionText.textContent = "Chọn quốc gia điểm bắt đầu: Bản đồ thế giới thể hiện các nước hỗ trợ đang phát sáng, bấm chọn quốc gia để xem danh sách sân bay:";
            if (rpgStage1) rpgStage1.classList.add('active');
            if (rpgStage2) rpgStage2.classList.remove('active');
        } else if (stageNum === 2) {
            // Stage 2: Destination Map (Theme shifted to Fresh Emerald Green)
            if (screenMap) screenMap.classList.add('active');
            if (screenBudget) screenBudget.classList.remove('active');
            if (mapCanvas) {
                mapCanvas.classList.remove('mode-origin');
                mapCanvas.classList.add('mode-destination');
            }
            if (mapModeTag) mapModeTag.className = "map-mode-indicator-tag tag-destination";
            if (mapModeLabel) mapModeLabel.textContent = "DESTINATION FOCUS • EMERALD VIETNAM";
            if (instructionBadge) instructionBadge.textContent = "BƯỚC 2";
            if (instructionText) instructionText.textContent = "Bản đồ đã chuyển màu xanh lá cây! Bấm vào các điểm trên bản đồ hoặc danh sách bên phải để chọn nơi muốn đến (Quy Nhơn, Gia Lai, Hà Nội):";
            if (rpgStage1) rpgStage1.classList.remove('active');
            if (rpgStage2) rpgStage2.classList.add('active');
        } else if (stageNum === 3) {
            // Stage 3: Split-Screen Budget
            if (screenMap) screenMap.classList.remove('active');
            if (screenBudget) screenBudget.classList.add('active');
            updateBudgetTier();
        }
    }

    // Update Country Selection
    function updateCountrySelection(countryId) {
        if (!COUNTRIES[countryId]) return;
        state.selectedCountry = countryId;
        const country = COUNTRIES[countryId];

        // Update quick chips
        document.querySelectorAll('.country-quick-chip').forEach(chip => {
            chip.classList.toggle('active', chip.getAttribute('data-country') === countryId);
        });

        // Update SVG country paths
        document.querySelectorAll('.interactive-country-group').forEach(group => {
            const isSelected = group.getAttribute('data-country') === countryId;
            group.classList.toggle('active-origin', isSelected);
        });

        // Update Origin Pin Position
        updateMapPinPosition(countryId);

        // Update Right RPG Panel (Stage 1)
        const flagEl = document.getElementById('rpg-country-flag');
        const nameEl = document.getElementById('rpg-country-name');
        const badgeEl = document.getElementById('rpg-continent-badge');
        const listEl = document.getElementById('rpg-airports-list');

        if (flagEl) flagEl.textContent = country.flag;
        if (nameEl) nameEl.textContent = `${country.name.vi} (${country.name.en})`;
        if (badgeEl) badgeEl.textContent = `${country.continent.vi} • ${country.badge.vi}`;

        // Render Airport List
        if (listEl) {
            state.selectedAirport = country.airports[0].code;

            listEl.innerHTML = country.airports.map((apt, idx) => `
                <div class="rpg-airport-card ${idx === 0 ? 'selected' : ''}" data-code="${apt.code}">
                    <div class="airport-code-badge">${apt.code}</div>
                    <div class="airport-info-body">
                        <strong>${apt.name}</strong>
                        <small>${apt.desc}</small>
                    </div>
                    <span class="airport-check-radio"></span>
                </div>
            `).join('');

            // Bind airport clicks
            listEl.querySelectorAll('.rpg-airport-card').forEach(card => {
                card.addEventListener('click', () => {
                    listEl.querySelectorAll('.rpg-airport-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    state.selectedAirport = card.getAttribute('data-code');
                    SFX.playBloop(520);
                    updateSummaryPills();
                });
            });
        }

        updateSummaryPills();
    }

    // Update SVG Origin Pin Coordinates on Map
    function updateMapPinPosition(countryId) {
        const pin = document.getElementById('map-pin-origin');
        const pinLabel = document.getElementById('pin-origin-label');
        const flightArc = document.getElementById('svg-flight-arc');
        if (!pin) return;

        // Predefined anchor coordinates on the SVG map (1000 x 500)
        const PIN_COORDS = {
            belgium: { x: 485, y: 140, label: "BỈ (BRU)" },
            france: { x: 468, y: 160, label: "PHÁP (CDG)" },
            germany: { x: 506, y: 145, label: "ĐỨC (FRA)" },
            usa: { x: 185, y: 175, label: "HOA KỲ (SFO)" },
            japan: { x: 848, y: 175, label: "NHẬT BẢN (TYO)" },
            australia: { x: 815, y: 405, label: "ÚC (SYD)" },
            uk: { x: 446, y: 125, label: "ANH (LHR)" },
            korea: { x: 810, y: 190, label: "HÀN QUỐC (ICN)" },
            singapore: { x: 724, y: 316, label: "SINGAPORE (SIN)" },
            china: { x: 735, y: 195, label: "TRUNG QUỐC (PVG)" },
            vietnam: { x: 722, y: 230, label: "HÀ NỘI (HAN)" }
        };

        const coord = PIN_COORDS[countryId] || PIN_COORDS.belgium;
        pin.setAttribute('transform', `translate(${coord.x}, ${coord.y})`);
        if (pinLabel) pinLabel.textContent = coord.label;

        // Get coordinates of currently selected destination
        const DEST_COORDS = {
            quynhon: { x: 740, y: 282 },
            gialai: { x: 730, y: 268 },
            hanoi: { x: 722, y: 230 }
        };
        const destCoord = DEST_COORDS[state.selectedDestination] || DEST_COORDS.quynhon;

        const midX = (coord.x + destCoord.x) / 2;
        const midY = Math.min(coord.y, destCoord.y) - 45;

        if (flightArc) {
            flightArc.setAttribute('d', `M ${coord.x},${coord.y} Q ${midX},${midY} ${destCoord.x},${destCoord.y}`);
        }
    }

    // Update Destination Selection
    function updateDestinationSelection(destId) {
        state.selectedDestination = destId;

        // Update accordion items on right panel
        const destItems = document.querySelectorAll('.dest-accordion-item');
        destItems.forEach(item => {
            const isMatch = item.getAttribute('data-dest') === destId;
            item.classList.toggle('selected', isMatch);
        });

        // Update destination pins on map
        document.querySelectorAll('.map-dest-pin').forEach(pin => {
            const isMatch = pin.getAttribute('data-dest') === destId;
            pin.classList.toggle('selected', isMatch);
        });

        // Update map flight arc
        updateMapPinPosition(state.selectedCountry);

        updateSummaryPills();
    }

    // Set Currency
    function setCurrency(curKey) {
        if (!CURRENCIES[curKey]) return;
        const prevCur = CURRENCIES[state.selectedCurrency];
        const newCur = CURRENCIES[curKey];
        state.selectedCurrency = curKey;

        // Update currency chips
        document.querySelectorAll('.currency-chip').forEach(chip => {
            chip.classList.toggle('active', chip.getAttribute('data-currency') === curKey);
        });

        // Recalculate current amount to match equivalent USD
        const usdVal = state.currentAmount / prevCur.rate;
        const newAmount = Math.round(usdVal * newCur.rate);
        state.currentAmount = Math.max(newCur.min, Math.min(newAmount, newCur.max));

        // Update Slider and Numeric Input
        const slider = document.getElementById('budget-range-slider');
        const numInput = document.getElementById('budget-numeric-input');
        const symbolEl = document.getElementById('budget-currency-symbol');
        const minLabel = document.getElementById('slider-min-label');
        const maxLabel = document.getElementById('slider-max-label');

        if (slider) {
            slider.min = newCur.min;
            slider.max = newCur.max;
            slider.step = newCur.step;
            slider.value = state.currentAmount;
        }

        if (numInput) {
            numInput.min = newCur.min;
            numInput.max = newCur.max;
            numInput.step = newCur.step;
            numInput.value = state.currentAmount;
        }

        if (symbolEl) symbolEl.textContent = newCur.symbol;
        if (minLabel) minLabel.textContent = formatCurrency(newCur.min, curKey);
        if (maxLabel) maxLabel.textContent = `${formatCurrency(newCur.max, curKey)} (Tối đa)`;

        updateBudgetTier();
    }

    // Update Airplane Visual Tier, Modular Physical Parts & Length
    function updateBudgetTier() {
        const usdVal = getUsdValue();
        state.usdEquivalent = Math.round(usdVal);
        const tier = calculateTier(usdVal);
        state.currentTier = tier;

        // 1. Update USD equivalent pill
        const usdPill = document.getElementById('usd-equivalent-pill');
        if (usdPill) {
            usdPill.textContent = `≈ $${Math.round(usdVal).toLocaleString()} USD`;
        }

        // 2. Continuous Dynamic Airplane Fuselage Length (scaleX from 0.85 to 1.35)
        const planeBox = document.getElementById('aircraft-model-container');
        const fuselageGroup = document.getElementById('fuselage-scalable');
        const stageCard = document.getElementById('aircraft-stage-card');
        const boosterFlame = document.getElementById('plane-booster-flame');
        const skySpeedLines = document.getElementById('sky-speed-lines');

        const normalizedProgress = Math.min(1, Math.max(0, usdVal / 50000));
        const dynamicScaleX = (0.85 + normalizedProgress * 0.48).toFixed(3);

        if (fuselageGroup) {
            fuselageGroup.style.transformOrigin = "190px 110px";
            fuselageGroup.style.transform = `scaleX(${dynamicScaleX})`;
        }

        // 3. Dynamic Flame Thrust Expansion
        if (boosterFlame) {
            const flameRadiusX = 22 + normalizedProgress * 65;
            boosterFlame.setAttribute('rx', flameRadiusX.toFixed(1));
        }

        // 4. Update Classes & Badges
        if (planeBox) {
            planeBox.className = `aircraft-model-container tier-${getTierSlug(tier)}`;
        }
        if (stageCard) {
            stageCard.className = `aircraft-stage-card stage-tier-${getTierSlug(tier)}`;
        }

        const tierLvlTag = document.getElementById('tier-lvl-tag');
        const tierName = document.getElementById('tier-name-label');
        const tierCrown = document.getElementById('tier-crown-icon');
        const perksText = document.getElementById('aircraft-perks-text');

        if (tier === 1) {
            if (tierLvlTag) tierLvlTag.textContent = "TIER 1 • ECO COMMUTER";
            if (tierName) tierName.textContent = "Propeller Aero Hopper";
            if (tierCrown) tierCrown.textContent = "🌱";
            if (perksText) perksText.textContent = "Động cơ cánh quạt kinh tế, tối ưu chi phí, khách sạn biển 3 sao tiện nghi, tự do khám phá.";
        } else if (tier === 2) {
            if (tierLvlTag) tierLvlTag.textContent = "TIER 2 • COMFORT EXPLORER";
            if (tierName) tierName.textContent = "Sky Explorer Twin-Jet";
            if (tierCrown) tierCrown.textContent = "✨";
            if (perksText) perksText.textContent = "Động cơ phản lực đôi, thân máy bay mở rộng, khách sạn 4 sao ven biển, ẩm thực hải sản & xe đưa đón.";
        } else if (tier === 3) {
            if (tierLvlTag) tierLvlTag.textContent = "TIER 3 • SUPERSONIC BUSINESS";
            if (tierName) tierName.textContent = "Mach-2 Falcon Executive";
            if (tierCrown) tierCrown.textContent = "💎";
            if (perksText) perksText.textContent = "Cánh tam giác siêu thanh & mũi nhọn khí động học, resort 5 sao cao cấp (Anantara / Maia), xe VIP riêng.";
        } else {
            if (tierLvlTag) tierLvlTag.textContent = "TIER 4 • ROYAL CELESTIAL ($25K - $50K)";
            if (tierName) tierName.textContent = "Royal Celestial Hyper-Cruiser";
            if (tierCrown) tierCrown.textContent = "👑";
            if (perksText) perksText.textContent = "Thân máy bay cực đại, cánh Canards, 4 động cơ đẩy ion & vương miện hoàng gia, biệt thự biển, du thuyền riêng!";
        }

        updateSummaryPills();
    }

    function getTierSlug(tier) {
        if (tier === 1) return 'economy';
        if (tier === 2) return 'standard';
        if (tier === 3) return 'business';
        return 'royal';
    }

    // Update Bottom Summary Strip
    function updateSummaryPills() {
        const originEl = document.getElementById('summary-origin-pill');
        const destEl = document.getElementById('summary-dest-pill');
        const budgetEl = document.getElementById('summary-budget-display');

        const country = COUNTRIES[state.selectedCountry];
        const dest = DESTINATIONS.find(d => d.id === state.selectedDestination) || DESTINATIONS[0];

        if (originEl && country) {
            originEl.textContent = `${country.flag} ${country.name.vi} (${state.selectedAirport})`;
        }
        if (destEl && dest) {
            destEl.textContent = `🇻🇳 ${dest.name.vi} (${dest.airportCode})`;
        }
        if (budgetEl) {
            budgetEl.textContent = `${formatCurrency(state.currentAmount, state.selectedCurrency)} (≈ $${state.usdEquivalent.toLocaleString()} USD)`;
        }
    }

    // Launch Journey Plan (Syncs to App and fires AI simulation)
    function launchJourneyPlan() {
        SFX.playHyperspace();

        // 1. Hyperspace Airplane Launch Animation
        const planeBox = document.getElementById('aircraft-model-container');
        if (planeBox) {
            planeBox.classList.add('hyperspace-launch');
        }

        // 2. Synchronize values into the underlying forms and App state
        const countrySelect = document.getElementById('country-select');
        const budgetSelect = document.getElementById('budget-select');
        const customBudgetInput = document.getElementById('custom-budget-input');
        const customBudgetContainer = document.getElementById('custom-budget-container');
        const destinationSelect = document.getElementById('destination-select');

        if (countrySelect) {
            countrySelect.value = state.selectedCountry;
            countrySelect.dispatchEvent(new Event('change'));
        }

        if (budgetSelect && customBudgetInput) {
            budgetSelect.value = 'custom';
            if (customBudgetContainer) customBudgetContainer.style.display = 'block';
            customBudgetInput.value = state.usdEquivalent;
        }

        if (destinationSelect) {
            destinationSelect.value = state.selectedDestination;
        }

        // 3. Update App state directly
        if (window.App) {
            if (typeof App.setPlannerData === 'function') {
                App.setPlannerData(state.selectedCountry, state.usdEquivalent, state.selectedDestination, state.selectedAirport);
            }
            const appState = App.getState();
            if (appState) {
                appState.currentCountryKey = state.selectedCountry;
                appState.currentBudget = state.usdEquivalent;
                appState.currentDestination = state.selectedDestination;
            }
        }

        // 4. Smooth scroll and trigger AI plan generation
        setTimeout(() => {
            const aiCard = document.getElementById('ai-assistant-card');
            if (aiCard) {
                aiCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            if (window.App && typeof App.generateJourneyPlan === 'function') {
                App.generateJourneyPlan(true);
            } else {
                const form = document.getElementById('journey-planner-form');
                if (form) {
                    form.dispatchEvent(new Event('submit', { cancelable: true }));
                }
            }

            // Remove hyperspace class after animation completes
            setTimeout(() => {
                if (planeBox) planeBox.classList.remove('hyperspace-launch');
            }, 1000);
        }, 500);
    }

    return {
        init: init,
        setStage: setStage,
        getState: function() { return state; }
    };
})();

// Auto-boot on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    GameWizard.init();
});
