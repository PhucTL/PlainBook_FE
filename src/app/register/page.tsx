'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { useRegisterService } from '@/services/userService';
import { getErrorMessage, logError } from '@/lib/middleware';
import { showSuccess, showWarning } from '@/lib/toast';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [passwordMatchError, setPasswordMatchError] = useState('');

  const router = useRouter();
  const registerMutation = useRegisterService();

  const getPasswordStrength = (pwd: string) => {
    if (pwd.length === 0) return 0;
    if (pwd.length < 6) return 1;
    if (pwd.length < 10) return 2;
    return 3;
  };

  const passwordStrength = getPasswordStrength(password);
  const strengthText = ['', 'Yếu', 'Trung bình', 'Mạnh'][passwordStrength];
  const strengthColor = ['', 'bg-red-500', 'bg-yellow-500', 'bg-green-500'][passwordStrength];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Tạo tài khoản mới
            </h2>
            <p className="text-gray-600 text-sm">
              Bắt đầu quản lý dịch vụ kinh doanh của bạn một cách hiệu quả
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Full Name */}
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                Họ và Tên
              </label>
              <input
                id="fullName"
                name="fullName"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={registerMutation.isPending}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Nhập họ và tên của bạn"
              />
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={registerMutation.isPending}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Nhập địa chỉ email"
              />
            </div>

            {/* Username */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Tên đăng nhập
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={registerMutation.isPending}
                className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="Nhập tên đăng nhập"
              />
            </div>

            {/* Password */}
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
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (confirmPassword && e.target.value !== confirmPassword) {
                      setPasswordMatchError('Mật khẩu không khớp');
                    } else {
                      setPasswordMatchError('');
                    }
                  }}
                  disabled={registerMutation.isPending}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Nhập mật khẩu"
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
              {/* Password Strength Indicator */}
              {password && (
                <div className="mt-2">
                  <div className="flex gap-1 mb-1">
                    <div className={`h-1 flex-1 rounded ${passwordStrength >= 1 ? strengthColor : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded ${passwordStrength >= 2 ? strengthColor : 'bg-gray-200'}`}></div>
                    <div className={`h-1 flex-1 rounded ${passwordStrength >= 3 ? strengthColor : 'bg-gray-200'}`}></div>
                  </div>
                  <p className="text-xs text-gray-600">{strengthText}</p>
                </div>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Xác nhận Mật khẩu
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (password && e.target.value !== password) {
                      setPasswordMatchError('Mật khẩu không khớp');
                    } else {
                      setPasswordMatchError('');
                    }
                  }}
                  disabled={registerMutation.isPending}
                  className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-12 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  placeholder="Nhập lại mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {passwordMatchError && confirmPassword && (
                <p className="text-xs text-red-500 mt-1">{passwordMatchError}</p>
              )}
            </div>

            {/* Error Message */}
            {registerMutation.isError && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                <p className="text-sm">
                  <strong>⚠️ Lỗi đăng ký:</strong>{' '}
                  {getErrorMessage(registerMutation.error)}
                </p>
              </div>
            )}

            {/* Terms Checkbox */}
            <div className="flex items-start">
              <input
                id="terms"
                name="terms"
                type="checkbox"
                checked={acceptTerms}
                onChange={(e) => setAcceptTerms(e.target.checked)}
                disabled={registerMutation.isPending}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded mt-1 disabled:opacity-50"
              />
              <label htmlFor="terms" className="ml-3 text-sm text-gray-600">
                Tôi đồng ý với{' '}
                <Link href="#" className="text-blue-600 hover:text-blue-700">
                  Điều khoản Dịch vụ
                </Link>{' '}
                và{' '}
                <Link href="#" className="text-blue-600 hover:text-blue-700">
                  Chính sách Bảo mật
                </Link>
                .
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={registerMutation.isPending || !acceptTerms || !!passwordMatchError}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {registerMutation.isPending ? (
                <span className="flex items-center">
                  <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                  Đang đăng ký...
                </span>
              ) : (
                'Đăng ký'
              )}
            </button>
          </form>

          {/* Sign In Link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Đã có tài khoản?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );

  // Handle register form submission
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate password match
    if (password !== confirmPassword) {
      setPasswordMatchError('Mật khẩu không khớp');
      return;
    }

    // Validate terms acceptance
    if (!acceptTerms) {
      showWarning('Bạn phải đồng ý với Điều khoản Dịch vụ và Chính sách Bảo mật');
      return;
    }

    // Call register API
    registerMutation.mutate(
      {
        fullName,
        email,
        username,
        password,
      },
      {
        onSuccess: (response) => {
          console.log('Register success:', response);
          
          // Hiển thị thông báo thành công
          showSuccess('Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.');
          
          // Redirect đến trang login sau khi đăng ký thành công
          setTimeout(() => router.push('/login'), 1500);
        },
        onError: (error) => {
          logError(error, 'Register');
        },
      }
    );
  }
}