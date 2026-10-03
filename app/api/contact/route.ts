import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>(); // best-effort, per server instance

function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > MAX_PER_WINDOW;
}

const clean = (v: unknown, max: number) => String(v ?? '').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max);
const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export async function POST(req: Request) {
  const ip = (req.headers.get('x-forwarded-for') || 'unknown').split(',')[0].trim();
  if (limited(ip)) return NextResponse.json({ message: 'Too many enquiries from this connection. Please try again later or call us.' }, { status: 429 });

  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ message: 'Invalid request.' }, { status: 400 }); }

  if (clean(body.website, 50)) return NextResponse.json({ ok: true }); // honeypot: pretend success

  const name = clean(body.name, 120), email = clean(body.email, 160), message = clean(body.message, 4000);
  const company = clean(body.company, 160), phone = clean(body.phone, 30), service = clean(body.service, 120);
  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
    return NextResponse.json({ message: 'Please enter your name, a valid email address and a message.' }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY, to = process.env.CONTACT_TO_EMAIL, from = process.env.CONTACT_FROM_EMAIL;
  if (!apiKey || !to || !from) {
    if (process.env.NODE_ENV !== 'production') { console.log('[contact:dev] enquiry (email not configured):', { name, email, company, phone, service, message }); return NextResponse.json({ ok: true, dev: true }); }
    console.error('Contact form: RESEND_API_KEY / CONTACT_TO_EMAIL / CONTACT_FROM_EMAIL are not configured.');
    return NextResponse.json({ message: 'Our enquiry form is temporarily unavailable. Please call or email us directly.' }, { status: 503 });
  }

  const html = `<h2>New website enquiry</h2><p><b>Name:</b> ${esc(name)}<br><b>Company:</b> ${esc(company) || '—'}<br><b>Email:</b> ${esc(email)}<br><b>Phone:</b> ${esc(phone) || '—'}<br><b>Service:</b> ${esc(service) || '—'}</p><p style="white-space:pre-wrap">${esc(message)}</p>`;
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject: `Website enquiry: ${service || 'General'} — ${name}`, html })
    });
    if (!res.ok) { console.error('Resend error', res.status, await res.text()); throw new Error('send failed'); }
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ message: 'We could not send your enquiry. Please call or email us directly.' }, { status: 502 });
  }
}
