'use client';

import { useState, useEffect } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import { Search, Plus, Sparkles } from 'lucide-react';
import CreateAIExamModal, { type CreateAIExamFormData } from '@/components/ui/CreateAIExamModal';
import ExamGenerationProgressModal from '@/components/ui/ExamGenerationProgressModal';
import { useAIExamGeneration } from '@/hooks/useAIExamGeneration';
import { getAvailableLessons } from '@/services/aiExamServices';
import { showSuccess, showError } from '@/lib/toast';
import { logError } from '@/lib/middleware';

export default function ExamTemplatePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [selectedBookID, setSelectedBookID] = useState('gdcd-12');

  // AI Generation Hook
  const {
    generate: generateExam,
    isGenerating,
    currentProgress,
    error: aiError,
    result: aiResult,
    reset: resetAI,
  } = useAIExamGeneration();

  const handleCreateWithAI = () => {
    resetAI();
    setIsAIModalOpen(true);
  };

  const handleAISubmit = async (formData: CreateAIExamFormData) => {
    setIsAIModalOpen(false);
    setIsProgressModalOpen(true);

    try {
      // Get user ID from localStorage
      const userId = localStorage.getItem('userId') || undefined;

      const result = await generateExam({
        school: formData.school,
        grade: formData.grade,
        subject: formData.subject,
        examTitle: formData.examTitle,
        duration: formData.duration,
        examCode: formData.examCode,
        bookID: formData.bookID,
        matrix: formData.matrix,
        userId,
      });

      showSuccess('Đề thi AI đã được tạo thành công!');
      console.log('Exam result:', result);
    } catch (error) {
      logError(error, 'AI Exam Generation');
      showError(aiError?.message || 'Tạo đề thi AI thất bại!');
    }
  };

  const handleProgressModalClose = () => {
    setIsProgressModalOpen(false);
    resetAI();
  };

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-8">
        {/* Header */}
        <AnimatedSection animation="fade-up" className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Quản lý Đề Thi
              </h1>
              <p className="text-gray-600">
                Tạo và quản lý đề thi với AI thông minh
              </p>
            </div>
            <button
              onClick={handleCreateWithAI}
              className="inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>Tạo Đề Thi AI</span>
            </button>
          </div>
        </AnimatedSection>

        {/* Search & Filter */}
        <AnimatedSection animation="fade-up" delay={100} className="mb-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="md:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm đề thi..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Book Filter */}
              <div>
                <select
                  value={selectedBookID}
                  onChange={(e) => setSelectedBookID(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="gdcd-12">GDCD 12</option>
                  <option value="hoa-12">Hóa học 12</option>
                  <option value="ly-12">Vật lý 12</option>
                  <option value="sinh-12">Sinh học 12</option>
                </select>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Exam List Placeholder */}
        <AnimatedSection animation="fade-up" delay={200}>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="text-center py-12">
              <Sparkles className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Chưa có đề thi nào
              </h3>
              <p className="text-gray-600 mb-6">
                Bắt đầu bằng cách tạo đề thi với AI thông minh
              </p>
              <button
                onClick={handleCreateWithAI}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="w-5 h-5" />
                <span>Tạo đề thi đầu tiên</span>
              </button>
            </div>
          </div>
        </AnimatedSection>
      </main>

      {/* AI Create Modal */}
      <CreateAIExamModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSubmit={handleAISubmit}
        isSubmitting={false}
        defaultBookID={selectedBookID}
        defaultSubject={selectedBookID.replace('-12', '').toUpperCase()}
      />

      {/* Progress Modal */}
      <ExamGenerationProgressModal
        isOpen={isProgressModalOpen}
        onClose={handleProgressModalClose}
        currentProgress={currentProgress}
        result={aiResult}
        error={aiError}
        isGenerating={isGenerating}
      />
    </div>
  );
}
