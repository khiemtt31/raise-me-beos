import assert from 'node:assert/strict';
import { test } from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import worker, { ContactQuota } from '../src/worker.ts';

const valid = { name: 'Visitor', email: 'visitor@example.com', message: 'Hello' };
const origin = 'https://portfolio.example';

function fixture(t, { throttle = false, quotaFail = false, provider = 'ok' } = {}) {
  const db = new DatabaseSync(':memory:');
  const quota = new ContactQuota({ storage: { sql: { exec(query, ...args) {
    const statement = db.prepare(query);
    if (query.trim().startsWith('SELECT')) return { toArray: () => statement.all(...args) };
    statement.run(...args);
    return { toArray: () => [] };
  } } } });
  t.after(() => db.close());
  const calls = { attempts: [], quota: [], provider: [] };
  t.mock.method(globalThis, 'fetch', async (url, options) => {
    calls.provider.push({ url, options });
    assert.ok(options.signal instanceof AbortSignal);
    assert.equal(options.redirect, 'error');
    if (provider === 'oauth-fail') return new Response('', { status: 503 });
    if (String(url).includes('/token')) return Response.json({ access_token: 'mock-token' });
    if (provider === 'send-fail') throw new Error('Simulated lost response');
    return Response.json({ id: 'mock-message' });
  });
  const env = {
    CONTACT_EMAIL: 'owner@example.com', GOOGLE_CLIENT_ID: 'mock',
    GOOGLE_CLIENT_SECRET: 'mock', GOOGLE_REFRESH_TOKEN: 'mock',
    CONTACT_ATTEMPTS: { limit: async ({ key }) => {
      calls.attempts.push(key);
      return { success: !throttle };
    } },
    CONTACT_QUOTA: { idFromName: name => name, get: () => ({ fetch: async request => {
      calls.quota.push(await request.clone().json());
      if (quotaFail) throw new Error('Unavailable');
      return quota.fetch(request);
    } }) },
    ASSETS: { fetch: async () => new Response('asset') },
  };
  const send = (body = valid, headers = {}, method = 'POST') => worker.fetch(new Request(`${origin}/api/contact`, {
    method,
    headers: { Origin: origin, 'Content-Type': 'application/json', 'CF-Connecting-IP': '192.0.2.1', ...headers },
    ...(method === 'GET' ? {} : { body: typeof body === 'string' ? body : JSON.stringify(body) }),
  }), env);
  return { send, calls, env, db };
}

test('valid contact preserves plain text, fixed recipient, and safe response headers', async t => {
  const { send, calls } = fixture(t);
  const response = await send({ ...valid, name: 'Visitor\r\nBcc: bad', message: '<script>alert(1)</script>' });
  assert.equal(response.status, 200);
  assert.equal(calls.provider.length, 2);
  const mime = Buffer.from(JSON.parse(calls.provider[1].options.body).raw, 'base64url').toString();
  assert.match(mime, /To: owner@example.com/);
  assert.match(mime, /Content-Type: text\/plain/);
  assert.doesNotMatch(mime.split('\r\n\r\n')[0], /\r\nBcc:/);
  assert.equal(response.headers.get('x-content-type-options'), 'nosniff');
  assert.equal(response.headers.get('cache-control'), 'no-store');
  assert.match(response.headers.get('content-security-policy'), /frame-ancestors 'none'/);
});

test('malformed, overlong, unknown and incorrectly typed fields never reserve quota', async t => {
  const { send, calls } = fixture(t);
  for (const payload of ['{', 'null', '[]', 'true', { ...valid, name: 'x'.repeat(81) },
    { ...valid, email: 'bad\r\n@example.com' }, { ...valid, message: {} },
    { ...valid, message: 'x'.repeat(3001) }, { ...valid, extra: 'unexpected' }]) {
    assert.equal((await send(payload)).status, 400);
  }
  assert.equal(calls.quota.length, 0);
  assert.equal(calls.provider.length, 0);
});

test('actual bytes override absent or misleading content length', async t => {
  const { send, calls } = fixture(t);
  for (const headers of [{}, { 'Content-Length': '1' }, { 'Content-Length': '65536' }]) {
    assert.equal((await send({ ...valid, message: '😀'.repeat(9000) }, headers)).status, 413);
  }
  assert.equal(calls.quota.length, 0);
});

test('stream stops at byte cap and slow bodies expire', async t => {
  const { env, calls } = fixture(t);
  let cancelled = false;
  const stream = new ReadableStream({ start(controller) { controller.enqueue(new Uint8Array(32769)); }, cancel() { cancelled = true; } });
  const request = body => new Request(`${origin}/api/contact`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body, duplex: 'half' });
  assert.equal((await worker.fetch(request(stream), env)).status, 413);
  assert.ok(cancelled);
  assert.equal((await worker.fetch(request(new ReadableStream()), env)).status, 408);
  assert.equal(calls.quota.length, 0);
});

test('only exact supported media types and unambiguous form fields are accepted', async t => {
  const { send, calls } = fixture(t);
  for (const type of ['multipart/form-data; boundary=abc', 'text/plain', 'fake/application/json']) {
    assert.equal((await send(valid, { 'Content-Type': type })).status, 415);
  }
  assert.equal(calls.quota.length, 0);
  const form = new URLSearchParams(valid).toString();
  assert.equal((await send(form + '&name=duplicate', { 'Content-Type': 'application/x-www-form-urlencoded' })).status, 400);
  assert.equal((await send(form, { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' })).status, 200);
});

test('origin and method checks reject before side effects', async t => {
  const { send, calls } = fixture(t);
  for (const bad of ['', 'null', 'https://other.example']) assert.equal((await send(valid, { Origin: bad })).status, 403);
  assert.equal((await send(valid, { 'Sec-Fetch-Site': 'cross-site' })).status, 403);
  assert.equal((await send(valid, {}, 'GET')).status, 405);
  assert.equal(calls.attempts.length, 0);
});

test('throttling rejects before parsing and never calls quota/provider', async t => {
  const { send, calls } = fixture(t, { throttle: true });
  const response = await send('{', { 'X-Forwarded-For': 'spoofed' });
  assert.equal(response.status, 429);
  assert.equal(response.headers.get('retry-after'), '60');
  assert.deepEqual(calls.attempts, ['contact:192.0.2.1']);
  assert.equal(calls.quota.length, 0);
});

test('limiter and quota outages return controlled 503 without sending', async t => {
  const { send, calls, env } = fixture(t, { quotaFail: true });
  assert.equal((await send()).status, 503);
  env.CONTACT_ATTEMPTS = undefined;
  assert.equal((await send()).status, 503);
  assert.equal(calls.provider.length, 0);
});

test('successful sends still respect the persistent weekly budget', async t => {
  const { send, calls } = fixture(t);
  for (let i = 0; i < 5; i++) assert.equal((await send()).status, 200);
  assert.equal((await send()).status, 429);
  assert.equal(calls.provider.length, 10);
});

test('OAuth failure refunds delivery budget but every attempt is counted', async t => {
  const { send, calls } = fixture(t, { provider: 'oauth-fail' });
  for (let i = 0; i < 6; i++) assert.equal((await send()).status, 502);
  assert.equal(calls.attempts.length, 6);
  assert.equal(calls.quota.filter(call => call.action === 'release').length, 6);
});

test('uncertain Gmail delivery retains its slot and never retries or refunds', async t => {
  const { send, calls } = fixture(t, { provider: 'send-fail' });
  for (let i = 0; i < 5; i++) assert.equal((await send()).status, 502);
  assert.equal((await send()).status, 429);
  assert.equal(calls.quota.filter(call => call.action === 'release').length, 0);
  assert.equal(calls.provider.length, 10);
});

test('explicit filled honeypot is harmless and cannot send', async t => {
  const { send, calls } = fixture(t);
  assert.equal((await send({ ...valid, companyWebsite: 'bot' })).status, 202);
  assert.equal(calls.quota.length, 0);
});
