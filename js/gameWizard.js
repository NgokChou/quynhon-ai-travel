/**
 * Quy Nhon AI Travel Assistant - 2.5D Isometric Adventure Experience
 * ISOMETRIC 3D ADVENTURE WORLD – MINIATURE VIETNAM – MODULAR AIRCRAFT HANGAR
 * 
 * Step 1: Isometric 3D Adventure World Map & Flight Origin (Parabolic Arc & 2-Click Airport)
 * Step 2: Miniature 3D Vietnam Diorama + 3 Quest Beacons (Quy Nhon Hero Main Quest)
 * Step 3: Isometric Aircraft Hangar with Physical Modular Assembly ($0 - $50,000 USD)
 */

const GameWizard = (function() {
    // 1. Web Audio API Sound Synthesizer (Zero-latency, 100% offline, game SFX)
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
        playBloop(freq = 520, duration = 0.06) {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(freq * 1.3, this.ctx.currentTime + duration);
                gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
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
                    gain.gain.setValueAtTime(0.06, this.ctx.currentTime + idx * 0.05);
                    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.05 + 0.22);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(this.ctx.currentTime + idx * 0.05);
                    osc.stop(this.ctx.currentTime + idx * 0.05 + 0.22);
                });
            } catch (e) {}
        },
        playMechSnap() {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                // Mechanical pneumatic latch snap sound
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(320, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.08);
                gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.09);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.09);
            } catch (e) {}
        },
        playWhoosh() {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const bufferSize = this.ctx.sampleRate * 0.18;
                const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
                const data = buffer.getChannelData(0);
                for (let i = 0; i < bufferSize; i++) {
                    data[i] = Math.random() * 2 - 1;
                }
                const noise = this.ctx.createBufferSource();
                noise.buffer = buffer;
                const filter = this.ctx.createBiquadFilter();
                filter.type = 'bandpass';
                filter.frequency.setValueAtTime(200, this.ctx.currentTime);
                filter.frequency.exponentialRampToValueAtTime(2200, this.ctx.currentTime + 0.14);
                const gain = this.ctx.createGain();
                gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.18);
                noise.connect(filter);
                filter.connect(gain);
                gain.connect(this.ctx.destination);
                noise.start();
            } catch (e) {}
        },
        playTakeoff() {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(220, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1880, this.ctx.currentTime + 0.55);
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
            city: { en: "Brussels", vi: "Brussels" },
            continent: { en: "Europe", vi: "Châu Âu" },
            airports: [
                { code: "BRU", name: "Brussels Airport", city: "Brussels", desc: "Sân bay quốc tế thủ đô Brussels (BRU)" }
            ]
        },
        france: {
            id: "france",
            name: { en: "France", vi: "Pháp" },
            flag: "🇫🇷",
            city: { en: "Paris", vi: "Paris" },
            continent: { en: "Europe", vi: "Châu Âu" },
            airports: [
                { code: "CDG", name: "Paris Charles de Gaulle", city: "Paris", desc: "Cửa ngõ liên lục địa lớn nhất Pháp (CDG)" },
                { code: "ORY", name: "Paris Orly Airport", city: "Paris", desc: "Sân bay quốc tế Paris Orly (ORY)" },
                { code: "NCE", name: "Nice Côte d'Azur", city: "Nice", desc: "Cửa ngõ miền Nam Địa Trung Hải (NCE)" }
            ]
        },
        germany: {
            id: "germany",
            name: { en: "Germany", vi: "Đức" },
            flag: "🇩🇪",
            city: { en: "Frankfurt", vi: "Frankfurt" },
            continent: { en: "Europe", vi: "Châu Âu" },
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
            city: { en: "San Francisco", vi: "San Francisco" },
            continent: { en: "North America", vi: "Bắc Mỹ" },
            airports: [
                { code: "SFO", name: "San Francisco International", city: "San Francisco", desc: "Cửa ngõ Bờ Tây kết nối Việt Nam (SFO)" },
                { code: "LAX", name: "Los Angeles International", city: "Los Angeles", desc: "Trung tâm hàng không lớn nhất Nam California (LAX)" },
                { code: "JFK", name: "New York John F. Kennedy", city: "New York", desc: "Cửa ngõ Bờ Đông quốc tế lớn nhất Mỹ (JFK)" },
                { code: "ORD", name: "Chicago O'Hare", city: "Chicago", desc: "Trung tâm trung chuyển xuyên lục địa (ORD)" }
            ]
        },
        japan: {
            id: "japan",
            name: { en: "Japan", vi: "Nhật Bản" },
            flag: "🇯🇵",
            city: { en: "Tokyo", vi: "Tokyo" },
            continent: { en: "Asia", vi: "Châu Á" },
            airports: [
                { code: "HND", name: "Tokyo Haneda", city: "Tokyo", desc: "Sân bay nội đô Tokyo 5 sao quốc tế (HND)" },
                { code: "NRT", name: "Tokyo Narita", city: "Tokyo", desc: "Cửa ngõ liên lục địa lớn nhất Nhật Bản (NRT)" },
                { code: "KIX", name: "Osaka Kansai", city: "Osaka", desc: "Sân bay quốc tế trên đảo nhân tạo Kansai (KIX)" }
            ]
        },
        australia: {
            id: "australia",
            name: { en: "Australia", vi: "Úc" },
            flag: "🇦🇺",
            city: { en: "Sydney", vi: "Sydney" },
            continent: { en: "Oceania", vi: "Châu Đại Dương" },
            airports: [
                { code: "SYD", name: "Sydney Kingsford Smith", city: "Sydney", desc: "Cửa ngõ bay thẳng kết nối Việt Nam (SYD)" },
                { code: "MEL", name: "Melbourne Airport", city: "Melbourne", desc: "Trung tâm văn hóa nghệ thuật Victoria (MEL)" },
                { code: "BNE", name: "Brisbane Airport", city: "Brisbane", desc: "Sân bay bờ Đông bang Queensland (BNE)" }
            ]
        },
        uk: {
            id: "uk",
            name: { en: "United Kingdom", vi: "Vương Quốc Anh" },
            flag: "🇬🇧",
            city: { en: "London", vi: "London" },
            continent: { en: "Europe", vi: "Châu Âu" },
            airports: [
                { code: "LHR", name: "London Heathrow", city: "London", desc: "Trung tâm bay thẳng London - Hà Nội (LHR)" },
                { code: "MAN", name: "Manchester Airport", city: "Manchester", desc: "Cửa ngõ miền Bắc nước Anh (MAN)" }
            ]
        },
        korea: {
            id: "korea",
            name: { en: "South Korea", vi: "Hàn Quốc" },
            flag: "🇰🇷",
            city: { en: "Seoul", vi: "Seoul" },
            continent: { en: "Asia", vi: "Châu Á" },
            airports: [
                { code: "ICN", name: "Seoul Incheon", city: "Seoul", desc: "Sân bay 5 sao Incheon - Bay thẳng tới miền Trung VN (ICN)" },
                { code: "PUS", name: "Busan Gimhae", city: "Busan", desc: "Sân bay quốc tế thành phố cảng Busan (PUS)" }
            ]
        },
        singapore: {
            id: "singapore",
            name: { en: "Singapore", vi: "Singapore" },
            flag: "🇸🇬",
            city: { en: "Singapore", vi: "Singapore" },
            continent: { en: "Asia", vi: "Đông Nam Á" },
            airports: [
                { code: "SIN", name: "Singapore Changi Airport", city: "Singapore", desc: "Sân bay tốt nhất thế giới Changi (SIN)" }
            ]
        },
        china: {
            id: "china",
            name: { en: "China", vi: "Trung Quốc" },
            flag: "🇨🇳",
            city: { en: "Shanghai", vi: "Thượng Hải" },
            continent: { en: "Asia", vi: "Châu Á" },
            airports: [
                { code: "PVG", name: "Shanghai Pudong", city: "Shanghai", desc: "Cửa ngõ quốc tế Thượng Hải (PVG)" },
                { code: "PEK", name: "Beijing Capital", city: "Beijing", desc: "Sân bay thủ đô Bắc Kinh (PEK)" }
            ]
        },
        vietnam: {
            id: "vietnam",
            name: { en: "Vietnam (Domestic)", vi: "Việt Nam (Nội địa)" },
            flag: "🇻🇳",
            city: { en: "Hanoi", vi: "Hà Nội" },
            continent: { en: "Asia", vi: "Việt Nam" },
            airports: [
                { code: "HAN", name: "Noi Bai International Airport", city: "Hà Nội", desc: "Bay thẳng 1h35m tới Sân bay Phù Cát (UIH)" },
                { code: "SGN", name: "Tan Son Nhat International Airport", city: "TP. Hồ Chí Minh", desc: "Bay thẳng 1h10m tới Sân bay Phù Cát (UIH)" }
            ]
        }
    };

    // 3. The 3 Isometric Quest Destinations (Quy Nhon Main Quest)
    const DESTINATIONS = [
        {
            id: "quynhon",
            isHero: true,
            questTitle: { en: "QUY NHON – MAIN QUEST", vi: "QUY NHƠN – NHIỆM VỤ CHÍNH (MAIN QUEST)" },
            name: { en: "Quy Nhon Coastal Pearl", vi: "Quy Nhơn – Biển Ngọc Miền Trung" },
            airportCode: "UIH",
            airportName: "Phu Cat Airport",
            badge: { en: "HERO MAIN QUEST • AI HUB", vi: "NHIỆM VỤ CHÍNH • TRỌNG TÂM AI" },
            quote: { 
                en: "Discover Quy Nhon – Emerald Ky Co & Eo Gio Cliffs.",
                vi: "Khám phá Quy Nhơn – Biển ngọc Kỳ Co & vách đá Eo Gió lộng gió."
            },
            icon: "fa-umbrella-beach",
            color: "#00b4d8",
            tags: ["Kỳ Co Emerald", "Eo Gió Cliffs", "Cham Towers", "Nhơn Lý Seafood"]
        },
        {
            id: "gialai",
            isHero: false,
            questTitle: { en: "GIA LAI – EXPLORATION QUEST", vi: "GIA LAI – THÁM HIỂM ĐẠI NGÀN" },
            name: { en: "Gia Lai Highlands Eco", vi: "Gia Lai – Sinh Thái Đại Ngàn" },
            airportCode: "PXU",
            airportName: "Pleiku Airport",
            badge: { en: "EXPLORATION QUEST • HIGHLANDS", vi: "NHIỆM VỤ THÁM HIỂM • TÂY NGUYÊN" },
            quote: {
                en: "Explore the Highlands – Sea Lake T'Nung & Pine Forests.",
                vi: "Thám hiểm Tây Nguyên – Biển Hồ T'nưng thơ mộng & núi lửa Chư Đăng Ya."
            },
            icon: "fa-mountain-sun",
            color: "#10b981",
            tags: ["Biển Hồ T'nưng", "Núi Lửa Cổ", "Rừng Nguyên Sinh", "Bazan Coffee"]
        },
        {
            id: "hanoi",
            isHero: false,
            questTitle: { en: "HANOI – CAPITAL QUEST", vi: "HÀ NỘI – KINH ĐÔ DI SẢN" },
            name: { en: "Hanoi Heritage Gateway", vi: "Hà Nội – Thủ Đô Nghìn Năm" },
            airportCode: "HAN",
            airportName: "Noi Bai International Airport",
            badge: { en: "CAPITAL QUEST • HERITAGE", vi: "NHIỆM VỤ THỦ ĐÔ • VĂN HÓA NGHÌN NĂM" },
            quote: {
                en: "Experience Hanoi – Sword Lake & 36 Old Guilds.",
                vi: "Trải nghiệm Hà Nội – Tháp Rùa Hồ Gươm & 36 phố phường rêu phong."
            },
            icon: "fa-landmark-dome",
            color: "#f59e0b",
            tags: ["Hồ Gươm", "Khuê Văn Các", "36 Phố Cổ", "Ẩm Thực Tràng An"]
        }
    ];

    // 4. Currency Specifications: 4 Currencies
    const CURRENCIES = {
        USD: { symbol: "$", rate: 1, max: 50000, min: 0, step: 100, label: "USD ($)" },
        VND: { symbol: "₫", rate: 25000, max: 1250000000, min: 0, step: 5000000, label: "VND (₫)" },
        EUR: { symbol: "€", rate: 0.92, max: 46000, min: 0, step: 100, label: "EUR (€)" },
        JPY: { symbol: "¥", rate: 150, max: 7500000, min: 0, step: 15000, label: "JPY (¥)" }
    };

    // 5. Modular Assembly Experience Tiers ($0 - $50,000 USD)
    const TIERS = [
        {
            id: 1,
            slug: "frame",
            usdThreshold: 0,
            name: { en: "Basic Frame Assembly", vi: "Khung Cơ Bản (Basic Frame)" },
            icon: "🛠️",
            tag: "HANGAR STAGE 1 • FRAME ONLY",
            modules: { wings: false, engines: false, tail: false, premium: false, doors: false },
            perks: {
                acc: { en: "Cozy Beach Homestays & Hostels", vi: "Homestay & Hostel gần biển tiện nghi" },
                trans: { en: "Eco Scooter & Local Coastal Buses", vi: "Xe máy sinh thái & xe buýt địa phương" },
                food: { en: "Local Street Food & Seafood Bites", vi: "Bánh xèo tôm nhảy & ốc đêm Nhơn Lý" }
            }
        },
        {
            id: 2,
            slug: "wings",
            usdThreshold: 2500,
            name: { en: "Wings Installed", vi: "Lắp Cánh Hoàn Tất (Wings Installed)" },
            icon: "✈️",
            tag: "HANGAR STAGE 2 • WINGS LOCKED",
            modules: { wings: true, engines: false, tail: false, premium: false, doors: false },
            perks: {
                acc: { en: "3 to 4-Star Oceanfront Coastal Hotel", vi: "Khách sạn 3–4 sao ngắm trọn vịnh biển" },
                trans: { en: "Comfort Airport Shuttle & Tours", vi: "Xe đưa đón sân bay & tour tiện ích" },
                food: { en: "Fresh Seafood Dinners & Coastal Cafes", vi: "Tiệc hải sản tươi sống & cafe biển Eo Gió" }
            }
        },
        {
            id: 3,
            slug: "engines",
            usdThreshold: 8000,
            name: { en: "Engines Installed", vi: "Lắp Động Cơ Phản Lực (Engines Installed)" },
            icon: "🔥",
            tag: "HANGAR STAGE 3 • DUAL TURBOFANS",
            modules: { wings: true, engines: true, tail: false, premium: false, doors: false },
            perks: {
                acc: { en: "5-Star Luxury Resort (Anantara / Maia)", vi: "Resort 5 sao cao cấp (Anantara / Maia)" },
                trans: { en: "Private Chauffeur Car & Fast Track", vi: "Xe riêng đưa đón & thủ tục ưu tiên" },
                food: { en: "Fine Dining Tasting Menu & Sunset Yacht", vi: "Set menu cao cấp & du thuyền hoàng hôn" }
            }
        },
        {
            id: 4,
            slug: "full",
            usdThreshold: 20000,
            name: { en: "Full Aircraft Assembled", vi: "Hoàn Thiện Toàn Diện (Full Aircraft)" },
            icon: "💎",
            tag: "HANGAR STAGE 4 • MACH-2 READY",
            modules: { wings: true, engines: true, tail: true, premium: false, doors: false },
            perks: {
                acc: { en: "Ultra-Luxury Cliffside Ocean Pool Villa", vi: "Biệt thự hồ bơi vô cực vách đá riêng biệt" },
                trans: { en: "VIP Limousine & Exclusive Charters", vi: "Limousine VIP & cano riêng khám phá đảo" },
                food: { en: "Private Beach BBQ & Rare Vintage Wines", vi: "Tiệc nướng bờ biển riêng & vang hảo hạng" }
            }
        },
        {
            id: 5,
            slug: "premium",
            usdThreshold: 50000,
            name: { en: "Ready for Takeoff", vi: "Xuất Xưởng & Sẵn Sàng Bay (Ready for Takeoff)" },
            icon: "👑",
            tag: "HANGAR STAGE 5 • READY FOR TAKEOFF",
            modules: { wings: true, engines: true, tail: true, premium: true, doors: true },
            perks: {
                acc: { en: "Presidential Flagship Estate & Butler", vi: "Dinh thự Tổng Thống & quản gia riêng 24/7" },
                trans: { en: "Private Yacht & Helicopter Transfer", vi: "Du thuyền cá nhân & trực thăng ngắm cảnh" },
                food: { en: "Michelin-Standard Masterchef Banquet", vi: "Đại tiệc ẩm thực chuẩn sao Michelin" }
            }
        }
    ];

    // Internal State
    const state = {
        currentStage: 1, // 1: Isometric World, 2: Miniature Vietnam, 3: Aircraft Hangar
        selectedCountry: "belgium",
        selectedAirport: "BRU",
        selectedDestination: "quynhon",
        selectedCurrency: "USD",
        budgetUSD: 2500, // Ground truth in USD
        currentAmount: 2500, // In active currency
        currentTierIndex: 1, // 0 to 4
        previousTierIndex: 1,
        currentLang: "vi"
    };

    // Calculate Active Modular Tier based on USD
    function getTierIndex(usd) {
        if (usd < 2500) return 0; // Frame only ($500)
        if (usd < 8000) return 1; // Wings ($2,500)
        if (usd < 20000) return 2; // Engines ($8,000)
        if (usd < 50000) return 3; // Full ($20,000)
        return 4; // Premium Takeoff ($50,000)
    }

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

        const docLang = document.documentElement.lang || 'vi';
        state.currentLang = docLang.startsWith('en') ? 'en' : 'vi';

        renderWizardHTML(container);
        bindEvents();
        updateCountrySelection(state.selectedCountry, false);
        updateDestinationSelection(state.selectedDestination);
        updateHangarAssembly(false);
    }

    // Render Full Wizard Skeleton
    function renderWizardHTML(container) {
        const isVi = state.currentLang === 'vi';
        const tier = TIERS[state.currentTierIndex];

        container.innerHTML = `
            <div class="game-wizard-wrapper" id="game-wizard-wrapper">
                
                <!-- TOP HUD BAR: Logo, 3-Step Progress Indicator, Sound Toggle -->
                <div class="game-hud-bar">
                    <div class="game-hud-brand">
                        <span class="game-brand-icon">🧭</span>
                        <div class="game-brand-text">
                            <strong>ISOMETRIC ADVENTURE</strong>
                            <small>${isVi ? 'Khám Phá Thế Giới & Sa Bàn Việt Nam' : 'World Discovery & Miniature Vietnam'}</small>
                        </div>
                    </div>

                    <!-- 3-Step Progress Navigation -->
                    <div class="game-stages-nav">
                        <button type="button" class="stage-nav-pill active" data-stage="1" id="nav-pill-stage-1">
                            <span class="stage-pill-num">1</span>
                            <span class="stage-pill-text">${isVi ? '1. Sa Bàn Thế Giới' : '1. World Map'}</span>
                        </button>
                        <div class="stage-nav-arrow">➔</div>
                        <button type="button" class="stage-nav-pill" data-stage="2" id="nav-pill-stage-2">
                            <span class="stage-pill-num">2</span>
                            <span class="stage-pill-text">${isVi ? '2. Sa Bàn Việt Nam' : '2. Vietnam Quests'}</span>
                        </button>
                        <div class="stage-nav-arrow">➔</div>
                        <button type="button" class="stage-nav-pill" data-stage="3" id="nav-pill-stage-3">
                            <span class="stage-pill-num">3</span>
                            <span class="stage-pill-text">${isVi ? '3. Xưởng Lắp Ráp Hangar' : '3. Aircraft Hangar'}</span>
                        </button>
                    </div>

                    <!-- Sound SFX Toggle Button -->
                    <div class="game-hud-controls">
                        <button type="button" id="game-sfx-toggle" class="btn-game-sfx" title="SFX Audio">
                            <span class="sfx-icon">🔊</span>
                            <span class="sfx-text">SFX ON</span>
                        </button>
                    </div>
                </div>

                <!-- =======================================================
                     STEP 1: ISOMETRIC 3D ADVENTURE WORLD MAP
                     ======================================================= -->
                <div class="game-stage-screen active" id="stage-screen-world">
                    
                    <div class="stage-instruction-banner banner-world">
                        <span class="instruction-badge">${isVi ? 'BƯỚC 1' : 'STEP 1'}</span>
                        <span class="instruction-text">
                            ${isVi 
                                ? 'Sa Bàn Thế Giới 3D: Khám phá các lục địa, nhấp chọn quốc gia khởi hành và chọn sân bay xuất phát:' 
                                : 'Isometric 3D World Map: Discover continents, click your departure country and select an airport:'}
                        </span>
                    </div>

                    <!-- Quick Select Dock (Flag + Country + City) -->
                    <div class="game-quick-country-strip" id="quick-country-strip">
                        ${Object.values(COUNTRIES).map(c => `
                            <button type="button" class="country-quick-chip ${c.id === state.selectedCountry ? 'active' : ''}" data-country="${c.id}">
                                <span class="chip-flag">${c.flag}</span>
                                <span class="chip-name">${c.name[state.currentLang]}</span>
                                <span class="chip-city-sub">(${c.city[state.currentLang]})</span>
                            </button>
                        `).join('')}
                    </div>

                    <!-- 2-Column Split: Isometric 2.5D World Map & Airport Dock -->
                    <div class="game-map-layout-grid">
                        
                        <!-- Left: 2.5D Isometric World Map Canvas -->
                        <div class="game-map-canvas-card" id="isometric-world-card">
                            <div class="map-mode-indicator-tag">
                                <span class="pulse-beacon-dot"></span>
                                <span>ISOMETRIC 3D RADAR • WORLD ADVENTURE</span>
                            </div>

                            <div class="svg-map-viewport">
                                <svg viewBox="0 0 1000 520" class="kurzgesagt-world-svg" id="isometric-world-svg">
                                    <defs>
                                        <!-- Hexagonal Coordinate Pattern -->
                                        <pattern id="isoHexGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                                            <path d="M 20 0 L 40 10 L 40 30 L 20 40 L 0 30 L 0 10 Z" fill="none" stroke="rgba(56, 189, 248, 0.08)" stroke-width="0.8"/>
                                        </pattern>
                                        
                                        <!-- Parabolic 3D Arc Gradient -->
                                        <linearGradient id="flightArc3DGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stop-color="#38bdf8"/>
                                            <stop offset="50%" stop-color="#00b4d8"/>
                                            <stop offset="100%" stop-color="#ffb703"/>
                                        </linearGradient>
                                    </defs>

                                    <!-- Deep Ocean Plate -->
                                    <rect width="1000" height="520" rx="18" fill="#07182e" />
                                    <rect width="1000" height="520" rx="18" fill="url(#isoHexGrid)" pointer-events="none" />

                                    <!-- 2.5D Extruded Continents with Shadows & Depth Slabs -->
                                    <g class="iso-continents-layer">
                                        <!-- Extrusion Shadows (Underneath) -->
                                        <g class="iso-slabs-extrusion">
                                            <!-- North America Extruded Depth Slab -->
                                            <path d="M 60,95 L 280,115 L 280,125 L 60,105 Z M 115,145 L 270,215 L 270,225 L 115,155 Z" class="slab-edge" />
                                            <!-- South America Extruded Depth Slab -->
                                            <path d="M 225,285 L 270,490 L 270,500 L 225,295 Z" class="slab-edge" />
                                            <!-- Eurasia & Africa Extruded Depth Slab -->
                                            <path d="M 430,190 L 525,140 L 525,150 L 430,200 Z M 440,235 L 525,460 L 525,470 L 440,245 Z M 560,75 L 920,95 L 920,105 L 560,85 Z" class="slab-edge" />
                                            <!-- Australia Extruded Depth Slab -->
                                            <path d="M 775,365 L 815,465 L 815,475 L 775,375 Z" class="slab-edge" />
                                        </g>

                                        <!-- Inactive Base Landmasses -->
                                        <g class="iso-inactive-lands">
                                            <path class="map-country-path map-land-inactive" d="M 60,85 Q 100,50 160,65 Q 210,60 250,75 L 280,105 L 260,135 L 180,135 L 120,130 L 70,110 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 170,45 Q 230,35 290,50 L 305,80 L 250,75 Z M 270,30 L 310,35 L 300,55 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 340,35 Q 380,25 400,45 L 390,95 Q 365,100 345,75 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 140,215 L 175,215 L 210,240 L 235,270 L 220,275 L 180,245 L 140,225 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 225,275 Q 275,260 315,290 Q 355,330 330,385 Q 295,440 270,480 L 255,475 Q 240,400 230,340 Q 220,300 225,275 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 490,65 Q 520,50 540,80 L 530,120 L 505,120 L 495,85 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 430,180 L 460,180 L 455,215 L 430,210 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 495,185 L 515,190 L 518,225 L 505,225 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 525,130 L 585,125 L 595,180 L 535,185 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 440,225 Q 530,215 575,245 Q 590,290 580,345 Q 555,410 525,450 L 500,445 Q 465,370 450,315 Q 435,265 440,225 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 590,380 Q 605,375 605,420 L 595,435 Q 585,410 590,380 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 560,65 Q 670,45 800,60 Q 880,75 920,85 L 905,125 Q 810,135 720,130 Q 620,120 560,115 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 575,215 Q 625,210 640,245 L 620,280 L 585,270 L 575,235 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 595,135 L 685,135 L 685,195 L 595,195 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 640,215 Q 680,210 685,245 Q 670,295 655,320 L 640,285 Q 630,245 640,215 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 715,335 L 775,355 L 765,365 L 710,345 Z M 750,315 Q 775,310 775,335 L 750,340 Z M 785,260 Q 798,255 798,290 L 785,300 Z" />
                                            <path class="map-country-path map-land-inactive" d="M 905,425 Q 920,420 920,455 L 905,475 Z M 920,440 L 935,465 Z" />
                                        </g>

                                        <!-- Supported Active Countries (Isometric 3D Elevation) -->
                                        <g class="interactive-country-group" data-country="usa">
                                            <path class="map-country-path interactive-country" data-country="usa" d="M 115,135 Q 185,135 255,140 Q 280,165 270,205 Q 235,225 175,225 Q 130,215 110,185 Z" />
                                            <text x="185" y="180" class="map-country-label">USA</text>
                                        </g>
                                        <g class="interactive-country-group" data-country="uk">
                                            <path class="map-country-path interactive-country" data-country="uk" d="M 435,115 Q 455,108 458,128 Q 450,145 438,140 Z" />
                                            <text x="446" y="112" class="map-country-label">UK</text>
                                        </g>
                                        <g class="interactive-country-group" data-country="belgium">
                                            <path class="map-country-path interactive-country" data-country="belgium" d="M 478,136 L 490,134 L 488,148 L 476,146 Z" />
                                            <text x="495" y="132" class="map-country-label">BELGIUM</text>
                                        </g>
                                        <g class="interactive-country-group" data-country="france">
                                            <path class="map-country-path interactive-country" data-country="france" d="M 455,145 L 482,142 L 480,175 L 452,175 Z" />
                                            <text x="466" y="162" class="map-country-label">FRANCE</text>
                                        </g>
                                        <g class="interactive-country-group" data-country="germany">
                                            <path class="map-country-path interactive-country" data-country="germany" d="M 490,130 L 522,126 L 520,162 L 490,158 Z" />
                                            <text x="506" y="148" class="map-country-label">GERMANY</text>
                                        </g>
                                        <g class="interactive-country-group" data-country="china">
                                            <path class="map-country-path interactive-country" data-country="china" d="M 685,155 Q 770,145 795,185 Q 790,235 735,245 Q 675,235 675,190 Z" />
                                            <text x="735" y="195" class="map-country-label">CHINA</text>
                                        </g>
                                        <g class="interactive-country-group" data-country="korea">
                                            <path class="map-country-path interactive-country" data-country="korea" d="M 800,180 L 818,178 L 815,205 L 800,202 Z" />
                                            <text x="826" y="192" class="map-country-label">KOREA</text>
                                        </g>
                                        <g class="interactive-country-group" data-country="japan">
                                            <path class="map-country-path interactive-country" data-country="japan" d="M 835,160 Q 855,150 855,175 L 840,215 Q 828,215 832,190 Z M 850,145 L 865,140 L 860,158 Z" />
                                            <text x="860" y="175" class="map-country-label">JAPAN</text>
                                        </g>
                                        <g class="interactive-country-group" data-country="singapore">
                                            <path class="map-country-path interactive-country" data-country="singapore" d="M 718,310 L 730,310 L 726,322 L 715,320 Z" />
                                            <text x="735" y="325" class="map-country-label">SINGAPORE</text>
                                        </g>
                                        <g class="interactive-country-group" data-country="australia">
                                            <path class="map-country-path interactive-country" data-country="australia" d="M 775,355 Q 855,340 875,385 Q 865,445 815,455 Q 765,435 755,395 Z" />
                                            <text x="815" y="405" class="map-country-label">AUSTRALIA</text>
                                        </g>
                                        <g class="interactive-country-group" data-country="vietnam">
                                            <path class="map-country-path interactive-country" data-country="vietnam" d="M 718,225 Q 734,222 730,240 Q 722,258 734,275 Q 738,290 726,305 L 716,300 Q 714,282 724,268 Q 726,250 715,238 Z" />
                                            <text x="742" y="258" class="map-country-label" style="fill:#fde047;font-weight:900;">VIỆT NAM ⭐</text>
                                        </g>
                                    </g>

                                    <!-- Parabolic 3D Flight Arc with Shadow & Tiny Traversing Plane -->
                                    <path id="svg-flight-shadow" class="svg-flight-shadow" d="M 485,160 Q 610,120 740,295" />
                                    <path id="svg-flight-arc" class="svg-flight-arc-3d" d="M 485,140 Q 610,60 740,282" />
                                    
                                    <!-- Tiny 3D Airplane on the Flight Arc -->
                                    <g id="tiny-flight-plane" class="tiny-arc-plane" transform="translate(610, 60)">
                                        <polygon points="0,-8 6,4 0,2 -6,4" fill="#ffb703" />
                                        <circle cx="0" cy="0" r="2" fill="#ffffff" />
                                    </g>

                                    <!-- 3D Departure Airport Pin -->
                                    <g id="map-pin-origin" class="game-svg-pin pin-origin" transform="translate(485, 140)">
                                        <line x1="0" y1="0" x2="0" y2="-18" stroke="#ffffff" stroke-width="2" />
                                        <circle cx="0" cy="-18" r="7" fill="#10b981" stroke="#ffffff" stroke-width="2" />
                                        <text y="-28" text-anchor="middle" class="pin-tag-text" id="pin-origin-label">BỈ (BRU)</text>
                                    </g>
                                </svg>
                            </div>

                            <div class="map-card-footer">
                                <div class="map-legend-pills">
                                    <span class="legend-chip"><span class="legend-dot origin-dot"></span> ${isVi ? 'Xuất Phát' : 'Origin'}</span>
                                    <span class="legend-chip"><span class="legend-dot dest-dot"></span> ${isVi ? 'Việt Nam' : 'Vietnam'}</span>
                                    <span class="legend-chip"><span class="legend-dot route-dot"></span> ${isVi ? 'Đường Bay 3D' : '3D Arc'}</span>
                                </div>
                                <div class="map-hint-text">
                                    <i class="fa-solid fa-gamepad"></i> ${isVi ? 'Nhấp quốc gia để mở khóa sân bay' : 'Click a country to unlock airports'}
                                </div>
                            </div>
                        </div>

                        <!-- Right: Airport Selection Panel (2-Click Experience) -->
                        <div class="game-rpg-panel" id="departure-rpg-panel">
                            <div class="rpg-stage-content">
                                <div class="rpg-panel-header">
                                    <span class="rpg-country-flag" id="rpg-country-flag">🇧🇪</span>
                                    <div class="rpg-country-meta">
                                        <h3 id="rpg-country-name">Bỉ (Belgium)</h3>
                                        <span class="rpg-continent-badge" id="rpg-continent-badge">Châu Âu</span>
                                    </div>
                                </div>

                                <div class="rpg-sub-header">
                                    <i class="fa-solid fa-plane-departure"></i>
                                    <span>${isVi ? 'CHỌN SÂN BAY XUẤT PHÁT (CLICK 2):' : 'SELECT DEPARTURE AIRPORT (CLICK 2):'}</span>
                                </div>

                                <div class="rpg-airports-list" id="rpg-airports-list">
                                    <!-- Dynamic Airport Cards -->
                                </div>

                                <div class="rpg-action-footer">
                                    <button type="button" class="btn-game-next" id="btn-goto-stage-2">
                                        <span>${isVi ? 'KHÁM PHÁ SA BÀN VIỆT NAM' : 'DISCOVER VIETNAM'}</span>
                                        <i class="fa-solid fa-arrow-right"></i>
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- =======================================================
                     STEP 2: MINIATURE 3D VIETNAM + QUEST BEACONS
                     ======================================================= -->
                <div class="game-stage-screen" id="stage-screen-destination">
                    
                    <div class="stage-instruction-banner banner-destination">
                        <span class="instruction-badge">${isVi ? 'BƯỚC 2' : 'STEP 2'}</span>
                        <span class="instruction-text">
                            ${isVi 
                                ? 'Sa Bàn Việt Nam 3D Thu Nhỏ: Chọn 1 trong 3 nhiệm vụ du lịch với Quy Nhơn là Main Quest trung tâm:' 
                                : 'Miniature 3D Vietnam Diorama: Select 1 of 3 travel quests with Quy Nhon as the hero Main Quest:'}
                        </span>
                    </div>

                    <!-- 2-Column Grid: Left Miniature 3D Vietnam Diorama + Right Quest Cards -->
                    <div class="eco-triangle-grid">
                        
                        <!-- Left: Miniature 3D Vietnam Diorama Plate -->
                        <div class="vietnam-map-card" id="miniature-vietnam-card">
                            <div class="map-mode-indicator-tag">
                                <span class="pulse-beacon-dot"></span>
                                <span>MINIATURE 3D VIETNAM • QUEST MAP</span>
                            </div>

                            <div class="vietnam-svg-viewport">
                                <svg viewBox="0 0 540 620" class="vietnam-vector-svg">
                                    <defs>
                                        <!-- Vertical Light Pillar Gradients for Beacons -->
                                        <linearGradient id="goldSunlightBeam" x1="0%" y1="100%" x2="0%" y2="0%">
                                            <stop offset="0%" stop-color="#ffb703" stop-opacity="0.85"/>
                                            <stop offset="60%" stop-color="#f59e0b" stop-opacity="0.3"/>
                                            <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
                                        </linearGradient>

                                        <linearGradient id="emeraldHighlandBeam" x1="0%" y1="100%" x2="0%" y2="0%">
                                            <stop offset="0%" stop-color="#10b981" stop-opacity="0.85"/>
                                            <stop offset="60%" stop-color="#059669" stop-opacity="0.3"/>
                                            <stop offset="100%" stop-color="#a7f3d0" stop-opacity="0"/>
                                        </linearGradient>

                                        <linearGradient id="cyanCapitalBeam" x1="0%" y1="100%" x2="0%" y2="0%">
                                            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.85"/>
                                            <stop offset="60%" stop-color="#00b4d8" stop-opacity="0.3"/>
                                            <stop offset="100%" stop-color="#fde68a" stop-opacity="0"/>
                                        </linearGradient>
                                    </defs>

                                    <!-- Diorama 3D Base Plinth (Extruded Oceanic Table) -->
                                    <polygon points="50,480 270,570 490,480 490,510 270,600 50,510" class="diorama-plinth-side" />
                                    <polygon points="50,480 270,390 490,480 270,570" class="diorama-ocean-top" />

                                    <!-- 3D Mountain & Highland Polygons -->
                                    <!-- Northern Highlands Low-Poly Blocks -->
                                    <polygon points="260,110 285,90 300,120" class="poly-mountain-dark" />
                                    <polygon points="285,90 310,105 300,120" class="poly-mountain-light" />
                                    
                                    <!-- Annamite Range (Dãy Trường Sơn) -->
                                    <polygon points="245,210 260,195 270,225" class="poly-mountain-dark" />
                                    <polygon points="260,195 280,210 270,225" class="poly-mountain-light" />
                                    
                                    <!-- Central Highlands (Tây Nguyên) Plateau -->
                                    <polygon points="240,320 265,305 285,335 255,350" class="poly-highland-forest" />

                                    <!-- Extruded Vietnam 3D S-Curve Mainland -->
                                    <path d="M 240,65 L 290,80 L 290,95 L 240,80 Z M 270,240 L 315,355 L 315,370 L 270,255 Z M 295,355 L 255,475 L 255,490 L 295,370 Z" class="vn-terrain-extrusion" />
                                    <path d="M 240,65 
                                             Q 275,50 295,80 Q 310,110 300,140 
                                             Q 275,170 265,205 Q 260,245 280,285 
                                             Q 295,320 310,360 Q 320,405 300,445 
                                             Q 280,485 250,515 Q 225,545 200,535 
                                             Q 185,515 205,495 Q 235,465 245,425 
                                             Q 255,375 240,335 Q 220,285 215,235 
                                             Q 210,180 220,135 Q 230,95 240,65 Z" 
                                          class="vn-terrain-top" />

                                    <!-- Quest Connection Corridors -->
                                    <path d="M 285,135 Q 325,235 310,355" stroke="#f59e0b" stroke-width="2.5" stroke-dasharray="5,5" fill="none" class="vn-corridor-arc" />
                                    <path d="M 265,345 Q 285,350 310,355" stroke="#10b981" stroke-width="2.5" stroke-dasharray="5,5" fill="none" class="vn-corridor-arc" />

                                    <!-- ==============================================
                                         3 QUEST BEACONS
                                         ============================================== -->

                                    <!-- 1. HANOI CAPITAL QUEST BEACON -->
                                    <g class="quest-beacon-group beacon-hanoi ${state.selectedDestination === 'hanoi' ? 'selected' : ''}" data-dest="hanoi" transform="translate(285, 135)">
                                        <polygon points="-16,0 16,0 24,-130 -24,-130" class="beacon-light-pillar" />
                                        <circle r="8" class="hanoi-core" />
                                        <circle r="14" fill="none" stroke="#f59e0b" stroke-width="1.5" opacity="0.6" />
                                        <text x="18" y="5" class="quest-floating-banner">HÀ NỘI • CAPITAL</text>
                                    </g>

                                    <!-- 2. GIA LAI EXPLORATION QUEST BEACON -->
                                    <g class="quest-beacon-group beacon-gialai ${state.selectedDestination === 'gialai' ? 'selected' : ''}" data-dest="gialai" transform="translate(265, 345)">
                                        <polygon points="-16,0 16,0 24,-130 -24,-130" class="beacon-light-pillar" />
                                        <circle r="8" class="gialai-core" />
                                        <circle r="14" fill="none" stroke="#10b981" stroke-width="1.5" opacity="0.6" />
                                        <text x="-140" y="5" class="quest-floating-banner">GIA LAI • EXPLORATION</text>
                                    </g>

                                    <!-- 3. QUY NHON MAIN QUEST HERO BEACON -->
                                    <g class="quest-beacon-group beacon-quynhon ${state.selectedDestination === 'quynhon' ? 'selected' : ''}" data-dest="quynhon" transform="translate(310, 355)">
                                        <!-- Towering Sunlight Golden Pillar -->
                                        <polygon points="-24,0 24,0 35,-180 -35,-180" class="beacon-light-pillar" />
                                        <circle r="22" class="hero-pulse-ring ring-1" />
                                        <circle r="36" class="hero-pulse-ring ring-2" />
                                        
                                        <!-- Floating Golden Quest Diamond -->
                                        <polygon points="0,-18 7,-6 18,0 7,6 0,18 -7,6 -18,0 -7,-6" class="quest-diamond" />
                                        <polygon points="0,-8 2.5,-2.5 8,-2.5 3.5,1.5 5.5,8 0,4 -5.5,8 -3.5,1.5 -8,-2.5 -2.5,-2.5" fill="#ffffff" />
                                        
                                        <text x="26" y="5" class="quest-floating-banner" style="font-size:12px;fill:#ffb703;">QUY NHƠN ⭐ MAIN QUEST</text>
                                    </g>
                                </svg>
                            </div>

                            <div class="map-card-footer">
                                <div class="map-hint-text">
                                    <i class="fa-solid fa-gamepad"></i> ${isVi ? 'Bấm vào tháp ánh sáng hoặc thẻ bên phải để nhận nhiệm vụ' : 'Click a beacon or quest card to accept mission'}
                                </div>
                            </div>
                        </div>

                        <!-- Right: 3 Quest Cards -->
                        <div class="destination-cards-stack">
                            ${DESTINATIONS.map(d => `
                                <div class="dest-interactive-card ${d.isHero ? 'card-hero-quynhon' : (d.id === 'gialai' ? 'card-gialai' : 'card-hanoi')} ${d.id === state.selectedDestination ? 'selected' : ''}" data-dest="${d.id}">
                                    <div class="dest-card-header">
                                        <div class="dest-card-title-group">
                                            <div class="dest-icon-frame">
                                                <i class="fa-solid ${d.icon}"></i>
                                            </div>
                                            <div>
                                                <h4>${d.questTitle[state.currentLang]}</h4>
                                                <small><i class="fa-solid fa-plane"></i> ${d.airportName} (${d.airportCode})</small>
                                            </div>
                                        </div>
                                        <span class="dest-tag-badge">${d.badge[state.currentLang]}</span>
                                    </div>

                                    <p class="dest-quote-phrase">"${d.quote[state.currentLang]}"</p>

                                    <div class="dest-highlights-row">
                                        ${d.tags.map(t => `<span class="highlight-pill">#${t}</span>`).join('')}
                                    </div>
                                </div>
                            `).join('')}

                            <div class="rpg-action-footer">
                                <button type="button" class="btn-game-back" id="btn-backto-stage-1">
                                    <i class="fa-solid fa-arrow-left"></i>
                                    <span>${isVi ? 'Quay Lại' : 'Back'}</span>
                                </button>
                                <button type="button" class="btn-game-next" id="btn-goto-stage-3">
                                    <span>${isVi ? 'VÀO HANGAR LẮP RÁP MÁY BAY' : 'ENTER AIRCRAFT HANGAR'}</span>
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- =======================================================
                     STEP 3: ISOMETRIC AIRCRAFT HANGAR MODULAR ASSEMBLY (50/50)
                     ======================================================= -->
                <div class="game-stage-screen" id="stage-screen-hangar">
                    
                    <div class="stage-instruction-banner banner-hangar">
                        <span class="instruction-badge">${isVi ? 'BƯỚC 3' : 'STEP 3'}</span>
                        <span class="instruction-text">
                            ${isVi 
                                ? 'Hangar Lắp Ráp Máy Bay 2.5D: Điều chỉnh ngân sách để lắp ráp các bộ phận (Thân, Cánh, Động cơ, Đuôi, Canards). Kéo đến $50.000 để mở cửa hangar cất cánh!' 
                                : 'Isometric 2.5D Aircraft Hangar: Adjust budget to physically assemble modules (Fuselage, Wings, Engines, Tail, Canards). Max to $50,000 for takeoff!'}
                        </span>
                    </div>

                    <div class="budget-split-grid">
                        
                        <!-- Left Half (50%): Isometric Aircraft Assembly Hangar -->
                        <div class="hangar-assembly-card" id="hangar-assembly-card">
                            
                            <!-- Hangar Assembly Status Tag -->
                            <div class="hangar-status-badge">
                                <span style="font-size:1.2rem;">${tier.icon}</span>
                                <div>
                                    <strong>${tier.tag}</strong>
                                    <small id="hangar-module-name">${tier.name[state.currentLang]}</small>
                                </div>
                            </div>

                            <!-- Ready for Takeoff Banner (Revealed at $50,000) -->
                            <div class="ready-takeoff-tag" id="ready-takeoff-tag">
                                <i class="fa-solid fa-plane-departure"></i>
                                <span>READY FOR TAKEOFF • QUY NHƠN EXPEDITION</span>
                            </div>

                            <div class="hangar-iso-viewport">
                                <svg viewBox="0 0 540 440" class="hangar-assembly-svg" id="hangar-assembly-svg">
                                    <defs>
                                        <!-- Hangar Floor Yellow Hazard Stripes -->
                                        <pattern id="hazardStripePattern" width="20" height="20" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
                                            <rect width="10" height="20" fill="#f59e0b"/>
                                            <rect x="10" width="10" height="20" fill="#07182e"/>
                                        </pattern>

                                        <!-- Aircraft Metallic Body Gradient -->
                                        <linearGradient id="planeMetallicGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                                            <stop offset="0%" stop-color="#ffffff"/>
                                            <stop offset="60%" stop-color="#cbd5e1"/>
                                            <stop offset="100%" stop-color="#94a3b8"/>
                                        </linearGradient>

                                        <!-- Rainbow Aurora Jet Trail Gradient -->
                                        <linearGradient id="contrailRainbow" x1="100%" y1="0%" x2="0%" y2="0%">
                                            <stop offset="0%" stop-color="#ec4899"/>
                                            <stop offset="25%" stop-color="#8b5cf6"/>
                                            <stop offset="50%" stop-color="#00b4d8"/>
                                            <stop offset="75%" stop-color="#10b981"/>
                                            <stop offset="100%" stop-color="#ffb703"/>
                                        </linearGradient>

                                        <linearGradient id="hangarDawnSky" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stop-color="#f59e0b"/>
                                            <stop offset="50%" stop-color="#00b4d8"/>
                                            <stop offset="100%" stop-color="#07182e"/>
                                        </linearGradient>
                                    </defs>

                                    <!-- ==============================================
                                         HANGAR 3D ENVIRONMENT
                                         ============================================== -->
                                    <!-- Back Wall Hangar Doors & Dawn Sky Behind -->
                                    <rect x="50" y="30" width="440" height="180" fill="url(#hangarDawnSky)" class="hangar-open-sky-glow" />
                                    
                                    <!-- Sliding Hangar Bay Doors (Slide left & right when $50k) -->
                                    <g class="hangar-bay-door-group">
                                        <rect x="50" y="30" width="220" height="180" class="hangar-bay-door hangar-door-left" />
                                        <rect x="270" y="30" width="220" height="180" class="hangar-bay-door hangar-door-right" />
                                    </g>

                                    <!-- Isometric Floor Plate -->
                                    <polygon points="50,210 490,210 530,420 10,420" class="hangar-floor-plate" />
                                    
                                    <!-- Floor Caution Hazard Stripes along edges -->
                                    <polygon points="10,410 530,410 530,420 10,420" class="hazard-stripe-rect" />
                                    <polygon points="50,210 490,210 490,216 50,216" class="hazard-stripe-rect" />

                                    <!-- Floor Assembly Guide Rails -->
                                    <line x1="80" y1="220" x2="40" y2="400" class="hangar-guide-rail" />
                                    <line x1="460" y1="220" x2="500" y2="400" class="hangar-guide-rail" />
                                    <line x1="270" y1="210" x2="270" y2="410" stroke="#f59e0b" stroke-width="2" stroke-dasharray="6,6" />

                                    <!-- Assembly Jack Stands (Underneath aircraft) -->
                                    <polygon points="210,310 230,310 220,345" fill="#334155" />
                                    <polygon points="310,310 330,310 320,345" fill="#334155" />

                                    <!-- ==============================================
                                         MODULAR AIRCRAFT ASSEMBLY IN THE HANGAR
                                         ============================================== -->
                                    <g class="aircraft-assembly-root" id="aircraft-assembly-root" transform="translate(30, 160)">
                                        
                                        <!-- Rainbow Aurora Trail (Active at $50k) -->
                                        <path d="M 80,110 Q -40,110 -160,110" class="mod-aurora-trail" />

                                        <!-- Flame exhaust -->
                                        <ellipse cx="85" cy="110" rx="30" ry="10" class="hangar-exhaust-flame" />

                                        <!-- MODULE 2: WINGS (Slides horizontally from left & right assembly rails) -->
                                        <g class="mod-wings-left" id="mod-wings-left">
                                            <polygon points="200,110 140,185 190,185 270,115" fill="#cbd5e1" stroke="#07182e" stroke-width="3" />
                                            <circle cx="145" cy="188" r="4" fill="#ff6b6b" />
                                            <!-- Locking latch -->
                                            <rect x="195" y="112" width="12" height="6" class="wing-snap-latch" />
                                        </g>
                                        <g class="mod-wings-right" id="mod-wings-right">
                                            <polygon points="220,105 270,45 320,45 280,105" fill="#94a3b8" stroke="#07182e" stroke-width="3" />
                                            <circle cx="270" cy="42" r="4" fill="#10b981" />
                                        </g>

                                        <!-- MODULE 1: FUSELAGE / BASE CHASSIS (Always present) -->
                                        <path d="M 85,110 
                                                 C 115,92 275,88 355,96 
                                                 C 390,99 430,106 440,110 
                                                 C 430,114 390,121 355,124 
                                                 C 275,132 115,128 85,110 Z" 
                                              class="mod-fuselage-frame" />

                                        <!-- Cockpit Glass Window -->
                                        <path d="M 375,102 C 400,104 420,107 423,110 C 420,113 400,116 375,118 Z" class="mod-cockpit-glass" />

                                        <!-- MODULE 4: CABIN WINDOWS & TAIL FIN (Drops from overhead crane) -->
                                        <g class="mod-cabin-windows" id="mod-cabin-windows">
                                            <circle cx="335" cy="110" r="3.2" fill="#07182e" />
                                            <circle cx="310" cy="110" r="3.2" fill="#07182e" />
                                            <circle cx="285" cy="110" r="3.2" fill="#07182e" />
                                            <circle cx="260" cy="110" r="3.2" fill="#07182e" />
                                            <circle cx="235" cy="110" r="3.2" fill="#07182e" />
                                            <circle cx="210" cy="110" r="3.2" fill="#07182e" />
                                            <circle cx="185" cy="110" r="3.2" fill="#07182e" />
                                        </g>

                                        <g class="mod-tail-fin" id="mod-tail-fin">
                                            <polygon points="85,110 60,42 105,50 145,108" fill="#0077b6" stroke="#07182e" stroke-width="3" />
                                            <polygon points="68,48 94,54 128,108" fill="#00b4d8" />
                                        </g>

                                        <!-- MODULE 3: DUAL JET TURBOFAN ENGINES (Rises from bottom pit into wing sockets) -->
                                        <g class="mod-engine-assembly" id="mod-engine-assembly">
                                            <rect x="205" y="142" width="55" height="18" rx="8" fill="#0077b6" stroke="#07182e" stroke-width="2.5" />
                                            <ellipse cx="260" cy="151" rx="4" ry="9" fill="#07182e" />
                                            <ellipse cx="259" cy="151" rx="2.5" ry="6" class="engine-core-fan" />
                                        </g>

                                        <!-- MODULE 5: CANARDS, QUAD BOOSTERS & ROYAL CROWN ($30k - $50k) -->
                                        <g class="mod-canards-wings" id="mod-canards-wings">
                                            <polygon points="355,98 330,80 340,98" fill="#ec4899" stroke="#07182e" stroke-width="2" />
                                            <polygon points="355,122 330,140 340,122" fill="#ec4899" stroke="#07182e" stroke-width="2" />
                                        </g>

                                        <g class="mod-quad-boosters" id="mod-quad-boosters">
                                            <rect x="75" y="86" width="30" height="12" rx="4" fill="#334155" stroke="#07182e" stroke-width="2" />
                                            <rect x="75" y="122" width="30" height="12" rx="4" fill="#334155" stroke="#07182e" stroke-width="2" />
                                            <ellipse cx="70" cy="92" rx="14" ry="5" fill="#c084fc" />
                                            <ellipse cx="70" cy="128" rx="14" ry="5" fill="#c084fc" />
                                        </g>

                                        <g class="mod-royal-crown" id="mod-royal-crown">
                                            <polygon points="56,38 62,26 68,36 74,24 80,36 86,26 92,38" fill="#ffb703" stroke="#78350f" stroke-width="1.2" />
                                            <circle cx="62" cy="24" r="2" fill="#ffffff" />
                                            <circle cx="74" cy="22" r="2.5" fill="#ffffff" />
                                            <circle cx="86" cy="24" r="2" fill="#ffffff" />
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        </div>

                        <!-- Right Half (50%): Budget Studio Controller -->
                        <div class="budget-studio-card">
                            
                            <!-- 1. Currency Switcher -->
                            <div class="studio-section-group">
                                <label class="studio-label">
                                    <i class="fa-solid fa-coins"></i>
                                    <span>${isVi ? '1. Đơn Vị Tiền Tệ (Currency):' : '1. Currency Selector:'}</span>
                                </label>
                                <div class="currency-pills-row" id="currency-pills-row">
                                    ${Object.keys(CURRENCIES).map(code => `
                                        <button type="button" class="currency-chip ${code === state.selectedCurrency ? 'active' : ''}" data-currency="${code}">
                                            ${CURRENCIES[code].label}
                                        </button>
                                    `).join('')}
                                </div>
                            </div>

                            <!-- 2. Direct Amount Input -->
                            <div class="studio-section-group">
                                <div class="amount-header-row">
                                    <label class="studio-label" for="budget-numeric-input">
                                        <i class="fa-solid fa-wallet"></i>
                                        <span>${isVi ? '2. Ngân Sách Dự Kiến Lắp Ráp:' : '2. Aircraft Assembly Budget:'}</span>
                                    </label>
                                    <span class="usd-equivalent-pill" id="usd-equivalent-pill">≈ $2,500 USD</span>
                                </div>

                                <div class="budget-input-box-wrapper">
                                    <input type="number" 
                                           id="budget-numeric-input" 
                                           class="budget-big-input" 
                                           value="${state.currentAmount}" 
                                           min="0" 
                                           max="${CURRENCIES[state.selectedCurrency].max}" 
                                           step="${CURRENCIES[state.selectedCurrency].step}" />
                                    <span class="budget-currency-symbol" id="budget-currency-symbol">$</span>
                                </div>
                            </div>

                            <!-- 3. Interactive Range Slider ($0 - $50,000 USD) -->
                            <div class="studio-section-group">
                                <div class="slider-meter-track">
                                    <input type="range" 
                                           id="budget-range-slider" 
                                           class="game-range-slider" 
                                           min="0" 
                                           max="${CURRENCIES[state.selectedCurrency].max}" 
                                           step="${CURRENCIES[state.selectedCurrency].step}" 
                                           value="${state.currentAmount}" />
                                </div>
                                <div class="slider-range-labels">
                                    <span id="slider-min-label">0 $</span>
                                    <span class="slider-mid-label"><i class="fa-solid fa-screwdriver-wrench"></i> ${isVi ? 'Kéo để lắp ráp thêm bộ phận' : 'Slide to assemble modules'}</span>
                                    <span id="slider-max-label">${formatCurrency(CURRENCIES[state.selectedCurrency].max, state.selectedCurrency)}</span>
                                </div>
                            </div>

                            <!-- 4. 5 Quick Presets ($500, $2,500, $8,000, $20,000, $50,000) -->
                            <div class="studio-section-group">
                                <label class="studio-label">
                                    <i class="fa-solid fa-bolt"></i>
                                    <span>${isVi ? 'Chọn Nhanh Mốc Chế Tạo (Quick Tiers):' : 'Assembly Stage Presets:'}</span>
                                </label>
                                <div class="budget-presets-row" id="budget-presets-row">
                                    <button type="button" class="preset-chip" data-usd="500">
                                        <span class="preset-icon">🛠️</span>
                                        <strong>$500</strong>
                                        <small>Frame</small>
                                    </button>
                                    <button type="button" class="preset-chip active" data-usd="2500">
                                        <span class="preset-icon">✈️</span>
                                        <strong>$2,500</strong>
                                        <small>Wings</small>
                                    </button>
                                    <button type="button" class="preset-chip" data-usd="8000">
                                        <span class="preset-icon">🔥</span>
                                        <strong>$8,000</strong>
                                        <small>Engines</small>
                                    </button>
                                    <button type="button" class="preset-chip" data-usd="20000">
                                        <span class="preset-icon">💎</span>
                                        <strong>$20,000</strong>
                                        <small>Full</small>
                                    </button>
                                    <button type="button" class="preset-chip" data-usd="50000">
                                        <span class="preset-icon">👑</span>
                                        <strong>$50,000</strong>
                                        <small>Takeoff</small>
                                    </button>
                                </div>
                            </div>

                            <!-- 5. Experience Tier Suggestions -->
                            <div class="experience-tier-box" id="experience-tier-box">
                                <div class="exp-category-row">
                                    <div class="exp-category-pill">
                                        <strong><i class="fa-solid fa-hotel"></i> ${isVi ? 'Lưu Trú' : 'Stay'}</strong>
                                        <span id="exp-text-acc">${tier.perks.acc[state.currentLang]}</span>
                                    </div>
                                    <div class="exp-category-pill">
                                        <strong><i class="fa-solid fa-car-side"></i> ${isVi ? 'Đi Lại' : 'Transit'}</strong>
                                        <span id="exp-text-trans">${tier.perks.trans[state.currentLang]}</span>
                                    </div>
                                    <div class="exp-category-pill">
                                        <strong><i class="fa-solid fa-utensils"></i> ${isVi ? 'Trải Nghiệm' : 'Dining'}</strong>
                                        <span id="exp-text-food">${tier.perks.food[state.currentLang]}</span>
                                    </div>
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
                                    <span>${isVi ? 'Ngân Sách:' : 'Budget:'}</span>
                                    <strong id="summary-budget-display">$2,500 USD</strong>
                                </div>
                            </div>

                            <!-- Bottom Action Row -->
                            <div class="studio-action-row">
                                <button type="button" class="btn-game-back" id="btn-backto-stage-2">
                                    <i class="fa-solid fa-arrow-left"></i>
                                    <span>${isVi ? 'Quay Lại Sa Bàn' : 'Back to Quests'}</span>
                                </button>
                                <button type="button" class="btn-game-launch-plan" id="btn-game-launch-plan">
                                    <i class="fa-solid fa-rocket"></i>
                                    <span>${isVi ? 'XUẤT XƯỞNG & KHỞI HÀNH AI' : 'LAUNCH EXPEDITION'}</span>
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
        // SFX Audio Toggle
        const sfxBtn = document.getElementById('game-sfx-toggle');
        if (sfxBtn) {
            sfxBtn.addEventListener('click', () => {
                const isEnabled = SFX.toggle();
                sfxBtn.querySelector('.sfx-icon').textContent = isEnabled ? '🔊' : '🔇';
                sfxBtn.querySelector('.sfx-text').textContent = isEnabled ? 'SFX ON' : 'SFX OFF';
                sfxBtn.classList.toggle('muted', !isEnabled);
                if (isEnabled) SFX.playBloop(640);
            });
        }

        // Stage Nav Pills
        const stagePills = document.querySelectorAll('.stage-nav-pill');
        stagePills.forEach(pill => {
            pill.addEventListener('click', () => {
                const targetStage = parseInt(pill.getAttribute('data-stage'));
                setStage(targetStage);
            });
        });

        // Quick Country Chips in Dock
        const countryChips = document.querySelectorAll('.country-quick-chip');
        countryChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const countryId = chip.getAttribute('data-country');
                updateCountrySelection(countryId, true);
                SFX.playChime();
            });
        });

        // Interactive SVG Country Paths
        const mapCountryGroups = document.querySelectorAll('.interactive-country-group');
        mapCountryGroups.forEach(group => {
            group.addEventListener('click', () => {
                const countryId = group.getAttribute('data-country');
                if (countryId && COUNTRIES[countryId]) {
                    updateCountrySelection(countryId, true);
                    SFX.playChime();
                }
            });
            group.addEventListener('mouseenter', () => {
                SFX.playBloop(440, 0.04);
            });
        });

        // Step 1: "Khám Phá Sa Bàn Việt Nam" button
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
                SFX.playBloop(420);
            });
        }

        // Step 2: Destination Quest Cards
        const destCards = document.querySelectorAll('.dest-interactive-card');
        destCards.forEach(card => {
            card.addEventListener('click', () => {
                const destId = card.getAttribute('data-dest');
                updateDestinationSelection(destId);
                SFX.playChime();
            });
        });

        // Step 2: Vietnam Map Quest Beacons
        const questBeacons = document.querySelectorAll('.quest-beacon-group');
        questBeacons.forEach(beacon => {
            beacon.addEventListener('click', (e) => {
                e.stopPropagation();
                const destId = beacon.getAttribute('data-dest');
                if (destId) {
                    updateDestinationSelection(destId);
                    SFX.playChime();
                }
            });
        });

        // Step 2: "Vào Hangar Lắp Ráp Máy Bay" button
        const btnGoStage3 = document.getElementById('btn-goto-stage-3');
        if (btnGoStage3) {
            btnGoStage3.addEventListener('click', () => {
                setStage(3);
                SFX.playWhoosh();
            });
        }

        // Step 3: "Quay Lại Sa Bàn" button
        const btnBackStage2 = document.getElementById('btn-backto-stage-2');
        if (btnBackStage2) {
            btnBackStage2.addEventListener('click', () => {
                setStage(2);
                SFX.playBloop(420);
            });
        }

        // Step 3: Currency Switcher Pills
        const curChips = document.querySelectorAll('.currency-chip');
        curChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const code = chip.getAttribute('data-currency');
                setCurrency(code);
                SFX.playBloop(600);
            });
        });

        // Step 3: Slider & Input (Mechanical Snap & Real-Time Assembly)
        const slider = document.getElementById('budget-range-slider');
        const numInput = document.getElementById('budget-numeric-input');

        if (slider && numInput) {
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value) || 0;
                state.currentAmount = val;
                numInput.value = val;
                
                const cur = CURRENCIES[state.selectedCurrency] || CURRENCIES.USD;
                state.budgetUSD = Math.round(val / cur.rate);
                
                updateHangarAssembly(true);
            });

            numInput.addEventListener('input', (e) => {
                let val = parseFloat(e.target.value) || 0;
                const max = CURRENCIES[state.selectedCurrency].max;
                if (val > max) val = max;
                if (val < 0) val = 0;
                
                state.currentAmount = val;
                slider.value = val;

                const cur = CURRENCIES[state.selectedCurrency] || CURRENCIES.USD;
                state.budgetUSD = Math.round(val / cur.rate);

                updateHangarAssembly(true);
            });
        }

        // Step 3: 5 Quick Presets ($500, $2,500, $8,000, $20,000, $50,000)
        const presetChips = document.querySelectorAll('.preset-chip');
        presetChips.forEach(chip => {
            chip.addEventListener('click', () => {
                const targetUsd = parseFloat(chip.getAttribute('data-usd'));
                state.budgetUSD = targetUsd;
                
                const cur = CURRENCIES[state.selectedCurrency] || CURRENCIES.USD;
                const converted = Math.round(targetUsd * cur.rate);
                state.currentAmount = converted;

                if (slider) slider.value = converted;
                if (numInput) numInput.value = converted;

                presetChips.forEach(p => p.classList.remove('active'));
                chip.classList.add('active');

                updateHangarAssembly(true);
                SFX.playMechSnap();
            });
        });

        // Step 3: Grand Launch CTA Button
        const btnLaunch = document.getElementById('btn-game-launch-plan');
        if (btnLaunch) {
            btnLaunch.addEventListener('click', () => {
                launchJourneyPlan();
            });
        }

        // Global Language Switch Listener
        window.addEventListener('appLanguageChanged', (e) => {
            const lang = e.detail && e.detail.lang ? e.detail.lang : 'vi';
            state.currentLang = lang;
            renderWizardHTML(document.getElementById('game-booking-wizard-container'));
            bindEvents();
            setStage(state.currentStage);
            updateCountrySelection(state.selectedCountry, false);
            updateDestinationSelection(state.selectedDestination);
            updateHangarAssembly(false);
        });
    }

    // Switch Wizard Stage (1: World, 2: Vietnam, 3: Hangar)
    function setStage(stageNum) {
        state.currentStage = stageNum;

        document.querySelectorAll('.stage-nav-pill').forEach(pill => {
            const num = parseInt(pill.getAttribute('data-stage'));
            pill.classList.toggle('active', num === stageNum);
            pill.classList.toggle('completed', num < stageNum);
        });

        const screenWorld = document.getElementById('stage-screen-world');
        const screenDest = document.getElementById('stage-screen-destination');
        const screenHangar = document.getElementById('stage-screen-hangar');

        if (screenWorld) screenWorld.classList.toggle('active', stageNum === 1);
        if (screenDest) screenDest.classList.toggle('active', stageNum === 2);
        if (screenHangar) screenHangar.classList.toggle('active', stageNum === 3);

        if (stageNum === 3) {
            updateHangarAssembly(false);
        }
    }

    // Update Country Selection (Click 1)
    function updateCountrySelection(countryId, autoFocusAirport = true) {
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

        // Update Airport Panel
        const flagEl = document.getElementById('rpg-country-flag');
        const nameEl = document.getElementById('rpg-country-name');
        const badgeEl = document.getElementById('rpg-continent-badge');
        const listEl = document.getElementById('rpg-airports-list');

        if (flagEl) flagEl.textContent = country.flag;
        if (nameEl) nameEl.textContent = `${country.name[state.currentLang]} (${country.city[state.currentLang]})`;
        if (badgeEl) badgeEl.textContent = country.continent[state.currentLang];

        // Render Airport Cards (Click 2)
        if (listEl) {
            const hasAirport = country.airports.some(a => a.code === state.selectedAirport);
            if (!hasAirport) {
                state.selectedAirport = country.airports[0].code;
            }

            listEl.innerHTML = country.airports.map(apt => `
                <div class="rpg-airport-card ${apt.code === state.selectedAirport ? 'selected' : ''}" data-code="${apt.code}">
                    <div class="airport-code-badge">${apt.code}</div>
                    <div class="airport-info-body">
                        <strong>${apt.name}</strong>
                        <small>${apt.desc}</small>
                    </div>
                    <span class="airport-check-radio"></span>
                </div>
            `).join('');

            // Click 2 Airport Selection Interaction
            listEl.querySelectorAll('.rpg-airport-card').forEach(card => {
                card.addEventListener('click', () => {
                    listEl.querySelectorAll('.rpg-airport-card').forEach(c => c.classList.remove('selected'));
                    card.classList.add('selected');
                    state.selectedAirport = card.getAttribute('data-code');
                    SFX.playChime();
                    updateSummaryPills();

                    // Smooth transition to Step 2 after 550ms
                    setTimeout(() => {
                        if (state.currentStage === 1) {
                            setStage(2);
                            SFX.playWhoosh();
                        }
                    }, 550);
                });
            });
        }

        updateSummaryPills();
    }

    // Update 3D Flight Arc & Origin Pin Coordinates
    function updateMapPinPosition(countryId) {
        const pin = document.getElementById('map-pin-origin');
        const pinLabel = document.getElementById('pin-origin-label');
        const flightArc = document.getElementById('svg-flight-arc');
        const flightShadow = document.getElementById('svg-flight-shadow');
        const tinyPlane = document.getElementById('tiny-flight-plane');
        if (!pin) return;

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

        const destCoord = { x: 740, y: 282 };
        const midX = (coord.x + destCoord.x) / 2;
        const midY = Math.min(coord.y, destCoord.y) - 65; // High parabolic arc

        if (flightArc) {
            flightArc.setAttribute('d', `M ${coord.x},${coord.y} Q ${midX},${midY} ${destCoord.x},${destCoord.y}`);
        }
        if (flightShadow) {
            flightShadow.setAttribute('d', `M ${coord.x},${coord.y + 18} Q ${midX},${midY + 45} ${destCoord.x},${destCoord.y + 15}`);
        }
        if (tinyPlane) {
            tinyPlane.setAttribute('transform', `translate(${midX}, ${midY}) rotate(18)`);
        }
    }

    // Update Destination Selection (Quest Pick)
    function updateDestinationSelection(destId) {
        state.selectedDestination = destId;

        // Update Quest Cards
        document.querySelectorAll('.dest-interactive-card').forEach(card => {
            const isMatch = card.getAttribute('data-dest') === destId;
            card.classList.toggle('selected', isMatch);
        });

        // Update 3D Quest Beacons
        document.querySelectorAll('.quest-beacon-group').forEach(beacon => {
            const isMatch = beacon.getAttribute('data-dest') === destId;
            beacon.classList.toggle('selected', isMatch);
        });

        updateSummaryPills();
    }

    // Set Currency
    function setCurrency(curKey) {
        if (!CURRENCIES[curKey]) return;
        state.selectedCurrency = curKey;
        const cur = CURRENCIES[curKey];

        document.querySelectorAll('.currency-chip').forEach(chip => {
            chip.classList.toggle('active', chip.getAttribute('data-currency') === curKey);
        });

        state.currentAmount = Math.round(state.budgetUSD * cur.rate);

        const slider = document.getElementById('budget-range-slider');
        const numInput = document.getElementById('budget-numeric-input');
        const symbolEl = document.getElementById('budget-currency-symbol');
        const maxLabel = document.getElementById('slider-max-label');

        if (slider) {
            slider.max = cur.max;
            slider.step = cur.step;
            slider.value = state.currentAmount;
        }

        if (numInput) {
            numInput.max = cur.max;
            numInput.step = cur.step;
            numInput.value = state.currentAmount;
        }

        if (symbolEl) symbolEl.textContent = cur.symbol;
        if (maxLabel) maxLabel.textContent = formatCurrency(cur.max, curKey);

        updateHangarAssembly(false);
    }

    // Update Modular Aircraft Assembly Mechanism in the Hangar
    function updateHangarAssembly(playSfxOnSnap = true) {
        const usdVal = state.budgetUSD;
        const newTierIdx = getTierIndex(usdVal);
        const tierChanged = newTierIdx !== state.previousTierIndex;

        state.currentTierIndex = newTierIdx;
        const tier = TIERS[newTierIdx];

        // 1. Play Mechanical Sound on Tier Snap
        if (tierChanged && playSfxOnSnap) {
            SFX.playMechSnap();
            state.previousTierIndex = newTierIdx;
        }

        // 2. USD Equivalent Pill
        const usdPill = document.getElementById('usd-equivalent-pill');
        if (usdPill) {
            usdPill.textContent = `≈ $${Math.round(usdVal).toLocaleString()} USD`;
        }

        // 3. PHYSICAL MODULAR ASSEMBLY (NO FADE-IN!)
        // Apply classes to trigger physical slide-in & snap transforms
        const hangarCard = document.getElementById('hangar-assembly-card');
        const assemblyRoot = document.getElementById('aircraft-assembly-root');
        
        if (hangarCard) {
            // Module 2: Wings ($2,500+)
            hangarCard.classList.toggle('assembly-wings-installed', usdVal >= 2500);
            
            // Module 3: Engines ($8,000+)
            hangarCard.classList.toggle('assembly-engines-installed', usdVal >= 8000);
            
            // Module 4: Tail & Windows ($20,000+)
            hangarCard.classList.toggle('assembly-tail-installed', usdVal >= 20000);
            
            // Module 5: Canards & Crown ($30,000+)
            hangarCard.classList.toggle('assembly-premium-installed', usdVal >= 30000);
            
            // Final State: Doors Open & Ready for Takeoff ($50,000)
            const isTakeoffReady = usdVal >= 50000;
            hangarCard.classList.toggle('hangar-doors-open', isTakeoffReady);
            hangarCard.classList.toggle('assembly-aurora-active', isTakeoffReady);

            if (isTakeoffReady && playSfxOnSnap && tierChanged) {
                SFX.playTakeoff();
            }
        }

        // 4. Update Status Badges & Perks
        const statusModule = document.getElementById('hangar-module-name');
        if (statusModule) {
            statusModule.textContent = tier.name[state.currentLang];
        }

        const expAcc = document.getElementById('exp-text-acc');
        const expTrans = document.getElementById('exp-text-trans');
        const expFood = document.getElementById('exp-text-food');

        if (expAcc) expAcc.textContent = tier.perks.acc[state.currentLang];
        if (expTrans) expTrans.textContent = tier.perks.trans[state.currentLang];
        if (expFood) expFood.textContent = tier.perks.food[state.currentLang];

        // 5. Preset Chip Active State
        document.querySelectorAll('.preset-chip').forEach(chip => {
            const pUsd = parseFloat(chip.getAttribute('data-usd'));
            chip.classList.toggle('active', Math.abs(pUsd - usdVal) < 10);
        });

        updateSummaryPills();
    }

    // Update Bottom Summary Strip
    function updateSummaryPills() {
        const originEl = document.getElementById('summary-origin-pill');
        const destEl = document.getElementById('summary-dest-pill');
        const budgetEl = document.getElementById('summary-budget-display');

        const country = COUNTRIES[state.selectedCountry];
        const dest = DESTINATIONS.find(d => d.id === state.selectedDestination) || DESTINATIONS[0];

        if (originEl && country) {
            originEl.textContent = `${country.flag} ${country.name[state.currentLang]} (${state.selectedAirport})`;
        }
        if (destEl && dest) {
            destEl.textContent = `🇻🇳 ${dest.name[state.currentLang]} (${dest.airportCode})`;
        }
        if (budgetEl) {
            budgetEl.textContent = `${formatCurrency(state.currentAmount, state.selectedCurrency)} (≈ $${state.budgetUSD.toLocaleString()} USD)`;
        }
    }

    // Launch Journey Plan (Syncs to App and fires AI simulation)
    function launchJourneyPlan() {
        SFX.playTakeoff();

        // Trigger Takeoff animation in Hangar
        const assemblyRoot = document.getElementById('aircraft-assembly-root');
        if (assemblyRoot) {
            assemblyRoot.style.transition = "transform 0.9s cubic-bezier(0.7, 0, 0.84, 0)";
            assemblyRoot.style.transform = "translate(550px, 80px) scale(0.6)";
            assemblyRoot.style.opacity = "0";
        }

        // Synchronize with form and App state
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
            customBudgetInput.value = state.budgetUSD;
        }

        if (destinationSelect) {
            destinationSelect.value = state.selectedDestination;
        }

        if (window.App) {
            if (typeof App.setPlannerData === 'function') {
                App.setPlannerData(state.selectedCountry, state.budgetUSD, state.selectedDestination, state.selectedAirport);
            }
            const appState = App.getState();
            if (appState) {
                appState.currentCountryKey = state.selectedCountry;
                appState.currentBudget = state.budgetUSD;
                appState.currentDestination = state.selectedDestination;
            }
        }

        // Scroll to AI Journey results and trigger simulation
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

            // Reset Hangar plane position
            setTimeout(() => {
                if (assemblyRoot) {
                    assemblyRoot.style.transition = "";
                    assemblyRoot.style.transform = "translate(30px, 160px)";
                    assemblyRoot.style.opacity = "1";
                }
            }, 1200);
        }, 600);
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
