# 🔄 LUỒNG TẠO GIÁO ÁN AI - WORKFLOW REVIEW

> Document này mô tả chi tiết luồng tạo giáo án AI để review với Backend & AI team

---

## 📋 TỔNG QUAN LUỒNG

```mermaid
graph TD
    A[User Click "Tạo Giáo Án AI"] --> B[BƯỚC 1: Tạo Template Structure - SpringBoot]
    B --> C[BƯỚC 2: Generate AI Content - FastAPI]
    C --> D[BƯỚC 3: Update Content vào Nodes - SpringBoot]
    D --> E[Success: Refresh List & Close Modal]
```

### 🎯 Mục tiêu
Tạo một giáo án hoàn chỉnh với cấu trúc từ template + nội dung được AI generate

### 🏗️ Kiến trúc 3 tầng
1. **SpringBoot (Port 8080)**: Quản lý cấu trúc giáo án (CRUD lesson plan structure)
2. **FastAPI (Port 8000)**: AI service generate nội dung thông minh
3. **Frontend (Next.js)**: Orchestrate workflow, UI/UX

---

## 🔍 CHI TIẾT TỪNG BƯỚC

## BƯỚC 1: TẠO CẤU TRÚC TEMPLATE (SpringBoot)

### 1.1. Tạo Lesson Plan Template

**API:** `POST /api/v1/lesson-plan-templates`

**Request Body:**
```json
{
  "name": "Giáo án Bài 12: Kiến thức cơ bản",
  "description": "Giáo án AI cho bài học"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Tạo template thành công",
  "data": {
    "id": 123,
    "name": "Giáo án Bài 12: Kiến thức cơ bản",
    "description": "Giáo án AI cho bài học",
    "status": "ACTIVE",
    "createdAt": "2025-12-12T10:00:00Z"
  }
}
```

**❓ QUESTIONS cho BE:**
- Response có wrap trong `data` object không? (Hiện tại code xử lý cả `template.data.id` và `template.id`)
- Status field có bắt buộc không?

---

### 1.2. Tạo Các Nodes Cho Template (LOOP - Không dùng batch)

**API:** `POST /api/v1/lesson-plan-nodes` (gọi 3 lần trong loop)

**Request Body (Example - Node 1):**
```json
{
  "lessonPlanTemplateId": 123,
  "title": "I. Mục tiêu bài học",
  "type": "SECTION",
  "fieldType": "INPUT",
  "orderIndex": 1,
  "parentId": null,
  "metadata": {
    "ai_enabled": true,
    "expected_length": "medium"
  }
}
```

**Response (mỗi node):**
```json
{
  "success": true,
  "message": "Tạo node thành công",
  "data": {
    "id": 456,
    "lessonPlanTemplateId": 123,
    "title": "I. Mục tiêu bài học",
    "type": "SECTION",
    "fieldType": "INPUT",
    "orderIndex": 1,
    "content": "",
    "status": "ACTIVE"
  }
}
```

**Implementation:** Frontend sẽ loop qua 3 nodes và gọi API 3 lần:
```typescript
const createdNodes = [];
for (const node of selectedNodes) {
  const response = await createNode({
    lessonPlanTemplateId: templateId,
    title: node.title,
    type: node.type,
    fieldType: node.fieldType,
    orderIndex: node.orderIndex,
    parentId: null,
    metadata: { ai_enabled: true, expected_length: "medium" }
  });
  createdNodes.push(response.data);
}
```

**✅ CONFIRMED với BE:**
- ✅ Field name: `lessonPlanTemplateId` (KHÔNG phải `lessonPlanId`)
- ✅ `type` field: **CHỈ 4 GIÁ TRỊ**: `SECTION`, `SUBSECTION`, `PARAGRAPH`, `LIST_ITEM` (KHÔNG có `ROOT`, KHÔNG có `TABLE`)
- ✅ `fieldType`: Chỉ `INPUT` và `UPLOAD`
- ✅ Response wrap trong `{data: {...}}`
- ❌ KHÔNG dùng batch API `/batch`, dùng loop call API từng node

---

## BƯỚC 2: GENERATE AI CONTENT (FastAPI)

### 2.1. Chuẩn bị AI Structure

**Data được gửi đến FastAPI:**
```json
{
  "lesson_plan_json": {
    "id": "lesson_plan_template_123",
    "title": "Giáo án Bài 12: Kiến thức cơ bản",
    "type": "SECTION",
    "status": "ACTIVE",
    "children": [
      {
        "id": "456",
        "title": "I. Mục tiêu bài học",
        "content": "",
        "type": "SECTION",
        "status": "ACTIVE",
        "fieldType": "INPUT",
        "orderIndex": 1,
        "lessonPlanTemplateId": 123,
        "parentId": null,
        "metadata": {
          "springboot_node_id": 456,
          "expected_length": "medium"
        }
      },
      {
        "id": "457",
        "title": "II. Nội dung kiến thức",
        "content": "",
        "type": "SECTION",
        "status": "ACTIVE",
        "fieldType": "INPUT",
        "orderIndex": 2,
        "lessonPlanTemplateId": 123,
        "parentId": null,
        "metadata": {
          "springboot_node_id": 457,
          "expected_length": "long"
        }
      },
      {
        "id": "458",
        "title": "III. Phương pháp giảng dạy",
        "content": "",
        "type": "SECTION",
        "status": "ACTIVE",
        "fieldType": "INPUT",
        "orderIndex": 3,
        "lessonPlanTemplateId": 123,
        "parentId": null,
        "metadata": {
          "springboot_node_id": 458,
          "expected_length": "medium"
        }
      }
    ]
  },
  "lesson_id": 789,
  "book_id": 12,
  "user_id": 34,
  "tool_log_id": 56
}
```

**✅ CONFIRMED với AI Team:**
- ✅ Root object **BẮT BUỘC** field `status: "ACTIVE"`
- ✅ Root object `type`: Dùng `"SECTION"` (KHÔNG có `ROOT`)
- ✅ Children nodes **BẮT BUỘC** field `status: "ACTIVE"`
- ✅ **CHỈ 4 NODE TYPES hợp lệ:** `SECTION`, `SUBSECTION`, `LIST_ITEM`, `PARAGRAPH` (KHÔNG có `TABLE`, KHÔNG có `ROOT`)
- ✅ Field `lessonPlanTemplateId` trong children: CÓ THỂ gửi (optional)
- ✅ Field `parentId` trong children: CÓ THỂ gửi (optional)
- ✅ Field `fieldType` trong children: CÓ THỂ gửi (optional)
- ✅ **QUAN TRỌNG:** AI sẽ preserve `metadata.springboot_node_id` để FE mapping ngược lại

---

### 2.2. Khởi tạo AI Task

**API:** `POST /api/v1/generate-lesson-plan-content`

**Request Body:** (Như trên ở mục 2.1)

**Response:**
```json
{
  "task_id": "task_abc123xyz",
  "status": "processing",
  "message": "AI đang xử lý, vui lòng đợi"
}
```

**❓ QUESTIONS cho AI Team:**
- Task ID format như thế nào?
- Có timeout không? Nếu có thì bao lâu?

---

### 2.3. Polling Task Status

**API:** `GET /api/v1/tasks/status/{task_id}`

**Response khi đang xử lý:**
```json
{
  "task_id": "task_abc123xyz",
  "status": "processing",
  "progress": 45
}
```

**Response khi hoàn thành:**
```json
{
  "task_id": "task_abc123xyz",
  "status": "completed",
  "progress": 100
}
```

**Response khi lỗi:**
```json
{
  "task_id": "task_abc123xyz",
  "status": "failed",
  "error": "AI service timeout"
}
```

**❓ QUESTIONS cho AI Team:**
- Các status values: `processing`, `completed`, `failed`? Còn status nào khác không?
- Progress là % từ 0-100?
- Polling interval bao lâu? (hiện tại frontend poll mỗi 3 giây)

---

### 2.4. Lấy Kết Quả AI

**API:** `GET /api/v1/tasks/result/{task_id}`

**Response:**
```json
{
  "task_id": "task_abc123xyz",
  "status": "completed",
  "result": {
    "id": "lesson_plan_template_123",
    "title": "Giáo án Bài 12: Kiến thức cơ bản",
    "type": "SECTION",
    "status": "ACTIVE",
    "children": [
      {
        "id": "456",
        "title": "I. Mục tiêu bài học",
        "content": "Học sinh nắm được các khái niệm cơ bản về...",
        "type": "SECTION",
        "status": "ACTIVE",
        "metadata": {
          "springboot_node_id": 456,
          "ai_generated": true,
          "word_count": 250
        }
      },
      {
        "id": "457",
        "title": "II. Nội dung kiến thức",
        "content": "1. Khái niệm A: ...\n2. Khái niệm B: ...",
        "type": "SECTION",
        "status": "ACTIVE",
        "metadata": {
          "springboot_node_id": 457,
          "ai_generated": true,
          "word_count": 500
        }
      },
      {
        "id": "458",
        "title": "III. Phương pháp giảng dạy",
        "content": "Sử dụng phương pháp thuyết trình kết hợp...",
        "type": "SECTION",
        "status": "ACTIVE",
        "metadata": {
          "springboot_node_id": 458,
          "ai_generated": true,
          "word_count": 300
        }
      }
    ]
  }
}
```

**✅ CONFIRMED với AI Team:**
- ✅ Response structure đúng như trên
- ✅ `metadata.springboot_node_id` **ĐƯỢC PRESERVE** trong response (BẮT BUỘC để FE mapping)
- ✅ AI sẽ thêm metadata: `ai_generated: true`, `word_count: <số từ>`
- ✅ Tất cả metadata gốc từ FE đều được giữ nguyên

---

## BƯỚC 3: UPDATE CONTENT VÀO NODES (SpringBoot)

### 3.1. Extract Node Updates từ AI Result

**Frontend extract data:**
```javascript
const nodeUpdates = aiResult.result.children.map(node => ({
  nodeId: node.metadata.springboot_node_id,  // ID từ SpringBoot
  content: node.content,                      // Nội dung AI generate
  metadata: {
    ai_generated: true,
    word_count: node.metadata.word_count
  }
}));
```

**Result:**
```json
[
  {
    "nodeId": 456,
    "content": "Học sinh nắm được các khái niệm cơ bản về...",
    "metadata": {
      "ai_generated": true,
      "word_count": 250
    }
  },
  {
    "nodeId": 457,
    "content": "1. Khái niệm A: ...\n2. Khái niệm B: ...",
    "metadata": {
      "ai_generated": true,
      "word_count": 500
    }
  },
  {
    "nodeId": 458,
    "content": "Sử dụng phương pháp thuyết trình kết hợp...",
    "metadata": {
      "ai_generated": true,
      "word_count": 300
    }
  }
]
```

---

### 3.2. Update Nodes (LOOP - Không dùng batch)

**API:** `PUT /api/v1/lesson-plan-nodes/{nodeId}` (gọi 3 lần trong loop)

**Request Body (Example - Node 456):**
```json
{
  "content": "Học sinh nắm được các khái niệm cơ bản về...",
  "metadata": {
    "ai_generated": true,
    "word_count": 250
  }
}
```

**Response (mỗi node):**
```json
{
  "success": true,
  "message": "Cập nhật node thành công",
  "data": {
    "id": 456,
    "content": "Học sinh nắm được các khái niệm cơ bản về...",
    "metadata": {
      "ai_generated": true,
      "word_count": 250
    },
    "updatedAt": "2025-12-12T10:05:00Z"
  }
}
```

**Implementation:** Frontend sẽ loop qua AI results và update từng node:
```typescript
for (const aiNode of aiResult.result.children) {
  const nodeId = aiNode.metadata.springboot_node_id;
  await updateNode(nodeId, {
    content: aiNode.content,
    metadata: {
      ai_generated: true,
      word_count: aiNode.metadata.word_count
    }
  });
}
```

**✅ CONFIRMED với BE:**
- ✅ API: `PUT /api/v1/lesson-plan-nodes/{nodeId}` (từng node một)
- ✅ Metadata: MERGE với metadata cũ (không overwrite)
- ❌ KHÔNG có batch update API `/batch-update`

---

## 🐛 CURRENT ERROR

### Error Message:
```
ReferenceError: templateId is not defined
at createLessonPlanWithAI (aiLessonPlanServices.ts:249:35)
```

### Error Context:
```typescript
const aiStructure: AILessonPlanStructure = {
  id: `lesson_plan_template_${templateId}`,  // ❌ templateId UNDEFINED
  title: templateName,
  type: "SECTION",
  status: "ACTIVE",
  children: createdNodes.map(...)
};
```

### Root Cause:
Response từ API `POST /api/v1/lesson-plan-templates` không trả về `templateId` hoặc frontend không extract đúng.

**Current extraction code:**
```typescript
const templateResponse = await createTemplate({
  name: templateName,
  description: `Giáo án AI cho ${lessonName}`,
});

const templateId = templateResponse.data?.id || templateResponse.id;
```

**❓ QUESTIONS cho BE:**
- Response structure chính xác của `POST /api/v1/lesson-plan-templates` là gì?
- Field ID có tên là `id` hay `templateId`?
- Có wrap trong `data` object không?

---

## 📊 DATA FLOW SUMMARY

```
┌─────────────────────────────────────────────────────────────────┐
│ USER INPUT                                                      │
├─────────────────────────────────────────────────────────────────┤
│ - Template Name: "Giáo án Bài 12: Kiến thức cơ bản"           │
│ - Lesson ID: 789                                               │
│ - Book ID: 12                                                  │
│ - User ID: 34                                                  │
│ - Selected Nodes: [node1, node2, node3]                       │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 1: SpringBoot - Create Structure                          │
├─────────────────────────────────────────────────────────────────┤
│ API 1: POST /api/v1/lesson-plan-templates                      │
│   Input: {name, description}                                   │
│   Output: {id: 123, name, ...}                                │
│                                                                 │
│ API 2: POST /api/v1/lesson-plan-nodes/batch                    │
│   Input: {nodes: [{lessonPlanTemplateId: 123, ...}]}          │
│   Output: [{id: 456, ...}, {id: 457, ...}, {id: 458, ...}]    │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 2: FastAPI - Generate AI Content                          │
├─────────────────────────────────────────────────────────────────┤
│ API 3: POST /api/v1/generate-lesson-plan-content               │
│   Input: {lesson_plan_json: {id, type, status, children}, ...}│
│   Output: {task_id: "task_abc123", status: "processing"}      │
│                                                                 │
│ API 4: GET /api/v1/tasks/status/{task_id} (polling every 3s)  │
│   Output: {status: "processing", progress: 45}                │
│   Final: {status: "completed", progress: 100}                 │
│                                                                 │
│ API 5: GET /api/v1/tasks/result/{task_id}                      │
│   Output: {result: {children: [{content: "AI content"}]}}     │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ STEP 3: SpringBoot - Update Content                            │
├─────────────────────────────────────────────────────────────────┤
│ API 6: PUT /api/v1/lesson-plan-nodes/batch-update              │
│   Input: {updates: [{nodeId: 456, content: "..."}, ...]}      │
│   Output: {updated: 3, failed: 0}                             │
└─────────────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────────────┐
│ SUCCESS                                                         │
├─────────────────────────────────────────────────────────────────┤
│ - Close modal                                                  │
│ - Refresh lesson plan list                                    │
│ - Show success toast                                           │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🔧 CURRENT IMPLEMENTATION

### Frontend Code Location
- **Service:** `src/services/aiLessonPlanServices.ts`
- **Hook:** `src/hooks/useAiLessonPlanGeneration.ts`
- **Component:** `src/app/admin/lesson-plans/page.tsx`
- **Types:** `src/types/index.ts`
- **Endpoints:** `src/constants/apiEndpoints.ts`

### Key Configuration
```typescript
// src/constants/apiEndpoints.ts
export const API_ENDPOINTS = {
  // SpringBoot APIs
  LESSON_PLAN_TEMPLATES: "/lesson-plan-templates",
  LESSON_PLAN_NODES_BATCH: "/lesson-plan-nodes/batch",
  LESSON_PLAN_NODES_BATCH_UPDATE: "/lesson-plan-nodes/batch-update",
  
  // FastAPI APIs (with /api/v1 prefix)
  LESSON_PLAN_GENERATION: "/api/v1/generate-lesson-plan-content",
  AI_TASK_STATUS: "/api/v1/tasks/status",
  AI_TASK_RESULT: "/api/v1/tasks/result",
};
```

---

## ✅ CONFIRMED API CONTRACT

### SpringBoot APIs:

1. **Template Creation Response:**
   - ✅ Response structure: `{success: true, data: {id: 123, ...}}`
   - ✅ Field name: `id` (access via `response.data.id`)

2. **Node Creation/Update:**
   - ✅ Field name: `lessonPlanTemplateId` (KHÔNG phải `lessonPlanId`)
   - ✅ Create API: `POST /api/v1/lesson-plan-nodes` (từng node, KHÔNG batch)
   - ✅ Update API: `PUT /api/v1/lesson-plan-nodes/{nodeId}` (từng node, KHÔNG batch)
   - ❌ KHÔNG có batch APIs `/batch` hoặc `/batch-update`

3. **Node Types:**
   - ✅ **CHỈ 4 GIÁ TRỊ hợp lệ:** `SECTION`, `SUBSECTION`, `PARAGRAPH`, `LIST_ITEM`
   - ❌ KHÔNG có `ROOT`
   - ❌ KHÔNG có `TABLE`
   - ✅ `fieldType`: Chỉ `INPUT` và `UPLOAD`

### FastAPI/AI APIs:

4. **Required Fields:**
   - ✅ Root object **BẮT BUỘC** field `status: "ACTIVE"`
   - ✅ Root object `type`: Dùng `"SECTION"` (KHÔNG có `ROOT`)
   - ✅ Children nodes **BẮT BUỘC** field `status: "ACTIVE"`

5. **Optional Fields:**
   - ✅ Children có thể gửi: `lessonPlanTemplateId`, `parentId`, `fieldType` (optional)
   - ✅ Required trong children: `id`, `title`, `type`, `status`, `content`, `metadata`

6. **Metadata Preservation:**
   - ✅ Field `metadata.springboot_node_id` **ĐƯỢC PRESERVE** (BẮT BUỘC để FE mapping)
   - ✅ AI thêm metadata: `ai_generated: true`, `word_count: <number>`

7. **Task Processing:**
   - ✅ Polling interval: 3 giây (recommended)
   - ✅ Status values: `processing`, `completed`, `failed`
   - ⚠️ Timeout: Chưa confirm (cần hỏi AI team)

---

## 📝 NOTES & ACTION ITEMS

### ✅ Đã Confirm với BE/AI Team:
- ✅ Node types: CHỈ 4 types (`SECTION`, `SUBSECTION`, `PARAGRAPH`, `LIST_ITEM`)
- ✅ Field naming: `lessonPlanTemplateId` (KHÔNG phải `lessonPlanId`)
- ✅ No batch APIs: Dùng loop để create/update từng node
- ✅ Status field: BẮT BUỘC ở root và children
- ✅ Metadata preservation: `springboot_node_id` được giữ nguyên

### 🔧 FE Team Cần Sửa:
- ❌ Bỏ TABLE khỏi type validation trong `types/index.ts`
- ❌ Sửa `aiLessonPlanServices.ts` dùng loop thay vì batch APIs
- ❌ Fix error `templateId is not defined` - extract đúng từ `response.data.id`

### ⚠️ Chưa Confirm:
- ⚠️ AI timeout là bao lâu?
- ⚠️ Retry logic khi task failed?

---

**Created:** 2025-12-12  
**Last Updated:** 2025-12-12  
**Status:** ✅ Contract Confirmed - Ready for Implementation
