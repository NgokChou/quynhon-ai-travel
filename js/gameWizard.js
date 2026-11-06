/**
 * Quy Nhon AI Travel Assistant - Unified Tactical Explorer Game HUD
 * Art Direction: Slate/Navy Deep Glassmorphism • Amber Gold & Cyan Accents
 * 
 * Step 1: Isometric 3D World Map (Tactical 2.5D Extruded Continents & Flight Arc)
 * Step 2: Isometric 3D Vietnam Diorama & Quest Map (Geographic S-Curve, Paracel & Spratly Islands, Quy Nhon Hero Quest)
 * Step 3: Realistic 3D Aircraft Studio ($0 - $50,000 USD, Three.js WebGL Engine)
 */

const GameWizard = (function() {
    // =========================================================================
    // 1. Web Audio API Sound Synthesizer (Zero-latency, 100% offline)
    // =========================================================================
    const SFX = {
        ctx: null,
        enabled: true,
        init() {
            if (!this.ctx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) this.ctx = new AudioContextClass();
            }
            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume();
            }
        },
        toggle() {
            this.enabled = !this.enabled;
            return this.enabled;
        },
        playBloop(freq = 480, duration = 0.05) {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(freq * 1.25, this.ctx.currentTime + duration);
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
                const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
                notes.forEach((freq, idx) => {
                    const osc = this.ctx.createOscillator();
                    const gain = this.ctx.createGain();
                    osc.type = 'triangle';
                    osc.frequency.value = freq;
                    gain.gain.setValueAtTime(0.06, this.ctx.currentTime + idx * 0.04);
                    gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + idx * 0.04 + 0.22);
                    osc.connect(gain);
                    gain.connect(this.ctx.destination);
                    osc.start(this.ctx.currentTime + idx * 0.04);
                    osc.stop(this.ctx.currentTime + idx * 0.04 + 0.22);
                });
            } catch (e) {}
        },
        playClick() {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(800, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(200, this.ctx.currentTime + 0.04);
                gain.gain.setValueAtTime(0.07, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.04);
            } catch (e) {}
        },
        playTurbineSpool() {
            if (!this.enabled) return;
            try {
                this.init();
                if (!this.ctx) return;
                const osc = this.ctx.createOscillator();
                const gain = this.ctx.createGain();
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(140, this.ctx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(620, this.ctx.currentTime + 0.25);
                gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.25);
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
                osc.frequency.exponentialRampToValueAtTime(1600, this.ctx.currentTime + 0.6);
                gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.7);
                osc.connect(gain);
                gain.connect(this.ctx.destination);
                osc.start();
                osc.stop(this.ctx.currentTime + 0.7);
            } catch (e) {}
        }
    };

    // =========================================================================
    // 2. Data Catalog (Countries, Airports, Destinations, Currencies)
    // =========================================================================
    const COUNTRIES = {
        belgium: {
            id: "belgium",
            name: { en: "Belgium", vi: "Bỉ" },
            flag: "🇧🇪",
            city: { en: "Brussels", vi: "Brussels" },
            continent: { en: "Europe", vi: "Châu Âu" },
            coords: { x: 485, y: 140, label: "BRU" },
            airports: [
                { code: "BRU", name: "Brussels Airport", city: "Brussels", desc: "Cửa ngõ hàng không quốc tế thủ đô Brussels (BRU)" }
            ]
        },
        france: {
            id: "france",
            name: { en: "France", vi: "Pháp" },
            flag: "🇫🇷",
            city: { en: "Paris", vi: "Paris" },
            continent: { en: "Europe", vi: "Châu Âu" },
            coords: { x: 468, y: 160, label: "CDG" },
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
            coords: { x: 506, y: 145, label: "FRA" },
            airports: [
                { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", desc: "Trung tâm trung chuyển hàng không Châu Âu (FRA)" },
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
            coords: { x: 185, y: 175, label: "SFO" },
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
            coords: { x: 848, y: 175, label: "HND" },
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
            coords: { x: 815, y: 405, label: "SYD" },
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
            coords: { x: 446, y: 125, label: "LHR" },
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
            coords: { x: 810, y: 190, label: "ICN" },
            airports: [
                { code: "ICN", name: "Seoul Incheon", city: "Seoul", desc: "Sân bay 5 sao Incheon - Bay thẳng tới Việt Nam (ICN)" },
                { code: "PUS", name: "Busan Gimhae", city: "Busan", desc: "Sân bay quốc tế thành phố cảng Busan (PUS)" }
            ]
        },
        singapore: {
            id: "singapore",
            name: { en: "Singapore", vi: "Singapore" },
            flag: "🇸🇬",
            city: { en: "Singapore", vi: "Singapore" },
            continent: { en: "Asia", vi: "Đông Nam Á" },
            coords: { x: 724, y: 316, label: "SIN" },
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
            coords: { x: 735, y: 195, label: "PVG" },
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
            coords: { x: 722, y: 230, label: "HAN" },
            airports: [
                { code: "HAN", name: "Noi Bai International Airport", city: "Hà Nội", desc: "Bay thẳng 1h35m tới Sân bay Phù Cát (UIH)" },
                { code: "SGN", name: "Tan Son Nhat International Airport", city: "TP. Hồ Chí Minh", desc: "Bay thẳng 1h10m tới Sân bay Phù Cát (UIH)" }
            ]
        }
    };

    // Exactly 3 Destinations in Vietnam
    const DESTINATIONS = [
        {
            id: "quynhon",
            isHero: true,
            name: { en: "Quy Nhon Coastal Pearl", vi: "Quy Nhơn – Biển Ngọc Miền Trung" },
            badge: { en: "MAIN QUEST • HERO BEACON", vi: "NHIỆM VỤ CHÍNH • CỘT SÁNG VÀNG" },
            airportCode: "UIH",
            airportName: "Phu Cat Airport",
            quote: { 
                en: "Discover Quy Nhon – Emerald Ky Co waters & Eo Gio cliffs.",
                vi: "Khám phá Quy Nhơn – Biển ngọc Kỳ Co & vách đá Eo Gió lộng gió."
            },
            icon: "fa-umbrella-beach",
            colorClass: "quynhon",
            coords: { x: 325, y: 355 }, // South Central Coast
            tags: ["Kỳ Co Emerald", "Eo Gió Cliffs", "Cham Towers", "Nhơn Lý Seafood"]
        },
        {
            id: "gialai",
            isHero: false,
            name: { en: "Gia Lai Highlands Eco", vi: "Gia Lai – Đại Ngàn Tây Nguyên" },
            badge: { en: "HIGHLANDS EXPLORATION", vi: "THÁM HIỂM ĐẠI NGÀN" },
            airportCode: "PXU",
            airportName: "Pleiku Airport",
            quote: {
                en: "Explore the Highlands – Sea Lake T'Nung & pine forests.",
                vi: "Thám hiểm Tây Nguyên – Biển Hồ T'nưng thơ mộng & núi lửa Chư Đăng Ya."
            },
            icon: "fa-mountain-sun",
            colorClass: "gialai",
            coords: { x: 270, y: 345 }, // Central Highlands (West of Quy Nhon)
            tags: ["Biển Hồ T'nưng", "Núi Lửa Cổ", "Rừng Nguyên Sinh", "Cà Phê Pleiku"]
        },
        {
            id: "hanoi",
            isHero: false,
            name: { en: "Hanoi Heritage Gateway", vi: "Hà Nội – Kinh Đô Di Sản" },
            badge: { en: "CAPITAL HERITAGE", vi: "THỦ ĐÔ NGHÌN NĂM" },
            airportCode: "HAN",
            airportName: "Noi Bai International Airport",
            quote: {
                en: "Experience Hanoi – Sword Lake & 36 historic guilds.",
                vi: "Trải nghiệm Hà Nội – Tháp Rùa Hồ Gươm & 36 phố phường rêu phong."
            },
            icon: "fa-landmark-dome",
            colorClass: "hanoi",
            coords: { x: 265, y: 135 }, // Northern Red River Delta
            tags: ["Hồ Gươm", "Khuê Văn Các", "36 Phố Cổ", "Ẩm Thực Tràng An"]
        }
    ];

    // 4 Currencies
    const CURRENCIES = {
        USD: { symbol: "$", rate: 1, max: 50000, step: 100, label: "USD ($)" },
        VND: { symbol: "₫", rate: 25000, max: 1250000000, step: 5000000, label: "VND (₫)" },
        EUR: { symbol: "€", rate: 0.92, max: 46000, step: 100, label: "EUR (€)" },
        JPY: { symbol: "¥", rate: 150, max: 7500000, step: 15000, label: "JPY (¥)" }
    };

    // 5 Realistic Aircraft Upgrade Tiers ($0 - $50,000 USD)
    const TIERS = [
        {
            usd: 500,
            level: 1,
            name: { en: "Basic Aircraft Configuration", vi: "Cấu Hình Máy Bay Cơ Bản" },
            modelName: "Twin-Jet Regional Cruiser",
            tag: "LEVEL 1 • REGIONAL JET",
            perks: {
                acc: { en: "Cozy Beach Homestays & Hostels", vi: "Homestay & Hostel gần biển tiện nghi" },
                trans: { en: "Eco Scooter & Coastal Shuttle", vi: "Xe máy sinh thái & xe buýt ngắm cảnh" },
                food: { en: "Authentic Local Street Bites", vi: "Bánh xèo tôm nhảy & ốc đêm Nhơn Lý" }
            }
        },
        {
            usd: 2500,
            level: 2,
            name: { en: "Improved Wings & Body", vi: "Cánh & Thân Khí Động Học Mở Rộng" },
            modelName: "Commercial Jetliner (Blended Winglets)",
            tag: "LEVEL 2 • COMMERCIAL JET",
            perks: {
                acc: { en: "3 to 4-Star Oceanfront Hotel", vi: "Khách sạn 3–4 sao ngắm trọn vịnh biển" },
                trans: { en: "Comfort Airport Shuttle Service", vi: "Xe đưa đón sân bay & tour tiện ích" },
                food: { en: "Fresh Seafood Dinners & Cafes", vi: "Tiệc hải sản tươi sống & cafe Eo Gió" }
            }
        },
        {
            usd: 8000,
            level: 3,
            name: { en: "High-Bypass Engine Upgrade", vi: "Động Cơ Phản Lực Turbofan Cỡ Lớn" },
            modelName: "Twin High-Bypass Executive Jet",
            tag: "LEVEL 3 • TURBOFAN UPGRADE",
            perks: {
                acc: { en: "5-Star Luxury Resort (Anantara / Maia)", vi: "Resort 5 sao cao cấp (Anantara / Maia)" },
                trans: { en: "Private Chauffeur & Airport Fast-Track", vi: "Xe riêng đưa đón & thủ tục ưu tiên" },
                food: { en: "Sunset Yacht Dining & Tasting Menu", vi: "Set menu cao cấp & du thuyền hoàng hôn" }
            }
        },
        {
            usd: 20000,
            level: 4,
            name: { en: "Premium Aircraft Configuration", vi: "Phi Cơ Thân Rộng Đẳng Cấp Thương Gia" },
            modelName: "Flagship Wide-body Long-Haul Cruiser",
            tag: "LEVEL 4 • WIDE-BODY CRUISER",
            perks: {
                acc: { en: "Ultra-Luxury Cliffside Pool Villa", vi: "Biệt thự hồ bơi vô cực vách đá riêng biệt" },
                trans: { en: "VIP Limousine & Private Boat Charters", vi: "Limousine VIP & cano riêng khám phá đảo" },
                food: { en: "Private Beach BBQ & Rare Vintage Wines", vi: "Tiệc nướng bờ biển riêng & vang hảo hạng" }
            }
        },
        {
            usd: 50000,
            level: 5,
            name: { en: "Fully Upgraded VIP Flagship", vi: "Siêu Phi Cơ VIP Thượng Hạng Cất Cánh" },
            modelName: "Presidential Ultra-Luxury Flagship (Titanium Polish)",
            tag: "LEVEL 5 • READY FOR TAKEOFF",
            perks: {
                acc: { en: "Presidential Flagship Estate & 24/7 Butler", vi: "Dinh thự Tổng Thống & quản gia riêng 24/7" },
                trans: { en: "Private Yacht & Helicopter Transfer", vi: "Du thuyền cá nhân & trực thăng ngắm cảnh" },
                food: { en: "Michelin-Standard Masterchef Banquet", vi: "Đại tiệc ẩm thực chuẩn sao Michelin" }
            }
        }
    ];

    // State Object
    const state = {
        currentStage: 1, // 1: Departure, 2: Destination, 3: Budget & Aircraft
        selectedCountry: "belgium",
        selectedAirport: "BRU",
        selectedDestination: "quynhon",
        selectedCurrency: "USD",
        budgetUSD: 2500,
        currentAmount: 2500,
        currentTierLevel: 2,
        currentLang: "vi",
        mapZoom: 1,
        mapPanX: 0,
        mapPanY: 0,
        isPanning: false,
        panStartX: 0,
        panStartY: 0
    };

    function getTierForUSD(usd) {
        if (usd < 2500) return TIERS[0];
        if (usd < 8000) return TIERS[1];
        if (usd < 20000) return TIERS[2];
        if (usd < 50000) return TIERS[3];
        return TIERS[4];
    }

    function formatCurrency(val, curKey) {
        const cur = CURRENCIES[curKey] || CURRENCIES.USD;
        if (curKey === 'VND') return Math.round(val).toLocaleString('vi-VN') + " " + cur.symbol;
        if (curKey === 'JPY') return cur.symbol + Math.round(val).toLocaleString('ja-JP');
        return cur.symbol + Math.round(val).toLocaleString('en-US');
    }

    // =========================================================================
    // 3. THREE.JS 3D INTERACTIVE GLOBE & SHOWROOM AIRCRAFT (WebGL)
    // =========================================================================
    const Globe3D = {
    scene: null,
    camera: null,
    renderer: null,
    container: null,
    globeGroup: null,
    globeMesh: null,
    borderMesh: null,
    highlightMesh: null,
    atmosphereMesh: null,
    pinsGroup: null,
    arcGroup: null,
    interactivePins: [],
    activePulse: null,
    radarRings: [],
    animFrameId: null,

    isDragging: false,
    startX: 0,
    startY: 0,
    dragDist: 0,
    currentRotX: 0.35,
    currentRotY: -1.6,
    targetRotX: 0.35,
    targetRotY: -1.6,
    isInteracting: false,
    interactTimer: null,
    camDistance: 27,
    targetCamDistance: 27,

    // Dữ liệu quốc gia (Natural Earth) dùng chung với bản đồ tỉnh
    countries: [],
    countryByIso: {},
    pickData: null,
    pickW: 2048,
    pickH: 1024,
    borderCanvas: null,
    highlightCanvas: null,
    highlightCtx: null,
    highlightTex: null,
    selectedIso: null,
    hoverIso: null,

    AIRPORT_COORDS: {
        quynhon: { lat: 13.78, lon: 109.21, name: "Quy Nhơn", code: "UIH", flag: "🇻🇳", iso: "VNM" },
        belgium: { lat: 50.85, lon: 4.35, name: "Brussels", code: "BRU", flag: "🇧🇪", iso: "BEL" },
        usa: { lat: 37.62, lon: -122.38, name: "San Francisco", code: "SFO", flag: "🇺🇸", iso: "USA" },
        uk: { lat: 51.47, lon: -0.45, name: "London", code: "LHR", flag: "🇬🇧", iso: "GBR" },
        france: { lat: 49.01, lon: 2.55, name: "Paris", code: "CDG", flag: "🇫🇷", iso: "FRA" },
        germany: { lat: 50.03, lon: 8.57, name: "Frankfurt", code: "FRA", flag: "🇩🇪", iso: "DEU" },
        china: { lat: 31.14, lon: 121.80, name: "Shanghai", code: "PVG", flag: "🇨🇳", iso: "CHN" },
        korea: { lat: 37.46, lon: 126.44, name: "Seoul", code: "ICN", flag: "🇰🇷", iso: "KOR" },
        japan: { lat: 35.54, lon: 139.78, name: "Tokyo", code: "HND", flag: "🇯🇵", iso: "JPN" },
        singapore: { lat: 1.36, lon: 103.99, name: "Singapore", code: "SIN", flag: "🇸🇬", iso: "SGP" },
        australia: { lat: -33.94, lon: 151.17, name: "Sydney", code: "SYD", flag: "🇦🇺", iso: "AUS" },
        vietnam: { lat: 21.03, lon: 105.85, name: "Hà Nội", code: "HAN", flag: "🇻🇳", iso: "VNM" }
    },

    latLonToVector3(lat, lon, radius = 9, alt = 0) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lon + 180) * (Math.PI / 180);
        const r = radius + alt;
        const x = -(r * Math.sin(phi) * Math.cos(theta));
        const z = (r * Math.sin(phi) * Math.sin(theta));
        const y = (r * Math.cos(phi));
        return (typeof THREE !== 'undefined') ? new THREE.Vector3(x, y, z) : { x, y, z };
    },

    /* ---------------- texture layers ---------------- */

    buildCountryLayers() {
        if (this.borderCanvas) return;

        const data = window.WORLD_MAP_DATA;
        this.countries = (data && data.countries) || [];
        this.countries.forEach(c => { this.countryByIso[c.id] = c; });

        // --- border layer (4096 x 2048) ---
        const bw = 4096, bh = 2048;
        const bc = document.createElement('canvas');
        bc.width = bw;
        bc.height = bh;
        const bctx = bc.getContext('2d');
        bctx.lineJoin = 'round';
        bctx.lineCap = 'round';
        bctx.strokeStyle = 'rgba(125, 226, 255, 0.42)';
        bctx.lineWidth = 2.4;

        const strokeRings = (ctx, rings, W, H) => {
            for (let r = 0; r < rings.length; r++) {
                const ring = rings[r];
                ctx.beginPath();
                let prev = null;
                for (let i = 0; i < ring.length; i++) {
                    const x = (ring[i][0] + 180) / 360 * W;
                    const y = (90 - ring[i][1]) / 180 * H;
                    if (i === 0) ctx.moveTo(x, y);
                    else if (prev !== null && Math.abs(ring[i][0] - prev) > 180) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                    prev = ring[i][0];
                }
                ctx.closePath();
                ctx.stroke();
            }
        };

        this.countries.forEach(c => strokeRings(bctx, c.rings, bw, bh));
        this.borderCanvas = bc;

        // --- picking layer ---
        const W = this.pickW, H = this.pickH;
        const pc = document.createElement('canvas');
        pc.width = W;
        pc.height = H;
        const pctx = pc.getContext('2d', { willReadFrequently: true });

        this.countries.forEach((c, i) => {
            const v = i + 1;
            pctx.fillStyle = `rgb(${v & 255},${(v >> 8) & 255},0)`;
            for (let r = 0; r < c.rings.length; r++) {
                const ring = c.rings[r];
                pctx.beginPath();
                for (let k = 0; k < ring.length; k++) {
                    const x = (ring[k][0] + 180) / 360 * W;
                    const y = (90 - ring[k][1]) / 180 * H;
                    if (k === 0) pctx.moveTo(x, y); else pctx.lineTo(x, y);
                }
                pctx.closePath();
                pctx.fill();
            }
        });
        this.pickData = pctx.getImageData(0, 0, W, H).data;

        // --- highlight layer ---
        const hc = document.createElement('canvas');
        hc.width = W;
        hc.height = H;
        this.highlightCanvas = hc;
        this.highlightCtx = hc.getContext('2d');
    },

    paintHighlight(iso) {
        const ctx = this.highlightCtx;
        if (!ctx) return;
        ctx.clearRect(0, 0, this.pickW, this.pickH);

        const c = iso ? this.countryByIso[iso] : null;
        if (c) {
            ctx.save();
            ctx.fillStyle = 'rgba(56, 189, 248, 0.42)';
            ctx.strokeStyle = 'rgba(186, 240, 255, 0.95)';
            ctx.lineWidth = 5;
            ctx.shadowColor = 'rgba(56, 189, 248, 0.9)';
            ctx.shadowBlur = 18;
            for (let r = 0; r < c.rings.length; r++) {
                const ring = c.rings[r];
                ctx.beginPath();
                for (let k = 0; k < ring.length; k++) {
                    const x = (ring[k][0] + 180) / 360 * this.pickW;
                    const y = (90 - ring[k][1]) / 180 * this.pickH;
                    if (k === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            ctx.restore();
        }
        if (this.highlightTex) this.highlightTex.needsUpdate = true;
    },

    /* ---------------- scene ---------------- */

    init(containerId) {
        if (typeof document === 'undefined') return;
        const container = document.getElementById(containerId);
        if (!container || !window.THREE) return;
        this.container = container;

        if (!document.getElementById('globe-country-card')) {
            container.insertAdjacentHTML('beforeend', `
                <div class="globe-country-card" id="globe-country-card" hidden>
                    <button type="button" class="gcc-close" id="gcc-close" aria-label="Close"><i class="fa-solid fa-xmark"></i></button>
                    <div class="gcc-head">
                        <div class="gcc-silhouette"><svg id="gcc-svg" preserveAspectRatio="xMidYMid meet"><path id="gcc-path"></path></svg></div>
                        <div class="gcc-titles">
                            <span class="gcc-region" id="gcc-region"></span>
                            <h4 id="gcc-name"></h4>
                            <small id="gcc-sub"></small>
                        </div>
                    </div>
                    <ul class="gcc-stats" id="gcc-stats"></ul>
                    <p class="gcc-desc" id="gcc-desc"></p>
                    <div class="gcc-hl" id="gcc-hl"></div>
                    <button type="button" class="gcc-cta" id="gcc-cta" hidden></button>
                </div>
            `);
        }

        if (this.renderer && this.renderer.domElement && container.contains(this.renderer.domElement)) {
            container.removeChild(this.renderer.domElement);
        }
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        this.interactivePins = [];
        this.radarRings = [];

        this.buildCountryLayers();

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 480;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, this.camDistance);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.domElement.id = 'globe-webgl-canvas';
        container.appendChild(this.renderer.domElement);

        const ambient = new THREE.AmbientLight(0xffffff, 1.15);
        this.scene.add(ambient);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.15);
        sunLight.position.set(20, 16, 30);
        this.scene.add(sunLight);

        this.buildGlobe();
        this.buildPins();
        this.bindControls(container);
        this.focusCountry(state.selectedCountry || 'belgium');
        this.animate();

        window.addEventListener('resize', () => {
            if (!this.container || !this.camera || !this.renderer) return;
            const newW = this.container.clientWidth;
            const newH = this.container.clientHeight;
            if (newW && newH) {
                this.camera.aspect = newW / newH;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(newW, newH);
            }
        });
    },

    buildGlobe() {
        this.globeGroup = new THREE.Group();

        const loader = new THREE.TextureLoader();
        const aniso = this.renderer.capabilities.getMaxAnisotropy();

        const earthTex = loader.load('assets/earth-blue-marble.jpg');
        earthTex.encoding = THREE.sRGBEncoding;
        earthTex.anisotropy = aniso;

        const sphereGeo = new THREE.SphereGeometry(9, 96, 64);
        const sphereMat = new THREE.MeshStandardMaterial({
            map: earthTex,
            roughness: 0.95,
            metalness: 0.02
        });
        this.globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
        this.globeGroup.add(this.globeMesh);

        // Biên giới quốc gia
        const borderTex = new THREE.CanvasTexture(this.borderCanvas);
        borderTex.anisotropy = aniso;
        this.borderMesh = new THREE.Mesh(
            new THREE.SphereGeometry(9.012, 96, 64),
            new THREE.MeshBasicMaterial({ map: borderTex, transparent: true, depthWrite: false })
        );
        this.globeGroup.add(this.borderMesh);

        // Lớp làm nổi bật quốc gia đang chọn
        this.highlightTex = new THREE.CanvasTexture(this.highlightCanvas);
        this.highlightTex.anisotropy = aniso;
        this.highlightMesh = new THREE.Mesh(
            new THREE.SphereGeometry(9.024, 96, 64),
            new THREE.MeshBasicMaterial({ map: this.highlightTex, transparent: true, depthWrite: false })
        );
        this.globeGroup.add(this.highlightMesh);

        // Khí quyển
        const atmoMat = new THREE.MeshBasicMaterial({
            color: 0x22b8e6,
            transparent: true,
            opacity: 0.16,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        this.atmosphereMesh = new THREE.Mesh(new THREE.SphereGeometry(9.42, 48, 48), atmoMat);
        this.globeGroup.add(this.atmosphereMesh);

        this.scene.add(this.globeGroup);
    },

    buildPins() {
        this.pinsGroup = new THREE.Group();
        this.arcGroup = new THREE.Group();
        this.globeGroup.add(this.pinsGroup);
        this.globeGroup.add(this.arcGroup);

        Object.keys(this.AIRPORT_COORDS).forEach(key => {
            const item = this.AIRPORT_COORDS[key];
            const isQuyNhon = key === 'quynhon';
            const pos = this.latLonToVector3(item.lat, item.lon, 9.0);

            const pin = new THREE.Group();
            pin.position.copy(pos);
            pin.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), pos.clone().normalize());

            const shaftGeo = new THREE.CylinderGeometry(0.035, 0.07, 0.7, 8);
            const shaftMat = new THREE.MeshBasicMaterial({ color: isQuyNhon ? 0xf59e0b : 0x38bdf8 });
            const shaft = new THREE.Mesh(shaftGeo, shaftMat);
            shaft.position.y = 0.35;
            pin.add(shaft);

            const headGeo = isQuyNhon ? new THREE.OctahedronGeometry(0.32, 0) : new THREE.SphereGeometry(0.18, 16, 16);
            const headMat = new THREE.MeshBasicMaterial({ color: isQuyNhon ? 0xfbbf24 : 0x7dd3fc });
            const head = new THREE.Mesh(headGeo, headMat);
            head.position.y = 0.8;
            pin.add(head);

            const ringGeo = new THREE.RingGeometry(0.18, 0.4, 24);
            ringGeo.rotateX(-Math.PI / 2);
            const ringMat = new THREE.MeshBasicMaterial({
                color: isQuyNhon ? 0xf59e0b : 0x38bdf8,
                transparent: true,
                opacity: 0.75,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.y = 0.02;
            pin.add(ring);
            this.radarRings.push(ring);

            const hitGeo = new THREE.SphereGeometry(0.85, 8, 8);
            const hitMat = new THREE.MeshBasicMaterial({ visible: false });
            const hit = new THREE.Mesh(hitGeo, hitMat);
            hit.position.y = 0.5;
            hit.userData = { countryId: key };
            pin.add(hit);
            this.interactivePins.push(hit);

            this.pinsGroup.add(pin);
        });
    },

    /* ---------------- picking ---------------- */

    countryAtPixel(px, py) {
        if (!this.pickData) return null;
        const W = this.pickW, H = this.pickH;
        px = Math.max(0, Math.min(W - 1, Math.round(px)));
        py = Math.max(0, Math.min(H - 1, Math.round(py)));

        const counts = new Map();
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const x = px + dx, y = py + dy;
                if (x < 0 || y < 0 || x >= W || y >= H) continue;
                const o = (y * W + x) * 4;
                const idx = this.pickData[o] + (this.pickData[o + 1] << 8);
                if (!idx) continue;
                counts.set(idx, (counts.get(idx) || 0) + 1);
            }
        }
        let best = 0, bestN = 0;
        counts.forEach((n, idx) => { if (n > bestN) { bestN = n; best = idx; } });
        return best ? this.countries[best - 1] : null;
    },

    pickCountry(clientX, clientY) {
        if (!this.globeMesh || !this.camera) return null;
        const rect = this.container.getBoundingClientRect();
        const mouse = new THREE.Vector2(
            ((clientX - rect.left) / rect.width) * 2 - 1,
            -((clientY - rect.top) / rect.height) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);
        const hits = raycaster.intersectObject(this.globeMesh, false);
        if (!hits.length || !hits[0].uv) return null;
        return this.countryAtPixel(hits[0].uv.x * this.pickW, (1 - hits[0].uv.y) * this.pickH);
    },

    /* ---------------- country detail card ---------------- */

    loc(v) {
        if (v == null) return '';
        if (typeof v === 'string') return v;
        return v[state.currentLang] || v.vi || v.en || '';
    },

    formatPop(n) {
        if (!n) return '—';
        if (state.currentLang === 'vi') {
            if (n >= 1e9) return (n / 1e9).toFixed(2).replace('.', ',') + ' tỷ';
            if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.', ',') + ' tr';
            return Math.round(n / 1e3) + ' nghìn';
        }
        if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
        if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
        return Math.round(n / 1e3) + 'K';
    },

    departureKeyForIso(iso) {
        const keys = Object.keys(this.AIRPORT_COORDS);
        for (let i = 0; i < keys.length; i++) {
            const k = keys[i];
            if (k !== 'quynhon' && this.AIRPORT_COORDS[k].iso === iso) return k;
        }
        return null;
    },

    showCountryCard(iso) {
        const card = document.getElementById('globe-country-card');
        if (!card) return;
        const c = this.countryByIso[iso];
        if (!c) { card.hidden = true; return; }

        const info = window.WORLD_INFO || { regions: {}, countries: {} };
        const detail = (info.countries && info.countries[iso]) || null;
        const region = (info.regions && info.regions[c.cont]) || { vi: '', en: '' };
        const isVi = state.currentLang === 'vi';

        const name = isVi ? c.vi : c.name;
        const sub = isVi ? c.name : c.vi;

        document.getElementById('gcc-region').textContent = this.loc(region);
        document.getElementById('gcc-name').textContent = name;
        const subEl = document.getElementById('gcc-sub');
        const strip = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase();
        subEl.textContent = strip(sub) !== strip(name) ? sub : '';

        // silhouette
        const b = c.bbox;
        const pad = Math.max(b[2] - b[0], b[3] - b[1]) * 0.08;
        const svg = document.getElementById('gcc-svg');
        svg.setAttribute('viewBox', `${b[0] - pad} ${-b[3] - pad} ${b[2] - b[0] + pad * 2} ${b[3] - b[1] + pad * 2}`);

        let big = null, bigArea = 0;
        c.rings.forEach(ring => {
            let a = 0;
            for (let i = 0; i < ring.length - 1; i++) a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
            a = Math.abs(a / 2);
            if (a > bigArea) { bigArea = a; big = ring; }
        });
        document.getElementById('gcc-path').setAttribute('d',
            big ? 'M' + big.map(p => `${p[0].toFixed(2)},${(-p[1]).toFixed(2)}`).join('L') + 'Z' : '');

        // stats
        const stats = [];
        const cap = detail && detail.cap ? this.loc(detail.cap) : c.cap;
        if (cap) stats.push([isVi ? 'Thủ đô' : 'Capital', cap]);
        if (c.pop) stats.push([isVi ? 'Dân số' : 'Population', this.formatPop(c.pop)]);
        const cur = detail && detail.cur ? this.loc(detail.cur) : (c.cur && c.cur[0] ? `${c.cur[0]}` : '');
        if (cur) stats.push([isVi ? 'Tiền tệ' : 'Currency', cur]);
        const lang = detail && detail.lang ? this.loc(detail.lang) : c.lang;
        if (lang) stats.push([isVi ? 'Ngôn ngữ' : 'Language', lang]);
        if (detail && detail.tz) stats.push([isVi ? 'Múi giờ' : 'Time zone', detail.tz]);

        const statsEl = document.getElementById('gcc-stats');
        statsEl.innerHTML = stats.map(([k, v]) => `<li><span>${k}</span><strong>${v}</strong></li>`).join('');

        // description
        const descEl = document.getElementById('gcc-desc');
        if (detail && detail.desc) {
            descEl.textContent = this.loc(detail.desc);
        } else {
            descEl.textContent = isVi
                ? `Quốc gia thuộc ${this.loc(region)}. Chưa có ghi chú du lịch chi tiết cho điểm đến này.`
                : `A country in ${this.loc(region)}. Travel notes for this destination are still being written.`;
        }

        // highlights
        const hlEl = document.getElementById('gcc-hl');
        const hl = ((detail && detail.hl) || []).slice(0, 3);
        hlEl.innerHTML = hl.length
            ? `<h5>${isVi ? 'Đáng ghé thăm' : 'Worth a visit'}</h5><ul>` +
              hl.map(h => `<li><i class="fa-solid fa-location-dot"></i><span>${this.loc(h)}</span></li>`).join('') +
              `</ul>`
            : '';

        // CTA
        const cta = document.getElementById('gcc-cta');
        const depKey = this.departureKeyForIso(iso);
        if (depKey) {
            cta.hidden = false;
            cta.dataset.country = depKey;
            cta.innerHTML = `<i class="fa-solid fa-plane-departure"></i> ${isVi ? 'Chọn làm điểm khởi hành' : 'Use as departure'}`;
        } else {
            cta.hidden = false;
            cta.dataset.country = '';
            cta.innerHTML = `<i class="fa-solid fa-circle-info"></i> ${isVi ? 'Chưa có chuyến bay trực tiếp' : 'No direct flight yet'}`;
        }

        card.hidden = false;
        card.classList.remove('is-entering');
        void card.offsetWidth;
        card.classList.add('is-entering');
    },

    selectIso(iso) {
        this.selectedIso = iso;
        this.paintHighlight(iso);
        if (iso) this.showCountryCard(iso);
        else {
            const card = document.getElementById('globe-country-card');
            if (card) card.hidden = true;
        }
    },

    /* ---------------- flight arc ---------------- */

    updateFlightArc(countryKey) {
        if (!this.arcGroup || !this.AIRPORT_COORDS[countryKey] || countryKey === 'quynhon') return;

        while (this.arcGroup.children.length > 0) {
            this.arcGroup.remove(this.arcGroup.children[0]);
        }
        this.activePulse = null;

        const dep = this.AIRPORT_COORDS[countryKey];
        const dest = this.AIRPORT_COORDS.quynhon;

        const pA = this.latLonToVector3(dep.lat, dep.lon, 9.0);
        const pB = this.latLonToVector3(dest.lat, dest.lon, 9.0);

        const dist = pA.distanceTo(pB);
        const mid = pA.clone().add(pB).multiplyScalar(0.5);
        const apexHeight = 9.0 + 1.8 + Math.min(dist * 0.18, 4.0);
        const pApex = mid.normalize().multiplyScalar(apexHeight);

        const curve = new THREE.QuadraticBezierCurve3(pA, pApex, pB);
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.075, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        this.arcGroup.add(new THREE.Mesh(tubeGeo, tubeMat));

        const pulseGeo = new THREE.SphereGeometry(0.22, 16, 16);
        const pulseMat = new THREE.MeshBasicMaterial({ color: 0xfbbf24 });
        const pulseMesh = new THREE.Mesh(pulseGeo, pulseMat);
        this.arcGroup.add(pulseMesh);
        this.activePulse = { curve, progress: 0, mesh: pulseMesh };

        if (typeof document !== 'undefined') {
            const countryEl = document.getElementById('globe-selected-country-text');
            const distEl = document.getElementById('globe-distance-text');
            if (countryEl) countryEl.textContent = `${dep.flag} ${dep.name.toUpperCase()} (${dep.code}) ➔ 🇻🇳 QUY NHƠN (UIH)`;
            if (distEl) {
                const dLat = (13.78 - dep.lat) * Math.PI / 180;
                const dLon = (109.21 - dep.lon) * Math.PI / 180;
                const a = Math.sin(dLat / 2) ** 2 + Math.cos(dep.lat * Math.PI / 180) * Math.cos(13.78 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
                const km = Math.round(6371 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
                distEl.textContent = `${km.toLocaleString()} KM • 3D FLIGHT CORRIDOR`;
            }
        }
    },

    focusCountry(countryKey) {
        if (!this.AIRPORT_COORDS[countryKey]) return;
        const dep = this.AIRPORT_COORDS[countryKey];

        const qnLat = 13.78, qnLon = 109.21;
        const midLat = (dep.lat + qnLat) / 2;
        let dLon = ((dep.lon - qnLon + 540) % 360) - 180;
        const midLon = qnLon + dLon / 2;

        this.targetRotY = -((midLon + 90) * Math.PI / 180);
        this.targetRotX = (midLat * Math.PI / 180);

        this.selectIso(dep.iso || null);
        this.updateFlightArc(countryKey);
    },

    /* ---------------- controls ---------------- */

    bindControls(container) {
        let isDown = false;
        let lastX = 0;
        let lastY = 0;
        let totalMoved = 0;

        const onDown = (clientX, clientY) => {
            isDown = true;
            lastX = clientX;
            lastY = clientY;
            totalMoved = 0;
            this.isInteracting = true;
            if (this.interactTimer) clearTimeout(this.interactTimer);
        };

        const onMove = (clientX, clientY) => {
            if (!isDown) return;
            const dx = clientX - lastX;
            const dy = clientY - lastY;
            lastX = clientX;
            lastY = clientY;
            totalMoved += Math.hypot(dx, dy);

            this.targetRotY += dx * 0.006;
            this.targetRotX += dy * 0.005;
            this.targetRotX = Math.max(-1.1, Math.min(1.1, this.targetRotX));
        };

        const onUp = (clientX, clientY) => {
            if (!isDown) return;
            isDown = false;
            if (this.interactTimer) clearTimeout(this.interactTimer);
            this.interactTimer = setTimeout(() => { this.isInteracting = false; }, 2800);

            if (totalMoved < 6 && typeof clientX === 'number' && this.camera) {
                // 1) ưu tiên pin sân bay
                const rect = container.getBoundingClientRect();
                const mouse = new THREE.Vector2(
                    ((clientX - rect.left) / rect.width) * 2 - 1,
                    -((clientY - rect.top) / rect.height) * 2 + 1
                );
                const raycaster = new THREE.Raycaster();
                raycaster.setFromCamera(mouse, this.camera);
                const hits = raycaster.intersectObjects(this.interactivePins, false);
                if (hits.length > 0) {
                    const cId = hits[0].object.userData.countryId;
                    if (cId && cId !== 'quynhon' && typeof updateCountrySelection === 'function') {
                        updateCountrySelection(cId, true);
                    }
                    return;
                }

                // 2) chọn quốc gia bất kỳ trên mặt cầu
                const country = this.pickCountry(clientX, clientY);
                if (country) this.selectIso(country.id);
                else this.selectIso(null);
            }
        };

        container.addEventListener('mousedown', (e) => onDown(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', (e) => onUp(e.clientX, e.clientY));

        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) onDown(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isDown) onMove(e.touches[0].clientX, e.touches[0].clientY);
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            const t = e.changedTouches[0];
            onUp(t ? t.clientX : 0, t ? t.clientY : 0);
        });

        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.targetCamDistance += e.deltaY * 0.02;
            this.targetCamDistance = Math.max(13, Math.min(30, this.targetCamDistance));
        }, { passive: false });

        // Nút CTA trong thẻ quốc gia
        document.addEventListener('click', (e) => {
            const cta = e.target.closest && e.target.closest('#gcc-cta');
            if (cta) {
                const key = cta.dataset.country;
                if (key && typeof updateCountrySelection === 'function') {
                    updateCountrySelection(key, true);
                } else if (!key) {
                    showTacticalToast(state.currentLang === 'vi'
                        ? 'Quốc gia này chưa có chuyến bay trực tiếp đến Quy Nhơn. Hãy chọn điểm khởi hành khác.'
                        : 'This country has no direct flight to Quy Nhon yet. Pick another departure.');
                }
                return;
            }
            if (e.target.closest && e.target.closest('#gcc-close')) {
                this.selectIso(null);
            }
        });
    },

    animate() {
        this.animFrameId = requestAnimationFrame(() => this.animate());

        if (!this.isInteracting) {
            this.targetRotY += 0.0012;
        }

        this.currentRotY += (this.targetRotY - this.currentRotY) * 0.06;
        this.currentRotX += (this.targetRotX - this.currentRotX) * 0.06;
        this.camDistance += (this.targetCamDistance - this.camDistance) * 0.08;

        if (this.globeGroup) {
            this.globeGroup.rotation.y = this.currentRotY;
            this.globeGroup.rotation.x = this.currentRotX;
        }

        if (this.camera) {
            this.camera.position.z = this.camDistance;
        }

        if (this.activePulse) {
            this.activePulse.progress = (this.activePulse.progress + 0.007) % 1.0;
            this.activePulse.mesh.position.copy(this.activePulse.curve.getPoint(this.activePulse.progress));
        }

        if (this.radarRings.length > 0) {
            const time = Date.now() * 0.003;
            this.radarRings.forEach((ring, idx) => {
                const s = 1.0 + ((time + idx * 0.4) % 1.0) * 0.8;
                ring.scale.set(s, s, s);
            });
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
};

    const Aircraft3D = {
    scene: null,
    camera: null,
    renderer: null,
    container: null,
    aircraftRootGroup: null,
    rotatingFanDiscs: [],
    strobeLights: [],
    platformLedMat: null,
    platformGlowLight: null,
    afterburnersGroup: null,
    wingletsGroup: null,
    liveryGroup: null,
    cabinWindowsGroup: null,
    materials: {},

    targets: {
        aircraftPitch: 0,
        wingletsScale: 0,
        cabinEmissive: 0,
        afterburnerScale: 0,
        engineScale: 0.9,
        platformLedColor: 0x3b82f6
    },
    isEnginesLocked: true,
    isUserInteracting: false,
    interactTimer: null,
    isTakingOff: false,

    currentAzimuth: 0.65,
    targetAzimuth: 0.65,
    currentPolar: 0.38,
    targetPolar: 0.38,
    currentDistance: 26,
    targetDistance: 26,
    animFrameId: null,

    init(containerId) {
        if (typeof document === 'undefined') return;
        const container = document.getElementById(containerId);
        if (!container || !window.THREE) return;
        this.container = container;

        if (this.renderer && this.renderer.domElement && container.contains(this.renderer.domElement)) {
            container.removeChild(this.renderer.domElement);
        }
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        this.rotatingFanDiscs = [];
        this.strobeLights = [];

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 450;

        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x060b18);
        this.scene.fog = new THREE.FogExp2(0x060b18, 0.015);

        this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
        this.updateCameraFromOrbit();

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.25;
        this.renderer.domElement.id = 'aircraft-webgl-canvas';
        container.appendChild(this.renderer.domElement);

        // Environment map: kim loại bóng cần phản chiếu, nếu không sẽ ra màu đen
        try {
            const envCanvas = document.createElement('canvas');
            envCanvas.width = 64;
            envCanvas.height = 32;
            const ectx = envCanvas.getContext('2d');
            const eg = ectx.createLinearGradient(0, 0, 0, 32);
            eg.addColorStop(0.00, '#0a1526');
            eg.addColorStop(0.42, '#1e3a5f');
            eg.addColorStop(0.62, '#93c5fd');
            eg.addColorStop(0.80, '#f8fafc');
            eg.addColorStop(1.00, '#0b1220');
            ectx.fillStyle = eg;
            ectx.fillRect(0, 0, 64, 32);

            const envTex = new THREE.CanvasTexture(envCanvas);
            envTex.mapping = THREE.EquirectangularReflectionMapping;
            const pmrem = new THREE.PMREMGenerator(this.renderer);
            this.scene.environment = pmrem.fromEquirectangular(envTex).texture;
            pmrem.dispose();
            envTex.dispose();
        } catch (e) {
            console.warn('[Aircraft3D] environment map unavailable', e);
        }

        this.setupLighting();
        this.buildShowroomEnvironment();
        this.buildAircraftModular();
        this.bindControls(container);
        this.updateTierUpgrades(state.budgetUSD || 2500);
        this.animate();

        window.addEventListener('resize', () => {
            if (!this.container || !this.camera || !this.renderer) return;
            const newW = this.container.clientWidth;
            const newH = this.container.clientHeight;
            if (newW && newH) {
                this.camera.aspect = newW / newH;
                this.camera.updateProjectionMatrix();
                this.renderer.setSize(newW, newH);
            }
        });
    },

    updateCameraFromOrbit() {
        if (!this.camera) return;
        const cy = this.currentDistance * Math.sin(this.currentPolar) + 0.6;
        const rXZ = this.currentDistance * Math.cos(this.currentPolar);
        const cx = rXZ * Math.sin(this.currentAzimuth);
        const cz = rXZ * Math.cos(this.currentAzimuth);
        this.camera.position.set(cx, cy, cz);
        this.camera.lookAt(0, 0.5, 0);
    },

    setupLighting() {
        const ambient = new THREE.AmbientLight(0xdbeafe, 0.7);
        this.scene.add(ambient);

        const keyLight = new THREE.DirectionalLight(0xfffbeb, 1.8);
        keyLight.position.set(22, 34, 18);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.width = 1024;
        keyLight.shadow.mapSize.height = 1024;
        keyLight.shadow.bias = -0.001;
        this.scene.add(keyLight);

        const cyanRim = new THREE.DirectionalLight(0x06b6d4, 1.4);
        cyanRim.position.set(-25, 16, 20);
        this.scene.add(cyanRim);

        const warmFill = new THREE.DirectionalLight(0xf59e0b, 0.8);
        warmFill.position.set(18, -4, -22);
        this.scene.add(warmFill);

        const spot = new THREE.SpotLight(0xffffff, 2.0, 45, Math.PI / 4, 0.45, 1);
        spot.position.set(0, 15, 0);
        spot.target.position.set(0, 0, 0);
        this.scene.add(spot);
        this.scene.add(spot.target);
    },

    buildShowroomEnvironment() {
        this.platformGroup = new THREE.Group();

        const discGeo = new THREE.CylinderGeometry(8.8, 9.4, 0.35, 48);
        const discMat = new THREE.MeshStandardMaterial({
            color: 0x0f172a,
            roughness: 0.32,
            metalness: 0.85
        });
        const discMesh = new THREE.Mesh(discGeo, discMat);
        discMesh.position.y = -1.95;
        discMesh.receiveShadow = true;
        this.platformGroup.add(discMesh);

        const ringGeo = new THREE.TorusGeometry(8.9, 0.08, 16, 64);
        ringGeo.rotateX(Math.PI / 2);
        this.platformLedMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6 });
        const ringMesh = new THREE.Mesh(ringGeo, this.platformLedMat);
        ringMesh.position.y = -1.75;
        this.platformGroup.add(ringMesh);

        const innerRingGeo = new THREE.TorusGeometry(4.8, 0.05, 12, 48);
        innerRingGeo.rotateX(Math.PI / 2);
        const innerRing = new THREE.Mesh(innerRingGeo, this.platformLedMat);
        innerRing.position.y = -1.76;
        this.platformGroup.add(innerRing);

        this.scene.add(this.platformGroup);

        const floorGeo = new THREE.PlaneGeometry(120, 120);
        const floorMat = new THREE.MeshStandardMaterial({
            color: 0x040814,
            roughness: 0.65,
            metalness: 0.4
        });
        const floorMesh = new THREE.Mesh(floorGeo, floorMat);
        floorMesh.rotation.x = -Math.PI / 2;
        floorMesh.position.y = -2.15;
        floorMesh.receiveShadow = true;
        this.scene.add(floorMesh);

        this.platformGlowLight = new THREE.PointLight(0x3b82f6, 2.8, 18);
        this.platformGlowLight.position.set(0, -1.2, 0);
        this.scene.add(this.platformGlowLight);
    },

    createFuselageTexture() {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 1024;
        canvas.height = 512;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        // Thân máy bay trắng ngà
        ctx.fillStyle = '#f6f8fb';
        ctx.fillRect(0, 0, 1024, 512);

        // Bụng máy bay tối hơn (u = 0 và u = 1 là mặt dưới)
        const belly = ctx.createLinearGradient(0, 0, 1024, 0);
        belly.addColorStop(0.00, 'rgba(150,170,192,0.55)');
        belly.addColorStop(0.10, 'rgba(255,255,255,0)');
        belly.addColorStop(0.90, 'rgba(255,255,255,0)');
        belly.addColorStop(1.00, 'rgba(150,170,192,0.55)');
        ctx.fillStyle = belly;
        ctx.fillRect(0, 0, 1024, 512);

        // Sọc cheatline hai bên thân (u 0.25 = mạn phải, 0.75 = mạn trái)
        const band = (u0, u1, color) => {
            ctx.fillStyle = color;
            ctx.fillRect(u0 * 1024, 0, (u1 - u0) * 1024, 512);
        };
        band(0.236, 0.268, '#0284c7');
        band(0.272, 0.280, '#f59e0b');
        band(0.732, 0.764, '#0284c7');
        band(0.720, 0.728, '#f59e0b');

        // Cửa cabin + số hiệu
        ctx.fillStyle = 'rgba(120,140,164,0.55)';
        [0.30, 0.42, 0.58, 0.70].forEach(v => {
            ctx.fillRect(258, v * 512, 10, 26);
            ctx.fillRect(756, v * 512, 10, 26);
        });

        const tex = new THREE.CanvasTexture(canvas);
        tex.anisotropy = 8;
        return tex;
    },

    buildAircraftModular() {
        this.aircraftRootGroup = new THREE.Group();
        this.aircraftRootGroup.rotation.order = 'YXZ';
        this.aircraftRootGroup.position.set(0, 0, 0);

        const M = this.materials;

        M.fuselage = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            map: this.createFuselageTexture(),
            roughness: 0.26,
            metalness: 0.42
        });

        M.cockpitGlass = new THREE.MeshStandardMaterial({
            color: 0x1b3f5e,
            emissive: 0x0b2a44,
            emissiveIntensity: 0.55,
            roughness: 0.14,
            metalness: 0.72,
            transparent: true,
            opacity: 0.96
        });

        M.chrome = new THREE.MeshStandardMaterial({
            color: 0xe2e8f0,
            roughness: 0.1,
            metalness: 0.96
        });

        M.darkMetal = new THREE.MeshStandardMaterial({
            color: 0x2b3546,
            roughness: 0.34,
            metalness: 0.82
        });

        M.fanBlades = new THREE.MeshStandardMaterial({
            color: 0x3b4757,
            roughness: 0.24,
            metalness: 0.88
        });

        M.liveryCyan = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            roughness: 0.26,
            metalness: 0.62
        });

        M.liveryGold = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            roughness: 0.2,
            metalness: 0.85
        });

        M.cabinWindows = new THREE.MeshStandardMaterial({
            color: 0xfff2d8,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.0
        });

        M.afterburnerCore = new THREE.MeshBasicMaterial({
            color: 0x67e8f9,
            transparent: true,
            opacity: 0.85
        });

        M.afterburnerPlume = new THREE.MeshBasicMaterial({
            color: 0xfb923c,
            transparent: true,
            opacity: 0.6
        });

        // ---------------------------------------------------------------
        // 1. Thân máy bay: lathe mượt (mũi nhọn, thân trụ, đuôi thuôn)
        // ---------------------------------------------------------------
        const fuselageGroup = new THREE.Group();

        const profile = [
            [-10.0, 0.05], [-9.4, 0.34], [-8.8, 0.62], [-8.0, 0.92],
            [-7.0, 1.14], [-5.8, 1.28], [-4.4, 1.35], [-2.2, 1.38],
            [1.6, 1.38], [3.8, 1.36], [5.2, 1.30], [6.4, 1.19],
            [7.6, 1.02], [8.6, 0.78], [9.5, 0.45], [9.9, 0.18], [10.0, 0.04]
        ].map(p => new THREE.Vector2(p[1], p[0]));

        const bodyGeo = new THREE.LatheGeometry(profile, 72);
        bodyGeo.rotateX(Math.PI / 2);
        const bodyMesh = new THREE.Mesh(bodyGeo, M.fuselage);
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        fuselageGroup.add(bodyMesh);

        // Kính buồng lái: dải cong úp quanh mũi
        const glassGeo = new THREE.CylinderGeometry(1.08, 1.22, 0.95, 40, 1, true, Math.PI * 0.735, Math.PI * 0.53);
        glassGeo.rotateX(Math.PI / 2);
        const glassMesh = new THREE.Mesh(glassGeo, M.cockpitGlass);
        glassMesh.position.set(0, 0.06, 7.15);
        fuselageGroup.add(glassMesh);

        // Vành khung kính
        const frameGeo = new THREE.TorusGeometry(1.14, 0.028, 8, 40, Math.PI * 0.56);
        const frameMesh = new THREE.Mesh(frameGeo, M.chrome);
        frameMesh.position.set(0, 0.06, 6.66);
        frameMesh.rotation.z = Math.PI * 0.22;
        fuselageGroup.add(frameMesh);

        // Ăng-ten mũi
        const pitotGeo = new THREE.CylinderGeometry(0.035, 0.02, 0.9, 10);
        pitotGeo.rotateX(Math.PI / 2);
        const pitot = new THREE.Mesh(pitotGeo, M.chrome);
        pitot.position.set(0, 0, 10.35);
        fuselageGroup.add(pitot);

        this.aircraftRootGroup.add(fuselageGroup);

        // ---------------------------------------------------------------
        // 2. Cánh chính (planform vuốt, dihedral nhẹ)
        // ---------------------------------------------------------------
        const wingsGroup = new THREE.Group();

        const buildWing = (dir) => {
            const shape = new THREE.Shape();
            shape.moveTo(0, 3.4);
            shape.lineTo(dir * 9.6, -0.6);
            shape.lineTo(dir * 9.6, -3.0);
            shape.lineTo(0, -2.6);
            shape.closePath();

            const geo = new THREE.ExtrudeGeometry(shape, {
                depth: 0.34,
                bevelEnabled: true,
                bevelSegments: 2,
                bevelSize: 0.05,
                bevelThickness: 0.05,
                curveSegments: 1
            });
            geo.rotateX(Math.PI / 2);
            geo.translate(0, 0.17, 0);

            const mesh = new THREE.Mesh(geo, M.fuselage);
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            return mesh;
        };

        const wingR = buildWing(1);
        wingR.position.set(1.1, -0.42, 0.2);
        wingR.rotation.z = 0.055;
        wingsGroup.add(wingR);

        const wingL = buildWing(-1);
        wingL.position.set(-1.1, -0.42, 0.2);
        wingL.rotation.z = -0.055;
        wingsGroup.add(wingL);

        this.aircraftRootGroup.add(wingsGroup);

        // ---------------------------------------------------------------
        // 3. Động cơ turbofan
        // ---------------------------------------------------------------
        const enginesGroup = new THREE.Group();

        const nacelleProfile = [
            [-2.35, 0.30], [-2.05, 0.44], [-1.55, 0.54], [-0.60, 0.62],
            [0.35, 0.65], [1.05, 0.63], [1.40, 0.57], [1.52, 0.50]
        ].map(p => new THREE.Vector2(p[1], p[0]));

        const buildEngine = (xPos) => {
            const eng = new THREE.Group();
            eng.position.set(xPos, -1.52, 0.95);

            const cowlGeo = new THREE.LatheGeometry(nacelleProfile, 40);
            cowlGeo.rotateX(Math.PI / 2);
            const cowl = new THREE.Mesh(cowlGeo, M.fuselage);
            cowl.castShadow = true;
            eng.add(cowl);

            const lipGeo = new THREE.TorusGeometry(0.5, 0.055, 10, 36);
            const lip = new THREE.Mesh(lipGeo, M.chrome);
            lip.position.set(0, 0, 1.5);
            eng.add(lip);

            // Hốc hút gió tối
            const ductGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.9, 32, 1, true);
            ductGeo.rotateX(Math.PI / 2);
            const duct = new THREE.Mesh(ductGeo, M.darkMetal);
            duct.position.set(0, 0, 1.05);
            duct.material.side = THREE.DoubleSide;
            eng.add(duct);

            const fanDisc = new THREE.Group();
            fanDisc.position.set(0, 0, 1.28);
            for (let i = 0; i < 18; i++) {
                const bladeGeo = new THREE.BoxGeometry(0.055, 0.42, 0.03);
                const blade = new THREE.Mesh(bladeGeo, M.fanBlades);
                const a = (i / 18) * Math.PI * 2;
                blade.position.set(Math.cos(a) * 0.26, Math.sin(a) * 0.26, 0);
                blade.rotation.z = a;
                blade.rotation.y = 0.3;
                fanDisc.add(blade);
            }
            eng.add(fanDisc);
            this.rotatingFanDiscs.push(fanDisc);

            const spinnerGeo = new THREE.ConeGeometry(0.13, 0.42, 16);
            spinnerGeo.rotateX(Math.PI / 2);
            const spinner = new THREE.Mesh(spinnerGeo, M.chrome);
            spinner.position.set(0, 0, 1.34);
            eng.add(spinner);

            // Pylon nối vào cánh
            const pylonGeo = new THREE.BoxGeometry(0.2, 0.9, 2.4);
            const pylon = new THREE.Mesh(pylonGeo, M.fuselage);
            pylon.position.set(0, 0.72, -0.35);
            pylon.castShadow = true;
            eng.add(pylon);

            // Nozzle thoát
            const nozzleGeo = new THREE.CylinderGeometry(0.42, 0.34, 0.7, 24, 1, true);
            nozzleGeo.rotateX(Math.PI / 2);
            const nozzle = new THREE.Mesh(nozzleGeo, M.darkMetal);
            nozzle.position.set(0, 0, -2.5);
            eng.add(nozzle);

            return eng;
        };

        this.engineNodes = [buildEngine(-3.5), buildEngine(3.5)];
        this.engineNodes.forEach(e => enginesGroup.add(e));
        this.enginesGroup = enginesGroup;
        this.aircraftRootGroup.add(enginesGroup);

        // ---------------------------------------------------------------
        // 4. Đuôi + cửa sổ cabin
        // ---------------------------------------------------------------
        const detailsGroup = new THREE.Group();

        // Đuôi đứng
        const finShape = new THREE.Shape();
        finShape.moveTo(-6.1, 0);
        finShape.lineTo(-9.5, 0);
        finShape.lineTo(-9.5, 3.9);
        finShape.lineTo(-8.35, 3.9);
        finShape.closePath();
        const finGeo = new THREE.ExtrudeGeometry(finShape, {
            depth: 0.22, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.04, bevelThickness: 0.04
        });
        finGeo.rotateY(-Math.PI / 2);
        finGeo.translate(0.11, 0, 0);
        const finMesh = new THREE.Mesh(finGeo, M.fuselage);
        finMesh.position.set(0, 0.62, 0);
        finMesh.castShadow = true;
        detailsGroup.add(finMesh);

        // Đuôi ngang
        const hTailShape = new THREE.Shape();
        hTailShape.moveTo(0, -7.0);
        hTailShape.lineTo(4.0, -8.6);
        hTailShape.lineTo(4.0, -9.5);
        hTailShape.lineTo(0, -9.2);
        hTailShape.closePath();
        const hTailGeo = new THREE.ExtrudeGeometry(hTailShape, {
            depth: 0.16, bevelEnabled: true, bevelSegments: 1, bevelSize: 0.03, bevelThickness: 0.03
        });
        hTailGeo.rotateX(Math.PI / 2);
        hTailGeo.translate(0, 0.08, 0);
        const hTailR = new THREE.Mesh(hTailGeo, M.fuselage);
        hTailR.position.set(0.5, 0.5, 0);
        hTailR.rotation.z = 0.08;
        detailsGroup.add(hTailR);
        const hTailL = hTailR.clone();
        hTailL.scale.x = -1;
        hTailL.position.x = -0.5;
        hTailL.rotation.z = -0.08;
        detailsGroup.add(hTailL);

        // Đèn strobe đuôi
        const tailStrobe = new THREE.PointLight(0xffffff, 4, 14);
        tailStrobe.position.set(0, 4.6, -9.2);
        detailsGroup.add(tailStrobe);
        this.strobeLights.push(tailStrobe);

        // Cửa sổ cabin (phát sáng theo hạng vé)
        this.cabinWindowsGroup = new THREE.Group();
        for (let z = -5.0; z <= 4.2; z += 0.58) {
            [-1, 1].forEach(dir => {
                const winGeo = new THREE.BoxGeometry(0.05, 0.16, 0.26);
                const win = new THREE.Mesh(winGeo, M.cabinWindows);
                win.position.set(dir * 1.362, 0.34, z);
                this.cabinWindowsGroup.add(win);
            });
        }
        detailsGroup.add(this.cabinWindowsGroup);

        this.aircraftRootGroup.add(detailsGroup);

        // ---------------------------------------------------------------
        // 5. Nâng cấp theo ngân sách
        // ---------------------------------------------------------------
        const upgradeGroup = new THREE.Group();

        // Winglets
        this.wingletsGroup = new THREE.Group();
        const buildWinglet = (dir) => {
            const geo = new THREE.BoxGeometry(0.13, 1.5, 0.95);
            const mesh = new THREE.Mesh(geo, M.liveryCyan);
            mesh.position.set(dir * 10.66, -0.42 + 9.6 * 0.055 + 0.68, -1.55);
            mesh.rotation.z = dir * -0.13;
            mesh.scale.setScalar(0.001);
            mesh.castShadow = true;
            return mesh;
        };
        this.wingletsGroup.add(buildWinglet(1));
        this.wingletsGroup.add(buildWinglet(-1));
        upgradeGroup.add(this.wingletsGroup);

        // Sọc vàng hạng sang
        this.liveryGroup = new THREE.Group();
        const finStripe = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.55, 1.1), M.liveryGold);
        finStripe.position.set(0, 3.55, -8.6);
        this.liveryGroup.add(finStripe);
        [-3.5, 3.5].forEach(x => {
            const ringGeo = new THREE.TorusGeometry(0.63, 0.035, 8, 32);
            const ring = new THREE.Mesh(ringGeo, M.liveryGold);
            ring.position.set(x, -1.52, 0.6);
            this.liveryGroup.add(ring);
        });
        upgradeGroup.add(this.liveryGroup);

        // Afterburner
        this.afterburnersGroup = new THREE.Group();
        const buildAfterburner = (xPos) => {
            const ab = new THREE.Group();
            ab.position.set(xPos, -1.52, -2.75);
            const coreGeo = new THREE.ConeGeometry(0.3, 2.0, 18, 1, true);
            coreGeo.rotateX(-Math.PI / 2);
            const core = new THREE.Mesh(coreGeo, M.afterburnerCore);
            core.position.set(0, 0, -1.0);
            ab.add(core);
            const plumeGeo = new THREE.ConeGeometry(0.44, 3.2, 18, 1, true);
            plumeGeo.rotateX(-Math.PI / 2);
            const plume = new THREE.Mesh(plumeGeo, M.afterburnerPlume);
            plume.position.set(0, 0, -1.6);
            ab.add(plume);
            return ab;
        };
        this.afterburnersGroup.add(buildAfterburner(-3.5));
        this.afterburnersGroup.add(buildAfterburner(3.5));
        this.afterburnersGroup.visible = false;
        upgradeGroup.add(this.afterburnersGroup);

        this.aircraftRootGroup.add(upgradeGroup);
        this.scene.add(this.aircraftRootGroup);
    },

    bindControls(container) {
        let isPointerDown = false;
        let lastX = 0;
        let lastY = 0;
        let touchDistance = 0;

        const onStart = (clientX, clientY) => {
            isPointerDown = true;
            lastX = clientX;
            lastY = clientY;
            this.isUserInteracting = true;
            if (this.interactTimer) clearTimeout(this.interactTimer);
        };

        const onMove = (clientX, clientY) => {
            if (!isPointerDown) return;
            const deltaX = clientX - lastX;
            const deltaY = clientY - lastY;
            lastX = clientX;
            lastY = clientY;

            this.targetAzimuth -= deltaX * 0.007;
            this.targetPolar += deltaY * 0.005;
            this.targetPolar = Math.max(0.08, Math.min(1.25, this.targetPolar));
        };

        const onEnd = () => {
            isPointerDown = false;
            touchDistance = 0;
            if (this.interactTimer) clearTimeout(this.interactTimer);
            this.interactTimer = setTimeout(() => {
                this.isUserInteracting = false;
            }, 2500);
        };

        container.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
        window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
        window.addEventListener('mouseup', onEnd);

        container.addEventListener('touchstart', (e) => {
            if (e.touches.length === 1) {
                onStart(e.touches[0].clientX, e.touches[0].clientY);
            } else if (e.touches.length === 2) {
                isPointerDown = false;
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                touchDistance = Math.hypot(dx, dy);
            }
        }, { passive: true });

        window.addEventListener('touchmove', (e) => {
            if (e.touches.length === 1 && isPointerDown) {
                onMove(e.touches[0].clientX, e.touches[0].clientY);
            } else if (e.touches.length === 2 && touchDistance > 0) {
                const dx = e.touches[0].clientX - e.touches[1].clientX;
                const dy = e.touches[0].clientY - e.touches[1].clientY;
                const newDist = Math.hypot(dx, dy);
                const factor = (touchDistance - newDist) * 0.05;
                this.targetDistance = Math.max(16, Math.min(46, this.targetDistance + factor));
                touchDistance = newDist;
            }
        }, { passive: true });

        window.addEventListener('touchend', onEnd);

        container.addEventListener('wheel', (e) => {
            e.preventDefault();
            this.targetDistance += e.deltaY * 0.025;
            this.targetDistance = Math.max(16, Math.min(46, this.targetDistance));
        }, { passive: false });
    },

    updateTierUpgrades(usd) {
        if (!this.aircraftRootGroup) return;

        // Tiến hoá theo ngân sách: càng cao → cánh khoẻ hơn, động cơ lớn hơn, hoàn thiện bóng hơn
        let cfg;
        if (usd >= 50000) {
            cfg = { winglets: 1, cabin: 1, engine: 1.24, pitch: -0.06, afterburner: 1,
                    led: 0xfbbf24, metal: 0.94, rough: 0.06, color: 0xffffff, livery: true };
        } else if (usd >= 20000) {
            cfg = { winglets: 1, cabin: 1, engine: 1.18, pitch: 0, afterburner: 0,
                    led: 0xf59e0b, metal: 0.8, rough: 0.12, color: 0xf8fafc, livery: true };
        } else if (usd >= 8000) {
            cfg = { winglets: 1, cabin: 1, engine: 1.12, pitch: 0, afterburner: 0,
                    led: 0x10b981, metal: 0.62, rough: 0.18, color: 0xf8fafc, livery: false };
        } else if (usd >= 2500) {
            cfg = { winglets: 1, cabin: 0, engine: 1.0, pitch: 0, afterburner: 0,
                    led: 0x3b82f6, metal: 0.46, rough: 0.24, color: 0xf8fafc, livery: false };
        } else {
            cfg = { winglets: 0, cabin: 0, engine: 0.88, pitch: 0, afterburner: 0,
                    led: 0x06b6d4, metal: 0.34, rough: 0.3, color: 0xf8fafc, livery: false };
        }

        this.targets.wingletsScale = cfg.winglets;
        this.targets.cabinEmissive = cfg.cabin;
        this.targets.engineScale = cfg.engine;
        this.targets.aircraftPitch = cfg.pitch;
        this.targets.afterburnerScale = cfg.afterburner;
        this.targets.platformLedColor = cfg.led;

        if (this.materials.fuselage) {
            this.materials.fuselage.metalness = cfg.metal;
            this.materials.fuselage.roughness = cfg.rough;
            this.materials.fuselage.color.setHex(cfg.color);
        }

        if (this.liveryGroup) this.liveryGroup.visible = cfg.livery;
    },

    animate() {
        this.animFrameId = requestAnimationFrame(() => this.animate());
        const lerpRate = 0.08;

        if (this.wingletsGroup) {
            const curW = this.wingletsGroup.userData.k ?? 0;
            const nextW = THREE.MathUtils.lerp(curW, this.targets.wingletsScale, lerpRate);
            this.wingletsGroup.userData.k = nextW;
            this.wingletsGroup.children.forEach(m => m.scale.setScalar(Math.max(0.001, nextW)));
            this.wingletsGroup.visible = nextW > 0.04;
        }

        if (this.engineNodes) {
            const curE = this.engineNodes[0].userData.k ?? 0.9;
            const nextE = THREE.MathUtils.lerp(curE, this.targets.engineScale, lerpRate);
            this.engineNodes.forEach(e => {
                e.userData.k = nextE;
                e.scale.setScalar(nextE);
            });
        }

        if (this.materials.cabinWindows) {
            this.materials.cabinWindows.emissiveIntensity = THREE.MathUtils.lerp(
                this.materials.cabinWindows.emissiveIntensity,
                this.targets.cabinEmissive,
                lerpRate
            );
        }

        const fanSpeed = 0.35;
        this.rotatingFanDiscs.forEach(disc => {
            disc.rotation.z += fanSpeed;
        });

        if (this.afterburnersGroup) {
            if (this.targets.afterburnerScale > 0 || this.isTakingOff) {
                this.afterburnersGroup.visible = true;
                const pulse = 1.0 + Math.sin(Date.now() * 0.03) * 0.14;
                const baseScale = (this.targets.afterburnerScale || 1.0) * pulse;
                this.afterburnersGroup.children.forEach(c => c.scale.set(baseScale, baseScale, baseScale * 1.3));
            } else {
                this.afterburnersGroup.visible = false;
            }
        }

        const isStrobeFlash = (Date.now() % 1400) < 120;
        this.strobeLights.forEach(s => { s.visible = isStrobeFlash; });

        if (this.platformLedMat && this.platformGlowLight) {
            const targetCol = new THREE.Color(this.targets.platformLedColor);
            this.platformLedMat.color.lerp(targetCol, 0.08);
            this.platformGlowLight.color.lerp(targetCol, 0.08);
        }

        if (!this.isUserInteracting && !this.isTakingOff) {
            this.targetAzimuth += 0.0016;
        }

        this.currentAzimuth += (this.targetAzimuth - this.currentAzimuth) * 0.08;
        this.currentPolar += (this.targetPolar - this.currentPolar) * 0.08;
        this.currentDistance += (this.targetDistance - this.currentDistance) * 0.08;
        this.updateCameraFromOrbit();

        if (this.aircraftRootGroup && !this.isTakingOff) {
            const time = Date.now() * 0.0016;
            this.aircraftRootGroup.position.y = Math.sin(time) * 0.06;
            this.aircraftRootGroup.rotation.x = THREE.MathUtils.lerp(
                this.aircraftRootGroup.rotation.x,
                this.targets.aircraftPitch,
                lerpRate
            );
        }

        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    },

    triggerTakeoffAnimation(onComplete) {
        if (!this.aircraftRootGroup) {
            if (onComplete) onComplete();
            return;
        }

        this.isTakingOff = true;
        this.targets.afterburnerScale = 2.2;

        let frame = 0;
        const maxFrames = 48;

        const flyStep = () => {
            frame++;
            const progress = frame / maxFrames;
            const easeProgress = progress * progress * 1.3;

            // Quay đầu ra xa camera rồi mới cất cánh (mũi hướng +Z)
            const turn = Math.min(1, progress * 1.7);
            this.aircraftRootGroup.rotation.y = turn * Math.PI;
            this.aircraftRootGroup.position.z = -easeProgress * 52;
            this.aircraftRootGroup.position.y = easeProgress * 16;
            this.aircraftRootGroup.rotation.x = -0.18 - easeProgress * 0.12;

            if (this.camera) {
                const rumble = (1 - progress) * (Math.random() - 0.5) * 0.25;
                this.camera.position.x += rumble;
            }

            if (frame < maxFrames) {
                requestAnimationFrame(flyStep);
            } else {
                this.aircraftRootGroup.position.set(0, 0, 0);
                this.aircraftRootGroup.rotation.set(0, 0, 0);
                this.isTakingOff = false;
                this.updateTierUpgrades(state.budgetUSD);
                if (onComplete) onComplete();
            }
        };

        flyStep();
    }
};

    // =========================================================================
    // 4. Core Wizard Logic & DOM Controller
    // =========================================================================
    function init() {
        const container = document.getElementById('game-booking-wizard-container');
        if (!container) return;

        const docLang = document.documentElement.lang || 'vi';
        state.currentLang = docLang.startsWith('en') ? 'en' : 'vi';

        renderSkeleton(container);
        bindEvents();
        updateCountrySelection(state.selectedCountry, false);
        updateDestinationSelection(state.selectedDestination);
        updateBudgetTier(state.budgetUSD, false);

        // Initialize 3D Globe for Stage 1
        setTimeout(() => {
            if (typeof Globe3D !== 'undefined' && Globe3D.init) {
                Globe3D.init('globe-3d-canvas-container');
                Globe3D.focusCountry(state.selectedCountry);
            }
        }, 100);
    }

    // Render Full Wizard Skeleton
    function renderSkeleton(container) {
        const isVi = state.currentLang === 'vi';
        const tier = getTierForUSD(state.budgetUSD);

        container.innerHTML = `
            <div class="atlas-wizard-wrapper game-wizard-shell" id="atlas-wizard-wrapper">
                
                <!-- TOP HEADER: Steps Tracker & SFX Audio -->
                <div class="atlas-top-bar">
                    <div class="atlas-brand-badge">
                        <div class="atlas-brand-crest">🧭</div>
                        <div class="atlas-brand-meta">
                            <h2>QUY NHON EXPLORER <span class="badge-beta">TACTICAL HUD</span></h2>
                            <small>${isVi ? 'Sa Bàn Chiến Thuật 3D & Máy Bay Phản Lực' : '3D Tactical Diorama & Jet Configurator'}</small>
                        </div>
                    </div>

                    <!-- 3-Step Progress Tracker -->
                    <div class="atlas-steps-tracker">
                        <button type="button" class="step-tracker-pill active" data-stage="1" id="step-pill-1">
                            <span class="step-num-bubble">1</span>
                            <span class="step-pill-label">${isVi ? '1. Khởi Hành' : '1. Departure'}</span>
                        </button>
                        <span class="step-tracker-arrow">➔</span>
                        <button type="button" class="step-tracker-pill" data-stage="2" id="step-pill-2">
                            <span class="step-num-bubble">2</span>
                            <span class="step-pill-label">${isVi ? '2. Điểm Đến' : '2. Destination'}</span>
                        </button>
                        <span class="step-tracker-arrow">➔</span>
                        <button type="button" class="step-tracker-pill" data-stage="3" id="step-pill-3">
                            <span class="step-num-bubble">3</span>
                            <span class="step-pill-label">${isVi ? '3. Ngân Sách 3D' : '3. 3D Aircraft'}</span>
                        </button>
                    </div>

                    <div class="atlas-top-controls">
                        <button type="button" class="btn-atlas-sfx" id="btn-atlas-sfx" title="SFX Audio">
                            <span>🔊</span>
                            <small>SFX</small>
                        </button>
                    </div>
                </div>

                <!-- =======================================================
                     STEP 1: DEPARTURE – ISOMETRIC 3D WORLD MAP
                     ======================================================= -->
                <div class="atlas-stage-screen active" id="stage-screen-departure">
                    <div class="atlas-instruction-banner">
                        <span class="instruction-tag">${isVi ? 'BƯỚC 1' : 'STEP 1'}</span>
                        <p class="instruction-text">
                            ${isVi 
                                ? 'Sa Bàn Thế Giới 3D: Nhấp chọn quốc gia và cảng hàng không xuất phát để mở đường bay đến Việt Nam.' 
                                : '3D Tactical World Map: Select your departure nation and airport to plot route to Vietnam.'}
                        </p>
                    </div>

                    <div class="atlas-split-layout">
                        <!-- Left: Isometric 3D World Map Viewport -->
                        <div class="atlas-map-canvas-card" id="world-map-card">
                            <div class="atlas-map-header-tag">
                                <span class="pulse-radar-dot"></span>
                                <span>INTERACTIVE 3D WEBGL GLOBE • SATELLITE RADAR</span>
                            </div>

                            <!-- Tactical Zoom Toolbar -->
                            <div class="atlas-map-toolbar">
                                <button type="button" class="btn-atlas-tool" id="tool-zoom-in" title="Zoom In"><i class="fa-solid fa-plus"></i></button>
                                <button type="button" class="btn-atlas-tool" id="tool-zoom-out" title="Zoom Out"><i class="fa-solid fa-minus"></i></button>
                                <button type="button" class="btn-atlas-tool" id="tool-zoom-reset" title="Reset View"><i class="fa-solid fa-arrows-rotate"></i></button>
                                <button type="button" class="btn-atlas-tool" id="tool-map-fullscreen" title="Fullscreen Map"><i class="fa-solid fa-expand"></i></button>
                            </div>

                            <!-- SVG Map Viewport -->
                            <!-- 3D Interactive WebGL Globe Viewport -->
                            <div class="globe-canvas-container" id="globe-3d-canvas-container">
                                <div class="globe-hud-overlay">
                                    <span class="pulse-radar-dot"></span>
                                    <strong id="globe-selected-country-text">🇧🇪 BRUSSELS (BRU) ➔ 🇻🇳 QUY NHƠN (UIH)</strong>
                                    <small id="globe-distance-text">10,050 KM • 3D FLIGHT CORRIDOR</small>
                                </div>
                            </div>

                            <!-- Tactical Toast Notification for unsupported nations -->
                            <div class="atlas-toast-banner" id="atlas-toast-banner">
                                <i class="fa-solid fa-circle-info"></i>
                                <span id="atlas-toast-text">Tọa độ quốc gia này chưa có chuyến bay trực tiếp đến Việt Nam.</span>
                            </div>
                        </div>

                        <!-- Right / Bottom: 2-Click Departure Selection Panel -->
                        <div class="atlas-info-card">
                            <div>
                                <div class="info-card-header">
                                    <h3><i class="fa-solid fa-plane-departure" style="color:var(--hud-cyan)"></i> WHERE ARE YOU FLYING FROM?</h3>
                                    <p>${isVi ? 'Chọn quốc gia và sân bay xuất phát của bạn:' : 'Choose your departure country and airport:'}</p>
                                </div>

                                <!-- Quick Select Country Dock -->
                                <div class="quick-country-row" id="quick-country-row">
                                    ${Object.values(COUNTRIES).map(c => `
                                        <button type="button" class="country-atlas-chip ${c.id === state.selectedCountry ? 'active' : ''}" data-country="${c.id}">
                                            <span>${c.flag}</span>
                                            <span>${c.name[state.currentLang]}</span>
                                        </button>
                                    `).join('')}
                                </div>

                                <!-- Active Country Banner -->
                                <div class="active-country-banner">
                                    <div class="active-country-flag" id="active-country-flag">🇧🇪</div>
                                    <div class="active-country-text">
                                        <h4 id="active-country-name">Bỉ (Belgium)</h4>
                                        <small id="active-country-continent">Châu Âu • Brussels</small>
                                    </div>
                                </div>

                                <!-- Airport List (Click 2) -->
                                <div class="airport-list-group" id="departure-airports-list">
                                    <!-- Dynamic airports rendered here -->
                                </div>
                            </div>

                            <div class="panel-action-footer">
                                <button type="button" class="btn-atlas-next" id="btn-confirm-departure">
                                    <span>CONFIRM DEPARTURE & CONTINUE</span>
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- =======================================================
                     STEP 2: DESTINATION – ISOMETRIC 3D VIETNAM DIORAMA & QUESTS
                     ======================================================= -->
                <div class="atlas-stage-screen" id="stage-screen-destination">
                    <div class="atlas-instruction-banner">
                        <span class="instruction-tag">${isVi ? 'BƯỚC 2' : 'STEP 2'}</span>
                        <p class="instruction-text">
                            ${isVi 
                                ? 'Sa Bàn Việt Nam 3D: Chọn 1 trong 3 nhiệm vụ du lịch với Quy Nhơn là Hero Main Quest trung tâm.' 
                                : '3D Vietnam Diorama: Select 1 of 3 travel quests with Quy Nhon as the central Hero Main Quest.'}
                        </p>
                    </div>

                    <div class="atlas-split-layout">
                        <!-- Left: Isometric 3D Vietnam Diorama Map -->
                        <div class="atlas-map-canvas-card" id="vietnam-map-card">
                            <div class="atlas-map-header-tag">
                                <span class="pulse-radar-dot"></span>
                                <span>MINIATURE 3D VIETNAM DIORAMA • QUEST MAP</span>
                            </div>

                            <div class="atlas-svg-viewport">
                                <svg viewBox="0 0 540 620" class="atlas-vietnam-svg" id="vietnam-atlas-svg">
                                    <defs>
                                        <!-- Topography Gradients -->
                                        <linearGradient id="vnTopographyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                            <stop offset="0%" stop-color="#0284c7"/>
                                            <stop offset="45%" stop-color="#0369a1"/>
                                            <stop offset="100%" stop-color="#075985"/>
                                        </linearGradient>

                                        <!-- Quest Beams Gradients -->
                                        <linearGradient id="quynhonGoldBeam" x1="0%" y1="100%" x2="0%" y2="0%">
                                            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.95"/>
                                            <stop offset="70%" stop-color="#fbbf24" stop-opacity="0.35"/>
                                            <stop offset="100%" stop-color="#fef08a" stop-opacity="0"/>
                                        </linearGradient>

                                        <linearGradient id="gialaiGreenBeam" x1="0%" y1="100%" x2="0%" y2="0%">
                                            <stop offset="0%" stop-color="#10b981" stop-opacity="0.9"/>
                                            <stop offset="70%" stop-color="#059669" stop-opacity="0.3"/>
                                            <stop offset="100%" stop-color="#a7f3d0" stop-opacity="0"/>
                                        </linearGradient>

                                        <linearGradient id="hanoiAmberBeam" x1="0%" y1="100%" x2="0%" y2="0%">
                                            <stop offset="0%" stop-color="#f59e0b" stop-opacity="0.9"/>
                                            <stop offset="70%" stop-color="#d97706" stop-opacity="0.3"/>
                                            <stop offset="100%" stop-color="#fde68a" stop-opacity="0"/>
                                        </linearGradient>
                                    </defs>

                                    <!-- Deep Ocean Base Plate -->
                                    <rect width="540" height="620" rx="14" fill="url(#oceanBgGrad)" />
                                    <rect width="540" height="620" rx="14" fill="url(#isoTacticalGrid)" pointer-events="none" />

                                    <!-- 1. LAYER DEPTH CLIFF EXTRUSION (translate Y: 10px) -->
                                    <path d="M 235,55 
                                             Q 275,42 295,72 Q 315,102 305,135 
                                             Q 280,165 268,200 Q 262,242 284,282 
                                             Q 300,318 316,358 Q 326,402 306,442 
                                             Q 286,482 255,512 Q 228,542 202,532 
                                             Q 186,512 206,492 Q 236,462 246,422 
                                             Q 256,372 242,332 Q 222,282 216,232 
                                             Q 212,178 222,132 Q 230,92 235,55 Z" 
                                          transform="translate(0, 10)" 
                                          class="vn-cliff-depth" />

                                    <!-- 2. LAYER TOP MAINLAND SURFACE (True Geographic S-Curve) -->
                                    <!-- Coastal wave surf outline -->
                                    <path d="M 235,55 
                                             Q 275,42 295,72 Q 315,102 305,135 
                                             Q 280,165 268,200 Q 262,242 284,282 
                                             Q 300,318 316,358 Q 326,402 306,442 
                                             Q 286,482 255,512 Q 228,542 202,532 
                                             Q 186,512 206,492 Q 236,462 246,422 
                                             Q 256,372 242,332 Q 222,282 216,232 
                                             Q 212,178 222,132 Q 230,92 235,55 Z" 
                                          class="vn-coastal-surf" />

                                    <!-- Mainland Surface -->
                                    <path d="M 235,55 
                                             Q 275,42 295,72 Q 315,102 305,135 
                                             Q 280,165 268,200 Q 262,242 284,282 
                                             Q 300,318 316,358 Q 326,402 306,442 
                                             Q 286,482 255,512 Q 228,542 202,532 
                                             Q 186,512 206,492 Q 236,462 246,422 
                                             Q 256,372 242,332 Q 222,282 216,232 
                                             Q 212,178 222,132 Q 230,92 235,55 Z" 
                                          class="vn-mainland-surface" />

                                    <!-- Truong Son Mountain Poly Blocks -->
                                    <polygon points="255,185 268,170 278,198" class="vn-poly-mountain" />
                                    <polygon points="250,215 262,202 272,228" class="vn-poly-mountain" />
                                    <polygon points="262,275 274,260 286,288" class="vn-poly-mountain" />
                                    <!-- Central Highlands Plateau Poly -->
                                    <polygon points="248,322 272,305 292,335 262,352" class="vn-highland-plateau" />
                                    <!-- Phu Quoc Island -->
                                    <ellipse cx="175" cy="515" rx="8" ry="14" fill="#0284c7" stroke="#06b6d4" stroke-width="1.5" />

                                    <!-- MANDATORY SOVEREIGN ARCHIPELAGOES: HOÀNG SA & TRƯỜNG SA -->
                                    <!-- 1. Quần đảo Hoàng Sa (Việt Nam) -->
                                    <g class="archipelago-group" transform="translate(410, 265)">
                                        <!-- Islands cluster dots -->
                                        <circle cx="-12" cy="-6" r="4" fill="#f59e0b" stroke="#fff" stroke-width="1.2" />
                                        <circle cx="2" cy="-12" r="3.5" fill="#f59e0b" stroke="#fff" stroke-width="1.2" />
                                        <circle cx="10" cy="4" r="4.5" fill="#f59e0b" stroke="#fff" stroke-width="1.2" />
                                        <circle cx="-4" cy="8" r="3" fill="#f59e0b" stroke="#fff" stroke-width="1.2" />
                                        <!-- Sovereignty Banner Label -->
                                        <rect x="-95" y="16" width="190" height="20" rx="4" fill="rgba(15, 23, 42, 0.92)" stroke="#f59e0b" stroke-width="1.2" />
                                        <text x="0" y="30" class="sovereignty-label">⭐ Quần đảo Hoàng Sa (Việt Nam)</text>
                                    </g>

                                    <!-- 2. Quần đảo Trường Sa (Việt Nam) -->
                                    <g class="archipelago-group" transform="translate(435, 455)">
                                        <!-- Islands cluster dots -->
                                        <circle cx="-14" cy="-8" r="4" fill="#f59e0b" stroke="#fff" stroke-width="1.2" />
                                        <circle cx="6" cy="-14" r="4.5" fill="#f59e0b" stroke="#fff" stroke-width="1.2" />
                                        <circle cx="16" cy="6" r="3.8" fill="#f59e0b" stroke="#fff" stroke-width="1.2" />
                                        <circle cx="-6" cy="10" r="4.2" fill="#f59e0b" stroke="#fff" stroke-width="1.2" />
                                        <!-- Sovereignty Banner Label -->
                                        <rect x="-95" y="18" width="190" height="20" rx="4" fill="rgba(15, 23, 42, 0.92)" stroke="#f59e0b" stroke-width="1.2" />
                                        <text x="0" y="32" class="sovereignty-label">⭐ Quần đảo Trường Sa (Việt Nam)</text>
                                    </g>

                                    <!-- Glowing Quest Corridors connecting the 3 Quests -->
                                    <path d="M 265,135 Q 315,245 325,355" class="quest-corridor-line" stroke="#f59e0b" />
                                    <path d="M 270,345 L 325,355" class="quest-corridor-line" stroke="#10b981" />

                                    <!-- ==============================================
                                         THE 3 QUEST DESTINATIONS (NO 0,0 GLITCH!)
                                         ============================================== -->

                                    <!-- 1. HANOI CAPITAL QUEST (x: 265, y: 135) -->
                                    <g class="vietnam-dest-marker ${state.selectedDestination === 'hanoi' ? 'selected' : ''}" data-dest="hanoi" transform="translate(265, 135)">
                                        <!-- Light Pillar Beam -->
                                        <polygon points="-14,0 14,0 20,-110 -20,-110" fill="url(#hanoiAmberBeam)" />
                                        <circle r="12" fill="rgba(245, 158, 11, 0.35)" />
                                        <circle r="7" fill="#f59e0b" stroke="#fff" stroke-width="2" />
                                        <!-- Temple of Literature mini icon -->
                                        <rect x="-8" y="-18" width="16" height="8" rx="2" fill="#d97706" stroke="#fff" stroke-width="1" />
                                        <text x="0" y="22" class="dest-marker-label" fill="#fde047">HÀ NỘI</text>
                                    </g>

                                    <!-- 2. GIA LAI HIGHLANDS QUEST (x: 270, y: 345) -->
                                    <g class="vietnam-dest-marker ${state.selectedDestination === 'gialai' ? 'selected' : ''}" data-dest="gialai" transform="translate(270, 345)">
                                        <!-- Light Pillar Beam -->
                                        <polygon points="-14,0 14,0 20,-110 -20,-110" fill="url(#gialaiGreenBeam)" />
                                        <circle r="12" fill="rgba(16, 185, 129, 0.35)" />
                                        <circle r="7" fill="#10b981" stroke="#fff" stroke-width="2" />
                                        <!-- Pine Mountain icon -->
                                        <polygon points="0,-18 6,-8 -6,-8" fill="#047857" stroke="#fff" stroke-width="1" />
                                        <text x="-48" y="5" class="dest-marker-label" fill="#a7f3d0">GIA LAI</text>
                                    </g>

                                    <!-- 3. QUY NHON HERO MAIN QUEST (x: 325, y: 355) -->
                                    <g class="vietnam-dest-marker hero ${state.selectedDestination === 'quynhon' ? 'selected' : ''}" data-dest="quynhon" transform="translate(325, 355)">
                                        <!-- Towering Sunlight Golden Pillar -->
                                        <polygon points="-24,0 24,0 35,-170 -35,-170" fill="url(#quynhonGoldBeam)" />
                                        
                                        <!-- Dual Radiating Radar Rings -->
                                        <circle cx="0" cy="0" r="22" class="hero-radar-ring" />
                                        <circle cx="0" cy="0" r="38" class="hero-radar-ring ring-2" />
                                        
                                        <!-- Cham Twin Towers Miniature & Core -->
                                        <rect x="-10" y="-14" width="8" height="14" rx="2" fill="#f59e0b" stroke="#fff" stroke-width="1" />
                                        <rect x="2" y="-14" width="8" height="14" rx="2" fill="#f59e0b" stroke="#fff" stroke-width="1" />
                                        <circle cx="0" cy="0" r="10" fill="#0284c7" stroke="#fbbf24" stroke-width="2.5" />
                                        
                                        <!-- Floating Golden Quest Diamond -->
                                        <polygon points="0,-24 6,-14 16,-8 6,-2 0,8 -6,-2 -16,-8 -6,-14" fill="#fbbf24" stroke="#fff" stroke-width="1.5" class="hero-quest-diamond" />
                                        <text x="35" y="5" class="dest-marker-label" style="font-size:12px;fill:#fde047;">QUY NHƠN ⭐ HERO</text>
                                    </g>
                                </svg>
                            </div>
                        </div>

                        <!-- Right / Bottom: 3 Destination Cards & Airport Selection -->
                        <div class="atlas-info-card">
                            <div>
                                <div class="info-card-header">
                                    <h3><i class="fa-solid fa-map-location-dot" style="color:var(--hud-gold)"></i> ${isVi ? 'CHỌN ĐIỂM ĐẾN TẠI VIỆT NAM' : 'SELECT DESTINATION IN VIETNAM'}</h3>
                                    <p>${isVi ? 'Chọn điểm du lịch mong muốn và xác nhận sân bay hạ cánh:' : 'Choose your travel quest destination and landing airport:'}</p>
                                </div>

                                <!-- The 3 Destination Cards -->
                                <div class="destination-cards-group">
                                    ${DESTINATIONS.map(d => `
                                        <div class="dest-atlas-card ${d.id === state.selectedDestination ? 'selected' : ''}" data-dest="${d.id}">
                                            <div class="dest-card-top">
                                                <div class="dest-title-wrap">
                                                    <div class="dest-crest-icon ${d.colorClass}">
                                                        <i class="fa-solid ${d.icon}"></i>
                                                    </div>
                                                    <div>
                                                        <h4>${d.name[state.currentLang]}</h4>
                                                        <small><i class="fa-solid fa-plane-arrival"></i> ${d.airportName} (${d.airportCode})</small>
                                                    </div>
                                                </div>
                                                <span class="dest-badge-tag">${d.badge[state.currentLang]}</span>
                                            </div>
                                            <p class="dest-quote-text">"${d.quote[state.currentLang]}"</p>
                                            <div class="dest-pills-row">
                                                ${d.tags.map(t => `<span class="dest-pill-chip">#${t}</span>`).join('')}
                                            </div>
                                        </div>
                                    `).join('')}
                                </div>
                            </div>

                            <div class="panel-action-footer">
                                <button type="button" class="btn-atlas-back" id="btn-back-to-step-1">
                                    <i class="fa-solid fa-arrow-left"></i>
                                    <span>${isVi ? 'Quay Lại' : 'Back'}</span>
                                </button>
                                <button type="button" class="btn-atlas-next" id="btn-confirm-destination">
                                    <span>CONFIRM DESTINATION & CONTINUE</span>
                                    <i class="fa-solid fa-arrow-right"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- =======================================================
                     STEP 3: BUDGET – REALISTIC 3D AIRCRAFT (THREE.JS)
                     ======================================================= -->
                <div class="atlas-stage-screen" id="stage-screen-budget">
                    <div class="atlas-instruction-banner">
                        <span class="instruction-tag">${isVi ? 'BƯỚC 3' : 'STEP 3'}</span>
                        <p class="instruction-text">
                            ${isVi 
                                ? 'Studio Máy Bay 3D Chân Thực: Điều chỉnh ngân sách để nâng cấp khí động học, động cơ phản lực và độ bóng kim loại.' 
                                : 'Realistic 3D Aircraft Studio: Adjust your budget to upgrade aerodynamics, turbofans, and metallic polish.'}
                        </p>
                    </div>

                    <div class="atlas-split-layout">
                        <!-- Left: Three.js WebGL Realistic 3D Aircraft Viewport -->
                        <div class="hangar-3d-card" id="aircraft-3d-viewport-card">
                            <div class="hangar-hud-badge">
                                <strong id="hud-tier-name">${tier.tag}</strong>
                                <small id="hud-model-name">${tier.modelName}</small>
                            </div>

                            <div class="hangar-takeoff-tag" id="hangar-takeoff-tag">
                                <i class="fa-solid fa-plane-departure"></i>
                                <span>READY FOR TAKEOFF</span>
                            </div>

                            <!-- 3D WebGL Canvas Container -->
                            <div class="hangar-canvas-container" id="aircraft-canvas-container">
                                <!-- WebGL Canvas rendered by Three.js -->
                            </div>

                            <div class="hangar-3d-hint">
                                <i class="fa-solid fa-arrows-spin"></i> ${isVi ? 'Kéo chuột / chạm xoay 360° • Cuộn để zoom' : 'Drag to rotate 360° • Scroll to zoom'}
                            </div>
                        </div>

                        <!-- Right / Bottom: Budget Controller Panel -->
                        <div class="hangar-budget-card">
                            <div>
                                <!-- Currency Selector -->
                                <div class="budget-section-group">
                                    <div class="budget-label-row">
                                        <label class="budget-label"><i class="fa-solid fa-coins" style="color:var(--hud-gold)"></i> ${isVi ? 'Đơn Vị Tiền Tệ:' : 'Currency:'}</label>
                                    </div>
                                    <div class="currency-selector-row">
                                        ${Object.keys(CURRENCIES).map(cur => `
                                            <button type="button" class="cur-chip-btn ${cur === state.selectedCurrency ? 'active' : ''}" data-currency="${cur}">
                                                ${CURRENCIES[cur].label}
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>

                                <!-- Numeric Input & USD Equivalent -->
                                <div class="budget-section-group">
                                    <div class="budget-label-row">
                                        <label class="budget-label" for="budget-num-input"><i class="fa-solid fa-wallet" style="color:var(--hud-cyan)"></i> ${isVi ? 'Ngân Sách Dự Kiến:' : 'Estimated Budget:'}</label>
                                        <span class="budget-usd-pill" id="budget-usd-pill">≈ $2,500 USD</span>
                                    </div>
                                    <div class="budget-input-wrapper">
                                        <input type="text" inputmode="numeric" id="budget-num-input" class="budget-num-input" value="${Number(state.currentAmount).toLocaleString('en-US')}" placeholder="5,000">
                                        <span class="budget-cur-sym" id="budget-cur-sym">$</span>
                                    </div>
                                </div>

                                <!-- Range Slider ($0 - $50,000 USD) -->
                                <div class="budget-section-group">
                                    <input type="range" 
                                           id="budget-range-input" 
                                           class="budget-range-input" 
                                           min="0" 
                                           max="${CURRENCIES[state.selectedCurrency].max}" 
                                           step="${CURRENCIES[state.selectedCurrency].step}" 
                                           value="${state.currentAmount}" />
                                    <div class="slider-extremes-row">
                                        <span>0 ${CURRENCIES[state.selectedCurrency].symbol}</span>
                                        <span>${formatCurrency(CURRENCIES[state.selectedCurrency].max, state.selectedCurrency)}</span>
                                    </div>
                                </div>

                                <!-- 5 Quick Presets ($500, $2500, $8000, $20000, $50000) -->
                                <div class="budget-section-group">
                                    <div class="budget-presets-bar">
                                        ${TIERS.map(t => `
                                            <button type="button" class="preset-stage-chip ${t.usd === 2500 ? 'active' : ''}" data-usd="${t.usd}">
                                                <strong>$${t.usd.toLocaleString()}</strong>
                                                <small>L${t.level}</small>
                                            </button>
                                        `).join('')}
                                    </div>
                                </div>

                                <!-- 3 Experience Tiers (Stay, Transit, Dining) -->
                                <div class="exp-perks-box">
                                    <div class="exp-perk-col">
                                        <strong><i class="fa-solid fa-hotel"></i> ${isVi ? 'Lưu Trú' : 'Stay'}</strong>
                                        <span id="exp-stay-text">${tier.perks.acc[state.currentLang]}</span>
                                    </div>
                                    <div class="exp-perk-col">
                                        <strong><i class="fa-solid fa-car"></i> ${isVi ? 'Đi Lại' : 'Transit'}</strong>
                                        <span id="exp-transit-text">${tier.perks.trans[state.currentLang]}</span>
                                    </div>
                                    <div class="exp-perk-col">
                                        <strong><i class="fa-solid fa-utensils"></i> ${isVi ? 'Ẩm Thực' : 'Dining'}</strong>
                                        <span id="exp-dining-text">${tier.perks.food[state.currentLang]}</span>
                                    </div>
                                </div>

                                <!-- Summary Corridor Pill -->
                                <div class="corridor-summary-pill">
                                    <div class="corridor-ports-wrap">
                                        <span id="summary-origin-badge">🇧🇪 Brussels (BRU)</span>
                                        <i class="fa-solid fa-plane"></i>
                                        <span id="summary-dest-badge">🇻🇳 Quy Nhơn (UIH)</span>
                                    </div>
                                    <div class="corridor-budget-wrap">
                                        <strong id="summary-amount-badge">$2,500 USD</strong>
                                    </div>
                                </div>
                            </div>

                            <div class="panel-action-footer">
                                <button type="button" class="btn-atlas-back" id="btn-back-to-step-2">
                                    <i class="fa-solid fa-arrow-left"></i>
                                    <span>${isVi ? 'Quay Lại' : 'Back'}</span>
                                </button>
                                <button type="button" class="btn-hangar-launch" id="btn-launch-ai-plan">
                                    <i class="fa-solid fa-paper-plane"></i>
                                    <span>${isVi ? 'XUẤT XƯỞNG & KHỞI HÀNH AI' : 'LAUNCH AI EXPEDITION'}</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        `;
    }

    // =========================================================================
    // 5. Event Listeners & Step Transitions
    // =========================================================================
    function bindEvents() {
        // SFX Audio Toggle
        const sfxBtn = document.getElementById('btn-atlas-sfx');
        if (sfxBtn) {
            sfxBtn.addEventListener('click', () => {
                const isEnabled = SFX.toggle();
                sfxBtn.classList.toggle('muted', !isEnabled);
                if (isEnabled) SFX.playBloop(540);
            });
        }

        // Top Navigation Tracker Pills
        document.querySelectorAll('.step-tracker-pill').forEach(pill => {
            pill.addEventListener('click', () => {
                const targetStage = parseInt(pill.getAttribute('data-stage'));
                setStage(targetStage);
                SFX.playClick();
            });
        });

        // Quick Country Chips
        document.querySelectorAll('.country-atlas-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const countryId = chip.getAttribute('data-country');
                updateCountrySelection(countryId, true);
                SFX.playChime();
            });
        });

        // Supported SVG Countries on Map
        document.querySelectorAll('.atlas-country-group').forEach(group => {
            group.addEventListener('click', () => {
                const countryId = group.getAttribute('data-country');
                if (countryId && COUNTRIES[countryId]) {
                    updateCountrySelection(countryId, true);
                    SFX.playChime();
                }
            });
        });

        // Non-Supported Countries (Shows Toast)
        document.querySelectorAll('.atlas-land-inactive-surface').forEach(land => {
            land.addEventListener('click', () => {
                const name = land.getAttribute('data-name') || 'Khu vực này';
                showTacticalToast(state.currentLang === 'vi' 
                    ? `Tọa độ ${name} chưa có chuyến bay trực tiếp đến Việt Nam.` 
                    : `Direct flights from ${name} are not currently charted.`);
                SFX.playBloop(320);
            });
        });

        // Map Toolbar Buttons (Zoom / Pan / Fullscreen)
        const btnZoomIn = document.getElementById('tool-zoom-in');
        const btnZoomOut = document.getElementById('tool-zoom-out');
        const btnZoomReset = document.getElementById('tool-zoom-reset');
        const btnFullscreen = document.getElementById('tool-map-fullscreen');

        if (btnZoomIn) {
            btnZoomIn.addEventListener('click', () => {
                if (typeof Globe3D !== 'undefined' && Globe3D.targetCamDistance) {
                    Globe3D.targetCamDistance = Math.max(16, Globe3D.targetCamDistance - 3);
                }
                state.mapZoom = Math.min(state.mapZoom + 0.25, 2.5);
                applyMapTransform();
                SFX.playClick();
            });
        }
        if (btnZoomOut) {
            btnZoomOut.addEventListener('click', () => {
                if (typeof Globe3D !== 'undefined' && Globe3D.targetCamDistance) {
                    Globe3D.targetCamDistance = Math.min(36, Globe3D.targetCamDistance + 3);
                }
                state.mapZoom = Math.max(state.mapZoom - 0.25, 0.85);
                applyMapTransform();
                SFX.playClick();
            });
        }
        if (btnZoomReset) {
            btnZoomReset.addEventListener('click', () => {
                if (typeof Globe3D !== 'undefined' && Globe3D.focusCountry) {
                    Globe3D.targetCamDistance = 24;
                    Globe3D.focusCountry(state.selectedCountry);
                }
                state.mapZoom = 1;
                state.mapPanX = 0;
                state.mapPanY = 0;
                applyMapTransform();
                SFX.playClick();
            });
        }
        if (btnFullscreen) {
            btnFullscreen.addEventListener('click', () => {
                const mapCard = document.getElementById('world-map-card');
                if (mapCard) {
                    mapCard.classList.toggle('fullscreen-mode');
                    setTimeout(() => {
                        window.dispatchEvent(new Event('resize'));
                    }, 120);
                }
                SFX.playClick();
            });
        }

        // SVG Drag / Touch Pan
        const mapViewport = document.getElementById('world-svg-viewport');
        if (mapViewport) {
            mapViewport.addEventListener('mousedown', (e) => {
                state.isPanning = true;
                state.panStartX = e.clientX - state.mapPanX;
                state.panStartY = e.clientY - state.mapPanY;
            });
            window.addEventListener('mousemove', (e) => {
                if (!state.isPanning) return;
                state.mapPanX = e.clientX - state.panStartX;
                state.mapPanY = e.clientY - state.panStartY;
                applyMapTransform();
            });
            window.addEventListener('mouseup', () => { state.isPanning = false; });
        }

        // Step 1: "CONFIRM DEPARTURE & CONTINUE"
        const btnConfirmDep = document.getElementById('btn-confirm-departure');
        if (btnConfirmDep) {
            btnConfirmDep.addEventListener('click', () => {
                setStage(2);
                SFX.playChime();
            });
        }

        // Step 2: Back Button to Step 1
        const btnBackStep1 = document.getElementById('btn-back-to-step-1');
        if (btnBackStep1) {
            btnBackStep1.addEventListener('click', () => {
                setStage(1);
                SFX.playClick();
            });
        }

        // Step 2: Destination Cards & Markers
        document.querySelectorAll('.dest-atlas-card').forEach(card => {
            card.addEventListener('click', () => {
                const destId = card.getAttribute('data-dest');
                updateDestinationSelection(destId);
                SFX.playChime();
            });
        });

        document.querySelectorAll('.vietnam-dest-marker').forEach(marker => {
            marker.addEventListener('click', (e) => {
                e.stopPropagation();
                const destId = marker.getAttribute('data-dest');
                updateDestinationSelection(destId);
                SFX.playChime();
            });
        });

        // Step 2: "CONFIRM DESTINATION & CONTINUE"
        const btnConfirmDest = document.getElementById('btn-confirm-destination');
        if (btnConfirmDest) {
            btnConfirmDest.addEventListener('click', () => {
                setStage(3);
                SFX.playChime();
            });
        }

        // Step 3: Back Button to Step 2
        const btnBackStep2 = document.getElementById('btn-back-to-step-2');
        if (btnBackStep2) {
            btnBackStep2.addEventListener('click', () => {
                setStage(2);
                SFX.playClick();
            });
        }

        // Step 3: Currency Switcher
        document.querySelectorAll('.cur-chip-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const code = btn.getAttribute('data-currency');
                setCurrency(code);
                SFX.playClick();
            });
        });

        // Step 3: Slider & Numeric Input Synchronization
        const slider = document.getElementById('budget-range-input');
        const numInput = document.getElementById('budget-num-input');

        if (slider && numInput) {
            slider.addEventListener('input', (e) => {
                const val = parseFloat(e.target.value) || 0;
                state.currentAmount = val;
                numInput.value = Math.round(val).toLocaleString('en-US');

                const cur = CURRENCIES[state.selectedCurrency] || CURRENCIES.USD;
                state.budgetUSD = Math.round(val / cur.rate);
                updateBudgetTier(state.budgetUSD, true);
            });

            numInput.addEventListener('input', (e) => {
                const cursorPosition = e.target.selectionStart;
                const originalLength = e.target.value.length;
                const cleanStr = e.target.value.replace(/[^0-9]/g, '');
                if (!cleanStr) {
                    e.target.value = '';
                    state.currentAmount = 0;
                    state.budgetUSD = 0;
                    slider.value = 0;
                    updateBudgetTier(0, true);
                    return;
                }
                let val = parseFloat(cleanStr) || 0;
                const max = CURRENCIES[state.selectedCurrency].max;
                if (val > max) val = max;
                if (val < 0) val = 0;

                state.currentAmount = val;
                slider.value = val;

                const cur = CURRENCIES[state.selectedCurrency] || CURRENCIES.USD;
                state.budgetUSD = Math.round(val / cur.rate);

                const formatted = Math.round(val).toLocaleString('en-US');
                e.target.value = formatted;
                const newLength = formatted.length;
                const newCursor = Math.max(0, cursorPosition + (newLength - originalLength));
                e.target.setSelectionRange(newCursor, newCursor);

                updateBudgetTier(state.budgetUSD, true);
            });

            numInput.addEventListener('blur', (e) => {
                const cleanStr = e.target.value.replace(/[^0-9]/g, '');
                const val = parseFloat(cleanStr) || 0;
                e.target.value = Math.round(val).toLocaleString('en-US');
            });
        }

        // Step 3: 5 Quick Presets ($500, $2500, $8000, $20000, $50000)
        document.querySelectorAll('.preset-stage-chip').forEach(chip => {
            chip.addEventListener('click', () => {
                const targetUsd = parseFloat(chip.getAttribute('data-usd'));
                state.budgetUSD = targetUsd;

                const cur = CURRENCIES[state.selectedCurrency] || CURRENCIES.USD;
                const converted = Math.round(targetUsd * cur.rate);
                state.currentAmount = converted;

                if (slider) slider.value = converted;
                if (numInput) numInput.value = Math.round(converted).toLocaleString('en-US');

                document.querySelectorAll('.preset-stage-chip').forEach(p => p.classList.remove('active'));
                chip.classList.add('active');

                updateBudgetTier(state.budgetUSD, true);
                SFX.playTurbineSpool();
            });
        });

        // Step 3: Grand Launch CTA
        const btnLaunch = document.getElementById('btn-launch-ai-plan');
        if (btnLaunch) {
            btnLaunch.addEventListener('click', () => {
                launchJourneyPlan();
            });
        }

        // Language Switch Reactivity
        window.addEventListener('appLanguageChanged', (e) => {
            const lang = e.detail && e.detail.lang ? e.detail.lang : 'vi';
            state.currentLang = lang;
            renderSkeleton(document.getElementById('game-booking-wizard-container'));
            bindEvents();
            setStage(state.currentStage);
            updateCountrySelection(state.selectedCountry, false);
            updateDestinationSelection(state.selectedDestination);
            updateBudgetTier(state.budgetUSD, false);
        });
    }

    function applyMapTransform() {
        const svg = document.getElementById('world-atlas-svg');
        if (svg) {
            svg.style.transform = `translate(${state.mapPanX}px, ${state.mapPanY}px) scale(${state.mapZoom})`;
        }
    }

    function showTacticalToast(msg) {
        const toast = document.getElementById('atlas-toast-banner');
        const text = document.getElementById('atlas-toast-text');
        if (toast && text) {
            text.textContent = msg;
            toast.classList.add('show');
            clearTimeout(toast._timer);
            toast._timer = setTimeout(() => {
                toast.classList.remove('show');
            }, 3200);
        }
    }

    // Set Stage (1, 2, 3)
    function setStage(stageNum) {
        state.currentStage = stageNum;

        // Progress Pills
        document.querySelectorAll('.step-tracker-pill').forEach(pill => {
            const num = parseInt(pill.getAttribute('data-stage'));
            pill.classList.toggle('active', num === stageNum);
            pill.classList.toggle('completed', num < stageNum);
        });

        const s1 = document.getElementById('stage-screen-departure');
        const s2 = document.getElementById('stage-screen-destination');
        const s3 = document.getElementById('stage-screen-budget');

        if (s1) s1.classList.toggle('active', stageNum === 1);
        if (s2) s2.classList.toggle('active', stageNum === 2);
        if (s3) s3.classList.toggle('active', stageNum === 3);

        if (stageNum === 1) {
            setTimeout(() => {
                if (typeof Globe3D !== 'undefined' && Globe3D.init) {
                    Globe3D.init('globe-3d-canvas-container');
                    Globe3D.focusCountry(state.selectedCountry);
                }
            }, 80);
        } else if (stageNum === 3) {
            setTimeout(() => {
                if (typeof Aircraft3D !== 'undefined' && Aircraft3D.init) {
                    Aircraft3D.init('aircraft-canvas-container');
                    Aircraft3D.updateTierUpgrades(state.budgetUSD);
                }
            }, 100);
        }
    }

    // Update Country Selection (Step 1)
    function updateCountrySelection(countryId, autoFocusAirport = true) {
        if (!COUNTRIES[countryId]) return;
        state.selectedCountry = countryId;
        const country = COUNTRIES[countryId];

        // Update 3D Globe
        if (typeof Globe3D !== 'undefined' && Globe3D.focusCountry) {
            Globe3D.focusCountry(countryId);
        }

        // Highlight Chips
        document.querySelectorAll('.country-atlas-chip').forEach(chip => {
            chip.classList.toggle('active', chip.getAttribute('data-country') === countryId);
        });

        // Highlight SVG Country
        document.querySelectorAll('.atlas-country-group').forEach(group => {
            group.classList.toggle('active', group.getAttribute('data-country') === countryId);
        });

        // Update Pin & Flight Arc
        const pin = document.getElementById('atlas-origin-pin');
        const arc = document.getElementById('atlas-flight-arc');
        const shadow = document.getElementById('atlas-flight-shadow');
        const marker = document.getElementById('atlas-plane-marker');

        if (pin && country.coords) {
            pin.setAttribute('transform', `translate(${country.coords.x}, ${country.coords.y})`);

            const destX = 740;
            const destY = 282;
            const midX = (country.coords.x + destX) / 2;
            const midY = Math.min(country.coords.y, destY) - 75; // Elevated parabolic arc

            if (arc) arc.setAttribute('d', `M ${country.coords.x},${country.coords.y} Q ${midX},${midY} ${destX},${destY}`);
            if (shadow) shadow.setAttribute('d', `M ${country.coords.x},${country.coords.y + 16} Q ${midX},${midY + 45} ${destX},${destY + 12}`);
            if (marker) marker.setAttribute('transform', `translate(${midX}, ${midY}) rotate(18)`);
        }

        // Update Info Card Banner
        const flagEl = document.getElementById('active-country-flag');
        const nameEl = document.getElementById('active-country-name');
        const contEl = document.getElementById('active-country-continent');
        if (flagEl) flagEl.textContent = country.flag;
        if (nameEl) nameEl.textContent = `${country.name[state.currentLang]} (${country.city[state.currentLang]})`;
        if (contEl) contEl.textContent = `${country.continent[state.currentLang]} • ${country.city[state.currentLang]}`;

        // Render Airports List
        const listEl = document.getElementById('departure-airports-list');
        if (listEl) {
            const hasApt = country.airports.some(a => a.code === state.selectedAirport);
            if (!hasApt) state.selectedAirport = country.airports[0].code;

            listEl.innerHTML = country.airports.map(apt => `
                <div class="airport-atlas-item ${apt.code === state.selectedAirport ? 'selected' : ''}" data-code="${apt.code}">
                    <div class="airport-item-left">
                        <span class="airport-iata-badge">${apt.code}</span>
                        <div class="airport-item-meta">
                            <strong>${apt.name}</strong>
                            <small>${apt.desc}</small>
                        </div>
                    </div>
                    <span class="airport-check-icon"><i class="fa-solid fa-check"></i></span>
                </div>
            `).join('');

            // Airport item click
            listEl.querySelectorAll('.airport-atlas-item').forEach(item => {
                item.addEventListener('click', () => {
                    listEl.querySelectorAll('.airport-atlas-item').forEach(i => i.classList.remove('selected'));
                    item.classList.add('selected');
                    state.selectedAirport = item.getAttribute('data-code');
                    SFX.playChime();
                    updateSummaryCorridor();
                });
            });
        }

        updateSummaryCorridor();
    }

    // Update Destination Selection (Step 2)
    function updateDestinationSelection(destId) {
        state.selectedDestination = destId;

        // Cards & Markers Active State
        document.querySelectorAll('.dest-atlas-card').forEach(c => {
            c.classList.toggle('selected', c.getAttribute('data-dest') === destId);
        });

        document.querySelectorAll('.vietnam-dest-marker').forEach(m => {
            m.classList.toggle('selected', m.getAttribute('data-dest') === destId);
        });

        updateSummaryCorridor();
    }

    // Set Currency
    function setCurrency(curKey) {
        if (!CURRENCIES[curKey]) return;
        state.selectedCurrency = curKey;
        const cur = CURRENCIES[curKey];

        document.querySelectorAll('.cur-chip-btn').forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-currency') === curKey);
        });

        state.currentAmount = Math.round(state.budgetUSD * cur.rate);

        const slider = document.getElementById('budget-range-input');
        const numInput = document.getElementById('budget-num-input');
        const symEl = document.getElementById('budget-cur-sym');

        if (slider) {
            slider.max = cur.max;
            slider.step = cur.step;
            slider.value = state.currentAmount;
        }
        if (numInput) {
            numInput.max = cur.max;
            numInput.step = cur.step;
            numInput.value = Math.round(state.currentAmount).toLocaleString('en-US');
        }
        if (symEl) symEl.textContent = cur.symbol;

        updateBudgetTier(state.budgetUSD, false);
    }

    // Update Budget Tier & Realistic 3D Aircraft
    function updateBudgetTier(usdVal, playSfx = true) {
        const tier = getTierForUSD(usdVal);

        // Update USD Pill
        const usdPill = document.getElementById('budget-usd-pill');
        if (usdPill) usdPill.textContent = `≈ $${Math.round(usdVal).toLocaleString()} USD`;

        // Update HUD in 3D Viewport
        const hudTier = document.getElementById('hud-tier-name');
        const hudModel = document.getElementById('hud-model-name');
        if (hudTier) hudTier.textContent = tier.tag;
        if (hudModel) hudModel.textContent = tier.modelName;

        // Takeoff Banner at $50,000
        const takeoffTag = document.getElementById('hangar-takeoff-tag');
        if (takeoffTag) {
            takeoffTag.classList.toggle('show', usdVal >= 50000);
        }

        // Perks
        const stayEl = document.getElementById('exp-stay-text');
        const transEl = document.getElementById('exp-transit-text');
        const dinEl = document.getElementById('exp-dining-text');
        if (stayEl) stayEl.textContent = tier.perks.acc[state.currentLang];
        if (transEl) transEl.textContent = tier.perks.trans[state.currentLang];
        if (dinEl) dinEl.textContent = tier.perks.food[state.currentLang];

        // Preset Chips
        document.querySelectorAll('.preset-stage-chip').forEach(chip => {
            const pUsd = parseFloat(chip.getAttribute('data-usd'));
            chip.classList.toggle('active', Math.abs(pUsd - usdVal) < 10);
        });

        // Update WebGL 3D Aircraft Model
        Aircraft3D.updateTierUpgrades(usdVal);

        updateSummaryCorridor();
    }

    // Update Summary Corridor Pill
    function updateSummaryCorridor() {
        const orgBadge = document.getElementById('summary-origin-badge');
        const destBadge = document.getElementById('summary-dest-badge');
        const amtBadge = document.getElementById('summary-amount-badge');

        const country = COUNTRIES[state.selectedCountry];
        const dest = DESTINATIONS.find(d => d.id === state.selectedDestination) || DESTINATIONS[0];

        if (orgBadge && country) {
            orgBadge.textContent = `${country.flag} ${country.name[state.currentLang]} (${state.selectedAirport})`;
        }
        if (destBadge && dest) {
            destBadge.textContent = `🇻🇳 ${dest.name[state.currentLang]} (${dest.airportCode})`;
        }
        if (amtBadge) {
            amtBadge.textContent = `${formatCurrency(state.currentAmount, state.selectedCurrency)} (≈ $${state.budgetUSD.toLocaleString()} USD)`;
        }
    }

    // Launch AI Journey Plan
    function launchJourneyPlan() {
        SFX.playTakeoff();

        // 3D Aircraft Takeoff Animation
        Aircraft3D.triggerTakeoffAnimation();

        // 1. Sync App state FIRST so onParametersChanged / generateJourneyPlan uses the user's selected budget
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

        // 2. Sync underlying form DOM
        const countrySelect = document.getElementById('country-select');
        const budgetSelect = document.getElementById('budget-select');
        const customBudgetInput = document.getElementById('custom-budget-input');
        const customBudgetContainer = document.getElementById('custom-budget-container');
        const destinationSelect = document.getElementById('destination-select');

        if (countrySelect) {
            countrySelect.value = state.selectedCountry;
        }

        if (budgetSelect && customBudgetInput) {
            const hasOption = Array.from(budgetSelect.options).some(o => o.value === String(state.budgetUSD));
            if (hasOption) {
                budgetSelect.value = String(state.budgetUSD);
                if (customBudgetContainer) customBudgetContainer.style.display = 'none';
            } else {
                budgetSelect.value = 'custom';
                if (customBudgetContainer) customBudgetContainer.style.display = 'block';
                customBudgetInput.value = state.budgetUSD.toLocaleString('en-US');
            }
        }

        if (destinationSelect) {
            destinationSelect.value = state.selectedDestination;
        }

        // Scroll to AI Assistant & generate
        setTimeout(() => {
            const aiCard = document.getElementById('ai-assistant-card');
            if (aiCard) {
                aiCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }

            if (window.App && typeof App.generateJourneyPlan === 'function') {
                App.generateJourneyPlan(true);
            } else {
                const form = document.getElementById('journey-planner-form');
                if (form) form.dispatchEvent(new Event('submit', { cancelable: true }));
            }
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
