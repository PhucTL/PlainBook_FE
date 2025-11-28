export const lessonPlansConfig = {
  header: {
    title: 'Quản lý Giáo án',
    subtitle: 'Tạo, quản lý và lưu trữ các giáo án và kế hoạch giảng dạy của bạn.',
    createButtonText: 'Soạn giáo án mới',
    uploadButtonText: 'Tải lên từ file',
  },
  filters: [
    { id: 'all', label: 'Tất cả' },
    { id: 'draft', label: 'Bản nhập' },
    { id: 'published', label: 'Đã công bố' },
  ],
  lessonPlans: [
    {
      id: 1,
      title: 'Giáo án Đại số lớp 10',
      subject: 'Toán học',
      date: '20/10/2023',
      status: 'published',
      statusText: 'Đã công bố',
    },
    {
      id: 2,
      title: 'Kế hoạch bài giảng Văn học Việt Nam',
      subject: 'Ngữ văn',
      date: '15/10/2023',
      status: 'draft',
      statusText: 'Bản nhập',
    },
    {
      id: 3,
      title: 'Giáo án Ngữ pháp Tiếng Anh',
      subject: 'Tiếng Anh',
      date: '10/10/2023',
      status: 'published',
      statusText: 'Đã công bố',
    },
  ],
  pagination: {
    itemsPerPage: 4,
  },
};
