"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Megaphone, Clock } from "lucide-react"
import type { Announcement } from "@/lib/types"

interface AnnouncementsTabProps {
  announcements: Announcement[]
}

export function AnnouncementsTab({ announcements }: AnnouncementsTabProps) {
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
            <Card key={announcement.id} className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Megaphone className="h-5 w-5" />
                    {announcement.title}
                  </CardTitle>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {announcement.time}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <p className="text-slate-600">{announcement.message}</p>
                <p className="text-xs text-slate-400 mt-2">{announcement.timestamp}</p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Megaphone className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No announcements yet</p>
              <p className="text-sm text-slate-400 mt-2">Check back later for updates</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
