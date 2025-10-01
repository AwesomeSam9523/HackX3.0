"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, MapPin, Users } from "lucide-react";
import { apiService } from "@/lib/service";
import { useToast } from "@/hooks/use-toast";
import type { QueueItem } from "@/lib/types";

interface QueueManagementProps {
  queue: QueueItem[];
  onMarkResolvedAction: (queueItemId: string) => void;
}

export function QueueManagement({
  queue,
  onMarkResolvedAction,
}: QueueManagementProps) {
  const { toast } = useToast();

  const handleMarkResolved = async (queueItemId: string) => {
    try {
      await apiService.markMentorshipResolved(queueItemId);
      onMarkResolvedAction(queueItemId);
      toast({
        title: "Success",
        description: "Mentorship session marked as resolved",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to mark session as resolved",
        variant: "destructive",
      });
    }
  };

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
        <CardDescription>
          Teams waiting for mentorship in FCFS order
        </CardDescription>
      </CardHeader>
      <CardContent>
        {queue.length === 0 ? (
          <div className="py-8 text-center">
            <Users className="mx-auto mb-4 h-12 w-12 text-slate-300" />
            <p className="text-slate-500">No teams in queue</p>
            <p className="mt-2 text-sm text-slate-400">
              Teams will appear here when they book mentorship slots
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {queue.map((queueItem, index) => (
              <Card
                key={queueItem.id}
                className={`border-l-4 ${index === 0 ? "border-l-green-500 bg-green-50" : "border-l-blue-500"}`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2 text-lg">
                        {index === 0 && <Badge variant="default">Next</Badge>}
                        {queueItem.team.name}
                      </CardTitle>
                      <CardDescription className="mt-1">
                        {queueItem.team.problemStatement.title}
                      </CardDescription>
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
                        {queueItem.team.round1Room.block}-{" "}
                        {queueItem.team.round1Room.name}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        Waiting
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleMarkResolved(queueItem.id)}
                      className="flex items-center gap-2"
                    >
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
  );
}
