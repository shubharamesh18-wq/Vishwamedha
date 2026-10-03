import { ButtonLink } from '@/components/ui/Button';
import { Container } from '@/components/ui/Section';

export default function NotFound() {
  return (
    <section className="bg-navy py-28 text-white on-dark">
      <Container>
        <p className="eyebrow text-gold">Error 404</p>
        <h1 className="mt-4 text-5xl sm:text-6xl">This page <em className="accent">isn’t here.</em></h1>
        <p className="mt-5 max-w-xl text-white/70">The page may have moved. Try one of these instead.</p>
        <div className="mt-8 flex flex-wrap gap-4"><ButtonLink href="/">Back to home</ButtonLink><ButtonLink href="/academy" variant="ghost-dark">Academy</ButtonLink><ButtonLink href="/contact" variant="ghost-dark">Contact</ButtonLink></div>
      </Container>
    </section>
  );
}
