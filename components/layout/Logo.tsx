import Link from 'next/link';

export default function Logo({ className = '' }: { className?: string }) {
  return (
    <Link href="/" className={`group flex items-center gap-3 ${className}`} aria-label="Vishwamedha Consultancy Services – home">
      <span aria-hidden className="flex h-9 w-9 items-end gap-[3px]">
        <i className="block h-[15px] w-2 -skew-x-[16deg] bg-gold" />
        <i className="block h-6 w-2 -skew-x-[16deg] bg-teal" />
        <i className="block h-9 w-2 -skew-x-[16deg] bg-gold" />
      </span>
      <span className="flex flex-col gap-[3px] leading-none">
        <b className="font-mono text-[15px] font-medium tracking-[0.18em] text-gold-soft">VCS</b>
        <small className="text-[9px] uppercase tracking-[0.12em] text-white/60">Vishwamedha Consultancy Services</small>
      </span>
    </Link>
  );
}
