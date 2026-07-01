'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ApplyCTA() {
  const sectionRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const section = sectionRef.current;
    if (!section) return;

    // Title word-by-word reveal.
    const titleEl = section.querySelector('.apply-cta h2');
    if (titleEl) {
      const text = titleEl.textContent.trim();
      const words = text.split(/\s+/);
      titleEl.innerHTML = words
        .map((w) => `<span class="cta-title-word" style="display:inline-block;opacity:0;transform:translateY(22px);margin-right:0.2em;">${w}</span>`)
        .join('');
    }

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        toggleActions: 'play none none reverse',
      },
    });

    tl.to('.cta-title-word', {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
      stagger: 0.06,
    })
    .fromTo(
      '.apply-cta p',
      { opacity: 0, y: 14 },
      { opacity: 0.95, y: 0, duration: 0.7, ease: 'power3.out' },
      '-=0.4'
    )
    .fromTo(
      '.apply-cta__btn',
      { opacity: 0, scale: 0.9 },
      { opacity: 1, scale: 1, duration: 0.5, ease: 'back.out(1.7)' },
      '-=0.4'
    );
  }, []);

  return (
    <section className="apply-cta" ref={sectionRef}>
      <div className="apply-cta__content">
        <h2>Your seat is waiting.</h2>
        <p>
          Open intake now. Free. Certified. One month from start to finish.
        </p>
        <div className="apply-cta__actions">
          <a
            href="https://www.facebook.com/RTC.Nasrcity"
            target="_blank"
            rel="noopener noreferrer"
            className="apply-cta__btn"
          >
            Register on Facebook
          </a>
          <a
            href="https://wa.me/201115997937"
            target="_blank"
            rel="noopener noreferrer"
            className="apply-cta__btn apply-cta__btn--secondary"
          >
            Chat with RTC on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
