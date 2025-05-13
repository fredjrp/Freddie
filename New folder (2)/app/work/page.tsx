"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function WorkPage() {
  const [filter, setFilter] = useState("all")

  const projects = [
    {
      id: 1,
      title: "Eco-Friendly Packaging Solution",
      category: "sustainability",
      image: "/placeholder.svg?height=600&width=800",
      year: 2023,
    },
    {
      id: 2,
      title: "Mobile App for Local Artists",
      category: "tech",
      image: "/placeholder.svg?height=600&width=800",
      year: 2023,
    },
    {
      id: 3,
      title: "Sustainable Fashion Brand",
      category: "fashion",
      image: "/placeholder.svg?height=600&width=800",
      year: 2022,
    },
    {
      id: 4,
      title: "AR Educational Platform",
      category: "tech",
      image: "/placeholder.svg?height=600&width=800",
      year: 2022,
    },
    {
      id: 5,
      title: "Community Garden Initiative",
      category: "community",
      image: "/placeholder.svg?height=600&width=800",
      year: 2021,
    },
    {
      id: 6,
      title: "Graphic Design Studio",
      category: "creative",
      image: "/placeholder.svg?height=600&width=800",
      year: 2021,
    },
  ]

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.category === filter)

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20">
        <div className="container">
          <div className="max-w-3xl mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Projects</h1>
            <p className="text-xl text-muted-foreground">
              Discover innovative projects seeking investment. Find opportunities that align with your interests and
              make a difference.
            </p>
          </div>

          <div className="mb-12 flex gap-4 flex-wrap">
            {["all", "tech", "sustainability", "fashion", "community", "creative"].map((category) => (
              <Button
                key={category}
                variant={filter === category ? "default" : "outline"}
                onClick={() => setFilter(category)}
                className="rounded-full"
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group"
              >
                <Link href={`/work/project-${project.id}`}>
                  <div className="relative aspect-[4/3] overflow-hidden mb-4">
                    <Image
                      src={project.image || "/placeholder.svg"}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium mb-1">{project.title}</h3>
                      <p className="text-muted-foreground capitalize">{project.category}</p>
                    </div>
                    <span className="text-muted-foreground">{project.year}</span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
