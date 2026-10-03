const menuToggle = document.querySelector('.menu-toggle');
const primaryNav = document.querySelector('.primary-nav');

menuToggle?.addEventListener('click', () => {
  const isOpen = primaryNav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});
document.querySelectorAll('.primary-nav a').forEach((link) => link.addEventListener('click', () => { primaryNav?.classList.remove('open'); menuToggle?.setAttribute('aria-expanded', 'false'); }));

document.querySelectorAll('.accordion-item button').forEach((button) => button.addEventListener('click', () => {
  const item = button.closest('.accordion-item');
  const isOpen = item.classList.toggle('open');
  button.setAttribute('aria-expanded', String(isOpen));
  button.querySelector('b').textContent = isOpen ? '−' : '+';
}));

const revealItems = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); } }), { threshold: 0.12 });
  revealItems.forEach((item) => revealObserver.observe(item));
} else revealItems.forEach((item) => item.classList.add('visible'));

const money = (value) => Number.isFinite(Number(value)) ? `₹${Number(value).toLocaleString('en-IN')}` : 'To be configured';
const dateLabel = (value) => value ? new Intl.DateTimeFormat('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }).format(new Date(`${value}T00:00:00`)) : 'Date to be confirmed';
const batchStore = new Map();
const batchList = document.querySelectorAll('[data-batch-list]');

function batchCard(batch) {
  batchStore.set(batch.id, batch);
  const seats = Number.isFinite(batch.seatsRemaining) ? (batch.seatsRemaining === 0 ? 'Batch Full' : `Only ${batch.seatsRemaining} seats remaining`) : 'Seats to be configured';
  const actionLabel = batch.seatsRemaining === 0 ? 'Join Waiting List' : 'Book Your Slot';
  return `<article class="batch-card reveal"><div class="batch-card-top"><span>${batch.isoVersion || 'ISO version to be configured'}</span><span class="batch-status">${batch.status === 'draft' ? 'Configuration placeholder' : batch.status}</span></div><h3>${batch.courseName}</h3><p class="batch-description">${batch.description || 'Course details to be provided by VCS.'}</p><div class="batch-meta"><div><span>Course type</span><b>${batch.courseType || 'To be configured'}</b></div><div><span>Mode</span><b>${batch.mode || 'To be configured'}</b></div><div><span>Batch dates</span><b>${dateLabel(batch.startDate)}${batch.endDate ? ` — ${dateLabel(batch.endDate)}` : ''}</b></div><div><span>Timings</span><b>${batch.timings || 'To be configured'}</b></div><div><span>Duration</span><b>${batch.duration || 'To be configured'}</b></div><div><span>Fee</span><b>${money(batch.feeInr)}${batch.feeInr ? ' + applicable taxes' : ''}</b></div></div><div class="batch-card-bottom"><span class="batch-seats">${seats}</span><div class="batch-actions"><button class="button button-gold batch-book" type="button" data-book-batch="${batch.id}">${actionLabel} <span>↗</span></button><a class="batch-details-link" href="${location.pathname === '/academy' ? '#booking-faq' : '/academy#upcoming-batches'}">View Course Details <span>↘</span></a></div></div></article>`;
}
async function loadBatches() {
  if (!batchList.length) return;
  try {
    const response = await fetch('/api/batches');
    const payload = await response.json();
    batchList.forEach((list) => { list.innerHTML = (payload.batches || []).map(batchCard).join(''); list.querySelectorAll('.reveal').forEach((item) => item.classList.add('visible')); });
    document.querySelectorAll('[data-book-batch]').forEach((button) => button.addEventListener('click', () => openBooking(batchStore.get(button.dataset.bookBatch))));
  } catch {
    batchList.forEach((list) => { list.innerHTML = '<p class="batch-empty">Upcoming batch details will be published here once confirmed by VCS.</p>'; });
  }
}
loadBatches();

const modal = document.querySelector('#booking-modal');
const bookingForm = document.querySelector('#booking-form');
const bookingStatus = document.querySelector('.booking-status');
const retryButton = document.querySelector('.retry-payment');
let activeBatch = null;
let bookingAttemptKey = null;
const newBookingAttemptKey = () => window.crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(16).slice(2)}`;
function openBooking(batch) {
  if (!modal || !batch) return;
  activeBatch = batch;
  bookingAttemptKey = newBookingAttemptKey();
  modal.setAttribute('aria-hidden', 'false');
  modal.classList.add('open');
  const selectedBatch = bookingForm?.querySelector('[name="selectedBatch"]');
  const selectedBatchLabel = bookingForm?.querySelector('[name="selectedBatchLabel"]');
  selectedBatch?.setAttribute('value', batch.id);
  if (selectedBatchLabel) selectedBatchLabel.value = `${batch.courseName} / ${batch.isoVersion || 'Version to be configured'}`;
  document.querySelector('[data-summary="fee"]').textContent = money(batch.feeInr);
  document.querySelector('[data-summary="tax"]').textContent = 'To be configured';
  document.querySelector('[data-summary="total"]').textContent = money(batch.feeInr);
  document.querySelector('[data-summary="participants"]').textContent = bookingForm?.querySelector('[name="participants"]').value || '1';
  bookingStatus.textContent = '';
  if (retryButton) retryButton.hidden = true;
  modal.querySelector('input')?.focus();
  document.body.classList.add('modal-open');
}
function closeBooking() { modal?.classList.remove('open'); modal?.setAttribute('aria-hidden', 'true'); document.body.classList.remove('modal-open'); }
document.querySelectorAll('[data-close-modal]').forEach((item) => item.addEventListener('click', closeBooking));
document.addEventListener('keydown', (event) => { if (event.key === 'Escape') closeBooking(); });
retryButton?.addEventListener('click', () => { bookingAttemptKey = newBookingAttemptKey(); retryButton.hidden = true; bookingForm?.requestSubmit(); });
bookingForm?.querySelector('[name="participants"]')?.addEventListener('input', (event) => {
  const participants = Math.max(1, Number(event.target.value || 1));
  document.querySelector('[data-summary="participants"]').textContent = String(participants);
  const total = Number(activeBatch?.feeInr) * participants;
  document.querySelector('[data-summary="total"]').textContent = Number.isFinite(total) && total > 0 ? money(total) : 'To be configured';
});
bookingForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  bookingStatus.textContent = 'Preparing a secure payment handoff…';
  const payload = Object.fromEntries(new FormData(bookingForm).entries());
  payload.participants = Number(payload.participants || 1);
  const idempotencyKey = bookingAttemptKey || (bookingAttemptKey = newBookingAttemptKey());
  try {
    const response = await fetch('/api/bookings', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Idempotency-Key': idempotencyKey }, body: JSON.stringify(payload) });
    const result = await response.json();
    if (result.checkoutUrl) { window.location.href = result.checkoutUrl; return; }
    bookingStatus.textContent = result.message || (result.error === 'payment_provider_error' ? 'Payment could not be started. No seat was confirmed. Try payment again.' : 'Payment is pending configuration. No seat was confirmed.');
    if (result.error !== 'booking_in_progress' && result.error !== 'duplicate_booking') bookingAttemptKey = newBookingAttemptKey();
    if (retryButton && ['payment_provider_error', 'payment_not_configured'].includes(result.error)) retryButton.hidden = false;
    if (result.reference) bookingStatus.textContent += ` Reference: ${result.reference}`;
  } catch { bookingStatus.textContent = 'The booking service is temporarily unavailable. No seat was confirmed. Please try again.'; }
});

const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('.form-status');
contactForm?.addEventListener('submit', (event) => { event.preventDefault(); contactStatus.textContent = 'Thank you — your enquiry is ready for the VCS team. Contact details will be connected once supplied.'; contactForm.reset(); });

const mapContainer = document.querySelector('#vcs-map');
const officeAddress = 'No 07, 4th floor, 6th A main road, 3rd block, Thygarajanagar, Bangalore 560070, India';
const showMapFallback = () => { if (mapContainer) mapContainer.innerHTML = '<span>Use the Google Maps link below for directions.</span>'; };
window.initVcsMap = () => {
  if (!mapContainer || !window.google?.maps) return showMapFallback();
  const map = new google.maps.Map(mapContainer, { zoom: 16, center: { lat: 12.9352, lng: 77.5837 }, mapTypeControl: false, streetViewControl: false, fullscreenControl: false, styles: [{ elementType: 'geometry', stylers: [{ color: '#10283a' }] }, { elementType: 'labels.text.fill', stylers: [{ color: '#d8d9d4' }] }, { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2c5064' }] }, { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#071723' }] }] });
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: officeAddress }, (results, status) => {
    if (status === 'OK' && results?.[0]) { map.setCenter(results[0].geometry.location); new google.maps.Marker({ map, position: results[0].geometry.location, title: 'Vishwamedha Consultancy Services' }); }
  });
};
if (mapContainer) fetch('/api/maps-config').then((response) => response.json()).then((config) => {
  if (!config.apiBase || !config.browserKey) return showMapFallback();
  const script = document.createElement('script'); script.async = true; script.defer = true; script.src = `${config.apiBase}/v1/maps/proxy/maps/api/js?key=${encodeURIComponent(config.browserKey)}&callback=initVcsMap`; script.onerror = showMapFallback; document.head.appendChild(script);
}).catch(showMapFallback);

const params = new URLSearchParams(window.location.search);
const confirmationMap = { reference: params.get('ref'), course: params.get('course'), batch: params.get('batch'), participant: params.get('participant'), amount: params.get('amount'), status: params.get('status') };
Object.entries(confirmationMap).forEach(([key, value]) => { const target = document.querySelector(`[data-confirmation="${key}"]`); if (target && value) target.textContent = value; });
if (confirmationMap.reference && document.querySelector('[data-confirmation="status"]')) {
  fetch(`/api/bookings/${encodeURIComponent(confirmationMap.reference)}`).then((response) => response.ok ? response.json() : null).then((record) => {
    if (!record) return;
    const values = { reference:record.reference, course:record.courseName, batch:record.batchId, participant:record.fullName, amount:record.amountInr ? money(record.amountInr) : 'To be configured', status:record.paymentStatus === 'paid' ? 'Payment Confirmed' : record.paymentStatus === 'failed' ? 'Payment Failed' : 'Payment Pending' };
    Object.entries(values).forEach(([key, value]) => { const target = document.querySelector(`[data-confirmation="${key}"]`); if (target) target.textContent = value; });
  }).catch(() => {});
}
