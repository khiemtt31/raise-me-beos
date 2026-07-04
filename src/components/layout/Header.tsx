"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState } from "react";

import { Cn } from "@/lib/Utils";
import { Button } from "@/components/ui/Button";

const NavItems = [
  { label: "Work", href: "#work" },
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Contact", href: "#contact" },
];

type HeaderProps = {
  Compact?: boolean;
};

export function Header({ Compact = false }: HeaderProps) {
  const [IsMenuOpen, SetIsMenuOpen] = useState(false);

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={Cn("relative z-20", Compact ? "py-0" : "py-[var(--space-page-y)]")}
    >
      <div className={Cn(Compact ? "w-full" : "page-shell")}>
        <div
          className={Cn(
            "flex items-center justify-between",
            Compact ? "h-full" : "min-h-[5.25rem] gap-4 md:min-h-[5.75rem] md:gap-6",
          )}
        >
          <Link
            href="/"
            className={Cn(
              "font-bold uppercase text-[var(--brand)]",
              Compact ? "text-[2.5cqw] tracking-[0.04em]" : "text-[clamp(1.75rem,5vw,2.5rem)] tracking-[0.04em]",
            )}
          >
            Hanzo
          </Link>

          <nav className={Cn("hidden items-center", Compact ? "gap-[2.5cqw] lg:flex" : "gap-8 lg:flex")}>
            {NavItems.map((Item) => (
              <a
                key={Item.label}
                href={Item.href}
                className={Cn(
                  "font-medium tracking-[0.02em] text-[var(--ink-deep)] transition-opacity hover:opacity-70",
                  Compact ? "text-[1.875cqw]" : "text-[clamp(1.25rem,2.6vw,1.75rem)]",
                )}
              >
                {Item.label}
              </a>
            ))}
          </nav>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="lg:hidden"
            aria-expanded={IsMenuOpen}
            aria-label={IsMenuOpen ? "Close navigation" : "Open navigation"}
            onClick={() => SetIsMenuOpen((CurrentState) => !CurrentState)}
          >
            {IsMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>

        <AnimatePresence initial={false}>
          {IsMenuOpen ? (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="frosted-panel mt-3 flex flex-col gap-1 rounded-[1.5rem] border border-border p-2 lg:hidden"
            >
              {NavItems.map((Item) => (
                <a
                  key={Item.label}
                  href={Item.href}
                  onClick={() => SetIsMenuOpen(false)}
                  className={Cn(
                    "rounded-[1rem] px-4 py-3 text-lg font-medium text-[var(--ink-deep)] transition-colors",
                    "hover:bg-[rgba(38,0,115,0.06)]",
                  )}
                >
                  {Item.label}
                </a>
              ))}
            </motion.nav>
          ) : null}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
