# 🔧 Sửa lỗi 400 Bad Request - AI Lesson Plan Feature

## ❌ Vấn đề gặp phải

Khi người dùng click "Tạo với AI" và submit form, hệ thống báo lỗi:
```
Error: Request failed with status code 400
POST http://34.126.191.131:8080/lesson-plan-template-service/api/lesson-nodes
```

## 🔍 Nguyên nhân

Sau khi đọc Swagger documentation từ cả 2 services (SpringBoot và FastAPI), phát hiện **request body không đúng với API contract**:

### Lỗi 1: `fieldType` sai giá trị
- ❌ **Code cũ**: `"INPUT" | "REFERENCES" | "TABLE"`
- ✅ **Swagger API**: `"INPUT" | "UPLOAD"`

### Lỗi 2: Gửi `metadata` field không được API hỗ trợ
- ❌ **Code cũ**: Gửi `metadata` object trong CreateLessonNodeRequest
- ✅ **Swagger API**: SpringBoot API **KHÔNG hỗ trợ** metadata field trong request body

### Lỗi 3: `content` field không bắt buộc nhưng code gửi ""
- ❌ **Code cũ**: `content: ""` (empty string)
- ✅ **Sửa**: `content: nodeDef.description || ""` (có nội dung mặc định)

## 🛠️ Các file đã sửa

### 1. `src/types/index.ts`

#### Sửa `CreateLessonNodeRequest`
```typescript
export interface CreateLessonNodeRequest {
  lessonPlanTemplateId: number;
  parentId?: number | null;
  title: string;
  content?: string; // Optional theo Swagger
  description?: string;
  fieldType: "INPUT" | "UPLOAD"; // ✅ Chỉnh theo Swagger API
  type: "SECTION" | "SUBSECTION" | "LIST_ITEM" | "PARAGRAPH";
  orderIndex: number;
  // ✅ Xóa metadata - SpringBoot không hỗ trợ
}
```

#### Sửa `UpdateLessonNodeRequest`
```typescript
export interface UpdateLessonNodeRequest {
  title?: string;
  content?: string;
  description?: string;
  fieldType: "INPUT" | "UPLOAD"; // ✅ Bắt buộc theo Swagger
  type?: "SECTION" | "SUBSECTION" | "LIST_ITEM" | "PARAGRAPH";
  orderIndex?: number;
  // ✅ Không sử dụng metadata
}
```

#### Sửa `LessonPlanNode`
```typescript
export interface LessonPlanNode {
  // ... other fields
  fieldType: "INPUT" | "UPLOAD"; // ✅ Chỉnh theo Swagger API
  // ... rest
}
```

### 2. `src/services/aiLessonPlanServices.ts`

#### Sửa hàm `createLessonPlanWithAI` (Line 107-118)
```typescript
for (let i = 0; i < nodeDefs.length; i++) {
  const nodeDef = nodeDefs[i];
  const node = await createLessonNode({
    lessonPlanTemplateId: lessonPlanId,
    parentId: null,
    title: nodeDef.title,
    content: nodeDef.description || "", // ✅ Dùng description làm content tạm
    description: nodeDef.description,
    fieldType: "INPUT",
    type: "SECTION",
    orderIndex: nodeDef.orderIndex,
    // ✅ Không gửi metadata - SpringBoot API không hỗ trợ
  });
  // ...
}
```

## 📋 API Contract từ Swagger

### SpringBoot API - CreateLessonPlanNodeRequest
```json
{
  "lessonPlanTemplateId": 101,       // required
  "parentId": 2,                      // optional
  "title": "Mục tiêu bài học",        // required
  "content": "Học sinh hiểu...",      // optional
  "description": "...",               // optional
  "fieldType": "INPUT",               // required, "INPUT" | "UPLOAD"
  "type": "SECTION",                  // required
  "orderIndex": 1                     // required
  // metadata: KHÔNG HỖ TRỢ!
}
```

### SpringBoot API - UpdateLessonPlanNodeRequest
```json
{
  "title": "Updated title",           // optional
  "content": "Updated content",       // optional
  "description": "...",               // optional
  "fieldType": "INPUT",               // required
  "type": "SUBSECTION",               // optional
  "orderIndex": 2                     // optional
  // metadata: KHÔNG HỖ TRỢ!
}
```

### FastAPI - LessonPlanContentRequest
```json
{
  "lesson_plan_json": {...},          // required
  "lesson_id": "hoa12_bai1",          // optional
  "book_id": "hoa12",                 // optional
  "user_id": "user123",               // optional
  "tool_log_id": 123                  // optional
}
```

## ✅ Kết quả

- ✅ **0 TypeScript compilation errors**
- ✅ Request body đúng format với SpringBoot API
- ✅ Không còn gửi metadata field không hợp lệ
- ✅ fieldType đúng giá trị theo Swagger: "INPUT" hoặc "UPLOAD"
- ✅ Sẵn sàng để test lại workflow

## 🧪 Cách test

1. Mở trang `/admin/lesson-plans/lesson-plans-template`
2. Click nút **"Tạo với AI"** (gradient xanh-tím)
3. Điền form:
   - Tên giáo án: "Test AI Lesson"
   - 3 nodes mặc định
4. Click **"Bắt đầu tạo với AI"**
5. Xem progress modal hiển thị 3 bước:
   - 📋 BƯỚC 1: Tạo cấu trúc
   - 🤖 BƯỚC 2: AI sinh nội dung
   - 💾 BƯỚC 3: Lưu kết quả

## 📝 Tài liệu tham khảo

- **SpringBoot Swagger**: http://34.126.191.131:8080/webjars/swagger-ui/index.html
- **FastAPI Swagger**: http://34.124.179.17:8000/api/v1/docs#
- **Lesson AI Spec**: [lesson-ai.md](./lesson-ai.md) (1221 lines)
- **Implementation Guide**: [AI-LESSON-PLAN-INTEGRATION.md](./AI-LESSON-PLAN-INTEGRATION.md)
