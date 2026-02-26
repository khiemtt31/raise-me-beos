"use client"

import { useEffect, useState } from "react"

interface CircuitElement {
  vertical: { x1: string; x2: string; duration: number; delay: number }
  horizontal: { y1: string; y2: string; duration: number; delay: number }
  node: { cx: string; cy: string; r: number; duration: number; delay: number }
}

function generateElements(): CircuitElement[] {
  return Array.from({ length: 20 }, () => ({
    vertical: {
      x1: `${Math.random() * 100}%`,
      x2: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
    },
    horizontal: {
      y1: `${Math.random() * 100}%`,
      y2: `${Math.random() * 100}%`,
      duration: 2 + Math.random() * 3,
      delay: Math.random() * 2,
    },
    node: {
      cx: `${Math.random() * 100}%`,
      cy: `${Math.random() * 100}%`,
      r: 0.5,
      duration: 1 + Math.random() * 2,
      delay: Math.random() * 2,
    },
  }))
}

export function PortfolioBackground() {
  const [elements, setElements] = useState<CircuitElement[]>([])

  useEffect(() => {
    setElements(generateElements())
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
      {/* Static circuit background */}
      <div className="absolute inset-0 overflow-hidden bg-background">
        <svg className="h-full w-full">
          {elements.map((el, i) => (
            <g key={i}>
              <line
                x1={el.vertical.x1}
                y1="0"
                x2={el.vertical.x2}
                y2="100%"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary"
                style={{
                  animation: `fade-pulse ${el.vertical.duration}s infinite`,
                  animationDelay: `${el.vertical.delay}s`,
                }}
              />
              <line
                x1="0"
                y1={el.horizontal.y1}
                x2="100%"
                y2={el.horizontal.y2}
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-secondary"
                style={{
                  animation: `fade-pulse ${el.horizontal.duration}s infinite`,
                  animationDelay: `${el.horizontal.delay}s`,
                }}
              />
              <circle
                cx={el.node.cx}
                cy={el.node.cy}
                r={el.node.r}
                fill="currentColor"
                className="text-accent"
                style={{
                  animation: `fade-pulse ${el.node.duration}s infinite`,
                  animationDelay: `${el.node.delay}s`,
                }}
              />
            </g>
          ))}
        </svg>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(146,72,122,0.2),_transparent_60%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,_rgba(228,155,166,0.2),_transparent_55%)]" />
      <div className="absolute inset-0 bg-cyber-grid" />
      <div className="absolute inset-0 bg-scanlines mix-blend-soft-light" />
    </div>
  )
}
