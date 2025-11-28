import { Plus, HelpCircle, FolderOpen, FileText, Play, Download, Eye } from 'lucide-react';

export const workspaceConfig = {
  quickAccess: {
    title: 'Truy Cập Nhanh',
    items: [
      {
        icon: Plus,
        label: 'Tạo Giáo Án',
        description: 'Tạo giáo án mới',
      },
      {
        icon: HelpCircle,
        label: 'Tạo Đề Thi',
        description: 'Tạo đề thi mới',
      },
      {
        icon: FolderOpen,
        label: 'Tóm Tắt AI',
        description: 'Tóm tắt tài liệu',
      },
      {
        icon: FileText,
        label: 'Tải Tài Liệu',
        description: 'Tải tài liệu lên',
      },
    ],
  },
  workspaces: {
    title: 'Không gian làm việc',
    viewAllLink: 'Xem tất cả',
    items: [
      {
        id: 1,
        title: 'Dự án Phân tích Thị trường Q3',
        description: 'Phân tích xu hướng thị trường, đối thủ cạnh tranh và cơ hội tăng trưởng cho quý 3.',
        gradient: 'from-amber-200 via-yellow-100 to-green-100',
        updatedAt: '2 giờ trước',
        members: [
          { id: 1, name: 'User 1', avatar: 'U1' },
          { id: 2, name: 'User 2', avatar: 'U2' },
        ],
      },
      {
        id: 2,
        title: 'Xây dựng Giáo án Marketing',
        description: 'Tạo bộ giáo án đầy đủ cho khóa học Marketing kỹ thuật số cơ bản.',
        gradient: 'from-teal-200 via-cyan-100 to-blue-100',
        updatedAt: 'hôm qua',
        members: [
          { id: 1, name: 'User 1', avatar: 'U1' },
        ],
      },
    ],
  },
  recentActivities: {
    title: 'Hoạt Động Gần Đây',
    items: [
      {
        id: 1,
        type: 'lesson',
        icon: FileText,
        title: 'Giáo án Marketing',
        action: 'Bạn đã cập nhật',
        time: '1 giờ trước',
      },
      {
        id: 2,
        type: 'slide',
        icon: Play,
        title: 'Slide Bài giảng',
        action: 'Bạn đã thêm 5 slide mới vào',
        time: '5 giờ trước',
      },
      {
        id: 3,
        type: 'video',
        icon: Play,
        title: 'Hướng dẫn Marketing',
        action: 'Bạn đã xem video',
        time: 'Hôm qua',
      },
      {
        id: 4,
        type: 'ai',
        icon: Download,
        title: 'báo cáo từ AI',
        action: 'Bạn đã tải về',
        time: '2 ngày trước',
      },
    ],
  },
  aiResults: {
    title: 'Kết quả từ AI',
    viewAllLink: 'Xem tất cả',
    items: [
      {
        id: 1,
        icon: FileText,
        title: 'Báo cáo phân tích đối thủ',
        time: 'Tạo 15 phút trước',
        actions: [
          { icon: Download, label: 'Tải xuống' },
          { icon: Eye, label: 'Xem' },
        ],
      },
      {
        id: 2,
        icon: FolderOpen,
        title: 'Tóm tắt "Kinh tế học vĩ mô"',
        time: 'Tạo 3 giờ trước',
        actions: [
          { icon: Download, label: 'Tải xuống' },
          { icon: Eye, label: 'Xem' },
        ],
      },
      {
        id: 3,
        icon: FileText,
        title: 'Phân tích cảm xúc khách hàng Q2',
        time: 'Tạo hôm qua',
        actions: [
          { icon: Download, label: 'Tải xuống' },
          { icon: Eye, label: 'Xem' },
        ],
      },
    ],
  },
};
