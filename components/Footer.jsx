'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SOCIAL_ICONS, WIGGLE_CONFIG, STICKER_LIST } from '@/lib/data';

function initWiggle(element, intensity) {
  const target = element.querySelector('[data-wiggle-target]') || element;
  gsap.set(target, { transformOrigin: 'center center' });
  let tween;
  const onEnter = () => { tween = gsap.to(target, { rotation: intensity, duration: 0.17, repeat: -1, yoyo: true, ease: 'steps(1)' }); };
  const onLeave = () => { if (tween) { tween.kill(); gsap.to(target, { rotation: 0, duration: 0.3, ease: 'power2.out' }); } };
  element.addEventListener('mouseenter', onEnter);
  element.addEventListener('mouseleave', onLeave);
  return () => { element.removeEventListener('mouseenter', onEnter); element.removeEventListener('mouseleave', onLeave); };
}

export default function Footer() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Footer text entrance — staggered fade-up per column.
    gsap.fromTo(
      '.footer-column h3',
      { opacity: 0, y: 18 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: '.main-footer',
          start: 'top 85%',
          once: true,
        },
      }
    );

    gsap.fromTo(
      '.footer-column address, .footer-badge',
      { opacity: 0, y: 12 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.main-footer',
          start: 'top 85%',
          once: true,
        },
      }
    );

    gsap.fromTo(
      '.footer-email, .footer-whatsapp, .footer-map-link',
      { opacity: 0, y: 10 },
      {
        opacity: 1,
        y: 0,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.06,
        scrollTrigger: {
          trigger: '.main-footer',
          start: 'top 80%',
          once: true,
        },
      }
    );

    gsap.fromTo(
      '.single-social',
      { opacity: 0, scale: 0.85 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.7)',
        stagger: 0.06,
        scrollTrigger: {
          trigger: '.footer-socials',
          start: 'top 85%',
          once: true,
        },
      }
    );

    const footerMapLink = document.querySelector('.footer-map-link');
    if (footerMapLink) {
      const mapSvgPaths = footerMapLink.querySelectorAll('.draw-btn__svg path');
      mapSvgPaths.forEach(path => {
        const length = path.getTotalLength();
        gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
      });
      const onEnter = () => gsap.fromTo(mapSvgPaths, { strokeDashoffset: (i, el) => el.getTotalLength() }, { strokeDashoffset: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1, overwrite: true });
      const onLeave = () => gsap.to(mapSvgPaths, { strokeDashoffset: 0, duration: 0.4, ease: 'power2.out', overwrite: true });
      footerMapLink.addEventListener('mouseenter', onEnter);
      footerMapLink.addEventListener('mouseleave', onLeave);
    }

    const creditsWrapper = document.querySelector('.footer-credits-wrapper');
    if (creditsWrapper) {
      const creditsBox = creditsWrapper.querySelector('.credits-box');
      const creditsItems = creditsBox.querySelectorAll('.credits-item');

      gsap.set(creditsBox, { visibility: 'visible', width: 'auto', height: 'auto', opacity: 1 });
      const boxRect = creditsBox.getBoundingClientRect();
      const fullWidth = boxRect.width;
      const fullHeight = boxRect.height;
      const boxHeight = boxRect.height;

      const creditsBtn = creditsWrapper.querySelector('.footer-credits');
      const startY = creditsBtn.offsetHeight + 15;

      gsap.set(creditsBox, { visibility: 'hidden', width: 0, height: 0, opacity: 0, y: startY });
      gsap.set(creditsItems, { y: boxHeight });

      const onEnter = () => {
        gsap.set(creditsBox, { visibility: 'visible' });
        gsap.killTweensOf(creditsBox);
        gsap.killTweensOf(creditsItems);
        gsap.to(creditsBox, { width: fullWidth, height: fullHeight, opacity: 1, y: 0, duration: 0.45, ease: 'power3.out' });
        gsap.to(creditsItems, { y: 0, duration: 0.5, stagger: 0.04, ease: 'power3.out', delay: 0.1 });
      };

      const onLeave = () => {
        gsap.killTweensOf(creditsBox);
        gsap.killTweensOf(creditsItems);
        gsap.to(creditsBox, { width: 0, height: 0, opacity: 0, y: startY, duration: 0.35, ease: 'power3.in', onComplete: () => gsap.set(creditsBox, { visibility: 'hidden' }) });
        gsap.to(creditsItems, { y: boxHeight, duration: 0.4, ease: 'power3.in', stagger: -0.03, delay: 0.1 });
      };

      creditsWrapper.addEventListener('mouseenter', onEnter);
      creditsWrapper.addEventListener('mouseleave', onLeave);
    }

    const footerStickers = gsap.utils.toArray('.footer-sticker');
    const stickerRotations = [12, -10, 8, -12, 10, -8];
    gsap.set(footerStickers, { scale: 0, opacity: 0, transformOrigin: 'center bottom' });
    footerStickers.forEach((sticker, i) => gsap.set(sticker, { rotation: stickerRotations[i % stickerRotations.length] }));

    gsap.to(footerStickers, {
      scale: 1,
      opacity: 1,
      rotation: (i) => stickerRotations[i % stickerRotations.length] * 0.7,
      duration: 0.7,
      ease: 'back.out(1.7)',
      stagger: 0.12,
      scrollTrigger: { trigger: '.footer-stickers', start: 'top 80%', toggleActions: 'play none none reverse' }
    });

    footerStickers.forEach((sticker, i) => {
      const baseRotation = stickerRotations[i % stickerRotations.length] * 0.7;
      const PROXIMITY_RADIUS = 180, STRENGTH = 4, MAX_PUSH = 55, MIN_SPEED = 3;
      let prevX = 0, prevY = 0;
      const clamp = (v, max) => Math.max(-max, Math.min(max, v));

      const onMove = (e) => {
        const dx = e.clientX - prevX, dy = e.clientY - prevY;
        prevX = e.clientX; prevY = e.clientY;
        const rect = sticker.getBoundingClientRect();
        const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
        const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
        const onSticker = e.clientX >= rect.left && e.clientX <= rect.right && e.clientY >= rect.top && e.clientY <= rect.bottom;
        const speed = Math.hypot(dx, dy);
        const isOverCreditsBox = e.target.closest('.credits-box') !== null;

        if (!onSticker && !isOverCreditsBox && dist < PROXIMITY_RADIUS && speed > MIN_SPEED) {
          const falloff = 1 - (dist / PROXIMITY_RADIUS);
          const pushX = clamp(dx * STRENGTH * falloff, MAX_PUSH);
          const pushY = clamp(dy * STRENGTH * falloff, MAX_PUSH);
          gsap.killTweensOf(sticker);
          gsap.to(sticker, { x: pushX, y: pushY, rotation: baseRotation + pushX * 0.25, duration: 0.18, ease: 'power3.out' });
          gsap.to(sticker, { x: 0, y: 0, rotation: baseRotation, duration: 1.1, ease: 'elastic.out(1, 0.35)', delay: 0.18 });
        }
      };
      document.addEventListener('mousemove', onMove);
    });

    const wiggleTargets = [
      { selector: '.footer-column:first-child h3', key: 'jobHeading' },
      { selector: '.footer-map-link span', key: 'googleMap' },
      { selector: '.footer-email', key: 'email' },
      { selector: '.footer-whatsapp', key: 'whatsapp' },
      { selector: '.credits-name', key: 'socials' },
    ];
    wiggleTargets.forEach(({ selector, key }) => {
      document.querySelectorAll(selector).forEach(el => initWiggle(el, WIGGLE_CONFIG[key]));
    });

    document.querySelectorAll('.single-social').forEach(el => initWiggle(el, WIGGLE_CONFIG.socials));

  }, []);

  return (
    <div className="footer-inner">
      <div className="footer-top">
        <div className="footer-column">
          <span className="footer-badge">About the Center</span>
          <h3>Resala Training Center<br />Nasr City</h3>
          <address>
            Nasr City, Cairo<br />
            Abu Bakr Al-Siddiq, off Makram Ebeid Street
          </address>
          <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="footer-map-link">
            <span>Find us on Google Maps</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 169 10" fill="none" className="draw-btn__svg">
              <path d="M1 6.5661C56.3941 3.06082 112.187 1.20095 168 0.999878" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
              <path d="M32.1313 8.63371C68.2147 6.92799 104.462 6.13378 140.695 6.25107" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
            </svg>
          </a>
        </div>

        <div className="footer-column">
          <span className="footer-badge">Our Tracks</span>
          <h3>What we teach, free</h3>
          <a href="https://www.facebook.com/RTC.Nasrcity" target="_blank" rel="noopener noreferrer" className="footer-email" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            Engineering & PLC
          </a>
          <a href="https://www.facebook.com/RTC.Nasrcity" target="_blank" rel="noopener noreferrer" className="footer-email" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            Computer Science & Web
          </a>
          <a href="https://www.facebook.com/RTC.Nasrcity" target="_blank" rel="noopener noreferrer" className="footer-email" style={{ fontSize: '1.4rem', fontWeight: 700 }}>
            Languages & Soft Skills
          </a>
          <p className="footer-note" style={{ marginTop: '10px' }}>
            Free. Certified. Every month.
          </p>
        </div>

        <div className="footer-column">
          <span className="footer-badge">Get In Touch</span>
          <a href="https://www.facebook.com/RTC.Nasrcity" target="_blank" rel="noopener noreferrer" className="footer-email">
            Register via Facebook
          </a>
          <a href="https://wa.me/201115997937" target="_blank" rel="noopener noreferrer" className="footer-whatsapp">
            Chat with RTC on WhatsApp
          </a>
          <p className="footer-note">
            Hotline <strong style={{ color: 'var(--color-green)' }}>19450</strong> &mdash; registration open every month.
          </p>
          <div className="footer-socials" id="footer-socials">
            {SOCIAL_ICONS.map(({ href, label, svg }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="single-social w-inline-block"
                aria-label={label}
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-big-text">
          <svg xmlns="http://www.w3.org/2000/svg" width="100%" viewBox="0 0 500 120" fill="none" className="footer-logo__svg">
            <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle"
              fontFamily="'Epilogue', Arial, sans-serif" fontWeight="900" fontSize="72" fill="currentColor" letterSpacing="-2">
              RTC
            </text>
            <text x="50%" y="78" dominantBaseline="central" textAnchor="middle"
              fontFamily="'Epilogue', Arial, sans-serif" fontWeight="700" fontSize="22" fill="currentColor" opacity="0.8">
              Resala Training Center — Nasr City
            </text>
          </svg>
        </div>

        <div className="footer-stickers">
          {STICKER_LIST.map(({ key, file }, i) => (
            <div key={key} className={`footer-sticker sticker-${key}`}>
              <img src={file} width="100%" alt="" data-scroll-animation-target="" aria-hidden="true" />
            </div>
          ))}
        </div>

        <div className="footer-bottom-row">
          <div></div>
          <div className="footer-credits-wrapper">
            <div className="credits-box">
              <div className="credits-content">
                <div className="credits-item credit-wiggle">
                  <div className="overflow-wrapper"><span className="credits-label">design by</span></div>
                  <div className="overflow-wrapper"><a href="#" className="credits-name" data-wiggle-target="true">Jordan</a></div>
                </div>
                <div className="credits-item credit-wiggle">
                  <div className="overflow-wrapper"><span className="credits-label">code by</span></div>
                  <div className="overflow-wrapper"><a href="#" className="credits-name" data-wiggle-target="true">Dennis</a></div>
                </div>
              </div>
            </div>
            <a href="#" className="footer-credits">credits</a>
          </div>
        </div>
      </div>
    </div>
  );
}
