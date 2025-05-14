"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Mail, Send, Loader2, User, AlertCircle, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import Cookies from "js-cookie"

export default function CustomerEmailGenerator() {
  // Remove this line:
  // const [customerId, setCustomerId] = useState("")

  // Add this state to store the customer object:
  const [customer, setCustomer] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [emailData, setEmailData] = useState<{
    suggestedAction: string
    emailContent: string
  } | null>(null)

  // Add this useEffect after the state declarations:
  useEffect(() => {
    const customerCookie = Cookies.get("customer")
    if (customerCookie) {
      try {
        const parsedCustomer = JSON.parse(customerCookie)
        setCustomer(parsedCustomer)
      } catch (err) {
        setError("Invalid customer data in cookie")
      }
    } else {
      setError("No customer selected")
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!customer || !customer.id) {
      setError("No customer selected")
      return
    }

    setLoading(true)
    setError("")

    try {
      const response = await fetch("/api/customers/sendMail", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ customerId: customer.id }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch customer data")
      }

      setEmailData(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container max-w-5xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Customer Email Generator</h1>

      <div className="grid gap-8 md:grid-cols-[1fr_2fr]">
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Customer Lookup</CardTitle>
              <CardDescription>Generate a personalized email for the selected customer</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Selected Customer</label>
                  <div className="flex items-center space-x-2">
                    <div className="flex-1 p-3 bg-muted rounded-md">
                      {customer ? (
                        <div className="flex items-center">
                          <User className="h-4 w-4 mr-2 text-muted-foreground" />
                          <span>{customer.name || customer.id}</span>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">No customer selected</span>
                      )}
                    </div>
                    <Button type="submit" disabled={loading || !customer}>
                      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </form>

              {error && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {emailData && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <h3 className="font-medium mb-2">Suggested Action:</h3>
                  <Badge variant="secondary" className="text-sm">
                    {emailData.suggestedAction}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full"
            >
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-muted-foreground">Generating email content...</p>
              </div>
            </motion.div>
          ) : emailData ? (
            <motion.div
              key="email"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <EmailPreview emailContent={emailData.emailContent} customerId={customer?.id || ""} />
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center h-full"
            >
              <div className="text-center p-8 border border-dashed rounded-lg bg-muted/50 flex flex-col items-center space-y-4">
                <Mail className="h-16 w-16 text-muted-foreground/50" />
                <div>
                  <h3 className="text-lg font-medium">No Email Generated Yet</h3>
                  <p className="text-muted-foreground">Click the Send button to generate a personalized email</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function EmailPreview({ emailContent, customerId }: { emailContent: string; customerId: string }) {
  const [open, setOpen] = useState(false)
  const [sending, setSending] = useState(false)
  const [sendStatus, setSendStatus] = useState<"idle" | "success" | "error">("idle")
  // No need for useToast with Sonner

  const handleSendEmail = async () => {
    setSending(true)
    setSendStatus("idle")

    try {
      const response = await fetch("/api/customers/finalSend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customerId,
          emailContent,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to send email")
      }

      setSendStatus("success")
      toast.success("Email sent successfully", {
        description: "The email has been sent to the customer.",
      })
    } catch (err) {
      setSendStatus("error")
      toast.error("Failed to send email", {
        description: err instanceof Error ? err.message : "An unexpected error occurred",
      })
    } finally {
      setSending(false)
      setOpen(false)
    }
  }

  return (
    <Card className="overflow-hidden shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="flex items-center space-x-2">
          <Mail className="h-5 w-5" />
          <CardTitle>Email Preview</CardTitle>
        </div>
        <CardDescription className="text-blue-100">Generated based on customer data</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="p-4 bg-gray-50 border-b">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 rounded-full p-2">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium">To: Customer</p>
              <p className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
        <div className="p-6 bg-white">
          <div className="prose max-w-none">
            {emailContent.split("\n").map((paragraph, index) => (
              <p key={index} className={index === 0 ? "text-lg font-medium" : ""}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 border-t flex justify-between">
        <Button variant="outline" size="sm">
          <Edit className="h-4 w-4 mr-2" />
          Edit
        </Button>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Send className="h-4 w-4 mr-2" />
              Send Email
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Email Sending</DialogTitle>
              <DialogDescription>
                Are you sure you want to send this email to the customer? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <div className="bg-muted/50 p-4 rounded-md max-h-[200px] overflow-y-auto my-2">
              <p className="text-sm">{emailContent}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendEmail} disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Confirm Send
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  )
}
