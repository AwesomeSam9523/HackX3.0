"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Video } from "lucide-react";
import { MentorInfoTab } from "@/components/mentor/mentor-info-tab";
import { QueueManagement } from "@/components/mentor/queue-management";
import { apiService } from "@/lib/service";
import type { Mentor, QueueItem } from "@/lib/types";

export default function MentorDashboard() {
  const [passwordChanged, setPasswordChanged] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [mentorInfo, setMentorInfo] = useState<Mentor | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    setPasswordChanged(true); // TODO: Remove this line after implementing password change feature
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (passwordChanged) {
      loadData();
      // Auto-refresh queue every 10 seconds
      loadQueue();
      const refreshTimer = setInterval(loadQueue, 10000);
      return () => clearInterval(refreshTimer);
    }
  }, [passwordChanged]);

  const loadData = async () => {
    try {
      const profile = (await apiService.getProfile()) as Mentor;
      setMentorInfo(profile);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const loadQueue = async () => {
    try {
      apiService.getMyQueue().then(setQueue);
    } catch (error) {
      console.error("Failed to load queue:", error);
    }
  };

  const handleMarkResolved = (queueItemId: string) => {
    setQueue((prev) => prev.filter((item) => item.id !== queueItemId));
  };

  // if (!passwordChanged) {
  //   return <PasswordChangeForm onPasswordChanged={() => setPasswordChanged(true)} />
  // }

  if (!mentorInfo) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 sm:h-12 sm:w-12"></div>
          <p className="text-sm text-slate-600 sm:text-base">
            Loading mentor data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex flex-col space-y-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome, {mentorInfo.name}
            </h1>
            <p className="mt-1 text-sm text-slate-600 sm:text-base">
              MUJ HackX 3.0
            </p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-slate-500 sm:text-sm">Current Time</p>
            <p className="font-mono text-base sm:text-lg">
              {currentTime.toLocaleTimeString()}
            </p>
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
            <MentorInfoTab
              mentorInfo={mentorInfo}
              queue={queue}
              onRefreshAction={loadQueue}
            />
          </TabsContent>

          <TabsContent value="queue">
            <QueueManagement
              queue={queue}
              onMarkResolvedAction={handleMarkResolved}
            />
          </TabsContent>
        </Tabs>

        {/* Mode-specific alerts */}
        {mentorInfo.mode === "IN_PERSON" && (
          <Alert className="mt-4 sm:mt-6">
            <MapPin className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Offline Mentoring:</strong> Please visit the team rooms in
              the order shown above. Click &#34;Mark as Resolved&#34; after
              completing each mentoring session.
            </AlertDescription>
          </Alert>
        )}

        {mentorInfo.mode === "ONLINE" && (
          <Alert className="mt-4 sm:mt-6" variant={"default"}>
            <Video className="h-4 w-4" />
            <AlertDescription className="text-sm">
              <strong>Online Mentoring:</strong> The assigned CC will notify
              teams via WhatsApp group. Teams will join your Google Meet link
              for mentoring sessions.
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  );
}
