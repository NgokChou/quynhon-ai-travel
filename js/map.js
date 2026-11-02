/**
 * Quy Nhon AI Travel Assistant - Interactive World Map Module (Leaflet.js)
 * Chế độ Ảnh Vệ Tinh Trái Đất (Esri World Imagery Satellite)
 * Trực quan hóa lộ trình đa phương thức (Chặng bay quốc tế, chặng bay nối chuyến, chặng đường bộ / tàu ngắm cảnh)
 * Tự động cập nhật theo phương án hành trình được chọn (Fastest / Best-Value / Smart Stopover).
 */

const MapController = (function() {
    let mapInstance = null;
    let markersLayer = null;
    let routesLayer = null;
    let badgesLayer = null;

    // Helper tạo HTML Icon cho marker điểm dừng
    function createCustomMarkerIcon(type, iconClass, label) {
        return L.divIcon({
            className: 'custom-map-marker',
            html: `
                <div class="marker-wrapper ${type}">
                    <div class="marker-halo"></div>
                    <div class="marker-pin">
                        <i class="fa-solid ${iconClass}"></i>
                    </div>
                    <span class="marker-tooltip-tag">${label}</span>
                </div>
            `,
            iconSize: [40, 40],
            iconAnchor: [20, 20],
            popupAnchor: [0, -20]
        });
    }

    // Helper tạo huy hiệu trực quan giữa chặng đường (Flight / Transfer Badge)
    function createRouteBadgeIcon(type, iconClass, text) {
        return L.divIcon({
            className: 'custom-route-badge-marker',
            html: `
                <div class="route-badge-pill ${type}">
                    <i class="fa-solid ${iconClass}"></i>
                    <span>${text}</span>
                </div>
            `,
            iconSize: [240, 32],
            iconAnchor: [120, 16]
        });
    }

    // Helper tạo đường cong arc giữa 2 điểm toạ độ (mô phỏng đường bay vĩ độ cong)
    function generateArcPoints(p1, p2, numPoints = 50) {
        const points = [];
        const lat1 = p1.lat;
        const lng1 = p1.lng;
        const lat2 = p2.lat;
        const lng2 = p2.lng;

        const dLat = lat2 - lat1;
        const dLng = lng2 - lng1;

        // Điểm uốn cong ở giữa (Offset về phía bắc để tạo cảm giác đường bay liên lục địa tự nhiên)
        const curvature = Math.min(18, Math.max(5, Math.abs(dLng) * 0.08));
        const midLat = (lat1 + lat2) / 2 + curvature;
        const midLng = (lng1 + lng2) / 2;

        for (let i = 0; i <= numPoints; i++) {
            const t = i / numPoints;
            const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * midLat + t * t * lat2;
            const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * midLng + t * t * lng2;
            points.push([lat, lng]);
        }
        return points;
    }

    function init(containerId = 'route-map') {
        const mapElement = document.getElementById(containerId);
        if (!mapElement) return;

        const initialCenter = [20.0, 60.0];
        const initialZoom = 3;

        mapInstance = L.map(containerId, {
            center: initialCenter,
            zoom: initialZoom,
            minZoom: 2,
            maxZoom: 18,
            zoomControl: true,
            scrollWheelZoom: true,
            dragging: true
        });

        // Sử dụng ảnh Vệ tinh thế giới Esri World Imagery (rõ nét, ổn định cao)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 18,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(mapInstance);

        markersLayer = L.layerGroup().addTo(mapInstance);
        routesLayer = L.layerGroup().addTo(mapInstance);
        badgesLayer = L.layerGroup().addTo(mapInstance);

        window.addEventListener('resize', () => {
            if (mapInstance) {
                mapInstance.invalidateSize();
            }
        });
    }

    /**
     * Cập nhật bản đồ theo Quốc gia và Hành trình được chọn (Fastest / Best-Value / Smart Stopover)
     */
    function updateRoute(countryData, destinationData, selectedRouteInput, currentLang = 'en') {
        if (!mapInstance || !countryData) return;

        markersLayer.clearLayers();
        routesLayer.clearLayers();
        badgesLayer.clearLayers();

        const langKey = currentLang.startsWith('vi') ? 'vi' : 'en';
        const isVi = langKey === 'vi';

        // Xác định gói hành trình đang chọn
        let route = null;
        if (typeof selectedRouteInput === 'object' && selectedRouteInput !== null) {
            route = selectedRouteInput;
        } else if (typeof selectedRouteInput === 'string' && countryData.routes) {
            route = countryData.routes[selectedRouteInput] || countryData.routes.fastest;
        } else if (countryData.routes) {
            route = countryData.routes.fastest;
        }

        if (!route) return;

        const originLat = countryData.lat;
        const originLng = countryData.lng;
        const destLat = destinationData.lat;
        const destLng = destinationData.lng;
        const boundsPoints = [[originLat, originLng], [destLat, destLng]];

        // 1. Marker Điểm xuất phát (Origin)
        const originIcon = createCustomMarkerIcon(
            'marker-origin',
            'fa-plane-departure',
            `${countryData.flag} ${countryData.name[langKey]}`
        );
        const originMarker = L.marker([originLat, originLng], { icon: originIcon });
        originMarker.bindPopup(`
            <div class="map-popup-card">
                <span class="popup-badge origin">${isVi ? 'Điểm Khởi Hành' : 'Origin Departure'}</span>
                <h4>${countryData.flag} ${countryData.city}, ${countryData.name[langKey]}</h4>
                <p>${countryData.airport}</p>
            </div>
        `);
        markersLayer.addLayer(originMarker);

        // 2. Marker Trạm Trung Chuyển (Transit Hub: HAN, DAD hoặc SGN)
        if (route.transitHub) {
            const transit = route.transitHub;
            boundsPoints.push([transit.lat, transit.lng]);

            const transitIcon = createCustomMarkerIcon(
                'marker-transit',
                'fa-arrows-split-up-and-left',
                transit.city
            );
            const transitMarker = L.marker([transit.lat, transit.lng], { icon: transitIcon });
            transitMarker.bindPopup(`
                <div class="map-popup-card">
                    <span class="popup-badge transit">${isVi ? 'Sân Bay Trung Chuyển' : 'Transit Gateway'}</span>
                    <h4>${transit.name[langKey]} (${transit.code})</h4>
                    <p>${transit.city}, Vietnam</p>
                    <small style="color: #94a3b8;">${transit.role || ''}</small>
                </div>
            `);
            markersLayer.addLayer(transitMarker);
        }

        // 3. Marker Sân bay Phù Cát (UIH) nếu hành trình bay đến Phù Cát
        if (route.finalTransport === 'uih-taxi' && destinationData.airportCoords) {
            const uihCoords = destinationData.airportCoords;
            boundsPoints.push([uihCoords.lat, uihCoords.lng]);

            const uihIcon = createCustomMarkerIcon(
                'marker-transit',
                'fa-plane-arrival',
                'Phu Cat (UIH)'
            );
            const uihMarker = L.marker([uihCoords.lat, uihCoords.lng], { icon: uihIcon });
            uihMarker.bindPopup(`
                <div class="map-popup-card">
                    <span class="popup-badge transit">${isVi ? 'Sân Bay Phù Cát (UIH)' : 'Phu Cat Airport (UIH)'}</span>
                    <h4>${destinationData.airportName}</h4>
                    <p>${isVi ? 'Cách trung tâm Quy Nhơn 35km (~40 phút taxi)' : '35km from downtown (~40 min taxi)'}</p>
                </div>
            `);
            markersLayer.addLayer(uihMarker);
        }

        // 4. Marker Điểm đến cuối cùng (Quy Nhơn)
        const destIcon = createCustomMarkerIcon(
            'marker-destination',
            'fa-umbrella-beach',
            'Quy Nhon'
        );
        const destMarker = L.marker([destLat, destLng], { icon: destIcon });
        destMarker.bindPopup(`
            <div class="map-popup-card">
                <span class="popup-badge dest">${isVi ? 'Điểm Đến Cuối Cùng' : 'Final Destination'}</span>
                <h4>🌊 ${destinationData.name}</h4>
                <p>${destinationData.airportName} (${destinationData.airportCode})</p>
                <small>${destinationData.description[langKey]}</small>
                <div style="margin-top: 0.65rem;">
                    <button type="button" class="btn-popup-explore" onclick="App.openDestinationModal()">
                        <i class="fa-solid fa-leaf"></i> ${isVi ? 'Xem Môi Trường & Cảnh Quan' : 'Explore Environment & Landscape'}
                    </button>
                </div>
            </div>
        `);
        markersLayer.addLayer(destMarker);

        // 5. Vẽ các chặng hành trình theo danh sách steps của route
        if (route.steps && Array.isArray(route.steps)) {
            route.steps.forEach((step, idx) => {
                if (!step.fromCoords || !step.toCoords) return;

                const fromPt = { lat: step.fromCoords[0], lng: step.fromCoords[1] };
                const toPt = { lat: step.toCoords[0], lng: step.toCoords[1] };

                if (step.type === 'flight') {
                    // Chặng bay quốc tế (đường cong màu Cyan nét đứt)
                    const arcPoints = generateArcPoints(fromPt, toPt, 50);
                    arcPoints.forEach(pt => boundsPoints.push(pt));

                    const polyline = L.polyline(arcPoints, {
                        color: '#38bdf8',
                        weight: 4,
                        opacity: 0.95,
                        dashArray: '9, 9',
                        className: 'animated-flight-line'
                    });
                    routesLayer.addLayer(polyline);

                    // Badge chặng bay quốc tế
                    const midPoint = arcPoints[Math.floor(arcPoints.length / 2)];
                    const badgeText = isVi
                        ? `✈️ Chặng bay: ${step.from} ➔ ${step.to} (~${step.duration || ''})`
                        : `✈️ Flight: ${step.from} ➔ ${step.to} (~${step.duration || ''})`;

                    const badge = L.marker(midPoint, {
                        icon: createRouteBadgeIcon('badge-flight', 'fa-plane', badgeText),
                        interactive: false
                    });
                    badgesLayer.addLayer(badge);

                } else if (step.type === 'domestic-flight') {
                    // Chặng bay nội địa (đường cong màu Xanh lam sáng nét đứt)
                    const arcPoints = generateArcPoints(fromPt, toPt, 35);
                    arcPoints.forEach(pt => boundsPoints.push(pt));

                    const polyline = L.polyline(arcPoints, {
                        color: '#0ea5e9',
                        weight: 4,
                        opacity: 0.95,
                        dashArray: '7, 7',
                        className: 'animated-flight-line'
                    });
                    routesLayer.addLayer(polyline);

                    // Badge chặng bay nội địa
                    const midPoint = arcPoints[Math.floor(arcPoints.length / 2)];
                    const badgeText = isVi
                        ? `✈️ Bay nối chuyến: ${step.from} ➔ ${step.to} (~${step.duration || ''})`
                        : `✈️ Connector: ${step.from} ➔ ${step.to} (~${step.duration || ''})`;

                    const badge = L.marker(midPoint, {
                        icon: createRouteBadgeIcon('badge-flight', 'fa-plane', badgeText),
                        interactive: false
                    });
                    badgesLayer.addLayer(badge);

                } else if (step.type === 'transfer') {
                    // Chặng di chuyển trên mặt đất (đường nét liền màu Xanh ngọc nổi bật)
                    const transferPoints = [
                        [fromPt.lat, fromPt.lng],
                        [toPt.lat, toPt.lng]
                    ];

                    const polyline = L.polyline(transferPoints, {
                        color: '#10b981',
                        weight: 5,
                        opacity: 0.95,
                        className: 'scenic-transfer-line'
                    });
                    routesLayer.addLayer(polyline);

                    // Badge chặng đường bộ / tàu hỏa
                    const midPoint = [
                        (fromPt.lat + toPt.lat) / 2,
                        (fromPt.lng + toPt.lng) / 2 + 0.6
                    ];
                    const iconClass = step.icon === 'train' ? 'fa-train' : 'fa-van-shuttle';
                    const badgeText = isVi
                        ? `${step.icon === 'train' ? '🚆 Tàu hỏa' : '🚐 Đường bộ'}: ${step.from} ➔ ${step.to}`
                        : `${step.icon === 'train' ? '🚆 Scenic Rail' : '🚐 Ground'}: ${step.from} ➔ ${step.to}`;

                    const badge = L.marker(midPoint, {
                        icon: createRouteBadgeIcon('badge-transfer', iconClass, badgeText),
                        interactive: false
                    });
                    badgesLayer.addLayer(badge);
                }
            });
        }

        // Tự động căn chỉnh khung nhìn bản đồ bao quát toàn bộ hành trình
        const allBounds = L.latLngBounds(boundsPoints);
        mapInstance.fitBounds(allBounds, {
            padding: [45, 45],
            maxZoom: 6,
            animate: true,
            duration: 0.8
        });

        setTimeout(() => {
            if (mapInstance) mapInstance.invalidateSize();
        }, 250);
    }

    return {
        init: init,
        updateRoute: updateRoute,
        getMap: function() { return mapInstance; }
    };
})();
