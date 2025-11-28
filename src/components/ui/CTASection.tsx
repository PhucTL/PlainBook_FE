import AnimatedSection from '@/components/animation/AnimatedSection';

interface CTASectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink?: string;
  bgColor?: string;
}

export default function CTASection({ 
  title, 
  description, 
  buttonText, 
  buttonLink = '#',
  bgColor = 'bg-blue-600'
}: CTASectionProps) {
  return (
    <section className={`py-20 ${bgColor}`}>
      <AnimatedSection animation="scale" className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-white mb-4">
          {title}
        </h2>
        <p className="text-xl text-blue-100 mb-8">
          {description}
        </p>
        <button className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-md hover:bg-gray-100 transition-colors">
          {buttonText}
        </button>
      </AnimatedSection>
    </section>
  );
}
