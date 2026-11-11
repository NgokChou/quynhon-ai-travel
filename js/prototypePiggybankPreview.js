/**
 * Quy Nhon AI Travel – Piggy Bank Growth Game Prototype
 * File: js/prototypePiggybankPreview.js
 *
 * Sprint C.1.6: Casual Piggy Bank Growth Game
 *
 * Core Mechanics:
 * - Dragging the slider continuously streams shiny gold coins into the piggy's back slot.
 * - Each coin impact produces a gentle squishy bounce (squash & stretch).
 * - The single pink pastel piggy bank visibly grows larger across 5 tiers (0.70x -> 1.38x).
 * - Gold coins and stacks visibly accumulate on the pedestal from scattered coins to a full treasury.
 * - High performance: Reusable coin pool + InstancedMesh for 400 gold coins (1 draw call).
 * - Full responsive framing for Desktop 1440x900 and Mobile (360x800, 390x844, 412x915).
 */

(function () {
    'use strict';

    // =========================================================================
    // 1. CONFIGURATION & TIER DEFINITIONS
    // =========================================================================
    const TIERS = {
        1: {
            name: "Tier 1 – Nhỏ Xinh ($500+)",
            shortName: "Nhỏ Xinh",
            minBudget: 500,
            maxBudget: 1499,
            icon: "🌱",
            pillClass: "tier-1",
            scale: 0.70,
            coinCount: 16,
            travelTitle: "Du lịch Ba-lô & Khám phá địa phương",
            travelDesc: "Nghỉ tại Homestay xinh xắn ven biển Nhơn Lý, thưởng thức bánh xèo tôm nhảy, bánh hỏi cháo lòng và đạp xe quanh đầm Thị Nại."
        },
        2: {
            name: "Tier 2 – Tròn Trĩnh ($1.5K+)",
            shortName: "Tròn Trĩnh",
            minBudget: 1500,
            maxBudget: 3999,
            icon: "🧭",
            pillClass: "tier-2",
            scale: 0.85,
            coinCount: 48,
            travelTitle: "Phượt thủ Thông minh & Trải nghiệm Kỳ Co",
            travelDesc: "Khách sạn 3-4 sao trung tâm Quy Nhơn, tour cano lặn ngắm san hô Bãi Dứa, cắm trại đón bình minh tại khu dã ngoại Trung Lương."
        },
        3: {
            name: "Tier 3 – Mũm Mĩm ($4K+)",
            shortName: "Mũm Mĩm",
            minBudget: 4000,
            maxBudget: 9999,
            icon: "⚓",
            pillClass: "tier-3",
            scale: 1.02,
            coinCount: 110,
            travelTitle: "Nghỉ dưỡng Cao cấp & Tiệc hải sản Hoàng hôn",
            travelDesc: "Resort 4-5 sao mặt biển FLC / Maia Resort, tiệc hải sản tôm hùm tươi sống ngắm hoàng hôn Eo Gió, xe limousine đón tiễn riêng."
        },
        4: {
            name: "Tier 4 – Khổng Lồ ($10K+)",
            shortName: "Khổng Lồ",
            minBudget: 10000,
            maxBudget: 24999,
            icon: "👑",
            pillClass: "tier-4",
            scale: 1.20,
            coinCount: 230,
            travelTitle: "Villa Hồ bơi vô cực & Du thuyền Vịnh Quy Nhơn",
            travelDesc: "Private Pool Villa tại Anantara Quy Nhon Villas, trải nghiệm du thuyền cá nhân dạo vịnh Xuân Đài, trị liệu spa thảo dược truyền thống."
        },
        5: {
            name: "Tier 5 – Đại Phú Hào ($25K+)",
            shortName: "Đại Phú Hào",
            minBudget: 25000,
            maxBudget: 50000,
            icon: "💎",
            pillClass: "tier-5",
            scale: 1.38,
            coinCount: 400,
            travelTitle: "Kho Vàng Hoàng Gia – Trực thăng & Thuê trọn bãi biển",
            travelDesc: "Trực thăng riêng ngắm toàn cảnh Ghềnh Ráng Tiên Sa, phục vụ cá nhân 24/7, đầu bếp Michelin nấu tiệc riêng trên bãi biển Kỳ Co độc quyền."
        }
    };

    // =========================================================================
    // 2. HELPER MATHEMATICAL CURVES (Piggy Corkscrew Tail)
    // =========================================================================
    class PiggyTailCurve extends THREE.Curve {
        constructor(scale = 1.0) {
            super();
            this.scale = scale;
        }
        getPoint(t) {
            const turns = 2.4;
            const angle = t * turns * Math.PI * 2;
            const radius = 0.12 * (1 - t * 0.35) * this.scale;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius + t * 0.04 * this.scale;
            const z = -t * 0.38 * this.scale;
            return new THREE.Vector3(x, y, z);
        }
    }

    // =========================================================================
    // 3. MAIN PIGGY BANK 3D SCENE & ENGINE
    // =========================================================================
    class PiggyBankApp {
        constructor() {
            this.container = document.getElementById('viewport-container');
            this.canvas = document.getElementById('piggy-canvas');
            this.scoreContainer = document.getElementById('score-popup-container');

            // State
            this.currentBudget = 2500;
            this.currentTier = 2;
            this.coinsFedCount = 0;
            this.autoRotate = true;
            this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            this.clock = new THREE.Clock();

            // Camera Orbit angles (Hero 3/4 angle tilted to view cute face clearly)
            this.targetAzimuth = 0.42; // ~24 degrees
            this.currentAzimuth = 0.42;
            this.targetPolar = 1.32;   // ~75 degrees (close to eye-level)
            this.currentPolar = 1.32;
            this.targetDistance = 7.0;
            this.currentDistance = 7.0;
            this.lookAtTarget = new THREE.Vector3(0, 0.35, 0);

            // Pointer interaction
            this.isPointerDown = false;
            this.lastPointerX = 0;
            this.lastPointerY = 0;
            this.lastInteractionTime = performance.now();
            this.pinchInitialDistance = null;

            // Continuous Coin Stream Manager
            this.isDraggingSlider = false;
            this.lastSliderValue = 2500;
            this.lastCoinSpawnTime = 0;
            this.coinSpawnInterval = 85; // ms between coins
            this.activeCoinCount = 0;

            // Physics Springs
            this.squashSpring = { value: 1.0, velocity: 0, target: 1.0 };
            this.scaleSpring = { value: TIERS[2].scale, velocity: 0, target: TIERS[2].scale };
            this.displayedCoinCount = TIERS[2].coinCount;

            this.initThree();
            this.buildEnvironment();
            this.buildTreasury();
            this.buildPiggyBank();
            this.buildCoinPool();
            this.buildParticlePool();
            this.bindDOMEvents();
            this.bindPointerControls();
            this.updateTier(this.currentTier, false);

            this.onResize();
            window.addEventListener('resize', () => this.onResize());

            // Start Render Loop
            this.animate = this.animate.bind(this);
            requestAnimationFrame(this.animate);
        }

        // ---------------------------------------------------------------------
        // 3.1 Initialize Three.js Core
        // ---------------------------------------------------------------------
        initThree() {
            const width = this.container.clientWidth || window.innerWidth;
            const height = this.container.clientHeight || window.innerHeight;

            this.scene = new THREE.Scene();
            this.scene.background = new THREE.Color(0x0c0a1d);
            this.scene.fog = new THREE.FogExp2(0x0c0a1d, 0.040);

            this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
            this.updateCameraTransform();

            this.renderer = new THREE.WebGLRenderer({
                canvas: this.canvas,
                antialias: true,
                powerPreference: 'high-performance'
            });
            this.renderer.setSize(width, height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
            this.renderer.toneMappingExposure = 1.08;
            if (THREE.sRGBEncoding) {
                this.renderer.outputEncoding = THREE.sRGBEncoding;
            }
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            // Lighting Setup - Warm studio lighting with rich color vibrancy
            const ambient = new THREE.AmbientLight(0xf3e8ff, 0.7);
            this.scene.add(ambient);

            // Key Light (Warm golden sunlight)
            this.keyLight = new THREE.DirectionalLight(0xfff7ed, 1.15);
            this.keyLight.position.set(5.0, 7.5, 5.5);
            this.keyLight.castShadow = true;
            this.keyLight.shadow.mapSize.width = 1024;
            this.keyLight.shadow.mapSize.height = 1024;
            this.keyLight.shadow.camera.near = 1;
            this.keyLight.shadow.camera.far = 25;
            this.keyLight.shadow.camera.left = -4;
            this.keyLight.shadow.camera.right = 4;
            this.keyLight.shadow.camera.top = 4;
            this.keyLight.shadow.camera.bottom = -4;
            this.keyLight.shadow.bias = -0.0006;
            this.scene.add(this.keyLight);

            // Rim Light (Cyan highlight carving silhouette)
            this.rimLight = new THREE.DirectionalLight(0x38bdf8, 1.25);
            this.rimLight.position.set(-5.5, 3.2, -4.5);
            this.scene.add(this.rimLight);

            // Fill Light (Warm strawberry bounce for cute rosy cheeks)
            this.fillLight = new THREE.PointLight(0xff8fab, 0.75, 10);
            this.fillLight.position.set(0, 0.6, 3.2);
            this.scene.add(this.fillLight);

            // Pedestal Ambient Core Light
            this.coreLight = new THREE.PointLight(0xa855f7, 0.65, 8);
            this.coreLight.position.set(0, -0.3, 0);
            this.scene.add(this.coreLight);
        }

        // ---------------------------------------------------------------------
        // 3.2 Build Environment & Floating Fantasy Pedestal
        // ---------------------------------------------------------------------
        buildEnvironment() {
            this.pedestalGroup = new THREE.Group();
            this.scene.add(this.pedestalGroup);

            // Base Ring Plinth
            const plinthGeo = new THREE.CylinderGeometry(2.7, 2.9, 0.32, 48);
            const plinthMat = new THREE.MeshStandardMaterial({
                color: 0x171433,
                roughness: 0.45,
                metalness: 0.25
            });
            const plinth = new THREE.Mesh(plinthGeo, plinthMat);
            plinth.position.y = -0.75;
            plinth.receiveShadow = true;
            this.pedestalGroup.add(plinth);

            // Glowing Cyan Groove Ring
            const grooveGeo = new THREE.TorusGeometry(2.76, 0.035, 16, 48);
            const grooveMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
            const groove = new THREE.Mesh(grooveGeo, grooveMat);
            groove.rotation.x = Math.PI / 2;
            groove.position.y = -0.62;
            this.pedestalGroup.add(groove);

            // Upper Dais (Polished surface)
            const daisGeo = new THREE.CylinderGeometry(2.5, 2.6, 0.25, 48);
            const daisMat = new THREE.MeshStandardMaterial({
                color: 0x241d47,
                roughness: 0.3,
                metalness: 0.15
            });
            const dais = new THREE.Mesh(daisGeo, daisMat);
            dais.position.y = -0.48;
            dais.receiveShadow = true;
            this.pedestalGroup.add(dais);

            // Gold Beveled Trim on Dais Edge
            const trimGeo = new THREE.TorusGeometry(2.52, 0.045, 16, 48);
            const trimMat = new THREE.MeshStandardMaterial({
                color: 0xffd700,
                roughness: 0.2,
                metalness: 0.9
            });
            const trim = new THREE.Mesh(trimGeo, trimMat);
            trim.rotation.x = Math.PI / 2;
            trim.position.y = -0.36;
            this.pedestalGroup.add(trim);

            // Inscribed Gold Runes
            const innerRingGeo = new THREE.RingGeometry(1.6, 1.66, 48);
            const innerRingMat = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.45
            });
            const innerRing = new THREE.Mesh(innerRingGeo, innerRingMat);
            innerRing.rotation.x = -Math.PI / 2;
            innerRing.position.y = -0.355;
            this.pedestalGroup.add(innerRing);

            // Ambient Floating Dust
            const dustCount = 80;
            const dustGeo = new THREE.BufferGeometry();
            const dustPos = new Float32Array(dustCount * 3);
            for (let i = 0; i < dustCount * 3; i += 3) {
                dustPos[i] = (Math.random() - 0.5) * 12;
                dustPos[i + 1] = Math.random() * 6 - 1;
                dustPos[i + 2] = (Math.random() - 0.5) * 12;
            }
            dustGeo.setAttribute('position', new THREE.BufferAttribute(dustPos, 3));
            const dustMat = new THREE.PointsMaterial({
                color: 0xffd700,
                size: 0.08,
                transparent: true,
                opacity: 0.55,
                blending: THREE.AdditiveBlending
            });
            this.dustParticles = new THREE.Points(dustGeo, dustMat);
            this.scene.add(this.dustParticles);
        }

        // ---------------------------------------------------------------------
        // 3.3 Build Pedestal Gold Treasury (InstancedMesh: 400 Coins in 1 Draw Call)
        // ---------------------------------------------------------------------
        buildTreasury() {
            const MAX_COINS = 420;
            const coinGeo = new THREE.CylinderGeometry(0.14, 0.14, 0.035, 20);
            const coinMat = new THREE.MeshStandardMaterial({
                color: 0xffd700,
                roughness: 0.18,
                metalness: 0.94
            });

            this.treasuryMesh = new THREE.InstancedMesh(coinGeo, coinMat, MAX_COINS);
            this.treasuryMesh.castShadow = true;
            this.treasuryMesh.receiveShadow = true;
            this.pedestalGroup.add(this.treasuryMesh);

            // Pre-calculate 400 coin transforms:
            // 0-48: Loose scattered coins around the feet
            // 49-110: Small stacks (3-5 coins tall) on flanks
            // 111-230: Multiple medium stacks (6-9 coins tall)
            // 231-400: Grand treasury double-ring of tall stacks surrounding the dais
            const dummy = new THREE.Object3D();
            let idx = 0;

            // Group 1: 16 scattered coins (Tier 1)
            const t1Coins = [
                { x: 0.75, z: 0.75, rY: 0.4 }, { x: -0.75, z: 0.75, rY: 1.2 },
                { x: 0.9, z: 0.4, rY: 0.8 }, { x: -0.9, z: 0.4, rY: 2.1 },
                { x: 0.4, z: 1.05, rY: 0.5 }, { x: -0.4, z: 1.05, rY: 1.7 },
                { x: 0.0, z: 1.15, rY: 0.2 }, { x: 0.25, z: 1.2, rY: 1.4 },
                { x: -0.25, z: 1.2, rY: 2.7 }, { x: 1.1, z: 0.0, rY: 0.9 },
                { x: -1.1, z: 0.0, rY: 0.3 }, { x: 0.8, z: -0.4, rY: 1.6 },
                { x: -0.8, z: -0.4, rY: 2.4 }, { x: 0.5, z: -0.8, rY: 0.7 },
                { x: -0.5, z: -0.8, rY: 1.1 }, { x: 0.0, z: -1.1, rY: 0.0 }
            ];

            t1Coins.forEach(c => {
                dummy.position.set(c.x, -0.34, c.z);
                dummy.rotation.set(0, c.rY, 0);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                this.treasuryMesh.setMatrixAt(idx++, dummy.matrix);
            });

            // Group 2: 32 additional scattered coins (Tier 2 total: 48)
            for (let i = 0; i < 32; i++) {
                const angle = (i / 32) * Math.PI * 2;
                const r = 1.25 + (Math.sin(i * 3.7) * 0.25);
                dummy.position.set(Math.cos(angle) * r, -0.34, Math.sin(angle) * r);
                dummy.rotation.set((i % 3 === 0 ? 0.15 : 0), angle * 1.5, 0);
                dummy.scale.set(1, 1, 1);
                dummy.updateMatrix();
                this.treasuryMesh.setMatrixAt(idx++, dummy.matrix);
            }

            // Group 3: 10 Mini coin stacks of 6 coins each (Tier 3 total: 110)
            const stackAnglesT3 = [0.3, 0.7, 1.2, 1.9, 2.4, 3.5, 4.0, 4.5, 5.2, 5.8];
            stackAnglesT3.forEach(angle => {
                const r = 1.45;
                const stackHeight = 6;
                const baseX = Math.cos(angle) * r;
                const baseZ = Math.sin(angle) * r;
                for (let h = 0; h < stackHeight; h++) {
                    dummy.position.set(baseX, -0.34 + h * 0.038, baseZ);
                    dummy.rotation.set(0, angle + h * 0.1, 0);
                    dummy.scale.set(1, 1, 1);
                    dummy.updateMatrix();
                    this.treasuryMesh.setMatrixAt(idx++, dummy.matrix);
                }
            });

            // Group 4: 15 Medium/Tall stacks of 8 coins each (Tier 4 total: 230)
            for (let i = 0; i < 15; i++) {
                const angle = (i / 15) * Math.PI * 2 + 0.1;
                const r = 1.75;
                const stackHeight = 8;
                const baseX = Math.cos(angle) * r;
                const baseZ = Math.sin(angle) * r;
                for (let h = 0; h < stackHeight; h++) {
                    dummy.position.set(baseX, -0.34 + h * 0.038, baseZ);
                    dummy.rotation.set(0, angle + h * 0.15, 0);
                    dummy.scale.set(1, 1, 1);
                    dummy.updateMatrix();
                    this.treasuryMesh.setMatrixAt(idx++, dummy.matrix);
                }
            }

            // Group 5: Outer Treasure Wall stacks of 10-12 coins each (Tier 5 total: 400)
            const remaining = MAX_COINS - idx;
            const outerStacks = Math.floor(remaining / 10);
            for (let i = 0; i < outerStacks; i++) {
                const angle = (i / outerStacks) * Math.PI * 2;
                const r = 2.05;
                const stackHeight = 10;
                const baseX = Math.cos(angle) * r;
                const baseZ = Math.sin(angle) * r;
                for (let h = 0; h < stackHeight && idx < MAX_COINS; h++) {
                    dummy.position.set(baseX, -0.34 + h * 0.038, baseZ);
                    dummy.rotation.set(0, angle + h * 0.12, 0);
                    dummy.scale.set(1, 1, 1);
                    dummy.updateMatrix();
                    this.treasuryMesh.setMatrixAt(idx++, dummy.matrix);
                }
            }

            this.treasuryMesh.count = TIERS[2].coinCount;
            this.treasuryMesh.instanceMatrix.needsUpdate = true;
        }

        // ---------------------------------------------------------------------
        // 3.4 Build 3D Piggy Bank Character (Clean, Chubby, Same Pink Pastel)
        // ---------------------------------------------------------------------
        buildPiggyBank() {
            this.piggyRoot = new THREE.Group();
            this.scene.add(this.piggyRoot);

            // bodyGroup carries the squash & stretch deformation
            this.bodyGroup = new THREE.Group();
            this.piggyRoot.add(this.bodyGroup);

            // 1. Torso Geometry & Custom Soft Sculpting
            const torsoGeo = new THREE.SphereGeometry(1.2, 48, 36);
            const posAttr = torsoGeo.attributes.position;
            const v = new THREE.Vector3();
            for (let i = 0; i < posAttr.count; i++) {
                v.fromBufferAttribute(posAttr, i);

                // Flatten bottom slightly for stable seated posture
                if (v.y < 0) {
                    v.y *= 0.88;
                }
                // Cheek puffing
                if (v.z > 0.35 && Math.abs(v.x) > 0.4) {
                    v.x *= 1.06;
                    v.y *= 1.02;
                }
                // Chubby peach rear
                if (v.z < -0.3) {
                    v.x *= 1.04;
                }

                posAttr.setXYZ(i, v.x, v.y, v.z);
            }
            torsoGeo.computeVertexNormals();

            // Materials - Consistent sweet strawberry-milk pastel pink for all tiers
            this.pinkPiggyMaterial = new THREE.MeshStandardMaterial({
                color: 0xff8fab, // Rich pastel pink
                roughness: 0.24,
                metalness: 0.06
            });

            this.torsoMesh = new THREE.Mesh(torsoGeo, this.pinkPiggyMaterial);
            this.torsoMesh.scale.set(1.15, 1.05, 1.25);
            this.torsoMesh.position.set(0, 0.5, 0);
            this.torsoMesh.castShadow = true;
            this.torsoMesh.receiveShadow = true;
            this.bodyGroup.add(this.torsoMesh);

            // 2. Snout (Mõm heo tối giản, nhỏ nhắn, bo tròn tinh tế)
            const snoutGroup = new THREE.Group();
            snoutGroup.position.set(0, 0.46, 1.44);
            this.bodyGroup.add(snoutGroup);

            const snoutBaseGeo = new THREE.CylinderGeometry(0.24, 0.27, 0.14, 32);
            this.snoutPinkMat = new THREE.MeshStandardMaterial({
                color: 0xf472b6, // Soft rosy pink, deeper than body
                roughness: 0.35,
                metalness: 0.02
            });
            this.snoutMesh = new THREE.Mesh(snoutBaseGeo, this.snoutPinkMat);
            this.snoutMesh.rotation.x = Math.PI / 2;
            this.snoutMesh.scale.set(1.15, 0.82, 1.0);
            this.snoutMesh.castShadow = true;
            snoutGroup.add(this.snoutMesh);

            // Nostrils (2 lỗ mũi nhỏ gọn, cân đối)
            const nostrilGeo = new THREE.CylinderGeometry(0.030, 0.030, 0.08, 16);
            const nostrilMat = new THREE.MeshStandardMaterial({
                color: 0x831843, // Deep berry pink
                roughness: 0.45,
                metalness: 0.0
            });
            const leftNostril = new THREE.Mesh(nostrilGeo, nostrilMat);
            leftNostril.rotation.x = Math.PI / 2;
            leftNostril.scale.set(0.75, 1.20, 1.0);
            leftNostril.position.set(-0.09, 0.0, 0.075);
            snoutGroup.add(leftNostril);

            const rightNostril = leftNostril.clone();
            rightNostril.position.x = 0.09;
            snoutGroup.add(rightNostril);

            // 3. Eyes (Đôi mắt cúc áo đen tối giản - Minimalist button eyes, không anime, không catchlight/twinkle)
            const eyeGroup = new THREE.Group();
            this.bodyGroup.add(eyeGroup);

            const eyeBeadGeo = new THREE.SphereGeometry(0.082, 24, 20);
            const eyeBeadMat = new THREE.MeshStandardMaterial({
                color: 0x18181b, // Dark onyx charcoal
                roughness: 0.30,
                metalness: 0.05
            });

            // Left Eye
            const leftEye = new THREE.Mesh(eyeBeadGeo, eyeBeadMat);
            leftEye.scale.set(0.92, 1.05, 0.55);
            leftEye.position.set(-0.36, 0.76, 1.39);
            leftEye.rotation.set(-0.06, -0.26, 0);
            leftEye.castShadow = true;
            eyeGroup.add(leftEye);

            // Right Eye
            const rightEye = new THREE.Mesh(eyeBeadGeo, eyeBeadMat);
            rightEye.scale.set(0.92, 1.05, 0.55);
            rightEye.position.set(0.36, 0.76, 1.39);
            rightEye.rotation.set(-0.06, 0.26, 0);
            rightEye.castShadow = true;
            eyeGroup.add(rightEye);

            // 5. Ears (Đôi tai gấp vểnh với pivot jiggle)
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

            this.leftEarMesh = new THREE.Mesh(earGeo, this.pinkPiggyMaterial);
            this.leftEarMesh.rotation.set(0.25, -0.35, 0.75);
            this.leftEarMesh.scale.set(1.05, 1.05, 1.05);
            this.leftEarMesh.castShadow = true;
            this.leftEarPivot.add(this.leftEarMesh);

            this.rightEarMesh = new THREE.Mesh(earGeo, this.pinkPiggyMaterial);
            this.rightEarMesh.rotation.set(0.25, 0.35, -0.75);
            this.rightEarMesh.scale.set(-1.05, 1.05, 1.05);
            this.rightEarMesh.castShadow = true;
            this.rightEarPivot.add(this.rightEarMesh);

            // 6. Legs & Hooves (4 chân ngắn mũm mĩm)
            this.legsGroup = new THREE.Group();
            this.bodyGroup.add(this.legsGroup);

            const legGeo = new THREE.CylinderGeometry(0.24, 0.28, 0.45, 24);
            const hoofGeo = new THREE.CylinderGeometry(0.28, 0.29, 0.12, 24);

            this.hoofPinkMat = new THREE.MeshStandardMaterial({
                color: 0xf43f5e,
                roughness: 0.3
            });

            const legOffsets = [
                { x: -0.55, z: 0.55, rotZ: -0.08 },
                { x: 0.55, z: 0.55, rotZ: 0.08 },
                { x: -0.58, z: -0.55, rotZ: -0.08 },
                { x: 0.58, z: -0.55, rotZ: 0.08 }
            ];

            legOffsets.forEach((pos) => {
                const legMesh = new THREE.Mesh(legGeo, this.pinkPiggyMaterial);
                legMesh.position.set(pos.x, -0.16, pos.z);
                legMesh.rotation.z = pos.rotZ;
                legMesh.castShadow = true;
                this.legsGroup.add(legMesh);

                const hoofMesh = new THREE.Mesh(hoofGeo, this.hoofPinkMat);
                hoofMesh.position.set(pos.x, -0.38, pos.z);
                hoofMesh.castShadow = true;
                this.legsGroup.add(hoofMesh);
            });

            // 7. Curly Corkscrew Tail (Đuôi xoắn ốc 3D)
            this.tailPivot = new THREE.Group();
            this.tailPivot.position.set(0, 0.60, -1.48);
            this.bodyGroup.add(this.tailPivot);

            const tailGeo = new THREE.TubeGeometry(new PiggyTailCurve(1.0), 40, 0.065, 12, false);
            this.tailMesh = new THREE.Mesh(tailGeo, this.pinkPiggyMaterial);
            this.tailMesh.castShadow = true;
            this.tailPivot.add(this.tailMesh);

            // 8. Coin Slot on Back (Khe bỏ tiền viền vàng)
            const slotGroup = new THREE.Group();
            slotGroup.position.set(0, 1.55, -0.05);
            this.bodyGroup.add(slotGroup);

            const rimGeo = new THREE.BoxGeometry(0.78, 0.06, 0.16);
            const rimMat = new THREE.MeshStandardMaterial({
                color: 0xffd700,
                roughness: 0.2,
                metalness: 0.92
            });
            const rimMesh = new THREE.Mesh(rimGeo, rimMat);
            rimMesh.castShadow = true;
            slotGroup.add(rimMesh);

            const slotHoleGeo = new THREE.BoxGeometry(0.68, 0.1, 0.065);
            const slotHoleMat = new THREE.MeshBasicMaterial({ color: 0x09090b });
            const slotHole = new THREE.Mesh(slotHoleGeo, slotHoleMat);
            slotHole.position.y = 0.02;
            slotGroup.add(slotHole);
        }

        // ---------------------------------------------------------------------
        // 3.5 Reusable Coin Pool for Continuous Stream
        // ---------------------------------------------------------------------
        buildCoinPool() {
            this.coinPool = [];
            const POOL_SIZE = 35;

            const coinGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.035, 20);
            const coinMat = new THREE.MeshStandardMaterial({
                color: 0xffd700,
                metalness: 0.95,
                roughness: 0.16
            });

            for (let i = 0; i < POOL_SIZE; i++) {
                const mesh = new THREE.Mesh(coinGeo, coinMat);
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
                    duration: 0.45,
                    rotX: 0, rotY: 0, rotZ: 0
                });
            }
        }

        buildParticlePool() {
            this.particleGroup = new THREE.Group();
            this.scene.add(this.particleGroup);

            this.goldStarGeo = new THREE.PlaneGeometry(0.10, 0.10);
            this.goldStarMat = new THREE.MeshBasicMaterial({
                color: 0xffd700,
                side: THREE.DoubleSide,
                blending: THREE.AdditiveBlending
            });
            this.activeParticles = [];
        }

        // ---------------------------------------------------------------------
        // 3.6 Continuous Coin Spawning & Feeding Mechanics
        // ---------------------------------------------------------------------
        spawnContinuousCoin() {
            const now = performance.now();
            if (now - this.lastCoinSpawnTime < this.coinSpawnInterval) return;
            this.lastCoinSpawnTime = now;

            // Find available coin in pool
            const coin = this.coinPool.find(c => !c.inUse);
            if (!coin) return;

            coin.inUse = true;
            coin.progress = 0;
            coin.duration = this.reducedMotion ? 0.3 : 0.48;
            coin.mesh.visible = true;

            // Target is the coin slot scaled to current piggy size
            const currentScale = this.scaleSpring.value;
            const targetY = (1.55 * currentScale) + (currentScale - 1.0) * 0.42;
            const targetZ = -0.05 * currentScale;
            coin.p3.set(0, targetY, targetZ);

            // Spawn directly above the piggy bank with natural variation
            const startX = (Math.random() - 0.5) * 0.4;
            const startY = targetY + 1.8 + Math.random() * 0.5;
            const startZ = targetZ + 0.3 + (Math.random() - 0.5) * 0.3;
            coin.p0.set(startX, startY, startZ);

            // Parabolic descent control points
            coin.p1.set(startX * 0.8, startY - 0.3, startZ + 0.1);
            coin.p2.set(startX * 0.3, targetY + 0.6, targetZ + 0.05);

            coin.rotX = (Math.random() - 0.5) * 22;
            coin.rotY = (Math.random() - 0.5) * 22;
            coin.rotZ = (Math.random() - 0.5) * 22;

            this.coinsFedCount++;
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
            // 1. Squash & Stretch Bounce Reaction
            this.squashSpring.velocity = -0.24;

            // 2. Emit subtle golden sparkle puff
            const count = this.reducedMotion ? 3 : 7;
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

        // ---------------------------------------------------------------------
        // 3.7 Update Tier, Growth Scale & Treasury Accumulation
        // ---------------------------------------------------------------------
        updateTier(newTier, animate = true) {
            this.currentTier = Math.max(1, Math.min(5, newTier));
            const tierData = TIERS[this.currentTier];

            // 1. Target Scale for Piggy Growth
            if (animate && !this.reducedMotion) {
                this.scaleSpring.target = tierData.scale;
            } else {
                this.scaleSpring.value = tierData.scale;
                this.scaleSpring.target = tierData.scale;
            }

            // 2. Update Visible Coins on Pedestal
            this.displayedCoinCount = tierData.coinCount;
            if (this.treasuryMesh) {
                this.treasuryMesh.count = tierData.coinCount;
                this.treasuryMesh.instanceMatrix.needsUpdate = true;
            }

            // 3. Update DOM UI
            this.updateDOMUI(tierData);
        }

        updateDOMUI(tierData) {
            const indicator = document.getElementById('tier-indicator');
            const iconEl = document.getElementById('tier-pill-icon');
            const nameEl = document.getElementById('tier-pill-name');
            const valDisplay = document.getElementById('val-budget-display');
            const currencySub = document.getElementById('val-currency-sub');
            const flavorText = document.getElementById('travel-flavor-text');
            const slider = document.getElementById('budget-slider');

            if (indicator) {
                indicator.className = `tier-indicator-pill ${tierData.pillClass}`;
            }
            if (iconEl) iconEl.textContent = tierData.icon;
            if (nameEl) nameEl.textContent = tierData.name;

            const formattedUSD = `$${this.currentBudget.toLocaleString('en-US')}`;
            const approxVND = `${Math.round(this.currentBudget * 24500).toLocaleString('vi-VN')} ₫`;
            if (valDisplay) valDisplay.textContent = formattedUSD;
            if (currencySub) currencySub.textContent = `≈ ${approxVND} (Tổng ngân sách chuyến đi)`;
            if (slider && Number(slider.value) !== this.currentBudget) {
                slider.value = this.currentBudget;
            }

            if (flavorText) {
                flavorText.innerHTML = `<strong>${tierData.travelTitle}:</strong> ${tierData.travelDesc}`;
            }

            document.querySelectorAll('.tier-select-btn').forEach(btn => {
                const bTier = Number(btn.getAttribute('data-tier'));
                btn.classList.toggle('active', bTier === this.currentTier);
            });
        }

        // ---------------------------------------------------------------------
        // 3.8 DOM Event Bindings (Continuous Slider Feeding)
        // ---------------------------------------------------------------------
        bindDOMEvents() {
            const slider = document.getElementById('budget-slider');
            const resetBtn = document.getElementById('btn-reset-view');
            const spinBtn = document.getElementById('btn-toggle-spin');
            const motionBtn = document.getElementById('btn-motion-toggle');

            if (slider) {
                const onSliderStart = () => {
                    this.isDraggingSlider = true;
                };

                const onSliderEnd = () => {
                    setTimeout(() => {
                        this.isDraggingSlider = false;
                    }, 350);
                };

                slider.addEventListener('mousedown', onSliderStart);
                slider.addEventListener('touchstart', onSliderStart, { passive: true });
                window.addEventListener('mouseup', onSliderEnd);
                window.addEventListener('touchend', onSliderEnd);

                slider.addEventListener('input', (e) => {
                    const val = Number(e.target.value);
                    this.currentBudget = val;

                    // Trigger continuous coin drop
                    this.spawnContinuousCoin();

                    // Determine Tier based on budget
                    let matchedTier = 1;
                    for (let t = 5; t >= 1; t--) {
                        if (val >= TIERS[t].minBudget) {
                            matchedTier = t;
                            break;
                        }
                    }

                    if (matchedTier !== this.currentTier) {
                        this.updateTier(matchedTier, true);
                    } else {
                        this.updateDOMUI(TIERS[this.currentTier]);
                    }
                });
            }

            if (resetBtn) {
                resetBtn.addEventListener('click', () => {
                    this.targetAzimuth = 0.42;
                    this.targetPolar = 1.32;
                    this.targetDistance = (this.container.clientWidth < 768) ? 10.2 : 7.4;
                    this.lookAtTarget.set(0, (this.container.clientWidth < 768) ? 0.28 : 0.36, 0);
                });
            }

            if (spinBtn) {
                spinBtn.addEventListener('click', () => {
                    this.autoRotate = !this.autoRotate;
                    spinBtn.style.borderColor = this.autoRotate ? 'var(--gold-bright)' : 'rgba(255,255,255,0.15)';
                });
            }

            if (motionBtn) {
                motionBtn.addEventListener('click', () => {
                    this.reducedMotion = !this.reducedMotion;
                    const label = document.getElementById('label-motion');
                    if (label) label.textContent = this.reducedMotion ? 'Tiết Giảm' : 'Chuyển Động';
                });
            }

            // Quick Jump Tier Pills
            document.querySelectorAll('.tier-select-btn').forEach(btn => {
                btn.addEventListener('click', () => {
                    const tier = Number(btn.getAttribute('data-tier'));
                    const budget = Number(btn.getAttribute('data-budget'));
                    this.currentBudget = budget;
                    // Burst a sequence of coins when jumping tiers
                    for (let c = 0; c < 5; c++) {
                        setTimeout(() => this.spawnContinuousCoin(), c * 60);
                    }
                    this.updateTier(tier, true);
                });
            });
        }

        // ---------------------------------------------------------------------
        // 3.9 Pointer & Touch Orbit Controls (360 Drag, Pinch Zoom, Damping)
        // ---------------------------------------------------------------------
        bindPointerControls() {
            const el = this.container;

            const onStart = (x, y) => {
                this.isPointerDown = true;
                this.lastPointerX = x;
                this.lastPointerY = y;
                this.lastInteractionTime = performance.now();
            };

            const onMove = (x, y) => {
                if (!this.isPointerDown) return;
                const deltaX = x - this.lastPointerX;
                const deltaY = y - this.lastPointerY;
                this.lastPointerX = x;
                this.lastPointerY = y;
                this.lastInteractionTime = performance.now();

                this.targetAzimuth -= deltaX * 0.0075;
                this.targetPolar -= deltaY * 0.0075;
                this.targetPolar = Math.max(0.35, Math.min(Math.PI * 0.47, this.targetPolar));
            };

            const onEnd = () => {
                this.isPointerDown = false;
                this.pinchInitialDistance = null;
            };

            el.addEventListener('mousedown', (e) => onStart(e.clientX, e.clientY));
            window.addEventListener('mousemove', (e) => onMove(e.clientX, e.clientY));
            window.addEventListener('mouseup', onEnd);

            el.addEventListener('touchstart', (e) => {
                if (e.touches.length === 1) {
                    onStart(e.touches[0].clientX, e.touches[0].clientY);
                } else if (e.touches.length === 2) {
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    this.pinchInitialDistance = Math.hypot(dx, dy);
                }
            }, { passive: true });

            window.addEventListener('touchmove', (e) => {
                if (e.touches.length === 1 && this.isPointerDown) {
                    onMove(e.touches[0].clientX, e.touches[0].clientY);
                } else if (e.touches.length === 2 && this.pinchInitialDistance) {
                    const dx = e.touches[0].clientX - e.touches[1].clientX;
                    const dy = e.touches[0].clientY - e.touches[1].clientY;
                    const dist = Math.hypot(dx, dy);
                    const factor = this.pinchInitialDistance / dist;
                    this.targetDistance *= factor > 1 ? 1.03 : 0.97;
                    this.targetDistance = Math.max(4.0, Math.min(10.0, this.targetDistance));
                    this.pinchInitialDistance = dist;
                }
            }, { passive: true });

            window.addEventListener('touchend', onEnd);

            el.addEventListener('wheel', (e) => {
                e.preventDefault();
                this.targetDistance += e.deltaY * 0.0035;
                this.targetDistance = Math.max(4.0, Math.min(10.0, this.targetDistance));
                this.lastInteractionTime = performance.now();
            }, { passive: false });
        }

        updateCameraTransform() {
            const x = this.currentDistance * Math.sin(this.currentPolar) * Math.sin(this.currentAzimuth);
            const y = this.currentDistance * Math.cos(this.currentPolar);
            const z = this.currentDistance * Math.sin(this.currentPolar) * Math.cos(this.currentAzimuth);

            this.camera.position.set(x, y + this.lookAtTarget.y, z);
            this.camera.lookAt(this.lookAtTarget);
        }

        // ---------------------------------------------------------------------
        // 3.10 Resize Handler (Mobile-first Framing)
        // ---------------------------------------------------------------------
        onResize() {
            const width = this.container.clientWidth || window.innerWidth;
            const height = this.container.clientHeight || window.innerHeight;
            this.camera.aspect = width / height;

            if (width < 768) {
                this.lookAtTarget.set(0, 0.28, 0);
                this.targetDistance = 10.2; // Generous framing for Tier 5 giant growth on mobile
            } else {
                this.lookAtTarget.set(0, 0.36, 0);
                this.targetDistance = 7.4;
            }

            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }

        // ---------------------------------------------------------------------
        // 3.11 Main Render Loop (Growth Springs, Squish Bounce, Coin Flight)
        // ---------------------------------------------------------------------
        animate() {
            requestAnimationFrame(this.animate);
            const dt = Math.min(this.clock.getDelta(), 0.1);
            const time = this.clock.getElapsedTime();

            // 1. Camera Orbit Interpolation & Auto-Rotate
            const timeSinceInteraction = performance.now() - this.lastInteractionTime;
            if (this.autoRotate && !this.isPointerDown && timeSinceInteraction > 2200 && !this.reducedMotion) {
                this.targetAzimuth += 0.0035;
            }

            this.currentAzimuth += (this.targetAzimuth - this.currentAzimuth) * 0.08;
            this.currentPolar += (this.targetPolar - this.currentPolar) * 0.08;
            this.currentDistance += (this.targetDistance - this.currentDistance) * 0.08;
            this.updateCameraTransform();

            // 2. Growth Physics Spring (Rubber Scale-up)
            const fScale = -22 * (this.scaleSpring.value - this.scaleSpring.target);
            const dScale = -4.2 * this.scaleSpring.velocity;
            this.scaleSpring.velocity += (fScale + dScale) * dt;
            this.scaleSpring.value += this.scaleSpring.velocity * dt;

            const currentScale = this.scaleSpring.value;
            this.piggyRoot.scale.setScalar(currentScale);
            // Anchor hooves to pedestal surface
            this.piggyRoot.position.y = (currentScale - 1.0) * 0.42;

            // 3. Idle Dynamics & Squish-Stretch (Breathing, Coin Impact)
            if (!this.reducedMotion) {
                const breath = Math.sin(time * 2.6) * 0.020;

                const fSquash = -24 * (this.squashSpring.value - this.squashSpring.target);
                const dSquash = -4.5 * this.squashSpring.velocity;
                this.squashSpring.velocity += (fSquash + dSquash) * dt;
                this.squashSpring.value += this.squashSpring.velocity * dt;

                const sy = this.squashSpring.value + breath;
                const sx = (1 / Math.sqrt(sy));
                this.bodyGroup.scale.set(sx, sy, sx);

                // Subtle tail wag & ear bounce
                if (this.tailPivot) {
                    this.tailPivot.rotation.z = Math.sin(time * 3.8) * 0.18;
                    this.tailPivot.rotation.y = Math.cos(time * 2.8) * 0.14;
                }

                if (this.leftEarPivot && this.rightEarPivot) {
                    const earBounce = Math.sin(time * 2.6 + 0.4) * 0.05;
                    this.leftEarPivot.rotation.z = earBounce;
                    this.rightEarPivot.rotation.z = -earBounce;
                }
            }

            // 4. Update Active In-Flight Coins from Reusable Pool
            for (let i = 0; i < this.coinPool.length; i++) {
                const c = this.coinPool[i];
                if (!c.inUse) continue;

                c.progress += dt / c.duration;
                if (c.progress >= 1.0) {
                    this.onCoinEnteredSlot(c.p3);
                    c.mesh.visible = false;
                    c.inUse = false;
                } else {
                    const pt = this.getBezierPoint(c.p0, c.p1, c.p2, c.p3, c.progress);
                    c.mesh.position.copy(pt);
                    c.mesh.rotation.x += c.rotX * dt;
                    c.mesh.rotation.y += c.rotY * dt;
                    c.mesh.rotation.z += c.rotZ * dt;
                }
            }

            // 5. Update Starburst Sparkle Particles
            for (let i = this.activeParticles.length - 1; i >= 0; i--) {
                const p = this.activeParticles[i];
                p.life += dt;
                if (p.life >= p.maxLife) {
                    this.particleGroup.remove(p.mesh);
                    p.mesh.geometry.dispose();
                    this.activeParticles.splice(i, 1);
                } else {
                    p.vy -= 9.8 * dt * 0.7;
                    p.mesh.position.x += p.vx * dt;
                    p.mesh.position.y += p.vy * dt;
                    p.mesh.position.z += p.vz * dt;

                    const alpha = 1 - (p.life / p.maxLife);
                    if (p.mesh.material.opacity !== undefined) {
                        p.mesh.material.opacity = alpha;
                    }
                }
            }

            // 6. Render Scene
            this.renderer.render(this.scene, this.camera);
        }
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            window.piggyBankApp = new PiggyBankApp();
        });
    } else {
        window.piggyBankApp = new PiggyBankApp();
    }
})();
