"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { collection, addDoc, doc, getDoc, serverTimestamp } from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { db, storage } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { ArrowLeft, Upload, Loader2, DollarSign } from "lucide-react"

export default function InvestPage() {
  const { slug } = useParams()
  const [project, setProject] = useState<any>(null)
  const [formData, setFormData] = useState({
    investmentAmount: "",
    currency: "KES",
    equityRequested: "",
    message: "",
  })
  const [receiptFile, setReceiptFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [showPaymentDetails, setShowPaymentDetails] = useState(false)
  const [exchangeRate, setExchangeRate] = useState(1)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    // In a real app, this would fetch from Firestore and use a real exchange rate API
    // For now, we'll use mock data and a fixed exchange rate
    const fetchProject = async () => {
      try {
        const projectRef = doc(db, "projects", slug as string)
        const projectSnap = await getDoc(projectRef)

        if (projectSnap.exists()) {
          setProject({ id: projectSnap.id, ...projectSnap.data() })
        } else {
          // If no project found, use mock data
          const mockProject = {
            id: slug,
            title: `Project ${slug?.toString().split("-")[1]}`,
            description: "An innovative project seeking investment to scale operations and expand market reach.",
            founder: "Tech Startup",
            year: "2023",
            category: "Technology",
            fundingGoal: 250000,
            equity: "10-15%",
            images: ["/placeholder.svg?height=800&width=1200"],
          }
          setProject(mockProject)
        }
      } catch (error) {
        console.error("Error fetching project:", error)
        toast({
          title: "Error",
          description: "Failed to load project details. Please try again.",
          variant: "destructive",
        })
      }
    }

    // Set a mock exchange rate (1 USD = 130 KES)
    setExchangeRate(130)

    fetchProject()
  }, [slug, toast])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setReceiptFile(e.target.files[0])
    }
  }

  const handleSubmitInterest = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to invest in this project.",
        variant: "destructive",
      })
      router.push(`/login?redirect=/work/${slug}/invest`)
      return
    }

    setIsSubmitting(true)

    try {
      // Add investment interest to Firestore
      await addDoc(collection(db, "investmentInterests"), {
        projectId: slug,
        projectTitle: project?.title,
        investorId: user.uid,
        investorName: user.displayName || user.email,
        investorEmail: user.email,
        ...formData,
        amountInKES:
          formData.currency === "USD"
            ? Number.parseFloat(formData.investmentAmount) * exchangeRate
            : Number.parseFloat(formData.investmentAmount),
        status: "pending",
        createdAt: serverTimestamp(),
      })

      setShowPaymentDetails(true)
      toast({
        title: "Interest submitted!",
        description: "Your investment interest has been submitted. Please proceed with the payment.",
      })
    } catch (error) {
      console.error("Error submitting investment interest:", error)
      toast({
        title: "Error",
        description: "Failed to submit investment interest. Please try again.",
        variant: "destructive",
      })
      setIsSubmitting(false)
    }
  }

  const handleSubmitReceipt = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!receiptFile) {
      toast({
        title: "Receipt required",
        description: "Please upload your payment receipt.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Upload receipt to Firebase Storage
      const storageRef = ref(storage, `receipts/${user?.uid}/${Date.now()}-${receiptFile.name}`)
      await uploadBytes(storageRef, receiptFile)
      const downloadUrl = await getDownloadURL(storageRef)

      // Update the investment interest with receipt URL
      await addDoc(collection(db, "paymentReceipts"), {
        projectId: slug,
        projectTitle: project?.title,
        investorId: user?.uid,
        investorName: user?.displayName || user?.email,
        investorEmail: user?.email,
        investmentAmount: formData.investmentAmount,
        currency: formData.currency,
        receiptUrl: downloadUrl,
        status: "pending",
        createdAt: serverTimestamp(),
      })

      setIsSuccess(true)
      toast({
        title: "Payment submitted!",
        description: "Your payment receipt has been submitted. We'll review it and get back to you soon.",
      })
    } catch (error) {
      console.error("Error submitting receipt:", error)
      toast({
        title: "Error",
        description: "Failed to submit payment receipt. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    if (currency === "USD") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount)
    } else {
      return new Intl.NumberFormat("en-KE", {
        style: "currency",
        currency: "KES",
      }).format(amount)
    }
  }

  if (!project) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen pt-32 pb-20">
          <div className="container">
            <p>Loading project details...</p>
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
          <Button asChild variant="outline" className="rounded-full mb-8">
            <Link href={`/work/project-${slug}`}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Project
            </Link>
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">Invest in {project.title}</h1>
                <p className="text-xl text-muted-foreground mb-8">{project.description}</p>

                <div className="relative aspect-[16/9] overflow-hidden rounded-lg mb-8">
                  <Image
                    src={project.images[0] || "/placeholder.svg"}
                    alt={project.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Founder</h3>
                    <p>{project.founder}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Category</h3>
                    <p>{project.category}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Funding Goal</h3>
                    <p>{formatCurrency(project.fundingGoal, "KES")}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-muted-foreground mb-1">Equity Offered</h3>
                    <p>{project.equity}</p>
                  </div>
                </div>
              </motion.div>

              {isSuccess ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="bg-secondary p-8 rounded-lg text-center"
                >
                  <h3 className="text-2xl font-bold mb-4">Thank You for Your Investment!</h3>
                  <p className="text-muted-foreground mb-6">
                    Your payment receipt has been submitted successfully. Our team will review your payment and contact
                    you shortly to discuss next steps.
                  </p>
                  <Button asChild className="bg-accent hover:bg-accent/90 text-white rounded-full">
                    <Link href="/work">Browse More Projects</Link>
                  </Button>
                </motion.div>
              ) : showPaymentDetails ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card>
                    <CardHeader>
                      <CardTitle>Payment Details</CardTitle>
                      <CardDescription>
                        Please transfer{" "}
                        {formatCurrency(Number.parseFloat(formData.investmentAmount), formData.currency)} to the
                        following account and upload your receipt.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="font-medium">Bank Details:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Bank Name:</p>
                            <p className="font-medium">Kenya Commercial Bank (KCB)</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Account Name:</p>
                            <p className="font-medium">Freddie Investments Ltd</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Account Number:</p>
                            <p className="font-medium">1234567890</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Branch:</p>
                            <p className="font-medium">Nairobi Main Branch</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Swift Code:</p>
                            <p className="font-medium">KCBLKENX</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Currency:</p>
                            <p className="font-medium">{formData.currency}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">M-Pesa Details:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Business Number:</p>
                            <p className="font-medium">123456</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Account Number:</p>
                            <p className="font-medium">Your Name - {project.title}</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="font-medium">Contact Information:</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Email:</p>
                            <p className="font-medium">funditnow@gmail.com</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Phone:</p>
                            <p className="font-medium">+254 123 456 789</p>
                          </div>
                        </div>
                      </div>

                      <form onSubmit={handleSubmitReceipt} className="space-y-6">
                        <div className="space-y-4">
                          <Label htmlFor="receipt">Upload Payment Receipt (PDF)</Label>
                          <div className="border-2 border-dashed border-muted-foreground/25 rounded-md p-6 text-center">
                            <Input
                              id="receipt"
                              type="file"
                              accept=".pdf"
                              onChange={handleFileChange}
                              className="hidden"
                            />
                            <Label htmlFor="receipt" className="cursor-pointer flex flex-col items-center">
                              <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                              <span className="text-sm text-muted-foreground mb-1">
                                {receiptFile ? receiptFile.name : "Click to upload receipt"}
                              </span>
                              <span className="text-xs text-muted-foreground">PDF files only, max 5MB</span>
                            </Label>
                          </div>
                        </div>

                        <Button
                          type="submit"
                          className="w-full bg-accent hover:bg-accent/90 text-white rounded-full"
                          disabled={isSubmitting || !receiptFile}
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Payment Receipt"
                          )}
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <form onSubmit={handleSubmitInterest} className="space-y-8">
                    <div className="space-y-4">
                      <Label htmlFor="currency">Currency</Label>
                      <RadioGroup
                        defaultValue="KES"
                        value={formData.currency}
                        onValueChange={(value) => handleSelectChange("currency", value)}
                        className="flex space-x-4"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="KES" id="kes" />
                          <Label htmlFor="kes">Kenya Shillings (KES)</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="USD" id="usd" />
                          <Label htmlFor="usd">US Dollars (USD)</Label>
                        </div>
                      </RadioGroup>
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="investmentAmount">Investment Amount ({formData.currency})</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                        <Input
                          id="investmentAmount"
                          name="investmentAmount"
                          type="number"
                          placeholder={`Enter amount in ${formData.currency}`}
                          value={formData.investmentAmount}
                          onChange={handleChange}
                          required
                          className="h-12 rounded-md pl-10"
                        />
                      </div>
                      {formData.investmentAmount && formData.currency && (
                        <p className="text-sm text-muted-foreground">
                          {formData.currency === "USD"
                            ? `≈ ${formatCurrency(Number.parseFloat(formData.investmentAmount) * exchangeRate, "KES")}`
                            : `≈ ${formatCurrency(Number.parseFloat(formData.investmentAmount) / exchangeRate, "USD")}`}
                        </p>
                      )}
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="equityRequested">Equity Requested (%)</Label>
                      <Input
                        id="equityRequested"
                        name="equityRequested"
                        type="number"
                        placeholder="Enter percentage (e.g., 5)"
                        value={formData.equityRequested}
                        onChange={handleChange}
                        required
                        className="h-12 rounded-md"
                      />
                    </div>

                    <div className="space-y-4">
                      <Label htmlFor="message">Message to Founder</Label>
                      <Textarea
                        id="message"
                        name="message"
                        placeholder="Introduce yourself and explain why you're interested in investing in this project..."
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        required
                        className="rounded-md resize-none"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-accent hover:bg-accent/90 text-white rounded-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Submit Investment Interest"
                      )}
                    </Button>
                  </form>
                </motion.div>
              )}
            </div>

            <div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-secondary p-6 rounded-lg sticky top-32"
              >
                <h2 className="text-xl font-bold mb-6">Investment Summary</h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Project</span>
                    <span className="font-medium">{project.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Category</span>
                    <span>{project.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Funding Goal</span>
                    <span>{formatCurrency(project.fundingGoal, "KES")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Equity Offered</span>
                    <span>{project.equity}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <h3 className="font-medium mb-4">What happens next?</h3>
                  <ol className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex gap-2">
                      <span className="bg-accent/20 text-accent rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        1
                      </span>
                      <span>Submit your investment interest</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="bg-accent/20 text-accent rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        2
                      </span>
                      <span>Make payment to the provided account</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="bg-accent/20 text-accent rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        3
                      </span>
                      <span>Upload your payment receipt</span>
                    </li>
                    <li className="flex gap-2">
                      <span className="bg-accent/20 text-accent rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                        4
                      </span>
                      <span>Receive confirmation and investment details</span>
                    </li>
                  </ol>
                </div>

                <div className="text-sm text-muted-foreground">
                  <p>
                    For any questions about the investment process, please contact us at{" "}
                    <a href="mailto:funditnow@gmail.com" className="text-accent hover:underline">
                      funditnow@gmail.com
                    </a>
                  </p>
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
