'use client';

import { useState, useMemo } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import Pagination from '@/components/ui/Pagination';
import { useChaptersByBookService } from '@/services/chapterServices';
import { useSearchParams, useRouter } from 'next/navigation';
import { Edit } from 'lucide-react';

interface Chapter {
  id: number;
  name: string;
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
}

export default function ChapterPageByBook() {
  const searchParams = useSearchParams();
  const bookId = searchParams.get('bookId');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const { data: chaptersData, isLoading, error } = useChaptersByBookService(bookId ?? undefined);

  const chapters: Chapter[] = useMemo(() => {
    if (!chaptersData?.data?.content) return [];
    return chaptersData.data.content;
  }, [chaptersData]);

  const filteredChapters = chapters.filter((ch) => ch.name.toLowerCase().includes(searchQuery.toLowerCase()));

  const itemsPerPage = 5;
  const totalPages = Math.ceil(filteredChapters.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredChapters.slice(startIndex, startIndex + itemsPerPage);

  if (isLoading) {
    return (
      <AnimatedSection animation="fade-up" delay={200}>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </AnimatedSection>
    );
  }

  if (error) {
    return (
      <AnimatedSection animation="fade-up" delay={200}>
        <div className="bg-white rounded-xl shadow-sm p-6 text-center">
          <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu chương</p>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <main className="p-8">
      <AnimatedSection animation="fade-up" className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Quản lý chương</h1>
            <p className="text-gray-600">Danh sách chương của sách</p>
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={100} className="mb-6">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-xl">
            <input
              type="text"
              placeholder="Tìm kiếm chương..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-3 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection animation="fade-up" delay={200}>
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">
            <div className="col-span-8">TÊN CHƯƠNG</div>
            <div className="col-span-2">NGÀY TẠO</div>
            <div className="col-span-2 text-right">HÀNH ĐỘNG</div>
          </div>

          <div className="divide-y divide-gray-200">
            {currentItems.length === 0 ? (
              <div className="px-6 py-12 text-center text-gray-500">Không tìm thấy chương nào</div>
            ) : (
              currentItems.map((ch) => (
                <div key={ch.id} className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors">
                  <div className="col-span-8 font-medium text-gray-900">{ch.name}</div>
                  <div className="col-span-2 text-gray-600">{ch.createdAt}</div>
                  <div className="col-span-2 flex items-center justify-end gap-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {totalPages > 1 && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        )}
      </AnimatedSection>
    </main>
  );
}
