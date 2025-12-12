import { useState, useCallback } from "react";
import {
  createLessonPlanWithAI,
  type CreateLessonPlanWithAIOptions,
  type CreateLessonPlanWithAIResult,
} from "@/services/aiLessonPlanServices";

export interface AIGenerationProgress {
  step: 1 | 2 | 3;
  progress: number;
  message: string;
}

export interface UseAILessonGenerationReturn {
  generate: (
    options: Omit<CreateLessonPlanWithAIOptions, "onProgress">
  ) => Promise<CreateLessonPlanWithAIResult>;
  isGenerating: boolean;
  currentProgress: AIGenerationProgress | null;
  error: Error | null;
  result: CreateLessonPlanWithAIResult | null;
  reset: () => void;
}

/**
 * Hook để tạo giáo án với AI
 * Theo dõi tiến trình 3 bước: Create Structure → AI Generate → Update Content
 */
export const useAILessonGeneration = (): UseAILessonGenerationReturn => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgress, setCurrentProgress] =
    useState<AIGenerationProgress | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [result, setResult] = useState<CreateLessonPlanWithAIResult | null>(
    null
  );

  const generate = useCallback(
    async (
      options: Omit<CreateLessonPlanWithAIOptions, "onProgress">
    ): Promise<CreateLessonPlanWithAIResult> => {
      setIsGenerating(true);
      setError(null);
      setResult(null);
      setCurrentProgress({ step: 1, progress: 0, message: "Bắt đầu..." });

      try {
        const result = await createLessonPlanWithAI({
          ...options,
          onProgress: (step, progress, message) => {
            setCurrentProgress({ step, progress, message });
          },
        });

        setResult(result);
        setIsGenerating(false);
        setCurrentProgress({
          step: 3,
          progress: 100,
          message: "Hoàn thành!",
        });

        return result;
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err));
        setError(error);
        setIsGenerating(false);
        throw error;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setIsGenerating(false);
    setCurrentProgress(null);
    setError(null);
    setResult(null);
  }, []);

  return {
    generate,
    isGenerating,
    currentProgress,
    error,
    result,
    reset,
  };
};

/**
 * Hook đơn giản hơn để poll task status
 */
export interface UsePollTaskStatusOptions {
  taskId: string;
  enabled?: boolean;
  pollInterval?: number;
  maxPolls?: number;
  onProgress?: (progress: number, message: string) => void;
  onCompleted?: (result: any) => void;
  onError?: (error: Error) => void;
}

export const usePollTaskStatus = (options: UsePollTaskStatusOptions) => {
  const [status, setStatus] = useState<"idle" | "polling" | "completed" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<Error | null>(null);

  // Implementation would use useEffect and polling logic
  // For simplicity, returning the state
  return {
    status,
    progress,
    message,
    result,
    error,
  };
};
