import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { ButtonLink } from '@/components/ui/Button';
import { Section, SectionHeading, PageHero } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import CtaBand from '@/components/ui/CtaBand';
import { pageMetadata } from '@/lib/seo';
import { getService, services } from '@/lib/services';
import { courses, formatRange } from '@/lib/courses';
import { slugify } from '@/lib/utils';

type Params = Promise<{ slug: string }>;

export function generateStaticParams() { return services.map((s) => ({ slug: s.slug })); }
export const dynamicParams = false;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const s = getService((await params).slug);
  if (!s) return {};
  return pageMetadata({ title: `${s.title} ${s.accent}`, path: `/services/${s.slug}`, description: s.metaDescription });
}

export default async function ServicePage({ params }: { params: Params }) {
  const service = getService((await params).slug);
  if (!service) notFound();
  const related = service.relatedCourseType ? courses.filter((c) => c.courseType === service.relatedCourseType) : [];
  const subs = Array.from(new Set(related.map((c) => c.subCategory)));

  return (
    <>
      <PageHero eyebrow={`Service ${service.number}`} lead={service.title} accent={service.accent} actions={<><ButtonLink href="/contact" variant="gold">Discuss your requirement <span aria-hidden>↗</span></ButtonLink><ButtonLink href="/services" variant="ghost-dark">All services</ButtonLink></>}>{service.summary}</PageHero>

      <Section>
        <div className="grid gap-10 lg:grid-cols-[.9fr_1.1fr] lg:gap-20">
          <SectionHeading eyebrow="Our approach" lead="Practical, structured," accent="built to last." />
          <Reveal className="space-y-5 text-lg leading-8 text-muted">{service.intro.map((p) => <p key={p.slice(0, 20)}>{p}</p>)}</Reveal>
        </div>
        <ol className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3">
          {service.approach.map((a, i) => <li key={a.title} className="bg-white p-8"><span className="eyebrow text-teal-deep">{String(i + 1).padStart(2, '0')}</span><h3 className="mt-3 text-3xl text-navy">{a.title}</h3><p className="mt-2 text-muted">{a.text}</p></li>)}
        </ol>
      </Section>

      <Section tone="pale">
        <SectionHeading eyebrow="What we do" lead="How we can" accent="help." />
        <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {service.items.map((it, i) => (
            <li key={it.title} id={slugify(it.title)} className="scroll-mt-28">
              <Reveal delay={(i % 3) * 80} className="h-full border border-line bg-white p-7"><span className="eyebrow text-teal-deep">{String(i + 1).padStart(2, '0')}</span><h3 className="mt-3 text-2xl leading-tight text-navy">{it.title}</h3><p className="mt-3 leading-7 text-muted">{it.description}</p></Reveal>
            </li>
          ))}
        </ul>
      </Section>

      {related.length > 0 && (
        <Section>
          <SectionHeading eyebrow="Related training" lead="Learn it" accent="properly.">VCS Academy runs {related.length} upcoming batches in this area, from {formatRange(related[0]).split(' – ')[0]}.</SectionHeading>
          <ul className="mt-10 flex flex-wrap gap-3">{subs.map((s) => <li key={s} className="border border-navy/20 px-4 py-2.5 text-sm text-navy">{s}</li>)}</ul>
          <div className="mt-8"><ButtonLink href="/academy#courses" variant="navy">Browse upcoming batches <span aria-hidden>↘</span></ButtonLink></div>
        </Section>
      )}

      <CtaBand />
    </>
  );
}
