import { Section, SectionHeading, PageHero } from '@/components/ui/Section';
import { ButtonLink } from '@/components/ui/Button';
import Reveal from '@/components/ui/Reveal';
import CtaBand from '@/components/ui/CtaBand';
import Accordion from '@/components/sections/Accordion';
import CourseExplorer from '@/components/sections/CourseExplorer';
import { pageMetadata } from '@/lib/seo';
import { courseTypes, upcomingCourses } from '@/lib/courses';

export const revalidate = 86400;
export const metadata = pageMetadata({ title: 'Academy & Training', path: '/academy', description: 'VCS Academy offers ISO and management-system courses, technology programs, school-board and exam-preparation batches for organizations and individuals in Bangalore.' });

const faqs = [
  { q: 'How do I reserve a place in a batch?', a: 'Use “Enquire about this batch” on any course, or contact the VCS team directly. Online booking and secure payment are being added soon; until then we will confirm availability and next steps with you personally.' },
  { q: 'Which batch details are confirmed?', a: 'Each listing shows the batch dates, duration, fee and syllabus outcomes. Delivery mode, timings and trainer details are shared when you enquire, and we will confirm them with you before enrolment.' },
  { q: 'Are the fees inclusive of taxes?', a: 'Fees are shown before applicable taxes. The VCS team will confirm the final amount payable when you enquire.' },
  { q: 'Can my organization request a private batch?', a: 'Yes. Contact us to discuss a suitable format, audience and delivery approach for a corporate or in-house program.' }
];

const benefits = [
  { n: '01', t: 'Training benefits', d: 'Build confidence, create shared language and make the next improvement easier to sustain.' },
  { n: '02', t: 'Training methodology', d: 'Clear frameworks, guided practice and industry-aware examples, tailored by VCS.' },
  { n: '03', t: 'Flexible formats', d: 'Online, classroom, hybrid, corporate and individual learning pathways.' }
];

export default function AcademyPage() {
  const list = upcomingCourses();
  return (
    <>
      <PageHero eyebrow="VCS Academy / Training" lead="Build capability that" accent="travels." actions={<><ButtonLink href="#courses" variant="gold">Explore upcoming batches <span aria-hidden>↘</span></ButtonLink><ButtonLink href="/contact" variant="ghost-dark">Talk to an Expert <span aria-hidden>↗</span></ButtonLink></>}>Professional learning for people and organizations strengthening quality, management systems, technology readiness and industry confidence.</PageHero>

      <Section>
        <SectionHeading eyebrow="A practical learning platform" lead="Training designed for" accent="real work.">The VCS Academy is a space for structured, applied learning — connecting concepts with the systems, decisions and daily practices that shape organizational performance.</SectionHeading>
        <ul className="mt-12 grid gap-6 md:grid-cols-3">
          {benefits.map((b, i) => <li key={b.n}><Reveal delay={i * 90} className="h-full border border-line bg-white p-7"><span className="eyebrow text-teal-deep">{b.n}</span><h3 className="mt-3 text-2xl text-navy">{b.t}</h3><p className="mt-3 leading-7 text-muted">{b.d}</p></Reveal></li>)}
        </ul>
      </Section>

      <Section id="courses" tone="pale" className="scroll-mt-20">
        <SectionHeading eyebrow="Upcoming batches" lead="Upcoming" accent="Training Batches">Browse our upcoming professional training programs and enquire to reserve your place.</SectionHeading>
        <div className="mt-12"><CourseExplorer courses={list} types={courseTypes} /></div>
      </Section>

      <Section>
        <SectionHeading eyebrow="How we teach" lead="From" accent="understanding to use.">The best training leaves people with more than notes. It leaves them with a clearer next step and the confidence to take it.</SectionHeading>
        <ol className="mt-12 grid gap-px border border-line bg-line md:grid-cols-3">
          {[['Frame', 'Connect the learning to the operating context.'], ['Practice', 'Work through examples, tools and decisions.'], ['Apply', 'Leave with an action that can travel back to work.']].map(([t, d], i) => <li key={t} className="bg-white p-8"><span className="eyebrow text-teal-deep">{String(i + 1).padStart(2, '0')}</span><h3 className="mt-3 text-3xl text-navy">{t}</h3><p className="mt-2 text-muted">{d}</p></li>)}
        </ol>
      </Section>

      <Section tone="dark">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <SectionHeading tone="dark" eyebrow="Corporate & individual training" lead="Learning that respects the" accent="context.">VCS can shape training pathways for organizations, teams and individual professionals. Program formats and delivery modes are configured to your needs.</SectionHeading>
          <Reveal className="flex flex-wrap gap-4 lg:justify-end"><ButtonLink href="/contact" variant="gold">Discuss a corporate program <span aria-hidden>↗</span></ButtonLink><ButtonLink href="#courses" variant="ghost-dark">Browse individual batches <span aria-hidden>↘</span></ButtonLink></Reveal>
        </div>
      </Section>

      <Section id="booking-faq">
        <SectionHeading eyebrow="Booking questions" lead="Clarity before you" accent="commit." />
        <div className="mt-10 max-w-4xl"><Accordion items={faqs} /></div>
      </Section>
      <CtaBand eyebrow="Keep building" lead="Ready to strengthen" accent="capability?" text="View a batch, request a corporate program or speak with the VCS team." href="/contact" label="Speak with the team" />
    </>
  );
}
