'use client';

import { useEffect } from 'react';
import { gsap } from 'gsap';

export default function CursorBubble() {
  useEffect(() => {
    const cursorBubble = document.querySelector('.cursor-bubble');
    const bubbleText = cursorBubble?.querySelector('.cursor-bubble__text');
    if (!cursorBubble || !bubbleText) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      cursorBubble.style.display = 'none';
      document.documentElement.classList.add('cursor-disabled');
      return;
    }

    const xTo = gsap.quickTo(cursorBubble, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(cursorBubble, 'y', { duration: 0.5, ease: 'power3' });

    let isHoveringClickable = false;
    let bubbleWidth = 0;
    let bubbleHeight = 0;
    gsap.set(cursorBubble, { rotation: -30 });

    const updateBubbleSize = () => {
      bubbleWidth = cursorBubble.offsetWidth || 80;
      bubbleHeight = cursorBubble.offsetHeight || 30;
    };

    const getClampedPos = (clientX, clientY) => {
      updateBubbleSize();
      const x = Math.max(4, Math.min(clientX + 14, window.innerWidth - bubbleWidth - 4));
      const y = Math.max(4, Math.min(clientY - bubbleHeight - 6, window.innerHeight - bubbleHeight - 4));
      return { x, y };
    };

    const showBubble = (text, clientX, clientY) => {
      if (!isHoveringClickable) {
        isHoveringClickable = true;
        bubbleText.textContent = text;
        gsap.killTweensOf(cursorBubble);
        gsap.set(cursorBubble, { opacity: 0, scale: 0, rotation: -30 });
        const { x, y } = getClampedPos(clientX, clientY);
        gsap.to(cursorBubble, { opacity: 1, x, y, scale: 1, rotation: 0, duration: 1.7, delay: 0.1, ease: 'elastic.out(1, 0.4)' });
      }
    };

    const moveBubble = (clientX, clientY) => {
      if (!isHoveringClickable) return;
      const { x, y } = getClampedPos(clientX, clientY);
      xTo(x);
      yTo(y);
    };

    const hideBubble = () => {
      if (isHoveringClickable) {
        isHoveringClickable = false;
        gsap.killTweensOf(cursorBubble);
        gsap.to(cursorBubble, { opacity: 0, scale: 0, rotation: -30, duration: 0.3, ease: 'sine.inOut' });
      }
    };

    const onMouseMove = (e) => {
      moveBubble(e.clientX, e.clientY);
    };

    let hideTimeout = null;
    const onMouseOver = (e) => {
      if (hideTimeout) { clearTimeout(hideTimeout); hideTimeout = null; }
      const found = e.target.closest('[data-cursor]');
      if (found) {
        showBubble(found.dataset.cursor || 'click', e.clientX, e.clientY);
      } else {
        hideBubble();
      }
    };

    const onMouseLeaveWindow = () => {
      hideBubble();
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseleave', onMouseLeaveWindow);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseleave', onMouseLeaveWindow);
      if (hideTimeout) clearTimeout(hideTimeout);
    };
  }, []);

  return <div className="cursor-bubble"><span className="cursor-bubble__text">click</span></div>;
}
