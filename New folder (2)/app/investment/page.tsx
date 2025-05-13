"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Search, TrendingUp, DollarSign, Users, Clock } from "lucide-react"

type InvestmentType = {
  id: string
  title: string
  description: string
  image: string
  category: string
  fundingGoal: number
  fundingRaised: number
  deadline: string
  creator: {
    id: string
    name: string
    image: string
  }
}

export default function InvestmentPage() {
  const [investments, setInvestments] = useState<InvestmentType[]>([])
  const [filteredInvestments, setFilteredInvestments] = useState<InvestmentType[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const { user } = useAuth()

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        // In a real app, this would fetch from Firestore
        // For now, we'll use mock data
        const mockInvestments: InvestmentType[] = [
          {
            id: "1",
            title: "Eco-Friendly Packaging Design",
            description: "Innovative packaging design that reduces plastic waste and uses sustainable materials.",
            image: "/placeholder.svg?height=400&width=600",
            category: "design",
            fundingGoal: 15000,
            fundingRaised: 8750,
            deadline: "2025-07-15",
            creator: {
              id: "user1",
              name: "Alex Johnson",
              image: "/placeholder.svg?height=100&width=100",
            },
          },
          {
            id: "2",
            title: "Mobile App for Local Artists",
            description: "A platform connecting local artists with potential clients and exhibition opportunities.",
            image: "/placeholder.svg?height=400&width=600",
            category: "tech",
            fundingGoal: 25000,
            fundingRaised: 18000,
            deadline: "2025-08-20",
            creator: {
              id: "user2",
              name: "Maya Rodriguez",
              image: "/placeholder.svg?height=100&width=100",
            },
          },
          {
            id: "3",
            title: "Branding for Sustainable Fashion",
            description: "Complete brand identity for a sustainable fashion startup focused on ethical production.",
            image: "/placeholder.svg?height=400&width=600",
            category: "design",
            fundingGoal: 10000,
            fundingRaised: 7500,
            deadline: "2025-06-30",
            creator: {
              id: "user3",
              name: "Jordan Smith",
              image: "/placeholder.svg?height=100&width=100",
            },
          },
          {
            id: "4",
            title: "AR Experience for Education",
            description: "Augmented reality application designed to enhance learning experiences in classrooms.",
            image: "/placeholder.svg?height=400&width=600",
            category: "tech",
            fundingGoal: 35000,
            fundingRaised: 12000,
            deadline: "2025-09-15",
            creator: {
              id: "user4",
              name: "Taylor Wong",
              image: "/placeholder.svg?height=100&width=100",
            },
          },
          {
            id: "5",
            title: "Illustrated Children's Book Series",
            description: "A series of illustrated children's books promoting diversity and environmental awareness.",
            image: "/placeholder.svg?height=400&width=600",
            category: "creative",
            fundingGoal: 8000,
            fundingRaised: 5200,
            deadline: "2025-07-01",
            creator: {
              id: "user5",
              name: "Sam Parker",
              image: "/placeholder.svg?height=100&width=100",
            },
          },
          {
            id: "6",
            title: "Podcast Studio for Creatives",
            description: "A community podcast studio providing equipment and space for creative professionals.",
            image: "/placeholder.svg?height=400&width=600",
            category: "creative",
            fundingGoal: 20000,
            fundingRaised: 9800,
            deadline: "2025-08-10",
            creator: {
              id: "user6",
              name: "Jamie Lee",
              image: "/placeholder.svg?height=100&width=100",
            },
          },
        ]

        setInvestments(mockInvestments)
        setFilteredInvestments(mockInvestments)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching investments:", error)
        setIsLoading(false)
      }
    }

    fetchInvestments()
  }, [])

  useEffect(() => {
    // Filter investments based on search query and active tab
    let filtered = [...investments]

    if (searchQuery) {
      filtered = filtered.filter(
        (investment) =>
          investment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          investment.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (activeTab !== "all") {
      filtered = filtered.filter((investment) => investment.category === activeTab)
    }

    setFilteredInvestments(filtered)
  }, [searchQuery, activeTab, investments])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // The filtering is handled in the useEffect
  }

  const calculateProgress = (raised: number, goal: number) => {
    return Math.min((raised / goal) * 100, 100)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const calculateTimeLeft = (deadline: string) => {
    const now = new Date()
    const deadlineDate = new Date(deadline)
    const diffTime = deadlineDate.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    return diffDays > 0 ? `${diffDays} days left` : "Ended"
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <>
      <Navbar />
      <main>
        {/* Hero Section */}
        <section className="bg-navy-50 dark:bg-navy-900 py-20 md:py-28">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Investment Opportunities</h1>
              <p className="text-lg md:text-xl mb-8 text-muted-foreground">
                Discover creative projects to invest in or share your own work to find potential investors.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <Link href="/investment/create">Share Your Project</Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <a href="#opportunities">Browse Opportunities</a>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Search and Filter Section */}
        <section className="py-12" id="opportunities">
          <div className="container">
            <div className="flex flex-col md:flex-row gap-6 items-center justify-between mb-8">
              <form onSubmit={handleSearch} className="w-full md:w-auto">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search projects..."
                    className="pl-10 w-full md:w-[300px]"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
              </form>

              <Tabs defaultValue="all" className="w-full md:w-auto" onValueChange={setActiveTab}>
                <TabsList>
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="design">Design</TabsTrigger>
                  <TabsTrigger value="tech">Tech</TabsTrigger>
                  <TabsTrigger value="creative">Creative</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <p>Loading investment opportunities...</p>
              </div>
            ) : filteredInvestments.length === 0 ? (
              <div className="text-center py-12">
                <p>No investment opportunities found. Try adjusting your search.</p>
              </div>
            ) : (
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {filteredInvestments.map((investment) => (
                  <motion.div key={investment.id} variants={item}>
                    <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={investment.image || "/placeholder.svg"}
                          alt={investment.title}
                          fill
                          className="object-cover transition-transform hover:scale-105 duration-300"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge className="bg-navy-600 hover:bg-navy-700">{investment.category}</Badge>
                        </div>
                      </div>
                      <CardHeader>
                        <CardTitle>{investment.title}</CardTitle>
                        <CardDescription>{investment.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span>{formatCurrency(investment.fundingRaised)} raised</span>
                            <span>{formatCurrency(investment.fundingGoal)} goal</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-navy-700 rounded-full h-2">
                            <div
                              className="bg-gold-500 h-2 rounded-full"
                              style={{
                                width: `${calculateProgress(investment.fundingRaised, investment.fundingGoal)}%`,
                              }}
                            ></div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="relative w-8 h-8 rounded-full overflow-hidden">
                              <Image
                                src={investment.creator.image || "/placeholder.svg"}
                                alt={investment.creator.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <span className="text-sm">{investment.creator.name}</span>
                          </div>
                          <div className="flex items-center gap-1 text-sm">
                            <Clock className="h-4 w-4" />
                            <span>{calculateTimeLeft(investment.deadline)}</span>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button asChild className="w-full">
                          <Link href={`/investment/${investment.id}`}>View Details</Link>
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-navy-50 dark:bg-navy-800">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our platform connects creative professionals with potential investors in a simple and transparent
                process.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Card className="border-none bg-white dark:bg-navy-700 shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-navy-100 dark:bg-navy-600 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-navy-600 dark:text-gold-400" />
                  </div>
                  <CardTitle>1. Create & Connect</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Create a profile and share your project or browse existing opportunities to connect with like-minded
                    professionals.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-white dark:bg-navy-700 shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-navy-100 dark:bg-navy-600 flex items-center justify-center mb-4">
                    <DollarSign className="h-6 w-6 text-navy-600 dark:text-gold-400" />
                  </div>
                  <CardTitle>2. Fund & Support</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Invest in projects you believe in or receive funding from investors who see potential in your work.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-white dark:bg-navy-700 shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-navy-100 dark:bg-navy-600 flex items-center justify-center mb-4">
                    <TrendingUp className="h-6 w-6 text-navy-600 dark:text-gold-400" />
                  </div>
                  <CardTitle>3. Grow & Succeed</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Collaborate to bring projects to life and share in the success as your investment or project grows.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-navy-600 text-white">
          <div className="container text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Investment Journey?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Whether you're looking to invest or seeking funding for your project, our platform provides the tools you
              need to succeed.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gold-500 hover:bg-gold-600 text-navy-900">
                <Link href="/signup">Create Account</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link href="/investment/create">Share Your Project</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
