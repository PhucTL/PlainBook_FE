/**
 * Middleware cho xử lý lỗi API thống nhất
 * Cung cấp các function tiện ích để trích xuất và format error messages
 */

export interface ApiError {
  response?: {
    data?: any;
    status?: number;
    statusText?: string;
  };
  message?: string;
  data?: any;
}

/**
 * Trích xuất error message từ API response
 * Xử lý nhiều format khác nhau từ backend
 */
export function getErrorMessage(error: any): string {
  if (!error) {
    return 'Đã xảy ra lỗi không xác định';
  }

  // Lấy response data từ error
  const responseData = error?.response?.data;
  
  // Case 1: Backend trả về string trực tiếp (như "Sai ID hoặc mật khẩu!")
  if (typeof responseData === 'string' && responseData.trim() !== '') {
    return responseData;
  }
  
  // Case 2: Backend trả về object với message hoặc data
  const backendMessage = responseData?.data || 
                        responseData?.message ||
                        error?.data?.data ||
                        error?.data?.message;
  
  if (typeof backendMessage === 'string' && backendMessage.trim() !== '') {
    return backendMessage;
  }
  
  // Case 3: Error message trực tiếp từ error object
  if (typeof error?.message === 'string' && error.message.trim() !== '') {
    return error.message;
  }
  
  // Case 4: Fallback messages dựa trên HTTP status code
  const status = error?.response?.status;
  return getErrorMessageByStatus(status);
}

/**
 * Lấy error message dựa trên HTTP status code
 */
export function getErrorMessageByStatus(status?: number): string {
  if (!status) {
    return 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.';
  }

  switch (status) {
    case 400:
      return 'Yêu cầu không hợp lệ. Vui lòng kiểm tra lại thông tin.';
    case 401:
      return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    case 403:
      return 'Bạn không có quyền truy cập tài nguyên này.';
    case 404:
      return 'Không tìm thấy tài nguyên yêu cầu.';
    case 409:
      return 'Xung đột dữ liệu. Tài nguyên đã tồn tại.';
    case 422:
      return 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.';
    case 429:
      return 'Quá nhiều yêu cầu. Vui lòng thử lại sau.';
    case 500:
      return 'Lỗi máy chủ nội bộ. Vui lòng thử lại sau.';
    case 502:
      return 'Lỗi cổng kết nối. Vui lòng thử lại sau.';
    case 503:
      return 'Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.';
    case 504:
      return 'Hết thời gian chờ kết nối. Vui lòng thử lại.';
    default:
      if (status >= 500) {
        return 'Lỗi máy chủ. Vui lòng thử lại sau.';
      }
      if (status >= 400) {
        return 'Yêu cầu không thành công. Vui lòng thử lại.';
      }
      return 'Đã xảy ra lỗi không xác định.';
  }
}

/**
 * Kiểm tra xem error có phải là lỗi authentication không
 */
export function isAuthError(error: any): boolean {
  const status = error?.response?.status;
  return status === 401 || status === 403;
}

/**
 * Kiểm tra xem error có phải là lỗi network không
 */
export function isNetworkError(error: any): boolean {
  return !error?.response && error?.message === 'Network Error';
}

/**
 * Kiểm tra xem error có phải là lỗi validation không
 */
export function isValidationError(error: any): boolean {
  const status = error?.response?.status;
  return status === 400 || status === 422;
}

/**
 * Format error message cho login
 * Sử dụng cho các trang login/authentication
 */
export function getLoginErrorMessage(error: any): string {
  const message = getErrorMessage(error);
  const status = error?.response?.status;
  
  // Customize message cho login specifically
  if (status === 400 || status === 401) {
    return 'Sai tên đăng nhập hoặc mật khẩu!';
  }
  
  return message;
}

/**
 * Format error object để hiển thị trong UI
 * Trả về object với title và description
 */
export function formatErrorForUI(error: any): { title: string; description: string } {
  const status = error?.response?.status;
  const message = getErrorMessage(error);
  
  // Xác định title dựa trên loại lỗi
  let title = '⚠️ Lỗi';
  
  if (isAuthError(error)) {
    title = '🔒 Lỗi xác thực';
  } else if (isNetworkError(error)) {
    title = '🌐 Lỗi kết nối';
  } else if (isValidationError(error)) {
    title = '📝 Lỗi dữ liệu';
  } else if (status && status >= 500) {
    title = '🔧 Lỗi máy chủ';
  }
  
  return {
    title,
    description: message,
  };
}

/**
 * Log error ra console với format đẹp
 * Chỉ log ở development mode
 */
export function logError(error: any, context?: string): void {
  if (process.env.NODE_ENV === 'development') {
    console.group(`❌ Error${context ? ` in ${context}` : ''}`);
    console.error('Message:', getErrorMessage(error));
    console.error('Status:', error?.response?.status);
    console.error('Full Error:', error);
    console.groupEnd();
  }
}
