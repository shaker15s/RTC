'use client';

import { useEffect } from 'react';
import Lenis from 'lenis';

export default function SmoothScroll() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      touchMultiplier: 1.5,
    });

    window.__lenis = lenis;

    let rafId;
    function raf(time) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    const originalTitle = document.title;
    const handleVisibility = () => {
      document.title = document.hidden
        ? 'Hey, over here! — RTC Nasr City'
        : originalTitle;
    };
    document.addEventListener('visibilitychange', handleVisibility);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      if (window.__lenis === lenis) window.__lenis = undefined;
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return null;
}
