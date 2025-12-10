'use client';

import Link from 'next/link';
import AnimatedSection from '@/components/animation/AnimatedSection';
import { FileText, Layers, PlayCircle, ClipboardList } from 'lucide-react';

export default function AdminExamPage() {
  return (
    <div className="flex flex-col">
      <main className="flex-1 p-8">
        <AnimatedSection animation="fade-up" className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex flex-col">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Quản lý Đề thi</h1>
              <p className="text-gray-600">Chọn loại quản lý bạn muốn truy cập.</p>
            </div>
          </div>
        </AnimatedSection>

        <AnimatedSection animation="fade-up" delay={100}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link href="/admin/exam/exam-template" className="block">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-blue-50 mb-4">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Mẫu Đề</h3>
                  <p className="text-sm text-gray-600 mt-2">Quản lý các mẫu đề thi tái sử dụng và cấu trúc đề.</p>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-blue-600 font-medium">Đi tới Mẫu Đề →</div>
                </div>
              </div>
            </Link>

            <Link href="/admin/exam/exam-matrix" className="block">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-indigo-50 mb-4">
                    <Layers className="w-5 h-5 text-indigo-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Ma trận Đề</h3>
                  <p className="text-sm text-gray-600 mt-2">Thiết lập ma trận, phân bổ điểm và chuẩn chương trình cho đề thi.</p>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-indigo-600 font-medium">Đi tới Ma trận Đề →</div>
                </div>
              </div>
            </Link>

            <Link href="/admin/exam/exam-instance" className="block">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-emerald-50 mb-4">
                    <PlayCircle className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Phiên Thi</h3>
                  <p className="text-sm text-gray-600 mt-2">Quản lý các lần tổ chức đề thi (instance), lịch và kết quả.</p>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-emerald-600 font-medium">Đi tới Phiên Thi →</div>
                </div>
              </div>
            </Link>

            <Link href="/admin/exam/question-bank" className="block">
              <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
                <div>
                  <div className="inline-flex items-center justify-center w-10 h-10 rounded-md bg-green-50 mb-4">
                    <ClipboardList className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900">Ngân hàng Câu hỏi</h3>
                  <p className="text-sm text-gray-600 mt-2">Quản lý câu hỏi, phân loại và tái sử dụng cho đề thi.</p>
                </div>
                <div className="mt-4">
                  <div className="text-sm text-green-600 font-medium">Đi tới Ngân hàng Câu hỏi →</div>
                </div>
              </div>
            </Link>
          </div>
        </AnimatedSection>
      </main>
    </div>
  );
}
