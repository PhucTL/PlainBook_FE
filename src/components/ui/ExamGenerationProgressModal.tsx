import { useEffect } from "react";
import Modal from "./Modal";
import type { CreateExamWithAIResult } from "@/services/aiExamServices";
import { Download, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface ExamGenerationProgressModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProgress: {
    step: number; // 1: Creating task, 2: Generating exam
    progress: number; // 0-100
    message: string;
  } | null;
  result: CreateExamWithAIResult | null;
  error: Error | null;
  isGenerating: boolean;
}

export default function ExamGenerationProgressModal({
  isOpen,
  onClose,
  currentProgress,
  result,
  error,
  isGenerating,
}: ExamGenerationProgressModalProps) {
  // Auto download when completed
  useEffect(() => {
    if (result && result.downloadUrl) {
      // Auto download after 1 second
      const timer = setTimeout(() => {
        window.open(result.downloadUrl, "_blank");
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [result]);

  const getStepStatus = (stepNumber: number) => {
    if (!currentProgress) return "pending";
    if (currentProgress.step > stepNumber) return "completed";
    if (currentProgress.step === stepNumber) return "active";
    return "pending";
  };

  const renderStepIcon = (stepNumber: number) => {
    const status = getStepStatus(stepNumber);
    if (status === "completed") {
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    }
    if (status === "active") {
      return <Loader2 className="w-5 h-5 text-blue-500 animate-spin" />;
    }
    return (
      <div className="w-5 h-5 rounded-full border-2 border-gray-300"></div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={error || result ? onClose : undefined} // Prevent close while generating
      title={
        error
          ? "Tạo đề thi thất bại"
          : result
            ? "Tạo đề thi thành công!"
            : "Đang tạo đề thi AI..."
      }
    >
      <div className="space-y-6">
        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <XCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-800">
                  Đã xảy ra lỗi
                </h4>
                <p className="text-sm text-red-700 mt-1">{error.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h4 className="text-sm font-medium text-green-800">
                  Đề thi đã được tạo thành công!
                </h4>
                <p className="text-sm text-green-700 mt-1">{result.filename}</p>

                {/* Statistics */}
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <p className="text-xs text-gray-600">Tổng số câu</p>
                        <p className="text-lg font-semibold text-gray-900">
                          {result.statistics.total_questions ?? (result.statistics as any)?.total_questions}
                        </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <p className="text-xs text-gray-600">Part 1 (Trắc nghiệm)</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {(result.statistics as any)?.part1_count ?? (result.statistics as any)?.part_1_questions ?? 0}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <p className="text-xs text-gray-600">Part 2 (Đúng/Sai)</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {(result.statistics as any)?.part2_count ?? (result.statistics as any)?.part_2_questions ?? 0}
                    </p>
                  </div>
                  <div className="bg-white rounded-lg p-3 border border-green-100">
                    <p className="text-xs text-gray-600">Part 3 (Tự luận)</p>
                    <p className="text-lg font-semibold text-gray-900">
                      {(result.statistics as any)?.part3_count ?? (result.statistics as any)?.part_3_questions ?? 0}
                    </p>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => window.open(result.downloadUrl, "_blank")}
                  className="mt-4 w-full flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Tải xuống đề thi</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Progress State */}
        {isGenerating && !error && !result && (
          <div className="space-y-4">
            {/* Step 1 */}
            <div className="flex items-start space-x-3">
              {renderStepIcon(1)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Bước 1: Khởi tạo task AI
                </p>
                {currentProgress?.step === 1 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${currentProgress.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {currentProgress.message}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start space-x-3">
              {renderStepIcon(2)}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  Bước 2: AI đang tạo đề thi
                </p>
                {currentProgress?.step === 2 && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${currentProgress.progress}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {currentProgress.message}
                    </p>
                    <p className="text-xs text-blue-600 mt-1">
                      {currentProgress.progress}% hoàn thành
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Warning */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-xs text-yellow-800">
                ⏱️ Quá trình tạo đề thi có thể mất 1-3 phút. Vui lòng đợi...
              </p>
            </div>
          </div>
        )}

        {/* Close button (only show when done or error) */}
        {(error || result) && (
          <div className="flex justify-end pt-4 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Đóng
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
