"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Phone, Mail, CheckCircle, User, Loader2, Calendar, Star } from "lucide-react"
import { useRouter } from "next/navigation"
import axios from "axios"

interface ZohoLead {
  id: string
  Full_Name?: string
  First_Name?: string
  Last_Name?: string
  Email?: string
  Phone?: string
  Mobile?: string
  Company?: string
  Activity?: string
  Lead_Source?: string
  Score?: number
  Owner?: {
    name: string
    email: string
  }
  Created_Time?: string
  Last_Activity_Time?: string
  Date_of_1st_Contact?: string
  Lead_Responded_To_Contact_Attempt?: boolean
  Data_Source?: string
  Industry?: string
  $converted?: boolean
  [key: string]: any
}

interface UserCard {
  id: string
  name: string
  email: string
  phone: string
  company: string
  status: string
  priority: "high" | "medium" | "low"
  avatar: string
  score?: number
  owner?: string
  lastActivity?: string
  leadSource?: string
  dataSource?: string
  responded?: boolean
  converted?: boolean
}

const columnConfig = {
  "Call 1": {
    icon: Phone,
    gradient: "from-slate-700 to-slate-800",
    bgColor: "bg-slate-50",
    borderColor: "border-slate-200",
    textColor: "text-slate-300",
    accentColor: "bg-slate-700",
  },
  "Call 2": {
    icon: Phone,
    gradient: "from-gray-700 to-gray-800",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-200",
    textColor: "text-gray-300",
    accentColor: "bg-gray-700",
  },
  "Call 3": {
    icon: Phone,
    gradient: "from-zinc-700 to-zinc-800",
    bgColor: "bg-zinc-50",
    borderColor: "border-zinc-200",
    textColor: "text-zinc-300",
    accentColor: "bg-zinc-700",
  },
  "E-mail": {
    icon: Mail,
    gradient: "from-stone-700 to-stone-800",
    bgColor: "bg-stone-50",
    borderColor: "border-stone-200",
    textColor: "text-stone-300",
    accentColor: "bg-stone-700",
  },
  Progress: {
    icon: CheckCircle,
    gradient: "from-neutral-700 to-neutral-800",
    bgColor: "bg-neutral-50",
    borderColor: "border-neutral-200",
    textColor: "text-neutral-300",
    accentColor: "bg-neutral-700",
  },
}

const priorityColors = {
  high: "bg-red-900/30 text-red-300 border-red-800",
  medium: "bg-amber-900/30 text-amber-300 border-amber-800",
  low: "bg-emerald-900/30 text-emerald-300 border-emerald-800",
}

// Function to determine priority based on lead data
const determinePriority = (lead: ZohoLead): "high" | "medium" | "low" => {
  const score = lead.Score || 0
  const activity = lead.Activity?.toLowerCase() || ""
  const responded = lead.Lead_Responded_To_Contact_Attempt || false

  // High priority: High score, fresh activity, or responded to contact
  if (score >= 7 || activity === "hot" || responded) {
    return "high"
  }
  // Medium priority: Medium score or warm activity
  else if (score >= 4 || activity === "warm" || activity === "fresh") {
    return "medium"
  }
  // Low priority: Everything else
  return "low"
}

// Function to format date for display
const formatDate = (dateString?: string): string => {
  if (!dateString) return ""
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    })
  } catch {
    return ""
  }
}

// Function to convert Zoho lead to our card format
const convertZohoLeadToCard = (lead: ZohoLead): UserCard => {
  return {
    id: lead.id,
    name: lead.Full_Name || `${lead.First_Name || ""} ${lead.Last_Name || ""}`.trim() || "Unknown Lead",
    email: lead.Email || "No email provided",
    phone: lead.Phone || lead.Mobile || "No phone provided",
    company: lead.Company || "No company",
    status: lead.Activity || "New Lead",
    priority: determinePriority(lead),
    avatar: "/placeholder.svg?height=40&width=40",
    score: lead.Score,
    owner: lead.Owner?.name,
    lastActivity: formatDate(lead.Last_Activity_Time),
    leadSource: lead.Lead_Source || lead.Data_Source,
    dataSource: lead.Data_Source,
    responded: lead.Lead_Responded_To_Contact_Attempt,
    converted: lead.$converted,
  }
}

export default function Component() {
  const [currentView, setCurrentView] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [kanbanData, setKanbanData] = useState<Record<string, UserCard[]>>({
    "Call 1": [],
    "Call 2": [],
    "Call 3": [],
    "E-mail": [],
    Progress: [],
  })
  const router = useRouter()

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true)
        const response = await axios.get("/api/zoho/leads")

        if (response.data && response.data.data) {
          // Convert Zoho leads to our card format
          const leads = response.data.data.map(convertZohoLeadToCard)

          // Distribute leads based on converted status
          const call1Leads = leads.filter((lead) => !lead.converted)
          const call2Leads = leads.filter((lead) => lead.converted)

          // Update the columns with the leads
          setKanbanData((prev) => ({
            ...prev,
            "Call 1": call1Leads,
            "Call 2": call2Leads,
          }))
        } else {
          setError("No leads found")
        }
      } catch (err) {
        console.error("Error fetching leads:", err)
        setError("Error fetching leads from Zoho CRM")
      } finally {
        setLoading(false)
      }
    }

    fetchLeads()
  }, [])

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setCurrentView(null)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  const handleCardClick = (card: UserCard, event: React.MouseEvent) => {
    event.stopPropagation()
    // Navigate to chatbox with lead data
    router.push(
      `/chatbox?leadId=${card.id}&name=${encodeURIComponent(card.name)}&email=${encodeURIComponent(card.email)}&company=${encodeURIComponent(card.company || "")}`,
    )
  }

  const handleColumnClick = (columnName: string) => {
    setCurrentView(columnName)
  }

  if (currentView) {
    const config = columnConfig[currentView as keyof typeof columnConfig]
    return (
      <div
        className={`min-h-screen bg-gradient-to-br ${config.gradient} flex items-center justify-center transition-all duration-500 ease-in-out`}
      >
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4 animate-fade-in">{currentView}</h1>
          <p className="text-white/70 text-lg">Press ESC to return to the board</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-white">Sales Pipeline Board</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8">
          {Object.entries(kanbanData).map(([columnName, cards]) => {
            const config = columnConfig[columnName as keyof typeof columnConfig]
            const IconComponent = config.icon

            return (
              <div
                key={columnName}
                className="flex flex-col h-[700px] cursor-pointer transform transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl"
                onClick={() => handleColumnClick(columnName)}
              >
                <div
                  className={`bg-gradient-to-r ${config.gradient} rounded-t-xl p-4 shadow-lg border border-gray-600`}
                >
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-5 h-5" />
                      <h2 className="font-semibold text-lg">{columnName}</h2>
                    </div>
                    <Badge variant="secondary" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                      {cards.length}
                    </Badge>
                  </div>
                </div>

                <div
                  className={`flex-1 ${config.bgColor} rounded-b-xl border-2 ${config.borderColor} overflow-hidden shadow-lg`}
                >
                  <div className="h-full overflow-y-auto p-4 space-y-3 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
                    {loading && (columnName === "Call 1" || columnName === "Call 2") ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <Loader2 className="w-8 h-8 text-gray-400 animate-spin mb-2" />
                        <p className="text-gray-400">Loading leads from Zoho...</p>
                      </div>
                    ) : error && (columnName === "Call 1" || columnName === "Call 2") ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-red-400 text-center">{error}</p>
                        <p className="text-gray-400 text-center mt-2">Please check your API connection</p>
                      </div>
                    ) : cards.length === 0 ? (
                      <div className="flex flex-col items-center justify-center h-full">
                        <p className="text-gray-400 text-center">No items in this column</p>
                        {columnName === "Call 2" && (
                          <p className="text-gray-400 text-center mt-2">
                            Leads will appear here after they've been converted
                          </p>
                        )}
                      </div>
                    ) : (
                      cards.map((card) => (
                        <Card
                          key={card.id}
                          className="group hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-gray-800 border-gray-700 hover:border-gray-600 cursor-pointer"
                          onClick={(e) => handleCardClick(card, e)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-10 h-10">
                                <AvatarImage src={card.avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-gray-300 bg-gray-700">
                                  <User className="w-5 h-5" />
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-semibold text-sm text-gray-100 truncate">{card.name}</h3>
                                  {card.score !== undefined && (
                                    <div className="flex items-center gap-1">
                                      <Star className="w-3 h-3 text-yellow-400" />
                                      <span className="text-xs text-yellow-400">{card.score}</span>
                                    </div>
                                  )}
                                </div>
                                <p className="text-xs text-gray-400 truncate">{card.company}</p>
                                {card.owner && <p className="text-xs text-gray-500 truncate">Owner: {card.owner}</p>}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0 space-y-2">
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Mail className="w-3 h-3" />
                              <span className="truncate">{card.email}</span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                              <Phone className="w-3 h-3" />
                              <span>{card.phone}</span>
                            </div>
                            {card.lastActivity && (
                              <div className="flex items-center gap-2 text-xs text-gray-500">
                                <Calendar className="w-3 h-3" />
                                <span>Last: {card.lastActivity}</span>
                              </div>
                            )}
                            {card.leadSource && <div className="text-xs text-gray-500">Source: {card.leadSource}</div>}
                            <div className="flex items-center justify-between pt-2">
                              <Badge variant="outline" className={`text-xs ${priorityColors[card.priority]} border`}>
                                {card.priority}
                              </Badge>
                              <div className="flex items-center gap-1">
                                <Badge
                                  variant="secondary"
                                  className={`text-xs ${config.textColor} ${config.accentColor} border-0`}
                                >
                                  {card.status}
                                </Badge>
                                {card.responded && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-green-900/30 text-green-300 border-green-800"
                                  >
                                    Responded
                                  </Badge>
                                )}
                                {card.converted && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs bg-blue-900/30 text-blue-300 border-blue-800"
                                  >
                                    Converted
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
