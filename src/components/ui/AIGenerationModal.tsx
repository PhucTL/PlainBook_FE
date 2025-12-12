'use client';

import { useEffect, useState } from 'react';
import Modal from './Modal';
import { Loader2, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { AIGenerationProgress } from '@/hooks/useAILessonGeneration';

interface AIGenerationModalProps {
  isOpen: boolean;
  onClose: () => void;
  progress: AIGenerationProgress | null;
  isGenerating: boolean;
  error: Error | null;
}

const stepLabels = {
  1: 'Tạo cấu trúc giáo án',
  2: 'AI tạo nội dung',
  3: 'Lưu vào hệ thống',
};

const stepIcons = {
  1: '📋',
  2: '🤖',
  3: '💾',
};

export default function AIGenerationModal({
  isOpen,
  onClose,
  progress,
  isGenerating,
  error,
}: AIGenerationModalProps) {
  const [canClose, setCanClose] = useState(false);

  useEffect(() => {
    // Chỉ cho phép đóng khi không generating hoặc có lỗi
    setCanClose(!isGenerating || !!error);
  }, [isGenerating, error]);

  const currentStep = progress?.step || 1;
  const currentProgress = progress?.progress || 0;
  const currentMessage = progress?.message || 'Đang khởi tạo...';

  const handleClose = () => {
    if (canClose) {
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Tạo Giáo Án AI"
      size="lg"
    >
      <div className="space-y-6">
        {/* Steps Indicator */}
        <div className="flex items-center justify-between">
          {[1, 2, 3].map((step) => (
            <div key={step} className="flex-1 flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl mb-2 transition-all ${
                  currentStep > step
                    ? 'bg-green-100 border-2 border-green-500'
                    : currentStep === step
                    ? 'bg-blue-100 border-2 border-blue-500 animate-pulse'
                    : 'bg-gray-100 border-2 border-gray-300'
                }`}
              >
                {currentStep > step ? (
                  <CheckCircle className="w-6 h-6 text-green-600" />
                ) : (
                  <span>{stepIcons[step as 1 | 2 | 3]}</span>
                )}
              </div>
              <p
                className={`text-sm text-center font-medium ${
                  currentStep >= step ? 'text-gray-900' : 'text-gray-400'
                }`}
              >
                {stepLabels[step as 1 | 2 | 3]}
              </p>
              {step < 3 && (
                <div className="w-full h-1 bg-gray-200 mt-2">
                  <div
                    className={`h-full transition-all ${
                      currentStep > step ? 'bg-green-500 w-full' : 'bg-gray-200 w-0'
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">{currentMessage}</span>
            <span className="font-semibold text-gray-900">{Math.round(currentProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300 ease-out"
              style={{ width: `${currentProgress}%` }}
            />
          </div>
        </div>

        {/* Status Message */}
        {isGenerating && !error && (
          <div className="flex items-center justify-center space-x-3 p-4 bg-blue-50 rounded-lg">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
            <p className="text-blue-900 font-medium">
              Đang xử lý... Vui lòng đợi (có thể mất 1-3 phút)
            </p>
          </div>
        )}

        {/* Success Message */}
        {!isGenerating && !error && currentProgress === 100 && (
          <div className="flex items-center justify-center space-x-3 p-4 bg-green-50 rounded-lg">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <p className="text-green-900 font-medium">Giáo án đã được tạo thành công!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="flex items-start space-x-3 p-4 bg-red-50 rounded-lg border border-red-200">
            <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-900 font-medium mb-1">Đã xảy ra lỗi</p>
              <p className="text-red-700 text-sm">{error.message}</p>
            </div>
          </div>
        )}

        {/* Warning - Do not close */}
        {isGenerating && (
          <div className="flex items-start space-x-3 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-yellow-800 text-sm">
              Vui lòng không đóng cửa sổ này trong quá trình tạo giáo án.
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          {canClose && (
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
            >
              {error ? 'Đóng' : 'Hoàn thành'}
            </button>
          )}
        </div>
      </div>
    </Modal>
  );
}
