'use client';

import { Database, BookOpen, GraduationCap, FileText, Presentation, Grid3x3, Video, LogOut } from 'lucide-react';
import { useState } from 'react';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  { icon: Grid3x3, label: 'Nền tảng học tập', path: '/dashboard' },
  { icon: Database, label: 'Dữ liệu Cơ bản', path: '/data' },
  { icon: BookOpen, label: 'Tài liệu Học tập', path: '/learning-materials' },
  { icon: GraduationCap, label: 'Giáo án', path: '/lesson-plans' },
  { icon: FileText, label: 'Đề thi', path: '/exams' },
  { icon: Presentation, label: 'Slide Bài giảng', path: '/slides' },
  { icon: Grid3x3, label: 'Không gian làm việc', path: '/workspace' },
  { icon: Video, label: 'Video Bài giảng', path: '/videos' },
];

export default function Sidebar() {
  const [activeItem, setActiveItem] = useState('Tài liệu Học tập');

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <Grid3x3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Nền tảng học tập</span>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.label === activeItem;
          
          return (
            <button
              key={item.label}
              onClick={() => setActiveItem(item.label)}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Nguyễn Văn A</p>
            <p className="text-xs text-gray-500 truncate">nv.a@example.com</p>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <LogOut className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </aside>
  );
}
