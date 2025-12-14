'use client';

import { useState, useMemo } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import Modal from '@/components/ui/Modal';
import VerifyModal from '@/components/ui/VerifyModal';
import Pagination from '@/components/ui/Pagination';
import { Search, Plus, Edit, Trash2, Eye, Loader2, CheckCircle, XCircle, User, Mail, Phone, Calendar } from 'lucide-react';
import {
  useAllUsersService,
  useCreateUserService,
  useUpdateProfileService,
  useUpdateUserStatusService,
} from '@/services/userService';
import api from '@/config/axios';
import { showSuccess, showError } from '@/lib/toast';
import { logError } from '@/lib/middleware';

export default function ManageUserPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  return (
    <div className="flex flex-col">
      <MainContentSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        pageSize={pageSize}
      />
    </div>
  );
}

interface UserData {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: 'TEACHER' | 'ADMIN' | 'STAFF' | 'PARTNER';
  phone: string | null;
  avatar: string | null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null;
  birthday: string | null;
  status: 'ACTIVE' | 'INACTIVE' | 'DELETED';
  createdAt: string;
  updatedAt: string;
  wallet?: {
    id: string;
    balance: number;
  };
}

interface UserFormData {
  fullName: string;
  username: string;
  email: string;
  password?: string;
  role: 'TEACHER' | 'ADMIN' | 'STAFF' | 'PARTNER';
  phone?: string;
  avatar?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  birthday?: string;
}

function MainContentSection({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
  currentPage,
  setCurrentPage,
  pageSize,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  roleFilter: string;
  setRoleFilter: (r: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
  currentPage: number;
  setCurrentPage: (p: number) => void;
  pageSize: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserData | null>(null);
  const [viewingUser, setViewingUser] = useState<UserData | null>(null);
  const [verifyTarget, setVerifyTarget] = useState<{ id: string; name: string } | null>(null);

  const params = useMemo(() => {
    const p: any = {
      offset: (currentPage - 1) * pageSize + 1,
      pageSize,
    };
    if (searchQuery) p.search = searchQuery;
    if (roleFilter) p.role = roleFilter;
    if (statusFilter) p.status = statusFilter;
    return p;
  }, [currentPage, pageSize, searchQuery, roleFilter, statusFilter]);

  const { data: userData, isLoading, refetch } = useAllUsersService([], {}, params);
  const createMutation = useCreateUserService();
  const updateMutation = useUpdateProfileService();
  const statusMutation = useUpdateUserStatusService();

  const users: UserData[] = userData?.data?.content || [];
  const totalPages = userData?.data?.totalPages || 1;

  const handleCreate = () => {
    setEditingUser(null);
    setIsModalOpen(true);
  };

  const handleEdit = (user: UserData) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };

  const handleView = (user: UserData) => {
    setViewingUser(user);
  };

  const handleDelete = (user: UserData) => {
    setVerifyTarget({ id: user.id, name: user.fullName });
  };

  const confirmDelete = async () => {
    if (!verifyTarget) return;
    try {
      await api.patch(`/identity-service/api/users/${verifyTarget.id}/status`, null, {
        params: { status: 'DELETED' },
      });
      showSuccess('Xóa người dùng thành công!');
      setVerifyTarget(null);
      refetch();
    } catch (error) {
      logError(error, 'Delete User');
      showError('Xóa người dùng thất bại!');
    }
  };

  const handleToggleStatus = async (user: UserData) => {
    try {
      const newStatus = user.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await api.patch(`/identity-service/api/users/${user.id}/status`, null, {
        params: { status: newStatus },
      });
      showSuccess(`${newStatus === 'ACTIVE' ? 'Kích hoạt' : 'Vô hiệu hóa'} người dùng thành công!`);
      refetch();
    } catch (error) {
      logError(error, 'Toggle User Status');
      showError('Cập nhật trạng thái thất bại!');
    }
  };

  const handleSubmit = async (formData: UserFormData) => {
    try {
      if (editingUser) {
        // Chỉ gửi những field được phép update: fullName, phone, avatar, birthday, gender
        const updateData: any = {
          fullName: formData.fullName,
        };
        if (formData.phone) updateData.phone = formData.phone;
        if (formData.avatar) updateData.avatar = formData.avatar;
        if (formData.gender) updateData.gender = formData.gender;
        if (formData.birthday) updateData.birthday = formData.birthday;
        await updateMutation.mutateAsync({
          id: editingUser.id,
          data: updateData,
        });
        showSuccess('Cập nhật người dùng thành công!');
      } else {
        await createMutation.mutateAsync(formData);
        showSuccess('Tạo người dùng thành công!');
      }
      setIsModalOpen(false);
      refetch();
    } catch (error) {
      logError(error, editingUser ? 'Update User' : 'Create User');
      showError(editingUser ? 'Cập nhật người dùng thất bại!' : 'Tạo người dùng thất bại!');
    }
  };

  return (
    <main className="flex-1 p-8">
      <HeaderSection onCreate={handleCreate} />
      <SearchSection
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
      />
      <UserTableSection
        users={users}
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
        <UserModal
          user={editingUser}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
        />
      )}

      <VerifyModal
        isOpen={!!verifyTarget}
        title="Xác nhận xóa"
        message={verifyTarget ? `Bạn có chắc chắn muốn xóa người dùng "${verifyTarget.name}"?` : undefined}
        confirmLabel="Xóa"
        cancelLabel="Hủy"
        isLoading={statusMutation.isPending}
        onConfirm={confirmDelete}
        onCancel={() => setVerifyTarget(null)}
      />

      {viewingUser && (
        <UserDetailModal user={viewingUser} onClose={() => setViewingUser(null)} />
      )}
    </main>
  );
}

function HeaderSection({ onCreate }: { onCreate: () => void }) {
  return (
    <AnimatedSection animation="fade-up" className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-black mb-2">Quản lý Người dùng</h1>
          <p className="text-black text-sm">
            Quản lý tài khoản người dùng trong hệ thống (Giáo viên, Admin, Nhân viên, v.v.)
          </p>
        </div>
        <button
          onClick={onCreate}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Tạo người dùng mới
        </button>
      </div>
    </AnimatedSection>
  );
}

function SearchSection({
  searchQuery,
  setSearchQuery,
  roleFilter,
  setRoleFilter,
  statusFilter,
  setStatusFilter,
}: {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  roleFilter: string;
  setRoleFilter: (r: string) => void;
  statusFilter: string;
  setStatusFilter: (s: string) => void;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={100} className="mb-6">
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, email, username..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="">Tất cả vai trò</option>
          <option value="TEACHER">Giáo viên</option>
          <option value="ADMIN">Admin</option>
          <option value="STAFF">Nhân viên</option>
          <option value="PARTNER">Đối tác</option>
        </select>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        >
          <option value="">Tất cả trạng thái</option>
          <option value="ACTIVE">Hoạt động</option>
          <option value="INACTIVE">Không hoạt động</option>
        </select>
      </div>
    </AnimatedSection>
  );
}

function UserTableSection({
  users,
  isLoading,
  onEdit,
  onDelete,
  onView,
  onToggleStatus,
}: {
  users: UserData[];
  isLoading: boolean;
  onEdit: (u: UserData) => void;
  onDelete: (u: UserData) => void;
  onView: (u: UserData) => void;
  onToggleStatus: (u: UserData) => void;
}) {
  const getRoleBadge = (role: string) => {
    const badges = {
      TEACHER: 'bg-blue-100 text-blue-700',
      ADMIN: 'bg-red-100 text-red-700',
      STAFF: 'bg-green-100 text-green-700',
      PARTNER: 'bg-purple-100 text-purple-700',
    };
    const labels = {
      TEACHER: 'Giáo viên',
      ADMIN: 'Admin',
      STAFF: 'Nhân viên',
      PARTNER: 'Đối tác',
    };
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${badges[role as keyof typeof badges] || 'bg-gray-100 text-gray-700'}`}>
        {labels[role as keyof typeof labels] || role}
      </span>
    );
  };

  return (
    <AnimatedSection animation="fade-up" delay={150}>
      {isLoading ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
          Đang tải...
        </div>
      ) : users.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
          Không tìm thấy người dùng nào
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="divide-y divide-gray-200">
            {users.map((user: UserData) => (
              <div key={user.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.fullName} className="w-14 h-14 rounded-full object-cover" />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xl font-semibold">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
                      {getRoleBadge(user.role)}
                      <button
                        onClick={() => onToggleStatus(user)}
                        className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 transition-colors ${
                          user.status === 'ACTIVE'
                            ? 'bg-green-100 text-green-700 hover:bg-green-200'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {user.status === 'ACTIVE' ? (
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
                    <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span>{user.username}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{user.email}</span>
                      </div>
                      {user.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      {user.wallet && (
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400">💰</span>
                          <span>Số dư: {user.wallet.balance.toLocaleString('vi-VN')} VNĐ</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 flex items-center gap-4 text-xs text-gray-500">
                      <span>🕒 Tạo: {new Date(user.createdAt).toLocaleDateString('vi-VN')}</span>
                      <span>📝 Cập nhật: {new Date(user.updatedAt).toLocaleDateString('vi-VN')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onView(user)}
                      className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                      title="Xem chi tiết"
                    >
                      <Eye className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => onEdit(user)}
                      className="p-2 hover:bg-green-50 rounded-lg transition-colors group"
                      title="Chỉnh sửa"
                    >
                      <Edit className="w-4 h-4 text-gray-600 group-hover:text-green-600" />
                    </button>
                    <button
                      onClick={() => onDelete(user)}
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

interface UserModalProps {
  user: UserData | null;
  onClose: () => void;
  onSubmit: (data: UserFormData) => void;
  isSubmitting: boolean;
}

function UserModal({ user, onClose, onSubmit, isSubmitting }: UserModalProps) {
  const [formData, setFormData] = useState<UserFormData>({
    fullName: user?.fullName || '',
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    role: user?.role || 'TEACHER',
    phone: user?.phone || '',
    avatar: user?.avatar || '',
    gender: user?.gender || undefined,
    birthday: user?.birthday ? user.birthday.split('T')[0] : '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={user ? 'Cập nhật người dùng' : 'Tạo người dùng mới'} size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Khi tạo mới: hiển thị tất cả fields */}
        {!user && (
          <>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Nhập họ và tên"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tên đăng nhập <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Nhập username"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Nhập email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu <span className="text-red-500">*</span>
                </label>
                <input
                  required
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Nhập mật khẩu"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Vai trò</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="TEACHER">Giáo viên</option>
                  <option value="ADMIN">Admin</option>
                  <option value="STAFF">Nhân viên</option>
                  <option value="PARTNER">Đối tác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Nhập số điện thoại"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Nhập URL ảnh đại diện (https://example.com/avatar.jpg)"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">Chưa xác định</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
            </div>
          </>
        )}

        {/* Khi update: chỉ hiển thị fields được phép thay đổi */}
        {user && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                required
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Nhập họ và tên"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Nhập số điện thoại"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
                <select
                  value={formData.gender || ''}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                >
                  <option value="">Chưa xác định</option>
                  <option value="MALE">Nam</option>
                  <option value="FEMALE">Nữ</option>
                  <option value="OTHER">Khác</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Avatar URL</label>
              <input
                type="url"
                value={formData.avatar}
                onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Nhập URL ảnh đại diện (https://example.com/avatar.jpg)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ngày sinh</label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) => setFormData({ ...formData, birthday: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
              />
            </div>
          </>
        )}

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
                {user ? 'Đang cập nhật...' : 'Đang tạo...'}
              </>
            ) : (
              user ? 'Cập nhật' : 'Tạo mới'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

function UserDetailModal({ user, onClose }: { user: UserData; onClose: () => void }) {
  return (
    <Modal isOpen={true} onClose={onClose} title="Chi tiết người dùng" size="lg">
      <div className="space-y-6">
        <div className="flex items-start gap-6">
          <div className="flex-shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.fullName} className="w-24 h-24 rounded-full object-cover" />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-semibold">
                {user.fullName.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{user.fullName}</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                user.role === 'TEACHER' ? 'bg-blue-100 text-blue-700' :
                user.role === 'STAFF' ? 'bg-green-100 text-green-700' :
                'bg-purple-100 text-purple-700'
              }`}>
                {user.role === 'ADMIN' ? 'Admin' : user.role === 'TEACHER' ? 'Giáo viên' : user.role === 'STAFF' ? 'Nhân viên' : 'Đối tác'}
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                user.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
              }`}>
                {user.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold text-gray-900 mb-3">Thông tin cơ bản</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Tên đăng nhập</p>
              <p className="text-sm font-medium text-gray-900">{user.username}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-sm font-medium text-gray-900">{user.email}</p>
            </div>
            {user.phone && (
              <div>
                <p className="text-sm text-gray-600">Số điện thoại</p>
                <p className="text-sm font-medium text-gray-900">{user.phone}</p>
              </div>
            )}
            {user.gender && (
              <div>
                <p className="text-sm text-gray-600">Giới tính</p>
                <p className="text-sm font-medium text-gray-900">
                  {user.gender === 'MALE' ? 'Nam' : user.gender === 'FEMALE' ? 'Nữ' : 'Khác'}
                </p>
              </div>
            )}
            {user.birthday && (
              <div>
                <p className="text-sm text-gray-600">Ngày sinh</p>
                <p className="text-sm font-medium text-gray-900">{new Date(user.birthday).toLocaleDateString('vi-VN')}</p>
              </div>
            )}
          </div>
        </div>

        {user.wallet && (
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Thông tin ví</h3>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Số dư hiện tại:</span>
              <span className="text-xl font-bold text-blue-600">{user.wallet.balance.toLocaleString('vi-VN')} VNĐ</span>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-gray-200 text-sm text-gray-500">
          <div>Tạo lúc: {new Date(user.createdAt).toLocaleString('vi-VN')}</div>
          <div>Cập nhật: {new Date(user.updatedAt).toLocaleString('vi-VN')}</div>
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
