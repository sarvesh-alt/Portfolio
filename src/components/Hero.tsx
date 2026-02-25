"use client"

import { motion } from "framer-motion"
import { Globe } from "./Globe"
import Link from "next/link"
import { ArrowRight, Download } from "lucide-react"
import { useState, useEffect } from "react"

export function Hero() {
  const [text, setText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [loopNum, setLoopNum] = useState(0)
  
  // Array of titles to cycle through for a more dynamic effect
  const titles = ["Cybersecurity & Cloud Engineer", "Secure Systems Architect", "Automation Specialist"]
  const typingSpeed = 100
  const deletingSpeed = 50
  const pauseTime = 2000

  useEffect(() => {
    const currentTitle = titles[loopNum % titles.length]
    
    const handleTyping = () => {
      if (!isDeleting) {
        // Typing
        if (text.length < currentTitle.length) {
          setText(currentTitle.slice(0, text.length + 1))
        } else {
          // Finished typing, wait before deleting
          setTimeout(() => setIsDeleting(true), pauseTime)
        }
      } else {
        // Deleting
        if (text.length > 0) {
          setText(currentTitle.slice(0, text.length - 1))
        } else {
          // Finished deleting, move to next title
          setIsDeleting(false)
          setLoopNum(loopNum + 1)
        }
      }
    }

    const timer = setTimeout(handleTyping, isDeleting ? deletingSpeed : typingSpeed)
    return () => clearTimeout(timer)
  }, [text, isDeleting, loopNum])

  return (
    <section id="home" className="min-h-screen flex flex-col lg:flex-row items-stretch pt-16 relative overflow-hidden">

      {/* ── Desktop: Globe fills entire section background ── */}
      <div className="hidden lg:block absolute inset-0">
        <Globe mode="bg" />
      </div>

      {/* Desktop gradient: left column opaque, right shows map */}
      <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/10 pointer-events-none z-10" />

      {/* ── Content ───────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-20 flex flex-col lg:grid lg:grid-cols-2 gap-6 py-16 lg:items-center">
        {/* Text panel */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6 text-center lg:text-left"
        >
          <div className="inline-block min-h-[28px]">
            <h2 className="text-primary font-mono text-lg tracking-wide border-r-2 border-primary animate-pulse pr-1 overflow-hidden whitespace-nowrap">
              {text}
            </h2>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight">
            Securing Cloud Systems. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
              Automating Intelligence.
            </span>
          </h1>
          <p className="text-muted-foreground text-lg sm:text-xl max-w-2xl mx-auto lg:mx-0">
            I build secure, scalable cloud architectures and AI-driven automation pipelines.
            Bridging the gap between DevOps, Security, and Data Engineering.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Link
              href="#projects"
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-primary-foreground bg-primary hover:bg-primary/90 transition-colors"
            >
              View Projects
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              href="/resume.pdf"
              target="_blank"
              className="inline-flex items-center justify-center px-6 py-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground text-base font-medium rounded-md transition-colors"
            >
              Download Resume
              <Download className="ml-2 h-4 w-4" />
            </Link>
          </div>

          {/* ── Mobile-only: Globe card below buttons ── */}
          <div className="block lg:hidden pt-2">
            <Globe mode="card" />
          </div>
        </motion.div>

        {/* Right column spacer (desktop only — shows map through gradient) */}
        <div className="hidden lg:block" />
      </div>
    </section>
  )
}
