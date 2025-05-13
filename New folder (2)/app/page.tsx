"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100])

  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section ref={containerRef} className="min-h-screen flex flex-col justify-center pt-20">
          <div className="container">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl"
            >
              <h1 className="text-7xl md:text-9xl font-bold mb-8">Hi,</h1>
              <p className="text-xl md:text-2xl mb-8 max-w-2xl text-muted-foreground">
                I'm Freddie, an investor passionate about supporting innovative projects and creative entrepreneurs. I
                help turn great ideas into successful ventures.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-white rounded-full">
                  <Link href="/contact">Submit Your Project</Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="rounded-full">
                  <Link href="/work">Browse Projects</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Featured Projects Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Featured Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[1, 2, 3, 4].map((item) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="group"
                >
                  <Link href={`/work/project-${item}`}>
                    <div className="relative aspect-[4/3] overflow-hidden mb-4">
                      <Image
                        src={`/placeholder.svg?height=600&width=800`}
                        alt={`Project ${item}`}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <h3 className="text-xl font-medium mb-2">Innovative Project {item}</h3>
                    <p className="text-muted-foreground">Technology / Sustainability</p>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-12 text-center">
              <Button variant="outline" asChild className="rounded-full">
                <Link href="/work">View All Projects</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Investment Areas Section */}
        <section className="py-20 md:py-32 bg-secondary">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Investment Areas</h2>
              <p className="text-muted-foreground text-lg">
                I focus on investing in these key areas where innovation and creativity can make a significant impact.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "Technology",
                  description:
                    "Innovative tech solutions that solve real problems and have potential for significant growth and impact.",
                },
                {
                  title: "Sustainability",
                  description:
                    "Eco-friendly initiatives and businesses focused on creating a more sustainable future through innovative approaches.",
                },
                {
                  title: "Creative Industries",
                  description:
                    "Design, media, and creative projects that bring fresh perspectives and cultural value to the market.",
                },
              ].map((service, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="bg-background p-8 rounded-lg"
                >
                  <h3 className="text-xl font-medium mb-4">{service.title}</h3>
                  <p className="text-muted-foreground">{service.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-20 md:py-32">
          <div className="container">
            <h2 className="text-3xl md:text-4xl font-bold mb-12">Success Stories</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {[
                {
                  quote:
                    "Freddie's investment and mentorship were crucial to our success. His guidance helped us navigate challenges and scale our business effectively.",
                  author: "Sarah Johnson",
                  role: "Founder, EcoPackage",
                },
                {
                  quote:
                    "Beyond the financial support, Freddie provided valuable connections and strategic advice that transformed our startup into a thriving business.",
                  author: "Michael Chen",
                  role: "CEO, TechInnovate",
                },
              ].map((testimonial, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="border-t pt-6"
                >
                  <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                  <div>
                    <p className="font-medium">{testimonial.author}</p>
                    <p className="text-muted-foreground">{testimonial.role}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-black text-white">
          <div className="container">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to bring your idea to life?</h2>
              <p className="text-gray-300 mb-8 text-lg">
                Submit your project today and let's explore how we can work together to make it a success.
              </p>
              <Button size="lg" asChild className="bg-accent hover:bg-accent/90 text-white rounded-full">
                <Link href="/contact">Submit Your Project</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
