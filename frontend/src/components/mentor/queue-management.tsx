"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Users, Clock, MapPin, CheckCircle } from "lucide-react"
import { apiService } from "@/lib/service"
import { useToast } from "@/hooks/use-toast"
import type { QueueItem } from "@/lib/types"

interface QueueManagementProps {
  queue: QueueItem[]
  onMarkResolved: (queueItemId: string) => void
}

export function QueueManagement({ queue, onMarkResolved }: QueueManagementProps) {
  const { toast } = useToast()

  const handleMarkResolved = async (queueItemId: string) => {
    try {
      await apiService.markMentorshipResolved(queueItemId)
      onMarkResolved(queueItemId)
      toast({
        title: "Success",
        description: "Mentorship session marked as resolved",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to mark session as resolved",
        variant: "destructive",
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Current Queue
          </CardTitle>
          <Badge variant="outline">Updates every 10s</Badge>
        </div>
        <CardDescription>Teams waiting for mentorship in FCFS order</CardDescription>
      </CardHeader>
      <CardContent>
        {queue.length === 0 ? (
          <div className="text-center py-8">
            <Users className="h-12 w-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">No teams in queue</p>
            <p className="text-sm text-slate-400 mt-2">Teams will appear here when they book mentorship slots</p>
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map((team, index) => (
              <Card
                key={team.id}
                className={`border-l-4 ${index === 0 ? "border-l-green-500 bg-green-50" : "border-l-blue-500"}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center gap-2">
                        {index === 0 && <Badge variant="default">Next</Badge>}
                        {team.teamName}
                      </CardTitle>
                      <CardDescription className="mt-1">{team.problemStatement}</CardDescription>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">#{index + 1}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {team.roomNumber}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Waiting {team.waitTime}
                      </span>
                    </div>
                    <Button size="sm" onClick={() => handleMarkResolved(team.id)} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4" />
                      Mark as Resolved
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
