import type { Metadata } from "next";
import "./globals.scss";

export const metadata: Metadata = {
  title: {
    default: "Hanzo",
    template: "%s | Hanzo",
  },
  description: "Portfolio homepage for Hanzo Hekim, implemented from the provided Figma homepage frame.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
