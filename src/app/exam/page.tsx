'use client';

import { useState } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import Sidebar from '@/components/Sidebar';
import { examConfig } from '@/config/examConfig';
import { Search, Plus, Upload, Edit, Copy, Trash2 } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';

export default function ExamPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <MainContentSection 
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      </div>
    </div>
  );
}

function MainContentSection({ 
  activeFilter, 
  setActiveFilter,
  searchQuery,
  setSearchQuery,
  currentPage,
  setCurrentPage
}: { 
  activeFilter: string; 
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) {
  return (
    <main className="flex-1 p-8">
      <HeaderSection />
      <SearchAndFilterSection 
        activeFilter={activeFilter}
        setActiveFilter={setActiveFilter}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <ExamTableSection 
        activeFilter={activeFilter} 
        searchQuery={searchQuery}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </main>
  );
}

function HeaderSection() {
  return (
    <AnimatedSection animation="fade-up" className="mb-8">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{examConfig.header.title}</h1>
          <p className="text-gray-600">{examConfig.header.subtitle}</p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">
          <button className="px-6 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium flex items-center gap-2">
            <Upload className="w-5 h-5" />
            {examConfig.header.uploadButtonText}
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {examConfig.header.createButtonText}
          </button>
        </div>
      </div>
    </AnimatedSection>
  );
}

function SearchAndFilterSection({
  searchQuery,
  setSearchQuery
}: {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <AnimatedSection animation="fade-up" delay={100} className="mb-6">
      <div className="flex items-center justify-between gap-4">
        {/* Search */}
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm đề thi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}

function ExamTableSection({ 
  activeFilter, 
  searchQuery,
  currentPage,
  setCurrentPage
}: { 
  activeFilter: string; 
  searchQuery: string;
  currentPage: number;
  setCurrentPage: (page: number) => void;
}) {
  const filteredExams = examConfig.exams.filter((exam) => {
    const matchesFilter = activeFilter === 'all' || exam.status === activeFilter;
    const matchesSearch = exam.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         exam.subject.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const { itemsPerPage } = examConfig.pagination;
  const totalPages = Math.ceil(filteredExams.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredExams.slice(startIndex, endIndex);

  return (
    <AnimatedSection animation="fade-up" delay={200}>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="grid grid-cols-12 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200 font-medium text-sm text-gray-700">
          <div className="col-span-4">TÊN ĐỀ THI</div>
          <div className="col-span-2">MÔN HỌC</div>
          <div className="col-span-2">NGÀY TẠO</div>
          <div className="col-span-2">TRẠNG THÁI</div>
          <div className="col-span-2 text-right">HÀNH ĐỘNG</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {currentItems.length === 0 ? (
            <div className="px-6 py-12 text-center text-gray-500">
              Không tìm thấy đề thi nào
            </div>
          ) : (
            currentItems.map((exam, index) => (
              <div
                key={exam.id}
                className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="col-span-4 font-medium text-gray-900">{exam.title}</div>
                <div className="col-span-2 text-gray-600">{exam.subject}</div>
                <div className="col-span-2 text-gray-600">{exam.date}</div>
                <div className="col-span-2">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                      exam.status === 'published'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {exam.statusText}
                  </span>
                </div>
                <div className="col-span-2 flex items-center justify-end gap-2">
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Chỉnh sửa"
                  >
                    <Edit className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Sao chép"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </AnimatedSection>
  );
}
