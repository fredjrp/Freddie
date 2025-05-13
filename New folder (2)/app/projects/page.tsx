"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { COLLECTIONS, db, query, collection, where, getDocs, orderBy } from "@/lib/firebase-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Search, TrendingUp, Loader2 } from "lucide-react"

type Project = {
  id: string
  title: string
  category: string
  description: string
  fundingGoal: number
  images: string[]
  userName: string
  createdAt: any
}

export default function ProjectsPage() {
  const [filter, setFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsQuery = query(
          collection(db, COLLECTIONS.PROJECTS),
          where("status", "==", "approved"),
          orderBy("createdAt", "desc"),
        )

        const querySnapshot = await getDocs(projectsQuery)
        const fetchedProjects: Project[] = []

        querySnapshot.forEach((doc) => {
          fetchedProjects.push({
            id: doc.id,
            ...doc.data(),
          } as Project)
        })

        setProjects(fetchedProjects)
        setFilteredProjects(fetchedProjects)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching projects:", error)
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    // Filter projects based on search query and category filter
    let result = [...projects]

    if (filter !== "all") {
      result = result.filter((project) => project.category === filter)
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (project) => project.title.toLowerCase().includes(query) || project.description.toLowerCase().includes(query),
      )
    }

    setFilteredProjects(result)
  }, [filter, searchQuery, projects])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The filtering is handled in the useEffect
  }

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

          <div className="flex flex-col md:flex-row gap-6 justify-between mb-12">
            <div className="flex gap-4 flex-wrap">
              {["all", "tech", "creative", "sustainability", "community", "health", "fashion", "food"].map(
                (category) => (
                  <Button
                    key={category}
                    variant={filter === category ? "default" : "outline"}
                    onClick={() => setFilter(category)}
                    className="rounded-full"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </Button>
                ),
              )}
            </div>

            <form onSubmit={handleSearch} className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Search projects..."
                className="pl-10 w-full md:w-[300px] rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <Loader2 className="h-8 w-8 animate-spin text-accent mr-2" />
              <p>Loading projects...</p>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-xl text-muted-foreground">No projects found matching your criteria.</p>
              <Button
                variant="outline"
                className="mt-4 rounded-full"
                onClick={() => {
                  setFilter("all")
                  setSearchQuery("")
                }}
              >
                Clear filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/projects/${project.id}`}>
                    <div className="relative aspect-[4/3] overflow-hidden mb-4 rounded-lg">
                      <Image
                        src={
                          project.images && project.images.length > 0
                            ? project.images[0]
                            : "/placeholder.svg?height=600&width=800"
                        }
                        alt={project.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-3 right-3 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                        {formatCurrency(project.fundingGoal)}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs uppercase tracking-wider text-accent font-medium">
                          {project.category}
                        </span>
                        <TrendingUp className="h-4 w-4 text-accent" />
                      </div>
                      <h3 className="text-xl font-medium mb-2">{project.title}</h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{project.description}</p>
                      <p className="text-sm">
                        By <span className="font-medium">{project.userName}</span>
                      </p>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}

          <div className="mt-16 text-center">
            <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full">
              <Link href="/submit-project">Submit Your Project</Link>
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
