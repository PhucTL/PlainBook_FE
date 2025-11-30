'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { useForgotPasswordService } from '@/services/userService';
import { getErrorMessage, logError } from '@/lib/middleware';
import { showSuccess } from '@/lib/toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const forgotPasswordMutation = useForgotPasswordService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    forgotPasswordMutation.mutate(
      { email },
      {
        onSuccess: () => {
          showSuccess('Email khôi phục mật khẩu đã được gửi! Vui lòng kiểm tra hộp thư của bạn.');
          setIsSubmitted(true);
        },
        onError: (error) => {
          logError(error, 'ForgotPassword');
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Icon */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Clock className="w-8 h-8 text-blue-600" />
            </div>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Quên mật khẩu?
            </h2>
            <p className="text-gray-600 text-sm">
              {isSubmitted 
                ? 'Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email của bạn.'
                : 'Nhập địa chỉ email của bạn và chúng tôi sẽ gửi hướng dẫn để đặt lại mật khẩu.'
              }
            </p>
          </div>

          {!isSubmitted ? (
            <>
              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Email Input */}
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
                    disabled={forgotPasswordMutation.isPending}
                    className="appearance-none relative block w-full px-4 py-3 border border-gray-300 placeholder-gray-400 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    placeholder="Nhập địa chỉ email của bạn"
                  />
                </div>

                {/* Error Message */}
                {forgotPasswordMutation.isError && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
                    <p className="text-sm">
                      <strong>⚠️ Lỗi:</strong>{' '}
                      {getErrorMessage(forgotPasswordMutation.error)}
                    </p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={forgotPasswordMutation.isPending}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {forgotPasswordMutation.isPending ? (
                    <span className="flex items-center">
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Đang gửi...
                    </span>
                  ) : (
                    'Gửi email khôi phục'
                  )}
                </button>
              </form>
            </>
          ) : (
            <>
              {/* Success Message */}
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md mb-5">
                <p className="text-sm">
                  ✓ Email đã được gửi thành công! Vui lòng kiểm tra hộp thư đến hoặc thư mục spam.
                </p>
              </div>

              {/* Resend Button */}
              <button
                onClick={() => setIsSubmitted(false)}
                className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                Gửi lại email
              </button>
            </>
          )}

          {/* Back to Login Link */}
          <div className="mt-6">
            <Link 
              href="/login" 
              className="flex items-center justify-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700"
            >
              <ArrowLeft className="w-4 h-4" />
              Quay lại đăng nhập
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
