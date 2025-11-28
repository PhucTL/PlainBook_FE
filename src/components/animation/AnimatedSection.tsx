'use client';

import { useEffect, useRef, useState, ReactNode } from 'react';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'scale' | 'fade';
  delay?: number;
  duration?: number;
}

export default function AnimatedSection({
  children,
  className = '',
  animation = 'fade-up',
  delay = 0,
  duration = 1000,
}: AnimatedSectionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px',
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  const getAnimationClasses = () => {
    const baseClasses = 'transition-all';
    const durationClass = `duration-[${duration}ms]`;
    const delayClass = delay > 0 ? `delay-${delay}` : '';

    let animationClasses = '';
    
    switch (animation) {
      case 'fade-up':
        animationClasses = isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10';
        break;
      case 'fade-down':
        animationClasses = isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 -translate-y-10';
        break;
      case 'fade-left':
        animationClasses = isVisible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 translate-x-10';
        break;
      case 'fade-right':
        animationClasses = isVisible
          ? 'opacity-100 translate-x-0'
          : 'opacity-0 -translate-x-10';
        break;
      case 'scale':
        animationClasses = isVisible
          ? 'opacity-100 scale-100'
          : 'opacity-0 scale-90';
        break;
      case 'fade':
        animationClasses = isVisible ? 'opacity-100' : 'opacity-0';
        break;
      default:
        animationClasses = isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-10';
    }

    return `${baseClasses} ${durationClass} ${delayClass} ${animationClasses}`;
  };

  return (
    <div ref={ref} className={`${getAnimationClasses()} ${className}`}>
      {children}
    </div>
  );
}
