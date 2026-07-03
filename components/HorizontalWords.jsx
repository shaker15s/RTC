'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = 'التعليم حق للجميع.';
const HEADLINE_EN = 'Education is a right for all.';
const UNDERLAY = 'مجاناً لكل شاب مصري.';
const UNDERLAY_EN = 'Free for every young Egyptian.';
const BOTTOM = 'كورسات مجانية. وظائف حقيقية. مفتوح كل شهر.';
const BOTTOM_EN = 'Free courses. Real careers. Open every month.';

const splitLetters = (text) =>
  text.split('').map((ch, i) => {
    if (ch === ' ') return <span key={i} className="horizontal-words__space" aria-hidden="true">&nbsp;</span>;
    return <span key={i} className="horizontal-words__letter" lang="en">{ch}</span>;
  });

const splitWords = (text) =>
  text.split(/\s+/).map((word, i, arr) => (
    <span key={i} className="horizontal-words__word-wrapper">
      <span className="horizontal-words__word" lang="ar">{word}</span>
      {i < arr.length - 1 ? <span className="horizontal-words__space" aria-hidden="true">&nbsp;</span> : null}
    </span>
  ));

const HorizontalWords = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const isMobile = window.matchMedia('(max-width: 768px)').matches;

    const ctx = gsap.context(() => {
      const container = sectionRef.current;

      // ── MOBILE: impressive staggered word reveal, no horizontal scroll ──
      if (isMobile) {
        // Arabic words: each word springs up from below with bounce
        const words = container.querySelectorAll('.horizontal-words__word');
        gsap.fromTo(
          words,
          { opacity: 0, y: 80, rotation: () => (Math.random() - 0.5) * 20, scale: 0.6 },
          {
            opacity: 1, y: 0, rotation: 0, scale: 1,
            duration: 0.9,
            ease: 'elastic.out(1, 0.5)',
            stagger: { each: 0.12, from: 'start' },
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // English letters: fly in from random vertical offsets
        const letters = container.querySelectorAll('.horizontal-words__letter');
        gsap.fromTo(
          letters,
          {
            opacity: 0,
            y: () => (Math.random() - 0.5) * 80,
            rotation: () => (Math.random() - 0.5) * 30,
          },
          {
            opacity: 1, y: 0, rotation: 0,
            duration: 0.7,
            ease: 'back.out(1.4)',
            stagger: { each: 0.03, from: 'start' },
            delay: 0.5,
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              once: true,
            },
          }
        );

        // Underlay + bottom text fade in after headline
        gsap.fromTo(
          container.querySelectorAll(
            '.horizontal-words__underlay, .horizontal-words__underlay-en, .horizontal-words__bottom-text-l, .horizontal-words__bottom-text-en'
          ),
          { opacity: 0, y: 20 },
          {
            opacity: 1, y: 0,
            duration: 0.7, ease: 'power3.out',
            stagger: 0.1,
            delay: 1.2,
            scrollTrigger: {
              trigger: container,
              start: 'top 80%',
              once: true,
            },
          }
        );
        return; // Exit — no desktop animations on mobile
      }


      // ── DESKTOP: full horizontal scroll with pin ──
      const textRef = container.querySelector('.horizontal-words__content-wrapper');

      // Start off-screen (right side)
      gsap.set(textRef, { x: window.innerWidth });

      const entranceDistance = window.innerHeight;
      const pinnedDistance = 2500;

      // Main scroll-driven horizontal scroll
      const scrollTween = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top bottom',
          end: () => `+=${entranceDistance + pinnedDistance}`,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

      scrollTween
        .fromTo(
          textRef,
          { x: window.innerWidth },
          { x: window.innerWidth * 0.5, ease: 'none', duration: entranceDistance }
        )
        .to(
          textRef,
          {
            x: () => -(textRef.scrollWidth - window.innerWidth * 0.5),
            ease: 'none',
            duration: pinnedDistance,
          }
        )
        .fromTo(
          container.querySelectorAll('.horizontal-words__underlay, .horizontal-words__underlay-en'),
          { opacity: 0, y: 20 },
          { opacity: 0.75, y: 0, duration: pinnedDistance * 0.5, ease: 'power1.out' },
          entranceDistance + pinnedDistance * 0.2
        );

      // Pin the section
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${pinnedDistance}`,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
      });

      // ── Arabic word reveal ──
      const words = container.querySelectorAll('.horizontal-words__word');
      words.forEach((word) => {
        gsap.fromTo(
          word,
          { opacity: 0, yPercent: (Math.random() - 0.5) * 400, rotation: (Math.random() - 0.5) * 40 },
          {
            opacity: 1,
            yPercent: 0,
            rotation: 0,
            ease: 'elastic.out(1.2, 1)',
            scrollTrigger: {
              trigger: word,
              containerAnimation: scrollTween,
              start: 'left 90%',
              end: 'left 50%',
              scrub: 0.5,
            },
          }
        );
      });

      // ── English letter reveal ──
      const letters = container.querySelectorAll('.horizontal-words__letter');
      letters.forEach((letter) => {
        gsap.fromTo(
          letter,
          { opacity: 0, yPercent: (Math.random() - 0.5) * 500, rotation: (Math.random() - 0.5) * 60 },
          {
            opacity: 1,
            yPercent: 0,
            rotation: 0,
            ease: 'elastic.out(1.2, 1)',
            scrollTrigger: {
              trigger: letter,
              containerAnimation: scrollTween,
              start: 'left 90%',
              end: 'left 50%',
              scrub: 0.5,
            },
          }
        );
      });

      // ── Static text fade-in ──
      gsap.fromTo(
        container.querySelectorAll(
          '.horizontal-words__bottom-text-l, .horizontal-words__headline-en, .horizontal-words__bottom-text-en'
        ),
        { opacity: 0, y: 14 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.08,
          scrollTrigger: {
            trigger: container,
            start: 'top 60%',
            once: true,
          },
        }
      );

      // ── Stickers pop-in ──
      const stickers = container.querySelectorAll('.horizontal-words__sticker');
      stickers.forEach((sticker) => {
        gsap.from(sticker, {
          scale: 0,
          y: -30,
          rotation: (Math.random() - 0.5) * 15,
          ease: 'back.out(1.4)',
          scrollTrigger: {
            trigger: sticker,
            containerAnimation: scrollTween,
            start: 'left 90%',
            end: 'left 40%',
            scrub: 0.5,
          },
        });
      });

      // ── Arrow draw animation ──
      const arrows = container.querySelectorAll('.horizontal-words__arrow-svg path, .horizontal-words__arrow-end-svg path');
      arrows.forEach((arrowPath) => {
        if (arrowPath.getTotalLength) {
          const pathLen = arrowPath.getTotalLength();
          gsap.set(arrowPath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
          gsap.to(arrowPath, {
            strokeDashoffset: 0,
            duration: 1,
            scrollTrigger: {
              trigger: arrowPath.parentElement,
              containerAnimation: scrollTween,
              start: 'left 90%',
              end: 'left 40%',
              scrub: 0.5,
            },
          });
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);


  return (
    <section ref={sectionRef} className="horizontal-words-section content-section">
      <div className="horizontal-words__content-wrapper">

        {/* ═══ ARROWS — first in flex flow, above the text ═══ */}
        {/* Main curved arrow — sits above the headline */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="100%"
          viewBox="0 0 386 127"
          fill="none"
          className="horizontal-words__arrow-svg"
          aria-hidden="true"
        >
          <path
            d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L356.5 105.5"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L384 97"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* ═══ STICKER LAYER — decorative only, absolutely positioned overlay ═══ */}
        <div className="horizontal-words__sticker-svg">
          <span className="horizontal-words__sticker horizontal-words__sticker-watch" aria-hidden="true">
            <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <path d="M5 38l43-22 43 22-43 22z" fill="currentColor" opacity="0.15" />
              <path d="M5 38l43-22 43 22-43 22L5 38z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
              <path d="M16 45v18c0 6 14 12 32 12s32-6 32-12V45" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
              <path d="M82 38v22" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
              <circle cx="82" cy="64" r="4" fill="currentColor" />
              <path d="M40 16c2-3 5-3 8 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M48 8c2-3 5-3 8 0" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
          </span>

          <span className="horizontal-words__sticker horizontal-words__sticker-cursor" aria-hidden="true">
            <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <path d="M8 22c12-4 26-4 40 4v50c-14-8-28-8-40-4V22z" fill="currentColor" opacity="0.15" />
              <path d="M8 22c12-4 26-4 40 4v50c-14-8-28-8-40-4V22z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
              <path d="M88 22c-12-4-26-4-40 4v50c14-8 28-8 40-4V22z" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
              <path d="M48 26v50" stroke="currentColor" strokeWidth="2" />
              <path d="M16 36l16 2M16 46l16 2M64 36l16 2M64 46l16 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
            </svg>
          </span>

          <span className="horizontal-words__sticker horizontal-words__sticker-phone" aria-hidden="true">
            <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
              <circle cx="48" cy="36" r="28" fill="currentColor" opacity="0.12" />
              <circle cx="48" cy="36" r="28" stroke="currentColor" strokeWidth="3" />
              <path d="M48 22l4 10 11 1-8 7 2 11-9-5-9 5 2-11-8-7 11-1 4-10z" fill="currentColor" />
              <path d="M36 60l-8 28 20-12 20 12-8-28" stroke="currentColor" strokeWidth="3" strokeLinejoin="round" />
            </svg>
          </span>
        </div>

        {/* ═══ TEXT CONTENT ═══ */}
        {/* Arabic headline — word-level split for scroll animation */}
        <h2
          className="display horizontal-words__h2"
          lang="ar"
          dir="ltr"
          aria-label={HEADLINE}
        >
          {splitWords(HEADLINE)}
        </h2>

        {/* English headline — letter-level split */}
        <h3 className="horizontal-words__headline-en" lang="en" dir="ltr" aria-label={HEADLINE_EN}>
          {splitLetters(HEADLINE_EN)}
        </h3>

        {/* Arabic underlay */}
        <h3 className="horizontal-words__underlay" lang="ar" dir="ltr">
          {UNDERLAY}
        </h3>

        {/* English underlay */}
        <p className="horizontal-words__underlay-en" lang="en" dir="ltr">
          {UNDERLAY_EN}
        </p>

        {/* End arrow — sits inline, after the text */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="5em"
          viewBox="0 0 140 127"
          fill="none"
          className="horizontal-words__arrow-end-svg"
          aria-hidden="true"
        >
          <path d="M2.03 2.42C100.47 2.42 130.16 52.42 118.44 125.08L99.69 107.89" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M2.03 2.42C100.47 2.42 130.16 52.42 118.44 125.08L137.97 110.23" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Bottom text — fixed at section footer, outside the scroll */}
      <div className="horizontal-words__bottom-text">
        <div className="horizontal-words__bottom-text-l" lang="ar" dir="rtl">
          {BOTTOM}
        </div>
        <div className="horizontal-words__bottom-text-en" lang="en" dir="ltr">
          {BOTTOM_EN}
        </div>
      </div>
    </section>
  );
};

export default HorizontalWords;
