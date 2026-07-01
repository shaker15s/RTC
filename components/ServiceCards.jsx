'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { CARDS_DATA } from '@/lib/data';

export default function ServiceCards() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    gsap.to('.title-underline-svg path', {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power3.out',
      stagger: 0.3,
      scrollTrigger: {
        trigger: '.service-cards-wrapper',
        start: 'top 70%',
        toggleActions: 'play none none reverse',
      },
    });

    // Title entrance — split the heading into words so each word reveals
    // independently. We wrap text nodes in spans once, then animate.
    const titleEl = document.querySelector('.service-cards-wrapper .main-title');
    if (titleEl) {
      const titleText = titleEl.textContent;
      titleEl.innerHTML = titleText
        .split(' ')
        .map((w, i) => `<span class="sc-title-word" style="display:inline-block;opacity:0;transform:translateY(20px);">${w}</span>`)
        .join(' ');
      gsap.to('.sc-title-word', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: '.service-cards-wrapper',
          start: 'top 75%',
          once: true,
        },
      });
    }

    // Subtitle entrance — fade + slide.
    gsap.fromTo(
      '.service-cards-wrapper .main-title__sub',
      { opacity: 0, y: 12 },
      {
        opacity: 0.7,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.2,
        scrollTrigger: {
          trigger: '.service-cards-wrapper',
          start: 'top 75%',
          once: true,
        },
      }
    );

    initCardAnimations();
  }, []);

  return (
    <>
      <div className="title-container">
        <h2 className="main-title">
          Four Tracks at RTC Nasr City
        </h2>
        <p className="main-title__sub">
          pick a path — we&rsquo;ll walk it with you, for free.
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" width="160" viewBox="0 0 159 17" fill="none" className="title-underline-svg">
          <path d="M1 12.1515C53.0771 5.7187 105.529 2.30552 158 1.93652" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M30.2672 15.9461C64.1899 12.8158 98.2663 11.3583 132.33 11.5735" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="cards-wrapper" id="cards-wrapper">
        {CARDS_DATA.map((card) => (
          <div key={card.color} className={`card card-${card.color}`}>
            <div className={`card-sticker sticker-${card.sticker}`}>
              <img
                src={`/assets/Card-Sticker SVG/sticker-${card.sticker}.svg`}
                alt=""
                width="100%"
                loading="lazy"
                aria-hidden="true"
              />
            </div>
            <h3 className="card-title">
              <span className="card-title__en">{card.title}</span>
              <span className="card-title__sub">{card.titleEn}</span>
            </h3>
            <svg width="100%" height="10" className="card-divider-svg" aria-hidden="true">
              <use href="#card-divider" />
            </svg>
            <ul className="card-list">
              {card.services.map((service) => (
                <li key={service} className="card-list__item">
                  <svg xmlns="http://www.w3.org/2000/svg" width="13" height="16" className="services-card__bullet-svg" aria-hidden="true">
                    <use href="#bullet-icon" />
                  </svg>
                  <span className="card-list__service">{service}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  );
}

function initCardAnimations() {
  const cards = gsap.utils.toArray('.card');
  if (!cards.length) return;

  const originalData = [
    { rotation: -2 },  // Computer Science (darkblue) — center card
    { rotation: 4 },   // Engineering (green)
    { rotation: 5 },   // Languages (maroon)
    { rotation: -8 },  // Human Development (orange)
  ];

  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  if (!isMobile) {
    cards.forEach((card, index) => {
      card.addEventListener('mouseenter', () => {
        gsap.to(cards[index], {
          y: -12,
          scale: 1.06,
          rotation: 0,
          duration: 0.5,
          ease: 'power3.out',
          overwrite: true,
        });

        const spreadX = 25;
        cards.forEach((otherCard, otherIndex) => {
          if (otherIndex === index) return;
          const direction = otherIndex < index ? -1 : 1;
          gsap.to(otherCard, {
            x: direction * spreadX,
            y: 0,
            scale: 0.96,
            rotation: originalData[otherIndex].rotation,
            duration: 0.5,
            ease: 'power3.out',
            overwrite: true,
          });
        });
      });

      card.addEventListener('mouseleave', () => {
        cards.forEach((c, i) => {
          gsap.to(c, {
            x: 0,
            y: 0,
            scale: 1,
            rotation: originalData[i].rotation,
            duration: 0.6,
            ease: 'power3.out',
            overwrite: true,
            zIndex: i + 1,
          });
        });
      });
    });
  } else {
    const cardsWrapper = document.querySelector('.cards-wrapper');
    const scrollPerCard = window.innerHeight * 0.8;
    const navH = 60;
    const mobileRotations = [-6, 4, -8, 5];

    cards.forEach((card, i) => {
      gsap.set(card, {
        position: 'absolute',
        left: '50%',
        top: '0',
        xPercent: -50,
        y: i === 0 ? 0 : window.innerHeight * 1.1,
        rotation: mobileRotations[i % mobileRotations.length],
        zIndex: i + 1,
        transformOrigin: 'center center',
      });
    });

    const wrapperH = window.innerHeight * 0.7 + scrollPerCard * (cards.length - 1);
    gsap.set(cardsWrapper, { height: wrapperH });

    ScrollTrigger.create({
      trigger: cardsWrapper,
      start: `top ${navH}px`,
      end: `+=${scrollPerCard * (cards.length - 1)}`,
      pin: true,
      pinSpacing: true,
      id: 'mobile-cards-pin',
    });

    cards.forEach((card, i) => {
      if (i === 0) return;
      gsap.fromTo(
        card,
        { y: window.innerHeight * 1.1, rotation: mobileRotations[i] },
        {
          y: 0,
          rotation: 0,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: cardsWrapper,
            start: `top+=${(i - 1) * scrollPerCard} ${navH}px`,
            end: `top+=${i * scrollPerCard} ${navH}px`,
            scrub: 0.4,
            onLeave: () => gsap.set(card, { y: 0, rotation: 0 }),
          },
        }
      );
    });
  }
}
