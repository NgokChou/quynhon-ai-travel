/**
 * Quy Nhon AI Travel Assistant - Mock Data & Dynamic Content Generator
 * 
 * Lưu ý minh bạch dữ liệu:
 * - Các tuyến bay quốc tế đường dài và nội địa được xây dựng dựa trên thông tin đường bay thực tế của các hãng
 *   hàng không (Vietnam Airlines, Bamboo Airways, Vietjet Air, Air France, Qatar Airways, ANA...)
 *   kết hợp dữ liệu mô phỏng tham khảo cho bản demo pitching.
 * - Các chuyến bay đều có thuộc tính `dataSource`: "verified" (lộ trình thực tế đã xác minh) hoặc "simulated" (dữ liệu mô phỏng).
 * - Sân bay trọng tâm tại Việt Nam:
 *   1. HAN (Sân bay Quốc tế Nội Bài - Hà Nội)
 *   2. DAD (Sân bay Quốc tế Đà Nẵng)
 *   3. UIH (Sân bay Phù Cát - Bình Định / Quy Nhơn)
 *   Kèm kết nối SGN (Sân bay Quốc tế Tân Sơn Nhất - TP.HCM) cho các tuyến từ Bờ Tây Mỹ và Châu Đại Dương.
 */

// Điểm đến trung tâm: Quy Nhơn, Bình Định (Hồ sơ Môi trường, Cảnh quan & Đánh giá)
const MOCK_DESTINATION = {
    id: "quynhon",
    name: "Quy Nhon, Binh Dinh",
    country: "Vietnam",
    lat: 13.7820,
    lng: 109.2197,
    airportCode: "UIH",
    airportName: "Phu Cat Airport",
    airportCoords: { lat: 13.9556, lng: 109.0433 },
    tagline: {
        en: "Emerald Waters, Untouched Coastal Cliffs & Ancient Cham Heritage",
        vi: "Biển ngọc nguyên sơ, kỳ quan vách đá lộng gió & di sản Chăm cổ kính"
    },
    awards: {
        en: "ASEAN Clean Tourist City Standard Award Winner",
        vi: "Đạt chuẩn Thành phố Du lịch Sạch ASEAN"
    },
    description: {
        en: "Coastal gem of Central Vietnam renowned for emerald seas, Cham architectural towers, and fresh seafood.",
        vi: "Viên ngọc biển miền Trung nổi tiếng với biển xanh ngọc bích, tháp Chăm cổ kính và hải sản tươi ngon."
    },
    bannerImage: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80",
    
    // 1. Chỉ số Môi trường & Sinh thái
    environment: {
        airQuality: {
            aqi: 20,
            status: { en: "Excellent (Very Pure)", vi: "Rất tốt (Trong lành tuyệt đối)" },
            desc: {
                en: "Coastal breeze rich in iodine and fresh oxygen filtered through surrounding lush mountain ridges, with minimal urban industrial pollution.",
                vi: "Gió biển tự nhiên giàu i-ốt và khí tươi dồi dào được điều hòa bởi các dãy núi nhiệt đới bao bọc, hoàn toàn không bị ô nhiễm công nghiệp."
            }
        },
        seaWater: {
            color: { en: "Emerald Turquoise", vi: "Xanh ngọc bích trong suốt" },
            visibility: "12 - 15m",
            status: { en: "Pristine Marine Sanctuary", vi: "Vùng biển bảo tồn nguyên sơ" },
            desc: {
                en: "Unpolluted clear waters home to living coral reefs and thriving marine life at Ky Co, Hon Kho and Cu Lao Xanh.",
                vi: "Nước biển trong vắt nhìn thấy đáy, bảo tồn hệ sinh thái rạn san hô tự nhiên đa tầng tại Kỳ Co, Hòn Khô và đảo Cù Lao Xanh."
            }
        },
        climate: {
            bestSeason: { en: "March to September (Dry & Sunny)", vi: "Tháng 3 đến tháng 9 (Mùa khô nắng vàng, biển êm)" },
            avgTemp: "28°C / 82°F",
            sunshineHours: "2,450 hrs/year",
            desc: {
                en: "Tropical maritime climate with steady soothing coastal breezes, moderate humidity and bright sunny days for outdoor adventures.",
                vi: "Khí hậu nhiệt đới gió mùa biển mát mẻ, nắng vàng rực rỡ, độ ẩm dễ chịu, lý tưởng cho các hoạt động tắm biển và dã ngoại."
            }
        },
        ecoMetrics: [
            { icon: "wind", label: { en: "Air Quality (AQI)", vi: "Chất lượng không khí (AQI)" }, val: "20", status: { en: "Pure / Clean", vi: "Rất trong lành" } },
            { icon: "water", label: { en: "Water Visibility", vi: "Độ trong nước biển" }, val: "15m", status: { en: "Crystal Clear", vi: "Trong vắt đáy" } },
            { icon: "sun", label: { en: "Avg Temperature", vi: "Nhiệt độ trung bình" }, val: "28°C", status: { en: "Warm & Sunny", vi: "Nắng ấm ôn hòa" } },
            { icon: "award", label: { en: "ASEAN Green Award", vi: "Chuẩn Xanh ASEAN" }, val: "Certified", status: { en: "Clean Tourist City", vi: "Đô thị du lịch sạch" } }
        ]
    },

    // 2. Cảnh quan kỳ vĩ & Di sản văn hóa
    landscapes: [
        {
            name: { en: "Ky Co Beach", vi: "Bãi biển Kỳ Co" },
            tag: { en: "Vietnam's Maldives", vi: "Maldives của Việt Nam" },
            image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            desc: {
                en: "A crescent-shaped secluded bay embraced by majestic towering sea cliffs, offering two-tone emerald water and powder-soft white sand.",
                vi: "Vịnh biển biệt lập hình vầng trăng khuyết nép mình dưới vách đá hùng vĩ, nước biển đổi hai màu xanh ngọc tuyệt đẹp và bờ cát trắng mịn."
            }
        },
        {
            name: { en: "Eo Gio Windy Strait", vi: "Eo Gió lộng gió" },
            tag: { en: "Spectacular Sea Cliffs", vi: "Vách đá kỳ vĩ & Hoàng hôn" },
            image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=800&q=80",
            desc: {
                en: "Dramatic red-clay walking path hugging colossal ocean rock formations, famed as Vietnam's most scenic sunset strait.",
                vi: "Cung đường bậc thang uốn lượn ven vách núi đá sừng sững ôm trọn biển Đông, được mệnh danh là nơi ngắm hoàng hôn đẹp nhất Việt Nam."
            }
        },
        {
            name: { en: "Queen's Beach (Ghenh Rang)", vi: "Bãi Trứng Ghềnh Ráng Tiên Sa" },
            tag: { en: "Giant Stone Pebbles", vi: "Bãi đá trứng chim thần" },
            image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80",
            desc: {
                en: "Thousands of giant round egg-shaped rocks polished by ocean surf, nestled adjacent to legendary poet Han Mac Tu's peaceful hilltop memorial.",
                vi: "Hàng ngàn viên đá khổng lồ tròn nhẵn như quả trứng chim thần từng dành riêng cho Nam Phương Hoàng hậu, kề bên đồi thi nhân Hàn Mặc Tử."
            }
        },
        {
            name: { en: "Phuong Mai Sand Dunes & Peninsula", vi: "Đồi cát & Bán đảo Phương Mai" },
            tag: { en: "Golden Coastal Desert", vi: "Sa mạc cát vàng kề biển" },
            image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=800&q=80",
            desc: {
                en: "Vast golden rolling sand dunes towering over azure waters, offering thrilling sandboarding and scenic views across Thi Nai lagoon bridge.",
                vi: "Đồi cát vàng mênh mông uốn lượn kề biển ngọc, điểm trượt cát ngoạn mục và ngắm cây cầu vượt biển Thị Nại dài gần 2.5km."
            }
        },
        {
            name: { en: "Banh It & Twin Cham Towers", vi: "Tháp Chăm Bánh Ít & Tháp Đôi" },
            tag: { en: "1,000-Year Heritage", vi: "Di sản Champa 1.000 năm" },
            image: "https://images.unsplash.com/photo-1584810359583-96fc3448beaa?auto=format&fit=crop&w=800&q=80",
            desc: {
                en: "Mysterious ancient red-brick architectural towers built in the 10th-12th century, listed among world-class architectural wonders to visit.",
                vi: "Quần thể tháp Chăm ngàn năm tuổi uy nghiêm trên đồi cao lộng gió, được ghi danh vào cẩm nang '1.001 công trình kiến trúc phải đến trong đời'."
            }
        }
    ],

    // 3. Đánh giá & Xếp hạng từ Du khách Quốc tế
    ratings: {
        overall: 4.88,
        totalReviews: 1420,
        criteria: [
            { name: { en: "Safety & Welcoming Hospitality", vi: "An toàn & Người dân thân thiện" }, score: "4.9 / 5.0", percent: 98 },
            { name: { en: "Pristine Environment & Cleanliness", vi: "Môi trường trong sạch & Vệ sinh biển" }, score: "4.8 / 5.0", percent: 96 },
            { name: { en: "Serene & Uncrowded Atmosphere", vi: "Không khí thanh bình, không xô bồ" }, score: "4.9 / 5.0", percent: 98 },
            { name: { en: "Culinary Quality & Fair Value", vi: "Ẩm thực hải sản & Chi phí hợp lý" }, score: "4.9 / 5.0", percent: 98 }
        ],
        reviews: [
            {
                author: "Thomas Laurent",
                country: "🇫🇷 France",
                date: "September 2026",
                avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80",
                rating: 5,
                comment: {
                    en: "Quy Nhon is what Bali or Phuket used to be 30 years ago — raw, peaceful, with genuinely welcoming people, emerald waters, and incredible fresh seafood. The air quality is so fresh!",
                    vi: "Quy Nhơn đẹp như Bali hay Phuket của 30 năm trước: hoang sơ, yên bình, người dân cực kỳ thân thiện, biển xanh ngọc và hải sản tươi ngon tuyệt vời. Bầu không khí trong lành khó nơi nào sánh được!"
                }
            },
            {
                author: "Sarah Mitchell",
                country: "🇦🇺 Australia",
                date: "October 2026",
                avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=120&q=80",
                rating: 5,
                comment: {
                    en: "The coastline at Eo Gio and Ky Co took my breath away. No pushy vendors, completely clean beaches. A true paradise for travelers looking for peaceful luxury.",
                    vi: "Bờ biển Eo Gió và Kỳ Co làm tôi ngỡ ngàng. Không có cảnh chèo kéo du khách, bãi biển hoàn toàn sạch rác. Thiên đường đích thực cho những ai tìm kiếm sự thư thái và thanh bình."
                }
            },
            {
                author: "Kenji Tanaka",
                country: "🇯🇵 Japan",
                date: "August 2026",
                avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
                rating: 5,
                comment: {
                    en: "Standing on the hill of Banh It Cham Tower with the breeze blowing and green countryside below felt spiritual. Very safe city to walk at night, excellent seafood pancakes!",
                    vi: "Đứng trên đỉnh đồi Tháp Bánh Ít nghe gió reo và ngắm trọn đồng quê xanh mát mang lại cảm giác an yên như thiền định. Thành phố rất an toàn khi đi dạo đêm, bánh xèo tôm nhảy siêu ngon!"
                }
            }
        ]
    }
};

// Sân bay trọng điểm tại Việt Nam
const VIETNAM_AIRPORTS = {
    HAN: {
        code: "HAN",
        city: "Hanoi",
        name: { en: "Noi Bai International Airport", vi: "Sân bay Quốc tế Nội Bài" },
        lat: 21.2212,
        lng: 105.8072,
        role: "Northern International Gateway & Primary Connection to UIH"
    },
    DAD: {
        code: "DAD",
        city: "Da Nang",
        name: { en: "Da Nang International Airport", vi: "Sân bay Quốc tế Đà Nẵng" },
        lat: 16.0544,
        lng: 108.2022,
        role: "Central Vietnam International Hub & Scenic Gateway to Quy Nhon"
    },
    UIH: {
        code: "UIH",
        city: "Quy Nhon (Phu Cat)",
        name: { en: "Phu Cat Airport", vi: "Sân bay Phù Cát" },
        lat: 13.9556,
        lng: 109.0433,
        role: "Direct Domestic Gateway serving Quy Nhon & Binh Dinh"
    },
    SGN: {
        code: "SGN",
        city: "Ho Chi Minh City",
        name: { en: "Tan Son Nhat International Airport", vi: "Sân bay Quốc tế Tân Sơn Nhất" },
        lat: 10.8231,
        lng: 106.6297,
        role: "Southern International Gateway & Major Transfer Hub"
    }
};

/**
 * Dữ liệu quốc gia xuất phát với 3 phương án hành trình cụ thể:
 * 1. fastest: Nhanh nhất (ưu tiên thời gian ngắn nhất, bay nối chuyến thẳng tới UIH - Phù Cát)
 * 2. best-value: Tiết kiệm nhất (cân bằng chi phí, bay quốc tế giá tốt đến DAD/HAN kết hợp xe limousine/tàu)
 * 3. smart-stopover: Dừng chân ngắm cảnh (nghỉ ngơi tại Đà Nẵng/Hà Nội, tàu ngắm cảnh The Vietage hoặc xe ven biển)
 */
const MOCK_COUNTRIES = {
    belgium: {
        id: "belgium",
        name: { en: "Belgium", vi: "Bỉ" },
        flag: "🇧🇪",
        city: "Brussels",
        airport: "Brussels Airport (BRU)",
        lat: 50.8503,
        lng: 4.3517,
        routes: {
            fastest: {
                id: "fastest",
                title: { en: "Fastest Flight Route", vi: "Lộ trình bay nhanh nhất" },
                badge: { en: "FASTEST • MINIMUM TIME", vi: "NHANH NHẤT • TỐI ƯU THỜI GIAN" },
                description: {
                    en: "Optimized for speed: Fly into Hanoi (HAN) and catch a swift connecting flight straight to Phu Cat (UIH).",
                    vi: "Tối ưu tốc độ: Bay qua Hà Nội (HAN) rồi nối chuyến bay thẳng tới Sân bay Phù Cát (UIH)."
                },
                totalDuration: "16h 50m",
                priceRatio: 1.0, // Ngân sách gốc
                transitHub: VIETNAM_AIRPORTS.HAN,
                finalTransport: "uih-taxi",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Intercontinental Flight", vi: "Chuyến bay liên lục địa" },
                        from: "Brussels (BRU)",
                        to: "Hanoi (HAN)",
                        fromCoords: [50.8503, 4.3517],
                        toCoords: [21.2212, 105.8072],
                        subInfo: {
                            en: "1 transit (Doha / Bangkok) • Est. 13h 45m • Airline: Qatar Airways / Vietnam Airlines",
                            vi: "1 điểm quá cảnh (Doha / Bangkok) • Dự kiến 13h 45m • Hãng: Qatar Airways / Vietnam Airlines"
                        },
                        highlight: { en: "Quick transfer at Noi Bai Terminal 1", vi: "Nối chuyến thuận tiện tại ga nội địa Nội Bài" },
                        airline: "Qatar Airways / Vietnam Airlines",
                        duration: "13h 45m",
                        stops: 1,
                        dataSource: "simulated",
                        dataSourceLabel: { en: "Simulated flight data", vi: "Dữ liệu bay mô phỏng" }
                    },
                    {
                        type: "domestic-flight",
                        icon: "plane",
                        title: { en: "Domestic Connecting Flight", vi: "Chuyến bay nội địa nối chuyến" },
                        from: "Hanoi (HAN)",
                        to: "Phu Cat Airport (UIH)",
                        fromCoords: [21.2212, 105.8072],
                        toCoords: [13.9556, 109.0433],
                        subInfo: {
                            en: "Direct flight • 1h 35m • Flight #VN-1396 • Daily scheduled service",
                            vi: "Bay thẳng • 1h 35m • Chuyến bay #VN-1396 • Khung giờ cố định hàng ngày"
                        },
                        highlight: { en: "Verified commercial flight route", vi: "Đường bay thương mại thực tế đã xác minh" },
                        airline: "Vietnam Airlines",
                        duration: "1h 35m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified commercial route", vi: "Tuyến bay thương mại đã xác minh" }
                    },
                    {
                        type: "transfer",
                        icon: "car",
                        title: { en: "Airport Taxi / Private Car", vi: "Taxi sân bay / Xe riêng về thành phố" },
                        from: "Phu Cat Airport (UIH)",
                        to: "Quy Nhon City Center",
                        fromCoords: [13.9556, 109.0433],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "Express Highway • ~35 km • 40 minutes",
                            vi: "Tuyến đường nối sân bay • ~35 km • Khoảng 40 phút"
                        },
                        highlight: { en: "Direct drop-off at your hotel / resort", vi: "Đưa đón tận nơi sảnh khách sạn / resort" },
                        duration: "40m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Ground transport estimate", vi: "Ước tính trung chuyển mặt đất" }
                    }
                ]
            },
            bestValue: {
                id: "best-value",
                title: { en: "Best-Value Coastal Route", vi: "Lộ trình tiết kiệm & Cân bằng" },
                badge: { en: "BEST VALUE • SAVE UP TO 25%", vi: "TIẾT KIỆM • GIẢM ĐẾN 25% CHI PHÍ" },
                description: {
                    en: "Fly into Da Nang (DAD) at competitive fares, then take a comfortable modern limousine bus along National Route 1A to Quy Nhon.",
                    vi: "Bay đến Đà Nẵng (DAD) với vé tiết kiệm, sau đó di chuyển bằng Limousine cao cấp dọc Quốc lộ 1A về Quy Nhơn."
                },
                totalDuration: "20h 30m",
                priceRatio: 0.78,
                transitHub: VIETNAM_AIRPORTS.DAD,
                finalTransport: "dad-limousine",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "International Flight to Central Vietnam", vi: "Chuyến bay quốc tế đến miền Trung" },
                        from: "Brussels (BRU)",
                        to: "Da Nang (DAD)",
                        fromCoords: [50.8503, 4.3517],
                        toCoords: [16.0544, 108.2022],
                        subInfo: {
                            en: "1 stopover • Est. 14h 30m • Mock Flight #AI-882",
                            vi: "1 điểm quá cảnh • Dự kiến 14h 30m • Chuyến bay mô phỏng #AI-882"
                        },
                        highlight: { en: "Arrive at Da Nang International Terminal", vi: "Hạ cánh tại Ga quốc tế Đà Nẵng" },
                        airline: "Partner Airlines",
                        duration: "14h 30m",
                        stops: 1,
                        dataSource: "simulated",
                        dataSourceLabel: { en: "Simulated flight data", vi: "Dữ liệu bay mô phỏng" }
                    },
                    {
                        type: "transfer",
                        icon: "van-shuttle",
                        title: { en: "Scenic Coastal Limousine Transfer", vi: "Xe Limousine cao cấp ven biển" },
                        from: "Da Nang (DAD)",
                        to: "Quy Nhon City",
                        fromCoords: [16.0544, 108.2022],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "Luxury 9-seat limousine • ~300 km • ~5h 15m via coastal Highway 1A",
                            vi: "Xe Limousine 9 chỗ cao cấp • ~300 km • ~5h 15m qua Quốc lộ 1A ven biển"
                        },
                        highlight: { en: "Scenic seaside route through Quang Nam & Quang Ngai", vi: "Ngắm cảnh biển duyên hải miền Trung tuyệt đẹp" },
                        duration: "5h 15m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Commercial transfer route", vi: "Tuyến xe khách liên tỉnh phổ biến" }
                    }
                ]
            },
            smartStopover: {
                id: "smart-stopover",
                title: { en: "Scenic Heritage Railway Stopover", vi: "Dừng chân ngắm cảnh đường sắt di sản" },
                badge: { en: "SCENIC RAILWAY • RELAXING PACE", vi: "ĐƯỜNG SẮT NGẮM CẢNH • TRẢI NGHIỆM THƯ GIÃN" },
                description: {
                    en: "Fly to Da Nang, enjoy an overnight rest near the beach, then take the scenic coastal train to Dieu Tri / Quy Nhon.",
                    vi: "Bay đến Đà Nẵng, nghỉ ngơi ven biển, sau đó trải nghiệm chuyến tàu hỏa ven biển ngắm cảnh vào Ga Diêu Trì / Quy Nhơn."
                },
                totalDuration: "24h (Overnight stay)",
                priceRatio: 0.85,
                transitHub: VIETNAM_AIRPORTS.DAD,
                finalTransport: "dad-train",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "International Flight to Da Nang", vi: "Chuyến bay quốc tế đến Đà Nẵng" },
                        from: "Brussels (BRU)",
                        to: "Da Nang (DAD)",
                        fromCoords: [50.8503, 4.3517],
                        toCoords: [16.0544, 108.2022],
                        subInfo: {
                            en: "1 stopover • Est. 14h 30m • Smooth transfer",
                            vi: "1 điểm dừng • Dự kiến 14h 30m • Nối chuyến thuận tiện"
                        },
                        highlight: { en: "Relaxing evening arrival in Da Nang", vi: "Đến Đà Nẵng thư giãn buổi tối" },
                        duration: "14h 30m",
                        stops: 1,
                        dataSource: "simulated",
                        dataSourceLabel: { en: "Simulated flight data", vi: "Dữ liệu bay mô phỏng" }
                    },
                    {
                        type: "transfer",
                        icon: "train",
                        title: { en: "Coastal Railway / The Vietage Option", vi: "Tàu hỏa ngắm cảnh / Toa tàu The Vietage" },
                        from: "Da Nang Railway Station",
                        to: "Dieu Tri / Quy Nhon Station",
                        fromCoords: [16.0678, 108.2125],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "Scenic coastal train SE / Luxury Vietage carriage • ~5h • Panorama views",
                            vi: "Tàu SE Thống Nhất / Toa hạng sang The Vietage • ~5h • Cửa sổ kính ngắm biển"
                        },
                        highlight: { en: "One of Asia's most picturesque coastal rail routes", vi: "Một trong những cung đường sắt ven biển đẹp nhất Châu Á" },
                        duration: "5h 00m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Vietnam Railways scheduled route", vi: "Tuyến đường sắt quốc gia Việt Nam" }
                    }
                ]
            }
        }
    },

    france: {
        id: "france",
        name: { en: "France", vi: "Pháp" },
        flag: "🇫🇷",
        city: "Paris",
        airport: "Paris Charles de Gaulle (CDG)",
        lat: 48.8566,
        lng: 2.3522,
        routes: {
            fastest: {
                id: "fastest",
                title: { en: "Fastest Direct Gateway via Hanoi", vi: "Lộ trình nhanh nhất qua Hà Nội" },
                badge: { en: "FASTEST • UNDER 14H TRAVEL", vi: "NHANH NHẤT • CHƯA ĐẦY 14H DI CHUYỂN" },
                description: {
                    en: "Non-stop flight from Paris (CDG) to Hanoi (HAN), followed by a 1h 35m connection straight to Phu Cat Airport (UIH).",
                    vi: "Bay thẳng Paris (CDG) đến Hà Nội (HAN), nối chuyến ngay 1h 35m đến Sân bay Phù Cát (UIH)."
                },
                totalDuration: "14h 00m",
                priceRatio: 1.0,
                transitHub: VIETNAM_AIRPORTS.HAN,
                finalTransport: "uih-taxi",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Non-stop Flight to Hanoi", vi: "Chuyến bay thẳng đến Hà Nội" },
                        from: "Paris (CDG)",
                        to: "Hanoi (HAN)",
                        fromCoords: [48.8566, 2.3522],
                        toCoords: [21.2212, 105.8072],
                        subInfo: {
                            en: "Non-stop flight • 11h 30m • Flight #VN-18 (Vietnam Airlines)",
                            vi: "Bay thẳng • 11h 30m • Chuyến bay #VN-18 (Vietnam Airlines)"
                        },
                        highlight: { en: "Verified commercial direct route", vi: "Đường bay thẳng thương mại thực tế đã xác minh" },
                        airline: "Vietnam Airlines",
                        duration: "11h 30m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified non-stop route", vi: "Tuyến bay thẳng đã xác minh" }
                    },
                    {
                        type: "domestic-flight",
                        icon: "plane",
                        title: { en: "Direct Connection to Quy Nhon", vi: "Chuyến bay nối thẳng Quy Nhơn" },
                        from: "Hanoi (HAN)",
                        to: "Phu Cat Airport (UIH)",
                        fromCoords: [21.2212, 105.8072],
                        toCoords: [13.9556, 109.0433],
                        subInfo: {
                            en: "Domestic flight • 1h 35m • Smooth terminal transit",
                            vi: "Bay nội địa • 1h 35m • Chuyển tiếp ga nhanh chóng"
                        },
                        highlight: { en: "Only 40 minutes transfer to Quy Nhon resort", vi: "Chỉ 40 phút ô tô về resort Quy Nhơn" },
                        airline: "Vietnam Airlines / Bamboo Airways",
                        duration: "1h 35m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified commercial route", vi: "Tuyến bay thương mại đã xác minh" }
                    },
                    {
                        type: "transfer",
                        icon: "car",
                        title: { en: "Phu Cat Airport Transfer", vi: "Xe đưa đón sân bay Phù Cát" },
                        from: "Phu Cat (UIH)",
                        to: "Quy Nhon Resort",
                        fromCoords: [13.9556, 109.0433],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "Private car / resort shuttle • 40 minutes",
                            vi: "Xe riêng đón sảnh / shuttle resort • 40 phút"
                        },
                        highlight: { en: "Door-to-door check-in service", vi: "Đưa đón tận sảnh khu nghỉ dưỡng" },
                        duration: "40m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Ground transport estimate", vi: "Ước tính trung chuyển mặt đất" }
                    }
                ]
            },
            bestValue: {
                id: "best-value",
                title: { en: "Southern Hub Connection via HCMC", vi: "Lộ trình tối ưu chi phí qua TP.HCM" },
                badge: { en: "BEST VALUE • POPULAR OPTION", vi: "TIẾT KIỆM • NHIỀU KHUNG GIỜ LỰA CHỌN" },
                description: {
                    en: "Fly into Ho Chi Minh City (SGN), then connect on a 1-hour budget-friendly flight to Phu Cat Airport (UIH).",
                    vi: "Bay đến TP. Hồ Chí Minh (SGN), sau đó nối chuyến bay 1 giờ tiết kiệm đến Sân bay Phù Cát (UIH)."
                },
                totalDuration: "15h 30m",
                priceRatio: 0.82,
                transitHub: VIETNAM_AIRPORTS.SGN,
                finalTransport: "uih-taxi",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Long-haul Flight to HCMC", vi: "Chuyến bay đường dài đến TP.HCM" },
                        from: "Paris (CDG)",
                        to: "Ho Chi Minh City (SGN)",
                        fromCoords: [48.8566, 2.3522],
                        toCoords: [10.8231, 106.6297],
                        subInfo: {
                            en: "Direct or 1 stop • Est. 12h 45m • Flight #VN-10",
                            vi: "Bay thẳng hoặc 1 điểm dừng • Dự kiến 12h 45m • Chuyến bay #VN-10"
                        },
                        highlight: { en: "Verified commercial route", vi: "Tuyến bay thương mại đã xác minh" },
                        airline: "Vietnam Airlines / Air France",
                        duration: "12h 45m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified route", vi: "Tuyến bay đã xác minh" }
                    },
                    {
                        type: "domestic-flight",
                        icon: "plane",
                        title: { en: "Domestic Shuttle Flight", vi: "Chuyến bay nhanh nội địa" },
                        from: "Ho Chi Minh City (SGN)",
                        to: "Phu Cat Airport (UIH)",
                        fromCoords: [10.8231, 106.6297],
                        toCoords: [13.9556, 109.0433],
                        subInfo: {
                            en: "Fast 1h 10m flight • Multiple low-cost airline departures daily",
                            vi: "Chuyến bay nhanh 1h 10m • Nhiều hãng bay giá tốt trong ngày"
                        },
                        highlight: { en: "Frequent daily connections", vi: "Tần suất nhiều chuyến bay mỗi ngày" },
                        airline: "Vietjet Air / Vietnam Airlines",
                        duration: "1h 10m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified domestic route", vi: "Tuyến nội địa đã xác minh" }
                    }
                ]
            },
            smartStopover: {
                id: "smart-stopover",
                title: { en: "Central Coast & Da Nang Stopover", vi: "Dừng chân nghỉ dưỡng Đà Nẵng - Hội An" },
                badge: { en: "HERITAGE STOPOVER", vi: "KẾT HỢP DU LỊCH DI SẢN" },
                description: {
                    en: "Fly into Da Nang (DAD), explore Hoi An Ancient Town, then proceed by coastal limousine to Quy Nhon.",
                    vi: "Bay đến Đà Nẵng (DAD), tham quan phố cổ Hội An, sau đó đi xe limousine ven biển về Quy Nhơn."
                },
                totalDuration: "22h (Flexible stopover)",
                priceRatio: 0.88,
                transitHub: VIETNAM_AIRPORTS.DAD,
                finalTransport: "dad-limousine",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Flight to Da Nang", vi: "Chuyến bay đến Đà Nẵng" },
                        from: "Paris (CDG)",
                        to: "Da Nang (DAD)",
                        fromCoords: [48.8566, 2.3522],
                        toCoords: [16.0544, 108.2022],
                        subInfo: {
                            en: "1 stopover • Est. 14h 00m • Touchdown in Central Vietnam",
                            vi: "1 điểm dừng • Dự kiến 14h 00m • Hạ cánh miền Trung"
                        },
                        highlight: { en: "Gateway to Hoi An & My Son Sanctuary", vi: "Cửa ngõ khám phá Hội An & Thánh địa Mỹ Sơn" },
                        duration: "14h 00m",
                        stops: 1,
                        dataSource: "simulated",
                        dataSourceLabel: { en: "Simulated flight data", vi: "Dữ liệu bay mô phỏng" }
                    },
                    {
                        type: "transfer",
                        icon: "van-shuttle",
                        title: { en: "Luxury Coastal Limousine", vi: "Xe Limousine cao cấp ven biển" },
                        from: "Da Nang / Hoi An",
                        to: "Quy Nhon Resort",
                        fromCoords: [16.0544, 108.2022],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "Panoramic coastal views • ~5h 15m",
                            vi: "Ngắm cảnh biển suốt hành trình • ~5h 15m"
                        },
                        highlight: { en: "Smooth scenic ride with wifi & reclining seats", vi: "Xe êm ái ghế ngả massage ngắm cảnh biển" },
                        duration: "5h 15m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Commercial transfer route", vi: "Tuyến xe khách liên tỉnh phổ biến" }
                    }
                ]
            }
        }
    },

    germany: {
        id: "germany",
        name: { en: "Germany", vi: "Đức" },
        flag: "🇩🇪",
        city: "Frankfurt",
        airport: "Frankfurt Airport (FRA)",
        lat: 50.1109,
        lng: 8.6821,
        routes: {
            fastest: {
                id: "fastest",
                title: { en: "Direct Flight via Hanoi Gateway", vi: "Lộ trình nhanh nhất qua cửa ngõ Hà Nội" },
                badge: { en: "FASTEST • DIRECT TRANSIT", vi: "NHANH NHẤT • NỐI CHUYẾN TRỰC TIẾP" },
                description: {
                    en: "Direct non-stop flight from Frankfurt (FRA) to Hanoi (HAN), then a quick 1h 35m connection to Phu Cat Airport (UIH).",
                    vi: "Bay thẳng Frankfurt (FRA) đến Hà Nội (HAN), sau đó nối chuyến nhanh 1h 35m đến Sân bay Phù Cát (UIH)."
                },
                totalDuration: "13h 45m",
                priceRatio: 1.0,
                transitHub: VIETNAM_AIRPORTS.HAN,
                finalTransport: "uih-taxi",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Non-stop Flight to Hanoi", vi: "Chuyến bay thẳng đến Hà Nội" },
                        from: "Frankfurt (FRA)",
                        to: "Hanoi (HAN)",
                        fromCoords: [50.1109, 8.6821],
                        toCoords: [21.2212, 105.8072],
                        subInfo: {
                            en: "Non-stop direct flight • 11h 20m • Flight #VN-36 (Vietnam Airlines)",
                            vi: "Bay thẳng liên lục địa • 11h 20m • Chuyến bay #VN-36 (Vietnam Airlines)"
                        },
                        highlight: { en: "Verified commercial direct flight", vi: "Đường bay thẳng thương mại thực tế đã xác minh" },
                        airline: "Vietnam Airlines",
                        duration: "11h 20m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified non-stop route", vi: "Tuyến bay thẳng đã xác minh" }
                    },
                    {
                        type: "domestic-flight",
                        icon: "plane",
                        title: { en: "Connecting Flight to Quy Nhon", vi: "Bay nối chuyến đến Quy Nhơn" },
                        from: "Hanoi (HAN)",
                        to: "Phu Cat Airport (UIH)",
                        fromCoords: [21.2212, 105.8072],
                        toCoords: [13.9556, 109.0433],
                        subInfo: {
                            en: "Direct flight • 1h 35m • Terminal transit",
                            vi: "Bay thẳng • 1h 35m • Chuyển tiếp ga nội địa Nội Bài"
                        },
                        highlight: { en: "Scenic aerial view of Phuong Mai peninsula", vi: "Ngắm bán đảo Phương Mai tuyệt đẹp khi hạ cánh" },
                        airline: "Vietnam Airlines / Bamboo Airways",
                        duration: "1h 35m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified commercial route", vi: "Tuyến bay thương mại đã xác minh" }
                    },
                    {
                        type: "transfer",
                        icon: "car",
                        title: { en: "Resort Transfer from Airport", vi: "Xe đưa đón về resort" },
                        from: "Phu Cat Airport (UIH)",
                        to: "Quy Nhon Sanctuary",
                        fromCoords: [13.9556, 109.0433],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "Express shuttle • 40 minutes",
                            vi: "Xe đưa đón cao cấp • 40 phút"
                        },
                        highlight: { en: "Seamless transfer to seaside resort", vi: "Về thẳng khách sạn ven biển nghỉ ngơi" },
                        duration: "40m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Ground transport estimate", vi: "Ước tính trung chuyển mặt đất" }
                    }
                ]
            },
            bestValue: {
                id: "best-value",
                title: { en: "Best-Value Connection via Da Nang", vi: "Lộ trình tiết kiệm qua Đà Nẵng" },
                badge: { en: "BEST VALUE • BALANCED FARE", vi: "TIẾT KIỆM • GIÁ HỢP LÝ" },
                description: {
                    en: "Fly into Da Nang (DAD) with affordable 1-stop fares, followed by a scenic coastal limousine ride to Quy Nhon.",
                    vi: "Bay đến Đà Nẵng (DAD) với vé tiết kiệm, sau đó di chuyển bằng xe limousine ven biển về Quy Nhơn."
                },
                totalDuration: "19h 30m",
                priceRatio: 0.79,
                transitHub: VIETNAM_AIRPORTS.DAD,
                finalTransport: "dad-limousine",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Flight to Da Nang", vi: "Chuyến bay đến Đà Nẵng" },
                        from: "Frankfurt (FRA)",
                        to: "Da Nang (DAD)",
                        fromCoords: [50.1109, 8.6821],
                        toCoords: [16.0544, 108.2022],
                        subInfo: {
                            en: "1 stopover • Est. 13h 45m • Mock Flight #AI-702",
                            vi: "1 điểm dừng • Dự kiến 13h 45m • Chuyến bay mô phỏng #AI-702"
                        },
                        highlight: { en: "Arrive in Central Vietnam", vi: "Hạ cánh tại miền Trung Việt Nam" },
                        duration: "13h 45m",
                        stops: 1,
                        dataSource: "simulated",
                        dataSourceLabel: { en: "Simulated flight data", vi: "Dữ liệu bay mô phỏng" }
                    },
                    {
                        type: "transfer",
                        icon: "van-shuttle",
                        title: { en: "Coastal Limousine Bus", vi: "Xe Limousine ven biển" },
                        from: "Da Nang (DAD)",
                        to: "Quy Nhon City",
                        fromCoords: [16.0544, 108.2022],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "National Route 1A • ~5h 15m • High-speed wifi",
                            vi: "Quốc lộ 1A • ~5h 15m • Đầy đủ wifi và tiện nghi"
                        },
                        highlight: { en: "Save airfare while enjoying ocean scenery", vi: "Tiết kiệm chi phí vé máy bay và ngắm biển" },
                        duration: "5h 15m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Commercial transfer route", vi: "Tuyến xe khách liên tỉnh phổ biến" }
                    }
                ]
            },
            smartStopover: {
                id: "smart-stopover",
                title: { en: "Hanoi Heritage & Nature Discovery", vi: "Dừng chân khám phá Hà Nội & Quy Nhơn" },
                badge: { en: "CULTURE STOPOVER", vi: "KẾT HỢP VĂN HÓA THỦ ĐÔ" },
                description: {
                    en: "Take a restful 1-night stopover exploring Hanoi's Old Quarter, then take a morning flight down to Quy Nhon.",
                    vi: "Nghỉ 1 đêm khám phá Phố cổ Hà Nội, sau đó đón chuyến bay sáng thẳng đến Quy Nhơn."
                },
                totalDuration: "24h (Overnight stay)",
                priceRatio: 0.86,
                transitHub: VIETNAM_AIRPORTS.HAN,
                finalTransport: "uih-taxi",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Flight to Hanoi", vi: "Chuyến bay đến Hà Nội" },
                        from: "Frankfurt (FRA)",
                        to: "Hanoi (HAN)",
                        fromCoords: [50.1109, 8.6821],
                        toCoords: [21.2212, 105.8072],
                        subInfo: {
                            en: "Direct flight • 11h 20m • Overnight flight for restful sleep",
                            vi: "Bay thẳng • 11h 20m • Bay đêm giúp bạn ngủ ngon giấc"
                        },
                        highlight: { en: "Arrive morning in Hanoi", vi: "Đến Hà Nội vào buổi sáng" },
                        duration: "11h 20m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified non-stop route", vi: "Tuyến bay thẳng đã xác minh" }
                    },
                    {
                        type: "domestic-flight",
                        icon: "plane",
                        title: { en: "Morning Flight to Quy Nhon", vi: "Chuyến bay sáng đến Quy Nhơn" },
                        from: "Hanoi (HAN)",
                        to: "Phu Cat (UIH)",
                        fromCoords: [21.2212, 105.8072],
                        toCoords: [13.9556, 109.0433],
                        subInfo: {
                            en: "1h 35m flight • Direct connection",
                            vi: "Bay 1h 35m • Nối chuyến thẳng"
                        },
                        highlight: { en: "Touchdown in time for beach afternoon", vi: "Đến nơi kịp tắm biển buổi chiều" },
                        duration: "1h 35m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified domestic route", vi: "Tuyến nội địa đã xác minh" }
                    }
                ]
            }
        }
    },

    usa: {
        id: "usa",
        name: { en: "United States", vi: "Hoa Kỳ" },
        flag: "🇺🇸",
        city: "San Francisco",
        airport: "San Francisco Int'l (SFO)",
        lat: 37.7749,
        lng: -122.4194,
        routes: {
            fastest: {
                id: "fastest",
                title: { en: "Fastest Trans-Pacific Connection via HCMC", vi: "Lộ trình nhanh nhất qua TP.HCM" },
                badge: { en: "FASTEST • MINIMAL TRANSIT TIME", vi: "NHANH NHẤT • THỜI GIAN CHỜ TỐI THIỂU" },
                description: {
                    en: "Fly non-stop across the Pacific to Ho Chi Minh City (SGN), then connect quickly to Phu Cat Airport (UIH).",
                    vi: "Bay thẳng qua Thái Bình Dương đến TP. Hồ Chí Minh (SGN), rồi nối chuyến nhanh đến Sân bay Phù Cát (UIH)."
                },
                totalDuration: "17h 45m",
                priceRatio: 1.0,
                transitHub: VIETNAM_AIRPORTS.SGN,
                finalTransport: "uih-taxi",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Trans-Pacific Flight", vi: "Chuyến bay xuyên Thái Bình Dương" },
                        from: "San Francisco (SFO)",
                        to: "Ho Chi Minh City (SGN)",
                        fromCoords: [37.7749, -122.4194],
                        toCoords: [10.8231, 106.6297],
                        subInfo: {
                            en: "Non-stop flight • 15h 30m • Flight #VN-98 (Vietnam Airlines)",
                            vi: "Bay thẳng • 15h 30m • Chuyến bay #VN-98 (Vietnam Airlines)"
                        },
                        highlight: { en: "Verified non-stop transpacific flight", vi: "Đường bay thẳng thương mại thực tế đã xác minh" },
                        airline: "Vietnam Airlines",
                        duration: "15h 30m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified non-stop route", vi: "Tuyến bay thẳng đã xác minh" }
                    },
                    {
                        type: "domestic-flight",
                        icon: "plane",
                        title: { en: "Short Connection to Quy Nhon", vi: "Chuyến bay nối tiếp đến Quy Nhơn" },
                        from: "Ho Chi Minh City (SGN)",
                        to: "Phu Cat Airport (UIH)",
                        fromCoords: [10.8231, 106.6297],
                        toCoords: [13.9556, 109.0433],
                        subInfo: {
                            en: "1h 10m flight • Fast baggage transit",
                            vi: "Bay 1h 10m • Chuyển hành lý thuận tiện"
                        },
                        highlight: { en: "Multiple departures daily", vi: "Nhiều khung giờ khởi hành trong ngày" },
                        airline: "Vietnam Airlines / Vietjet Air",
                        duration: "1h 10m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified domestic route", vi: "Tuyến nội địa đã xác minh" }
                    },
                    {
                        type: "transfer",
                        icon: "car",
                        title: { en: "Airport Car to Resort", vi: "Xe đón về khu nghỉ dưỡng" },
                        from: "Phu Cat Airport (UIH)",
                        to: "Coastal Villa",
                        fromCoords: [13.9556, 109.0433],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "Private transport • 40 minutes",
                            vi: "Xe đón riêng • 40 phút"
                        },
                        highlight: { en: "Direct check-in with ocean view", vi: "Nhận phòng ngắm hoàng hôn biển" },
                        duration: "40m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Ground transport estimate", vi: "Ước tính trung chuyển mặt đất" }
                    }
                ]
            },
            bestValue: {
                id: "best-value",
                title: { en: "1-Stop Flight via Tokyo/Taipei to Da Nang", vi: "Lộ trình tiết kiệm qua Đài Bắc/Tokyo đến Đà Nẵng" },
                badge: { en: "BEST VALUE • COMPETITIVE PRICE", vi: "TIẾT KIỆM • GIÁ CẠNH TRANH" },
                description: {
                    en: "Take a competitive 1-stop flight to Da Nang (DAD), then transfer smoothly by coastal limousine to Quy Nhon.",
                    vi: "Bay tiết kiệm 1 điểm dừng đến Đà Nẵng (DAD), sau đó đi xe limousine ven biển về Quy Nhơn."
                },
                totalDuration: "22h 30m",
                priceRatio: 0.81,
                transitHub: VIETNAM_AIRPORTS.DAD,
                finalTransport: "dad-limousine",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Trans-Pacific Flight to Da Nang", vi: "Bay xuyên Thái Bình Dương đến Đà Nẵng" },
                        from: "San Francisco (SFO)",
                        to: "Da Nang (DAD)",
                        fromCoords: [37.7749, -122.4194],
                        toCoords: [16.0544, 108.2022],
                        subInfo: {
                            en: "1 stopover (Tokyo / Taipei) • Est. 16h 45m • Mock Flight #AI-918",
                            vi: "1 điểm dừng (Tokyo / Đài Bắc) • Dự kiến 16h 45m • Chuyến bay mô phỏng #AI-918"
                        },
                        highlight: { en: "Arrive directly in Central Vietnam", vi: "Hạ cánh trực tiếp miền Trung" },
                        duration: "16h 45m",
                        stops: 1,
                        dataSource: "simulated",
                        dataSourceLabel: { en: "Simulated flight data", vi: "Dữ liệu bay mô phỏng" }
                    },
                    {
                        type: "transfer",
                        icon: "van-shuttle",
                        title: { en: "Scenic Highway Limousine", vi: "Xe Limousine ngắm cảnh ven biển" },
                        from: "Da Nang (DAD)",
                        to: "Quy Nhon",
                        fromCoords: [16.0544, 108.2022],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "High-comfort reclining seats • ~5h 15m",
                            vi: "Ghế massage êm ái • ~5h 15m"
                        },
                        highlight: { en: "Coastal journey through Sa Huynh & Quang Ngai", vi: "Hành trình ngắm biển Sa Huỳnh & duyên hải miền Trung" },
                        duration: "5h 15m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Commercial transfer route", vi: "Tuyến xe khách liên tỉnh phổ biến" }
                    }
                ]
            },
            smartStopover: {
                id: "smart-stopover",
                title: { en: "Jet-Lag Recovery & Luxury Rail Experience", vi: "Nghỉ ngơi phục hồi & Trải nghiệm tàu sang" },
                badge: { en: "JET-LAG RECOVERY", vi: "PHỤC HỒI NĂNG LƯỢNG" },
                description: {
                    en: "Recover from jet-lag in Da Nang / Hoi An for a day, then take the luxury Vietage train carriage down to Quy Nhon.",
                    vi: "Nghỉ ngơi phục hồi thể lực 1 ngày tại Đà Nẵng / Hội An, sau đó trải nghiệm toa tàu hạng sang The Vietage về Quy Nhơn."
                },
                totalDuration: "26h (Rest day included)",
                priceRatio: 0.90,
                transitHub: VIETNAM_AIRPORTS.DAD,
                finalTransport: "dad-train",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Flight to Central Vietnam", vi: "Chuyến bay đến miền Trung" },
                        from: "San Francisco (SFO)",
                        to: "Da Nang (DAD)",
                        fromCoords: [37.7749, -122.4194],
                        toCoords: [16.0544, 108.2022],
                        subInfo: {
                            en: "Comfortable long-haul transit • Est. 16h 45m",
                            vi: "Chặng bay đường dài tiện nghi • Dự kiến 16h 45m"
                        },
                        highlight: { en: "Overnight recovery in Danang beach resort", vi: "Nghỉ dưỡng biển phục hồi năng lượng" },
                        duration: "16h 45m",
                        stops: 1,
                        dataSource: "simulated",
                        dataSourceLabel: { en: "Simulated flight data", vi: "Dữ liệu bay mô phỏng" }
                    },
                    {
                        type: "transfer",
                        icon: "train",
                        title: { en: "The Vietage Luxury Railway", vi: "Toa tàu du lịch hạng sang The Vietage" },
                        from: "Da Nang Railway Station",
                        to: "Dieu Tri / Quy Nhon Station",
                        fromCoords: [16.0678, 108.2125],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "Luxury rail car • ~5h • Fine dining & free-flow wine",
                            vi: "Toa tàu thượng lưu • ~5h • Ẩm thực cao cấp & quầy bar ngắm biển"
                        },
                        highlight: { en: "Exclusive luxury travel experience", vi: "Trải nghiệm du lịch đường sắt đẳng cấp độc quyền" },
                        duration: "5h 00m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified luxury rail service", vi: "Dịch vụ tàu hỏa du lịch cao cấp đã xác minh" }
                    }
                ]
            }
        }
    },

    australia: {
        id: "australia",
        name: { en: "Australia", vi: "Úc" },
        flag: "🇦🇺",
        city: "Sydney",
        airport: "Sydney Kingsford Smith (SYD)",
        lat: -33.8688,
        lng: 151.2093,
        routes: {
            fastest: {
                id: "fastest",
                title: { en: "Same-Day Direct Connection via HCMC", vi: "Lộ trình nhanh nhất trong ngày qua TP.HCM" },
                badge: { en: "FASTEST • SAME-DAY ARRIVAL", vi: "NHANH NHẤT • ĐẾN NƠI TRONG NGÀY" },
                description: {
                    en: "Fly non-stop from Sydney (SYD) to Ho Chi Minh City (SGN) in 8.5 hours, then take a 1-hour connector to Phu Cat (UIH).",
                    vi: "Bay thẳng Sydney (SYD) đến TP.HCM (SGN) khoảng 8.5 giờ, sau đó nối chuyến 1 giờ đến Phù Cát (UIH)."
                },
                totalDuration: "11h 30m",
                priceRatio: 1.0,
                transitHub: VIETNAM_AIRPORTS.SGN,
                finalTransport: "uih-taxi",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Non-stop Flight to HCMC", vi: "Chuyến bay thẳng đến TP.HCM" },
                        from: "Sydney (SYD)",
                        to: "Ho Chi Minh City (SGN)",
                        fromCoords: [-33.8688, 151.2093],
                        toCoords: [10.8231, 106.6297],
                        subInfo: {
                            en: "Direct flight • 8h 45m • Flight #VN-772 (Vietnam Airlines)",
                            vi: "Bay thẳng • 8h 45m • Chuyến bay #VN-772 (Vietnam Airlines)"
                        },
                        highlight: { en: "Verified commercial direct flight", vi: "Đường bay thẳng thương mại thực tế đã xác minh" },
                        airline: "Vietnam Airlines",
                        duration: "8h 45m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified non-stop route", vi: "Tuyến bay thẳng đã xác minh" }
                    },
                    {
                        type: "domestic-flight",
                        icon: "plane",
                        title: { en: "Domestic Shuttle to Quy Nhon", vi: "Chuyến bay nội địa đến Quy Nhơn" },
                        from: "Ho Chi Minh City (SGN)",
                        to: "Phu Cat Airport (UIH)",
                        fromCoords: [10.8231, 106.6297],
                        toCoords: [13.9556, 109.0433],
                        subInfo: {
                            en: "1h 10m flight • Fast transfer",
                            vi: "Bay 1h 10m • Nối chuyến nhanh chóng"
                        },
                        highlight: { en: "Touch down right before sunset", vi: "Hạ cánh ngay trước giờ hoàng hôn tuyệt đẹp" },
                        airline: "Vietnam Airlines / Vietjet Air",
                        duration: "1h 10m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified domestic route", vi: "Tuyến nội địa đã xác minh" }
                    },
                    {
                        type: "transfer",
                        icon: "car",
                        title: { en: "Airport Car to Beach Resort", vi: "Xe đưa đón về resort ven biển" },
                        from: "Phu Cat Airport (UIH)",
                        to: "Quy Nhon Beachfront",
                        fromCoords: [13.9556, 109.0433],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "Direct resort shuttle • 40 minutes",
                            vi: "Xe riêng đưa đón • 40 phút"
                        },
                        highlight: { en: "Private balcony facing the East Sea", vi: "Ban công riêng hướng thẳng biển Quy Nhơn" },
                        duration: "40m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Ground transport estimate", vi: "Ước tính trung chuyển mặt đất" }
                    }
                ]
            },
            bestValue: {
                id: "best-value",
                title: { en: "Budget-Friendly Connection via Da Nang", vi: "Lộ trình tiết kiệm qua Đà Nẵng" },
                badge: { en: "BEST VALUE • BUDGET SAVER", vi: "TIẾT KIỆM • GIÁ RẺ HƠN" },
                description: {
                    en: "Take a competitive flight via Singapore to Da Nang (DAD), then travel by coastal limousine to Quy Nhon.",
                    vi: "Bay tiết kiệm qua Singapore đến Đà Nẵng (DAD), sau đó di chuyển bằng limousine ven biển về Quy Nhơn."
                },
                totalDuration: "17h 00m",
                priceRatio: 0.77,
                transitHub: VIETNAM_AIRPORTS.DAD,
                finalTransport: "dad-limousine",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Flight to Da Nang", vi: "Chuyến bay đến Đà Nẵng" },
                        from: "Sydney (SYD)",
                        to: "Da Nang (DAD)",
                        fromCoords: [-33.8688, 151.2093],
                        toCoords: [16.0544, 108.2022],
                        subInfo: {
                            en: "1 stopover (Singapore) • Est. 11h 30m • Mock Flight #SQ-512",
                            vi: "1 điểm dừng (Singapore) • Dự kiến 11h 30m • Chuyến bay mô phỏng #SQ-512"
                        },
                        highlight: { en: "Touchdown in Central Vietnam", vi: "Hạ cánh miền Trung Việt Nam" },
                        duration: "11h 30m",
                        stops: 1,
                        dataSource: "simulated",
                        dataSourceLabel: { en: "Simulated flight data", vi: "Dữ liệu bay mô phỏng" }
                    },
                    {
                        type: "transfer",
                        icon: "van-shuttle",
                        title: { en: "Coastal Highway Limousine", vi: "Xe Limousine ngắm cảnh biển" },
                        from: "Da Nang (DAD)",
                        to: "Quy Nhon City",
                        fromCoords: [16.0544, 108.2022],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "National Route 1A • ~5h 15m",
                            vi: "Quốc lộ 1A • ~5h 15m"
                        },
                        highlight: { en: "Scenic seaside trip across Central Vietnam", vi: "Chuyến đi ngắm cảnh biển miền Trung" },
                        duration: "5h 15m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Commercial transfer route", vi: "Tuyến xe khách liên tỉnh phổ biến" }
                    }
                ]
            },
            smartStopover: {
                id: "smart-stopover",
                title: { en: "Hanoi Capital & Northern Gateway Route", vi: "Lộ trình kết hợp khám phá Thủ đô Hà Nội" },
                badge: { en: "CAPITAL DISCOVERY", vi: "KHÁM PHÁ THỦ ĐÔ" },
                description: {
                    en: "Fly into Hanoi (HAN) on a direct flight, spend a relaxing day, then fly down to Phu Cat Airport (UIH).",
                    vi: "Bay thẳng đến Hà Nội (HAN), dành 1 ngày nghỉ ngơi ngắm thủ đô, sau đó bay vào Sân bay Phù Cát (UIH)."
                },
                totalDuration: "24h (Stopover included)",
                priceRatio: 0.85,
                transitHub: VIETNAM_AIRPORTS.HAN,
                finalTransport: "uih-taxi",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Direct Flight to Hanoi", vi: "Chuyến bay thẳng đến Hà Nội" },
                        from: "Sydney (SYD)",
                        to: "Hanoi (HAN)",
                        fromCoords: [-33.8688, 151.2093],
                        toCoords: [21.2212, 105.8072],
                        subInfo: {
                            en: "Direct flight • 9h 30m • Flight #VN-786 (Vietnam Airlines)",
                            vi: "Bay thẳng • 9h 30m • Chuyến bay #VN-786 (Vietnam Airlines)"
                        },
                        highlight: { en: "Verified commercial direct flight", vi: "Đường bay thẳng thương mại thực tế đã xác minh" },
                        duration: "9h 30m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified non-stop route", vi: "Tuyến bay thẳng đã xác minh" }
                    },
                    {
                        type: "domestic-flight",
                        icon: "plane",
                        title: { en: "Domestic Flight to Quy Nhon", vi: "Bay nội địa đến Quy Nhơn" },
                        from: "Hanoi (HAN)",
                        to: "Phu Cat (UIH)",
                        fromCoords: [21.2212, 105.8072],
                        toCoords: [13.9556, 109.0433],
                        subInfo: {
                            en: "1h 35m flight • Direct connection",
                            vi: "Bay 1h 35m • Nối chuyến thẳng"
                        },
                        highlight: { en: "Easy transfer to Quy Nhon", vi: "Đến Quy Nhơn nhanh chóng" },
                        duration: "1h 35m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified domestic route", vi: "Tuyến nội địa đã xác minh" }
                    }
                ]
            }
        }
    },

    japan: {
        id: "japan",
        name: { en: "Japan", vi: "Nhật Bản" },
        flag: "🇯🇵",
        city: "Tokyo",
        airport: "Tokyo Narita / Haneda (NRT/HND)",
        lat: 35.6762,
        lng: 139.6503,
        routes: {
            fastest: {
                id: "fastest",
                title: { en: "Direct Flight to Da Nang Gateway", vi: "Lộ trình nhanh nhất: Bay thẳng đến Đà Nẵng" },
                badge: { en: "FASTEST • UNDER 11H TOTAL", vi: "NHANH NHẤT • CHƯA ĐẦY 11H TỔNG CỘNG" },
                description: {
                    en: "Non-stop flight from Tokyo (NRT) to Da Nang (DAD) in just 5.5 hours, followed by an express limousine to Quy Nhon.",
                    vi: "Bay thẳng Tokyo (NRT) đến Đà Nẵng (DAD) chỉ 5.5 giờ, sau đó đi xe limousine cao cấp về Quy Nhơn."
                },
                totalDuration: "10h 45m",
                priceRatio: 1.0,
                transitHub: VIETNAM_AIRPORTS.DAD,
                finalTransport: "dad-limousine",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Direct Flight to Da Nang", vi: "Chuyến bay thẳng đến Đà Nẵng" },
                        from: "Tokyo (NRT)",
                        to: "Da Nang (DAD)",
                        fromCoords: [35.6762, 139.6503],
                        toCoords: [16.0544, 108.2022],
                        subInfo: {
                            en: "Direct flight • 5h 30m • Flight #VN-319 (Vietnam Airlines)",
                            vi: "Bay thẳng • 5h 30m • Chuyến bay #VN-319 (Vietnam Airlines)"
                        },
                        highlight: { en: "Verified commercial direct route to Central Vietnam", vi: "Đường bay thẳng thương mại thực tế kết nối trực tiếp miền Trung" },
                        airline: "Vietnam Airlines",
                        duration: "5h 30m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified non-stop route", vi: "Tuyến bay thẳng đã xác minh" }
                    },
                    {
                        type: "transfer",
                        icon: "van-shuttle",
                        title: { en: "Express Coastal Limousine", vi: "Xe Limousine cao cấp ven biển" },
                        from: "Da Nang (DAD)",
                        to: "Quy Nhon",
                        fromCoords: [16.0544, 108.2022],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "Express limousine • ~5h 15m • Coastal highway",
                            vi: "Limousine cao cấp • ~5h 15m • Đường cao tốc & Quốc lộ 1A ven biển"
                        },
                        highlight: { en: "Shortest international gateway to Central Vietnam", vi: "Cửa ngõ quốc tế nhanh nhất đến miền Trung" },
                        duration: "5h 15m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Commercial transfer route", vi: "Tuyến xe khách liên tỉnh phổ biến" }
                    }
                ]
            },
            bestValue: {
                id: "best-value",
                title: { en: "Air Connection via Hanoi to Phu Cat", vi: "Nối chuyến hàng không qua Hà Nội đến Phù Cát" },
                badge: { en: "ALL-AIR ROUTE • COMFORTABLE", vi: "TOÀN TUYẾN ĐƯỜNG BAY • ÊM ÁI" },
                description: {
                    en: "Fly non-stop Tokyo to Hanoi (HAN), then take an immediate domestic flight straight into Phu Cat Airport (UIH).",
                    vi: "Bay thẳng Tokyo đến Hà Nội (HAN), rồi nối chuyến bay nội địa thẳng tới Sân bay Phù Cát (UIH)."
                },
                totalDuration: "8h 15m (Fast flight pace)",
                priceRatio: 0.88,
                transitHub: VIETNAM_AIRPORTS.HAN,
                finalTransport: "uih-taxi",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Direct Flight to Hanoi", vi: "Chuyến bay thẳng đến Hà Nội" },
                        from: "Tokyo (NRT/HND)",
                        to: "Hanoi (HAN)",
                        fromCoords: [35.6762, 139.6503],
                        toCoords: [21.2212, 105.8072],
                        subInfo: {
                            en: "Direct flight • 5h 10m • Vietnam Airlines / ANA",
                            vi: "Bay thẳng • 5h 10m • Vietnam Airlines / ANA"
                        },
                        highlight: { en: "Verified commercial direct route", vi: "Đường bay thẳng thương mại thực tế đã xác minh" },
                        duration: "5h 10m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified non-stop route", vi: "Tuyến bay thẳng đã xác minh" }
                    },
                    {
                        type: "domestic-flight",
                        icon: "plane",
                        title: { en: "Domestic Flight to Quy Nhon", vi: "Bay nối chuyến đến Quy Nhơn" },
                        from: "Hanoi (HAN)",
                        to: "Phu Cat (UIH)",
                        fromCoords: [21.2212, 105.8072],
                        toCoords: [13.9556, 109.0433],
                        subInfo: {
                            en: "Direct flight • 1h 35m • Low waiting time",
                            vi: "Bay thẳng • 1h 35m • Thời gian chờ nối chuyến ngắn"
                        },
                        highlight: { en: "Fastest way into Phu Cat Airport", vi: "Cách nhanh nhất để hạ cánh Sân bay Phù Cát" },
                        duration: "1h 35m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified domestic route", vi: "Tuyến nội địa đã xác minh" }
                    },
                    {
                        type: "transfer",
                        icon: "car",
                        title: { en: "Airport Car to Quy Nhon", vi: "Xe đón về Quy Nhơn" },
                        from: "Phu Cat (UIH)",
                        to: "Quy Nhon City",
                        fromCoords: [13.9556, 109.0433],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "Private car • 40 minutes",
                            vi: "Xe ô tô riêng • 40 phút"
                        },
                        highlight: { en: "Smooth check-in at resort", vi: "Nhận phòng khách sạn thuận tiện" },
                        duration: "40m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Ground transport estimate", vi: "Ước tính trung chuyển mặt đất" }
                    }
                ]
            },
            smartStopover: {
                id: "smart-stopover",
                title: { en: "Heritage Railway via Da Nang (The Vietage)", vi: "Đường sắt ngắm cảnh di sản qua Đà Nẵng (The Vietage)" },
                badge: { en: "SCENIC HERITAGE RAIL", vi: "ĐƯỜNG SẮT DI SẢN NGẮM CẢNH" },
                description: {
                    en: "Fly non-stop to Da Nang, then take the scenic coastal train or luxury The Vietage carriage down to Quy Nhon.",
                    vi: "Bay thẳng đến Đà Nẵng, sau đó trải nghiệm chuyến tàu ngắm cảnh hoặc toa tàu du lịch The Vietage vào Quy Nhơn."
                },
                totalDuration: "12h 00m",
                priceRatio: 0.92,
                transitHub: VIETNAM_AIRPORTS.DAD,
                finalTransport: "dad-train",
                steps: [
                    {
                        type: "flight",
                        icon: "plane-departure",
                        title: { en: "Direct Flight to Da Nang", vi: "Chuyến bay thẳng đến Đà Nẵng" },
                        from: "Tokyo (NRT)",
                        to: "Da Nang (DAD)",
                        fromCoords: [35.6762, 139.6503],
                        toCoords: [16.0544, 108.2022],
                        subInfo: {
                            en: "Direct flight • 5h 30m • Verified scheduled flight",
                            vi: "Bay thẳng • 5h 30m • Tuyến bay thương mại thực tế"
                        },
                        highlight: { en: "Shortest flight connecting to Central Vietnam", vi: "Chặng bay ngắn nhất kết nối trực tiếp miền Trung" },
                        duration: "5h 30m",
                        stops: 0,
                        dataSource: "verified",
                        dataSourceLabel: { en: "Verified non-stop route", vi: "Tuyến bay thẳng đã xác minh" }
                    },
                    {
                        type: "transfer",
                        icon: "train",
                        title: { en: "Scenic Heritage Railway / The Vietage", vi: "Tàu hỏa ngắm cảnh / Toa tàu The Vietage" },
                        from: "Da Nang Station",
                        to: "Dieu Tri / Quy Nhon Station",
                        fromCoords: [16.0678, 108.2125],
                        toCoords: [13.7820, 109.2197],
                        subInfo: {
                            en: "Coastal train • ~4h 45m • Mesmerizing ocean & green countryside panorama",
                            vi: "Tàu ven biển • ~4h 45m • Ngắm trọn đồng quê và biển xanh thơ mộng"
                        },
                        highlight: { en: "One of Southeast Asia's most picturesque journeys", vi: "Một trong những cung đường du lịch ven biển đẹp nhất Đông Nam Á" },
                        duration: "4h 45m",
                        dataSource: "verified",
                        dataSourceLabel: { en: "Vietnam Railways & The Vietage", vi: "Đường sắt Việt Nam & The Vietage" }
                    }
                ]
            }
        }
    }
};

// ==============================================================
// Chỉ số Phát Thải CO2 (Carbon Footprint) & Chi phí Cơ sở Tuyến đi
// Phương pháp: Chuẩn hóa dựa trên hệ số ICAO / DEFRA
// - Chặng bay quốc tế đường dài: ~0.15 kg CO2e / km
// - Chặng bay nội địa: ~0.18 kg CO2e / km
// - Đường sắt ven biển / Tàu khách: ~0.04 - 0.05 kg CO2e / km (giảm đáng kể phát thải)
// - Xe Limousine / Bus: ~0.08 kg CO2e / km
// ==============================================================
const ROUTE_CARBON_AND_COST_METRICS = {
    belgium: {
        fastest: { baseTransitCost: 1050, carbonKg: 640, carbonSavedPercent: 0, isEcoChoice: false, carbonNote: { en: "Est. based on ICAO flight emissions + regional transfer. Benchmark for time-optimized route.", vi: "Ước tính theo phát thải hàng không ICAO + xe sân bay. Mức chuẩn cho lộ trình tối ưu thời gian." } },
        bestValue: { baseTransitCost: 820, carbonKg: 512, carbonSavedPercent: 20, isEcoChoice: true, carbonNote: { en: "🌱 Lower-emission option: -20% CO₂e vs. all-air connection by utilizing coastal road coach.", vi: "🌱 Lựa chọn phát thải thấp: Giảm 20% CO₂e so với bay nối chuyến nhờ xe khách đường bộ ven biển." } },
        smartStopover: { baseTransitCost: 890, carbonKg: 395, carbonSavedPercent: 38, isEcoChoice: true, carbonNote: { en: "🌱 Eco Choice: -38% CO₂e vs. domestic flight by replacing air leg with scenic coastal railway.", vi: "🌱 Lựa chọn Xanh: Giảm 38% CO₂e so với bay nội địa nhờ thay thế bằng đường sắt ngắm cảnh ven biển." } }
    },
    france: {
        fastest: { baseTransitCost: 1020, carbonKg: 630, carbonSavedPercent: 0, isEcoChoice: false, carbonNote: { en: "Est. based on ICAO flight emissions + regional transfer. Benchmark for time-optimized route.", vi: "Ước tính theo phát thải hàng không ICAO + xe sân bay. Mức chuẩn cho lộ trình tối ưu thời gian." } },
        bestValue: { baseTransitCost: 810, carbonKg: 504, carbonSavedPercent: 20, isEcoChoice: true, carbonNote: { en: "🌱 Lower-emission option: -20% CO₂e vs. all-air connection by utilizing coastal road coach.", vi: "🌱 Lựa chọn phát thải thấp: Giảm 20% CO₂e so với bay nối chuyến nhờ xe khách đường bộ ven biển." } },
        smartStopover: { baseTransitCost: 880, carbonKg: 390, carbonSavedPercent: 38, isEcoChoice: true, carbonNote: { en: "🌱 Eco Choice: -38% CO₂e vs. domestic flight by replacing air leg with scenic coastal railway.", vi: "🌱 Lựa chọn Xanh: Giảm 38% CO₂e so với bay nội địa nhờ thay thế bằng đường sắt ngắm cảnh ven biển." } }
    },
    germany: {
        fastest: { baseTransitCost: 1060, carbonKg: 635, carbonSavedPercent: 0, isEcoChoice: false, carbonNote: { en: "Est. based on ICAO flight emissions + regional transfer. Benchmark for time-optimized route.", vi: "Ước tính theo phát thải hàng không ICAO + xe sân bay. Mức chuẩn cho lộ trình tối ưu thời gian." } },
        bestValue: { baseTransitCost: 830, carbonKg: 508, carbonSavedPercent: 20, isEcoChoice: true, carbonNote: { en: "🌱 Lower-emission option: -20% CO₂e vs. all-air connection by utilizing coastal road coach.", vi: "🌱 Lựa chọn phát thải thấp: Giảm 20% CO₂e so với bay nối chuyến nhờ xe khách đường bộ ven biển." } },
        smartStopover: { baseTransitCost: 895, carbonKg: 392, carbonSavedPercent: 38, isEcoChoice: true, carbonNote: { en: "🌱 Eco Choice: -38% CO₂e vs. domestic flight by replacing air leg with scenic coastal railway.", vi: "🌱 Lựa chọn Xanh: Giảm 38% CO₂e so với bay nội địa nhờ thay thế bằng đường sắt ngắm cảnh ven biển." } }
    },
    usa: {
        fastest: { baseTransitCost: 1350, carbonKg: 940, carbonSavedPercent: 0, isEcoChoice: false, carbonNote: { en: "Est. based on ICAO transpacific flight + regional transfer. Benchmark for time-optimized route.", vi: "Ước tính theo phát thải chặng bay Thái Bình Dương ICAO + xe sân bay. Mức chuẩn cho lộ trình tối ưu thời gian." } },
        bestValue: { baseTransitCost: 1080, carbonKg: 752, carbonSavedPercent: 20, isEcoChoice: true, carbonNote: { en: "🌱 Lower-emission option: -20% CO₂e vs. all-air connection by utilizing coastal road coach.", vi: "🌱 Lựa chọn phát thải thấp: Giảm 20% CO₂e so với bay nối chuyến nhờ xe khách đường bộ ven biển." } },
        smartStopover: { baseTransitCost: 1160, carbonKg: 585, carbonSavedPercent: 38, isEcoChoice: true, carbonNote: { en: "🌱 Eco Choice: -38% CO₂e vs. domestic flight by replacing air leg with scenic coastal railway.", vi: "🌱 Lựa chọn Xanh: Giảm 38% CO₂e so với bay nội địa nhờ thay thế bằng đường sắt ngắm cảnh ven biển." } }
    },
    australia: {
        fastest: { baseTransitCost: 920, carbonKg: 690, carbonSavedPercent: 0, isEcoChoice: false, carbonNote: { en: "Est. based on ICAO Oceania flight + regional transfer. Benchmark for time-optimized route.", vi: "Ước tính theo phát thải chặng bay Châu Đại Dương ICAO + xe sân bay. Mức chuẩn cho lộ trình tối ưu thời gian." } },
        bestValue: { baseTransitCost: 740, carbonKg: 552, carbonSavedPercent: 20, isEcoChoice: true, carbonNote: { en: "🌱 Lower-emission option: -20% CO₂e vs. all-air connection by utilizing coastal road coach.", vi: "🌱 Lựa chọn phát thải thấp: Giảm 20% CO₂e so với bay nối chuyến nhờ xe khách đường bộ ven biển." } },
        smartStopover: { baseTransitCost: 790, carbonKg: 430, carbonSavedPercent: 38, isEcoChoice: true, carbonNote: { en: "🌱 Eco Choice: -38% CO₂e vs. domestic flight by replacing air leg with scenic coastal railway.", vi: "🌱 Lựa chọn Xanh: Giảm 38% CO₂e so với bay nội địa nhờ thay thế bằng đường sắt ngắm cảnh ven biển." } }
    },
    japan: {
        fastest: { baseTransitCost: 590, carbonKg: 310, carbonSavedPercent: 0, isEcoChoice: false, carbonNote: { en: "Est. based on ICAO East Asia flight + regional transfer. Benchmark for time-optimized route.", vi: "Ước tính theo phát thải đường bay Đông Á ICAO + xe sân bay. Mức chuẩn cho lộ trình tối ưu thời gian." } },
        bestValue: { baseTransitCost: 460, carbonKg: 248, carbonSavedPercent: 20, isEcoChoice: true, carbonNote: { en: "🌱 Lower-emission option: -20% CO₂e vs. all-air connection by utilizing coastal road coach.", vi: "🌱 Lựa chọn phát thải thấp: Giảm 20% CO₂e so với bay nối chuyến nhờ xe khách đường bộ ven biển." } },
        smartStopover: { baseTransitCost: 490, carbonKg: 192, carbonSavedPercent: 38, isEcoChoice: true, carbonNote: { en: "🌱 Eco Choice: -38% CO₂e vs. domestic flight by replacing air leg with scenic coastal railway.", vi: "🌱 Lựa chọn Xanh: Giảm 38% CO₂e so với bay nội địa nhờ thay thế bằng đường sắt ngắm cảnh ven biển." } }
    }
};

// Đồng bộ chỉ số phát thải & chi phí cơ sở vào MOCK_COUNTRIES
Object.keys(ROUTE_CARBON_AND_COST_METRICS).forEach(countryKey => {
    if (MOCK_COUNTRIES[countryKey] && MOCK_COUNTRIES[countryKey].routes) {
        ['fastest', 'bestValue', 'smartStopover'].forEach(routeKey => {
            if (MOCK_COUNTRIES[countryKey].routes[routeKey] && ROUTE_CARBON_AND_COST_METRICS[countryKey][routeKey]) {
                Object.assign(MOCK_COUNTRIES[countryKey].routes[routeKey], ROUTE_CARBON_AND_COST_METRICS[countryKey][routeKey]);
            }
        });
    }
});

/**
 * Danh mục khách sạn tiêu biểu tại Quy Nhơn
 */
const MOCK_HOTELS = [
    {
        id: "anantara-quynhon",
        name: "Anantara Quy Nhon Villas",
        badge: { en: "Ultra Luxury", vi: "Sang trọng bậc nhất" },
        location: "Bai Dai Beach, Quy Nhon",
        rating: 4.9,
        reviewsCount: 384,
        priceMock: "$450 - $680",
        priceUnit: { en: "/ night (Estimate)", vi: "/ đêm (Tham khảo)" },
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        features: {
            en: ["Private Oceanfront Pool", "Personal Butler Service", "Cliffside Wine Cellar", "Secluded Beach Bay"],
            vi: ["Hồ bơi riêng hướng biển", "Dịch vụ quản gia riêng", "Hầm rượu trên vách đá", "Bãi biển biệt lập"]
        },
        description: {
            en: "Nestled in a private cove, offering 26 ocean-facing villas surrounded by lush tropical mountains.",
            vi: "Tọa lạc tại vịnh biển riêng tư, gồm 26 biệt thự hướng biển nép mình bên núi rừng nhiệt đới xanh mát."
        }
    },
    {
        id: "maia-resort",
        name: "Maia Resort Quy Nhon",
        badge: { en: "Culinary & Wellness", vi: "Ẩm thực & Nghỉ dưỡng" },
        location: "Nhon Ly, Phu Cat, Quy Nhon",
        rating: 4.8,
        reviewsCount: 512,
        priceMock: "$220 - $350",
        priceUnit: { en: "/ night (Estimate)", vi: "/ đêm (Tham khảo)" },
        image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
        features: {
            en: ["Farm-to-table Gastronomy", "Daily Spa Treatment included", "Infinity Beach Pool", "Golden Sand Access"],
            vi: ["Ẩm thực nông trại đến bàn ăn", "Bao gồm liệu trình Spa hàng ngày", "Hồ bơi vô cực sát biển", "Bờ cát vàng mịn màng"]
        },
        description: {
            en: "A culinary-led beach sanctuary designed for foodies and wellness seekers looking to recharge.",
            vi: "Khu nghỉ dưỡng chú trọng trải nghiệm ẩm thực và chăm sóc sức khỏe, mang lại kỳ nghỉ tái tạo năng lượng."
        }
    },
    {
        id: "flc-city-hotel",
        name: "FLC City Hotel Beach Quy Nhon",
        badge: { en: "City & Beachfront", vi: "Trung tâm phố biển" },
        location: "An Duong Vuong St, Quy Nhon Center",
        rating: 4.6,
        reviewsCount: 740,
        priceMock: "$75 - $130",
        priceUnit: { en: "/ night (Estimate)", vi: "/ đêm (Tham khảo)" },
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        features: {
            en: ["Central City Location", "Sky Bar on 27th Floor", "Direct Beach Walkway", "Close to Night Food Market"],
            vi: ["Vị trí trung tâm sầm uất", "Sky Bar tầng 27 ngắm toàn cảnh", "Hầm ngầm ra thẳng bãi biển", "Gần chợ đêm ẩm thực"]
        },
        description: {
            en: "Modern high-rise hotel right along Quy Nhon's main beach boulevard, ideal for exploring local city life.",
            vi: "Khách sạn hiện đại cao cấp trên đại lộ biển An Dương Vương, lý tưởng để hòa mình vào nhịp sống phố biển."
        }
    }
];

/**
 * Kho dữ liệu hoạt động thực tế tại Quy Nhơn / Bình Định phân theo danh mục sở thích
 */
const MOCK_ACTIVITIES_POOL = {
    beaches: [
        {
            time: "08:30",
            category: "BEACH",
            title: { en: "Ky Co Beach & Coral Reef", vi: "Biển Kỳ Co & Rạn san hô Hòn Sẹo" },
            desc: {
                en: "Take a speedboat to Ky Co, known as Vietnam's Maldives with crystal turquoise water and powdery white sand.",
                vi: "Đi cano vượt sóng ra bãi Kỳ Co - thiên đường biển xanh ngọc bích, bãi cát trắng mịn tựa thiên đường Maldives."
            }
        },
        {
            time: "15:30",
            category: "BEACH",
            title: { en: "Eo Gio Windy Strait & Coastal Walkway", vi: "Cung đường đi bộ ven biển Eo Gió" },
            desc: {
                en: "Stroll along the cliffside walking path of Eo Gio, admiring sunset over wild rocky headlands.",
                vi: "Dạo bước trên cung đường bậc thang uốn lượn ven vách đá Eo Gió, chiêm ngưỡng hoàng hôn lộng gió rực rỡ."
            }
        },
        {
            time: "16:00",
            category: "BEACH",
            title: { en: "Queen's Beach (Ghenh Rang Tien Sa)", vi: "Bãi Trứng Hoàng Hậu & Ghềnh Ráng Tiên Sa" },
            desc: {
                en: "Discover smooth egg-shaped pebbles at Queen's Beach and the panoramic bay view from Han Mac Tu hill.",
                vi: "Khám phá bãi đá trứng độc đáo từng dành riêng cho Nam Phương Hoàng hậu và viếng đồi thi nhân Hàn Mặc Tử."
            }
        }
    ],
    food: [
        {
            time: "12:00",
            category: "FOOD",
            title: { en: "Jumping Shrimp Pancakes (Banh Xeo Tom Nhay)", vi: "Bánh xèo tôm nhảy Mỹ Cang giòn rụm" },
            desc: {
                en: "Savor crispy golden rice pancakes with fresh lively red shrimp, rolled with wild herbs and sweet-sour garlic sauce.",
                vi: "Thưởng thức bánh xèo tôm nhảy đỏ tươi giòn rụm, cuốn cùng rau mầm, xoài xanh và nước chấm tỏi ớt gia truyền."
            }
        },
        {
            time: "18:30",
            category: "FOOD",
            title: { en: "Ngo Van So Night Culinary Street", vi: "Thiên đường ẩm thực đêm phố Ngô Văn Sở" },
            desc: {
                en: "Taste legendary local street specialties: grilled pork rolls (Nem Nuong Cho Huyen), steamed rice cakes, and sea snails.",
                vi: "Trải nghiệm phố ẩm thực sầm uất: nem nướng Chợ Huyện, bánh bèo chén tôm cháy, tré rơm và ốc biển tươi sống."
            }
        },
        {
            time: "12:30",
            category: "FOOD",
            title: { en: "Nhon Ly Seafood Feast by the Pier", vi: "Đại tiệc hải sản tươi sống làng chài Nhơn Lý" },
            desc: {
                en: "Indulge in freshly caught steamed sea crabs, grilled sea urchins with spring onions, and spicy grouper hotpot.",
                vi: "Thưởng thức cua huỳnh đế hấp, nhum biển nướng mỡ hành và lẩu cá mú nấu lá giang chua ngọt thanh mát."
            }
        }
    ],
    culture: [
        {
            time: "09:00",
            category: "CULTURE",
            title: { en: "Banh It Cham Towers (Thap Banh It)", vi: "Cụm Tháp Chăm Bánh Ít ngàn năm" },
            desc: {
                en: "Marvel at 10th-century brick Cham architecture standing proudly on a hilltop overlooking peaceful rice valleys.",
                vi: "Chiêm ngưỡng kiệt tác kiến trúc gạch nung Champa thế kỷ thứ 10 uy nghiêm trên đỉnh đồi lộng gió."
            }
        },
        {
            time: "14:30",
            category: "CULTURE",
            title: { en: "Twin Cham Towers (Thap Doi Quy Nhon)", vi: "Tháp Đôi cổ kính ngay lòng thành phố" },
            desc: {
                en: "Explore unique 12th-century dual brick towers reflecting Angkor-influenced architecture right within the city.",
                vi: "Khám phá cụm hai ngọn tháp cổ xây dựng từ thế kỷ 12 mang đậm phong cách kiến trúc nghệ thuật Champa - Khmer."
            }
        },
        {
            time: "10:00",
            category: "CULTURE",
            title: { en: "Quang Trung Museum & Binh Dinh Martial Arts", vi: "Bảo tàng Quang Trung & Nhạc võ Tây Sơn" },
            desc: {
                en: "Learn about the legendary Tay Son uprising and enjoy electrifying traditional martial arts and battle drum performances.",
                vi: "Tìm hiểu hào khí phong trào nông dân Tây Sơn và thưởng thức màn biểu diễn nhạc võ trống trận rung chuyển trời đất."
            }
        }
    ],
    adventure: [
        {
            time: "08:00",
            category: "ADVENTURE",
            title: { en: "Sandboarding at Phuong Mai Giant Dunes", vi: "Trượt cát đỉnh đồi cát khổng lồ Phương Mai" },
            desc: {
                en: "Experience thrilling sandboarding down towering golden desert dunes overlooking the East Sea.",
                vi: "Trải nghiệm cảm giác trượt ván tốc độ từ đỉnh đồi cát vàng mênh mông hướng thẳng ra biển xanh."
            }
        },
        {
            time: "13:30",
            category: "ADVENTURE",
            title: { en: "Cu Lao Xanh Island Speedboat & Lighthouse Trek", vi: "Vượt sóng cano ra Đảo ngọc Cù Lao Xanh" },
            desc: {
                en: "Speedboat across deep blue ocean to trek up the 130-year-old French lighthouse and scuba dive in pristine reefs.",
                vi: "Đi cano cao tốc ra đảo Cù Lao Xanh, chinh phục ngọn hải đăng Pháp cổ kính 130 năm và lặn ngắm san hô tầng sâu."
            }
        }
    ],
    nightlife: [
        {
            time: "20:00",
            category: "NIGHTLIFE",
            title: { en: "Surf Bar Beachfront Lounge", vi: "Surf Bar - Quầy bar lãng mạn trên bãi cát" },
            desc: {
                en: "Relax on barefoot beach cushions under fairy lights with handcrafted tropical cocktails and soothing acoustic waves.",
                vi: "Thư giãn trên bờ cát êm ái dưới ánh đèn lung linh, nhâm nhi cocktail nhiệt đới cùng tiếng sóng biển vỗ về."
            }
        },
        {
            time: "21:30",
            category: "NIGHTLIFE",
            title: { en: "FLC 27th-Floor Sky Bar Panorama", vi: "Sky Bar tầng 27 ngắm trọn vịnh Quy Nhơn" },
            desc: {
                en: "Take in the panoramic glittering night lights of Quy Nhon coastal city with live DJ sets and signature drinks.",
                vi: "Ngắm trọn toàn cảnh thành phố biển Quy Nhơn lung linh ánh đèn về đêm cùng âm nhạc hiện đại và thức uống độc đáo."
            }
        }
    ]
};

/**
 * HÀM SINH NỘI DUNG TÓM TẮT TƯ VẤN CỦA AI BẰNG JAVASCRIPT (ĐÁP ỨNG YÊU CẦU 2 & 5)
 * Sinh văn bản thay đổi thực tế dựa trên:
 * - Quốc gia xuất phát
 * - Ngân sách đã chọn hoặc nhập
 * - Phương án di chuyển được chọn (fastest / best-value / smart-stopover)
 * - Các sở thích đã tích chọn (beaches, food, culture, adventure, nightlife)
 * - Ngôn ngữ (en / vi)
 */
function generateAISummary(options = {}) {
    const {
        countryId = 'belgium',
        budget = 2000,
        routeType = 'fastest',
        preferences = ['beaches', 'food', 'culture'],
        lang = 'en'
    } = options;

    const country = MOCK_COUNTRIES[countryId] || MOCK_COUNTRIES.belgium;
    const isVi = lang === 'vi';

    // 1. Lời chào cá nhân hóa theo từng quốc gia
    const greetings = {
        belgium: { en: "Hello traveler from Belgium!", vi: "Xin chào du khách từ Vương quốc Bỉ!" },
        france: { en: "Bonjour traveler from France!", vi: "Bonjour! Chào mừng quý khách từ nước Pháp lãng mạn!" },
        germany: { en: "Guten Tag from Frankfurt!", vi: "Guten Tag! Lời chào nồng nhiệt đến quý khách từ nước Đức!" },
        usa: { en: "Welcome traveler from the United States!", vi: "Chào mừng quý khách đến từ Hoa Kỳ!" },
        australia: { en: "G'day mate from Australia!", vi: "G'day! Xin chào quý khách đến từ nước Úc xinh đẹp!" },
        japan: { en: "Konnichiwa! Welcome from Tokyo, Japan!", vi: "Konnichiwa! Rất hân hạnh được đồng hành cùng quý khách từ Nhật Bản!" }
    };
    const greetingText = (greetings[countryId] && greetings[countryId][lang]) || (isVi ? "Xin chào quý du khách quốc tế!" : "Welcome international traveler!");

    // 2. Phân tích tuyến đường & sân bay theo phương án lựa chọn
    let routeAnalysis = "";
    if (routeType === 'fastest') {
        if (countryId === 'france' || countryId === 'germany') {
            routeAnalysis = isVi
                ? `Với ưu tiên **nhanh nhất**, AI đã định vị đường bay thẳng không dừng từ ${country.city} đến Sân bay Quốc tế Nội Bài (HAN), sau đó nối chuyến 1 tiếng 35 phút thẳng đến Sân bay Phù Cát (UIH). Tổng hành trình chỉ khoảng 14 giờ bay và 40 phút taxi về trung tâm Quy Nhơn.`
                : `Prioritizing the **fastest travel time**, our AI routes you on a direct flight from ${country.city} to Hanoi Noi Bai (HAN), followed by a 1h 35m connection straight into Phu Cat Airport (UIH). Total travel is around 14 hours plus a 40-minute scenic taxi to downtown Quy Nhon.`;
        } else if (countryId === 'usa' || countryId === 'australia') {
            routeAnalysis = isVi
                ? `Với mục tiêu **tối ưu thời gian**, AI đề xuất chặng bay xuyên biển đến Tân Sơn Nhất (SGN), nối chuyến tức thì 1 giờ đến Sân bay Phù Cát (UIH), giúp bạn đặt chân đến vịnh biển Quy Nhơn sớm nhất có thể.`
                : `For the **fastest journey**, AI routes you across to Ho Chi Minh City (SGN), then a swift 1-hour connection directly into Phu Cat Airport (UIH), getting you to Quy Nhon's serene bays on optimal time.`;
        } else if (countryId === 'japan') {
            routeAnalysis = isVi
                ? `Với ưu tiên **tốc độ**, đường bay thẳng thương mại 5.5 giờ từ Tokyo đến Sân bay Đà Nẵng (DAD) kết hợp xe Limousine cao cấp là hành trình quốc tế ngắn nhất để đến Quy Nhơn trong chưa đầy 11 giờ.`
                : `For maximum **speed**, a direct 5.5-hour flight from Tokyo to Da Nang (DAD) combined with an express coastal limousine is the fastest international gateway to Quy Nhon under 11 hours.`;
        } else {
            routeAnalysis = isVi
                ? `Với tùy chọn **nhanh nhất**, bạn sẽ bay qua Sân bay Quốc tế Nội Bài (HAN) rồi nối chuyến thẳng tới Sân bay Phù Cát (UIH). Đây là phương án tiết kiệm tối đa thời gian di chuyển trên đường.`
                : `Selecting the **fastest route**, you fly via Hanoi Noi Bai (HAN) and catch a direct connection to Phu Cat Airport (UIH), minimizing overall transit downtime.`;
        }
    } else if (routeType === 'best-value') {
        routeAnalysis = isVi
            ? `Với lựa chọn **tiết kiệm & cân bằng**, hệ thống kết hợp chuyến bay quốc tế giá tốt đến Sân bay Quốc tế Đà Nẵng (DAD) cùng xe Limousine ven biển cao cấp qua Quốc lộ 1A. Phương án này giúp bạn tiết kiệm tới 25% ngân sách vé máy bay mà vẫn ngắm trọn cảnh biển miền Trung.`
            : `Opting for the **best-value route**, our engine pairs competitive flights into Da Nang (DAD) with a comfortable coastal limousine along National Route 1A. This saves up to 25% on travel fares while offering scenic coastal views.`;
    } else { // smart-stopover
        routeAnalysis = isVi
            ? `Với hành trình **dừng chân ngắm cảnh**, AI thiết kế điểm nghỉ ngơi chiến lược tại Đà Nẵng hoặc Hà Nội, sau đó bạn sẽ trải nghiệm đoàn tàu ven biển ngắm cảnh (với tùy chọn toa tàu di sản The Vietage) đưa bạn xuyên qua các làng chài và biển xanh vào thẳng Quy Nhơn.`
            : `Choosing the **scenic stopover**, AI designs a strategic pause in Da Nang or Hanoi, allowing you to recharge before boarding the scenic coastal train (including The Vietage luxury rail carriage) sweeping through rolling hills and emerald coastlines.`;
    }

    // 3. Phân tích gợi ý theo mức ngân sách (Budget)
    let budgetAdvice = "";
    if (budget >= 3500) {
        budgetAdvice = isVi
            ? `Với ngân sách cao cấp ($${budget.toLocaleString()}), AI đề xuất bạn tận hưởng các khu nghỉ dưỡng biệt lập hàng đầu như Anantara Quy Nhon Villas hoặc Maia Resort với hồ bơi riêng hướng biển và dịch vụ đưa đón tài xế riêng.`
            : `With your luxury budget of $${budget.toLocaleString()}, we have curated oceanfront sanctuaries such as Anantara Quy Nhon Villas or Maia Resort featuring private cliffside pools and chauffeured airport transfers.`;
    } else if (budget >= 1800) {
        budgetAdvice = isVi
            ? `Ngân sách $${budget.toLocaleString()} rất lý tưởng để kết hợp nghỉ dưỡng tại resort 4-5 sao ven biển, thưởng thức hải sản tươi sống và tham gia trọn vẹn các tour cano lặn ngắm san hô Kỳ Co.`
            : `Your budget of $${budget.toLocaleString()} perfectly covers premium beachfront resorts, authentic local seafood feasts, and speedboat snorkeling excursions around Ky Co island.`;
    } else {
        budgetAdvice = isVi
            ? `Với ngân sách tiết kiệm $${budget.toLocaleString()}, AI tối ưu hóa các khách sạn phố biển tiện nghi (như FLC City Hotel), giúp bạn dành phần lớn kinh phí trải nghiệm ẩm thực đường phố và các danh thắng thiên nhiên.`
            : `With your smart budget of $${budget.toLocaleString()}, AI pairs you with modern city-beach hotels (such as FLC City Hotel), leaving ample budget for local culinary discovery and coastal excursions.`;
    }

    // 4. Cá nhân hóa theo các sở thích (Preferences)
    const validPrefs = Array.isArray(preferences) && preferences.length > 0 ? preferences : ['beaches', 'food'];
    const interestHighlights = [];

    if (validPrefs.includes('beaches')) {
        interestHighlights.push(isVi ? "thư giãn trên bãi biển Kỳ Co nước xanh màu ngọc bích và đón hoàng hôn Eo Gió" : "unwinding on emerald Ky Co waters and sunset walks along Eo Gio cliffs");
    }
    if (validPrefs.includes('food')) {
        interestHighlights.push(isVi ? "thưởng thức bánh xèo tôm nhảy giòn rụm và đại tiệc hải sản tươi sống Nhơn Lý" : "feasting on crispy jumping shrimp pancakes and freshly caught Nhon Ly seafood");
    }
    if (validPrefs.includes('culture')) {
        interestHighlights.push(isVi ? "chiêm ngưỡng tháp Chăm Bánh Ít ngàn năm và lắng nghe hào khí nhạc võ Tây Sơn" : "discovering 10th-century Banh It Cham towers and legendary Tay Son martial arts");
    }
    if (validPrefs.includes('adventure')) {
        interestHighlights.push(isVi ? "trượt cát đồi Phương Mai và vượt sóng cano khám phá đảo ngọc Cù Lao Xanh" : "sandboarding giant Phuong Mai dunes and trekking to Cu Lao Xanh lighthouse");
    }
    if (validPrefs.includes('nightlife')) {
        interestHighlights.push(isVi ? "chill bên bờ cát tại Surf Bar và ngắm toàn cảnh thành phố từ Sky Bar tầng 27" : "lounging barefoot at beachside Surf Bar and panoramic cocktails at FLC Sky Bar");
    }

    let interestText = "";
    if (interestHighlights.length > 0) {
        const joined = isVi ? interestHighlights.join(', ') : interestHighlights.join(', and ');
        interestText = isVi
            ? `Theo sở thích bạn đã chọn, lịch trình được cá nhân hóa đặc biệt dành cho: ${joined}.`
            : `Tailored specifically to your interests, your itinerary is curated for: ${joined}.`;
    }

    // Kết hợp thành đoạn văn mượt mà, đầy đủ thông tin
    return `${greetingText} ${routeAnalysis} ${budgetAdvice} ${interestText}`;
}

/**
 * HÀM SINH LỊCH TRÌNH 3 NGÀY CÁ NHÂN HÓA (ĐÁP ỨNG YÊU CẦU 2)
 * Chọn lọc các hoạt động thực tế tại Quy Nhơn dựa trên các sở thích được người dùng tích chọn
 */
function generatePersonalizedItinerary(options = {}) {
    const {
        preferences = ['beaches', 'food', 'culture'],
        lang = 'en'
    } = options;

    const isVi = lang === 'vi';
    const selected = Array.isArray(preferences) && preferences.length > 0 ? preferences : ['beaches', 'food', 'culture'];

    // Thu thập các hoạt động tương ứng với sở thích được chọn
    const matchedActivities = [];
    selected.forEach(category => {
        if (MOCK_ACTIVITIES_POOL[category]) {
            matchedActivities.push(...MOCK_ACTIVITIES_POOL[category]);
        }
    });

    // Nếu người dùng chọn ít sở thích, bổ sung thêm beach & food làm nền tảng
    if (matchedActivities.length < 6) {
        MOCK_ACTIVITIES_POOL.beaches.forEach(act => {
            if (!matchedActivities.includes(act)) matchedActivities.push(act);
        });
        MOCK_ACTIVITIES_POOL.food.forEach(act => {
            if (!matchedActivities.includes(act)) matchedActivities.push(act);
        });
    }

    // Phân bổ 9 hoạt động cho 3 ngày (mỗi ngày 3 hoạt động sáng, trưa, chiều/tối)
    const day1Acts = matchedActivities.slice(0, 3);
    const day2Acts = matchedActivities.slice(3, 6);
    const day3Acts = matchedActivities.slice(6, 9);

    // Tiêu đề ngày theo sở thích chủ đạo
    const dayTitles = {
        day1: {
            en: selected.includes('beaches') ? "Pristine Bay & Coastal Welcome" : "Arrival & Local Essence",
            vi: selected.includes('beaches') ? "Vịnh biển hoang sơ & Chào đón miền Trung" : "Hạ cánh & Hương vị bản địa"
        },
        day2: {
            en: selected.includes('culture') ? "Ancient Cham Heritage & Island Wonders" : "Emerald Waters & Culinary Treasures",
            vi: selected.includes('culture') ? "Di sản Champa cổ kính & Kỳ quan đảo ngọc" : "Biển xanh ngọc bích & Tinh hoa ẩm thực"
        },
        day3: {
            en: selected.includes('adventure') ? "Dune Thrills & Coastal Panorama Farewell" : "Sunset Bays & Local Specialty Souvenirs",
            vi: selected.includes('adventure') ? "Chinh phục đồi cát & Tạm biệt phố biển" : "Hoàng hôn trên vịnh & Đặc sản làm quà"
        }
    };

    return [
        {
            dayNumber: 1,
            label: isVi ? "Ngày 1" : "Day 1",
            title: dayTitles.day1[lang],
            activities: day1Acts.length >= 3 ? day1Acts : MOCK_ACTIVITIES_POOL.beaches.concat(MOCK_ACTIVITIES_POOL.food).slice(0, 3)
        },
        {
            dayNumber: 2,
            label: isVi ? "Ngày 2" : "Day 2",
            title: dayTitles.day2[lang],
            activities: day2Acts.length >= 3 ? day2Acts : MOCK_ACTIVITIES_POOL.culture.concat(MOCK_ACTIVITIES_POOL.beaches).slice(0, 3)
        },
        {
            dayNumber: 3,
            label: isVi ? "Ngày 3" : "Day 3",
            title: dayTitles.day3[lang],
            activities: day3Acts.length >= 3 ? day3Acts : MOCK_ACTIVITIES_POOL.food.concat(MOCK_ACTIVITIES_POOL.nightlife).slice(0, 3)
        }
    ];
}

/**
 * Lộ trình phát triển hệ thống trong tương lai
 */
const MOCK_FUTURE_FEATURES = [
    {
        icon: "plane-circle-check",
        title: { en: "Real-time Flight Engine", vi: "Dữ liệu chuyến bay thời gian thực" },
        desc: {
            en: "Live API integration with global airline distribution systems (GDS) for real-time fares and seat availability to HAN, DAD, and UIH.",
            vi: "Tích hợp API trực tiếp với hệ thống hàng không toàn cầu để tra cứu giá vé và tình trạng chỗ theo thời gian thực tới HAN, DAD và UIH."
        }
    },
    {
        icon: "route",
        title: { en: "Autonomous Multi-modal Routing", vi: "Tối ưu hóa đa phương thức thông minh" },
        desc: {
            en: "Deep reinforcement AI to balance cost, travel time, scenic value and carbon footprint for transfer legs from DAD and UIH.",
            vi: "Thuật toán AI tự động cân đối chi phí, thời gian di chuyển, cảnh quan và lượng phát thải cho từng chặng từ DAD và UIH về Quy Nhơn."
        }
    },
    {
        icon: "calendar-check",
        title: { en: "1-Click Direct Booking", vi: "Đặt phòng & vé 1 chạm tích hợp" },
        desc: {
            en: "Direct hotel and ground transport booking API without third-party redirects.",
            vi: "Kết nối trực tiếp hệ thống đặt phòng khách sạn và vé xe trung chuyển không qua trung gian."
        }
    },
    {
        icon: "comments",
        title: { en: "24/7 AI Concierge with Voice", vi: "Trợ lý AI đồng hành giọng nói 24/7" },
        desc: {
            en: "Natural conversational voice assistant guiding travelers throughout their stay in Quy Nhon in any language.",
            vi: "Trợ lý ảo giao tiếp tự nhiên bằng giọng nói, hướng dẫn du khách suốt chuyến đi bằng bất kỳ ngôn ngữ nào."
        }
    }
];

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        MOCK_DESTINATION,
        VIETNAM_AIRPORTS,
        MOCK_COUNTRIES,
        MOCK_HOTELS,
        MOCK_ACTIVITIES_POOL,
        MOCK_FUTURE_FEATURES,
        generateAISummary,
        generatePersonalizedItinerary
    };
}
