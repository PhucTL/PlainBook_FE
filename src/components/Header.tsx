import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-md flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">Plainbook</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Trang chủ
            </Link>
            <Link href="/aboutUs" className="text-gray-700 hover:text-blue-600 transition-colors">
              Giới thiệu
            </Link>
            <Link href="/workspace" className="text-gray-700 hover:text-blue-600 transition-colors">
              Bảng giá
            </Link>
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-4">
            <Link href="/login" className="hidden sm:block px-4 py-2 text-gray-700 hover:text-blue-600 transition-colors">
              Đăng nhập
            </Link>
            <Link href="/register" className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Đăng ký
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
