"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, Megaphone } from "lucide-react";
import type { Announcement } from "@/lib/types";
import { useEffect } from "react";

interface AnnouncementsTabProps {
  announcements: Announcement[];
  refreshAnnouncementAction: () => void;
}

function ago(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const seconds = Math.floor((now - date) / 1000);

  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1,
  };

  for (const [unit, value] of Object.entries(intervals)) {
    const amount = Math.floor(seconds / value);
    if (amount >= 1) {
      return amount === 1 ? `${amount} ${unit} ago` : `${amount} ${unit}s ago`;
    }
  }
  return "Just Now";
}

export function AnnouncementsTab({
  announcements,
  refreshAnnouncementAction,
}: AnnouncementsTabProps) {
  useEffect(() => {
    const interval = setInterval(refreshAnnouncementAction, 30000);
    return () => clearInterval(interval);
  }, [refreshAnnouncementAction]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Announcements</h2>
        <Badge variant="outline" className="bg-blue-50">
          {announcements.length} total
        </Badge>
      </div>

      <div className="space-y-4">
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <Card
              key={announcement.id}
              className="border-l-4 border-l-blue-500"
            >
              <CardHeader className="pb-0">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Megaphone className="h-5 w-5" />
                    {announcement.title}
                  </CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {ago(announcement.createdAt)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600">{announcement.message}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="py-8 text-center">
              <Megaphone className="mx-auto mb-4 h-12 w-12 text-slate-300" />
              <p className="text-slate-500">No announcements yet</p>
              <p className="mt-2 text-sm text-slate-400">
                Check back later for updates
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
