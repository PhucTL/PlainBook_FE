import { apiSecondary } from "@/config/axios";
import { AI_EXAM_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  LessonsResponse,
  SmartExamRequest,
  ExamGenerationResponse,
  ExamTaskStatusResponse,
  ExamStatistics,
} from "@/types";

/**
 * AI EXAM GENERATION SERVICES
 * FastAPI Port 8000 - http://34.124.179.17:8000
 */

// ============================================
// BƯỚC 1: LẤY DANH SÁCH BÀI HỌC
// ============================================

/**
 * Lấy danh sách bài học có sẵn (đã upload PDF)
 * @param bookId - Optional: Filter by book ID (VD: "gdcd-12")
 * @param lessonId - Optional: Get specific lesson
 */
export const getAvailableLessons = async (
  bookId?: string,
  lessonId?: string
): Promise<LessonsResponse> => {
  const params: Record<string, string> = {};
  if (bookId) params.book_id = bookId;
  if (lessonId) params.lesson_id = lessonId;

  const response = await apiSecondary.get(AI_EXAM_ENDPOINTS.LESSONS, {
    params,
  });
  return response.data;
};

/**
 * @deprecated Use getAvailableLessons instead
 */
export const getTextbookLessons = async (
  bookId: string
): Promise<LessonsResponse> => {
  return getAvailableLessons(bookId);
};

// ============================================
// BƯỚC 2: TẠO ĐỀ THI (ASYNC TASK)
// ============================================

/**
 * Tạo đề thi thông minh với AI (returns task_id)
 * @param examData - Thông tin đề thi và ma trận
 */
export const generateSmartExam = async (
  examData: SmartExamRequest
): Promise<ExamGenerationResponse> => {
  const response = await apiSecondary.post(
    AI_EXAM_ENDPOINTS.SMART_EXAM_GENERATION,
    examData
  );
  return response.data;
};

// ============================================
// BƯỚC 3: KIỂM TRA TIẾN ĐỘ TASK
// ============================================

/**
 * Lấy trạng thái task (polling)
 * @param taskId - ID task từ response của generateSmartExam
 */
export const getExamTaskStatus = async (
  taskId: string
): Promise<ExamTaskStatusResponse> => {
  const response = await apiSecondary.get(AI_EXAM_ENDPOINTS.EXAM_TASK_STATUS(taskId));
  return response.data;
};

/**
 * Lấy kết quả task khi completed
 * @param taskId - ID task
 */
export const getExamTaskResult = async (
  taskId: string
): Promise<ExamTaskStatusResponse> => {
  const response = await apiSecondary.get(AI_EXAM_ENDPOINTS.EXAM_TASK_RESULT(taskId));
  return response.data;
};

// ============================================
// BƯỚC 4: DOWNLOAD FILE ĐỀ THI
// ============================================

/**
 * Download file DOCX đề thi
 * @param taskId - ID task
 * @returns URL để download file
 */
export const getExamDownloadUrl = (taskId: string): string => {
  // Return full URL with base URL
  const baseURL = apiSecondary.defaults.baseURL || "http://34.124.179.17:8000";
  return `${baseURL}${AI_EXAM_ENDPOINTS.EXAM_TASK_DOWNLOAD(taskId)}`;
};

/**
 * Trigger download file đề thi (mở tab mới)
 * @param taskId - ID task
 */
export const downloadExamFile = (taskId: string): void => {
  const downloadUrl = getExamDownloadUrl(taskId);
  window.open(downloadUrl, "_blank");
};

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Sleep utility for polling
 */
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Poll exam task status with timeout and callback
 * @param taskId - Task ID to poll
 * @param onProgress - Callback for progress updates
 * @param maxPolls - Maximum number of polls (default: 200 = ~10 minutes)
 * @param pollInterval - Interval between polls in ms (default: 3000 = 3 seconds)
 */
export const pollExamTaskStatus = async (
  taskId: string,
  onProgress?: (status: ExamTaskStatusResponse) => void,
  maxPolls: number = 200,
  pollInterval: number = 3000
): Promise<ExamTaskStatusResponse> => {
  let pollCount = 0;

  while (pollCount < maxPolls) {
    const status = await getExamTaskStatus(taskId);

    // Log progress for debugging
    console.log(
      `[Exam Polling ${pollCount + 1}/${maxPolls}] Status: ${status.status}, Progress: ${status.result?.current_progress || "N/A"}`
    );
    console.log(`Message: ${status.result?.message || "Processing..."}`);

    // Call progress callback
    if (onProgress) {
      onProgress(status);
    }

    // ✅ Check if completed
    if (status.status === "completed") {
      console.log("✅ Exam generation completed! Fetching full result...");
      // Get full result when completed
      const fullResult = await getExamTaskResult(taskId);
      return fullResult;
    }

    // ❌ Check if failed
    if (status.status === "failed") {
      throw new Error(
        status.result?.error || "Exam generation failed"
      );
    }

    // Wait before next poll
    await sleep(pollInterval);
    pollCount++;
  }

  throw new Error("Timeout: Exam generation took too long (>10 minutes)");
};

// ============================================
// FULL FLOW: TẠO ĐỀ THI HOÀN CHỈNH
// ============================================

export interface CreateExamWithAIOptions {
  school: string;
  grade: number;
  subject: string;
  examTitle: string;
  duration: number;
  examCode?: string;
  bookID: string;
  matrix: SmartExamRequest["matrix"];
  userId?: string;
  onProgress?: (step: number, progress: number, message: string) => void;
}

export interface CreateExamWithAIResult {
  taskId: string;
  filename: string;
  statistics: ExamStatistics; // ✅ Fixed: Direct reference to ExamStatistics
  downloadUrl: string;
}

/**
 * Full workflow: Generate exam with AI
 * 1. Create exam generation task
 * 2. Poll task status until completed
 * 3. Return download URL and statistics
 */
export const createExamWithAI = async (
  options: CreateExamWithAIOptions
): Promise<CreateExamWithAIResult> => {
  const {
    school,
    grade,
    subject,
    examTitle,
    duration,
    examCode,
    bookID,
    matrix,
    userId,
    onProgress,
  } = options;

  try {
    // ============================================
    // BƯỚC 1: TẠO TASK GENERATE ĐỀ THI
    // ============================================
    onProgress?.(1, 0, "Đang khởi tạo AI tạo đề...");

    const examRequest: SmartExamRequest = {
      school,
      grade,
      subject,
      examTitle,
      duration,
      examCode,
      outputFormat: "docx",
      outputLink: "online",
      isExportDocx: true,
      bookID,
      matrix,
      user_id: userId,
    };

    console.log("🔍 Exam Request:", JSON.stringify(examRequest, null, 2));

    const taskResponse = await generateSmartExam(examRequest);
    const taskId = taskResponse.task_id;

    console.log("✅ Task created:", taskId);
    onProgress?.(1, 100, `Đã tạo task: ${taskId}`);

    // ============================================
    // BƯỚC 2: POLLING TASK STATUS
    // ============================================
    onProgress?.(2, 0, "AI đang tạo đề thi...");

    const taskResult = await pollExamTaskStatus(
      taskId,
      (status) => {
        const progress = parseProgress(status.result?.current_progress);
        const message =
          status.result?.message || `AI đang xử lý... (${progress}%)`;
        console.log(`[Exam Progress] ${progress}% - ${message}`);
        onProgress?.(2, progress, message);
      },
      200, // Max 200 polls (~10 minutes)
      3000 // Poll every 3 seconds
    );

    // ============================================
    // BƯỚC 3: KIỂM TRA KẾT QUẢ
    // ============================================
    if (!taskResult.result?.success || !taskResult.result?.output) {
      console.error("❌ Invalid exam result structure:", taskResult);
      throw new Error(
        taskResult.result?.error || "AI không trả về kết quả hợp lệ"
      );
    }

    const output = taskResult.result.output;
    console.log("✅ Exam generated successfully:", {
      filename: output.filename,
      totalQuestions: output.statistics.total_questions,
      statistics: output.statistics,
    });

    onProgress?.(2, 100, "Đã tạo đề thi thành công!");

    // ============================================
    // BƯỚC 4: TRẢ VỀ KẾT QUẢ
    // ============================================
    const downloadUrl = getExamDownloadUrl(taskId);

    return {
      taskId,
      filename: output.filename,
      statistics: output.statistics, // ✅ Fixed: statistics is at output level, not output.exam_statistics
      downloadUrl,
    };
  } catch (error) {
    console.error("Error in createExamWithAI:", error);
    throw error;
  }
};

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Parse progress string "50%" to number 50
 */
function parseProgress(progressStr?: string): number {
  if (!progressStr) return 0;
  const match = progressStr.match(/(\d+)%?/);
  return match ? parseInt(match[1], 10) : 0;
}

/**
 * Validate exam matrix (ensure total questions > 0)
 */
export const validateExamMatrix = (
  matrix: SmartExamRequest["matrix"]
): { valid: boolean; error?: string } => {
  if (!matrix || matrix.length === 0) {
    return { valid: false, error: "Ma trận đề thi không được rỗng" };
  }

  let totalQuestions = 0;

  for (const lesson of matrix) {
    if (!lesson.parts || lesson.parts.length === 0) {
      return {
        valid: false,
        error: `Bài học ${lesson.lessonId} không có phần nào`,
      };
    }

    for (const part of lesson.parts) {
      const sum =
        (part.objectives.KNOWLEDGE || 0) +
        (part.objectives.COMPREHENSION || 0) +
        (part.objectives.APPLICATION || 0);

      if (sum < 0) {
        return {
          valid: false,
          error: `Số câu hỏi không được âm (Lesson ${lesson.lessonId}, Part ${part.part})`,
        };
      }

      totalQuestions += sum;
    }
  }

  if (totalQuestions === 0) {
    return {
      valid: false,
      error: "Tổng số câu hỏi phải lớn hơn 0",
    };
  }

  return { valid: true };
};
