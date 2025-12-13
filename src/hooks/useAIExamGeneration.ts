import { useState, useCallback } from "react";
import {
  createExamWithAI,
  type CreateExamWithAIOptions,
  type CreateExamWithAIResult,
} from "@/services/aiExamServices";

/**
 * Hook for AI Exam Generation with progress tracking
 *
 * Usage:
 * ```tsx
 * const { generate, isGenerating, currentProgress, result, error, reset } = useAIExamGeneration();
 *
 * const handleGenerate = async () => {
 *   try {
 *     const result = await generate({
 *       school: "THPT Nguyễn Du",
 *       grade: 12,
 *       subject: "GDCD",
 *       examTitle: "Kiểm tra học kỳ I",
 *       duration: 45,
 *       bookID: "gdcd-12",
 *       matrix: [...],
 *       userId: "user123"
 *     });
 *     console.log('Download URL:', result.downloadUrl);
 *   } catch (error) {
 *     console.error(error);
 *   }
 * };
 * ```
 */
export function useAIExamGeneration() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentProgress, setCurrentProgress] = useState<{
    step: number; // 1: Creating task, 2: Generating exam
    progress: number; // 0-100
    message: string;
  } | null>(null);
  const [result, setResult] = useState<CreateExamWithAIResult | null>(null);
  const [error, setError] = useState<Error | null>(null);

  const generate = useCallback(
    async (options: Omit<CreateExamWithAIOptions, "onProgress">) => {
      setIsGenerating(true);
      setError(null);
      setResult(null);
      setCurrentProgress(null);

      try {
        const examResult = await createExamWithAI({
          ...options,
          onProgress: (step, progress, message) => {
            setCurrentProgress({ step, progress, message });
          },
        });

        setResult(examResult);
        setIsGenerating(false);
        return examResult;
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
    setResult(null);
    setError(null);
  }, []);

  return {
    generate,
    isGenerating,
    currentProgress,
    result,
    error,
    reset,
  };
}
