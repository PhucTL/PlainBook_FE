/**
 * Toast notification utilities using react-toastify
 * Cung cấp các function tiện ích để hiển thị thông báo
 */

import { toast, ToastOptions } from 'react-toastify';

// Default toast configuration
const defaultOptions: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

/**
 * Hiển thị thông báo thành công
 */
export function showSuccess(message: string, options?: ToastOptions) {
  toast.success(message, { ...defaultOptions, ...options });
}

/**
 * Hiển thị thông báo lỗi
 */
export function showError(message: string, options?: ToastOptions) {
  toast.error(message, { ...defaultOptions, ...options });
}

/**
 * Hiển thị thông báo cảnh báo
 */
export function showWarning(message: string, options?: ToastOptions) {
  toast.warning(message, { ...defaultOptions, ...options });
}

/**
 * Hiển thị thông báo thông tin
 */
export function showInfo(message: string, options?: ToastOptions) {
  toast.info(message, { ...defaultOptions, ...options });
}

/**
 * Hiển thị thông báo loading
 * Trả về toastId để có thể update sau
 */
export function showLoading(message: string = 'Đang xử lý...') {
  return toast.loading(message);
}

/**
 * Update toast đã tồn tại
 */
export function updateToast(
  toastId: string | number,
  message: string,
  type: 'success' | 'error' | 'warning' | 'info'
) {
  toast.update(toastId, {
    render: message,
    type,
    isLoading: false,
    autoClose: 3000,
  });
}

/**
 * Dismiss toast
 */
export function dismissToast(toastId?: string | number) {
  if (toastId) {
    toast.dismiss(toastId);
  } else {
    toast.dismiss();
  }
}
