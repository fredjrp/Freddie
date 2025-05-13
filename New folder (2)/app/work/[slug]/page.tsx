"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowLeft, ArrowRight } from "lucide-react"

export default function ProjectPage() {
  const { slug } = useParams()
  const [project, setProject] = useState<any>(null)

  useEffect(() => {
    // In a real app, this would fetch from Firestore
    // For now, we'll use mock data
    const mockProject = {
      id: slug,
      title: `Project ${slug?.toString().split("-")[1]}`,
      description: "An innovative project seeking investment to scale operations and expand market reach.",
      founder: "Tech Startup",
      year: "2023",
      category: "Technology",
      fundingGoal: "$250,000",
      equity: "10-15%",
      images: [
        "/placeholder.svg?height=800&width=1200",
        "/placeholder.svg?height=800&width=1200",
        "/placeholder.svg?height=800&width=1200",
      ],
      challenge:
        "The founders have developed a promising product with initial market traction, but need capital to scale operations, expand their team, and accelerate growth.",
      solution:
        "Their innovative approach combines cutting-edge technology with a user-friendly interface, addressing a significant gap in the market. The team has a clear roadmap for scaling and monetization.",
      traction:
        "The project has already secured initial customers and demonstrated product-market fit. Monthly recurring revenue has grown 20% month-over-month for the past six months.",
    }

    setProject(mockProject)
  }, [slug])

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <div className="container">
            <p>Loading project...</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mb-16"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
            <p className="text-xl text-muted-foreground mb-8">{project.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-sm text-muted-foreground mb-1">Founder</h3>
                <p>{project.founder}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground mb-1">Year</h3>
                <p>{project.year}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground mb-1">Funding Goal</h3>
                <p>{project.fundingGoal}</p>
              </div>
              <div>
                <h3 className="text-sm text-muted-foreground mb-1">Equity Offered</h3>
                <p>{project.equity}</p>
              </div>
            </div>
          </motion.div>

          <div className="space-y-16 mb-16">
            {project.images.map((image: string, index: number) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true, margin: "-100px" }}
              >
                <div className="relative aspect-[16/9] overflow-hidden rounded-lg">
                  <Image
                    src={image || "/placeholder.svg"}
                    alt={`${project.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
              <div>
                <h3 className="text-xl font-medium mb-4">Challenge</h3>
                <p className="text-muted-foreground">{project.challenge}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-4">Solution</h3>
                <p className="text-muted-foreground">{project.solution}</p>
              </div>
              <div>
                <h3 className="text-xl font-medium mb-4">Traction</h3>
                <p className="text-muted-foreground">{project.traction}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-8 border-t">
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/work">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Projects
                </Link>
              </Button>

              <Button variant="outline" asChild className="rounded-full">
                <Link href={`/work/${slug}/invest`}>
                  Invest Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
