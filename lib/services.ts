export type ServiceItem = { title: string; description: string };
export type Service = {
  slug: string;
  number: string;
  title: string;
  accent: string;
  summary: string;
  metaDescription: string;
  intro: string[];
  items: ServiceItem[];
  approach: { title: string; text: string }[];
  relatedCourseType?: string;
};

export const services: Service[] = [
  {
    slug: 'management-systems',
    number: '01',
    title: 'Management Systems',
    accent: '& Certifications',
    summary: 'Build the structure, discipline and continual improvement habits that make quality part of how work gets done.',
    metaDescription:
      'ISO management-system consultancy in Bangalore: implementation, documentation, internal audits, compliance and continual improvement with Vishwamedha Consultancy Services.',
    intro: [
      'VCS helps organizations establish, implement, maintain and improve management systems that support compliance, consistency and continual improvement.',
      'Our approach is structured and practical: understand the operating context, make expectations visible, build usable documentation, and develop the internal capability to keep improving.'
    ],
    items: [
      { title: 'ISO Management Systems', description: 'Guidance on selecting, interpreting and applying the management-system standards that fit your organization and sector.' },
      { title: 'Implementation', description: 'Practical roll-out of processes, responsibilities and controls so the system works on the shop floor and in the office.' },
      { title: 'Documentation', description: 'Clear, usable procedures and records that people actually follow, not paperwork for its own sake.' },
      { title: 'Internal Audits', description: 'Independent, constructive audits that show where the system is working and where it needs strengthening.' },
      { title: 'Compliance', description: 'Support in meeting standard, statutory and customer requirements with confidence and consistency.' },
      { title: 'Continual Improvement', description: 'Review, learning and corrective action habits that keep the system improving long after certification.' }
    ],
    approach: [
      { title: 'Understand', text: 'Context, risk & intent' },
      { title: 'Implement', text: 'Structure, documents & ownership' },
      { title: 'Improve', text: 'Audit, learn & strengthen' }
    ],
    relatedCourseType: 'Management Systems & Certifications'
  },
  {
    slug: 'hr-consultancy',
    number: '02',
    title: 'HR',
    accent: 'Consultancy',
    summary: 'Make people processes more coherent, useful and aligned with the organization you are building.',
    metaDescription:
      'HR consultancy in Bangalore: HR systems and processes, organizational development, employee development and HR advisory from Vishwamedha Consultancy Services.',
    intro: [
      'Strong organizations make it easier for people to do meaningful work well. VCS supports that work through practical HR systems, organizational development and capability-building.',
      'We shape people processes that are clear, consistent and aligned to your operating reality.'
    ],
    items: [
      { title: 'HR systems and processes', description: 'Shape people processes that are clear, consistent and aligned to the organization’s operating reality.' },
      { title: 'Organizational development', description: 'Support for role clarity, structure and capability planning as your organization grows and changes.' },
      { title: 'HR process improvement', description: 'Review and simplify existing HR processes so they are easier to run and easier to trust.' },
      { title: 'Employee development', description: 'Development programs and advisory support that build skills and confidence across teams.' },
      { title: 'HR advisory', description: 'Practical, experienced guidance on the people questions that come up in day-to-day management.' }
    ],
    approach: [
      { title: 'Listen', text: 'People, roles & context' },
      { title: 'Design', text: 'Clear, usable processes' },
      { title: 'Embed', text: 'Ownership & follow-through' }
    ]
  },
  {
    slug: 'academy-training',
    number: '03',
    title: 'Academy & Technology',
    accent: 'Training',
    summary: 'Turn learning into applied capability with professional, management-system and technology-focused programs.',
    metaDescription:
      'Professional, management-system and technology training in Bangalore: corporate and individual programs from VCS Academy, Vishwamedha Consultancy Services.',
    intro: [
      'Focused learning for professionals and organizations building confidence across quality, management and technology.',
      'The best training leaves people with more than notes: a clearer next step and the confidence to take it.'
    ],
    items: [
      { title: 'Professional training', description: 'Practical development for communication, leadership, problem-solving and organizational effectiveness.' },
      { title: 'Management-system training', description: 'Standard-by-standard courses for professionals building reliable, auditable ways of working.' },
      { title: 'Technology training', description: 'Technology-focused learning that helps teams build fluency and make better operational decisions.' },
      { title: 'Industry-focused learning', description: 'Context-aware programs shaped around the standards and realities of your sector.' },
      { title: 'Corporate training', description: 'Programs for teams and organizations, with formats and delivery shaped around your needs.' }
    ],
    approach: [
      { title: 'Frame', text: 'Connect learning to the operating context' },
      { title: 'Practice', text: 'Work through examples, tools and decisions' },
      { title: 'Apply', text: 'Leave with an action that travels back to work' }
    ],
    relatedCourseType: 'Academy & Tech Training'
  }
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const industries = [
  { name: 'Aerospace & Defence', tag: 'Precision / assurance', text: 'Quality and assurance frameworks for organizations working to demanding aerospace and defence requirements, including AS 9100.', course: 'as-9100' },
  { name: 'Manufacturing', tag: 'Flow / consistency', text: 'Management systems that bring consistency, traceability and continual improvement to production environments.', course: 'iatf-16949' },
  { name: 'Engineering', tag: 'Systems / scale', text: 'Structured systems and capable teams for engineering organizations that need to scale reliably.', course: 'iso-9001' },
  { name: 'Laboratories', tag: 'Method / confidence', text: 'Support for testing, calibration and medical laboratories working toward competence and accreditation.', course: 'iso-17025' },
  { name: 'Healthcare', tag: 'Care / control', text: 'Quality and accreditation learning for healthcare providers and medical-device organizations.', course: 'nabh-accred' },
  { name: 'Education', tag: 'Learning / progress', text: 'Curriculum-focused and exam-preparation programs, alongside capability-building for institutions.', course: 'acad-cbse' }
] as const;

export const whyVcs = [
  { title: 'Professional Expertise', text: 'Bring disciplined thinking to complex organizational questions.' },
  { title: 'Structured Approach', text: 'Make progress visible through a clear, considered method.' },
  { title: 'Customized Solutions', text: 'Fit the work to your context, maturity and operating reality.' },
  { title: 'Industry Understanding', text: 'Respect the standards, constraints and rhythms of your sector.' },
  { title: 'Practical Training', text: 'Turn concepts into habits people can use with confidence.' },
  { title: 'Long-Term Client Partnership', text: 'Build capability that continues beyond the initial engagement.' }
] as const;
