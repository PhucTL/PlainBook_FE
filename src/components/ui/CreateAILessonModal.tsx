'use client';

import { useState } from 'react';
import Modal from './Modal';
import { Sparkles } from 'lucide-react';

export interface CreateAILessonFormData {
  templateName: string;
  templateDescription: string;
  nodes: Array<{
    title: string;
    description: string;
    orderIndex: number;
    expectedLength: 'short' | 'medium' | 'long';
  }>;
  lessonId?: string;
  bookId?: string;
}

interface CreateAILessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateAILessonFormData) => void;
  isSubmitting?: boolean;
}

const DEFAULT_NODES = [
  {
    title: 'I. MỤC TIÊU BÀI HỌC',
    description: 'Mục tiêu về kiến thức, kỹ năng và thái độ',
    orderIndex: 1,
    expectedLength: 'medium' as const,
  },
  {
    title: 'II. NỘI DUNG BÀI HỌC',
    description: 'Nội dung kiến thức chi tiết',
    orderIndex: 2,
    expectedLength: 'long' as const,
  },
  {
    title: 'III. PHƯƠNG PHÁP GIẢNG DẠY',
    description: 'Các phương pháp và kỹ thuật dạy học',
    orderIndex: 3,
    expectedLength: 'medium' as const,
  },
];

export default function CreateAILessonModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
}: CreateAILessonModalProps) {
  const [formData, setFormData] = useState<CreateAILessonFormData>({
    templateName: '',
    templateDescription: '',
    nodes: DEFAULT_NODES,
    lessonId: '',
    bookId: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleNodeChange = (index: number, field: string, value: string) => {
    const newNodes = [...formData.nodes];
    newNodes[index] = { ...newNodes[index], [field]: value };
    setFormData({ ...formData, nodes: newNodes });
  };

  const addNode = () => {
    setFormData({
      ...formData,
      nodes: [
        ...formData.nodes,
        {
          title: '',
          description: '',
          orderIndex: formData.nodes.length + 1,
          expectedLength: 'medium',
        },
      ],
    });
  };

  const removeNode = (index: number) => {
    const newNodes = formData.nodes.filter((_, i) => i !== index);
    // Re-index
    newNodes.forEach((node, i) => {
      node.orderIndex = i + 1;
    });
    setFormData({ ...formData, nodes: newNodes });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Tạo Giáo Án AI" size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Header Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Sparkles className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-semibold text-blue-900 mb-1">
                Tạo giáo án tự động với AI
              </h4>
              <p className="text-sm text-blue-700">
                AI sẽ tự động tạo nội dung chi tiết cho giáo án dựa trên sách giáo khoa. 
                Quá trình có thể mất 1-3 phút.
              </p>
            </div>
          </div>
        </div>

        {/* Template Info */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên giáo án <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.templateName}
              onChange={(e) =>
                setFormData({ ...formData, templateName: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="VD: Bài 1: Hàm số bậc nhất"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mô tả
            </label>
            <textarea
              value={formData.templateDescription}
              onChange={(e) =>
                setFormData({ ...formData, templateDescription: e.target.value })
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black resize-none"
              placeholder="VD: Giáo án môn Toán lớp 10, chương 1"
            />
          </div>
        </div>

        {/* Book/Lesson Info (Optional) */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lesson ID (Tùy chọn)
            </label>
            <input
              type="text"
              value={formData.lessonId}
              onChange={(e) =>
                setFormData({ ...formData, lessonId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="VD: toan10-hamso"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book ID (Tùy chọn)
            </label>
            <input
              type="text"
              value={formData.bookId}
              onChange={(e) =>
                setFormData({ ...formData, bookId: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="VD: toan-10"
            />
          </div>
        </div>

        {/* Nodes Configuration */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700">
              Cấu trúc giáo án <span className="text-red-500">*</span>
            </label>
            <button
              type="button"
              onClick={addNode}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              + Thêm mục
            </button>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {formData.nodes.map((node, index) => (
              <div
                key={index}
                className="border border-gray-200 rounded-lg p-4 space-y-3 bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <span className="text-sm font-semibold text-gray-700">
                    Mục {index + 1}
                  </span>
                  {formData.nodes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeNode(index)}
                      className="text-sm text-red-600 hover:text-red-700"
                    >
                      Xóa
                    </button>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    required
                    value={node.title}
                    onChange={(e) => handleNodeChange(index, 'title', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Tiêu đề (VD: I. MỤC TIÊU BÀI HỌC)"
                  />
                </div>

                <div>
                  <input
                    type="text"
                    value={node.description}
                    onChange={(e) =>
                      handleNodeChange(index, 'description', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Mô tả"
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-600 mb-1">
                    Độ dài nội dung
                  </label>
                  <select
                    value={node.expectedLength}
                    onChange={(e) =>
                      handleNodeChange(index, 'expectedLength', e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  >
                    <option value="short">Ngắn (~100 từ)</option>
                    <option value="medium">Trung bình (~200-300 từ)</option>
                    <option value="long">Dài (~500+ từ)</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 flex items-center space-x-2"
          >
            <Sparkles className="w-5 h-5" />
            <span>{isSubmitting ? 'Đang tạo...' : 'Tạo với AI'}</span>
          </button>
        </div>
      </form>
    </Modal>
  );
}
