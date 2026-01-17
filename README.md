# Raise Me BeOS

## Support the Project

If you find this project helpful, consider supporting its development. Donations help cover hosting costs and fund new features.

### Donation Options

- VietQR/PayOS (VN): add your gateway link or QR landing page.
- International: Buy Me a Coffee / Ko-fi / PayPal (add your links).
- GitHub Sponsors: https://github.com/sponsors/your-handle

### Donation Policy

- Donations are voluntary and non-refundable.
- Donations do not grant equity, ownership, or guaranteed services.
- Contributions are used to maintain servers and improve the project.

### Security Note

Payment credentials must never be committed. Keep all API keys in `.env` and validate webhooks server-side.

---

## Development

### Payment Service

A standalone Express server under [`server/index.ts`](server/index.ts:1) exposes the PayOS payment endpoints consumed by the Next.js frontend. Install its dependencies and start it separately:

```ts
cd server && npm install
npm run dev
```

In production, run `npm run start` inside the same directory.

### Frontend App

The Next.js application remains available from the repository root:

```ts
npm run dev
```

Build and serve static output with:

```ts
npm run build
npm run start
```

### PayOS Environment

Ensure the following secrets are configured (server-side values take precedence, public fallbacks are used only during development):

- `PAYOS_CLIENT_ID` (fallback `NEXT_PUBLIC_PAYOS_PAYMENT_GATEWAY_CLIENT_ID`)
- `PAYOS_API_KEY` (fallback `NEXT_PUBLIC_PAYOS_PAYMENT_GATEWAY_API_KEY`)
- `PAYOS_CHECKSUM_KEY` (fallback `NEXT_PUBLIC_PAYOS_PAYMENT_GATEWAY_CHECKSUM_KEY`)

Expose the payment service URL to the Next.js layer through `NEXT_PUBLIC_PAYMENT_SERVICE_URL`.

Webhooks require the raw request payload, which is captured in middleware and exposed as `Request.rawBody` via [`types/express.d.ts`](types/express.d.ts:1).
