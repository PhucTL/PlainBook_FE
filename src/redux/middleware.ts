// import { isRejectedWithValue } from '@reduxjs/toolkit';
// import type { Middleware } from '@reduxjs/toolkit';
// import { toast } from 'sonner'; // Hoặc react-hot-toast

// export const rtkQueryErrorLogger: Middleware = () => (next) => (action) => {
//   // Kiểm tra nếu action là một lỗi từ API trả về
//   if (isRejectedWithValue(action)) {
//     const payload = action.payload as any;
    
//     // Xử lý lỗi cụ thể
//     if (payload.status === 401) {
//        toast.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
//        // Có thể dispatch hành động logout tại đây
//     } else if (payload.status === 500) {
//        toast.error("Lỗi hệ thống, vui lòng thử lại sau.");
//     } else {
//        // Lỗi message từ Backend trả về
//        toast.error(payload.data?.message || "Đã có lỗi xảy ra");
//     }
//   }

//   return next(action);
// };