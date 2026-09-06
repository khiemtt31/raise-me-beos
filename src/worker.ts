const WEEKLY_SEND_LIMIT = 5;
const MAX_BODY_BYTES = 32 * 1024;
const BODY_TIMEOUT_MS = 5000;
const PROVIDER_TIMEOUT_MS = 10000;

class RequestError extends Error {
	status: number;
	constructor(status: number, message: string) {
		super(message);
		this.status = status;
	}
}

class ProviderError extends Error {
	stage: 'oauth' | 'gmail';
	status?: number;
	constructor(stage: 'oauth' | 'gmail', status?: number, detail?: string) {
		super(`${stage} provider request failed${status ? ` with ${status}` : ''}${detail ? ` (${detail})` : ''}`);
		this.stage = stage;
		this.status = status;
	}
}

interface Env extends Pick<Cloudflare.Env, 'ASSETS' | 'CONTACT_QUOTA' | 'CONTACT_ATTEMPTS'> {
	CONTACT_EMAIL: string;
	GOOGLE_CLIENT_ID: string;
	GOOGLE_CLIENT_SECRET: string;
	GOOGLE_REFRESH_TOKEN: string;
}

interface ContactPayload {
	name?: unknown;
	email?: unknown;
	message?: unknown;
	companyWebsite?: unknown;
}

type QuotaRow = {
	count: number;
};

interface QuotaResult {
	ok: boolean;
	remaining: number;
}

export class ContactQuota {
	private readonly ctx: DurableObjectState;

	constructor(ctx: DurableObjectState) {
		this.ctx = ctx;
		this.ctx.storage.sql.exec(`
			CREATE TABLE IF NOT EXISTS weekly_contact_quota (
				week TEXT PRIMARY KEY,
				count INTEGER NOT NULL
			)
		`);
	}

	async fetch(request: Request): Promise<Response> {
		if (request.method !== 'POST') return json({ ok: false }, 405);

		const payload = await request.json() as { action?: string; week?: string };
		if (!payload.week || !['reserve', 'release'].includes(payload.action ?? '')) {
			return json({ ok: false }, 400);
		}

		const row = this.ctx.storage.sql
			.exec<QuotaRow>('SELECT count FROM weekly_contact_quota WHERE week = ?', payload.week)
			.toArray()[0];
		const currentCount = row?.count ?? 0;

		if (payload.action === 'reserve') {
			if (currentCount >= WEEKLY_SEND_LIMIT) {
				return json({ ok: false, remaining: 0 }, 429);
			}

			this.ctx.storage.sql.exec(
				`INSERT INTO weekly_contact_quota (week, count)
				 VALUES (?, 1)
				 ON CONFLICT(week) DO UPDATE SET count = count + 1`,
				payload.week,
			);

			return json({
				ok: true,
				remaining: WEEKLY_SEND_LIMIT - currentCount - 1,
			});
		}

		if (currentCount > 0) {
			this.ctx.storage.sql.exec(
				'UPDATE weekly_contact_quota SET count = count - 1 WHERE week = ?',
				payload.week,
			);
		}

		return json({ ok: true, remaining: Math.max(0, WEEKLY_SEND_LIMIT - Math.max(0, currentCount - 1)) });
	}
}

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		if (url.pathname === '/api/contact') {
			try {
				return await handleContact(request, env);
			} catch (error) {
				if (error instanceof RequestError) return json({ message: error.message }, error.status);
				console.error('Contact request unavailable');
				return json({ message: 'Contact is temporarily unavailable. Please try again later.' }, 503);
			}
		}

		return env.ASSETS.fetch(request);
	},
};

async function handleContact(request: Request, env: Env): Promise<Response> {
	if (request.method !== 'POST') {
		return json({ message: 'Method not allowed.' }, 405, { Allow: 'POST' });
	}

	const origin = request.headers.get('Origin');
	if (origin !== new URL(request.url).origin || request.headers.get('Sec-Fetch-Site') === 'cross-site') {
		return json({ message: 'Invalid request origin.' }, 403);
	}

	// Cloudflare overwrites this header at ingress. Never use X-Forwarded-For.
	// Missing metadata shares a conservative bucket, including local development.
	const client = request.headers.get('CF-Connecting-IP') || 'unknown';
	const attempt = await env.CONTACT_ATTEMPTS.limit({ key: `contact:${client}` });
	if (!attempt.success) {
		return json({ message: 'Too many attempts. Please wait a minute.' }, 429, { 'Retry-After': '60' });
	}

	const payload = await readContactPayload(request);
	if (!payload) return json({ message: 'Invalid request body.' }, 400);

	if (typeof payload.companyWebsite === 'string' && payload.companyWebsite.trim()) {
		return json({ message: 'Message received.' }, 202);
	}

	const name = normalizedText(payload.name, 80);
	const email = normalizedText(payload.email, 254);
	const message = normalizedText(payload.message, 3000);

	if (!name || !email || !message || !isEmail(email)) {
		return json({ message: 'Please provide a valid name, email, and message.' }, 400);
	}

	const missingConfiguration = (['CONTACT_EMAIL', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REFRESH_TOKEN'] as const)
		.filter((key) => !env[key]);

	if (missingConfiguration.length > 0 || !isEmail(env.CONTACT_EMAIL)) {
		console.error('Contact email configuration missing', missingConfiguration);
		return json({ message: 'Email delivery is not configured yet.' }, 503);
	}

	const week = currentWeekKey();
	const quota = await useQuota(env, 'reserve', week);
	if (!quota.ok) {
		return json({ message: 'The weekly message limit has been reached. Please try again next week.' }, 429);
	}

	let sendStarted = false;
	try {
		const accessToken = await getAccessToken(env);
		sendStarted = true;
		await sendGmailMessage(accessToken, env.CONTACT_EMAIL, { name, email, message });
		return json({ message: 'Message sent. I’ll get back to you soon.' });
	} catch (error) {
		// Once a send starts, a lost response may still mean Gmail delivered it.
		// Keep its slot and do not retry automatically on ambiguous outcomes.
		if (error instanceof ProviderError) {
			console.error(error.message);
		} else {
			console.error(sendStarted ? 'Contact delivery outcome uncertain' : 'Contact token request failed');
		}
		if (!sendStarted) {
			await useQuota(env, 'release', week).catch(() => {
				console.error('Contact quota release failed');
			});
		}
		return json({ message: sendStarted
			? 'Delivery could not be confirmed. Please avoid submitting the same message again.'
			: 'Email delivery is temporarily unavailable. Please try again later.' }, 502);
	}
}

async function useQuota(env: Env, action: 'reserve' | 'release', week: string): Promise<QuotaResult> {
	const id = env.CONTACT_QUOTA.idFromName('portfolio-contact-weekly');
	const stub = env.CONTACT_QUOTA.get(id);
	const response = await stub.fetch(new Request('https://contact-quota.internal/quota', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ action, week }),
	}));

	if (!response.ok && response.status !== 429) throw new Error('Quota unavailable');
	const result = await response.json() as QuotaResult;
	if (typeof result.ok !== 'boolean' || typeof result.remaining !== 'number') throw new Error('Invalid quota response');
	return { ok: response.ok && result.ok, remaining: result.remaining ?? 0 };
}

async function getAccessToken(env: Env): Promise<string> {
	let response: Response;
	try {
		response = await fetch('https://oauth2.googleapis.com/token', {
			signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
			redirect: 'error',
			method: 'POST',
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
			body: new URLSearchParams({
				client_id: env.GOOGLE_CLIENT_ID,
				client_secret: env.GOOGLE_CLIENT_SECRET,
				refresh_token: env.GOOGLE_REFRESH_TOKEN,
				grant_type: 'refresh_token',
			}),
		});
	} catch {
		throw new ProviderError('oauth');
	}

	let body: string;
	try {
		body = await response.text();
	} catch {
		throw new ProviderError('oauth', response.status, 'response body unavailable');
	}

	const detail = providerErrorDetail(body);
	if (!response.ok) throw new ProviderError('oauth', response.status, detail);

	let result: { access_token?: string };
	try {
		result = JSON.parse(body) as { access_token?: string };
	} catch {
		throw new ProviderError('oauth', response.status, 'invalid JSON response');
	}
	if (!result.access_token) throw new ProviderError('oauth', response.status, detail ?? 'access token missing');
	return result.access_token;
}

async function sendGmailMessage(
	accessToken: string,
	recipientEmail: string,
	contact: { name: string; email: string; message: string },
): Promise<void> {
	const subject = `Portfolio contact from ${headerSafe(contact.name)}`;
	const mimeMessage = [
		`From: Khiem Hanzo Tran <${recipientEmail}>`,
		`To: ${recipientEmail}`,
		`Reply-To: ${headerSafe(contact.email)}`,
		`Subject: ${headerSafe(subject)}`,
		'MIME-Version: 1.0',
		'Content-Type: text/plain; charset="UTF-8"',
		'Content-Transfer-Encoding: 8bit',
		'',
		`Name: ${contact.name}`,
		`Email: ${contact.email}`,
		'',
		contact.message,
	].join('\r\n');

	let response: Response;
	try {
		response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
			signal: AbortSignal.timeout(PROVIDER_TIMEOUT_MS),
			redirect: 'error',
			method: 'POST',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ raw: base64UrlEncode(mimeMessage) }),
		});
	} catch {
		throw new ProviderError('gmail');
	}

	if (!response.ok) {
		const body = await response.text().catch(() => '');
		throw new ProviderError('gmail', response.status, providerErrorDetail(body));
	}
}

function providerErrorDetail(body: string): string | undefined {
	try {
		const parsed: unknown = JSON.parse(body);
		if (!parsed || typeof parsed !== 'object') return undefined;
		const record = parsed as Record<string, unknown>;
		const code = typeof record.error === 'string' ? record.error : '';
		const description = typeof record.error_description === 'string' ? record.error_description : '';
		const detail = [code, description].filter(Boolean).join(': ');
		return detail ? detail.replace(/[\r\n]+/g, ' ').slice(0, 180) : undefined;
	} catch {
		return undefined;
	}
}

function normalizedText(value: unknown, maxLength: number): string {
	if (typeof value !== 'string' || value.length > maxLength) return '';
	return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim();
}

async function readContactPayload(request: Request): Promise<ContactPayload | null> {
	const contentType = (request.headers.get('Content-Type') ?? '').split(';', 1)[0].trim().toLowerCase();
	if (!['application/json', 'application/x-www-form-urlencoded'].includes(contentType)) {
		throw new RequestError(415, 'Unsupported request format.');
	}
	const text = await readBoundedBody(request);

	try {
		let payload: unknown;
		if (contentType === 'application/json') {
			payload = JSON.parse(text);
		} else {
			const fields = new URLSearchParams(text);
			if ([...fields.keys()].some(key => fields.getAll(key).length !== 1)) return null;
			payload = Object.fromEntries(fields);
		}
		if (!payload || typeof payload !== 'object' || Array.isArray(payload)) return null;
		const allowed = ['name', 'email', 'message', 'companyWebsite'];
		if (Object.entries(payload).some(([key, value]) => !allowed.includes(key) || typeof value !== 'string')) return null;
		return payload as ContactPayload;
	} catch {
		return null;
	}
}

async function readBoundedBody(request: Request): Promise<string> {
	const declared = request.headers.get('Content-Length');
	if (declared !== null && (!/^\d+$/.test(declared) || Number(declared) > MAX_BODY_BYTES)) {
		throw new RequestError(413, 'Request body is too large.');
	}
	if (!request.body) throw new RequestError(400, 'Invalid request body.');
	const reader = request.body.getReader();
	let timer: ReturnType<typeof setTimeout> | undefined;
	const deadline = new Promise<never>((_, reject) => {
		timer = setTimeout(() => reject(new RequestError(408, 'Request body timed out.')), BODY_TIMEOUT_MS);
	});
	const bytes = new Uint8Array(MAX_BODY_BYTES);
	let size = 0;
	try {
		while (true) {
			const { done, value } = await Promise.race([reader.read(), deadline]);
			if (done) break;
			if (size + value.byteLength > MAX_BODY_BYTES) throw new RequestError(413, 'Request body is too large.');
			bytes.set(value, size);
			size += value.byteLength;
		}
		return new TextDecoder('utf-8', { fatal: true, ignoreBOM: false }).decode(bytes.subarray(0, size));
	} catch (error) {
		void reader.cancel().catch(() => {});
		if (error instanceof RequestError) throw error;
		throw new RequestError(400, 'Invalid request body.');
	} finally {
		if (timer !== undefined) clearTimeout(timer);
		reader.releaseLock();
	}
}

function headerSafe(value: string): string {
	return value.replace(/[\r\n]/g, ' ');
}

function isEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function base64UrlEncode(value: string): string {
	const bytes = new TextEncoder().encode(value);
	let binary = '';
	for (const byte of bytes) binary += String.fromCharCode(byte);
	return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function currentWeekKey(date = new Date()): string {
	const parts = new Intl.DateTimeFormat('en-US', {
		timeZone: 'Asia/Ho_Chi_Minh',
		year: 'numeric',
		month: '2-digit',
		day: '2-digit',
	}).formatToParts(date);
	const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
	const localDate = Date.UTC(Number(values.year), Number(values.month) - 1, Number(values.day));
	const weekday = new Date(localDate).getUTCDay();
	const monday = new Date(localDate - ((weekday + 6) % 7) * 86_400_000);
	return monday.toISOString().slice(0, 10);
}

function json(data: Record<string, unknown>, status = 200, extraHeaders: Record<string, string> = {}): Response {
	return new Response(JSON.stringify(data), {
		status,
		headers: {
			'Content-Type': 'application/json; charset=utf-8',
			'Cache-Control': 'no-store',
			'Content-Security-Policy': "default-src 'none'; frame-ancestors 'none'; base-uri 'none'",
			'X-Content-Type-Options': 'nosniff',
			'X-Frame-Options': 'DENY',
			'Referrer-Policy': 'strict-origin-when-cross-origin',
			'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
			...extraHeaders,
		},
	});
}
