import { ButtonLink } from './Button';
import { Container } from './Section';
import Reveal from './Reveal';

export default function CtaBand({ eyebrow = 'The next standard starts here', lead = 'Strengthen your organization’s', accent = 'Quality, People & Technology capabilities', text = 'Talk to VCS about your consultancy, implementation or training requirements.', href = '/contact', label = 'Talk to Our Experts' }: { eyebrow?: string; lead?: string; accent?: string; text?: string; href?: string; label?: string }) {
  return (
    <section className="relative overflow-hidden bg-navy-2 py-16 text-white on-dark sm:py-20">
      <div aria-hidden className="grid-lines absolute inset-0 opacity-50" />
      <Container className="relative">
        <Reveal className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
          <div className="max-w-3xl">
            <p className="eyebrow mb-4 text-gold">{eyebrow}</p>
            <h2 className="text-3xl leading-tight sm:text-4xl lg:text-5xl">{lead} <em className="accent">{accent}</em></h2>
            <p className="mt-5 max-w-xl text-white/75">{text}</p>
          </div>
          <ButtonLink href={href} variant="gold">{label} <span aria-hidden>↗</span></ButtonLink>
        </Reveal>
      </Container>
    </section>
  );
}
