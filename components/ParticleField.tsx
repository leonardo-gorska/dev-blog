"use client"

import { useEffect, useRef } from "react"

/**
 * Flow Field Particles — DevBlog (light bg) version.
 * Particles flow organically through noise, cursor creates swirl.
 * No trails on light background — clean clear per frame.
 */

const F2 = 0.5 * (Math.sqrt(3) - 1)
const G2 = (3 - Math.sqrt(3)) / 6
const perm = new Uint8Array(512)
const grad2 = [[1,1],[-1,1],[1,-1],[-1,-1],[1,0],[-1,0],[0,1],[0,-1]]
;(() => {
  const p = new Uint8Array(256)
  for (let i = 0; i < 256; i++) p[i] = i
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[p[i], p[j]] = [p[j], p[i]]
  }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255]
})()

function noise2D(x: number, y: number): number {
  const s = (x + y) * F2
  const i = Math.floor(x + s), j = Math.floor(y + s)
  const t = (i + j) * G2
  const x0 = x - (i - t), y0 = y - (j - t)
  const i1 = x0 > y0 ? 1 : 0, j1 = x0 > y0 ? 0 : 1
  const x1 = x0 - i1 + G2, y1 = y0 - j1 + G2
  const x2 = x0 - 1 + 2 * G2, y2 = y0 - 1 + 2 * G2
  const ii = i & 255, jj = j & 255
  let n0 = 0, n1 = 0, n2 = 0
  let t0 = 0.5 - x0*x0 - y0*y0
  if (t0 > 0) { t0 *= t0; const gi = perm[ii+perm[jj]]%8; n0 = t0*t0*(grad2[gi][0]*x0+grad2[gi][1]*y0) }
  let t1 = 0.5 - x1*x1 - y1*y1
  if (t1 > 0) { t1 *= t1; const gi = perm[ii+i1+perm[jj+j1]]%8; n1 = t1*t1*(grad2[gi][0]*x1+grad2[gi][1]*y1) }
  let t2 = 0.5 - x2*x2 - y2*y2
  if (t2 > 0) { t2 *= t2; const gi = perm[ii+1+perm[jj+1]]%8; n2 = t2*t2*(grad2[gi][0]*x2+grad2[gi][1]*y2) }
  return 70 * (n0 + n1 + n2)
}

interface Particle { x: number; y: number; vx: number; vy: number; hue: number }

const COUNT = 1200
const NOISE_SCALE = 0.003
const NOISE_SPEED = 0.0008
const SPEED = 0.6
const CURSOR_R = 180
const CURSOR_F = 0.35

export default function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouse = useRef({ x: -1000, y: -1000 })
  const smoothMouse = useRef({ x: -1000, y: -1000 })
  const particles = useRef<Particle[]>([])
  const animationId = useRef<number>(0)
  const time = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const make = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: 0, vy: 0,
      hue: 220 + Math.random() * 60,
    })

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particles.current = Array.from({ length: COUNT }, make)
    }
    resize()
    window.addEventListener("resize", resize)

    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener("mousemove", handleMouseMove)

    const animate = () => {
      time.current += NOISE_SPEED
      smoothMouse.current.x += (mouse.current.x - smoothMouse.current.x) * 0.05
      smoothMouse.current.y += (mouse.current.y - smoothMouse.current.y) * 0.05

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const mx = smoothMouse.current.x
      const my = smoothMouse.current.y
      const t = time.current

      for (const p of particles.current) {
        const angle = noise2D(p.x * NOISE_SCALE + t, p.y * NOISE_SCALE + t) * Math.PI * 4
        p.vx += Math.cos(angle) * SPEED * 0.1
        p.vy += Math.sin(angle) * SPEED * 0.1

        const dx = p.x - mx, dy = p.y - my
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CURSOR_R && dist > 1) {
          const force = (1 - dist / CURSOR_R) * CURSOR_F
          const sa = Math.atan2(dy, dx) + Math.PI * 0.5
          p.vx += Math.cos(sa) * force
          p.vy += Math.sin(sa) * force
        }

        p.vx *= 0.92
        p.vy *= 0.92
        const spd = Math.sqrt(p.vx*p.vx + p.vy*p.vy)
        if (spd > 2) { p.vx = (p.vx/spd)*2; p.vy = (p.vy/spd)*2 }

        p.x += p.vx
        p.y += p.vy

        const ci = dist < CURSOR_R ? (1 - dist / CURSOR_R) : 0
        const size = 1 + ci * 1.5

        ctx.beginPath()
        ctx.arc(p.x, p.y, size, 0, Math.PI * 2)
        ctx.fillStyle = `hsla(${p.hue}, 60%, 55%, ${0.15 + ci * 0.45})`
        ctx.fill()

        if (p.x < -20 || p.x > canvas.width+20 || p.y < -20 || p.y > canvas.height+20) {
          Object.assign(p, make())
        }
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
        zIndex: 0,
      }}
    />
  )
}
