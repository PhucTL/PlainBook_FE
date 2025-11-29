// import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// // Cấu hình cơ bản
// export const baseQuery = fetchBaseQuery({
//   baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://api.yoursite.com/v1',
//   prepareHeaders: (headers) => {
//     // Tự động lấy token từ LocalStorage hoặc Cookie thêm vào mọi request
//     const token = localStorage.getItem('token'); 
//     if (token) {
//       headers.set('authorization', `Bearer ${token}`);
//     }
//     return headers;
//   },
// });