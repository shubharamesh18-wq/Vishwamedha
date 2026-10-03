import Link from 'next/link';
import { ButtonLink } from '@/components/ui/Button';
import { Section, SectionHeading, PageHero } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import CtaBand from '@/components/ui/CtaBand';
import { pageMetadata } from '@/lib/seo';
import { whyVcs, services } from '@/lib/services';

export const metadata = pageMetadata({ title: 'About Us', path: '/about', description: 'Vishwamedha Consultancy Services is a professional consultancy and training organization focused on quality management, organizational development and technology capability.' });

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="About VCS" lead="Structure creates room for" accent="better decisions.">Built for organizations that aim higher.</PageHero>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[1.1fr_.9fr] lg:gap-20">
          <Reveal className="space-y-6 text-lg leading-8 text-muted">
            <p>Vishwamedha Consultancy Services is a professional consultancy and training organization focused on quality management, organizational development and technology capability.</p>
            <p>We work at the intersection of systems, people and practical capability — helping organizations create the clarity, discipline and confidence required for sustainable performance.</p>
            <p>Our work spans three pillars: management systems and certifications, HR consultancy, and Academy and technology training — each designed to move from intent to everyday practice.</p>
            <div className="flex flex-wrap gap-4 pt-2"><ButtonLink href="/founders" variant="navy">Meet our founders <span aria-hidden>↘</span></ButtonLink><ButtonLink href="/contact" variant="ghost">Start a conversation <span aria-hidden>↗</span></ButtonLink></div>
          </Reveal>
          <Reveal className="border border-line bg-white p-8">
            <p className="eyebrow text-teal-deep">Our pillars</p>
            <ul className="mt-5 divide-y divide-line">{services.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`} className="flex min-h-14 items-center justify-between gap-4 py-4 font-display text-xl text-navy hover:text-teal-deep">{s.title} {s.accent}<span aria-hidden>↘</span></Link></li>)}</ul>
          </Reveal>
        </div>
      </Section>
      <Section tone="pale">
        <SectionHeading eyebrow="Why VCS" lead="A grounded" accent="partnership." />
        <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {whyVcs.map((w, i) => <li key={w.title} className="border-t border-navy/20 pt-5"><span className="eyebrow text-teal-deep">{String(i + 1).padStart(2, '0')}</span><h3 className="mt-2 font-sans text-lg font-bold text-navy">{w.title}</h3><p className="mt-2 leading-7 text-muted">{w.text}</p></li>)}
        </ul>
      </Section>
      <CtaBand />
    </>
  );
}
