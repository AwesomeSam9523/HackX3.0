"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, Video } from "lucide-react"
import { MentorInfoTab } from "@/components/mentor/mentor-info-tab"
import { QueueManagement } from "@/components/mentor/queue-management"
import { authService } from "@/lib/auth"
import { apiService } from "@/lib/service"
import type { QueueItem, Mentor } from "@/lib/types"

export default function MentorDashboard() {
  const [passwordChanged, setPasswordChanged] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [mentorInfo, setMentorInfo] = useState<Mentor | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (passwordChanged) {
      loadData()
      // Auto-refresh queue every 10 seconds
      const refreshTimer = setInterval(loadQueue, 10000)
      return () => clearInterval(refreshTimer)
    }
  }, [passwordChanged])

  const loadData = async () => {
    try {
      throw 'aryan';
      const user = authService.getUser()
      if (user?.sub) {
        // Load mentor info and queue
        const [mentorData, queueData] = await Promise.all([
          apiService.getMentorInfo(user.sub),
          apiService.getMentorQueue(user.sub),
        ])
        setMentorInfo(mentorData)
        setQueue(queueData)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
      // Fallback to mock data for development
      setMentorInfo({
        id: "m1",
        name: "Dr. Sarah Chen",
        domain: "AI/ML",
        mode: "Online",
        queueCount: 0,
        maxCapacity: 5,
        status: "Active",
      })
    }
  }

  const loadQueue = async () => {
    try {
      const user = authService.getUser()
      if (user?.sub) {
        const queueData = await apiService.getMentorQueue(user.sub)
        setQueue(queueData)
      }
    } catch (error) {
      console.error("Failed to load queue:", error)
    }
  }

  const handleMarkResolved = (queueItemId: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== queueItemId))
  }

  // if (!passwordChanged) {
  //   return <PasswordChangeForm onPasswordChanged={() => setPasswordChanged(true)} />
  // }

  if (!mentorInfo) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-slate-600">Loading mentor data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Mentor Dashboard</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">Welcome, {mentorInfo.name}</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm text-slate-500">Current Time</p>
            <p className="text-base sm:text-lg font-mono">{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview" className="text-sm sm:text-base">
              Overview
            </TabsTrigger>
            <TabsTrigger value="queue" className="text-sm sm:text-base">
              Queue Management
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <MentorInfoTab mentorInfo={mentorInfo} queue={queue} onRefresh={loadQueue} />
          </TabsContent>

          <TabsContent value="queue">
            <QueueManagement queue={queue} onMarkResolved={handleMarkResolved} />
          </TabsContent>
        </Tabs>

        {/* Mode-specific alerts */}
        {mentorInfo.mode === "Offline" && (
          <Alert className="mt-4 sm:mt-6">
            <MapPin className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Offline Mentoring:</strong> Please visit the team rooms in the order shown above. Click &#34;Mark as
              Resolved&#34; after completing each mentoring session.
            </AlertDescription>
          </Alert>
        )}

        {mentorInfo.mode === "Online" && (
          <Alert className="mt-4 sm:mt-6" variant={"default"}>
            <Video className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Online Mentoring:</strong> The assigned CC will notify teams via WhatsApp group. Teams will join
              your Google Meet link for mentoring sessions.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}
