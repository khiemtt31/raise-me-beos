import type { Metadata } from "next";
import { PortfolioPage } from "@/components/portfolio/PortfolioPage";

export const metadata: Metadata = {
  title: "Hanzo Portfolio",
  description: "The horizontally scrolling Hanzo portfolio based on the provided Figma design export.",
};

export default function Home() {
  return <PortfolioPage />;
}
