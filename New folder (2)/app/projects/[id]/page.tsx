"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { COLLECTIONS, createDocument, db } from "@/lib/firebase-config"
import { doc, getDoc } from "firebase/firestore"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowLeft, Calendar, DollarSign, User, MessageSquare, Send, Loader2, Mail } from "lucide-react"

type ProjectType = {
  id: string
  title: string
  category: string
  description: string
  about: string
  fundingGoal: number
  timeline: string
  images: string[]
  video?: string
  userId: string
  userName: string
  userEmail: string
  status: string
  createdAt: any
  equityOffered?: string | number
}

export default function ProjectDetailPage() {
  const { id } = useParams()
  const [project, setProject] = useState<ProjectType | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectSnap = await getDoc(doc(db, COLLECTIONS.PROJECTS, id as string))

        if (projectSnap.exists()) {
          setProject({ id: projectSnap.id, ...projectSnap.data() } as ProjectType)
        } else {
          toast({
            title: "Project not found",
            description: "The project you're looking for doesn't exist or has been removed.",
            variant: "destructive",
          })
        }

        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching project:", error)
        toast({
          title: "Error",
          description: "Failed to load project details. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchProject()
  }, [id, toast])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "N/A"

    const date = timestamp.toDate()
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date)
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to contact the project creator.",
        variant: "destructive",
      })
      router.push(`/login?redirect=/projects/${id}`)
      return
    }

    if (!message.trim()) return

    setIsSending(true)

    try {
      // Add message to Firestore
      await createDocument(COLLECTIONS.MESSAGES, {
        projectId: id,
        projectTitle: project?.title,
        senderId: user.uid,
        senderName: user.displayName || user.email,
        recipientId: project?.userId,
        recipientName: project?.userName,
        message,
        read: false,
      })

      toast({
        title: "Message sent!",
        description: "Your message has been sent to the project creator.",
      })

      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <div className="container">
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin text-accent" />
              <p className="ml-2">Loading project details...</p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <div className="container">
            <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
            <p className="mb-8">The project you're looking for doesn't exist or has been removed.</p>
            <Button asChild variant="outline" className="rounded-full">
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-20">
        <div className="container">
          <div className="mb-8">
            <Button asChild variant="outline" className="rounded-full mb-8">
              <Link href="/projects">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Projects
              </Link>
            </Button>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-sm uppercase tracking-wider text-accent font-medium">
                  {project.category.charAt(0).toUpperCase() + project.category.slice(1)}
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{project.title}</h1>
              <p className="text-xl text-muted-foreground mb-8">{project.description}</p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Funding Goal</h3>
                  <p className="font-medium text-lg flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    {formatCurrency(project.fundingGoal)}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Timeline</h3>
                  <p className="font-medium text-lg flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-accent" />
                    {project.timeline}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Created By</h3>
                  <p className="font-medium text-lg flex items-center gap-2">
                    <User className="h-5 w-5 text-accent" />
                    {project.userName}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm text-muted-foreground mb-1">Posted On</h3>
                  <p className="font-medium text-lg">{formatDate(project.createdAt)}</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Project Images and Video */}
          <div className="mb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="relative aspect-[16/9] rounded-lg overflow-hidden"
                >
                  {project.images && project.images.length > 0 && (
                    <Image
                      src={project.images[0] || "/placeholder.svg?height=900&width=1600"}
                      alt={project.title}
                      fill
                      className="object-cover"
                    />
                  )}
                </motion.div>
              </div>

              {project.images &&
                project.images.slice(1).map((image, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    className="relative aspect-square rounded-lg overflow-hidden"
                  >
                    <Image
                      src={image || "/placeholder.svg?height=600&width=600"}
                      alt={`${project.title} - Image ${index + 2}`}
                      fill
                      className="object-cover"
                    />
                  </motion.div>
                ))}
            </div>

            {/* Video section */}
            {project.video && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="mt-6"
              >
                <h2 className="text-xl font-bold mb-4">Project Video</h2>
                <div className="relative aspect-video rounded-lg overflow-hidden">
                  <video
                    src={project.video}
                    controls
                    className="w-full h-full object-contain bg-black"
                    poster={project.images[0]}
                  />
                </div>
              </motion.div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-2xl font-bold mb-6">About the Project</h2>
                <div className="prose max-w-none">
                  {project.about.split("\n\n").map((paragraph, index) => (
                    <p key={index} className="mb-4 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </motion.div>
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-secondary p-6 rounded-lg sticky top-32"
              >
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                  <MessageSquare className="h-5 w-5 text-accent" />
                  Contact Creator
                </h2>

                <form onSubmit={handleSendMessage} className="space-y-4">
                  <Textarea
                    placeholder="Ask a question or express interest in this project..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="resize-none"
                    required
                  />
                  <Button
                    type="submit"
                    className="w-full bg-accent hover:bg-accent/90 text-white rounded-full"
                    disabled={isSending || !message.trim()}
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>

                  <p className="text-sm text-muted-foreground text-center">
                    {user ? (
                      "Your contact information will be shared with the creator when you send a message."
                    ) : (
                      <>
                        <Link href={`/login?redirect=/projects/${id}`} className="text-accent hover:underline">
                          Log in
                        </Link>{" "}
                        to contact the creator.
                      </>
                    )}
                  </p>
                </form>

                <div className="mt-8 pt-6 border-t">
                  <h3 className="font-medium mb-4">Interested in investing?</h3>
                  <Button asChild className="w-full bg-black text-white hover:bg-black/80 rounded-full">
                    <Link href={`/projects/${id}/invest`}>
                      <DollarSign className="mr-2 h-4 w-4" />
                      Invest Now
                    </Link>
                  </Button>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-medium mb-2">Get in touch directly</h3>
                  <a
                    href="https://wa.me/+254702728935"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-accent hover:underline mb-2"
                  >
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp: +254 702 728 935
                  </a>
                  <a href="mailto:funditnow@gmail.com" className="flex items-center gap-2 text-accent hover:underline">
                    <Mail className="h-4 w-4" />
                    funditnow@gmail.com
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
