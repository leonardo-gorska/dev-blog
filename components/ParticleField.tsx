"use client"

import { useEffect, useRef } from "react"
import { Renderer, Camera, Geometry, Program, Mesh } from "ogl"

/**
 * WebGL Particle Field — DevBlog version (OGL).
 * Same 3D particle cloud, lighter colors for white background.
 */

const hexToRgb = (hex: string): number[] => {
  hex = hex.replace(/^#/, "")
  if (hex.length === 3) hex = hex.split("").map(c => c + c).join("")
  const int = parseInt(hex, 16)
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255]
}

const vertex = /* glsl */ `
  attribute vec3 position;
  attribute vec4 random;
  attribute vec3 color;
  uniform mat4 modelMatrix;
  uniform mat4 viewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uSpread;
  uniform float uBaseSize;
  uniform float uSizeRandomness;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    vRandom = random;
    vColor = color;
    vec3 pos = position * uSpread;
    pos.z *= 10.0;
    vec4 mPos = modelMatrix * vec4(pos, 1.0);
    float t = uTime;
    mPos.x += sin(t * random.z + 6.28 * random.w) * mix(0.1, 1.5, random.x);
    mPos.y += sin(t * random.y + 6.28 * random.x) * mix(0.1, 1.5, random.w);
    mPos.z += sin(t * random.w + 6.28 * random.y) * mix(0.1, 1.5, random.z);
    vec4 mvPos = viewMatrix * mPos;
    gl_PointSize = (uBaseSize * (1.0 + uSizeRandomness * (random.x - 0.5))) / length(mvPos.xyz);
    gl_Position = projectionMatrix * mvPos;
  }
`

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  varying vec4 vRandom;
  varying vec3 vColor;
  void main() {
    vec2 uv = gl_PointCoord.xy;
    float d = length(uv - vec2(0.5));
    float circle = smoothstep(0.5, 0.4, d) * 0.6;
    gl_FragColor = vec4(vColor + 0.15 * sin(uv.yxx + uTime + vRandom.y * 6.28), circle);
  }
`

const COLORS = ["#3b82f6", "#6366f1", "#8b5cf6", "#0ea5e9"]

export default function ParticleField() {
  const containerRef = useRef<HTMLDivElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio, 2), depth: false, alpha: true })
    const gl = renderer.gl
    container.appendChild(gl.canvas)
    gl.clearColor(0, 0, 0, 0)

    const camera = new Camera(gl, { fov: 15 })
    camera.position.set(0, 0, 20)

    const resize = () => {
      renderer.setSize(container.clientWidth, container.clientHeight)
      camera.perspective({ aspect: gl.canvas.width / gl.canvas.height })
    }
    window.addEventListener("resize", resize)
    resize()

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect()
      mouseRef.current = {
        x: ((e.clientX - rect.left) / rect.width) * 2 - 1,
        y: -(((e.clientY - rect.top) / rect.height) * 2 - 1),
      }
    }
    container.addEventListener("mousemove", handleMouseMove)

    const count = 250
    const positions = new Float32Array(count * 3)
    const randoms = new Float32Array(count * 4)
    const colors = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      let x, y, z, len
      do { x = Math.random()*2-1; y = Math.random()*2-1; z = Math.random()*2-1; len = x*x+y*y+z*z } while (len > 1 || len === 0)
      const r = Math.cbrt(Math.random())
      positions.set([x*r, y*r, z*r], i*3)
      randoms.set([Math.random(), Math.random(), Math.random(), Math.random()], i*4)
      const col = hexToRgb(COLORS[Math.floor(Math.random() * COLORS.length)])
      colors.set(col, i*3)
    }

    const geometry = new Geometry(gl, {
      position: { size: 3, data: positions },
      random: { size: 4, data: randoms },
      color: { size: 3, data: colors },
    })

    const program = new Program(gl, {
      vertex, fragment,
      uniforms: {
        uTime: { value: 0 },
        uSpread: { value: 10 },
        uBaseSize: { value: 80 * Math.min(window.devicePixelRatio, 2) },
        uSizeRandomness: { value: 1 },
      },
      transparent: true, depthTest: false,
    })

    const particles = new Mesh(gl, { mode: gl.POINTS, geometry, program })
    let animationFrameId: number
    let lastTime = performance.now()
    let elapsed = 0

    const update = (t: number) => {
      animationFrameId = requestAnimationFrame(update)
      const delta = t - lastTime; lastTime = t; elapsed += delta * 0.1
      program.uniforms.uTime.value = elapsed * 0.001
      particles.position.x += (-mouseRef.current.x - particles.position.x) * 0.05
      particles.position.y += (-mouseRef.current.y - particles.position.y) * 0.05
      particles.rotation.x = Math.sin(elapsed * 0.0002) * 0.1
      particles.rotation.y = Math.cos(elapsed * 0.0005) * 0.15
      particles.rotation.z += 0.001
      renderer.render({ scene: particles, camera })
    }

    animationFrameId = requestAnimationFrame(update)

    return () => {
      window.removeEventListener("resize", resize)
      container.removeEventListener("mousemove", handleMouseMove)
      cancelAnimationFrame(animationFrameId)
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas)
    }
  }, [])

  return (
    <div ref={containerRef} style={{
      position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
      pointerEvents: "none", zIndex: 1,
    }} />
  )
}
