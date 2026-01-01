'use client';

import { useState, useEffect, ReactNode } from 'react';
import IntroVideo from './IntroVideo';

interface IntroWrapperProps {
  children: ReactNode;
}

export default function IntroWrapper({ children }: IntroWrapperProps) {
  const [showIntro, setShowIntro] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Check if user has seen the intro
    const hasSeenIntro = localStorage.getItem('intro-video-seen');
    setShowIntro(!hasSeenIntro);
    setIsReady(true);
  }, []);

  const handleIntroComplete = () => {
    setShowIntro(false);
  };

  // Prevent flash of content
  if (!isReady) {
    return (
      <div style={{ 
        width: '100vw', 
        height: '100vh', 
        backgroundColor: '#000' 
      }} />
    );
  }

  return (
    <>
      {showIntro && <IntroVideo onComplete={handleIntroComplete} />}
      {children}
    </>
  );
}
