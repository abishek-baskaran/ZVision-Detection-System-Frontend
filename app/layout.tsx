import type React from "react"
import type { Metadata } from "next/types"
import { Inter } from "next/font/google"

import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Camera Analytics Dashboard",
  description: "A modern application for camera management, detection configuration, and analytics visualization",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <div className="min-h-screen bg-gradient-to-br from-background/80 to-background relative overflow-hidden">
            {/* Textured background with glassmorphism effect */}
            <div className="absolute inset-0 w-full h-full bg-grid-pattern opacity-[0.03] dark:opacity-[0.07]" />
            <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
            <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/20 blur-3xl" />

            {/* Main content */}
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <main className="container mx-auto px-4 py-8 flex-grow">{children}</main>
              <footer className="mt-auto py-6 text-center text-sm text-muted-foreground">
                <div className="container mx-auto">
                  <p>© {new Date().getFullYear()} Camera Analytics Dashboard. All rights reserved.</p>
                </div>
              </footer>
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'