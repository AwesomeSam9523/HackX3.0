"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OverviewTab } from "@/components/participant/overview-tab"
import { ProblemStatements } from "@/components/participant/problem-statements"
import { Mentorship } from "@/components/participant/mentorship"
import { AnnouncementsTab } from "@/components/participant/announcements-tab"
import { SubmissionsTab } from "@/components/participant/submissions-tab"
import { BookmarksTab } from "@/components/participant/bookmarks-tab"
import { authService } from "@/lib/auth"
import { apiService } from "@/lib/service"
import type { Team, Domain, Mentor, Announcement, ProblemStatement } from "@/lib/types"

export default function ParticipantDashboard() {
  const [passwordChanged, setPasswordChanged] = useState(false)
  const [selectedPS, setSelectedPS] = useState<string | null>(null)
  const [bookmarkedPS, setBookmarkedPS] = useState<string[]>([])
  const [selectedMentor, setSelectedMentor] = useState<string | null>(null)
  const [psLocked, setPsLocked] = useState(false)
  const [round2Selected, setRound2Selected] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  const [team, setTeam] = useState<Team | null>(null)
  const [domains, setDomains] = useState<Domain[]>([])
  const [mentors, setMentors] = useState<Mentor[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [submissions, setSubmissions] = useState<any[]>([])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (passwordChanged) {
      loadData()
    }
  }, [passwordChanged])

  const loadData = async () => {
    try {
      const user = authService.getUser()
      if (user?.teamId) {
        const teamData = await apiService.getTeam(user.teamId)
        setTeam(teamData)
      }

      const [domainsData, mentorsData, bookmarks, announcementsData] = await Promise.all([
        apiService.getDomains(),
        apiService.getMentors(),
        apiService.getBookmarkedPS(),
        apiService.getAnnouncements(),
      ])

      setDomains(domainsData)
      setMentors(mentorsData)
      setBookmarkedPS(bookmarks)
      setAnnouncements(announcementsData)
    } catch (error) {
      console.error("Failed to load data:", error)
    }
  }

  const handleBookmark = (psId: string) => {
    setBookmarkedPS((prev) => (prev.includes(psId) ? prev.filter((id) => id !== psId) : [...prev, psId]))
  }

  const handleSubmissionUpdate = () => {
    // Reload submissions data
    loadData()
  }

  // Get all problem statements for bookmarks tab
  const allProblemStatements: ProblemStatement[] = domains.flatMap((domain) => domain.problemStatements)

  // if (!passwordChanged) {
  //   return <PasswordChangeForm onPasswordChanged={() => setPasswordChanged(true)} />
  // }

  if (!team) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-sm sm:text-base text-slate-600">Loading team data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Participant Dashboard</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">Welcome back, {team.teamName}!</p>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs sm:text-sm text-slate-500">Current Time</p>
            <p className="text-base sm:text-lg font-mono">{currentTime.toLocaleTimeString()}</p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-max sm:w-full grid-cols-6 min-w-[600px] sm:min-w-0">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger value="problem-statements" className="text-xs sm:text-sm">
                Problem Statements
              </TabsTrigger>
              <TabsTrigger value="mentorship" className="text-xs sm:text-sm">
                Mentorship
              </TabsTrigger>
              <TabsTrigger value="announcements" className="text-xs sm:text-sm">
                Announcements
              </TabsTrigger>
              <TabsTrigger value="submissions" className="text-xs sm:text-sm">
                Submissions
              </TabsTrigger>
              <TabsTrigger value="bookmarks" className="text-xs sm:text-sm">
                Bookmarks
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="overview">
            <OverviewTab
              team={team}
              selectedPS={selectedPS}
              selectedMentor={selectedMentor}
              psLocked={psLocked}
              round2Selected={round2Selected}
            />
          </TabsContent>

          <TabsContent value="problem-statements">
            <ProblemStatements
              domains={domains}
              selectedPS={selectedPS}
              bookmarkedPS={bookmarkedPS}
              psLocked={psLocked}
              onSelectPS={setSelectedPS}
              onBookmark={handleBookmark}
            />
          </TabsContent>

          <TabsContent value="mentorship">
            <Mentorship mentors={mentors} selectedMentor={selectedMentor} onSelectMentor={setSelectedMentor} />
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsTab announcements={announcements} />
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionsTab teamId={team.id} submissions={submissions} onSubmissionUpdate={handleSubmissionUpdate} />
          </TabsContent>

          <TabsContent value="bookmarks">
            <BookmarksTab
              bookmarkedPS={bookmarkedPS}
              allProblemStatements={allProblemStatements}
              onBookmarkUpdate={handleBookmark}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
