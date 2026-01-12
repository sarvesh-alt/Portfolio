"use client"

import * as React from "react"
import Link from "next/link"
import { ShieldCheck, Home, User, Code, Briefcase, Folder, Mail, Heart } from "lucide-react"
import { ThemeToggle } from "./theme-toggle"
import { cn } from "@/lib/utils"

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
        <div className="flex items-center gap-2 p-2 px-4 bg-background/80 backdrop-blur-md border border-border rounded-full shadow-lg pointer-events-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="p-2 rounded-full text-foreground/80 hover:text-primary hover:bg-muted transition-colors"
                  aria-label={item.name}
                >
                  <Icon className="h-5 w-5" />
                </Link>
              )
            })}
        </div>
      </div>
    </>
  )
}
