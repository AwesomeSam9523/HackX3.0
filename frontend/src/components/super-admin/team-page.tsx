"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Filter, Eye, CheckCircle, Clock, Github, FileText, Trophy } from "lucide-react"
import type { Team, Judge } from "@/lib/types"

interface TeamPageProps {
  teams: Team[]
  judges: Judge[]
}

export function TeamPage({ teams, judges }: TeamPageProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null)
  const [isTeamDialogOpen, setIsTeamDialogOpen] = useState(false)

  // Filter teams based on search and filters
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesSearch = team.teamName.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = statusFilter === "all" || team.judgementStatus === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [teams, searchTerm, statusFilter])

  const getJudgeName = (teamId: string) => {
    if (!judges || judges.length === 0) {
      return "Not Assigned"
    }
    // Mock logic to find judge assigned to team
    const judgeIndex = teams.findIndex((t) => t.id === teamId) % judges.length
    return judges[judgeIndex]?.name || "Not Assigned"
  }

  const getTeamScore = (teamId: string) => {
    // Mock scoring logic
    const scores = { t1: 8.5, t2: 7.8, t3: 9.2, t4: 6.9 }
    return scores[teamId as keyof typeof scores] || 0
  }

  const getJudgingTime = (teamId: string) => {
    // Mock judging time
    const times = { t1: "14:30", t2: "15:15", t3: "16:00", t4: "Not judged" }
    return times[teamId as keyof typeof times] || "Not judged"
  }

  const viewTeamDetails = (team: Team) => {
    setSelectedTeam(team)
    setIsTeamDialogOpen(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setStatusFilter("all")
  }

  if (!teams || !judges) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <p className="text-center text-slate-500">Loading team data...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team Management</h2>
          <p className="text-slate-600">View team status, scores, submissions, and judging details</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
          <CardDescription>Filter teams by name or status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Search Teams</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by team name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Actions</Label>
              <Button variant="outline" onClick={clearFilters} className="w-full bg-transparent">
                Clear Filters
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Badge variant="outline">Showing {filteredTeams.length} teams</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Teams List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            All Teams
          </CardTitle>
          <CardDescription>Complete team overview with scores and submission status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredTeams.map((team) => {
              const score = getTeamScore(team.id)
              const judgingTime = getJudgingTime(team.id)
              const judgeName = getJudgeName(team.id)
              const isJudged = team.judgementStatus === "Completed"

              return (
                <Card key={team.id} className={`border-l-4 ${isJudged ? "border-l-green-500" : "border-l-orange-500"}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {team.teamName}
                          {isJudged ? (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Judged
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          PS: {team.problemStatement} • Room: {team.roomNumber}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            team.submissionStatus === "submitted"
                              ? "default"
                              : team.submissionStatus === "partial"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {team.submissionStatus === "submitted"
                            ? "Submitted"
                            : team.submissionStatus === "partial"
                              ? "Partial"
                              : "Not Submitted"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Team Stats */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-600">{isJudged ? score : "N/A"}</div>
                          <p className="text-xs text-slate-500">Score</p>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{judgeName}</div>
                          <p className="text-xs text-slate-500">Judge</p>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{judgingTime}</div>
                          <p className="text-xs text-slate-500">Judged At</p>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-medium">{team.round2Status || "Not Selected"}</div>
                          <p className="text-xs text-slate-500">Round 2</p>
                        </div>
                      </div>

                      {/* Submission Links */}
                      <div className="flex gap-2">
                        {team.githubLink ? (
                          <Button size="sm" variant="outline" onClick={() => window.open(team.githubLink, "_blank")}>
                            <Github className="h-4 w-4 mr-2" />
                            GitHub
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            <Github className="h-4 w-4 mr-2" />
                            No GitHub
                          </Button>
                        )}

                        {team.presentationLink ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(team.presentationLink, "_blank")}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Presentation
                          </Button>
                        ) : (
                          <Button size="sm" variant="outline" disabled>
                            <FileText className="h-4 w-4 mr-2" />
                            No Presentation
                          </Button>
                        )}

                        <Button size="sm" variant="outline" onClick={() => viewTeamDetails(team)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Team Details Dialog */}
      <Dialog open={isTeamDialogOpen} onOpenChange={setIsTeamDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Team Details: {selectedTeam?.teamName}</DialogTitle>
            <DialogDescription>Complete team information and evaluation details</DialogDescription>
          </DialogHeader>
          {selectedTeam && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Team Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Team Name:</Label>
                      <p>{selectedTeam.teamName}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Problem Statement:</Label>
                      <p>{selectedTeam.problemStatement}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Room Number:</Label>
                      <p>{selectedTeam.roomNumber}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Team Members:</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedTeam.members?.map((member, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {member}
                          </Badge>
                        )) || <span className="text-sm text-slate-500">No members listed</span>}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Evaluation Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div>
                      <Label className="text-sm font-medium">Judge:</Label>
                      <p>{getJudgeName(selectedTeam.id)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Score:</Label>
                      <p className="text-2xl font-bold text-blue-600">
                        {selectedTeam.judgementStatus === "Completed" ? getTeamScore(selectedTeam.id) : "Not judged"}
                        /10
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Judging Time:</Label>
                      <p>{getJudgingTime(selectedTeam.id)}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Round 2 Status:</Label>
                      <Badge variant={selectedTeam.round2Status === "Selected" ? "default" : "secondary"}>
                        {selectedTeam.round2Status || "Not Selected"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Submissions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span>GitHub Repository:</span>
                      {selectedTeam.githubLink ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(selectedTeam.githubLink!, "_blank")}
                        >
                          <Github className="h-4 w-4 mr-2" />
                          View Repository
                        </Button>
                      ) : (
                        <Badge variant="destructive">Not Submitted</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Presentation:</span>
                      {selectedTeam.presentationLink ? (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => window.open(selectedTeam.presentationLink!, "_blank")}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Presentation
                        </Button>
                      ) : (
                        <Badge variant="destructive">Not Submitted</Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Overall Status:</span>
                      <Badge
                        variant={
                          selectedTeam.submissionStatus === "submitted"
                            ? "default"
                            : selectedTeam.submissionStatus === "partial"
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {selectedTeam.submissionStatus === "submitted"
                          ? "Complete"
                          : selectedTeam.submissionStatus === "partial"
                            ? "Partial"
                            : "Not Submitted"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Teams</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{teams.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Teams Judged</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {teams.filter((t) => t.judgementStatus === "Completed").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Submissions Complete</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {teams.filter((t) => t.submissionStatus === "submitted").length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Round 2 Selected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {teams.filter((t) => t.round2Status === "Selected").length}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
