// `@/generated/client` may not be available in all environments (e.g. CI/build).
// Provide lightweight fallbacks to avoid type import errors. Replace these
// with generated types when available.
export type User = unknown;
export type Grade = unknown;
export type Subject = unknown;
export type AcademicYear = unknown;
export type BookType = unknown;

export type AcademicYearResponse = {
  id: bigint;
  yearLabel: string;
  startDate: Date | null;
  endDate: Date | null;
  status: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
};
export type GradeResponse = {
  name: string;
  id: bigint;
  createdAt: string | null;
  status: string | null;
  updatedAt: string | null;
};

export type BookResponse = {
  name: string;
  id: bigint;
  createdAt: string | null;
  status: string | null;
  updatedAt: string | null;
  subject: SubjectResponse | null;
};

export type SubjectResponse = {
  name: string;
  id: bigint;
  createdAt: string | null;
  status: string | null;
  updatedAt: string | null;
  grade: Grade | null;
};

export type LessonPlanResponse = {
  id: string;
  name: string;
  description?: string;
  createdAt: string | null;
  updatedAt: string | null;
  formData?: JSON;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
};

export type SubscriptionResponse = {
  id: string;
  name: string;
  tokenAmount: number;
  price: number;
  description: string;
  highlight: boolean;
  features: Record<string, string>;
  priority: number;
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
};
export type BookTypeResponse = {
  id: bigint;
  name: string;
  icon: string | null;
  description: string | null;
  createdAt: string | null;
  status: string | null;
  updatedAt: string | null;
  priority: number | null;
  tokenCostPerQuery: number | null;
  code?: string;
  href?: string;
};

export type TagResponse = {
  id: bigint;
  name: string;
  description: string | null;
};

export type ChapterResponse = {
  id: bigint;
  name: string;
  createdAt: string | null;
  status: string | null;
  updatedAt: string | null;
  bookId: bigint | null;
};

export type LessonResponse = {
  id: bigint;
  name: string;
  createdAt: string | null;
  status: string | null;
  updatedAt: string | null;
  chapterId: bigint | null;
};

// Types for slide template API
export type SlideTemplateStatus = "ACTIVE" | "INACTIVE";

export interface CreateSlideTemplateRequest {
  name: string;
  description?: string;
  textBlocks?: Record<string, unknown>;
  imageBlocks?: Record<string, string>;
}

export interface UpdateSlideTemplateRequest {
  name?: string;
  description?: string;
  textBlocks?: Record<string, unknown>;
  imageBlocks?: Record<string, string>;
}

export interface SlideTemplateResponse {
  id: string | number;
  name: string;
  status: SlideTemplateStatus;
  description?: string;
  textBlocks?: Record<string, unknown>;
  imageBlocks?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

// Helper types for form handling
export interface TextBlockItem {
  key: string;
  value: unknown;
}

export interface ImageBlockItem {
  key: string;
  value: string;
}

// Types for process JSON template API
export interface ProcessJsonTemplateRequest {
  lesson_id: string;
  template: Record<string, unknown>;
  config_prompt: string;
}

export interface SlideTemplate {
  id: string;
  name: string;
  description?: string;
  thumbnail?: string;
  category: "education" | "business" | "presentation" | "other";
  slides: SlideTemplateSlide[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  isPublic: boolean;
  tags: string[];
}

export interface SlideTemplateSlide {
  id: string;
  title: string;
  elements: SlideElement[];
  background?: string;
  isVisible: boolean;
}

export interface SlideTemplateFormData {
  name: string;
  description?: string;
  status: SlideTemplateStatus;
  imageBlocks: Record<string, string>;
}

// Export order types from separate file
export * from "./order";

// User types
// export interface UserResponse {

//   id: string;
//   name: string;
//   email: string;
//   avatar?: string;
//   role: 'user' | 'admin';
//   createdAt: string;
//   updatedAt: string;
// }

// Transaction types
export interface Transaction {
  id: string;
  amount: number;
  type: "DEPOSIT" | "WITHDRAWAL" | "PAYMENT" | "REFUND";
  description?: string;
  status: "PENDING" | "COMPLETED" | "FAILED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

// Wallet Transaction types (for token transactions)
export interface WalletTransaction {
  id: string;
  orderId: string;
  tokenBefore: number;
  tokenChange: number;
  type: "RECHARGE" | "TOOL_USAGE";
  description: string;
  createdAt: string;
}

// Wallet types
export interface Wallet {
  id: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  transactions: Transaction[];
}

// Enhanced User Response with wallet
export interface UserWithWalletResponse {
  id: string;
  fullName: string | null;
  username: string;
  email: string;
  role: "PARTNER" | "STAFF" | "USER" | "ADMIN";
  phone: string | null;
  avatar: string | null;
  gender: string | null;
  birthday: string | null;
  status: string | null;
  createdAt: string;
  updatedAt: string;
  wallet: Wallet | null;
}

// // Product types
// export interface Product {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   images: string[];
//   category: string;
//   tags: string[];
//   inStock: boolean;
//   quantity: number;
//   createdAt: string;
//   updatedAt: string;
// }

// // Cart types
// export interface CartItem {
//   id: string;
//   productId: string;
//   name: string;
//   price: number;
//   quantity: number;
//   image: string;
// }

// export interface Cart {
//   items: CartItem[];
//   total: number;
// }

// // Order types
// export interface Order {
//   id: string;
//   userId: string;
//   items: CartItem[];
//   total: number;
//   status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
//   shippingAddress: Address;
//   billingAddress: Address;
//   paymentMethod: string;
//   createdAt: string;
//   updatedAt: string;
// }

// // Address types
// export interface Address {
//   fullName: string;
//   addressLine1: string;
//   addressLine2?: string;
//   city: string;
//   state: string;
//   postalCode: string;
//   country: string;
//   phone: string;
// }

// // API response types
// export interface ApiResponse<T> {
//   data: T;
//   message?: string;
//   success: boolean;
// }

// export interface PaginatedResponse<T> {
//   data: T[];
//   total: number;
//   page: number;
//   limit: number;
//   totalPages: number;
// }

// Lesson Plan Template Types
export interface LessonPlanKeyword {
  id: string;
  title: string;
  content: string;
  prompt?: string;
  order: number;
  children?: LessonPlanKeyword[];
  nodeType?: "SECTION" | "SUBSECTION" | "LIST_ITEM" | "PARAGRAPH"; // Map với backend NodeType
  fieldType?: "INPUT" | "REFERENCES" | "TABLE" | null; // Map với backend FieldType
}

export interface LessonPlanStep {
  id: string;
  title: string;
  description?: string;
  isRequired: boolean;
  order: number;
  keywords: LessonPlanKeyword[];
  stepType:
    | "general_info"
    | "objectives"
    | "equipment"
    | "activities"
    | "custom";
  timeAllocation?: number; // in minutes
  children?: LessonPlanStep[];
}

export interface LessonPlanActivity {
  id: string;
  title: string;
  description?: string;
  timeAllocation: number;
  objectives: string[];
  content: string;
  expectedProducts: string[];
  teacherActivities: string[];
  studentActivities: string[];
  order: number;
}

export interface LessonPlanTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  isDefault: boolean;
  isActive?: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  steps: LessonPlanStep[];
  metadata: {
    subject?: string;
    grade?: string;
    educationLevel?: string;
    framework?: string;
  };
}

export interface LessonPlanInstance {
  id: string;
  templateId: string;
  title: string;
  subject: string;
  grade: string;
  duration: number;
  teacherName: string;
  schoolName: string;
  createdAt: string;
  updatedAt: string;
  content: LessonPlanStepContent[];
  status: "draft" | "completed" | "published";
}

export interface LessonPlanStepContent {
  stepId: string;
  keywordContents: {
    keywordId: string;
    value: string;
  }[];
}

// Tool Result Response Type
export interface ToolResultResponse {
  id: number;
  name: string;
  description: string;
  type: string;
  status: "ACTIVE" | "DELETED" | "ARCHIVED" | "DRAFT";
  data: unknown[]; // Array of unknown data structures
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
  userId: string;
  academicYearId: number;
  templateId: number | null;
  lessonIds: number[];
}

// Slide Editor Types
export interface TextStyle {
  fontSize: number;
  fontFamily: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: string;
  textAlign?: "left" | "center" | "right";
  verticalAlign?: "top" | "middle" | "bottom";
}

export interface Position {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TextElement {
  id: string;
  type: "text";
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  style: TextStyle;
  zIndex?: number;
  rotation?: number; // in degrees
}

export interface ImageElement {
  id: string;
  type: "image";
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  alt?: string;
  zIndex?: number;
}

export interface VideoElement {
  id: string;
  type: "video";
  x: number;
  y: number;
  width: number;
  height: number;
  src: string;
  autoplay?: boolean;
  loop?: boolean;
  muted?: boolean;
  controls?: boolean;
  zIndex?: number;
}

export interface ShapeElement {
  id: string;
  type: "shape";
  x: number;
  y: number;
  width: number;
  height: number;
  shapeType: "rectangle" | "circle" | "triangle" | "star";
  fill?: string;
  stroke?: string;
  strokeWidth?: number;
  opacity?: number; // 0 to 1
  zIndex?: number;
  rotation?: number; // in degrees
}

export interface TableElement {
  id: string;
  type: "table";
  x: number;
  y: number;
  width: number;
  height: number;
  headers: string[];
  rows: string[][];
  columnWidths?: number[]; // Width for each column
  rowHeights?: number[]; // Height for each row
  style?: {
    borderColor?: string;
    borderWidth?: number;
    headerBackgroundColor?: string;
    cellBackgroundColor?: string;
    textColor?: string;
    fontSize?: number;
    fontFamily?: string;
    textAlign?: "left" | "center" | "right";
  };
  cellStyles?: {
    // Individual cell styling
    [key: string]: {
      // key format: "row-col" e.g., "0-1"
      backgroundColor?: string;
      textColor?: string;
      fontSize?: number;
      fontWeight?: "normal" | "bold";
      textAlign?: "left" | "center" | "right";
    };
  };
  rowStyles?: {
    // Individual row styling
    [key: number]: {
      backgroundColor?: string;
      textColor?: string;
      fontSize?: number;
      fontWeight?: "normal" | "bold";
    };
  };
  zIndex?: number;
}

export type SlideElement =
  | TextElement
  | ImageElement
  | VideoElement
  | ShapeElement
  | TableElement;

export interface SlideData {
  id: string;
  elements: SlideElement[];
  background?: string;
}

// Interface for tool log data (matching API response)
export interface ToolLog {
  id: number;
  userId: string;
  toolId: string;
  lessonIds: string[];
  academicYearId: number;
  resultId: string | null;
  templateId: string | null;
  code: string;
  status: "SUCCESS" | "FAILED" | "PENDING";
  toolType: "EXTERNAL" | "INTERNAL";
  tokenUsed: number;
  input: unknown;
  output: unknown;
  createdAt: string;
  updatedAt: string;
}

// AI Lesson Plan Generation Types (Based on lesson-ai.md)
export interface LessonPlanNode {
  id?: number | string;
  springboot_node_id?: number | string; // ✅ Top-level field để FastAPI preserve
  lessonPlanTemplateId?: number;
  parentId?: number | null;
  title: string;
  content: string;
  description?: string;
  fieldType: "INPUT" | "UPLOAD"; // Chỉnh theo Swagger API
  type: "SECTION" | "SUBSECTION" | "LIST_ITEM" | "PARAGRAPH"; // ✅ Backend chỉ chấp nhận 4 types này (KHÔNG có TABLE, KHÔNG có ROOT)
  orderIndex: number;
  metadata?: {
    ai_enabled?: boolean;
    expected_length?: "short" | "medium" | "long";
    springboot_node_id?: number | string;
    original_title?: string; // Backup title
    ai_generated?: boolean;
    word_count?: number;
  };
  status?: "ACTIVE" | "INACTIVE" | "DELETED";
  children?: LessonPlanNode[];
  createdAt?: string;
  updatedAt?: string;
  data?: unknown; // For SpringBoot response wrapper
}

export interface AILessonPlanStructure {
  id: string;
  title: string;
  type: "SECTION" | "SUBSECTION" | "PARAGRAPH" | "LIST_ITEM"; // ✅ Backend chỉ chấp nhận 4 types (KHÔNG có TABLE, KHÔNG có ROOT)
  status: "ACTIVE" | "INACTIVE" | "DELETED"; // ✅ BẮT BUỘC theo FastAPI schema
  children: LessonPlanNode[];
}

export interface CreateLessonPlanTemplateRequest {
  name: string;
  description?: string;
}

export interface CreateLessonPlanTemplateResponse {
  statusCode?: number;
  message?: string;
  data?: {
    id: number;
    name: string;
    description?: string;
    status: "ACTIVE" | "INACTIVE" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
    createdAt: string;
    updatedAt: string;
  };
  // Fallback for direct response
  id?: number;
  name?: string;
  description?: string;
  status?: "ACTIVE" | "INACTIVE" | "DRAFT" | "PUBLISHED" | "ARCHIVED";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateLessonNodeRequest {
  lessonPlanTemplateId: number; // ⚠️ Schema definition dùng lessonPlanTemplateId (example dùng lessonPlanId nhưng착 SAI)
  parentId?: number | null;
  title: string;
  content?: string; // Optional theo Swagger
  description?: string;
  fieldType: "INPUT" | "UPLOAD"; // Chỉnh theo Swagger API
  type: "SECTION" | "SUBSECTION" | "LIST_ITEM" | "PARAGRAPH";
  orderIndex: number;
  // metadata KHÔNG GỬI trong request - SpringBoot không hỗ trợ
}

export interface UpdateLessonNodeRequest {
  title?: string;
  content?: string;
  description?: string;
  fieldType: "INPUT" | "UPLOAD"; // Bắt buộc theo Swagger
  type?: "SECTION" | "SUBSECTION" | "LIST_ITEM" | "PARAGRAPH";
  orderIndex?: number;
  // metadata KHÔNG sử dụng - SpringBoot API không hỗ trợ tốt
}

export interface GenerateAIContentRequest {
  lesson_plan_json: AILessonPlanStructure;
  lesson_id?: string;
  book_id?: string;
  user_id: string;
  tool_log_id?: number;
}

export interface GenerateAIContentResponse {
  task_id: string;
  status: "processing" | "completed" | "failed";
  message: string;
  created_at: string;
}

export interface TaskStatusResponse {
  task_id: string;
  status: "processing" | "completed" | "failed";
  progress: number;
  message: string;
  created_at: string;
  updated_at?: string;
  completed_at?: string;
  result?: {
    success: boolean;
    output: AILessonPlanStructure;
    statistics: {
      total_nodes: number;
      content_nodes_processed: number;
      lesson_content_used: boolean;
      total_words: number;
      processing_time_seconds: number;
    };
    total_count: number;
  };
  error?: string;
  data?: {
    lesson_plan_json: AILessonPlanStructure;
    lesson_id?: string;
    user_id: string;
  };
}

// ============================================
// AI EXAM GENERATION TYPES
// ============================================

export interface TextbookLesson {
  lesson_id: string;
  lesson_name: string;
  part: string;
  metadata: {
    book_id: string;
    subject: string;
  };
}

export interface LessonsResponse {
  success: boolean;
  book_id: string;
  collection_name: string;
  total_lessons: number;
  lessons: TextbookLesson[];
}

export interface ExamObjectives {
  KNOWLEDGE: number;
  COMPREHENSION: number;
  APPLICATION: number;
}

export interface ExamPart {
  part: 1 | 2 | 3; // 1: Multiple Choice, 2: True/False, 3: Essay
  objectives: ExamObjectives;
}

export interface LessonMatrix {
  lessonId: string;
  parts: ExamPart[];
}

export interface SmartExamRequest {
  school: string;
  grade: number; // 1-12
  subject: string;
  examTitle: string;
  duration: number; // 15-180 minutes
  examCode?: string; // 4 digits, optional - auto random if not provided
  outputFormat: "docx";
  outputLink: "online";
  isExportDocx: boolean;
  bookID: string;
  matrix: LessonMatrix[];
  user_id?: string;
}

export interface ExamGenerationResponse {
  success: boolean;
  task_id: string;
  task_type: "smart_exam_generation";
  status: "pending" | "processing" | "completed" | "failed";
  message: string;
}

export interface ExamStatistics {
  total_questions: number;
  part_1_questions: number; // ✅ Fixed: API uses part_1_questions
  part_2_questions: number; // ✅ Fixed: API uses part_2_questions
  part_3_questions: number; // ✅ Fixed: API uses part_3_questions
  lessons_used: number;
  difficulty_distribution: {
    KNOWLEDGE: number;
    COMPREHENSION: number;
    APPLICATION: number;
  };
  generation_time: number;
  created_at: string;
}

export interface ExamTaskResult {
  exam_id: string;
  message: string;
  online_links: Record<string, unknown>;
  file_path: string;
  filename: string;
  statistics: ExamStatistics; // ✅ Fixed: statistics is at output level
  task_id: string;
  processing_info: {
    total_questions_generated: number;
    total_lessons_used: number;
    missing_lessons: string[];
    processing_method: string;
  };
}

export interface ExamTaskStatusResponse {
  success: boolean;
  task_id: string;
  task_type: "smart_exam_generation";
  status: "pending" | "processing" | "completed" | "failed";
  result: {
    success?: boolean;
    current_progress?: string;
    message?: string;
    output?: ExamTaskResult;
    error?: string;
  };
  created_at: string;
  updated_at?: string;
  completed_at?: string;
}
