import Link from 'next/link';
import { Section, SectionHeading, PageHero } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import CtaBand from '@/components/ui/CtaBand';
import { pageMetadata } from '@/lib/seo';
import { services } from '@/lib/services';
import { slugify } from '@/lib/utils';

export const metadata = pageMetadata({ title: 'Services & Solutions', path: '/services', description: 'Management systems and certifications, HR consultancy, and Academy & technology training from Vishwamedha Consultancy Services, Bangalore.' });

export default function ServicesPage() {
  return (
    <>
      <PageHero eyebrow="Services & solutions" lead="Capability, made" accent="operational.">From management systems to human capability and technology fluency, our work is designed to move from intent to everyday practice.</PageHero>
      <Section>
        <div className="space-y-8">
          {services.map((s, i) => (
            <Reveal as="article" key={s.slug} className="grid gap-8 border border-line bg-white p-7 sm:p-10 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
              <div>
                <span className="eyebrow text-teal-deep">{s.number}</span>
                <h2 className="mt-3 text-4xl leading-tight text-navy sm:text-5xl">{s.title} <em className="accent">{s.accent}</em></h2>
                <p className="mt-5 leading-8 text-muted">{s.summary}</p>
                <Link href={`/services/${s.slug}`} className="mt-7 inline-flex min-h-12 items-center bg-navy px-6 py-3 text-sm font-bold text-white hover:bg-navy-2">Explore {i === 2 ? 'training' : 'this service'} <span aria-hidden className="ml-2">↘</span></Link>
              </div>
              <ul className="grid gap-x-8 gap-y-3 self-center sm:grid-cols-2">
                {s.items.map((it) => <li key={it.title}><Link href={`/services/${s.slug}#${slugify(it.title)}`} className="flex min-h-11 items-center gap-3 border-b border-line text-ink hover:text-teal-deep"><span aria-hidden className="h-px w-3 bg-gold" />{it.title}</Link></li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </Section>
      <Section tone="pale"><SectionHeading eyebrow="Not sure where to start?" lead="Bring us the" accent="hard problem.">Tell us where you want to build greater quality, people capability or technology readiness. We’ll use your note as the starting point for a focused conversation.</SectionHeading></Section>
      <CtaBand />
    </>
  );
}
