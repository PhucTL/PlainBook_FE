'use client';

import { useEffect, useState, useRef } from 'react';

interface IntroVideoProps {
  onComplete: () => void;
}

export default function IntroVideo({ onComplete }: IntroVideoProps) {
  const [isVisible, setIsVisible] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Auto-play video
    if (videoRef.current) {
      videoRef.current.play().catch(err => {
        console.warn('Video autoplay failed:', err);
      });
    }
  }, []);

  const handleSkip = () => {
    setIsVisible(false);
    localStorage.setItem('intro-video-seen', 'true');
    onComplete();
  };

  const handleVideoEnd = () => {
    setIsVisible(false);
    localStorage.setItem('intro-video-seen', 'true');
    onComplete();
  };

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <video
        ref={videoRef}
        src="/video.mp4"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
        onEnded={handleVideoEnd}
        playsInline
        muted
      />
      <button
        onClick={handleSkip}
        style={{
          position: 'absolute',
          top: '24px',
          right: '24px',
          padding: '12px 24px',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          color: '#000',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'all 0.2s',
          zIndex: 10000,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#fff';
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        Bỏ qua →
      </button>
    </div>
  );
}
