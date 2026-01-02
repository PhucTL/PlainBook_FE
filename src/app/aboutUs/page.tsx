'use client';
import AnimatedSection from '@/components/animation/AnimatedSection';
import HeroSection from '@/components/ui/HeroSection';
import FeaturesSection from '@/components/ui/FeaturesSection';
import CTASection from '@/components/ui/CTASection';
import { aboutConfig } from '@/config/aboutConfig';

export default function AboutUsPage() {
  return (
    <>
      <HeroSection 
        title={aboutConfig.hero.title}
        description={aboutConfig.hero.description}
        primaryButtonText={aboutConfig.hero.primaryButtonText}
        secondaryButtonText={aboutConfig.hero.secondaryButtonText}
        buttonLink={aboutConfig.hero.buttonLink}
        imagePath={aboutConfig.hero.imagePath}
        bgColor="bg-gray-100"
      />
      <FeaturesSection 
        title={aboutConfig.missionVisionValues.title}
        subtitle={aboutConfig.missionVisionValues.subtitle}
        features={aboutConfig.missionVisionValues.items}
      />
      <ServicesSection />
      <CTASection {...aboutConfig.cta} />
    </>
  );
}

function ServicesSection() {
  const { title, subtitle, items } = aboutConfig.services;

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatedSection animation="fade-up" className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((service, index) => {
            const Icon = service.icon;
            return (
              <AnimatedSection key={index} animation="fade-up" delay={index * 100}>
                <div className="bg-white rounded-xl p-8 shadow-sm hover:shadow-lg transition-shadow">
                  <div className={`flex items-center justify-center w-14 h-14 ${service.color} rounded-lg mb-6`}>
                    <Icon className={`w-7 h-7 ${service.iconColor}`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
}


