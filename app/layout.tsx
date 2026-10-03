import type { Metadata, Viewport } from 'next';
import type { ReactNode } from 'react';
import '@fontsource/dm-serif-display/400.css';
import '@fontsource-variable/manrope';
import '@fontsource/ibm-plex-mono/400.css';
import '@fontsource/ibm-plex-mono/500.css';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { site } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | Quality, People & Technology`, template: `%s | ${site.shortName}` },
  description: site.description,
  applicationName: site.name,
  openGraph: { siteName: site.name, locale: 'en_IN', type: 'website' },
  icons: { icon: '/vcs-mark.svg' }
};
export const viewport: Viewport = { themeColor: '#0a1a2a', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-IN">
      <body className="min-h-dvh">
        <div id="top" />
        <Header />
        <main id="main">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
