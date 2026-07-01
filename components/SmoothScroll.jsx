'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function SmoothScroll() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    };

    // Placeholder — Lenis instantiation removed for now
    gsap.ticker.add((time) => { /* lenis.raf(time * 1000) */ });
    gsap.ticker.lagSmoothing(0);

    const originalTitle = document.title;
    const handleVisibility = () => {
      document.title = document.hidden ? "Hey, over here! — RTC Nasr City" : originalTitle;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return null;
}
