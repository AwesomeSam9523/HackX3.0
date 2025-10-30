"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Clock, RefreshCw, Users } from "lucide-react";
import { GoogleMeetLink } from "./google-meet-link";
import type { Mentor, QueueItem } from "@/lib/types";

interface MentorInfoTabProps {
  mentorInfo: Mentor;
  queue: QueueItem[];
  onRefreshAction: () => void;
}

export function MentorInfoTab({
  mentorInfo,
  queue,
  onRefreshAction,
}: MentorInfoTabProps) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Mentor Info
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <Label className="text-sm font-medium">ID</Label>
              <p className="text-lg">{mentorInfo.user.username}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Domain</Label>
              <p className="text-lg">{mentorInfo.domains.join(", ")}</p>
            </div>
            <div>
              <Label className="text-sm font-medium">Mode</Label>
              <Badge
                variant={mentorInfo.mode === "ONLINE" ? "default" : "secondary"}
              >
                {mentorInfo.mode}
              </Badge>
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
                {queue.filter((q) => q.status === "WAITING").length}/5
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
            <p className="mb-2 text-sm text-slate-600">
              Queue updates every 10 seconds automatically
            </p>
            <button
              onClick={onRefreshAction}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Now
            </button>
          </CardContent>
        </Card>
      </div>

      {mentorInfo.mode === "ONLINE" && <GoogleMeetLink />}
    </div>
  );
}
