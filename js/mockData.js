/**
 * Quy Nhon AI Travel Assistant - Mock Data
 * Lưu ý: Tất cả dữ liệu chuyến bay, khách sạn và giá cả dưới đây là dữ liệu MÔ PHỎNG (MOCK DATA)
 * phục vụ cho mục đích trình diễn ý tưởng (Prototype / Demo).
 */

const MOCK_DESTINATION = {
    name: "Quy Nhon, Binh Dinh",
    country: "Vietnam",
    lat: 13.7820,
    lng: 109.2197,
    airportCode: "UIH",
    airportName: "Phu Cat Airport",
    description: {
        en: "Coastal gem of Central Vietnam renowned for pristine beaches, Cham towers, and fresh seafood.",
        vi: "Viên ngọc ven biển miền Trung nổi tiếng với bãi biển hoang sơ, tháp Chăm cổ kính và hải sản tươi ngon."
    }
};

const MOCK_COUNTRIES = {
    belgium: {
        id: "belgium",
        name: { en: "Belgium", vi: "Bỉ" },
        flag: "🇧🇪",
        city: "Brussels",
        airport: "Brussels Airport (BRU)",
        lat: 50.8503,
        lng: 4.3517,
        route: {
            transitHub: {
                city: "Da Nang",
                name: { en: "Da Nang International Airport", vi: "Sân bay Quốc tế Đà Nẵng" },
                code: "DAD",
                lat: 16.0544,
                lng: 108.2022
            },
            steps: [
                {
                    type: "flight",
                    icon: "plane-departure",
                    title: { en: "International Flight", vi: "Chuyến bay quốc tế" },
                    from: "Brussels (BRU)",
                    to: "Da Nang (DAD)",
                    subInfo: {
                        en: "1 stopover (e.g., Doha / Bangkok) • Est. 14h 30m • Mock Flight #AI-882",
                        vi: "1 điểm quá cảnh (Doha / Bangkok) • Dự kiến 14h 30m • Chuyến bay mô phỏng #AI-882"
                    },
                    highlight: { en: "Recommended: Arrive morning in Da Nang", vi: "Khuyến nghị: Hạ cánh buổi sáng tại Đà Nẵng" }
                },
                {
                    type: "transfer",
                    icon: "van-shuttle",
                    title: { en: "Scenic Ground Transfer", vi: "Trung chuyển đường bộ ven biển" },
                    from: "Da Nang (DAD)",
                    to: "Quy Nhon",
                    subInfo: {
                        en: "Private Limousine / Luxury Coastal Bus • ~5h 15m • Scenic National Route 1A",
                        vi: "Xe Limousine riêng / Xe du lịch cao cấp • ~5h 15m • Tuyến Quốc lộ 1A ven biển"
                    },
                    highlight: { en: "Stunning coastal vistas along Quang Nam & Quang Ngai", vi: "Ngắm cảnh biển tuyệt đẹp qua Quảng Nam & Quảng Ngãi" }
                },
                {
                    type: "hotel",
                    icon: "hotel",
                    title: { en: "Check-in at Quy Nhon", vi: "Nhận phòng tại Quy Nhon" },
                    from: "Quy Nhon Arrival",
                    to: "Recommended Seaside Resort",
                    subInfo: {
                        en: "Seamless door-to-door drop off at your resort",
                        vi: "Xe đưa đón trả tận sảnh khu nghỉ dưỡng"
                    },
                    highlight: { en: "Late afternoon sunset welcome drink", vi: "Thưởng thức đồ uống đón hoàng hôn" }
                },
                {
                    type: "explore",
                    icon: "compass",
                    title: { en: "Quy Nhon Exploration", vi: "Trải nghiệm khám phá Quy Nhơn" },
                    from: "Ky Co - Eo Gio - Ghenh Rang",
                    to: "Binh Dinh Culture & Cham Heritage",
                    subInfo: {
                        en: "AI Curated: Crystal water beaches, Banh It Cham Tower & Fresh Seafood",
                        vi: "AI đề xuất: Biển Kỳ Co - Eo Gió, Tháp Bánh Ít & Ẩm thực hải sản"
                    },
                    highlight: { en: "Curated 3-day itinerary ready", vi: "Lịch trình 3 ngày được cá nhân hoá" }
                }
            ],
            aiSummary: {
                en: "Hello traveler from Belgium! Based on current connectivity, the most seamless journey from Brussels is a flight into Da Nang International Airport, followed by a scenic 5-hour coastal limousine transfer down to Quy Nhon. This route combines international flight convenience with breathtaking Central Vietnam coastal landscapes.",
                vi: "Xin chào du khách từ Bỉ! Theo phân tích lộ trình tối ưu, hành trình lý tưởng nhất từ Brussels là bay đến Sân bay Quốc tế Đà Nẵng, sau đó di chuyển bằng xe limousine ven biển khoảng 5 tiếng để về Quy Nhơn. Tuyến đường này vừa thuận tiện đường bay vừa giúp bạn ngắm trọn dải bờ biển miền Trung tuyệt đẹp."
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
        route: {
            transitHub: {
                city: "Ho Chi Minh City",
                name: { en: "Tan Son Nhat International Airport", vi: "Sân bay Quốc tế Tân Sơn Nhất" },
                code: "SGN",
                lat: 10.8231,
                lng: 106.6297
            },
            steps: [
                {
                    type: "flight",
                    icon: "plane-departure",
                    title: { en: "Long-haul Flight", vi: "Chuyến bay thẳng / 1 điểm dừng" },
                    from: "Paris (CDG)",
                    to: "Ho Chi Minh City (SGN)",
                    subInfo: {
                        en: "Direct flight or 1 stop • Est. 12h 45m • Mock Flight #VN-10",
                        vi: "Bay thẳng hoặc 1 điểm dừng • Dự kiến 12h 45m • Chuyến bay mô phỏng #VN-10"
                    },
                    highlight: { en: "Smooth transfer connection at SGN", vi: "Nối chuyến thuận tiện tại SGN" }
                },
                {
                    type: "domestic-flight",
                    icon: "plane",
                    title: { en: "Domestic Connecting Flight", vi: "Chuyến bay nội địa nối chuyến" },
                    from: "Ho Chi Minh City (SGN)",
                    to: "Phu Cat Airport, Quy Nhon (UIH)",
                    subInfo: {
                        en: "Fast 1h 10m domestic flight • 4 daily scheduled mock flights",
                        vi: "Chuyến bay nhanh 1h 10m • 4 chuyến mô phỏng mỗi ngày"
                    },
                    highlight: { en: "Only 45 minutes taxi to downtown Quy Nhon", vi: "Chỉ 45 phút taxi về trung tâm thành phố" }
                },
                {
                    type: "hotel",
                    icon: "hotel",
                    title: { en: "Check-in Beach Villa", vi: "Nhận phòng biệt thự biển" },
                    from: "Phu Cat (UIH)",
                    to: "Luxury Villa in Quy Nhon",
                    subInfo: {
                        en: "Private airport pickup arranged",
                        vi: "Đưa đón sân bay chu đáo"
                    },
                    highlight: { en: "Ocean view private pool suite", vi: "Hạng phòng hồ bơi view trực diện biển" }
                },
                {
                    type: "explore",
                    icon: "compass",
                    title: { en: "Quy Nhon Exploration", vi: "Khám phá Quy Nhơn" },
                    from: "Ghenh Rang Tien Sa & Twin Towers",
                    to: "Local Gastronomy Tour",
                    subInfo: {
                        en: "Discover Han Mac Tu memorial and traditional seafood villages",
                        vi: "Viếng mộ Hàn Mặc Tử và thưởng thức ẩm thực đầm Thị Nại"
                    },
                    highlight: { en: "Authentic Central Vietnamese flavors", vi: "Hương vị ẩm thực miền Trung đích thực" }
                }
            ],
            aiSummary: {
                en: "Bonjour! From Paris, AI recommends flying directly into Ho Chi Minh City, then taking a quick 1-hour domestic connection straight to Phu Cat Airport in Quy Nhon. Total travel time is under 16 hours, making it the fastest gateway to Quy Nhon's serene bays.",
                vi: "Xin chào du khách từ Pháp! Từ Paris, AI đề xuất bay đến TP. Hồ Chí Minh rồi nối chuyến bay nội địa 1 giờ thẳng đến Sân bay Phù Cát (Quy Nhơn). Tổng thời gian tối ưu chưa đầy 16 giờ, giúp bạn đặt chân đến vùng biển thanh bình nhanh nhất."
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
        route: {
            transitHub: {
                city: "Hanoi",
                name: { en: "Noi Bai International Airport", vi: "Sân bay Quốc tế Nội Bài" },
                code: "HAN",
                lat: 21.2212,
                lng: 105.8072
            },
            steps: [
                {
                    type: "flight",
                    icon: "plane-departure",
                    title: { en: "Intercontinental Flight", vi: "Chuyến bay liên lục địa" },
                    from: "Frankfurt (FRA)",
                    to: "Hanoi (HAN)",
                    subInfo: {
                        en: "Direct flight • Est. 11h 20m • Mock Flight #VN-36",
                        vi: "Bay thẳng • Dự kiến 11h 20m • Chuyến bay mô phỏng #VN-36"
                    },
                    highlight: { en: "Overnight flight for optimal rest", vi: "Bay đêm giúp bạn nghỉ ngơi trọn vẹn" }
                },
                {
                    type: "domestic-flight",
                    icon: "plane",
                    title: { en: "Connecting Flight to Quy Nhon", vi: "Bay nối chuyến đến Quy Nhơn" },
                    from: "Hanoi (HAN)",
                    to: "Phu Cat Airport (UIH)",
                    subInfo: {
                        en: "Direct flight • 1h 35m • Domestic Terminal Transfer",
                        vi: "Bay thẳng • 1h 35m • Chuyển tiếp ga nội địa Nội Bài"
                    },
                    highlight: { en: "Scenic aerial view of Quy Nhon peninsula", vi: "Ngắm toàn cảnh bán đảo Phương Mai từ trên cao" }
                },
                {
                    type: "hotel",
                    icon: "hotel",
                    title: { en: "Resort Arrival", vi: "Đến khu nghỉ dưỡng" },
                    from: "Phu Cat (UIH)",
                    to: "Resort / Eco-retreat",
                    subInfo: {
                        en: "Complimentary resort shuttle",
                        vi: "Xe buýt cao cấp của resort đón tận nơi"
                    },
                    highlight: { en: "Tropical garden & private beach", vi: "Khu vườn nhiệt đới và bãi biển riêng" }
                },
                {
                    type: "explore",
                    icon: "compass",
                    title: { en: "Cultural & Nature Discovery", vi: "Khám phá Văn hóa & Thiên nhiên" },
                    from: "Eo Gio Pass",
                    to: "Hon Kho Island Coral Snorkeling",
                    subInfo: {
                        en: "Walk along the most picturesque windy strait in Vietnam",
                        vi: "Đi dạo trên cung đường đèo lộng gió đẹp nhất Việt Nam"
                    },
                    highlight: { en: "Pristine coral reef diving", vi: "Lặn ngắm rạn san hô hoang sơ Hòn Khô" }
                }
            ],
            aiSummary: {
                en: "Guten Tag! From Frankfurt, the most comfortable route is a direct flight to Hanoi Noi Bai, followed by a swift 1 hour and 35-minute hop directly into Phu Cat Airport, Quy Nhon. Our AI has matched you with tranquil resorts and scenic coral bays.",
                vi: "Xin chào du khách từ Đức! Từ Frankfurt, lộ trình thuận tiện nhất là bay thẳng đến Hà Nội, sau đó nối chuyến chỉ 1 tiếng 35 phút đến Sân bay Phù Cát (Quy Nhơn). Trợ lý AI đã chuẩn bị sẵn resort thư giãn và các điểm lặn san hô kỳ thú cho bạn."
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
        route: {
            transitHub: {
                city: "Ho Chi Minh City",
                name: { en: "Tan Son Nhat International Airport", vi: "Sân bay Quốc tế Tân Sơn Nhất" },
                code: "SGN",
                lat: 10.8231,
                lng: 106.6297
            },
            steps: [
                {
                    type: "flight",
                    icon: "plane-departure",
                    title: { en: "Trans-Pacific Flight", vi: "Chuyến bay xuyên Thái Bình Dương" },
                    from: "San Francisco (SFO)",
                    to: "Ho Chi Minh City (SGN)",
                    subInfo: {
                        en: "Direct or 1 stop (Tokyo/Seoul) • ~15h 30m • Mock Flight #VN-98",
                        vi: "Bay thẳng hoặc 1 điểm dừng • ~15h 30m • Chuyến bay mô phỏng #VN-98"
                    },
                    highlight: { en: "Seamless transit in Vietnam's largest hub", vi: "Nối chuyến dễ dàng tại trung tâm kinh tế Sài Gòn" }
                },
                {
                    type: "domestic-flight",
                    icon: "plane",
                    title: { en: "Domestic Connector", vi: "Chuyến bay nối tiếp đến Quy Nhơn" },
                    from: "Ho Chi Minh City (SGN)",
                    to: "Phu Cat Airport (UIH)",
                    subInfo: {
                        en: "1h 10m flight • Multiple departures daily",
                        vi: "Bay 1h 10m • Nhiều khung giờ khởi hành trong ngày"
                    },
                    highlight: { en: "Quick baggage transfer", vi: "Chuyển hành lý thuận tiện" }
                },
                {
                    type: "hotel",
                    icon: "hotel",
                    title: { en: "Secluded Villa Check-in", vi: "Nhận phòng biệt thự biệt lập" },
                    from: "Phu Cat (UIH)",
                    to: "Coastal Sanctuary",
                    subInfo: {
                        en: "Chauffeured private transport",
                        vi: "Tài xế riêng đón chào đón"
                    },
                    highlight: { en: "Wellness spa treatment included", vi: "Gói spa phục hồi sức khỏe sau chuyến bay dài" }
                },
                {
                    type: "explore",
                    icon: "compass",
                    title: { en: "Quy Nhon Exploration", vi: "Khám phá Quy Nhơn" },
                    from: "Phuong Mai Sand Dunes",
                    to: "Trung Luong Picnic Beach",
                    subInfo: {
                        en: "Sandboarding, secluded turquoise coves and peaceful sunsets",
                        vi: "Trượt cát đồi Phương Mai, cắm trại bãi biển Trung Lương"
                    },
                    highlight: { en: "Unique blend of desert dunes & azure sea", vi: "Sự kết hợp độc đáo giữa đồi cát và biển xanh" }
                }
            ],
            aiSummary: {
                en: "Welcome! Traveling from the US West Coast, our AI maps out a flight into Ho Chi Minh City, followed by an easy 1-hour shuttle flight to Phu Cat Airport, Quy Nhon. We have factored in rest and jet lag recovery with serene oceanfront villas.",
                vi: "Chào mừng quý khách từ Hoa Kỳ! Từ bờ Tây nước Mỹ, AI đã định vị lộ trình bay đến TP. Hồ Chí Minh rồi nối chuyến ngắn 1 giờ đến Quy Nhơn. Lịch trình được thiết kế êm ái giúp bạn phục hồi năng lượng và tận hưởng trọn vẹn biển xanh."
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
        route: {
            transitHub: {
                city: "Ho Chi Minh City",
                name: { en: "Tan Son Nhat International Airport", vi: "Sân bay Quốc tế Tân Sơn Nhất" },
                code: "SGN",
                lat: 10.8231,
                lng: 106.6297
            },
            steps: [
                {
                    type: "flight",
                    icon: "plane-departure",
                    title: { en: "Direct Flight", vi: "Chuyến bay thẳng" },
                    from: "Sydney (SYD)",
                    to: "Ho Chi Minh City (SGN)",
                    subInfo: {
                        en: "Direct flight • 8h 45m • Mock Flight #VN-772",
                        vi: "Bay thẳng • 8h 45m • Chuyến bay mô phỏng #VN-772"
                    },
                    highlight: { en: "Comfortable daytime flight", vi: "Chuyến bay ngày êm ái" }
                },
                {
                    type: "domestic-flight",
                    icon: "plane",
                    title: { en: "Domestic Hop", vi: "Chuyến bay nội địa" },
                    from: "Ho Chi Minh City (SGN)",
                    to: "Phu Cat Airport (UIH)",
                    subInfo: {
                        en: "1h 10m flight • Fast transfer",
                        vi: "Bay 1h 10m • Nối chuyến nhanh chóng"
                    },
                    highlight: { en: "Arrival right before sunset", vi: "Hạ cánh ngay trước giờ hoàng hôn tuyệt đẹp" }
                },
                {
                    type: "hotel",
                    icon: "hotel",
                    title: { en: "Boutique Beachfront Stay", vi: "Nghỉ dưỡng boutique sát biển" },
                    from: "Phu Cat (UIH)",
                    to: "Quy Nhon Beach Boutique",
                    subInfo: {
                        en: "Direct resort shuttle service",
                        vi: "Dịch vụ đưa đón trực tiếp về resort"
                    },
                    highlight: { en: "Private balcony facing the East Sea", vi: "Ban công riêng hướng thẳng biển Đông" }
                },
                {
                    type: "explore",
                    icon: "compass",
                    title: { en: "Marine Discovery", vi: "Khám phá đại dương" },
                    from: "Cu Lao Xanh (Green Island)",
                    to: "Pristine Lighthouse & Reefs",
                    subInfo: {
                        en: "Speedboat excursion to century-old lighthouse and clear diving spots",
                        vi: "Đi cano ra đảo Cù Lao Xanh, thăm ngọn hải đăng trăm tuổi"
                    },
                    highlight: { en: "Unspoiled natural island paradise", vi: "Thiên đường đảo ngọc chưa bị du lịch hóa" }
                }
            ],
            aiSummary: {
                en: "G'day! From Sydney, fly directly into Ho Chi Minh City (around 8.5 hours), then take a 1-hour connector to Phu Cat Airport, Quy Nhon. Total travel is smooth and gets you to the tranquil beaches of Quy Nhon on the very same day.",
                vi: "Xin chào từ nước Úc! Từ Sydney, bạn bay thẳng đến TP. Hồ Chí Minh (khoảng 8.5 tiếng), sau đó nối chuyến 1 tiếng đến Quy Nhơn. Lộ trình liền mạch giúp bạn có mặt tại bờ biển Quy Nhơn ngay trong ngày."
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
        route: {
            transitHub: {
                city: "Da Nang",
                name: { en: "Da Nang International Airport", vi: "Sân bay Quốc tế Đà Nẵng" },
                code: "DAD",
                lat: 16.0544,
                lng: 108.2022
            },
            steps: [
                {
                    type: "flight",
                    icon: "plane-departure",
                    title: { en: "Direct Flight to Central Vietnam", vi: "Chuyến bay thẳng đến miền Trung" },
                    from: "Tokyo (NRT)",
                    to: "Da Nang (DAD)",
                    subInfo: {
                        en: "Direct flight • 5h 30m • Mock Flight #VN-319",
                        vi: "Bay thẳng • 5h 30m • Chuyến bay mô phỏng #VN-319"
                    },
                    highlight: { en: "Shortest flight connecting to Central Vietnam", vi: "Chặng bay ngắn nhất kết nối trực tiếp miền Trung" }
                },
                {
                    type: "transfer",
                    icon: "train",
                    title: { en: "Scenic Heritage Railway / Limousine", vi: "Tàu hỏa ngắm cảnh / Limousine cao cấp" },
                    from: "Da Nang",
                    to: "Dieu Tri / Quy Nhon",
                    subInfo: {
                        en: "Scenic coastal train or limousine • ~4h 30m • The Vietage luxury rail option",
                        vi: "Tàu hỏa ven biển hoặc limousine • ~4h 30m • Có tùy chọn toa tàu hạng sang The Vietage"
                    },
                    highlight: { en: "Mesmerizing countryside & ocean panorama", vi: "Ngắm trọn đồng quê và biển xanh thơ mộng" }
                },
                {
                    type: "hotel",
                    icon: "hotel",
                    title: { en: "Culinary & Wellness Resort", vi: "Khu nghỉ dưỡng Ẩm thực & Spa" },
                    from: "Quy Nhon Station",
                    to: "Luxury Sanctuary",
                    subInfo: {
                        en: "Concierge greeting & transfer",
                        vi: "Nhân viên chào đón và chuyển hành lý"
                    },
                    highlight: { en: "Gourmet seafood & traditional herbal bath", vi: "Thưởng thức hải sản tươi và tắm thảo dược" }
                },
                {
                    type: "explore",
                    icon: "compass",
                    title: { en: "Champa Heritage & Peaceful Coves", vi: "Di sản Champa & Vịnh biển bình yên" },
                    from: "Banh It Towers & Queen's Beach",
                    to: "Zen Coastal Walk",
                    subInfo: {
                        en: "Thousand-year-old brick architecture overlooking rolling hills",
                        vi: "Chiêm ngưỡng tháp cổ ngàn năm trên đồi cao lộng gió"
                    },
                    highlight: { en: "Historical depth meets natural purity", vi: "Giao thoa giữa chiều sâu văn hóa và thiên nhiên" }
                }
            ],
            aiSummary: {
                en: "Konnichiwa! From Tokyo, AI suggests flying directly to Da Nang (just 5.5 hours), then taking the scenic heritage train or luxury limousine down to Quy Nhon. It's one of the most picturesque journeys in Southeast Asia.",
                vi: "Konnichiwa! Từ Tokyo, AI gợi ý bạn bay thẳng đến Đà Nẵng (chỉ 5.5 tiếng), sau đó trải nghiệm chuyến tàu ngắm cảnh hoặc limousine cao cấp vào Quy Nhơn. Đây là một trong những cung đường du lịch ven biển đẹp nhất Đông Nam Á."
            }
        }
    }
};

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

const MOCK_FUTURE_FEATURES = [
    {
        icon: "plane-circle-check",
        title: { en: "Real-time Flight Engine", vi: "Dữ liệu chuyến bay thời gian thực" },
        desc: {
            en: "Live API integration with global airline distribution systems for real-time fares and seat availability.",
            vi: "Tích hợp API trực tiếp với hệ thống hàng không toàn cầu để tra cứu giá vé và tình trạng chỗ theo thời gian thực."
        }
    },
    {
        icon: "route",
        title: { en: "Autonomous Multi-modal Routing", vi: "Tối ưu hóa đa phương thức thông minh" },
        desc: {
            en: "Deep reinforcement AI to balance cost, travel time, scenic value and carbon footprint for transfer legs.",
            vi: "Thuật toán AI tự động cân đối chi phí, thời gian di chuyển, cảnh quan và lượng phát thải cho từng chặng."
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
