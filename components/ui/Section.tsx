import type { ReactNode } from 'react';
import Reveal from './Reveal';

export function Container({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 ${className}`}>{children}</div>;
}

export function Section({ children, id, tone = 'light', className = '' }: { children: ReactNode; id?: string; tone?: 'light' | 'pale' | 'dark'; className?: string }) {
  const tones = { light: 'bg-paper text-ink', pale: 'bg-pale text-ink', dark: 'bg-navy text-white on-dark' };
  return <section id={id} className={`py-16 sm:py-20 lg:py-28 ${tones[tone]} ${className}`}><Container>{children}</Container></section>;
}

export function SectionHeading({ eyebrow, lead, accent, children, tone = 'light', as: Tag = 'h2', className = '' }: { eyebrow?: string; lead: string; accent?: string; children?: ReactNode; tone?: 'light' | 'dark'; as?: 'h1' | 'h2'; className?: string }) {
  return (
    <Reveal className={`max-w-3xl ${className}`}>
      {eyebrow && <p className={`eyebrow mb-4 flex items-center gap-3 ${tone === 'dark' ? 'text-gold' : 'text-teal-deep'}`}><span aria-hidden className="h-px w-8 bg-current" />{eyebrow}</p>}
      <Tag className={`text-4xl leading-[1.05] sm:text-5xl lg:text-6xl ${tone === 'dark' ? 'text-white' : 'text-navy'}`}>
        {lead}{accent && <> <em className="accent">{accent}</em></>}
      </Tag>
      {children && <div className={`mt-6 text-base leading-8 sm:text-lg ${tone === 'dark' ? 'text-white/75' : 'text-muted'}`}>{children}</div>}
    </Reveal>
  );
}

export function PageHero({ eyebrow, lead, accent, children, actions }: { eyebrow: string; lead: string; accent: string; children?: ReactNode; actions?: ReactNode }) {
  return (
    <section className="relative overflow-hidden bg-navy text-white on-dark">
      <div aria-hidden className="grid-lines absolute inset-0 opacity-70" />
      <div aria-hidden className="absolute -right-24 -top-24 h-96 w-96 rounded-full border border-gold/20" />
      <div aria-hidden className="absolute -right-8 top-10 h-64 w-64 rounded-full border border-teal/25" />
      <Container className="relative py-20 sm:py-24 lg:py-32">
        <SectionHeading as="h1" tone="dark" eyebrow={eyebrow} lead={lead} accent={accent}>{children}</SectionHeading>
        {actions && <div className="mt-9 flex flex-wrap gap-4">{actions}</div>}
      </Container>
    </section>
  );
}
