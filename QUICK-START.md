# 🚀 Quick Start Guide - AI Lesson Plan Generation

## Hướng dẫn sử dụng nhanh

### 1️⃣ Khởi động dự án

```bash
# Mở terminal trong thư mục PlainBook_FE
cd d:\2026\PlainBook_FE

# Chạy dev server (nếu chưa chạy)
npm run dev
```

### 2️⃣ Truy cập trang Quản lý Giáo án

Mở trình duyệt và truy cập:
```
http://localhost:3000/admin/lesson-plans/lesson-plans-template
```

### 3️⃣ Tạo Giáo án với AI

**Bước 1:** Click nút **"Tạo với AI"** (màu gradient xanh-tím)

**Bước 2:** Điền form:

| Trường | Bắt buộc | Ví dụ | Ghi chú |
|--------|----------|-------|---------|
| Tên giáo án | ✅ | "Bài 1: Hàm số bậc nhất" | Tên rõ ràng |
| Mô tả | ❌ | "Giáo án môn Toán lớp 10" | Thêm context |
| Lesson ID | ❌ | "toan10-hamso" | Để AI tìm nội dung SGK |
| Book ID | ❌ | "toan-10" | Collection trong Qdrant |

**Bước 3:** Cấu hình Nodes (hoặc dùng mặc định):

Mặc định đã có 3 nodes:
- ✅ I. MỤC TIÊU BÀI HỌC (độ dài: trung bình)
- ✅ II. NỘI DUNG BÀI HỌC (độ dài: dài)
- ✅ III. PHƯƠNG PHÁP GIẢNG DẠY (độ dài: trung bình)

Có thể:
- ➕ Thêm node mới
- ✏️ Sửa tiêu đề, mô tả
- 🎚️ Thay đổi độ dài (ngắn/trung bình/dài)
- 🗑️ Xóa node không cần

**Bước 4:** Click **"Tạo với AI"**

### 4️⃣ Theo dõi tiến trình

Modal progress sẽ hiện ra với 3 bước:

```
📋 Bước 1: Tạo cấu trúc giáo án
├─ Tạo template
├─ Tạo node 1
├─ Tạo node 2
└─ Tạo node 3
[████████████████████] 100%
```

```
🤖 Bước 2: AI tạo nội dung
├─ Khởi tạo task
├─ AI phân tích SGK
├─ AI generate nội dung
└─ Hoàn thành
[████████████████████] 100%
⏱️ Ước tính: 1-3 phút
```

```
💾 Bước 3: Lưu vào hệ thống
├─ Cập nhật node 1
├─ Cập nhật node 2
└─ Cập nhật node 3
[████████████████████] 100%
```

### 5️⃣ Hoàn thành! 🎉

✅ Giáo án đã được tạo thành công!
- Tự động redirect đến trang chi tiết
- Xem nội dung AI đã generate
- Có thể chỉnh sửa thêm

## ⚙️ Cấu hình nâng cao

### Tùy chỉnh Nodes

Khi tạo node mới, cần điền:

1. **Tiêu đề** (bắt buộc)
   - Ví dụ: "IV. ĐÁNH GIÁ"
   - Định dạng rõ ràng

2. **Mô tả** (tùy chọn)
   - Hướng dẫn cho AI
   - Ví dụ: "Phương pháp đánh giá học sinh"

3. **Độ dài nội dung**
   - **Ngắn:** ~100 từ
   - **Trung bình:** ~200-300 từ
   - **Dài:** ~500+ từ

### Lesson ID và Book ID

Để AI tạo nội dung chính xác hơn:

1. **Lesson ID:**
   - Format: `{subject}{grade}-{topic}`
   - Ví dụ: 
     - `toan10-hamso`
     - `ly11-dongluoc`
     - `hoa12-hoacuu`

2. **Book ID:**
   - Format: `{subject}-{grade}`
   - Ví dụ:
     - `toan-10`
     - `ly-11`
     - `hoa-12`

> **Lưu ý:** Nếu không điền, AI vẫn tạo nội dung nhưng sẽ generic hơn.

## 🐛 Xử lý lỗi thường gặp

### Lỗi 1: "Network Error"
**Nguyên nhân:** Không kết nối được API
**Giải pháp:**
- Kiểm tra kết nối internet
- Verify API endpoints đang chạy:
  - SpringBoot: `http://34.126.191.131:8080`
  - FastAPI: `http://34.126.191.131:8000`

### Lỗi 2: "Timeout: AI processing took too long"
**Nguyên nhân:** AI xử lý quá 10 phút
**Giải pháp:**
- Thử lại với nodes ngắn hơn
- Giảm số lượng nodes
- Liên hệ admin kiểm tra AI service

### Lỗi 3: "Authentication failed"
**Nguyên nhân:** Token hết hạn
**Giải pháp:**
- Đăng xuất và đăng nhập lại
- Token tự động refresh

### Lỗi 4: "AI generation failed"
**Nguyên nhân:** AI service có vấn đề
**Giải pháp:**
- Thử lại sau vài phút
- Kiểm tra Lesson ID / Book ID có đúng không
- Liên hệ admin

## 💡 Tips & Tricks

### Tạo giáo án hiệu quả:

1. **Sử dụng template mặc định:**
   - Đã tối ưu cho giáo án chuẩn
   - Tiết kiệm thời gian

2. **Điền Lesson ID / Book ID:**
   - Nội dung chính xác hơn
   - AI dựa vào SGK thực tế

3. **Chọn độ dài phù hợp:**
   - Mục tiêu: medium
   - Nội dung chính: long
   - Phương pháp: medium

4. **Mô tả rõ ràng:**
   - Giúp AI hiểu context
   - Kết quả chất lượng cao hơn

### Quản lý thời gian:

- ⏱️ **Bước 1:** ~5 giây
- ⏱️ **Bước 2:** ~90-180 giây
- ⏱️ **Bước 3:** ~3 giây
- **Tổng:** ~2-3 phút

> **Mẹo:** Chuẩn bị thông tin trước để không timeout!

## 📊 So sánh: Thủ công vs AI

| Tiêu chí | Tạo thủ công | Tạo với AI |
|----------|--------------|------------|
| **Thời gian** | 30-60 phút | 2-3 phút |
| **Chất lượng** | Tùy người viết | Đồng đều, chi tiết |
| **Nội dung** | Tự nghĩ | Dựa trên SGK |
| **Công sức** | Nhiều | Ít |
| **Tùy chỉnh** | Hoàn toàn | Có thể edit sau |

## 🔍 Xem kết quả

Sau khi tạo xong:

1. **Danh sách:** Giáo án mới xuất hiện trong bảng
2. **Chi tiết:** Click vào để xem full content
3. **Chỉnh sửa:** Có thể edit thêm nếu cần
4. **Sử dụng:** Export hoặc in để giảng dạy

## 📞 Hỗ trợ

Nếu gặp vấn đề:

1. Check browser console (F12)
2. Check Network tab
3. Đọc error message
4. Tham khảo `AI-LESSON-PLAN-INTEGRATION.md`
5. Liên hệ technical support

## 🎓 Kết luận

Với AI Lesson Plan Generation, việc tạo giáo án:
- ⚡ Nhanh hơn 10-20 lần
- 📝 Nội dung chi tiết, chuyên nghiệp
- 🎯 Dựa trên SGK chuẩn
- ✅ Dễ dùng, thân thiện

**Chúc bạn tạo giáo án thành công! 🎉**

---

**Tài liệu đầy đủ:** [AI-LESSON-PLAN-INTEGRATION.md](./AI-LESSON-PLAN-INTEGRATION.md)
