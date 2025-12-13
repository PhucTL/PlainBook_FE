'use client';

import { useState, useMemo } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import Modal from '@/components/ui/Modal';
import VerifyModal from '@/components/ui/VerifyModal';
import Pagination from '@/components/ui/Pagination';
import { Search, Plus, Edit, Trash2, Eye, Loader2, CheckCircle, XCircle } from 'lucide-react';
import {
  useGradesService,
  useCreateGradeService,
  useUpdateGradeService,
  useDeleteGradeService,
  useUpdateGradeStatus,
} from '@/services/gradeServices';
import { showSuccess, showError } from '@/lib/toast';
import { logError } from '@/lib/middleware';

export default function GradePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  return (
    <div className="flex flex-col">
      <MainContentSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
      />
    </div>
  );
}

interface Grade {
  id: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

function MainContentSection({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  pageSize,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingGrade, setEditingGrade] = useState<Grade | null>(null);
  const [viewingGrade, setViewingGrade] = useState<Grade | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<{ id: number; name: string } | null>(null);

  const { data: gradeData, isLoading, refetch } = useGradesService();
  const createMutation = useCreateGradeService();
  const updateMutation = useUpdateGradeService();
  const deleteMutation = useDeleteGradeService();
  const statusMutation = useUpdateGradeStatus();

  const grades: Grade[] = gradeData?.data?.content || [];

  // Filter by search query (client-side)
  const filteredGrades = useMemo(() => {
    if (!searchQuery) return grades;
    return grades.filter((g: Grade) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [grades, searchQuery]);

  // Paginate
  const paginatedGrades = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredGrades.slice(startIndex, startIndex + pageSize);
  }, [filteredGrades, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredGrades.length / pageSize);

  const handleCreate = () => {
    setEditingGrade(null);
    setIsModalOpen(true);
  };

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setIsModalOpen(true);
  };

  const handleView = (grade: Grade) => {
    setViewingGrade(grade);
  };

  const handleDelete = (grade: Grade) => {
    setVerifyTarget({ id: grade.id, name: grade.name });
  };

  const confirmDelete = async () => {
    if (!verifyTarget) return;
    try {
      await deleteMutation.mutateAsync(verifyTarget.id.toString());
      showSuccess('Xóa khối lớp thành công!');
      setVerifyTarget(null);
      refetch();
    } catch (error) {
      logError(error, 'Delete Grade');
      showError('Xóa khối lớp thất bại!');
    }
  };

  const handleToggleStatus = async (grade: Grade) => {
    try {
      const newStatus = grade.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await statusMutation.mutateAsync({
        id: grade.id.toString(),
        field: 'status',
        queryParams: { newStatus },
      });
      showSuccess(`${newStatus === 'ACTIVE' ? 'Kích hoạt' : 'Vô hiệu hóa'} khối lớp thành công!`);
      refetch();
    } catch (error) {
      logError(error, 'Toggle Grade Status');
      showError('Cập nhật trạng thái thất bại!');
    }
  };

  const handleSubmit = async (formData: { name: string; status: 'ACTIVE' | 'INACTIVE' }) => {
    try {
      if (editingGrade) {
        await updateMutation.mutateAsync({
          id: editingGrade.id.toString(),
          data: formData,
        });
        showSuccess('Cập nhật khối lớp thành công!');
      } else {
        await createMutation.mutateAsync(formData);
        showSuccess('Tạo khối lớp thành công!');
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      logError(error, editingGrade ? 'Update Grade' : 'Create Grade');
      showError(editingGrade ? 'Cập nhật khối lớp thất bại!' : 'Tạo khối lớp thất bại!');
    }
  };

  return (
    <main className="flex-1 p-8">
      <HeaderSection onCreate={handleCreate} />
      <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <GradeTableSection
        grades={paginatedGrades}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onToggleStatus={handleToggleStatus}
      />
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {isModalOpen && (
        <GradeModal
          grade={editingGrade}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <VerifyModal
        isOpen={!!verifyTarget}
        title="Xác nhận xóa"
        message={verifyTarget ? `Bạn có chắc chắn muốn xóa khối lớp "${verifyTarget.name}"?` : undefined}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setVerifyTarget(null)}
      />

      {viewingGrade && (
        <GradeDetailModal grade={viewingGrade} onClose={() => setViewingGrade(null)} />
      )}
    </main>
  );
}

function HeaderSection({ onCreate }: { onCreate: () => void }) {
  return (
    <AnimatedSection animation="fade-up" className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-black mb-2">Quản lý Khối lớp</h1>
          <p className="text-black text-sm">
            Quản lý danh sách các khối lớp trong hệ thống (Lớp 10, Lớp 11, Lớp 12, v.v.)
          </p>
        </div>
        <button
          onClick={onCreate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tạo khối lớp mới
        </button>
      </div>
    </AnimatedSection>
  );
}

function SearchSection({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={100} className="mb-6">
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm khối lớp..."
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

function GradeTableSection({
  grades,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
}: {
  grades: Grade[];
  isLoading: boolean;
  onEdit: (g: Grade) => void;
  onDelete: (g: Grade) => void;
  onView: (g: Grade) => void;
  onToggleStatus: (g: Grade) => void;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={150}>
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          Đang tải...
        </div>
      ) : grades.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          Không tìm thấy khối lớp nào
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {grades.map((grade: Grade) => (
              <div key={grade.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{grade.name}</h3>
                      <button
                        onClick={() => onToggleStatus(grade)}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                          grade.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {grade.status === 'ACTIVE' ? (
                          <>
                            <CheckCircle className="w-3.5 h-3.5" />
                            Đang hoạt động
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3.5 h-3.5" />
                            Không hoạt động
                          </>
                        )}
                      </button>
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span>🕒 Tạo: {grade.createdAt}</span>
                      {grade.updatedAt && <span>📝 Cập nhật: {grade.updatedAt}</span>}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(grade)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => onEdit(grade)}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                    </button>
                    <button
                      onClick={() => onDelete(grade)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AnimatedSection>
  );
}

interface GradeModalProps {
  grade: Grade | null;
  onClose: () => void;
  onSubmit: (data: { name: string; status: 'ACTIVE' | 'INACTIVE' }) => void;
  isSubmitting: boolean;
}

function GradeModal({ grade, onClose, onSubmit, isSubmitting }: GradeModalProps) {
  const [formData, setFormData] = useState({
    name: grade?.name || '',
    status: grade?.status || 'ACTIVE' as 'ACTIVE' | 'INACTIVE',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={grade ? 'Cập nhật khối lớp' : 'Tạo khối lớp mới'} size="md">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên khối lớp <span className="text-red-500">*</span>
          </label>
          <input
            required
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Ví dụ: Lớp 10"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as 'ACTIVE' | 'INACTIVE' })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
          >
            <option value="ACTIVE">Hoạt động</option>
            <option value="INACTIVE">Không hoạt động</option>
          </select>
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
                {grade ? 'Đang cập nhật...' : 'Đang tạo...'}
              </>
            ) : (
              grade ? 'Cập nhật' : 'Tạo mới'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function GradeDetailModal({ grade, onClose }: { grade: Grade; onClose: () => void }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Chi tiết khối lớp" size="md">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Thông tin cơ bản</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tên khối lớp:</span>
              <span className="text-sm font-medium text-gray-900">{grade.name}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Trạng thái:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  grade.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {grade.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
          <div>Tạo lúc: {grade.createdAt}</div>
          {grade.updatedAt && <div>Cập nhật: {grade.updatedAt}</div>}
        </div>

        <div className="flex items-center justify-end gap-3 pt-4">
          <button onClick={onClose} className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
            Đóng
          </button>
        </div>
      </div>
    </Modal>
  );
}
