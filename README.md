# Raise Me BeOS

## 🚀 Support This Project

If you find this project helpful, consider supporting its development! Your contributions help keep the project alive and growing.
    
### 💝 Donation Options

[![GitHub Sponsors](https://img.shields.io/badge/sponsor-30363D?style=for-the-badge&logo=GitHub-Sponsors&logoColor=#EA4AAA)](https://github.com/sponsors/khiemtt31)
[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20a%20Coffee-ffdd00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://www.buymeacoffee.com/yourusername)
[![Ko-fi](https://img.shields.io/badge/Ko--fi-F16061?style=for-the-badge&logo=ko-fi&logoColor=white)](https://ko-fi.com/yourusername)
[![Patreon](https://img.shields.io/badge/Patreon-F96854?style=for-the-badge&logo=patreon&logoColor=white)](https://patreon.com/yourusername)

### 🌟 Why Support?

- ⭐ Help maintain and improve the codebase
- 🐛 Fund bug fixes and feature development
- 📚 Support documentation and tutorials
- ☕ Keep the developer caffeinated!

### 🙏 Thank You!

Every contribution, big or small, makes a difference. Thank you for your support! 💖

---

## 🧰 Development

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
