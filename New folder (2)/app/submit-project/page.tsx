"use client"

import type React from "react"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuth } from "@/contexts/auth-context"
import { COLLECTIONS, createDocument, uploadFile } from "@/lib/firebase-config"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Loader2, X, Plus, Upload, Play } from "lucide-react"

export default function SubmitProjectPage() {
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    description: "",
    fundingGoal: "",
    timeline: "",
    about: "",
    equityOffered: "",
  })
  const [images, setImages] = useState<File[]>([])
  const [imageUrls, setImageUrls] = useState<string[]>([])
  const [video, setVideo] = useState<File | null>(null)
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const videoInputRef = useRef<HTMLInputElement>(null)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files).slice(0, 5 - images.length) // Limit to 5 images total

      if (selectedFiles.length) {
        setImages((prev) => [...prev, ...selectedFiles])

        // Create preview URLs
        selectedFiles.forEach((file) => {
          const url = URL.createObjectURL(file)
          setImageUrls((prev) => [...prev, url])
        })
      }
    }
  }

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setVideo(file)

      // Create preview URL for video
      const url = URL.createObjectURL(file)
      setVideoPreviewUrl(url)
    }
  }

  const removeImage = (index: number) => {
    // Revoke object URL to avoid memory leaks
    URL.revokeObjectURL(imageUrls[index])

    setImages((prev) => prev.filter((_, i) => i !== index))
    setImageUrls((prev) => prev.filter((_, i) => i !== index))
  }

  const removeVideo = () => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl)
    }

    setVideo(null)
    setVideoPreviewUrl(null)

    if (videoInputRef.current) {
      videoInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit a project.",
        variant: "destructive",
      })
      router.push("/login?redirect=/submit-project")
      return
    }

    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image for your project.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Upload images to Firebase Storage
      const uploadedImageUrls = []

      for (const [index, image] of images.entries()) {
        const path = `projects/${user.uid}/${Date.now()}-image-${index}-${image.name}`
        const imageUrl = await uploadFile(path, image)
        uploadedImageUrls.push(imageUrl)
      }

      // Upload video if it exists
      let videoUrl = null
      if (video) {
        const path = `projects/${user.uid}/${Date.now()}-video-${video.name}`
        videoUrl = await uploadFile(path, video)
      }

      // Add project to Firestore
      const projectData = {
        ...formData,
        fundingGoal: Number.parseFloat(formData.fundingGoal),
        equityOffered: formData.equityOffered ? Number.parseFloat(formData.equityOffered) : null,
        images: uploadedImageUrls,
        video: videoUrl,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userEmail: user.email,
        status: "pending", // pending, approved, rejected
      }

      const docRef = await createDocument(COLLECTIONS.PROJECTS, projectData)

      toast({
        title: "Project submitted!",
        description: "Your project has been submitted for review.",
      })

      router.push(`/my-projects`)
    } catch (error) {
      console.error("Error submitting project:", error)
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Submit Your Project</h1>
              <p className="text-xl text-muted-foreground mb-12">
                Share the details of your project to connect with potential investors and bring your vision to life.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-4">
                  <Label htmlFor="title">Project Title</Label>
                  <Input
                    id="title"
                    name="title"
                    placeholder="Enter a clear, descriptive title for your project"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-md"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange("category", value)}
                    required
                  >
                    <SelectTrigger id="category" className="h-12 rounded-md">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Technology</SelectItem>
                      <SelectItem value="creative">Creative & Design</SelectItem>
                      <SelectItem value="sustainability">Sustainability</SelectItem>
                      <SelectItem value="community">Community</SelectItem>
                      <SelectItem value="health">Health & Wellness</SelectItem>
                      <SelectItem value="fashion">Fashion</SelectItem>
                      <SelectItem value="food">Food & Beverage</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-4">
                  <Label htmlFor="description">Short Description</Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a concise summary of your project (100-150 words)"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="rounded-md resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="fundingGoal">Funding Goal ($)</Label>
                  <Input
                    id="fundingGoal"
                    name="fundingGoal"
                    type="number"
                    placeholder="Enter amount in USD"
                    value={formData.fundingGoal}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-md"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="equityOffered">Equity Offered (%)</Label>
                  <Input
                    id="equityOffered"
                    name="equityOffered"
                    type="number"
                    placeholder="What percentage of equity are you offering? (e.g. 10)"
                    value={formData.equityOffered}
                    onChange={handleChange}
                    className="h-12 rounded-md"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="timeline">Project Timeline</Label>
                  <Input
                    id="timeline"
                    name="timeline"
                    placeholder="e.g., 6 months, 1 year"
                    value={formData.timeline}
                    onChange={handleChange}
                    required
                    className="h-12 rounded-md"
                  />
                </div>

                <div className="space-y-4">
                  <Label htmlFor="about">About the Project</Label>
                  <Textarea
                    id="about"
                    name="about"
                    placeholder="Provide detailed information about your project, including goals, target audience, market opportunity, and how the funding will be used."
                    rows={8}
                    value={formData.about}
                    onChange={handleChange}
                    required
                    className="rounded-md resize-none"
                  />
                </div>

                <div className="space-y-4">
                  <Label className="block mb-1">Project Images (Required)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imageUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-secondary">
                        <img
                          src={url || "/placeholder.svg"}
                          alt={`Project image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    {images.length < 5 && (
                      <label className="aspect-square rounded-md border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary transition-colors">
                        <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Add Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageChange}
                          className="hidden"
                          multiple={images.length < 4}
                        />
                      </label>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Upload images that showcase your project. Required. Maximum 5 images.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label className="block mb-1">Project Video (Optional)</Label>
                  {videoPreviewUrl ? (
                    <div className="relative aspect-video rounded-md overflow-hidden bg-secondary">
                      <video src={videoPreviewUrl} className="w-full h-full object-contain" controls />
                      <button
                        type="button"
                        onClick={removeVideo}
                        className="absolute top-2 right-2 bg-black/70 text-white rounded-full p-1"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="aspect-video rounded-md border-2 border-dashed border-muted-foreground/25 flex flex-col items-center justify-center cursor-pointer hover:bg-secondary transition-colors">
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <Play className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">Upload Project Video</span>
                      <span className="text-xs text-muted-foreground mt-1">MP4, WebM or MOV format, max 100MB</span>
                      <input
                        ref={videoInputRef}
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime"
                        onChange={handleVideoChange}
                        className="hidden"
                      />
                    </label>
                  )}
                  <p className="text-sm text-muted-foreground">
                    Add a video demonstration or pitch for your project. Optional.
                  </p>
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
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
