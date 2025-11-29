// import { createApi } from '@reduxjs/toolkit/query/react';
// import { baseQuery } from './baseQuery';
// import { Project } from '@/types'; // Import type đã định nghĩa

// export const workspaceApi = createApi({
//   reducerPath: 'workspaceApi',
//   baseQuery: baseQuery,
//   tagTypes: ['Workspaces'], // Dùng để auto-refetch dữ liệu khi có thay đổi
//   endpoints: (builder) => ({
//     // 1. Lấy danh sách (Query)
//     getWorkspaces: builder.query<Project[], void>({
//       query: () => '/workspaces',
//       providesTags: ['Workspaces'],
//     }),

//     // 2. Tạo mới (Mutation)
//     createWorkspace: builder.mutation<Project, Partial<Project>>({
//       query: (body) => ({
//         url: '/workspaces',
//         method: 'POST',
//         body,
//       }),
//       // Sau khi tạo xong, tự động load lại danh sách cũ (Clean!)
//       invalidatesTags: ['Workspaces'], 
//     }),
//   }),
// });

// // Export hooks tự động sinh ra
// export const { useGetWorkspacesQuery, useCreateWorkspaceMutation } = workspaceApi;