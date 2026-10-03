const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

let pool;
let initPromise;
function fallbackRecords(file) { try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { return []; } }
function fallbackWrite(file, records) { fs.mkdirSync(path.dirname(file), { recursive: true }); fs.writeFileSync(file, JSON.stringify(records, null, 2)); }
function fallbackEvents(file) { return fallbackRecords(file.replace(/bookings\.json$/, 'processed-events.json')); }
function saveFallbackEvent(file, eventId, eventType) { const eventFile = file.replace(/bookings\.json$/, 'processed-events.json'); const events = fallbackEvents(file); if (!events.some((event) => event.id === eventId)) { events.push({ id: eventId, type: eventType || 'unknown', processedAt: new Date().toISOString() }); fallbackWrite(eventFile, events); } }
function poolConfig() {
  const parsed = new URL(process.env.DATABASE_URL);
  return { host: parsed.hostname, port: parsed.port ? Number(parsed.port) : 3306, user: decodeURIComponent(parsed.username), password: decodeURIComponent(parsed.password), database: parsed.pathname.replace(/^\//, ''), waitForConnections: true, connectionLimit: 4, ssl: { rejectUnauthorized: true } };
}
async function db() {
  if (!process.env.DATABASE_URL) return null;
  if (!initPromise) {
    initPromise = (async () => {
      pool = mysql.createPool(poolConfig());
      await pool.query(`CREATE TABLE IF NOT EXISTS vcs_bookings (reference VARCHAR(64) PRIMARY KEY, idempotency_key CHAR(64) NOT NULL UNIQUE, batch_id VARCHAR(160) NOT NULL, payment_id VARCHAR(255) UNIQUE NULL, payment_status VARCHAR(32) NOT NULL, payload JSON NOT NULL, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)`);
      await pool.query(`CREATE TABLE IF NOT EXISTS vcs_processed_events (event_id VARCHAR(255) PRIMARY KEY, event_type VARCHAR(120) NOT NULL, processed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`);
      return pool;
    })().catch((error) => { initPromise = null; pool = null; console.error('Database initialization unavailable:', error.message); return null; });
  }
  return initPromise;
}
async function listBookings(file) {
  const connection = await db();
  if (!connection) return fallbackRecords(file);
  const [rows] = await connection.query('SELECT payload FROM vcs_bookings ORDER BY created_at DESC');
  return rows.map((row) => typeof row.payload === 'string' ? JSON.parse(row.payload) : row.payload);
}
async function findByReference(reference, file) {
  const connection = await db();
  if (!connection) return fallbackRecords(file).find((record) => record.reference === reference) || null;
  const [rows] = await connection.query('SELECT payload FROM vcs_bookings WHERE reference = ? LIMIT 1', [reference]);
  if (!rows.length) return null;
  return typeof rows[0].payload === 'string' ? JSON.parse(rows[0].payload) : rows[0].payload;
}
async function findByIdempotency(key, file) {
  const connection = await db();
  if (!connection) return fallbackRecords(file).find((record) => record.idempotencyKey === key) || null;
  const [rows] = await connection.query('SELECT payload FROM vcs_bookings WHERE idempotency_key = ? LIMIT 1', [key]);
  if (!rows.length) return null;
  return typeof rows[0].payload === 'string' ? JSON.parse(rows[0].payload) : rows[0].payload;
}
async function upsertBooking(record, file) {
  const connection = await db();
  if (!connection) {
    const records = fallbackRecords(file);
    const index = records.findIndex((entry) => entry.reference === record.reference || entry.idempotencyKey === record.idempotencyKey);
    if (index >= 0) records[index] = { ...records[index], ...record }; else records.push(record);
    fallbackWrite(file, records);
    return;
  }
  await connection.query(`INSERT INTO vcs_bookings (reference, idempotency_key, batch_id, payment_id, payment_status, payload) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE payment_id = VALUES(payment_id), payment_status = VALUES(payment_status), payload = VALUES(payload)`, [record.reference, record.idempotencyKey, record.batchId, record.paymentId || null, record.paymentStatus, JSON.stringify(record)]);
}
async function hasProcessedEvent(eventId, file) {
  const connection = await db();
  if (!connection) return fallbackEvents(file).some((event) => event.id === eventId);
  const [rows] = await connection.query('SELECT event_id FROM vcs_processed_events WHERE event_id = ? LIMIT 1', [eventId]);
  return rows.length > 0;
}
async function markProcessedEvent(eventId, eventType, file) {
  const connection = await db();
  if (!connection) return saveFallbackEvent(file, eventId, eventType);
  await connection.query('INSERT IGNORE INTO vcs_processed_events (event_id, event_type) VALUES (?, ?)', [eventId, eventType || 'unknown']);
}
module.exports = { listBookings, findByReference, findByIdempotency, upsertBooking, hasProcessedEvent, markProcessedEvent };
