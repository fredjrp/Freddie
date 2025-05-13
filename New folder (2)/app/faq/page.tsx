"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Search, Bot, Loader2 } from "lucide-react"

export default function FAQPage() {
  const [query, setQuery] = useState("")
  const [aiResponse, setAiResponse] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([
    "What design services do you offer?",
    "How does the investment platform work?",
    "What is the process for booking a service?",
    "How can I join the community?",
    "What are your payment terms?",
  ])

  const faqs = [
    {
      question: "What design services do you offer?",
      answer:
        "We offer a wide range of design services including logo design, branding, website design, UI/UX design, social media graphics, print design, and more. Each service is tailored to meet your specific needs and goals.",
    },
    {
      question: "How does the investment platform work?",
      answer:
        "Our investment platform connects creative professionals with potential investors. Creators can share their projects and funding goals, while investors can browse opportunities and choose projects to support. We facilitate the connection and provide tools for secure transactions and communication.",
    },
    {
      question: "What is your design process?",
      answer:
        "Our design process typically includes discovery (understanding your needs and goals), concept development (creating initial designs), refinement (incorporating your feedback), and delivery (providing final files). We maintain open communication throughout to ensure your satisfaction.",
    },
    {
      question: "How long does a typical project take?",
      answer:
        "Project timelines vary depending on complexity and scope. A logo design might take 1-2 weeks, while a complete brand identity could take 4-6 weeks. Website design projects typically range from 4-8 weeks. We'll provide a specific timeline during our initial consultation.",
    },
    {
      question: "What are your payment terms?",
      answer:
        "We typically require a 50% deposit to begin work, with the remaining balance due upon project completion. For larger projects, we may establish a payment schedule with milestones. We accept credit cards, bank transfers, and PayPal.",
    },
    {
      question: "Do you offer revisions?",
      answer:
        "Yes, all our design packages include a specified number of revision rounds. Additional revisions beyond the included amount are available at an hourly rate. We're committed to ensuring your complete satisfaction with the final result.",
    },
    {
      question: "How can I join the community?",
      answer:
        "To join our community, simply create an account on our platform. Once registered, you'll have access to the community chat, investment opportunities, and the ability to share your own projects. We welcome designers, investors, and creative professionals of all types.",
    },
    {
      question: "What file formats will I receive?",
      answer:
        "For design projects, we provide files in all industry-standard formats. This typically includes vector files (AI, EPS, SVG), raster files (JPG, PNG, PSD), and PDF. For web projects, we can provide source code, design assets, and documentation as needed.",
    },
  ]

  const handleAskAI = async (questionText: string = query) => {
    if (!questionText.trim()) return

    setIsLoading(true)
    setAiResponse("")

    try {
      // In a real implementation, this would call the Gemini API
      // For now, we'll simulate a response
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Generate a simulated response based on the question
      let response = ""

      if (questionText.toLowerCase().includes("design")) {
        response =
          "Our design services include logo design, branding, website design, UI/UX design, social media graphics, and print design. Each service is customized to meet your specific needs and business goals. Our design process involves understanding your requirements, creating concepts, refining based on your feedback, and delivering final files in all necessary formats."
      } else if (questionText.toLowerCase().includes("investment")) {
        response =
          "Our investment platform connects creative professionals with potential investors. You can browse projects, view their funding goals and progress, and choose to invest in ones that align with your interests. All transactions are secure, and we provide tools for communication between creators and investors to ensure transparency."
      } else if (questionText.toLowerCase().includes("community")) {
        response =
          "Our community is open to designers, investors, and creative professionals. After creating an account, you can join discussion channels, share your work, give and receive feedback, and connect with like-minded individuals. We foster a supportive environment where collaboration and growth are encouraged."
      } else if (questionText.toLowerCase().includes("payment") || questionText.toLowerCase().includes("price")) {
        response =
          "Our pricing varies based on project scope and requirements. We typically require a 50% deposit to begin work, with the remaining balance due upon completion. For larger projects, we may establish a payment schedule with milestones. We accept credit cards, bank transfers, and PayPal."
      } else {
        response =
          "Thank you for your question. While I don't have specific information about that topic, I'd be happy to connect you with our team who can provide a detailed answer. You can reach out through our contact page or email us directly at support@designstudio.com."
      }

      setAiResponse(response)
    } catch (error) {
      console.error("Error fetching AI response:", error)
      setAiResponse("Sorry, I encountered an error while processing your question. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-navy-900 py-12">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h1>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find answers to common questions about our services, investment platform, and community.
              </p>
            </div>

            <Accordion type="single" collapsible className="mb-12">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="bg-white dark:bg-navy-800 rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Bot className="h-6 w-6 text-navy-600 dark:text-gold-400" />
                <h2 className="font-serif text-xl font-bold">Ask AI Assistant</h2>
              </div>
              <p className="text-muted-foreground mb-6">
                Can't find what you're looking for? Ask our AI assistant for help.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  handleAskAI()
                }}
                className="mb-6"
              >
                <div className="flex gap-2">
                  <Input
                    type="text"
                    placeholder="Ask a question..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="flex-1"
                  />
                  <Button type="submit" disabled={isLoading || !query.trim()}>
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Thinking...
                      </>
                    ) : (
                      <>
                        <Search className="h-4 w-4 mr-2" />
                        Ask
                      </>
                    )}
                  </Button>
                </div>
              </form>

              {aiResponse && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-navy-50 dark:bg-navy-700 p-4 rounded-lg mb-6"
                >
                  <p className="text-sm font-medium mb-2">AI Assistant:</p>
                  <p>{aiResponse}</p>
                </motion.div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Suggested questions:</p>
                <div className="flex flex-wrap gap-2">
                  {suggestedQuestions.map((question, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setQuery(question)
                        handleAskAI(question)
                      }}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <h2 className="font-serif text-xl font-bold mb-4">Still have questions?</h2>
                  <p className="text-muted-foreground mb-6">Contact our support team for personalized assistance.</p>
                  <Button asChild>
                    <a href="/contact">Contact Support</a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
