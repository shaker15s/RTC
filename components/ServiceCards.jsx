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

    const titleEl = document.querySelector('.service-cards-wrapper .main-title');
    if (titleEl) {
      const titleText = titleEl.textContent;
      titleEl.innerHTML = titleText
        .split(' ')
        .map((w, i) => `<span class="sc-title-word" style="display:inline-block;opacity:0;transform:translateY(20px)">${w}</span>`)
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

    const cleanup = initCardAnimations();
    return () => {
      ScrollTrigger.getAll().forEach((t) => {
        if (t.vars.trigger === '.service-cards-wrapper' || t.vars.trigger === '.cards-wrapper' || t.id === 'mobile-cards-pin') {
          t.kill();
        }
      });
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <>
      <div className="title-container" id="service-cards" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 className="main-title" lang="ar" dir="rtl" style={{ fontWeight: 800, fontSize: '3rem', margin: 0 }}>
          أربع مسارات في RTC مدينة نصر
        </h2>
        <p className="main-title__sub" style={{ marginTop: '8px', fontSize: '1.2rem', opacity: 0.7 }}>
          اختر مسارك — هنمشي فيه معاك، مجاناً.
          <span className="main-title__sub-en" lang="en" dir="ltr" style={{ display: 'block', fontSize: '0.9rem', opacity: 0.55, fontStyle: 'italic' }}>
            pick a path — we&rsquo;ll walk it with you, for free.
          </span>
        </p>
        <svg xmlns="http://www.w3.org/2000/svg" width="160" viewBox="0 0 159 17" fill="none" className="title-underline-svg" style={{ margin: '12px auto 0', display: 'block' }}>
          <path d="M1 12.1515C53.0771 5.7187 105.529 2.30552 158 1.93652" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M30.2672 15.9461C64.1899 12.8158 98.2663 11.3583 132.33 11.5735" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      <div className="cards-wrapper" id="cards-wrapper">
        {CARDS_DATA.map((card) => (
          <div key={card.color} className={`card card-${card.color}`}>
            {/* pointer-events:none on children so card hover doesn't flicker */}
            <div className={`card-sticker sticker-${card.sticker}`} style={{ pointerEvents: 'none' }}>
              <img
                src={`/assets/Card-Sticker SVG/sticker-${card.sticker}.svg`}
                alt=""
                width="100%"
                loading="lazy"
                aria-hidden="true"
              />
            </div>
            <h3 className="card-title" style={{ pointerEvents: 'none' }}>
              <span className="card-title__ar" lang="ar" dir="rtl">{card.title}</span>
              <span className="card-title__en" lang="en" dir="ltr">{card.titleEn}</span>
            </h3>
            <svg width="100%" height="10" className="card-divider-svg" aria-hidden="true">
              <use href="#card-divider" />
            </svg>
            <ul className="card-list" style={{ pointerEvents: 'none' }}>
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
    { rotation: -2 },
    { rotation: 4 },
    { rotation: 5 },
    { rotation: -8 },
  ];

  const mql = window.matchMedia('(max-width: 768px)');
  let isMobile = mql.matches;
  const mobileTriggers = [];
  let leaveTimeout = null;
  let activeIndex = -1;

  /* ── kill mobile — nuke ALL inline styles, let CSS take over ── */
  const killMobile = () => {
    mobileTriggers.forEach((t) => t.kill());
    mobileTriggers.length = 0;
    cards.forEach((card) => {
      card.removeAttribute('style');
      card.style.overflow = 'visible';
    });
  };

  /* ── reset all cards to their CSS positions ── */
  const resetAllToCss = () => {
    cards.forEach((c) => {
      c.removeAttribute('style');
      c.style.overflow = 'visible';
    });
  };

  /* ── desktop: per-card mouseenter → fan-out ── */
  const buildDesktop = () => {
    resetAllToCss();

    const cardWidth = 320;
    const hoverGap = 120;
    const clusterGap = 150;
    const viewportPad = 40;

    cards.forEach((card, index) => {
      const onEnter = () => {
        if (leaveTimeout) { clearTimeout(leaveTimeout); leaveTimeout = null; }
        if (activeIndex === index) return;
        activeIndex = index;

        // reset everyone except hovered
        cards.forEach((c, i) => {
          if (i === index) return;
          gsap.to(c, {
            x: 0, y: 0, scale: 1,
            rotation: originalData[i]?.rotation ?? 0,
            duration: 1.3, ease: 'elastic.out(1, 0.7)',
            overwrite: true, zIndex: i + 1,
          });
        });

        const hoveredLeft = card.offsetLeft;
        const moveY = 50 - card.offsetTop;

        gsap.to(card, {
          x: 0, y: moveY, rotation: 0, scale: 1.08,
          duration: 1.2, ease: 'elastic.out(1, 0.7)',
          overwrite: true, zIndex: 100,
        });

        // fan right cards rightward
        const rightIndices = cards.map((_, i) => i).filter(i => i > index);
        if (rightIndices.length) {
          const clusterStart = hoveredLeft + cardWidth + hoverGap;
          rightIndices.forEach((ri, i) => {
            let targetX = clusterStart + i * clusterGap - cards[ri].offsetLeft;
            if (cards[ri].offsetLeft + targetX + cardWidth > window.innerWidth - viewportPad) {
              targetX = window.innerWidth - viewportPad - cards[ri].offsetLeft - cardWidth;
            }
            const rad = (originalData[ri]?.rotation ?? 0) * (Math.PI / 180);
            gsap.to(cards[ri], {
              x: targetX, y: targetX * Math.tan(rad),
              rotation: originalData[ri]?.rotation ?? 0,
              scale: 1, duration: 1.3,
              ease: 'elastic.out(1, 0.7)', overwrite: true,
              zIndex: ri + 1,
            });
          });
        }

        // fan left cards leftward
        const leftIndices = cards.map((_, i) => i).filter(i => i < index).reverse();
        if (leftIndices.length) {
          const clusterStart = hoveredLeft - hoverGap - cardWidth;
          leftIndices.forEach((li, i) => {
            let targetX = clusterStart - i * clusterGap - cards[li].offsetLeft;
            if (cards[li].offsetLeft + targetX < viewportPad) {
              targetX = viewportPad - cards[li].offsetLeft;
            }
            const rad = (originalData[li]?.rotation ?? 0) * (Math.PI / 180);
            gsap.to(cards[li], {
              x: targetX, y: targetX * Math.tan(rad),
              rotation: originalData[li]?.rotation ?? 0,
              scale: 1, duration: 1.3,
              ease: 'elastic.out(1, 0.7)', overwrite: true,
              zIndex: li + 1,
            });
          });
        }
      };

      const onLeave = () => {
        activeIndex = -1;
        leaveTimeout = setTimeout(() => {
          if (activeIndex !== -1) return; // re-entered before timeout
          cards.forEach((c, i) => {
            gsap.to(c, {
              x: 0, y: 0, scale: 1,
              rotation: originalData[i]?.rotation ?? 0,
              duration: 1.4, ease: 'elastic.out(1, 0.7)',
              overwrite: true, zIndex: i + 1,
            });
          });
        }, 80);
      };

      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
    });
  };

  /* ── mobile: stack cards + scroll-pin ── */
  const buildMobile = () => {
    const cardsWrapper = document.querySelector('.cards-wrapper');
    if (!cardsWrapper) return;

    // Reset all cards to natural flow — CSS handles width/layout
    cards.forEach((card, i) => {
      gsap.set(card, {
        clearProps: 'all',
      });
    });

    // Simple staggered reveal animation per card
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        { opacity: 0, y: 60, rotation: i % 2 === 0 ? -4 : 4 },
        {
          opacity: 1,
          y: 0,
          rotation: 0,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 88%',
            once: true,
          },
        }
      );
    });
  };


  /* ── apply mode ── */
  const apply = () => {
    // remove all card event listeners
    cards.forEach((card) => {
      const clone = card.cloneNode(true);
      card.parentNode.replaceChild(clone, card);
    });
    // re-query cards after clone
    const freshCards = gsap.utils.toArray('.card');
    cards.length = 0;
    Array.prototype.push.apply(cards, freshCards);

    killMobile();
    resetAllToCss();

    if (isMobile) {
      buildMobile();
    } else {
      buildDesktop();
    }
  };

  apply();

  const onMqChange = (e) => {
    isMobile = e.matches;
    apply();
  };

  if (mql.addEventListener) mql.addEventListener('change', onMqChange);
  else mql.addListener(onMqChange);

  return () => {
    if (leaveTimeout) clearTimeout(leaveTimeout);
    killMobile();
    cards.forEach((card) => {
      card.replaceWith(card.cloneNode(true));
    });
  };
}