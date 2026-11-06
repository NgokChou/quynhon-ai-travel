/**
 * Quy Nhon AI Travel Assistant - 3D Interactive Globe
 * Quả cầu Trái Đất (ảnh vệ tinh Blue Marble) xoay bằng chuột, cuộn để phóng to,
 * bấm vào một quốc gia để làm nổi bật và mở bảng thông tin bên cạnh.
 * Bấm Việt Nam sẽ chuyển xuống bản đồ 34 tỉnh thành.
 *
 * Dữ liệu: js/worldMapData.js (Natural Earth) + js/worldRegions.js
 */

const GlobeMap = (function () {
    'use strict';

    const EARTH_R = 1;
    const DIST_MIN = 1.34;
    const DIST_MAX = 3.5;
    const DIST_START = 2.95;

    const state = {
        lon: 105.5,
        lat: 14,
        dist: DIST_START,
        target: null,
        selected: null,
        hovered: null,
        lang: 'en',
        dragging: false,
        moved: 0,
        lastX: 0,
        lastY: 0,
        velLon: 0,
        velLat: 0,
        ready: false
    };

    let scene, camera, renderer, globeGroup, earthMesh, atmosphere, stars;
    let raycaster, pointer;
    let borderCanvas, idCanvas, hlCanvas, hlCtx, idData;
    let earthTex, borderTex, hlTex;
    let countries = [], byId = {}, info = null;
    let TEX_W = 4096, TEX_H = 2048, ID_W = 2048, ID_H = 1024;

    const els = {};
    let needsRender = true;
    let sectionVisible = true;
    let lastTime = 0;
    const AUTO_SPEED = 1.1;   // độ/giây khi rảnh

    /* ------------------------------------------------------------------ */
    /* Helpers                                                             */
    /* ------------------------------------------------------------------ */

    function txt(key) {
        return t(key, state.lang);
    }

    function loc(value) {
        if (value == null) return '';
        if (typeof value === 'string') return value;
        return value[state.lang] || value.vi || value.en || '';
    }

    function lonLatToVec3(lon, lat, r) {
        const phi = (lon + 180) * Math.PI / 180;
        const theta = (90 - lat) * Math.PI / 180;
        return new THREE.Vector3(
            -Math.cos(phi) * Math.sin(theta) * r,
            Math.cos(theta) * r,
            Math.sin(phi) * Math.sin(theta) * r
        );
    }

    function countryName(c) {
        return state.lang === 'vi' ? c.vi : c.name;
    }

    function formatPop(n) {
        if (!n) return '—';
        if (state.lang === 'vi') {
            if (n >= 1e9) return (n / 1e9).toFixed(2).replace('.', ',') + ' tỷ';
            if (n >= 1e6) return (n / 1e6).toFixed(1).replace('.', ',') + ' tr';
            if (n >= 1e3) return Math.round(n / 1e3) + ' nghìn';
            return String(n);
        }
        if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B';
        if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M';
        if (n >= 1e3) return Math.round(n / 1e3) + 'K';
        return String(n);
    }

    /* ------------------------------------------------------------------ */
    /* Canvas layers                                                       */
    /* ------------------------------------------------------------------ */

    function drawRings(ctx, rings, W, H, closeFill) {
        for (let r = 0; r < rings.length; r++) {
            const ring = rings[r];
            ctx.beginPath();
            let prevLon = null;
            for (let i = 0; i < ring.length; i++) {
                const lon = ring[i][0];
                const lat = ring[i][1];
                const x = (lon + 180) / 360 * W;
                const y = (90 - lat) / 180 * H;
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else if (prevLon !== null && Math.abs(lon - prevLon) > 180) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
                prevLon = lon;
            }
            ctx.closePath();
            ctx.fill();
            if (closeFill) ctx.stroke();
        }
    }

    function buildBorderCanvas() {
        borderCanvas = document.createElement('canvas');
        borderCanvas.width = TEX_W;
        borderCanvas.height = TEX_H;
        const ctx = borderCanvas.getContext('2d');

        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';

        // viền mảnh, sáng — đủ để thấy biên giới trên ảnh vệ tinh
        ctx.strokeStyle = 'rgba(255, 240, 205, 0.26)';
        ctx.lineWidth = TEX_W > 2048 ? 1.8 : 1.2;

        for (const c of countries) {
            for (const ring of c.rings) {
                ctx.beginPath();
                let prevLon = null;
                for (let i = 0; i < ring.length; i++) {
                    const x = (ring[i][0] + 180) / 360 * TEX_W;
                    const y = (90 - ring[i][1]) / 180 * TEX_H;
                    if (i === 0) ctx.moveTo(x, y);
                    else if (prevLon !== null && Math.abs(ring[i][0] - prevLon) > 180) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                    prevLon = ring[i][0];
                }
                ctx.closePath();
                ctx.stroke();
            }
        }
    }

    function buildIdCanvas() {
        idCanvas = document.createElement('canvas');
        idCanvas.width = ID_W;
        idCanvas.height = ID_H;
        const ctx = idCanvas.getContext('2d', { willReadFrequently: true });

        countries.forEach((c, i) => {
            const v = i + 1;
            ctx.fillStyle = `rgb(${v & 255},${(v >> 8) & 255},0)`;
            drawRings(ctx, c.rings, ID_W, ID_H, false);
        });

        idData = ctx.getImageData(0, 0, ID_W, ID_H).data;
    }

    function buildHighlightCanvas() {
        hlCanvas = document.createElement('canvas');
        hlCanvas.width = ID_W;
        hlCanvas.height = ID_H;
        hlCtx = hlCanvas.getContext('2d');
    }

    function paintHighlight(country) {
        if (!hlCtx) return;
        hlCtx.clearRect(0, 0, ID_W, ID_H);
        if (country) {
            hlCtx.save();
            hlCtx.fillStyle = 'rgba(247, 198, 92, 0.42)';
            hlCtx.strokeStyle = 'rgba(255, 226, 160, 0.95)';
            hlCtx.lineWidth = ID_W > 2048 ? 4 : 2.6;
            hlCtx.shadowColor = 'rgba(247, 198, 92, 0.9)';
            hlCtx.shadowBlur = 14;
            drawRings(hlCtx, country.rings, ID_W, ID_H, true);
            hlCtx.restore();
        }
        if (hlTex) hlTex.needsUpdate = true;
        needsRender = true;
    }

    /* ------------------------------------------------------------------ */
    /* Scene                                                               */
    /* ------------------------------------------------------------------ */

    function buildScene() {
        const canvas = els.canvasEl;
        renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
        renderer.outputEncoding = THREE.sRGBEncoding;

        const maxTex = renderer.capabilities.maxTextureSize || 4096;
        if (maxTex < 4096) {
            TEX_W = 2048; TEX_H = 1024;
            ID_W = 2048; ID_H = 1024;
        }

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(45, 1, 0.01, 400);

        raycaster = new THREE.Raycaster();
        pointer = new THREE.Vector2();

        globeGroup = new THREE.Group();
        scene.add(globeGroup);

        const loader = new THREE.TextureLoader();
        const aniso = renderer.capabilities.getMaxAnisotropy();

        earthTex = loader.load('assets/earth-blue-marble.jpg', () => {
            needsRender = true;
            hideLoader();
        }, undefined, () => {
            if (els.loader) els.loader.textContent = 'Earth imagery could not be loaded.';
        });
        earthTex.encoding = THREE.sRGBEncoding;
        earthTex.anisotropy = aniso;

        borderTex = new THREE.CanvasTexture(borderCanvas);
        borderTex.anisotropy = aniso;

        hlTex = new THREE.CanvasTexture(hlCanvas);
        hlTex.anisotropy = aniso;

        const geo = new THREE.SphereGeometry(EARTH_R, 96, 64);

        earthMesh = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ map: earthTex }));
        globeGroup.add(earthMesh);

        const borderMesh = new THREE.Mesh(
            new THREE.SphereGeometry(EARTH_R * 1.0008, 96, 64),
            new THREE.MeshBasicMaterial({ map: borderTex, transparent: true, depthWrite: false })
        );
        globeGroup.add(borderMesh);

        const hlMesh = new THREE.Mesh(
            new THREE.SphereGeometry(EARTH_R * 1.0016, 96, 64),
            new THREE.MeshBasicMaterial({ map: hlTex, transparent: true, depthWrite: false })
        );
        globeGroup.add(hlMesh);

        atmosphere = new THREE.Mesh(
            new THREE.SphereGeometry(EARTH_R * 1.17, 64, 48),
            new THREE.ShaderMaterial({
                vertexShader: `
                    varying vec3 vNormal;
                    void main() {
                        vNormal = normalize(normalMatrix * normal);
                        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }`,
                fragmentShader: `
                    varying vec3 vNormal;
                    void main() {
                        float i = pow(0.66 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.4);
                        gl_FragColor = vec4(0.46, 0.74, 0.95, 1.0) * clamp(i, 0.0, 1.0);
                    }`,
                blending: THREE.AdditiveBlending,
                side: THREE.BackSide,
                transparent: true,
                depthWrite: false
            })
        );
        scene.add(atmosphere);

        // starfield
        const starGeo = new THREE.BufferGeometry();
        const N = 1600;
        const pos = new Float32Array(N * 3);
        for (let i = 0; i < N; i++) {
            const r = 40 + Math.random() * 60;
            const th = Math.acos(2 * Math.random() - 1);
            const ph = Math.random() * Math.PI * 2;
            pos[i * 3] = r * Math.sin(th) * Math.cos(ph);
            pos[i * 3 + 1] = r * Math.cos(th);
            pos[i * 3 + 2] = r * Math.sin(th) * Math.sin(ph);
        }
        starGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
        stars = new THREE.Points(starGeo, new THREE.PointsMaterial({
            color: 0xdfe9f5, size: 0.42, sizeAttenuation: true,
            transparent: true, opacity: 0.75, depthWrite: false
        }));
        scene.add(stars);

        state.ready = true;
        resize();
    }

    function hideLoader() {
        if (els.loader) els.loader.classList.add('is-hidden');
    }

    function resize() {
        if (!renderer || !els.canvasWrap) return;
        const w = els.canvasWrap.clientWidth;
        const h = els.canvasWrap.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        needsRender = true;
    }

    function updateCamera() {
        const v = lonLatToVec3(state.lon, state.lat, 1);
        camera.position.copy(v.multiplyScalar(state.dist));
        camera.up.set(0, 1, 0);
        camera.lookAt(0, 0, 0);
        needsRender = true;
    }

    /* ------------------------------------------------------------------ */
    /* Picking                                                             */
    /* ------------------------------------------------------------------ */

    function countryAtPixel(px, py) {
        if (!idData) return null;
        px = Math.max(0, Math.min(ID_W - 1, Math.round(px)));
        py = Math.max(0, Math.min(ID_H - 1, Math.round(py)));

        const counts = new Map();
        for (let dy = -1; dy <= 1; dy++) {
            for (let dx = -1; dx <= 1; dx++) {
                const x = px + dx, y = py + dy;
                if (x < 0 || y < 0 || x >= ID_W || y >= ID_H) continue;
                const o = (y * ID_W + x) * 4;
                const idx = idData[o] + (idData[o + 1] << 8);
                if (!idx) continue;
                counts.set(idx, (counts.get(idx) || 0) + 1);
            }
        }
        let best = 0, bestN = 0;
        counts.forEach((n, idx) => { if (n > bestN) { bestN = n; best = idx; } });
        return best ? countries[best - 1] : null;
    }

    function pick(clientX, clientY) {
        if (!state.ready) return null;
        const rect = els.canvasEl.getBoundingClientRect();
        pointer.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hits = raycaster.intersectObject(earthMesh, false);
        if (!hits.length) return null;
        const uv = hits[0].uv;
        if (!uv) return null;
        return countryAtPixel(uv.x * ID_W, (1 - uv.y) * ID_H);
    }

    /* ------------------------------------------------------------------ */
    /* Selection                                                           */
    /* ------------------------------------------------------------------ */

    function select(country) {
        state.selected = country ? country.id : null;
        paintHighlight(country);
        renderPanel();
        updateFocusLabel();
    }

    function flyTo(lon, lat, dist, duration) {
        state.target = {
            lon: lon,
            lat: lat,
            dist: dist == null ? state.dist : dist,
            t0: performance.now(),
            dur: duration || 520
        };
        needsRender = true;
    }

    function stepTarget(now) {
        if (!state.target) return false;
        const p = Math.min(1, (now - state.target.t0) / state.target.dur);
        const e = 1 - Math.pow(1 - p, 3);
        const from = state._from || (state._from = { lon: state.lon, lat: state.lat, dist: state.dist });
        state.lon = from.lon + (state.target.lon - from.lon) * e;
        state.lat = from.lat + (state.target.lat - from.lat) * e;
        state.dist = from.dist + (state.target.dist - from.dist) * e;
        if (p >= 1) {
            state._from = null;
            state.target = null;
        }
        updateCamera();
        return true;
    }

    /* ------------------------------------------------------------------ */
    /* Panel                                                               */
    /* ------------------------------------------------------------------ */

    function renderPanel() {
        const body = els.panelBody;
        const empty = els.panelEmpty;
        if (!body || !empty) return;

        const c = state.selected ? byId[state.selected] : null;
        if (!c) {
            body.hidden = true;
            empty.hidden = false;
            return;
        }

        const detail = (info.countries[c.id]) || null;
        const region = info.regions[c.cont] || { vi: '', en: '' };

        els.panelName.textContent = countryName(c);
        els.panelRegion.textContent = loc(region);

        const other = state.lang === 'vi' ? c.name : c.vi;
        const strip = s => (s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase();
        if (strip(other) && strip(other) !== strip(countryName(c))) {
            els.panelNameEn.textContent = other;
            els.panelNameEn.hidden = false;
        } else {
            els.panelNameEn.hidden = true;
        }

        // stats
        els.panelStats.innerHTML = '';
        const stats = [];
        const cap = detail && detail.cap ? loc(detail.cap) : c.cap;
        if (cap) stats.push([txt('globeStatCapital'), cap]);
        if (c.pop) stats.push([txt('globeStatPop'), formatPop(c.pop)]);
        const cur = detail && detail.cur ? loc(detail.cur) : (c.cur && c.cur[0] ? `${c.cur[0]} — ${c.cur[1]}` : '');
        if (cur) stats.push([txt('globeStatCurrency'), cur]);
        const lang = detail && detail.lang ? loc(detail.lang) : c.lang;
        if (lang) stats.push([txt('globeStatLanguage'), lang]);
        if (detail && detail.tz) stats.push([txt('globeStatTimezone'), detail.tz]);

        stats.forEach(([k, v]) => {
            const li = document.createElement('li');
            const ks = document.createElement('span');
            ks.className = 'globe-stat-key';
            ks.textContent = k;
            const vs = document.createElement('span');
            vs.className = 'globe-stat-value';
            vs.textContent = v;
            li.appendChild(ks);
            li.appendChild(vs);
            els.panelStats.appendChild(li);
        });

        // description
        if (detail && detail.desc) {
            els.panelDesc.textContent = loc(detail.desc);
        } else {
            const regionName = loc(region);
            els.panelDesc.textContent = state.lang === 'vi'
                ? `Quốc gia thuộc ${regionName}. Chưa có nội dung biên tập chi tiết cho điểm đến này.`
                : `A country in ${regionName}. Editorial notes for this destination are still being written.`;
        }

        // highlights
        els.panelList.innerHTML = '';
        const hl = (detail && detail.hl) || [];
        els.highlightsBox.hidden = hl.length === 0;
        hl.forEach(h => {
            const li = document.createElement('li');
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-location-dot';
            const span = document.createElement('span');
            span.textContent = loc(h);
            li.appendChild(icon);
            li.appendChild(span);
            els.panelList.appendChild(li);
        });

        // silhouette
        const b = c.bbox;
        const pad = Math.max(b[2] - b[0], b[3] - b[1]) * 0.08;
        els.silhouette.setAttribute('viewBox', `${b[0] - pad} ${-b[3] - pad} ${b[2] - b[0] + pad * 2} ${b[3] - b[1] + pad * 2}`);
        els.silhouettePath.setAttribute('d', silhouettePath(c.rings));

        // drill-down (Vietnam only)
        els.drillBtn.hidden = c.id !== 'VNM';

        empty.hidden = true;
        body.hidden = false;
        body.classList.remove('is-entering');
        void body.offsetWidth;
        body.classList.add('is-entering');
    }

    function silhouettePath(rings) {
        // keep only the largest ring so the shape reads at 76px
        let best = null, bestArea = 0;
        for (const ring of rings) {
            let a = 0;
            for (let i = 0; i < ring.length - 1; i++) {
                a += ring[i][0] * ring[i + 1][1] - ring[i + 1][0] * ring[i][1];
            }
            a = Math.abs(a / 2);
            if (a > bestArea) { bestArea = a; best = ring; }
        }
        if (!best) return '';
        return 'M' + best.map(p => `${p[0].toFixed(2)},${(-p[1]).toFixed(2)}`).join('L') + 'Z';
    }

    /* ------------------------------------------------------------------ */
    /* Focus label                                                         */
    /* ------------------------------------------------------------------ */

    function updateFocusLabel() {
        if (!els.focusLabel) return;
        const c = state.selected ? byId[state.selected] : null;
        if (!c || !state.ready) {
            els.focusLabel.hidden = true;
            return;
        }
        const v = lonLatToVec3(c.label[0], c.label[1], EARTH_R * 1.02);
        const camDir = camera.position.clone().normalize();
        const facing = v.clone().normalize().dot(camDir);
        if (facing < 0.12) {
            els.focusLabel.hidden = true;
            return;
        }
        const p = v.clone().project(camera);
        const rect = els.canvasEl.getBoundingClientRect();
        const x = (p.x * 0.5 + 0.5) * rect.width;
        const y = (-p.y * 0.5 + 0.5) * rect.height;
        els.focusLabel.style.transform = `translate(-50%, -50%) translate(${x}px, ${y}px)`;
        els.focusLabel.style.opacity = String(Math.min(1, (facing - 0.12) * 4));
        els.focusLabel.textContent = countryName(c);
        els.focusLabel.hidden = false;
    }

    /* ------------------------------------------------------------------ */
    /* Events                                                              */
    /* ------------------------------------------------------------------ */

    function bindEvents() {
        const el = els.canvasEl;

        el.addEventListener('pointerdown', e => {
            if (e.button !== 0) return;
            state.dragging = true;
            state.moved = 0;
            state.lastX = e.clientX;
            state.lastY = e.clientY;
            state.velLon = 0;
            state.velLat = 0;
            state.target = null;
            state._from = null;
            try { el.setPointerCapture(e.pointerId); } catch (err) { /* synthetic events */ }
            el.classList.add('is-dragging');
        });

        el.addEventListener('pointermove', e => {
            if (!state.dragging) {
                const c = pick(e.clientX, e.clientY);
                if (c !== state.hovered) {
                    state.hovered = c;
                    el.classList.toggle('is-hovering', !!c);
                    showTooltip(c, e.clientX, e.clientY);
                } else if (c) {
                    showTooltip(c, e.clientX, e.clientY);
                }
                return;
            }
            const dx = e.clientX - state.lastX;
            const dy = e.clientY - state.lastY;
            state.lastX = e.clientX;
            state.lastY = e.clientY;
            state.moved += Math.abs(dx) + Math.abs(dy);

            const k = 0.24 * Math.min(1, 2.4 / state.dist);
            state.lon -= dx * k;
            state.lat = Math.max(-85, Math.min(85, state.lat + dy * k));
            state.velLon = -dx * k;
            state.velLat = dy * k;
            updateCamera();
        });

        const endDrag = e => {
            if (!state.dragging) return;
            state.dragging = false;
            el.classList.remove('is-dragging');
            try {
                if (el.hasPointerCapture && el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
            } catch (err) { /* synthetic events */ }
        };

        el.addEventListener('pointerup', e => {
            const wasDrag = state.moved > 6;
            endDrag(e);
            if (wasDrag) return;
            const c = pick(e.clientX, e.clientY);
            if (!c) {
                select(null);
                return;
            }
            if (c.id === 'VNM') {
                flyTo(c.label[0], c.label[1], 1.6, 520);
                select(c);
                setTimeout(() => drillDown(), 620);
                return;
            }
            select(c);
            flyTo(c.label[0], Math.max(-55, Math.min(65, c.label[1])), state.dist, 520);
        });

        el.addEventListener('pointercancel', endDrag);
        el.addEventListener('pointerleave', () => {
            state.hovered = null;
            el.classList.remove('is-hovering');
            showTooltip(null);
        });

        el.addEventListener('wheel', e => {
            e.preventDefault();
            const factor = Math.exp(e.deltaY * 0.0011);
            state.dist = Math.max(DIST_MIN, Math.min(DIST_MAX, state.dist * factor));
            updateCamera();
        }, { passive: false });

        if (els.zoomIn) els.zoomIn.addEventListener('click', () => {
            state.dist = Math.max(DIST_MIN, state.dist / 1.35);
            updateCamera();
        });
        if (els.zoomOut) els.zoomOut.addEventListener('click', () => {
            state.dist = Math.min(DIST_MAX, state.dist * 1.35);
            updateCamera();
        });
        if (els.zoomReset) els.zoomReset.addEventListener('click', () => {
            select(null);
            flyTo(105.5, 14, DIST_START, 620);
        });

        if (els.drillBtn) els.drillBtn.addEventListener('click', drillDown);

        window.addEventListener('resize', () => {
            resize();
            updateFocusLabel();
        });

        if (window.ResizeObserver && els.canvasWrap) {
            new ResizeObserver(() => resize()).observe(els.canvasWrap);
        }

        const section = document.getElementById('map-section');
        if (window.IntersectionObserver && section) {
            new IntersectionObserver(entries => {
                sectionVisible = entries[0].isIntersecting;
                if (sectionVisible) { lastTime = 0; needsRender = true; }
            }, { threshold: 0.1 }).observe(section);
        }
    }

    function showTooltip(c, x, y) {
        if (!els.tooltip) return;
        if (!c) {
            els.tooltip.hidden = true;
            return;
        }
        const rect = els.canvasWrap.getBoundingClientRect();
        els.tooltip.hidden = false;
        els.tooltip.textContent = countryName(c);
        els.tooltip.style.transform = `translate(${x - rect.left + 14}px, ${y - rect.top + 16}px)`;
    }

    function drillDown() {
        if (typeof VietnamMap === 'undefined' || !VietnamMap.drillDown) return;
        VietnamMap.drillDown();
    }

    /* ------------------------------------------------------------------ */
    /* Loop                                                                */
    /* ------------------------------------------------------------------ */

    function tick(now) {
        requestAnimationFrame(tick);
        if (!state.ready || !sectionVisible) return;

        const dt = lastTime ? Math.min(0.1, (now - lastTime) / 1000) : 0;
        lastTime = now;

        let moving = false;

        // Tự xoay chậm khi người dùng không tương tác
        if (!state.dragging && !state.hovered && !state.selected && !state.target && dt > 0) {
            state.lon += AUTO_SPEED * dt;
            updateCamera();
            moving = true;
        }

        if (state.target) {
            moving = stepTarget(now);
        } else if (!state.dragging && (Math.abs(state.velLon) > 0.002 || Math.abs(state.velLat) > 0.002)) {
            state.lon -= state.velLon;
            state.lat = Math.max(-85, Math.min(85, state.lat + state.velLat));
            state.velLon *= 0.94;
            state.velLat *= 0.94;
            updateCamera();
            moving = true;
        }

        if (needsRender || moving) {
            renderer.render(scene, camera);
            needsRender = false;
            updateFocusLabel();
        }
    }

    /* ------------------------------------------------------------------ */
    /* Init                                                                */
    /* ------------------------------------------------------------------ */

    function init() {
        els.canvasEl = document.getElementById('globe-canvas-el');
        if (!els.canvasEl) return;

        els.canvasWrap = document.getElementById('globe-canvas');
        els.tooltip = document.getElementById('globe-tooltip');
        els.focusLabel = document.getElementById('globe-focus-label');
        els.loader = document.getElementById('globe-loader');

        els.panelBody = document.getElementById('globe-panel-body');
        els.panelEmpty = document.getElementById('globe-panel-empty');
        els.panelName = document.getElementById('globe-panel-name');
        els.panelNameEn = document.getElementById('globe-panel-name-en');
        els.panelRegion = document.getElementById('globe-panel-region');
        els.panelStats = document.getElementById('globe-panel-stats');
        els.panelDesc = document.getElementById('globe-panel-desc');
        els.panelList = document.getElementById('globe-panel-list');
        els.highlightsBox = document.getElementById('globe-highlights');
        els.silhouette = document.getElementById('globe-panel-silhouette');
        els.silhouettePath = els.silhouette ? els.silhouette.querySelector('path') : null;
        els.drillBtn = document.getElementById('globe-drill-btn');

        els.zoomIn = document.getElementById('globe-zoom-in');
        els.zoomOut = document.getElementById('globe-zoom-out');
        els.zoomReset = document.getElementById('globe-zoom-reset');

        if (!window.THREE) {
            if (els.loader) els.loader.textContent = 'WebGL is not available in this browser.';
            return;
        }

        countries = (window.WORLD_MAP_DATA && window.WORLD_MAP_DATA.countries) || [];
        info = window.WORLD_INFO || { regions: {}, countries: {} };
        countries.forEach(c => { byId[c.id] = c; });

        const langSelect = document.getElementById('app-lang-select');
        state.lang = langSelect && langSelect.value === 'vi' ? 'vi' : 'en';

        buildBorderCanvas();
        buildIdCanvas();
        buildHighlightCanvas();
        try {
            buildScene();
        } catch (err) {
            console.error('[Globe] WebGL init failed', err);
            if (els.loader) els.loader.textContent = 'WebGL is not available in this browser.';
            return;
        }
        updateCamera();
        bindEvents();
        renderPanel();
        requestAnimationFrame(tick);

        if (langSelect) {
            langSelect.addEventListener('change', () => setLanguage(langSelect.value));
        }
    }

    function setLanguage(lang) {
        state.lang = lang === 'vi' ? 'vi' : 'en';
        if (!state.ready) return;
        renderPanel();
        updateFocusLabel();
    }

    function onShow() {
        if (!state.ready) return;
        resize();
        updateFocusLabel();
        needsRender = true;
    }

    return {
        init: init,
        setLanguage: setLanguage,
        onShow: onShow,
        select: select
    };
})();

document.addEventListener('DOMContentLoaded', function () {
    GlobeMap.init();
});
