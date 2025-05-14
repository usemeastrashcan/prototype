"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, Mail, Phone, MessageSquare } from "lucide-react"
import Cookies from "js-cookie"

type Customer = {
  _id: string
  name: string
  email: string
  phone: string
  status: string
}

export default function CustomerList() {
  const router = useRouter()
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers/all")

        // Check if response is OK
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`)
        }

        // Check content type to ensure it's JSON
        const contentType = response.headers.get("content-type")
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON. Check your API endpoint.")
        }

        const data = await response.json()
        setCustomers(data)
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error("Error fetching customers:", err)
          setError(err.message)
        } else {
          console.error("Unknown error fetching customers:", err)
          setError("An unknown error occurred while fetching customers")
        }
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "active":
        return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
      case "inactive":
        return "bg-rose-100 text-rose-800 hover:bg-rose-200"
      default:
        return "bg-amber-100 text-amber-800 hover:bg-amber-200"
    }
  }

  const handleChatboxClick = (customerId: string) => {
    // Find the selected customer
    const selectedCustomer = customers.find((customer) => customer._id === customerId)

    if (selectedCustomer) {
      // Set the customer data as a cls
      // e
      Cookies.set("customer", JSON.stringify(selectedCustomer), { path: "/" })
    }

    router.push(`/chatbox`)
  }

  return (
    <div className="container mx-auto py-8 px-4 md:px-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Customer Directory
          </h1>
          <p className="text-slate-500 mt-2">Manage and connect with your customers</p>
        </div>
        <div className="hidden md:block">
          <Users className="h-12 w-12 text-indigo-500" />
        </div>
      </div>

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden border-0 shadow-lg">
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardContent>
              <CardFooter className="bg-slate-50 p-4">
                <Skeleton className="h-9 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-rose-50 border-l-4 border-rose-500 p-6 rounded-md shadow-md">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-8 w-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-rose-800">Error Loading Customers</h3>
              <p className="mt-1 text-rose-700">{error}</p>
              <p className="mt-2 text-sm text-rose-600">Make sure your API endpoint is returning valid JSON data.</p>
            </div>
          </div>
        </div>
      )}

      {!loading && !error && customers.length === 0 && (
        <div className="bg-slate-50 rounded-lg p-12 text-center shadow-inner">
          <Users className="h-16 w-16 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-700">No customers found</h3>
          <p className="mt-2 text-slate-500">Your customer list is currently empty.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          !error &&
          customers.map((customer) => (
            <Card
              key={customer._id}
              className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className="h-2 bg-gradient-to-r from-indigo-500 to-purple-600"></div>
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-slate-800 mb-3">{customer.name}</h2>
                <div className="space-y-2 text-slate-600">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="text-sm">{customer.email}</span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-indigo-500" />
                    <span className="text-sm">{customer.phone}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <Badge className={`font-medium ${getStatusColor(customer.status)}`}>{customer.status}</Badge>
                </div>
              </CardContent>
              <CardFooter className="bg-slate-50 p-4">
                <Button
                  onClick={() => handleChatboxClick(customer._id)}
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Chatbox
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>
    </div>
  )
}
