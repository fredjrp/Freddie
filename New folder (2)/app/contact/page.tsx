"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { COLLECTIONS, createDocument } from "@/lib/firebase-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Loader2, MessageSquare, Phone, Mail } from "lucide-react"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    projectTitle: "",
    projectCategory: "",
    fundingNeeded: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const { toast } = useToast()
  const whatsappNumber = "+254702728935"

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (value: string) => {
    setFormData((prev) => ({ ...prev, projectCategory: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Add to Firestore
      await createDocument(COLLECTIONS.CONTACTS, formData)

      setIsSuccess(true)
      toast({
        title: "Project submitted!",
        description: "I'll review your submission and get back to you soon.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        projectTitle: "",
        projectCategory: "",
        fundingNeeded: "",
        message: "",
      })

      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSuccess(false)
      }, 5000)
    } catch (error) {
      console.error("Error submitting form:", error)
      toast({
        title: "Error",
        description: "Failed to submit project. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Get in Touch</h1>
              <p className="text-xl text-muted-foreground mb-12">
                Have a project you'd like to get funded? Fill out the form below with details about your venture, and
                I'll get back to you to discuss potential investment opportunities.
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-secondary p-6 rounded-lg"
              >
                <MessageSquare className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-lg font-medium mb-2">WhatsApp</h3>
                <a
                  href={`https://wa.me/${whatsappNumber}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline"
                >
                  {whatsappNumber}
                </a>
                <p className="text-sm text-muted-foreground mt-2">Quick responses Monday-Friday, 9am-5pm EAT</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-secondary p-6 rounded-lg"
              >
                <Phone className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-lg font-medium mb-2">Phone</h3>
                <a href="tel:+254702728935" className="text-accent hover:underline">
                  +254 702 728 935
                </a>
                <p className="text-sm text-muted-foreground mt-2">Available for scheduled calls</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-secondary p-6 rounded-lg"
              >
                <Mail className="h-8 w-8 text-accent mb-4" />
                <h3 className="text-lg font-medium mb-2">Email</h3>
                <a href="mailto:funditnow@gmail.com" className="text-accent hover:underline">
                  funditnow@gmail.com
                </a>
                <p className="text-sm text-muted-foreground mt-2">Response within 24-48 hours</p>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {isSuccess ? (
                <div className="bg-secondary p-8 rounded-lg text-center">
                  <h3 className="text-2xl font-bold mb-4">Your Message Has Been Sent!</h3>
                  <p className="text-muted-foreground mb-6">
                    Thank you for reaching out. I'll review your submission and get back to you soon to discuss next
                    steps.
                  </p>
                  <Button
                    onClick={() => setIsSuccess(false)}
                    className="bg-accent hover:bg-accent/90 text-white rounded-full"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="space-y-4">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Your full name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-md"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Your email address"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-md"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="projectTitle">Project Title</Label>
                    <Input
                      id="projectTitle"
                      name="projectTitle"
                      placeholder="Name of your project or venture"
                      value={formData.projectTitle}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-md"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="projectCategory">Project Category</Label>
                    <Select value={formData.projectCategory} onValueChange={handleSelectChange}>
                      <SelectTrigger id="projectCategory" className="h-12 rounded-md">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="sustainability">Sustainability</SelectItem>
                        <SelectItem value="creative">Creative Industries</SelectItem>
                        <SelectItem value="health">Health & Wellness</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="consumer">Consumer Products</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="fundingNeeded">Funding Needed</Label>
                    <Input
                      id="fundingNeeded"
                      name="fundingNeeded"
                      placeholder="Approximate amount (e.g., $50,000)"
                      value={formData.fundingNeeded}
                      onChange={handleChange}
                      required
                      className="h-12 rounded-md"
                    />
                  </div>

                  <div className="space-y-4">
                    <Label htmlFor="message">Project Description</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Tell me about your project, its current stage, and how you plan to use the funding..."
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="rounded-md resize-none"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="bg-accent hover:bg-accent/90 text-white rounded-full h-12 px-8"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Project"
                    )}
                  </Button>
                </form>
              )}
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
