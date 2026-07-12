"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useState, type MouseEvent } from "react";

import { Cn } from "@/lib/utils";
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
  const ActionMotion = { y: -1 };
  const TapMotion = { scale: 0.96 };

  const HandleNavigate = (Event: MouseEvent<HTMLAnchorElement>, SectionIdToShow: SectionId) => {
    Event.preventDefault();
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
        <motion.a
          href="#home"
          className="portfolio-header__brand"
          onClick={(Event) => HandleNavigate(Event, "home")}
          whileHover={ActionMotion}
          whileTap={TapMotion}
        >
          Hanzo
        </motion.a>

        <nav className="portfolio-header__nav" aria-label="Primary navigation">
          {navItems.map((Item) => (
            <motion.a
              key={Item.id}
              href={`#${Item.id}`}
              className={Cn("portfolio-header__link", activeSectionId === Item.id && "portfolio-header__link--active")}
              aria-current={activeSectionId === Item.id ? "page" : undefined}
              onClick={(Event) => HandleNavigate(Event, Item.id)}
              whileHover={ActionMotion}
              whileTap={TapMotion}
            >
              {Item.label}
            </motion.a>
          ))}
        </nav>
      </div>
    </motion.header>
  );
}
