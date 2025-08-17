"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, RefreshCw } from "lucide-react"
import { GoogleMeetLink } from "./google-meet-link"
import type { Mentor, QueueItem } from "@/lib/types"

interface MentorInfoTabProps {
  mentorInfo: Mentor
  queue: QueueItem[]
  onRefresh: () => void
}

export function MentorInfoTab({ mentorInfo, queue, onRefresh }: MentorInfoTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mentor Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-sm font-medium">Name</Label>
              <p className="text-lg">{mentorInfo.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Domain</Label>
              <p className="text-lg">{mentorInfo.domain}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Mode</Label>
              <Badge variant={mentorInfo.mode === "Online" ? "default" : "secondary"}>{mentorInfo.mode}</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Queue Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {queue.length}/{mentorInfo.maxCapacity}
              </div>
              <p className="text-sm text-slate-500">Teams in queue</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Auto Refresh
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600 mb-2">Queue updates every 10 seconds automatically</p>
            <button onClick={onRefresh} className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800">
              <RefreshCw className="h-4 w-4" />
              Refresh Now
            </button>
          </CardContent>
        </Card>
      </div>

      {mentorInfo.mode === "Online" && <GoogleMeetLink />}
    </div>
  )
}
