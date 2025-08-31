"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, MapPin, Clock, Trophy } from "lucide-react"
import type { Team } from "@/lib/types"

interface OverviewTabProps {
  team: Team
  selectedPS: string | null
  selectedMentor: string | null
  psLocked: boolean
  round2Selected: boolean
}

export function OverviewTab({ team, selectedPS, selectedMentor, psLocked, round2Selected }: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {round2Selected && (
        <Alert className="border-green-200 bg-green-50">
          <Trophy className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Congratulations!</strong> You have been selected for Round 2. Report to Room AB2-301 at 3:00 PM.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Team Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Team Name</Label>
              <p className="text-lg">{team.name}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Room Number</Label>
              <p className="text-lg flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {team.roomNumber}
              </p>
            </div>
            <div>
              <Label className="text-sm font-medium">Team Members</Label>
              <ul className="mt-2 space-y-1">
                {team.members?.map((member, index) => (
                  <li key={index} className="text-sm text-slate-600">
                    {member}
                  </li>
                )) || <li className="text-sm text-slate-500">No members listed</li>}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Problem Statement</span>
              <Badge variant={selectedPS ? "default" : "secondary"}>{selectedPS ? "Selected" : "Not Selected"}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Mentor Booking</span>
              <Badge variant={selectedMentor ? "default" : "secondary"}>
                {selectedMentor ? "Booked" : "Available"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Round 1 Submission</span>
              <Badge variant="secondary">Pending</Badge>
            </div>
            {psLocked && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>Problem statement selection is now locked.</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
