"use client"

import { motion } from "framer-motion"
import { ArrowRight, BarChart2, Camera, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  const features = [
    {
      icon: Camera,
      title: "Camera Management",
      description:
        "Configure and manage your camera network with ease. Set up regions of interest and detection parameters.",
      link: "/cameras",
    },
    {
      icon: BarChart2,
      title: "Analytics Dashboard",
      description: "Visualize traffic patterns and gain insights with comprehensive analytics and reporting tools.",
      link: "/dashboard",
    },
    {
      icon: FileText,
      title: "Events & Logs",
      description: "Track system events and detection logs with powerful filtering and search capabilities.",
      link: "/events",
    },
    {
      icon: Eye,
      title: "Live Monitoring",
      description: "View real-time camera feeds with instant detection notifications and status updates.",
      link: "/live",
    },
  ]

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center max-w-3xl"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
          Camera Analytics Dashboard
        </h1>
        <p className="text-xl text-muted-foreground mb-8">
          A modern application for camera management, detection configuration, and analytics visualization.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="rounded-full">
            <Link href="/dashboard">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="rounded-full">
            <Link href="/cameras">Configure Cameras</Link>
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {features.map((feature, index) => (
          <motion.div
            key={feature.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 * index }}
          >
            <Link href={feature.link}>
              <div className="glass-card h-full p-6 flex flex-col hover-lift">
                <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h2 className="text-xl font-semibold mb-2">{feature.title}</h2>
                <p className="text-sm text-muted-foreground flex-grow">{feature.description}</p>
                <div className="mt-4 flex items-center text-primary text-sm font-medium">
                  Explore
                  <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

