import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://rtc.shaker15s.com';

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'مركز تدريب مدينة نصر — تدريب مهني مجاني | رسالة',
    template: '%s — RTC Nasr City',
  },
  description:
    'جمعية رسالة الخيرية — مركز تدريب مدينة نصر. دورات مهنية مجانية لكل شباب مصر: هندسة، حاسبات، لغات، تنمية بشرية. Free professional courses. Every month. Every young Egyptian.',
  keywords: [
    'رسالة',
    'تدريب',
    'مدينة نصر',
    'كورسات مجانية',
    'Resala',
    'RTC',
    'free courses Egypt',
    'Nasr City training',
  ],
  authors: [{ name: 'Resala Training Center — Nasr City' }],
  creator: 'Resala Training Center — Nasr City',
  publisher: 'Resala',
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    type: 'website',
    locale: 'ar_EG',
    url: siteUrl,
    title: 'مركز تدريب مدينة نصر — تدريب مهني مجاني | رسالة',
    description:
      'Free professional courses for Egyptian youth — Engineering, Computer Science, Languages, Human Development.',
    siteName: 'RTC Nasr City',
    images: [
      {
        url: '/assets/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Resala Training Center — Nasr City',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'مركز تدريب مدينة نصر — تدريب مهني مجاني | رسالة',
    description: 'Free professional courses for Egyptian youth — every month, every young Egyptian.',
    images: ['/assets/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: '/assets/Navbar SVG/logo-rtc.svg',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#fdf8f3',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap"
        />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800;900&display=swap"
        />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
