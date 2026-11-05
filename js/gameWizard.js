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
    camDistance: 24,
    targetCamDistance: 24,

    AIRPORT_COORDS: {
        quynhon: { lat: 13.78, lon: 109.21, name: "Quy Nhơn", code: "UIH", flag: "🇻🇳" },
        belgium: { lat: 50.85, lon: 4.35, name: "Brussels", code: "BRU", flag: "🇧🇪" },
        usa: { lat: 37.62, lon: -122.38, name: "San Francisco", code: "SFO", flag: "🇺🇸" },
        uk: { lat: 51.47, lon: -0.45, name: "London", code: "LHR", flag: "🇬🇧" },
        france: { lat: 49.01, lon: 2.55, name: "Paris", code: "CDG", flag: "🇫🇷" },
        germany: { lat: 50.03, lon: 8.57, name: "Frankfurt", code: "FRA", flag: "🇩🇪" },
        china: { lat: 31.14, lon: 121.80, name: "Shanghai", code: "PVG", flag: "🇨🇳" },
        korea: { lat: 37.46, lon: 126.44, name: "Seoul", code: "ICN", flag: "🇰🇷" },
        japan: { lat: 35.54, lon: 139.78, name: "Tokyo", code: "HND", flag: "🇯🇵" },
        singapore: { lat: 1.36, lon: 103.99, name: "Singapore", code: "SIN", flag: "🇸🇬" },
        australia: { lat: -33.94, lon: 151.17, name: "Sydney", code: "SYD", flag: "🇦🇺" },
        vietnam: { lat: 21.03, lon: 105.85, name: "Hà Nội", code: "HAN", flag: "🇻🇳" }
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

    pointInPolygon(pt, poly) {
        let inside = false;
        for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
            const xi = poly[i][0], yi = poly[i][1];
            const xj = poly[j][0], yj = poly[j][1];
            const intersect = ((yi > pt[1]) !== (yj > pt[1]))
                && (pt[0] < (xj - xi) * (pt[1] - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        return inside;
    },

    init(containerId) {
        if (typeof document === 'undefined') return;
        const container = document.getElementById(containerId);
        if (!container || !window.THREE) return;
        this.container = container;

        if (this.renderer && this.renderer.domElement && container.contains(this.renderer.domElement)) {
            container.removeChild(this.renderer.domElement);
        }
        if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
        this.interactivePins = [];
        this.radarRings = [];

        const width = container.clientWidth || 600;
        const height = container.clientHeight || 480;

        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, this.camDistance);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        this.renderer.domElement.id = 'globe-webgl-canvas';
        container.appendChild(this.renderer.domElement);

        const ambient = new THREE.AmbientLight(0xffffff, 0.95);
        this.scene.add(ambient);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.4);
        sunLight.position.set(20, 20, 30);
        this.scene.add(sunLight);

        const cyanRim = new THREE.DirectionalLight(0x06b6d4, 1.2);
        cyanRim.position.set(-30, -10, 10);
        this.scene.add(cyanRim);

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

    createGlobeTexture() {
        if (typeof document === 'undefined') return null;
        const canvas = document.createElement('canvas');
        canvas.width = 2048;
        canvas.height = 1024;
        const ctx = canvas.getContext('2d');
        if (!ctx) return null;

        const grad = ctx.createLinearGradient(0, 0, 0, 1024);
        grad.addColorStop(0, '#030816');
        grad.addColorStop(0.5, '#07152f');
        grad.addColorStop(1, '#020612');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 2048, 1024);

        ctx.lineWidth = 1;
        ctx.strokeStyle = 'rgba(30, 58, 95, 0.45)';
        for (let lat = -80; lat <= 80; lat += 20) {
            const y = ((90 - lat) / 180) * 1024;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(2048, y);
            ctx.stroke();
        }
        for (let lon = -180; lon <= 180; lon += 30) {
            const x = ((lon + 180) / 360) * 2048;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, 1024);
            ctx.stroke();
        }

        ctx.strokeStyle = 'rgba(14, 165, 233, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(0, 512);
        ctx.lineTo(2048, 512);
        ctx.moveTo(1024, 0);
        ctx.lineTo(1024, 1024);
        ctx.stroke();

        const continents = [
            [[72, -168], [71, -155], [70, -135], [69, -115], [60, -90], [55, -80], [58, -65], [52, -55], [47, -53], [43, -65], [41, -70], [35, -75], [30, -81], [25, -80], [22, -87], [29, -95], [26, -97], [20, -105], [15, -93], [9, -79], [9, -83], [14, -92], [18, -103], [24, -110], [32, -117], [38, -123], [48, -125], [54, -130], [58, -136], [60, -145], [59, -153], [55, -163], [64, -166], [66, -168]],
            [[78, -20], [70, -22], [60, -43], [65, -53], [76, -68], [82, -35]],
            [[11, -75], [9, -60], [5, -52], [-3, -40], [-8, -35], [-18, -39], [-23, -43], [-32, -52], [-39, -62], [-53, -68], [-55, -71], [-45, -75], [-35, -72], [-18, -71], [-5, -81], [5, -77]],
            [[36, -6], [43, -9], [48, -5], [51, 2], [54, 8], [58, 12], [65, 23], [70, 28], [68, 44], [60, 50], [52, 40], [46, 38], [42, 28], [37, 24], [36, 15], [41, 9], [44, 8], [43, 3], [37, -2]],
            [[58, 6], [63, 5], [69, 15], [71, 26], [68, 30], [60, 20], [56, 12]],
            [[50, -5], [54, -3], [58, -5], [58, -2], [52, 1], [51, 1]],
            [[36, -5], [37, 10], [32, 13], [32, 25], [31, 32], [22, 37], [12, 44], [12, 51], [2, 45], [-5, 40], [-11, 40], [-17, 38], [-26, 33], [-34, 26], [-34, 18], [-28, 16], [-17, 12], [-5, 12], [4, 9], [5, 1], [4, -7], [11, -15], [15, -17], [21, -17], [28, -13], [32, -9]],
            [[-12, 49], [-16, 50], [-25, 47], [-25, 44], [-17, 44]],
            [[42, 28], [46, 38], [52, 40], [60, 50], [68, 44], [70, 70], [73, 80], [75, 100], [77, 105], [70, 135], [70, 160], [65, 175], [60, 165], [55, 155], [52, 142], [45, 135], [40, 128], [35, 129], [38, 120], [31, 122], [23, 117], [22, 114], [21, 108], [11, 109], [8, 105], [10, 100], [2, 102], [7, 98], [13, 100], [16, 96], [22, 91], [21, 87], [12, 80], [8, 77], [15, 74], [25, 68], [25, 60], [27, 51], [15, 52], [13, 45], [22, 38], [31, 35], [36, 36]],
            [[45, 142], [41, 140], [35, 140], [33, 131], [34, 136], [38, 141]],
            [[-6, 106], [-7, 114], [-8, 115], [-9, 120], [-8, 126], [-3, 128], [-1, 137], [-8, 141], [-6, 134], [2, 128], [1, 124], [0, 117], [4, 114], [1, 104], [-5, 105]],
            [[-11, 142], [-15, 145], [-24, 153], [-32, 153], [-38, 149], [-38, 140], [-35, 136], [-32, 132], [-34, 119], [-32, 116], [-22, 114], [-15, 124], [-15, 130], [-12, 136]],
            [[-35, 173], [-41, 175], [-46, 167], [-41, 172]]
        ];

        ctx.fillStyle = '#0f2747';
        ctx.strokeStyle = '#0284c7';
        ctx.lineWidth = 1.5;

        continents.forEach(poly => {
            ctx.beginPath();
            poly.forEach((pt, idx) => {
                const x = ((pt[1] + 180) / 360) * 2048;
                const y = ((90 - pt[0]) / 180) * 1024;
                if (idx === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            });
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
        });

        ctx.fillStyle = 'rgba(56, 189, 248, 0.75)';
        continents.forEach(poly => {
            let minX = 2048, maxX = 0, minY = 1024, maxY = 0;
            const pixelPoly = poly.map(pt => {
                const x = ((pt[1] + 180) / 360) * 2048;
                const y = ((90 - pt[0]) / 180) * 1024;
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                return [x, y];
            });

            for (let py = minY; py <= maxY; py += 12) {
                for (let px = minX; px <= maxX; px += 12) {
                    if (this.pointInPolygon([px, py], pixelPoly)) {
                        ctx.beginPath();
                        ctx.arc(px, py, 1.8, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }
        });

        Object.keys(this.AIRPORT_COORDS).forEach(key => {
            const item = this.AIRPORT_COORDS[key];
            const cx = ((item.lon + 180) / 360) * 2048;
            const cy = ((90 - item.lat) / 180) * 1024;

            const haloGrad = ctx.createRadialGradient(cx, cy, 2, cx, cy, 24);
            haloGrad.addColorStop(0, key === 'quynhon' ? 'rgba(245, 158, 11, 0.9)' : 'rgba(14, 165, 233, 0.8)');
            haloGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = haloGrad;
            ctx.beginPath();
            ctx.arc(cx, cy, 24, 0, Math.PI * 2);
            ctx.fill();
        });

        return new THREE.CanvasTexture(canvas);
    },

    buildGlobe() {
        this.globeGroup = new THREE.Group();

        const texture = this.createGlobeTexture();
        const sphereGeo = new THREE.SphereGeometry(9, 64, 64);
        const sphereMat = new THREE.MeshStandardMaterial({
            map: texture,
            roughness: 0.55,
            metalness: 0.35
        });
        this.globeMesh = new THREE.Mesh(sphereGeo, sphereMat);
        this.globeGroup.add(this.globeMesh);

        const atmoGeo = new THREE.SphereGeometry(9.35, 48, 48);
        const atmoMat = new THREE.MeshBasicMaterial({
            color: 0x06b6d4,
            transparent: true,
            opacity: 0.16,
            side: THREE.BackSide,
            blending: THREE.AdditiveBlending
        });
        this.atmosphereMesh = new THREE.Mesh(atmoGeo, atmoMat);
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

            const shaftGeo = new THREE.CylinderGeometry(0.04, 0.08, 0.75, 8);
            const shaftMat = new THREE.MeshBasicMaterial({ color: isQuyNhon ? 0xf59e0b : 0x06b6d4 });
            const shaft = new THREE.Mesh(shaftGeo, shaftMat);
            shaft.position.y = 0.38;
            pin.add(shaft);

            const headGeo = isQuyNhon ? new THREE.OctahedronGeometry(0.35, 0) : new THREE.SphereGeometry(0.2, 16, 16);
            const headMat = new THREE.MeshBasicMaterial({ color: isQuyNhon ? 0xfbbf24 : 0x38bdf8 });
            const head = new THREE.Mesh(headGeo, headMat);
            head.position.y = 0.85;
            pin.add(head);

            const ringGeo = new THREE.RingGeometry(0.2, 0.42, 24);
            ringGeo.rotateX(-Math.PI / 2);
            const ringMat = new THREE.MeshBasicMaterial({
                color: isQuyNhon ? 0xf59e0b : 0x06b6d4,
                transparent: true,
                opacity: 0.75,
                side: THREE.DoubleSide
            });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.position.y = 0.02;
            pin.add(ring);
            this.radarRings.push(ring);

            const hitGeo = new THREE.SphereGeometry(0.9, 8, 8);
            const hitMat = new THREE.MeshBasicMaterial({ visible: false });
            const hit = new THREE.Mesh(hitGeo, hitMat);
            hit.position.y = 0.5;
            hit.userData = { countryId: key };
            pin.add(hit);
            this.interactivePins.push(hit);

            this.pinsGroup.add(pin);
        });
    },

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
        const tubeGeo = new THREE.TubeGeometry(curve, 64, 0.08, 8, false);
        const tubeMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
        const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
        this.arcGroup.add(tubeMesh);

        const pulseGeo = new THREE.SphereGeometry(0.24, 16, 16);
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

        this.updateFlightArc(countryKey);
    },

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
                }
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
            this.targetCamDistance = Math.max(16, Math.min(36, this.targetCamDistance));
        }, { passive: false });
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

    buildAircraftModular() {
        this.aircraftRootGroup = new THREE.Group();
        this.aircraftRootGroup.position.set(0, 0, 0);

        this.materials.fuselage = new THREE.MeshStandardMaterial({
            color: 0xf8fafc,
            roughness: 0.22,
            metalness: 0.45
        });

        this.materials.cockpitGlass = new THREE.MeshStandardMaterial({
            color: 0x0ea5e9,
            roughness: 0.05,
            metalness: 0.95,
            opacity: 0.88,
            transparent: true
        });

        this.materials.chrome = new THREE.MeshStandardMaterial({
            color: 0xf1f5f9,
            roughness: 0.08,
            metalness: 0.94
        });

        this.materials.fanBlades = new THREE.MeshStandardMaterial({
            color: 0x334155,
            roughness: 0.22,
            metalness: 0.85
        });

        this.materials.liveryCyan = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            roughness: 0.28,
            metalness: 0.6
        });

        this.materials.liveryGold = new THREE.MeshStandardMaterial({
            color: 0xf59e0b,
            roughness: 0.22,
            metalness: 0.82
        });

        this.materials.cabinWindows = new THREE.MeshStandardMaterial({
            color: 0xffedd5,
            emissive: 0xf59e0b,
            emissiveIntensity: 0.0
        });

        this.materials.afterburnerCore = new THREE.MeshBasicMaterial({
            color: 0x22d3ee,
            transparent: true,
            opacity: 0.88
        });

        this.materials.afterburnerPlume = new THREE.MeshBasicMaterial({
            color: 0xf97316,
            transparent: true,
            opacity: 0.65
        });

        // 1. Fuselage
        const fuselageGroup = new THREE.Group();
        const bodyGeo = new THREE.CylinderGeometry(1.35, 1.35, 11, 32);
        bodyGeo.rotateX(Math.PI / 2);
        const bodyMesh = new THREE.Mesh(bodyGeo, this.materials.fuselage);
        bodyMesh.castShadow = true;
        bodyMesh.receiveShadow = true;
        fuselageGroup.add(bodyMesh);

        const noseGeo = new THREE.ConeGeometry(1.35, 3.8, 32);
        noseGeo.rotateX(Math.PI / 2);
        const noseMesh = new THREE.Mesh(noseGeo, this.materials.fuselage);
        noseMesh.position.set(0, 0, 7.4);
        noseMesh.castShadow = true;
        fuselageGroup.add(noseMesh);

        const canopyGeo = new THREE.BoxGeometry(1.65, 0.82, 2.8);
        const canopyMesh = new THREE.Mesh(canopyGeo, this.materials.cockpitGlass);
        canopyMesh.position.set(0, 0.95, 5.0);
        canopyMesh.rotation.x = -0.28;
        fuselageGroup.add(canopyMesh);

        const pitotGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.8, 12);
        pitotGeo.rotateX(Math.PI / 2);
        const pitotMesh = new THREE.Mesh(pitotGeo, this.materials.chrome);
        pitotMesh.position.set(0, 0, 9.6);
        fuselageGroup.add(pitotMesh);

        const tailConeGeo = new THREE.ConeGeometry(1.35, 4.2, 32);
        tailConeGeo.rotateX(-Math.PI / 2);
        const tailConeMesh = new THREE.Mesh(tailConeGeo, this.materials.fuselage);
        tailConeMesh.position.set(0, 0.15, -7.6);
        tailConeMesh.castShadow = true;
        fuselageGroup.add(tailConeMesh);

        // Landing gear
        const gearMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.4, metalness: 0.8 });
        const tireMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.9, metalness: 0.1 });
        const createGearLeg = (xPos, zPos) => {
            const leg = new THREE.Group();
            leg.position.set(xPos, -1.35, zPos);
            const strutGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.25, 12);
            const strut = new THREE.Mesh(strutGeo, gearMat);
            strut.position.y = -0.62;
            leg.add(strut);
            [-0.18, 0.18].forEach(wX => {
                const wheelGeo = new THREE.CylinderGeometry(0.24, 0.24, 0.14, 16);
                wheelGeo.rotateZ(Math.PI / 2);
                const wheel = new THREE.Mesh(wheelGeo, tireMat);
                wheel.position.set(wX, -1.22, 0);
                leg.add(wheel);
            });
            return leg;
        };
        fuselageGroup.add(createGearLeg(0, 5.6));
        fuselageGroup.add(createGearLeg(-2.6, -0.6));
        fuselageGroup.add(createGearLeg(2.6, -0.6));
        this.aircraftRootGroup.add(fuselageGroup);

        // 2. Wings
        const wingsGroup = new THREE.Group();
        const wingExtrudeOpts = { depth: 0.28, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.06, bevelThickness: 0.06 };

        const leftWingShape = new THREE.Shape();
        leftWingShape.moveTo(0, 0);
        leftWingShape.lineTo(-12.5, -4.2);
        leftWingShape.lineTo(-12.0, -5.8);
        leftWingShape.lineTo(0, -3.2);
        leftWingShape.closePath();
        const leftWingGeo = new THREE.ExtrudeGeometry(leftWingShape, wingExtrudeOpts);
        leftWingGeo.rotateX(Math.PI / 2);
        const leftWingMesh = new THREE.Mesh(leftWingGeo, this.materials.fuselage);
        leftWingMesh.position.set(-1.2, -0.15, 1.0);
        leftWingMesh.rotation.z = -0.035;
        leftWingMesh.castShadow = true;
        wingsGroup.add(leftWingMesh);

        const rightWingShape = new THREE.Shape();
        rightWingShape.moveTo(0, 0);
        rightWingShape.lineTo(12.5, -4.2);
        rightWingShape.lineTo(12.0, -5.8);
        rightWingShape.lineTo(0, -3.2);
        rightWingShape.closePath();
        const rightWingGeo = new THREE.ExtrudeGeometry(rightWingShape, wingExtrudeOpts);
        rightWingGeo.rotateX(Math.PI / 2);
        const rightWingMesh = new THREE.Mesh(rightWingGeo, this.materials.fuselage);
        rightWingMesh.position.set(1.2, -0.15, 1.0);
        rightWingMesh.rotation.z = 0.035;
        rightWingMesh.castShadow = true;
        wingsGroup.add(rightWingMesh);
        this.aircraftRootGroup.add(wingsGroup);

        // 3. Engines
        const enginesGroup = new THREE.Group();
        const createEngineAssembly = (isLeft) => {
            const eng = new THREE.Group();
            const xOff = isLeft ? -4.8 : 4.8;
            eng.position.set(xOff, -1.3, 0.2);

            const nacelleGeo = new THREE.CylinderGeometry(0.85, 0.8, 3.4, 28);
            nacelleGeo.rotateX(Math.PI / 2);
            const nacelle = new THREE.Mesh(nacelleGeo, this.materials.fuselage);
            nacelle.castShadow = true;
            eng.add(nacelle);

            const lipGeo = new THREE.TorusGeometry(0.82, 0.08, 16, 28);
            const lip = new THREE.Mesh(lipGeo, this.materials.chrome);
            lip.position.set(0, 0, 1.7);
            eng.add(lip);

            const spinnerGeo = new THREE.ConeGeometry(0.24, 0.65, 16);
            spinnerGeo.rotateX(Math.PI / 2);
            const spinner = new THREE.Mesh(spinnerGeo, this.materials.chrome);
            spinner.position.set(0, 0, 1.4);
            eng.add(spinner);

            const fanDisc = new THREE.Group();
            fanDisc.position.set(0, 0, 1.35);
            for (let i = 0; i < 14; i++) {
                const bladeGeo = new THREE.BoxGeometry(0.08, 0.62, 0.04);
                const blade = new THREE.Mesh(bladeGeo, this.materials.fanBlades);
                blade.rotation.z = (i / 14) * Math.PI * 2;
                blade.position.set(Math.cos(blade.rotation.z) * 0.38, Math.sin(blade.rotation.z) * 0.38, 0);
                blade.rotation.y = 0.25;
                fanDisc.add(blade);
            }
            eng.add(fanDisc);
            this.rotatingFanDiscs.push(fanDisc);

            const pylonGeo = new THREE.BoxGeometry(0.18, 0.75, 2.0);
            const pylon = new THREE.Mesh(pylonGeo, this.materials.fuselage);
            pylon.position.set(0, 0.65, -0.2);
            eng.add(pylon);

            const nozzleGeo = new THREE.CylinderGeometry(0.6, 0.68, 0.6, 24);
            nozzleGeo.rotateX(Math.PI / 2);
            const nozzle = new THREE.Mesh(nozzleGeo, this.materials.chrome);
            nozzle.position.set(0, 0, -1.8);
            eng.add(nozzle);

            const glowGeo = new THREE.TorusGeometry(0.52, 0.06, 12, 24);
            const glow = new THREE.Mesh(glowGeo, this.materials.afterburnerCore);
            glow.position.set(0, 0, -1.85);
            eng.add(glow);

            return eng;
        };
        enginesGroup.add(createEngineAssembly(true));
        enginesGroup.add(createEngineAssembly(false));
        this.aircraftRootGroup.add(enginesGroup);

        // 4. Details (Fin, Horizontal Tail, Windows)
        const detailsGroup = new THREE.Group();
        const finShape = new THREE.Shape();
        finShape.moveTo(0, 0);
        finShape.lineTo(3.2, 4.6);
        finShape.lineTo(4.4, 4.6);
        finShape.lineTo(4.0, 0);
        finShape.closePath();
        const finGeo = new THREE.ExtrudeGeometry(finShape, { depth: 0.24, bevelEnabled: true, bevelSegments: 2, bevelSize: 0.04 });
        finGeo.rotateY(Math.PI / 2);
        finGeo.translate(-0.12, 0, 0);
        const finMesh = new THREE.Mesh(finGeo, this.materials.fuselage);
        finMesh.position.set(0, 1.35, -4.6);
        finMesh.castShadow = true;
        detailsGroup.add(finMesh);

        const finLiveryGeo = new THREE.BoxGeometry(0.26, 0.6, 1.4);
        const finLivery = new THREE.Mesh(finLiveryGeo, this.materials.liveryCyan);
        finLivery.position.set(0, 4.6, -7.8);
        detailsGroup.add(finLivery);

        const tailStrobe = new THREE.PointLight(0xffffff, 4, 14);
        tailStrobe.position.set(0, 6.0, -7.8);
        detailsGroup.add(tailStrobe);
        this.strobeLights.push(tailStrobe);

        const hTailLeftShape = new THREE.Shape();
        hTailLeftShape.moveTo(0, 0);
        hTailLeftShape.lineTo(-4.2, -1.8);
        hTailLeftShape.lineTo(-3.8, -2.6);
        hTailLeftShape.lineTo(0, -1.4);
        hTailLeftShape.closePath();
        const hTailLeftGeo = new THREE.ExtrudeGeometry(hTailLeftShape, { depth: 0.16, bevelEnabled: true, bevelSize: 0.03 });
        hTailLeftGeo.rotateX(Math.PI / 2);
        const hTailLeftMesh = new THREE.Mesh(hTailLeftGeo, this.materials.fuselage);
        hTailLeftMesh.position.set(-0.8, 0.5, -7.6);
        detailsGroup.add(hTailLeftMesh);

        const hTailRightShape = new THREE.Shape();
        hTailRightShape.moveTo(0, 0);
        hTailRightShape.lineTo(4.2, -1.8);
        hTailRightShape.lineTo(3.8, -2.6);
        hTailRightShape.lineTo(0, -1.4);
        hTailRightShape.closePath();
        const hTailRightGeo = new THREE.ExtrudeGeometry(hTailRightShape, { depth: 0.16, bevelEnabled: true, bevelSize: 0.03 });
        hTailRightGeo.rotateX(Math.PI / 2);
        const hTailRightMesh = new THREE.Mesh(hTailRightGeo, this.materials.fuselage);
        hTailRightMesh.position.set(0.8, 0.5, -7.6);
        detailsGroup.add(hTailRightMesh);

        this.cabinWindowsGroup = new THREE.Group();
        for (let z = -3.8; z <= 3.2; z += 0.85) {
            const winGeo = new THREE.BoxGeometry(0.08, 0.18, 0.32);
            const winL = new THREE.Mesh(winGeo, this.materials.cabinWindows);
            winL.position.set(-1.36, 0.35, z);
            this.cabinWindowsGroup.add(winL);
            const winR = new THREE.Mesh(winGeo, this.materials.cabinWindows);
            winR.position.set(1.36, 0.35, z);
            this.cabinWindowsGroup.add(winR);
        }
        detailsGroup.add(this.cabinWindowsGroup);
        this.aircraftRootGroup.add(detailsGroup);

        // 5. Upgrades
        const upgradeGroup = new THREE.Group();
        this.wingletsGroup = new THREE.Group();
        const createWinglet = (isLeft) => {
            const wGeo = new THREE.BoxGeometry(0.16, 1.8, 0.85);
            const wMesh = new THREE.Mesh(wGeo, this.materials.liveryCyan);
            const xOff = isLeft ? -13.5 : 13.5;
            wMesh.position.set(xOff, 0.8, -4.0);
            wMesh.rotation.z = isLeft ? 0.15 : -0.15;
            return wMesh;
        };
        this.wingletsGroup.add(createWinglet(true));
        this.wingletsGroup.add(createWinglet(false));
        upgradeGroup.add(this.wingletsGroup);

        this.liveryGroup = new THREE.Group();
        [-1.38, 1.38].forEach(xSide => {
            const stripeGeo = new THREE.BoxGeometry(0.04, 0.12, 8.5);
            const stripe = new THREE.Mesh(stripeGeo, this.materials.liveryGold);
            stripe.position.set(xSide, 0.1, -0.5);
            this.liveryGroup.add(stripe);
        });
        upgradeGroup.add(this.liveryGroup);

        this.afterburnersGroup = new THREE.Group();
        const createAfterburnerPlume = (xPos) => {
            const ab = new THREE.Group();
            ab.position.set(xPos, -1.3, -2.0);
            const coreGeo = new THREE.ConeGeometry(0.35, 2.5, 16);
            coreGeo.rotateX(-Math.PI / 2);
            const core = new THREE.Mesh(coreGeo, this.materials.afterburnerCore);
            core.position.set(0, 0, -1.25);
            ab.add(core);
            const plumeGeo = new THREE.ConeGeometry(0.55, 3.8, 16);
            plumeGeo.rotateX(-Math.PI / 2);
            const plume = new THREE.Mesh(plumeGeo, this.materials.afterburnerPlume);
            plume.position.set(0, 0, -1.9);
            ab.add(plume);
            return ab;
        };
        this.afterburnersGroup.add(createAfterburnerPlume(-4.8));
        this.afterburnersGroup.add(createAfterburnerPlume(4.8));
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

        if (usd >= 50000) {
            this.targets.wingletsScale = 1.0;
            this.targets.cabinEmissive = 1.0;
            this.targets.aircraftPitch = -0.06;
            this.targets.afterburnerScale = 1.0;
            this.targets.platformLedColor = 0xfbbf24;
            if (this.materials.fuselage) {
                this.materials.fuselage.metalness = 0.92;
                this.materials.fuselage.roughness = 0.08;
                this.materials.fuselage.color.setHex(0xffffff);
            }
        } else if (usd >= 20000) {
            this.targets.wingletsScale = 1.0;
            this.targets.cabinEmissive = 1.0;
            this.targets.aircraftPitch = 0;
            this.targets.afterburnerScale = 0;
            this.targets.platformLedColor = 0xf59e0b;
            if (this.materials.fuselage) {
                this.materials.fuselage.metalness = 0.75;
                this.materials.fuselage.roughness = 0.16;
                this.materials.fuselage.color.setHex(0xf8fafc);
            }
        } else if (usd >= 8000) {
            this.targets.wingletsScale = 0;
            this.targets.cabinEmissive = 1.0;
            this.targets.aircraftPitch = 0;
            this.targets.afterburnerScale = 0;
            this.targets.platformLedColor = 0x10b981;
            if (this.materials.fuselage) {
                this.materials.fuselage.metalness = 0.55;
                this.materials.fuselage.roughness = 0.22;
                this.materials.fuselage.color.setHex(0xf8fafc);
            }
        } else if (usd >= 2500) {
            this.targets.wingletsScale = 0;
            this.targets.cabinEmissive = 0.0;
            this.targets.aircraftPitch = 0;
            this.targets.afterburnerScale = 0;
            this.targets.platformLedColor = 0x3b82f6;
            if (this.materials.fuselage) {
                this.materials.fuselage.metalness = 0.42;
                this.materials.fuselage.roughness = 0.26;
                this.materials.fuselage.color.setHex(0xf8fafc);
            }
        } else {
            this.targets.wingletsScale = 0;
            this.targets.cabinEmissive = 0.0;
            this.targets.aircraftPitch = 0;
            this.targets.afterburnerScale = 0;
            this.targets.platformLedColor = 0x06b6d4;
            if (this.materials.fuselage) {
                this.materials.fuselage.metalness = 0.35;
                this.materials.fuselage.roughness = 0.32;
                this.materials.fuselage.color.setHex(0xf8fafc);
            }
        }

        if (this.liveryGroup) {
            this.liveryGroup.visible = usd >= 20000;
        }
    },

    animate() {
        this.animFrameId = requestAnimationFrame(() => this.animate());
        const lerpRate = 0.08;

        if (this.wingletsGroup) {
            const curWScale = this.wingletsGroup.scale.x;
            const nextWScale = THREE.MathUtils.lerp(curWScale, this.targets.wingletsScale, lerpRate);
            this.wingletsGroup.scale.set(nextWScale, nextWScale, nextWScale);
            this.wingletsGroup.visible = nextWScale > 0.05;
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
                this.afterburnersGroup.scale.set(baseScale, baseScale, baseScale * 1.3);
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

            this.aircraftRootGroup.position.z = -easeProgress * 50;
            this.aircraftRootGroup.position.y = easeProgress * 15;
            this.aircraftRootGroup.rotation.x = -0.22 - easeProgress * 0.15;

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
