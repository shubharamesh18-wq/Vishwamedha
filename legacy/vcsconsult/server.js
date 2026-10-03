const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const storage = require('./storage');

const root = path.join(__dirname, 'public');
const dataRoot = path.join(root, 'data');
const batchFile = path.join(dataRoot, 'batches.json');
const bookingFile = path.join(dataRoot, 'bookings.json');
const port = Number(process.env.PORT || 3000);
const mime = { '.html':'text/html; charset=utf-8', '.css':'text/css; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.svg':'image/svg+xml', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.png':'image/png', '.webp':'image/webp' };

function readJson(file, fallback) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return fallback; } }
function writeJson(file, value) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(value, null, 2)); }
function batchesConfig() { return readJson(batchFile, { adminNotificationEmail: '[VCS ADMIN EMAIL]', taxRate: null, batches: [] }); }
function publicBatches() { const config = batchesConfig(); return config.batches.map((batch) => ({ ...batch, seatsRemaining: Number.isFinite(batch.maxSeats) ? Math.max(batch.maxSeats - (batch.seatsBooked || 0), 0) : null })); }
function sendJson(res, status, payload) { res.writeHead(status, { 'Content-Type':'application/json; charset=utf-8', 'Cache-Control':'no-store' }); res.end(JSON.stringify(payload)); }
function bodyJson(req) { return new Promise((resolve, reject) => { let body = ''; req.on('data', (chunk) => { body += chunk; if (body.length > 1_000_000) reject(new Error('payload_too_large')); }); req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('invalid_json')); } }); req.on('error', reject); }); }
function validateBooking(input) { return ['fullName','email','mobile','company','designation','city','participants','selectedBatch','billingName','billingAddress'].filter((key) => !String(input[key] ?? '').trim()); }
function batchFor(id) { return publicBatches().find((batch) => batch.id === id); }
function amountFor(batch, participants) { const fee = Number(batch?.feeInr); return Number.isFinite(fee) && fee > 0 ? Math.round(fee * Number(participants || 1)) : null; }
function browserOrigin(req) { if (process.env.PUBLIC_APP_URL) return process.env.PUBLIC_APP_URL.replace(/\/$/, ''); const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0]; return `${proto}://${req.headers['x-forwarded-host'] || req.headers.host}`; }
function idempotencyKey(req) { const supplied = String(req.headers['idempotency-key'] || '').trim(); return /^[A-Za-z0-9._:-]{16,128}$/.test(supplied) ? supplied : crypto.randomBytes(32).toString('hex'); }

async function createStripeCheckout(req, record, amountInr) {
  const secret = process.env.STRIPE_SECRET_KEY || process.env.PAYMENT_KEY_SECRET;
  if (!secret) return null;
  const params = new URLSearchParams({ mode:'payment', currency:'inr', success_url:`${browserOrigin(req)}/booking/success?ref=${encodeURIComponent(record.reference)}&status=Payment%20Pending`, cancel_url:`${browserOrigin(req)}/academy?payment=cancelled&ref=${encodeURIComponent(record.reference)}`, client_reference_id:record.reference, customer_email:record.email, allow_promotion_codes:'true', 'line_items[0][price_data][currency]':'inr', 'line_items[0][price_data][product_data][name]':record.courseName, 'line_items[0][price_data][product_data][description]':`VCS training booking ${record.reference}`, 'line_items[0][price_data][unit_amount]':String(Math.round(amountInr * 100)), 'line_items[0][quantity]':'1', 'metadata[booking_reference]':record.reference, 'metadata[batch_id]':record.batchId, 'metadata[idempotency_key]':record.idempotencyKey });
  const response = await fetch('https://api.stripe.com/v1/checkout/sessions', { method:'POST', headers:{ Authorization:`Basic ${Buffer.from(`${secret}:`).toString('base64')}`, 'Content-Type':'application/x-www-form-urlencoded' }, body:params });
  const data = await response.json(); if (!response.ok) throw new Error(data?.error?.message || 'payment_provider_error'); return { id:data.id, url:data.url };
}
function verifyStripeSignature(rawBody, signature, secret) {
  if (!signature || !secret) return false;
  const parts = signature.split(',').reduce((acc, part) => { const [key, value] = part.split('='); if (key && value) (acc[key] ||= []).push(value); return acc; }, {});
  const timestamp = Number(parts.t?.[0]); const age = Math.abs(Date.now() / 1000 - timestamp);
  if (!timestamp || age > 300 || !parts.v1?.length) return false;
  const expected = crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  return parts.v1.some((candidate) => candidate.length === expected.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(candidate)));
}
async function handleBooking(req, res) {
  const input = await bodyJson(req); const missing = validateBooking(input); if (missing.length) return sendJson(res, 400, { error:'missing_required_fields', fields:missing });
  const key = idempotencyKey(req); const existing = await storage.findByIdempotency(key, bookingFile); if (existing) { if (existing.checkoutUrl) return sendJson(res, 200, { reference:existing.reference, checkoutUrl:existing.checkoutUrl, paymentStatus:existing.paymentStatus, amountInr:existing.amountInr, replayed:true }); return sendJson(res, 409, { error:'booking_in_progress', message:'A secure payment attempt is already being prepared for this booking. Please wait or use the same payment attempt again.', reference:existing.reference, paymentStatus:existing.paymentStatus }); }
  const batch = batchFor(input.selectedBatch); if (!batch) return sendJson(res, 404, { error:'batch_not_found' });
  const participants = Math.max(1, Number(input.participants || 1)); if (Number.isFinite(batch.seatsRemaining) && participants > batch.seatsRemaining) return sendJson(res, 409, { error:'insufficient_seats', seatsRemaining:batch.seatsRemaining });
  const amountInr = amountFor(batch, participants); const reference = `VCS-${new Date().getUTCFullYear()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
  const record = { reference, idempotencyKey:key, batchId:batch.id, courseName:batch.courseName, email:input.email, fullName:input.fullName, mobile:input.mobile, company:input.company, designation:input.designation, city:input.city, participants, billingName:input.billingName, billingAddress:input.billingAddress, gstNumber:input.gstNumber || '', message:input.message || '', amountInr, paymentStatus:'pending', createdAt:new Date().toISOString(), paymentId:null, checkoutUrl:null };
  const records = await storage.listBookings(bookingFile); const duplicate = records.find((entry) => entry.email === record.email && entry.batchId === record.batchId && ['paid','pending'].includes(entry.paymentStatus)); if (duplicate) return sendJson(res, 409, { error:'duplicate_booking', reference:duplicate.reference, paymentStatus:duplicate.paymentStatus });
  if (!amountInr) return sendJson(res, 503, { error:'payment_not_configured', message:'Secure payment will open once VCS confirms this batch fee and activates the payment gateway.', reference });
  try {
    await storage.upsertBooking(record, bookingFile);
    const checkout = await createStripeCheckout(req, record, amountInr); if (!checkout) { record.paymentStatus = 'failed_to_start'; await storage.upsertBooking(record, bookingFile); return sendJson(res, 503, { error:'payment_not_configured', message:'Secure payment is not configured for this batch yet.', reference }); }
    record.paymentId = checkout.id; record.checkoutUrl = checkout.url; await storage.upsertBooking(record, bookingFile); return sendJson(res, 200, { reference, checkoutUrl:checkout.url, paymentStatus:'pending', amountInr });
  } catch { record.paymentStatus = 'failed_to_start'; await storage.upsertBooking(record, bookingFile); return sendJson(res, 502, { error:'payment_provider_error', message:'Payment could not be started. No seat was confirmed. Please try payment again.', reference }); }
}
async function handleBookingStatus(req, res, reference) {
  const record = await storage.findByReference(reference, bookingFile);
  if (!record) return sendJson(res, 404, { error:'booking_not_found' });
  return sendJson(res, 200, { reference:record.reference, courseName:record.courseName, batchId:record.batchId, fullName:record.fullName, participants:record.participants, amountInr:record.amountInr, paymentStatus:record.paymentStatus });
}
async function allocateSeats(record) {
  const config = batchesConfig(); const batch = config.batches.find((entry) => entry.id === record.batchId); if (!batch || !Number.isFinite(batch.maxSeats)) return;
  const alreadyCounted = Number(batch.seatsBooked || 0); const records = await storage.listBookings(bookingFile); const paidParticipants = records.filter((entry) => entry.batchId === record.batchId && entry.paymentStatus === 'paid').reduce((sum, entry) => sum + Number(entry.participants || 0), 0);
  batch.seatsBooked = Math.min(batch.maxSeats, Math.max(alreadyCounted, paidParticipants)); writeJson(batchFile, config);
}
async function handleWebhook(req, res) {
  let raw = ''; req.on('data', (chunk) => { raw += chunk; }); req.on('end', async () => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET; if (!verifyStripeSignature(raw, req.headers['stripe-signature'], secret)) return sendJson(res, 400, { error:'invalid_signature' });
    let event; try { event = JSON.parse(raw); } catch { return sendJson(res, 400, { error:'invalid_json' }); }
    if (!event.id) return sendJson(res, 400, { error:'missing_event_id' });
    if (await storage.hasProcessedEvent(event.id, bookingFile)) return sendJson(res, 200, { received:true, duplicate:true });
    const object = event.data?.object || {}; const reference = object.metadata?.booking_reference || object.client_reference_id; const records = await storage.listBookings(bookingFile); const record = records.find((entry) => entry.reference === reference);
    if (record) {
      const succeeded = event.type === 'payment_intent.succeeded' || (event.type === 'checkout.session.completed' && object.payment_status === 'paid');
      const failed = event.type === 'payment_intent.payment_failed' || (event.type === 'checkout.session.async_payment_failed');
      if (succeeded && record.paymentStatus !== 'paid') { record.paymentStatus = 'paid'; record.paymentId = object.payment_intent || object.id || record.paymentId; record.updatedAt = new Date().toISOString(); await storage.upsertBooking(record, bookingFile); await allocateSeats(record); }
      else if (failed && record.paymentStatus !== 'paid') { record.paymentStatus = 'failed'; record.paymentId = object.payment_intent || object.id || record.paymentId; record.updatedAt = new Date().toISOString(); await storage.upsertBooking(record, bookingFile); }
      else if (event.type === 'checkout.session.async_payment_succeeded' && record.paymentStatus !== 'paid' && object.payment_status === 'paid') { record.paymentStatus = 'paid'; record.paymentId = object.payment_intent || object.id || record.paymentId; await storage.upsertBooking(record, bookingFile); await allocateSeats(record); }
    }
    await storage.markProcessedEvent(event.id, event.type, bookingFile); return sendJson(res, 200, { received:true });
  });
}
function adminAuthorized(req) { return Boolean(process.env.ADMIN_API_TOKEN && req.headers['x-admin-token'] && req.headers['x-admin-token'] === process.env.ADMIN_API_TOKEN); }
async function handleAdmin(req, res, pathname) { if (!adminAuthorized(req)) return sendJson(res, 404, { error:'not_found' }); if (req.method === 'GET' && pathname === '/api/admin/batches') return sendJson(res, 200, batchesConfig()); if (req.method === 'GET' && pathname === '/api/admin/bookings') return sendJson(res, 200, await storage.listBookings(bookingFile)); if (req.method === 'PUT' && pathname === '/api/admin/batches') { const next = await bodyJson(req); if (!Array.isArray(next.batches)) return sendJson(res, 400, { error:'batches_array_required' }); writeJson(batchFile, next); return sendJson(res, 200, { ok:true }); } return sendJson(res, 404, { error:'not_found' }); }
function serveStatic(req, res, pathname) { const routeMap = { '/':'/index.html', '/academy':'/academy.html', '/booking/success':'/booking-success.html' }; const filePath = path.normalize(path.join(root, routeMap[pathname] || pathname)); if (!filePath.startsWith(root)) return sendJson(res, 403, { error:'forbidden' }); fs.readFile(filePath, (error, data) => { if (error) return sendJson(res, error.code === 'ENOENT' ? 404 : 500, { error:error.code === 'ENOENT' ? 'not_found' : 'server_error' }); res.writeHead(200, { 'Content-Type':mime[path.extname(filePath).toLowerCase()] || 'application/octet-stream', 'Cache-Control':'no-cache' }); res.end(data); }); }
const server = http.createServer(async (req, res) => { const pathname = decodeURIComponent((req.url || '/').split('?')[0]); try { if (pathname === '/api/maps-config' && req.method === 'GET') return sendJson(res, 200, { apiBase:process.env.MANUS_API_URL || '', browserKey:process.env.MANUS_API_BROWSER_KEY || '' }); if (pathname === '/api/batches' && req.method === 'GET') return sendJson(res, 200, { batches:publicBatches(), taxRate:batchesConfig().taxRate }); if (pathname === '/api/bookings' && req.method === 'POST') return await handleBooking(req, res); if (pathname.startsWith('/api/bookings/') && req.method === 'GET') return await handleBookingStatus(req, res, pathname.slice('/api/bookings/'.length)); if (pathname === '/api/stripe/webhook' && req.method === 'POST') return await handleWebhook(req, res); if (pathname.startsWith('/api/admin/')) return await handleAdmin(req, res, pathname); return serveStatic(req, res, pathname); } catch (error) { return sendJson(res, 500, { error:error.message || 'server_error' }); } });
server.listen(port, '0.0.0.0', () => console.log(`VCS site listening on ${port}`));
