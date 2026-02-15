"use client"

import { useEffect, useRef, useState } from "react"
import type { ElementType } from "react"
import { Heart, Layers, Moon, Settings, Sun } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

type MenuAction = () => void

function MenuItem({
  icon: Icon,
  label,
  onClick,
}: {
  icon: ElementType
  label: string
  onClick: MenuAction
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      role="menuitem"
      className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-xs uppercase tracking-[0.2em] text-[var(--hero-foreground)] transition hover:bg-[var(--hero-surface)]/70"
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]/60 text-[var(--hero-accent)]">
        <Icon className="h-4 w-4" />
      </span>
      <span className="text-[11px]">{label}</span>
    </button>
  )
}

export function SettingsMenu() {
  const router = useRouter()
  const t = useTranslations()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!open) return

    const handleOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node
      if (menuRef.current?.contains(target)) return
      if (buttonRef.current?.contains(target)) return
      setOpen(false)
    }

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleOutsideClick)
    document.addEventListener("keydown", handleEscape)

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleEscape)
    }
  }, [open])

  const isDark = mounted && theme === "dark"
  const themeLabel = mounted
    ? isDark
      ? t("THEME.ARIA.002")
      : t("THEME.ARIA.003")
    : t("THEME.ARIA.001")
  const supportLabel = t("NAV.BUTTON.001")
  const settingsLabel = t("SETTINGS.MENU.TITLE.001")
  const settingsAria = t("SETTINGS.MENU.ARIA.001")
  const backgroundLabel = t("SETTINGS.MENU.ITEM.BACKGROUND.001")

  const handleThemeToggle = () => {
    if (!mounted) return
    setTheme(isDark ? "light" : "dark")
    setOpen(false)
  }

  const handleSupport = () => {
    router.push("/donate#support")
    setOpen(false)
  }

  const handleBackground = () => {
    router.push("/background-settings")
    setOpen(false)
  }

  return (
    <div className="relative">
      <Button
        ref={buttonRef}
        type="button"
        variant="outline"
        size="icon"
        onClick={() => setOpen((prev) => !prev)}
        className="h-9 w-9 border-[var(--hero-border)] bg-transparent text-[var(--hero-foreground)] hover:border-[var(--hero-accent)] hover:bg-[var(--hero-surface)]"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label={settingsAria}
      >
        <Settings className="h-4 w-4" />
      </Button>

      {open && (
        <div
          ref={menuRef}
          role="menu"
          className="absolute right-0 z-50 mt-3 w-60 rounded-2xl border border-[var(--hero-border)] bg-[var(--hero-surface-strong)]/95 p-2 shadow-xl backdrop-blur"
        >
          <div className="mb-2 px-3 pt-2 text-[10px] uppercase tracking-[0.4em] text-[var(--hero-muted)]">
            {settingsLabel}
          </div>
          <MenuItem
            icon={isDark ? Sun : Moon}
            label={themeLabel}
            onClick={handleThemeToggle}
          />
          <MenuItem icon={Heart} label={supportLabel} onClick={handleSupport} />
          <MenuItem icon={Layers} label={backgroundLabel} onClick={handleBackground} />
        </div>
      )}
    </div>
  )
}
