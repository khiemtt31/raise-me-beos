"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, type MouseEvent } from "react";

import { Cn } from "@/lib/Utils";
import { Button } from "@/components/ui/Button";
import type { SectionId } from "@/components/portfolio/PortfolioData";

type HeaderNavItem = {
  id: SectionId;
  label: string;
};

type HeaderProps = {
  activeSectionId?: SectionId;
  navItems: HeaderNavItem[];
  onNavigate: (SectionIdToShow: SectionId) => void;
};

export function Header({ activeSectionId = "home", navItems, onNavigate }: HeaderProps) {
  const [IsMenuOpen, SetIsMenuOpen] = useState(false);

  const HandleNavigate = (Event: MouseEvent<HTMLAnchorElement>, SectionIdToShow: SectionId) => {
    Event.preventDefault();
    SetIsMenuOpen(false);
    onNavigate(SectionIdToShow);
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className="portfolio-header"
    >
      <div className="portfolio-header__inner">
        <a
          href="#home"
          className="portfolio-header__brand"
          onClick={(Event) => HandleNavigate(Event, "home")}
        >
          Hanzo
        </a>

        <nav className="portfolio-header__nav" aria-label="Primary navigation">
          {navItems.map((Item) => (
            <a
              key={Item.id}
              href={`#${Item.id}`}
              className={Cn("portfolio-header__link", activeSectionId === Item.id && "portfolio-header__link--active")}
              aria-current={activeSectionId === Item.id ? "page" : undefined}
              onClick={(Event) => HandleNavigate(Event, Item.id)}
            >
              {Item.label}
            </a>
          ))}
        </nav>

        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="portfolio-header__menu-button"
          aria-expanded={IsMenuOpen}
          aria-label={IsMenuOpen ? "Close navigation" : "Open navigation"}
          onClick={() => SetIsMenuOpen((CurrentState) => !CurrentState)}
        >
          {IsMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </Button>

        <AnimatePresence initial={false}>
          {IsMenuOpen ? (
            <motion.nav
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className="portfolio-header__mobile-nav frosted-panel"
              aria-label="Mobile navigation"
            >
              {navItems.map((Item) => (
                <a
                  key={Item.id}
                  href={`#${Item.id}`}
                  onClick={(Event) => HandleNavigate(Event, Item.id)}
                  className={Cn("portfolio-header__mobile-link", activeSectionId === Item.id && "portfolio-header__mobile-link--active")}
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
