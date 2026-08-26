const WEEKLY_SEND_LIMIT = 5;

interface SqlCursor<T = unknown> {
	toArray(): T[];
}

interface SqlStorage {
	exec<T = unknown>(query: string, ...bindings: unknown[]): SqlCursor<T>;
}

interface DurableObjectStateLike {
	storage: {
		sql: SqlStorage;
	};
}

interface DurableObjectStubLike {
	fetch(request: Request): Promise<Response>;
}

interface DurableObjectNamespaceLike {
	idFromName(name: string): unknown;
	get(id: unknown): DurableObjectStubLike;
}

interface AssetsFetcher {
	fetch(request: Request): Promise<Response>;
}

interface Env {
	ASSETS: AssetsFetcher;
	CONTACT_QUOTA: DurableObjectNamespaceLike;
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

interface QuotaRow {
	count: number;
}

interface QuotaResult {
	ok: boolean;
	remaining: number;
}

export class ContactQuota {
	private readonly ctx: DurableObjectStateLike;

	constructor(ctx: DurableObjectStateLike) {
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
			return handleContact(request, env);
		}

		return env.ASSETS.fetch(request);
	},
};

async function handleContact(request: Request, env: Env): Promise<Response> {
	if (request.method !== 'POST') {
		return json({ message: 'Method not allowed.' }, 405, { Allow: 'POST' });
	}

	const origin = request.headers.get('Origin');
	if (origin && origin !== new URL(request.url).origin) {
		return json({ message: 'Invalid request origin.' }, 403);
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

	if (missingConfiguration.length > 0) {
		console.error('Contact email configuration missing', missingConfiguration);
		return json({ message: 'Email delivery is not configured yet.' }, 503);
	}

	const week = currentWeekKey();
	const quota = await useQuota(env, 'reserve', week);
	if (!quota.ok) {
		return json({ message: 'The weekly message limit has been reached. Please try again next week.' }, 429);
	}

	try {
		const accessToken = await getAccessToken(env);
		await sendGmailMessage(accessToken, env.CONTACT_EMAIL, { name, email, message });
		return json({ message: 'Message sent. I’ll get back to you soon.' });
	} catch (error) {
		console.error('Contact email delivery failed', error);
		await useQuota(env, 'release', week).catch((releaseError) => {
			console.error('Contact quota release failed', releaseError);
		});
		return json({ message: 'The message could not be sent. Please email me directly.' }, 502);
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

	const result = await response.json() as QuotaResult;
	return { ok: response.ok && result.ok, remaining: result.remaining ?? 0 };
}

async function getAccessToken(env: Env): Promise<string> {
	const response = await fetch('https://oauth2.googleapis.com/token', {
		method: 'POST',
		headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		body: new URLSearchParams({
			client_id: env.GOOGLE_CLIENT_ID,
			client_secret: env.GOOGLE_CLIENT_SECRET,
			refresh_token: env.GOOGLE_REFRESH_TOKEN,
			grant_type: 'refresh_token',
		}),
	});

	if (!response.ok) throw new Error(`Google token request failed with ${response.status}`);

	const result = await response.json() as { access_token?: string };
	if (!result.access_token) throw new Error('Google token response did not include an access token');
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

	const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${accessToken}`,
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ raw: base64UrlEncode(mimeMessage) }),
	});

	if (!response.ok) throw new Error(`Gmail send failed with ${response.status}`);
}

function normalizedText(value: unknown, maxLength: number): string {
	if (typeof value !== 'string') return '';
	return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim().slice(0, maxLength);
}

async function readContactPayload(request: Request): Promise<ContactPayload | null> {
	const contentType = request.headers.get('Content-Type') ?? '';

	try {
		if (contentType.includes('application/json')) {
			return await request.json() as ContactPayload;
		}

		if (contentType.includes('application/x-www-form-urlencoded') || contentType.includes('multipart/form-data')) {
			const formData = await request.formData();
			return Object.fromEntries(formData.entries()) as ContactPayload;
		}
	} catch {
		return null;
	}

	return null;
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
			...extraHeaders,
		},
	});
}
