'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import type { Course } from '@/lib/courses';
import { formatFee, formatRange } from '@/lib/courses';

export default function CourseExplorer({ courses, types }: { courses: Course[]; types: readonly string[] }) {
  const [type, setType] = useState<string>('All');
  const [sub, setSub] = useState<string>('All');
  const [query, setQuery] = useState('');

  const subs = useMemo(() => Array.from(new Set(courses.filter((c) => type === 'All' || c.courseType === type).map((c) => c.subCategory))), [courses, type]);
  const shown = useMemo(() => courses.filter((c) =>
    (type === 'All' || c.courseType === type) && (sub === 'All' || c.subCategory === sub) &&
    (!query.trim() || `${c.courseName} ${c.isoVersion} ${c.subCategory}`.toLowerCase().includes(query.trim().toLowerCase()))
  ), [courses, type, sub, query]);

  const chip = (active: boolean) => `px-4 py-2.5 text-[13px] font-semibold transition-colors min-h-11 ${active ? 'bg-navy text-white' : 'border border-navy/20 text-navy hover:border-navy'}`;

  return (
    <div>
      <div className="flex flex-col gap-5 border-b border-line pb-8">
        <div className="flex flex-wrap gap-2" role="group" aria-label="Course category">
          {['All', ...types].map((t) => <button key={t} type="button" className={chip(type === t)} aria-pressed={type === t} onClick={() => { setType(t); setSub('All'); }}>{t === 'Academy & Tech Training' ? 'Academy & Technology Training' : t}</button>)}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex-1"><span className="sr-only">Sub-category</span>
            <select value={sub} onChange={(e) => setSub(e.target.value)} className="h-12 w-full border border-navy/20 bg-white px-4 text-sm text-ink">
              <option value="All">All sub-categories</option>
              {subs.map((s) => <option key={s}>{s}</option>)}
            </select>
          </label>
          <label className="flex-1"><span className="sr-only">Search courses</span>
            <input type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by course or standard (e.g. ISO 27001)" className="h-12 w-full border border-navy/20 bg-white px-4 text-sm text-ink placeholder:text-muted/80" />
          </label>
        </div>
        <p className="text-sm text-muted" role="status" aria-live="polite">{shown.length} {shown.length === 1 ? 'batch' : 'batches'} shown</p>
      </div>

      {shown.length === 0 ? (
        <p className="py-16 text-center text-muted">No batches match your search. <button type="button" className="font-semibold text-teal-deep underline" onClick={() => { setType('All'); setSub('All'); setQuery(''); }}>Clear filters</button> or <Link href="/contact" className="font-semibold text-teal-deep underline">ask us about a custom program</Link>.</p>
      ) : (
        <ul className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((c) => (
            <li key={c.id}>
              <article className="flex h-full flex-col border border-line bg-white p-6 transition-shadow hover:shadow-card sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <span className="eyebrow text-teal-deep">{c.isoVersion}</span>
                  <span className="text-right text-[11px] text-muted">{c.subCategory}</span>
                </div>
                <h3 className="mt-4 text-2xl leading-tight text-navy">{c.courseName}</h3>
                <p className="mt-3 text-sm leading-7 text-muted">{c.description}</p>
                <dl className="mt-5 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-line pt-5 text-sm">
                  <div className="col-span-2"><dt className="eyebrow text-[10px] text-muted">Batch dates</dt><dd className="mt-1 font-semibold text-navy">{formatRange(c)}</dd></div>
                  <div><dt className="eyebrow text-[10px] text-muted">Duration</dt><dd className="mt-1 font-semibold text-navy">{c.duration}</dd></div>
                  <div><dt className="eyebrow text-[10px] text-muted">Fee</dt><dd className="mt-1 font-semibold text-navy">{formatFee(c.feeInr)} <span className="text-xs font-normal text-muted">+ applicable taxes</span></dd></div>
                </dl>
                <details className="group mt-5 border-t border-line pt-4">
                  <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between text-sm font-semibold text-navy">Key syllabus outcomes <span aria-hidden className="text-lg transition-transform group-open:rotate-45">+</span></summary>
                  <ul className="mt-2 space-y-2 text-sm leading-6 text-muted">{c.keySyllabusOutcomes.map((o) => <li key={o} className="flex gap-2"><span aria-hidden className="mt-2 h-1 w-3 shrink-0 bg-gold" />{o}</li>)}</ul>
                </details>
                <div className="mt-auto pt-6">
                  <Link href={`/contact?course=${c.id}#enquiry`} className="inline-flex min-h-11 items-center gap-2 bg-navy px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-navy-2">Enquire about this batch <span aria-hidden>↗</span></Link>
                </div>
              </article>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
