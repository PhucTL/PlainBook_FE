'use client';

import { useState, useMemo } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import Modal from '@/components/ui/Modal';
import VerifyModal from '@/components/ui/VerifyModal';
import Pagination from '@/components/ui/Pagination';
import { Search, Plus, Edit, Trash2, Eye, Loader2, Filter, X } from 'lucide-react';
import {
  useQuestionBanksWithParamsService,
  useCreateQuestionBankService,
  useUpdateQuestionBankService,
  useDeleteQuestionBankService,
  type QuestionBankItem,
  type QuestionContent,
} from '@/services/questionBankServices';

// Extend QuestionBankItem with visibility field
interface ExtendedQuestionBankItem extends QuestionBankItem {
  visibility?: 'PUBLIC' | 'PRIVATE';
}
import { showSuccess, showError } from '@/lib/toast';
import { logError } from '@/lib/middleware';

type QuestionType = 'PART_I' | 'PART_II' | 'PART_III';
type DifficultyLevel = 'KNOWLEDGE' | 'COMPREHENSION' | 'APPLICATION' | 'ANALYSIS';

export default function QuestionBankPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [selectedQuestionTypes, setSelectedQuestionTypes] = useState<QuestionType[]>([]);
  const [selectedDifficultyLevels, setSelectedDifficultyLevels] = useState<DifficultyLevel[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  return (
    <div className="flex flex-col">
      <MainContentSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
        selectedQuestionTypes={selectedQuestionTypes}
        setSelectedQuestionTypes={setSelectedQuestionTypes}
        selectedDifficultyLevels={selectedDifficultyLevels}
        setSelectedDifficultyLevels={setSelectedDifficultyLevels}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
      />
    </div>
  );
}

function MainContentSection({
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage,
  pageSize,
  selectedQuestionTypes,
  setSelectedQuestionTypes,
  selectedDifficultyLevels,
  setSelectedDifficultyLevels,
  showFilters,
  setShowFilters,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
  selectedQuestionTypes: QuestionType[];
  setSelectedQuestionTypes: (types: QuestionType[]) => void;
  selectedDifficultyLevels: DifficultyLevel[];
  setSelectedDifficultyLevels: (levels: DifficultyLevel[]) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<ExtendedQuestionBankItem | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<{ id: number; question: string } | null>(null);
  const [viewingQuestion, setViewingQuestion] = useState<ExtendedQuestionBankItem | null>(null);

  // Build filter params
  const filterParams = useMemo(() => {
    const params: any = {
      page: currentPage - 1,
      size: pageSize,
    };
    if (selectedQuestionTypes.length > 0) {
      params.questionTypes = selectedQuestionTypes.join(',');
    }
    if (selectedDifficultyLevels.length > 0) {
      params.difficultyLevels = selectedDifficultyLevels.join(',');
    }
    return params;
  }, [currentPage, pageSize, selectedQuestionTypes, selectedDifficultyLevels]);

  const { data: questionsData, isLoading, refetch } = useQuestionBanksWithParamsService(
    [currentPage, pageSize, selectedQuestionTypes, selectedDifficultyLevels],
    undefined,
    filterParams
  );

  const createMutation = useCreateQuestionBankService();
  const updateMutation = useUpdateQuestionBankService();
  const deleteMutation = useDeleteQuestionBankService();

  const questions: ExtendedQuestionBankItem[] = questionsData?.data || [];
  const totalElements = questions.length; // Adjust if API returns total
  const totalPages = Math.ceil(totalElements / pageSize);

  // Filter by search query (client-side)
  const filteredQuestions = useMemo(() => {
    if (!searchQuery) return questions;
    return questions.filter((q: ExtendedQuestionBankItem) =>
      q.questionContent.question.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [questions, searchQuery]);

  const handleCreate = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  const handleEdit = (question: ExtendedQuestionBankItem) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleView = (question: ExtendedQuestionBankItem) => {
    setViewingQuestion(question);
  };

  const handleDelete = (question: ExtendedQuestionBankItem) => {
    setVerifyTarget({ id: question.id, question: question.questionContent.question });
  };

  const confirmDelete = async () => {
    if (!verifyTarget) return;
    try {
      // debug log before delete
      // eslint-disable-next-line no-console
      console.debug('[QuestionBank] Deleting question', { id: verifyTarget.id });
      await deleteMutation.mutateAsync(String(verifyTarget.id));
      showSuccess('Xóa câu hỏi thành công!');
      setVerifyTarget(null);
      refetch();
    } catch (error) {
      logError(error, 'Delete Question');
      showError('Xóa câu hỏi thất bại!');
    }
  };

  const handleSubmit = async (formData: any) => {
    try {
      if (editingQuestion) {
        // debug log before update
        // eslint-disable-next-line no-console
        console.debug('[QuestionBank] Updating question', { id: editingQuestion.id, data: formData });
        await updateMutation.mutateAsync({ id: String(editingQuestion.id), data: formData });
        showSuccess('Cập nhật câu hỏi thành công!');
      } else {
        // debug log before create
        // eslint-disable-next-line no-console
        console.debug('[QuestionBank] Creating question', { data: formData });
        await createMutation.mutateAsync(formData);
        showSuccess('Tạo câu hỏi thành công!');
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      logError(error, editingQuestion ? 'Update Question' : 'Create Question');
      showError(editingQuestion ? 'Cập nhật câu hỏi thất bại!' : 'Tạo câu hỏi thất bại!');
    }
  };

  return (
    <main className="flex-1 p-8">
      <HeaderSection onCreate={handleCreate} />
      <SearchAndFilterSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        selectedQuestionTypes={selectedQuestionTypes}
        setSelectedQuestionTypes={setSelectedQuestionTypes}
        selectedDifficultyLevels={selectedDifficultyLevels}
        setSelectedDifficultyLevels={setSelectedDifficultyLevels}
      />
      <QuestionsTableSection
        questions={filteredQuestions}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
      />
      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      )}

      {isModalOpen && (
        <QuestionModal
          question={editingQuestion}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <VerifyModal
        isOpen={!!verifyTarget}
        title="Xác nhận xóa"
        message={verifyTarget ? `Bạn có chắc chắn muốn xóa câu hỏi "${verifyTarget.question.substring(0, 50)}..."?` : undefined}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setVerifyTarget(null)}
      />

      {viewingQuestion && (
        <QuestionDetailModal question={viewingQuestion} onClose={() => setViewingQuestion(null)} />
      )}
    </main>
  );
}

function HeaderSection({ onCreate }: { onCreate: () => void }) {
  return (
    <AnimatedSection animation="fade-up" className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-black mb-2">Ngân hàng Câu hỏi</h1>
          <p className="text-black text-sm">Quản lý câu hỏi trắc nghiệm, tự luận và phân loại theo độ khó</p>
        </div>
        <button
          onClick={onCreate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tạo câu hỏi
        </button>
      </div>
    </AnimatedSection>
  );
}

function SearchAndFilterSection({
  searchQuery,
  setSearchQuery,
  showFilters,
  setShowFilters,
  selectedQuestionTypes,
  setSelectedQuestionTypes,
  selectedDifficultyLevels,
  setSelectedDifficultyLevels,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  showFilters: boolean;
  setShowFilters: (show: boolean) => void;
  selectedQuestionTypes: QuestionType[];
  setSelectedQuestionTypes: (types: QuestionType[]) => void;
  selectedDifficultyLevels: DifficultyLevel[];
  setSelectedDifficultyLevels: (levels: DifficultyLevel[]) => void;
}) {
  const toggleQuestionType = (type: QuestionType) => {
    setSelectedQuestionTypes(
      selectedQuestionTypes.includes(type)
        ? selectedQuestionTypes.filter((t) => t !== type)
        : [...selectedQuestionTypes, type]
    );
  };

  const toggleDifficultyLevel = (level: DifficultyLevel) => {
    setSelectedDifficultyLevels(
      selectedDifficultyLevels.includes(level)
        ? selectedDifficultyLevels.filter((l) => l !== level)
        : [...selectedDifficultyLevels, level]
    );
  };

  const clearFilters = () => {
    setSelectedQuestionTypes([]);
    setSelectedDifficultyLevels([]);
  };

  const activeFilterCount = selectedQuestionTypes.length + selectedDifficultyLevels.length;

  return (
    <AnimatedSection animation="fade-up" delay={100} className="mb-6">
      <div className="flex items-center gap-4 mb-4">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm câu hỏi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 border rounded-lg transition-colors flex items-center gap-2 ${
            activeFilterCount > 0 ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Filter className="w-5 h-5" />
          Bộ lọc
          {activeFilterCount > 0 && <span className="px-2 py-0.5 bg-blue-600 text-white rounded-full text-xs">{activeFilterCount}</span>}
        </button>
      </div>

      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-900">Bộ lọc nâng cao</h3>
            {activeFilterCount > 0 && (
              <button onClick={clearFilters} className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1">
                <X className="w-4 h-4" />
                Xóa bộ lọc
              </button>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Loại câu hỏi</label>
            <div className="flex flex-wrap gap-2">
              {(['PART_I', 'PART_II', 'PART_III'] as QuestionType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => toggleQuestionType(type)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedQuestionTypes.includes(type)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {type === 'PART_I' ? 'Trắc nghiệm' : type === 'PART_II' ? 'Đúng/Sai' : 'Tự luận ngắn'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Mức độ khó</label>
            <div className="flex flex-wrap gap-2">
              {(['KNOWLEDGE', 'COMPREHENSION', 'APPLICATION', 'ANALYSIS'] as DifficultyLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => toggleDifficultyLevel(level)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedDifficultyLevels.includes(level)
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {level === 'KNOWLEDGE' ? 'Nhận biết' : level === 'COMPREHENSION' ? 'Thông hiểu' : level === 'APPLICATION' ? 'Vận dụng' : 'Phân tích'}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </AnimatedSection>
  );
}

function QuestionsTableSection({
  questions,
  isLoading,
  onEdit,
  onDelete,
  onView,
}: {
  questions: ExtendedQuestionBankItem[];
  isLoading: boolean;
  onEdit: (q: ExtendedQuestionBankItem) => void;
  onDelete: (q: ExtendedQuestionBankItem) => void;
  onView: (q: ExtendedQuestionBankItem) => void;
}) {
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'PART_I': return 'Trắc nghiệm';
      case 'PART_II': return 'Đúng/Sai';
      case 'PART_III': return 'Tự luận';
      default: return type;
    }
  };

  const getDifficultyLabel = (level: string) => {
    switch (level) {
      case 'KNOWLEDGE': return 'Nhận biết';
      case 'COMPREHENSION': return 'Thông hiểu';
      case 'APPLICATION': return 'Vận dụng';
      case 'ANALYSIS': return 'Phân tích';
      default: return level;
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'KNOWLEDGE': return 'bg-green-100 text-green-700';
      case 'COMPREHENSION': return 'bg-blue-100 text-blue-700';
      case 'APPLICATION': return 'bg-orange-100 text-orange-700';
      case 'ANALYSIS': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <AnimatedSection animation="fade-up" delay={150}>
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          Đang tải...
        </div>
      ) : questions.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          Không tìm thấy câu hỏi nào
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {questions.map((question: ExtendedQuestionBankItem) => (
              <div key={question.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                        {getQuestionTypeLabel(question.questionType)}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${getDifficultyColor(question.difficultyLevel)}`}>
                        {getDifficultyLabel(question.difficultyLevel)}
                      </span>
                      {question.visibility && (
                        <span className={`px-2 py-1 text-xs font-medium rounded ${
                          question.visibility === 'PUBLIC' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {question.visibility === 'PUBLIC' ? 'Công khai' : 'Riêng tư'}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-900 font-medium mb-2 line-clamp-2">
                      {question.questionContent.question}
                    </p>
                    {question.questionContent.image && (
                      <div className="mb-2">
                        <img src={question.questionContent.image} alt="Question" className="h-16 rounded object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {question.referenceSource && <span>📚 {question.referenceSource}</span>}
                      <span>🕒 {new Date(question.createdAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(question)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onEdit(question)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => onDelete(question)}
                      className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
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

interface QuestionModalProps {
  question: ExtendedQuestionBankItem | null;
  onClose: () => void;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

function QuestionModal({ question, onClose, onSubmit, isSubmitting }: QuestionModalProps) {
  const [formData, setFormData] = useState({
    lessonIds: question?.lessonIds || [],
    questionType: question?.questionType || 'PART_I' as QuestionType,
    difficultyLevel: question?.difficultyLevel || 'KNOWLEDGE' as DifficultyLevel,
    questionContent: {
      question: question?.questionContent.question || '',
      image: question?.questionContent.image || '',
      options: question?.questionContent.options || { A: '', B: '', C: '', D: '' },
      answer: question?.questionContent.answer || '',
      statements: question?.questionContent.statements || {},
      keywords: question?.questionContent.keywords || [],
    },
    explanation: question?.explanation || '',
    referenceSource: question?.referenceSource || '',
    visibility: question?.visibility || 'PUBLIC',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Clean questionContent based on type
    const cleanedContent: any = {
      question: formData.questionContent.question,
      image: formData.questionContent.image || undefined,
    };

    if (formData.questionType === 'PART_I') {
      cleanedContent.options = formData.questionContent.options;
      cleanedContent.answer = formData.questionContent.answer;
    } else if (formData.questionType === 'PART_II') {
      cleanedContent.statements = formData.questionContent.statements;
    } else if (formData.questionType === 'PART_III') {
      cleanedContent.answer = formData.questionContent.answer;
      cleanedContent.keywords = formData.questionContent.keywords;
    }

    onSubmit({
      ...formData,
      questionContent: cleanedContent,
    });
  };

  const addStatement = () => {
    const newKey = String.fromCharCode(65 + Object.keys(formData.questionContent.statements).length);
    setFormData({
      ...formData,
      questionContent: {
        ...formData.questionContent,
        statements: {
          ...formData.questionContent.statements,
          [newKey]: { text: '', answer: true },
        },
      },
    });
  };

  const removeStatement = (key: string) => {
    const newStatements = { ...formData.questionContent.statements };
    delete newStatements[key];
    setFormData({
      ...formData,
      questionContent: {
        ...formData.questionContent,
        statements: newStatements,
      },
    });
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={question ? 'Cập nhật câu hỏi' : 'Tạo câu hỏi mới'} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại câu hỏi <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.questionType}
              onChange={(e) => setFormData({ ...formData, questionType: e.target.value as QuestionType })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="PART_I">Trắc nghiệm nhiều lựa chọn</option>
              <option value="PART_II">Đúng/Sai</option>
              <option value="PART_III">Tự luận ngắn</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mức độ khó <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.difficultyLevel}
              onChange={(e) => setFormData({ ...formData, difficultyLevel: e.target.value as DifficultyLevel })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="KNOWLEDGE">Nhận biết</option>
              <option value="COMPREHENSION">Thông hiểu</option>
              <option value="APPLICATION">Vận dụng</option>
              <option value="ANALYSIS">Phân tích</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Câu hỏi <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            value={formData.questionContent.question}
            onChange={(e) => setFormData({ ...formData, questionContent: { ...formData.questionContent, question: e.target.value } })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Nhập nội dung câu hỏi"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL hình ảnh (không bắt buộc)</label>
          <input
            type="url"
            value={formData.questionContent.image}
            onChange={(e) => setFormData({ ...formData, questionContent: { ...formData.questionContent, image: e.target.value } })}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="https://example.com/image.png"
          />
        </div>

        {/* PART_I: Multiple choice options */}
        {formData.questionType === 'PART_I' && (
          <>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">Các đáp án</label>
              {(['A', 'B', 'C', 'D'] as const).map((key) => (
                <div key={key} className="flex items-center gap-2">
                  <span className="font-medium text-gray-700 w-8">{key}.</span>
                  <input
                    required
                    type="text"
                    value={formData.questionContent.options[key] || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      questionContent: {
                        ...formData.questionContent,
                        options: { ...formData.questionContent.options, [key]: e.target.value },
                      },
                    })}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder={`Đáp án ${key}`}
                  />
                </div>
              ))}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Đáp án đúng <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.questionContent.answer}
                onChange={(e) => setFormData({ ...formData, questionContent: { ...formData.questionContent, answer: e.target.value } })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              >
                <option value="">-- Chọn đáp án --</option>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
            </div>
          </>
        )}

        {/* PART_II: True/False statements */}
        {formData.questionType === 'PART_II' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-sm font-medium text-gray-700">Các phát biểu</label>
              <button type="button" onClick={addStatement} className="text-sm text-blue-600 hover:text-blue-700">
                + Thêm phát biểu
              </button>
            </div>
            {Object.entries(formData.questionContent.statements).map(([key, stmt]: [string, any]) => (
              <div key={key} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                <span className="font-medium text-gray-700 w-8 mt-2">{key}.</span>
                <div className="flex-1 space-y-2">
                  <input
                    required
                    type="text"
                    value={stmt.text}
                    onChange={(e) => setFormData({
                      ...formData,
                      questionContent: {
                        ...formData.questionContent,
                        statements: {
                          ...formData.questionContent.statements,
                          [key]: { ...stmt, text: e.target.value },
                        },
                      },
                    })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                    placeholder="Nội dung phát biểu"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={stmt.answer === true}
                        onChange={() => setFormData({
                          ...formData,
                          questionContent: {
                            ...formData.questionContent,
                            statements: {
                              ...formData.questionContent.statements,
                              [key]: { ...stmt, answer: true },
                            },
                          },
                        })}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Đúng</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="radio"
                        checked={stmt.answer === false}
                        onChange={() => setFormData({
                          ...formData,
                          questionContent: {
                            ...formData.questionContent,
                            statements: {
                              ...formData.questionContent.statements,
                              [key]: { ...stmt, answer: false },
                            },
                          },
                        })}
                        className="text-blue-600"
                      />
                      <span className="text-sm text-gray-700">Sai</span>
                    </label>
                  </div>
                </div>
                <button type="button" onClick={() => removeStatement(key)} className="p-2 text-red-600 hover:bg-red-50 rounded">
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* PART_III: Short answer */}
        {formData.questionType === 'PART_III' && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Đáp án <span className="text-red-500">*</span>
            </label>
            <textarea
              required
              value={formData.questionContent.answer}
              onChange={(e) => setFormData({ ...formData, questionContent: { ...formData.questionContent, answer: e.target.value } })}
              rows={2}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Đáp án ngắn"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giải thích</label>
          <textarea
            value={formData.explanation}
            onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Giải thích chi tiết đáp án"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nguồn tham khảo</label>
            <input
              type="text"
              value={formData.referenceSource}
              onChange={(e) => setFormData({ ...formData, referenceSource: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="SGK Hóa học 10 - Trang 25"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Chế độ hiển thị</label>
            <select
              value={formData.visibility}
              onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'PUBLIC' | 'PRIVATE' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="PUBLIC">Công khai</option>
              <option value="PRIVATE">Riêng tư</option>
            </select>
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
                {question ? 'Đang cập nhật...' : 'Đang tạo...'}
              </>
            ) : (
              question ? 'Cập nhật' : 'Tạo mới'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function QuestionDetailModal({ question, onClose }: { question: ExtendedQuestionBankItem; onClose: () => void }) {
  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case 'PART_I': return 'Trắc nghiệm nhiều lựa chọn';
      case 'PART_II': return 'Đúng/Sai';
      case 'PART_III': return 'Tự luận ngắn';
      default: return type;
    }
  };

  return (
    <Modal isOpen={true} onClose={onClose} title="Chi tiết câu hỏi" size="lg">
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded">
            {getQuestionTypeLabel(question.questionType)}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded">
            {question.difficultyLevelDescription}
          </span>
        </div>

        <div>
          <h3 className="font-semibold text-gray-900 mb-2">Câu hỏi:</h3>
          <p className="text-gray-700">{question.questionContent.question}</p>
        </div>

        {question.questionContent.image && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Hình ảnh:</h3>
            <img src={question.questionContent.image} alt="Question" className="max-w-full h-auto rounded-lg border" />
          </div>
        )}

        {question.questionType === 'PART_I' && question.questionContent.options && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Các đáp án:</h3>
            <div className="space-y-2">
              {Object.entries(question.questionContent.options).map(([key, value]) => (
                <div
                  key={key}
                  className={`p-3 rounded-lg ${
                    key === question.questionContent.answer ? 'bg-green-100 border-2 border-green-500' : 'bg-gray-50'
                  }`}
                >
                  <span className="font-medium">{key}.</span> {value}
                  {key === question.questionContent.answer && <span className="ml-2 text-green-600">✓ Đáp án đúng</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {question.questionType === 'PART_II' && question.questionContent.statements && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Các phát biểu:</h3>
            <div className="space-y-2">
              {Object.entries(question.questionContent.statements).map(([key, stmt]: [string, any]) => (
                <div key={key} className="p-3 bg-gray-50 rounded-lg">
                  <div className="font-medium mb-1">{key}. {stmt.text}</div>
                  <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                    stmt.answer ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {stmt.answer ? 'Đúng' : 'Sai'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {question.questionType === 'PART_III' && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Đáp án:</h3>
            <p className="p-3 bg-green-50 text-gray-700 rounded-lg">{question.questionContent.answer}</p>
          </div>
        )}

        {question.explanation && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Giải thích:</h3>
            <p className="text-gray-700 p-3 bg-blue-50 rounded-lg">{question.explanation}</p>
          </div>
        )}

        {question.referenceSource && (
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Nguồn tham khảo:</h3>
            <p className="text-gray-700">📚 {question.referenceSource}</p>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
          <div>Tạo lúc: {new Date(question.createdAt).toLocaleString('vi-VN')}</div>
          {question.updatedAt && <div>Cập nhật: {new Date(question.updatedAt).toLocaleString('vi-VN')}</div>}
        </div>
      </div>
    </Modal>
  );
}
