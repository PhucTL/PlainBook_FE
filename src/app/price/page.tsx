'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AnimatedSection from '@/components/animation/AnimatedSection';
import { Check } from 'lucide-react';

export default function PricingPage() {
  const pricingPlans = [
    {
      name: 'Starter',
      price: '29',
      period: 'tháng',
      description: 'Dành cho cá nhân hoặc doanh nghiệp nhỏ mới khởi đầu.',
      features: [
        'Quản lý khách hàng không giới hạn',
        'Báo cáo cơ bản',
        'Hỗ trợ qua Email',
      ],
      buttonText: 'Bắt đầu',
      buttonStyle: 'bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-50',
      popular: false,
    },
    {
      name: 'Business',
      price: '79',
      period: 'tháng',
      description: 'Giải pháp lý tưởng cho doanh nghiệp đang phát triển.',
      features: [
        'Tất cả tính năng từ gói Starter',
        'Báo cáo từ động',
        'Truy cập API',
        'Hỗ trợ ưu tiên 24/7',
      ],
      buttonText: 'Chọn Gói Pro',
      buttonStyle: 'bg-blue-600 text-white hover:bg-blue-700',
      popular: true,
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'Tùy chỉnh theo nhu cầu các tập đoàn lớn.',
      features: [
        'Tất cả tính năng từ gói Business',
        'Bảo mật nâng cao',
        'Quản lý tài khoản chuyên biệt',
        'Tích hợp tùy chỉnh',
      ],
      buttonText: 'Liên hệ Tư vấn',
      buttonStyle: 'bg-white text-gray-900 border-2 border-gray-300 hover:bg-gray-50',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      
      <main className="grow bg-gray-50">
        {/* Hero Section */}
        <section className="bg-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <AnimatedSection animation="fade-up">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Các Gói Dịch Vụ Phù Hợp Với Mọi Quy Mô Doanh Nghiệp
              </h1>
              <p className="text-lg text-gray-600 mb-8">
                Chọn thành toán theo năm để tiết kiệm đến 20%.
              </p>
              <div className="flex items-center justify-center gap-4 mb-8">
                <button className="px-6 py-2 bg-gray-100 text-gray-900 rounded-md hover:bg-gray-200 transition-colors">
                  Thanh toán hàng tháng
                </button>
                <button className="px-6 py-2 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  Thanh toán hàng năm
                </button>
              </div>
            </AnimatedSection>
          </div>
        </section>

        {/* Pricing Cards */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {pricingPlans.map((plan, index) => (
                <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                  <div className={`bg-white rounded-xl p-8 shadow-sm ${plan.popular ? 'border-2 border-blue-600 relative' : 'border border-gray-200'}`}>
                    {plan.popular && (
                      <div className="absolute top-0 right-8 transform -translate-y-1/2">
                        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                          Phổ biến nhất
                        </span>
                      </div>
                    )}
                    <div className="mb-8">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{plan.name}</h3>
                      <p className="text-sm text-gray-600 mb-4">{plan.description}</p>
                      <div className="flex items-baseline">
                        <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                        {plan.period && <span className="text-gray-600 ml-2">/{plan.period}</span>}
                      </div>
                    </div>
                    <button className={`w-full px-6 py-3 rounded-md transition-colors font-medium mb-8 ${plan.buttonStyle}`}>
                      {plan.buttonText}
                    </button>
                    <div className="space-y-4">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <AnimatedSection animation="fade-up" className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Câu hỏi thường gặp</h2>
            </AnimatedSection>
            <div className="space-y-6">
              <AnimatedSection animation="fade-up" delay={100}>
                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                    Tôi có thể hủy gói dịch vụ của mình bất cứ lúc nào không?
                    <span className="text-gray-400">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                    Có, bạn có thể hủy hoặc thay đổi gói dịch vụ của mình bất kỳ lúc nào bằng cách vào tài khoản. Mọi thay đổi sẽ có hiệu lực từ chu kỳ thanh toán tiếp theo.
                  </p>
                </details>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={200}>
                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                    Các phương thức thanh toán nào được chấp nhận?
                    <span className="text-gray-400">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                    Chúng tôi chấp nhận tất cả các thẻ tín dụng chính, thẻ ghi nợ và PayPal.
                  </p>
                </details>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={300}>
                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                    Chính sách hoàn tiền của bạn là gì?
                    <span className="text-gray-400">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                    Chúng tôi cung cấp chính sách hoàn tiền trong vòng 30 ngày cho tất cả các gói dịch vụ.
                  </p>
                </details>
              </AnimatedSection>
              <AnimatedSection animation="fade-up" delay={400}>
                <details className="bg-gray-50 rounded-lg p-6 group">
                  <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
                    Tôi có thể nâng cấp hoặc hạ gói dịch vụ của mình không?
                    <span className="text-gray-400">▼</span>
                  </summary>
                  <p className="text-gray-600 mt-4 text-sm leading-relaxed">
                    Có, bạn có thể thay đổi gói dịch vụ bất kỳ lúc nào và chúng tôi sẽ điều chỉnh chi phí tương ứng.
                  </p>
                </details>
              </AnimatedSection>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}