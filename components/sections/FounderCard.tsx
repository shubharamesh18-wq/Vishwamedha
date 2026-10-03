import Image from 'next/image';
import { founders } from '@/lib/site';
import Reveal from '@/components/ui/Reveal';

type Founder = (typeof founders)[number];

export default function FounderCard({ founder, index, priority = false }: { founder: Founder; index: number; priority?: boolean }) {
  return (
    <Reveal as="article" className="grid gap-8 border border-line bg-white p-6 sm:grid-cols-[minmax(0,15rem)_1fr] sm:p-8 lg:gap-10">
      <div className="relative aspect-[539/643] w-full max-w-xs overflow-hidden bg-pale sm:max-w-none">
        <Image src={founder.image} alt={founder.alt} fill sizes="(min-width:640px) 240px, 80vw" className="object-cover" priority={priority} />
        <span aria-hidden className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-gold to-teal" />
      </div>
      <div>
        <p className="eyebrow text-teal-deep">{String(index + 1).padStart(2, '0')} / {founder.role}</p>
        <h3 className="mt-3 text-4xl text-navy">{founder.name}</h3>
        <p className="mt-1 text-sm font-semibold text-[#8a6d2f]">{founder.role}</p>
        <div className="mt-5 space-y-4 leading-8 text-muted">{founder.bio.map((p) => <p key={p.slice(0, 24)}>{p}</p>)}</div>
      </div>
    </Reveal>
  );
}
