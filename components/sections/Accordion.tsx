export default function Accordion({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((it, i) => (
        <details key={it.q} className="group" open={i === 0}>
          <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-6 py-5 text-left font-display text-xl text-navy sm:text-2xl">
            <span><span className="eyebrow mr-3 text-teal-deep">{String(i + 1).padStart(2, '0')}</span>{it.q}</span>
            <span aria-hidden className="text-2xl text-teal-deep transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="max-w-3xl pb-6 leading-8 text-muted">{it.a}</p>
        </details>
      ))}
    </div>
  );
}
