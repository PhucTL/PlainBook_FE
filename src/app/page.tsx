"use client";
import AnimatedSection from '@/components/animation/AnimatedSection';
import HeroSection from '@/components/ui/HeroSection';
import FeaturesSection from '@/components/ui/FeaturesSection';
import CTASection from '@/components/ui/CTASection';
import { homeConfig } from '@/config/homeConfig';

export default function Home() {
  return (
    <>
      <HeroSection {...homeConfig.hero} />
      <FeaturesSection 
        title={homeConfig.features.title}
        subtitle={homeConfig.features.subtitle}
        features={homeConfig.features.items}
      />
      <BenefitsSection />
      <ProcessStepsSection />
      <TestimonialsSection />
      <CTASection {...homeConfig.cta} />
    </>
  );
}

function BenefitsSection() {
  const { title, tabs, items } = homeConfig.benefits;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="scale" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
        </AnimatedSection>

        <AnimatedSection animation="fade" className="flex justify-center mb-12">
          <div className="inline-flex border-b border-gray-300">
            {tabs.map((tab, index) => (
              <button 
                key={index}
                className={`px-6 py-3 ${index === 0 ? 'text-blue-600 border-b-2 border-blue-600 font-medium' : 'text-gray-600 hover:text-gray-900'}`}
              >
                {tab}
              </button>
            ))}
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {items.map((item, index) => (
            <AnimatedSection key={index} animation="fade-up" delay={(index + 1) * 100} className="bg-white p-8 rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-2xl">{item.emoji}</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>
              <p className="text-gray-600">
                {item.description}
              </p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProcessStepsSection() {
  const { title, subtitle, steps } = homeConfig.processSteps;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <AnimatedSection key={step.number} animation="scale" delay={(index + 1) * 100} className="text-center">
              <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                {step.number}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{step.title}</h3>
              <p className="text-sm text-gray-600">{step.description}</p>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const { title, items } = homeConfig.testimonials;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {items.map((testimonial, index) => (
            <AnimatedSection 
              key={index} 
              animation={index === 0 ? 'fade-right' : 'fade-left'} 
              className="bg-white p-8 rounded-lg shadow-sm"
            >
              <p className="text-gray-600 mb-6 italic">{testimonial.quote}</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gray-300 rounded-full mr-4"></div>
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.position}</p>
                </div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}




