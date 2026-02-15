'use client'

import { BackgroundStyle } from './animated-backgrounds'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Cpu, Layers, Zap, Activity, Grid3X3, Terminal } from 'lucide-react'
import { useTranslations } from 'next-intl'

interface MotherboardControlProps {
  currentStyle: BackgroundStyle
  onStyleChange: (style: BackgroundStyle) => void
  autoRotate: boolean
  onAutoRotateToggle: () => void
}

const styles: Array<{
  id: BackgroundStyle
  nameKey: string
  descriptionKey: string
  icon: React.ElementType
  color: string
}> = [
  {
    id: 'matrix',
    nameKey: 'BACKGROUND.STYLE.MATRIX.NAME',
    descriptionKey: 'BACKGROUND.STYLE.MATRIX.DESC',
    icon: Terminal,
    color: 'text-primary',
  },
  {
    id: 'circuit',
    nameKey: 'BACKGROUND.STYLE.CIRCUIT.NAME',
    descriptionKey: 'BACKGROUND.STYLE.CIRCUIT.DESC',
    icon: Cpu,
    color: 'text-secondary',
  },
  {
    id: 'pixel-rain',
    nameKey: 'BACKGROUND.STYLE.PIXEL_RAIN.NAME',
    descriptionKey: 'BACKGROUND.STYLE.PIXEL_RAIN.DESC',
    icon: Zap,
    color: 'text-accent',
  },
  {
    id: 'ascii-waves',
    nameKey: 'BACKGROUND.STYLE.ASCII_WAVES.NAME',
    descriptionKey: 'BACKGROUND.STYLE.ASCII_WAVES.DESC',
    icon: Activity,
    color: 'text-primary',
  },
  {
    id: 'binary-grid',
    nameKey: 'BACKGROUND.STYLE.BINARY_GRID.NAME',
    descriptionKey: 'BACKGROUND.STYLE.BINARY_GRID.DESC',
    icon: Grid3X3,
    color: 'text-secondary',
  },
  {
    id: 'terminal-glitch',
    nameKey: 'BACKGROUND.STYLE.TERMINAL.NAME',
    descriptionKey: 'BACKGROUND.STYLE.TERMINAL.DESC',
    icon: Layers,
    color: 'text-accent',
  },
]

export function MotherboardControl({
  currentStyle,
  onStyleChange,
  autoRotate,
  onAutoRotateToggle,
}: MotherboardControlProps) {
  const t = useTranslations()
  const activeStyleLabel =
    styles.find((style) => style.id === currentStyle)?.nameKey ?? ''

  return (
    <Card className="border-2 border-primary/30 bg-card/95 backdrop-blur-sm">
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/20">
              <Cpu className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="font-mono text-lg font-bold tracking-wider text-foreground">
                {t('BACKGROUND.MOTHERBOARD.TITLE.001')}
              </h2>
              <p className="font-mono text-xs text-muted-foreground">
                {t('BACKGROUND.MOTHERBOARD.SUBTITLE.001')}
              </p>
            </div>
          </div>
          <Badge
            variant={autoRotate ? 'default' : 'outline'}
            className="font-mono text-xs"
          >
            {autoRotate
              ? t('BACKGROUND.MOTHERBOARD.MODE.AUTO')
              : t('BACKGROUND.MOTHERBOARD.MODE.MANUAL')}
          </Badge>
        </div>

        {/* Style Grid */}
        <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-3">
          {styles.map((style) => {
            const Icon = style.icon
            const isActive = currentStyle === style.id

            return (
              <button
                key={style.id}
                onClick={() => onStyleChange(style.id)}
                className={`group relative overflow-hidden rounded-lg border-2 p-4 text-left transition-all ${
                  isActive
                    ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                    : 'border-border bg-card/50 hover:border-primary/50 hover:bg-card'
                }`}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute right-2 top-2">
                    <div className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  </div>
                )}

                {/* Icon */}
                <div className="mb-2 flex h-8 w-8 items-center justify-center rounded bg-background/50">
                  <Icon className={`h-4 w-4 ${style.color}`} />
                </div>

                {/* Text */}
                <h3 className="mb-1 font-mono text-sm font-bold tracking-wide text-foreground">
                  {t(style.nameKey)}
                </h3>
                <p className="font-mono text-xs text-muted-foreground">
                  {t(style.descriptionKey)}
                </p>

                {/* Hover Effect */}
                <div className="absolute inset-0 -z-10 bg-primary/5 opacity-0 transition-opacity group-hover:opacity-100" />
              </button>
            )
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <Button
            onClick={onAutoRotateToggle}
            variant={autoRotate ? 'default' : 'outline'}
            size="sm"
            className="flex-1 font-mono text-xs"
          >
            {autoRotate
              ? t('BACKGROUND.MOTHERBOARD.AUTO_ROTATE.DISABLE')
              : t('BACKGROUND.MOTHERBOARD.AUTO_ROTATE.ENABLE')}
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <span className="font-mono">
              {t('BACKGROUND.MOTHERBOARD.INTERVAL', { seconds: 3 })}
            </span>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
          <div className="rounded bg-background/50 p-2 text-center">
            <div className="font-mono text-xs text-muted-foreground">
              {t('BACKGROUND.MOTHERBOARD.STATS.STYLES')}
            </div>
            <div className="font-mono text-sm font-bold text-primary">6</div>
          </div>
          <div className="rounded bg-background/50 p-2 text-center">
            <div className="font-mono text-xs text-muted-foreground">
              {t('BACKGROUND.MOTHERBOARD.STATS.ACTIVE')}
            </div>
            <div className="font-mono text-sm font-bold text-secondary">
              {activeStyleLabel ? t(activeStyleLabel) : currentStyle.toUpperCase().replace('-', ' ')}
            </div>
          </div>
          <div className="rounded bg-background/50 p-2 text-center">
            <div className="font-mono text-xs text-muted-foreground">
              {t('BACKGROUND.MOTHERBOARD.STATS.STATUS')}
            </div>
            <div className="font-mono text-sm font-bold text-accent">
              {t('BACKGROUND.MOTHERBOARD.STATS.ONLINE')}
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
}
