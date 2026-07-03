'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { MOTION_PHOTOS } from '@/lib/data';

gsap.registerPlugin(InertiaPlugin, ScrollTrigger);

export default function MotionCards() {
  const sectionRef = useRef(null);
  const containerRef = useRef(null);
  const labelsRef = useRef(null);

  useEffect(() => {
    const cleanups = [];

    const ctx = gsap.context(() => {
      const cards = (containerRef.current?.querySelectorAll('.motion-card__card')) || [];
      cards.forEach((card) => {
        let lastX = 0;
        let lastY = 0;
        let speedX = 0;
        let speedY = 0;

        const startRotation = gsap.getProperty(card, 'rotation') || 0;
        const startX = gsap.getProperty(card, 'x') || 0;
        const startY = gsap.getProperty(card, 'y') || 0;

        const onMove = (e) => {
          speedX = e.clientX - lastX;
          speedY = e.clientY - lastY;
          lastX = e.clientX;
          lastY = e.clientY;
        };

        const onEnter = (e) => {
          speedX = 0;
          speedY = 0;
          lastX = e.clientX;
          lastY = e.clientY;
        };

        const onLeave = () => {
          gsap.to(card, {
            inertia: {
              x: { velocity: speedX * 7, end: startX },
              y: { velocity: speedY * 7, end: startY },
              rotation: { velocity: speedX * 0.8, end: startRotation },
            },
          });
        };

        card.addEventListener('mousemove', onMove);
        card.addEventListener('mouseenter', onEnter);
        card.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          card.removeEventListener('mousemove', onMove);
          card.removeEventListener('mouseenter', onEnter);
          card.removeEventListener('mouseleave', onLeave);
        });
      });

      const labels = (labelsRef.current?.querySelectorAll('.motion-card__floating-label')) || [];
      labels.forEach((label) => {
        let lastX = 0;
        let lastY = 0;
        let speedX = 0;
        let speedY = 0;

        const startRotation = gsap.getProperty(label, 'rotation') || 0;
        const startX = gsap.getProperty(label, 'x') || 0;
        const startY = gsap.getProperty(label, 'y') || 0;

        const onMove = (e) => {
          speedX = e.clientX - lastX;
          speedY = e.clientY - lastY;
          lastX = e.clientX;
          lastY = e.clientY;
        };

        const onEnter = (e) => {
          speedX = 0;
          speedY = 0;
          lastX = e.clientX;
          lastY = e.clientY;
        };

        const onLeave = () => {
          gsap.to(label, {
            inertia: {
              x: { velocity: speedX * 8, end: startX },
              y: { velocity: speedY * 8, end: startY },
              rotation: { velocity: speedX * 1, end: startRotation },
            },
          });
        };

        label.addEventListener('mousemove', onMove);
        label.addEventListener('mouseenter', onEnter);
        label.addEventListener('mouseleave', onLeave);
        cleanups.push(() => {
          label.removeEventListener('mousemove', onMove);
          label.removeEventListener('mouseenter', onEnter);
          label.removeEventListener('mouseleave', onLeave);
        });
      });

      // Title entrance — word-by-word reveal.
      const titleEl = sectionRef.current.querySelector('.motion-card__title');
      if (titleEl) {
        const titleHTML = titleEl.innerHTML;
        const flat = titleHTML
          .replace(/<br\s*\/?>/gi, ' ')
          .replace(/<[^>]+>/g, '')
          .trim();
        const words = flat.split(/\s+/);
        titleEl.innerHTML = words
          .map((w) => `<span class="mc-title-word" style="display:inline-block;opacity:0;transform:translateY(28px);margin-right:0.3em;">${w}</span>`)
          .join('');
        gsap.to('.mc-title-word', {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: 'power3.out',
          stagger: 0.06,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        });
      }

      // Subtitle fade-in.
      gsap.fromTo(
        sectionRef.current.querySelector('.motion-card__subtitle'),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          delay: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top 75%',
            once: true,
          },
        }
      );

      // Bottom description fade-in.
      gsap.fromTo(
        sectionRef.current.querySelector('.motion-card__description'),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: sectionRef.current.querySelector('.motion-card__description'),
            start: 'top 85%',
            once: true,
          },
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 70%',
          toggleActions: 'play none none reverse',
        },
      });

      const topSticker = sectionRef.current.querySelector('.motion-card__sticker--top');
      if (topSticker) {
        gsap.set(topSticker, { scale: 0, opacity: 0, rotation: -30 });
        tl.to(topSticker, { scale: 1, opacity: 1, rotation: 0, duration: 1.7, ease: 'elastic.out(1, 0.4)' }, 0);
      }

      const underlinePath = sectionRef.current.querySelector('.motion-card__underline-path');
      if (underlinePath) {
        const pathLen = underlinePath.getTotalLength();
        gsap.set(underlinePath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
        tl.to(underlinePath, { strokeDashoffset: 0, duration: 1.5, ease: 'power2.out' }, 0.2);
      }
    }, sectionRef);

    return () => {
      cleanups.forEach((fn) => fn());
      ctx.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className="motion-card-section" id="motion-card-section">
      <div className="motion-card__heading">
        <h2 className="motion-card__title" lang="ar" dir="rtl">
          في رسالة، لا ننتظر المستقبل.
          <br />
          ندرّب من سيبنيه.
        </h2>
        <p className="motion-card__subtitle">
          RTC مدينة نصر &mdash; كورسات مجانية، شهادات معتمدة، وظائف حقيقية.
          <span className="motion-card__subtitle-en" lang="en" dir="ltr">
            free courses, certified outcomes, real careers.
          </span>
          <span className="motion-card__sticker motion-card__sticker--top" aria-hidden="true">
            <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80">
              <path d="M48 12c-3-1-6 1-7 4-1-3-4-5-7-4-9 3-15 12-15 22 0 13 22 28 22 28s22-15 22-28c0-10-6-19-15-22z" fill="currentColor" opacity="0.18" />
              <path d="M48 12c-3-1-6 1-7 4-1-3-4-5-7-4-9 3-15 12-15 22 0 13 22 28 22 28s22-15 22-28c0-10-6-19-15-22z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M22 60l4 4M74 60l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </span>
        </p>

        <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 634 28" fill="none" className="motion-card__underline-svg">
          <path className="motion-card__underline-path" d="M2 26C41.0237 23.1556 79.9927 19.9419 118.634 15.5521C169.106 9.98633 227.314 2.42393 275.206 2C280.46 2.57436 264.768 4.99488 262.462 5.55556C257.837 6.43078 252.529 7.47009 247.317 8.59146C239.594 10.3556 212.496 15.8393 226.932 19.8051C239.594 22.6359 263.663 21.9521 280.978 21.3504C314.817 19.9829 349.311 16.7419 383.204 14.7863C465.931 9.5077 549.191 10.547 632 14.1436" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="motion-card__cards-area">
        <div className="motion-card__blob">
          <img src="/assets/MotionCard SVG/motion-card-blob.svg" alt="" className="motion-card__blob-svg" />
        </div>
        <div ref={containerRef} className="motion-card__cards">
          {MOTION_PHOTOS.map((photo, idx) => (
            <div key={photo.slot} className={`motion-card__card motion-card__card--${idx + 1}`}>
              <div className="motion-card__card-image">
                <img
                  src={`/assets/photo-${idx + 1}.png`}
                  alt={photo.alt}
                  className="cover-image"
                  loading="lazy"
                />
              </div>
              <span className="motion-card__badge">
                <span className="motion-card__badge-ar" lang="ar" dir="rtl">{photo.badge_ar}</span>
                <span className="motion-card__badge-en" lang="en" dir="ltr">{photo.badge_en}</span>
              </span>
            </div>
          ))}
        </div>

        <div ref={labelsRef} className="motion-card__floating-labels">
          <div className="motion-card__floating-label motion-card__floating-label--green">
            <p className="motion-card__floating-text">مجاناً لكل شباب مصر</p>
            <p className="motion-card__floating-text-en" lang="en" dir="ltr">Free for every Egyptian youth</p>
          </div>
          <div className="motion-card__floating-label motion-card__floating-label--maroon">
            <p className="motion-card__floating-text">شهادة معتمدة من رسالة</p>
            <p className="motion-card__floating-text-en" lang="en" dir="ltr">Certified by Resala</p>
          </div>
          <div className="motion-card__floating-label motion-card__floating-label--orange">
            <p className="motion-card__floating-text">فتح باب التقديم كل شهر</p>
            <p className="motion-card__floating-text-en" lang="en" dir="ltr">New intake every month</p>
          </div>
        </div>
      </div>

      <div className="motion-card__footer-text">
        <p>Ready to start? Choose your path above — every track is free, certified, and opens every month.</p>
      </div>
    </section>
  );
}
