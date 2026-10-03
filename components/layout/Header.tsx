'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { mainNav } from '@/lib/site';
import { services } from '@/lib/services';
import { slugify } from '@/lib/utils';
import Logo from './Logo';

function Chevron({ open }: { open: boolean }) {
  return (
    <svg aria-hidden width="12" height="12" viewBox="0 0 12 12" className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
      <path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileServices, setMobileServices] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { setMobileOpen(false); setMegaOpen(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setMegaOpen(false); setMobileOpen(false); } };
    const onClick = (e: MouseEvent) => { if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false); };
    document.addEventListener('keydown', onKey);
    document.addEventListener('mousedown', onClick);
    return () => { document.removeEventListener('keydown', onKey); document.removeEventListener('mousedown', onClick); };
  }, []);

  const isActive = (href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`));
  const openMega = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setMegaOpen(true); };
  const scheduleClose = () => { closeTimer.current = setTimeout(() => setMegaOpen(false), 140); };

  const linkCls = (active: boolean) => `relative px-3 py-2 text-[13px] font-semibold tracking-wide transition-colors ${active ? 'text-gold' : 'text-white/85 hover:text-white'}`;

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-navy/95 backdrop-blur supports-[backdrop-filter]:bg-navy/90">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:bg-gold focus:px-4 focus:py-2 focus:text-navy">Skip to content</a>
      <div className="mx-auto flex h-[4.25rem] w-full max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Logo />

        {/* Desktop navigation */}
        <nav aria-label="Primary" className="hidden items-center gap-1 lg:flex">
          {mainNav.map((item) =>
            'mega' in item && item.mega ? (
              <div key={item.href} ref={megaRef} className="relative" onMouseEnter={openMega} onMouseLeave={scheduleClose}>
                <div className="flex items-center">
                  <Link href={item.href} className={linkCls(isActive(item.href))} aria-current={pathname === item.href ? 'page' : undefined}>{item.label}</Link>
                  <button type="button" className="-ml-2 p-2 text-white/85 hover:text-white" aria-expanded={megaOpen} aria-controls="mega-menu" aria-label="Toggle services menu" onClick={() => setMegaOpen((v) => !v)}><Chevron open={megaOpen} /></button>
                </div>
              </div>
            ) : (
              <Link key={item.href} href={item.href} className={linkCls(isActive(item.href))} aria-current={pathname === item.href ? 'page' : undefined}>{item.label}</Link>
            )
          )}
          <Link href="/contact" className="ml-3 bg-gold px-5 py-2.5 text-[13px] font-bold text-navy transition-colors hover:bg-gold-soft">Talk to an Expert <span aria-hidden>↗</span></Link>
        </nav>

        {/* Mobile toggle */}
        <button type="button" className="flex h-11 w-11 flex-col items-center justify-center gap-[5px] lg:hidden" aria-expanded={mobileOpen} aria-controls="mobile-nav" aria-label={mobileOpen ? 'Close menu' : 'Open menu'} onClick={() => setMobileOpen((v) => !v)}>
          <span className={`h-0.5 w-6 bg-white transition-transform ${mobileOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`h-0.5 w-6 bg-white transition-opacity ${mobileOpen ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-6 bg-white transition-transform ${mobileOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Mega menu (desktop) */}
      <div id="mega-menu" onMouseEnter={openMega} onMouseLeave={scheduleClose} className={`absolute inset-x-0 top-full hidden border-b border-white/10 bg-navy-2 shadow-2xl lg:block ${megaOpen ? '' : 'invisible opacity-0'} transition-opacity duration-150`}>
        <div className="mx-auto grid max-w-7xl grid-cols-3 gap-10 px-12 py-10">
          {services.map((s) => (
            <div key={s.slug}>
              <Link href={`/services/${s.slug}`} className="group block" tabIndex={megaOpen ? 0 : -1}>
                <span className="eyebrow text-gold">{s.number}</span>
                <span className="mt-2 block font-display text-2xl text-white group-hover:text-gold-soft">{s.title} <em className="accent">{s.accent}</em></span>
              </Link>
              <ul className="mt-4 space-y-2">
                {s.items.map((it) => (
                  <li key={it.title}><Link tabIndex={megaOpen ? 0 : -1} href={`/services/${s.slug}#${slugify(it.title)}`} className="text-sm text-white/70 transition-colors hover:text-white">{it.title}</Link></li>
                ))}
              </ul>
            </div>
          ))}
          <div className="col-span-3 flex items-center justify-between border-t border-white/10 pt-6 text-sm">
            <span className="text-white/60">Not sure where to start?</span>
            <div className="flex gap-6 font-semibold">
              <Link tabIndex={megaOpen ? 0 : -1} href="/academy#courses" className="text-gold hover:text-gold-soft">Browse upcoming batches ↘</Link>
              <Link tabIndex={megaOpen ? 0 : -1} href="/contact" className="text-gold hover:text-gold-soft">Talk to an expert ↗</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile / tablet panel */}
      <nav id="mobile-nav" aria-label="Mobile" className={`${mobileOpen ? 'block' : 'hidden'} max-h-[calc(100dvh-4.25rem)] overflow-y-auto border-t border-white/10 bg-navy lg:hidden`}>
        <ul className="px-5 py-4 sm:px-8">
          {mainNav.map((item) => (
            <li key={item.href} className="border-b border-white/10">
              {'mega' in item && item.mega ? (
                <>
                  <div className="flex items-center justify-between">
                    <Link href={item.href} className={`block flex-1 py-4 text-base font-semibold ${isActive(item.href) ? 'text-gold' : 'text-white'}`}>{item.label}</Link>
                    <button type="button" className="p-4 text-white" aria-expanded={mobileServices} aria-label="Show service links" onClick={() => setMobileServices((v) => !v)}><Chevron open={mobileServices} /></button>
                  </div>
                  {mobileServices && (
                    <ul className="pb-3 pl-3">
                      {services.map((s) => (
                        <li key={s.slug}><Link href={`/services/${s.slug}`} className="block py-2.5 text-sm text-white/75 hover:text-white">{s.title} {s.accent}</Link></li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link href={item.href} className={`block py-4 text-base font-semibold ${isActive(item.href) ? 'text-gold' : 'text-white'}`}>{item.label}</Link>
              )}
            </li>
          ))}
          <li className="py-5"><Link href="/contact" className="block bg-gold px-5 py-3.5 text-center text-sm font-bold text-navy">Talk to an Expert ↗</Link></li>
        </ul>
      </nav>
    </header>
  );
}
