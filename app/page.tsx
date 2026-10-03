import Link from 'next/link';
import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { Container, Section, SectionHeading } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import CtaBand from '@/components/ui/CtaBand';
import HeroArt from '@/components/sections/HeroArt';
import FounderCard from '@/components/sections/FounderCard';
import JsonLd from '@/components/sections/JsonLd';
import { founders, site } from '@/lib/site';
import { industries, services, whyVcs } from '@/lib/services';
import { formatFee, formatRange, upcomingCourses } from '@/lib/courses';

export const revalidate = 86400;
export const metadata: Metadata = {
  title: { absolute: `${site.name} | Quality, People & Technology` },
  description: site.description,
  alternates: { canonical: '/' }
};

export default function HomePage() {
  const next = upcomingCourses().slice(0, 3);
  return (
    <>
      <JsonLd />
      {/* Hero */}
      <section className="relative overflow-hidden bg-navy text-white on-dark">
        <div aria-hidden className="grid-lines absolute inset-0 opacity-70" />
        <Container className="relative grid items-center gap-10 py-20 sm:py-24 lg:grid-cols-[1.15fr_.85fr] lg:py-32">
          <div>
            <p className="eyebrow mb-6 flex items-center gap-3 text-gold"><span aria-hidden className="h-px w-8 bg-current" />VCS / Consultancy &amp; Training</p>
            <h1 className="text-[2.6rem] leading-[1.02] sm:text-6xl lg:text-7xl">Building Excellence Through <em className="accent">Quality, People</em> &amp; Technology</h1>
            <p className="mt-7 max-w-2xl text-base leading-8 text-white/75 sm:text-lg">Vishwamedha Consultancy Services delivers professional consultancy, management-system implementation, HR solutions and technology-focused training to organizations seeking sustainable growth, compliance and operational excellence.</p>
            <div className="mt-9 flex flex-wrap gap-4">
              <ButtonLink href="/services" variant="gold">Explore Our Services <span aria-hidden>↘</span></ButtonLink>
              <ButtonLink href="/contact" variant="ghost-dark">Talk to an Expert <span aria-hidden>↗</span></ButtonLink>
            </div>
          </div>
          <HeroArt className="mx-auto hidden w-full max-w-md lg:block" />
        </Container>
        <div className="relative border-t border-white/10"><Container className="flex flex-wrap items-center justify-between gap-3 py-4 font-mono text-[11px] uppercase tracking-[0.18em] text-white/60"><span>Quality / People / Technology</span><span>Bangalore, India</span></Container></div>
      </section>

      {/* About */}
      <Section>
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading eyebrow="About VCS" lead="Structure creates room for" accent="better decisions." />
          <Reveal className="space-y-5 text-lg leading-8 text-muted">
            <p>Vishwamedha Consultancy Services is a professional consultancy and training organization focused on quality management, organizational development and technology capability.</p>
            <p>We work at the intersection of systems, people and practical capability — helping organizations create the clarity, discipline and confidence required for sustainable performance.</p>
            <ButtonLink href="/about" variant="ghost">More about VCS <span aria-hidden>↘</span></ButtonLink>
          </Reveal>
        </div>
      </Section>

      {/* Pillars */}
      <Section tone="pale">
        <SectionHeading eyebrow="Our three pillars" lead="Capability, made" accent="operational.">From management systems to human capability and technology fluency, our work is designed to move from intent to everyday practice.</SectionHeading>
        <ul className="mt-14 grid gap-6 lg:grid-cols-3">
          {services.map((s, i) => (
            <li key={s.slug}>
              <Reveal delay={i * 90} className="group flex h-full flex-col border border-line bg-white p-7 transition-shadow hover:shadow-card sm:p-9">
                <span className="eyebrow text-teal-deep">{s.number}</span>
                <h3 className="mt-4 text-3xl leading-tight text-navy">{s.title} <em className="accent">{s.accent}</em></h3>
                <p className="mt-4 leading-7 text-muted">{s.summary}</p>
                <ul className="mt-6 space-y-2 border-t border-line pt-5 text-sm text-ink">{s.items.slice(0, 6).map((it) => <li key={it.title} className="flex gap-3"><span aria-hidden className="mt-2.5 h-px w-3 shrink-0 bg-gold" />{it.title}</li>)}</ul>
                <Link href={`/services/${s.slug}`} className="mt-auto inline-flex min-h-11 items-center pt-6 text-sm font-bold text-navy group-hover:text-teal-deep">Explore pillar <span aria-hidden className="ml-2">↘</span></Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* Founders */}
      <Section>
        <SectionHeading eyebrow="The people behind the practice" lead="Experience with a" accent="point of view.">Meet the VCS leadership team and the experience shaping its approach to quality, auditing, consultancy and capability-building.</SectionHeading>
        <div className="mt-12 grid gap-8 xl:grid-cols-2">{founders.map((f, i) => <FounderCard key={f.slug} founder={f} index={i} />)}</div>
      </Section>

      {/* Academy teaser */}
      <Section tone="dark">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading tone="dark" eyebrow="VCS Academy / Upcoming" lead="Learn what the work" accent="demands next.">Focused learning for professionals and organizations building confidence across quality, management and technology.</SectionHeading>
          <ButtonLink href="/academy#courses" variant="gold" className="self-start">View all training programs <span aria-hidden>↗</span></ButtonLink>
        </div>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {next.map((c) => (
            <li key={c.id}>
              <Reveal as="article" className="flex h-full flex-col border border-white/15 bg-white/[0.04] p-7">
                <span className="eyebrow text-gold">{c.isoVersion}</span>
                <h3 className="mt-3 text-2xl leading-snug text-white">{c.courseName}</h3>
                <p className="mt-4 text-sm text-white/65">{formatRange(c)} · {c.duration}</p>
                <p className="mt-1 text-sm text-white/85">{formatFee(c.feeInr)} <span className="text-white/50">+ applicable taxes</span></p>
                <Link href={`/contact?course=${c.id}#enquiry`} className="mt-auto inline-flex min-h-11 items-center pt-6 text-sm font-bold text-gold hover:text-gold-soft">Enquire about this batch <span aria-hidden className="ml-2">↗</span></Link>
              </Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {/* Industries */}
      <Section>
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading eyebrow="Industries we serve" lead="Built for the environments where" accent="standards matter." />
          <ButtonLink href="/industries" variant="ghost" className="self-start">All industries <span aria-hidden>↘</span></ButtonLink>
        </div>
        <ul className="mt-12 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind, i) => (
            <li key={ind.name} className="bg-paper p-7 sm:p-8">
              <span className="eyebrow text-teal-deep">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="mt-3 text-2xl text-navy">{ind.name}</h3>
              <p className="mt-2 font-mono text-xs uppercase tracking-widest text-muted">{ind.tag}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Why VCS */}
      <Section tone="pale">
        <SectionHeading eyebrow="Why VCS" lead="Useful in the boardroom." accent="Practical on the floor." />
        <ul className="mt-12 grid gap-x-10 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
          {whyVcs.map((w, i) => (
            <li key={w.title} className="border-t border-navy/20 pt-5"><span className="eyebrow text-teal-deep">{String(i + 1).padStart(2, '0')}</span><h3 className="mt-2 font-sans text-lg font-bold text-navy">{w.title}</h3><p className="mt-2 leading-7 text-muted">{w.text}</p></li>
          ))}
        </ul>
      </Section>

      <CtaBand />
    </>
  );
}
