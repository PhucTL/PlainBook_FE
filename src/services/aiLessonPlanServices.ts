import api, { apiSecondary } from "@/config/axios";
import { API_ENDPOINTS } from "@/constants/apiEndpoints";
import type {
  CreateLessonPlanTemplateRequest,
  CreateLessonPlanTemplateResponse,
  CreateLessonNodeRequest,
  LessonPlanNode,
  UpdateLessonNodeRequest,
  GenerateAIContentRequest,
  GenerateAIContentResponse,
  TaskStatusResponse,
  AILessonPlanStructure,
} from "@/types";

/**
 * BƯỚC 1: TẠO STRUCTURE TRONG SPRINGBOOT
 */

// 1.1. Tạo Lesson Plan Template
export const createLessonPlanTemplate = async (
  data: CreateLessonPlanTemplateRequest
): Promise<CreateLessonPlanTemplateResponse> => {
  const response = await api.post(API_ENDPOINTS.LESSON_PLANS.BASE, data);
  return response.data;
};

// 1.2-1.4. Tạo các nodes
export const createLessonNode = async (
  data: CreateLessonNodeRequest
): Promise<LessonPlanNode> => {
  // Build request body exactly matching Swagger schema
  const requestBody: any = {
    lessonPlanTemplateId: data.lessonPlanTemplateId, // ⚠️ Schema uses lessonPlanTemplateId
    title: data.title,
    fieldType: data.fieldType,
    type: data.type,
    orderIndex: data.orderIndex,
  };

  // Optional fields - only add if present
  if (data.parentId !== null && data.parentId !== undefined) {
    requestBody.parentId = data.parentId;
  }
  if (data.content) {
    requestBody.content = data.content;
  }
  if (data.description) {
    requestBody.description = data.description;
  }

  console.log("🔍 CreateLessonNode Request Body:", JSON.stringify(requestBody, null, 2));
  
  const response = await api.post(API_ENDPOINTS.LESSON_PLANS.NODES, requestBody);
  return response.data;
};

/**
 * BƯỚC 2: GENERATE AI CONTENT (FASTAPI)
 */

// 2.1. Gọi FastAPI để tạo task AI
export const generateAIContent = async (
  data: GenerateAIContentRequest
): Promise<GenerateAIContentResponse> => {
  const response = await apiSecondary.post(
    API_ENDPOINTS.LESSON_PLAN_GENERATION,
    data
  );
  return response.data;
};

// 2.2. Poll task status
export const getTaskStatus = async (
  taskId: string
): Promise<TaskStatusResponse> => {
  const response = await apiSecondary.get(
    API_ENDPOINTS.AI_TASK_STATUS(taskId)
  );
  return response.data;
};

// 2.3. Get task result (nếu cần)
export const getTaskResult = async (taskId: string): Promise<any> => {
  const response = await apiSecondary.get(
    API_ENDPOINTS.AI_TASK_RESULT(taskId)
  );
  return response.data;
};

/**
 * BƯỚC 3: UPDATE CONTENT VÀO SPRINGBOOT
 */

// 3.1. Update node content
export const updateLessonNode = async (
  nodeId: number,
  data: UpdateLessonNodeRequest
): Promise<LessonPlanNode> => {
  const response = await api.put(
    `${API_ENDPOINTS.LESSON_PLANS.NODES}/${nodeId}`,
    data
  );
  return response.data;
};

/**
 * HELPER FUNCTIONS
 */

// Sleep utility for polling
export const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Poll task status với timeout và callback
export const pollTaskStatus = async (
  taskId: string,
  onProgress?: (status: TaskStatusResponse) => void,
  maxPolls: number = 200, // ~10 phút (200 polls * 3s = 600s)
  pollInterval: number = 3000 // 3 giây (theo recommendation)
): Promise<TaskStatusResponse> => {
  let pollCount = 0;

  while (pollCount < maxPolls) {
    const status = await getTaskStatus(taskId);

    // Log progress for debugging
    console.log(`[AI Polling ${pollCount + 1}/${maxPolls}] Status: ${status.status}, Progress: ${status.progress}%`);
    console.log(`Message: ${status.message || 'Processing...'}`);

    // Call progress callback
    if (onProgress) {
      onProgress(status);
    }

    // ✅ Check if completed
    if (status.status === "completed") {
      // Get full result when completed
      const fullResult = await getTaskResult(taskId);
      console.log('✅ AI Task completed successfully!');
      return fullResult;
    }

    // ❌ Check if failed
    if (status.status === "failed") {
      throw new Error(status.error || "AI generation failed");
    }

    // Wait before next poll
    await sleep(pollInterval);
    pollCount++;
  }

  throw new Error("Timeout: AI processing took too long (>10 minutes)");
};

/**
 * FULL FLOW: 3 BƯỚC HOÀN CHỈNH
 */

export interface CreateLessonPlanWithAIOptions {
  templateName: string;
  templateDescription?: string;
  nodes: Array<{
    title: string;
    description?: string;
    orderIndex: number;
    expectedLength?: "short" | "medium" | "long";
  }>;
  lessonId?: string;
  bookId?: string;
  userId: string;
  toolLogId?: number;
  onProgress?: (step: 1 | 2 | 3, progress: number, message: string) => void;
}

export interface CreateLessonPlanWithAIResult {
  lessonPlanId: number;
  nodes: LessonPlanNode[];
  aiResult: TaskStatusResponse["result"];
}

export const createLessonPlanWithAI = async (
  options: CreateLessonPlanWithAIOptions
): Promise<CreateLessonPlanWithAIResult> => {
  const {
    templateName,
    templateDescription,
    nodes: nodeDefs,
    lessonId,
    bookId,
    userId,
    toolLogId,
    onProgress,
  } = options;

  try {
    // ============================================
    // BƯỚC 1: TẠO STRUCTURE TRONG SPRINGBOOT
    // ============================================
    onProgress?.(1, 0, "Đang tạo cấu trúc giáo án...");

    // 1.1. Create lesson plan template
    const template = await createLessonPlanTemplate({
      name: templateName,
      description: templateDescription,
    });
    
    console.log("🔍 Template Response:", JSON.stringify(template, null, 2));
    
    // SpringBoot API returns { statusCode, message, data: { id, ... } }
    const lessonPlanId = template.data?.id || template.id;

    if (!lessonPlanId) {
      throw new Error("Template ID not found in response");
    }

    onProgress?.(1, 30, `Đã tạo template ID: ${lessonPlanId}`);

    // 1.2-1.4. Create nodes
    const createdNodes: LessonPlanNode[] = [];
    const totalNodes = nodeDefs.length;

    for (let i = 0; i < nodeDefs.length; i++) {
      const nodeDef = nodeDefs[i];
      const node = await createLessonNode({
        lessonPlanTemplateId: lessonPlanId, // ⚠️ Schema definition uses lessonPlanTemplateId
        parentId: null,
        title: nodeDef.title,
        content: nodeDef.description || "", // Dùng description làm content tạm
        description: nodeDef.description,
        fieldType: "INPUT",
        type: "SECTION",
        orderIndex: nodeDef.orderIndex,
        // Không gửi metadata - SpringBoot API không hỗ trợ
      });

      createdNodes.push(node);

      const progressPercent = 30 + ((i + 1) / totalNodes) * 70;
      onProgress?.(
        1,
        progressPercent,
        `Đã tạo node ${i + 1}/${totalNodes}: ${node.title}`
      );
    }

    onProgress?.(1, 100, "Hoàn thành tạo cấu trúc!");

    // ============================================
    // BƯỚC 2: GENERATE AI CONTENT
    // ============================================
    onProgress?.(2, 0, "Đang khởi tạo AI...");

    // 2.1. Prepare AI structure
    const aiStructure: AILessonPlanStructure = {
      id: `lesson_plan_template_${lessonPlanId}`, // ✅ Fix: use lessonPlanId not templateId
      title: templateName,
      type: "SECTION", // ✅ Backend chỉ chấp nhận 4 types: SECTION, SUBSECTION, PARAGRAPH, LIST_ITEM
      status: "ACTIVE", // ✅ BẮT BUỘC theo FastAPI schema
      children: createdNodes.map((node, index): LessonPlanNode => {
        const springbootNodeId = node.id || node.data?.id;
        
        if (!springbootNodeId) {
          console.warn(`⚠️ Node ${index} không có ID từ SpringBoot`);
        }

        return {
          id: `node_${springbootNodeId || index}`, // ID string cho FastAPI
          springboot_node_id: springbootNodeId, // ✅ ID số từ SpringBoot (top-level)
          title: node.title, // ✅ TITLE từ SpringBoot node
          content: "", // Empty - sẽ được AI fill
          type: "SECTION", // ✅ Dùng SECTION cho các node chính
          status: "ACTIVE", // ✅ BẮT BUỘC CHO MỖI NODE
          fieldType: node.fieldType || "INPUT",
          orderIndex: node.orderIndex,
          lessonPlanTemplateId: node.lessonPlanTemplateId,
          parentId: node.parentId,
          metadata: {
            springboot_node_id: springbootNodeId, // ✅ Lưu trong metadata để preserve
            expected_length: node.metadata?.expected_length || "medium",
            original_title: node.title, // Backup title
          },
        };
      }),
    };

    console.log('🔍 AI Structure prepared:', {
      rootId: aiStructure.id,
      rootTitle: aiStructure.title,
      childrenCount: aiStructure.children.length,
      children: aiStructure.children.map(c => ({
        id: c.id,
        springboot_node_id: c.springboot_node_id,
        title: c.title,
        type: c.type,
      }))
    });

    // 2.2. Create AI task
    const taskResponse = await generateAIContent({
      lesson_plan_json: aiStructure,
      lesson_id: lessonId,
      book_id: bookId,
      user_id: userId,
      tool_log_id: toolLogId,
    });

    const taskId = taskResponse.task_id;
    onProgress?.(2, 5, `Đã tạo task AI: ${taskId}`);

    // 2.3. Poll task status (mỗi 3 giây)
    const taskResult = await pollTaskStatus(
      taskId,
      (status) => {
        const progress = status.progress || 50;
        const message = status.message || `AI đang xử lý... (${progress}%)`;
        console.log(`[AI Progress] ${progress}% - ${message}`);
        onProgress?.(2, progress, message);
      },
      200,  // Max 200 polls (~10 phút)
      3000  // Poll mỗi 3 giây
    );

    // 2.4. Check result structure
    if (!taskResult.result || !taskResult.result.output) {
      console.error('❌ Invalid AI result structure:', taskResult);
      throw new Error("AI không trả về kết quả hợp lệ");
    }

    const aiOutput = taskResult.result.output;
    console.log('✅ AI Result received:', {
      totalNodes: aiOutput.children?.length || 0,
      rootTitle: aiOutput.title,
      statistics: taskResult.result.statistics
    });

    onProgress?.(2, 100, "AI đã tạo nội dung thành công!");

    // ============================================
    // BƯỚC 3: UPDATE CONTENT VÀO SPRINGBOOT
    // ============================================
    onProgress?.(3, 0, "Đang lưu nội dung AI vào giáo án...");

    const aiChildren = aiOutput.children;
    
    if (!aiChildren || aiChildren.length === 0) {
      throw new Error("AI không trả về nội dung cho các nodes");
    }
    
    const totalAINodes = aiChildren.length;

    console.log('🔄 Starting to update nodes to SpringBoot:', {
      totalNodes: totalAINodes,
      nodes: aiChildren.map(c => ({
        springboot_node_id: c.springboot_node_id || c.metadata?.springboot_node_id,
        title: c.title,
        hasContent: !!c.content,
        contentLength: c.content?.length || 0
      }))
    });

    for (let i = 0; i < aiChildren.length; i++) {
      const child = aiChildren[i];
      // ✅ Try to get springboot_node_id from both top-level and metadata
      const springbootNodeId = child.springboot_node_id || child.metadata?.springboot_node_id;

      if (!springbootNodeId) {
        console.warn(`⚠️ Node ${child.id} (${child.title}) không có springboot_node_id - SKIP`);
        continue;
      }

      // Convert to number if it's a string
      const nodeId: number = typeof springbootNodeId === 'string' 
        ? parseInt(springbootNodeId, 10) 
        : springbootNodeId as number;

      console.log(`📝 Updating node ${nodeId} (${child.title}):`, {
        contentPreview: child.content?.substring(0, 100) + '...',
        contentLength: child.content?.length || 0,
        fieldType: child.fieldType || "INPUT"
      });

      await updateLessonNode(nodeId, {
        content: child.content,
        fieldType: child.fieldType || "INPUT",
      });

      const progressPercent = ((i + 1) / totalAINodes) * 100;
      onProgress?.(
        3,
        progressPercent,
        `Đã cập nhật ${i + 1}/${totalAINodes}: ${child.title}`
      );
    }

    console.log('✅ All nodes updated successfully!');
    onProgress?.(3, 100, "Hoàn thành lưu nội dung!");

    // ============================================
    // DONE!
    // ============================================
    return {
      lessonPlanId,
      nodes: createdNodes,
      aiResult: taskResult.result,
    };
  } catch (error) {
    console.error("Error in createLessonPlanWithAI:", error);
    throw error;
  }
};
