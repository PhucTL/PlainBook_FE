'use client';

import Link from 'next/link';
import AnimatedSection from '@/components/animation/AnimatedSection';
import { Copy, Edit } from 'lucide-react';

export default function AdminLessonPlansPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1 p-8">
        <AnimatedSection animation="fade-up" className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Giáo án</h1>
              <p className="text-gray-600">Chọn loại quản lý bạn muốn truy cập.</p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <Link href="/admin/lesson-plans/lesson-plans-template" className="block">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-blue-50 mb-4">
                    <Copy className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Mẫu Giáo án</h3>
                  <p className="text-sm text-gray-600 mt-2">Quản lý các mẫu giáo án tái sử dụng cho các lớp và môn học.</p>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-blue-600 font-medium">Đi tới Mẫu Giáo án →</div>
                </div>
              </div>
            </Link>

            <Link href="/admin/lesson-plans/lesson-plans-node" className="block">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-green-50 mb-4">
                    <Edit className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Node Giáo án</h3>
                  <p className="text-sm text-gray-600 mt-2">Quản lý các node/khối nội dung trong giáo án (các bước, hoạt động, tài nguyên).</p>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-green-600 font-medium">Đi tới Node Giáo án →</div>
                </div>
              </div>
            </Link>
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
}
