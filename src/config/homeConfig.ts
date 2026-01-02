import { ClipboardList, BookOpen, Users } from 'lucide-react';

export const homeConfig = {
  hero: {
    title: 'Nâng tầm giảng dạy với Kế hoạch Bài học chuyên nghiệp',
    description: 'Tạo, tổ chức và quản lý kế hoạch bài học một cách khoa học, giúp bạn tập trung vào việc truyền đạt kiến thức và nâng cao hiệu quả giảng dạy.',
    buttonText: 'Bắt đầu ngay',
    buttonLink: '/login',
    imagePath: '/home.png',
  },
  features: {
    title: 'Công cụ mạnh mẽ cho kế hoạch giảng dạy xuất sắc',
    subtitle: 'Dịch vụ Kế hoạch Bài học của chúng tôi được trang bị các công cụ giúp bạn tổi ưu thời gian, tăng cường hợp tác và xây dựng những tình giảng dạy chất lượng cao.',
    items: [
      {
        icon: ClipboardList,
        title: 'Tạo Kế hoạch Linh hoạt',
        description: 'Dễ dàng tạo các kế hoạch bài học chi tiết với các công cụ trực quan và duy trì quy trình biên tập của bạn.',
      },
      {
        icon: BookOpen,
        title: 'Tổ chức Khoa học',
        description: 'Quản lý các chủ đề, mục tiêu, và Kế hoạch bài học theo mức độ hiệu quả, thực chỉ số kết quả đề đạt theo từng nội dung.',
      },
      {
        icon: Users,
        title: 'Cộng tác Hiệu quả',
        description: 'Chia sẻ kế hoạch với đồng nghiệp, cùng nhau đóng góp ý kiến và xây dựng bài giảng.',
      },
    ],
  },
  benefits: {
    title: 'Tất cả những gì bạn cần cho việc giảng dạy',
    tabs: ['Lợi ích', 'Cách hoạt động', 'Phương tiện sử dụng'],
    items: [
      {
        emoji: '💡',
        title: 'Tiết kiệm thời gian',
        description: 'Giảm thời gian chuẩn bị bài giảng với các công cụ trực quan và quy trình đơn giản để bạn tập trung vào mục tiêu giảng dạy.',
      },
      {
        emoji: '💡',
        title: 'Nâng cao chất lượng giảng dạy',
        description: 'Xây dựng các bài giảng có cấu trúc, rõ ràng và phù hợp với mục tiêu học tập của học sinh.',
      },
      {
        emoji: '🔒',
        title: 'Đảm bảo tính nhất quán',
        description: 'Duy trì sự đồng bộ trong những thay đổi giảng dạy trên toàn bộ giáo án và toàn lực lượng giảng dạy.',
      },
    ],
  },
  processSteps: {
    title: 'Quy trình làm việc đơn giản',
    subtitle: 'Từ ý tưởng đến bài học, quy trình của chúng tôi giúp bạn tạo kế hoạch bài học trở nên đơn giản và hiệu quả hơn sau giảo hết.',
    steps: [
      {
        number: 1,
        title: 'Chọn Mẫu',
        description: 'Bắt đầu thông chọng với mẫu nội dung có sẵn.',
      },
      {
        number: 2,
        title: 'Phát triển Nội dung',
        description: 'Bổ sung nội dung bài giảng với công cụ dành kiểm tra người dùng.',
      },
      {
        number: 3,
        title: 'Đối chiếu Chuẩn',
        description: 'Ánh xạ bài kiểm tra với các tiêu chuẩn chương trình.',
      },
      {
        number: 4,
        title: 'Hợp tác',
        description: 'Mời đồng nghiệp xem xét và góp ý.',
      },
      {
        number: 5,
        title: 'Hoàn thiện & Chia sẻ',
        description: 'Chia sẻ nội học với các lớp và giảm thời gian giảng dạy.',
      },
    ],
  },
  testimonials: {
    title: 'Được các nhà giáo dục tin dùng',
    items: [
      {
        quote: '"Dịch vụ này đã thay đổi hoàn toàn cách chúng tôi lập kế hoạch giảng dạy. Việc cộng tác và quản lý bài nội, nội dung bài học giờ dễ dàng và rất nhanh chóng hết lẹn làm quen hằng một mùa ngày."',
        name: 'Cô Nguyễn Thị A',
        position: 'Giáo viên chuyên ngành, Trường THPT ABC',
      },
      {
        quote: '"Việc đảm bảo các bài giảng toàn bộ liên thủ của tổ GDQP tỗng là một thách thức lớn đây, mọi thứ trở nên nghiệp, phối hợp hiểu hoàn toàn được nghĩa sử vị cho đội ngũ tỉnh giảng dạy của chúng tôi."',
        name: 'Thầy Trần Văn B',
        position: 'Hiệu trưởng trường Hệ, Hệ thống giác dục Bac',
      },
    ],
  },
  cta: {
    title: 'Sẵn sàng đổi mới phương pháp giảng dạy của bạn?',
    description: 'Tham gia cùng hàng ngàn nhà giáo dục đang sử dụng mô hình của chúng tôi để nâng cao hiệu quả giảng dạy.',
    buttonLink: '/login',
    buttonText: 'Bắt đầu ngay',
  },
};
