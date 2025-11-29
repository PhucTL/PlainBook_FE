// "use client"; // Vì dùng Redux hooks

// import { useGetWorkspacesQuery } from '@/redux/apis/workspaceApi';
// import { WorkspaceGrid } from './WorkspaceGrid';
// import { Skeleton } from '@/components/ui/skeleton'; // Loading UI

// export default function WorkspaceList() {
//   // Hook trả về tất cả trạng thái bạn cần
//   const { data, isLoading, isError, error } = useGetWorkspacesQuery();

//   // 1. Xử lý Loading: Hiển thị Skeleton thay vì quay vòng tròn (UX tốt hơn)
//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-2 gap-4">
//         <Skeleton className="h-40 w-full" />
//         <Skeleton className="h-40 w-full" />
//       </div>
//     );
//   }

//   // 2. Xử lý Lỗi hiển thị (Fallback UI)
//   // Lỗi Toast đã được Middleware xử lý, ở đây chỉ hiện UI thay thế nếu cần
//   if (isError) {
//     return (
//         <div className="text-center text-red-500 py-10">
//             Không thể tải dữ liệu. Vui lòng thử lại.
//         </div>
//     );
//   }

//   // 3. Render dữ liệu
//   return <WorkspaceGrid items={data || []} />;
// }