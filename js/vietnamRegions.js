/**
 * Quy Nhon AI Travel Assistant - Vietnam Explorer Map content (EN / VI)
 * 34 provincial units after Resolution 202/2025/QH15.
 * Descriptions are short editorial summaries; highlights are well-known landmarks.
 */

window.VIETNAM_MAP_INFO = {
    regions: {
        nm:    { vi: "Trung du & miền núi phía Bắc", en: "Northern Highlands" },
        rr:    { vi: "Đồng bằng sông Hồng",          en: "Red River Delta" },
        btb:   { vi: "Bắc Trung Bộ",                 en: "North Central Coast" },
        ntb:   { vi: "Duyên hải Nam Trung Bộ",       en: "South Central Coast" },
        tn:    { vi: "Tây Nguyên",                   en: "Central Highlands" },
        dnb:   { vi: "Đông Nam Bộ",                  en: "Southeast" },
        dbscl: { vi: "Đồng bằng sông Cửu Long",      en: "Mekong Delta" }
    },

    provinces: {
        "ha-noi": {
            vi: "Thủ đô nghìn năm tuổi, nơi phố cổ Hà Nội, hồ Hoàn Kiếm và các di tích triều Lê - Nguyễn nằm ngay cạnh những quán cà phê hiện đại.",
            en: "A thousand-year capital where the Old Quarter, Hoan Kiem Lake and dynastic relics sit beside modern coffee shops.",
            highlights: [
                { vi: "Hồ Hoàn Kiếm & Phố cổ", en: "Hoan Kiem Lake & Old Quarter" },
                { vi: "Văn Miếu - Quốc Tử Giám", en: "Temple of Literature" },
                { vi: "Hoàng thành Thăng Long", en: "Thang Long Imperial Citadel" },
                { vi: "Hồ Tây & chùa Trấn Quốc", en: "West Lake & Tran Quoc Pagoda" }
            ]
        },
        "hai-phong": {
            vi: "Thành phố cảng lớn nhất miền Bắc, cửa ngõ ra quần đảo Cát Bà và vịnh Lan Hạ với gần 400 đảo đá vôi.",
            en: "The north's great port city and gateway to Cat Ba archipelago and Lan Ha Bay, a maze of nearly 400 limestone islands.",
            highlights: [
                { vi: "Quần đảo Cát Bà", en: "Cat Ba Archipelago" },
                { vi: "Vịnh Lan Hạ", en: "Lan Ha Bay" },
                { vi: "Bãi biển Đồ Sơn", en: "Do Son Beach" },
                { vi: "Chùa Côn Sơn - Kiếp Bạc", en: "Con Son - Kiep Bac" }
            ]
        },
        "quang-ninh": {
            vi: "Sở hữu vịnh Hạ Long - di sản thiên nhiên thế giới, cùng núi Yên Tử và hàng nghìn đảo đá vôi ven bờ.",
            en: "Home to Ha Long Bay, a World Heritage seascape of thousands of limestone karsts, plus the sacred Yen Tu mountain.",
            highlights: [
                { vi: "Vịnh Hạ Long", en: "Ha Long Bay" },
                { vi: "Bãi Cháy & Tuần Châu", en: "Bai Chay & Tuan Chau" },
                { vi: "Núi Yên Tử", en: "Yen Tu Mountain" },
                { vi: "Đảo Cô Tô", en: "Co To Island" }
            ]
        },
        "bac-ninh": {
            vi: "Cái nôi của dân ca quan họ và Phật giáo Việt Nam, với những ngôi chùa cổ và làng tranh dân gian Đông Hồ.",
            en: "The cradle of quan ho folk singing and Vietnamese Buddhism, with ancient pagodas and the Dong Ho folk print village.",
            highlights: [
                { vi: "Chùa Dâu", en: "Dau Pagoda" },
                { vi: "Đền Đô", en: "Do Temple" },
                { vi: "Chùa Bút Tháp", en: "But Thap Pagoda" },
                { vi: "Làng tranh Đông Hồ", en: "Dong Ho Print Village" }
            ]
        },
        "hung-yen": {
            vi: "Vùng đất Phố Hiến - thương cảng sầm uất một thời, nối xuống đồng bằng Thái Bình và bãi biển Cồn Vành.",
            en: "The old river port of Pho Hien, opening onto the Thai Binh plains and the tidal flats of Con Vanh beach.",
            highlights: [
                { vi: "Phố Hiến", en: "Pho Hien Old Town" },
                { vi: "Chùa Chuông", en: "Chuong Pagoda" },
                { vi: "Chùa Keo (Thái Bình)", en: "Keo Pagoda" },
                { vi: "Bãi biển Cồn Vành", en: "Con Vanh Beach" }
            ]
        },
        "ninh-binh": {
            vi: "Quần thể danh thắng Tràng An được UNESCO công nhận, núi đá vôi dựng giữa đồng lúa và những dòng sông nhỏ.",
            en: "The UNESCO-listed Trang An landscape, where limestone towers rise straight out of rice fields and narrow rivers.",
            highlights: [
                { vi: "Quần thể Tràng An", en: "Trang An Complex" },
                { vi: "Chùa Bái Đính", en: "Bai Dinh Pagoda" },
                { vi: "Tam Cốc - Bích Động", en: "Tam Coc - Bich Dong" },
                { vi: "Vườn quốc gia Cúc Phương", en: "Cuc Phuong National Park" }
            ]
        },
        "thanh-hoa": {
            vi: "Nơi có Thành nhà Hồ - di sản thế giới, bãi biển Sầm Sơn và vùng núi Pù Luông còn nguyên nét Thái - Mường.",
            en: "The Ho Citadel World Heritage site, the long sands of Sam Son and the Thai-Muong villages of Pu Luong.",
            highlights: [
                { vi: "Thành nhà Hồ", en: "Ho Citadel" },
                { vi: "Biển Sầm Sơn", en: "Sam Son Beach" },
                { vi: "Khu bảo tồn Pù Luông", en: "Pu Luong Nature Reserve" },
                { vi: "Suối cá Cẩm Lương", en: "Cam Luong Fish Stream" }
            ]
        },
        "nghe-an": {
            vi: "Quê hương Chủ tịch Hồ Chí Minh, với bãi biển Cửa Lò dài và vườn quốc gia Pù Mát ở phía tây.",
            en: "The birthplace of Ho Chi Minh, with the long Cua Lo beach and the forested Pu Mat national park inland.",
            highlights: [
                { vi: "Làng Sen Kim Liên", en: "Kim Lien Village" },
                { vi: "Biển Cửa Lò", en: "Cua Lo Beach" },
                { vi: "Vườn quốc gia Pù Mát", en: "Pu Mat National Park" },
                { vi: "Đền Cuông", en: "Cuong Temple" }
            ]
        },
        "ha-tinh": {
            vi: "Dải đất hẹp ven biển miền Trung, nổi tiếng với biển Thiên Cầm, chùa Hương Tích và ngã ba Đồng Lộc.",
            en: "A narrow coastal strip known for Thien Cam beach, Huong Tich pagoda and the historic Dong Loc junction.",
            highlights: [
                { vi: "Biển Thiên Cầm", en: "Thien Cam Beach" },
                { vi: "Chùa Hương Tích", en: "Huong Tich Pagoda" },
                { vi: "Hồ Kẻ Gỗ", en: "Ke Go Lake" },
                { vi: "Ngã ba Đồng Lộc", en: "Dong Loc Junction" }
            ]
        },
        "quang-tri": {
            vi: "Mảnh đất của vĩ tuyến 17 và di sản Phong Nha - Kẻ Bàng, nơi hang động đá vôi tạo nên hệ thống ngầm kỳ vĩ.",
            en: "The land of the 17th parallel and Phong Nha - Ke Bang, where limestone caves form one of the world's great underground systems.",
            highlights: [
                { vi: "Phong Nha - Kẻ Bàng", en: "Phong Nha - Ke Bang" },
                { vi: "Địa đạo Vịnh Mốc", en: "Vinh Moc Tunnels" },
                { vi: "Thành cổ Quảng Trị", en: "Quang Tri Citadel" },
                { vi: "Cầu Hiền Lương", en: "Hien Luong Bridge" }
            ]
        },
        "hue": {
            vi: "Cố đô của triều Nguyễn với Đại Nội, các lăng tẩm và sông Hương, được UNESCO vinh danh năm 1993.",
            en: "The Nguyen dynasty capital: the Imperial City, royal tombs and the Perfume River, UNESCO-listed since 1993.",
            highlights: [
                { vi: "Đại Nội Huế", en: "Hue Imperial City" },
                { vi: "Chùa Thiên Mụ", en: "Thien Mu Pagoda" },
                { vi: "Lăng Tự Đức", en: "Tu Duc Tomb" },
                { vi: "Bãi biển Lăng Cô", en: "Lang Co Beach" }
            ]
        },
        "da-nang": {
            vi: "Thành phố biển hiện đại nhất miền Trung, cửa ngõ đến phố cổ Hội An và thánh địa Mỹ Sơn.",
            en: "Central Vietnam's most modern beach city, the gateway to Hoi An's old town and the My Son sanctuary.",
            highlights: [
                { vi: "Cầu Rồng & sông Hàn", en: "Dragon Bridge" },
                { vi: "Bà Nà Hills", en: "Ba Na Hills" },
                { vi: "Bán đảo Sơn Trà", en: "Son Tra Peninsula" },
                { vi: "Phố cổ Hội An", en: "Hoi An Ancient Town" }
            ]
        },
        "quang-ngai": {
            vi: "Quê hương của đảo Lý Sơn giữa biển khơi, nối lên cao nguyên Kon Tum qua Măng Đen và núi Ngọc Linh.",
            en: "Home to Ly Son island, connected inland to the Kon Tum highlands through Mang Den and the Ngoc Linh range.",
            highlights: [
                { vi: "Đảo Lý Sơn", en: "Ly Son Island" },
                { vi: "Biển Mỹ Khê", en: "My Khe Beach" },
                { vi: "Măng Đen (Kon Tum)", en: "Mang Den" },
                { vi: "Ngã ba Đông Dương", en: "Indochina Junction" }
            ]
        },
        "gia-lai": {
            vi: "Nơi biển Quy Nhơn gặp cao nguyên Pleiku: tháp Chăm cổ, eo biển Kỳ Co và những đồi cà phê bạt ngàn.",
            en: "Where the Quy Nhon coast meets the Pleiku plateau: Cham towers, the Ky Co sea inlet and endless coffee hills.",
            highlights: [
                { vi: "Eo Gió - Kỳ Co", en: "Eo Gio - Ky Co" },
                { vi: "Tháp Bánh Ít", en: "Banh It Towers" },
                { vi: "Biển Hồ Pleiku", en: "Bien Ho Lake" },
                { vi: "Ghềnh Ráng - Mộ Hàn Mặc Tử", en: "Ghenh Rang" }
            ]
        },
        "dak-lak": {
            vi: "Thủ phủ cà phê Việt Nam, với hồ Lắk, thác Dray Nur và bờ biển Phú Yên ở phía đông.",
            en: "Vietnam's coffee capital, with Lak lake, the Dray Nur falls and the Phu Yen coast to the east.",
            highlights: [
                { vi: "Thác Dray Nur", en: "Dray Nur Waterfall" },
                { vi: "Hồ Lắk", en: "Lak Lake" },
                { vi: "Gành Đá Đĩa (Phú Yên)", en: "Ganh Da Dia" },
                { vi: "Mũi Điện - Bãi Môn", en: "Mui Dien" }
            ]
        },
        "khanh-hoa": {
            vi: "Vịnh Nha Trang - một trong những vịnh đẹp nhất thế giới, kéo dài xuống vịnh Vĩnh Hy của Ninh Thuận.",
            en: "Nha Trang Bay, one of the world's most beautiful, stretching south to Ninh Thuan's Vinh Hy bay.",
            highlights: [
                { vi: "Vịnh Nha Trang", en: "Nha Trang Bay" },
                { vi: "Vinpearl & Hòn Tre", en: "Vinpearl" },
                { vi: "Vịnh Vĩnh Hy", en: "Vinh Hy Bay" },
                { vi: "Bãi biển Ninh Chữ", en: "Ninh Chu Beach" }
            ]
        },
        "lam-dong": {
            vi: "Đà Lạt mát lạnh giữa cao nguyên, nối xuống Mũi Né của Bình Thuận và hồ Tà Đùng của Đắk Nông.",
            en: "Cool Da Lat on the plateau, running down to Mui Ne's dunes and the Ta Dung lake of Dak Nong.",
            highlights: [
                { vi: "Hồ Xuân Hương - Đà Lạt", en: "Xuan Huong Lake" },
                { vi: "Đồi chè Cầu Đất", en: "Cau Dat Tea Hill" },
                { vi: "Mũi Né - Bàu Trắng", en: "Mui Ne Dunes" },
                { vi: "Hồ Tà Đùng", en: "Ta Dung Lake" }
            ]
        },
        "tp-hcm": {
            vi: "Trung tâm kinh tế lớn nhất nước, nhịp sống đô thị sôi động cùng biển Vũng Tàu cách một giờ xe.",
            en: "The country's economic engine, an energetic metropolis an hour from the beaches of Vung Tau.",
            highlights: [
                { vi: "Dinh Độc Lập", en: "Independence Palace" },
                { vi: "Chợ Bến Thành", en: "Ben Thanh Market" },
                { vi: "Bưu điện Trung tâm", en: "Central Post Office" },
                { vi: "Bãi Sau Vũng Tàu", en: "Vung Tau Back Beach" }
            ]
        },
        "dong-nai": {
            vi: "Cửa ngõ công nghiệp phía đông Sài Gòn, vẫn giữ vườn quốc gia Cát Tiên và những thác nước lớn.",
            en: "The industrial gateway east of Saigon, still holding Cat Tien national park and a string of big waterfalls.",
            highlights: [
                { vi: "Vườn quốc gia Cát Tiên", en: "Cat Tien National Park" },
                { vi: "Thác Giang Điền", en: "Giang Dien Waterfall" },
                { vi: "Hồ Trị An", en: "Tri An Lake" },
                { vi: "Thác Số 7 (Bình Phước)", en: "Thac So 7" }
            ]
        },
        "tay-ninh": {
            vi: "Nơi có núi Bà Đen cao nhất Nam Bộ và Tòa thánh Cao Đài, nối dài xuống vùng tràm Long An.",
            en: "Ba Den mountain, the highest in the south, and the Cao Dai Holy See, running down to Long An's melaleuca wetlands.",
            highlights: [
                { vi: "Núi Bà Đen", en: "Ba Den Mountain" },
                { vi: "Tòa thánh Tây Ninh", en: "Cao Dai Temple" },
                { vi: "Hồ Dầu Tiếng", en: "Dau Tieng Lake" },
                { vi: "Khu bảo tồn Láng Sen", en: "Lang Sen Reserve" }
            ]
        },
        "can-tho": {
            vi: "Thủ phủ miền Tây, nổi tiếng với chợ nổi Cái Răng và những vườn trái cây ven sông Hậu.",
            en: "The delta's capital, famous for Cai Rang floating market and the fruit orchards along the Hau river.",
            highlights: [
                { vi: "Chợ nổi Cái Răng", en: "Cai Rang Floating Market" },
                { vi: "Bến Ninh Kiều", en: "Ninh Kieu Wharf" },
                { vi: "Chùa Dơi (Sóc Trăng)", en: "Bat Pagoda" },
                { vi: "Cù lao Tân Lộc", en: "Tan Loc Islet" }
            ]
        },
        "an-giang": {
            vi: "Vùng đất bảy núi và miếu Bà Chúa Xứ, nối ra biển qua Phú Quốc và quần đảo Nam Du.",
            en: "The land of seven mountains and the Ba Chua Xu shrine, reaching the sea at Phu Quoc and the Nam Du islands.",
            highlights: [
                { vi: "Miếu Bà Chúa Xứ", en: "Ba Chua Xu Temple" },
                { vi: "Phú Quốc", en: "Phu Quoc Island" },
                { vi: "Rừng tràm Trà Sư", en: "Tra Su Forest" },
                { vi: "Quần đảo Nam Du", en: "Nam Du Islands" }
            ]
        },
        "dong-thap": {
            vi: "Xứ sen Tháp Mười với vườn quốc gia Tràm Chim, nối lên cù lao và chợ nổi Cái Bè của Tiền Giang.",
            en: "The lotus fields of Thap Muoi and Tram Chim national park, linked to the islets and Cai Be floating market.",
            highlights: [
                { vi: "Vườn quốc gia Tràm Chim", en: "Tram Chim National Park" },
                { vi: "Đồng sen Tháp Mười", en: "Thap Muoi Lotus Fields" },
                { vi: "Cù lao Thới Sơn", en: "Thoi Son Islet" },
                { vi: "Chợ nổi Cái Bè", en: "Cai Be Floating Market" }
            ]
        },
        "vinh-long": {
            vi: "Miền cù lao giữa sông Tiền, nơi có xứ dừa Bến Tre và những ngôi chùa Khmer của Trà Vinh.",
            en: "The islets of the Tien river, with Ben Tre's coconut country and the Khmer pagodas of Tra Vinh.",
            highlights: [
                { vi: "Cù lao An Bình", en: "An Binh Islet" },
                { vi: "Xứ dừa Bến Tre", en: "Ben Tre Coconut Land" },
                { vi: "Chùa Âng (Trà Vinh)", en: "Ang Pagoda" },
                { vi: "Chợ nổi Trà Ôn", en: "Tra On Floating Market" }
            ]
        },
        "ca-mau": {
            vi: "Mũi cực nam của Tổ quốc, rừng ngập mặn U Minh Hạ và đất Bạc Liêu với nhà công tử nổi tiếng.",
            en: "The southernmost tip of the country, the U Minh Ha mangrove forest and Bac Lieu's famed prince's house.",
            highlights: [
                { vi: "Mũi Cà Mau", en: "Ca Mau Cape" },
                { vi: "Rừng U Minh Hạ", en: "U Minh Ha Forest" },
                { vi: "Nhà công tử Bạc Liêu", en: "Bac Lieu Prince House" },
                { vi: "Sân chim Bạc Liêu", en: "Bac Lieu Bird Sanctuary" }
            ]
        },
        "cao-bang": {
            vi: "Vùng núi đá vôi biên giới phía bắc, nơi thác Bản Giốc đổ xuống giữa hai nước.",
            en: "Limestone country on the northern border, where the Ban Gioc falls pour down the frontier.",
            highlights: [
                { vi: "Thác Bản Giốc", en: "Ban Gioc Waterfall" },
                { vi: "Hang Pác Bó", en: "Pac Bo Cave" },
                { vi: "Động Ngườm Ngao", en: "Nguom Ngao Cave" },
                { vi: "Núi Mắt Thần", en: "Mat Than Mountain" }
            ]
        },
        "dien-bien": {
            vi: "Chiến trường Điện Biên Phủ lịch sử, với cánh đồng Mường Thanh trải dài giữa bốn bề núi đá.",
            en: "The historic Dien Bien Phu battlefield, its Muong Thanh valley spread wide between mountain walls.",
            highlights: [
                { vi: "Đồi A1", en: "A1 Hill" },
                { vi: "Hầm Đờ Cát", en: "De Castries Bunker" },
                { vi: "Cánh đồng Mường Thanh", en: "Muong Thanh Valley" },
                { vi: "Cực Tây A Pa Chải", en: "A Pa Chai" }
            ]
        },
        "lai-chau": {
            vi: "Vùng núi cao biên giới với đèo Ô Quy Hồ, hồ Sìn Hồ và những bản làng của người H'Mông, Thái.",
            en: "High border country of the O Quy Ho pass, Sin Ho lake and H'Mong and Thai villages.",
            highlights: [
                { vi: "Đèo Ô Quy Hồ", en: "O Quy Ho Pass" },
                { vi: "Hồ Sìn Hồ", en: "Sin Ho Lake" },
                { vi: "Đỉnh Putaleng", en: "Putaleng Peak" },
                { vi: "Thác Tác Tình", en: "Tac Tinh Waterfall" }
            ]
        },
        "lang-son": {
            vi: "Cửa ngõ phía bắc với ải Chi Lăng, động Tam Thanh và đỉnh Mẫu Sơn lạnh quanh năm.",
            en: "The northern gateway of Chi Lang pass, Tam Thanh cave and the cool year-round Mau Son peak.",
            highlights: [
                { vi: "Động Tam Thanh", en: "Tam Thanh Cave" },
                { vi: "Núi Mẫu Sơn", en: "Mau Son Mountain" },
                { vi: "Ải Chi Lăng", en: "Chi Lang Pass" },
                { vi: "Chợ Đông Kinh", en: "Dong Kinh Market" }
            ]
        },
        "lao-cai": {
            vi: "Cửa khẩu sang Vân Nam, nơi Sa Pa và Fansipan - mái nhà Đông Dương - nằm giữa ruộng bậc thang.",
            en: "The Yunnan border gate, where Sapa and Fansipan, Indochina's roof, sit among terraced fields.",
            highlights: [
                { vi: "Sa Pa", en: "Sapa" },
                { vi: "Đỉnh Fansipan", en: "Fansipan Peak" },
                { vi: "Ruộng bậc thang Mù Cang Chải", en: "Mu Cang Chai Terraces" },
                { vi: "Y Tý", en: "Y Ty" }
            ]
        },
        "son-la": {
            vi: "Cao nguyên Mộc Châu xanh mướt, đèo Pha Đin và những bản Thái ven sông Đà.",
            en: "The green Moc Chau plateau, the Pha Din pass and Thai villages along the Da river.",
            highlights: [
                { vi: "Cao nguyên Mộc Châu", en: "Moc Chau Plateau" },
                { vi: "Đèo Pha Đin", en: "Pha Din Pass" },
                { vi: "Tà Xùa", en: "Ta Xua" },
                { vi: "Thủy điện Sơn La", en: "Son La Dam" }
            ]
        },
        "phu-tho": {
            vi: "Đất Tổ Hùng Vương, nối lên Mai Châu của Hòa Bình và Tam Đảo của Vĩnh Phúc.",
            en: "The ancestral land of the Hung Kings, linked to Mai Chau and the hill station of Tam Dao.",
            highlights: [
                { vi: "Đền Hùng", en: "Hung Kings Temple" },
                { vi: "Mai Châu (Hòa Bình)", en: "Mai Chau" },
                { vi: "Tam Đảo (Vĩnh Phúc)", en: "Tam Dao" },
                { vi: "Đồi chè Long Cốc", en: "Long Coc Tea Hill" }
            ]
        },
        "thai-nguyen": {
            vi: "Vùng chè lớn nhất miền Bắc, với hồ Ba Bể của Bắc Kạn và căn cứ địa ATK Định Hóa.",
            en: "The north's great tea country, with Ba Be lake and the Dinh Hoa wartime base.",
            highlights: [
                { vi: "Hồ Ba Bể (Bắc Kạn)", en: "Ba Be Lake" },
                { vi: "ATK Định Hóa", en: "Dinh Hoa Base" },
                { vi: "Đồi chè Tân Cương", en: "Tan Cuong Tea Hill" },
                { vi: "Động Puông", en: "Puong Cave" }
            ]
        },
        "tuyen-quang": {
            vi: "Thượng nguồn sông Gâm với hồ Na Hang, nối lên cao nguyên đá Đồng Văn của Hà Giang.",
            en: "The upper Gam river and Na Hang lake, rising to Ha Giang's Dong Van karst plateau.",
            highlights: [
                { vi: "Cao nguyên đá Đồng Văn", en: "Dong Van Karst Plateau" },
                { vi: "Đèo Mã Pí Lèng", en: "Ma Pi Leng Pass" },
                { vi: "Hồ Na Hang", en: "Na Hang Lake" },
                { vi: "Lâm Bình", en: "Lam Binh" }
            ]
        }
    }
};
