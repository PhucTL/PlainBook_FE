'use client';

import { useState } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import SlideAndVideoCard from '@/components/ui/SlideAndVideoCard';
import Pagination from '@/components/ui/Pagination';
import { slideConfig } from '@/config/slideConfig';
import { Plus, Search, Filter } from 'lucide-react';

export default function AdminSlidePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="flex flex-col">
      <MainContentSection currentPage={currentPage} setCurrentPage={setCurrentPage} searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
    </div>
  );
}

function MainContentSection({ 
  currentPage, 
  setCurrentPage,
  searchQuery,
  setSearchQuery
}: { 
  currentPage: number; 
  setCurrentPage: (page: number) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <main className="flex-1 p-8">
      <WelcomeSection searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <SlideSection currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </main>
  );
}

function WelcomeSection({ 
  searchQuery, 
  setSearchQuery 
}: { 
  searchQuery: string; 
  setSearchQuery: (query: string) => void;
}) {
  return (
    <AnimatedSection animation="fade-up" className="mb-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex flex-col">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Slide Bài giảng</h1>
          <p className="text-gray-600">Quản lý và giám sát tất cả slide bài giảng trong hệ thống.</p>
        </div>
        
        {/* Actions */}
        <div className="flex items-center gap-3">   
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {slideConfig.header.createButtonText}
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 max-w-xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm slide..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2">
          <Filter className="w-5 h-5" />
          Bộ lọc
        </button>
      </div>
    </AnimatedSection>
  );
}

function SlideSection({ currentPage, setCurrentPage }: { currentPage: number; setCurrentPage: (page: number) => void }) {
  const { itemsPerPage } = slideConfig.pagination;
  const totalPages = Math.ceil(slideConfig.workspaces.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = slideConfig.workspaces.slice(startIndex, endIndex);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Tất cả Slide ({slideConfig.workspaces.length})</h2>
        <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
          Xem tất cả →
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentItems.map((workspace, index) => (
          <SlideAndVideoCard key={workspace.id} {...workspace} index={index} />
        ))}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </section>
  );
}
