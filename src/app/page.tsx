"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Hero } from "@/components/Hero"
import { About } from "@/components/About"
import { Skills } from "@/components/Skills"
import { Experience } from "@/components/Experience"
import { Projects } from "@/components/Projects"
import { Contact } from "@/components/Contact"
import { LoadingScreen } from "@/components/LoadingScreen"
import { StarField } from "@/components/StarField"

// Global state to track if loading screen has been shown in this session
let hasLoaded = false

export default function Home() {
  const [isLoading, setIsLoading] = useState(!hasLoaded)

  const handleLoadingComplete = () => {
    hasLoaded = true
    setIsLoading(false)
  }

  return (
    <div className="flex flex-col w-full">
      <StarField />
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          <Hero />
          <About />
          <Skills />
          <Experience />
          <Projects />
          <Contact />
          
          <footer className="py-8 text-center text-sm text-muted-foreground border-t border-border">
            <p>© {new Date().getFullYear()} Sarvesh More. All rights reserved.</p>
            <p className="mt-2">Built with Next.js, Tailwind CSS, and React Three Fiber.</p>
          </footer>
        </>
      )}
    </div>
  )
}
