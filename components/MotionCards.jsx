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

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = document.querySelectorAll(".motion-card__card");
      cards.forEach((card) => {
        let lastX = 0;
        let lastY = 0;
        let speedX = 0;
        let speedY = 0;

        const startRotation = gsap.getProperty(card, "rotation");
        const startX = gsap.getProperty(card, "x");
        const startY = gsap.getProperty(card, "y");

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

        card.addEventListener("mousemove", onMove);
        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
      });

      const labels = document.querySelectorAll(".motion-card__floating-label");
      labels.forEach((label) => {
        let lastX = 0;
        let lastY = 0;
        let speedX = 0;
        let speedY = 0;

        const startRotation = gsap.getProperty(label, "rotation");
        const startX = gsap.getProperty(label, "x");
        const startY = gsap.getProperty(label, "y");

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

        label.addEventListener("mousemove", onMove);
        label.addEventListener("mouseenter", onEnter);
        label.addEventListener("mouseleave", onLeave);
      });

      // Title entrance — word-by-word reveal.
      const titleEl = sectionRef.current.querySelector(".motion-card__title");
      if (titleEl) {
        const titleHTML = titleEl.innerHTML;
        // Replace <br /> with a space-safe token, split on whitespace, rebuild.
        const flat = titleHTML
          .replace(/<br\s*\/?>/gi, ' ')
          .replace(/<[^>]+>/g, '')
          .trim();
        const words = flat.split(/\s+/);
        titleEl.innerHTML = words
          .map((w) => `<span class="mc-title-word" style="display:inline-block;opacity:0;transform:translateY(28px);margin-right:0.3em;">${w}</span>`)
          .join('');
        gsap.to(".mc-title-word", {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.06,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        });
      }

      // Subtitle fade-in.
      gsap.fromTo(
        sectionRef.current.querySelector(".motion-card__subtitle"),
        { opacity: 0, y: 16 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          delay: 0.15,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
            once: true,
          },
        }
      );

      // Bottom description fade-in (delayed so it lands after the cards).
      gsap.fromTo(
        sectionRef.current.querySelector(".motion-card__description"),
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current.querySelector(".motion-card__description"),
            start: "top 85%",
            once: true,
          },
        }
      );

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none reverse"
        }
      });

      const topStickerImg = sectionRef.current.querySelector(".motion-card__sticker--top img");
      if (topStickerImg) {
        gsap.set(topStickerImg, { scale: 0, opacity: 0, rotation: -30 });
        tl.to(topStickerImg, { scale: 1, opacity: 1, rotation: 0, duration: 1.7, ease: "elastic.out(1, 0.4)" }, 0);
      }

      const underlinePath = sectionRef.current.querySelector(".motion-card__underline-path");
      if (underlinePath) {
        const pathLen = underlinePath.getTotalLength();
        gsap.set(underlinePath, { strokeDasharray: pathLen, strokeDashoffset: pathLen });
        tl.to(underlinePath, { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" }, 0.2);
      }
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="motion-card-section"
      id="motion-card-section"
    >
      <div className="motion-card__heading">
        <h2 className="motion-card__title">
          At Resala, we don&rsquo;t wait for the future.<br />
          We train the people who will build it.
        </h2>
        <p className="motion-card__subtitle">
          RTC Nasr City &mdash; free courses, certified outcomes, real careers.
          <span className="motion-card__sticker motion-card__sticker--top">
            <svg viewBox="0 0 96 96" fill="none" xmlns="http://www.w3.org/2000/svg" width="80" height="80" aria-hidden="true">
              <path d="M48 12c-3-1-6 1-7 4-1-3-4-5-7-4-9 3-15 12-15 22 0 13 22 28 22 28s22-15 22-28c0-10-6-19-15-22z" fill="currentColor" opacity="0.18"/>
              <path d="M48 12c-3-1-6 1-7 4-1-3-4-5-7-4-9 3-15 12-15 22 0 13 22 28 22 28s22-15 22-28c0-10-6-19-15-22z" stroke="currentColor" strokeWidth="2.5" strokeLinejoin="round"/>
              <path d="M22 60l4 4M74 60l-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </span>
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 634 28" fill="none" className="motion-card__underline-svg">
          <path className="motion-card__underline-path" d="M2 26C41.0237 23.1556 79.9927 19.9419 118.634 15.5521C169.106 9.98633 227.314 2.42393 275.206 2C280.46 2.57436 264.768 4.99488 262.462 5.55556C257.837 6.43078 252.529 7.47009 247.317 8.59146C239.594 10.3556 212.496 15.8393 226.932 19.8051C239.594 22.6359 263.663 21.9521 280.978 21.3504C314.817 19.9829 349.311 16.7419 383.204 14.7863C465.931 9.5077 549.191 10.547 632 14.1436" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="motion-card__cards-area">
        <div className="motion-card__blob">
          <img
            src="/assets/MotionCard SVG/motion-card-blob.svg"
            alt=""
            className="motion-card__blob-svg"
          />
        </div>
        <div ref={containerRef} className="motion-card__cards">
          {MOTION_PHOTOS.map((photo, idx) => (
            <div key={photo.slot} className={`motion-card__card motion-card__card--${idx + 1}`}>
              <div className="motion-card__card-image">
                <div
                  className="motion-card__card-placeholder"
                  data-slot={photo.slot}
                  aria-label={photo.alt}
                  role="img"
                >
                  <span className="motion-card__card-slot-label">{photo.slot}</span>
                  {/* Editorial SVG placeholder — one per slot.
                      Replaces with <img src="/assets/..."> once
                      real photography is generated. */}
                  {photo.slot === 'photo-1' && (
                    <svg className="motion-card__card-illustration" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      {/* "Always Free" — workshop scene */}
                      <rect width="400" height="300" fill="#1f3a5f" />
                      <rect x="0" y="200" width="400" height="100" fill="#15294a" />
                      {/* window with daylight */}
                      <rect x="40" y="40" width="120" height="100" fill="#f5e6c8" opacity="0.85" />
                      <rect x="40" y="40" width="120" height="100" fill="none" stroke="#0e1c33" strokeWidth="3" />
                      <line x1="100" y1="40" x2="100" y2="140" stroke="#0e1c33" strokeWidth="2" />
                      <line x1="40" y1="90" x2="160" y2="90" stroke="#0e1c33" strokeWidth="2" />
                      {/* workbench */}
                      <rect x="60" y="200" width="280" height="14" fill="#8b5a2b" />
                      <rect x="60" y="214" width="280" height="80" fill="#5a3a1a" opacity="0.6" />
                      {/* electronics */}
                      <rect x="90" y="178" width="60" height="22" fill="#2e8b57" rx="2" />
                      <circle cx="100" cy="189" r="2" fill="#1f3a5f" />
                      <circle cx="115" cy="189" r="2" fill="#1f3a5f" />
                      <circle cx="130" cy="189" r="2" fill="#f5693c" />
                      <rect x="170" y="172" width="80" height="28" fill="#3a3a3a" rx="3" />
                      <rect x="178" y="180" width="64" height="12" fill="#6ec1e4" opacity="0.5" />
                      {/* person silhouette */}
                      <ellipse cx="290" cy="160" rx="22" ry="26" fill="#2c2c2c" />
                      <rect x="275" y="180" width="30" height="40" fill="#2c2c2c" />
                      {/* spark */}
                      <circle cx="260" cy="190" r="3" fill="#f5693c" />
                      <circle cx="350" cy="120" r="2" fill="#c8e6c9" />
                      <circle cx="370" cy="140" r="1.5" fill="#c8e6c9" />
                    </svg>
                  )}
                  {photo.slot === 'photo-2' && (
                    <svg className="motion-card__card-illustration" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      {/* "Certified" — certificate hands */}
                      <rect width="400" height="300" fill="#8e3a52" />
                      <rect width="400" height="300" fill="#3a1820" opacity="0.4" />
                      {/* certificate */}
                      <rect x="80" y="80" width="240" height="160" fill="#fdf8f3" rx="4" />
                      <rect x="80" y="80" width="240" height="34" fill="#1f3a5f" />
                      <rect x="100" y="98" width="60" height="6" fill="#c8e6c9" rx="2" />
                      <rect x="170" y="98" width="100" height="6" fill="#c8e6c9" rx="2" opacity="0.5" />
                      <text x="200" y="138" textAnchor="middle" fill="#1f3a5f" fontFamily="serif" fontSize="14" fontWeight="700" letterSpacing="2">CERTIFICATE</text>
                      <line x1="120" y1="148" x2="280" y2="148" stroke="#8e3a52" strokeWidth="1" />
                      <text x="200" y="170" textAnchor="middle" fill="#2c2c2c" fontFamily="serif" fontSize="11">Resala Training Center</text>
                      <text x="200" y="186" textAnchor="middle" fill="#2c2c2c" fontFamily="serif" fontSize="10" opacity="0.7">Nasr City — Cairo</text>
                      {/* seal */}
                      <circle cx="200" cy="218" r="14" fill="none" stroke="#2e8b57" strokeWidth="2" />
                      <circle cx="200" cy="218" r="10" fill="#2e8b57" opacity="0.2" />
                      <text x="200" y="222" textAnchor="middle" fill="#2e8b57" fontFamily="serif" fontSize="8" fontWeight="700">RTC</text>
                      {/* signature line */}
                      <line x1="230" y1="218" x2="280" y2="218" stroke="#8e3a52" strokeWidth="1" />
                      <text x="255" y="232" textAnchor="middle" fill="#8e3a52" fontFamily="cursive" fontSize="9" fontStyle="italic">signature</text>
                      {/* hands holding */}
                      <ellipse cx="120" cy="250" rx="22" ry="14" fill="#d4a574" />
                      <ellipse cx="280" cy="250" rx="22" ry="14" fill="#c9946a" />
                    </svg>
                  )}
                  {photo.slot === 'photo-3' && (
                    <svg className="motion-card__card-illustration" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      {/* "Monthly Intake" — calendar */}
                      <rect width="400" height="300" fill="#2e8b57" />
                      <rect width="400" height="300" fill="#1a5232" opacity="0.3" />
                      {/* calendar body */}
                      <rect x="80" y="60" width="240" height="200" fill="#fdf8f3" rx="6" />
                      <rect x="80" y="60" width="240" height="40" fill="#1f3a5f" rx="6" />
                      <rect x="80" y="80" width="240" height="20" fill="#1f3a5f" />
                      {/* header text */}
                      <text x="200" y="86" textAnchor="middle" fill="#fdf8f3" fontFamily="sans-serif" fontSize="14" fontWeight="700" letterSpacing="2">JUNE 2026</text>
                      {/* day grid */}
                      {[0, 1, 2, 3, 4, 5].map((col) => (
                        [0, 1, 2, 3].map((row) => {
                          const day = col + row * 7 + 1;
                          if (day > 30) return null;
                          return (
                            <g key={`${col}-${row}`}>
                              <rect x={95 + col * 35} y={110 + row * 35} width="28" height="28" fill="none" stroke="#c8e6c9" strokeWidth="1" />
                              <text x={109 + col * 35} y={128 + row * 35} textAnchor="middle" fill="#2c2c2c" fontFamily="sans-serif" fontSize="10">{day}</text>
                            </g>
                          );
                        })
                      ))}
                      {/* intake highlight — pulse */}
                      <circle cx="262" cy="180" r="14" fill="#f5693c" />
                      <text x="262" y="184" textAnchor="middle" fill="#fdf8f3" fontFamily="sans-serif" fontSize="11" fontWeight="700">15</text>
                      <circle cx="262" cy="180" r="20" fill="none" stroke="#f5693c" strokeWidth="1.5" opacity="0.5" />
                      {/* arrow */}
                      <path d="M 340 100 L 360 80 L 340 60" fill="none" stroke="#f5693c" strokeWidth="2" />
                      <text x="355" y="140" textAnchor="middle" fill="#fdf8f3" fontFamily="sans-serif" fontSize="9" fontWeight="700">INTAKE</text>
                    </svg>
                  )}
                  {photo.slot === 'photo-4' && (
                    <svg className="motion-card__card-illustration" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                      {/* "For All Youth" — group of volunteers */}
                      <rect width="400" height="300" fill="#f5693c" />
                      <rect width="400" height="300" fill="#a83d1c" opacity="0.35" />
                      {/* building wall */}
                      <rect x="0" y="200" width="400" height="100" fill="#a83d1c" />
                      {/* painted sign */}
                      <rect x="40" y="40" width="160" height="50" fill="#fdf8f3" rx="3" />
                      <text x="120" y="62" textAnchor="middle" fill="#1f3a5f" fontFamily="serif" fontSize="13" fontWeight="700">RESALA</text>
                      <text x="120" y="78" textAnchor="middle" fill="#2e8b57" fontFamily="serif" fontSize="9">Training Center</text>
                      {/* 5 volunteer silhouettes */}
                      {[
                        { x: 90, skin: '#d4a574', top: '#1f3a5f' },
                        { x: 150, skin: '#c9946a', top: '#8e3a52' },
                        { x: 210, skin: '#e0b58a', top: '#2e8b57' },
                        { x: 270, skin: '#bf8a5e', top: '#6ec1e4' },
                        { x: 330, skin: '#d4a574', top: '#1f3a5f' },
                      ].map((p, i) => (
                        <g key={i}>
                          <circle cx={p.x} cy="135" r="14" fill={p.skin} />
                          <path d={`M ${p.x - 14} 150 Q ${p.x} 145 ${p.x + 14} 150 L ${p.x + 18} 215 L ${p.x - 18} 215 Z`} fill={p.top} />
                          {/* Resala green leaf badge */}
                          <circle cx={p.x + 6} cy="160" r="2.5" fill="#c8e6c9" />
                        </g>
                      ))}
                      {/* ground line */}
                      <line x1="0" y1="220" x2="400" y2="220" stroke="#7a2a14" strokeWidth="2" />
                      {/* floating dots */}
                      <circle cx="60" cy="120" r="3" fill="#fdf8f3" opacity="0.6" />
                      <circle cx="380" cy="140" r="2" fill="#fdf8f3" opacity="0.6" />
                      <circle cx="340" cy="100" r="2.5" fill="#fdf8f3" opacity="0.6" />
                    </svg>
                  )}
                </div>
              </div>
              <span className="motion-card__badge">{photo.badge_en}</span>
            </div>
          ))}
        </div>

        <div ref={containerRef} className="motion-card__floating-labels">
          <div className="motion-card__floating-label motion-card__floating-label--green">
            <p className="motion-card__floating-text">Free for every Egyptian youth</p>
          </div>
          <div className="motion-card__floating-label motion-card__floating-label--maroon">
            <p className="motion-card__floating-text">Certified by Resala</p>
          </div>
          <div className="motion-card__floating-label motion-card__floating-label--orange">
            <p className="motion-card__floating-text">New intake every month</p>
          </div>
        </div>
      </div>

      <div className="motion-card__footer-text">
        <p className="motion-card__description">
          Since 1999, Resala has trained Egypt&rsquo;s youth for free.
        </p>
      </div>
    </section>
  );
}
