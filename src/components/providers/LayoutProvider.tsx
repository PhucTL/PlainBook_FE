'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Sidebar from '@/components/Sidebar';

export default function LayoutProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Các route không cần authentication (public pages)
  const publicRoutes = ['/', '/login', '/register', '/forgot-password', '/aboutUs', '/price'];
  
  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
      setIsLoading(false);
    };

    // Check ngay khi mount
    checkAuth();

    // Listen cho storage event (khi localStorage thay đổi từ tab khác)
    window.addEventListener('storage', checkAuth);

    // Custom event để force re-check auth
    window.addEventListener('auth-change', checkAuth);

    return () => {
      window.removeEventListener('storage', checkAuth);
      window.removeEventListener('auth-change', checkAuth);
    };
  }, [pathname]);

  // Show loading khi đang check auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Kiểm tra xem có phải public route không
  const isPublicRoute = publicRoutes.includes(pathname);

  // Nếu là public route hoặc chưa login -> hiển thị Header/Footer
  if (isPublicRoute || !isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="grow">
          {children}
        </main>
        <Footer />
      </div>
    );
  }

  // Nếu đã login và không phải public route -> hiển thị Sidebar
  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
