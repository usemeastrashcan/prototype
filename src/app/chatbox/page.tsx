"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FileText, Mail, ArrowRight, MessageSquare, Send, User, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import PDFSummarizer from "@/components/pdf-summarizer"
import CustomerEmailGenerator from "@/components/customer-email-generator"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  options?: Array<{
    id: string
    label: string
    value: "pdf" | "email"
    icon: React.ReactNode
    description: string
  }>
}

export default function CustomerTools() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      content: "Hello! I'm your assistant. What would you like to do today?",
      sender: "bot",
      options: [
        {
          id: "pdf-option",
          label: "Summarize a PDF",
          value: "pdf",
          icon: <FileText className="h-4 w-4" />,
          description: "Upload a PDF document and get an AI-generated summary",
        },
        {
          id: "email-option",
          label: "Generate Customer Email",
          value: "email",
          icon: <Mail className="h-4 w-4" />,
          description: "Create a personalized email for a customer",
        },
      ],
    },
  ])
  const [input, setInput] = useState("")
  const [selectedTool, setSelectedTool] = useState<"pdf" | "email" | null>(null)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmedTool, setConfirmedTool] = useState<"pdf" | "email" | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleToolSelect = (tool: "pdf" | "email") => {
    setSelectedTool(tool)

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      content: tool === "pdf" ? "I want to summarize a PDF" : "I want to generate a customer email",
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])

    // Add bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now().toString() + "-bot",
        content:
          tool === "pdf"
            ? "You've selected the PDF Summarizer. Would you like to proceed?"
            : "You've selected the Customer Email Generator. Would you like to proceed?",
        sender: "bot",
      }
      setMessages((prev) => [...prev, botResponse])
      setShowConfirmation(true)
    }, 500)
  }

  const handleConfirm = () => {
    setShowConfirmation(false)

    // Add confirmation message
    const confirmMessage: Message = {
      id: Date.now().toString() + "-bot",
      content:
        selectedTool === "pdf"
          ? "Great! I'm taking you to the PDF Summarizer now..."
          : "Great! I'm taking you to the Customer Email Generator now...",
      sender: "bot",
    }

    setMessages((prev) => [...prev, confirmMessage])

    // Delay to show the message before transitioning
    setTimeout(() => {
      setConfirmedTool(selectedTool)
    }, 1000)
  }

  const handleCancel = () => {
    setShowConfirmation(false)

    // Add cancellation message
    const cancelMessage: Message = {
      id: Date.now().toString() + "-bot",
      content: "No problem. What would you like to do instead?",
      sender: "bot",
      options: [
        {
          id: "pdf-option",
          label: "Summarize a PDF",
          value: "pdf",
          icon: <FileText className="h-4 w-4" />,
          description: "Upload a PDF document and get an AI-generated summary",
        },
        {
          id: "email-option",
          label: "Generate Customer Email",
          value: "email",
          icon: <Mail className="h-4 w-4" />,
          description: "Create a personalized email for a customer",
        },
      ],
    }

    setMessages((prev) => [...prev, cancelMessage])
    setSelectedTool(null)
  }

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (!input.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      content: input,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Add bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now().toString() + "-bot",
        content: "I can help you with that. Please select one of the following options:",
        sender: "bot",
        options: [
          {
            id: "pdf-option",
            label: "Summarize a PDF",
            value: "pdf",
            icon: <FileText className="h-4 w-4" />,
            description: "Upload a PDF document and get an AI-generated summary",
          },
          {
            id: "email-option",
            label: "Generate Customer Email",
            value: "email",
            icon: <Mail className="h-4 w-4" />,
            description: "Create a personalized email for a customer",
          },
        ],
      }
      setMessages((prev) => [...prev, botResponse])
    }, 500)
  }

  const handleBackToChat = () => {
    setConfirmedTool(null)

    // Add return message
    const returnMessage: Message = {
      id: Date.now().toString() + "-bot",
      content: "Welcome back! What would you like to do next?",
      sender: "bot",
      options: [
        {
          id: "pdf-option",
          label: "Summarize a PDF",
          value: "pdf",
          icon: <FileText className="h-4 w-4" />,
          description: "Upload a PDF document and get an AI-generated summary",
        },
        {
          id: "email-option",
          label: "Generate Customer Email",
          value: "email",
          icon: <Mail className="h-4 w-4" />,
          description: "Create a personalized email for a customer",
        },
      ],
    }

    setMessages((prev) => [...prev, returnMessage])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="container max-w-7xl mx-auto py-12 px-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 text-transparent bg-clip-text mb-4">
            Customer Service Assistant
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chat with your assistant to access tools that help you manage customer interactions efficiently.
          </p>
        </div>

        {!confirmedTool ? (
          <Card className="max-w-4xl mx-auto shadow-lg border-0 overflow-hidden">
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <h2 className="font-semibold">Customer Service Chat</h2>
            </div>
            <CardContent className="p-0">
              <div className="h-[500px] flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`flex items-start gap-2 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}
                      >
                        <div
                          className={`rounded-full p-2 flex-shrink-0 ${message.sender === "user" ? "bg-purple-100" : "bg-gray-100"}`}
                        >
                          {message.sender === "user" ? (
                            <User className="h-5 w-5 text-purple-500" />
                          ) : (
                            <Bot className="h-5 w-5 text-pink-500" />
                          )}
                        </div>
                        <div
                          className={`rounded-lg p-3 ${message.sender === "user" ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white" : "bg-white border"}`}
                        >
                          <p>{message.content}</p>

                          {message.options && (
                            <div className="mt-3 space-y-2">
                              {message.options.map((option) => (
                                <button
                                  key={option.id}
                                  onClick={() => handleToolSelect(option.value)}
                                  className="w-full text-left p-3 rounded-lg border hover:border-purple-300 bg-white hover:bg-purple-50 transition-colors flex items-start gap-3"
                                >
                                  <div
                                    className={`rounded-full p-2 ${option.value === "pdf" ? "bg-purple-100 text-purple-500" : "bg-pink-100 text-pink-500"}`}
                                  >
                                    {option.icon}
                                  </div>
                                  <div>
                                    <div className="font-medium">{option.label}</div>
                                    <div className="text-sm text-gray-500">{option.description}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
                  <div className="flex gap-2">
                    <Input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1"
                    />
                    <Button type="submit" size="icon">
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </div>
            </CardContent>
          </Card>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={confirmedTool}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {confirmedTool === "pdf" ? <PDFSummarizer /> : <CustomerEmailGenerator />}

              <div className="mt-8 text-center">
                <Button
                  onClick={handleBackToChat}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Back to Chat
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        <Dialog open={showConfirmation} onOpenChange={setShowConfirmation}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Confirm Selection</DialogTitle>
              <DialogDescription>
                You are about to use the {selectedTool === "pdf" ? "PDF Summarizer" : "Customer Email Generator"} tool.
              </DialogDescription>
            </DialogHeader>
            <div
              className="p-4 bg-gradient-to-r rounded-lg my-2 flex items-center gap-3"
              style={{
                backgroundImage:
                  selectedTool === "pdf"
                    ? "linear-gradient(to right, rgba(147, 51, 234, 0.1), rgba(79, 70, 229, 0.1))"
                    : "linear-gradient(to right, rgba(236, 72, 153, 0.1), rgba(249, 115, 22, 0.1))",
              }}
            >
              {selectedTool === "pdf" ? (
                <FileText className="h-8 w-8 text-purple-500" />
              ) : (
                <Mail className="h-8 w-8 text-pink-500" />
              )}
              <div>
                <h3 className="font-medium">
                  {selectedTool === "pdf" ? "PDF Summarizer" : "Customer Email Generator"}
                </h3>
                <p className="text-sm text-gray-600">
                  {selectedTool === "pdf"
                    ? "Upload and summarize PDF documents"
                    : "Generate personalized customer emails"}
                </p>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                className={
                  selectedTool === "pdf"
                    ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                    : "bg-gradient-to-r from-pink-500 to-orange-500 text-white"
                }
              >
                Confirm <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
