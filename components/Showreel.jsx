'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { IMPACT_STATS } from '@/lib/data';

gsap.registerPlugin(ScrollTrigger);

const parseStat = (text) => {
  const m = text.match(/^([\d.]+)\s*([KMB%]?)\s*(\+?)$/i);
  if (!m) return { num: 0, suffix: '' };
  return { num: parseFloat(m[1]), suffix: (m[2] || '') + (m[3] || '') };
};

export default function Showreel() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const items = sectionRef.current?.querySelectorAll('.showreel__stat');
      if (!items) return;

      items.forEach((item) => {
        const numEl = item.querySelector('.showreel__stat-value');
        const finalText = numEl?.dataset.value || '';
        const { num: finalNum, suffix } = parseStat(finalText);

        ScrollTrigger.create({
          trigger: item,
          start: 'top 85%',
          once: true,
          onEnter: () => {
            gsap.fromTo(
              item,
              { y: 40, opacity: 0 },
              { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out' }
            );
            const counter = { v: 0 };
            const isInteger = Number.isInteger(finalNum);
            gsap.to(counter, {
              v: finalNum,
              duration: 1.8,
              ease: 'power2.out',
              onUpdate: () => {
                if (numEl) {
                  const display = isInteger
                    ? Math.round(counter.v).toString()
                    : counter.v.toFixed(1);
                  numEl.textContent = display + suffix;
                }
              },
            });
          },
        });
      });

      gsap.fromTo(
        '.showreel__intro-title',
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.showreel__intro',
            start: 'top 80%',
            toggleActions: 'play none none reverse',
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section className="showreel-section" id="showreel-section" ref={sectionRef}>
      <div className="showreel__inner">
        <div className="showreel__intro">
          <span className="showreel__eyebrow" lang="ar" dir="rtl">بالأرقام</span>
          <h2 className="showreel__intro-title" lang="ar" dir="rtl">
            خمسة وعشرون عاماً من العطاء المجاني.
            <span className="showreel__intro-title-en" lang="en" dir="ltr">Measurable. Transparent. Free.</span>
          </h2>
        </div>

        <div className="showreel__stats">
          {IMPACT_STATS.map((stat, i) => (
            <div key={i} className="showreel__stat">
              <div className="showreel__stat-value" data-value={stat.value}>
                0
              </div>
              <div className="showreel__stat-labels">
                <span className="showreel__stat-label-ar" lang="ar" dir="rtl">{stat.label_ar}</span>
                <span className="showreel__stat-label-en" lang="en" dir="ltr">{stat.label_en}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="showreel__footer-line">
          <span className="showreel__footer-mark">RTC NASR CITY</span>
          <span className="showreel__footer-dot" />
          <span className="showreel__footer-tag">Resala Training Center &mdash; Nasr City</span>
        </div>
      </div>
    </section>
  );
}
