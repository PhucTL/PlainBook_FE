'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import AnimatedSection from '@/components/animation/AnimatedSection';
import { useSlideTemplateByIdService } from '@/services/slideTemplateServices';
import { Loader2, ChevronLeft, Download, Share2, Play } from 'lucide-react';

interface Slide {
  id: string;
  title: string;
  elements: any[];
  isVisible: boolean;
  background: string;
}

interface SlideTemplate {
  id: number;
  name: string;
  description?: string;
  status: string;
  textBlocks: {
    slides: Slide[];
    version: string;
    createdAt: string;
    slideFormat: string;
  };
  imageBlocks: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export default function SlideTemplateDetailPage() {
  const params = useParams();
  const templateId = params.id as string;
  const [selectedSlideIndex, setSelectedSlideIndex] = useState(0);

  const { data, isLoading, error } = useSlideTemplateByIdService(templateId);
  
  const template: SlideTemplate | null = data?.data || null;
  const slides = template?.textBlocks?.slides || [];
  const imageBlocks = template?.imageBlocks || {};

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-black">Đang tải template...</p>
        </div>
      </div>
    );
  }

  if (error || !template) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">Không thể tải template</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const selectedSlide = slides[selectedSlideIndex];
  const selectedSlideImageKey = `slide_${selectedSlideIndex + 1}`;
  const selectedSlideImage = imageBlocks[selectedSlideImageKey];

  return (
    <div className="h-screen flex bg-gray-50 overflow-hidden">
        {/* Sidebar - Thumbnails */}
        <aside className="w-64 bg-white border-r border-black-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-sm font-semibold text-black mb-3">
              Slide ({slides.length})
            </h2>
            <div className="space-y-3">
              {slides.map((slide, index) => {
                const imageKey = `slide_${index + 1}`;
                const thumbnailUrl = imageBlocks[imageKey];
                const isSelected = index === selectedSlideIndex;

                return (
                  <button
                    key={slide.id}
                    onClick={() => setSelectedSlideIndex(index)}
                    className={`w-full text-left group relative rounded-lg overflow-hidden transition-all ${
                      isSelected
                        ? 'ring-2 ring-blue-600 shadow-md'
                        : 'hover:ring-2 hover:ring-black-300'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="relative aspect-video bg-black-100">
                      {thumbnailUrl ? (
                        <img
                          src={thumbnailUrl}
                          alt={slide.title}
                          className="w-full h-full object-contain"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-black">
                          <span className="text-4xl font-bold">{index + 1}</span>
                        </div>
                      )}
                      
                      {/* Slide Number Badge */}
                      <div className="absolute top-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                        {index + 1}
                      </div>
                    </div>

                    {/* Slide Title */}
                    <div className="p-2 bg-white">
                      <p className="text-xs text-black truncate font-medium">
                        {slide.title || `Slide ${index + 1}`}
                      </p>
                    </div>

                    {/* Selected Indicator */}
                    {isSelected && (
                      <div className="absolute inset-0 border-2 border-blue-600 rounded-lg pointer-events-none" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Preview Area */}
        <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
          <AnimatedSection animation="fade-up" className="w-full max-w-5xl">
            {/* Slide Preview */}
            <div className="bg-white rounded-xl shadow-2xl overflow-hidden mt-[150px]">
              <div className="relative aspect-video bg-gray-100">
                {selectedSlideImage ? (
                  <img
                    src={selectedSlideImage}
                    alt={selectedSlide?.title || `Slide ${selectedSlideIndex + 1}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-black">
                    <div className="text-center">
                      <span className="text-6xl font-bold block mb-2">
                        {selectedSlideIndex + 1}
                      </span>
                      <p className="text-lg">{selectedSlide?.title || 'Không có hình ảnh'}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Slide Info Footer */}
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-black">
                      {selectedSlide?.title || `Slide ${selectedSlideIndex + 1}`}
                    </h3>
                    <p className="text-sm text-black">
                      {selectedSlide?.elements?.length || 0} phần tử
                    </p>
                  </div>
                  <div className="text-sm text-black">
                    {selectedSlideIndex + 1} / {slides.length}
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setSelectedSlideIndex(Math.max(0, selectedSlideIndex - 1))}
                disabled={selectedSlideIndex === 0}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-black"
              >
                ← Trước
              </button>
              <span className="text-sm text-black">
                Slide {selectedSlideIndex + 1} / {slides.length}
              </span>
              <button
                onClick={() => setSelectedSlideIndex(Math.min(slides.length - 1, selectedSlideIndex + 1))}
                disabled={selectedSlideIndex === slides.length - 1}
                className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-black"
              >
                Sau →
              </button>
            </div>

            {/* Template Info */}
            <div className="mt-8 bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-black mb-4">Thông tin Template</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-black">Định dạng:</span>
                  <span className="ml-2 font-medium text-black">{template.textBlocks?.slideFormat || '16:9'}</span>
                </div>
                <div>
                  <span className="text-black">Phiên bản:</span>
                  <span className="ml-2 font-medium text-black">{template.textBlocks?.version || '1.0'}</span>
                </div>
                <div>
                  <span className="text-black">Tạo lúc:</span>
                  <span className="ml-2 font-medium text-black">
                    {new Date(template.createdAt).toLocaleString('vi-VN')}
                  </span>
                </div>
                <div>
                  <span className="text-black">Cập nhật:</span>
                  <span className="ml-2 font-medium text-black">
                    {new Date(template.updatedAt).toLocaleString('vi-VN')}
                  </span>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </main>
    </div>
  );
}
