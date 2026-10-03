import { founders, site } from '@/lib/site';

export default function JsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    name: site.name,
    alternateName: site.shortName,
    url: site.url,
    description: site.description,
    email: site.email,
    telephone: [site.phone.landlineHref, site.phone.mobileHref],
    address: { '@type': 'PostalAddress', streetAddress: site.address.street, addressLocality: site.address.city, addressRegion: site.address.region, postalCode: site.address.postalCode, addressCountry: site.address.country },
    founder: founders.map((f) => ({ '@type': 'Person', name: f.name, jobTitle: f.role })),
    areaServed: 'IN',
    knowsAbout: ['ISO management systems', 'HR consultancy', 'Professional and technology training']
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}
