"use client"

import { Gem, Heart } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTranslations } from "next-intl"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
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
          className="group relative flex items-center justify-center rounded-full p-[7px] outline-none"
        >
          {/* Outer glow ring — fades in on hover / open */}
          <span
            className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-data-[state=open]:opacity-100"
            style={{
              background: 'radial-gradient(circle, rgba(255,215,0,0.15) 0%, transparent 70%)',
              boxShadow: '0 0 18px 5px rgba(255,215,0,0.20)',
            }}
          />
          <Gem
            className="relative h-5 w-5 transition-all duration-300 group-hover:scale-110 group-data-[state=open]:scale-110 group-hover:[color:#FFD700] group-data-[state=open]:[color:#FFD700] group-hover:[filter:drop-shadow(0_0_8px_rgba(255,215,0,0.75))] group-data-[state=open]:[filter:drop-shadow(0_0_10px_rgba(255,215,0,0.85))]"
            style={{ color: 'rgba(201,162,39,0.65)' }}
          />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-64 overflow-hidden rounded-2xl p-0 shadow-2xl outline-none"
        style={{
          background: 'linear-gradient(160deg, rgba(10,8,2,0.97) 0%, rgba(20,15,3,0.97) 100%)',
          border: '1px solid rgba(201,162,39,0.35)',
          boxShadow:
            '0 0 0 0.5px rgba(255,215,0,0.12), 0 8px 48px rgba(0,0,0,0.85), 0 0 32px rgba(201,162,39,0.12)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
        }}
      >
        {/* Top shimmer line */}
        <div
          className="h-px w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(255,215,0,0.55) 30%, rgba(255,215,0,0.85) 50%, rgba(255,215,0,0.55) 70%, transparent 100%)',
          }}
        />

        {/* Header */}
        <div className="flex items-center gap-2.5 px-4 pt-4 pb-3">
          <Gem
            className="h-3.5 w-3.5 shrink-0"
            style={{ color: '#C9A227', filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.5))' }}
          />
          <DropdownMenuLabel
            className="p-0 text-[9px] uppercase tracking-[0.5em]"
            style={{ color: 'rgba(201,162,39,0.65)', fontFamily: 'var(--font-orbitron)' }}
          >
            {settingsLabel}
          </DropdownMenuLabel>
        </div>

        <DropdownMenuSeparator
          className="mx-4 my-0 h-px border-0"
          style={{ background: 'rgba(201,162,39,0.15)' }}
        />

        {/* Support item */}
        <div className="p-2">
          <DropdownMenuItem
            className="group/item relative mt-0 flex cursor-pointer items-center gap-3 overflow-hidden rounded-xl px-3 py-2.5 outline-none transition-all duration-200 focus:bg-transparent"
            style={{ color: 'rgba(240,220,160,0.85)' }}
            onSelect={handleSupport}
          >
            {/* Hover bg */}
            <span
              className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-200 group-hover/item:opacity-100"
              style={{
                background:
                  'linear-gradient(135deg, rgba(255,215,0,0.10) 0%, rgba(201,162,39,0.06) 100%)',
                border: '1px solid rgba(255,215,0,0.18)',
              }}
            />
            {/* Icon badge */}
            <span
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all duration-200 group-hover/item:scale-110"
              style={{
                background: 'linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(201,162,39,0.06) 100%)',
                border: '1px solid rgba(255,215,0,0.25)',
                boxShadow: '0 0 0 0 rgba(255,215,0,0)',
              }}
            >
              <Heart
                className="h-3.5 w-3.5 transition-all duration-200 group-hover/item:scale-110"
                style={{ color: '#FFD700', filter: 'drop-shadow(0 0 4px rgba(255,215,0,0.6))' }}
              />
            </span>
            <span
              className="relative text-[11px] uppercase tracking-[0.3em] transition-all duration-200 group-hover/item:tracking-[0.35em]"
              style={{ fontFamily: 'var(--font-orbitron)', color: 'rgba(240,212,100,0.9)' }}
            >
              {supportLabel}
            </span>
            {/* Right arrow accent */}
            <span
              className="relative ml-auto text-[10px] opacity-0 transition-all duration-200 group-hover/item:opacity-100 group-hover/item:translate-x-0.5"
              style={{ color: 'rgba(255,215,0,0.6)' }}
            >
              ›
            </span>
          </DropdownMenuItem>
        </div>

        {/* Bottom shimmer line */}
        <div
          className="h-px w-full"
          style={{
            background:
              'linear-gradient(90deg, transparent 0%, rgba(201,162,39,0.25) 50%, transparent 100%)',
          }}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
