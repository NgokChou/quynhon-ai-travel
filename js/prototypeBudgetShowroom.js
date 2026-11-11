/**
 * PROTOTYPE BUDGET & 3D PIGGY BANK GROWTH GAME ENGINE (SPRINT C.2.1 POLISHED)
 * Quy Nhơn AI Travel Assistant - Step 3: Budget Configuration & 3D Showroom
 *
 * Visual & Sound Enhancements (Sprint C.2.1):
 * - Fixed Stable Front 3/4 Camera Angle (Both eyes, ears, and snout prominently in view)
 * - Disabled auto-rotation and manual orbit drag (View stays rock-solid focused on cute face)
 * - Balanced Studio Lighting (Exposure 0.92, soft warm key, neutral fill, subtle rim, zero blowout)
 * - Rich Pastel Strawberry-Pink Material (Rich pink tone, porcelain satin finish, zero specular bleach)
 * - High-Contrast Vivid Green USD Banknotes (Deep dollar green borders, sharp '$', '100', serials)
 * - Natural Metallic Gold Coins (Rich bullion gold, 0 neon glare, sculpted edge & face depth)
 * - Physical Multi-Clink Metallic Coin Drop Sound (4-mode inharmonic resonance + micro-chatter bounces)
 * - Adaptive Viewport Framing: Mathematical bounding box ensures Tier 5 NEVER overflows on Desktop or Mobile
 * - 6-Category Closed Budget Allocation Engine (Largest Remainder Method, 100% sum equality)
 * - Multi-Currency Engine (USD base, VND, EUR, JPY, GBP, AUD) with transparent reference rates
 * - Mobile-first layout, seamless Map <-> Budget WebGL coordination
 */

(function (window) {
    'use strict';

    // =========================================================================
    // 1. CONSTANTS & CONFIGURATIONS
    // =========================================================================

    const BUDGET_CONFIG = {
        minUSD: 500,
        defaultUSD: 2500,
        maxUSD: 50000,
        defaultGuests: 1,
        minGuests: 1,
        maxGuests: 8,
        defaultDays: 5,
        minDays: 2,
        maxDays: 30
    };

    // Reference exchange rates (Q4/2026 Reference Data)
    const CURRENCIES = {
        USD: { symbol: '$', rate: 1.0, prefix: '$', suffix: '', decimals: 0, label: 'USD ($)', note: 'Base Currency' },
        VND: { symbol: '₫', rate: 25450, prefix: '', suffix: ' ₫', decimals: 0, label: 'VND (₫)', note: '1 USD ≈ 25,450 ₫' },
        EUR: { symbol: '€', rate: 0.92, prefix: '€', suffix: '', decimals: 0, label: 'EUR (€)', note: '1 USD ≈ 0.92 €' },
        JPY: { symbol: '¥', rate: 152.0, prefix: '¥', suffix: '', decimals: 0, label: 'JPY (¥)', note: '1 USD ≈ 152 ¥' },
        GBP: { symbol: '£', rate: 0.78, prefix: '£', suffix: '', decimals: 0, label: 'GBP (£)', note: '1 USD ≈ 0.78 £' },
        AUD: { symbol: 'A$', rate: 1.52, prefix: 'A$', suffix: '', decimals: 0, label: 'AUD (A$)', note: '1 USD ≈ 1.52 A$' }
    };

    // 5 Progressive Budget & Piggy Bank Growth Tiers
    const TIERS = [
        {
            level: 1,
            id: 'tier-1',
            name: 'Economy Explorer',
            modelName: 'Heo Đất Nhỏ Xinh (Tiết Kiệm)',
            badge: 'TIER 1 • ECONOMY EXPLORER',
            minUSD: 500,
            maxUSD: 2499,
            presetUSD: 500,
            scale: 0.70,
            coinCount: 16,
            usdCount: 3,
            colorHex: 0x38bdf8,
            experience: '16 xu vàng • 3 tờ USD • Homestay ven biển Nhơn Lý, ẩm thực hải sản đường phố bản địa.'
        },
        {
            level: 2,
            id: 'tier-2',
            name: 'Comfort Voyage',
            modelName: 'Heo Đất Tròn Trĩnh (Tiện Nghi)',
            badge: 'TIER 2 • COMFORT VOYAGE',
            minUSD: 2500,
            maxUSD: 7999,
            presetUSD: 2500,
            scale: 0.85,
            coinCount: 48,
            usdCount: 8,
            colorHex: 0x00e5ff,
            experience: '48 xu vàng • 8 tờ USD & cọc tiền • Khách sạn 3–4 sao ngắm trọn vịnh biển Quy Nhơn, xe đưa đón Phù Cát.'
        },
        {
            level: 3,
            id: 'tier-3',
            name: 'Business Executive',
            modelName: 'Heo Đất Mũm Mĩm (Thương Gia)',
            badge: 'TIER 3 • BUSINESS EXECUTIVE',
            minUSD: 8000,
            maxUSD: 19999,
            presetUSD: 8000,
            scale: 1.02,
            coinCount: 110,
            usdCount: 18,
            colorHex: 0x10b981,
            experience: '110 xu vàng • 18 tờ USD & cọc tiền • Resort 5 sao Maia/FLC Quy Nhơn, tiệc tôm hùm hoàng hôn.'
        },
        {
            level: 4,
            id: 'tier-4',
            name: 'Premium Flagship',
            modelName: 'Heo Đất Khổng Lồ (Cao Cấp)',
            badge: 'TIER 4 • PREMIUM FLAGSHIP',
            minUSD: 20000,
            maxUSD: 34999,
            presetUSD: 20000,
            scale: 1.20,
            coinCount: 230,
            usdCount: 32,
            colorHex: 0xf59e0b,
            experience: '230 xu vàng • 32 cọc tiền USD • Biệt thự hồ bơi vô cực vách đá riêng biệt, du thuyền dạo vịnh.'
        },
        {
            level: 5,
            id: 'tier-5',
            name: 'Luxury Presidential',
            modelName: 'Heo Đất Đại Phú Hào (Thượng Lưu)',
            badge: 'TIER 5 • LUXURY PRESIDENTIAL',
            minUSD: 35000,
            maxUSD: 50000,
            presetUSD: 50000,
            scale: 1.38,
            coinCount: 400,
            usdCount: 50,
            colorHex: 0xffd700,
            experience: '400 xu vàng • 50 cọc tiền USD • Dinh thự Tổng Thống cao cấp nhất, trực thăng ngắm Ghềnh Ráng 24/7.'
        }
    ];

    // 6-Category Allocation Baseline Weights (at 1 Guest, 5 Days)
    const ALLOCATION_CATEGORIES = [
        { id: 'flight', name: 'Vé Máy Bay', icon: 'fa-plane-departure', color: '#38bdf8', baseWeight: 0.35 },
        { id: 'stay', name: 'Lưu Trú (Khách sạn/Resort)', icon: 'fa-hotel', color: '#818cf8', baseWeight: 0.28 },
        { id: 'food', name: 'Ăn Uống & Ẩm Thực', icon: 'fa-utensils', color: '#fb923c', baseWeight: 0.14 },
        { id: 'transit', name: 'Di Chuyển Nội Địa', icon: 'fa-car-side', color: '#34d399', baseWeight: 0.08 },
        { id: 'activities', name: 'Hoạt Động & Trải Nghiệm', icon: 'fa-compass', color: '#f43f5e', baseWeight: 0.10 },
        { id: 'buffer', name: 'Quỹ Dự Phòng', icon: 'fa-shield-halved', color: '#fbbf24', baseWeight: 0.05 }
    ];

    // =========================================================================
    // 2. HELPER FUNCTIONS (Formatting, Clamping, Math)
    // =========================================================================

    function clamp(val, min, max) {
        return Math.max(min, Math.min(max, val));
    }

    function smoothstep(min, max, value) {
        const x = Math.max(0, Math.min(1, (value - min) / (max - min)));
        return x * x * (3 - 2 * x);
    }

    function getTierForUSD(usd) {
        for (let i = TIERS.length - 1; i >= 0; i--) {
            if (usd >= TIERS[i].minUSD) return TIERS[i];
        }
        return TIERS[0];
    }

    function formatNumber(val, decimals = 0) {
        return Number(val).toLocaleString('en-US', {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
    }

    function formatCurrency(valUSD, curKey) {
        const cur = CURRENCIES[curKey] || CURRENCIES.USD;
        const converted = valUSD * cur.rate;
        if (curKey === 'VND') {
            return Math.round(converted).toLocaleString('vi-VN') + cur.suffix;
        }
        if (curKey === 'JPY') {
            return cur.prefix + Math.round(converted).toLocaleString('ja-JP');
        }
        return cur.prefix + formatNumber(converted, cur.decimals);
    }

    // =========================================================================
    // SPRINT C.3.3: CONTINUOUS GROWTH & DETERMINISTIC TREASURY ENGINE
    // =========================================================================

    // Deterministic Mulberry32 Pseudo-Random Number Generator for organic treasury
    function createSeededPRNG(seed = 1234567) {
        let s = seed >>> 0;
        return function() {
            s = (s + 0x6D2B79F5) >>> 0;
            let t = Math.imul(s ^ (s >>> 15), 1 | s);
            t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
            return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
    }

    // Continuous Scale Interpolation Anchors across 5 Tiers
    const SCALE_ANCHORS = [
        { usd: 500, scale: 0.70 },
        { usd: 2500, scale: 0.85 },
        { usd: 8000, scale: 1.02 },
        { usd: 20000, scale: 1.20 },
        { usd: 35000, scale: 1.30 },
        { usd: 50000, scale: 1.38 }
    ];

    function calculateContinuousScale(usdVal) {
        const usd = clamp(usdVal, BUDGET_CONFIG.minUSD, BUDGET_CONFIG.maxUSD);
        if (usd <= SCALE_ANCHORS[0].usd) return SCALE_ANCHORS[0].scale;
        if (usd >= SCALE_ANCHORS[SCALE_ANCHORS.length - 1].usd) return SCALE_ANCHORS[SCALE_ANCHORS.length - 1].scale;

        for (let i = 0; i < SCALE_ANCHORS.length - 1; i++) {
            const a = SCALE_ANCHORS[i];
            const b = SCALE_ANCHORS[i + 1];
            if (usd >= a.usd && usd <= b.usd) {
                const t = (usd - a.usd) / (b.usd - a.usd);
                return a.scale + t * (b.scale - a.scale);
            }
        }
        return 1.0;
    }

    // Continuous Treasury Accumulation Anchors
    const COIN_ANCHORS = [
        { usd: 500, count: 16 },
        { usd: 2500, count: 48 },
        { usd: 8000, count: 110 },
        { usd: 20000, count: 230 },
        { usd: 35000, count: 320 },
        { usd: 50000, count: 400 }
    ];

    const USD_LOOSE_ANCHORS = [
        { usd: 500, count: 3 },
        { usd: 2500, count: 8 },
        { usd: 8000, count: 18 },
        { usd: 20000, count: 26 },
        { usd: 50000, count: 30 }
    ];

    const USD_BUNDLE_ANCHORS = [
        { usd: 500, count: 1 },
        { usd: 2500, count: 3 },
        { usd: 8000, count: 7 },
        { usd: 20000, count: 13 },
        { usd: 50000, count: 20 }
    ];

    function interpolateAnchors(usdVal, anchors) {
        const usd = clamp(usdVal, BUDGET_CONFIG.minUSD, BUDGET_CONFIG.maxUSD);
        if (usd <= anchors[0].usd) return anchors[0].count;
        if (usd >= anchors[anchors.length - 1].usd) return anchors[anchors.length - 1].count;
        for (let i = 0; i < anchors.length - 1; i++) {
            const a = anchors[i];
            const b = anchors[i + 1];
            if (usd >= a.usd && usd <= b.usd) {
                const t = (usd - a.usd) / (b.usd - a.usd);
                return Math.round(a.count + t * (b.count - a.count));
            }
        }
        return anchors[0].count;
    }

    function calculateContinuousCounts(usdVal) {
        return {
            coinCount: clamp(interpolateAnchors(usdVal, COIN_ANCHORS), 16, 400),
            looseCount: clamp(interpolateAnchors(usdVal, USD_LOOSE_ANCHORS), 3, 30),
            bundleCount: clamp(interpolateAnchors(usdVal, USD_BUNDLE_ANCHORS), 1, 20)
        };
    }

    // =========================================================================
    // 3. BUDGET & TRIP CALCULATOR ENGINE (6-Category Allocation)
    // =========================================================================

    class BudgetTripCalculator {
        static calculateAllocation(totalBudgetUSD, guests = 1, days = 5) {
            const B = clamp(totalBudgetUSD, BUDGET_CONFIG.minUSD, BUDGET_CONFIG.maxUSD);
            const g = clamp(guests, BUDGET_CONFIG.minGuests, BUDGET_CONFIG.maxGuests);
            const d = clamp(days, BUDGET_CONFIG.minDays, BUDGET_CONFIG.maxDays);

            let wFlight = 0.35 * Math.pow(g, 0.45) / Math.pow(d / 5, 0.35);
            let wStay = 0.28 * Math.pow(d / 5, 0.60) * Math.pow(g, 0.25);
            let wFood = 0.14 * (g * 0.7 + 0.3) * Math.pow(d / 5, 0.50);
            let wTransit = 0.08 * (1 + 0.15 * (g - 1)) * Math.pow(d / 5, 0.20);
            let wActivities = 0.10 * Math.pow(g, 0.40) * Math.pow(d / 5, 0.30);
            let wBuffer = 0.05;

            const sumW = wFlight + wStay + wFood + wTransit + wActivities + wBuffer;
            const normW = [
                wFlight / sumW,
                wStay / sumW,
                wFood / sumW,
                wTransit / sumW,
                wActivities / sumW,
                wBuffer / sumW
            ];

            const rawAmounts = normW.map(w => B * w);
            const baseAmounts = rawAmounts.map(Math.floor);
            const remainders = rawAmounts.map((r, i) => ({ index: i, rem: r - baseAmounts[i] }));

            let allocatedSum = baseAmounts.reduce((a, b) => a + b, 0);
            let diff = Math.round(B - allocatedSum);

            remainders.sort((a, b) => b.rem - a.rem);
            for (let i = 0; i < diff; i++) {
                baseAmounts[remainders[i % remainders.length].index] += 1;
            }

            const results = ALLOCATION_CATEGORIES.map((cat, idx) => {
                const amountUSD = baseAmounts[idx];
                const pct = (amountUSD / B) * 100;
                return {
                    ...cat,
                    amountUSD,
                    pct: Math.round(pct * 10) / 10
                };
            });

            const finalSum = results.reduce((acc, c) => acc + c.amountUSD, 0);
            return {
                totalUSD: finalSum,
                categories: results,
                isExact: finalSum === B
            };
        }
    }

    // =========================================================================
    // =========================================================================
    // 4. AUTHENTIC REAL COIN CLINK AUDIO ENGINE (SPRINT C.2.2)
    // Slices master MP3 (assets/audio/preview.mp3) into 9 distinct physical coin clinks
    // =========================================================================

    class CoinAudioEngine {
        constructor() {
            this.ctx = null;
            this.masterGain = null;
            this.enabled = true;
            this.lastPlayTime = 0;
            this.minInterval = 75; // ms throttling between coin drop triggers
            this.audioUrl = 'assets/audio/preview.mp3';
            this.isLoaded = false;
            this.isLoading = false;
            this.isDecoding = false;
            this.rawArrayBuffer = null;
            this.slices = []; // Pre-sliced clean AudioBuffers (approx 0.65s each)
            this.lastSliceIdx = -1;
            this.activeSources = [];
            this.maxPolyphony = 5;

            // 9 Distinct metallic coin impact slices extracted from preview.mp3
            this.sliceRanges = [
                { start: 0.08, end: 0.70 },
                { start: 1.70, end: 2.35 },
                { start: 3.25, end: 3.90 },
                { start: 4.80, end: 5.45 },
                { start: 6.60, end: 7.25 },
                { start: 8.00, end: 8.65 },
                { start: 9.50, end: 10.15 },
                { start: 10.85, end: 11.55 },
                { start: 12.35, end: 13.05 }
            ];

            // Pre-fetch audio asset as ArrayBuffer in background
            this.loadAudio();
        }

        async loadAudio() {
            if (this.isLoaded || this.isLoading) return;
            this.isLoading = true;
            try {
                const res = await fetch(this.audioUrl);
                if (!res.ok) throw new Error(`HTTP ${res.status} fetching ${this.audioUrl}`);
                const arrayBuffer = await res.arrayBuffer();
                this.rawArrayBuffer = arrayBuffer;
                if (this.ctx) {
                    await this.decodeAndSlice(arrayBuffer);
                }
            } catch (err) {
                console.warn('[CoinAudioEngine] Audio asset load notice:', err.message);
            } finally {
                this.isLoading = false;
            }
        }

        async decodeAndSlice(arrayBuffer) {
            if (!this.ctx || this.isLoaded || this.isDecoding) return;
            this.isDecoding = true;
            try {
                const bufCopy = arrayBuffer.slice(0);
                const masterBuffer = await this.ctx.decodeAudioData(bufCopy);
                const channels = masterBuffer.numberOfChannels;
                const sampleRate = masterBuffer.sampleRate;
                const slices = [];

                for (let r = 0; r < this.sliceRanges.length; r++) {
                    const range = this.sliceRanges[r];
                    const startSample = Math.floor(range.start * sampleRate);
                    const endSample = Math.min(masterBuffer.length, Math.floor(range.end * sampleRate));
                    const sliceLen = endSample - startSample;
                    if (sliceLen <= 0) continue;

                    const sliceBuf = this.ctx.createBuffer(channels, sliceLen, sampleRate);
                    const fadeInSamples = Math.floor(sampleRate * 0.002); // 2ms de-click
                    const fadeOutSamples = Math.floor(sampleRate * 0.025); // 25ms smooth decay
                    const fadeOutStart = sliceLen - fadeOutSamples;

                    for (let ch = 0; ch < channels; ch++) {
                        const src = masterBuffer.getChannelData(ch);
                        const dst = sliceBuf.getChannelData(ch);
                        for (let i = 0; i < sliceLen; i++) {
                            let sample = src[startSample + i] || 0;
                            if (i < fadeInSamples) {
                                sample *= (i / fadeInSamples);
                            } else if (i > fadeOutStart) {
                                sample *= ((sliceLen - i) / fadeOutSamples);
                            }
                            dst[i] = sample;
                        }
                    }
                    slices.push(sliceBuf);
                }

                this.slices = slices;
                this.isLoaded = slices.length > 0;
            } catch (err) {
                console.warn('[CoinAudioEngine] decodeAudioData error:', err);
            } finally {
                this.isDecoding = false;
            }
        }

        init() {
            if (!this.ctx) {
                try {
                    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                    if (AudioContextClass) {
                        this.ctx = new AudioContextClass();
                        this.masterGain = this.ctx.createGain();
                        this.masterGain.gain.setValueAtTime(0.42, this.ctx.currentTime);
                        this.masterGain.connect(this.ctx.destination);
                    }
                } catch (err) {
                    console.warn('[CoinAudioEngine] Web Audio context init failed:', err);
                }
            }

            if (this.ctx && this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }

            if (this.ctx && this.rawArrayBuffer && !this.isLoaded && !this.isDecoding) {
                this.decodeAndSlice(this.rawArrayBuffer);
            } else if (this.ctx && !this.rawArrayBuffer && !this.isLoading) {
                this.loadAudio();
            }
        }

        toggle() {
            this.enabled = !this.enabled;
            if (!this.enabled) {
                this.stopAllVoices();
            }
            return this.enabled;
        }

        stopAllVoices() {
            for (let i = 0; i < this.activeSources.length; i++) {
                try {
                    const { source, gainNode } = this.activeSources[i];
                    if (gainNode && this.ctx) {
                        gainNode.gain.cancelScheduledValues(this.ctx.currentTime);
                        gainNode.gain.setValueAtTime(0, this.ctx.currentTime);
                    }
                    if (source) source.stop();
                } catch (_) {}
            }
            this.activeSources = [];
        }

        playCoinDrop() {
            if (!this.enabled) return;

            const now = performance.now();
            if (now - this.lastPlayTime < this.minInterval) return;
            this.lastPlayTime = now;

            if (!this.ctx || !this.isLoaded) {
                this.init();
            }
            if (!this.ctx || !this.isLoaded || this.slices.length === 0) return;

            if (this.ctx.state === 'suspended') {
                this.ctx.resume().catch(() => {});
            }

            // Pick a slice with non-repeating index
            let idx = Math.floor(Math.random() * this.slices.length);
            if (idx === this.lastSliceIdx && this.slices.length > 1) {
                idx = (idx + 1) % this.slices.length;
            }
            this.lastSliceIdx = idx;

            const sliceBuf = this.slices[idx];
            if (!sliceBuf) return;

            const currentTime = this.ctx.currentTime;

            // Voice polyphony limiter: smoothly fade out oldest voice if limit reached
            if (this.activeSources.length >= this.maxPolyphony) {
                const oldest = this.activeSources.shift();
                if (oldest) {
                    try {
                        oldest.gainNode.gain.cancelScheduledValues(currentTime);
                        oldest.gainNode.gain.linearRampToValueAtTime(0, currentTime + 0.02);
                        oldest.source.stop(currentTime + 0.025);
                    } catch (_) {}
                }
            }

            const source = this.ctx.createBufferSource();
            source.buffer = sliceBuf;

            // Organic pitch variation (+/- 4%)
            source.playbackRate.setValueAtTime(0.96 + Math.random() * 0.08, currentTime);

            const voiceGain = this.ctx.createGain();
            const volume = 0.40 + Math.random() * 0.08;
            voiceGain.gain.setValueAtTime(volume, currentTime);

            source.connect(voiceGain);
            voiceGain.connect(this.masterGain);

            source.start(currentTime);

            const voiceRecord = { source, gainNode: voiceGain };
            this.activeSources.push(voiceRecord);

            source.onended = () => {
                const pos = this.activeSources.indexOf(voiceRecord);
                if (pos !== -1) {
                    this.activeSources.splice(pos, 1);
                }
            };
        }
    }

    // =========================================================================
    // 5. PROCEDURAL 3D CURVES & VIBRANT USD BANKNOTE TEXTURES
    // =========================================================================

    class PiggyTailCurve extends THREE.Curve {
        constructor(scale = 1.0) {
            super();
            this.scale = scale;
        }
        getPoint(t, optionalTarget = new THREE.Vector3()) {
            const theta = t * Math.PI * 4.8;
            const radius = 0.16 * (1.0 - t * 0.45);
            const z = -t * 0.42;
            const x = Math.sin(theta) * radius;
            const y = Math.cos(theta) * radius;
            return optionalTarget.set(x, y, z).multiplyScalar(this.scale);
        }
    }

    // High-resolution procedural American greenback USD banknote face texture
    function createBanknoteTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 512;
        canvas.height = 240;
        const ctx = canvas.getContext('2d');

        // 1. Base Paper: Vibrant, unmistakable crisp banknote green
        ctx.fillStyle = '#68b285';
        ctx.fillRect(0, 0, 512, 240);

        // 2. Micro-texture background pattern
        ctx.fillStyle = 'rgba(10, 54, 26, 0.12)';
        for (let y = 0; y < 240; y += 4) {
            ctx.fillRect(0, y, 512, 1.5);
        }

        // 3. Ornate Outer Border (Double frame)
        ctx.strokeStyle = '#0a3618';
        ctx.lineWidth = 8;
        ctx.strokeRect(10, 10, 492, 220);

        ctx.strokeStyle = '#1b5e35';
        ctx.lineWidth = 3;
        ctx.strokeRect(18, 18, 476, 204);

        // 4. Corner numerals '100' with bold green shields
        const corners = [
            { x: 40, y: 44 },
            { x: 472, y: 44 },
            { x: 40, y: 210 },
            { x: 472, y: 210 }
        ];
        ctx.font = '900 24px "Arial Black", Arial, sans-serif';
        ctx.fillStyle = '#0a3618';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        corners.forEach(c => {
            ctx.fillText('100', c.x, c.y);
        });

        // 5. Header Ribbon
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#0a3618';
        ctx.fillText('FEDERAL RESERVE NOTE', 256, 32);

        ctx.font = '900 18px "Arial Black", Arial, sans-serif';
        ctx.fillStyle = '#05220e';
        ctx.fillText('THE UNITED STATES OF AMERICA', 256, 56);

        // 6. Central Medallion Oval Seal with Bold '$' & 'USD'
        ctx.beginPath();
        ctx.ellipse(256, 125, 72, 54, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#9fe0b7';
        ctx.fill();
        ctx.strokeStyle = '#0a3618';
        ctx.lineWidth = 5;
        ctx.stroke();

        ctx.beginPath();
        ctx.ellipse(256, 125, 64, 47, 0, 0, Math.PI * 2);
        ctx.strokeStyle = '#1b5e35';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Central '$' Symbol
        ctx.font = '900 48px "Arial Black", Arial, sans-serif';
        ctx.fillStyle = '#0a3618';
        ctx.fillText('$', 256, 122);

        ctx.font = 'bold 13px sans-serif';
        ctx.fillStyle = '#0a3618';
        ctx.fillText('USD', 256, 156);

        // 7. Green Treasury Seal (Left)
        ctx.beginPath();
        ctx.arc(135, 125, 26, 0, Math.PI * 2);
        ctx.strokeStyle = '#0a3618';
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#0a3618';
        ctx.fillText('USA', 135, 125);

        // 8. Serial Numbers (Emerald Green)
        ctx.font = 'bold 13px "Courier New", monospace';
        ctx.fillStyle = '#064e3b';
        ctx.fillText('KB 84629104 C', 135, 75);
        ctx.fillText('KB 84629104 C', 377, 175);

        // 9. Bottom Banner: "ONE HUNDRED DOLLARS"
        ctx.font = '900 15px "Arial Black", Arial, sans-serif';
        ctx.fillStyle = '#05220e';
        ctx.fillText('ONE HUNDRED DOLLARS', 256, 204);

        const tex = new THREE.CanvasTexture(canvas);
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        return tex;
    }

    // Procedural edge texture for stacked banknote straps
    function createBanknoteStackSideTexture() {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 64;
        const ctx = canvas.getContext('2d');

        // Paper edges alternating vibrant green & pale green
        ctx.fillStyle = '#78b894';
        ctx.fillRect(0, 0, 256, 64);
        ctx.fillStyle = '#40805c';
        for (let y = 0; y < 64; y += 3) {
            ctx.fillRect(0, y, 256, 1.5);
        }

        // Gold / Green currency wrapper strap in middle
        ctx.fillStyle = '#d4af37';
        ctx.fillRect(104, 0, 48, 64);
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(104, 0, 48, 64);

        ctx.font = 'bold 11px sans-serif';
        ctx.fillStyle = '#451a03';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('$10,000', 128, 32);

        const tex = new THREE.CanvasTexture(canvas);
        tex.generateMipmaps = true;
        return tex;
    }

    // =========================================================================
    // 6. 3D PIGGY BANK, TREASURY & SHOWROOM BUILDER
    // =========================================================================

    class PiggyBankModularBuilder {
        constructor() {
            this.materials = {};
            this.rootGroup = null;
            this.bodyGroup = null;
            this.torsoMesh = null;
            this.snoutGroup = null;
            this.eyeGroup = null;
            this.leftEarPivot = null;
            this.rightEarPivot = null;
            this.legsGroup = null;
            this.tailPivot = null;

            // Pedestal & Effects
            this.pedestalGroup = null;
            this.treasuryMesh = null;
            this.looseBillsMesh = null;
            this.bundleStacksMesh = null;
            this.compassRings = [];
            this.particleSystem = null;
            this.platformNeonMat = null;
        }

        initMaterials() {
            // Main Sweet Strawberry Milk Pastel Pink Piggy Material
            // Soft porcelain / vinyl satin finish: roughness 0.38, metalness 0.0 (no specular bleach)
            this.materials.piggyPink = new THREE.MeshStandardMaterial({
                color: 0xff6b8b, // Rich pastel strawberry-pink
                roughness: 0.38,
                metalness: 0.0
            });

            // Minimalist Snout Rose Pink Material
            this.materials.snoutPink = new THREE.MeshStandardMaterial({
                color: 0xf43f5e, // Deeper rose-coral pink
                roughness: 0.42,
                metalness: 0.0
            });

            // Nostrils Material
            this.materials.nostril = new THREE.MeshStandardMaterial({
                color: 0x701a35, // Deep berry pink
                roughness: 0.50,
                metalness: 0.0
            });

            // Minimalist Onyx Button Eye Material
            this.materials.eyeBead = new THREE.MeshStandardMaterial({
                color: 0x111827, // Dark onyx charcoal
                roughness: 0.25,
                metalness: 0.0
            });

            // Hooves Dark Pink Material
            this.materials.hoofPink = new THREE.MeshStandardMaterial({
                color: 0xf43f5e,
                roughness: 0.35,
                metalness: 0.0
            });

            // Pure 24K Bullion Gold Coin Material (Natural gold, no neon yellow glare)
            this.materials.goldCoin = new THREE.MeshStandardMaterial({
                color: 0xd4af37, // Rich natural metallic gold
                metalness: 0.88,
                roughness: 0.28
            });

            // USD Banknote Textures & Materials
            this.banknoteTexture = createBanknoteTexture();
            this.banknoteSideTexture = createBanknoteStackSideTexture();

            this.materials.looseBanknote = new THREE.MeshStandardMaterial({
                map: this.banknoteTexture,
                roughness: 0.88,
                metalness: 0.0,
                side: THREE.DoubleSide
            });

            const sideMat = new THREE.MeshStandardMaterial({
                map: this.banknoteSideTexture,
                roughness: 0.88,
                metalness: 0.0
            });
            const faceMat = new THREE.MeshStandardMaterial({
                map: this.banknoteTexture,
                roughness: 0.88,
                metalness: 0.0
            });
            this.materials.bundleMaterials = [sideMat, sideMat, faceMat, faceMat, sideMat, sideMat];
        }

        buildShowroomPlatform(scene) {
            this.pedestalGroup = new THREE.Group();
            scene.add(this.pedestalGroup);

            // 1. Ceramic Dais Platform
            const daisGeo = new THREE.CylinderGeometry(2.9, 3.1, 0.42, 48);
            const daisMat = new THREE.MeshStandardMaterial({
                color: 0x16192b, // Elegant dark navy-indigo ceramic
                roughness: 0.35,
                metalness: 0.08
            });
            const dais = new THREE.Mesh(daisGeo, daisMat);
            dais.position.y = -0.65;
            dais.receiveShadow = true;
            this.pedestalGroup.add(dais);

            // 2. Gold Platform Rim Ring
            const rimGeo = new THREE.TorusGeometry(2.95, 0.05, 16, 48);
            const rimMat = new THREE.MeshStandardMaterial({
                color: 0xc59b27,
                roughness: 0.25,
                metalness: 0.90
            });
            const rim = new THREE.Mesh(rimGeo, rimMat);
            rim.rotation.x = Math.PI / 2;
            rim.position.y = -0.44;
            this.pedestalGroup.add(rim);

            // 3. Glowing Neon Outer Ring (gentle ambient glow)
            const neonGeo = new THREE.TorusGeometry(3.3, 0.035, 16, 48);
            this.platformNeonMat = new THREE.MeshBasicMaterial({
                color: 0x00e5ff,
                transparent: true,
                opacity: 0.55
            });
            const neon = new THREE.Mesh(neonGeo, this.platformNeonMat);
            neon.rotation.x = Math.PI / 2;
            neon.position.y = -0.82;
            this.pedestalGroup.add(neon);

            // 4. Concentric Tri-Ring Turntable Compass
            const ringRadii = [2.2, 2.5, 2.75];
            const ringColors = [0x38bdf8, 0x00e5ff, 0xd4af37];
            const ringSpeeds = [0.002, -0.003, 0.0015];

            this.compassRings = [];
            ringRadii.forEach((r, i) => {
                const ringGroup = new THREE.Group();
                ringGroup.position.y = -0.43;

                const ringMat = new THREE.MeshBasicMaterial({
                    color: ringColors[i],
                    transparent: true,
                    opacity: 0.25 + i * 0.10
                });
                const rGeo = new THREE.RingGeometry(r, r + 0.02, 48);
                const rMesh = new THREE.Mesh(rGeo, ringMat);
                rMesh.rotation.x = -Math.PI / 2;
                ringGroup.add(rMesh);

                this.pedestalGroup.add(ringGroup);
                this.compassRings.push({ group: ringGroup, speed: ringSpeeds[i] });
            });

            // 5. Floating Sparkle Particles
            const count = 80;
            const pGeo = new THREE.BufferGeometry();
            const positions = new Float32Array(count * 3);
            const velocities = new Float32Array(count);

            for (let i = 0; i < count; i++) {
                positions[i * 3 + 0] = (Math.random() - 0.5) * 6.5;
                positions[i * 3 + 1] = -0.5 + Math.random() * 4.5;
                positions[i * 3 + 2] = (Math.random() - 0.5) * 6.5;
                velocities[i] = 0.003 + Math.random() * 0.006;
            }
            pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

            const pMat = new THREE.PointsMaterial({
                color: 0xd4af37,
                size: 0.05,
                transparent: true,
                opacity: 0.55,
                blending: THREE.AdditiveBlending
            });

            const points = new THREE.Points(pGeo, pMat);
            scene.add(points);
            this.particleSystem = { points, positions, velocities, count, geometry: pGeo };

            // 6. Build Gold Coins Treasury
            this.buildTreasury();

            // 7. Build Procedural USD Banknotes & Strapped Bundles
            this.buildBanknotes();
        }

        buildTreasury() {
            const MAX_COINS = 400;
            const coinGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.035, 20);
            this.treasuryMesh = new THREE.InstancedMesh(coinGeo, this.materials.goldCoin, MAX_COINS);
            this.treasuryMesh.castShadow = true;
            this.treasuryMesh.receiveShadow = true;
            this.pedestalGroup.add(this.treasuryMesh);

            const prng = createSeededPRNG(987654);
            const dummy = new THREE.Object3D();
            const coins = [];

            // 14 Organic Mound Cluster Centers (varying angle and dist, no concentric circles)
            const mounds = [
                { angle: -0.70, dist: 2.10, height: 6 },
                { angle: 0.70, dist: 2.10, height: 6 },
                { angle: -1.25, dist: 2.25, height: 12 },
                { angle: 1.25, dist: 2.25, height: 12 },
                { angle: -1.75, dist: 2.45, height: 18 },
                { angle: 1.75, dist: 2.45, height: 18 },
                { angle: -2.25, dist: 2.50, height: 20 },
                { angle: 2.25, dist: 2.50, height: 20 },
                { angle: -2.75, dist: 2.40, height: 16 },
                { angle: 2.75, dist: 2.40, height: 16 },
                { angle: 3.14, dist: 2.35, height: 14 },
                { angle: -0.35, dist: 1.95, height: 4 },
                { angle: 0.35, dist: 1.95, height: 4 },
                { angle: 0.00, dist: 2.05, height: 3 }
            ];

            // Stage 1: Initial 16 coins (Tier 1) - foreground loose coins & initial base coins
            for (let i = 0; i < 16; i++) {
                const a = -1.2 + (i / 16) * 2.4 + (prng() - 0.5) * 0.15;
                const d = 1.95 + (i % 3) * 0.18 + (prng() - 0.5) * 0.08;
                coins.push({
                    x: Math.sin(a) * d,
                    y: -0.42 + (i % 2) * 0.012,
                    z: Math.cos(a) * d,
                    rx: (prng() - 0.5) * 0.15,
                    ry: prng() * Math.PI * 2,
                    rz: (prng() - 0.5) * 0.15
                });
            }

            // Stage 2: 32 coins (Tier 2: 17..48) - Base level of stacks & spill coins
            for (let m = 0; m < mounds.length && coins.length < 48; m++) {
                const md = mounds[m];
                for (let h = 0; h < 2 && coins.length < 48; h++) {
                    const a = md.angle + (prng() - 0.5) * 0.08;
                    const d = md.dist + (prng() - 0.5) * 0.08;
                    coins.push({
                        x: Math.sin(a) * d,
                        y: -0.42 + h * 0.034,
                        z: Math.cos(a) * d,
                        rx: (prng() - 0.5) * 0.08,
                        ry: a + (prng() - 0.5) * 0.2,
                        rz: (prng() - 0.5) * 0.08
                    });
                }
            }
            while (coins.length < 48) {
                const a = (prng() - 0.5) * Math.PI * 2;
                const d = 2.1 + (prng() - 0.5) * 0.4;
                coins.push({
                    x: Math.sin(a) * d,
                    y: -0.42,
                    z: Math.cos(a) * d,
                    rx: (prng() - 0.5) * 0.12,
                    ry: prng() * Math.PI * 2,
                    rz: (prng() - 0.5) * 0.12
                });
            }

            // Stage 3: 62 coins (Tier 3: 49..110) - Grow stacks up to 6 high and add flank spills
            for (let h = 2; h < 6 && coins.length < 110; h++) {
                for (let m = 0; m < mounds.length && coins.length < 110; m++) {
                    const md = mounds[m];
                    if (h < md.height) {
                        const a = md.angle + (prng() - 0.5) * 0.06;
                        const d = md.dist + (prng() - 0.5) * 0.06;
                        coins.push({
                            x: Math.sin(a) * d,
                            y: -0.42 + h * 0.034,
                            z: Math.cos(a) * d,
                            rx: (prng() - 0.5) * 0.06,
                            ry: a + h * 0.08 + (prng() - 0.5) * 0.1,
                            rz: (prng() - 0.5) * 0.06
                        });
                    }
                }
            }
            while (coins.length < 110) {
                const a = (prng() - 0.5) * Math.PI * 2;
                const d = 2.2 + (prng() - 0.5) * 0.35;
                coins.push({
                    x: Math.sin(a) * d,
                    y: -0.42,
                    z: Math.cos(a) * d,
                    rx: (prng() - 0.5) * 0.12,
                    ry: prng() * Math.PI * 2,
                    rz: (prng() - 0.5) * 0.12
                });
            }

            // Stage 4: 120 coins (Tier 4: 111..230) - Grow stacks up to 12 high and rear clusters
            for (let h = 6; h < 12 && coins.length < 230; h++) {
                for (let m = 0; m < mounds.length && coins.length < 230; m++) {
                    const md = mounds[m];
                    if (h < md.height) {
                        const a = md.angle + (prng() - 0.5) * 0.05;
                        const d = md.dist + (prng() - 0.5) * 0.05;
                        coins.push({
                            x: Math.sin(a) * d,
                            y: -0.42 + h * 0.034,
                            z: Math.cos(a) * d,
                            rx: (prng() - 0.5) * 0.05,
                            ry: a + h * 0.06 + (prng() - 0.5) * 0.1,
                            rz: (prng() - 0.5) * 0.05
                        });
                    }
                }
            }
            while (coins.length < 230) {
                const m = mounds[Math.floor(prng() * mounds.length)];
                const a = m.angle + (prng() - 0.5) * 0.25;
                const d = m.dist + (prng() - 0.5) * 0.25;
                coins.push({
                    x: Math.sin(a) * d,
                    y: -0.42 + (prng() < 0.3 ? 0.034 : 0),
                    z: Math.cos(a) * d,
                    rx: (prng() - 0.5) * 0.15,
                    ry: prng() * Math.PI * 2,
                    rz: (prng() - 0.5) * 0.15
                });
            }

            // Stage 5: 170 coins (Tier 5: 231..400) - Tall pillars & opulent heaps
            for (let h = 12; h < 24 && coins.length < 400; h++) {
                for (let m = 0; m < mounds.length && coins.length < 400; m++) {
                    const md = mounds[m];
                    if (h < md.height) {
                        const a = md.angle + (prng() - 0.5) * 0.04;
                        const d = md.dist + (prng() - 0.5) * 0.04;
                        coins.push({
                            x: Math.sin(a) * d,
                            y: -0.42 + h * 0.034,
                            z: Math.cos(a) * d,
                            rx: (prng() - 0.5) * 0.04,
                            ry: a + h * 0.05 + (prng() - 0.5) * 0.1,
                            rz: (prng() - 0.5) * 0.04
                        });
                    }
                }
            }
            let fillIdx = 0;
            while (coins.length < 400) {
                const md = mounds[fillIdx % mounds.length];
                fillIdx++;
                const a = md.angle + (prng() - 0.5) * 0.3;
                const d = md.dist + (prng() - 0.5) * 0.25;
                coins.push({
                    x: Math.sin(a) * d,
                    y: -0.42 + (fillIdx % 4) * 0.034,
                    z: Math.cos(a) * d,
                    rx: (prng() - 0.5) * 0.1,
                    ry: prng() * Math.PI * 2,
                    rz: (prng() - 0.5) * 0.1
                });
            }

            // Apply all 400 instance matrices
            for (let i = 0; i < MAX_COINS; i++) {
                const c = coins[i];
                dummy.position.set(c.x, c.y, c.z);
                dummy.rotation.set(c.rx, c.ry, c.rz);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                this.treasuryMesh.setMatrixAt(i, dummy.matrix);
            }

            const initialCounts = calculateContinuousCounts(BUDGET_CONFIG.defaultUSD);
            this.treasuryMesh.count = initialCounts.coinCount;
            this.treasuryMesh.instanceMatrix.needsUpdate = true;
        }

        buildBanknotes() {
            const MAX_LOOSE = 30;
            const MAX_BUNDLES = 20;

            // 1. Loose Curved USD Banknotes InstancedMesh
            const billGeo = new THREE.PlaneGeometry(0.65, 0.30, 4, 2);
            const pos = billGeo.attributes.position;
            for (let i = 0; i < pos.count; i++) {
                const px = pos.getX(i);
                pos.setZ(i, -0.012 * (1 - 4 * px * px / (0.65 * 0.65)));
            }
            billGeo.computeVertexNormals();

            this.looseBillsMesh = new THREE.InstancedMesh(billGeo, this.materials.looseBanknote, MAX_LOOSE);
            this.looseBillsMesh.castShadow = true;
            this.pedestalGroup.add(this.looseBillsMesh);

            // 2. Strapped Cash Bundles ($10,000 bricks)
            const bundleGeo = new THREE.BoxGeometry(0.68, 0.065, 0.32);
            this.bundleStacksMesh = new THREE.InstancedMesh(bundleGeo, this.materials.bundleMaterials, MAX_BUNDLES);
            this.bundleStacksMesh.castShadow = true;
            this.bundleStacksMesh.receiveShadow = true;
            this.pedestalGroup.add(this.bundleStacksMesh);

            const prng = createSeededPRNG(54321);
            const dummy = new THREE.Object3D();

            // Setup Loose Banknotes: Organic fanning along the front dais rim
            for (let i = 0; i < MAX_LOOSE; i++) {
                const angle = 0.42 + (i / MAX_LOOSE) * (Math.PI - 0.84) + (prng() - 0.5) * 0.08;
                const dist = 2.02 + (i % 4) * 0.16 + (prng() - 0.5) * 0.06;
                dummy.position.set(
                    Math.sin(angle) * dist,
                    -0.41 + (i % 5) * 0.007,
                    Math.cos(angle) * dist
                );
                dummy.rotation.set(
                    -Math.PI / 2 + 0.04 + (prng() - 0.5) * 0.06,
                    (prng() - 0.5) * 0.08,
                    angle + (prng() - 0.5) * 0.35
                );
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                this.looseBillsMesh.setMatrixAt(i, dummy.matrix);
            }

            // Setup Strapped Cash Bundles: Two organic stacks on left & right dais wings
            for (let i = 0; i < MAX_BUNDLES; i++) {
                const isLeft = i < MAX_BUNDLES / 2;
                const sideIdx = isLeft ? i : i - MAX_BUNDLES / 2;
                const colIdx = Math.floor(sideIdx / 5);
                const rowIdx = sideIdx % 5;

                const baseAngle = isLeft ? -1.95 : 1.95;
                const dist = 1.95 + colIdx * 0.40 + (prng() - 0.5) * 0.04;
                const bx = Math.sin(baseAngle) * dist;
                const bz = Math.cos(baseAngle) * dist;

                dummy.position.set(
                    bx,
                    -0.40 + rowIdx * 0.066,
                    bz
                );
                dummy.rotation.set(
                    (prng() - 0.5) * 0.03,
                    baseAngle + (rowIdx % 2) * 0.06 + (prng() - 0.5) * 0.05,
                    (prng() - 0.5) * 0.03
                );
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                this.bundleStacksMesh.setMatrixAt(i, dummy.matrix);
            }

            const initialCounts = calculateContinuousCounts(BUDGET_CONFIG.defaultUSD);
            this.looseBillsMesh.count = initialCounts.looseCount;
            this.looseBillsMesh.instanceMatrix.needsUpdate = true;
            this.bundleStacksMesh.count = initialCounts.bundleCount;
            this.bundleStacksMesh.instanceMatrix.needsUpdate = true;
        }

        buildPiggyBankHierarchy() {
            this.rootGroup = new THREE.Group();
            this.bodyGroup = new THREE.Group();
            this.rootGroup.add(this.bodyGroup);

            // 1. Torso Geometry & Soft Sculpting
            const torsoGeo = new THREE.SphereGeometry(1.2, 48, 36);
            const posAttr = torsoGeo.attributes.position;
            const v = new THREE.Vector3();
            for (let i = 0; i < posAttr.count; i++) {
                v.fromBufferAttribute(posAttr, i);
                if (v.y < 0) v.y *= 0.88;
                if (v.z > 0.35 && Math.abs(v.x) > 0.4) {
                    v.x *= 1.06;
                    v.y *= 1.02;
                }
                if (v.z < -0.3) v.x *= 1.04;
                posAttr.setXYZ(i, v.x, v.y, v.z);
            }
            torsoGeo.computeVertexNormals();

            this.torsoMesh = new THREE.Mesh(torsoGeo, this.materials.piggyPink);
            this.torsoMesh.scale.set(1.15, 1.05, 1.25);
            this.torsoMesh.position.set(0, 0.5, 0);
            this.torsoMesh.castShadow = true;
            this.torsoMesh.receiveShadow = true;
            this.bodyGroup.add(this.torsoMesh);

            // 2. Snout (Minimalist, compact rounded oval with soft rosy-coral pink)
            this.snoutGroup = new THREE.Group();
            this.snoutGroup.position.set(0, 0.46, 1.44);
            this.bodyGroup.add(this.snoutGroup);

            const snoutBaseGeo = new THREE.CylinderGeometry(0.24, 0.27, 0.14, 32);
            const snoutMesh = new THREE.Mesh(snoutBaseGeo, this.materials.snoutPink);
            snoutMesh.rotation.x = Math.PI / 2;
            snoutMesh.scale.set(1.15, 0.82, 1.0);
            snoutMesh.castShadow = true;
            this.snoutGroup.add(snoutMesh);

            // Nostrils (2 small clean dark dots)
            const nostrilGeo = new THREE.CylinderGeometry(0.030, 0.030, 0.08, 16);
            const leftNostril = new THREE.Mesh(nostrilGeo, this.materials.nostril);
            leftNostril.rotation.x = Math.PI / 2;
            leftNostril.scale.set(0.75, 1.20, 1.0);
            leftNostril.position.set(-0.09, 0.0, 0.075);
            this.snoutGroup.add(leftNostril);

            const rightNostril = leftNostril.clone();
            rightNostril.position.x = 0.09;
            this.snoutGroup.add(rightNostril);

            // 3. Eyes (Minimalist onyx button bead eyes, 0 anime catchlights/twinkles)
            this.eyeGroup = new THREE.Group();
            this.bodyGroup.add(this.eyeGroup);

            const eyeBeadGeo = new THREE.SphereGeometry(0.082, 24, 20);

            const leftEye = new THREE.Mesh(eyeBeadGeo, this.materials.eyeBead);
            leftEye.scale.set(0.92, 1.05, 0.55);
            leftEye.position.set(-0.36, 0.76, 1.39);
            leftEye.rotation.set(-0.06, -0.26, 0);
            leftEye.castShadow = true;
            this.eyeGroup.add(leftEye);

            const rightEye = new THREE.Mesh(eyeBeadGeo, this.materials.eyeBead);
            rightEye.scale.set(0.92, 1.05, 0.55);
            rightEye.position.set(0.36, 0.76, 1.39);
            rightEye.rotation.set(-0.06, 0.26, 0);
            rightEye.castShadow = true;
            this.eyeGroup.add(rightEye);

            // 4. Ears (Cute extruded folded ears with jiggle pivots)
            this.leftEarPivot = new THREE.Group();
            this.leftEarPivot.position.set(-0.75, 1.55, 0.35);
            this.bodyGroup.add(this.leftEarPivot);

            this.rightEarPivot = new THREE.Group();
            this.rightEarPivot.position.set(0.75, 1.55, 0.35);
            this.bodyGroup.add(this.rightEarPivot);

            const earShape = new THREE.Shape();
            earShape.moveTo(0, 0);
            earShape.lineTo(0.35, 0.55);
            earShape.quadraticCurveTo(0.15, 0.62, -0.25, 0.35);
            earShape.closePath();

            const earExtrudeSettings = {
                depth: 0.08,
                bevelEnabled: true,
                bevelSegments: 4,
                steps: 1,
                bevelSize: 0.04,
                bevelThickness: 0.04
            };
            const earGeo = new THREE.ExtrudeGeometry(earShape, earExtrudeSettings);

            const leftEarMesh = new THREE.Mesh(earGeo, this.materials.piggyPink);
            leftEarMesh.rotation.set(0.25, -0.35, 0.75);
            leftEarMesh.scale.set(1.05, 1.05, 1.05);
            leftEarMesh.castShadow = true;
            this.leftEarPivot.add(leftEarMesh);

            const rightEarMesh = new THREE.Mesh(earGeo, this.materials.piggyPink);
            rightEarMesh.rotation.set(0.25, 0.35, -0.75);
            rightEarMesh.scale.set(-1.05, 1.05, 1.05);
            rightEarMesh.castShadow = true;
            this.rightEarPivot.add(rightEarMesh);

            // 5. Legs & Hooves (4 stubby legs)
            this.legsGroup = new THREE.Group();
            this.bodyGroup.add(this.legsGroup);

            const legGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.45, 24);
            const hoofGeo = new THREE.CylinderGeometry(0.28, 0.29, 0.12, 24);

            const legOffsets = [
                { x: -0.55, z: 0.55, rotZ: -0.08 },
                { x: 0.55, z: 0.55, rotZ: 0.08 },
                { x: -0.58, z: -0.55, rotZ: -0.08 },
                { x: 0.58, z: -0.55, rotZ: 0.08 }
            ];

            legOffsets.forEach(pos => {
                const legMesh = new THREE.Mesh(legGeo, this.materials.piggyPink);
                legMesh.position.set(pos.x, -0.16, pos.z);
                legMesh.rotation.z = pos.rotZ;
                legMesh.castShadow = true;
                this.legsGroup.add(legMesh);

                const hoofMesh = new THREE.Mesh(hoofGeo, this.materials.hoofPink);
                hoofMesh.position.set(pos.x, -0.38, pos.z);
                hoofMesh.castShadow = true;
                this.legsGroup.add(hoofMesh);
            });

            // 6. Curly Tail (3D Corkscrew Tube Curve)
            this.tailPivot = new THREE.Group();
            this.tailPivot.position.set(0, 0.60, -1.48);
            this.bodyGroup.add(this.tailPivot);

            const tailGeo = new THREE.TubeGeometry(new PiggyTailCurve(1.0), 40, 0.065, 12, false);
            const tailMesh = new THREE.Mesh(tailGeo, this.materials.piggyPink);
            tailMesh.castShadow = true;
            this.tailPivot.add(tailMesh);

            // 7. Coin Slot on Back (Golden Rim)
            const slotGroup = new THREE.Group();
            slotGroup.position.set(0, 1.55, -0.05);
            this.bodyGroup.add(slotGroup);

            const rimGeo = new THREE.BoxGeometry(0.78, 0.06, 0.16);
            const rimMesh = new THREE.Mesh(rimGeo, this.materials.goldCoin);
            rimMesh.castShadow = true;
            slotGroup.add(rimMesh);

            const slotHoleGeo = new THREE.BoxGeometry(0.68, 0.1, 0.065);
            const slotHoleMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
            const slotHole = new THREE.Mesh(slotHoleGeo, slotHoleMat);
            slotHole.position.y = 0.02;
            slotGroup.add(slotHole);

            return this.rootGroup;
        }
    }

    // =========================================================================
    // 7. PIGGY BANK ASSEMBLY & GROWTH CONTROLLER
    // =========================================================================

    class PiggyBankAssemblyController {
        constructor(builder, viewport) {
            this.builder = builder;
            this.viewport = viewport;
            this.currentUSD = BUDGET_CONFIG.defaultUSD;
            this.currentTier = getTierForUSD(BUDGET_CONFIG.defaultUSD);
            this.lastTierLevel = this.currentTier.level;

            // Check reduced motion preference
            this.prefersReducedMotion = false;
            if (typeof window !== 'undefined' && window.matchMedia) {
                const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
                this.prefersReducedMotion = mql.matches;
                mql.addEventListener('change', (e) => {
                    this.prefersReducedMotion = e.matches;
                });
            }

            const initScale = calculateContinuousScale(this.currentUSD);
            this.scaleSpring = {
                value: initScale,
                velocity: 0,
                target: initScale
            };

            this.squashSpring = {
                scaleY: 1.0,
                velocity: 0
            };
        }

        setBudgetUSD(usdVal, triggerInteraction = true) {
            this.currentUSD = clamp(usdVal, BUDGET_CONFIG.minUSD, BUDGET_CONFIG.maxUSD);
            const newTier = getTierForUSD(this.currentUSD);

            // 1. Continuous Scale Target Update (smooth glide across budget)
            this.scaleSpring.target = calculateContinuousScale(this.currentUSD);

            // 2. Continuous Treasury Counts (organic accumulation)
            this.updateContinuousTreasuryCounts(this.currentUSD);

            // 3. Coin Drop Interaction
            if (triggerInteraction && this.viewport) {
                this.viewport.spawnContinuousCoin();
            }

            // 4. Milestone Celebration on Tier Level Crossing
            if (newTier.level !== this.lastTierLevel) {
                if (triggerInteraction && this.viewport) {
                    for (let i = 0; i < 3; i++) {
                        setTimeout(() => {
                            if (this.viewport) this.viewport.spawnContinuousCoin();
                        }, i * 90);
                    }
                }
            }

            this.currentTier = newTier;
            this.lastTierLevel = newTier.level;
        }

        updateContinuousTreasuryCounts(usdVal) {
            const counts = calculateContinuousCounts(usdVal);
            if (this.builder.treasuryMesh) {
                this.builder.treasuryMesh.count = counts.coinCount;
                this.builder.treasuryMesh.instanceMatrix.needsUpdate = true;
            }
            if (this.builder.looseBillsMesh) {
                this.builder.looseBillsMesh.count = counts.looseCount;
                this.builder.looseBillsMesh.instanceMatrix.needsUpdate = true;
            }
            if (this.builder.bundleStacksMesh) {
                this.builder.bundleStacksMesh.count = counts.bundleCount;
                this.builder.bundleStacksMesh.instanceMatrix.needsUpdate = true;
            }
        }

        // Backward compatibility method
        updateTreasuryCounts(tier) {
            this.updateContinuousTreasuryCounts(this.currentUSD);
        }

        update(dt = 0.016) {
            // 1. Scale Growth Spring Physics (Damped harmonic oscillator)
            const fScale = -24 * (this.scaleSpring.value - this.scaleSpring.target);
            const dScale = -4.5 * this.scaleSpring.velocity;
            this.scaleSpring.velocity += (fScale + dScale) * dt;
            this.scaleSpring.value += this.scaleSpring.velocity * dt;

            const currentScale = this.scaleSpring.value;
            if (this.builder.rootGroup) {
                this.builder.rootGroup.scale.setScalar(currentScale);
                // Keep feet grounded firmly on the dais at any scale
                this.builder.rootGroup.position.y = (currentScale - 1.0) * 0.42;
            }

            // 2. Squash & Stretch Bounce Reaction from coin impact
            const fSquash = -36 * (this.squashSpring.scaleY - 1.0);
            const dSquash = -5.8 * this.squashSpring.velocity;
            this.squashSpring.velocity += (fSquash + dSquash) * dt;
            this.squashSpring.scaleY += this.squashSpring.velocity * dt;

            // 3. Subtle Idle Breathing & Bobbing (tôn trọng prefers-reduced-motion)
            let idleBreath = 0;
            let idleBobY = 0;
            if (!this.prefersReducedMotion) {
                const idleTime = Date.now() * 0.0018; // ~3.5s per breath cycle
                idleBreath = 0.012 * Math.sin(idleTime); // subtle ±1.2% volume breathing
                idleBobY = 0.012 * Math.sin(idleTime);   // subtle ±0.012 vertical float
            }

            if (this.builder.bodyGroup) {
                const sy = this.squashSpring.scaleY * (1.0 + idleBreath);
                const sxz = (1.0 / Math.sqrt(Math.max(0.4, this.squashSpring.scaleY))) * (1.0 - idleBreath * 0.5);
                this.builder.bodyGroup.scale.set(sxz, sy, sxz);
                this.builder.bodyGroup.position.y = idleBobY;
            }

            // 4. Micro-animations: Ear Jiggle & Tail Wag (tôn trọng prefers-reduced-motion)
            if (!this.prefersReducedMotion) {
                const t = Date.now() * 0.003;
                if (this.builder.leftEarPivot && this.builder.rightEarPivot) {
                    this.builder.leftEarPivot.rotation.z = 0.035 * Math.sin(t * 1.5);
                    this.builder.rightEarPivot.rotation.z = -0.035 * Math.sin(t * 1.5);
                }
                if (this.builder.tailPivot) {
                    this.builder.tailPivot.rotation.y = 0.10 * Math.sin(t * 2.0);
                }
            }

            // 5. Update Neon Platform Ring Color
            if (this.builder.platformNeonMat) {
                const targetCol = new THREE.Color(this.currentTier.colorHex);
                this.builder.platformNeonMat.color.lerp(targetCol, 0.08);
            }

            // 6. Dynamic Camera Distance Framing to prevent clipping
            if (this.viewport) {
                this.viewport.updateCameraFraming(currentScale);
            }
        }
    }

    // =========================================================================
    // 8. 3D SHOWROOM VIEWPORT MANAGER (Render Loop, Studio Lighting, Fixed Angle Framing)
    // =========================================================================

    class AircraftShowroomViewport {
        constructor() {
            this.container = null;
            this.renderer = null;
            this.scene = null;
            this.camera = null;
            this.builder = null;
            this.controller = null;
            this.audio = new CoinAudioEngine();
            this.animFrameId = null;

            // Fixed Optimal Front 3/4 Camera Angle (Rock-solid focus on face & coins)
            this.currentAzimuth = 0.16;
            this.targetAzimuth = 0.16;
            this.currentPolar = 1.38;
            this.targetPolar = 1.38;
            this.currentDistance = 7.5;
            this.targetDistance = 7.5;
            this.lookAtTarget = new THREE.Vector3(0, 0.32, 0);

            // Coin drop streaming pool
            this.coinPool = [];
            this.lastCoinSpawnTime = 0;
            this.coinSpawnInterval = 65;
            this.activeParticles = [];
        }

        init(containerElement) {
            if (!containerElement || !window.THREE) return false;
            this.container = containerElement;

            if (this.renderer && this.renderer.domElement && this.container.contains(this.renderer.domElement)) {
                this.container.removeChild(this.renderer.domElement);
            }
            if (this.animFrameId) cancelAnimationFrame(this.animFrameId);

            const width = this.container.clientWidth || 800;
            const height = this.container.clientHeight || 500;

            // Scene setup (Clean deep navy backdrop #070c18)
            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x070c18);
            this.scene.fog = new THREE.FogExp2(0x070c18, 0.020);

            // Camera setup with 38 deg FOV
            this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);

            // WebGL Renderer with balanced exposure
            this.renderer = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true,
                powerPreference: 'high-performance'
            });
            this.renderer.setSize(width, height);
            const isMobile = window.innerWidth <= 768;
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2.0));
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 0.92; // Controlled studio exposure, zero blowout
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            this.renderer.domElement.id = 'aircraft-showroom-webgl';
            this.renderer.domElement.style.width = '100%';
            this.renderer.domElement.style.height = '100%';
            this.renderer.domElement.style.display = 'block';
            this.renderer.domElement.style.touchAction = 'pan-y';
            this.container.appendChild(this.renderer.domElement);

            // Balanced Soft Studio Lighting Setup
            this.setupLighting();

            // Build Platform & Piggy Bank Model
            this.builder = new PiggyBankModularBuilder();
            this.builder.initMaterials();
            this.builder.buildShowroomPlatform(this.scene);
            const piggyModel = this.builder.buildPiggyBankHierarchy();
            this.scene.add(piggyModel);

            // Reusable Continuous Coin Pool & Starburst Particle Pool
            this.buildCoinPool();
            this.buildParticlePool();

            // Animation & Growth Controller
            this.controller = new PiggyBankAssemblyController(this.builder, this);
            this.controller.setBudgetUSD(BUDGET_CONFIG.defaultUSD, false);

            // Calculate Initial Camera Framing
            this.updateCameraFraming(this.controller.scaleSpring.value);
            this.currentDistance = this.targetDistance;

            // Bind Touch & Mouse Controls (Unlocks audio, locks camera)
            this.bindOrbitControls();

            // Start Render Loop
            this.startLoop();

            // Resize Observer
            window.addEventListener('resize', () => this.handleResize());
            return true;
        }

        setupLighting() {
            // Soft Neutral Daylight Ambient
            const ambient = new THREE.AmbientLight(0xf1f5f9, 0.55);
            this.scene.add(ambient);

            // Main Warm Studio Key Light
            const keyLight = new THREE.DirectionalLight(0xfffaed, 0.85);
            keyLight.position.set(5, 12, 10);
            keyLight.castShadow = true;
            keyLight.shadow.mapSize.width = 1024;
            keyLight.shadow.mapSize.height = 1024;
            keyLight.shadow.bias = -0.001;
            this.scene.add(keyLight);
            this.keyLight = keyLight;

            // Soft Neutral Fill Light (retains true material colors)
            const fillLight = new THREE.DirectionalLight(0xe0f2fe, 0.42);
            fillLight.position.set(-7, 6, 8);
            this.scene.add(fillLight);

            // Subtle Backlight / Rim Light (separates character from dark navy background)
            const rimLight = new THREE.DirectionalLight(0xdbeafe, 0.32);
            rimLight.position.set(0, 8, -9);
            this.scene.add(rimLight);
        }

        buildCoinPool() {
            this.coinPool = [];
            const POOL_SIZE = 35;
            const coinGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.035, 20);

            for (let i = 0; i < POOL_SIZE; i++) {
                const mesh = new THREE.Mesh(coinGeo, this.builder.materials.goldCoin);
                mesh.castShadow = true;
                mesh.visible = false;
                this.scene.add(mesh);

                this.coinPool.push({
                    mesh,
                    inUse: false,
                    p0: new THREE.Vector3(),
                    p1: new THREE.Vector3(),
                    p2: new THREE.Vector3(),
                    p3: new THREE.Vector3(),
                    progress: 0,
                    duration: 0.44,
                    rotX: 0, rotY: 0, rotZ: 0
                });
            }
        }

        buildParticlePool() {
            this.particleGroup = new THREE.Group();
            this.scene.add(this.particleGroup);

            this.goldStarGeo = new THREE.PlaneGeometry(0.10, 0.10);
            this.goldStarMat = new THREE.MeshBasicMaterial({
                color: 0xd4af37,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            this.activeParticles = [];
        }

        spawnContinuousCoin() {
            const now = performance.now();
            if (now - this.lastCoinSpawnTime < this.coinSpawnInterval) return;
            this.lastCoinSpawnTime = now;

            const coin = this.coinPool.find(c => !c.inUse);
            if (!coin) return;

            coin.inUse = true;
            coin.progress = 0;
            coin.duration = 0.45;
            coin.mesh.visible = true;

            const currentScale = this.controller ? this.controller.scaleSpring.value : 1.0;
            const targetY = (1.55 * currentScale) + (currentScale - 1.0) * 0.42;
            const targetZ = -0.05 * currentScale;
            coin.p3.set(0, targetY, targetZ);

            const startX = (Math.random() - 0.5) * 0.35;
            const startY = targetY + 1.8 + Math.random() * 0.4;
            const startZ = targetZ + 0.3 + (Math.random() - 0.5) * 0.25;
            coin.p0.set(startX, startY, startZ);

            coin.p1.set(startX * 0.8, startY - 0.3, startZ + 0.1);
            coin.p2.set(startX * 0.3, targetY + 0.5, targetZ + 0.05);

            coin.rotX = (Math.random() - 0.5) * 18;
            coin.rotY = (Math.random() - 0.5) * 18;
            coin.rotZ = (Math.random() - 0.5) * 18;
        }

        getBezierPoint(p0, p1, p2, p3, t) {
            const u = 1 - t;
            const tt = t * t;
            const uu = u * u;
            const uuu = uu * u;
            const ttt = tt * t;

            const res = new THREE.Vector3();
            res.addScaledVector(p0, uuu);
            res.addScaledVector(p1, 3 * uu * t);
            res.addScaledVector(p2, 3 * u * tt);
            res.addScaledVector(p3, ttt);
            return res;
        }

        onCoinEnteredSlot(pos) {
            if (this.controller) {
                this.controller.squashSpring.velocity = -0.24;
            }

            if (this.audio) {
                this.audio.playCoinDrop();
            }

            const count = 6;
            for (let i = 0; i < count; i++) {
                const pMesh = new THREE.Mesh(this.goldStarGeo, this.goldStarMat);
                pMesh.position.copy(pos);
                this.particleGroup.add(pMesh);

                const angle = Math.random() * Math.PI * 2;
                const speed = 1.2 + Math.random() * 1.5;
                this.activeParticles.push({
                    mesh: pMesh,
                    vx: Math.cos(angle) * speed * 0.6,
                    vy: Math.sin(angle) * speed * 0.6 + 1.2,
                    vz: (Math.random() - 0.5) * speed * 0.6,
                    life: 0,
                    maxLife: 0.35 + Math.random() * 0.2
                });
            }
        }

        updateCameraFraming(currentScale = 1.0) {
            if (!this.container || !this.camera) return;
            const w = this.container.clientWidth || window.innerWidth;
            const h = this.container.clientHeight || window.innerHeight;
            if (w === 0 || h === 0) return;

            const aspect = w / h;
            this.camera.aspect = aspect;

            const topY = 0.16 + 2.15 * currentScale;
            const bottomY = -0.45;
            const modelHeight = (topY - bottomY) * 1.38;
            const modelWidth = (3.4 * currentScale + 1.2) * 1.35;

            const vFovRad = (this.camera.fov * Math.PI) / 180;
            const distForHeight = modelHeight / (2 * Math.tan(vFovRad / 2));
            const distForWidth = modelWidth / (2 * Math.tan(vFovRad / 2) * aspect);

            this.targetDistance = Math.max(distForHeight, distForWidth, 7.2);

            const centerY = (topY + bottomY) * 0.45;
            this.lookAtTarget.set(0, Math.max(0.25, centerY), 0);

            this.camera.updateProjectionMatrix();
        }

        updateCameraOrbit() {
            const x = this.currentDistance * Math.sin(this.currentPolar) * Math.sin(this.currentAzimuth);
            const y = this.currentDistance * Math.cos(this.currentPolar);
            const z = this.currentDistance * Math.sin(this.currentPolar) * Math.cos(this.currentAzimuth);
            this.camera.position.set(x, y + this.lookAtTarget.y, z);
            this.camera.lookAt(this.lookAtTarget);
        }

        bindOrbitControls() {
            // Camera angle is fixed and stable; click unlocks Web Audio context
            const el = this.container;
            const onStart = () => {
                if (this.audio) this.audio.init();
            };
            el.addEventListener('mousedown', onStart);
            el.addEventListener('touchstart', onStart, { passive: true });
        }

        handleResize() {
            if (!this.container || !this.renderer || !this.camera) return;
            const w = this.container.clientWidth;
            const h = this.container.clientHeight;
            if (w === 0 || h === 0) return;

            const curScale = this.controller ? this.controller.scaleSpring.value : 1.0;
            this.updateCameraFraming(curScale);
            this.renderer.setSize(w, h);
        }

        startLoop() {
            let lastTime = performance.now();

            const tick = () => {
                this.animFrameId = requestAnimationFrame(tick);
                const now = performance.now();
                const dt = Math.min((now - lastTime) / 1000, 0.1);
                lastTime = now;

                // 1. Update Piggy Growth & Squash Springs
                if (this.controller) {
                    this.controller.update(dt);
                }

                // 2. Update Continuous Coins in Flight
                for (let i = 0; i < this.coinPool.length; i++) {
                    const coin = this.coinPool[i];
                    if (!coin.inUse) continue;

                    coin.progress += dt / coin.duration;
                    if (coin.progress >= 1.0) {
                        coin.inUse = false;
                        coin.mesh.visible = false;
                        this.onCoinEnteredSlot(coin.p3);
                    } else {
                        const pt = this.getBezierPoint(coin.p0, coin.p1, coin.p2, coin.p3, coin.progress);
                        coin.mesh.position.copy(pt);
                        coin.mesh.rotation.x += coin.rotX * dt;
                        coin.mesh.rotation.y += coin.rotY * dt;
                        coin.mesh.rotation.z += coin.rotZ * dt;
                    }
                }

                // 3. Update Sparkle Star Particles
                for (let i = this.activeParticles.length - 1; i >= 0; i--) {
                    const p = this.activeParticles[i];
                    p.life += dt;
                    if (p.life >= p.maxLife) {
                        this.particleGroup.remove(p.mesh);
                        this.activeParticles.splice(i, 1);
                    } else {
                        p.mesh.position.x += p.vx * dt;
                        p.mesh.position.y += p.vy * dt;
                        p.mesh.position.z += p.vz * dt;
                        p.vy -= 4.5 * dt;
                        const alpha = 1.0 - (p.life / p.maxLife);
                        p.mesh.scale.setScalar(alpha);
                    }
                }

                // 4. Differential Rotating Compass Rings
                if (this.builder && this.builder.compassRings) {
                    this.builder.compassRings.forEach(r => {
                        r.group.rotation.y += r.speed;
                    });
                }

                // 5. Floating Ambience Particles
                if (this.builder && this.builder.particleSystem) {
                    const ps = this.builder.particleSystem;
                    const pos = ps.positions;
                    for (let i = 0; i < ps.count; i++) {
                        pos[i * 3 + 1] += ps.velocities[i];
                        if (pos[i * 3 + 1] > 4.5) {
                            pos[i * 3 + 1] = -0.5;
                        }
                    }
                    ps.geometry.attributes.position.needsUpdate = true;
                }

                // 5.1 Subtle Treasury Shimmer on Gold Coins (tôn trọng prefers-reduced-motion)
                if (this.keyLight && this.controller && !this.controller.prefersReducedMotion) {
                    this.keyLight.position.x = 5.0 + Math.sin(now * 0.0006) * 0.35;
                }

                // 6. Camera Orbit Smoothing (Fixed stable angle)
                this.currentAzimuth += (this.targetAzimuth - this.currentAzimuth) * 0.10;
                this.currentPolar += (this.targetPolar - this.currentPolar) * 0.10;
                this.currentDistance += (this.targetDistance - this.currentDistance) * 0.10;
                this.updateCameraOrbit();

                // 7. Render Three.js Scene
                if (this.renderer && this.scene && this.camera) {
                    this.renderer.render(this.scene, this.camera);
                }
            };
            tick();
        }

        pause() {
            if (this.animFrameId) {
                cancelAnimationFrame(this.animFrameId);
                this.animFrameId = null;
            }
        }

        resume() {
            if (!this.animFrameId) {
                this.startLoop();
            }
        }
    }

    // =========================================================================
    // 9. EXPORT TO GLOBAL WINDOW OBJECT (Preserving 100% Backward Compatibility)
    // =========================================================================

    window.BUDGET_CONFIG = BUDGET_CONFIG;
    window.CURRENCIES = CURRENCIES;
    window.TIERS = TIERS;
    window.ALLOCATION_CATEGORIES = ALLOCATION_CATEGORIES;
    window.BudgetTripCalculator = BudgetTripCalculator;
    window.PiggyBankModularBuilder = PiggyBankModularBuilder;
    window.AircraftModularBuilder = PiggyBankModularBuilder;
    window.PiggyBankAssemblyController = PiggyBankAssemblyController;
    window.AircraftAssemblyController = PiggyBankAssemblyController;
    window.BudgetShowroomViewport = AircraftShowroomViewport;
    window.AircraftShowroomViewport = AircraftShowroomViewport;
    window.CoinAudioEngine = CoinAudioEngine;
    window.formatCurrency = formatCurrency;
    window.getTierForUSD = getTierForUSD;
    window.calculateContinuousScale = calculateContinuousScale;
    window.calculateContinuousCounts = calculateContinuousCounts;

})(typeof window !== 'undefined' ? window : this);
