/**
 * Quy Nhon AI Travel Assistant - Translations (EN / VI)
 * Độc lập quản lý toàn bộ nội dung ngôn ngữ giao diện & kịch bản giọng nói AI.
 */

const TRANSLATIONS = {
    en: {
        brand: "Quy Nhon AI Travel",
        brandTag: "Next-Gen Travel Intelligence",
        protoBadge: "Smart Travel Experience",
        navPlanner: "AI Planner",
        navDestination: "Destination",
        navMap: "World Route",
        navHotels: "Hotels",
        navRoadmap: "Roadmap",
        navTeam: "Founders",

        // Hero Section
        heroBadge: "AI-POWERED TRAVEL PLATFORM",
        heroTitle: "Your Journey to Quy Nhon, Powered by AI",
        heroSubtitle: "Solving international transit friction with intelligent multi-modal journey planning, smart scenic transfers, and personalized seaside stays.",
        heroCta: "Plan My Journey",
        heroExploreBadge: "Central Vietnam's Hidden Coastal Paradise",

        // Planner Section
        plannerTitle: "AI Journey Planner",
        plannerSubtitle: "Select your departure country and let AI calculate the optimal multi-stage route to Quy Nhon.",
        plannerExperienceBadge: "SMART ITINERARY GENERATOR",
        labelOrigin: "Where are you traveling from?",
        labelBudget: "Travel Budget",
        labelLanguage: "Assistant Language",
        labelDestination: "Destination",
        btnViewDestInsights: "Explore Environment & Landscapes",
        destFixed: "Quy Nhon, Binh Dinh (Vietnam)",
        tabEnvironment: "Environment & Climate",
        tabLandscapes: "Spectacular Landscapes",
        tabRatings: "Traveler Ratings & Reviews",
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
        aiVerifiedBadge: "VERIFIED AI CONCIERGE",

        // Journey Timeline
        timelineTitle: "Multi-Modal Journey Route",
        timelineSubtitle: "AI-calculated sequential stages from your home country to Quy Nhon.",
        mockDisclaimerBadge: "AI MULTI-MODAL OPTIMIZATION",
        routeBadge: "AI MULTI-MODAL OPTIMIZATION",
        flightSearchCtaTitle: "Check Live Fares for Your Travel Dates",
        flightSearchCtaSub: "Directly opens Google Flights with pre-filled route",
        btnSearchGoogleFlights: "Search on Google Flights",
        stepFlightTag: "FLIGHT STAGE",
        stepTransferTag: "TRANSFER STAGE",
        stepHotelTag: "STAY RECOMMENDATION",
        stepExploreTag: "DESTINATION EXPERIENCE",

        // Map Section
        mapTitle: "Interactive Route Map",
        mapSubtitle: "Global visual preview showing flight paths and scenic ground transfers to Quy Nhon.",
        mapBadge: "GLOBAL ROUTE NETWORK",
        mapLegendOrigin: "Departure Country",
        mapLegendTransit: "Transit Gateway",
        mapLegendDest: "Quy Nhon Destination",

        // Hotel Section
        hotelTitle: "Curated Accommodations in Quy Nhon",
        hotelSubtitle: "Handpicked beach resorts and boutique sanctuaries matched to your travel profile.",
        hotelPortfolioBadge: "VERIFIED 4★ & 5★ SELECTION",
        btnViewHotel: "Resort Details",
        btnCheckAvailability: "Check Availability on Booking.com",
        modalRefRate: "Reference Rate",
        modalClose: "Close",
        mockHotelNotice: "💡 Booking.com Verified: Rates reflect real-time seasonal estimates. Instant confirmation and free cancellation available on select rates.",

        // Future Features
        roadmapTitle: "Coming Next: Production Roadmap",
        roadmapSubtitle: "How our platform expands and scales AI travel capabilities.",

        // Feature 1: Route Timeline, Carbon & Budget Allocation
        carbonFootprint: "Est. Carbon Footprint",
        ecoChoiceBadge: "🌱 Eco Choice: -38% CO₂",
        lowerEmissionBadge: "🌱 Lower Emissions: -20% CO₂",
        carbonMethodology: "Calculated with ICAO / DEFRA emission factors. Illustrative benchmark.",
        budgetBreakdownTitle: "Visual Budget Allocation",
        budgetBreakdownSubtitle: "Estimated breakdown based on current route and 3-day Quy Nhon stay",
        transitCostLabel: "Transit & Travel",
        stayDiningCostLabel: "Stay & Dining (3 Days)",
        experienceSavingsLabel: "Experience Budget",
        budgetShortfallLabel: "Budget Shortfall",
        budgetShortfallNotice: "Selected budget is lower than estimated minimum trip expenses. Consider increasing your budget.",

        // Feature 2: Weather & Seasonal Intelligence
        weatherWidgetTitle: "Quy Nhon Live Weather & Seasonal Intelligence",
        weatherLiveStatus: "Live Data",
        weatherSampleStatus: "Live Weather Service",
        weatherWind: "Wind",
        weatherHumidity: "Humidity",
        weatherSeasonalTip: "Seasonal Advice",
        weatherLoading: "Updating weather...",

        // Feature 3: AI Travel Concierge
        chatDrawerTitle: "Quy Nhon AI Concierge",
        chatDrawerSubtitle: "Ask anything about transit, dining, culture & hidden gems",
        chatInputPlaceholder: "Ask about transit, beaches, food, costs...",
        chatSendBtn: "Send",
        chatQuickPrompt1: "☔ Rainy-day backup plan",
        chatQuickPrompt2: "✈️ Phu Cat Airport to Quy Nhon",
        chatQuickPrompt3: "🍲 Must-try local dishes",
        chatQuickPrompt4: "💰 Optimize my budget",
        chatSourceGemini: "AI Concierge",
        chatSourceLocal: "Local Travel Knowledge Base",
        chatThinking: "AI Concierge is typing...",
        chatOpenBtn: "AI Concierge",

        // Feature 4: Digital Trip Pass
        btnGetTripPass: "Get Digital Trip Pass",
        tripPassTitle: "Quy Nhon Digital Trip Pass",
        tripPassSubtitle: "Boarding pass & personalized 3-day travel intelligence",
        passPassenger: "Traveler Origin",
        passDestination: "Destination Gateway",
        passRouteOption: "Selected Route",
        passEstCost: "Est. Transit Cost",
        passEstCarbon: "Est. Carbon Footprint",
        passBudgetSplit: "Budget Summary",
        passItineraryHighlights: "3-Day Itinerary Highlights",
        passScanQr: "Scan QR to open this trip plan on mobile",
        passCopyLink: "Copy Share Link",
        passPrintPdf: "Print / Save PDF",
        toastLinkCopied: "✓ Shareable journey link copied to clipboard!",
        toastCopyFailed: "Could not copy link to clipboard.",
        offlineQrNote: "Offline Mode — URL preserved in share link below",

        // Roadmap & Founding Team
        roadmapBadge: "ECOSYSTEM ROADMAP",
        roadmapSubtitle: "How our platform expands and scales AI travel capabilities.",
        teamTitle: "Founding Team & Visionaries",
        teamSubtitle: "The passionate interdisciplinary minds driving Quy Nhon AI Travel Assistant.",
        teamBadge: "FOUNDING TEAM",
        chauMajor: "Information Technology",
        chauRole: "Chief Technology & AI Lead",
        chauBio: "Architected end-to-end platform architecture, multi-modal routing algorithms, Gemini AI integration, and localized user experience.",
        khangMajor: "Chemical Engineering",
        khangRole: "R&D & Environmental Analyst",
        khangBio: "Pioneered carbon footprint modeling (ICAO/DEFRA), eco-conscious travel metrics, and sustainable coastal conservation initiatives.",
        nhungMajor: "Chinese Linguistics",
        nhungRole: "Localization & Cultural Strategy",
        nhungBio: "Led cross-cultural localization, international traveler experience research, and strategic tourism communication across Asian markets.",
        footerNotice: "Quy Nhon AI Travel Assistant is an intelligent travel platform designed to connect international travelers to Quy Nhon, Vietnam.",
        footerDisclaimer: "Flight schedules and hotel rates reflect seasonal benchmarks. Direct bookings and searches are connected with Booking.com and Google Flights."
    },
    vi: {
        brand: "Quy Nhon AI Travel",
        brandTag: "Trợ Lý Du Lịch Thông Minh",
        protoBadge: "Trải Nghiệm Du Lịch Thông Minh",
        navPlanner: "Lên Kế Hoạch AI",
        navDestination: "Điểm Đến",
        navMap: "Bản Đồ Tuyến Đường",
        navHotels: "Khách Sạn",
        navRoadmap: "Lộ Trình Tương Lai",
        navTeam: "Đội Ngũ Sáng Lập",

        // Hero Section
        heroBadge: "NỀN TẢNG DU LỊCH THÔNG MINH AI",
        heroTitle: "Hành Trình Đến Quy Nhơn, Khởi Tạo Bởi AI",
        heroSubtitle: "Xóa tan rào cản di chuyển quốc tế với trợ lý AI tự động lập lịch trình đa phương thức, kết hợp các chặng bay tối ưu và cung đường ngắm cảnh tuyệt đẹp.",
        heroCta: "Bắt Đầu Lên Kế Hoạch",
        heroExploreBadge: "Thiên đường biển hoang sơ miền Trung Việt Nam",

        // Planner Section
        plannerTitle: "Lập Lịch Trình Thông Minh",
        plannerSubtitle: "Chọn quốc gia xuất phát của bạn để AI tính toán lộ trình từng chặng đến Quy Nhơn dễ dàng nhất.",
        plannerExperienceBadge: "TẠO LỊCH TRÌNH THÔNG MINH",
        labelOrigin: "Bạn bắt đầu khởi hành từ đâu?",
        labelBudget: "Ngân sách chuyến đi",
        labelLanguage: "Ngôn ngữ trợ lý",
        labelDestination: "Điểm đến",
        btnViewDestInsights: "Xem Môi Trường & Cảnh Quan",
        destFixed: "Quy Nhơn, Bình Định (Việt Nam)",
        tabEnvironment: "Môi Trường & Sinh Thái",
        tabLandscapes: "Cảnh Quan Kỳ Vĩ",
        tabRatings: "Đánh Giá Du Khách",
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
        aiVerifiedBadge: "TRỢ LÝ AI CHUẨN XÁC",

        // Journey Timeline
        timelineTitle: "Lộ Trình Di Chuyển Đa Phương Thức",
        timelineSubtitle: "Các chặng hành trình tuần tự do AI phân tích từ quốc gia của bạn đến Quy Nhơn.",
        mockDisclaimerBadge: "TỐI ƯU HÓA ĐA PHƯƠNG TIỆN",
        routeBadge: "TỐI ƯU HÓA ĐA PHƯƠNG TIỆN",
        flightSearchCtaTitle: "Tra cứu giá vé theo ngày khởi hành thực tế",
        flightSearchCtaSub: "Chuyển tiếp sang Google Flights với tuyến bay được điền sẵn",
        btnSearchGoogleFlights: "Tìm chuyến bay trên Google Flights",
        stepFlightTag: "CHẶNG BAY QUỐC TẾ",
        stepTransferTag: "CHẶNG TRUNG CHUYỂN",
        stepHotelTag: "ĐIỂM NGHỈ DƯỠNG",
        stepExploreTag: "TRẢI NGHIỆM ĐIỂM ĐẾN",

        // Map Section
        mapTitle: "Bản Đồ Tuyến Đường Tương Tác",
        mapSubtitle: "Hình ảnh trực quan toàn cầu thể hiện chặng bay và cung đường trung chuyển ven biển đến Quy Nhơn.",
        mapBadge: "MẠNG LƯỚI TUYẾN ĐƯỜNG TOÀN CẦU",
        mapLegendOrigin: "Điểm Xuất Phát",
        mapLegendTransit: "Trạm Trung Chuyển",
        mapLegendDest: "Điểm Đến Quy Nhơn",

        // Hotel Section
        hotelTitle: "Gợi Ý Khách Sạn & Resort Tại Quy Nhơn",
        hotelSubtitle: "Những khu nghỉ dưỡng biển tuyệt đẹp được tuyển chọn kỹ lưỡng theo sở thích du khách.",
        hotelPortfolioBadge: "TUYỂN CHỌN NGHỈ DƯỠNG 4★ & 5★",
        btnViewHotel: "Xem Chi Tiết",
        btnCheckAvailability: "Kiểm tra phòng trên Booking.com",
        modalRefRate: "Mức giá tham khảo",
        modalClose: "Đóng",
        mockHotelNotice: "💡 Xác thực Booking.com: Giá phòng theo mùa du lịch thực tế. Hỗ trợ giữ phòng nhanh chóng và chính sách hủy miễn phí tùy hạng phòng.",

        // Future Features
        roadmapTitle: "Lộ Trình Phát Triển Sản Phẩm",
        roadmapSubtitle: "Các tính năng sẽ được phát triển tiếp theo khi tích hợp AI và hệ sinh thái du lịch thực tế.",

        // Feature 1: Route Timeline, Carbon & Budget Allocation
        carbonFootprint: "Phát thải CO₂e ước tính",
        ecoChoiceBadge: "🌱 Lựa chọn Xanh: Giảm 38% CO₂",
        lowerEmissionBadge: "🌱 Phát thải thấp: Giảm 20% CO₂",
        carbonMethodology: "Ước tính theo chỉ số phát thải ICAO / DEFRA phục vụ so sánh tham khảo.",
        budgetBreakdownTitle: "Phân Bổ Ngân Sách Dự Kiến",
        budgetBreakdownSubtitle: "Phân bổ chi phí dự kiến theo phương án di chuyển và 3 ngày lưu trú tại Quy Nhơn",
        transitCostLabel: "Vé máy bay & Di chuyển",
        stayDiningCostLabel: "Khách sạn & Ẩm thực (3 ngày)",
        experienceSavingsLabel: "Kinh phí trải nghiệm & Hoạt động",
        budgetShortfallLabel: "Thiếu hụt ngân sách",
        budgetShortfallNotice: "Ngân sách bạn chọn thấp hơn chi phí tối thiểu ước tính cho chuyến đi. Hãy cân nhắc điều chỉnh ngân sách.",

        // Feature 2: Weather & Seasonal Intelligence
        weatherWidgetTitle: "Thời Tiết & Lời Khuyên Mùa Du Lịch Quy Nhơn",
        weatherLiveStatus: "Thời gian thực",
        weatherSampleStatus: "Thời tiết trực tiếp",
        weatherWind: "Gió",
        weatherHumidity: "Độ ẩm",
        weatherSeasonalTip: "Lời khuyên theo mùa",
        weatherLoading: "Đang cập nhật thời tiết...",

        // Feature 3: AI Travel Concierge
        chatDrawerTitle: "Trợ Lý Du Lịch Quy Nhơn",
        chatDrawerSubtitle: "Hỏi đáp về di chuyển, ẩm thực, văn hóa và điểm tham quan",
        chatInputPlaceholder: "Hỏi về di chuyển, bãi biển, ẩm thực, chi phí...",
        chatSendBtn: "Gửi",
        chatQuickPrompt1: "☔ Kế hoạch ngày mưa",
        chatQuickPrompt2: "✈️ Từ sân bay Phù Cát về trung tâm",
        chatQuickPrompt3: "🍲 Món ngon bản địa phải thử",
        chatQuickPrompt4: "💰 Tối ưu ngân sách chuyến đi",
        chatSourceGemini: "Trợ lý AI",
        chatSourceLocal: "Cơ sở tri thức bản địa",
        chatThinking: "Trợ lý AI đang trả lời...",
        chatOpenBtn: "Hỏi Trợ Lý AI",

        // Feature 4: Digital Trip Pass
        btnGetTripPass: "Tạo Vé Hành Trình Điện Tử",
        tripPassTitle: "Vé Hành Trình Điện Tử Quy Nhơn",
        tripPassSubtitle: "Thẻ hành trình & kế hoạch du lịch cá nhân hóa 3 ngày",
        passPassenger: "Khởi hành từ",
        passDestination: "Điểm đến",
        passRouteOption: "Gói hành trình",
        passEstCost: "Chi phí di chuyển",
        passEstCarbon: "Phát thải CO₂ ước tính",
        passBudgetSplit: "Tổng quan ngân sách",
        passItineraryHighlights: "Điểm nhấn lịch trình 3 ngày",
        passScanQr: "Quét mã QR để mở hành trình này trên di động",
        passCopyLink: "Sao Chép Liên Kết",
        passPrintPdf: "In / Lưu PDF",
        toastLinkCopied: "✓ Đã sao chép liên kết hành trình vào bộ nhớ tạm!",
        toastCopyFailed: "Không thể sao chép liên kết.",
        offlineQrNote: "Chế độ ngoại tuyến — URL được lưu trong liên kết bên dưới",

        // Roadmap & Founding Team
        roadmapBadge: "HỆ SINH THÁI PHÁT TRIỂN",
        roadmapSubtitle: "Kế hoạch phát triển và mở rộng các năng lực công nghệ du lịch AI.",
        teamTitle: "Đội Ngũ Sáng Lập & Phát Triển",
        teamSubtitle: "Đội ngũ liên ngành đầy nhiệt huyết đứng sau nền tảng Trợ lý Du lịch Quy Nhơn AI.",
        teamBadge: "ĐỘI NGŨ SÁNG LẬP",
        chauMajor: "Ngành Công nghệ Thông tin",
        chauRole: "Trưởng nhóm Công nghệ & Phát triển Hệ thống AI",
        chauBio: "Chủ trì kiến trúc kỹ thuật toàn diện, xây dựng mô hình định tuyến đa phương thức, tích hợp trợ lý AI Gemini và phát triển giao diện người dùng tối ưu trải nghiệm quốc tế.",
        khangMajor: "Ngành Công nghệ Hóa học",
        khangRole: "Nghiên cứu & Đánh giá Tác động Môi trường",
        khangBio: "Phụ trách nghiên cứu và mô hình hóa chỉ số phát thải carbon CO₂e (ICAO/DEFRA), đề xuất các giải pháp di chuyển bền vững và bảo vệ hệ sinh thái cảnh quan biển Quy Nhơn.",
        nhungMajor: "Ngành Ngôn ngữ Trung",
        nhungRole: "Bản địa hóa Đa ngôn ngữ & Truyền thông Quốc tế",
        nhungBio: "Phụ trách bản địa hóa nội dung đa văn hóa, nghiên cứu hành vi du khách quốc tế và xây dựng cầu nối truyền thông đưa vẻ đẹp Quy Nhơn tiếp cận thị trường du lịch toàn cầu.",
        footerNotice: "Quy Nhơn AI Travel Assistant là nền tảng du lịch thông minh hỗ trợ du khách khám phá thành phố biển Quy Nhơn, Bình Định.",
        footerDisclaimer: "Lịch trình bay và giá phòng phản ánh mức giá tham chiếu theo mùa. Dịch vụ đặt phòng và tra cứu vé thực tế được kết nối trực tiếp qua Booking.com và Google Flights."
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
