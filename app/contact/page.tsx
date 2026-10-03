import { Section, SectionHeading, PageHero } from '@/components/ui/Section';
import ContactForm from '@/components/sections/ContactForm';
import { pageMetadata } from '@/lib/seo';
import { site } from '@/lib/site';
import { formatRange, getCourse } from '@/lib/courses';

export const metadata = pageMetadata({ title: 'Contact', path: '/contact', description: 'Contact Vishwamedha Consultancy Services, Thygarajanagar, Bangalore — phone 080-26766475, mobile 9945797709, vishwamedha@consultscom.net.' });

type Search = Promise<Record<string, string | string[] | undefined>>;

export default async function ContactPage({ searchParams }: { searchParams: Search }) {
  const q = await searchParams;
  const course = getCourse(Array.isArray(q.course) ? q.course[0] : q.course);
  const defaultService = course ? (course.courseType === 'Management Systems & Certifications' ? 'Management Systems & Certifications' : 'Academy & Technology Training') : '';
  const defaultMessage = course ? `I would like to enquire about the ${course.courseName} batch (${formatRange(course)}).` : '';
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(site.mapQuery)}&output=embed`;
  const mapLink = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.mapQuery)}`;

  const row = 'border-t border-line py-5';
  return (
    <>
      <PageHero eyebrow="Let’s talk about what’s next" lead="Bring us the" accent="hard problem.">Tell us where you want to build greater quality, people capability or technology readiness. We’ll use your note as the starting point for a focused conversation.</PageHero>
      <Section>
        <div className="grid gap-12 lg:grid-cols-[.9fr_1.1fr] lg:gap-16">
          <div>
            <SectionHeading eyebrow="Contact details" lead="Visit, call" accent="or write." />
            <dl className="mt-10 text-ink">
              <div className={row}><dt className="eyebrow text-teal-deep">Office address</dt><dd className="mt-2 text-lg leading-8"><address className="not-italic">{site.address.lines.map((l) => <span key={l} className="block">{l}</span>)}</address></dd></div>
              <div className={row}><dt className="eyebrow text-teal-deep">Phone</dt><dd className="mt-2 text-lg leading-8"><a className="hover:text-teal-deep" href={`tel:${site.phone.landlineHref}`}>{site.phone.landline}</a><br /><a className="hover:text-teal-deep" href={`tel:${site.phone.mobileHref}`}>Mob: {site.phone.mobile}</a></dd></div>
              <div className={row}><dt className="eyebrow text-teal-deep">Email</dt><dd className="mt-2 break-all text-lg"><a className="hover:text-teal-deep" href={`mailto:${site.email}`}>{site.email}</a></dd></div>
              {site.social.linkedin && <div className={row}><dt className="eyebrow text-teal-deep">LinkedIn</dt><dd className="mt-2 text-lg"><a className="hover:text-teal-deep" href={site.social.linkedin} target="_blank" rel="noopener noreferrer">VCS on LinkedIn ↗</a></dd></div>}
            </dl>
            <div className="mt-8 overflow-hidden border border-line bg-pale">
              <iframe title="Map showing the Vishwamedha Consultancy Services office location" src={mapSrc} loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="h-72 w-full border-0 sm:h-80" />
            </div>
            <a href={mapLink} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center text-sm font-bold text-navy hover:text-teal-deep">Open in Google Maps <span aria-hidden className="ml-2">↗</span></a>
          </div>
          <div id="enquiry" className="scroll-mt-28"><ContactForm defaultService={defaultService} defaultMessage={defaultMessage} /></div>
        </div>
      </Section>
    </>
  );
}
