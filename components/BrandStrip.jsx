'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { brands } from '@/lib/data';

export default function BrandStrip() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      '.brand-strip__item',
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        stagger: 0.08,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: '.brand-strip',
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  }, []);

  return (
    <section className="brand-strip">
      <p className="brand-strip__eyebrow" lang="ar" dir="rtl">شركاؤنا في النجاح</p>
      <div className="brand-strip__track">
        {brands.map(({ name, wordmark, src }) => (
          <div key={name} className="brand-strip__item">
            {src ? (
              <img src={src} alt={name} className="brand-strip__logo" />
            ) : (
              <span className="brand-strip__wordmark" lang="en" dir="ltr">{wordmark}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
