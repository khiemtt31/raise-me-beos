'use client'

import { useEffect, useRef, useState } from 'react'

export type BackgroundStyle = 
  | 'matrix' 
  | 'circuit' 
  | 'pixel-rain' 
  | 'ascii-waves' 
  | 'binary-grid'
  | 'terminal-glitch'

interface AnimatedBackgroundProps {
  style: BackgroundStyle
}

export function AnimatedBackground({ style }: AnimatedBackgroundProps) {
  switch (style) {
    case 'matrix':
      return <MatrixBackground />
    case 'circuit':
      return <CircuitBackground />
    case 'pixel-rain':
      return <PixelRainBackground />
    case 'ascii-waves':
      return <AsciiWavesBackground />
    case 'binary-grid':
      return <BinaryGridBackground />
    case 'terminal-glitch':
      return <TerminalGlitchBackground />
    default:
      return <MatrixBackground />
  }
}

function MatrixBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const chars = '01アイウエオカキクケコサシスセソタチツテト'
    const fontSize = 14
    const columns = canvas.width / fontSize
    const drops: number[] = Array(Math.floor(columns)).fill(1)

    function draw() {
      if (!ctx || !canvas) return
      ctx.fillStyle = 'rgba(13, 17, 23, 0.05)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#22d3ee'
      ctx.font = `${fontSize}px monospace`

      for (let i = 0; i < drops.length; i++) {
        const text = chars[Math.floor(Math.random() * chars.length)]
        ctx.fillText(text, i * fontSize, drops[i] * fontSize)

        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0
        }
        drops[i]++
      }
    }

    const interval = setInterval(draw, 33)

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      clearInterval(interval)
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}

function CircuitBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      <svg className="h-full w-full">
        {Array.from({ length: 20 }).map((_, i) => (
          <g key={i}>
            <line
              x1={Math.random() * 100 + '%'}
              y1="0"
              x2={Math.random() * 100 + '%'}
              y2="100%"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-primary"
              style={{
                animation: `fade-pulse ${2 + Math.random() * 3}s infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
            <line
              x1="0"
              y1={Math.random() * 100 + '%'}
              x2="100%"
              y2={Math.random() * 100 + '%'}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-secondary"
              style={{
                animation: `fade-pulse ${2 + Math.random() * 3}s infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
            <circle
              cx={Math.random() * 100 + '%'}
              cy={Math.random() * 100 + '%'}
              r="0.5"
              fill="currentColor"
              className="text-accent"
              style={{
                animation: `fade-pulse ${1 + Math.random() * 2}s infinite`,
                animationDelay: `${Math.random() * 2}s`,
              }}
            />
          </g>
        ))}
      </svg>
    </div>
  )
}

function PixelRainBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    interface Pixel {
      x: number
      y: number
      size: number
      speed: number
      color: string
    }

    const colors = ['#22d3ee', '#c084fc', '#fb7185']
    const pixels: Pixel[] = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 4 + 2,
      speed: Math.random() * 2 + 1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }))

    function animate() {
      if (!ctx || !canvas) return
      ctx.fillStyle = 'rgba(13, 17, 23, 0.1)'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      pixels.forEach((pixel) => {
        ctx.fillStyle = pixel.color
        ctx.fillRect(pixel.x, pixel.y, pixel.size, pixel.size)

        pixel.y += pixel.speed
        if (pixel.y > canvas.height) {
          pixel.y = -pixel.size
          pixel.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10" />
}

function AsciiWavesBackground() {
  const [waves, setWaves] = useState<string[]>([])

  useEffect(() => {
    const patterns = ['░░░', '▒▒▒', '▓▓▓', '███', '▓▓▓', '▒▒▒']
    const generateWaves = () => {
      const lines: string[] = []
      for (let i = 0; i < 100; i++) {
        const pattern = patterns[Math.floor(Math.random() * patterns.length)]
        const line = pattern.repeat(50)
        lines.push(line)
      }
      setWaves(lines)
    }

    generateWaves()
    const interval = setInterval(generateWaves, 200)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden font-mono text-xs leading-3">
      {waves.map((wave, i) => (
        <div
          key={i}
          className="whitespace-nowrap text-primary"
          style={{
            animation: 'wave-move 10s linear infinite',
            animationDelay: `${i * 0.05}s`,
          }}
        >
          {wave}
        </div>
      ))}
    </div>
  )
}

function BinaryGridBackground() {
  const [grid, setGrid] = useState<string[][]>([])

  useEffect(() => {
    const cols = 120
    const rows = 80

    const generateGrid = () => {
      const newGrid: string[][] = []
      for (let i = 0; i < rows; i++) {
        const row: string[] = []
        for (let j = 0; j < cols; j++) {
          row.push(Math.random() > 0.5 ? '1' : '0')
        }
        newGrid.push(row)
      }
      setGrid(newGrid)
    }

    generateGrid()
    const interval = setInterval(generateGrid, 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden font-mono text-xs leading-4 whitespace-pre-wrap break-all">
      {grid.map((row, i) => (
        <div key={i} className="flex gap-0">
          {row.map((cell, j) => (
            <span
              key={j}
              className={cell === '1' ? 'text-primary' : 'text-muted-foreground'}
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  )
}

function TerminalGlitchBackground() {
  const [lines, setLines] = useState<string[]>([])

  useEffect(() => {
    const commands = [
      '$ sudo init system.core',
      '$ loading modules...',
      '$ [OK] network.interface',
      '$ [OK] graphics.driver',
      '$ WARNING: anomaly detected',
      '$ scanning sectors...',
      '$ [OK] boot.sequence',
      '$ system.ready',
      '$ initializing neural network...',
      '$ [OK] quantum processor',
      '$ synchronizing temporal gates...',
      '$ [ALERT] cosmic radiation detected',
      '$ [OK] dimensional stabilizer',
      '$ calibrating stellar alignment...',
      '$ [WARNING] entropy increasing',
      '$ [OK] reality anchor engaged',
      '$ establishing connection to nexus...',
      '$ [OK] parallel universe link',
      '$ initiating backup protocols...',
      '$ [OK] data preservation complete',
    ]

    const generateLines = () => {
      const newLines: string[] = []
      for (let i = 0; i < 60; i++) {
        const cmd = commands[Math.floor(Math.random() * commands.length)]
        newLines.push(cmd)
      }
      setLines(newLines)
    }

    generateLines()
    const interval = setInterval(generateLines, 150)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden font-mono text-sm leading-6">
      <div className="w-full h-full overflow-y-auto pr-8">
        {lines.map((line, i) => (
          <div
            key={i}
            className="text-primary"
            style={{
              animation: 'pixel-glitch 0.5s infinite',
              animationDelay: `${i * 0.02}s`,
            }}
          >
            {line}
          </div>
        ))}
      </div>
    </div>
  )
}
