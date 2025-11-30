'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Database, BookOpen, GraduationCap, FileText, Presentation, Grid3x3, Video, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useLogoutService } from '@/services/userService';
import { showSuccess, showError } from '@/lib/toast';
import { logError } from '@/lib/middleware';

interface SidebarItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const sidebarItems: SidebarItem[] = [
  // { icon: Database, label: 'Dữ liệu Cơ bản', path: '/data' },
  // { icon: BookOpen, label: 'Tài liệu Học tập', path: '/learning-materials' },
  { icon: GraduationCap, label: 'Giáo án', path: '/lesson-plans' },
  { icon: FileText, label: 'Đề thi', path: '/exam' },
  { icon: Presentation, label: 'Slide Bài giảng', path: '/slide' },
  { icon: Grid3x3, label: 'Không gian làm việc', path: '/workspace' },
  { icon: Video, label: 'Video Bài giảng', path: '/video' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logoutMutation = useLogoutService();

  const handleLogout = () => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!refreshToken) {
      // Nếu không có refreshToken, vẫn clear localStorage và redirect
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      // Trigger auth-change event
      window.dispatchEvent(new Event('auth-change'));
      
      showSuccess('Đăng xuất thành công!');
      setTimeout(() => router.push('/login'), 1000);
      return;
    }

    // Call API logout với refreshToken
    logoutMutation.mutate(
      { refreshToken },
      {
        onSuccess: () => {
          // Clear localStorage
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          
          // Trigger auth-change event
          window.dispatchEvent(new Event('auth-change'));
          
          // Hiển thị thông báo
          showSuccess('Đăng xuất thành công!');
          
          // Redirect về login
          setTimeout(() => router.push('/login'), 1000);
        },
        onError: (error) => {
          logError(error, 'Logout');
          
          // Vẫn clear localStorage và redirect dù API lỗi
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          
          // Trigger auth-change event
          window.dispatchEvent(new Event('auth-change'));
          
          showError('Đã xảy ra lỗi khi đăng xuất');
          setTimeout(() => router.push('/login'), 1000);
        },
      }
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col fixed left-0 top-0">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-200">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
            <Grid3x3 className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">Nền tảng học tập</span>
        </Link>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {sidebarItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          
          return (
            <Link
              key={item.label}
              href={item.path}
              className={`w-full flex items-center gap-3 px-6 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">Nguyễn Văn A</p>
            <p className="text-xs text-gray-500 truncate">nv.a@example.com</p>
          </div>
          <button 
            onClick={handleLogout}
            disabled={logoutMutation.isPending}
            className="p-1 hover:bg-gray-100 rounded disabled:opacity-50 disabled:cursor-not-allowed"
            title="Đăng xuất"
          >
            <LogOut className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>
    </aside>
  );
}
