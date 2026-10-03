import Link from 'next/link';
import type { ComponentProps, ReactNode } from 'react';

type Variant = 'gold' | 'navy' | 'ghost' | 'ghost-dark';
const styles: Record<Variant, string> = {
  gold: 'bg-gold text-navy hover:bg-gold-soft',
  navy: 'bg-navy text-white hover:bg-navy-2',
  ghost: 'border border-navy/30 text-navy hover:bg-navy hover:text-white',
  'ghost-dark': 'border border-white/35 text-white hover:bg-white hover:text-navy'
};
const base = 'inline-flex items-center justify-center gap-2 px-6 py-3.5 text-sm font-bold tracking-wide transition-colors duration-200 min-h-12';

export function ButtonLink({ href, variant = 'gold', children, className = '', ...rest }: { href: string; variant?: Variant; children: ReactNode; className?: string } & Omit<ComponentProps<typeof Link>, 'href'>) {
  return <Link href={href} className={`${base} ${styles[variant]} ${className}`} {...rest}>{children}</Link>;
}

export function Button({ variant = 'navy', className = '', ...rest }: { variant?: Variant } & ComponentProps<'button'>) {
  return <button className={`${base} ${styles[variant]} disabled:opacity-60 disabled:cursor-not-allowed ${className}`} {...rest} />;
}
