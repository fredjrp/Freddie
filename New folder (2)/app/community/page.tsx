"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { Send, Users, MessageSquare, Clock } from "lucide-react"

type Message = {
  id: string
  text: string
  userId: string
  userName: string
  userImage?: string
  timestamp: any
}

type Channel = {
  id: string
  name: string
  description: string
}

export default function CommunityPage() {
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [activeChannel, setActiveChannel] = useState("general")
  const [isLoading, setIsLoading] = useState(true)
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const channels: Channel[] = [
    {
      id: "general",
      name: "General",
      description: "General discussion for all members",
    },
    {
      id: "design",
      name: "Design",
      description: "Discuss design trends and techniques",
    },
    {
      id: "investment",
      name: "Investment",
      description: "Talk about investment opportunities",
    },
    {
      id: "feedback",
      name: "Feedback",
      description: "Share and receive feedback on your work",
    },
  ]

  useEffect(() => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to access the community chat.",
        variant: "destructive",
      })
      router.push("/login?redirect=/community")
      return
    }

    const q = query(collection(db, `channels/${activeChannel}/messages`), orderBy("timestamp", "asc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedMessages: Message[] = []
      snapshot.forEach((doc) => {
        fetchedMessages.push({
          id: doc.id,
          ...doc.data(),
        } as Message)
      })
      setMessages(fetchedMessages)
      setIsLoading(false)
      scrollToBottom()
    })

    return () => unsubscribe()
  }, [user, activeChannel, router, toast])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!message.trim() || !user) return

    try {
      await addDoc(collection(db, `channels/${activeChannel}/messages`), {
        text: message,
        userId: user.uid,
        userName: user.displayName || "Anonymous",
        userImage: user.photoURL || null,
        timestamp: serverTimestamp(),
      })

      setMessage("")
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    }
  }

  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return ""

    const date = timestamp.toDate()
    return new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    }).format(date)
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gray-50 dark:bg-navy-900 py-12">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="font-serif text-3xl md:text-4xl font-bold mb-4">Community Chat</h1>
              <p className="text-muted-foreground">
                Connect with other designers, creators, and investors in our community chat.
              </p>
            </div>

            <div className="bg-white dark:bg-navy-800 rounded-lg shadow-md overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-4">
                {/* Sidebar */}
                <div className="bg-gray-50 dark:bg-navy-700 p-4 border-r border-gray-200 dark:border-navy-600">
                  <h2 className="font-medium text-lg mb-4 flex items-center gap-2">
                    <Users className="h-5 w-5" /> Channels
                  </h2>
                  <nav className="space-y-1">
                    {channels.map((channel) => (
                      <button
                        key={channel.id}
                        onClick={() => setActiveChannel(channel.id)}
                        className={`w-full text-left px-3 py-2 rounded-md flex items-center gap-2 transition-colors ${
                          activeChannel === channel.id
                            ? "bg-navy-100 dark:bg-navy-600 text-navy-600 dark:text-gold-400"
                            : "hover:bg-gray-100 dark:hover:bg-navy-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <MessageSquare className="h-4 w-4" />
                        <span>{channel.name}</span>
                      </button>
                    ))}
                  </nav>

                  <div className="mt-8">
                    <h2 className="font-medium text-lg mb-4">Channel Info</h2>
                    <div className="bg-white dark:bg-navy-800 p-4 rounded-md">
                      <h3 className="font-medium mb-2">{channels.find((c) => c.id === activeChannel)?.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {channels.find((c) => c.id === activeChannel)?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Chat Area */}
                <div className="col-span-3 flex flex-col h-[600px]">
                  {/* Messages */}
                  <div className="flex-1 p-4 overflow-y-auto">
                    {isLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <p>Loading messages...</p>
                      </div>
                    ) : messages.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full text-center">
                        <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="font-medium text-lg mb-2">No messages yet</h3>
                        <p className="text-muted-foreground">Be the first to start the conversation in this channel!</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex gap-3 ${msg.userId === user?.uid ? "justify-end" : ""}`}
                          >
                            {msg.userId !== user?.uid && (
                              <Avatar>
                                <AvatarImage src={msg.userImage || undefined} />
                                <AvatarFallback>{getInitials(msg.userName)}</AvatarFallback>
                              </Avatar>
                            )}
                            <div
                              className={`max-w-[70%] ${
                                msg.userId === user?.uid ? "bg-navy-600 text-white" : "bg-gray-100 dark:bg-navy-700"
                              } rounded-lg p-3`}
                            >
                              <div className="flex justify-between items-start mb-1">
                                <span className="font-medium text-sm">
                                  {msg.userId === user?.uid ? "You" : msg.userName}
                                </span>
                                <span className="text-xs opacity-70 ml-2 flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {formatTimestamp(msg.timestamp)}
                                </span>
                              </div>
                              <p>{msg.text}</p>
                            </div>
                            {msg.userId === user?.uid && (
                              <Avatar>
                                <AvatarImage src={msg.userImage || undefined} />
                                <AvatarFallback>{getInitials(msg.userName)}</AvatarFallback>
                              </Avatar>
                            )}
                          </motion.div>
                        ))}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="border-t border-gray-200 dark:border-navy-600 p-4">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                      <Input
                        type="text"
                        placeholder="Type your message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="flex-1"
                      />
                      <Button type="submit" disabled={!message.trim()}>
                        <Send className="h-4 w-4 mr-2" />
                        Send
                      </Button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
