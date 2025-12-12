# 🎯 HƯỚNG DẪN CHI TIẾT: TẠO GIÁO ÁN AI (3 BƯỚC)

## 📋 Overview

Quy trình tạo giáo án AI chia làm **3 bước rõ ràng**, Frontend gọi API tuần tự:

```
BƯỚC 1: SpringBoot → Tạo cấu trúc giáo án (rỗng)
BƯỚC 2: FastAPI → AI tạo nội dung chi tiết
BƯỚC 3: SpringBoot → Lưu nội dung AI vào structure
```

---

## 🔵 BƯỚC 1: TẠO STRUCTURE TRONG SPRINGBOOT

### **Mục đích:**
Tạo khung giáo án với nodes rỗng (chưa có content) trong database PostgreSQL của SpringBoot.

---

### **1.1. Tạo Lesson Plan Template**

#### **API Endpoint:**
```
POST http://34.126.191.131:8080/api/lesson-plan-templates
```

#### **Request Headers:**
```http
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### **Request Body:**
```json
{
  "name": "Bài 1: Hàm số bậc nhất",
  "description": "Giáo án môn Toán lớp 10, chương 1"
}
```

#### **Response (Success - 200):**
```json
{
  "id": 101,
  "name": "Bài 1: Hàm số bậc nhất",
  "description": "Giáo án môn Toán lớp 10, chương 1",
  "status": "ACTIVE",
  "createdAt": "2024-12-11T10:00:00",
  "updatedAt": "2024-12-11T10:00:00"
}
```

#### **Lưu lại:**
```javascript
const lessonPlanId = 101; // Dùng cho bước tiếp theo
```

#### **Curl Example:**
```bash
curl -X POST "http://34.126.191.131:8080/api/lesson-plan-templates" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Bài 1: Hàm số bậc nhất",
    "description": "Giáo án môn Toán lớp 10, chương 1"
  }'
```

---

### **1.2. Tạo Node 1: Mục tiêu bài học**

#### **API Endpoint:**
```
POST http://34.126.191.131:8080/api/lesson-nodes
```

#### **Request Body:**
```json
{
  "lessonPlanTemplateId": 101,
  "parentId": null,
  "title": "I. MỤC TIÊU BÀI HỌC",
  "content": "",
  "description": "Mục tiêu về kiến thức, kỹ năng và thái độ",
  "fieldType": "INPUT",
  "type": "SECTION",
  "orderIndex": 1,
  "metadata": {
    "ai_enabled": true,
    "expected_length": "medium"
  }
}
```

#### **Response:**
```json
{
  "id": 1001,
  "lessonPlanTemplateId": 101,
  "parentId": null,
  "title": "I. MỤC TIÊU BÀI HỌC",
  "content": "",
  "description": "Mục tiêu về kiến thức, kỹ năng và thái độ",
  "fieldType": "INPUT",
  "type": "SECTION",
  "orderIndex": 1,
  "metadata": {
    "ai_enabled": true,
    "expected_length": "medium"
  },
  "status": "ACTIVE",
  "children": []
}
```

#### **Lưu lại:**
```javascript
const node1Id = 1001;
```

---

### **1.3. Tạo Node 2: Nội dung bài học**

#### **Request Body:**
```json
{
  "lessonPlanTemplateId": 101,
  "parentId": null,
  "title": "II. NỘI DUNG BÀI HỌC",
  "content": "",
  "description": "Nội dung kiến thức chi tiết",
  "fieldType": "INPUT",
  "type": "SECTION",
  "orderIndex": 2,
  "metadata": {
    "ai_enabled": true,
    "expected_length": "long"
  }
}
```

#### **Response:**
```json
{
  "id": 1002,
  "lessonPlanTemplateId": 101,
  "title": "II. NỘI DUNG BÀI HỌC",
  "content": "",
  ...
}
```

#### **Lưu lại:**
```javascript
const node2Id = 1002;
```

---

### **1.4. Tạo Node 3: Phương pháp giảng dạy**

#### **Request Body:**
```json
{
  "lessonPlanTemplateId": 101,
  "parentId": null,
  "title": "III. PHƯƠNG PHÁP GIẢNG DẠY",
  "content": "",
  "description": "Các phương pháp và kỹ thuật dạy học",
  "fieldType": "INPUT",
  "type": "SECTION",
  "orderIndex": 3,
  "metadata": {
    "ai_enabled": true,
    "expected_length": "medium"
  }
}
```

#### **Response:**
```json
{
  "id": 1003,
  "lessonPlanTemplateId": 101,
  "title": "III. PHƯƠNG PHÁP GIẢNG DẠY",
  "content": "",
  ...
}
```

#### **Lưu lại:**
```javascript
const node3Id = 1003;
```

---

### **1.5. KẾT QUẢ SAU BƯỚC 1:**

**Database PostgreSQL (SpringBoot):**

**Table: lesson_plan_templates**
```sql
id  | name                      | description                        | status  
101 | Bài 1: Hàm số bậc nhất    | Giáo án môn Toán lớp 10, chương 1 | ACTIVE
```

**Table: lesson_plan_nodes**
```sql
id   | lesson_plan_id | parent_id | title                       | content | order_index
1001 | 101            | NULL      | I. MỤC TIÊU BÀI HỌC         | ""      | 1
1002 | 101            | NULL      | II. NỘI DUNG BÀI HỌC        | ""      | 2
1003 | 101            | NULL      | III. PHƯƠNG PHÁP GIẢNG DẠY  | ""      | 3
```

**→ Có cấu trúc giáo án, nhưng content đang RỖNG!**

---

### **1.6. CODE JAVASCRIPT BƯỚC 1:**

```javascript
async function step1_CreateStructure() {
  const SPRINGBOOT_API = "http://34.126.191.131:8080/api";
  const token = localStorage.getItem("auth_token");
  
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
  
  // 1.1. Create lesson plan template
  const templateResponse = await fetch(`${SPRINGBOOT_API}/lesson-plan-templates`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      name: "Bài 1: Hàm số bậc nhất",
      description: "Giáo án môn Toán lớp 10, chương 1"
    })
  });
  
  const template = await templateResponse.json();
  const lessonPlanId = template.id;
  console.log(`✅ Created template ID: ${lessonPlanId}`);
  
  // 1.2-1.4. Create nodes
  const nodeDefinitions = [
    {
      title: "I. MỤC TIÊU BÀI HỌC",
      description: "Mục tiêu về kiến thức, kỹ năng và thái độ",
      orderIndex: 1,
      expectedLength: "medium"
    },
    {
      title: "II. NỘI DUNG BÀI HỌC",
      description: "Nội dung kiến thức chi tiết",
      orderIndex: 2,
      expectedLength: "long"
    },
    {
      title: "III. PHƯƠNG PHÁP GIẢNG DẠY",
      description: "Các phương pháp và kỹ thuật dạy học",
      orderIndex: 3,
      expectedLength: "medium"
    }
  ];
  
  const createdNodes = [];
  
  for (const nodeDef of nodeDefinitions) {
    const nodeResponse = await fetch(`${SPRINGBOOT_API}/lesson-nodes`, {
      method: "POST",
      headers,
      body: JSON.stringify({
        lessonPlanTemplateId: lessonPlanId,
        parentId: null,
        title: nodeDef.title,
        content: "",  // RỖNG - sẽ fill bằng AI
        description: nodeDef.description,
        fieldType: "INPUT",
        type: "SECTION",
        orderIndex: nodeDef.orderIndex,
        metadata: {
          ai_enabled: true,
          expected_length: nodeDef.expectedLength
        }
      })
    });
    
    const node = await nodeResponse.json();
    createdNodes.push(node);
    console.log(`✅ Created node ${node.id}: ${node.title}`);
  }
  
  return { 
    lessonPlanId, 
    nodes: createdNodes 
  };
}

// Usage:
const { lessonPlanId, nodes } = await step1_CreateStructure();
console.log("BƯỚC 1 HOÀN THÀNH!");
console.log(`Lesson Plan ID: ${lessonPlanId}`);
console.log(`Nodes: ${nodes.map(n => n.id).join(", ")}`);
```

---

## 🟢 BƯỚC 2: GENERATE AI CONTENT (FASTAPI)

### **Mục đích:**
Gọi FastAPI Python để AI tạo nội dung chi tiết cho từng node dựa trên sách giáo khoa.

---

### **2.1. Chuẩn bị Structure cho AI**

```javascript
// Convert SpringBoot nodes → FastAPI format
const aiStructure = {
  id: "root",
  title: "Giáo án: Bài 1 - Hàm số bậc nhất",
  type: "ROOT",
  children: nodes.map(node => ({
    id: `node_${node.id}`,           // Unique ID cho AI
    title: node.title,                 // "I. MỤC TIÊU BÀI HỌC"
    content: "",                       // Rỗng - AI sẽ fill
    type: node.type,                   // "SECTION"
    fieldType: "TEXT",                 // AI generate text
    orderIndex: node.orderIndex,       // Thứ tự
    
    // QUAN TRỌNG: Lưu ID SpringBoot để update sau
    metadata: {
      springboot_node_id: node.id,     // 1001, 1002, 1003
      expected_length: node.metadata.expected_length
    }
  }))
};
```

**AI Structure Example:**
```json
{
  "id": "root",
  "title": "Giáo án: Bài 1 - Hàm số bậc nhất",
  "type": "ROOT",
  "children": [
    {
      "id": "node_1001",
      "title": "I. MỤC TIÊU BÀI HỌC",
      "content": "",
      "type": "SECTION",
      "fieldType": "TEXT",
      "orderIndex": 1,
      "metadata": {
        "springboot_node_id": 1001,
        "expected_length": "medium"
      }
    },
    {
      "id": "node_1002",
      "title": "II. NỘI DUNG BÀI HỌC",
      "content": "",
      "type": "SECTION",
      "fieldType": "TEXT",
      "orderIndex": 2,
      "metadata": {
        "springboot_node_id": 1002,
        "expected_length": "long"
      }
    },
    {
      "id": "node_1003",
      "title": "III. PHƯƠNG PHÁP GIẢNG DẠY",
      "content": "",
      "type": "SECTION",
      "fieldType": "TEXT",
      "orderIndex": 3,
      "metadata": {
        "springboot_node_id": 1003,
        "expected_length": "medium"
      }
    }
  ]
}
```

---

### **2.2. Gọi FastAPI Create Task**

#### **API Endpoint:**
```
POST http://34.124.179.17:8000/api/v1/lesson/generate-lesson-plan-content
```

#### **Request Body:**
```json
{
  "lesson_plan_json": {
    "id": "root",
    "title": "Giáo án: Bài 1 - Hàm số bậc nhất",
    "type": "ROOT",
    "children": [
      {
        "id": "node_1001",
        "title": "I. MỤC TIÊU BÀI HỌC",
        "content": "",
        "type": "SECTION",
        "fieldType": "TEXT",
        "orderIndex": 1,
        "metadata": {
          "springboot_node_id": 1001,
          "expected_length": "medium"
        }
      },
      {
        "id": "node_1002",
        "title": "II. NỘI DUNG BÀI HỌC",
        "content": "",
        "type": "SECTION",
        "fieldType": "TEXT",
        "orderIndex": 2,
        "metadata": {
          "springboot_node_id": 1002,
          "expected_length": "long"
        }
      },
      {
        "id": "node_1003",
        "title": "III. PHƯƠNG PHÁP GIẢNG DẠY",
        "content": "",
        "type": "SECTION",
        "fieldType": "TEXT",
        "orderIndex": 3,
        "metadata": {
          "springboot_node_id": 1003,
          "expected_length": "medium"
        }
      }
    ]
  },
  "lesson_id": "toan10-hamso",
  "book_id": "toan-10",
  "user_id": "user123",
  "tool_log_id": 1733901234567
}
```

#### **Request Parameters:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `lesson_plan_json` | Object | ✅ | Cấu trúc cây giáo án |
| `lesson_id` | String | ❌ | ID bài học trong SGK (để AI tìm content) |
| `book_id` | String | ❌ | ID sách giáo khoa trong Qdrant |
| `user_id` | String | ✅ | ID user tạo giáo án |
| `tool_log_id` | Number | ❌ | ID để tracking |

#### **Response (Success - 200):**
```json
{
  "task_id": "task_abc123def456",
  "status": "processing",
  "message": "Đã tạo task xử lý giáo án thành công",
  "created_at": "2024-12-11T10:05:30.123Z"
}
```

#### **Lưu lại:**
```javascript
const taskId = "task_abc123def456"; // Dùng để poll status
```

#### **Curl Example:**
```bash
curl -X POST "http://34.124.179.17:8000/api/v1/lesson/generate-lesson-plan-content" \
  -H "Content-Type: application/json" \
  -d '{
    "lesson_plan_json": { ... },
    "lesson_id": "toan10-hamso",
    "book_id": "toan-10",
    "user_id": "user123",
    "tool_log_id": 1733901234567
  }'
```

---

### **2.3. Poll Task Status (Lặp lại cho đến khi xong)**

#### **API Endpoint:**
```
GET http://34.124.179.17:8000/api/v1/tasks/status/{task_id}
```

#### **Request:**
```
GET http://34.124.179.17:8000/api/v1/tasks/status/task_abc123def456
```

#### **Response lúc đang xử lý (Processing):**
```json
{
  "task_id": "task_abc123def456",
  "status": "processing",
  "progress": 30,
  "message": "Đang tạo nội dung node 1/3: I. MỤC TIÊU BÀI HỌC",
  "created_at": "2024-12-11T10:05:30.123Z",
  "updated_at": "2024-12-11T10:06:15.456Z",
  "data": {
    "lesson_plan_json": { ... },
    "lesson_id": "toan10-hamso",
    "user_id": "user123"
  }
}
```

**→ Frontend hiển thị progress bar: 30%**

#### **Poll tiếp sau 2 giây:**
```json
{
  "task_id": "task_abc123def456",
  "status": "processing",
  "progress": 60,
  "message": "Đang tạo nội dung node 2/3: II. NỘI DUNG BÀI HỌC",
  ...
}
```

**→ Progress bar: 60%**

#### **Poll tiếp:**
```json
{
  "task_id": "task_abc123def456",
  "status": "processing",
  "progress": 90,
  "message": "Đang tạo nội dung node 3/3: III. PHƯƠNG PHÁP GIẢNG DẠY",
  ...
}
```

**→ Progress bar: 90%**

---

### **2.4. Nhận Kết Quả Final (Completed)**

#### **Response khi hoàn thành:**
```json
{
  "task_id": "task_abc123def456",
  "status": "completed",
  "progress": 100,
  "message": "Tác vụ đã hoàn thành thành công. Đã tạo 3 item.",
  "created_at": "2024-12-11T10:05:30.123Z",
  "completed_at": "2024-12-11T10:08:45.789Z",
  "result": {
    "success": true,
    "output": {
      "id": "root",
      "title": "Giáo án: Bài 1 - Hàm số bậc nhất",
      "type": "ROOT",
      "children": [
        {
          "id": "node_1001",
          "title": "I. MỤC TIÊU BÀI HỌC",
          "content": "**1. Về kiến thức:**\n- Học sinh hiểu được khái niệm hàm số bậc nhất\n- Nắm được dạng tổng quát y = ax + b (a ≠ 0)\n- Hiểu được tập xác định và tập giá trị của hàm số bậc nhất\n\n**2. Về kỹ năng:**\n- Xác định được hệ số a, b trong hàm số bậc nhất\n- Vẽ được đồ thị hàm số y = ax + b\n- Xác định được tính đồng biến, nghịch biến của hàm số\n\n**3. Về thái độ:**\n- Rèn luyện tính cẩn thận, chính xác khi vẽ đồ thị\n- Phát triển tư duy logic, khả năng trừu tượng hóa",
          "type": "SECTION",
          "fieldType": "TEXT",
          "orderIndex": 1,
          "metadata": {
            "springboot_node_id": 1001,
            "expected_length": "medium",
            "ai_generated": true,
            "word_count": 156
          }
        },
        {
          "id": "node_1002",
          "title": "II. NỘI DUNG BÀI HỌC",
          "content": "**1. Định nghĩa hàm số bậc nhất:**\n\nHàm số bậc nhất là hàm số có dạng:\n```\ny = f(x) = ax + b\n```\nTrong đó:\n- a, b là các hằng số\n- a ≠ 0\n- x là biến số\n\n**Ví dụ:**\n- y = 2x + 3 (a = 2, b = 3)\n- y = -x + 1 (a = -1, b = 1)\n- y = 5x (a = 5, b = 0)\n\n**2. Tập xác định:**\n- D = ℝ (tập hợp số thực)\n- Hàm số xác định với mọi giá trị x\n\n**3. Tính chất:**\n\n**a) Tính đồng biến - nghịch biến:**\n- Nếu a > 0: Hàm số đồng biến trên ℝ\n  + x₁ < x₂ ⟹ f(x₁) < f(x₂)\n- Nếu a < 0: Hàm số nghịch biến trên ℝ\n  + x₁ < x₂ ⟹ f(x₁) > f(x₂)\n\n**b) Đồ thị:**\n- Đồ thị hàm số y = ax + b là đường thẳng\n- Cắt trục Oy tại điểm (0, b)\n- Cắt trục Ox tại điểm (-b/a, 0)\n- Hệ số góc: a\n  + a > 0: đường thẳng đi lên từ trái sang phải\n  + a < 0: đường thẳng đi xuống từ trái sang phải\n\n**4. Cách vẽ đồ thị:**\n\n**Bước 1:** Tìm 2 điểm thuộc đồ thị\n- Cho x = 0 ⟹ y = b ⟹ A(0, b)\n- Cho y = 0 ⟹ x = -b/a ⟹ B(-b/a, 0)\n\n**Bước 2:** Vẽ đường thẳng đi qua 2 điểm A, B\n\n**Ví dụ:** Vẽ đồ thị hàm số y = 2x - 4\n- A(0, -4): cắt trục Oy\n- B(2, 0): cắt trục Ox\n- Vẽ đường thẳng AB\n\n**5. Sự tương giao của hai đồ thị:**\n\nCho hai hàm số:\n- y = a₁x + b₁\n- y = a₂x + b₂\n\n**a) Hai đường thẳng song song:**\n- a₁ = a₂ và b₁ ≠ b₂\n\n**b) Hai đường thẳng trùng nhau:**\n- a₁ = a₂ và b₁ = b₂\n\n**c) Hai đường thẳng cắt nhau:**\n- a₁ ≠ a₂\n- Tọa độ giao điểm: giải hệ phương trình\n  ```\n  a₁x + b₁ = a₂x + b₂\n  ```\n\n**Bài tập vận dụng:**\n\n1. Cho hàm số y = 3x - 2\n   a) Xác định a, b\n   b) Tính f(0), f(1), f(-2)\n   c) Vẽ đồ thị hàm số\n\n2. Cho hai hàm số y = 2x + 1 và y = -x + 4\n   a) Vẽ đồ thị hai hàm số trên cùng hệ trục\n   b) Tìm tọa độ giao điểm",
          "type": "SECTION",
          "fieldType": "TEXT",
          "orderIndex": 2,
          "metadata": {
            "springboot_node_id": 1002,
            "expected_length": "long",
            "ai_generated": true,
            "word_count": 687
          }
        },
        {
          "id": "node_1003",
          "title": "III. PHƯƠNG PHÁP GIẢNG DẠY",
          "content": "**1. Phương pháp thuyết trình:**\n- Giảng giải lý thuyết về định nghĩa hàm số bậc nhất\n- Trình bày các tính chất, công thức\n- Thời gian: 10 phút\n\n**2. Phương pháp vấn đáp:**\n- Đặt câu hỏi gợi mở để học sinh tự rút ra định nghĩa\n- Ví dụ:\n  + \"Em có nhận xét gì về dạng của các hàm số y = 2x + 1, y = -3x + 5?\"\n  + \"Khi nào hàm số đồng biến? Nghịch biến?\"\n- Thời gian: 5 phút\n\n**3. Phương pháp hoạt động nhóm:**\n- Chia lớp thành 4 nhóm\n- Mỗi nhóm vẽ đồ thị một hàm số khác nhau\n- Các nhóm trình bày kết quả\n- Thời gian: 15 phút\n\n**4. Phương pháp thực hành:**\n- Học sinh làm bài tập vận dụng\n- Giáo viên hướng dẫn, chữa bài\n- Thời gian: 10 phút\n\n**5. Sử dụng công nghệ:**\n- Dùng GeoGebra để vẽ đồ thị động\n- Minh họa sự thay đổi của đồ thị khi thay đổi a, b\n- Học sinh quan sát và rút ra kết luận\n\n**6. Tổ chức lớp học:**\n- Hoạt động cá nhân: 30%\n- Hoạt động nhóm: 40%\n- Thuyết trình GV: 30%",
          "type": "SECTION",
          "fieldType": "TEXT",
          "orderIndex": 3,
          "metadata": {
            "springboot_node_id": 1003,
            "expected_length": "medium",
            "ai_generated": true,
            "word_count": 312
          }
        }
      ]
    },
    "statistics": {
      "total_nodes": 3,
      "content_nodes_processed": 3,
      "lesson_content_used": true,
      "total_words": 1155,
      "processing_time_seconds": 195
    },
    "total_count": 3
  }
}
```

**→ AI đã generate nội dung CHI TIẾT cho cả 3 nodes!**

---

### **2.5. CODE JAVASCRIPT BƯỚC 2:**

```javascript
async function step2_GenerateAIContent(lessonPlanId, nodes) {
  const FASTAPI_API = "http://34.124.179.17:8000/api/v1";
  
  // 2.1. Prepare AI structure
  const aiStructure = {
    id: "root",
    title: `Giáo án ID ${lessonPlanId}`,
    type: "ROOT",
    children: nodes.map(node => ({
      id: `node_${node.id}`,
      title: node.title,
      content: "",
      type: node.type,
      fieldType: "TEXT",
      orderIndex: node.orderIndex,
      metadata: {
        springboot_node_id: node.id,  // QUAN TRỌNG!
        expected_length: node.metadata?.expected_length || "medium"
      }
    }))
  };
  
  // 2.2. Create AI task
  const taskResponse = await fetch(`${FASTAPI_API}/lesson/generate-lesson-plan-content`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      lesson_plan_json: aiStructure,
      lesson_id: "toan10-hamso",  // ID sách giáo khoa
      book_id: "toan-10",          // Collection trong Qdrant
      user_id: "user123",
      tool_log_id: Date.now()
    })
  });
  
  const taskData = await taskResponse.json();
  const taskId = taskData.task_id;
  console.log(`✅ Created AI task: ${taskId}`);
  
  // 2.3. Poll task status
  const result = await pollTaskStatus(taskId);
  
  return result;
}

async function pollTaskStatus(taskId) {
  const FASTAPI_API = "http://34.124.179.17:8000/api/v1";
  const statusUrl = `${FASTAPI_API}/tasks/status/${taskId}`;
  
  let pollCount = 0;
  const maxPolls = 300; // 10 minutes
  
  while (pollCount < maxPolls) {
    const response = await fetch(statusUrl);
    const data = await response.json();
    
    console.log(`📊 Poll #${pollCount}: ${data.progress}% - ${data.message}`);
    
    // Update UI
    updateProgressBar(data.progress, data.message);
    
    // Check status
    if (data.status === "completed") {
      console.log("✅ AI generation completed!");
      return data.result;
    }
    
    if (data.status === "failed") {
      throw new Error(`AI failed: ${data.error}`);
    }
    
    // Wait 2 seconds before next poll
    await sleep(2000);
    pollCount++;
  }
  
  throw new Error("Timeout: AI processing took too long");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function updateProgressBar(progress, message) {
  const progressBar = document.getElementById("progress-bar");
  const progressText = document.getElementById("progress-text");
  
  if (progressBar) {
    progressBar.style.width = `${progress}%`;
    progressBar.textContent = `${progress}%`;
  }
  
  if (progressText) {
    progressText.textContent = message;
  }
}

// Usage:
const aiResult = await step2_GenerateAIContent(lessonPlanId, nodes);
console.log("BƯỚC 2 HOÀN THÀNH!");
console.log(`Generated content for ${aiResult.statistics.total_nodes} nodes`);
console.log(`Total words: ${aiResult.statistics.total_words}`);
```

---

## 🔴 BƯỚC 3: UPDATE CONTENT VÀO SPRINGBOOT

### **Mục đích:**
Lấy nội dung AI đã generate, update vào từng node trong PostgreSQL của SpringBoot.

---

### **3.1. Extract Content từ AI Result**

```javascript
const aiOutput = aiResult.output;
const aiChildren = aiOutput.children;

// aiChildren là array gồm 3 nodes với content đã được AI fill
console.log(aiChildren);
/*
[
  {
    id: "node_1001",
    title: "I. MỤC TIÊU BÀI HỌC",
    content: "**1. Về kiến thức:**\n- Học sinh hiểu...",  // ĐÃ CÓ CONTENT!
    metadata: { springboot_node_id: 1001 }
  },
  {
    id: "node_1002",
    title: "II. NỘI DUNG BÀI HỌC",
    content: "**1. Định nghĩa hàm số bậc nhất:**...",  // ĐÃ CÓ CONTENT!
    metadata: { springboot_node_id: 1002 }
  },
  {
    id: "node_1003",
    title: "III. PHƯƠNG PHÁP GIẢNG DẠY",
    content: "**1. Phương pháp thuyết trình:**...",  // ĐÃ CÓ CONTENT!
    metadata: { springboot_node_id: 1003 }
  }
]
*/
```

---

### **3.2. Update Node 1 (Mục tiêu bài học)**

#### **API Endpoint:**
```
PUT http://34.126.191.131:8080/api/lesson-nodes/1001
```

#### **Request Headers:**
```http
Content-Type: application/json
Authorization: Bearer YOUR_TOKEN
```

#### **Request Body:**
```json
{
  "content": "**1. Về kiến thức:**\n- Học sinh hiểu được khái niệm hàm số bậc nhất\n- Nắm được dạng tổng quát y = ax + b (a ≠ 0)\n- Hiểu được tập xác định và tập giá trị của hàm số bậc nhất\n\n**2. Về kỹ năng:**\n- Xác định được hệ số a, b trong hàm số bậc nhất\n- Vẽ được đồ thị hàm số y = ax + b\n- Xác định được tính đồng biến, nghịch biến của hàm số\n\n**3. Về thái độ:**\n- Rèn luyện tính cẩn thận, chính xác khi vẽ đồ thị\n- Phát triển tư duy logic, khả năng trừu tượng hóa",
  "fieldType": "INPUT"
}
```

#### **Response:**
```json
{
  "id": 1001,
  "lessonPlanTemplateId": 101,
  "title": "I. MỤC TIÊU BÀI HỌC",
  "content": "**1. Về kiến thức:**\n- Học sinh hiểu được...",
  "status": "ACTIVE",
  "updatedAt": "2024-12-11T10:09:00"
}
```

**→ Node 1 đã có content AI!**

---

### **3.3. Update Node 2 (Nội dung bài học)**

#### **API Endpoint:**
```
PUT http://34.126.191.131:8080/api/lesson-nodes/1002
```

#### **Request Body:**
```json
{
  "content": "**1. Định nghĩa hàm số bậc nhất:**\n\nHàm số bậc nhất là hàm số có dạng:\n```\ny = f(x) = ax + b\n```\nTrong đó:\n- a, b là các hằng số\n- a ≠ 0\n- x là biến số\n\n**Ví dụ:**\n- y = 2x + 3 (a = 2, b = 3)\n- y = -x + 1 (a = -1, b = 1)\n- y = 5x (a = 5, b = 0)\n\n... (nội dung dài 687 từ)",
  "fieldType": "INPUT"
}
```

**→ Node 2 đã có content AI!**

---

### **3.4. Update Node 3 (Phương pháp giảng dạy)**

#### **API Endpoint:**
```
PUT http://34.126.191.131:8080/api/lesson-nodes/1003
```

#### **Request Body:**
```json
{
  "content": "**1. Phương pháp thuyết trình:**\n- Giảng giải lý thuyết về định nghĩa hàm số bậc nhất\n- Trình bày các tính chất, công thức\n- Thời gian: 10 phút\n\n**2. Phương pháp vấn đáp:**\n- Đặt câu hỏi gợi mở để học sinh tự rút ra định nghĩa\n... (nội dung đầy đủ)",
  "fieldType": "INPUT"
}
```

**→ Node 3 đã có content AI!**

---

### **3.5. KẾT QUẢ SAU BƯỚC 3:**

**Database PostgreSQL (SpringBoot):**

**Table: lesson_plan_nodes**
```sql
id   | lesson_plan_id | title                       | content                                      | updated_at
1001 | 101            | I. MỤC TIÊU BÀI HỌC         | **1. Về kiến thức:**\n- Học sinh hiểu...    | 2024-12-11 10:09:00
1002 | 101            | II. NỘI DUNG BÀI HỌC        | **1. Định nghĩa hàm số bậc nhất:**\n\n...   | 2024-12-11 10:09:05
1003 | 101            | III. PHƯƠNG PHÁP GIẢNG DẠY  | **1. Phương pháp thuyết trình:**\n-...      | 2024-12-11 10:09:10
```

**→ CÓ GIÁO ÁN HOÀN CHỈNH VỚI NỘI DUNG AI!**

---

### **3.6. CODE JAVASCRIPT BƯỚC 3:**

```javascript
async function step3_UpdateNodesWithAI(aiResult) {
  const SPRINGBOOT_API = "http://34.126.191.131:8080/api";
  const token = localStorage.getItem("auth_token");
  
  const headers = {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${token}`
  };
  
  // Extract AI output
  const aiChildren = aiResult.output.children;
  
  console.log(`📝 Updating ${aiChildren.length} nodes with AI content...`);
  
  // Update each node
  for (const child of aiChildren) {
    // Get SpringBoot node ID from metadata
    const springbootNodeId = child.metadata.springboot_node_id;
    const aiContent = child.content;
    
    console.log(`🔄 Updating node ${springbootNodeId}: ${child.title}`);
    console.log(`   Content length: ${aiContent.length} characters`);
    
    // Call SpringBoot API to update node
    const response = await fetch(`${SPRINGBOOT_API}/lesson-nodes/${springbootNodeId}`, {
      method: "PUT",
      headers,
      body: JSON.stringify({
        content: aiContent,
        fieldType: child.fieldType || "INPUT"
      })
    });
    
    if (!response.ok) {
      throw new Error(`Failed to update node ${springbootNodeId}: ${response.statusText}`);
    }
    
    const updatedNode = await response.json();
    console.log(`✅ Updated node ${updatedNode.id}: ${updatedNode.title}`);
  }
  
  console.log("✅ All nodes updated successfully!");
}

// Usage:
await step3_UpdateNodesWithAI(aiResult);
console.log("BƯỚC 3 HOÀN THÀNH!");
```

---

## 🎉 HOÀN THÀNH: FULL FLOW

### **CODE HOÀN CHỈNH - 3 BƯỚC:**

```javascript
async function createLessonPlanWithAI_Complete() {
  try {
    console.log("🚀 BẮT ĐẦU TẠO GIÁO ÁN AI...\n");
    
    // ============================================
    // BƯỚC 1: TẠO STRUCTURE TRONG SPRINGBOOT
    // ============================================
    console.log("📋 BƯỚC 1: Tạo cấu trúc giáo án...");
    showLoading("Đang tạo cấu trúc giáo án...");
    
    const { lessonPlanId, nodes } = await step1_CreateStructure();
    
    console.log(`✅ BƯỚC 1 HOÀN THÀNH!`);
    console.log(`   - Lesson Plan ID: ${lessonPlanId}`);
    console.log(`   - Nodes created: ${nodes.length}`);
    console.log(`   - Node IDs: ${nodes.map(n => n.id).join(", ")}\n`);
    
    // ============================================
    // BƯỚC 2: GENERATE AI CONTENT
    // ============================================
    console.log("🤖 BƯỚC 2: Tạo nội dung AI...");
    showLoading("Đang tạo nội dung AI (có thể mất 1-3 phút)...");
    
    const aiResult = await step2_GenerateAIContent(lessonPlanId, nodes);
    
    console.log(`✅ BƯỚC 2 HOÀN THÀNH!`);
    console.log(`   - Nodes processed: ${aiResult.statistics.total_nodes}`);
    console.log(`   - Total words: ${aiResult.statistics.total_words}`);
    console.log(`   - Processing time: ${aiResult.statistics.processing_time_seconds}s\n`);
    
    // ============================================
    // BƯỚC 3: UPDATE CONTENT VÀO SPRINGBOOT
    // ============================================
    console.log("💾 BƯỚC 3: Lưu nội dung vào giáo án...");
    showLoading("Đang lưu nội dung AI vào giáo án...");
    
    await step3_UpdateNodesWithAI(aiResult);
    
    console.log(`✅ BƯỚC 3 HOÀN THÀNH!\n`);
    
    // ============================================
    // DONE!
    // ============================================
    hideLoading();
    
    console.log("🎉 HOÀN TẤT!");
    console.log(`✅ Giáo án ${lessonPlanId} đã được tạo thành công với nội dung AI!`);
    console.log(`📊 Thống kê:`);
    console.log(`   - Tổng số nodes: ${aiResult.statistics.total_nodes}`);
    console.log(`   - Tổng số từ: ${aiResult.statistics.total_words}`);
    console.log(`   - Thời gian xử lý: ${aiResult.statistics.processing_time_seconds}s`);
    
    // Show success message
    showSuccessMessage(`
      ✅ Giáo án đã được tạo thành công!
      
      ID: ${lessonPlanId}
      Số nodes: ${aiResult.statistics.total_nodes}
      Tổng số từ: ${aiResult.statistics.total_words}
    `);
    
    // Redirect to view page
    setTimeout(() => {
      window.location.href = `/lesson-plans/${lessonPlanId}`;
    }, 2000);
    
  } catch (error) {
    console.error("❌ LỖI:", error);
    hideLoading();
    showErrorMessage(`Lỗi: ${error.message}`);
  }
}

// UI Helpers
function showLoading(message) {
  const modal = document.getElementById("loading-modal");
  const text = document.getElementById("loading-text");
  if (modal) modal.style.display = "flex";
  if (text) text.textContent = message;
}

function hideLoading() {
  const modal = document.getElementById("loading-modal");
  if (modal) modal.style.display = "none";
}

function showSuccessMessage(message) {
  alert(`✅ ${message}`);
}

function showErrorMessage(message) {
  alert(`❌ ${message}`);
}

// ============================================
// RUN IT!
// ============================================
createLessonPlanWithAI_Complete();
```

---

## 📊 TIMELINE CHI TIẾT

```
00:00 ─── Frontend: Bắt đầu
00:01 ─── BƯỚC 1: POST SpringBoot (create template)
00:02 ─── BƯỚC 1: POST SpringBoot (create node 1)
00:03 ─── BƯỚC 1: POST SpringBoot (create node 2)
00:04 ─── BƯỚC 1: POST SpringBoot (create node 3)
00:05 ─── ✅ BƯỚC 1 DONE (có structure rỗng)

00:05 ─── BƯỚC 2: POST FastAPI (create AI task)
00:06 ─── BƯỚC 2: GET FastAPI (poll) → 0% "Starting..."
00:08 ─── BƯỚC 2: GET FastAPI (poll) → 10% "Đang phân tích..."
00:10 ─── BƯỚC 2: GET FastAPI (poll) → 30% "Đang tạo node 1/3..."
00:30 ─── BƯỚC 2: GET FastAPI (poll) → 60% "Đang tạo node 2/3..."
01:00 ─── BƯỚC 2: GET FastAPI (poll) → 90% "Đang tạo node 3/3..."
01:30 ─── BƯỚC 2: GET FastAPI (poll) → 100% "Completed!"
01:31 ─── ✅ BƯỚC 2 DONE (có AI content)

01:31 ─── BƯỚC 3: PUT SpringBoot (update node 1)
01:32 ─── BƯỚC 3: PUT SpringBoot (update node 2)
01:33 ─── BƯỚC 3: PUT SpringBoot (update node 3)
01:34 ─── ✅ BƯỚC 3 DONE (lưu vào database)

01:34 ─── 🎉 HOÀN TẤT! (Total: ~94 seconds)
```

---

## 🎨 HTML + CSS UI

```html
<!DOCTYPE html>
<html>
<head>
  <title>Tạo Giáo Án AI</title>
  <style>
    .container {
      max-width: 800px;
      margin: 50px auto;
      padding: 20px;
    }
    
    .btn-create {
      background: #4CAF50;
      color: white;
      padding: 15px 30px;
      font-size: 18px;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }
    
    .btn-create:hover {
      background: #45a049;
    }
    
    .btn-create:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    
    #loading-modal {
      display: none;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.7);
      justify-content: center;
      align-items: center;
      z-index: 9999;
    }
    
    .loading-content {
      background: white;
      padding: 40px;
      border-radius: 10px;
      text-align: center;
      max-width: 500px;
    }
    
    .spinner {
      border: 5px solid #f3f3f3;
      border-top: 5px solid #3498db;
      border-radius: 50%;
      width: 60px;
      height: 60px;
      animation: spin 1s linear infinite;
      margin: 20px auto;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .progress-container {
      width: 100%;
      background: #f0f0f0;
      border-radius: 10px;
      overflow: hidden;
      margin: 20px 0;
    }
    
    #progress-bar {
      width: 0%;
      height: 30px;
      background: linear-gradient(90deg, #4CAF50, #8BC34A);
      text-align: center;
      line-height: 30px;
      color: white;
      font-weight: bold;
      transition: width 0.3s;
    }
    
    #progress-text {
      margin: 10px 0;
      font-size: 14px;
      color: #666;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>🎓 Tạo Giáo Án với AI</h1>
    
    <button id="btn-create" class="btn-create">
      Tạo Giáo Án AI
    </button>
    
    <div id="result"></div>
  </div>
  
  <!-- Loading Modal -->
  <div id="loading-modal">
    <div class="loading-content">
      <div class="spinner"></div>
      <h3 id="loading-text">Đang xử lý...</h3>
      <div class="progress-container">
        <div id="progress-bar">0%</div>
      </div>
      <p id="progress-text">Vui lòng đợi...</p>
    </div>
  </div>
  
  <script>
    // Paste toàn bộ code JavaScript ở đây
    // ...
    
    document.getElementById("btn-create").addEventListener("click", async () => {
      const btn = document.getElementById("btn-create");
      btn.disabled = true;
      
      await createLessonPlanWithAI_Complete();
      
      btn.disabled = false;
    });
  </script>
</body>
</html>
```

---

## 📝 SUMMARY

### **3 BƯỚC HOÀN CHỈNH:**

| Bước | API | Thời gian | Kết quả |
|------|-----|-----------|---------|
| **1** | SpringBoot POST (template + 3 nodes) | ~4s | Có structure rỗng |
| **2** | FastAPI POST → Poll GET | ~90s | Có AI content |
| **3** | SpringBoot PUT (3 nodes) | ~3s | Lưu vào DB |
| **TOTAL** | | **~97s** | **✅ Giáo án hoàn chỉnh** |

### **Key Points:**

- ✅ **Không sửa SpringBoot** - Chỉ dùng API có sẵn
- ✅ **Frontend làm orchestrator** - Gọi tuần tự 3 bước
- ✅ **AI content chi tiết** - 1000+ từ với format đẹp
- ✅ **Progress tracking** - User thấy real-time progress
- ✅ **Error handling** - Xử lý lỗi từng bước
- ✅ **Code sẵn sàng** - Copy paste là chạy!

**→ TẤT CẢ CODE ĐÃ HOÀN CHỈNH, CHỈ CẦN COPY VÀ CHẠY! 🚀**
