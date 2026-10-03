/** Single source of truth for company details. Edit here and every page updates. */
export const site = {
  name: 'Vishwamedha Consultancy Services',
  shortName: 'VCS',
  tagline: 'Building Excellence Through Quality, People & Technology',
  description:
    'Vishwamedha Consultancy Services delivers management systems, HR consultancy and technology-focused training for sustainable growth and operational excellence.',
  url: (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, ''),
  // Address as supplied by VCS (please confirm spelling / the repeated "6th A main road").
  address: {
    lines: ['No 07, 4th floor,', '6th A main road,', '3rd block, 6th A main road,', 'Thygarajanagar,', 'Bangalore-560070'],
    street: 'No 07, 4th floor, 6th A main road, 3rd block, 6th A main road',
    locality: 'Thygarajanagar',
    city: 'Bangalore',
    region: 'Karnataka',
    postalCode: '560070',
    country: 'IN'
  },
  phone: { landline: '080-26766475', landlineHref: '+918026766475', mobile: '9945797709', mobileHref: '+919945797709' },
  email: 'vishwamedha@consultscom.net',
  mapQuery: 'No 07, 4th floor, 6th A main road, 3rd block, Thygarajanagar, Bangalore 560070, India',
  social: { linkedin: '' as string } // add the LinkedIn URL here when available; shown automatically
} as const;

export const founders = [
  {
    slug: 'ramesh-v-g',
    name: 'Ramesh V G',
    role: 'Founder',
    image: '/images/director-2.webp',
    alt: 'Portrait of Ramesh V G, VCS Founder',
    bio: [
      'Mr. Ramesh V G brings approximately 25 years of professional experience serving global organizations. He has been associated with TÜV SÜD South Asia and brings extensive experience in management systems, auditing and quality-related consulting.',
      'With a background in Food Technology, he has experience in internal and external auditing and consultancy related to ISO 9001:2015 for private sector, public sector and other organizations. His professional experience also includes NABL-related services, uncertainty training and food testing-related activities.'
    ]
  },
  {
    slug: 'shubha-ramesh',
    name: 'Shubha Ramesh',
    role: 'Co-Founder',
    image: '/images/founder-1.webp',
    alt: 'Portrait of Shubha Ramesh, VCS Co-Founder',
    bio: [
      'Mrs. Shubha Ramesh brings approximately 22 years of experience working with private-sector organizations, with expertise in internal auditing, business development and professional consultancy.',
      'She has particular experience supporting AS 9100-related requirements and consultancy activities for aerospace and engineering organizations.'
    ]
  }
] as const;

export const mainNav = [
  { label: 'About', href: '/about' },
  { label: 'Founders', href: '/founders' },
  { label: 'Services', href: '/services', mega: true },
  { label: 'Academy', href: '/academy' },
  { label: 'Industries', href: '/industries' },
  { label: 'Contact', href: '/contact' }
] as const;
