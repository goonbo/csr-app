import type { Metadata } from 'next';
import {
  Inter_Tight,
  Fraunces,
  JetBrains_Mono,
  Bricolage_Grotesque,
} from 'next/font/google';
import './globals.css';

const sans = Inter_Tight({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const serif = Fraunces({
  subsets: ['latin'],
  axes: ['opsz', 'SOFT'],
  variable: '--font-serif',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
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
    <html
      lang="en"
      className={`${sans.variable} ${serif.variable} ${mono.variable} ${display.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
