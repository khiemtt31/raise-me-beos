import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function Cn(...Inputs: ClassValue[]) {
  return twMerge(clsx(Inputs));
}
