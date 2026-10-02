/**
 * Quy Nhon AI Travel Assistant - Translations (EN / VI)
 * Độc lập quản lý toàn bộ nội dung ngôn ngữ giao diện & kịch bản giọng nói AI.
 */

const TRANSLATIONS = {
    en: {
        brand: "Quy Nhon AI Travel",
        brandTag: "Next-Gen Travel Intelligence",
        protoBadge: "Interactive Prototype Demo",
        navPlanner: "AI Planner",
        navMap: "World Route",
        navHotels: "Hotels",
        navRoadmap: "Roadmap",

        // Hero Section
        heroBadge: "AI-POWERED TRAVEL TECH CONCEPT",
        heroTitle: "Your Journey to Quy Nhon, Powered by AI",
        heroSubtitle: "Solving international transit friction with intelligent multi-modal journey planning, smart scenic transfers, and personalized seaside stays.",
        heroCta: "Plan My Journey",
        heroExploreBadge: "Central Vietnam's Hidden Coastal Paradise",

        // Planner Section
        plannerTitle: "AI Journey Planner",
        plannerSubtitle: "Select your departure country and let AI calculate the optimal multi-stage route to Quy Nhon.",
        labelOrigin: "Where are you traveling from?",
        labelLanguage: "Assistant Language",
        labelDestination: "Destination",
        destFixed: "Quy Nhon, Binh Dinh (Vietnam)",
        btnPlan: "Generate AI Journey Plan",
        btnPlanning: "AI Analyzing Route...",

        // AI Assistant Card
        aiCardTitle: "AI Travel Assistant",
        aiOnlineStatus: "AI Agent Active",
        aiThinkingStep1: "Analyzing origin coordinates & international connectivity...",
        aiThinkingStep2: "Evaluating transit gateways (Da Nang / Hanoi / Saigon)...",
        aiThinkingStep3: "Optimizing ground & domestic connections to Quy Nhon...",
        aiThinkingStep4: "Matching curated oceanfront accommodations...",
        aiThinkingDone: "Journey plan generated successfully!",
        btnSpeak: "Listen to AI",
        btnStop: "Stop Audio",
        voicePlaying: "AI is speaking...",
        voicePaused: "Audio stopped",
        voiceNotSupported: "Web Speech API is not supported in this browser.",

        // Journey Timeline
        timelineTitle: "Multi-Modal Journey Route",
        timelineSubtitle: "AI-calculated sequential stages from your home country to Quy Nhon.",
        mockDisclaimerBadge: "SIMULATION / MOCK DATA FOR DEMO PURPOSES",
        stepFlightTag: "FLIGHT STAGE",
        stepTransferTag: "TRANSFER STAGE",
        stepHotelTag: "STAY RECOMMENDATION",
        stepExploreTag: "DESTINATION EXPERIENCE",

        // Map Section
        mapTitle: "Interactive Route Map",
        mapSubtitle: "Global visual preview showing flight paths and scenic ground transfers to Quy Nhon.",
        mapLegendOrigin: "Departure Country",
        mapLegendTransit: "Transit Gateway",
        mapLegendDest: "Quy Nhon Destination",

        // Hotel Section
        hotelTitle: "Curated Accommodations in Quy Nhon",
        hotelSubtitle: "Handpicked beach resorts and boutique sanctuaries matched to your travel profile.",
        btnViewHotel: "Preview Resort",
        modalClose: "Close",
        mockHotelNotice: "Hotel rates and availability are simulated mock data for prototype demonstration.",

        // Future Features
        roadmapTitle: "Coming Next: Production Roadmap",
        roadmapSubtitle: "How this prototype will evolve into a full-scale AI travel platform.",

        // Footer
        footerNotice: "Quy Nhon AI Travel Assistant is a functional design prototype developed for pitching and presentation.",
        footerDisclaimer: "Flight routes, times, prices, and hotel offerings displayed are simulated mock data."
    },
    vi: {
        brand: "Quy Nhon AI Travel",
        brandTag: "Trợ Lý Du Lịch Thông Minh",
        protoBadge: "Bản Thử Nghiệm Tương Tác",
        navPlanner: "Lên Kế Hoạch AI",
        navMap: "Bản Đồ Tuyến Đường",
        navHotels: "Khách Sạn",
        navRoadmap: "Lộ Trình Tương Lai",

        // Hero Section
        heroBadge: "Ý TƯỞNG CÔNG NGHỆ DU LỊCH AI",
        heroTitle: "Hành Trình Đến Quy Nhơn, Khởi Tạo Bởi AI",
        heroSubtitle: "Xóa tan rào cản di chuyển quốc tế với trợ lý AI tự động lập lịch trình đa phương thức, kết hợp các chặng bay tối ưu và cung đường ngắm cảnh tuyệt đẹp.",
        heroCta: "Bắt Đầu Lên Kế Hoạch",
        heroExploreBadge: "Thiên đường biển hoang sơ miền Trung Việt Nam",

        // Planner Section
        plannerTitle: "Lập Lịch Trình Thông Minh",
        plannerSubtitle: "Chọn quốc gia xuất phát của bạn để AI tính toán lộ trình từng chặng đến Quy Nhơn dễ dàng nhất.",
        labelOrigin: "Bạn bắt đầu khởi hành từ đâu?",
        labelLanguage: "Ngôn ngữ trợ lý",
        labelDestination: "Điểm đến",
        destFixed: "Quy Nhơn, Bình Định (Việt Nam)",
        btnPlan: "Khởi Tạo Lộ Trình Bằng AI",
        btnPlanning: "AI Đang Phân Tích Lộ Trình...",

        // AI Assistant Card
        aiCardTitle: "Trợ Lý Du Lịch AI",
        aiOnlineStatus: "AI Đang Hoạt Động",
        aiThinkingStep1: "Đang định vị toạ độ và phân tích mạng lưới hàng không...",
        aiThinkingStep2: "Đánh giá các trạm trung chuyển tối ưu (Đà Nẵng / Hà Nội / TP.HCM)...",
        aiThinkingStep3: "Tối ưu hóa các chặng nối tiếp đường bộ và đường bay nội địa...",
        aiThinkingStep4: "Lựa chọn các điểm nghỉ dưỡng biển phù hợp nhất tại Quy Nhơn...",
        aiThinkingDone: "Kế hoạch hành trình đã hoàn tất!",
        btnSpeak: "Nghe AI Thuyết Minh",
        btnStop: "Dừng Lại",
        voicePlaying: "AI đang thuyết minh...",
        voicePaused: "Đã dừng phát âm thanh",
        voiceNotSupported: "Trình duyệt không hỗ trợ Web Speech API.",

        // Journey Timeline
        timelineTitle: "Lộ Trình Di Chuyển Đa Phương Thức",
        timelineSubtitle: "Các chặng hành trình tuần tự do AI phân tích từ quốc gia của bạn đến Quy Nhơn.",
        mockDisclaimerBadge: "DỮ LIỆU MÔ PHỎNG / MOCK DATA PHỤC VỤ DEMO",
        stepFlightTag: "CHẶNG BAY QUỐC TẾ",
        stepTransferTag: "CHẶNG TRUNG CHUYỂN",
        stepHotelTag: "ĐIỂM NGHỈ DƯỠNG",
        stepExploreTag: "TRẢI NGHIỆM ĐIỂM ĐẾN",

        // Map Section
        mapTitle: "Bản Đồ Tuyến Đường Tương Tác",
        mapSubtitle: "Hình ảnh trực quan toàn cầu thể hiện chặng bay và cung đường trung chuyển ven biển đến Quy Nhơn.",
        mapLegendOrigin: "Điểm Xuất Phát",
        mapLegendTransit: "Trạm Trung Chuyển",
        mapLegendDest: "Điểm Đến Quy Nhơn",

        // Hotel Section
        hotelTitle: "Gợi Ý Khách Sạn & Resort Tại Quy Nhơn",
        hotelSubtitle: "Những khu nghỉ dưỡng biển tuyệt đẹp được AI tuyển chọn kỹ lưỡng theo sở thích du khách quốc tế.",
        btnViewHotel: "Xem Chi Tiết",
        modalClose: "Đóng",
        mockHotelNotice: "Giá phòng và thông tin khách sạn là dữ liệu mô phỏng phục vụ trình diễn prototype.",

        // Future Features
        roadmapTitle: "Lộ Trình Phát Triển Sản Phẩm",
        roadmapSubtitle: "Các tính năng sẽ được phát triển tiếp theo khi tích hợp AI và hệ sinh thái du lịch thực tế.",

        // Footer
        footerNotice: "Quy Nhon AI Travel Assistant là bản mẫu thiết kế tương tác phục vụ trình bày và thuyết trình ý tưởng.",
        footerDisclaimer: "Tất cả các chặng bay, thời gian di chuyển, giá vé và phòng khách sạn đều là dữ liệu mô phỏng."
    }
};

/**
 * Helper lấy text bản dịch
 */
function t(key, lang = 'en') {
    if (TRANSLATIONS[lang] && TRANSLATIONS[lang][key]) {
        return TRANSLATIONS[lang][key];
    }
    if (TRANSLATIONS.en[key]) {
        return TRANSLATIONS.en[key];
    }
    return key;
}
