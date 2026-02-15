'use client'

import { BackgroundStyle } from './animated-backgrounds'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Cpu, Layers, Zap, Activity, Grid3X3, Terminal } from 'lucide-react'

interface MotherboardControlProps {
  currentStyle: BackgroundStyle
  onStyleChange: (style: BackgroundStyle) => void
  autoRotate: boolean
  onAutoRotateToggle: () => void
}

const styles: Array<{
  id: BackgroundStyle
  name: string
  description: string
  icon: React.ElementType
  color: string
}> = [
  {
    id: 'matrix',
    name: 'MATRIX',
    description: 'Cascading code rain',
    icon: Terminal,
    color: 'text-primary',
  },
  {
    id: 'circuit',
    name: 'CIRCUIT',
    description: 'Electronic pathways',
    icon: Cpu,
    color: 'text-secondary',
  },
  {
    id: 'pixel-rain',
    name: 'PIXEL RAIN',
    description: 'Falling pixel blocks',
    icon: Zap,
    color: 'text-accent',
  },
  {
    id: 'ascii-waves',
    name: 'ASCII WAVES',
    description: 'Flowing text patterns',
    icon: Activity,
    color: 'text-primary',
  },
  {
    id: 'binary-grid',
    name: 'BINARY GRID',
    description: 'Matrix of 1s and 0s',
    icon: Grid3X3,
    color: 'text-secondary',
  },
  {
    id: 'terminal-glitch',
    name: 'TERMINAL',
    description: 'Glitching commands',
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
                MOTHERBOARD
              </h2>
              <p className="font-mono text-xs text-muted-foreground">
                BACKGROUND CONTROL UNIT
              </p>
            </div>
          </div>
          <Badge
            variant={autoRotate ? 'default' : 'outline'}
            className="font-mono text-xs"
          >
            {autoRotate ? 'AUTO' : 'MANUAL'}
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
                  {style.name}
                </h3>
                <p className="font-mono text-xs text-muted-foreground">
                  {style.description}
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
            {autoRotate ? 'DISABLE AUTO-ROTATE' : 'ENABLE AUTO-ROTATE'}
          </Button>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            <span className="font-mono">3s interval</span>
          </div>
        </div>

        {/* System Info */}
        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-border pt-4">
          <div className="rounded bg-background/50 p-2 text-center">
            <div className="font-mono text-xs text-muted-foreground">STYLES</div>
            <div className="font-mono text-sm font-bold text-primary">6</div>
          </div>
          <div className="rounded bg-background/50 p-2 text-center">
            <div className="font-mono text-xs text-muted-foreground">ACTIVE</div>
            <div className="font-mono text-sm font-bold text-secondary">
              {currentStyle.toUpperCase().replace('-', ' ')}
            </div>
          </div>
          <div className="rounded bg-background/50 p-2 text-center">
            <div className="font-mono text-xs text-muted-foreground">STATUS</div>
            <div className="font-mono text-sm font-bold text-accent">ONLINE</div>
          </div>
        </div>
      </div>
    </Card>
  )
}
