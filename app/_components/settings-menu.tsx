"use client"

import { Heart, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function SettingsMenu() {
  const router = useRouter()
  const t = useTranslations()

  const supportLabel = t("NAV.BUTTON.001")
  const settingsLabel = t("SETTINGS.MENU.TITLE.001")
  const settingsAria = t("SETTINGS.MENU.ARIA.001")

  const handleSupport = () => {
    router.push("/donate#support")
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          aria-label={settingsAria}
          className="group flex items-center justify-center rounded-full p-1.5 text-[var(--hero-muted)] outline-none transition-all duration-200 hover:scale-110 hover:text-[var(--hero-accent)] hover:drop-shadow-[0_0_8px_var(--hero-accent)] data-[state=open]:scale-110 data-[state=open]:text-[var(--hero-accent)] data-[state=open]:drop-shadow-[0_0_12px_var(--hero-accent)]"
        >
          <Settings className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-45" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-60 rounded-2xl border-[var(--hero-border)] bg-[var(--hero-surface-strong)]/95 p-2 shadow-xl backdrop-blur"
      >
        <DropdownMenuLabel className="px-3 pt-2 text-[10px] uppercase tracking-[0.4em] text-[var(--hero-muted)]">
          {settingsLabel}
        </DropdownMenuLabel>
        <DropdownMenuItem
          className="mt-1 gap-3 rounded-lg px-3 py-2 text-xs uppercase tracking-[0.2em] text-[var(--hero-foreground)] focus:bg-[var(--hero-surface)]/70"
          onSelect={handleSupport}
        >
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--hero-border)] bg-[var(--hero-surface)]/60 text-[var(--hero-accent)]">
            <Heart className="h-4 w-4" />
          </span>
          <span className="text-[11px]">{supportLabel}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
