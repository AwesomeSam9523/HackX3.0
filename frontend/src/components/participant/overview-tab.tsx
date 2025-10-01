"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, MapPin, Trophy, Users } from "lucide-react";
import type {
  MentorshipSession,
  ProblemStatement,
  Submission,
  Team,
} from "@/lib/types";

interface OverviewTabProps {
  team: Team;
  selectedPS: ProblemStatement | null;
  selectedMentor: MentorshipSession | null;
  psLocked: boolean;
  mentorshipLocked: boolean;
  round2Selected: boolean;
  round1Locked: boolean;
  submissions: Submission[];
}

export function OverviewTab({
  team,
  selectedPS,
  selectedMentor,
  psLocked,
  round1Locked,
  submissions,
  mentorshipLocked,
  round2Selected,
}: OverviewTabProps) {
  return (
    <div className="space-y-6">
      {round2Selected && (
        <Alert className="border-green-200 bg-green-50">
          <Trophy className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Congratulations!</strong> You have been selected for Round
            2. Report to Room AB2-301 at 3:00 PM.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
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
              <p className="flex items-center gap-2 text-lg">
                <MapPin className="h-4 w-4" />
                {team.round1Room.block} {team.round1Room.name}
              </p>
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
              <Badge variant={selectedPS ? "default" : "secondary"}>
                {selectedPS?.title ? "Selected" : "Not Selected"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Mentor Booking</span>
              <Badge
                variant={
                  selectedMentor
                    ? "default"
                    : mentorshipLocked
                      ? "destructive"
                      : "secondary"
                }
              >
                {selectedMentor
                  ? "Booked"
                  : mentorshipLocked
                    ? "Locked"
                    : "Available"}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Round 1 Submission</span>
              <Badge
                variant={
                  round1Locked
                    ? "destructive"
                    : submissions.length > 0
                      ? "default"
                      : "secondary"
                }
              >
                {round1Locked
                  ? "Locked"
                  : submissions.length > 0
                    ? "Submitted"
                    : "Available"}
              </Badge>
            </div>
            {psLocked && (
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  Problem statement selection is now locked.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
