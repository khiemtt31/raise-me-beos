# Create Simple QR Code — Implementation Document

**Based on Section 2:** MoMo API learning + access

**Status:** Planning Phase  
**Last Updated:** 2025-12-14

---

## 📋 Overview

This document outlines the implementation strategy for creating a simple QR code payment request using the MoMo API. This is the foundation task before implementing the full donation flow.

---

## 🎯 What Needs to Be Done — Quick Summary

### Phase 1️⃣: Get MoMo Sandbox Access (30 minutes) [PENDING...]
```
Developer Portal Registration
├── Create account at https://developers.momo.vn/
├── Register app (sandbox environment)
├── Obtain credentials:
│   ├── Partner Code
│   ├── Access Key
│   └── Secret Key
└── Store in .env.local (⚠️ Never commit!)
```

### Phase 2️⃣: Understand MoMo API (1 hour)!(image.png) [Reading...]
```
Endpoints to Document:
├── POST /v2/gateway/api/create
│   ├── Input: amount, requestId, orderId
│   ├── Output: qrCodeUrl, paymentLink
│   └── Requires: HMAC-SHA256 signature
│
├── POST /v2/gateway/api/query
│   ├── Input: requestId, orderId
│   ├── Output: status (success, failed, pending)
│   └── Requires: HMAC-SHA256 signature
│
└── Authentication
    └── Signature = HMAC-SHA256(
          alphabetized_params,
          secret_key
        )
```

### Phase 3️⃣: Choose Backend Proxy Strategy (30 minutes)
```
❌ Option A: Direct Browser Calls
   └─ Security Risk: Secret key exposed

✅ Option B: Backend Proxy (Chosen)
   └─ Next.js API Routes
   └─ Secret key stays on server
   └─ Browser ↔ Backend ↔ MoMo
```

### Phase 4️⃣: Build Minimal Implementation (2-3 hours)

#### Architecture Diagram:
```
┌──────────────────────┐
│   React Component    │
│  (donation page)     │
└──────────────┬───────┘
               │ POST /api/payments/create
               │ { amount: 50000 }
               ↓
┌──────────────────────────────────────┐
│   Next.js API Route                  │
│   app/api/payments/create/route.ts   │
├──────────────────────────────────────┤
│ 1. Validate input                    │
│ 2. Generate requestId (UUID)         │
│ 3. Create signature (HMAC-SHA256)    │
│ 4. Call MoMo /create endpoint        │
│ 5. Return QR code URL                │
└──────────────┬───────────────────────┘
               │
               ↓ POST /v2/gateway/api/create
        ┌──────────────────┐
        │   MoMo API       │
        │   (Sandbox)      │
        └──────────────────┘
               │
               ↓ { qrCodeUrl, ... }
               ↓
┌──────────────────────────────┐
│ Display QR Code on Frontend  │
│ - Render QR image            │
│ - Show payment link          │
│ - Copy to clipboard button   │
└──────────────────────────────┘
```

#### Files to Create:

**1. Configuration & Types** (`lib/momo/`)
```
lib/momo/
├── constants.ts      ← API endpoints, timeouts
├── types.ts          ← TypeScript interfaces
└── signature.ts      ← HMAC signing logic
```

**2. Frontend Service** (`lib/services/`)
```
lib/services/
└── payment.ts        ← createPaymentRequest(amount)
```

**3. Backend API Routes** (`app/api/`)
```
app/api/payments/
├── create/route.ts   ← POST handler
└── query/route.ts    ← POST handler (for status)
```

**4. Update UI** (`app/(dashboard)/`)
```
app/(dashboard)/page.tsx
├── Add "Generate QR" button
├── Show QR code image (qrcode.react)
├── Show payment link
├── Copy button
└── Loading & error states
```

### Phase 5️⃣: Test End-to-End (1 hour)
```
Test Cases:
□ Start dev server
□ Generate QR with different amounts
  □ 10,000 VND
  □ 20,000 VND
  □ 50,000 VND
  □ 100,000 VND
□ Verify QR code displays
□ Verify payment link works
□ Test error cases
  □ Missing amount
  □ Invalid amount
  □ Network timeout
□ Check console for errors
□ Verify API calls in Network tab
```

---

## 📊 Detailed Implementation Tasks

### Task 1: Register for MoMo Developer Access
**Objective:** Obtain sandbox credentials and authentication details

**What Needs to Be Done:**
- [ ] Visit [MoMo Developer Portal](https://developers.momo.vn/)
- [ ] Create a developer account
- [ ] Register a new application in sandbox environment
- [ ] Obtain and store credentials:
  - [ ] **Partner Code** (Merchant ID)
  - [ ] **Access Key** (API Key for requests)
  - [ ] **Secret Key** (HMAC signing key)
  - [ ] **Phone Number** (associated with account)
- [ ] Save credentials in `.env.local` (never commit to git):
  ```env
  NEXT_PUBLIC_MOMO_PARTNER_CODE=your_partner_code
  MOMO_ACCESS_KEY=your_access_key
  MOMO_SECRET_KEY=your_secret_key
  NEXT_PUBLIC_MOMO_PHONE=your_phone_number
  ```

**Estimated Time:** 30 minutes

---

### Task 2: Read MoMo Documentation & Map Required Endpoints
**Objective:** Understand API structure and identify necessary endpoints

**What Needs to Be Done:**
- [ ] Review MoMo API documentation
- [ ] Document the following endpoints:

#### A. Create Payment Request
- **Endpoint:** POST `/v2/gateway/api/create`
- **Purpose:** Generate a unique payment request with QR code
- **Required Parameters:**
  - `partnerCode` — Your merchant code
  - `accessKey` — Your access key
  - `requestId` — Unique ID for this transaction (UUID/timestamp-based)
  - `amount` — Donation amount in VND
  - `orderId` — Order identifier (can match requestId)
  - `orderInfo` — Description (e.g., "Donation for Raise Me Beos")
  - `returnUrl` — Redirect URL after payment (or webhook)
  - `notifyUrl` — Webhook URL for payment confirmation (if available)
  - `requestType` — Payment type (e.g., `"captureMoMoWallet"` or `"payWithMethod"`)
  - `signature` — HMAC-SHA256 signature (see authentication below)
  - `lang` — Language code (`"en"` or `"vi"`)
  - `timestamp` — Current timestamp in milliseconds

#### B. Query Payment Status
- **Endpoint:** POST `/v2/gateway/api/query`
- **Purpose:** Check if payment has been completed
- **Required Parameters:**
  - `partnerCode`
  - `accessKey`
  - `requestId` — The original request ID
  - `orderId` — The original order ID
  - `signature` — HMAC signature
  - `timestamp` — Current timestamp

#### C. Authentication & Signature
- **Algorithm:** HMAC-SHA256
- **Input String Format:**
  ```
  accessKey={accessKey}&amount={amount}&extraData={extraData}&ipnUrl={notifyUrl}&orderId={orderId}&orderInfo={orderInfo}&partnerCode={partnerCode}&redirectUrl={returnUrl}&requestId={requestId}&requestType={requestType}&timestamp={timestamp}
  ```
- **Signing Process:**
  1. Sort parameters alphabetically
  2. Concatenate as `key1=value1&key2=value2&...`
  3. Generate HMAC-SHA256 using `secretKey`
  4. Include signature in request

**Deliverables:**
- [ ] Create file `lib/momo/constants.ts` with endpoint URLs
- [ ] Create file `lib/momo/types.ts` with TypeScript interfaces
- [ ] Document signature generation logic

**Estimated Time:** 1 hour

---

### Task 3: Choose Integration Strategy
**Objective:** Decide between direct browser calls vs. backend proxy

**What Needs to Be Done:**
- [ ] Evaluate two approaches:

#### Approach A: Direct Browser Calls (No Backend)
**Pros:**
- Simpler, faster implementation
- No backend infrastructure needed initially

**Cons:**
- Secret key exposed to browser (security risk) ❌
- CORS issues possible
- Not production-ready

#### Approach B: Backend Proxy (Recommended)
**Pros:**
- Secret key stays on server
- Better security
- Handles CORS properly

**Cons:**
- Requires backend setup

**Decision:** ✅ **Use Backend Proxy (Next.js API Routes)**

- [ ] Create Next.js API route: `app/api/payments/create/route.ts` (POST)
- [ ] Create Next.js API route: `app/api/payments/query/route.ts` (POST)
- [ ] These routes will:
  1. Receive request from frontend
  2. Validate input
  3. Add server-side credentials
  4. Call MoMo API
  5. Return response to frontend

**Estimated Time:** 30 minutes

---

### Task 4: Build Minimal Spike — Create Payment Request
**Objective:** Successfully create a payment request and render QR code

**What Needs to Be Done:**

#### Step A: Create Backend API Route
- [ ] File: `app/api/payments/create/route.ts`
- **Functionality:**
  ```typescript
  // POST /api/payments/create
  // Input: { amount: number }
  // Output: {
  //   qrCodeUrl: string
  //   requestId: string
  //   paymentLink: string
  //   expiresAt: number
  // }
  ```
- [ ] Implement signature generation
- [ ] Handle error cases (invalid amount, API failure, network timeout)

#### Step B: Create Frontend Service Module
- [ ] File: `lib/services/payment.ts`
- **Functionality:**
  ```typescript
  export async function createPaymentRequest(amount: number) {
    // Call /api/payments/create
    // Return payment details
  }
  ```

#### Step C: Update Donation Page
- [ ] File: `app/(dashboard)/page.tsx`
- [ ] Add button: "Generate QR Code"
- [ ] On click: Call `createPaymentRequest(amount)`
- [ ] Display QR code using library (e.g., `qrcode.react`)
- [ ] Show payment link and copy-to-clipboard button
- [ ] Add loading state and error message display

#### Step D: Install Required Dependencies
- [ ] `qrcode.react` — QR code rendering
- [ ] `crypto-js` or use Node.js `crypto` — For HMAC signing

**Estimated Time:** 2-3 hours

---

### Task 5: Test & Validate
**Objective:** Ensure QR code generation works end-to-end

**What Needs to Be Done:**
- [ ] Start dev server: `npm run dev`
- [ ] Navigate to donation page
- [ ] Click "Generate QR Code"
- [ ] Verify:
  - [ ] QR code displays without errors
  - [ ] Payment link is valid
  - [ ] No console errors
  - [ ] Network tab shows successful API call to MoMo
- [ ] Test with different amounts (10k, 20k, 50k, 100k)
- [ ] Test error case (submit without amount)

**Estimated Time:** 1 hour

---

## 📁 Files to Create/Modify

```
lib/
├── momo/
│   ├── constants.ts       ← MoMo API endpoints & config
│   ├── types.ts           ← TypeScript interfaces
│   └── signature.ts       ← HMAC-SHA256 signing logic
├── services/
│   └── payment.ts         ← Frontend payment service
app/
├── api/
│   └── payments/
│       ├── create/
│       │   └── route.ts   ← Create payment API
│       └── query/
│           └── route.ts   ← Query status API (later)
└── (dashboard)/
    └── page.tsx           ← Update with QR generation
```

---

## 🔐 Environment Variables

**Required in `.env.local`:**
```env
NEXT_PUBLIC_MOMO_PARTNER_CODE=<sandbox_partner_code>
MOMO_ACCESS_KEY=<your_access_key>
MOMO_SECRET_KEY=<your_secret_key>
NEXT_PUBLIC_MOMO_PHONE=<your_phone_number>
```

⚠️ **Never commit `.env.local` to git**

---

## 📦 Dependencies to Install

```bash
npm install qrcode.react
# For signing (if using crypto-js):
npm install crypto-js
# Type definitions:
npm install --save-dev @types/crypto-js
```

---

## 🔄 Implementation Checklist

### Phase 1: Setup
- [ ] Register for MoMo Developer Access
  - [ ] Create account
  - [ ] Get sandbox credentials
  - [ ] Save to `.env.local`

### Phase 2: Learning
- [ ] Read MoMo Docs & Map Endpoints
  - [ ] Document `/create` endpoint parameters
  - [ ] Document `/query` endpoint parameters
  - [ ] Document signature algorithm

### Phase 3: Strategy
- [ ] Choose Integration Strategy
  - [ ] Decide: Backend proxy (✅ chosen)
  - [ ] Plan API route structure

### Phase 4: Implementation
- [ ] Build Minimal Spike
  - [ ] `lib/momo/constants.ts` — Endpoints & config
  - [ ] `lib/momo/types.ts` — TypeScript types
  - [ ] `lib/momo/signature.ts` — Signature generation
  - [ ] `lib/services/payment.ts` — Frontend service
  - [ ] `app/api/payments/create/route.ts` — Backend API
  - [ ] `app/(dashboard)/page.tsx` — UI integration

### Phase 5: Testing
- [ ] Test & Validate
  - [ ] QR code generates successfully
  - [ ] Payment link is valid
  - [ ] Error handling works
  - [ ] All amounts work (10k, 20k, 50k, 100k)

---

## ⏱️ Total Estimated Time

| Task | Duration |
|------|----------|
| 1. Register for MoMo | 30 min |
| 2. Read docs & map endpoints | 1 hour |
| 3. Choose strategy | 30 min |
| 4. Build spike | 2-3 hours |
| 5. Test & validate | 1 hour |
| **Total** | **5.5-6.5 hours** |

---

## 🚀 Next Steps (After QR Creation)

Once QR code generation works:
1. Add **status polling** (check payment every 2 seconds)
2. Add **countdown timer** (QR expires after X minutes)
3. Add **database persistence** (track donations)
4. Add **payment confirmation** (webhook/IPN handling)

---

## 📚 Resources

- [MoMo Developer Portal](https://developers.momo.vn/)
- [MoMo API Documentation](https://developers.momo.vn/docs/)
- [qrcode.react NPM](https://www.npmjs.com/package/qrcode.react)
- [Node.js Crypto Module](https://nodejs.org/api/crypto.html)

---

## ⚠️ Important Notes

- 🔐 **Secret key must NEVER be sent to browser**
- 📱 **QR codes expire** (typically 15-30 minutes)
- 🔄 **Polling needed** to check payment status
- 💾 **No backend required** initially (can add later)
- 🧪 **Test in sandbox first** before production
- 🛡️ **Always use HTTPS** in production for payment requests