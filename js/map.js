/**
 * Quy Nhon AI Travel Assistant - Interactive World Map Module (Leaflet.js)
 * Chế độ Ảnh Vệ Tinh Trái Đất (Satellite Earth View) rõ nét, ổn định 100%
 * Cùng các huy hiệu chặng bay và trung chuyển trực quan trên bản đồ.
 */

const MapController = (function() {
    let mapInstance = null;
    let markersLayer = null;
    let routesLayer = null;
    let badgesLayer = null;

    // Helper tạo custom HTML Icon cho marker điểm dừng
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
            iconSize: [220, 32],
            iconAnchor: [110, 16]
        });
    }

    // Helper tạo đường cong arc giữa 2 điểm toạ độ (mô phỏng đường bay vĩ độ cong)
    function generateArcPoints(p1, p2, numPoints = 60) {
        const points = [];
        const lat1 = p1.lat;
        const lng1 = p1.lng;
        const lat2 = p2.lat;
        const lng2 = p2.lng;

        const dLat = lat2 - lat1;
        const dLng = lng2 - lng1;

        // Điểm uốn cong ở giữa (Offset về phía bắc để tạo cảm giác đường bay liên lục địa)
        const midLat = (lat1 + lat2) / 2 + Math.min(18, Math.max(6, Math.abs(dLng) * 0.08));
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

        // Khởi tạo Leaflet Map với đầy đủ tương tác zoom, pan và controls
        mapInstance = L.map(containerId, {
            center: initialCenter,
            zoom: initialZoom,
            minZoom: 2,
            maxZoom: 18,
            zoomControl: true,
            scrollWheelZoom: true,
            dragging: true
        });

        // Sử dụng ảnh Vệ tinh thế giới Esri World Imagery (Hoàn toàn miễn phí, không API key, không watermark)
        L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 18,
            attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
        }).addTo(mapInstance);

        markersLayer = L.layerGroup().addTo(mapInstance);
        routesLayer = L.layerGroup().addTo(mapInstance);
        badgesLayer = L.layerGroup().addTo(mapInstance);

        // Đảm bảo map render chuẩn khi resize
        window.addEventListener('resize', () => {
            if (mapInstance) {
                mapInstance.invalidateSize();
            }
        });
    }

    function updateRoute(countryData, destinationData, currentLang = 'en') {
        if (!mapInstance) return;

        // Xóa markers, routes và badges cũ
        markersLayer.clearLayers();
        routesLayer.clearLayers();
        badgesLayer.clearLayers();

        const originLat = countryData.lat;
        const originLng = countryData.lng;
        const transit = countryData.route.transitHub;
        const destLat = destinationData.lat;
        const destLng = destinationData.lng;

        const langKey = currentLang.startsWith('vi') ? 'vi' : 'en';

        // 1. Marker Điểm xuất phát (Origin)
        const originIcon = createCustomMarkerIcon(
            'marker-origin',
            'fa-plane-departure',
            `${countryData.flag} ${countryData.name[langKey]}`
        );
        const originMarker = L.marker([originLat, originLng], { icon: originIcon });
        originMarker.bindPopup(`
            <div class="map-popup-card">
                <span class="popup-badge origin">${currentLang === 'vi' ? 'Điểm Khởi Hành' : 'Origin Departure'}</span>
                <h4>${countryData.flag} ${countryData.city}, ${countryData.name[langKey]}</h4>
                <p>${countryData.airport}</p>
            </div>
        `);
        markersLayer.addLayer(originMarker);

        // 2. Marker Trạm Trung Chuyển (Transit Hub)
        const transitIcon = createCustomMarkerIcon(
            'marker-transit',
            'fa-arrows-split-up-and-left',
            transit.city
        );
        const transitMarker = L.marker([transit.lat, transit.lng], { icon: transitIcon });
        transitMarker.bindPopup(`
            <div class="map-popup-card">
                <span class="popup-badge transit">${currentLang === 'vi' ? 'Trạm Trung Chuyển' : 'Transit Hub'}</span>
                <h4>${transit.name[langKey]} (${transit.code})</h4>
                <p>${transit.city}, Vietnam</p>
            </div>
        `);
        markersLayer.addLayer(transitMarker);

        // 3. Marker Điểm đến (Destination - Quy Nhon)
        const destIcon = createCustomMarkerIcon(
            'marker-destination',
            'fa-umbrella-beach',
            'Quy Nhon'
        );
        const destMarker = L.marker([destLat, destLng], { icon: destIcon });
        destMarker.bindPopup(`
            <div class="map-popup-card">
                <span class="popup-badge dest">${currentLang === 'vi' ? 'Điểm Đến Cuối Cùng' : 'Final Destination'}</span>
                <h4>🌊 ${destinationData.name}</h4>
                <p>${destinationData.airportName} (${destinationData.airportCode})</p>
                <small>${destinationData.description[langKey]}</small>
            </div>
        `);
        markersLayer.addLayer(destMarker);

        // 4. Vẽ Chặng bay quốc tế (Origin -> Transit Hub) dạng đường cong đứt đoạn phát sáng
        const flightArcPoints = generateArcPoints(
            { lat: originLat, lng: originLng },
            { lat: transit.lat, lng: transit.lng },
            50
        );

        const flightPolyline = L.polyline(flightArcPoints, {
            color: '#38bdf8',
            weight: 4,
            opacity: 0.95,
            dashArray: '9, 9',
            className: 'animated-flight-line'
        });
        routesLayer.addLayer(flightPolyline);

        // 5. Huy hiệu trực quan chặng bay (Đặt ở điểm chính giữa cung bay)
        const midFlightIndex = Math.floor(flightArcPoints.length / 2);
        const midFlightPoint = flightArcPoints[midFlightIndex];
        const flightBadgeLabel = currentLang === 'vi'
            ? `✈️ Chặng bay: ${countryData.city} ➔ ${transit.city}`
            : `✈️ Flight: ${countryData.city} ➔ ${transit.city}`;
        
        const flightBadgeMarker = L.marker(midFlightPoint, {
            icon: createRouteBadgeIcon('badge-flight', 'fa-plane', flightBadgeLabel),
            interactive: false
        });
        badgesLayer.addLayer(flightBadgeMarker);

        // 6. Vẽ Chặng tiếp nối (Transit Hub -> Quy Nhon) dạng nét liền phát sáng
        const transferPoints = [
            [transit.lat, transit.lng],
            [destLat, destLng]
        ];

        const transferPolyline = L.polyline(transferPoints, {
            color: '#10b981',
            weight: 5,
            opacity: 0.95,
            className: 'scenic-transfer-line'
        });
        routesLayer.addLayer(transferPolyline);

        // 7. Huy hiệu trực quan chặng trung chuyển (Đặt giữa Đà Nẵng và Quy Nhơn)
        const midTransferPoint = [
            (transit.lat + destLat) / 2,
            (transit.lng + destLng) / 2 + 1.2
        ];
        const transferBadgeLabel = currentLang === 'vi'
            ? `🚐 Đường bộ ven biển (~5h)`
            : `🚐 Scenic Coastal Route (~5h)`;

        const transferBadgeMarker = L.marker(midTransferPoint, {
            icon: createRouteBadgeIcon('badge-transfer', 'fa-van-shuttle', transferBadgeLabel),
            interactive: false
        });
        badgesLayer.addLayer(transferBadgeMarker);

        // 8. Tự động căn khung hình bao quát toàn bộ lộ trình
        const allBounds = L.latLngBounds([
            [originLat, originLng],
            [transit.lat, transit.lng],
            [destLat, destLng]
        ]);

        flightArcPoints.forEach(pt => allBounds.extend(pt));

        mapInstance.fitBounds(allBounds, {
            padding: [50, 50],
            maxZoom: 6,
            animate: true,
            duration: 1.0
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
