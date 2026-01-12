import { PayOS } from "@payos/node";
import { createLogger, transports } from "winston";

const clientId = process.env.PAYOS_CLIENT_ID || undefined;
const apiKey = process.env.PAYOS_API_KEY || undefined;
const checksumKey = process.env.PAYOS_CHECKSUM_KEY || undefined;

if (!clientId || !apiKey || !checksumKey) {
  throw new Error(
    "Missing PayOS credentials. Ensure PAYOS_CLIENT_ID, PAYOS_API_KEY, and PAYOS_CHECKSUM_KEY are set."
  );
}

export const payos = new PayOS({
  clientId: clientId,
  apiKey: apiKey,
  checksumKey: checksumKey,
  baseURL: "https://api-merchant.payos.vn/",
  logLevel: "debug",
  logger: createLogger({
    level: "debug",
    transports: [new transports.Console()],
  }),
});
