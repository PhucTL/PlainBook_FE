'use client';

import { useState } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import Pagination from '@/components/ui/Pagination';
import { Search, Plus, Edit, Trash2, Loader2, Sparkles } from 'lucide-react';
import Table from '@/components/Table';
import Modal from '@/components/ui/Modal';
import VerifyModal from '@/components/ui/VerifyModal';
import CreateAILessonModal from '@/components/ui/CreateAILessonModal';
import AIGenerationModal from '@/components/ui/AIGenerationModal';
import type { CreateAILessonFormData } from '@/components/ui/CreateAILessonModal';
import {
  useLessonPlanService,
  useCreateLessonPlanService,
  useUpdateLessonPlanService,
  useDeleteLessonPlanService,
} from '@/services/lessonPlanServices';
import { useAILessonGeneration } from '@/hooks/useAILessonGeneration';
import { showSuccess, showError } from '@/lib/toast';
import { logError } from '@/lib/middleware';
import { useRouter } from 'next/navigation';

interface LessonPlanTemplate {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export default function LessonPlanTemplatePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex flex-col">
      <MainContentSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </div>
  );
}

function MainContentSection({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
}) {
  const router = useRouter();
  const [pageSize] = useState(10);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<LessonPlanTemplate | null>(null);

  // AI Generation Hook
  const {
    generate: generateAI,
    isGenerating,
    currentProgress,
    error: aiError,
    result: aiResult,
    reset: resetAI,
  } = useAILessonGeneration();

  // use dynamic hook: dependencies?, options?, params?
  const { data: templatesData, isLoading, refetch } = useLessonPlanService(
    [searchQuery, currentPage, pageSize],
    undefined,
    { keyword: searchQuery, status: 'ACTIVE', page: currentPage, size: pageSize }
  );

  const createMutation = useCreateLessonPlanService();
  const updateMutation = useUpdateLessonPlanService();
  const deleteMutation = useDeleteLessonPlanService();

  const templates = templatesData?.data?.content || [];
  const totalPages = templatesData?.data?.totalPages || 1;
  const totalElements = templatesData?.data?.totalElements || 0;

  const handleCreate = () => {
    setEditingTemplate(null);
    setIsModalOpen(true);
  };

  const handleCreateWithAI = () => {
    resetAI();
    setIsAIModalOpen(true);
  };

  const handleAISubmit = async (formData: CreateAILessonFormData) => {
    setIsAIModalOpen(false);
    
    try {
      // Get user ID from localStorage or context
      const userId = localStorage.getItem('userId') || 'user123';
      
      const result = await generateAI({
        templateName: formData.templateName,
        templateDescription: formData.templateDescription,
        nodes: formData.nodes,
        lessonId: formData.lessonId,
        bookId: formData.bookId,
        userId,
        toolLogId: Date.now(),
      });

      showSuccess('Giáo án AI đã được tạo thành công!');
      refetch();
    } catch (error) {
      logError(error, 'AI Lesson Generation');
      showError(aiError?.message || 'Tạo giáo án AI thất bại!');
    }
  };

  const handleEdit = (template: LessonPlanTemplate) => {
    setEditingTemplate(template);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number, name: string) => {
    // open confirmation modal instead of window.confirm
    setVerifyTarget({ id, name });
  };

  // confirm state for verify modal
  const [verifyTarget, setVerifyTarget] = useState<{ id: number; name: string } | null>(null);

  const confirmDelete = async () => {
    if (!verifyTarget) return;
    try {
      await deleteMutation.mutateAsync(String(verifyTarget.id));
      showSuccess('Xóa giáo án thành công!');
      setVerifyTarget(null);
      refetch();
    } catch (error) {
      logError(error, 'Delete Lesson Plan Template');
      showError('Xóa giáo án thất bại!');
    }
  };

  const handleSubmit = async (formData: { name: string; description: string }) => {
    try {
      if (editingTemplate) {
        await updateMutation.mutateAsync({ id: String(editingTemplate.id), data: { name: formData.name, description: formData.description, status: editingTemplate.status } });
        showSuccess('Cập nhật giáo án thành công!');
      } else {
        await createMutation.mutateAsync({ name: formData.name, description: formData.description });
        showSuccess('Tạo giáo án thành công!');
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      logError(error, editingTemplate ? 'Update Lesson Plan Template' : 'Create Lesson Plan Template');
      showError(editingTemplate ? 'Cập nhật giáo án thất bại!' : 'Tạo giáo án thất bại!');
    }
  };

  return (
    <main className="flex-1 p-8">
      <HeaderSection onCreate={handleCreate} onCreateWithAI={handleCreateWithAI} />
      <SearchAndFilterSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <LessonPlansTableSection
        searchQuery={searchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        templates={templates}
        isLoading={isLoading}
        totalPages={totalPages}
        totalElements={totalElements}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onOpenCreate={() => setIsModalOpen(true)}
      />

      {/* Manual Create Modal */}
      {isModalOpen && (
        <LessonPlanModal template={editingTemplate} onClose={() => setIsModalOpen(false)} onSubmit={handleSubmit} isSubmitting={createMutation.isPending || updateMutation.isPending} />
      )}
      
      {/* AI Create Modal */}
      <CreateAILessonModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onSubmit={handleAISubmit}
        isSubmitting={false}
      />

      {/* AI Generation Progress Modal */}
      <AIGenerationModal
        isOpen={isGenerating || !!aiError || (!!aiResult && currentProgress?.progress === 100)}
        onClose={() => {
          resetAI();
        }}
        progress={currentProgress}
        isGenerating={isGenerating}
        error={aiError}
      />
      
      {/* Verify delete modal */}
      <VerifyModal
        isOpen={!!verifyTarget}
        title="Xác nhận xóa"
        message={verifyTarget ? `Bạn có chắc chắn muốn xóa mẫu giáo án "${verifyTarget.name}"?` : undefined}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setVerifyTarget(null)}
      />
    </main>
  );
}

function HeaderSection({ onCreate, onCreateWithAI }: { onCreate?: () => void; onCreateWithAI?: () => void }) {
  return (
    <AnimatedSection animation="fade-up" className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-black mb-2">Quản lý Mẫu Giáo án</h1>
          <p className="text-black text-sm">Quản lý tất cả mẫu giáo án trong hệ thống</p>
        </div>

        <div className="flex items-center gap-3">
          <button onClick={() => onCreate?.()} className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Tạo thủ công
          </button>
          
          <button 
            onClick={() => onCreateWithAI?.()} 
            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium flex items-center gap-2 shadow-md hover:shadow-lg"
          >
            <Sparkles className="w-5 h-5" />
            Tạo với AI
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
}

function SearchAndFilterSection({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={100} className="mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm giáo án..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function LessonPlansTableSection({
  searchQuery,
  currentPage,
  setCurrentPage,
  templates,
  isLoading,
  totalPages,
  totalElements,
  onEdit,
  onDelete,
  onOpenCreate,
}: {
  searchQuery: string;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  templates: LessonPlanTemplate[];
  isLoading: boolean;
  totalPages: number;
  totalElements: number;
  onEdit: (t: LessonPlanTemplate) => void;
  onDelete: (id: number, name: string) => void;
  onOpenCreate: () => void;
}) {
  const columns = [
    { key: 'id', label: 'ID', className: 'col-span-2 text-black font-medium' },
    { key: 'name', label: 'TÊN MẪU', className: 'col-span-4 text-black font-medium' },
    { key: 'description', label: 'MÔ TẢ', className: 'col-span-3 text-black' },
    {
      key: 'createdAt',
      label: 'NGÀY TẠO',
      className: 'col-span-2 text-black',
      render: (value: string) => new Date(value).toLocaleDateString('vi-VN'),
    },
  ];

  return (
    <AnimatedSection animation="fade-up" delay={200}>
      {isLoading ? (
        <div className="px-6 py-12 text-center text-gray-500">Đang tải...</div>
      ) : (
        <Table<LessonPlanTemplate>
          columns={columns}
          data={templates}
          gridClassName="grid grid-cols-12 gap-4"
          noDataText="Không tìm thấy mẫu giáo án nào"
          rowActions={(row) => (
            <>
              <button onClick={() => onEdit(row)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Chỉnh sửa">
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button onClick={() => onDelete(row.id, row.name)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Xóa">
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </>
          )}
        />
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}
    </AnimatedSection>
  );
}

interface LessonPlanModalProps {
  template: LessonPlanTemplate | null;
  onClose: () => void;
  onSubmit: (data: { name: string; description: string }) => void;
  isSubmitting: boolean;
}

function LessonPlanModal({ template, onClose, onSubmit, isSubmitting }: LessonPlanModalProps) {
  const [formData, setFormData] = useState({ name: template?.name || '', description: template?.description || '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={template ? 'Cập nhật mẫu giáo án' : 'Tạo mẫu giáo án mới'} size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tên mẫu <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Tên mẫu giáo án"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả <span className="text-red-500">*</span></label>
          <textarea
            required
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Mô tả"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 text-white" />
                {template ? 'Đang cập nhật...' : 'Đang tạo...'}
              </>
            ) : (
              template ? 'Cập nhật' : 'Tạo mới'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
