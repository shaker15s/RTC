'use client';

import { useEffect, useMemo, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { DOUBLE_MARQUEE_VALUES } from '@/lib/data';

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor((i + 1) * Math.abs(Math.sin((i * 9301 + 49297) % 233280 / 233280)));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default function DoubleMarquee() {
  const [isMobile, setIsMobile] = useState(false);

  const tracks = useMemo(() => {
    const shuffled = shuffleArray(DOUBLE_MARQUEE_VALUES);
    return [
      [...shuffled, ...shuffled],
      [...shuffled, ...shuffled],
    ];
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const mobile = window.matchMedia('(max-width: 768px)').matches;
    setIsMobile(mobile);

    const ctx = gsap.context(() => {
      gsap.set('.marquee-left .marquee-svg-item:nth-child(2) path', { strokeDashoffset: 1000 });

      const marqueeTl = gsap.timeline({
        scrollTrigger: {
          trigger: '.Double-marquee',
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      marqueeTl
        .to('.marquee-underline', { scaleX: 1, opacity: 1, duration: 1, ease: 'power2.out' })
        .to('.marquee-left .marquee-svg-item:nth-child(1)', { scale: 1, opacity: 1, rotation: -10, duration: 0.6, ease: 'back.out(1.7)' }, '-=0.5')
        .to('.marquee-left .marquee-svg-item:nth-child(2) path', { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out' }, '-=0.3');
    });

    return () => ctx.revert();
  }, []);

  return (
    <>
      <div className="marquee-left">
        <div className="marquee-text-container">
          <h2>
            Our Core <span className="text-with">Values:</span>
          </h2>
          {/* Underline arrow */}
          <svg xmlns="http://www.w3.org/2000/svg" className="marquee-underline" viewBox="0 0 132 5" fill="none">
            <path d="M1 2.08377C44.3458 3.90451 87.9791 5.71442 131 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <div className="marquee-blob-container">
          <img src="/assets/Marquee-blob SVG/marquee-blob.svg" className="marquee-blob" alt="" aria-hidden="true" />
          <div className="marquee-svg-container">
            <div className="marquee-svg-item">
              <img src="/assets/Marquee-blob SVG/marquee-hand.svg" width="100%" alt="" aria-hidden="true" />
            </div>
            <div className="marquee-svg-item">
              <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 386 127" fill="none">
                <path d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L356.5 105.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L384 97" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      <div className="marquee-right">
        {tracks.map((trackItems, colIndex) => (
          <div key={colIndex} className="marquee-column">
            <div className="marquee-track">
              {trackItems.map((item, i) => (
                <div
                  key={i}
                  className="marquee-item"
                  style={{ backgroundColor: item.color }}
                >
                  <div className="marquee-value-wrapper">
                    <span className="marquee-value-ar" lang="ar" dir="rtl">{item.value_ar}</span>
                    <span className="marquee-value-sep" aria-hidden="true">·</span>
                    <span className="marquee-value-en" lang="en" dir="ltr">{item.value_en}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}