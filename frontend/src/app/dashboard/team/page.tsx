"use client";

import { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { OverviewTab } from "@/components/participant/overview-tab";
import { ProblemStatements } from "@/components/participant/problem-statements";
import { Mentorship } from "@/components/participant/mentorship";
import { AnnouncementsTab } from "@/components/participant/announcements-tab";
import { SubmissionsTab } from "@/components/participant/submissions-tab";
import { BookmarksTab } from "@/components/participant/bookmarks-tab";
import { apiService } from "@/lib/service";
import type {
  Announcement,
  Domain,
  Mentor,
  MentorshipSession,
  ProblemStatement,
  Submission,
  Team,
} from "@/lib/types";

export default function TeamDashboard() {
  const [passwordChanged, setPasswordChanged] = useState(true);
  const [selectedPS, setSelectedPS] = useState<ProblemStatement | null>(null);
  const [bookmarkedPS, setBookmarkedPS] = useState<ProblemStatement[]>([]);
  const [selectedMentor, setSelectedMentor] =
    useState<MentorshipSession | null>(null);
  const [psLocked, setPsLocked] = useState(false);
  const [mentorshipLocked, setMentorshipLocked] = useState(false);
  const [round1Locked, setRound1Locked] = useState(false);
  const [round2Selected, setRound2Selected] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [team, setTeam] = useState<Team | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [notDonePreviousMentorship, setNotDonePreviousMentorship] =
    useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    // TODO remove later
    setPasswordChanged(true);
    setRound2Selected(false);
    if (passwordChanged) {
      loadData();
    }
  }, [passwordChanged]);

  const loadData = async () => {
    try {
      const user = await apiService.getAuthProfile();
      if (user?.teamId) {
        const teamData = await apiService.getMyTeam();
        setTeam(teamData);
      }

      const [
        domainsData,
        mentorsData,
        bookmarks,
        announcementsData,
        selectedPsData,
        lockedData,
        selectedMentorData,
        submissionsData,
        notDonePreviousMentorshipData,
      ] = await Promise.all([
        apiService.getDomains(),
        apiService.getMentors(),
        apiService.getBookmarkedPS(),
        apiService.getAnnouncements(),
        apiService.getSelectedProblemStatement(),
        apiService.getLockedOverview(),
        apiService.getSelectedMentor(),
        apiService.getTeamSubmission(),
        apiService.getTeamPreviousMentorshipStatus(),
      ]);

      setDomains(domainsData);
      setMentors(mentorsData);
      setBookmarkedPS(bookmarks);
      setAnnouncements(announcementsData);
      setSelectedPS(selectedPsData);
      setPsLocked(lockedData.problem_statements_locked === "true");
      setMentorshipLocked(lockedData.mentorship_locked === "true");
      setRound1Locked(lockedData.round1_locked === "true");
      setSelectedMentor(selectedMentorData);
      setSubmissions(submissionsData);
      setNotDonePreviousMentorship(notDonePreviousMentorshipData);
    } catch (error) {
      console.error("Failed to load data:", error);
    }
  };

  const handleBookmark = async (psId: string) => {
    await apiService.bookmarkProblemStatement(psId);
    const updatedBookmarks = await apiService.getBookmarkedPS();
    setBookmarkedPS(updatedBookmarks);
  };

  const handleSubmissionUpdate = () => {
    apiService.getTeamSubmission().then(setSubmissions);
  };

  const refreshDomains = () => {
    apiService.getDomains().then(setDomains);
  };

  const refreshMentors = () => {
    apiService.getMentors().then(setMentors);
  };

  const refreshAnnouncements = () => {
    apiService.getAnnouncements().then(setAnnouncements);
  };

  // if (!passwordChanged) {
  //   return <PasswordChangeForm onPasswordChanged={() => setPasswordChanged(true)} />
  // }

  if (!team) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 p-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600 sm:h-12 sm:w-12"></div>
          <p className="text-sm text-slate-600 sm:text-base">
            Loading team data...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col space-y-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome, {team.name}!
            </h1>
          </div>
          <div className="text-left sm:text-right">
            <p className="text-xs text-slate-500 sm:text-sm">Current Time</p>
            <p className="font-mono text-base sm:text-lg">
              {currentTime.toLocaleTimeString()}
            </p>
          </div>
        </div>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <div className="overflow-x-auto">
            <TabsList className="grid w-max min-w-[600px] grid-cols-6 sm:w-full sm:min-w-0">
              <TabsTrigger value="overview" className="text-xs sm:text-sm">
                Overview
              </TabsTrigger>
              <TabsTrigger
                value="problem-statements"
                className="text-xs sm:text-sm"
              >
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
              mentorshipLocked={mentorshipLocked}
              round2Selected={round2Selected}
              round1Locked={round1Locked}
              submissions={submissions}
            />
          </TabsContent>

          <TabsContent value="problem-statements">
            <ProblemStatements
              domains={domains}
              selectedPS={selectedPS}
              bookmarkedPS={bookmarkedPS}
              psLocked={psLocked}
              onSelectPSAction={setSelectedPS}
              onBookmarkAction={handleBookmark}
              refreshDomainsAction={refreshDomains}
            />
          </TabsContent>

          <TabsContent value="mentorship">
            {mentorshipLocked && !selectedMentor ? (
              <div className="w-full text-center">
                Mentorship sessions are currently locked. Please check back
                later.
              </div>
            ) : notDonePreviousMentorship ? (
              <Mentorship
                mentors={mentors}
                mentorshipSession={selectedMentor}
                onSelectMentorAction={setSelectedMentor}
                refreshMentorsAction={refreshMentors}
              />
            ) : (
              <div className="w-full text-center">
                You have already completed your mentorship session.
              </div>
            )}
          </TabsContent>

          <TabsContent value="announcements">
            <AnnouncementsTab
              announcements={announcements}
              refreshAnnouncementAction={refreshAnnouncements}
            />
          </TabsContent>

          <TabsContent value="submissions">
            <SubmissionsTab
              submissions={submissions}
              round1Locked={round1Locked}
              onSubmissionUpdateAction={handleSubmissionUpdate}
            />
          </TabsContent>

          <TabsContent value="bookmarks">
            <BookmarksTab
              bookmarkedPS={bookmarkedPS}
              onBookmarkUpdateAction={handleBookmark}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
