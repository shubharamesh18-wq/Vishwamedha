import Link from 'next/link';
import { mainNav, site } from '@/lib/site';
import { services } from '@/lib/services';
import Logo from './Logo';
import { Container } from '@/components/ui/Section';

export default function Footer() {
  return (
    <footer className="bg-navy text-white on-dark">
      <Container className="py-16">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <Logo />
            <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">{site.description}</p>
            <p className="eyebrow mt-6 text-gold">Trust / Quality / Continuous improvement</p>
          </div>
          <nav aria-label="Footer">
            <h2 className="eyebrow mb-5 text-gold">Explore</h2>
            <ul className="space-y-3 text-sm text-white/75">
              <li><Link href="/" className="hover:text-white">Home</Link></li>
              {mainNav.map((n) => <li key={n.href}><Link href={n.href} className="hover:text-white">{n.label}</Link></li>)}
            </ul>
          </nav>
          <nav aria-label="Services">
            <h2 className="eyebrow mb-5 text-gold">Services</h2>
            <ul className="space-y-3 text-sm text-white/75">
              {services.map((s) => <li key={s.slug}><Link href={`/services/${s.slug}`} className="hover:text-white">{s.title} {s.accent}</Link></li>)}
              <li><Link href="/academy#courses" className="hover:text-white">Upcoming training batches</Link></li>
            </ul>
          </nav>
          <div>
            <h2 className="eyebrow mb-5 text-gold">Contact</h2>
            <address className="space-y-4 text-sm not-italic leading-7 text-white/75">
              <p>{site.address.lines.join(' ')}</p>
              <p>
                <a className="hover:text-white" href={`tel:${site.phone.landlineHref}`}>{site.phone.landline}</a><br />
                <a className="hover:text-white" href={`tel:${site.phone.mobileHref}`}>{site.phone.mobile}</a>
              </p>
              <p><a className="break-all hover:text-white" href={`mailto:${site.email}`}>{site.email}</a></p>
              {site.social.linkedin && <p><a className="hover:text-white" href={site.social.linkedin} rel="noopener noreferrer" target="_blank">LinkedIn ↗</a></p>}
            </address>
          </div>
        </div>
        <div className="mt-14 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <a href="#top" className="hover:text-white">Back to top ↑</a>
        </div>
      </Container>
    </footer>
  );
}
