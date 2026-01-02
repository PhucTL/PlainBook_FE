import { Database, GraduationCap, FileText, PresentationIcon, Clock, Bot, Target, Eye, Heart } from 'lucide-react';

export const aboutConfig = {
  hero: {
    title: 'Nền Tảng Quản Lý Tất Cả Trong Một Cho Doanh Nghiệp Của Bạn',
    description: 'Tối ưu hóa quy trình làm việc của bạn với bộ công cụ toàn diện để quản lý dữ liệu, tài liệu học tập, giáo án, đề thi và kết quả được hỗ trợ bởi AI.',
    primaryButtonText: 'Bắt Đầu Ngay',
    secondaryButtonText: 'Khám Phá Tính Năng',
    buttonLink: '/login',
    imagePath: '/aboutus.png',
  },
  missionVisionValues: {
    title: 'Sứ Mệnh, Tầm Nhìn và Giá Trị Cốt Lõi',
    subtitle: 'Chúng tôi cam kết trao quyền cho các doanh nghiệp và cơ sở giáo dục bằng cách cung cấp một nền tảng thống nhất giúp nâng cao năng suất, hợp tác và đổi mới sáng tạo.',
    items: [
      {
        icon: Target,
        title: 'Sứ Mệnh',
        description: 'Cung cấp trải nghiệm quản lý liền mạch và tích hợp giúp tiết kiệm thời gian và nâng cao hiệu quả cho tất cả người dùng của chúng tôi.',
      },
      {
        icon: Eye,
        title: 'Tầm Nhìn',
        description: 'Trở thành nền tảng hàng đầu về quản lý dịch vụ doanh nghiệp và giáo dục thông qua đổi mới liên tục và thiết kế lấy người dùng làm trung tâm.',
      },
      {
        icon: Heart,
        title: 'Giá Trị Cốt Lõi',
        description: 'Duy trì tính chính trực, thúc đẩy sự hợp tác và ưu tiên thành công của khách hàng trong mọi điều chúng tôi làm, mỗi ngày.',
      },
    ],
  },
  services: {
    title: 'Các Dịch Vụ Của Chúng Tôi',
    subtitle: 'Khám phá bộ công cụ toàn diện giúp tối ưu hóa quy trình làm việc của bạn',
    items: [
      {
        icon: Database,
        title: 'Quản lý Dữ liệu',
        description: 'Xây dựng nền tảng thống kê vững chắc, giúp bạn dễ dàng truy xuất và quản lý dữ liệu một cách nhất quán, an toàn và hiệu quả.',
        color: 'bg-cyan-100',
        iconColor: 'text-cyan-600',
      },
      {
        icon: GraduationCap,
        title: 'Tài liệu Học tập',
        description: 'Tập cản hỗ trợ người học thuật phong phú, giúp bạn nâng cao kiến thức và kỹ năng theo yêu cầu môn học cần thiết.',
        color: 'bg-orange-100',
        iconColor: 'text-orange-600',
      },
      {
        icon: FileText,
        title: 'Soạn thảo Giáo án',
        description: 'Công cụ soạn thảo linh hoạt, tiết kiệm thời gian và khơi nguồn cảm hứng sáng tạo để xây dựng những bài giảng chất lượng.',
        color: 'bg-cyan-100',
        iconColor: 'text-cyan-600',
      },
      {
        icon: PresentationIcon,
        title: 'Tạo Đề thi',
        description: 'Thiết kế và quản lý các bài kiểm tra một cách chuyên nghiệp, đảm bảo chuẩn và nâng tầng trưởng học sinh các và hiệu quả.',
        color: 'bg-orange-100',
        iconColor: 'text-orange-600',
      },
      {
        icon: PresentationIcon,
        title: 'Mẫu Slide Thuyết trình',
        description: 'Tạo ấn tượng mạnh mẽ với trực việc mẫu slide đa dạng, giúp bạn truyền tải thông điệp một cách chuyên nghiệp và cuốn hút.',
        color: 'bg-green-100',
        iconColor: 'text-green-600',
      },
      {
        icon: Clock,
        title: 'Không gian Làm việc',
        description: 'Tổ ưu hóa thời gian làm việc nhóm với mô trường cộng tác thông minh, giúp nhân viên tập trung tối đa vào tài nguyên hiện mạnh.',
        color: 'bg-orange-100',
        iconColor: 'text-orange-600',
      },
      {
        icon: Bot,
        title: 'Công cụ AI',
        description: 'Khả nối tiếm năng của trí tuệ nhân tạo để tự động hóa công việc, phân tích dữ liệu và đưa ra những quyết định tối ưu.',
        color: 'bg-cyan-100',
        iconColor: 'text-cyan-600',
      },
    ],
  },
  cta: {
    title: 'Sẵn Sàng Nâng Cao Năng Suất Của Bạn?',
    description: 'Tham gia cùng hàng nghìn doanh nghiệp và nhà giáo dục tin tưởng nền tảng của chúng tôi để tối ưu hóa hoạt động. Bắt đầu ngay hôm nay và khai phá toàn bộ tiềm năng của bạn.',
    buttonText: 'Bắt Đầu Dùng Thử Miễn Phí',
    buttonLink: '/login',
    bgColor: 'bg-gray-900',
  },
};
