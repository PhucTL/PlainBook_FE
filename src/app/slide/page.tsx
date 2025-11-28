'use client';

import { useState } from 'react';
import AnimatedSection from '@/components/animation/AnimatedSection';
import SlideAndVideoCard from '@/components/ui/SlideAndVideoCard';
import Pagination from '@/components/ui/Pagination';
import Sidebar from '@/components/Sidebar';
import { slideConfig } from '@/config/slideConfig';
import { Plus } from 'lucide-react';

export default function SlidePage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <MainContentSection currentPage={currentPage} setCurrentPage={setCurrentPage} />
      </div>
    </div>
  );
}



function MainContentSection({ currentPage, setCurrentPage }: { currentPage: number; setCurrentPage: (page: number) => void }) {
  return (
    <main className="flex-1 p-8">
      <WelcomeSection />
      <SlideSection currentPage={currentPage} setCurrentPage={setCurrentPage} />
    </main>
  );
}

function WelcomeSection() {
  return (
    <AnimatedSection animation="fade-up" className="mb-8">
        <div className="flex items-center justify-between">
            <div className="flex flex-col">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại!</h1>
            <p className="text-gray-600">Đây là không gian làm việc và các kết quả AI của bạn.</p>
            </div>
            
          {/* Actions */}
          <div className="flex items-center gap-3">   
            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
              <Plus className="w-5 h-5" />
              {slideConfig.header.createButtonText}
            </button>
          </div>
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
        <h2 className="text-2xl font-bold text-gray-900">Không gian làm việc</h2>
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
