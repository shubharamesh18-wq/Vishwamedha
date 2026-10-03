import Link from 'next/link';
import { Section, PageHero } from '@/components/ui/Section';
import Reveal from '@/components/ui/Reveal';
import CtaBand from '@/components/ui/CtaBand';
import { pageMetadata } from '@/lib/seo';
import { industries } from '@/lib/services';
import { getCourse } from '@/lib/courses';

export const metadata = pageMetadata({ title: 'Industries We Serve', path: '/industries', description: 'VCS supports aerospace & defence, manufacturing, engineering, laboratories, healthcare and education organizations with management systems, consultancy and training.' });

export default function IndustriesPage() {
  return (
    <>
      <PageHero eyebrow="Industries we serve" lead="Built for the environments where" accent="standards matter.">Context matters. We shape our work around the standards, constraints and rhythms of your sector.</PageHero>
      <Section>
        <ul className="grid gap-6 md:grid-cols-2">
          {industries.map((ind, i) => {
            const course = getCourse(ind.course);
            return (
              <li key={ind.name}>
                <Reveal as="article" delay={(i % 2) * 90} className="flex h-full flex-col border border-line bg-white p-8">
                  <span className="eyebrow text-teal-deep">{String(i + 1).padStart(2, '0')} / {ind.tag}</span>
                  <h2 className="mt-3 text-3xl text-navy">{ind.name}</h2>
                  <p className="mt-4 leading-8 text-muted">{ind.text}</p>
                  {course && <p className="mt-auto border-t border-line pt-5 text-sm text-muted">Related training: <Link href="/academy#courses" className="font-semibold text-teal-deep hover:underline">{course.isoVersion}</Link></p>}
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Section>
      <CtaBand eyebrow="Your sector" lead="Tell us about your" accent="environment." text="Every organization has its own standards and operating reality. Start with a conversation." label="Talk to an expert" />
    </>
  );
}
