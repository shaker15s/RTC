# 🧪 برومبت الفحص الشامل لمشروع RTC Nasr City

انسخ البرومبت اللي تحت بالكامل وحطه في Claude أو أي نموذج ذكاء اصطناعي قوي، وهو هيمشي على كل نقطة نقطة ويديك تقرير كامل.

---

## 📋 البرومبت

```
أنت الآن كبير مهندسي ضمان الجودة (Senior QA Architect). مهمتك: فحص موقع "مركز تدريب مدينة نصر — رسالة" 
فحصاً شاملاً على سطح المكتب (Desktop) والهاتف المحمول (Mobile) والتأكد أن كل شيء يعمل بأقصى طاقته 
وبالدقة المليمترية.

المشروع مبني على:
- Next.js 15.2.8 (App Router)
- React 19
- GSAP 3.12.5 (للرسوم المتحركة)
- Lenis 1.1.14 (للسكرول السلس)
- خط Tajawal (عربي) + Epilogue (إنجليزي)
- الاتجاه: RTL (من اليمين لليسار)

---

## 🔴 المرحلة الأولى: فحص الميتاداتا والـ SEO

1. شوف metadata في `app/layout.jsx` وتأكد من:
   - canonical URL مضبوط على https://rtc.shaker15s.com
   - Open Graph كامل: title, description, image, locale=ar_EG
   - Twitter Card موجود كـ summary_large_image
   - robots: index + follow
   - themeColor موجود
   - viewport: width=device-width, initialScale=1
   - favicon موجود في /assets/Navbar SVG/logo-rtc.svg

2. تأكد إن metadataBase شغال ومش هايسبب مشاكل في الـ canonical URLs

3. تأكد إن الـ keywords فيها كلمات عربي وإنجليزي ومتنوعة

---

## 🟠 المرحلة الثانية: فحص الـ Performance

4. روح على `app/layout.jsx` وتأكد:
   - fonts محملة من Google Fonts بـ preconnect صحيح
   - مفيش render-blocking resources
   - suppressHydrationWarning موجود على body

5. شوف `components/SvgSymbols.jsx` — تأكد إن الـ SVG symbols متجمعة في بداية الصفحة 
   ومش بتعمل flicker ولا layout shift

6. تأكد إن كل الصور والـ assets:
   - مستخدمة بشكل lazy لو كانت كبيرة
   - formats مناسبة (SVG للشعارات، WebP/PNG للصور)
   - sizes attributes موجودة لو محتاجة

7. تأكد إن Next.js used:
   - Server Components للـ metadata (layout.jsx صح)
   - Client Components للمتحركات (page.jsx عليه 'use client')
   - مفيش 'use client' زيادة في حاجات مش محتاجاها

---

## 🟡 المرحلة الثالثة: فحص الـ Animations والـ Performance

8. GSAP Animations — فتش كل كومبوننت يستخدم GSAP وتأكد:
   - كل animation ليه cleanup في useEffect return (kill/revert)
   - ScrollTrigger instances بتتعمل refresh بعد كل animation
   - مفيش memory leaks من animations مش مقتولة
   - matchMedia مستخدم لما animations تختلف بين desktop و mobile
   - `gsap.context()` مستخدم للتجميع والتنظيف

9. Lenis Smooth Scroll (`components/SmoothScroll.jsx`):
   - تأكد إن Lenis initialized مرة واحدة فقط
   - الـ raf loop بيتوقف في cleanup
   - ScrollTrigger بيتحدث بعد كل scroll (lenis.on('scroll', ...))
   - الـ destroy موجود في الـ cleanup
   - Lenis مش بيسبب jank ولا stutter

10. Cursor Bubble (`components/CursorBubble.jsx`):
    - الماوس tracker شغال على desktop بس (مش mobile/touch devices)
    - الـ event listeners بتنضف في cleanup
    - مفيش lag ولا تأخير في حركة المؤشر
    - الـ bubble مختفي على mobile بشكل صحيح

11. Transition Scribble (`components/TransitionScribble.jsx`):
    - page transition animation سلس
    - بيعمل cleanup بعد ما يخلص
    - مش بيعلق الـ scroll

---

## 🟢 المرحلة الرابعة: فحص كل كومبوننت على حدة

12. **Navbar** (`components/Navbar.jsx`):
    - RTL layout صحيح (القايمة من اليمين)
    - Mobile menu (hamburger) شغال ومافيش تسريب للـ overlay
    - Links كلها شغالة وبتنقل للـ sections الصحيحة
    - Scroll behavior على الـ navbar (background change, hide/show)
    - Accessibility: keyboard navigation, aria-labels, focus traps
    - Sticky positioning مش بيعمل layout shift
    - Logo SVG ظاهر ومافيش clipping

13. **VimeoHero** (`components/VimeoHero.jsx`):
    - Vimeo embed بيحمل بشكل lazy
    - Autoplay شغال (muted)
    - Controls ظاهرة أو مخفية حسب التصميم
    - Hero text فوق الفيديو readable
    - Mobile: الفيديو بيتصغر بشكل responsive
    - CTA buttons شغالة

14. **HorizontalWords** (`components/HorizontalWords.jsx`):
    - Horizontal scroll animation شغال بسلاسة
    - Bouncing letters والـ stickers ظاهرين
    - SVG arrow drawing animations شغالة
    - Text مقروء ومافيش overlap
    - Mobile: بيعمل resize/reflow صحيح

15. **MotionCards** (`components/MotionCards.jsx`):
    - Cards animated on scroll (entrance)
    - Hover effects شغالة
    - Click/tap interactions responsive
    - Mobile: cards بتتكوم صح (مش جنب بعض)
    - Content readable في كل الـ viewports

16. **ServiceCards** (`components/ServiceCards.jsx`):
    - Cards layout responsive (grid → stack على mobile)
    - Colors والـ backgrounds متناسقة
    - Icons ظاهرة وصحيحة
    - Text alignment متناسق مع RTL
    - Link/CTA buttons شغالة

17. **Showreel** (`components/Showreel.jsx`):
    - Video player شغال
    - Autoplay/pause behavior صحيح
    - Responsive sizing
    - Controls accessible

18. **BrandStrip** (`components/BrandStrip.jsx`):
    - Logo/brand animation سلس
    - Infinite loop بدون glitches
    - logos متساوية في الحجم والـ spacing
    - Mobile: sizing مناسب

19. **DoubleMarquee** (`components/DoubleMarquee.jsx`):
    - اثنين marquee شغالين في نفس الوقت
    - اتجاهين مختلفين (يمين/شمال)
    - سرعة متناسقة
    - مفيش text clipping
    - pause on hover (لو موجود)

20. **ApplyCTA** (`components/ApplyCTA.jsx`):
    - Call-to-action واضح وجذاب
    - Button/link شغال
    - Responsive layout
    - Text مقروء ومتناسق

21. **Footer** (`components/Footer.jsx`):
    - Links كلها شغالة
    - Social media icons موجودة وروابطها صحيحة
    - RTL layout مضبوط
    - Responsive stacking
    - Copyright date صحيح

---

## 🔵 المرحلة الخامسة: فحص الـ CSS والـ Responsive Design

22. CSS Architecture:
    - تأكد إن مفيش CSS files redundant أو duplicated
    - تأكد إن `app/styles/globals.css` مش موجود (اتمسح) — ده مقصود؟
    - شوف لو `app/layout.jsx` بيستورد `globals.css` بس الملف مش موجود → هيسبب error!
    - `app/styles/base.css` فيه الـ CSS reset/custom properties
    - `app/styles/responsive.css` فيه media queries صحيحة

23. Responsive Breakpoints — فحص الموقع على:
    - 📱 Mobile: 320px - 480px (iPhone SE, iPhone 14)
    - 📱 Tablet: 768px - 1024px (iPad, iPad Pro)
    - 💻 Desktop: 1280px - 1440px (MacBook)
    - 🖥️ Wide: 1920px+ (شاشات كبيرة)
    - في كل breakpoint:
      - مفيش horizontal scroll bar (overflow-x: hidden)
      - Text مقروء ومافيش clipping
      - Touch targets على الأقل 44x44px (mobile)
      - Spacing متناسق
      - Animations شغالة أو متعطلة حسب الجهاز

24. RTL Specific:
    - `dir="rtl"` على html — تأكد إن كل حاجة مقلوبة صح
    - Text alignment (right-aligned للعربي)
    - Icons directional (أسهم، etc.) متقلبة صح
    - Margins/paddings مقلوبة (margin-right بدل margin-left)
    - Flexbox row-reverse مستخدم صح

---

## 🟣 المرحلة السادسة: فحص الـ Accessibility

25. Accessibility Audit:
    - Color contrast ratios (minimum 4.5:1 للنص العادي)
    - كل الصور ليها alt text
    - Form elements ليها labels
    - Keyboard navigation: Tab, Enter, Escape شغالين
    - Focus indicators ظاهرة
    - Skip-to-content link (لو موجود)
    - ARIA landmarks (header, main, footer)
    - Screen reader compatibility
    - Motion reduction: `prefers-reduced-motion` media query موجودة

---

## ⚫ المرحلة السابعة: فحص الـ Edge Cases والـ Error States

26. Edge Cases:
    - لو الـ JavaScript متعطل — المحتوى الأساسي لسه ظاهر؟
    - Loading states: لو الفيديو لسه محملش
    - Empty states: لو مفيش data في `lib/data.js`
    - Slow network: المحتوى بيتحمل بشكل تدريجي؟
    - 404 page: `app/not-found.jsx` شغال؟
    - Error page: `app/error.jsx` شغال؟

27. Browser Compatibility:
    - Chrome (latest)
    - Firefox (latest)
    - Safari (latest)
    - Edge (latest)
    - Mobile Safari (iOS)
    - Mobile Chrome (Android)

---

## ⚪ المرحلة الثامنة: فحص الـ Code Quality

28. Code Quality:
    - مفيش console.log ولا debug statements متروكة
    - مفيش TODO/FIXME منسيين
    - imports منظمة ومش redundant
    - مفيش unused variables أو imports
    - `components/ServiceCards.jsx.bak` موجود كـ backup — محتاج يتشال؟
    - ملفات كتير متعدلة في git status — تأكد إن مفيش breaking changes

29. Data Layer (`lib/data.js`):
    - البيانات صحيحة ومحدثة
    - مفيش hardcoded values في الكومبوننتس (كلها من data.js)
    - Fallbacks موجودة لو البيانات ناقصة

30. Build Check:
    - `next build` بيخلص من غير errors ولا warnings
    - مفيش ESLint errors
    - Bundle size معقول (خصوصًا GSAP)

---

## 📊 المطلوب في التقرير النهائي

بعد الفحص الكامل، قدم تقرير منظم كالتالي:

### ✅ نقاط القوة
- اذكر اللي شغال تمام وبكفاءة

### ⚠️ تحذيرات
- حاجات شغالة بس محتاجة تحسين

### ❌ مشاكل
- حاجات مش شغالة أو مكسورة
- أولوية: Critical / High / Medium / Low

### 🔧 توصيات
- تحسينات مقترحة للـ Performance
- تحسينات للـ Accessibility
- تحسينات للـ SEO
- تحسينات للـ Mobile UX
- تحسينات للـ Code Quality

### 📈 تقييم شامل من 10 لكل من:
- Desktop UX: __/10
- Mobile UX: __/10
- Performance: __/10
- Accessibility: __/10
- SEO: __/10
- Code Quality: __/10
- Animation Quality: __/10
- Responsive Design: __/10

---

ابدأ الفحص الآن. كن دقيقاً. كل ملليمتر يفرق. كل ميلي ثانية تفرق.
متسامحش في حاجة. ده موقع لازم يكون مثالي.
```

---

## 🚀 ازاي تستخدم البرومبت ده

1. **انسخ البرومبت كامل** من تحت علامة `---` التانية
2. **افتح Claude** (أو Codex أو أي نموذج قوي)
3. **حط البرومبت** واسأل النموذج يفحص كل حاجة
4. النموذج هيقرا كل ملفات المشروع ويديك تقرير مفصل

**نصيحة:** لو عايز تفحص الـ runtime الفعلي (المتصفح)، استخدم ده مع Chrome DevTools MCP أو Playwright — البرومبت فوق بيفحص الكود، لكن runtime testing محتاج tools browser.

---

## 🧪 برومبت إضافي للفحص الحي (Live Testing)

لو عايز تفحص الموقع وهو شغال في المتصفح فعلياً، استخدم البرومبت ده مع Claude Code:

```
افتح موقع https://rtc.shaker15s.com في المتصفح وافحصه بالكامل:

1. خد screenshots على:
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x812 — iPhone 14)

2. جرب:
   - السكرول من فوق لتحت والعكس
   - اضغط على كل رابط وزر
   - افتح الـ mobile menu واقفله
   - شوف الفيديوهات بتشتغل
   - شوف الـ animations أثناء السكرول
   - جرب الـ hover effects
   - شوف لو في حاجة بتflicker أو بتقطع

3. Run Lighthouse audit للـ:
   - Performance
   - Accessibility
   - SEO
   - Best Practices

4. اكتب تقرير بكل مشكلة لقيتها مع screenshot لكل مشكلة.
```