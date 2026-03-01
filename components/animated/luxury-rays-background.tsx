'use client'

import { useEffect, useRef } from 'react'

const GOLD_MID = [201, 162, 39]
const GOLD_DIM = [100,  72,  8]

// Random point on one of the 4 screen edges (the "void")
function randomEdgePoint(W: number, H: number): [number, number] {
  const edge = Math.floor(Math.random() * 4)
  switch (edge) {
    case 0: return [Math.random() * W, -2]           // top
    case 1: return [W + 2, Math.random() * H]         // right
    case 2: return [Math.random() * W, H + 2]         // bottom
    default: return [-2, Math.random() * H]           // left
  }
}

interface Ray {
  ox: number           // origin on screen edge
  oy: number
  angle: number        // current render angle
  spreadOffset: number // persistent angle offset from VP direction
  width: number
  baseOpacity: number
  isBright: boolean
  phase: number
  lerpSpeed: number
}

function makeRay(W: number, H: number, vpX: number, vpY: number): Ray {
  const [ox, oy] = randomEdgePoint(W, H)
  const isBright = Math.random() > 0.82
  const spreadOffset = (Math.random() - 0.5) * Math.PI * 1.1
  const toVP = Math.atan2(vpY - oy, vpX - ox)
  return {
    ox, oy,
    angle: toVP + spreadOffset,
    spreadOffset,
    width:       isBright ? Math.random() * 1.1 + 0.5 : Math.random() * 0.4 + 0.1,
    baseOpacity: isBright ? Math.random() * 0.20 + 0.12 : Math.random() * 0.07 + 0.02,
    isBright,
    phase:     Math.random() * Math.PI * 2,
    lerpSpeed: 0.0006 + Math.random() * 0.0012,
  }
}

export function LuxuryRaysBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let W = window.innerWidth
    let H = window.innerHeight
    canvas.width = W
    canvas.height = H

    // Cursor drives a "vanishing point" — rays slowly aim to pass through it
    let targetVPX = W * 0.50
    let targetVPY = H * 0.45
    let vpX = targetVPX
    let vpY = targetVPY

    const onMouseMove = (e: MouseEvent) => {
      targetVPX = e.clientX
      targetVPY = e.clientY
    }
    const onResize = () => {
      W = window.innerWidth
      H = window.innerHeight
      canvas.width = W
      canvas.height = H
    }

    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('resize', onResize)

    // Regular rays from edges
    const rays: Ray[] = Array.from({ length: 60 }, () => makeRay(W, H, vpX, vpY))

    // A few wider hero streaks — still subtle
    for (let i = 0; i < 4; i++) {
      const [ox, oy] = randomEdgePoint(W, H)
      const spreadOffset = (Math.random() - 0.5) * Math.PI * 0.5
      const toVP = Math.atan2(vpY - oy, vpX - ox)
      rays.push({
        ox, oy,
        angle: toVP + spreadOffset,
        spreadOffset,
        width:       Math.random() * 1.8 + 1.4,
        baseOpacity: Math.random() * 0.15 + 0.18,
        isBright: true,
        phase:     Math.random() * Math.PI * 2,
        lerpSpeed: 0.0004 + Math.random() * 0.0006,
      })
    }

    let frame = 0
    let animId = 0

    ctx.fillStyle = '#050500'
    ctx.fillRect(0, 0, W, H)

    function draw() {
      if (!ctx) return
      frame++

      // VP lazily follows cursor (slower = more dramatic sweep)
      vpX += (targetVPX - vpX) * 0.025
      vpY += (targetVPY - vpY) * 0.025

      // Ghost trail — let previous frames linger
      ctx.fillStyle = 'rgba(5, 5, 0, 0.30)'
      ctx.fillRect(0, 0, W, H)

      const diag = Math.sqrt(W * W + H * H)

      for (const ray of rays) {
        // Recompute target angle: from this ray's edge origin toward cursor VP + its own spread
        const toVP = Math.atan2(vpY - ray.oy, vpX - ray.ox)
        const targetAngle = toVP + ray.spreadOffset

        // Wrap-safe angle lerp
        let da = targetAngle - ray.angle
        while (da >  Math.PI) da -= 2 * Math.PI
        while (da < -Math.PI) da += 2 * Math.PI
        ray.angle += da * ray.lerpSpeed * 60

        // Gentle pulse
        const pulse = Math.sin(frame * 0.015 + ray.phase) * 0.025
        const opacity = Math.max(0, ray.baseOpacity + pulse)

        // Draw from edge origin outward in current direction
        const endX = ray.ox + Math.cos(ray.angle) * diag
        const endY = ray.oy + Math.sin(ray.angle) * diag

        // Gradient: void (edge) → fades in → dim peak → fades back to void
        const grad = ctx.createLinearGradient(ray.ox, ray.oy, endX, endY)
        if (ray.isBright) {
          grad.addColorStop(0,    `rgba(5,5,0,0)`)
          grad.addColorStop(0.06, `rgba(${GOLD_DIM.join(',')},${opacity * 0.25})`)
          grad.addColorStop(0.25, `rgba(${GOLD_MID.join(',')},${opacity})`)
          grad.addColorStop(0.48, `rgba(${GOLD_DIM.join(',')},${opacity * 0.45})`)
          grad.addColorStop(0.72, `rgba(${GOLD_DIM.join(',')},${opacity * 0.12})`)
          grad.addColorStop(1,    `rgba(5,5,0,0)`)
        } else {
          grad.addColorStop(0,    `rgba(5,5,0,0)`)
          grad.addColorStop(0.12, `rgba(${GOLD_DIM.join(',')},${opacity * 0.35})`)
          grad.addColorStop(0.38, `rgba(${GOLD_DIM.join(',')},${opacity})`)
          grad.addColorStop(0.65, `rgba(${GOLD_DIM.join(',')},${opacity * 0.20})`)
          grad.addColorStop(1,    `rgba(5,5,0,0)`)
        }

        ctx.beginPath()
        ctx.moveTo(ray.ox, ray.oy)
        ctx.lineTo(endX, endY)
        ctx.strokeStyle = grad
        ctx.lineWidth = ray.width
        ctx.lineCap = 'butt'
        ctx.stroke()
      }

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('resize', onResize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 -z-10"
      style={{ background: '#050500' }}
    />
  )
}
