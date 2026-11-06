/**
 * Quy Nhon AI Travel Assistant - World country content for the 3D globe.
 * 60 điểm đến trọng điểm có nội dung biên tập đầy đủ; các nước còn lại dùng
 * dữ liệu tự động (thủ đô, dân số, tiền tệ, ngôn ngữ) + mô tả ngắn.
 *
 * Quy ước: một chuỗi dùng chung cho cả hai ngôn ngữ; {vi, en} khi khác nhau.
 */

window.WORLD_INFO = {
    regions: {
        asia:      { vi: "Châu Á",          en: "Asia" },
        europe:    { vi: "Châu Âu",         en: "Europe" },
        africa:    { vi: "Châu Phi",        en: "Africa" },
        namerica:  { vi: "Bắc Mỹ",          en: "North America" },
        samerica:  { vi: "Nam Mỹ",          en: "South America" },
        oceania:   { vi: "Châu Đại Dương",  en: "Oceania" },
        antarctica:{ vi: "Nam Cực",         en: "Antarctica" }
    },

    countries: {
        /* ---------------------------- Đông Nam Á ---------------------------- */
        VNM: {
            cap: { vi: "Hà Nội", en: "Hanoi" },
            cur: { vi: "Đồng (VND)", en: "Dong (VND)" },
            lang: { vi: "Tiếng Việt", en: "Vietnamese" },
            tz: "UTC+7",
            desc: {
                vi: "Dải đất hình chữ S bên Biển Đông, nơi Quy Nhơn - Bình Định mở ra những bãi biển hoang sơ và tháp Chăm nghìn năm tuổi.",
                en: "The S-shaped country on the East Sea, where Quy Nhon and Binh Dinh open onto empty beaches and thousand-year-old Cham towers."
            },
            hl: [
                { vi: "Vịnh Hạ Long", en: "Ha Long Bay" },
                { vi: "Phố cổ Hội An", en: "Hoi An Ancient Town" },
                { vi: "Quy Nhơn - Kỳ Co", en: "Quy Nhon - Ky Co" },
                { vi: "Ruộng bậc thang Sa Pa", en: "Sapa Rice Terraces" }
            ]
        },
        THA: {
            cap: { vi: "Băng Cốc", en: "Bangkok" },
            cur: { vi: "Baht (THB)", en: "Baht (THB)" },
            lang: { vi: "Tiếng Thái", en: "Thai" },
            tz: "UTC+7",
            desc: {
                vi: "Xứ sở chùa vàng, đảo nhiệt đới và ẩm thực đường phố được cả thế giới yêu mến.",
                en: "A land of golden temples, tropical islands and street food the whole world has adopted."
            },
            hl: [
                { vi: "Bangkok & Chùa Vàng", en: "Bangkok & Grand Palace" },
                "Chiang Mai",
                { vi: "Phuket & Vịnh Phang Nga", en: "Phuket & Phang Nga Bay" },
                "Ayutthaya"
            ]
        },
        LAO: {
            cap: { vi: "Viêng Chăn", en: "Vientiane" },
            cur: { vi: "Kip (LAK)", en: "Kip (LAK)" },
            lang: { vi: "Tiếng Lào", en: "Lao" },
            tz: "UTC+7",
            desc: {
                vi: "Đất nước triệu voi, thanh bình với những ngôi chùa vàng bên sông Mekong.",
                en: "The land of a million elephants: quiet golden temples along the Mekong and mountains few travellers reach."
            },
            hl: [
                { vi: "Luang Prabang", en: "Luang Prabang" },
                { vi: "Cánh đồng Chum", en: "Plain of Jars" },
                { vi: "Vang Vieng", en: "Vang Vieng" },
                { vi: "Si Phan Don", en: "Si Phan Don" }
            ]
        },
        KHM: {
            cap: { vi: "Phnôm Pênh", en: "Phnom Penh" },
            cur: { vi: "Riel (KHR)", en: "Riel (KHR)" },
            lang: { vi: "Tiếng Khmer", en: "Khmer" },
            tz: "UTC+7",
            desc: {
                vi: "Đền Angkor hùng vĩ giữa rừng, cùng những bãi biển yên bình ở Sihanoukville.",
                en: "Angkor's vast temple complex in the jungle, and quiet beaches down at Sihanoukville."
            },
            hl: [
                "Angkor Wat",
                { vi: "Bayon & Ta Prohm", en: "Bayon & Ta Prohm" },
                { vi: "Hoàng cung Phnom Penh", en: "Royal Palace" },
                { vi: "Đảo Koh Rong", en: "Koh Rong" }
            ]
        },
        MMR: {
            cap: { vi: "Naypyidaw", en: "Naypyidaw" },
            cur: { vi: "Kyat (MMK)", en: "Kyat (MMK)" },
            lang: { vi: "Tiếng Miến", en: "Burmese" },
            tz: "UTC+6:30",
            desc: {
                vi: "Vùng đất của hàng nghìn ngôi chùa, thuyền độc mộc và những cánh đồng lúa bên hồ Inle.",
                en: "Thousands of pagodas, leg-rowing fishermen and floating gardens on Inle Lake."
            },
            hl: [
                { vi: "Chùa Shwedagon", en: "Shwedagon Pagoda" },
                "Bagan",
                { vi: "Hồ Inle", en: "Inle Lake" },
                "Mandalay"
            ]
        },
        MYS: {
            cap: { vi: "Kuala Lumpur", en: "Kuala Lumpur" },
            cur: { vi: "Ringgit (MYR)", en: "Ringgit (MYR)" },
            lang: { vi: "Tiếng Mã Lai", en: "Malay" },
            tz: "UTC+8",
            desc: {
                vi: "Giao thoa Mã - Trung - Ấn với tháp đôi, rừng nhiệt đới Borneo và đảo san hô.",
                en: "Malay, Chinese and Indian strands woven together, from the Petronas Towers to Borneo's rainforest."
            },
            hl: [
                { vi: "Tháp đôi Petronas", en: "Petronas Towers" },
                "Langkawi",
                "Malacca",
                { vi: "Borneo & Sipadan", en: "Borneo & Sipadan" }
            ]
        },
        SGP: {
            cap: { vi: "Singapore", en: "Singapore" },
            cur: { vi: "Đô la Singapore (SGD)", en: "Singapore dollar (SGD)" },
            lang: { vi: "Tiếng Anh", en: "English" },
            tz: "UTC+8",
            desc: {
                vi: "Thành phố-quốc đảo sạch sẽ, nơi vườn cây thẳng đứng mọc giữa các tòa nhà tài chính.",
                en: "A city-state where vertical gardens grow between the bank towers, and hawker centres cost less than a coffee."
            },
            hl: [
                { vi: "Gardens by the Bay", en: "Gardens by the Bay" },
                { vi: "Marina Bay Sands", en: "Marina Bay Sands" },
                "Sentosa",
                { vi: "Chinatown & Little India", en: "Chinatown & Little India" }
            ]
        },
        IDN: {
            cap: { vi: "Jakarta", en: "Jakarta" },
            cur: { vi: "Rupiah (IDR)", en: "Rupiah (IDR)" },
            lang: { vi: "Tiếng Indonesia", en: "Indonesian" },
            tz: "UTC+7",
            desc: {
                vi: "Quốc đảo 17.000 hòn đảo, từ Bali linh thiêng đến Komodo và những ngọn núi lửa đang thức.",
                en: "Seventeen thousand islands, from spiritual Bali to Komodo dragons and volcanoes that still smoke."
            },
            hl: [
                "Bali",
                "Borobudur",
                "Komodo",
                "Yogyakarta"
            ]
        },
        PHL: {
            cap: { vi: "Manila", en: "Manila" },
            cur: { vi: "Peso (PHP)", en: "Peso (PHP)" },
            lang: { vi: "Tiếng Filipino", en: "Filipino" },
            tz: "UTC+8",
            desc: {
                vi: "7.600 hòn đảo với vịnh đá vôi, bãi cát trắng và những ruộng bậc thang trên núi.",
                en: "7,600 islands of limestone lagoons, white sandbars and rice terraces cut into the mountains."
            },
            hl: [
                { vi: "El Nido, Palawan", en: "El Nido, Palawan" },
                "Boracay",
                { vi: "Ruộng bậc thang Banaue", en: "Banaue Rice Terraces" },
                { vi: "Đồi Sô-cô-la", en: "Chocolate Hills" }
            ]
        },
        BRN: {
            cap: { vi: "Bandar Seri Begawan", en: "Bandar Seri Begawan" },
            cur: { vi: "Đô la Brunei (BND)", en: "Brunei dollar (BND)" },
            lang: { vi: "Tiếng Mã Lai", en: "Malay" },
            tz: "UTC+8",
            desc: {
                vi: "Vương quốc Hồi giáo nhỏ bé trên đảo Borneo, nổi tiếng với những mái vòm vàng và rừng nguyên sinh.",
                en: "A small Islamic sultanate on Borneo, known for golden domes and primary rainforest."
            },
            hl: [
                { vi: "Nhà thờ Omar Ali Saifuddien", en: "Omar Ali Saifuddien Mosque" },
                "Kampong Ayer",
                { vi: "Rừng Ulu Temburong", en: "Ulu Temburong Forest" }
            ]
        },
        TLS: {
            cap: { vi: "Dili", en: "Dili" },
            cur: { vi: "Đô la Mỹ (USD)", en: "US dollar (USD)" },
            lang: { vi: "Tiếng Tetum", en: "Tetum" },
            tz: "UTC+9",
            desc: {
                vi: "Quốc gia trẻ nhất Đông Nam Á, với rạn san hô Atauro và những ngọn núi chưa đặt chân tới.",
                en: "Southeast Asia's youngest nation, with the Atauro reef and mountains almost no one has walked."
            },
            hl: [
                { vi: "Đảo Atauro", en: "Atauro Island" },
                { vi: "Núi Ramelau", en: "Mount Ramelau" },
                { vi: "Đảo Jaco", en: "Jaco Island" }
            ]
        },

        /* ------------------------------ Đông Á ------------------------------ */
        CHN: {
            cap: { vi: "Bắc Kinh", en: "Beijing" },
            cur: { vi: "Nhân dân tệ (CNY)", en: "Renminbi (CNY)" },
            lang: { vi: "Tiếng Trung", en: "Chinese" },
            tz: "UTC+8",
            desc: {
                vi: "Từ Tử Cấm Thành đến Vạn Lý Trường Thành, một nền văn minh bốn nghìn năm trải dài trên lục địa rộng lớn.",
                en: "From the Forbidden City to the Great Wall, four thousand years of civilisation spread across a continent."
            },
            hl: [
                { vi: "Vạn Lý Trường Thành", en: "Great Wall" },
                { vi: "Tử Cấm Thành", en: "Forbidden City" },
                { vi: "Đội quân đất nung", en: "Terracotta Army" },
                { vi: "Trương Gia Giới", en: "Zhangjiajie" }
            ]
        },
        JPN: {
            cap: { vi: "Tokyo", en: "Tokyo" },
            cur: { vi: "Yên (JPY)", en: "Yen (JPY)" },
            lang: { vi: "Tiếng Nhật", en: "Japanese" },
            tz: "UTC+9",
            desc: {
                vi: "Đất nước của đền Thần đạo, tàu cao tốc và hoa anh đào, nơi truyền thống và tương lai nằm cạnh nhau.",
                en: "Shinto shrines, bullet trains and cherry blossom, where tradition and the future share a street."
            },
            hl: [
                { vi: "Núi Phú Sĩ", en: "Mount Fuji" },
                "Kyoto",
                "Tokyo",
                "Nara"
            ]
        },
        KOR: {
            cap: { vi: "Seoul", en: "Seoul" },
            cur: { vi: "Won (KRW)", en: "Won (KRW)" },
            lang: { vi: "Tiếng Hàn", en: "Korean" },
            tz: "UTC+9",
            desc: {
                vi: "Bán đảo với cung điện triều Joseon, ẩm thực lên men và văn hóa đại chúng lan khắp châu Á.",
                en: "Joseon palaces, fermented food and a pop culture that has travelled further than the country itself."
            },
            hl: [
                { vi: "Cung Gyeongbokgung", en: "Gyeongbokgung Palace" },
                { vi: "Đảo Jeju", en: "Jeju Island" },
                "Busan",
                { vi: "Làng Bukchon", en: "Bukchon Hanok Village" }
            ]
        },
        MNG: {
            cap: { vi: "Ulaanbaatar", en: "Ulaanbaatar" },
            cur: { vi: "Tugrik (MNT)", en: "Tugrik (MNT)" },
            lang: { vi: "Tiếng Mông Cổ", en: "Mongolian" },
            tz: "UTC+8",
            desc: {
                vi: "Thảo nguyên vô tận, sa mạc Gobi và những căn lều ger của dân du mục.",
                en: "Open steppe, the Gobi desert and the ger tents of families still moving with the seasons."
            },
            hl: [
                { vi: "Sa mạc Gobi", en: "Gobi Desert" },
                { vi: "Hồ Khuvsgul", en: "Lake Khuvsgul" },
                { vi: "Tu viện Erdene Zuu", en: "Erdene Zuu Monastery" }
            ]
        },

        /* ------------------------------ Nam Á ------------------------------- */
        IND: {
            cap: { vi: "New Delhi", en: "New Delhi" },
            cur: { vi: "Rupee (INR)", en: "Rupee (INR)" },
            lang: { vi: "Tiếng Hindi", en: "Hindi" },
            tz: "UTC+5:30",
            desc: {
                vi: "Tiểu lục địa của Taj Mahal, sông Hằng và hàng trăm ngôn ngữ, ẩm thực và lễ hội.",
                en: "A subcontinent of the Taj Mahal, the Ganges and hundreds of languages, kitchens and festivals."
            },
            hl: [
                "Taj Mahal",
                "Jaipur",
                "Kerala",
                "Varanasi"
            ]
        },
        LKA: {
            cap: { vi: "Colombo", en: "Colombo" },
            cur: { vi: "Rupee (LKR)", en: "Rupee (LKR)" },
            lang: { vi: "Tiếng Sinhala", en: "Sinhala" },
            tz: "UTC+5:30",
            desc: {
                vi: "Hòn đảo trà và voi, với pháo đài trên đá Sigiriya và những chuyến tàu ven biển.",
                en: "An island of tea and elephants, with a fortress on a rock at Sigiriya and trains that run along the sea."
            },
            hl: [
                "Sigiriya",
                { vi: "Kandy & Đền Răng Phật", en: "Kandy & Temple of the Tooth" },
                "Ella",
                "Galle"
            ]
        },
        NPL: {
            cap: { vi: "Kathmandu", en: "Kathmandu" },
            cur: { vi: "Rupee (NPR)", en: "Rupee (NPR)" },
            lang: { vi: "Tiếng Nepal", en: "Nepali" },
            tz: "UTC+5:45",
            desc: {
                vi: "Mái nhà thế giới, nơi Everest, Pokhara và những ngôi đền Himalaya thu hút dân trekking khắp nơi.",
                en: "The roof of the world: Everest, Pokhara and Himalayan temples that pull trekkers from everywhere."
            },
            hl: [
                { vi: "Everest Base Camp", en: "Everest Base Camp" },
                "Pokhara",
                { vi: "Quảng trường Durbar Kathmandu", en: "Kathmandu Durbar Square" },
                "Chitwan"
            ]
        },
        BGD: {
            cap: { vi: "Dhaka", en: "Dhaka" },
            cur: { vi: "Taka (BDT)", en: "Taka (BDT)" },
            lang: { vi: "Tiếng Bengal", en: "Bengali" },
            tz: "UTC+6",
            desc: {
                vi: "Đồng bằng sông Hằng - Brahmaputra với rừng ngập mặn Sundarbans và bãi biển dài nhất thế giới.",
                en: "The Ganges-Brahmaputra delta, the Sundarbans mangrove and the longest natural beach on earth."
            },
            hl: [
                "Sundarbans",
                { vi: "Cox's Bazar", en: "Cox's Bazar" },
                { vi: "Phố cổ Dhaka", en: "Old Dhaka" }
            ]
        },
        PAK: {
            cap: { vi: "Islamabad", en: "Islamabad" },
            cur: { vi: "Rupee (PKR)", en: "Rupee (PKR)" },
            lang: { vi: "Tiếng Urdu", en: "Urdu" },
            tz: "UTC+5",
            desc: {
                vi: "Những đỉnh núi cao nhất hành tinh ở phía bắc và di sản Mogul ở Lahore.",
                en: "The highest peaks on the planet in the north, and Mughal stonework down in Lahore."
            },
            hl: [
                "K2",
                { vi: "Thung lũng Hunza", en: "Hunza Valley" },
                { vi: "Pháo đài Lahore", en: "Lahore Fort" },
                "Taxila"
            ]
        },

        /* --------------------------- Trung Đông ----------------------------- */
        ARE: {
            cap: { vi: "Abu Dhabi", en: "Abu Dhabi" },
            cur: { vi: "Dirham (AED)", en: "Dirham (AED)" },
            lang: { vi: "Tiếng Ả Rập", en: "Arabic" },
            tz: "UTC+4",
            desc: {
                vi: "Bảy tiểu vương quốc giữa sa mạc và biển, từ Burj Khalifa đến những cồn cát đỏ.",
                en: "Seven emirates between desert and sea, from the Burj Khalifa to red dunes at Liwa."
            },
            hl: [
                "Burj Khalifa",
                { vi: "Sa mạc Liwa", en: "Liwa Desert" },
                { vi: "Nhà thờ Sheikh Zayed", en: "Sheikh Zayed Mosque" },
                { vi: "Dubai Marina", en: "Dubai Marina" }
            ]
        },
        SAU: {
            cap: { vi: "Riyadh", en: "Riyadh" },
            cur: { vi: "Riyal (SAR)", en: "Riyal (SAR)" },
            lang: { vi: "Tiếng Ả Rập", en: "Arabic" },
            tz: "UTC+3",
            desc: {
                vi: "Vùng đất của Mecca, Medina và những di sản Nabataean ở AlUla giữa sa mạc đá.",
                en: "Mecca, Medina and the Nabataean tombs of AlUla, cut into desert sandstone."
            },
            hl: [
                { vi: "AlUla & Hegra", en: "AlUla & Hegra" },
                "Mecca",
                "Diriyah",
                { vi: "Bờ Biển Đỏ", en: "Red Sea Coast" }
            ]
        },
        QAT: {
            cap: { vi: "Doha", en: "Doha" },
            cur: { vi: "Riyal (QAR)", en: "Riyal (QAR)" },
            lang: { vi: "Tiếng Ả Rập", en: "Arabic" },
            tz: "UTC+3",
            desc: {
                vi: "Bán đảo nhỏ vươn ra vịnh Ba Tư, nổi tiếng với bảo tàng Hồi giáo và những cồn cát.",
                en: "A small peninsula in the Gulf, known for its Islamic art museum and dunes that run to the sea."
            },
            hl: [
                { vi: "Bảo tàng Nghệ thuật Hồi giáo", en: "Museum of Islamic Art" },
                "Souq Waqif",
                "Khor Al Adaid"
            ]
        },
        TUR: {
            cap: { vi: "Ankara", en: "Ankara" },
            cur: { vi: "Lira (TRY)", en: "Lira (TRY)" },
            lang: { vi: "Tiếng Thổ Nhĩ Kỳ", en: "Turkish" },
            tz: "UTC+3",
            desc: {
                vi: "Cầu nối Âu - Á với Istanbul hai lục địa, Cappadocia đá lửa và bờ biển Aegean.",
                en: "A bridge between Europe and Asia: Istanbul on two continents, Cappadocia's rock valleys, the Aegean coast."
            },
            hl: [
                { vi: "Istanbul & Hagia Sophia", en: "Istanbul & Hagia Sophia" },
                "Cappadocia",
                "Pamukkale",
                "Ephesus"
            ]
        },
        JOR: {
            cap: { vi: "Amman", en: "Amman" },
            cur: { vi: "Dinar (JOD)", en: "Dinar (JOD)" },
            lang: { vi: "Tiếng Ả Rập", en: "Arabic" },
            tz: "UTC+3",
            desc: {
                vi: "Petra hồng giữa sa mạc, Biển Chết và những pháo đài Thập tự chinh.",
                en: "Rose-red Petra in the desert, the Dead Sea and crusader castles along the King's Highway."
            },
            hl: [
                "Petra",
                "Wadi Rum",
                { vi: "Biển Chết", en: "Dead Sea" },
                "Jerash"
            ]
        },
        IRN: {
            cap: { vi: "Tehran", en: "Tehran" },
            cur: { vi: "Rial (IRR)", en: "Rial (IRR)" },
            lang: { vi: "Tiếng Ba Tư", en: "Persian" },
            tz: "UTC+3:30",
            desc: {
                vi: "Đế chế Ba Tư cổ đại với Persepolis, những nhà thờ Hồi giáo lát gạch xanh và sa mạc muối.",
                en: "Ancient Persia: Persepolis, blue-tiled mosques and salt deserts that crack into polygons."
            },
            hl: [
                "Persepolis",
                "Isfahan",
                "Shiraz",
                "Yazd"
            ]
        },

        /* ------------------------------ Châu Âu ----------------------------- */
        FRA: {
            cap: { vi: "Paris", en: "Paris" },
            cur: { vi: "Euro (EUR)", en: "Euro (EUR)" },
            lang: { vi: "Tiếng Pháp", en: "French" },
            tz: "UTC+1",
            desc: {
                vi: "Kinh đô ánh sáng với bảo tàng, rượu vang và những cánh đồng oải hương tím ở Provence.",
                en: "The city of light, plus vineyards, Atlantic oysters and the lavender fields of Provence."
            },
            hl: [
                { vi: "Tháp Eiffel", en: "Eiffel Tower" },
                { vi: "Bảo tàng Louvre", en: "Louvre" },
                "Provence",
                "Mont Saint-Michel"
            ]
        },
        DEU: {
            cap: { vi: "Berlin", en: "Berlin" },
            cur: { vi: "Euro (EUR)", en: "Euro (EUR)" },
            lang: { vi: "Tiếng Đức", en: "German" },
            tz: "UTC+1",
            desc: {
                vi: "Xứ sở của lâu đài cổ tích, rừng Đen và những thành phố kỹ thuật bậc nhất châu Âu.",
                en: "Fairy-tale castles, the Black Forest and cities that run on very precise engineering."
            },
            hl: [
                { vi: "Lâu đài Neuschwanstein", en: "Neuschwanstein Castle" },
                { vi: "Cổng Brandenburg", en: "Brandenburg Gate" },
                { vi: "Rừng Đen", en: "Black Forest" },
                "Bavaria"
            ]
        },
        GBR: {
            cap: { vi: "London", en: "London" },
            cur: { vi: "Bảng Anh (GBP)", en: "Pound sterling (GBP)" },
            lang: { vi: "Tiếng Anh", en: "English" },
            tz: "UTC+0",
            desc: {
                vi: "Đảo quốc với cung điện, đồng hoang Scotland và những bảo tàng miễn phí.",
                en: "Palaces, Scottish moorland and museums that cost nothing to walk into."
            },
            hl: [
                { vi: "Big Ben & Westminster", en: "Big Ben & Westminster" },
                { vi: "Tháp London", en: "Tower of London" },
                "Edinburgh",
                { vi: "Cao nguyên Scotland", en: "Scottish Highlands" }
            ]
        },
        ITA: {
            cap: { vi: "Rome", en: "Rome" },
            cur: { vi: "Euro (EUR)", en: "Euro (EUR)" },
            lang: { vi: "Tiếng Ý", en: "Italian" },
            tz: "UTC+1",
            desc: {
                vi: "Bảo tàng ngoài trời của châu Âu: đấu trường La Mã, kênh Venice và đồi Toscan.",
                en: "Europe's open-air museum: the Colosseum, Venice's canals and the hills of Tuscany."
            },
            hl: [
                { vi: "Đấu trường La Mã", en: "Colosseum" },
                "Venice",
                "Florence",
                { vi: "Bờ biển Amalfi", en: "Amalfi Coast" }
            ]
        },
        ESP: {
            cap: { vi: "Madrid", en: "Madrid" },
            cur: { vi: "Euro (EUR)", en: "Euro (EUR)" },
            lang: { vi: "Tiếng Tây Ban Nha", en: "Spanish" },
            tz: "UTC+1",
            desc: {
                vi: "Đất nước của Gaudí, flamenco và những bãi biển Địa Trung Hải.",
                en: "Gaudí, flamenco and long Mediterranean beaches that stay warm into October."
            },
            hl: [
                { vi: "Sagrada Família", en: "Sagrada Familia" },
                "Alhambra",
                "Sevilla",
                "Barcelona"
            ]
        },
        PRT: {
            cap: { vi: "Lisbon", en: "Lisbon" },
            cur: { vi: "Euro (EUR)", en: "Euro (EUR)" },
            lang: { vi: "Tiếng Bồ Đào Nha", en: "Portuguese" },
            tz: "UTC+0",
            desc: {
                vi: "Bờ biển Đại Tây Dương với những ngôi nhà lát gạch, rượu porto và sóng lớn Nazaré.",
                en: "An Atlantic edge of tiled houses, port wine and the giant waves at Nazaré."
            },
            hl: [
                { vi: "Lisbon & Belém", en: "Lisbon & Belem" },
                "Porto",
                "Algarve",
                "Madeira"
            ]
        },
        NLD: {
            cap: { vi: "Amsterdam", en: "Amsterdam" },
            cur: { vi: "Euro (EUR)", en: "Euro (EUR)" },
            lang: { vi: "Tiếng Hà Lan", en: "Dutch" },
            tz: "UTC+1",
            desc: {
                vi: "Xứ sở của kênh đào, cối xay gió và những cánh đồng tulip.",
                en: "Canals, windmills and tulip fields planted in strict rows every spring."
            },
            hl: [
                { vi: "Kênh đào Amsterdam", en: "Amsterdam Canals" },
                "Keukenhof",
                "Zaanse Schans",
                "Rotterdam"
            ]
        },
        BEL: {
            cap: { vi: "Brussels", en: "Brussels" },
            cur: { vi: "Euro (EUR)", en: "Euro (EUR)" },
            lang: { vi: "Tiếng Hà Lan", en: "Dutch" },
            tz: "UTC+1",
            desc: {
                vi: "Vương quốc nhỏ với quảng trường Grand-Place, sô-cô-la và bia tu viện.",
                en: "A small kingdom of gilded squares, chocolate shops and beer brewed by monks."
            },
            hl: [
                "Grand-Place",
                "Bruges",
                "Antwerp",
                "Ghent"
            ]
        },
        CHE: {
            cap: { vi: "Bern", en: "Bern" },
            cur: { vi: "Franc (CHF)", en: "Franc (CHF)" },
            lang: { vi: "Tiếng Đức", en: "German" },
            tz: "UTC+1",
            desc: {
                vi: "Núi Alps, hồ nước xanh ngọc và những chuyến tàu leo núi chậm rãi.",
                en: "Alpine peaks, turquoise lakes and mountain trains that climb slowly enough to look."
            },
            hl: [
                "Matterhorn",
                "Interlaken",
                "Lucerne",
                { vi: "Tàu Glacier Express", en: "Glacier Express" }
            ]
        },
        AUT: {
            cap: { vi: "Viên", en: "Vienna" },
            cur: { vi: "Euro (EUR)", en: "Euro (EUR)" },
            lang: { vi: "Tiếng Đức", en: "German" },
            tz: "UTC+1",
            desc: {
                vi: "Kinh đô nhạc cổ điển với cung điện Schönbrunn và những quán cà phê trăm năm.",
                en: "The capital of classical music: Schönbrunn Palace and coffee houses that have not changed in a century."
            },
            hl: [
                { vi: "Cung điện Schönbrunn", en: "Schönbrunn Palace" },
                "Vienna",
                "Salzburg",
                "Hallstatt"
            ]
        },
        CZE: {
            cap: { vi: "Prague", en: "Prague" },
            cur: { vi: "Koruna (CZK)", en: "Koruna (CZK)" },
            lang: { vi: "Tiếng Séc", en: "Czech" },
            tz: "UTC+1",
            desc: {
                vi: "Prague trăm tháp, lâu đài trên đồi và những thị trấn cổ tích của Bohemia.",
                en: "Prague of a hundred spires, a castle on the hill and Bohemian towns that look untouched."
            },
            hl: [
                { vi: "Cầu Charles", en: "Charles Bridge" },
                { vi: "Lâu đài Prague", en: "Prague Castle" },
                { vi: "Český Krumlov", en: "Cesky Krumlov" }
            ]
        },
        POL: {
            cap: { vi: "Warsaw", en: "Warsaw" },
            cur: { vi: "Zloty (PLN)", en: "Zloty (PLN)" },
            lang: { vi: "Tiếng Ba Lan", en: "Polish" },
            tz: "UTC+1",
            desc: {
                vi: "Đất nước của Chopin, những thị trấn lát đá và rừng nguyên sinh Białowieża.",
                en: "Chopin's country: cobbled squares, milk bars and the last primeval forest in Europe."
            },
            hl: [
                "Kraków",
                { vi: "Phố cổ Warsaw", en: "Warsaw Old Town" },
                "Wieliczka",
                "Gdańsk"
            ]
        },
        GRC: {
            cap: { vi: "Athens", en: "Athens" },
            cur: { vi: "Euro (EUR)", en: "Euro (EUR)" },
            lang: { vi: "Tiếng Hy Lạp", en: "Greek" },
            tz: "UTC+2",
            desc: {
                vi: "Cái nôi của nền văn minh phương Tây với Acropolis và những hòn đảo trắng-xanh.",
                en: "The cradle of the West: the Acropolis, and islands painted white and blue."
            },
            hl: [
                "Acropolis",
                "Santorini",
                "Mykonos",
                "Meteora"
            ]
        },
        SWE: {
            cap: { vi: "Stockholm", en: "Stockholm" },
            cur: { vi: "Krona (SEK)", en: "Krona (SEK)" },
            lang: { vi: "Tiếng Thụy Điển", en: "Swedish" },
            tz: "UTC+1",
            desc: {
                vi: "Bán đảo Scandinavia với quần đảo nghìn đảo, rừng thông và cực quang.",
                en: "A Scandinavian archipelago of thousands of islands, pine forest and northern lights."
            },
            hl: [
                "Stockholm",
                { vi: "Lapland & cực quang", en: "Lapland & Northern Lights" },
                "Gothenburg"
            ]
        },
        NOR: {
            cap: { vi: "Oslo", en: "Oslo" },
            cur: { vi: "Krone (NOK)", en: "Krone (NOK)" },
            lang: { vi: "Tiếng Na Uy", en: "Norwegian" },
            tz: "UTC+1",
            desc: {
                vi: "Những vịnh hẹp sâu hun hút, đường ven biển Atlantic và mặt trời lúc nửa đêm.",
                en: "Deep fjords, the Atlantic Road and a sun that refuses to set in June."
            },
            hl: [
                { vi: "Vịnh hẹp Geirangerfjord", en: "Geirangerfjord" },
                "Lofoten",
                "Bergen",
                "Tromsø"
            ]
        },
        RUS: {
            cap: { vi: "Mát-xcơ-va", en: "Moscow" },
            cur: { vi: "Ruble (RUB)", en: "Ruble (RUB)" },
            lang: { vi: "Tiếng Nga", en: "Russian" },
            tz: "UTC+3",
            desc: {
                vi: "Quốc gia rộng nhất thế giới, từ Quảng trường Đỏ đến hồ Baikal và tuyến Trans-Siberian.",
                en: "The largest country on earth: Red Square, Lake Baikal and the Trans-Siberian Railway."
            },
            hl: [
                { vi: "Quảng trường Đỏ & Điện Kremlin", en: "Red Square & Kremlin" },
                { vi: "Hồ Baikal", en: "Lake Baikal" },
                "Hermitage",
                { vi: "Tuyến Trans-Siberian", en: "Trans-Siberian Railway" }
            ]
        },

        /* ------------------------------ Châu Mỹ ----------------------------- */
        USA: {
            cap: { vi: "Washington, D.C.", en: "Washington, D.C." },
            cur: { vi: "Đô la Mỹ (USD)", en: "US dollar (USD)" },
            lang: { vi: "Tiếng Anh", en: "English" },
            tz: "UTC-5",
            desc: {
                vi: "Từ những công viên quốc gia miền Tây đến nhà chọc trời New York và xa lộ ven biển California.",
                en: "Western national parks, New York's skyline and the coastal highway down California."
            },
            hl: [
                "Grand Canyon",
                "New York",
                "Yellowstone",
                "Route 66"
            ]
        },
        CAN: {
            cap: { vi: "Ottawa", en: "Ottawa" },
            cur: { vi: "Đô la Canada (CAD)", en: "Canadian dollar (CAD)" },
            lang: { vi: "Tiếng Anh", en: "English" },
            tz: "UTC-5",
            desc: {
                vi: "Rừng lá kim, hồ nước ngọt và dãy Rockies - quốc gia rộng thứ hai thế giới.",
                en: "Boreal forest, freshwater lakes and the Rockies, in the second-largest country on earth."
            },
            hl: [
                "Banff",
                { vi: "Thác Niagara", en: "Niagara Falls" },
                "Vancouver",
                { vi: "Thành phố Quebec", en: "Quebec City" }
            ]
        },
        MEX: {
            cap: { vi: "Mexico City", en: "Mexico City" },
            cur: { vi: "Peso (MXN)", en: "Peso (MXN)" },
            lang: { vi: "Tiếng Tây Ban Nha", en: "Spanish" },
            tz: "UTC-6",
            desc: {
                vi: "Kim tự tháp Maya, ẩm thực đường phố và những bãi biển Caribbean ở Yucatán.",
                en: "Maya pyramids, street food and Caribbean beaches along the Yucatán."
            },
            hl: [
                { vi: "Chichén Itzá", en: "Chichen Itza" },
                "Tulum",
                { vi: "Mexico City", en: "Mexico City" },
                "Oaxaca"
            ]
        },
        BRA: {
            cap: { vi: "Brasília", en: "Brasilia" },
            cur: { vi: "Real (BRL)", en: "Real (BRL)" },
            lang: { vi: "Tiếng Bồ Đào Nha", en: "Portuguese" },
            tz: "UTC-3",
            desc: {
                vi: "Rừng Amazon, bãi biển Copacabana và lễ hội Carnival lớn nhất hành tinh.",
                en: "The Amazon, Copacabana and the largest carnival on the planet."
            },
            hl: [
                { vi: "Rio de Janeiro", en: "Rio de Janeiro" },
                { vi: "Rừng Amazon", en: "Amazon Rainforest" },
                { vi: "Thác Iguazu", en: "Iguazu Falls" },
                "Salvador"
            ]
        },
        ARG: {
            cap: { vi: "Buenos Aires", en: "Buenos Aires" },
            cur: { vi: "Peso (ARS)", en: "Peso (ARS)" },
            lang: { vi: "Tiếng Tây Ban Nha", en: "Spanish" },
            tz: "UTC-3",
            desc: {
                vi: "Đất nước của tango, thảo nguyên Pampas và sông băng Patagonia.",
                en: "Tango, the Pampas grasslands and the glaciers of Patagonia."
            },
            hl: [
                { vi: "Buenos Aires", en: "Buenos Aires" },
                { vi: "Sông băng Perito Moreno", en: "Perito Moreno Glacier" },
                "Patagonia",
                "Mendoza"
            ]
        },
        CHL: {
            cap: { vi: "Santiago", en: "Santiago" },
            cur: { vi: "Peso (CLP)", en: "Peso (CLP)" },
            lang: { vi: "Tiếng Tây Ban Nha", en: "Spanish" },
            tz: "UTC-4",
            desc: {
                vi: "Dải đất mỏng dài 4.300 km giữa Andes và Thái Bình Dương, với sa mạc khô nhất thế giới.",
                en: "A 4,300 km ribbon between the Andes and the Pacific, holding the driest desert on earth."
            },
            hl: [
                { vi: "Sa mạc Atacama", en: "Atacama Desert" },
                { vi: "Torres del Paine", en: "Torres del Paine" },
                { vi: "Đảo Phục Sinh", en: "Easter Island" },
                "Valparaíso"
            ]
        },
        PER: {
            cap: { vi: "Lima", en: "Lima" },
            cur: { vi: "Sol (PEN)", en: "Sol (PEN)" },
            lang: { vi: "Tiếng Tây Ban Nha", en: "Spanish" },
            tz: "UTC-5",
            desc: {
                vi: "Machu Picchu, đế chế Inca và nền ẩm thực được xem là phong phú nhất Nam Mỹ.",
                en: "Machu Picchu, the Inca empire and the most varied cooking in South America."
            },
            hl: [
                "Machu Picchu",
                "Cusco",
                { vi: "Hồ Titicaca", en: "Lake Titicaca" },
                "Lima"
            ]
        },
        COL: {
            cap: { vi: "Bogotá", en: "Bogota" },
            cur: { vi: "Peso (COP)", en: "Peso (COP)" },
            lang: { vi: "Tiếng Tây Ban Nha", en: "Spanish" },
            tz: "UTC-5",
            desc: {
                vi: "Cà phê vùng núi, thành phố cổ Cartagena và rừng Amazon.",
                en: "Mountain coffee farms, the walled city of Cartagena and a slice of the Amazon."
            },
            hl: [
                "Cartagena",
                { vi: "Vùng cà phê", en: "Coffee Triangle" },
                "Medellín",
                "Tayrona"
            ]
        },

        /* --------------------------- Châu Đại Dương ------------------------- */
        AUS: {
            cap: { vi: "Canberra", en: "Canberra" },
            cur: { vi: "Đô la Úc (AUD)", en: "Australian dollar (AUD)" },
            lang: { vi: "Tiếng Anh", en: "English" },
            tz: "UTC+10",
            desc: {
                vi: "Lục địa đỏ với rạn san hô lớn nhất thế giới, kangaroo và những bãi biển dài vô tận.",
                en: "A red continent with the largest reef on earth, kangaroos and beaches that go on for days."
            },
            hl: [
                { vi: "Rạn san hô Great Barrier", en: "Great Barrier Reef" },
                "Sydney",
                "Uluru",
                "Melbourne"
            ]
        },
        NZL: {
            cap: { vi: "Wellington", en: "Wellington" },
            cur: { vi: "Đô la New Zealand (NZD)", en: "New Zealand dollar (NZD)" },
            lang: { vi: "Tiếng Anh", en: "English" },
            tz: "UTC+12",
            desc: {
                vi: "Hai hòn đảo với núi lửa, vịnh hẹp Milford và những cánh đồng cừu.",
                en: "Two islands of volcanoes, the Milford Sound fjord and more sheep than people."
            },
            hl: [
                "Milford Sound",
                "Queenstown",
                "Rotorua",
                "Hobbiton"
            ]
        },
        FJI: {
            cap: { vi: "Suva", en: "Suva" },
            cur: { vi: "Đô la Fiji (FJD)", en: "Fijian dollar (FJD)" },
            lang: { vi: "Tiếng Fiji", en: "Fijian" },
            tz: "UTC+12",
            desc: {
                vi: "333 hòn đảo san hô giữa Thái Bình Dương, nơi du khách đến lặn và nghỉ dưỡng.",
                en: "333 coral islands in the Pacific, where people come to dive and do very little else."
            },
            hl: [
                { vi: "Quần đảo Yasawa", en: "Yasawa Islands" },
                "Denarau",
                { vi: "Rạn san hô Great Astrolabe", en: "Great Astrolabe Reef" }
            ]
        },

        /* ------------------------------ Châu Phi ---------------------------- */
        ZAF: {
            cap: { vi: "Pretoria", en: "Pretoria" },
            cur: { vi: "Rand (ZAR)", en: "Rand (ZAR)" },
            lang: { vi: "Tiếng Zulu", en: "Zulu" },
            tz: "UTC+2",
            desc: {
                vi: "Mũi Hảo Vọng, vườn quốc gia Kruger và những vườn nho quanh Cape Town.",
                en: "The Cape of Good Hope, Kruger's big game and vineyards wrapped around Cape Town."
            },
            hl: [
                { vi: "Cape Town & Núi Bàn", en: "Cape Town & Table Mountain" },
                "Kruger",
                { vi: "Garden Route", en: "Garden Route" },
                "Stellenbosch"
            ]
        },
        EGY: {
            cap: { vi: "Cairo", en: "Cairo" },
            cur: { vi: "Bảng Ai Cập (EGP)", en: "Egyptian pound (EGP)" },
            lang: { vi: "Tiếng Ả Rập", en: "Arabic" },
            tz: "UTC+2",
            desc: {
                vi: "Kim tự tháp Giza, sông Nile và những ngôi đền Pharaoh dọc bờ sông.",
                en: "The pyramids at Giza, the Nile and pharaonic temples lined up along its banks."
            },
            hl: [
                { vi: "Kim tự tháp Giza", en: "Pyramids of Giza" },
                "Luxor",
                "Aswan",
                { vi: "Biển Đỏ", en: "Red Sea" }
            ]
        },
        MAR: {
            cap: { vi: "Rabat", en: "Rabat" },
            cur: { vi: "Dirham (MAD)", en: "Dirham (MAD)" },
            lang: { vi: "Tiếng Ả Rập", en: "Arabic" },
            tz: "UTC+1",
            desc: {
                vi: "Sa mạc Sahara, thành phố xanh Chefchaouen và những khu chợ gia vị ở Marrakech.",
                en: "The Sahara, the blue town of Chefchaouen and spice markets in Marrakech."
            },
            hl: [
                "Marrakech",
                { vi: "Sahara & Merzouga", en: "Sahara & Merzouga" },
                "Chefchaouen",
                "Fes"
            ]
        },
        KEN: {
            cap: { vi: "Nairobi", en: "Nairobi" },
            cur: { vi: "Shilling (KES)", en: "Shilling (KES)" },
            lang: { vi: "Tiếng Swahili", en: "Swahili" },
            tz: "UTC+3",
            desc: {
                vi: "Thảo nguyên Masai Mara, cuộc di cư lớn và bờ biển Ấn Độ Dương.",
                en: "The Masai Mara, the great migration and an Indian Ocean coast of white sand."
            },
            hl: [
                "Masai Mara",
                "Amboseli",
                { vi: "Bãi biển Diani", en: "Diani Beach" },
                "Nairobi"
            ]
        },
        TZA: {
            cap: { vi: "Dodoma", en: "Dodoma" },
            cur: { vi: "Shilling (TZS)", en: "Shilling (TZS)" },
            lang: { vi: "Tiếng Swahili", en: "Swahili" },
            tz: "UTC+3",
            desc: {
                vi: "Kilimanjaro, miệng núi lửa Ngorongoro và đảo gia vị Zanzibar.",
                en: "Kilimanjaro, the Ngorongoro crater and the spice island of Zanzibar."
            },
            hl: [
                "Kilimanjaro",
                "Serengeti",
                "Ngorongoro",
                "Zanzibar"
            ]
        },
        NGA: {
            cap: { vi: "Abuja", en: "Abuja" },
            cur: { vi: "Naira (NGN)", en: "Naira (NGN)" },
            lang: { vi: "Tiếng Anh", en: "English" },
            tz: "UTC+1",
            desc: {
                vi: "Quốc gia đông dân nhất châu Phi với Lagos sôi động và rừng nhiệt đới phía nam.",
                en: "Africa's most populous country: Lagos at full volume and rainforest in the south."
            },
            hl: [
                "Lagos",
                "Abuja",
                { vi: "Vườn quốc gia Yankari", en: "Yankari National Park" }
            ]
        },
        ETH: {
            cap: { vi: "Addis Ababa", en: "Addis Ababa" },
            cur: { vi: "Birr (ETB)", en: "Birr (ETB)" },
            lang: { vi: "Tiếng Amhara", en: "Amharic" },
            tz: "UTC+3",
            desc: {
                vi: "Cao nguyên Ethiopia, nhà thờ đá Lalibela và nơi khởi nguồn của cà phê.",
                en: "The Ethiopian highlands, the rock-hewn churches of Lalibela and the birthplace of coffee."
            },
            hl: [
                "Lalibela",
                { vi: "Dãy Simien", en: "Simien Mountains" },
                "Danakil",
                "Addis Ababa"
            ]
        }
    }
};
