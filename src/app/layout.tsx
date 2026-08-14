import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Khiem Hanzo Tran — Software Engineer",
    template: "%s | Khiem Hanzo Tran",
  },
  description: "Khiem Hanzo Tran is a software engineer building thoughtful interfaces, dependable systems, and useful products across the stack.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
