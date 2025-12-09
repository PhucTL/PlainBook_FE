'use client';

import React, { useState } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import Pagination from '@/components/ui/Pagination';
import { useSearchParams } from 'next/navigation';
import { useChaptersByBookService } from '@/services/chapterServices';
import Table from '@/components/Table';

function formatDateVN(dateStr?: string) {
  if (!dateStr) return '';
  if (dateStr.includes('/')) {
    return dateStr.split(' ')[0];
  }
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

interface Chapter {
  id: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export default function ChapterPageByBook() {
  const searchParams = useSearchParams();
  const bookId = searchParams?.get('bookId');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const enabled = !!bookId;
  const { data, isLoading, error } = useChaptersByBookService(bookId ? String(bookId) : undefined, { enabled });
  const chapters: Chapter[] = Array.isArray(data?.data?.content) ? data.data.content : [];

  const filteredChapters = chapters.filter((chapter) =>
    chapter.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const itemsPerPage = 3;
  const totalPages = Math.ceil(filteredChapters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredChapters.slice(startIndex, endIndex);

  const columns = [
    { key: 'name', label: 'TÊN CHƯƠNG', className: 'col-span-5 font-medium text-gray-900' },
    { key: 'status', label: 'TRẠNG THÁI', className: 'col-span-2', render: (v: string) => (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${v === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>{v === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}</span>
    ) },
    { key: 'createdAt', label: 'NGÀY TẠO', className: 'col-span-2 text-gray-600', render: (v: string) => formatDateVN(v) },
    { key: 'updatedAt', label: 'NGÀY CẬP NHẬT', className: 'col-span-2 text-gray-600', render: (v: string) => formatDateVN(v) },
  ];

  return (
    <div className="flex flex-col">
      <main className="flex-1 p-8">
        <AnimatedSection animation="fade-up" className="mb-8">
          <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Chương</h1>
            <p className="text-gray-600">Danh sách chương sách</p>
          </div>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={100} className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tìm kiếm chương..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-4 pr-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                />
              </div>
            </div>
          </div>
        </AnimatedSection>
        <AnimatedSection animation="fade-up" delay={200}>
          <Table columns={columns} data={currentItems} gridClassName="grid grid-cols-12 gap-4" noDataText="Không có chương nào" />
        </AnimatedSection>
        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </main>
    </div>
  );
}


