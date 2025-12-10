'use client';

import { useState, useMemo } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import Modal from '@/components/ui/Modal';
import VerifyModal from '@/components/ui/VerifyModal';
import { Search, Plus, Edit, Trash2, ChevronRight, ChevronDown, Loader2 } from 'lucide-react';
import {
  useLessonPlanAllNodeService,
  useCreateLessonPlanNodeService,
  useUpdateLessonPlanNodeService,
  useDeleteLessonPlanNodeService,
} from '@/services/lessonPlanNodeServices';
import { useLessonPlanService } from '@/services/lessonPlanServices';
import { showSuccess, showError } from '@/lib/toast';
import { logError } from '@/lib/middleware';

interface LessonPlanNode {
  id: number;
  lessonPlanTemplateId: number;
  parentId: number | null;
  title: string;
  content: string;
  description: string | null;
  fieldType: string | null;
  type: 'SECTION' | 'SUBSECTION' | 'LIST_ITEM';
  orderIndex: number;
  metadata: any;
  status: 'ACTIVE' | 'INACTIVE';
  children: LessonPlanNode[];
}

interface Template {
  id: number;
  name: string;
  description: string;
  status: string;
}

export default function LessonPlanNodePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);

  return (
    <div className="flex flex-col">
      <MainContentSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
      />
    </div>
  );
}

function MainContentSection({
  searchQuery,
  setSearchQuery,
  selectedTemplateId,
  setSelectedTemplateId,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedTemplateId: number | null;
  setSelectedTemplateId: (id: number | null) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<LessonPlanNode | null>(null);
  const [parentNodeForCreate, setParentNodeForCreate] = useState<LessonPlanNode | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<{ id: number; name: string } | null>(null);

  // Fetch templates list (for dropdown selection)
  const { data: templatesData } = useLessonPlanService(
    ['all-templates'],
    undefined,
    { status: 'ACTIVE', page: 1, size: 100 }
  );

  // Fetch all nodes for selected template
  const { data: nodesData, isLoading: nodesLoading, refetch } = useLessonPlanAllNodeService(
    selectedTemplateId ? String(selectedTemplateId) : undefined
  )(
    selectedTemplateId ? [selectedTemplateId] : undefined,
    undefined,
    {}
  );

  const createMutation = useCreateLessonPlanNodeService();
  const updateMutation = useUpdateLessonPlanNodeService();
  const deleteMutation = useDeleteLessonPlanNodeService();

  const templates: Template[] = templatesData?.data?.content || [];
  const nodes: LessonPlanNode[] = nodesData?.data || [];

  // Filter nodes by search
  const filteredNodes = useMemo(() => {
    if (!searchQuery) return nodes;
    const filterRecursive = (node: LessonPlanNode): LessonPlanNode | null => {
      const matchesTitle = node.title.toLowerCase().includes(searchQuery.toLowerCase());
      const filteredChildren = node.children
        .map(filterRecursive)
        .filter((n): n is LessonPlanNode => n !== null);
      if (matchesTitle || filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
      return null;
    };
    return nodes.map(filterRecursive).filter((n): n is LessonPlanNode => n !== null);
  }, [nodes, searchQuery]);

  const handleCreateRoot = () => {
    setEditingNode(null);
    setParentNodeForCreate(null);
    setIsModalOpen(true);
  };

  const handleCreateChild = (parent: LessonPlanNode) => {
    setEditingNode(null);
    setParentNodeForCreate(parent);
    setIsModalOpen(true);
  };

  const handleEdit = (node: LessonPlanNode) => {
    setEditingNode(node);
    setParentNodeForCreate(null);
    setIsModalOpen(true);
  };

  const handleDelete = (node: LessonPlanNode) => {
    setVerifyTarget({ id: node.id, name: node.title });
  };

  const confirmDelete = async () => {
    if (!verifyTarget) return;
    try {
      await deleteMutation.mutateAsync(String(verifyTarget.id));
      showSuccess('Xóa node thành công!');
      setVerifyTarget(null);
      refetch();
    } catch (error) {
      logError(error, 'Delete Lesson Plan Node');
      showError('Xóa node thất bại!');
    }
  };

  const handleSubmit = async (formData: {
    title: string;
    content: string;
    description: string;
    fieldType: string;
    type: string;
    orderIndex: number;
  }) => {
    if (!selectedTemplateId) {
      showError('Vui lòng chọn mẫu giáo án trước!');
      return;
    }

    try {
      if (editingNode) {
        await updateMutation.mutateAsync({
          id: String(editingNode.id),
          data: {
            ...formData,
            lessonPlanTemplateId: selectedTemplateId,
            parentId: editingNode.parentId,
            status: editingNode.status,
          },
        });
        showSuccess('Cập nhật node thành công!');
      } else {
        await createMutation.mutateAsync({
          ...formData,
          lessonPlanTemplateId: selectedTemplateId,
          parentId: parentNodeForCreate?.id || null,
        });
        showSuccess('Tạo node thành công!');
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      logError(error, editingNode ? 'Update Lesson Plan Node' : 'Create Lesson Plan Node');
      showError(editingNode ? 'Cập nhật node thất bại!' : 'Tạo node thất bại!');
    }
  };

  return (
    <main className="flex-1 p-8">
      <HeaderSection onCreate={handleCreateRoot} />
      <TemplateSelectSection
        templates={templates}
        selectedTemplateId={selectedTemplateId}
        setSelectedTemplateId={setSelectedTemplateId}
      />
      <SearchSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <NodesTreeSection
        nodes={filteredNodes}
        isLoading={nodesLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreateChild={handleCreateChild}
        selectedTemplateId={selectedTemplateId}
      />

      {isModalOpen && (
        <NodeModal
          node={editingNode}
          parentNode={parentNodeForCreate}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <VerifyModal
        isOpen={!!verifyTarget}
        title="Xác nhận xóa"
        message={verifyTarget ? `Bạn có chắc chắn muốn xóa node "${verifyTarget.name}"? Tất cả node con cũng sẽ bị xóa.` : undefined}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        isLoading={deleteMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setVerifyTarget(null)}
      />
    </main>
  );
}

function HeaderSection({ onCreate }: { onCreate: () => void }) {
  return (
    <AnimatedSection animation="fade-up" className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-black mb-2">Quản lý Node Giáo án</h1>
          <p className="text-black text-sm">Quản lý cấu trúc node/khối trong mẫu giáo án</p>
        </div>
        <button
          onClick={onCreate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tạo Node gốc
        </button>
      </div>
    </AnimatedSection>
  );
}

function TemplateSelectSection({
  templates,
  selectedTemplateId,
  setSelectedTemplateId,
}: {
  templates: Template[];
  selectedTemplateId: number | null;
  setSelectedTemplateId: (id: number | null) => void;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={50} className="mb-6">
      <div className="bg-white rounded-xl shadow-sm p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Chọn mẫu giáo án</label>
        <select
          value={selectedTemplateId || ''}
          onChange={(e) => setSelectedTemplateId(e.target.value ? Number(e.target.value) : null)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="">-- Chọn mẫu --</option>
          {templates.map((template: Template) => (
            <option key={template.id} value={template.id}>
              {template.name}
            </option>
          ))}
        </select>
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
              placeholder="Tìm kiếm node..."
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

function NodesTreeSection({
  nodes,
  isLoading,
  onEdit,
  onDelete,
  onCreateChild,
  selectedTemplateId,
}: {
  nodes: LessonPlanNode[];
  isLoading: boolean;
  onEdit: (node: LessonPlanNode) => void;
  onDelete: (node: LessonPlanNode) => void;
  onCreateChild: (parent: LessonPlanNode) => void;
  selectedTemplateId: number | null;
}) {
  if (!selectedTemplateId) {
    return (
      <AnimatedSection animation="fade-up" delay={150}>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          Vui lòng chọn mẫu giáo án để xem cấu trúc node
        </div>
      </AnimatedSection>
    );
  }

  if (isLoading) {
    return (
      <AnimatedSection animation="fade-up" delay={150}>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
          Đang tải...
        </div>
      </AnimatedSection>
    );
  }

  if (nodes.length === 0) {
    return (
      <AnimatedSection animation="fade-up" delay={150}>
        <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
          Không có node nào. Hãy tạo node gốc.
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection animation="fade-up" delay={150}>
      <div className="bg-white rounded-xl shadow-sm p-6">
        {nodes.map((node: LessonPlanNode) => (
          <TreeNode
            key={node.id}
            node={node}
            onEdit={onEdit}
            onDelete={onDelete}
            onCreateChild={onCreateChild}
            level={0}
          />
        ))}
      </div>
    </AnimatedSection>
  );
}

function TreeNode({
  node,
  onEdit,
  onDelete,
  onCreateChild,
  level,
}: {
  node: LessonPlanNode;
  onEdit: (node: LessonPlanNode) => void;
  onDelete: (node: LessonPlanNode) => void;
  onCreateChild: (parent: LessonPlanNode) => void;
  level: number;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const hasChildren = node.children && node.children.length > 0;

  const nodeTypeColors: Record<string, string> = {
    SECTION: 'bg-blue-100 text-blue-700',
    SUBSECTION: 'bg-green-100 text-green-700',
    LIST_ITEM: 'bg-gray-100 text-gray-700',
  };

  const typeColor = nodeTypeColors[node.type] || 'bg-gray-100 text-gray-700';

  return (
    <div className="mb-2" style={{ marginLeft: `${level * 24}px` }}>
      <div className="flex items-center gap-2 p-3 hover:bg-gray-50 rounded-lg group">
        {/* Expand/Collapse button */}
        {hasChildren ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4 text-gray-600" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-600" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        {/* Node type badge */}
        <span className={`px-2 py-1 rounded text-xs font-medium ${typeColor}`}>
          {node.type}
        </span>

        {/* Node title */}
        <div className="flex-1">
          <div className="font-medium text-gray-900">{node.title}</div>
          {node.content && <div className="text-sm text-gray-500 mt-1">{node.content}</div>}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onCreateChild(node)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Thêm node con"
          >
            <Plus className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => onEdit(node)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Chỉnh sửa"
          >
            <Edit className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={() => onDelete(node)}
            className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            title="Xóa"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </div>

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="mt-1">
          {node.children.map((child: LessonPlanNode) => (
            <TreeNode
              key={child.id}
              node={child}
              onEdit={onEdit}
              onDelete={onDelete}
              onCreateChild={onCreateChild}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface NodeModalProps {
  node: LessonPlanNode | null;
  parentNode: LessonPlanNode | null;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    content: string;
    description: string;
    fieldType: string;
    type: string;
    orderIndex: number;
  }) => void;
  isSubmitting: boolean;
}

function NodeModal({ node, parentNode, onClose, onSubmit, isSubmitting }: NodeModalProps) {
  const [formData, setFormData] = useState({
    title: node?.title || '',
    content: node?.content || '',
    description: node?.description || '',
    fieldType: node?.fieldType || 'INPUT',
    type: node?.type || (parentNode ? 'SUBSECTION' : 'SECTION'),
    orderIndex: node?.orderIndex ?? 0,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const modalTitle = node
    ? 'Cập nhật Node'
    : parentNode
    ? `Tạo Node con cho "${parentNode.title}"`
    : 'Tạo Node gốc';

  return (
    <Modal isOpen={true} onClose={onClose} title={modalTitle} size="lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tiêu đề <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="Tiêu đề node"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Loại node <span className="text-red-500">*</span>
            </label>
            <select
              required
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as 'SECTION' | 'SUBSECTION' | 'LIST_ITEM' })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="SECTION">SECTION (Phần chính)</option>
              <option value="SUBSECTION">SUBSECTION (Phần phụ)</option>
              <option value="LIST_ITEM">LIST_ITEM (Mục)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nội dung</label>
          <textarea
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Nội dung mô tả"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            placeholder="Mô tả chi tiết"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Field Type</label>
            <select
              value={formData.fieldType}
              onChange={(e) => setFormData({ ...formData, fieldType: e.target.value })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            >
              <option value="">-- Không --</option>
              <option value="INPUT">INPUT</option>
              <option value="TEXTAREA">TEXTAREA</option>
              <option value="SELECT">SELECT</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Thứ tự</label>
            <input
              type="number"
              value={formData.orderIndex}
              onChange={(e) => setFormData({ ...formData, orderIndex: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              placeholder="0"
              min="0"
            />
          </div>
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
                {node ? 'Đang cập nhật...' : 'Đang tạo...'}
              </>
            ) : (
              node ? 'Cập nhật' : 'Tạo mới'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
