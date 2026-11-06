/**
 * Quy Nhon AI Travel Assistant - Vietnam Province Selection Map
 * Bản đồ chọn tỉnh thành kiểu bản đồ game: khoanh vùng theo biên giới,
 * nhấn vào một tỉnh để làm nổi bật và mở bảng thông tin bên cạnh.
 *
 * Dữ liệu hình học: js/vietnamMapData.js (34 đơn vị cấp tỉnh, GADM 4.1, Mercator)
 * Nội dung: js/vietnamRegions.js
 */

const VietnamMap = (function () {
    'use strict';

    const NS = 'http://www.w3.org/2000/svg';

    // Bảng màu địa hình theo vùng (mỗi vùng 5 sắc độ, gán theo id để ổn định)
    const REGION_FILL = {
        nm:    ['#55642f', '#5f6f3d', '#68783f', '#71813f', '#7a8a4a'],
        rr:    ['#7a8a41', '#86964c', '#8f9e52', '#98a75a', '#a1b062'],
        btb:   ['#948647', '#9c8e4e', '#a59756', '#ad9f5e', '#b5a766'],
        ntb:   ['#a89252', '#b09a5c', '#b8a264', '#c0aa6c', '#c8b274'],
        tn:    ['#7b6738', '#836f3e', '#8b7744', '#937f4c', '#9b8754'],
        dnb:   ['#869245', '#8e9a4e', '#96a256', '#9eaa5e', '#a6b266'],
        dbscl: ['#6c8947', '#74914f', '#7c9957', '#84a15f', '#8ca967']
    };

    // Nhãn luôn hiển thị dù ở mức zoom thấp
    const PINNED_LABELS = ['ha-noi', 'da-nang', 'tp-hcm', 'hue', 'gia-lai'];

    // Nhãn rút gọn cho các tên quá dài trên bản đồ
    const LABEL_SHORT = {
        'tp-hcm': { vi: 'TP.HCM', en: 'TP.HCM' }
    };

    const BASE_FONT = 27; // đơn vị user-space (≈10px khi bản đồ vừa khung)

    const state = {
        selected: null,
        hovered: null,
        lang: 'en',
        vb: null,
        drag: null,
        suppressClick: false
    };

    let els = {};
    let data = null;
    let info = null;
    let baseVB = null;

    /* ------------------------------------------------------------------ */
    /* Helpers                                                             */
    /* ------------------------------------------------------------------ */

    function hash(str) {
        let h = 0;
        for (let i = 0; i < str.length; i++) {
            h = (h * 31 + str.charCodeAt(i)) | 0;
        }
        return Math.abs(h);
    }

    function fillFor(unit) {
        const palette = REGION_FILL[unit.region] || REGION_FILL.nm;
        return palette[hash(unit.id) % palette.length];
    }

    function unitById(id) {
        return data.units.find(u => u.id === id) || null;
    }

    function labelText(unit) {
        const short = LABEL_SHORT[unit.id];
        if (short) return state.lang === 'vi' ? short.vi : short.en;
        return state.lang === 'vi' ? unit.vi : unit.en;
    }

    function txt(key) {
        return t(key, state.lang);
    }

    function el(tag, attrs) {
        const node = document.createElementNS(NS, tag);
        if (attrs) {
            Object.keys(attrs).forEach(k => node.setAttribute(k, attrs[k]));
        }
        return node;
    }

    /* ------------------------------------------------------------------ */
    /* Render SVG                                                          */
    /* ------------------------------------------------------------------ */

    function renderMap() {
        const W = data.width;
        const H = data.height;
        const allPaths = data.units.map(u => u.d).join(' ');

        const svg = els.svg;
        svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
        svg.innerHTML = '';

        // --- defs -------------------------------------------------------
        const defs = el('defs');

        const clip = el('clipPath', { id: 'vnLandClip' });
        clip.appendChild(el('path', { d: allPaths }));
        defs.appendChild(clip);

        const noiseFilter = el('filter', {
            id: 'vnNoiseFilter',
            x: '0', y: '0', width: '140', height: '140',
            filterUnits: 'userSpaceOnUse'
        });
        noiseFilter.appendChild(el('feTurbulence', {
            type: 'fractalNoise',
            baseFrequency: '0.75',
            numOctaves: '3',
            seed: '9',
            stitchTiles: 'stitch'
        }));
        noiseFilter.appendChild(el('feColorMatrix', { type: 'saturate', values: '0' }));
        defs.appendChild(noiseFilter);

        const grainPattern = el('pattern', {
            id: 'vnGrainPattern',
            width: '140', height: '140',
            patternUnits: 'userSpaceOnUse'
        });
        grainPattern.appendChild(el('rect', {
            width: '140', height: '140', filter: 'url(#vnNoiseFilter)'
        }));
        defs.appendChild(grainPattern);

        const shadow = el('filter', {
            id: 'vnLandShadow',
            x: '-12%', y: '-8%', width: '124%', height: '116%'
        });
        shadow.appendChild(el('feDropShadow', {
            dx: '0', dy: '9', stdDeviation: '13',
            'flood-color': '#02121a', 'flood-opacity': '0.65'
        }));
        defs.appendChild(shadow);

        const glow = el('filter', {
            id: 'vnSelGlow',
            x: '-45%', y: '-45%', width: '190%', height: '190%'
        });
        glow.appendChild(el('feGaussianBlur', { stdDeviation: '6', result: 'blur' }));
        const merge = el('feMerge');
        merge.appendChild(el('feMergeNode', { in: 'blur' }));
        merge.appendChild(el('feMergeNode', { in: 'SourceGraphic' }));
        glow.appendChild(merge);
        defs.appendChild(glow);

        svg.appendChild(defs);

        // --- land -------------------------------------------------------
        const land = el('g', { class: 'vn-land', filter: 'url(#vnLandShadow)' });

        const fills = el('g', { class: 'vn-fills' });
        data.units.forEach(u => {
            const path = el('path', {
                d: u.d,
                fill: fillFor(u),
                class: 'vn-province',
                'data-id': u.id,
                tabindex: '0',
                role: 'button',
                'aria-label': labelText(u)
            });
            fills.appendChild(path);
        });
        land.appendChild(fills);

        land.appendChild(el('rect', {
            class: 'vn-grain',
            x: '0', y: '0', width: W, height: H,
            fill: 'url(#vnGrainPattern)',
            'clip-path': 'url(#vnLandClip)'
        }));

        const borders = el('g', { class: 'vn-borders' });
        data.units.forEach(u => {
            borders.appendChild(el('path', { d: u.d, class: 'vn-border', 'data-id': u.id }));
        });
        land.appendChild(borders);

        if (data.outline) {
            const coast = el('g', { class: 'vn-coast' });
            coast.appendChild(el('path', { d: data.outline, class: 'vn-coastline' }));
            land.appendChild(coast);
        }

        svg.appendChild(land);

        // --- highlight --------------------------------------------------
        const hl = el('g', { class: 'vn-highlight-layer' });
        hl.appendChild(el('path', { class: 'vn-highlight-fill', d: '' }));
        hl.appendChild(el('path', { class: 'vn-highlight-line', d: '' }));
        svg.appendChild(hl);

        // --- labels -----------------------------------------------------
        const labels = el('g', { class: 'vn-labels' });
        const labelNodes = {};
        data.units.forEach(u => {
            const text = el('text', {
                x: u.lx,
                y: u.ly,
                class: 'vn-label',
                'data-id': u.id,
                'text-anchor': 'middle',
                'dominant-baseline': 'middle'
            });
            text.textContent = labelText(u);
            labels.appendChild(text);
            labelNodes[u.id] = text;
        });
        svg.appendChild(labels);

        els.labelNodes = labelNodes;

        els.land = land;
        els.fills = fills;
        els.labels = labels;
        els.highlightFill = hl.querySelector('.vn-highlight-fill');
        els.highlightLine = hl.querySelector('.vn-highlight-line');
    }

    /* ------------------------------------------------------------------ */
    /* Viewport: pan & zoom via viewBox                                    */
    /* ------------------------------------------------------------------ */

    function clampVB(vb) {
        const minW = baseVB.w / 7;
        const w = Math.min(Math.max(vb.w, minW), baseVB.w);
        const h = w * (baseVB.h / baseVB.w);
        const x = Math.min(Math.max(vb.x, baseVB.x), baseVB.x + baseVB.w - w);
        const y = Math.min(Math.max(vb.y, baseVB.y), baseVB.y + baseVB.h - h);
        return { x, y, w, h };
    }

    function applyVB() {
        const vb = state.vb;
        els.svg.setAttribute('viewBox', `${vb.x} ${vb.y} ${vb.w} ${vb.h}`);
        const z = baseVB.w / vb.w;

        if (els.labels) {
            els.labels.style.fontSize = (BASE_FONT / z) + 'px';
            els.labels.style.strokeWidth = (6 / z) + 'px';
        }

        if (els.canvas) {
            els.canvas.classList.toggle('is-zoomed', z > 1.06);
        }

        updateLabelVisibility(z);
        updateZoomButtons(z);
    }

    function updateLabelVisibility(z) {
        const rect = els.svg.getBoundingClientRect();
        const content = contentRect(rect);
        const mapPx = content.w / state.vb.w * data.width;

        let threshold;
        if (mapPx < 300) threshold = 10;
        else if (mapPx < 390) threshold = 16;
        else if (z < 1.35) threshold = 20;
        else if (z < 1.9) threshold = 26;
        else if (z < 2.8) threshold = 31;
        else threshold = 34;

        data.units.forEach(u => {
            const label = els.labelNodes[u.id];
            if (!label) return;
            const always = PINNED_LABELS.indexOf(u.id) !== -1;
            const visible = u.rank <= threshold || always ||
                u.id === state.selected || u.id === state.hovered;
            label.classList.toggle('is-hidden', !visible);
            label.classList.toggle('is-major', always && z < 1.9);
        });
    }

    function updateZoomButtons(z) {
        if (els.zoomIn) els.zoomIn.disabled = z > 6.5;
        if (els.zoomOut) els.zoomOut.disabled = z < 1.02;
    }

    function zoomAt(factor, clientX, clientY) {
        const rect = els.svg.getBoundingClientRect();
        const content = contentRect(rect);
        const mx = clientX - rect.left - content.ox;
        const my = clientY - rect.top - content.oy;
        const rx = Math.min(Math.max(mx / content.w, 0), 1);
        const ry = Math.min(Math.max(my / content.h, 0), 1);

        const old = state.vb;
        const ux = old.x + rx * old.w;
        const uy = old.y + ry * old.h;

        const newW = Math.min(Math.max(old.w / factor, baseVB.w / 7), baseVB.w);
        const newH = newW * (baseVB.h / baseVB.w);

        state.vb = clampVB({
            x: ux - rx * newW,
            y: uy - ry * newH,
            w: newW,
            h: newH
        });
        applyVB();
    }

    function contentRect(rect) {
        const va = baseVB.w / baseVB.h;
        const ca = rect.width / rect.height;
        let w, h, ox, oy;
        if (ca > va) {
            h = rect.height;
            w = h * va;
            ox = (rect.width - w) / 2;
            oy = 0;
        } else {
            w = rect.width;
            h = w / va;
            ox = 0;
            oy = (rect.height - h) / 2;
        }
        return { w, h, ox, oy };
    }

    function resetView(animate) {
        state.vb = { x: baseVB.x, y: baseVB.y, w: baseVB.w, h: baseVB.h };
        if (animate) {
            els.svg.classList.add('is-animating');
            setTimeout(() => els.svg.classList.remove('is-animating'), 320);
        }
        applyVB();
    }

    /* ------------------------------------------------------------------ */
    /* Selection                                                           */
    /* ------------------------------------------------------------------ */

    function select(id) {
        state.selected = id;
        const unit = id ? unitById(id) : null;

        if (unit) {
            els.highlightFill.setAttribute('d', unit.d);
            els.highlightLine.setAttribute('d', unit.d);
            els.svg.classList.add('has-selection');
            els.highlightFill.classList.add('is-visible');
            els.highlightLine.classList.add('is-visible');
        } else {
            els.svg.classList.remove('has-selection');
            els.highlightFill.classList.remove('is-visible');
            els.highlightLine.classList.remove('is-visible');
        }

        els.fills.querySelectorAll('.vn-province').forEach(p => {
            const isSel = p.getAttribute('data-id') === id;
            p.classList.toggle('is-selected', isSel);
            p.setAttribute('aria-pressed', isSel ? 'true' : 'false');
        });

        els.labels.querySelectorAll('.vn-label').forEach(l => {
            l.classList.toggle('is-selected', l.getAttribute('data-id') === id);
        });
        updateLabelVisibility(baseVB.w / state.vb.w);
        renderPanel();
    }

    function setHover(id) {
        if (state.hovered === id) return;
        state.hovered = id;
        els.fills.querySelectorAll('.vn-province').forEach(p => {
            p.classList.toggle('is-hovered', p.getAttribute('data-id') === id);
        });
        updateLabelVisibility(baseVB.w / state.vb.w);
    }

    /* ------------------------------------------------------------------ */
    /* Info panel                                                          */
    /* ------------------------------------------------------------------ */

    function renderPanel() {
        const body = els.panelBody;
        const empty = els.panelEmpty;
        if (!body || !empty) return;

        const unit = state.selected ? unitById(state.selected) : null;
        if (!unit) {
            body.hidden = true;
            empty.hidden = false;
            renderLegend();
            return;
        }

        const content = (info.provinces[unit.id]) || { vi: '', en: '', highlights: [] };
        const region = info.regions[unit.region] || { vi: '', en: '' };
        const lang = state.lang;

        const primary = lang === 'vi' ? unit.vi : unit.en;
        const secondary = lang === 'vi' ? unit.en : unit.vi;

        els.panelName.textContent = primary;
        els.panelRegion.textContent = lang === 'vi' ? region.vi : region.en;

        const strip = s => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/gi, 'd').toLowerCase();
        if (strip(primary) !== strip(secondary)) {
            els.panelNameEn.textContent = secondary;
            els.panelNameEn.hidden = false;
        } else {
            els.panelNameEn.textContent = '';
            els.panelNameEn.hidden = true;
        }

        els.panelDesc.textContent = content[lang] || content.vi || '';

        els.panelList.innerHTML = '';
        (content.highlights || []).forEach(h => {
            const li = document.createElement('li');
            const icon = document.createElement('i');
            icon.className = 'fa-solid fa-location-dot';
            const span = document.createElement('span');
            span.textContent = h[lang] || h.vi;
            li.appendChild(icon);
            li.appendChild(span);
            els.panelList.appendChild(li);
        });

        // silhouette
        const pad = Math.max(unit.bw, unit.bh) * 0.08;
        els.panelSilhouette.setAttribute(
            'viewBox',
            `${unit.bx - pad} ${unit.by - pad} ${unit.bw + pad * 2} ${unit.bh + pad * 2}`
        );
        const silPath = els.panelSilhouette.querySelector('path');
        if (silPath) silPath.setAttribute('d', unit.d);

        els.panelTitle.textContent = txt('vnHighlights');

        empty.hidden = true;
        body.hidden = false;
        body.classList.remove('is-entering');
        void body.offsetWidth;
        body.classList.add('is-entering');
    }

    function renderLegend() {
        if (!els.legendList) return;
        els.legendList.innerHTML = '';
        Object.keys(info.regions).forEach(key => {
            const li = document.createElement('li');

            const swatch = document.createElement('span');
            swatch.className = 'vn-legend-swatch';
            swatch.style.background = (REGION_FILL[key] || REGION_FILL.nm)[2];

            const name = document.createElement('span');
            name.textContent = info.regions[key][state.lang];

            li.appendChild(swatch);
            li.appendChild(name);
            els.legendList.appendChild(li);
        });
    }

    /* ------------------------------------------------------------------ */
    /* Events                                                              */
    /* ------------------------------------------------------------------ */

    function bindEvents() {
        const svg = els.svg;

        svg.addEventListener('click', e => {
            if (state.suppressClick) {
                state.suppressClick = false;
                return;
            }
            const path = e.target.closest('.vn-province');
            if (path) {
                const id = path.getAttribute('data-id');
                select(state.selected === id ? null : id);
            } else if (e.target === svg) {
                select(null);
            }
        });

        svg.addEventListener('keydown', e => {
            const path = e.target.closest && e.target.closest('.vn-province');
            if (!path) return;
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                select(path.getAttribute('data-id'));
            }
        });

        svg.addEventListener('mouseover', e => {
            const path = e.target.closest('.vn-province');
            if (path) setHover(path.getAttribute('data-id'));
        });
        svg.addEventListener('mouseout', e => {
            const path = e.target.closest('.vn-province');
            if (path && !path.contains(e.relatedTarget)) setHover(null);
        });
        svg.addEventListener('focusin', e => {
            const path = e.target.closest('.vn-province');
            if (path) setHover(path.getAttribute('data-id'));
        });
        svg.addEventListener('focusout', () => setHover(null));

        // --- zoom (wheel) ----------------------------------------------
        svg.addEventListener('wheel', e => {
            e.preventDefault();
            const factor = Math.exp(-e.deltaY * 0.0016);
            zoomAt(factor, e.clientX, e.clientY);
        }, { passive: false });

        // --- pan (pointer) ---------------------------------------------
        svg.addEventListener('pointerdown', e => {
            if (e.button !== 0) return;
            if (e.target.closest('.vn-province')) return;
            state.drag = {
                x: e.clientX,
                y: e.clientY,
                moved: 0,
                vb: { ...state.vb }
            };
            svg.setPointerCapture(e.pointerId);
            svg.classList.add('is-panning');
        });

        svg.addEventListener('pointermove', e => {
            if (!state.drag) return;
            const rect = svg.getBoundingClientRect();
            const content = contentRect(rect);
            const dxPx = e.clientX - state.drag.x;
            const dyPx = e.clientY - state.drag.y;
            state.drag.moved = Math.max(state.drag.moved, Math.abs(dxPx) + Math.abs(dyPx));

            const dx = dxPx / content.w * state.drag.vb.w;
            const dy = dyPx / content.h * state.drag.vb.h;
            state.vb = clampVB({
                x: state.drag.vb.x - dx,
                y: state.drag.vb.y - dy,
                w: state.drag.vb.w,
                h: state.drag.vb.h
            });
            applyVB();
        });

        const endDrag = e => {
            if (!state.drag) return;
            // Kéo bản đồ không được coi là một cú nhấn vào vùng biển
            state.suppressClick = state.drag.moved > 6;
            state.drag = null;
            svg.classList.remove('is-panning');
            if (svg.hasPointerCapture && svg.hasPointerCapture(e.pointerId)) {
                svg.releasePointerCapture(e.pointerId);
            }
        };
        svg.addEventListener('pointerup', endDrag);
        svg.addEventListener('pointercancel', endDrag);

        // --- zoom buttons ----------------------------------------------
        if (els.zoomIn) {
            els.zoomIn.addEventListener('click', () => {
                const r = els.svg.getBoundingClientRect();
                zoomAt(1.45, r.left + r.width / 2, r.top + r.height / 2);
            });
        }
        if (els.zoomOut) {
            els.zoomOut.addEventListener('click', () => {
                const r = els.svg.getBoundingClientRect();
                zoomAt(1 / 1.45, r.left + r.width / 2, r.top + r.height / 2);
            });
        }
        if (els.zoomReset) {
            els.zoomReset.addEventListener('click', () => resetView(true));
        }

        if (els.backBtn) {
            els.backBtn.addEventListener('click', () => setView('globe'));
        }

        // --- view switch (province map / flight route) ------------------
        if (els.viewSwitch) {
            els.viewSwitch.addEventListener('click', e => {
                const btn = e.target.closest('[data-view]');
                if (!btn) return;
                setView(btn.getAttribute('data-view'));
            });
        }

        // --- language ---------------------------------------------------
        const langSelect = document.getElementById('app-lang-select');
        if (langSelect) {
            langSelect.addEventListener('change', () => setLanguage(langSelect.value));
        }

        window.addEventListener('resize', () => {
            if (!state.vb) return;
            applyVB();
        });
    }

    function setView(view) {
        const isRoute = view === 'route';
        const isProvince = view === 'province';
        const isGlobe = view === 'globe';

        if (els.viewSwitch) {
            els.viewSwitch.querySelectorAll('[data-view]').forEach(b => {
                const v = b.getAttribute('data-view');
                // Bản đồ tỉnh là nhánh drill-down của tab quả cầu
                const active = v === 'route' ? isRoute : !isRoute;
                b.classList.toggle('is-active', active);
                b.setAttribute('aria-selected', active ? 'true' : 'false');
            });
        }

        if (els.globeView) els.globeView.hidden = !isGlobe;
        if (els.routeView) els.routeView.hidden = !isRoute;
        if (els.vnMap) els.vnMap.hidden = !isProvince;
        if (els.backBtn) els.backBtn.hidden = !isProvince;

        const titleKey = isRoute ? 'mapTitleRoute' : isProvince ? 'mapTitleProvince' : 'mapTitleGlobe';
        const subKey = isRoute ? 'mapSubtitleRoute' : isProvince ? 'mapSubtitleProvince' : 'mapSubtitleGlobe';
        if (els.titleEl) {
            els.titleEl.setAttribute('data-i18n', titleKey);
            els.titleEl.textContent = t(titleKey, state.lang);
        }
        if (els.subtitleEl) {
            els.subtitleEl.setAttribute('data-i18n', subKey);
            els.subtitleEl.textContent = t(subKey, state.lang);
        }

        if (isGlobe && typeof GlobeMap !== 'undefined' && GlobeMap.onShow) {
            setTimeout(() => GlobeMap.onShow(), 30);
        }

        if (isRoute) {
            setTimeout(() => {
                if (typeof MapController !== 'undefined' && MapController.refresh) {
                    MapController.refresh();
                }
            }, 60);
        }
    }

    /** Chuyển xuống bản đồ 34 tỉnh (gọi từ quả cầu khi bấm Việt Nam) */
    function drillDown() {
        setView('province');
        resetView(false);
        if (els.mapStage) {
            els.mapStage.classList.add('is-drilling');
            setTimeout(() => els.mapStage.classList.remove('is-drilling'), 520);
        }
    }

    function setLanguage(lang) {
        state.lang = lang === 'vi' ? 'vi' : 'en';
        if (!data) return;
        els.labels.querySelectorAll('.vn-label').forEach(node => {
            const unit = unitById(node.getAttribute('data-id'));
            if (unit) node.textContent = labelText(unit);
        });
        renderLegend();
        renderPanel();
    }

    /* ------------------------------------------------------------------ */
    /* Init                                                                */
    /* ------------------------------------------------------------------ */

    function init() {
        els.svg = document.getElementById('vn-map-svg');
        if (!els.svg) return;

        data = window.VIETNAM_MAP_DATA;
        info = window.VIETNAM_MAP_INFO;
        if (!data || !info) {
            console.warn('[VietnamMap] missing map data');
            return;
        }

        els.panelBody = document.getElementById('vn-panel-body');
        els.panelEmpty = document.getElementById('vn-panel-empty');
        els.panelName = document.getElementById('vn-panel-name');
        els.panelNameEn = document.getElementById('vn-panel-name-en');
        els.panelRegion = document.getElementById('vn-panel-region');
        els.panelDesc = document.getElementById('vn-panel-desc');
        els.panelList = document.getElementById('vn-panel-list');
        els.panelTitle = document.getElementById('vn-panel-highlights-title');
        els.panelSilhouette = document.getElementById('vn-panel-silhouette');
        els.legendList = document.getElementById('vn-legend-list');
        els.zoomIn = document.getElementById('vn-zoom-in');
        els.zoomOut = document.getElementById('vn-zoom-out');
        els.zoomReset = document.getElementById('vn-zoom-reset');
        els.viewSwitch = document.getElementById('map-view-switch');
        els.mapStage = document.getElementById('map-stage');
        els.routeView = document.getElementById('route-view');
        els.routeMap = document.getElementById('route-map');
        els.vnMap = document.getElementById('vietnam-map');
        els.globeView = document.getElementById('globe-view');
        els.backBtn = document.getElementById('vn-back-to-globe');
        els.titleEl = document.getElementById('map-title');
        els.subtitleEl = document.getElementById('map-subtitle');
        els.canvas = document.querySelector('.vn-map-canvas');

        baseVB = { x: 0, y: 0, w: data.width, h: data.height };
        state.vb = { ...baseVB };

        const langSelect = document.getElementById('app-lang-select');
        state.lang = langSelect && langSelect.value === 'vi' ? 'vi' : 'en';

        renderMap();
        applyVB();
        bindEvents();
        renderPanel();
        setView('globe');
    }

    return {
        init: init,
        setLanguage: setLanguage,
        select: select,
        resetView: resetView,
        drillDown: drillDown,
        setView: setView
    };
})();

document.addEventListener('DOMContentLoaded', function () {
    VietnamMap.init();
});
