"use client";

import AnimatedSection from '@/components/animation/AnimatedSection';
import { useEffect, useState } from 'react';
import Link from 'next/link';

interface HeroSectionProps {
  title: string;
  description: string;
  buttonText?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  buttonLink?: string;
  imagePath?: string;
  bgColor?: string;
}

export default function HeroSection({ 
  title, 
  description, 
  buttonText,
  primaryButtonText,
  secondaryButtonText,
  buttonLink = '#',
  imagePath = '',
  bgColor = 'bg-gradient-to-r from-gray-50 to-white'
}: HeroSectionProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    try {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    } catch (e) {
      setIsLoggedIn(false);
    }
  }, []);

  const computeHref = (link: string) => {
    if (!link || link === '#') return '#';
    if (isLoggedIn) return link;
    return `/login?redirect=${encodeURIComponent(link)}`;
  };

  return (
    <section className={`${bgColor} py-20`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <AnimatedSection animation="fade-right">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {title}
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              {description}
            </p>
            <div className="flex gap-4">
              {primaryButtonText && secondaryButtonText ? (
                <>
                  <Link href={computeHref(buttonLink)}>
                    <button className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium">
                      {primaryButtonText}
                    </button>
                  </Link>
                  <Link href={computeHref(buttonLink)}>
                    <button className="px-6 py-3 bg-white text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium">
                      {secondaryButtonText}
                    </button>
                  </Link>
                </>
              ) : (
                <Link href={computeHref(buttonLink)}>
                  <button className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition-colors">
                    {buttonText}
                  </button>
                </Link>
              )}
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fade-left" delay={200}>
            <div 
              className="bg-gray-300 rounded-lg h-96 flex items-center justify-center"
              style={{
                backgroundImage: imagePath ? `url(${imagePath})` : 'none',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  );
}
