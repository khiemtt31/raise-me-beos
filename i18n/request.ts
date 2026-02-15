import { getRequestConfig } from "next-intl/server";
import { cookies, headers } from "next/headers";

const locales = ["en", "vi"] as const;
type Locale = (typeof locales)[number];
const defaultLocale: Locale = "en";

const resolveLocale = (value?: string | null): Locale => {
  if (!value) return defaultLocale;
  const normalized = value.toLowerCase();
  if (normalized.startsWith("vi")) return "vi";
  return defaultLocale;
};

export default getRequestConfig(async () => {
  const cookieLocale = (await cookies()).get("locale")?.value;
  const headerLocale = (await headers()).get("accept-language")?.split(",")[0];
  const locale = resolveLocale(cookieLocale ?? headerLocale);

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
