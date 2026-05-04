"use client"

import { useEffect, useRef } from "react"

/**
 * Organic Blob Field — DevBlog version (light bg).
 * Ghost-like blobs that only appear near the cursor.
 */

function hash(x: number, y: number): number {
  let n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return n - Math.floor(n)
}

function smoothNoise(x: number, y: number): number {
  const ix = Math.floor(x)
  const iy = Math.floor(y)
  const fx = x - ix
  const fy = y - iy
  const sx = fx * fx * (3 - 2 * fx)
  const sy = fy * fy * (3 - 2 * fy)
  const a = hash(ix, iy)
  const b = hash(ix + 1, iy)
  const c = hash(ix, iy + 1)
  const d = hash(ix + 1, iy + 1)
  return a + (b - a) * sx + (c - a) * sy + (a - b - c + d) * sx * sy
}

function noise2D(x: number, y: number): number {
  let val = 0
  val += smoothNoise(x, y) * 0.5
  val += smoothNoise(x * 2, y * 2) * 0.25
  val += smoothNoise(x * 4, y * 4) * 0.125
  return val
}

interface Blob {
  x: number
  y: number
  baseRadius: number
  color: string
  speed: number
  noiseOffsetX: number
  noiseOffsetY: number
  opacity: number
}

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -1000, y: -1000 })
  const smoothMouse = useRef({ x: -1000, y: -1000 })
  const animationId = useRef<number>(0)
  const time = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    const blobs: Blob[] = [
      { x: -1000, y: -1000, baseRadius: 220, color: "79, 70, 229", speed: 0.3, noiseOffsetX: 0, noiseOffsetY: 100, opacity: 0.04 },
      { x: -1000, y: -1000, baseRadius: 160, color: "99, 102, 241", speed: 0.5, noiseOffsetX: 50, noiseOffsetY: 200, opacity: 0.05 },
      { x: -1000, y: -1000, baseRadius: 110, color: "59, 130, 246", speed: 0.7, noiseOffsetX: 100, noiseOffsetY: 300, opacity: 0.06 },
      { x: -1000, y: -1000, baseRadius: 70, color: "139, 92, 246", speed: 0.85, noiseOffsetX: 150, noiseOffsetY: 400, opacity: 0.08 },
    ]

    const animate = () => {
      time.current += 0.004
      const lerpFactor = 0.03
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * lerpFactor
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * lerpFactor

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const t = time.current
      const mx = smoothMouse.current.x
      const my = smoothMouse.current.y

      for (const blob of blobs) {
        const blobLerp = blob.speed * 0.04
        blob.x += (mx - blob.x) * blobLerp
        blob.y += (my - blob.y) * blobLerp

        const segments = 72
        ctx.beginPath()

        for (let i = 0; i <= segments; i++) {
          const angle = (i / segments) * Math.PI * 2
          const nx = Math.cos(angle) * 2 + blob.noiseOffsetX + t * 0.8
          const ny = Math.sin(angle) * 2 + blob.noiseOffsetY + t * 0.6
          const noiseVal = noise2D(nx, ny)
          const undulation = Math.sin(angle * 3 + t * 2) * 0.08 +
                            Math.sin(angle * 5 - t * 1.5) * 0.05 +
                            Math.cos(angle * 2 + t * 3) * 0.06
          const radiusDeform = 1 + (noiseVal - 0.5) * 0.5 + undulation
          const r = blob.baseRadius * radiusDeform
          const px = blob.x + Math.cos(angle) * r
          const py = blob.y + Math.sin(angle) * r
          if (i === 0) ctx.moveTo(px, py)
          else ctx.lineTo(px, py)
        }

        ctx.closePath()
        const gradient = ctx.createRadialGradient(blob.x, blob.y, 0, blob.x, blob.y, blob.baseRadius * 1.3)
        gradient.addColorStop(0, `rgba(${blob.color}, ${blob.opacity * 1.2})`)
        gradient.addColorStop(0.5, `rgba(${blob.color}, ${blob.opacity})`)
        gradient.addColorStop(1, `rgba(${blob.color}, 0)`)
        ctx.fillStyle = gradient
        ctx.fill()
      }

      animationId.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationId.current)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  )
}
