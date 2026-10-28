# PROJECT_CONTEXT: TÀI LIỆU TỔNG HỢP DỰ ÁN QUY NHON AI TRAVEL

Tài liệu này được lập ra để lưu trữ thông tin thực tế của dự án, phục vụ cho việc quản lý và làm việc giữa Người quản lý dự án và Trợ lý AI trong các giai đoạn phát triển tiếp theo.

---

## A. Tổng quan dự án

- **Tên dự án**: Quy Nhon AI Travel Assistant (Phiên bản Prototype / Demo Pitching)
- **Mục đích**: 
  - Hỗ trợ giải quyết rào cản di chuyển cho du khách quốc tế và nội địa đến Quy Nhơn (Bình Định).
  - Ứng dụng trí tuệ nhân tạo (AI) để gợi ý hành trình đa phương thức thông minh (kết hợp chặng bay quốc tế, chuyến bay nối chuyến nội địa hoặc xe limousine/tàu hỏa ngắm cảnh ven biển).
  - Tối ưu hóa kế hoạch du lịch 3 ngày theo ngân sách và sở thích cá nhân, đề xuất điểm lưu trú phù hợp và minh họa ý tưởng qua giọng nói AI tương tác.
- **Bản chất hiện tại**: Đây là **bản thử nghiệm chức năng tương tác (Functional Prototype Demo)** được thiết kế chỉn chu để trình chiếu ý tưởng, demo sản phẩm và làm nền tảng mở rộng các tính năng thực tế tiếp theo.

---

## B. Công nghệ sử dụng

- **Giao diện (Frontend)**:
  - HTML5 & CSS3 thuần (Vanilla CSS, thiết kế giao diện hiện đại Glassmorphism, tối ưu hiển thị trên cả máy tính và điện thoại).
  - JavaScript ES6+ thuần (Vanilla JS, cấu trúc phân chia module độc lập, không dùng framework nặng).
- **Thư viện bên ngoài (tải qua CDN)**:
  - **Leaflet.js**: Bản đồ số thế giới hiển thị ảnh vệ tinh toàn cầu (Esri World Imagery) với đường bay và các trạm trung chuyển.
  - **FontAwesome 6**: Hệ thống biểu tượng giao diện.
  - **Google Fonts**: Phông chữ chuẩn Plus Jakarta Sans.
- **Máy chủ cục bộ (Backend)**:
  - Node.js thuần (sử dụng thư viện tích hợp sẵn `http`, `fs`, `path`, `url`, không phát sinh phụ thuộc thư viện ngoài).
  - Đóng vai trò phục vụ file tĩnh và cung cấp cổng proxy trung gian gọi giọng nói AI (`/api/tts`).
- **Xử lý âm thanh & Giọng nói**:
  - Web Speech API (giọng đọc trình duyệt cho tiếng Anh).
  - Smart Audio Stream Fallback (giọng đọc tiếng Việt tự nhiên, không cần cài đặt thêm).
  - ElevenLabs API (kết nối giọng đọc chất lượng cao cho trang thuyết trình).
- **Cấu hình**:
  - Quản lý biến môi trường qua file `.env`.
  - Hỗ trợ cài đặt ứng dụng web di động qua file `manifest.json`.

---

## C. Chức năng hiện có

Dưới đây là bảng tổng hợp toàn bộ các chức năng đã được khảo sát thực tế trong mã nguồn:

| STT | Chức năng | Mô tả dễ hiểu | Trạng thái | Ghi chú |
|---|---|---|---|---|
| 1 | **Lập lộ trình di chuyển AI (AI Journey Planner)** | Người dùng chọn quốc gia xuất phát (Bỉ, Pháp, Đức, Mỹ, Úc, Nhật); hệ thống tính toán chuỗi chặng bay, quá cảnh và trung chuyển đến Quy Nhơn. | Hoàn thành một phần | Hoạt động trơn tru với dữ liệu mẫu (mock data), chưa liên kết với cổng vé máy bay thực tế. |
| 2 | **Cân chỉnh ngân sách chuyến đi (Budget Selector)** | Cho phép chọn mức ngân sách từ $1,000 đến $5,000 hoặc tự nhập ngân sách riêng để hệ thống tự tính giá các phương án (Nhanh nhất, Đáng giá nhất, Dừng chân linh hoạt). | Hoàn thành | Logic tính toán và hiển thị các gói lộ trình theo ngân sách hoạt động chính xác. |
| 3 | **Cá nhân hóa hành trình 3 ngày (Personalized Itinerary)** | Cho phép người dùng chọn các sở thích (Biển, Ẩm thực, Văn hóa, Phiêu lưu, Cuộc sống về đêm) và nhấn nút tạo hành trình 3 ngày tại Quy Nhơn. | Hoàn thành một phần | Giao diện và hiệu ứng hoạt động tốt; nội dung lịch trình hiện tại là nội dung mẫu đại diện cho bản demo. |
| 4 | **Bản đồ vệ tinh đường bay tương tác (Interactive Route Map)** | Bản đồ vệ tinh thế giới trực quan hóa đường bay uốn cong từ điểm xuất phát qua trạm trung chuyển (Đà Nẵng / Hà Nội / TP.HCM) về Quy Nhơn, kèm huy hiệu chỉ dẫn. | Hoàn thành | Tích hợp Leaflet.js mượt mà, hỗ trợ phóng to, thu nhỏ và kéo bản đồ. |
| 5 | **Mô phỏng tư duy AI & Hiệu ứng gõ chữ (AI Simulator)** | Mô phỏng quá trình AI suy nghĩ qua thanh tiến trình 4 giai đoạn và hiệu ứng gõ chữ từng ký tự câu tóm tắt hành trình. | Hoàn thành | Tạo cảm giác hệ thống AI đang làm việc thực tế, rất phù hợp khi demo pitching. |
| 6 | **Trợ lý phát giọng nói AI (Text-to-Speech Assistant)** | Nút bấm "Listen to AI" đọc lời giải thích hành trình bằng tiếng Anh hoặc tiếng Việt, có sóng âm động và nút dừng âm thanh. | Hoàn thành | Đã có cơ chế chạy dự phòng (fallback) đảm bảo luôn phát được âm thanh trên mọi trình duyệt. |
| 7 | **Quả bóng thuyết trình nổi (AI Voice Orb)** | Quả cầu tương tác ở góc màn hình; khi bấm sẽ kích hoạt bài phát biểu giới thiệu ý tưởng dự án kèm bong bóng phụ đề trực quan. | Hoàn thành | Hoạt động ổn định trên giao diện chính, hỗ trợ cả tiếng Anh và tiếng Việt. |
| 8 | **Gợi ý & Xem trước khu nghỉ dưỡng (Curated Hotels & Modal)** | Hiển thị danh sách khách sạn tiêu biểu (Anantara, Maia, FLC) kèm xếp hạng, ảnh chụp; bấm vào xem popup chi tiết tiện ích và mức giá ước tính. | Hoàn thành một phần | Hiển thị thông tin chi tiết đầy đủ; nút đặt phòng đang khóa ở chế độ thử nghiệm (chưa có cổng booking thật). |
| 9 | **Chuyển đổi song ngữ Anh - Việt (Bilingual Switcher)** | Chuyển đổi toàn bộ ngôn ngữ hiển thị (nút bấm, tiêu đề, nội dung tóm tắt, bản đồ và giọng nói) tức thì giữa Tiếng Anh và Tiếng Việt. | Hoàn thành | Cơ chế chuyển đổi hoàn thiện 100% trên giao diện chính. |
| 10 | **Trang thuyết trình chuyên biệt (`pitch.html`)** | Màn hình tối giản tập trung vào quả cầu AI phát giọng nói giới thiệu dự án, kết nối qua cổng proxy server. | Hoàn thành | Dành riêng cho kịch bản pitching dự án. |
| 11 | **Trang chào đón tại sân bay (`airport.html`)** | Màn hình dành cho thiết bị di động mô phỏng khi du khách vừa hạ cánh tại Sân bay Phù Cát, cho phép chọn xe Taxi, Shuttle để về thành phố. | Hoàn thành một phần | Giao diện đã có hiệu ứng chọn phương tiện, chưa chuyển tiếp đến màn hình chi tiết hoặc đặt xe. |
| 12 | **Lộ trình tương lai (Startup Roadmap)** | Khối thông tin giới thiệu 4 định hướng phát triển sản phẩm tiếp theo (Vé thời gian thực, Tối ưu lộ trình tự động, Đặt chỗ 1 chạm, Trợ lý giọng nói 24/7). | Hoàn thành | Khối thông tin hiển thị rõ ràng trên giao diện. |

---

## D. Tình trạng hiện tại

### Những gì đã hoàn thành
- Giao diện người dùng hoàn thiện, đẹp mắt, thẩm mỹ cao và chạy mượt mà trên trình duyệt.
- Toàn bộ luồng trải nghiệm khách hàng: Chọn điểm đi -> Phân tích lộ trình -> Trực quan hóa bản đồ -> Nghe giọng đọc giải thích -> Xem khách sạn -> Tạo lịch trình 3 ngày.
- Cơ chế phát giọng nói song ngữ không phụ thuộc phức tạp, có sẵn fallback.
- Máy chủ Node.js khởi chạy nhanh, nhẹ nhàng, không lỗi runtime.

### Những gì chưa hoàn thành / Đang ở mức mô phỏng
- Toàn bộ dữ liệu chuyến bay, khách sạn, giá tiền là dữ liệu mô phỏng định sẵn trong mã nguồn (`mockData.js`), chưa kết nối với các đối tác hàng không hay khách sạn thực tế.
- Chưa có trí tuệ nhân tạo tạo sinh tự do (Generative AI như OpenAI ChatGPT hay Google Gemini) để trò chuyện hỏi-đáp tùy ý với người dùng.
- Lịch trình 3 ngày khi người dùng bấm tạo chưa thay đổi linh hoạt theo các ô chọn sở thích (Beaches, Food, Culture, Adventure, Nightlife).
- Trang sân bay Phù Cát (`airport.html`) mới dừng lại ở việc chọn phương tiện, chưa có bảng giá chi tiết hay điều hướng tiếp.

### Các vấn đề cần chú ý
1. **Trang `pitch.html`**: Sử dụng giọng đọc từ dịch vụ ElevenLabs qua server. Nếu file `.env` chưa có khóa API hợp lệ thì trang này sẽ báo lỗi âm thanh (trong khi trang chính `index.html` vẫn tự động phát bình thường nhờ hệ thống âm thanh dự phòng).
2. **Biểu tượng PWA trong `manifest.json`**: Đang dẫn tới file `/assets/airport-icon.png`, nhưng trong thư mục thực tế file ảnh đang có đuôi là `.jpg`.

---

## E. Quy tắc phát triển (Bắt buộc tuân thủ)

Khi tiếp nhận bất kỳ yêu cầu mới nào từ Người quản lý dự án, AI Developer phải tuân thủ nghiêm ngặt 10 nguyên tắc sau:

1. **Khảo sát trước khi sửa**: Luôn kiểm tra kỹ chức năng và mã nguồn hiện có trước khi thực hiện bất kỳ thay đổi nào.
2. **Kế thừa và tối ưu**: Ưu tiên tận dụng tối đa những thành phần đã có sẵn thay vì đập đi xây lại từ đầu.
3. **Phạm vi tối thiểu**: Chỉ chỉnh sửa đúng những phần cần thiết để đáp ứng yêu cầu của người quản lý.
4. **Bảo toàn chức năng**: Tuyệt đối không tự ý xóa bỏ các chức năng đang hoạt động bình thường.
5. **Giữ vững kiến trúc**: Không tự ý thay đổi nền tảng công nghệ, thư viện, kiến trúc hoặc phong cách giao diện nếu không được yêu cầu.
6. **Không làm thừa**: Không tự ý thêm thắt các chức năng nằm ngoài phạm vi yêu cầu.
7. **Làm rõ khi mơ hồ**: Nếu yêu cầu chưa rõ ràng và việc tự suy đoán có thể gây ảnh hưởng lớn đến hệ thống, phải hỏi lại người quản lý trước khi làm.
8. **Kiểm tra kỹ lưỡng**: Sau khi sửa đổi, luôn kiểm tra xem chức năng mới có chạy không và các chức năng cũ liên quan có bị ảnh hưởng hay không.
9. **Khoanh vùng sửa lỗi**: Nếu xảy ra lỗi phát sinh, tập trung xác định nguyên nhân và khắc phục ngay trong phạm vi yêu cầu.
10. **Báo cáo trung thực**: Luôn báo cáo rõ ràng, trung thực những gì đã làm, những gì đã kiểm tra thành công và những điểm chưa thể xác minh.

---

## F. Cách chạy và kiểm tra ứng dụng

### 1. Khởi chạy ứng dụng
- **Cách 1 (Dòng lệnh)**: Mở PowerShell hoặc Terminal tại thư mục dự án và chạy:
  ```powershell
  node server.js
  ```
- **Cách 2 (Tiện lợi nhất trên Windows)**: Nhấp đúp chuột vào file `start.bat` trong thư mục dự án.

### 2. Các địa chỉ kiểm tra
- **Giao diện chính**: `http://localhost:3000`
- **Màn hình Pitching**: `http://localhost:3000/pitch.html`
- **Màn hình Sân bay Phù Cát**: `http://localhost:3000/airport.html`

### 3. Tắt ứng dụng
- Nhấn tổ hợp phím **`Ctrl + C`** trên cửa sổ dòng lệnh đang chạy server.

*(Lưu ý bảo mật: Tuyệt đối không ghi thông tin khóa bí mật, mã truy cập cá nhân vào tài liệu).*

---

## G. Công việc còn lại có thể phát triển tiếp

1. **Cá nhân hóa lịch trình theo sở thích thực tế**: Viết thêm bộ lọc logic để khi người dùng tích chọn "Beaches", "Food", "Culture" thì nội dung lịch trình 3 ngày được hiển thị tương ứng với các địa điểm nổi tiếng tại Quy Nhơn.
2. **Tích hợp AI hỏi đáp thực tế (LLM API)**: Kết nối API Google Gemini hoặc OpenAI để người dùng có thể gõ câu hỏi tự do hoặc yêu cầu gợi ý địa điểm ăn uống, vui chơi theo thời gian thực.
3. **Mở rộng tính năng cho trang Sân bay (`airport.html`)**: Bổ sung bảng thông tin chuyến bay đến, khoảng cách từ sân bay về trung tâm, giá cước taxi ước tính và hướng dẫn xe bus sân bay.
4. **Kết nối API dữ liệu thực tế**: Khi dự án bước sang giai đoạn sản phẩm thương mại, sẽ cần tích hợp API đặt phòng khách sạn và API hàng không thực tế.

---

## H. Thông tin chưa xác minh

- Trạng thái hạn ngạch (quota) của dịch vụ ElevenLabs trong file `.env` (chỉ kiểm tra được khi có kết nối mạng thực tế và chìa khóa hợp lệ từ nhà cung cấp).
- Kế hoạch lưu trữ dữ liệu người dùng (dự án hiện tại hoạt động theo dạng máy khách độc lập, chưa thiết lập cơ sở dữ liệu lưu lịch sử chuyến đi).
