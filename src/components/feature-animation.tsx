"use client"

import { useEffect, useRef } from "react"

interface FeatureAnimationProps {
  type: "email" | "pdf"
}

export default function FeatureAnimation({ type }: FeatureAnimationProps) {
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

    // Animation variables
    let animationFrame: number
    const startTime = Date.now()

    // Helper function for rounded rectangles
    function roundedRect(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      width: number,
      height: number,
      radius: number,
    ) {
      ctx.beginPath()
      ctx.moveTo(x + radius, y)
      ctx.lineTo(x + width - radius, y)
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
      ctx.lineTo(x + width, y + height - radius)
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
      ctx.lineTo(x + radius, y + height)
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
      ctx.lineTo(x, y + radius)
      ctx.quadraticCurveTo(x, y, x + radius, y)
      ctx.closePath()
    }

    // Draw email animation
    const drawEmailAnimation = (time: number) => {
      if (!ctx || !canvas) return

      const width = canvas.width / (window.devicePixelRatio || 1)
      const height = canvas.height / (window.devicePixelRatio || 1)

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw interface background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)

      // Draw header
      ctx.fillStyle = "#9333ea"
      ctx.fillRect(0, 0, width, height * 0.15)

      // Draw header text
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Email Distribution System", width / 2, height * 0.09)

      // Draw user roles section
      ctx.fillStyle = "#f3f4f6"
      roundedRect(ctx, width * 0.05, height * 0.2, width * 0.4, height * 0.7, 8)
      ctx.fill()

      // Draw email content section
      ctx.fillStyle = "#f8fafc"
      roundedRect(ctx, width * 0.5, height * 0.2, width * 0.45, height * 0.7, 8)
      ctx.fill()

      // Draw section titles
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "left"
      ctx.fillText("User Roles", width * 0.1, height * 0.25)
      ctx.fillText("Email Content", width * 0.55, height * 0.25)

      // Draw user roles
      const roles = ["Marketing", "Sales", "Development", "Management"]
      const roleColors = ["#9333ea", "#db2777", "#3b82f6", "#10b981"]

      roles.forEach((role, i) => {
        const y = height * 0.32 + i * height * 0.12
        const isActive = Math.sin(time * 0.001 + i) > 0.7

        // Role background
        ctx.fillStyle = isActive ? `${roleColors[i]}20` : "#ffffff"
        roundedRect(ctx, width * 0.08, y, width * 0.34, height * 0.08, 6)
        ctx.fill()

        // Role border
        ctx.strokeStyle = roleColors[i]
        ctx.lineWidth = 2
        roundedRect(ctx, width * 0.08, y, width * 0.34, height * 0.08, 6)
        ctx.stroke()

        // Role text
        ctx.fillStyle = isActive ? roleColors[i] : "#4b5563"
        ctx.font = isActive ? "bold 13px Arial" : "13px Arial"
        ctx.textAlign = "left"
        ctx.fillText(role, width * 0.12, y + height * 0.045)

        // Role checkbox
        ctx.beginPath()
        if (isActive) {
          ctx.fillStyle = roleColors[i]
          ctx.arc(width * 0.35, y + height * 0.04, 6, 0, Math.PI * 2)
          ctx.fill()

          // Checkmark
          ctx.strokeStyle = "#ffffff"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.moveTo(width * 0.345, y + height * 0.04)
          ctx.lineTo(width * 0.35, y + height * 0.05)
          ctx.lineTo(width * 0.36, y + height * 0.03)
          ctx.stroke()
        } else {
          ctx.strokeStyle = "#9ca3af"
          ctx.lineWidth = 1.5
          ctx.arc(width * 0.35, y + height * 0.04, 6, 0, Math.PI * 2)
          ctx.stroke()
        }
      })

      // Draw email content
      ctx.fillStyle = "#ffffff"
      roundedRect(ctx, width * 0.55, height * 0.32, width * 0.35, height * 0.4, 6)
      ctx.fill()

      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 1
      roundedRect(ctx, width * 0.55, height * 0.32, width * 0.35, height * 0.4, 6)
      ctx.stroke()

      // Email subject
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "left"
      ctx.fillText("Subject: Quarterly Update", width * 0.57, height * 0.35)

      // Email content lines
      ctx.fillStyle = "#4b5563"
      ctx.font = "11px Arial"
      const lines = [
        "Team,",
        "",
        "Here are the key updates for this quarter:",
        "• New product features launching next month",
        "• Marketing campaign results exceeded targets",
        "• Customer satisfaction increased by 15%",
        "",
        "Please review the attached documents.",
        "",
        "Best regards,",
        "Management",
      ]

      lines.forEach((line, i) => {
        ctx.fillText(line, width * 0.57, height * 0.39 + i * height * 0.025)
      })

      // Draw send button
      const buttonX = width * 0.55
      const buttonY = height * 0.78
      const buttonWidth = width * 0.35
      const buttonHeight = height * 0.08

      // Button pulse animation
      const pulse = Math.sin(time * 0.003) * 0.1 + 0.9

      const gradient = ctx.createLinearGradient(buttonX, buttonY, buttonX + buttonWidth, buttonY)
      gradient.addColorStop(0, "#9333ea")
      gradient.addColorStop(1, "#db2777")

      ctx.fillStyle = gradient
      roundedRect(ctx, buttonX, buttonY, buttonWidth, buttonHeight, 6)
      ctx.fill()

      // Button text
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("Send to Selected Roles", buttonX + buttonWidth / 2, buttonY + buttonHeight / 2 + 5)

      // Animation: email sending
      if (Math.sin(time * 0.001) > 0.9) {
        // Draw email icons flying to roles
        roles.forEach((_, i) => {
          if (Math.sin(time * 0.001 + i) > 0.7) {
            const progress = (Math.sin(time * 0.002 + i * 0.5) + 1) / 2

            const startX = buttonX + buttonWidth / 2
            const startY = buttonY
            const endX = width * 0.35
            const endY = height * 0.32 + i * height * 0.12 + height * 0.04

            const x = startX + (endX - startX) * progress
            const y = startY + (endY - startY) * progress

            // Email icon
            ctx.fillStyle = "#ffffff"
            ctx.beginPath()
            ctx.moveTo(x - 8, y - 5)
            ctx.lineTo(x + 8, y - 5)
            ctx.lineTo(x + 8, y + 5)
            ctx.lineTo(x - 8, y + 5)
            ctx.closePath()
            ctx.fill()

            ctx.strokeStyle = roleColors[i]
            ctx.lineWidth = 1.5
            ctx.stroke()

            // Email symbol
            ctx.strokeStyle = roleColors[i]
            ctx.beginPath()
            ctx.moveTo(x - 6, y - 3)
            ctx.lineTo(x, y)
            ctx.lineTo(x + 6, y - 3)
            ctx.stroke()
          }
        })
      }
    }

    // Draw PDF animation
    const drawPDFAnimation = (time: number) => {
      if (!ctx || !canvas) return

      const width = canvas.width / (window.devicePixelRatio || 1)
      const height = canvas.height / (window.devicePixelRatio || 1)

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw interface background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(0, 0, width, height)

      // Draw header
      ctx.fillStyle = "#db2777"
      ctx.fillRect(0, 0, width, height * 0.15)

      // Draw header text
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 16px Arial"
      ctx.textAlign = "center"
      ctx.fillText("PDF Summarization", width / 2, height * 0.09)

      // Draw PDF document
      const docX = width * 0.1
      const docY = height * 0.25
      const docWidth = width * 0.35
      const docHeight = height * 0.6

      // PDF shadow
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
      ctx.fillRect(docX + 5, docY + 5, docWidth, docHeight)

      // PDF background
      ctx.fillStyle = "#ffffff"
      ctx.fillRect(docX, docY, docWidth, docHeight)

      // PDF border
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 1
      ctx.strokeRect(docX, docY, docWidth, docHeight)

      // PDF header
      ctx.fillStyle = "#f3f4f6"
      ctx.fillRect(docX, docY, docWidth, height * 0.08)

      // PDF icon
      ctx.fillStyle = "#ef4444"
      roundedRect(ctx, docX + 10, docY + 10, 20, 25, 2)
      ctx.fill()

      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 10px Arial"
      ctx.textAlign = "center"
      ctx.fillText("PDF", docX + 20, docY + 25)

      // PDF title
      ctx.fillStyle = "#1f2937"
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "left"
      ctx.fillText("Financial Report Q2 2023", docX + 40, docY + 25)

      // PDF content lines
      const startLine = Math.floor(time * 0.001) % 20

      for (let i = 0; i < 15; i++) {
        const y = docY + height * 0.1 + i * height * 0.03

        // Vary line lengths
        const lineWidth = (0.7 + Math.sin(i * 0.5) * 0.2) * docWidth * 0.8

        ctx.fillStyle = "#9ca3af"
        ctx.fillRect(docX + 15, y, lineWidth, height * 0.01)
      }

      // Draw summary section
      const summaryX = width * 0.55
      const summaryY = height * 0.25
      const summaryWidth = width * 0.35
      const summaryHeight = height * 0.6

      // Summary background with gradient
      const gradient = ctx.createLinearGradient(summaryX, summaryY, summaryX + summaryWidth, summaryY + summaryHeight)
      gradient.addColorStop(0, "#fdf2f8") // pink-50
      gradient.addColorStop(1, "#f5f3ff") // violet-50

      ctx.fillStyle = gradient
      roundedRect(ctx, summaryX, summaryY, summaryWidth, summaryHeight, 8)
      ctx.fill()

      // Summary border
      ctx.strokeStyle = "#e5e7eb"
      ctx.lineWidth = 1
      roundedRect(ctx, summaryX, summaryY, summaryWidth, summaryHeight, 8)
      ctx.stroke()

      // Summary title
      ctx.fillStyle = "#db2777"
      ctx.font = "bold 14px Arial"
      ctx.textAlign = "center"
      ctx.fillText("AI-Generated Summary", summaryX + summaryWidth / 2, summaryY + 25)

      // Summary content
      ctx.fillStyle = "#4b5563"
      ctx.font = "12px Arial"
      ctx.textAlign = "left"

      const summaryLines = [
        "• Revenue increased by 15% compared to Q1",
        "• New product line contributed to 30% of sales",
        "• Operating expenses reduced by 8%",
        "• Customer acquisition cost decreased",
        "• Expansion into European markets on track",
        "• Projected growth for Q3 is 12-15%",
      ]

      // Animate summary lines appearing
      const animProgress = (time * 0.001) % 6

      summaryLines.forEach((line, i) => {
        if (i <= animProgress) {
          const alpha = i === Math.floor(animProgress) ? animProgress - Math.floor(animProgress) : 1

          ctx.globalAlpha = alpha
          ctx.fillText(line, summaryX + 15, summaryY + 60 + i * height * 0.05)
          ctx.globalAlpha = 1
        }
      })

      // Draw processing animation
      const processingX = width * 0.5 - 15
      const processingY = height * 0.55

      // Draw arrow from PDF to summary
      ctx.strokeStyle = "#db2777"
      ctx.lineWidth = 2

      // Animated arrow
      const arrowProgress = (Math.sin(time * 0.002) + 1) / 2

      ctx.beginPath()
      ctx.moveTo(docX + docWidth + 5, processingY)
      ctx.lineTo(docX + docWidth + 5 + (processingX - (docX + docWidth + 5)) * arrowProgress, processingY)
      ctx.stroke()

      // Arrow head
      if (arrowProgress > 0.9) {
        ctx.beginPath()
        ctx.moveTo(processingX + 5, processingY - 5)
        ctx.lineTo(processingX, processingY)
        ctx.lineTo(processingX + 5, processingY + 5)
        ctx.stroke()
      }

      // AI processing icon
      ctx.fillStyle = "#db2777"
      ctx.beginPath()
      ctx.arc(width * 0.5, processingY, 15, 0, Math.PI * 2)
      ctx.fill()

      // AI icon
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 12px Arial"
      ctx.textAlign = "center"
      ctx.fillText("AI", width * 0.5, processingY + 4)

      // Pulsing effect
      const pulseSize = Math.sin(time * 0.005) * 5 + 5
      ctx.strokeStyle = "rgba(219, 39, 119, 0.3)"
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.arc(width * 0.5, processingY, 15 + pulseSize, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = "rgba(219, 39, 119, 0.1)"
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(width * 0.5, processingY, 15 + pulseSize + 5, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Animation loop
    const animate = () => {
      const time = Date.now() - startTime

      if (type === "email") {
        drawEmailAnimation(time)
      } else {
        drawPDFAnimation(time)
      }

      animationFrame = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      cancelAnimationFrame(animationFrame)
    }
  }, [type])

  return <canvas ref={canvasRef} className="w-full h-full" style={{ width: "100%", height: "100%" }} />
}
