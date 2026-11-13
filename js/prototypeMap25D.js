/**
 * Quy Nhon AI Travel Assistant - 2.5D Illustrated World Map Prototype (PixiJS v7.4.2)
 * 
 * Features:
 * - High-performance WebGL 2D rendering via PixiJS.
 * - Shaded Relief / Natural Earth texture base with deep navy ocean background.
 * - 234 countries vector polygon rendering from WORLD_MAP_DATA.
 * - 11 verified supported departure hubs with glowing gold borders (#ffd700).
 * - 223 non-supported countries rendered subtly with disabled non-clickable status.
 * - Country Hover tooltip & highlight effects.
 * - Autocomplete Search with smooth camera interpolation (Lerp).
 * - Animated Great-Circle Flight Corridor (Quadratic Bezier) to Quy Nhon (UIH).
 * - Smooth Drag Pan & Pinch/Wheel Zoom with bounds clamping.
 * - Responsive Desktop (60/40) & Mobile (50vh) layouts.
 */

(function () {
    'use strict';

    // 1. Definition of the EXACT 11 Supported Departure Countries
    const SUPPORTED_COUNTRIES = {
        BEL: {
            id: "belgium", name: "Belgium", vi: "Bỉ", flag: "🇧🇪", code: "BEL",
            coords: [4.35, 50.85],
            airports: [{
                code: "BRU",
                name: "Brussels Airport",
                city: "Brussels",
                desc: { en: "International gateway to the capital of Brussels (BRU)", vi: "Cửa ngõ hàng không quốc tế thủ đô Brussels (BRU)" }
            }]
        },
        FRA: {
            id: "france", name: "France", vi: "Pháp", flag: "🇫🇷", code: "FRA",
            coords: [2.35, 48.85],
            airports: [
                { code: "CDG", name: "Paris Charles de Gaulle", city: "Paris", desc: { en: "Largest intercontinental hub in France (CDG)", vi: "Cửa ngõ liên lục địa lớn nhất Pháp (CDG)" } },
                { code: "ORY", name: "Paris Orly Airport", city: "Paris", desc: { en: "Paris Orly International Airport (ORY)", vi: "Sân bay quốc tế Paris Orly (ORY)" } },
                { code: "NCE", name: "Nice Côte d'Azur", city: "Nice", desc: { en: "Southern Mediterranean coastal gateway (NCE)", vi: "Cửa ngõ miền Nam Địa Trung Hải (NCE)" } }
            ]
        },
        DEU: {
            id: "germany", name: "Germany", vi: "Đức", flag: "🇩🇪", code: "DEU",
            coords: [8.68, 50.11],
            airports: [
                { code: "FRA", name: "Frankfurt Airport", city: "Frankfurt", desc: { en: "European aviation transit mega-hub (FRA)", vi: "Trung tâm trung chuyển hàng không Châu Âu (FRA)" } },
                { code: "MUC", name: "Munich Airport", city: "Munich", desc: { en: "5-star Bavarian international hub (MUC)", vi: "Sân bay 5 sao trung tâm Bayern (MUC)" } },
                { code: "BER", name: "Berlin Brandenburg", city: "Berlin", desc: { en: "Capital gateway airport of Germany (BER)", vi: "Sân bay quốc tế thủ đô Berlin (BER)" } }
            ]
        },
        USA: {
            id: "usa", name: "United States", vi: "Hoa Kỳ", flag: "🇺🇸", code: "USA",
            coords: [-98.57, 39.82],
            airports: [
                { code: "SFO", name: "San Francisco International", city: "San Francisco", desc: { en: "West Coast gateway connecting directly to Vietnam (SFO)", vi: "Cửa ngõ Bờ Tây kết nối Việt Nam (SFO)" } },
                { code: "LAX", name: "Los Angeles International", city: "Los Angeles", desc: { en: "Southern California primary aviation hub (LAX)", vi: "Trung tâm hàng không lớn nhất Nam California (LAX)" } },
                { code: "JFK", name: "New York John F. Kennedy", city: "New York", desc: { en: "Largest East Coast international gateway (JFK)", vi: "Cửa ngõ Bờ Đông quốc tế lớn nhất Mỹ (JFK)" } },
                { code: "ORD", name: "Chicago O'Hare", city: "Chicago", desc: { en: "Major Midwest cross-continental hub (ORD)", vi: "Trung tâm trung chuyển xuyên lục địa (ORD)" } }
            ]
        },
        JPN: {
            id: "japan", name: "Japan", vi: "Nhật Bản", flag: "🇯🇵", code: "JPN",
            coords: [139.69, 35.68],
            airports: [
                { code: "HND", name: "Tokyo Haneda Airport", city: "Tokyo", desc: { en: "Downtown Tokyo 5-star international hub (HND)", vi: "Sân bay nội đô Tokyo 5 sao quốc tế (HND)" } },
                { code: "NRT", name: "Tokyo Narita Airport", city: "Tokyo", desc: { en: "Major intercontinental hub of Japan (NRT)", vi: "Cửa ngõ liên lục địa lớn nhất Nhật Bản (NRT)" } },
                { code: "KIX", name: "Osaka Kansai Airport", city: "Osaka", desc: { en: "Offshore Kansai international airport (KIX)", vi: "Sân bay quốc tế trên đảo nhân tạo Kansai (KIX)" } }
            ]
        },
        AUS: {
            id: "australia", name: "Australia", vi: "Úc", flag: "🇦🇺", code: "AUS",
            coords: [133.77, -25.27],
            airports: [
                { code: "SYD", name: "Sydney Kingsford Smith", city: "Sydney", desc: { en: "Direct corridor connecting Australia to Vietnam (SYD)", vi: "Cửa ngõ bay thẳng kết nối Việt Nam (SYD)" } },
                { code: "MEL", name: "Melbourne Airport", city: "Melbourne", desc: { en: "Cultural hub airport of Victoria (MEL)", vi: "Trung tâm văn hóa nghệ thuật Victoria (MEL)" } },
                { code: "BNE", name: "Brisbane Airport", city: "Brisbane", desc: { en: "Queensland East Coast gateway (BNE)", vi: "Sân bay bờ Đông bang Queensland (BNE)" } }
            ]
        },
        GBR: {
            id: "uk", name: "United Kingdom", vi: "Vương Quốc Anh", flag: "🇬🇧", code: "GBR",
            coords: [-1.17, 52.35],
            airports: [
                { code: "LHR", name: "London Heathrow", city: "London", desc: { en: "Direct connection hub London - Hanoi (LHR)", vi: "Trung tâm bay thẳng London - Hà Nội (LHR)" } },
                { code: "MAN", name: "Manchester Airport", city: "Manchester", desc: { en: "Northern England international gateway (MAN)", vi: "Cửa ngõ miền Bắc nước Anh (MAN)" } }
            ]
        },
        KOR: {
            id: "korea", name: "South Korea", vi: "Hàn Quốc", flag: "🇰🇷", code: "KOR",
            coords: [127.76, 35.90],
            airports: [
                { code: "ICN", name: "Seoul Incheon Airport", city: "Seoul", desc: { en: "5-star Incheon hub with direct flights to Vietnam (ICN)", vi: "Sân bay 5 sao Incheon - Bay thẳng tới Việt Nam (ICN)" } },
                { code: "PUS", name: "Busan Gimhae Airport", city: "Busan", desc: { en: "Port city international gateway of Busan (PUS)", vi: "Sân bay quốc tế thành phố cảng Busan (PUS)" } }
            ]
        },
        SGP: {
            id: "singapore", name: "Singapore", vi: "Singapore", flag: "🇸🇬", code: "SGP",
            coords: [103.81, 1.35],
            airports: [
                { code: "SIN", name: "Singapore Changi Airport", city: "Singapore", desc: { en: "World-leading Singapore Changi hub (SIN)", vi: "Sân bay tốt nhất thế giới Changi (SIN)" } }
            ]
        },
        CHN: {
            id: "china", name: "China", vi: "Trung Quốc", flag: "🇨🇳", code: "CHN",
            coords: [104.19, 35.86],
            airports: [
                { code: "PVG", name: "Shanghai Pudong Airport", city: "Shanghai", desc: { en: "Shanghai international gateway (PVG)", vi: "Cửa ngõ quốc tế Thượng Hải (PVG)" } },
                { code: "PEK", name: "Beijing Capital Airport", city: "Beijing", desc: { en: "Beijing Capital International Airport (PEK)", vi: "Sân bay thủ đô Bắc Kinh (PEK)" } }
            ]
        },
        VNM: {
            id: "vietnam", name: "Vietnam", vi: "Việt Nam (Nội địa)", flag: "🇻🇳", code: "VNM",
            coords: [105.85, 21.02],
            airports: [
                { 
                    code: "HAN", 
                    name: { en: "Noi Bai International Airport", vi: "Sân bay Quốc tế Nội Bài" }, 
                    city: { en: "Hanoi", vi: "Hà Nội" }, 
                    desc: { en: "Direct connection to Phu Cat Airport (UIH)", vi: "Đường bay thẳng tới Sân bay Phù Cát (UIH)" } 
                },
                { 
                    code: "SGN", 
                    name: { en: "Tan Son Nhat International Airport", vi: "Sân bay Quốc tế Tân Sơn Nhất" }, 
                    city: { en: "Ho Chi Minh City", vi: "TP. Hồ Chí Minh" }, 
                    desc: { en: "Direct connection to Phu Cat Airport (UIH)", vi: "Đường bay thẳng tới Sân bay Phù Cát (UIH)" } 
                }
            ]
        }
    };

    // 2. Definition of Selectable Vietnam Destination Airports (Phu Cat Airport UIH - Quy Nhon)
    const VIETNAM_DESTINATIONS = {
        UIH: {
            code: "UIH",
            name: { en: "Phu Cat Airport", vi: "Sân bay Phù Cát" },
            city: { en: "Quy Nhon", vi: "Quy Nhơn" },
            title: { en: "Quy Nhon – Emerald Coastal Pearl", vi: "Quy Nhơn – Biển Ngọc Miền Trung" },
            badge: { en: "HERO BEACON • MAIN QUEST", vi: "ĐIỂM ĐẾN TRỌNG TÂM" },
            coords: [109.0433, 13.9556],
            isHero: true,
            desc: { en: "Direct gateway to Ky Co beach, Eo Gio & Cham towers", vi: "Cửa ngõ trực tiếp tới biển Kỳ Co, Eo Gió & tháp Chàm Bình Định" }
        }
    };

    // Quy Nhơn Destination Coordinates (Phù Cát Airport UIH)
    const QUY_NHON_COORDS = [109.0433, 13.9556]; // [lon, lat]

    // Equirectangular Map Dimensions
    const BASE_MAP_WIDTH = 4096;
    const BASE_MAP_HEIGHT = 2048;

    class Map25DPrototype {
        constructor(containerEl, options = {}) {
            this.container = containerEl;
            this.options = options;

            // PixiJS Application
            this.app = null;
            this.mapContainer = null;
            this.bgSprite = null;
            this.countriesLayer = null;
            this.islandsLayer = null;
            this.highlightLayer = null;
            this.flightLayer = null;
            this.beaconsLayer = null;

            // State
            this.selectedCountryCode = 'DEU'; // Default Germany per mockup
            this.selectedAirportCode = 'FRA';
            this.selectedDestinationCode = 'UIH'; // Default Quy Nhon
            this.selectedOriginCoords = SUPPORTED_COUNTRIES['DEU'].coords;
            this.selectedDestCoords = QUY_NHON_COORDS;
            this.destinationsMode = false;
            this.hoveredCountry = null;
            this.flightAnimProgress = 0;
            this.fpsCounter = { frames: 0, lastTime: performance.now(), currentFps: 60 };

            // Camera Viewport & Pan/Zoom
            this.camera = {
                x: 0,
                y: 0,
                scale: 1,
                targetX: 0,
                targetY: 0,
                targetScale: 1,
                minScale: 0.3,
                maxScale: 4.5,
                isDragging: false,
                lastDragX: 0,
                lastDragY: 0
            };

            // Country Graphics dictionary
            this.countryGraphicsMap = new Map();

            // Initialize
            window.__prototypeMapInstance = this;
            this.init();
        }

        async init() {
            const width = this.container.clientWidth || 800;
            const height = this.container.clientHeight || 600;

            // Create Pixi Application with high performance settings
            this.app = new PIXI.Application({
                width: width,
                height: height,
                backgroundColor: 0x071526, // Deep ocean base
                resolution: Math.min(window.devicePixelRatio || 1, 2),
                autoDensity: true,
                antialias: true,
                powerPreference: 'high-performance'
            });

            this.container.appendChild(this.app.view);
            this.app.view.style.width = '100%';
            this.app.view.style.height = '100%';
            this.app.view.style.display = 'block';

            // Root Map Container for pan and zoom
            this.mapContainer = new PIXI.Container();
            this.mapContainer.interactive = true;
            this.app.stage.addChild(this.mapContainer);

            // Layer Hierarchy
            this.bgLayer = new PIXI.Container();
            this.countriesLayer = new PIXI.Container();
            this.islandsLayer = new PIXI.Container();
            this.highlightLayer = new PIXI.Container();
            this.flightLayer = new PIXI.Container();
            this.beaconsLayer = new PIXI.Container();

            this.mapContainer.addChild(this.bgLayer);
            this.mapContainer.addChild(this.countriesLayer);
            this.mapContainer.addChild(this.islandsLayer);
            this.mapContainer.addChild(this.highlightLayer);
            this.mapContainer.addChild(this.flightLayer);
            this.mapContainer.addChild(this.beaconsLayer);

            // 1. Build Background Terrain (Using Blue Marble / Relief)
            await this.loadBackgroundTerrain();

            // 2. Render Vector Boundaries for 234 Countries
            this.renderCountries();

            // 3. Render Illustrated Vietnamese Archipelagos (Hoang Sa & Truong Sa)
            this.renderVietnameseArchipelagos();

            // 4. Render Quy Nhon Hero Beacon
            this.renderQuyNhonBeacon();

            // 5. Setup Input Interactions (Pan & Zoom)
            this.setupInteractions();

            // 5. Select default country and center view
            this.selectCountry(this.selectedCountryCode, false);

            // 6. Start Main Animation Ticker
            this.app.ticker.add(this.update.bind(this));

            // Setup Resize Listener
            window.addEventListener('resize', this.onResize.bind(this));

            console.info('[Map25D] Initialized successfully. Total countries rendered:', this.countryGraphicsMap.size);
            if (this.options.onReady) this.options.onReady(this);
        }

        // Coordinate Projection: Equirectangular WGS84 -> PixiJS Canvas
        project(lon, lat) {
            const x = ((lon + 180) / 360) * BASE_MAP_WIDTH;
            const y = ((90 - lat) / 180) * BASE_MAP_HEIGHT;
            return { x, y };
        }

        unproject(x, y) {
            const lon = (x / BASE_MAP_WIDTH) * 360 - 180;
            const lat = 90 - (y / BASE_MAP_HEIGHT) * 180;
            return { lon, lat };
        }

        async loadBackgroundTerrain() {
            try {
                const texture = await PIXI.Texture.fromURL('assets/earth-blue-marble.jpg');
                this.bgSprite = new PIXI.Sprite(texture);
                this.bgSprite.width = BASE_MAP_WIDTH;
                this.bgSprite.height = BASE_MAP_HEIGHT;
                
                // Add soft ocean overlay to match game map styling
                const oceanOverlay = new PIXI.Graphics();
                oceanOverlay.beginFill(0x06182c, 0.28);
                oceanOverlay.drawRect(0, 0, BASE_MAP_WIDTH, BASE_MAP_HEIGHT);
                oceanOverlay.endFill();

                this.bgLayer.addChild(this.bgSprite);
                this.bgLayer.addChild(oceanOverlay);
            } catch (err) {
                console.warn('[Map25D] Failed to load texture, generating fallback ocean:', err);
                const ocean = new PIXI.Graphics();
                ocean.beginFill(0x081e36);
                ocean.drawRect(0, 0, BASE_MAP_WIDTH, BASE_MAP_HEIGHT);
                ocean.endFill();
                this.bgLayer.addChild(ocean);
            }
        }

        renderCountries() {
            if (!window.WORLD_MAP_DATA || !window.WORLD_MAP_DATA.countries) {
                console.error('[Map25D] WORLD_MAP_DATA not found!');
                return;
            }

            const countries = window.WORLD_MAP_DATA.countries;

            countries.forEach(country => {
                const isSupported = Boolean(SUPPORTED_COUNTRIES[country.id]);
                const g = new PIXI.Graphics();
                g.eventMode = 'static';
                g.cursor = isSupported ? 'pointer' : 'default';

                // Store metadata
                g.countryData = country;
                g.isSupported = isSupported;
                g.countryId = country.id;

                // Draw Polygon Rings
                this.drawCountryShape(g, country, isSupported, false);

                // Event Listeners for Interaction
                g.on('pointerover', (e) => this.onCountryHover(country, isSupported, e));
                g.on('pointerout', (e) => this.onCountryOut(country, isSupported, e));
                g.on('pointertap', (e) => this.onCountryClick(country, isSupported, e));

                this.countriesLayer.addChild(g);
                this.countryGraphicsMap.set(country.id, g);
            });
        }

        drawCountryShape(graphics, country, isSupported, isHovered, isSelected = false) {
            graphics.clear();

            // Stylings based on specification:
            // - Supported: Glowing gold stroke (#ffd700), transparent fill
            // - Non-supported: Subtle slate-blue stroke, dark semi-transparent fill, non-clickable
            // - Hover: Luminous golden bloom
            let strokeColor = 0x6e8ca8;
            let strokeAlpha = 0.35;
            let strokeWidth = 0.75;
            let fillColor = 0x081728;
            let fillAlpha = 0.40; // Soft dim on non-supported

            if (isSupported) {
                if (isSelected) {
                    strokeColor = 0xffeb3b;
                    strokeAlpha = 1.0;
                    strokeWidth = 3.0;
                    fillColor = 0xffd54f;
                    fillAlpha = 0.35;
                } else if (isHovered) {
                    strokeColor = 0xfff176;
                    strokeAlpha = 0.95;
                    strokeWidth = 2.5;
                    fillColor = 0xffca28;
                    fillAlpha = 0.25;
                } else {
                    strokeColor = 0xffd700; // Gold
                    strokeAlpha = 0.85;
                    strokeWidth = 1.75;
                    fillColor = 0xffffff;
                    fillAlpha = 0.02; // Transparent to reveal relief
                }
            } else if (isHovered) {
                strokeColor = 0x90caf9;
                strokeAlpha = 0.6;
                strokeWidth = 1.2;
                fillColor = 0x1e3a5f;
                fillAlpha = 0.45;
            }

            graphics.lineStyle(strokeWidth, strokeColor, strokeAlpha);

            country.rings.forEach(ring => {
                if (!ring || ring.length < 3) return;

                graphics.beginFill(fillColor, fillAlpha);
                for (let i = 0; i < ring.length; i++) {
                    const [lon, lat] = ring[i];
                    const pt = this.project(lon, lat);
                    if (i === 0) {
                        graphics.moveTo(pt.x, pt.y);
                    } else {
                        graphics.lineTo(pt.x, pt.y);
                    }
                }
                graphics.closePath();
                graphics.endFill();
            });
        }

        renderQuyNhonBeacon() {
            this.beaconsLayer.removeChildren();

            const pt = this.project(QUY_NHON_COORDS[0], QUY_NHON_COORDS[1]);

            // Outer Pulsing Radar Ring
            const pulse = new PIXI.Graphics();
            pulse.lineStyle(2, 0xffd700, 0.8);
            pulse.drawCircle(0, 0, 16);
            pulse.position.set(pt.x, pt.y);
            this.beaconsLayer.addChild(pulse);
            this.radarPulse = pulse;

            // Core Glow Pin
            const isSelected = (this.selectedDestinationCode === 'UIH');
            const core = new PIXI.Graphics();
            core.position.set(pt.x, pt.y);
            core.beginFill(0xffa000, 0.5);
            core.drawCircle(0, 0, isSelected ? 10 : 8);
            core.endFill();
            core.beginFill(0xffd700, 1.0);
            core.drawCircle(0, 0, isSelected ? 5 : 4);
            core.endFill();
            core.eventMode = 'static';
            core.cursor = 'pointer';
            core.on('pointertap', () => {
                this.selectDestination('UIH');
                if (this.options.onDestinationSelect) {
                    this.options.onDestinationSelect(VIETNAM_DESTINATIONS['UIH']);
                }
            });
            core.on('pointerover', (e) => {
                if (this.options.onDestinationHover) {
                    this.options.onDestinationHover(VIETNAM_DESTINATIONS['UIH'], e);
                }
            });
            core.on('pointerout', () => {
                if (this.options.onDestinationHoverOut) {
                    this.options.onDestinationHoverOut();
                }
            });
            this.beaconsLayer.addChild(core);

            // Text Label
            const isVi = (typeof window !== 'undefined' && window.App && window.App.getState) ? window.App.getState().currentLang === 'vi' : false;
            const text = new PIXI.Text(isVi ? '⭐ QUY NHƠN (UIH)' : '⭐ QUY NHON (UIH)', {
                fontFamily: 'Inter, sans-serif',
                fontSize: 13,
                fontWeight: 'bold',
                fill: 0xfff9c4,
                dropShadow: true,
                dropShadowColor: 0x000000,
                dropShadowBlur: 4,
                dropShadowDistance: 1
            });
            text.x = pt.x + 12;
            text.y = pt.y - 8;
            this.beaconsLayer.addChild(text);
        }

        renderVietnamDestinations() {
            this.renderQuyNhonBeacon();

            // Render other 4 Vietnam airports as stylish glowing beacon pins
            Object.values(VIETNAM_DESTINATIONS).forEach(dest => {
                if (dest.code === 'UIH') return; // Rendered with Hero Radar

                const pt = this.project(dest.coords[0], dest.coords[1]);
                const container = new PIXI.Container();
                container.position.set(pt.x, pt.y);
                container.eventMode = 'static';
                container.cursor = 'pointer';

                const isSelected = (dest.code === this.selectedDestinationCode);
                const dot = new PIXI.Graphics();
                dot.beginFill(isSelected ? 0xffeb3b : 0x00e5ff, isSelected ? 0.45 : 0.25);
                dot.drawCircle(0, 0, isSelected ? 9 : 6);
                dot.endFill();
                dot.beginFill(isSelected ? 0xffd700 : 0x80d8ff, 1.0);
                dot.drawCircle(0, 0, isSelected ? 4.5 : 3);
                dot.endFill();
                container.addChild(dot);

                const label = new PIXI.Text(dest.code, {
                    fontFamily: 'Inter, sans-serif',
                    fontSize: 11,
                    fontWeight: isSelected ? 'bold' : '600',
                    fill: isSelected ? 0xfff9c4 : 0xbbdefb,
                    dropShadow: true,
                    dropShadowColor: 0x000000,
                    dropShadowBlur: 3
                });
                label.x = 8;
                label.y = -6;
                container.addChild(label);

                container.on('pointertap', () => {
                    this.selectDestination(dest.code);
                    if (this.options.onDestinationSelect) {
                        this.options.onDestinationSelect(dest);
                    }
                });
                container.on('pointerover', (e) => {
                    if (this.options.onDestinationHover) {
                        this.options.onDestinationHover(dest, e);
                    }
                });
                container.on('pointerout', () => {
                    if (this.options.onDestinationHoverOut) {
                        this.options.onDestinationHoverOut();
                    }
                });

                this.beaconsLayer.addChild(container);
            });
        }

        selectDestination(destCode) {
            if (!VIETNAM_DESTINATIONS[destCode]) return;
            this.selectedDestinationCode = destCode;
            const dest = VIETNAM_DESTINATIONS[destCode];
            this.selectedDestCoords = dest.coords;

            const originCoords = this.selectedOriginCoords || (SUPPORTED_COUNTRIES[this.selectedCountryCode] ? SUPPORTED_COUNTRIES[this.selectedCountryCode].coords : [8.68, 50.11]);
            this.drawFlightCorridor(originCoords, dest.coords);

            this.renderVietnamDestinations();
        }

        flyToVietnam() {
            this.destinationsMode = true;
            this.renderVietnamDestinations();
            const pt = this.project(108.5, 15.5);
            const viewW = this.app.screen.width;
            const viewH = this.app.screen.height;
            const targetScale = 2.4;

            this.camera.targetScale = targetScale;
            this.camera.targetX = viewW / 2 - pt.x * targetScale;
            this.camera.targetY = viewH / 2 - pt.y * targetScale;
        }

        flyToWorld() {
            this.destinationsMode = false;
            this.renderQuyNhonBeacon();
            this.resetView();
        }

        renderVietnameseArchipelagos() {
            if (!this.islandsLayer) return;
            this.islandsLayer.removeChildren();

            // Natural irregular polygon templates for realistic island shapes (no circles/markers)
            const NATURAL_ISLAND_SHAPES = {
                elongated: [
                    [-3.6, -0.9], [-1.8, -1.6], [1.4, -1.3], [3.8, -0.4],
                    [3.6, 0.8], [1.2, 1.4], [-2.0, 1.1], [-3.4, 0.4]
                ],
                broad: [
                    [-2.8, -2.4], [0.6, -3.0], [3.2, -1.8], [3.6, 1.2],
                    [1.8, 3.0], [-1.4, 2.8], [-3.2, 1.0], [-3.4, -1.2]
                ],
                crescent: [
                    [-3.2, -1.8], [-0.5, -2.4], [2.8, -1.4], [3.4, 0.6],
                    [1.8, 1.2], [-0.8, 0.2], [-2.8, 0.8]
                ],
                compact: [
                    [-2.2, -1.6], [0.5, -2.2], [2.4, -0.8],
                    [2.0, 1.6], [-0.8, 2.0], [-2.4, 0.6]
                ],
                atollStrip: [
                    [-4.5, -0.6], [-2.0, -1.2], [1.5, -0.8], [4.5, -0.2],
                    [4.2, 0.7], [1.8, 0.9], [-1.5, 0.8], [-4.2, 0.5]
                ]
            };

            // Illustrated data for Hoang Sa (Paracel Islands)
            const hoangSaIslands = [
                { name: "Đảo Tri Tôn", coords: [111.20, 15.78], shape: "elongated", scale: 1.1, angle: 0.35 },
                { name: "Đảo Hoàng Sa", coords: [111.60, 16.53], shape: "crescent", scale: 1.15, angle: -0.25 },
                { name: "Đảo Hữu Nhật", coords: [111.58, 16.51], shape: "compact", scale: 0.85, angle: 0.4 },
                { name: "Đảo Quang Hòa", coords: [111.71, 16.45], shape: "broad", scale: 1.05, angle: 0.15 },
                { name: "Đảo Duy Mộng", coords: [111.74, 16.46], shape: "compact", scale: 0.8, angle: -0.5 },
                { name: "Đảo Bạch Quy", coords: [111.55, 16.35], shape: "compact", scale: 0.85, angle: 0.6 },
                { name: "Đảo Phú Lâm", coords: [112.33, 16.83], shape: "broad", scale: 1.35, angle: 0.2 },
                { name: "Đảo Cây", coords: [112.27, 16.88], shape: "compact", scale: 0.9, angle: -0.3 },
                { name: "Đảo Linh Côn", coords: [112.73, 16.66], shape: "broad", scale: 1.1, angle: 0.5 },
                { name: "Cồn Cát Bắc", coords: [112.31, 16.96], shape: "elongated", scale: 0.75, angle: -0.1 }
            ];

            // Illustrated data for Truong Sa (Spratly Islands)
            const truongSaIslands = [
                { name: "Đảo Song Tử Tây", coords: [114.33, 11.43], shape: "crescent", scale: 1.1, angle: 0.2 },
                { name: "Đảo Song Tử Đông", coords: [114.36, 11.45], shape: "compact", scale: 0.9, angle: -0.4 },
                { name: "Đảo Thị Tứ", coords: [114.28, 11.05], shape: "broad", scale: 1.15, angle: 0.3 },
                { name: "Đảo Loại Ta", coords: [114.42, 10.70], shape: "compact", scale: 0.95, angle: -0.2 },
                { name: "Đảo Nam Yết", coords: [114.36, 10.18], shape: "elongated", scale: 1.2, angle: 0.4 },
                { name: "Đảo Sơn Ca", coords: [114.47, 10.38], shape: "compact", scale: 1.0, angle: -0.3 },
                { name: "Đảo Sinh Tồn", coords: [114.32, 9.88], shape: "broad", scale: 1.1, angle: 0.15 },
                { name: "Đảo Sinh Tồn Đông", coords: [114.53, 9.90], shape: "compact", scale: 0.85, angle: -0.5 },
                { name: "Đảo Cô Lin / Len Đao", coords: [114.23, 9.83], shape: "compact", scale: 0.8, angle: 0.2 },
                { name: "Đảo Trường Sa Lớn", coords: [111.92, 8.64], shape: "broad", scale: 1.4, angle: 0.5 },
                { name: "Đá Lát", coords: [111.67, 8.67], shape: "compact", scale: 0.85, angle: -0.3 },
                { name: "Đá Tây", coords: [112.35, 8.86], shape: "elongated", scale: 1.05, angle: 0.2 },
                { name: "Đảo Phan Vinh", coords: [113.70, 8.97], shape: "broad", scale: 1.1, angle: -0.4 },
                { name: "Đảo Tiên Nữ", coords: [114.65, 8.85], shape: "crescent", scale: 1.0, angle: 0.3 },
                { name: "Đá Thuyền Chài", coords: [113.25, 8.17], shape: "atollStrip", scale: 1.35, angle: 0.65 },
                { name: "Đảo An Bang", coords: [112.90, 7.89], shape: "elongated", scale: 1.05, angle: -0.2 }
            ];

            const drawNaturalIsland = (graphics, isle) => {
                const pt = this.project(isle.coords[0], isle.coords[1]);
                const baseShape = NATURAL_ISLAND_SHAPES[isle.shape] || NATURAL_ISLAND_SHAPES.compact;
                const scale = isle.scale || 1.0;
                const rot = isle.angle || 0;
                const cos = Math.cos(rot);
                const sin = Math.sin(rot);

                const getTransformedPoints = (s) => {
                    return baseShape.map(([bx, by]) => {
                        const sx = bx * s;
                        const sy = by * s;
                        return {
                            x: pt.x + (sx * cos - sy * sin),
                            y: pt.y + (sx * sin + sy * cos)
                        };
                    });
                };

                // 1. Natural Sand/Coral Shoreline Fringe (viền cát san hô tự nhiên)
                const beachPts = getTransformedPoints(scale);
                graphics.lineStyle(0.65, 0xc2a677, 0.85);
                graphics.beginFill(0xd4c297, 0.90);
                beachPts.forEach((p, idx) => {
                    if (idx === 0) graphics.moveTo(p.x, p.y);
                    else graphics.lineTo(p.x, p.y);
                });
                graphics.closePath();
                graphics.endFill();

                // 2. Vegetated Island Landmass Core (lõi đất và cây xanh tự nhiên)
                const corePts = getTransformedPoints(scale * 0.78);
                graphics.lineStyle(0);
                graphics.beginFill(0x3e5e38, 0.95);
                corePts.forEach((p, idx) => {
                    if (idx === 0) graphics.moveTo(p.x, p.y);
                    else graphics.lineTo(p.x, p.y);
                });
                graphics.closePath();
                graphics.endFill();
            };

            // 1. Setup Hoang Sa Cluster
            const hsCluster = new PIXI.Container();
            hsCluster.eventMode = 'static';
            hsCluster.cursor = 'pointer';

            // Invisible interactive buffer (Hit area covering Hoang Sa region)
            const hsNW = this.project(110.8, 17.6);
            const hsSE = this.project(113.2, 15.4);
            const hsHitArea = new PIXI.Graphics();
            hsHitArea.beginFill(0xffffff, 0.001);
            hsHitArea.drawRect(hsNW.x, hsNW.y, hsSE.x - hsNW.x, hsSE.y - hsNW.y);
            hsHitArea.endFill();
            hsCluster.addChild(hsHitArea);

            // Natural Island Polygons for Hoang Sa
            const hsGraphics = new PIXI.Graphics();
            hoangSaIslands.forEach(isle => drawNaturalIsland(hsGraphics, isle));
            hsCluster.addChild(hsGraphics);

            // Hoang Sa Pill Label (Hidden by default)
            const hsCenter = this.project(111.9, 17.35);
            const hsLabel = new PIXI.Container();
            hsLabel.position.set(hsCenter.x, hsCenter.y);
            hsLabel.visible = false;
            hsLabel.eventMode = 'none';

            const hsText = new PIXI.Text("Hoàng Sa", {
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: "700",
                fill: 0xfff9c4,
                dropShadow: true,
                dropShadowColor: 0x051322,
                dropShadowBlur: 4,
                dropShadowDistance: 1,
                align: "center"
            });
            hsText.resolution = 2;
            hsText.anchor.set(0.5, 0.5);

            const hsPillW = hsText.width + 18;
            const hsPillH = hsText.height + 6;
            const hsPill = new PIXI.Graphics();
            hsPill.lineStyle(1, 0xffd700, 0.55);
            hsPill.beginFill(0x071b30, 0.88);
            hsPill.drawRoundedRect(-hsPillW / 2, -hsPillH / 2, hsPillW, hsPillH, 6);
            hsPill.endFill();

            hsLabel.addChild(hsPill);
            hsLabel.addChild(hsText);
            hsCluster.addChild(hsLabel);
            this.hoangSaLabel = hsLabel;
            this.hoangSaCluster = hsCluster;

            // 2. Setup Truong Sa Cluster
            const tsCluster = new PIXI.Container();
            tsCluster.eventMode = 'static';
            tsCluster.cursor = 'pointer';

            // Invisible interactive buffer (Hit area covering Truong Sa region)
            const tsNW = this.project(111.4, 11.8);
            const tsSE = this.project(115.0, 7.6);
            const tsHitArea = new PIXI.Graphics();
            tsHitArea.beginFill(0xffffff, 0.001);
            tsHitArea.drawRect(tsNW.x, tsNW.y, tsSE.x - tsNW.x, tsSE.y - tsNW.y);
            tsHitArea.endFill();
            tsCluster.addChild(tsHitArea);

            // Natural Island Polygons for Truong Sa
            const tsGraphics = new PIXI.Graphics();
            truongSaIslands.forEach(isle => drawNaturalIsland(tsGraphics, isle));
            tsCluster.addChild(tsGraphics);

            // Truong Sa Pill Label (Hidden by default)
            const tsCenter = this.project(113.3, 9.4);
            const tsLabel = new PIXI.Container();
            tsLabel.position.set(tsCenter.x, tsCenter.y);
            tsLabel.visible = false;
            tsLabel.eventMode = 'none';

            const tsText = new PIXI.Text("Trường Sa", {
                fontFamily: "Inter, sans-serif",
                fontSize: 13,
                fontWeight: "700",
                fill: 0xfff9c4,
                dropShadow: true,
                dropShadowColor: 0x051322,
                dropShadowBlur: 4,
                dropShadowDistance: 1,
                align: "center"
            });
            tsText.resolution = 2;
            tsText.anchor.set(0.5, 0.5);

            const tsPillW = tsText.width + 18;
            const tsPillH = tsText.height + 6;
            const tsPill = new PIXI.Graphics();
            tsPill.lineStyle(1, 0xffd700, 0.55);
            tsPill.beginFill(0x071b30, 0.88);
            tsPill.drawRoundedRect(-tsPillW / 2, -tsPillH / 2, tsPillW, tsPillH, 6);
            tsPill.endFill();

            tsLabel.addChild(tsPill);
            tsLabel.addChild(tsText);
            tsCluster.addChild(tsLabel);
            this.truongSaLabel = tsLabel;
            this.truongSaCluster = tsCluster;

            // Add clusters to islands layer
            this.islandsLayer.addChild(hsCluster);
            this.islandsLayer.addChild(tsCluster);

            // Interaction Listeners (Desktop Hover & Mobile/Touch Tap)
            hsCluster.on('pointerover', (e) => {
                if (e.pointerType !== 'touch') {
                    hsLabel.visible = true;
                }
            });
            hsCluster.on('pointerout', (e) => {
                if (e.pointerType !== 'touch' && this.selectedIslandCluster !== 'HS') {
                    hsLabel.visible = false;
                }
            });
            hsCluster.on('pointertap', (e) => {
                this.islandTapped = true;
                if (this.selectedIslandCluster === 'HS') {
                    hsLabel.visible = !hsLabel.visible;
                    if (!hsLabel.visible) this.selectedIslandCluster = null;
                } else {
                    this.selectedIslandCluster = 'HS';
                    hsLabel.visible = true;
                    tsLabel.visible = false;
                }
            });

            tsCluster.on('pointerover', (e) => {
                if (e.pointerType !== 'touch') {
                    tsLabel.visible = true;
                }
            });
            tsCluster.on('pointerout', (e) => {
                if (e.pointerType !== 'touch' && this.selectedIslandCluster !== 'TS') {
                    tsLabel.visible = false;
                }
            });
            tsCluster.on('pointertap', (e) => {
                this.islandTapped = true;
                if (this.selectedIslandCluster === 'TS') {
                    tsLabel.visible = !tsLabel.visible;
                    if (!tsLabel.visible) this.selectedIslandCluster = null;
                } else {
                    this.selectedIslandCluster = 'TS';
                    tsLabel.visible = true;
                    hsLabel.visible = false;
                }
            });
        }

        hideArchipelagoLabels() {
            this.selectedIslandCluster = null;
            if (this.hoangSaLabel) this.hoangSaLabel.visible = false;
            if (this.truongSaLabel) this.truongSaLabel.visible = false;
        }

        // Draw Great-Circle Bezier Flight Corridor from departure to Vietnam destination
        drawFlightCorridor(startLonLat, endLonLat = null) {
            this.flightLayer.removeChildren();

            this.selectedOriginCoords = startLonLat;
            if (endLonLat) {
                this.selectedDestCoords = endLonLat;
            } else if (!this.selectedDestCoords) {
                this.selectedDestCoords = QUY_NHON_COORDS;
            }

            const p0 = this.project(startLonLat[0], startLonLat[1]);
            const p2 = this.project(this.selectedDestCoords[0], this.selectedDestCoords[1]);

            // Midpoint and Control Point
            const midX = (p0.x + p2.x) / 2;
            const midY = (p0.y + p2.y) / 2;
            const dx = p2.x - p0.x;
            const dy = p2.y - p0.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Curve upward/northward based on distance
            const curveOffset = Math.min(dist * 0.28, 220);
            const p1 = { x: midX, y: midY - curveOffset };

            // 1. Draw Flight Arc Path
            const arcGraphics = new PIXI.Graphics();
            arcGraphics.lineStyle(2, 0xffd54f, 0.75);

            const steps = 60;
            const points = [];
            for (let i = 0; i <= steps; i++) {
                const t = i / steps;
                // Quadratic Bezier Formula: B(t) = (1-t)^2 * P0 + 2(1-t)t * P1 + t^2 * P2
                const bx = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
                const by = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
                points.push({ x: bx, y: by });
                if (i === 0) arcGraphics.moveTo(bx, by);
                else arcGraphics.lineTo(bx, by);
            }
            this.flightLayer.addChild(arcGraphics);

            // Store flight points for airplane animation
            this.flightPoints = points;
            this.flightP0 = p0;
            this.flightP1 = p1;
            this.flightP2 = p2;

            // 2. Animated Plane Sprite / Indicator
            const planeGraphics = new PIXI.Graphics();
            planeGraphics.beginFill(0xffffff);
            // Draw sleek mini commercial jet shape
            planeGraphics.moveTo(8, 0);
            planeGraphics.lineTo(-6, -5);
            planeGraphics.lineTo(-3, 0);
            planeGraphics.lineTo(-6, 5);
            planeGraphics.closePath();
            planeGraphics.endFill();

            this.flightPlane = planeGraphics;
            this.flightLayer.addChild(planeGraphics);

            // 3. Departure Marker Pin
            const depPin = new PIXI.Graphics();
            depPin.beginFill(0xffeb3b, 1.0);
            depPin.drawCircle(p0.x, p0.y, 5);
            depPin.endFill();
            depPin.lineStyle(1.5, 0xffd700, 0.8);
            depPin.drawCircle(p0.x, p0.y, 10);
            this.flightLayer.addChild(depPin);
        }

        onCountryHover(country, isSupported, event) {
            this.hoveredCountry = country;
            const g = this.countryGraphicsMap.get(country.id);
            if (g) {
                const isSelected = (country.id === this.selectedCountryCode);
                this.drawCountryShape(g, country, isSupported, true, isSelected);
            }

            if (this.options.onHover) {
                this.options.onHover(country, isSupported, event);
            }
        }

        onCountryOut(country, isSupported, event) {
            if (this.hoveredCountry === country) this.hoveredCountry = null;
            const g = this.countryGraphicsMap.get(country.id);
            if (g) {
                const isSelected = (country.id === this.selectedCountryCode);
                this.drawCountryShape(g, country, isSupported, false, isSelected);
            }

            if (this.options.onHoverOut) {
                this.options.onHoverOut(country, isSupported, event);
            }
        }

        onCountryClick(country, isSupported, event) {
            this.hideArchipelagoLabels();
            if (!isSupported) {
                if (this.options.onNonSupportedClick) {
                    this.options.onNonSupportedClick(country);
                }
                return;
            }

            this.selectCountry(country.id, true);
        }

        selectCountry(countryId, smoothPan = true) {
            const previousId = this.selectedCountryCode;
            this.selectedCountryCode = countryId;

            // Redraw previous
            if (previousId && this.countryGraphicsMap.has(previousId)) {
                const prevG = this.countryGraphicsMap.get(previousId);
                this.drawCountryShape(prevG, prevG.countryData, prevG.isSupported, false, false);
            }

            // Redraw current
            if (this.countryGraphicsMap.has(countryId)) {
                const currG = this.countryGraphicsMap.get(countryId);
                this.drawCountryShape(currG, currG.countryData, currG.isSupported, false, true);

                // Supported metadata
                const info = SUPPORTED_COUNTRIES[countryId];
                if (info) {
                    this.selectedAirportCode = info.airports[0].code;
                    this.selectedOriginCoords = info.coords;
                    const destCoords = this.selectedDestCoords || QUY_NHON_COORDS;
                    // Draw flight corridor
                    this.drawFlightCorridor(info.coords, destCoords);

                    // Camera focus
                    if (smoothPan) {
                        this.flyToCountry(info.coords[0], info.coords[1]);
                    }
                }
            }

            if (this.options.onSelect) {
                this.options.onSelect(SUPPORTED_COUNTRIES[countryId]);
            }
        }

        flyToCountry(lon, lat) {
            const pt = this.project(lon, lat);
            const viewW = this.app.screen.width;
            const viewH = this.app.screen.height;

            const targetScale = Math.max(this.camera.scale, 0.85);
            const targetX = viewW / 2 - pt.x * targetScale;
            const targetY = viewH / 2 - pt.y * targetScale;

            this.camera.targetScale = targetScale;
            this.camera.targetX = targetX;
            this.camera.targetY = targetY;
        }

        setupInteractions() {
            const view = this.app.view;

            // Pointer Drag / Pan
            view.addEventListener('pointerdown', (e) => {
                this.camera.isDragging = true;
                this.camera.lastDragX = e.clientX;
                this.camera.lastDragY = e.clientY;
                this.dragDistance = 0;
                view.style.cursor = 'grabbing';
            });

            window.addEventListener('pointermove', (e) => {
                if (!this.camera.isDragging) return;
                const dx = e.clientX - this.camera.lastDragX;
                const dy = e.clientY - this.camera.lastDragY;
                this.camera.lastDragX = e.clientX;
                this.camera.lastDragY = e.clientY;
                this.dragDistance += Math.hypot(dx, dy);

                this.camera.x += dx;
                this.camera.y += dy;
                this.camera.targetX = this.camera.x;
                this.camera.targetY = this.camera.y;
            });

            window.addEventListener('pointerup', () => {
                this.camera.isDragging = false;
                view.style.cursor = 'default';
                if (this.dragDistance < 5) {
                    setTimeout(() => {
                        if (!this.islandTapped) {
                            this.hideArchipelagoLabels();
                        }
                        this.islandTapped = false;
                    }, 20);
                }
            });

            // Wheel Zoom (Zoom to mouse pointer)
            view.addEventListener('wheel', (e) => {
                e.preventDefault();
                const rect = view.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const mouseY = e.clientY - rect.top;

                const zoomFactor = e.deltaY < 0 ? 1.15 : 0.87;
                let newScale = this.camera.targetScale * zoomFactor;
                newScale = Math.max(this.camera.minScale, Math.min(this.camera.maxScale, newScale));

                // Zoom centered on mouse
                const worldX = (mouseX - this.camera.targetX) / this.camera.targetScale;
                const worldY = (mouseY - this.camera.targetY) / this.camera.targetScale;

                this.camera.targetX = mouseX - worldX * newScale;
                this.camera.targetY = mouseY - worldY * newScale;
                this.camera.targetScale = newScale;
            }, { passive: false });

            // Mobile Pinch-to-zoom & Multi-touch Support
            let initialTouchDist = 0;
            let initialTouchScale = 1;

            view.addEventListener('touchstart', (e) => {
                if (e.touches.length === 2) {
                    this.camera.isDragging = false;
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    initialTouchDist = Math.hypot(dx, dy);
                    initialTouchScale = this.camera.targetScale;
                }
            }, { passive: true });

            view.addEventListener('touchmove', (e) => {
                if (e.touches.length === 2 && initialTouchDist > 0) {
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    const dist = Math.hypot(dx, dy);
                    const factor = dist / initialTouchDist;
                    let newScale = initialTouchScale * factor;
                    newScale = Math.max(this.camera.minScale, Math.min(this.camera.maxScale, newScale));
                    this.camera.targetScale = newScale;
                }
            }, { passive: true });

            view.addEventListener('touchend', (e) => {
                if (e.touches.length < 2) {
                    initialTouchDist = 0;
                }
            }, { passive: true });

            // Initial auto-fit: Center map in container
            const initialScale = Math.max(view.width / BASE_MAP_WIDTH, view.height / BASE_MAP_HEIGHT) * 0.95;
            this.camera.scale = initialScale;
            this.camera.targetScale = initialScale;
            this.camera.x = (view.width - BASE_MAP_WIDTH * initialScale) / 2;
            this.camera.y = (view.height - BASE_MAP_HEIGHT * initialScale) / 2;
            this.camera.targetX = this.camera.x;
            this.camera.targetY = this.camera.y;
        }

        zoomIn() {
            const newScale = Math.min(this.camera.targetScale * 1.3, this.camera.maxScale);
            const centerX = this.app.screen.width / 2;
            const centerY = this.app.screen.height / 2;
            const worldX = (centerX - this.camera.targetX) / this.camera.targetScale;
            const worldY = (centerY - this.camera.targetY) / this.camera.targetScale;
            this.camera.targetX = centerX - worldX * newScale;
            this.camera.targetY = centerY - worldY * newScale;
            this.camera.targetScale = newScale;
        }

        zoomOut() {
            const newScale = Math.max(this.camera.targetScale * 0.75, this.camera.minScale);
            const centerX = this.app.screen.width / 2;
            const centerY = this.app.screen.height / 2;
            const worldX = (centerX - this.camera.targetX) / this.camera.targetScale;
            const worldY = (centerY - this.camera.targetY) / this.camera.targetScale;
            this.camera.targetX = centerX - worldX * newScale;
            this.camera.targetY = centerY - worldY * newScale;
            this.camera.targetScale = newScale;
        }

        resetView() {
            const viewW = this.app.screen.width;
            const viewH = this.app.screen.height;
            const fitScale = Math.max(viewW / BASE_MAP_WIDTH, viewH / BASE_MAP_HEIGHT) * 0.95;
            this.camera.targetScale = fitScale;
            this.camera.targetX = (viewW - BASE_MAP_WIDTH * fitScale) / 2;
            this.camera.targetY = (viewH - BASE_MAP_HEIGHT * fitScale) / 2;
        }

        update(delta) {
            // Smooth Camera Interpolation (Lerp)
            this.camera.scale += (this.camera.targetScale - this.camera.scale) * 0.12;
            this.camera.x += (this.camera.targetX - this.camera.x) * 0.12;
            this.camera.y += (this.camera.targetY - this.camera.y) * 0.12;

            this.mapContainer.scale.set(this.camera.scale);
            this.mapContainer.position.set(this.camera.x, this.camera.y);

            // Animate Radar Pulse on Quy Nhon
            if (this.radarPulse) {
                this.radarPulse.scale.x = 1 + Math.sin(Date.now() * 0.004) * 0.35;
                this.radarPulse.scale.y = this.radarPulse.scale.x;
                this.radarPulse.alpha = 0.4 + Math.sin(Date.now() * 0.004) * 0.4;
            }

            // Animate Flight Plane along Bezier
            if (this.flightPlane && this.flightP0 && this.flightP1 && this.flightP2) {
                this.flightAnimProgress = (this.flightAnimProgress + 0.006) % 1.0;
                const t = this.flightAnimProgress;
                const p0 = this.flightP0, p1 = this.flightP1, p2 = this.flightP2;

                const bx = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
                const by = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;

                // Tangent vector for plane rotation angle
                const dx = 2 * (1 - t) * (p1.x - p0.x) + 2 * t * (p2.x - p1.x);
                const dy = 2 * (1 - t) * (p1.y - p0.y) + 2 * t * (p2.y - p1.y);
                const angle = Math.atan2(dy, dx);

                this.flightPlane.position.set(bx, by);
                this.flightPlane.rotation = angle;
            }

            // FPS Measurement
            this.fpsCounter.frames++;
            const now = performance.now();
            if (now - this.fpsCounter.lastTime >= 1000) {
                this.fpsCounter.currentFps = Math.round((this.fpsCounter.frames * 1000) / (now - this.fpsCounter.lastTime));
                this.fpsCounter.frames = 0;
                this.fpsCounter.lastTime = now;
                if (this.options.onFpsUpdate) {
                    this.options.onFpsUpdate(this.fpsCounter.currentFps, this.camera.scale);
                }
            }
        }

        onResize() {
            if (!this.app || !this.container) return;
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            this.app.renderer.resize(w, h);
        }

        destroy() {
            window.removeEventListener('resize', this.onResize);
            if (this.app) {
                this.app.ticker.stop();
                this.app.stop();
                const gl = this.app.renderer.gl;
                if (gl) {
                    const ext = gl.getExtension('WEBGL_lose_context');
                    if (ext) ext.loseContext();
                }
                this.app.destroy(true, { children: true, texture: true, baseTexture: true });
                this.app = null;
            }
        }
    }

    // Expose to global window
    window.Map25DPrototype = Map25DPrototype;
    window.SUPPORTED_COUNTRIES = SUPPORTED_COUNTRIES;
    window.VIETNAM_DESTINATIONS = VIETNAM_DESTINATIONS;
})();

