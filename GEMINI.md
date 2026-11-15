# WORKFLOW GUIDELINES & FAST ITERATION PROTOCOL

Quy chuẩn làm việc tối ưu hóa hiệu năng và tốc độ cho AI Agent trong dự án Quy Nhon AI Travel Assistant.

---

## 1. FAST ITERATION PROTOCOL (Áp dụng cho các nhiệm vụ nhỏ / Tinh chỉnh UI / Fix nhanh)

Khi yêu cầu của người dùng có nhãn `FAST ITERATION` hoặc là các tác vụ sửa đổi nhỏ (HTML, CSS, text, nhãn, hiển thị):

1. **Chu trình 3 bước tinh gọn (Tối đa 2-3 turns)**:
   - **Bước 1 - Định vị (Locate)**: Tìm kiếm có mục tiêu hẹp (chỉ quét file liên quan như `index.html` hoặc `css/`, không quét toàn bộ repository). Dừng tìm kiếm ngay khi đã xác định được selector hoặc chuỗi đích.
   - **Bước 2 - Chỉnh sửa chuẩn xác (Exact Edit)**: Sử dụng `read_file` để lấy chính xác khối mã bao gồm định dạng xuống dòng (CRLF/LF) -> Dùng `edit_file` trực tiếp. Hạn chế tối đa việc viết script `node -e` phức tạp qua terminal để tránh lỗi cú pháp escape chuỗi.
   - **Bước 3 - Xác nhận phạm vi hẹp (Scoped Verification)**: Đọc lại đoạn mã vừa sửa hoặc kiểm tra nhanh. Tuyệt đối không sinh thêm test script mới hay chạy Chrome headless nếu người dùng không yêu cầu.

2. **Các điều nghiêm cấm trong FAST ITERATION**:
   - **KHÔNG** tự tạo test harness script (Node.js, Puppeteer, Playwright, Chrome Headless dump DOM).
   - **KHÔNG** tạo báo cáo markdown, checklist phụ hoặc screenshot khi chưa có yêu cầu.
   - **KHÔNG** quét lặp lại nhiều lần cùng một từ khóa qua nhiều lệnh terminal khác nhau.
   - **KHÔNG** mở rộng phạm vi sang các file không liên quan trực tiếp đến yêu cầu.

---

## 2. QUY TẮC QUẢN LÝ CONTEXT & TẢI SERVER

- **Nhận biết ngưỡng Context**: Khi conversation kéo dài (hàng nghìn dòng transcript hoặc tokens > 40k), mỗi turn sẽ phản hồi chậm hơn và dễ gặp lỗi 503 / timeout. Trong tình huống này, Agent phải ưu tiên giải quyết tác vụ với số tool calls ít nhất có thể.
- **Xử lý khi gặp lỗi 503 / Timeout**:
  - Không thực hiện các lệnh shell quét diện rộng làm tăng đột biến context.
  - Tập trung giải quyết dứt điểm thay đổi thay vì thực hiện thêm các bước kiểm tra phỏng đoán.
  - Nếu tác vụ đã hoàn thành, báo cáo ngay cho người dùng thay vì kiểm tra vòng lặp.

---

## 3. NGUYÊN TẮC BẢO TOÀN DỰ ÁN
- Tuyệt đối không tự ý chạy các lệnh Git làm thay đổi trạng thái repo (`git add`, `git commit`, `git push`, `git reset`, `git stash`).
- Giữ nguyên các chức năng cốt lõi không thuộc phạm vi yêu cầu (nhạc/âm thanh, bản đồ 2.5D PixiJS/Leaflet, Three.js Piggy Bank, logic tính toán ngân sách, v.v.).
