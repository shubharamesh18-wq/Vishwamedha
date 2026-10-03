'use client';

import { FormEvent, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { site } from '@/lib/site';

const services = ['Management Systems & Certifications', 'HR Consultancy', 'Academy & Technology Training', 'Not sure yet'];
const field = 'mt-2 w-full border border-navy/20 bg-white px-4 py-3 text-base text-ink placeholder:text-muted/70 focus:border-navy';

export default function ContactForm({ defaultService = '', defaultMessage = '' }: { defaultService?: string; defaultMessage?: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'ok' | 'error'>('idle');
  const [note, setNote] = useState('');

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setState('sending'); setNote('');
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(Object.fromEntries(new FormData(form).entries())) });
      const data = await res.json().catch(() => ({}));
      if (res.ok) { setState('ok'); form.reset(); return; }
      setState('error'); setNote(data.message || 'Something went wrong. Please try again, or call us directly.');
    } catch {
      setState('error'); setNote('We could not reach the server. Please try again, or call us directly.');
    }
  }

  if (state === 'ok') {
    return (
      <div className="border border-teal/40 bg-white p-8 sm:p-10" role="status">
        <p className="eyebrow text-teal-deep">Enquiry received</p>
        <h3 className="mt-3 text-3xl text-navy">Thank you — we’ll be in touch.</h3>
        <p className="mt-4 leading-8 text-muted">The VCS team will respond to your enquiry shortly. For anything urgent, call {site.phone.landline} or {site.phone.mobile}.</p>
        <Button type="button" variant="ghost" className="mt-6" onClick={() => setState('idle')}>Send another enquiry</Button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5 border border-line bg-white p-6 sm:p-9" noValidate={false} aria-describedby="form-note">
      <p id="form-note" className="eyebrow text-teal-deep">Enquiry / 01</p>
      {/* Honeypot: hidden from people, tempting to bots */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden"><label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" /></label></div>
      <div className="grid gap-5 sm:grid-cols-2">
        <label className="block text-sm font-semibold text-navy">Name *<input required name="name" autoComplete="name" className={field} placeholder="Your name" maxLength={120} /></label>
        <label className="block text-sm font-semibold text-navy">Company<input name="company" autoComplete="organization" className={field} placeholder="Organization name" maxLength={160} /></label>
        <label className="block text-sm font-semibold text-navy">Email *<input required type="email" name="email" autoComplete="email" className={field} placeholder="you@company.com" maxLength={160} /></label>
        <label className="block text-sm font-semibold text-navy">Phone<input type="tel" name="phone" autoComplete="tel" className={field} placeholder="+91" maxLength={30} /></label>
      </div>
      <label className="block text-sm font-semibold text-navy">Service required
        <select name="service" defaultValue={defaultService} className={field}><option value="">Select a service area</option>{services.map((s) => <option key={s}>{s}</option>)}</select>
      </label>
      <label className="block text-sm font-semibold text-navy">Message *<textarea required name="message" rows={5} defaultValue={defaultMessage} className={field} placeholder="What would you like to explore?" maxLength={4000} /></label>
      <Button type="submit" disabled={state === 'sending'}>{state === 'sending' ? 'Sending…' : <>Send an enquiry <span aria-hidden>↗</span></>}</Button>
      <p role="status" aria-live="polite" className={`text-sm ${state === 'error' ? 'text-red-700' : 'text-muted'}`}>{note}</p>
    </form>
  );
}
