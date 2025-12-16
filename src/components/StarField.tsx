"use client"

import { useEffect, useRef } from "react"

export function StarField() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let stars: { x: number; y: number; z: number; size: number; speed: number; opacity: number; color: string }[] = []
    let scrollY = window.scrollY

    const colors = ["#ffffff", "#ffe9c4", "#d4fbff"] // White, warm white, cool blue

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    const initStars = () => {
      stars = []
      const numStars = Math.floor((canvas.width * canvas.height) / 4000) // Adjusted density
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          z: Math.random() * 2 + 0.5, // Depth factor
          size: Math.random() * 1.5,
          speed: Math.random() * 0.2 + 0.05,
          opacity: Math.random(),
          color: colors[Math.floor(Math.random() * colors.length)],
        })
      }
    }

    const handleScroll = () => {
      scrollY = window.scrollY
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      
      // Create a subtle gradient background for depth
      const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
      gradient.addColorStop(0, "rgba(10, 25, 47, 0)")
      gradient.addColorStop(1, "rgba(10, 25, 47, 0.1)")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        // Enhanced Twinkle effect
        // Randomly change opacity direction
        if (Math.random() > 0.95) {
           star.opacity += (Math.random() - 0.5) * 0.1
        }
        
        // Keep opacity within visible range
        if (star.opacity < 0.2) star.opacity = 0.2
        if (star.opacity > 0.9) star.opacity = 0.9

        ctx.beginPath()
        ctx.fillStyle = star.color
        ctx.globalAlpha = star.opacity
        ctx.arc(star.x, star.y, star.size * star.z, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1.0

        // Move stars based on speed and scroll
        // Parallax effect: stars closer (higher z) move faster
        const scrollSpeed = (scrollY * 0.05) * star.z
        
        // Natural movement + scroll influence
        star.y -= star.speed + (scrollSpeed * 0.01) // Subtle scroll reaction
        
        // Wrap around screen
        if (star.y < 0) {
          star.y = canvas.height
          star.x = Math.random() * canvas.width
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener("resize", resizeCanvas)
    window.addEventListener("scroll", handleScroll)
    
    resizeCanvas()
    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("scroll", handleScroll)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-[-1] pointer-events-none opacity-0 dark:opacity-100 transition-opacity duration-1000"
    />
  )
}
