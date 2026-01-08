# Express Server Integration Plan

1. Introduce an Express-based custom server (`server/index.ts`) that wraps Next.js request handling.
   - Instantiate and prepare the Next.js app inside the Express bootstrap.
   - Share the same origin so that existing `/api` fetch calls from the frontend continue to work.
2. Mount JSON body parsing middleware and register a dedicated `/api/payment/create` handler.
   - Reuse the existing PayOS helper logic and Prisma persistence layer from the Next.js route implementation.
   - Keep response fields (`checkoutUrl`, `qrCode`, `orderCode`) identical to preserve the frontend contract.
3. Move the PayOS initialization into a sharable module (`server/services/payos.ts`) to avoid duplication between future endpoints (e.g. webhooks).
   - Ensure credentials are sourced from secure server-side env vars (`PAYOS_*`), falling back to public keys only if necessary.
4. Wire Prisma access from the Express context by importing the current `lib/prisma.ts` singleton.
5. Update npm scripts so development (`npm run dev`) launches the Express server via `tsx`.
   - Add a production entry (`npm run start`) that prepares Next.js, then serves prebuilt assets through the same Express server.
6. Remove the existing Next.js Route Handler for `/api/payment/create` after verifying the new Express endpoint fulfils the same behaviour.
7. Add minimal documentation in the README to describe the new server workflow and required environment variables.
