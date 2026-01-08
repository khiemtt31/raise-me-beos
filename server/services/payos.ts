import { PayOS } from "@payos/node";

const clientId = process.env.PAYOS_CLIENT_ID;
const apiKey = process.env.PAYOS_API_KEY;
const checksumKey = process.env.PAYOS_CHECKSUM_KEY;

if (!clientId || !apiKey || !checksumKey) {
  throw new Error(
    "Missing PayOS credentials. Ensure PAYOS_CLIENT_ID, PAYOS_API_KEY, and PAYOS_CHECKSUM_KEY are set."
  );
}

export const payos = new PayOS({
  clientId: clientId,
  apiKey: apiKey,
  checksumKey: checksumKey,
  baseURL: 'https://api-merchant-sandbox.payos.vn',
});
