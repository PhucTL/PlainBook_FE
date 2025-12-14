'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AnimatedSection from '@/components/animation/AnimatedSection';
import SlideAndVideoCard from '@/components/ui/SlideAndVideoCard';
import Pagination from '@/components/ui/Pagination';
import { slideConfig } from '@/config/slideConfig';
import { Plus } from 'lucide-react';

export default function AdminSlidePage() {
  const [currentPage, setCurrentPage] = useState(1);

  return (
    <div className="flex flex-col">
      <MainContentSection currentPage={currentPage} setCurrentPage={setCurrentPage} />
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
  const router = useRouter();
  const { itemsPerPage } = slideConfig.pagination;
  const totalPages = Math.max(1, Math.ceil(slideConfig.workspaces.length / itemsPerPage));

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Ensure admin view uses explicit ids 1..6 for the six hardcoded items
  const adminWorkspaces = slideConfig.workspaces.map((w, i) => ({ ...w, id: i + 1 }));
  const currentItems = adminWorkspaces.slice(startIndex, endIndex);

  const handleCardClick = (id: number) => {
    router.push(`/admin/slide/slide-template/${id}`);
  };

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
          <div key={workspace.id} onClick={() => handleCardClick(workspace.id)}>
            <SlideAndVideoCard {...workspace} index={index} />
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-6">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
}
