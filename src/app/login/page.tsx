'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Clock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-md w-full space-y-8">
          {/* Icon */}
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Đăng nhập vào tài khoản của bạn
            </h2>
            <p className="text-gray-600">
              Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
            </p>
          </div>

          {/* Form */}
          <form className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email / Tên đăng nhập
                </label>
                <input
                  id="email"
                  name="email"
                  type="text"
                  required
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nhập email của bạn"
                />
              </div>

              {/* Password Input */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu
                </label>
                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12"
                    placeholder="Nhập mật khẩu của bạn"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-4 flex items-center"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <div className="text-right mt-2">
                  <Link href="#" className="text-sm text-blue-600 hover:text-blue-700">
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Đăng nhập
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">HOẶC TIẾP TỤC VỚI</span>
              </div>
            </div>

            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 23 23">
                  <path
                    fill="#f3f3f3"
                    d="M0 0h23v23H0z"
                  />
                  <path
                    fill="#f35325"
                    d="M1 1h10v10H1z"
                  />
                  <path
                    fill="#81bc06"
                    d="M12 1h10v10H12z"
                  />
                  <path
                    fill="#05a6f0"
                    d="M1 12h10v10H1z"
                  />
                  <path
                    fill="#ffba08"
                    d="M12 12h10v10H12z"
                  />
                </svg>
                Microsoft
              </button>
            </div>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600">
              Bằng cách đăng nhập, bạn đồng ý với{' '}
              <Link href="#" className="text-blue-600 hover:text-blue-700">
                Điều khoản Dịch vụ
              </Link>{' '}
              và{' '}
              <Link href="#" className="text-blue-600 hover:text-blue-700">
                Chính sách Bảo mật
              </Link>{' '}
              của chúng tôi.
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Image/Info */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-slate-900 to-slate-800 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="w-full h-64 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 opacity-20 blur-3xl rounded-full"></div>
                <div className="relative text-cyan-400 text-6xl">
                  <svg className="w-48 h-48" viewBox="0 0 200 200" fill="none">
                    <path
                      d="M100 20 L180 100 L100 180 L20 100 Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="opacity-30"
                    />
                    <path
                      d="M100 40 L160 100 L100 160 L40 100 Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="opacity-50"
                    />
                    <path
                      d="M100 60 L140 100 L100 140 L60 100 Z"
                      stroke="currentColor"
                      strokeWidth="3"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Quản lý Dịch vụ Doanh nghiệp của bạn một cách hiệu quả
          </h2>
          <p className="text-slate-300 text-lg">
            Nền tảng tất cả trong một giúp bạn hợp lý hóa hoạt động, tăng năng suất và thúc đẩy tăng trưởng.
          </p>
        </div>
      </div>
    </div>
  );
}