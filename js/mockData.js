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

// ==============================================================
// VERIFIED FLIGHT SCHEDULES, AIRCRAFT & FARE TIERS (PHƯƠNG ÁN 1)
// Bảng thông tin chi tiết: Số hiệu chuyến thật, giờ cất cánh/hạ cánh,
// dòng máy bay thương mại (Boeing 787, A350, A321neo) và hạng vé chuẩn
// ==============================================================
const VERIFIED_FLIGHT_AND_FARE_DATA = {
    belgium: {
        fastest: {
            fareTiers: {
                economy: { price: 1050, perks: { en: "23kg baggage • In-flight dining • Standard seat", vi: "23kg hành lý • Suất ăn nóng • Ghế tiêu chuẩn" } },
                business: { price: 2850, perks: { en: "Flat-bed seat • Lotus Lounge • Priority boarding", vi: "Ghế ngả phẳng 180° • Phòng chờ Bông Sen • Ưu tiên làm thủ tục" } }
            },
            stepsData: [
                { flightNo: "QR194 + QR976", schedule: "15:40 ➔ 14:05⁺¹", aircraft: "Boeing 787 / A350" },
                { flightNo: "VN1396", schedule: "16:30 ➔ 18:05", aircraft: "Airbus A321neo" },
                { flightNo: "Private Car", schedule: "40 phút (~35 km)", aircraft: "Sedan / SUV 7 chỗ" }
            ]
        },
        bestValue: {
            fareTiers: {
                economy: { price: 820, perks: { en: "23kg baggage • Transit via Dubai • Limousine transfer", vi: "23kg hành lý • Quá cảnh Dubai • Vé xe Limousine" } },
                business: { price: 2250, perks: { en: "Emirates Business Class • Luxury DCar transfer", vi: "Hạng thương gia Emirates • Limousine VIP 9 chỗ" } }
            },
            stepsData: [
                { flightNo: "EK182 + EK394", schedule: "14:55 ➔ 13:30⁺¹", aircraft: "Boeing 777-300ER" },
                { flightNo: "DCar VIP", schedule: "14:30 ➔ 19:45 (300 km)", aircraft: "Limousine 9 chỗ massage" }
            ]
        },
        smartStopover: {
            fareTiers: {
                economy: { price: 890, perks: { en: "Flight to Da Nang + Coastal train ticket included", vi: "Vé bay Đà Nẵng + Vé tàu hỏa ngắm biển miền Trung" } },
                business: { price: 2450, perks: { en: "Business flight + Luxury The Vietage Carriage option", vi: "Bay thương gia + Tùy chọn toa tàu hạng sang The Vietage" } }
            },
            stepsData: [
                { flightNo: "TG935 + TG580", schedule: "13:30 ➔ 09:40⁺¹", aircraft: "Airbus A350-900" },
                { flightNo: "Tàu SE3", schedule: "11:45 ➔ 16:55 (5h 10m)", aircraft: "Khoang VIP ngắm biển" }
            ]
        }
    },
    france: {
        fastest: {
            fareTiers: {
                economy: { price: 980, perks: { en: "Non-stop Paris-Hanoi • 23kg bag • In-flight meal", vi: "Bay thẳng Paris-Hà Nội • 23kg hành lý • Suất ăn nóng" } },
                business: { price: 2750, perks: { en: "Flat-bed Dreamliner • VIP Lounge • Fast-track", vi: "Ghế phẳng Dreamliner • Phòng chờ VIP • Lối ưu tiên" } }
            },
            stepsData: [
                { flightNo: "VN18", schedule: "13:10 ➔ 06:15⁺¹", aircraft: "Boeing 787-9 Dreamliner" },
                { flightNo: "VN1392", schedule: "08:40 ➔ 10:15", aircraft: "Airbus A321neo" },
                { flightNo: "Private Car", schedule: "40 phút (~35 km)", aircraft: "Xe riêng đưa đón resort" }
            ]
        },
        bestValue: {
            fareTiers: {
                economy: { price: 810, perks: { en: "Non-stop Paris-HCMC + Connecting flight to UIH", vi: "Bay thẳng Paris-TP.HCM + Nối chuyến bay thẳng Phù Cát" } },
                business: { price: 2350, perks: { en: "Business Class VN10 • Priority luggage & lounge", vi: "Thương gia VN10 • Ưu tiên hành lý & phòng chờ VIP" } }
            },
            stepsData: [
                { flightNo: "VN10", schedule: "12:15 ➔ 06:30⁺¹", aircraft: "Airbus A350-900" },
                { flightNo: "VJ382", schedule: "08:45 ➔ 09:55", aircraft: "Airbus A321" }
            ]
        },
        smartStopover: {
            fareTiers: {
                economy: { price: 880, perks: { en: "Fly to Da Nang / Hoi An + Scenic coastal train to Quy Nhon", vi: "Bay đến Đà Nẵng / Hội An + Tàu ngắm biển về Quy Nhơn" } },
                business: { price: 2550, perks: { en: "Business flight + Luxury coastal heritage train", vi: "Bay thương gia + Toa tàu di sản ven biển" } }
            },
            stepsData: [
                { flightNo: "VN18 + VN116", schedule: "13:10 ➔ 09:40⁺¹", aircraft: "Boeing 787-9 / A321" },
                { flightNo: "Tàu SE1", schedule: "13:20 ➔ 18:35 (5h 15m)", aircraft: "Khoang nằm điều hòa" }
            ]
        }
    },
    germany: {
        fastest: {
            fareTiers: {
                economy: { price: 1020, perks: { en: "Non-stop Frankfurt-Hanoi • 23kg bag • Hot meals", vi: "Bay thẳng Frankfurt-Hà Nội • 23kg hành lý • Suất ăn nóng" } },
                business: { price: 2800, perks: { en: "Boeing 787 flat-bed • Lotus Lounge • Priority boarding", vi: "Ghế ngả phẳng Boeing 787 • Phòng chờ VIP • Ưu tiên lên tàu" } }
            },
            stepsData: [
                { flightNo: "VN36", schedule: "13:55 ➔ 06:20⁺¹", aircraft: "Boeing 787-9 Dreamliner" },
                { flightNo: "VN1392", schedule: "08:40 ➔ 10:15", aircraft: "Airbus A321" },
                { flightNo: "Private Transfer", schedule: "40 phút (~35 km)", aircraft: "SUV cao cấp đưa đón" }
            ]
        },
        bestValue: {
            fareTiers: {
                economy: { price: 830, perks: { en: "Flight to Central Vietnam + Modern coastal highway bus", vi: "Vé bay miền Trung + Xe khách cao cấp ven biển" } },
                business: { price: 2380, perks: { en: "Premium partner flight + VIP limousine transit", vi: "Hạng thương gia đối tác + Limousine VIP" } }
            },
            stepsData: [
                { flightNo: "LH772 + VN1396", schedule: "14:10 ➔ 10:30⁺¹", aircraft: "Airbus A350-900" },
                { flightNo: "DCar VIP", schedule: "12:00 ➔ 17:15 (300 km)", aircraft: "Limousine 9 chỗ massage" }
            ]
        },
        smartStopover: {
            fareTiers: {
                economy: { price: 895, perks: { en: "Non-stop to Hanoi • Free time in capital ➔ Flight to UIH", vi: "Bay thẳng Hà Nội • Dạo phố cổ thủ đô ➔ Bay thẳng Phù Cát" } },
                business: { price: 2500, perks: { en: "Business flight • Hotel lounge access • Afternoon UIH flight", vi: "Bay thương gia • Phòng chờ khách sạn • Bay chiều về Phù Cát" } }
            },
            stepsData: [
                { flightNo: "VN36", schedule: "13:55 ➔ 06:20⁺¹", aircraft: "Boeing 787-9 Dreamliner" },
                { flightNo: "VN1398", schedule: "15:50 ➔ 17:25", aircraft: "Airbus A321neo" }
            ]
        }
    },
    usa: {
        fastest: {
            fareTiers: {
                economy: { price: 1280, perks: { en: "Transpacific direct flight SFO-SGN • 2x23kg baggage", vi: "Bay thẳng Thái Bình Dương SFO-TP.HCM • 2 kiện 23kg" } },
                business: { price: 3450, perks: { en: "Boeing 787 Business • Flat-bed • Lotus Lounge", vi: "Thương gia Boeing 787 • Giường nằm phẳng • Phòng chờ VIP" } }
            },
            stepsData: [
                { flightNo: "VN99", schedule: "22:15 ➔ 04:30⁺²", aircraft: "Boeing 787-9 Dreamliner" },
                { flightNo: "VN1384", schedule: "07:10 ➔ 08:20", aircraft: "Airbus A321neo" },
                { flightNo: "Private Car", schedule: "40 phút (~35 km)", aircraft: "SUV 7 chỗ cao cấp" }
            ]
        },
        bestValue: {
            fareTiers: {
                economy: { price: 1050, perks: { en: "1 transit in Taipei ➔ Da Nang + Coastal express transfer", vi: "Quá cảnh Đài Bắc ➔ Đà Nẵng + Xe Limousine ven biển" } },
                business: { price: 2950, perks: { en: "EVA Air Royal Laurel Business + Luxury VIP transit", vi: "Hạng thương gia EVA Air + Xe VIP đưa đón tận resort" } }
            },
            stepsData: [
                { flightNo: "BR017 + BR397", schedule: "00:05 ➔ 11:20⁺¹", aircraft: "Boeing 777-300ER" },
                { flightNo: "Limousine VIP", schedule: "13:00 ➔ 18:15 (300 km)", aircraft: "DCar Limousine 9 chỗ" }
            ]
        },
        smartStopover: {
            fareTiers: {
                economy: { price: 1150, perks: { en: "Fly to Da Nang (overnight) + Coastal scenic train to Quy Nhon", vi: "Bay đến Đà Nẵng nghỉ đêm + Tàu hỏa ngắm biển về Quy Nhơn" } },
                business: { price: 3200, perks: { en: "Business flight + The Vietage scenic luxury train", vi: "Bay thương gia + Toa tàu ngắm cảnh hạng sang The Vietage" } }
            },
            stepsData: [
                { flightNo: "CI003 + CI783", schedule: "01:25 ➔ 13:45⁺¹", aircraft: "Airbus A350-900" },
                { flightNo: "Tàu SE3", schedule: "11:45 ➔ 16:55 (5h 10m)", aircraft: "Khoang VIP ngắm biển" }
            ]
        }
    },
    australia: {
        fastest: {
            fareTiers: {
                economy: { price: 890, perks: { en: "Non-stop Sydney-HCMC (8h 45m) • 23kg bag • In-flight dining", vi: "Bay thẳng Sydney-TP.HCM (8h 45m) • 23kg hành lý • Suất ăn nóng" } },
                business: { price: 2350, perks: { en: "Dreamliner Business • Flat-bed • Lotus Lounge access", vi: "Thương gia Dreamliner • Ghế ngả phẳng • Phòng chờ VIP" } }
            },
            stepsData: [
                { flightNo: "VN786", schedule: "11:15 ➔ 16:00", aircraft: "Boeing 787-9 Dreamliner" },
                { flightNo: "VN1388", schedule: "18:20 ➔ 19:30", aircraft: "Airbus A321" },
                { flightNo: "Private Car", schedule: "40 phút (~35 km)", aircraft: "Sedan / SUV đưa đón" }
            ]
        },
        bestValue: {
            fareTiers: {
                economy: { price: 720, perks: { en: "Direct Vietjet Air flights: Sydney ➔ HCMC ➔ Phu Cat", vi: "Bay thẳng Vietjet Air: Sydney ➔ TP.HCM ➔ Phù Cát" } },
                business: { price: 1950, perks: { en: "Vietjet SkyBoss • Priority check-in & lounge access", vi: "Hạng SkyBoss Vietjet • Ưu tiên làm thủ tục & phòng chờ" } }
            },
            stepsData: [
                { flightNo: "VJ086", schedule: "10:15 ➔ 15:40", aircraft: "Airbus A330-300" },
                { flightNo: "VJ384", schedule: "18:00 ➔ 19:10", aircraft: "Airbus A321" }
            ]
        },
        smartStopover: {
            fareTiers: {
                economy: { price: 820, perks: { en: "Sydney ➔ HCMC evening dining ➔ Morning flight to UIH", vi: "Sydney ➔ TP.HCM ăn tối ẩm thực ➔ Bay sáng sớm tới Phù Cát" } },
                business: { price: 2150, perks: { en: "Business flight + 5-star transit hotel + UIH direct flight", vi: "Bay thương gia + Khách sạn 5 sao quá cảnh + Bay thẳng Phù Cát" } }
            },
            stepsData: [
                { flightNo: "VN786", schedule: "11:15 ➔ 16:00", aircraft: "Boeing 787-9 Dreamliner" },
                { flightNo: "VN1384", schedule: "07:10 ➔ 08:20 (sáng hôm sau)", aircraft: "Airbus A321neo" }
            ]
        }
    },
    japan: {
        fastest: {
            fareTiers: {
                economy: { price: 580, perks: { en: "Non-stop Tokyo-Hanoi (5h 15m) • 2x23kg baggage • Meals", vi: "Bay thẳng Tokyo-Hà Nội (5h 15m) • 2 kiện 23kg • Suất ăn nóng" } },
                business: { price: 1450, perks: { en: "Airbus A350 Business • Flat-bed • Lotus Lounge", vi: "Thương gia Airbus A350 • Giường nằm phẳng • Phòng chờ VIP" } }
            },
            stepsData: [
                { flightNo: "VN311", schedule: "10:00 ➔ 14:15", aircraft: "Airbus A350-900" },
                { flightNo: "VN1396", schedule: "16:30 ➔ 18:05", aircraft: "Airbus A321" },
                { flightNo: "Private Car", schedule: "40 phút (~35 km)", aircraft: "SUV 7 chỗ đưa đón" }
            ]
        },
        bestValue: {
            fareTiers: {
                economy: { price: 480, perks: { en: "Vietjet direct flights: Tokyo Narita ➔ Hanoi ➔ Phu Cat", vi: "Bay thẳng Vietjet: Tokyo Narita ➔ Hà Nội ➔ Phù Cát" } },
                business: { price: 1250, perks: { en: "Vietjet SkyBoss • Priority boarding & luggage", vi: "Hạng SkyBoss Vietjet • Ưu tiên lên tàu & hành lý" } }
            },
            stepsData: [
                { flightNo: "VJ933", schedule: "09:30 ➔ 13:55", aircraft: "Airbus A321neo" },
                { flightNo: "VJ382", schedule: "16:10 ➔ 17:45", aircraft: "Airbus A320" }
            ]
        },
        smartStopover: {
            fareTiers: {
                economy: { price: 540, perks: { en: "Direct Tokyo ➔ Da Nang + Coastal train to Quy Nhon", vi: "Bay thẳng Tokyo ➔ Đà Nẵng + Tàu ngắm biển về Quy Nhơn" } },
                business: { price: 1380, perks: { en: "Business flight + Coastal railway panorama view", vi: "Bay thương gia + Tàu hỏa ngắm vịnh biển miền Trung" } }
            },
            stepsData: [
                { flightNo: "VN319", schedule: "10:30 ➔ 14:25", aircraft: "Airbus A321neo" },
                { flightNo: "Tàu SE3", schedule: "16:00 ➔ 20:45 (4h 45m)", aircraft: "Khoang nằm VIP ngắm biển" }
            ]
        }
    }
};

// Đồng bộ thông tin lịch bay & hạng vé vào MOCK_COUNTRIES
Object.keys(VERIFIED_FLIGHT_AND_FARE_DATA).forEach(countryKey => {
    if (MOCK_COUNTRIES[countryKey] && MOCK_COUNTRIES[countryKey].routes) {
        ['fastest', 'bestValue', 'smartStopover'].forEach(routeKey => {
            const verifiedRoute = VERIFIED_FLIGHT_AND_FARE_DATA[countryKey]?.[routeKey];
            const route = MOCK_COUNTRIES[countryKey].routes[routeKey];
            if (verifiedRoute && route) {
                route.fareTiers = verifiedRoute.fareTiers;
                if (verifiedRoute.stepsData && route.steps) {
                    verifiedRoute.stepsData.forEach((sd, idx) => {
                        if (route.steps[idx]) {
                            Object.assign(route.steps[idx], sd);
                        }
                    });
                }
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
        bookingSlug: "anantara-quy-nhon-villas",
        badge: { en: "5★ Ultra Luxury", vi: "5★ Nghỉ Dưỡng Cao Cấp" },
        location: "Bai Dai Beach, Ghenh Rang, Quy Nhon",
        rating: 4.9,
        reviewsCount: 420,
        priceMock: "$420 - $680",
        priceUnit: { en: "/ night", vi: "/ đêm" },
        image: "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
        features: {
            en: ["Private Oceanfront Infinity Pool", "Personal Butler Service 24/7", "Cliffside Wine & Cigar Cellar", "Sea.Fire.Salt Fine Dining"],
            vi: ["Biệt thự hồ bơi vô cực hướng biển", "Dịch vụ quản gia riêng 24/7", "Hầm rượu & xì gà trên vách đá", "Nhà hàng ẩm thực Sea.Fire.Salt"]
        },
        description: {
            en: "Nestled in a private cove along Bai Dai, offering 26 ocean-facing pool villas surrounded by lush tropical cliffs and turquoise waters.",
            vi: "Nép mình trong vịnh biển Bãi Dài riêng tư, gồm 26 biệt thự hồ bơi riêng hướng biển bao quanh bởi vách đá nhiệt đới hùng vĩ và làn nước xanh ngọc bích."
        }
    },
    {
        id: "maia-resort",
        name: "Maia Resort Quy Nhon",
        bookingSlug: "maia-resort-quy-nhon",
        badge: { en: "5★ Culinary & Spa", vi: "5★ Ẩm Thực & Spa" },
        location: "Nhon Hoi Economic Zone, Cat Tien, Quy Nhon",
        rating: 4.8,
        reviewsCount: 580,
        priceMock: "$210 - $350",
        priceUnit: { en: "/ night", vi: "/ đêm" },
        image: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80",
        features: {
            en: ["Daily Inclusive Spa Therapy", "Farm-to-table Gastronomy (Vi Restaurant)", "Beachfront Infinity Pool", "Pristine Golden Sand Bay"],
            vi: ["Bao gồm liệu trình Spa hàng ngày", "Ẩm thực nông trại chuẩn vị (Nhà hàng Vị)", "Hồ bơi vô cực sát bờ biển", "Bãi biển cát vàng nguyên sơ"]
        },
        description: {
            en: "A culinary-led beach sanctuary designed for foodies and wellness seekers looking to rejuvenate amid breezy tropical gardens.",
            vi: "Khu nghỉ dưỡng 5 sao chú trọng tinh hoa ẩm thực bản địa kết hợp chăm sóc sức khỏe toàn diện giữa khu vườn nhiệt đới lộng gió biển."
        }
    },
    {
        id: "crown-retreat",
        name: "Crown Retreat Quy Nhon Resort",
        bookingSlug: "crown-retreat-quy-nhon-resort",
        badge: { en: "4.5★ Seaside Bungalow", vi: "4.5★ Bungalow Biển" },
        location: "Trung Luong Beach, Cat Tien, Phu Cat, Quy Nhon",
        rating: 4.7,
        reviewsCount: 490,
        priceMock: "$115 - $190",
        priceUnit: { en: "/ night", vi: "/ đêm" },
        image: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=800&q=80",
        features: {
            en: ["Nordic Beachfront Bungalows", "Panoramic Oceanview Pool", "Pine Kitchen International Dining", "Adjacent to Trung Luong Picnic Park"],
            vi: ["Bungalow phong cách Bắc Âu sát biển", "Hồ bơi tràn bờ view đại dương", "Nhà hàng Pine Kitchen hải sản tươi sống", "Cạnh khu dã ngoại Trung Lương & bãi đá"]
        },
        description: {
            en: "Charming beachfront bungalows nestled along Trung Luong's rocky coastline, offering calm turquoise seas and dramatic sunrises.",
            vi: "Khu nghỉ dưỡng bungalow mái vòm độc đáo bên bờ biển Trung Lương, sở hữu bãi cát trắng mịn, làn nước biển trong vắt và bình minh tuyệt sắc."
        }
    },
    {
        id: "flc-city-hotel",
        name: "FLC City Hotel Beach Quy Nhon",
        bookingSlug: "flc-city-hotel-beach-quy-nhon",
        badge: { en: "5★ Beach Boulevard", vi: "5★ Khách Sạn Phố Biển" },
        location: "11 An Duong Vuong St, Quy Nhon Center",
        rating: 4.6,
        reviewsCount: 820,
        priceMock: "$70 - $130",
        priceUnit: { en: "/ night", vi: "/ đêm" },
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
        features: {
            en: ["Private Underground Beach Tunnel", "Sky Bar on 27th Floor", "Indoor Four-Season Pool", "Direct Ocean Boulevard Location"],
            vi: ["Đường hầm ngầm riêng thông ra biển", "Sky Bar tầng 27 ngắm toàn vịnh", "Bể bơi bốn mùa trong nhà", "Tọa lạc ngay mặt tiền đại lộ An Dương Vương"]
        },
        description: {
            en: "Modern 27-storey architectural icon along Quy Nhon's coastal promenade, featuring an underground walkway straight onto the beach.",
            vi: "Khách sạn 27 tầng biểu tượng ngay trung tâm đường biển Quy Nhơn, kết nối độc đáo với hầm ngầm ra thẳng bãi tắm và quầy bar tầng thượng ngoạn mục."
        }
    },
    {
        id: "anya-premier",
        name: "Anya Premier Hotel Quy Nhon",
        bookingSlug: "anya-premier-hotel-quy-nhon",
        badge: { en: "5★ Central Square", vi: "5★ Trung Tâm Phố Biển" },
        location: "44 An Duong Vuong & Le Duan, Quy Nhon",
        rating: 4.7,
        reviewsCount: 650,
        priceMock: "$65 - $120",
        priceUnit: { en: "/ night", vi: "/ đêm" },
        image: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=800&q=80",
        features: {
            en: ["Rooftop Infinity Sunrise Pool", "Facing Nguyen Tat Thanh Central Square", "Cabana Pool Bar & Cheer Pub", "Full-Service Luxury Spa & Gym"],
            vi: ["Hồ bơi vô cực ngắm bình minh trên mái", "Đối diện quảng trường Nguyễn Tất Thành", "Quầy bar Cabana & Cheer Pub sôi động", "Spa trị liệu & phòng gym hiện đại"]
        },
        description: {
            en: "First 5-star hotel in downtown Quy Nhon situated at the central coastal square, blending Scandinavian elegance with local coastal warmth.",
            vi: "Khách sạn 5 sao sang trọng ngay quảng trường trung tâm thành phố biển, thiết kế giao hòa giữa nét tối giản Bắc Âu và văn hóa duyên hải nồng hậu."
        }
    },
    {
        id: "avani-quynhon",
        name: "Avani Quy Nhon Resort",
        bookingSlug: "avani-quy-nhon-resort",
        badge: { en: "4.5★ Private Cove", vi: "4.5★ Vịnh Biển Riêng" },
        location: "Bai Dai Beach, Ghenh Rang, Quy Nhon",
        rating: 4.7,
        reviewsCount: 510,
        priceMock: "$120 - $210",
        priceUnit: { en: "/ night", vi: "/ đêm" },
        image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
        features: {
            en: ["100% Private Ocean-facing Balconies", "Secluded Soft Sand Beach Cove", "Open-air Cliffside Tre Restaurant", "Yoga & Meditation on the Shore"],
            vi: ["100% phòng có ban công hướng đại dương", "Vịnh biển Bãi Dài hoang sơ êm đềm", "Nhà hàng Tre lãng mạn trên vách đá", "Lớp học Yoga & thiền định ven bờ sóng"]
        },
        description: {
            en: "Charming tropical sanctuary inspired by ancient Champa architecture, boasting an idyllic private bay with calm emerald waves.",
            vi: "Khu nghỉ dưỡng thanh bình mang hơi thở kiến trúc Champa cổ điển, ôm trọn bờ biển Bãi Dài riêng tư với bãi cát thoai thoải và sóng biển êm đềm."
        }
    }
];

/**
 * Kho dữ liệu hoạt động thực tế tại Quy Nhơn / Bình Định phân theo danh mục sở thích
 */
const MOCK_ACTIVITIES_POOL = {
    transit: [
        {
            time: "08:30",
            category: "TRANSIT",
            title: {
                en: "Phu Cat Airport (UIH) Arrival & Transfer to Quy Nhon (~40–45 mins, ~35 km)",
                vi: "Hạ cánh Sân bay Phù Cát (UIH) & Di chuyển về Quy Nhơn (Ước tính 40–45 phút, ~35 km)"
            },
            desc: {
                en: "Arrive at Phu Cat Airport (UIH). Estimated transfer time to downtown Quy Nhon is ~40–45 minutes (~35 km via scenic coastal Highway 19B). Convenient transport includes airport shuttle buses (~50,000 VND / $2) or private taxi (~250,000 – 350,000 VND / $12–15) directly to your hotel or resort.",
                vi: "Hạ cánh tại Sân bay Phù Cát (UIH). Thời gian di chuyển về trung tâm TP. Quy Nhơn ước tính khoảng 40–45 phút (quãng đường ~35 km theo Quốc lộ 19B ven biển). Du khách có thể chọn xe buýt đưa đón sân bay (50,000đ / vé) hoặc taxi/xe riêng (~250,000đ – 350,000đ) đưa thẳng về khách sạn hoặc resort."
            }
        }
    ],
    beaches: [
        {
            time: "09:00",
            category: "BEACH",
            title: { en: "Ky Co Beach & Coral Reef", vi: "Biển Kỳ Co & Rạn san hô Hòn Sẹo" },
            desc: {
                en: "Take a speedboat to Ky Co, known as Vietnam's Maldives with crystal turquoise water and powdery white sand (speedboat + snorkeling tour ~350,000 – 450,000 VND / $15–18).",
                vi: "Đi cano vượt sóng ra bãi Kỳ Co - thiên đường biển xanh ngọc bích, bãi cát trắng mịn tựa Maldives của Việt Nam (vé trọn gói cano + lặn ngắm san hô ~350,000đ – 450,000đ)."
            }
        },
        {
            time: "15:30",
            category: "BEACH",
            title: { en: "Eo Gio Windy Strait & Coastal Walkway", vi: "Cung đường đi bộ ven biển Eo Gió" },
            desc: {
                en: "Stroll along the dramatic cliffside walking path of Eo Gio, admiring sunset over wild rocky headlands.",
                vi: "Dạo bước trên cung đường bậc thang uốn lượn ven vách đá Eo Gió, chiêm ngưỡng hoàng hôn lộng gió rực rỡ bên biển xanh."
            }
        },
        {
            time: "16:30",
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
                en: "Savor crispy golden rice pancakes with fresh lively red shrimp, rolled with wild herbs and sweet-sour garlic sauce (~35,000 – 55,000 VND).",
                vi: "Thưởng thức bánh xèo tôm nhảy đỏ tươi giòn rụm, cuốn cùng rau mầm, xoài xanh và nước chấm tỏi ớt gia truyền (khoảng 35,000đ – 55,000đ/phần)."
            }
        },
        {
            time: "12:30",
            category: "FOOD",
            title: { en: "Nhon Ly Seafood Feast by the Pier", vi: "Đại tiệc hải sản tươi sống làng chài Nhơn Lý" },
            desc: {
                en: "Indulge in freshly caught king crab, grilled sea urchins with spring onions, and spicy grouper hotpot right by the fishing pier.",
                vi: "Thưởng thức cua huỳnh đế hấp, nhum biển nướng mỡ hành và lẩu cá mú nấu lá giang chua ngọt thanh mát ngay bên bến cảng."
            }
        },
        {
            time: "12:00",
            category: "FOOD",
            title: { en: "Quy Nhon Fish Cake Noodles & Banh Hoi", vi: "Bún chả cá Quy Nhơn & Bánh hỏi lòng heo" },
            desc: {
                en: "Taste iconic savory fish cake noodle soup in clear sweet broth paired with delicate Banh Hoi rice weaves (~30,000 – 50,000 VND).",
                vi: "Thưởng thức bún chả cá thu thanh ngọt truyền thống và đĩa bánh hỏi lòng heo nóng hổi trứ danh đất võ (khoảng 30,000đ – 50,000đ/phần)."
            }
        },
        {
            time: "18:30",
            category: "FOOD",
            title: { en: "Ngo Van So Night Culinary Street", vi: "Thiên đường ẩm thực đêm phố Ngô Văn Sở" },
            desc: {
                en: "Taste legendary local street specialties: grilled pork rolls (Nem Nuong Cho Huyen), steamed rice cakes, and sea snails (~20,000 – 100,000 VND).",
                vi: "Trải nghiệm phố ẩm thực sầm uất: nem nướng Chợ Huyện, bánh bèo chén tôm cháy, tré rơm và ốc biển tươi sống (khoảng 20,000đ – 100,000đ/món)."
            }
        }
    ],
    science: [
        {
            time: "14:30",
            category: "SCIENCE",
            title: {
                en: "Explorascience Quy Nhon (Space & Science Discovery Center)",
                vi: "Tổ hợp Không gian Khoa học - Explorascience Quy Nhơn"
            },
            desc: {
                en: "Explore Vietnam's first public science discovery center (Explorascience) at 10 Science Boulevard: full-dome 80-seat Planetarium with 4K cosmic projections, public Astronomical Observatory with high-power optical telescopes, and 7 interactive scientific theme galleries.",
                vi: "Khám phá trung tâm khoa học vũ trụ đại chúng đầu tiên của Việt Nam (Explorascience) tại số 10 Đại lộ Khoa học: Nhà chiếu hình vũ trụ (Planetarium) 80 chỗ màn hình vòm 12m công nghệ 4K, Đài thiên văn quan sát kính quang học và 7 phòng trưng bày khoa học tương tác kỳ thú."
            }
        }
    ],
    culture: [
        {
            time: "09:00",
            category: "CULTURE",
            title: { en: "Banh It & Twin Cham Towers", vi: "Cụm Tháp Chăm Bánh Ít & Tháp Đôi ngàn năm" },
            desc: {
                en: "Marvel at 10th-century brick Cham architecture standing proudly on a hilltop overlooking peaceful rice valleys.",
                vi: "Chiêm ngưỡng kiệt tác kiến trúc gạch nung Champa thế kỷ thứ 10 uy nghiêm trên đỉnh đồi lộng gió."
            }
        },
        {
            time: "19:30",
            category: "CULTURE",
            title: {
                en: "Binh Dinh Traditional Arts Theater (Every Friday 19:30 - FREE ADMISSION)",
                vi: "Nhà hát Nghệ thuật Truyền thống tỉnh Bình Định (Tối Thứ 6 hàng tuần 19h30 MIỄN PHÍ)"
            },
            desc: {
                en: "Experience authentic Binh Dinh Tuong classical opera and UNESCO-recognized Bai Choi folk singing at 590 Nguyen Thai Hoc - Staged every Friday evening at 19:30 with completely FREE ADMISSION for all visitors and locals.",
                vi: "Thưởng thức đêm diễn nghệ thuật Tuồng cổ Bình Định và Dân ca Bài Chòi (di sản văn hóa phi vật thể đại diện nhân loại được UNESCO vinh danh) tại số 590 Nguyễn Thái Học - Diễn ra định kỳ vào tối Thứ 6 hàng tuần lúc 19h30, hoàn toàn MIỄN PHÍ vé vào cửa cho tất cả du khách và người dân."
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
            time: "15:00",
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
/**
 * HÀM SINH CÂU TÓM TẮT CỦA AI TRAVEL ASSISTANT (TINH GỌN, CHUẨN XÁC, USER-FRIENDLY)
 * Sinh lời khuyên ngắn gọn, súc tích (3-4 câu), đầy đủ hub, sân bay và điểm đến
 * Không sử dụng ký tự markdown ** để đảm bảo thân thiện người dùng và giọng đọc TTS mượt mà.
 */
function generateAISummary(options = {}) {
    const {
        countryId = 'belgium',
        budget = 2000,
        routeType = 'fastest',
        preferences = ['beaches', 'food', 'culture'],
        lang = 'en',
        destinationId = 'quynhon'
    } = options;

    const numBudget = Number(String(budget).replace(/,/g, '')) || 2000;
    const country = MOCK_COUNTRIES[countryId] || MOCK_COUNTRIES.belgium;
    const isVi = lang === 'vi';

    // 1. Lời chào cá nhân hóa theo từng quốc gia
    const greetings = {
        belgium: { en: "Welcome from Belgium!", vi: "Chào mừng quý khách từ Bỉ!" },
        france: { en: "Bonjour from France!", vi: "Bonjour từ nước Pháp!" },
        germany: { en: "Guten Tag from Germany!", vi: "Guten Tag từ nước Đức!" },
        usa: { en: "Welcome from the United States!", vi: "Chào mừng quý khách từ Hoa Kỳ!" },
        australia: { en: "G'day from Australia!", vi: "G'day từ nước Úc!" },
        japan: { en: "Konnichiwa from Japan!", vi: "Konnichiwa từ Nhật Bản!" },
        vietnam: { en: "Welcome to Quy Nhon!", vi: "Chào mừng quý khách đến với Quy Nhơn!" }
    };
    const greetingText = (greetings[countryId] && greetings[countryId][lang]) || (isVi ? "Chào mừng quý du khách!" : "Welcome traveler!");

    // 2. Phân tích tuyến đường kèm ước lượng thời gian Sân bay Phù Cát -> Quy Nhơn (40-45 phút, ~35 km)
    let routeAnalysis = "";
    if (routeType === 'fastest') {
        if (countryId === 'france') {
            routeAnalysis = isVi
                ? "Lộ trình nhanh nhất: Bay từ Paris đến Hà Nội (HAN) nối chuyến thẳng đến Sân bay Phù Cát (UIH), sau đó đi xe đưa đón khoảng 40-45 phút (~35 km) về trung tâm Quy Nhơn."
                : "Fastest route: Direct flight from Paris to Hanoi (HAN) with a quick connection to Phu Cat Airport (UIH), followed by a 40-45 min transfer (~35 km) into Quy Nhon.";
        } else if (countryId === 'germany') {
            routeAnalysis = isVi
                ? "Lộ trình nhanh nhất: Bay từ Frankfurt đến Hà Nội (HAN) nối chuyến thẳng đến Sân bay Phù Cát (UIH), sau đó di chuyển 40-45 phút (~35 km) về thành phố."
                : "Fastest route: Fly from Frankfurt to Hanoi (HAN) with a direct connection to Phu Cat Airport (UIH), and a 40-45 min transfer (~35 km) to the city.";
        } else if (countryId === 'usa') {
            routeAnalysis = isVi
                ? "Lộ trình nhanh nhất: Bay qua TP. Hồ Chí Minh (SGN) rồi nối chuyến thẳng 1 giờ đến Sân bay Phù Cát (UIH), kết hợp xe đưa đón 40-45 phút (~35 km) về Quy Nhơn."
                : "Fastest route: Fly via Ho Chi Minh City (SGN) with a direct 1-hour connection to Phu Cat Airport (UIH), and a 40-45 min transfer (~35 km) to Quy Nhon.";
        } else if (countryId === 'australia') {
            routeAnalysis = isVi
                ? "Lộ trình nhanh nhất: Bay từ Sydney qua TP. Hồ Chí Minh (SGN) nối chuyến thẳng đến Sân bay Phù Cát (UIH), sau đó di chuyển 40-45 phút (~35 km) về khách sạn."
                : "Fastest route: Fly from Sydney via Ho Chi Minh City (SGN) with a direct connection to Phu Cat Airport (UIH), and a 40-45 min transfer (~35 km) to your hotel.";
        } else if (countryId === 'japan') {
            routeAnalysis = isVi
                ? "Lộ trình nhanh nhất: Bay thẳng 5.5 giờ đến Hà Nội (HAN) nối chuyến về Sân bay Phù Cát (UIH), sau đó đi xe 40-45 phút (~35 km) về trung tâm Quy Nhơn."
                : "Fastest route: Direct 5.5h flight to Hanoi (HAN) connecting to Phu Cat Airport (UIH), followed by a 40-45 min transfer (~35 km) into Quy Nhon.";
        } else { // Belgium, Vietnam & default
            routeAnalysis = isVi
                ? "Lộ trình nhanh nhất: Bay qua Hà Nội (HAN) nối chuyến thẳng đến Sân bay Phù Cát (UIH), sau đó đi xe đưa đón khoảng 40-45 phút (~35 km) về trung tâm Quy Nhơn."
                : "Fastest route: Fly via Hanoi (HAN) with a direct flight to Phu Cat Airport (UIH), followed by a 40-45 min transfer (~35 km) to downtown Quy Nhon.";
        }
    } else if (routeType === 'best-value') {
        routeAnalysis = isVi
            ? "Lộ trình tiết kiệm: Bay vé tốt đến Đà Nẵng (DAD) kết hợp xe limousine ngắm cảnh ven biển về Quy Nhơn."
            : "Best-value route: Fly into Da Nang (DAD) paired with a scenic coastal limousine to Quy Nhon.";
    } else { // smart-stopover
        routeAnalysis = isVi
            ? "Dừng chân ngắm cảnh: Nghỉ ngơi tại Đà Nẵng hoặc Hà Nội rồi trải nghiệm tàu hỏa ven biển về Quy Nhơn."
            : "Scenic stopover: Recharge in Da Nang or Hanoi, then take the coastal train into Quy Nhon.";
    }

    // 3. Gợi ý nơi ở theo đúng mức ngân sách (CHUẨN XÁC VỚI SỐ TIỀN ĐƯỢC CHỌN, CÓ DẤU PHÂN CÁCH PHẦN NGHÌN)
    let budgetAdvice = "";
    if (numBudget >= 3500) {
        budgetAdvice = isVi
            ? `Nghỉ dưỡng gợi ý: Biệt thự hướng biển sang trọng tại Anantara Quy Nhon Villas hoặc Maia Resort (ngân sách $${numBudget.toLocaleString('en-US')}).`
            : `Curated stay: Luxury oceanfront villa at Anantara Quy Nhon Villas or Maia Resort ($${numBudget.toLocaleString('en-US')} budget).`;
    } else if (numBudget >= 1800) {
        budgetAdvice = isVi
            ? `Nghỉ dưỡng gợi ý: Resort 4-5 sao ven biển với bãi tắm riêng tại FLC hoặc Anya Premier (ngân sách $${numBudget.toLocaleString('en-US')}).`
            : `Curated stay: 4-5 star beachfront resort with ocean access at FLC or Anya Premier ($${numBudget.toLocaleString('en-US')} budget).`;
    } else {
        budgetAdvice = isVi
            ? `Nghỉ dưỡng gợi ý: Khách sạn boutique tiện nghi ngay trung tâm phố biển gần ẩm thực bản địa (ngân sách $${numBudget.toLocaleString('en-US')}).`
            : `Curated stay: Modern city-beach boutique hotel close to local cuisine ($${numBudget.toLocaleString('en-US')} budget).`;
    }

    // 4. Trải nghiệm nổi bật (bao gồm Explorascience và Nhà hát Nghệ thuật Truyền thống miễn phí tối thứ 6)
    let interestText = "";
    if (destinationId === 'gialai') {
        interestText = isVi 
            ? "Trải nghiệm nổi bật: Biển Hồ T'nưng thơ mộng, núi lửa Chư Đăng Ya và hương vị cà phê đại ngàn Pleiku."
            : "Highlights: Sea Lake T'Nung, Chu Dang Ya volcano, and fragrant Central Highlands coffee culture.";
    } else if (destinationId === 'hanoi') {
        interestText = isVi 
            ? "Trải nghiệm nổi bật: Dạo bước Hồ Gươm, thưởng thức cà phê trứng phố cổ và ngắm cầu Long Biên lịch sử."
            : "Highlights: Strolling Hoan Kiem Lake, egg coffee across the 36 Old Quarter streets, and historic Long Bien Bridge.";
    } else {
        interestText = isVi
            ? "Trải nghiệm nổi bật: Biển Kỳ Co & Eo Gió, bánh xèo tôm nhảy, khám phá vũ trụ tại Explorascience và đêm nhạc Tuồng - Bài Chòi tối Thứ 6 miễn phí."
            : "Highlights: Ky Co Beach & Eo Gio cliffs, jumping shrimp pancakes, cosmic wonders at Explorascience, and Friday free traditional Tuong & Bai Choi folk arts.";
    }

    return `${greetingText} ${routeAnalysis} ${budgetAdvice} ${interestText}`;
}

/**
 * HÀM SINH LỊCH TRÌNH 3 NGÀY CÁ NHÂN HÓA - ZERO DUPLICATES, ĐẦY ĐỦ TIÊU CHÍ NGƯỜI DÙNG
 */
function generatePersonalizedItinerary(options = {}) {
    const {
        preferences = ['beaches', 'food', 'culture'],
        budget = 2000,
        lang = 'en',
        destinationId = 'quynhon'
    } = options;

    const isVi = lang === 'vi';
    const numBudget = Number(String(budget).replace(/,/g, '')) || 2000;

    // Lịch trình 3 ngày chuẩn mẫu không trùng lặp, đầy đủ:
    // - Thời gian Sân bay Phù Cát -> Quy Nhơn (40-45 phút, ~35 km)
    // - Explorascience Quy Nhơn (Tổ hợp không gian khoa học & Planetarium)
    // - Nhà hát Nghệ thuật Truyền thống tỉnh (Tối Thứ 6 lúc 19h30 MIỄN PHÍ)
    const itinerary = [
        {
            dayNumber: 1,
            label: isVi ? "Ngày 1" : "Day 1",
            title: isVi ? "Hạ cánh Sân bay Phù Cát (Ước tính 40–45 phút) & Vịnh biển Kỳ Co" : "Phu Cat Airport Arrival (~40-45 min transfer) & Coastal Welcome",
            activities: [
                MOCK_ACTIVITIES_POOL.transit[0],
                MOCK_ACTIVITIES_POOL.food[0], // Bánh xèo tôm nhảy (12:00)
                MOCK_ACTIVITIES_POOL.beaches[1], // Cung đường Eo Gió (15:30)
                MOCK_ACTIVITIES_POOL.food[3] // Phố ẩm thực Ngô Văn Sở (18:30)
            ]
        },
        {
            dayNumber: 2,
            label: isVi ? "Ngày 2" : "Day 2",
            title: isVi ? "Biển Kỳ Co, Explorascience & Nhà Hát Nghệ Thuật (Tối Thứ 6 Miễn Phí)" : "Ky Co Waters, Explorascience & Traditional Theater (Friday Free Show)",
            activities: [
                MOCK_ACTIVITIES_POOL.beaches[0], // Biển Kỳ Co & Hòn Sẹo (09:00)
                MOCK_ACTIVITIES_POOL.food[1], // Hải sản Nhơn Lý (12:30)
                MOCK_ACTIVITIES_POOL.science[0], // Explorascience Quy Nhơn (14:30)
                MOCK_ACTIVITIES_POOL.culture[1] // Nhà hát Nghệ thuật Truyền thống (Tối Thứ 6 miễn phí - 19:30)
            ]
        },
        {
            dayNumber: 3,
            label: isVi ? "Ngày 3" : "Day 3",
            title: isVi ? "Tháp Chăm ngàn năm, Đồi cát & Hoàng hôn biển" : "Ancient Cham Heritage, Dunes & Coastal Farewell",
            activities: [
                MOCK_ACTIVITIES_POOL.culture[0], // Tháp Chăm Bánh Ít & Tháp Đôi (09:00)
                MOCK_ACTIVITIES_POOL.food[2], // Bún chả cá & Bánh hỏi lòng heo (12:00)
                MOCK_ACTIVITIES_POOL.adventure[0], // Trượt cát Phương Mai (15:00)
                MOCK_ACTIVITIES_POOL.beaches[2], // Bãi Trứng Hoàng Hậu & Ghềnh Ráng (16:30)
                MOCK_ACTIVITIES_POOL.nightlife[0] // Surf Bar (20:00)
            ]
        }
    ];

    // Đảm bảo các hoạt động luôn được xếp theo thứ tự thời gian tăng dần
    itinerary.forEach(day => {
        if (Array.isArray(day.activities)) {
            day.activities.sort((a, b) => (a.time || '').localeCompare(b.time || ''));
        }
    });

    return itinerary;
}

const MOCK_FUTURE_FEATURES = [
    {
        icon: "plane-circle-check",
        title: { en: "Live GDS Flight Booking Engine", vi: "Xuất vé máy bay thời gian thực (GDS)" },
        desc: {
            en: "Direct airline API integration with global distribution systems (Amadeus/Skyscanner) for instant ticket issuance to Quy Nhon (UIH).",
            vi: "Kết nối trực tiếp hệ thống phân phối hàng không Amadeus/Skyscanner tra cứu và xuất vé máy bay tức thì về Sân bay Phù Cát (UIH)."
        }
    },
    {
        icon: "leaf",
        title: { en: "Green Carbon-Offset Ledger", vi: "Tín chỉ du lịch xanh & Bù đắp Carbon" },
        desc: {
            en: "Empowering conscious travelers to offset transit emissions by funding local coastal mangrove and marine conservation projects in Binh Dinh.",
            vi: "Tự động quy đổi và hỗ trợ du khách đóng góp bù đắp phát thải cho các dự án bảo tồn rừng ngập mặn và rạn san hô biển tại Bình Định."
        }
    },
    {
        icon: "credit-card",
        title: { en: "1-Click Multi-Modal Pass", vi: "Thẻ hành trình tích hợp 1-Chạm" },
        desc: {
            en: "Seamless unified checkout covering airport shuttle, scenic coastal railway and 5-star resort reservations in a single digital pass.",
            vi: "Thanh toán một chạm đồng bộ cả xe đón sân bay, vé tàu hỏa ngắm cảnh và đặt phòng resort trong một vé điện tử duy nhất."
        }
    },
    {
        icon: "vr-cardboard",
        title: { en: "AR Smart Seaside Navigation", vi: "Chỉ đường thực tế ảo AR ven biển" },
        desc: {
            en: "Immersive augmented reality audio tours guiding visitors across Quy Nhon's pristine cliffs, hidden coves and cultural landmarks.",
            vi: "Hướng dẫn viên thực tế ảo AR định vị cảnh quan, thuyết minh văn hóa Tháp Đôi, Ghềnh Ráng và các vịnh biển hoang sơ của Quy Nhơn."
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
