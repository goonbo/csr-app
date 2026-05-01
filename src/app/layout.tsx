import type { Metadata } from 'next';
import { Instrument_Serif, DM_Sans } from 'next/font/google';
import { TopNav } from '@/components/layout/TopNav';
import './globals.css';

const serif = Instrument_Serif({
  weight: '400',
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
});

const sans = DM_Sans({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'VIEW',
  description: 'AI-native CSR operator platform for mid-market companies.',
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>
        <TopNav />
        <main
          className="px-4 sm:px-6 md:px-8 py-8 md:py-10"
          style={{ maxWidth: 1280, margin: '0 auto' }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
