export const examConfig = {
  header: {
    title: 'Quản lý Đề thi',
    subtitle: 'Tạo, quản lý và lưu trữ các đề thi và bài kiểm tra của bạn.',
    createButtonText: 'Soạn đề thi mới',
    uploadButtonText: 'Tải lên từ file',
  },
  filters: [
    { id: 'all', label: 'Tất cả' },
    { id: 'draft', label: 'Bản nhập' },
    { id: 'published', label: 'Đã công bố' },
  ],
  exams: [
    {
      id: 1,
      title: 'Đề kiểm tra cuối kỳ I',
      subject: 'Toán học',
      date: '20/10/2023',
      status: 'published',
      statusText: 'Đã công bố',
    },
    {
      id: 2,
      title: 'Đề thi thử tốt nghiệp THPT',
      subject: 'Ngữ văn',
      date: '15/10/2023',
      status: 'draft',
      statusText: 'Bản nhập',
    },
    {
      id: 3,
      title: 'Bài kiểm tra 15 phút',
      subject: 'Tiếng Anh',
      date: '10/10/2023',
      status: 'published',
      statusText: 'Đã công bố',
    },
  ],
  pagination: {
    itemsPerPage: 5,
  },
};
