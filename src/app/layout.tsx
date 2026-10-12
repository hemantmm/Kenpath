import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DailySpark — Learn, Play & Earn Daily Points',
  description: 'A lightweight daily micro-challenge web app designed for modest phones, low data usage, and real rewards.',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'DailySpark',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#4f46e5',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        <div className="mx-auto flex min-h-screen max-w-md flex-col bg-white shadow-xl sm:border-x sm:border-slate-200">
          {children}
        </div>
      </body>
    </html>
  );
}
