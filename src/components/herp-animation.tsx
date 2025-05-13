"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const devicePixelRatio = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * devicePixelRatio
      canvas.height = rect.height * devicePixelRatio

      ctx.scale(devicePixelRatio, devicePixelRatio)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.size = Math.random() * 5 + 1
        this.speedX = Math.random() * 3 - 1.5
        this.speedY = Math.random() * 3 - 1.5

        const colors = [
          "#9333ea", // purple-600
          "#db2777", // pink-600
          "#8b5cf6", // violet-500
          "#c026d3", // fuchsia-600
        ]

        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY

        if (this.size > 0.2) this.size -= 0.05
      }

      draw() {
        if (!ctx) return
        ctx.fillStyle = this.color
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    // Create particles array
    const particles: Particle[] = []

    // Create mock UI elements
    const drawMockUI = () => {
      if (!ctx || !canvas) return

      const width = canvas.width / (window.devicePixelRatio || 1)
      const height = canvas.height / (window.devicePixelRatio || 1)

      // Draw device frame
      ctx.fillStyle = "#f5f5f5"
      ctx.strokeStyle = "#e5e5e5"
      ctx.lineWidth = 2
      roundedRect(ctx, width * 0.1, height * 0.1, width * 0.8, height * 0.8, 20)
      ctx.fill()
      ctx.stroke()

      // Draw screen
      ctx.fillStyle = "#ffffff"
      roundedRect(ctx, width * 0.15, height * 0.15, width * 0.7, height * 0.7, 10)
      ctx.fill()

      // Draw header
      ctx.fillStyle = "#9333ea"
      roundedRect(ctx, width * 0.15, height * 0.15, width * 0.7, height * 0.1, 10, true, false, false, false)
      ctx.fill()

      // Draw content blocks
      ctx.fillStyle = "#f3f4f6"

      // Email block
      roundedRect(ctx, width * 0.2, height * 0.3, width * 0.6, height * 0.15, 8)
      ctx.fill()

      // PDF block
      roundedRect(ctx, width * 0.2, height * 0.5, width * 0.6, height * 0.15, 8)
      ctx.fill()

      // Button
      ctx.fillStyle = "#9333ea"
      roundedRect(ctx, width * 0.35, height * 0.7, width * 0.3, height * 0.08, 8)
      ctx.fill()

      // Add text
      ctx.fillStyle = "#ffffff"
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Prototype Dashboard", width * 0.5, height * 0.21)

      // Add icons and details (simplified)
      ctx.fillStyle = "#9333ea"
      ctx.beginPath()
      ctx.arc(width * 0.25, height * 0.375, 8, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(width * 0.25, height * 0.575, 8, 0, Math.PI * 2)
      ctx.fill()

      // Add text lines
      ctx.fillStyle = "#6b7280"
      ctx.textAlign = "left"
      ctx.font = "12px Arial"
      ctx.fillText("Email to: Marketing Team", width * 0.3, height * 0.375)
      ctx.fillText("PDF Summary: Q2 Report", width * 0.3, height * 0.575)

      // Button text
      ctx.fillStyle = "#ffffff"
      ctx.textAlign = "center"
      ctx.fillText("Process Now", width * 0.5, height * 0.74)

      // Animation elements
      const time = Date.now() * 0.001

      // Animated dots
      ctx.fillStyle = "#9333ea"
      ctx.beginPath()
      ctx.arc(width * 0.8, height * 0.375 + Math.sin(time * 2) * 3, 4, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(width * 0.8, height * 0.575 + Math.sin(time * 2 + 1) * 3, 4, 0, Math.PI * 2)
      ctx.fill()
    }

    // Helper function for rounded rectangles
    function roundedRect(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number,
      topLeft = true,
      topRight = true,
      bottomRight = true,
      bottomLeft = true,
    ) {
      ctx.beginPath()
      ctx.moveTo(x + (topLeft ? radius : 0), y)
      ctx.lineTo(x + width - (topRight ? radius : 0), y)
      if (topRight) ctx.arcTo(x + width, y, x + width, y + radius, radius)
      else ctx.lineTo(x + width, y)
      ctx.lineTo(x + width, y + height - (bottomRight ? radius : 0))
      if (bottomRight) ctx.arcTo(x + width, y + height, x + width - radius, y + height, radius)
      else ctx.lineTo(x + width, y + height)
      ctx.lineTo(x + (bottomLeft ? radius : 0), y + height)
      if (bottomLeft) ctx.arcTo(x, y + height, x, y + height - radius, radius)
      else ctx.lineTo(x, y + height)
      ctx.lineTo(x, y + (topLeft ? radius : 0))
      if (topLeft) ctx.arcTo(x, y, x + radius, y, radius)
      else ctx.lineTo(x, y)
      ctx.closePath()
    }

    // Mouse effect
    const mouse = {
      x: 0,
      y: 0,
      isActive: false,
    }

    canvas.addEventListener("mousemove", (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
      mouse.isActive = true

      // Add particles on mouse move
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(mouse.x, mouse.y))
      }
    })

    canvas.addEventListener("mouseleave", () => {
      mouse.isActive = false
    })

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw UI
      drawMockUI()

      // Update and draw particles
      for (let i = 0; i < particles.length; i++) {
        particles[i].update()
        particles[i].draw()

        // Remove tiny particles
        if (particles[i].size <= 0.2) {
          particles.splice(i, 1)
          i--
        }
      }

      // Add random particles occasionally
      if (Math.random() < 0.05 && particles.length < 100) {
        const x = (Math.random() * canvas.width) / (window.devicePixelRatio || 1)
        const y = (Math.random() * canvas.height) / (window.devicePixelRatio || 1)
        particles.push(new Particle(x, y))
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <motion.div
      className="relative w-full aspect-[4/3] bg-white rounded-xl shadow-2xl overflow-hidden"
      initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
    >
      <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
    </motion.div>
  )
}
