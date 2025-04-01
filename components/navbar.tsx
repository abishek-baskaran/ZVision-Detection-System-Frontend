"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "@/components/theme-toggle"
import { DetectionToggle } from "@/components/cameras/detection-toggle"
import { useState, useEffect } from "react"
import { Menu, X, Home, BarChart2, Camera, FileText, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

const navItems = [
  { name: "Home", path: "/", icon: Home },
  { name: "Dashboard", path: "/dashboard", icon: BarChart2 },
  { name: "Cameras", path: "/cameras", icon: Camera },
  { name: "Events", path: "/events", icon: FileText },
  { name: "Live View", path: "/live", icon: Eye },
]

export default function Navbar() {
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when path changes
  useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled ? "bg-background/80 backdrop-blur-lg shadow-sm" : "bg-transparent",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-6 md:gap-10">
            <Link href="/" className="flex items-center space-x-2">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold"
              >
                C
              </motion.div>
              <span className="font-bold text-xl">CamAnalytics</span>
            </Link>

            <nav className="hidden md:flex gap-6">
              {navItems.map((item) => {
                const isActive = pathname === item.path
                const Icon = item.icon

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "nav-item flex items-center text-sm font-medium transition-colors hover:text-primary",
                      isActive ? "text-primary active" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="h-4 w-4 mr-1" />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              <DetectionToggle />
            </div>
            <ThemeToggle />

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="md:hidden fixed inset-0 top-16 z-50 bg-background/95 backdrop-blur-md"
          >
            <div className="container mx-auto px-4 py-8 flex flex-col items-center">
              {navItems.map((item) => {
                const isActive = pathname === item.path
                const Icon = item.icon

                return (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={cn(
                      "mobile-nav-item flex items-center w-full justify-center my-2",
                      isActive ? "bg-primary/10 text-primary" : "",
                    )}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {item.name}
                  </Link>
                )
              })}

              <div className="mt-8">
                <DetectionToggle />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

