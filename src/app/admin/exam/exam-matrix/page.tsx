'use client';

import { useState, useMemo } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import Modal from '@/components/ui/Modal';
import VerifyModal from '@/components/ui/VerifyModal';
import Pagination from '@/components/ui/Pagination';
import { Search, Plus, Edit, Trash2, Eye, Loader2, Copy, CheckCircle, XCircle } from 'lucide-react';
import {
  useMatrixTemplatesService,
  useMatrixTemplateByIdService,
  useCreateMatrixTemplateService,
  useUpdateMatrixTemplateService,
  useDeleteMatrixTemplateService,
  useUpdateMatrixTemplateStatusService,
  type MatrixTemplateConfig,
  type MatrixPart,
  type DifficultyLevel,
} from '@/services/matrixTemplateServices';
import { showSuccess, showError } from '@/lib/toast';
import { logError } from '@/lib/middleware';

export default function ExamMatrixPage() {
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

interface MatrixConfig extends MatrixTemplateConfig {
  id: string;
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
  const [editingMatrix, setEditingMatrix] = useState<MatrixConfig | null>(null);
  const [viewingMatrix, setViewingMatrix] = useState<MatrixConfig | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<{ id: string; name: string } | null>(null);

  const { data: matrixData, isLoading, refetch } = useMatrixTemplatesService();
  const createMutation = useCreateMatrixTemplateService();
  const updateMutation = useUpdateMatrixTemplateService();
  const deleteMutation = useDeleteMatrixTemplateService();
  const statusMutation = useUpdateMatrixTemplateStatusService();

  const matrices: MatrixConfig[] = matrixData?.data || [];

  // Filter by search query (client-side)
  const filteredMatrices = useMemo(() => {
    if (!searchQuery) return matrices;
    return matrices.filter((m: MatrixConfig) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.description?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [matrices, searchQuery]);

  // Paginate
  const paginatedMatrices = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredMatrices.slice(startIndex, startIndex + pageSize);
  }, [filteredMatrices, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredMatrices.length / pageSize);

  const handleCreate = () => {
    setEditingMatrix(null);
    setIsModalOpen(true);
  };

  const handleEdit = (matrix: MatrixConfig) => {
    setEditingMatrix(matrix);
    setIsModalOpen(true);
  };

  const handleView = (matrix: MatrixConfig) => {
    setViewingMatrix(matrix);
  };

  const handleDelete = (matrix: MatrixConfig) => {
    setVerifyTarget({ id: matrix.id, name: matrix.name });
  };

  const confirmDelete = async () => {
    if (!verifyTarget) return;
    try {
      await deleteMutation.mutateAsync(verifyTarget.id);
      showSuccess('Xóa cấu hình ma trận thành công!');
      setVerifyTarget(null);
      refetch();
    } catch (error) {
      logError(error, 'Delete Matrix Config');
      showError('Xóa cấu hình ma trận thất bại!');
    }
  };

  const handleToggleStatus = async (matrix: MatrixConfig) => {
    try {
      const newStatus = matrix.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await statusMutation.mutateAsync({
        id: matrix.id,
        field: 'status',
        queryParams: { status: newStatus },
      });
      showSuccess(`${newStatus === 'ACTIVE' ? 'Kích hoạt' : 'Vô hiệu hóa'} cấu hình thành công!`);
      refetch();
    } catch (error) {
      logError(error, 'Toggle Matrix Status');
      showError('Cập nhật trạng thái thất bại!');
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        matrixJson: {
          parts: formData.parts,
        },
        status: formData.status || 'ACTIVE',
      };

      if (editingMatrix) {
        await updateMutation.mutateAsync({
          id: editingMatrix.id,
          data: payload,
        });
        showSuccess('Cập nhật cấu hình ma trận thành công!');
      } else {
        await createMutation.mutateAsync(payload);
        showSuccess('Tạo cấu hình ma trận thành công!');
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      logError(error, editingMatrix ? 'Update Matrix Config' : 'Create Matrix Config');
      showError(editingMatrix ? 'Cập nhật cấu hình thất bại!' : 'Tạo cấu hình thất bại!');
    }
  };

  return (
    <main className="flex-1 p-8">
      <HeaderSection onCreate={handleCreate} />
      <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <MatrixTableSection
        matrices={paginatedMatrices}
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
        <MatrixModal
          matrix={editingMatrix}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <VerifyModal
        isOpen={!!verifyTarget}
        title="Xác nhận xóa"
        message={verifyTarget ? `Bạn có chắc chắn muốn xóa cấu hình ma trận "${verifyTarget.name}"?` : undefined}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setVerifyTarget(null)}
      />

      {viewingMatrix && (
        <MatrixDetailModal matrix={viewingMatrix} onClose={() => setViewingMatrix(null)} />
      )}
    </main>
  );
}

function HeaderSection({ onCreate }: { onCreate: () => void }) {
  return (
    <AnimatedSection animation="fade-up" className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-black mb-2">Cấu hình Ma trận Đề thi</h1>
          <p className="text-black text-sm">
            Quản lý cấu hình ma trận cho các loại đề thi khác nhau (Trắc nghiệm, Đúng/Sai, Tự luận)
          </p>
        </div>
        <button
          onClick={onCreate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tạo cấu hình mới
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
              placeholder="Tìm kiếm cấu hình ma trận..."
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

function MatrixTableSection({
  matrices,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
}: {
  matrices: MatrixConfig[];
  isLoading: boolean;
  onEdit: (m: MatrixConfig) => void;
  onDelete: (m: MatrixConfig) => void;
  onView: (m: MatrixConfig) => void;
  onToggleStatus: (m: MatrixConfig) => void;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={150}>
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          Đang tải...
        </div>
      ) : matrices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          Không tìm thấy cấu hình ma trận nào
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {matrices.map((matrix: MatrixConfig) => (
              <div key={matrix.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="text-lg font-semibold text-gray-900">{matrix.name}</h3>
                      <button
                        onClick={() => onToggleStatus(matrix)}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                          matrix.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {matrix.status === 'ACTIVE' ? (
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
                    {matrix.description && (
                      <p className="text-gray-600 text-sm mb-3">{matrix.description}</p>
                    )}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-gray-700">Số phần:</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-sm font-medium">
                          {matrix.parts?.length || 0}
                        </span>
                      </div>
                      {matrix.parts?.map((part) => (
                        <div key={part.id} className={`px-3 py-1 rounded-lg ${part.color} border border-gray-200`}>
                          <span className={`text-sm font-medium ${part.color.replace('bg-', 'text-').replace('-50', '-700')}`}>
                            {part.label}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span>🕒 Tạo: {new Date(matrix.createdAt).toLocaleDateString('vi-VN')}</span>
                      {matrix.updatedAt && (
                        <span>📝 Cập nhật: {new Date(matrix.updatedAt).toLocaleDateString('vi-VN')}</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(matrix)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => onEdit(matrix)}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                    </button>
                    <button
                      onClick={() => onDelete(matrix)}
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

interface MatrixModalProps {
  matrix: MatrixConfig | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

function MatrixModal({ matrix, onClose, onSubmit, isSubmitting }: MatrixModalProps) {
  const [formData, setFormData] = useState({
    name: matrix?.name || '',
    description: matrix?.description || '',
    status: matrix?.status || 'ACTIVE',
    parts: matrix?.parts || [
      {
        id: 'part1',
        name: 'Phần 1',
        label: 'Trắc nghiệm',
        color: 'bg-amber-50',
        maximum: 40,
        difficultyLevels: [
          { id: 'nb', name: 'NB', label: 'Nhận biết', color: 'text-amber-700' },
          { id: 'th', name: 'TH', label: 'Thông hiểu', color: 'text-amber-700' },
          { id: 'vd', name: 'VD', label: 'Vận dụng', color: 'text-amber-700' },
        ],
      },
    ],
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const addPart = () => {
    const newPartNumber = formData.parts.length + 1;
    const colors = ['bg-amber-50', 'bg-green-50', 'bg-sky-50', 'bg-purple-50', 'bg-pink-50'];
    const textColors = ['text-amber-700', 'text-green-700', 'text-sky-700', 'text-purple-700', 'text-pink-700'];
    const colorIndex = (formData.parts.length) % colors.length;

    setFormData({
      ...formData,
      parts: [
        ...formData.parts,
        {
          id: `part${newPartNumber}`,
          name: `Phần ${newPartNumber}`,
          label: 'Mới',
          color: colors[colorIndex],
          maximum: 10,
          difficultyLevels: [
            { id: 'nb', name: 'NB', label: 'Nhận biết', color: textColors[colorIndex] },
            { id: 'th', name: 'TH', label: 'Thông hiểu', color: textColors[colorIndex] },
            { id: 'vd', name: 'VD', label: 'Vận dụng', color: textColors[colorIndex] },
          ],
        },
      ],
    });
  };

  const removePart = (index: number) => {
    setFormData({
      ...formData,
      parts: formData.parts.filter((_, i) => i !== index),
    });
  };

  const updatePart = (index: number, field: string, value: any) => {
    const updatedParts = [...formData.parts];
    updatedParts[index] = { ...updatedParts[index], [field]: value };
    setFormData({ ...formData, parts: updatedParts });
  };

  const addDifficultyLevel = (partIndex: number) => {
    const updatedParts = [...formData.parts];
    const part = updatedParts[partIndex];
    const newLevelNumber = part.difficultyLevels.length + 1;
    
    part.difficultyLevels.push({
      id: `level${newLevelNumber}`,
      name: `L${newLevelNumber}`,
      label: 'Mức độ mới',
      color: part.difficultyLevels[0]?.color || 'text-gray-700',
    });
    
    setFormData({ ...formData, parts: updatedParts });
  };

  const removeDifficultyLevel = (partIndex: number, levelIndex: number) => {
    const updatedParts = [...formData.parts];
    updatedParts[partIndex].difficultyLevels = updatedParts[partIndex].difficultyLevels.filter(
      (_, i) => i !== levelIndex
    );
    setFormData({ ...formData, parts: updatedParts });
  };

  const updateDifficultyLevel = (partIndex: number, levelIndex: number, field: string, value: any) => {
    const updatedParts = [...formData.parts];
    updatedParts[partIndex].difficultyLevels[levelIndex] = {
      ...updatedParts[partIndex].difficultyLevels[levelIndex],
      [field]: value,
    };
    setFormData({ ...formData, parts: updatedParts });
  };

  const colorOptions = [
    { bg: 'bg-amber-50', text: 'text-amber-700', label: 'Vàng cam' },
    { bg: 'bg-green-50', text: 'text-green-700', label: 'Xanh lá' },
    { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Xanh dương' },
    { bg: 'bg-purple-50', text: 'text-purple-700', label: 'Tím' },
    { bg: 'bg-pink-50', text: 'text-pink-700', label: 'Hồng' },
    { bg: 'bg-red-50', text: 'text-red-700', label: 'Đỏ' },
    { bg: 'bg-indigo-50', text: 'text-indigo-700', label: 'Chàm' },
  ];

  return (
    <Modal isOpen={true} onClose={onClose} title={matrix ? 'Cập nhật cấu hình ma trận' : 'Tạo cấu hình ma trận mới'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[75vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tên cấu hình <span className="text-red-500">*</span>
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Ví dụ: Cấu hình ma trận THPT"
            />
          </div>

          <div className="col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Mô tả ngắn về cấu hình này..."
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
        </div>

        <div className="border-t border-gray-200 pt-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Cấu hình các phần thi</h3>
            <button
              type="button"
              onClick={addPart}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Thêm phần
            </button>
          </div>

          <div className="space-y-6">
            {formData.parts.map((part, partIndex) => (
              <div key={partIndex} className={`p-4 ${part.color} rounded-lg border-2 border-gray-200`}>
                <div className="flex items-start justify-between mb-4">
                  <h4 className="font-semibold text-gray-900">Phần {partIndex + 1}</h4>
                  {formData.parts.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePart(partIndex)}
                      className="text-red-600 hover:text-red-700 text-sm"
                    >
                      Xóa phần
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">ID phần *</label>
                    <input
                      required
                      type="text"
                      value={part.id}
                      onChange={(e) => updatePart(partIndex, 'id', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-black bg-white"
                      placeholder="part1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Tên phần *</label>
                    <input
                      required
                      type="text"
                      value={part.name}
                      onChange={(e) => updatePart(partIndex, 'name', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-black bg-white"
                      placeholder="Phần 1"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Nhãn hiển thị *</label>
                    <input
                      required
                      type="text"
                      value={part.label}
                      onChange={(e) => updatePart(partIndex, 'label', e.target.value)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-black bg-white"
                      placeholder="Trắc nghiệm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Số câu tối đa</label>
                    <input
                      type="number"
                      min="0"
                      value={part.maximum || ''}
                      onChange={(e) => updatePart(partIndex, 'maximum', e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded text-sm text-black bg-white"
                      placeholder="40"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu nền</label>
                    <div className="flex flex-wrap gap-2">
                      {colorOptions.map((colorOption) => (
                        <button
                          key={colorOption.bg}
                          type="button"
                          onClick={() => {
                            updatePart(partIndex, 'color', colorOption.bg);
                            // Also update text colors for difficulty levels
                            const updatedParts = [...formData.parts];
                            updatedParts[partIndex].difficultyLevels = updatedParts[partIndex].difficultyLevels.map(
                              (level) => ({ ...level, color: colorOption.text })
                            );
                            setFormData({ ...formData, parts: updatedParts });
                          }}
                          className={`px-3 py-1.5 rounded border-2 text-xs font-medium transition-all ${
                            part.color === colorOption.bg
                              ? 'border-blue-500 shadow-sm'
                              : 'border-gray-300 hover:border-gray-400'
                          } ${colorOption.bg} ${colorOption.text}`}
                        >
                          {colorOption.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white bg-opacity-60 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-sm font-semibold text-gray-800">Mức độ khó</h5>
                    <button
                      type="button"
                      onClick={() => addDifficultyLevel(partIndex)}
                      className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                    >
                      + Thêm mức độ
                    </button>
                  </div>
                  <div className="space-y-2">
                    {part.difficultyLevels.map((level, levelIndex) => (
                      <div key={levelIndex} className="flex items-center gap-2 bg-white p-2 rounded border border-gray-200">
                        <input
                          required
                          type="text"
                          value={level.id}
                          onChange={(e) => updateDifficultyLevel(partIndex, levelIndex, 'id', e.target.value)}
                          className="w-20 px-2 py-1 border border-gray-300 rounded text-xs text-black"
                          placeholder="nb"
                        />
                        <input
                          required
                          type="text"
                          value={level.name}
                          onChange={(e) => updateDifficultyLevel(partIndex, levelIndex, 'name', e.target.value)}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-xs text-black"
                          placeholder="NB"
                        />
                        <input
                          required
                          type="text"
                          value={level.label}
                          onChange={(e) => updateDifficultyLevel(partIndex, levelIndex, 'label', e.target.value)}
                          className="flex-1 px-2 py-1 border border-gray-300 rounded text-xs text-black"
                          placeholder="Nhận biết"
                        />
                        {part.difficultyLevels.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeDifficultyLevel(partIndex, levelIndex)}
                            className="text-red-600 hover:text-red-700 text-xs px-2"
                          >
                            Xóa
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white">
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
                {matrix ? 'Đang cập nhật...' : 'Đang tạo...'}
              </>
            ) : (
              matrix ? 'Cập nhật' : 'Tạo mới'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function MatrixDetailModal({ matrix, onClose }: { matrix: MatrixConfig; onClose: () => void }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Chi tiết cấu hình ma trận" size="xl">
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Thông tin cơ bản</h3>
          <div className="bg-gray-50 rounded-lg p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Tên:</span>
              <span className="text-sm font-medium text-gray-900">{matrix.name}</span>
            </div>
            {matrix.description && (
              <div className="flex items-start justify-between">
                <span className="text-sm text-gray-600">Mô tả:</span>
                <span className="text-sm text-gray-900 text-right flex-1 ml-4">{matrix.description}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Trạng thái:</span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  matrix.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}
              >
                {matrix.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-3">Cấu trúc ma trận ({matrix.parts?.length || 0} phần)</h3>
          <div className="space-y-4">
            {matrix.parts?.map((part, index) => (
              <div key={part.id} className={`${part.color} rounded-lg p-4 border-2 border-gray-200`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-900">#{index + 1}</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">{part.name}</h4>
                      <p className="text-sm text-gray-600">{part.label}</p>
                    </div>
                  </div>
                  {part.maximum && (
                    <div className="px-3 py-1 bg-white rounded-lg border border-gray-300">
                      <span className="text-xs text-gray-600">Tối đa:</span>
                      <span className="ml-1 font-semibold text-gray-900">{part.maximum} câu</span>
                    </div>
                  )}
                </div>

                <div className="bg-white bg-opacity-70 rounded-lg p-3">
                  <h5 className="text-xs font-semibold text-gray-700 mb-2 uppercase">Mức độ khó</h5>
                  <div className="grid grid-cols-3 gap-2">
                    {part.difficultyLevels?.map((level) => (
                      <div key={level.id} className="bg-white rounded border border-gray-200 p-2">
                        <div className={`font-medium text-sm ${level.color}`}>{level.name}</div>
                        <div className="text-xs text-gray-600">{level.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
          <div>Tạo lúc: {new Date(matrix.createdAt).toLocaleString('vi-VN')}</div>
          {matrix.updatedAt && <div>Cập nhật: {new Date(matrix.updatedAt).toLocaleString('vi-VN')}</div>}
        </div>
      </div>
    </Modal>
  );
}
