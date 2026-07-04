import type { Metadata } from "next";
import { Homepage } from "@/components/home/Homepage";

export const metadata: Metadata = {
  title: "Home",
  description: "The Hanzo portfolio homepage based on the provided Figma design.",
};

export default function Home() {
  return <Homepage />;
}
