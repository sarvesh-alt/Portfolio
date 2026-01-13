"use client"

import * as React from "react"
import Link from "next/link"
import { ShieldCheck, Home, User, Code, Briefcase, Folder, Mail, Heart } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"

const navItems = [
  { name: "Home", href: "/#home", icon: Home },
  { name: "About", href: "/#about", icon: User },
  { name: "Skills", href: "/#skills", icon: Code },
  { name: "Experience", href: "/#experience", icon: Briefcase },
  { name: "Projects", href: "/#projects", icon: Folder },
  { name: "Contact", href: "/#contact", icon: Mail },
  { name: "Hobbies", href: "/hobbies", icon: Heart },
]

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false)
  const [hoveredNav, setHoveredNav] = React.useState<string | null>(null)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      <nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
          scrolled
            ? "bg-background/80 backdrop-blur-md border-border shadow-sm"
            : "bg-transparent"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center gap-2">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <span className="font-bold text-xl tracking-tight">
                Sarvesh<span className="text-primary">More</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                {navItems.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="text-foreground/80 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile Top Bar (Just Theme Toggle) */}
            <div className="md:hidden flex items-center gap-4">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation */}
      <div className="fixed bottom-6 inset-x-0 z-50 md:hidden flex justify-center pointer-events-none">
        <div 
            className="flex items-center gap-0 p-2 bg-background/20 backdrop-blur-2xl backdrop-saturate-150 border border-foreground/10 rounded-full shadow-2xl pointer-events-auto ring-1 ring-white/10"
            onMouseLeave={() => setHoveredNav(null)}
            onTouchMove={(e) => {
               const touch = e.touches[0]
               const element = document.elementFromPoint(touch.clientX, touch.clientY)
               const link = element?.closest("a")
               const name = link?.getAttribute("aria-label")
               setHoveredNav(name || null)
            }}
            onTouchEnd={(e) => {
              setHoveredNav(null)
              const touch = e.changedTouches[0]
              const element = document.elementFromPoint(touch.clientX, touch.clientY)
              const link = element?.closest("a")
               if (link instanceof HTMLElement) {
                  link.click()
               }
            }}
        >
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              aria-label={item.name}
              className="relative w-12 h-12 flex items-center justify-center rounded-full transition-colors z-10"
              onMouseEnter={() => setHoveredNav(item.name)}
            >
                {hoveredNav === item.name && (
                    <motion.div
                        layoutId="bubble"
                        className="absolute inset-0 bg-white/20 rounded-full -z-10"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                )}
               <item.icon className={cn("h-6 w-6 transition-colors duration-200", hoveredNav === item.name ? "text-primary" : "text-foreground/70")} />
            </Link>
          ))}
        </div>
      </div>
    </>
  )
}
