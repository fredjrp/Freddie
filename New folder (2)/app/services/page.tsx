"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowRight, CheckCircle, Zap, PenTool, Layout, FileImage } from "lucide-react"

export default function ServicesPage() {
  const [activeTab, setActiveTab] = useState("all")

  const services = [
    {
      id: 1,
      title: "Logo Design",
      description: "Professional logo design to establish your brand identity.",
      image: "/placeholder.svg?height=400&width=600",
      category: "branding",
      price: "From $299",
      features: ["Multiple concepts", "Unlimited revisions", "Source files included", "Quick turnaround"],
    },
    {
      id: 2,
      title: "Website Design",
      description: "Custom website design that converts visitors into customers.",
      image: "/placeholder.svg?height=400&width=600",
      category: "web",
      price: "From $799",
      features: ["Responsive design", "SEO optimization", "User experience focus", "Modern aesthetics"],
    },
    {
      id: 3,
      title: "Social Media Graphics",
      description: "Eye-catching graphics for your social media presence.",
      image: "/placeholder.svg?height=400&width=600",
      category: "social",
      price: "From $199",
      features: ["Platform-specific sizes", "Consistent branding", "Engagement-focused", "Regular updates"],
    },
    {
      id: 4,
      title: "Print Design",
      description: "High-quality print materials for your business needs.",
      image: "/placeholder.svg?height=400&width=600",
      category: "print",
      price: "From $249",
      features: ["Business cards", "Brochures", "Flyers", "Print-ready files"],
    },
    {
      id: 5,
      title: "UI/UX Design",
      description: "User-centered interface and experience design for digital products.",
      image: "/placeholder.svg?height=400&width=600",
      category: "web",
      price: "From $999",
      features: ["User research", "Wireframing", "Prototyping", "Usability testing"],
    },
    {
      id: 6,
      title: "Brand Identity",
      description: "Complete brand identity package for your business.",
      image: "/placeholder.svg?height=400&width=600",
      category: "branding",
      price: "From $1,499",
      features: ["Logo design", "Color palette", "Typography", "Brand guidelines"],
    },
  ]

  const filteredServices = activeTab === "all" ? services : services.filter((service) => service.category === activeTab)

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
              <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Professional Design Services</h1>
              <p className="text-lg md:text-xl mb-8 text-muted-foreground">
                Elevate your brand with our premium design services tailored to your specific needs.
              </p>
              <Button size="lg" asChild>
                <Link href="/contact">
                  Get a Quote <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-20">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-serif text-3xl font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Browse our range of professional design services to find the perfect solution for your needs.
              </p>
            </div>

            <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
              <div className="flex justify-center mb-8">
                <TabsList>
                  <TabsTrigger value="all">All Services</TabsTrigger>
                  <TabsTrigger value="branding">Branding</TabsTrigger>
                  <TabsTrigger value="web">Web & UI</TabsTrigger>
                  <TabsTrigger value="social">Social Media</TabsTrigger>
                  <TabsTrigger value="print">Print</TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value={activeTab}>
                <motion.div
                  variants={container}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {filteredServices.map((service) => (
                    <motion.div key={service.id} variants={item}>
                      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative h-48 overflow-hidden">
                          <Image
                            src={service.image || "/placeholder.svg"}
                            alt={service.title}
                            fill
                            className="object-cover transition-transform hover:scale-105 duration-300"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle>{service.title}</CardTitle>
                          <CardDescription>{service.description}</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <p className="font-medium text-lg mb-4">{service.price}</p>
                          <ul className="space-y-2">
                            {service.features.map((feature, index) => (
                              <li key={index} className="flex items-start">
                                <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0 mt-0.5" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </CardContent>
                        <CardFooter>
                          <Button asChild className="w-full">
                            <Link href={`/contact?service=${service.title}`}>Request Service</Link>
                          </Button>
                        </CardFooter>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-navy-50 dark:bg-navy-800">
          <div className="container">
            <div className="text-center mb-16">
              <h2 className="font-serif text-3xl font-bold mb-4">Our Design Process</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We follow a structured process to ensure your project is completed to the highest standard.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="border-none bg-white dark:bg-navy-700 shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-navy-100 dark:bg-navy-600 flex items-center justify-center mb-4">
                    <PenTool className="h-6 w-6 text-navy-600 dark:text-gold-400" />
                  </div>
                  <CardTitle>1. Discovery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We start by understanding your needs, goals, and target audience to create a solid foundation.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-white dark:bg-navy-700 shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-navy-100 dark:bg-navy-600 flex items-center justify-center mb-4">
                    <Layout className="h-6 w-6 text-navy-600 dark:text-gold-400" />
                  </div>
                  <CardTitle>2. Concept</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We create initial concepts based on our research and your requirements for your review.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-white dark:bg-navy-700 shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-navy-100 dark:bg-navy-600 flex items-center justify-center mb-4">
                    <FileImage className="h-6 w-6 text-navy-600 dark:text-gold-400" />
                  </div>
                  <CardTitle>3. Refinement</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We refine the chosen concept based on your feedback until it perfectly meets your vision.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-none bg-white dark:bg-navy-700 shadow-md">
                <CardHeader>
                  <div className="w-12 h-12 rounded-full bg-navy-100 dark:bg-navy-600 flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-navy-600 dark:text-gold-400" />
                  </div>
                  <CardTitle>4. Delivery</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    We deliver the final files in all required formats along with guidelines for usage.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-navy-600 text-white">
          <div className="container text-center">
            <h2 className="font-serif text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Project?</h2>
            <p className="text-white/80 max-w-2xl mx-auto mb-8">
              Contact us today to discuss your design needs and get a personalized quote.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild className="bg-gold-500 hover:bg-gold-600 text-navy-900">
                <Link href="/contact">Get a Quote</Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white text-white hover:bg-white/10">
                <Link href="/portfolio">View Portfolio</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
