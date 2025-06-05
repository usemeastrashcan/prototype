"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Send, Bot, User, Copy, Check, Mail, CheckCircle, AlertCircle, X } from "lucide-react"
import axios from "axios"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface LeadInfo {
  id: string
  name: string
  email: string
  company: string
}

interface EmailContent {
  subject: string
  body: string
}

interface Notification {
  id: string
  type: "success" | "error" | "info"
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
  }
}

export default function ChatboxPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [leadInfo, setLeadInfo] = useState<LeadInfo | null>(null)
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null)
  const [notifications, setNotifications] = useState<Notification[]>([])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Get lead info from URL params
    const leadId = searchParams.get("leadId")
    const name = searchParams.get("name")
    const email = searchParams.get("email")
    const company = searchParams.get("company")

    if (leadId && name && email) {
      const lead: LeadInfo = {
        id: leadId,
        name: decodeURIComponent(name),
        email: decodeURIComponent(email),
        company: decodeURIComponent(company || ""),
      }
      setLeadInfo(lead)

      // Add initial AI message
      const initialMessage: Message = {
        id: "initial",
        role: "assistant",
        content: `Hello! I'm here to help you generate an email for ${lead.name} from ${lead.company || "their company"}. Should I generate an email for this lead?`,
        timestamp: new Date(),
      }
      setMessages([initialMessage])
    }
  }, [searchParams])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const addNotification = (notification: Omit<Notification, "id">) => {
    const id = Date.now().toString()
    const newNotification = { ...notification, id }
    setNotifications((prev) => [...prev, newNotification])

    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      removeNotification(id)
    }, 5000)
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !leadInfo) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsLoading(true)

    try {
      const response = await axios.post("/api/chat", {
        message: inputValue,
        leadInfo,
        conversationHistory: messages,
      })

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response.data.message,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, aiMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Sorry, I encountered an error. Please try again.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content)
      setCopiedMessageId(messageId)
      setTimeout(() => setCopiedMessageId(null), 2000)
      addNotification({
        type: "success",
        title: "Copied to clipboard",
        description: "Email content has been copied to your clipboard.",
      })
    } catch (error) {
      console.error("Failed to copy:", error)
      addNotification({
        type: "error",
        title: "Failed to copy",
        description: "Could not copy to clipboard. Please try again.",
      })
    }
  }

  const parseEmailContent = (content: string): EmailContent | null => {
    // Check if the content contains an email (has a Subject line)
    if (!content.includes("Subject:")) return null

    try {
      // Extract subject line
      const subjectMatch = content.match(/Subject:\s*([^\n]+)/)
      const subject = subjectMatch ? subjectMatch[1].trim() : ""

      // Use the full content as body (including the subject line)
      // The email sending function will handle formatting
      const body = content

      return { subject, body }
    } catch (error) {
      console.error("Error parsing email content:", error)
      return null
    }
  }

  const sendEmail = async (content: string) => {
    if (!leadInfo) return

    const emailContent = parseEmailContent(content)
    if (!emailContent) {
      addNotification({
        type: "error",
        title: "Invalid email format",
        description: "Could not detect a valid email format. Please ensure the message contains a subject line.",
      })
      return
    }

    setIsSending(true)

    try {
      // Replace placeholders in the email content with actual lead data
      const processedBody = emailContent.body
        .replace(/\[name\]/gi, leadInfo.name)
        .replace(/\[company\]/gi, leadInfo.company || "your company")
        .replace(/\[email\]/gi, leadInfo.email)

      const response = await axios.post("/api/email/send", {
        to: leadInfo.email,
        subject: emailContent.subject,
        body: processedBody,
        leadId: leadInfo.id,
      })

      if (response.data.success) {
        addNotification({
          type: "success",
          title: "Email sent successfully",
          description: `Email has been sent to ${leadInfo.name}.`,
        })

        // Add a system message about the email being sent
        const systemMessage: Message = {
          id: Date.now().toString(),
          role: "assistant",
          content: `✅ Email sent successfully to ${leadInfo.name} (${leadInfo.email})\n\nThe lead has been marked as converted and will now appear in Call 2.`,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, systemMessage])

        // If we have a preview URL (for test emails), show it
        if (response.data.previewUrl) {
          addNotification({
            type: "info",
            title: "Test email sent",
            description: "This was a test email. You can view it at the preview URL.",
            action: {
              label: "View email",
              onClick: () => window.open(response.data.previewUrl, "_blank"),
            },
          })
        }
      }
    } catch (error) {
      console.error("Error sending email:", error)
      addNotification({
        type: "error",
        title: "Failed to send email",
        description: "There was an error sending the email. Please try again.",
      })
    } finally {
      setIsSending(false)
    }
  }

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const containsEmail = (content: string): boolean => {
    return content.includes("Subject:")
  }

  if (!leadInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 flex items-center justify-center">
        <div className="text-white text-center">
          <h1 className="text-2xl font-bold mb-4">Loading...</h1>
          <p>Please wait while we load the lead information.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900">
      {/* Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {notifications.map((notification) => (
          <Alert
            key={notification.id}
            className={`border-l-4 shadow-lg transition-all duration-300 ${
              notification.type === "success"
                ? "border-l-green-500 bg-green-950/50 border-green-800"
                : notification.type === "error"
                  ? "border-l-red-500 bg-red-950/50 border-red-800"
                  : "border-l-blue-500 bg-blue-950/50 border-blue-800"
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-2">
                {notification.type === "success" && <CheckCircle className="w-4 h-4 text-green-400 mt-0.5" />}
                {notification.type === "error" && <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />}
                {notification.type === "info" && <Mail className="w-4 h-4 text-blue-400 mt-0.5" />}
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-white">{notification.title}</h4>
                  <AlertDescription className="text-xs text-gray-300 mt-1">{notification.description}</AlertDescription>
                  {notification.action && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={notification.action.onClick}
                      className="text-xs mt-2 p-1 h-auto text-blue-400 hover:text-blue-300"
                    >
                      {notification.action.label}
                    </Button>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNotification(notification.id)}
                className="p-1 h-auto text-gray-400 hover:text-white"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </Alert>
        ))}
      </div>

      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
            className="text-gray-300 hover:text-white hover:bg-gray-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Board
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="w-10 h-10">
              <AvatarFallback className="bg-gray-700 text-gray-300">
                <User className="w-5 h-5" />
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-white font-semibold">{leadInfo.name}</h1>
              <p className="text-gray-400 text-sm">{leadInfo.email}</p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-gray-700 text-gray-300">
            {leadInfo.company || "No Company"}
          </Badge>
        </div>
      </div>

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto h-[calc(100vh-140px)] flex flex-col">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}>
              {message.role === "assistant" && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-blue-600 text-white">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`max-w-[70%] ${
                  message.role === "user"
                    ? "bg-blue-600 text-white rounded-l-lg rounded-tr-lg"
                    : "bg-gray-800 text-gray-100 rounded-r-lg rounded-tl-lg"
                } p-4 shadow-lg`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs opacity-70">{formatTimestamp(message.timestamp)}</span>
                  {message.role === "assistant" && containsEmail(message.content) && (
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(message.content, message.id)}
                        className="text-xs p-1 h-auto hover:bg-gray-700"
                        disabled={isSending}
                      >
                        {copiedMessageId === message.id ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => sendEmail(message.content)}
                        className="text-xs p-1 h-auto hover:bg-gray-700 text-blue-400 hover:text-blue-300"
                        disabled={isSending}
                      >
                        {isSending ? (
                          <div className="flex items-center gap-1">
                            <div className="w-3 h-3 border-2 border-t-transparent border-blue-400 rounded-full animate-spin"></div>
                            <span>Sending...</span>
                          </div>
                        ) : (
                          <>
                            <Mail className="w-3 h-3 mr-1" />
                            <span>Send</span>
                          </>
                        )}
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {message.role === "user" && (
                <Avatar className="w-8 h-8 mt-1">
                  <AvatarFallback className="bg-gray-600 text-white">
                    <User className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <Avatar className="w-8 h-8 mt-1">
                <AvatarFallback className="bg-blue-600 text-white">
                  <Bot className="w-4 h-4" />
                </AvatarFallback>
              </Avatar>
              <div className="bg-gray-800 text-gray-100 rounded-r-lg rounded-tl-lg p-4 shadow-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 bg-gray-800 border-t border-gray-700">
          <div className="flex gap-3">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type your message about the email..."
              className="flex-1 bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
              disabled={isLoading || isSending}
            />
            <Button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading || isSending}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
