'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Clock, Eye, EyeOff, Loader2 } from 'lucide-react';
import { GoogleLogin, CredentialResponse } from '@react-oauth/google';
import { useUserServices, useLoginGoogleService } from '@/services/userService';
import { getLoginErrorMessage, logError } from '@/lib/middleware';
import { showSuccess, showError } from '@/lib/toast';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const router = useRouter();
  const loginMutation = useUserServices();
  const googleLoginMutation = useLoginGoogleService();

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
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="space-y-4">
              {/* Email Input */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email / Tên đăng nhập
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
                  <Link href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700">
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {loginMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="text-sm">
                  <strong>⚠️ Lỗi đăng nhập:</strong>{' '}
                  {getLoginErrorMessage(loginMutation.error)}
                </p>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loginMutation.isPending ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Đang đăng nhập...
                </span>
              ) : (
                'Đăng nhập'
              )}
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

            {/* Google Login Button */}
            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                theme="outline"
                size="large"
                text="signin_with"
                locale="vi"
                width="384"
              />
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
      <div className="hidden lg:flex lg:w-1/2 bg-linear-to-br from-slate-900 to-slate-800 items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="mb-8">
            <div className="w-full h-64 flex items-center justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-cyan-500 opacity-20 blur-3xl rounded-full"></div>
                <Clock className="relative w-48 h-48 text-cyan-400" />
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

  // Handle normal login
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    loginMutation.mutate(
      { username, password },
      {
        onSuccess: (response) => {
          // Lưu token vào localStorage
          const token = response?.data?.token || response?.data?.data?.token;
          const refreshToken = response?.data?.refreshToken || response?.data?.data?.refreshToken;
          
          if (token) {
            localStorage.setItem('token', token);
          }
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
          
          // Hiển thị thông báo thành công
          showSuccess('Đăng nhập thành công! Đang chuyển hướng...');
          
          // Redirect đến workspace sau 1.5 giây
          setTimeout(() => router.push('/workspace'), 1500);
        },
        onError: (error) => {
          logError(error, 'Login');
        },
      }
    );
  }

  // Handle Google login success
  function handleGoogleSuccess(credentialResponse: CredentialResponse) {
    const idToken = credentialResponse.credential;
    
    if (!idToken) {
      showError('Không nhận được token từ Google');
      return;
    }

    // Call backend API with token (not idToken)
    googleLoginMutation.mutate(
      { token: idToken },
      {
        onSuccess: (response) => {
          // Lưu token vào localStorage
          const token = response?.data?.token || response?.data?.data?.token;
          const refreshToken = response?.data?.refreshToken || response?.data?.data?.refreshToken;
          console.log('Google login response:', token);
          
          if (token) {
            localStorage.setItem('token', token);
          }
          if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
          }
          
          // Hiển thị thông báo thành công
          showSuccess('Đăng nhập Google thành công! Đang chuyển hướng...');
          
          // Redirect đến workspace sau 1.5 giây
          setTimeout(() => router.push('/workspace'), 1500);
        },
        onError: (error) => {
          logError(error, 'Google Login');
          showError('Đăng nhập Google thất bại. Vui lòng thử lại.');
        },
      }
    );
  }

  // Handle Google login error
  function handleGoogleError() {
    showError('Đăng nhập Google thất bại');
    logError(new Error('Google login failed'), 'Google Login');
  }
}