'use client';

import { useState } from 'react';
import Modal from './Modal';
import { useQueryClient } from '@tanstack/react-query';
import { useCreateBookService, useUpdateBookService } from '@/services/bookServices';

interface Book {
  id: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
  subject: {
    id: number;
    name: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    grade: {
      id: number;
      name: string;
      status: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

interface BookFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  book?: Book | null;
  mode: 'create' | 'edit';
}

export default function BookFormModal({ isOpen, onClose, book, mode }: BookFormModalProps) {
  const queryClient = useQueryClient();
  const createBook = useCreateBookService();
  const updateBook = useUpdateBookService();

  const [formData, setFormData] = useState({
    name: book?.name || '',
    subjectId: book?.subject.id || '',
  });

  const [errors, setErrors] = useState({
    name: '',
    subjectId: '',
  });

  const validateForm = () => {
    const newErrors = {
      name: '',
      subjectId: '',
    };

    if (!formData.name.trim()) {
      newErrors.name = 'Tên sách không được để trống';
    }

    if (!formData.subjectId) {
      newErrors.subjectId = 'Subject ID không được để trống';
    }

    setErrors(newErrors);
    return !newErrors.name && !newErrors.subjectId;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload = {
        name: formData.name,
        subjectId: Number(formData.subjectId),
      };

      console.log('Payload gửi đi:', payload);

      if (mode === 'create') {
        const response = await createBook.mutateAsync(payload);
        console.log('Response:', response);
      } else if (book) {
        const response = await updateBook.mutateAsync({
          id: book.id.toString(),
          data: payload,
        });
        console.log('Response:', response);
      }
      queryClient.invalidateQueries({ queryKey: ['books'] });
      onClose();
      setFormData({ name: '', subjectId: '' });
      setErrors({ name: '', subjectId: '' });
    } catch (error: any) {
      console.error('Full error:', error);
      console.error('Error response:', error?.response);
      console.error('Error data:', error?.response?.data);
      
      const errorMessage = error?.response?.data?.message || error?.message || 'Có lỗi không xác định';
      alert(`Lỗi khi ${mode === 'create' ? 'tạo' : 'cập nhật'} sách:\n${errorMessage}`);
    }
  };

  const handleClose = () => {
    onClose();
    setFormData({ name: '', subjectId: '' });
    setErrors({ name: '', subjectId: '' });
  };

  const isPending = createBook.isPending || updateBook.isPending;

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={mode === 'create' ? 'Tạo sách mới' : 'Chỉnh sửa sách'}
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Book Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tên sách <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              if (errors.name) setErrors({ ...errors, name: '' });
            }}
            className={`w-full px-4 py-2.5 border ${
              errors.name ? 'border-red-500' : 'border-black'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black`}
            placeholder="Nhập tên sách..."
            disabled={isPending}
          />
          {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
        </div>

        {/* Subject ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subject ID <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={formData.subjectId}
            onChange={(e) => {
              setFormData({ ...formData, subjectId: e.target.value });
              if (errors.subjectId) setErrors({ ...errors, subjectId: '' });
            }}
            className={`w-full px-4 py-2.5 border ${
              errors.subjectId ? 'border-red-500' : 'border-black'
            } rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-black`}
            placeholder="Nhập subject ID (số)..."
            disabled={isPending}
          />
          {errors.subjectId && <p className="mt-1 text-sm text-red-500">{errors.subjectId}</p>}
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4">
          <button
            type="button"
            onClick={handleClose}
            disabled={isPending}
            className="px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isPending ? (
              <>
                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {mode === 'create' ? 'Đang tạo...' : 'Đang cập nhật...'}
              </>
            ) : (
              mode === 'create' ? 'Tạo sách' : 'Cập nhật'
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}
