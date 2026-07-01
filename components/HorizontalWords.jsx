'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = 'Education is a right.';
const UNDERLAY = 'Free for every young Egyptian.';
const BOTTOM = 'Free courses. Real careers. Open every month.';

const splitLetters = (text) =>
  text.split('').map((ch, i) => {
    if (ch === ' ') {
      return <span key={i} className="horizontal-words__space">&nbsp;</span>;
    }
    return (
      <span
        key={i}
        className="horizontal-words__letter"
        style={{ opacity: 0 }}
      >
        {ch}
      </span>
    );
  });

const HorizontalWords = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const container = sectionRef.current;
      const textRef = container.querySelector('.horizontal-words__relative');
      const stickers = container.querySelectorAll('.horizontal-words__sticker');
      const arrows = container.querySelectorAll('.horizontal-words__arrow-svg path, .horizontal-words__arrow-end-svg path');

      // Set initial state immediately so text starts off-screen — no flash
      gsap.set(textRef, { x: window.innerWidth });

      // Lock the letters in their natural positions BEFORE any scroll motion.
      // Without this the inline `opacity:0; translateY(20px)` from JSX stays
      // — GSAP reads them on first frame and the letters appear shifted.
      gsap.set(container.querySelectorAll('.horizontal-words__letter'), {
        opacity: 0,
        y: 0,
      });

      const entranceDistance = window.innerHeight;
      const pinnedDistance = 2500;

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
          { x: () => -(textRef.scrollWidth - window.innerWidth * 0.5), ease: 'none', duration: pinnedDistance }
        );

      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: () => `+=${pinnedDistance}`,
        pin: true,
        pinSpacing: true,
        invalidateOnRefresh: true,
      });

      // Char-by-char reveal — fires once when the section first crosses the
      // viewport. We deliberately set the trigger to "top 75%" (a fixed scroll
      // position) rather than the pinned timeline — the pinned scroll moves
      // the container horizontally, so any trigger bound to it would let
      // letters appear mid-flight. Independent trigger = letters reveal in
      // place before the horizontal scroll carries them.
      gsap.fromTo(
        container.querySelectorAll('.horizontal-words__letter'),
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.55,
          ease: 'power3.out',
          stagger: { each: 0.045, from: 'start' },
          scrollTrigger: {
            trigger: container,
            start: 'top 80%',
            once: true,
          },
        }
      );

      gsap.fromTo(
        container.querySelectorAll('.horizontal-words__underlay, .horizontal-words__bottom-text-l'),
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
      <div className="horizontal-words__relative">
        <div className="horizontal-words__sticker-svg">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 386 127" fill="none" className="horizontal-words__arrow-svg">
            <path d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L356.5 105.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2 123C9 35.9999 84.5 17 124 25.9999C217.764 47.3635 207 115 177.5 123C105.777 142.45 110.737 1.99991 232.5 2C310.5 2.00006 366.5 79 376 118L384 97" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

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

          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 140 127" fill="none" className="horizontal-words__arrow-end-svg">
            <path d="M2.03125 2.42188C100.469 2.42188 130.156 52.4219 118.437 125.078L99.6875 107.891" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M2.03125 2.42188C100.469 2.42188 130.156 52.4219 118.438 125.078L137.969 110.234" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>

          {/* Headline — letter-by-letter entrance. aria-label preserves
              semantic meaning for screen readers while the spans give us
              per-character animation hooks. */}
          <h2
            className="display horizontal-words__h2"
            aria-label={HEADLINE}
          >
            {splitLetters(HEADLINE)}
          </h2>

          {/* Subline */}
          <h3 className="horizontal-words__underlay" aria-hidden="true">
            {UNDERLAY}
          </h3>
        </div>
      </div>

      <div className="horizontal-words__bottom-text">
        <div className="horizontal-words__bottom-text-l">
          {BOTTOM}
        </div>
      </div>
    </section>
  );
};

export default HorizontalWords;
