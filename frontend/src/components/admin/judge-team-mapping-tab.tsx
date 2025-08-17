"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MapPin, Search, Filter, Eye, CheckCircle, Clock } from "lucide-react"
import { apiService } from "@/lib/service"
import { useToast } from "@/hooks/use-toast"
import type { Team, Judge, TeamJudgeMappingType } from "@/lib/types"

interface JudgeTeamMappingTabProps {
  teams: Team[]
  judges: Judge[]
}

export function JudgeTeamMappingTab({ teams, judges }: JudgeTeamMappingTabProps) {
  const [mappings, setMappings] = useState<TeamJudgeMappingType[]>([])
  const [evaluatedTeams, setEvaluatedTeams] = useState<string[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFloor, setSelectedFloor] = useState<string>("all")
  const [selectedJudge, setSelectedJudge] = useState<string>("all")
  const [selectedJudgeTeams, setSelectedJudgeTeams] = useState<Team[]>([])
  const [isTeamsDialogOpen, setIsTeamsDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadMappings()
    loadEvaluatedTeams()
  }, [])

  const loadMappings = async () => {
    try {
      const data = await apiService.getTeamJudgeMappings()
      setMappings(data)
    } catch (error) {
      console.error("Failed to load mappings:", error)
    }
  }

  const loadEvaluatedTeams = async () => {
    try {
      const scores = await apiService.getTeamScores()
      setEvaluatedTeams(scores.map((score) => score.teamId))
    } catch (error) {
      console.error("Failed to load evaluated teams:", error)
    }
  }

  // Get unique floors for filtering
  const uniqueFloors = useMemo(() => {
    const floorSet = new Set(judges.map((judge) => judge.floor))
    return Array.from(floorSet).sort()
  }, [judges])

  // Filter judges based on search and filters
  const filteredJudges = useMemo(() => {
    return judges.filter((judge) => {
      const matchesSearch = judge.name.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFloor = selectedFloor === "all" || judge.floor === selectedFloor
      const matchesJudge = selectedJudge === "all" || judge.id === selectedJudge

      return matchesSearch && matchesFloor && matchesJudge
    })
  }, [judges, searchTerm, selectedFloor, selectedJudge])

  const getJudgeStats = (judgeId: string) => {
    const assignedTeams = mappings.filter((m) => m.judgeId === judgeId)
    const evaluatedCount = assignedTeams.filter((m) => evaluatedTeams.includes(m.teamId)).length
    return {
      assigned: assignedTeams.length,
      evaluated: evaluatedCount,
    }
  }

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.teamName || "Unknown Team"
  }

  const getTeamDetails = (teamId: string) => {
    return teams.find((t) => t.id === teamId)
  }

  const viewJudgeTeams = (judgeId: string) => {
    const judgeTeamMappings = mappings.filter((m) => m.judgeId === judgeId)
    const judgeTeams = judgeTeamMappings
      .map((mapping) => getTeamDetails(mapping.teamId))
      .filter((team): team is Team => team !== undefined)

    setSelectedJudgeTeams(judgeTeams)
    setIsTeamsDialogOpen(true)
  }

  const clearFilters = () => {
    setSearchTerm("")
    setSelectedFloor("all")
    setSelectedJudge("all")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Judge-Team Mapping Overview</h2>
          <p className="text-slate-600">View team assignments and evaluation progress</p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
          <CardDescription>Filter judges by name, floor, or specific judge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-row w-full gap-4">
            <div className="space-y-2 w-full">
              <Label>Search Judges</Label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by judge name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-full"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Floor</Label>
              <Select value={selectedFloor} onValueChange={setSelectedFloor}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Floors</SelectItem>
                  {uniqueFloors.map((floor) => (
                    <SelectItem key={floor} value={floor}>
                      {floor}
                    </SelectItem>
                  ))}
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
            <Badge variant="secondary">Showing {filteredJudges.length} judges</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Judges Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Judge Assignment Overview
          </CardTitle>
          <CardDescription>View team assignments and evaluation progress for each judge</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredJudges.map((judge) => {
              const stats = getJudgeStats(judge.id)
              const assignedTeams = mappings.filter((m) => m.judgeId === judge.id)

              return (
                <Card key={judge.id} className="border-l-4 border-l-hackx">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{judge.name}</CardTitle>
                        <CardDescription>{judge.floor}</CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{stats.assigned} teams assigned</Badge>
                        <Badge variant={stats.evaluated === stats.assigned ? "default" : "secondary"}>
                          {stats.evaluated}/{stats.assigned} evaluated
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Progress Bar */}
                      <div>
                        <div className="flex items-center justify-between text-sm mb-1">
                          <span>Evaluation Progress</span>
                          <span>{stats.assigned > 0 ? Math.round((stats.evaluated / stats.assigned) * 100) : 0}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className="bg-green-500 h-2 rounded-full"
                            style={{
                              width: stats.assigned > 0 ? `${(stats.evaluated / stats.assigned) * 100}%` : "0%",
                            }}
                          />
                        </div>
                      </div>

                      {/* Quick Team Preview */}
                      {assignedTeams.length > 0 && (
                        <div>
                          <Label className="text-sm text-slate-600">Assigned Teams (Preview):</Label>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {assignedTeams.slice(0, 3).map((mapping) => {
                              const isEvaluated = evaluatedTeams.includes(mapping.teamId)
                              return (
                                <Badge
                                  key={mapping.teamId}
                                  variant={isEvaluated ? "default" : "secondary"}
                                  className="text-xs"
                                >
                                  {isEvaluated ? (
                                    <CheckCircle className="h-3 w-3 mr-1" />
                                  ) : (
                                    <Clock className="h-3 w-3 mr-1" />
                                  )}
                                  {getTeamName(mapping.teamId)}
                                </Badge>
                              )
                            })}
                            {assignedTeams.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{assignedTeams.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                      )}

                      <div className="flex justify-end">
                        <Button size="sm" variant="outline" onClick={() => viewJudgeTeams(judge.id)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View All Teams ({stats.assigned})
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

      {/* Judge Teams Dialog */}
      <Dialog open={isTeamsDialogOpen} onOpenChange={setIsTeamsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Judge Team Assignments</DialogTitle>
            <DialogDescription>Teams assigned to this judge and their evaluation status</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {selectedJudgeTeams.map((team) => {
              const isEvaluated = evaluatedTeams.includes(team.id)
              return (
                <Card
                  key={team.id}
                  className={`border-l-4 ${isEvaluated ? "border-l-green-500" : "border-l-orange-500"}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                          {team.teamName}
                          {isEvaluated ? (
                            <Badge variant="default">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Evaluated
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1">
                          Room: {team.roomNumber} • PS: {team.problemStatement}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      <div>
                        <Label className="text-sm font-medium">Team Members:</Label>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {team.members?.map((member, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {member}
                            </Badge>
                          )) || <span className="text-sm text-slate-500">No members listed</span>}
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-600">
                          Status: {isEvaluated ? "Evaluation completed" : "Awaiting evaluation"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Judges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{judges.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Teams Mapped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{mappings.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Teams Evaluated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">{evaluatedTeams.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Evaluation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mappings.length > 0 ? Math.round((evaluatedTeams.length / mappings.length) * 100) : 0}%
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
