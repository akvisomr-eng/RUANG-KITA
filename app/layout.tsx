import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'RUANGKITA — Virtual Podcast Studio',
  description: 'Studio podcast virtual untuk kreator, komunitas, dan tim.',
  applicationName: 'RUANGKITA',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="id"><body>{children}</body></html>;
}