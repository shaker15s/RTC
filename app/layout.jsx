import './globals.css';

export const metadata = {
  title: 'RTC Nasr City — Free Professional Training | Resala',
  description: 'Resala Charity Association — RTC Nasr City. Free professional courses for all youth: Engineering, Computer Science, Languages, Human Development.',
  icons: {
    icon: '/assets/Navbar SVG/logo-rtc.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" dir="ltr">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Epilogue:wght@400;500;600;700;800;900&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
