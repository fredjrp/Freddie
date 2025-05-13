"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-8">About Me</h1>
              <div className="space-y-6 text-lg">
                <p>
                  I'm Freddie, an investor with over 8 years of experience funding and mentoring innovative projects
                  across various industries.
                </p>
                <p>
                  My approach to investing is centered around finding passionate entrepreneurs with great ideas that
                  have the potential to make a significant impact. I believe that successful investments are built on
                  strong relationships and a shared vision for growth.
                </p>
                <p>
                  Throughout my career, I've had the opportunity to work with startups, creative professionals, and
                  established businesses looking to innovate. This diverse experience has given me a unique perspective
                  on what makes ventures successful.
                </p>
                <p>
                  When I'm not reviewing investment opportunities, you can find me attending industry events, mentoring
                  young entrepreneurs, or exploring emerging trends in technology and sustainability.
                </p>
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Investment Focus</h2>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    "Technology Startups",
                    "Sustainable Solutions",
                    "Creative Industries",
                    "Digital Platforms",
                    "Social Enterprises",
                    "Consumer Products",
                    "Health & Wellness",
                    "Education Technology",
                  ].map((skill, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-accent rounded-full"></div>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12">
                <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full">
                  <Link href="/contact">Get in touch</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:sticky lg:top-32"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-lg">
                <Image
                  src="/placeholder.svg?height=800&width=600"
                  alt="Investor portrait"
                  fill
                  className="object-cover"
                />
              </div>
            </motion.div>
          </div>

          <div className="mt-24">
            <h2 className="text-3xl font-bold mb-12">Experience</h2>
            <div className="space-y-12">
              {[
                {
                  role: "Lead Investor",
                  company: "Innovation Capital",
                  period: "2020 - Present",
                  description:
                    "Managing a portfolio of technology and sustainability investments. Providing strategic guidance and connecting founders with resources to accelerate growth.",
                },
                {
                  role: "Investment Partner",
                  company: "Creative Ventures",
                  period: "2018 - 2020",
                  description:
                    "Focused on investing in creative industries and digital platforms. Helped scale multiple startups from early stage to successful market positions.",
                },
                {
                  role: "Angel Investor",
                  company: "Independent",
                  period: "2015 - 2018",
                  description:
                    "Early-stage investments in promising startups across various sectors. Hands-on mentoring and strategic support for founders.",
                },
              ].map((experience, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="grid grid-cols-1 md:grid-cols-4 gap-6 border-t pt-6"
                >
                  <div>
                    <p className="text-muted-foreground">{experience.period}</p>
                  </div>
                  <div className="md:col-span-3">
                    <h3 className="text-xl font-medium mb-2">{experience.role}</h3>
                    <p className="text-accent mb-4">{experience.company}</p>
                    <p className="text-muted-foreground">{experience.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
