import { Section, PageHero } from '@/components/ui/Section';
import CtaBand from '@/components/ui/CtaBand';
import FounderCard from '@/components/sections/FounderCard';
import { pageMetadata } from '@/lib/seo';
import { founders } from '@/lib/site';

export const metadata = pageMetadata({ title: 'Founders & Leadership', path: '/founders', description: 'Meet Ramesh V G (Founder) and Shubha Ramesh (Co-Founder), whose experience in management systems, auditing and consultancy shapes the VCS approach.' });

export default function FoundersPage() {
  return (
    <>
      <PageHero eyebrow="Leadership profiles" lead="Experience with a" accent="point of view.">Meet the VCS leadership team and the experience shaping its approach to quality, auditing, consultancy and capability-building.</PageHero>
      <Section>
        <div className="space-y-10">{founders.map((f, i) => <FounderCard key={f.slug} founder={f} index={i} priority={i === 0} />)}</div>
      </Section>
      <CtaBand eyebrow="Work with us" lead="Talk to the people who will" accent="do the work." text="Tell us about your organization and we will start with a focused conversation." label="Start a conversation" />
    </>
  );
}
