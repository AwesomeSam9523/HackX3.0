"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Gavel, Users, MapPin, Edit, Calculator, Github, FileText } from "lucide-react"

export default function JudgeDashboard() {
  const [passwordChanged, setPasswordChanged] = useState(true)
  const [hideEvaluated, setHideEvaluated] = useState(false)
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null)
  const [scores, setScores] = useState<{ [key: string]: { [key: string]: number } }>({})

  // Mock data
  const judgeInfo = {
    name: "Prof. Michael Johnson",
    floor: "Ground Floor",
    assignedTeams: 8,
  }

  const scoringCriteria = [
    { id: "innovation", name: "Innovation & Creativity", weight: 25, maxScore: 10 },
    { id: "technical", name: "Technical Implementation", weight: 30, maxScore: 10 },
    { id: "presentation", name: "Presentation Quality", weight: 20, maxScore: 10 },
    { id: "feasibility", name: "Feasibility & Impact", weight: 25, maxScore: 10 },
  ]

  const [teams, setTeams] = useState([
    {
      id: "t1",
      teamName: "Code Warriors",
      problemStatement: "Smart Traffic Management System",
      roomNumber: "AB1-201",
      floor: "Ground Floor",
      evaluated: false,
      totalScore: 0,
      githubLink: "https://github.com/codewarriors/traffic-system",
      presentationLink: "https://drive.google.com/presentation/d/abc123",
      submissionStatus: "submitted",
    },
    {
      id: "t2",
      teamName: "Tech Innovators",
      problemStatement: "Healthcare Diagnosis Assistant",
      roomNumber: "AB1-203",
      floor: "Ground Floor",
      evaluated: true,
      totalScore: 8.5,
      githubLink: "https://github.com/techinnovators/health-ai",
      presentationLink: "https://drive.google.com/presentation/d/def456",
      submissionStatus: "submitted",
    },
    {
      id: "t3",
      teamName: "Digital Pioneers",
      problemStatement: "E-commerce Platform",
      roomNumber: "AB1-205",
      floor: "Ground Floor",
      evaluated: false,
      totalScore: 0,
      githubLink: null,
      presentationLink: null,
      submissionStatus: "not_submitted",
    },
    {
      id: "t4",
      teamName: "Innovation Squad",
      problemStatement: "Smart Traffic Management System",
      roomNumber: "AB1-207",
      floor: "Ground Floor",
      evaluated: true,
      totalScore: 7.8,
      githubLink: "https://github.com/innovationsquad/smart-traffic",
      presentationLink: null,
      submissionStatus: "partial",
    },
  ])

  const calculateWeightedScore = (teamId: string) => {
    const teamScores = scores[teamId] || {}
    let totalWeightedScore = 0

    scoringCriteria.forEach((criteria) => {
      const score = teamScores[criteria.id] || 0
      totalWeightedScore += (score * criteria.weight) / 100
    })

    return totalWeightedScore.toFixed(1)
  }

  const handleScoreChange = (teamId: string, criteriaId: string, value: number[]) => {
    setScores((prev) => ({
      ...prev,
      [teamId]: {
        ...prev[teamId],
        [criteriaId]: value[0],
      },
    }))
  }

  const handleSaveScore = (teamId: string) => {
    const weightedScore = Number.parseFloat(calculateWeightedScore(teamId))
    setTeams((prev) =>
      prev.map((team) => (team.id === teamId ? { ...team, evaluated: true, totalScore: weightedScore } : team)),
    )
    setSelectedTeam(null)
  }

  const filteredTeams = hideEvaluated ? teams.filter((team) => !team.evaluated) : teams

  // if (!passwordChanged) {
  //   return (
  //     <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
  //       <Card className="w-full max-w-md">
  //         <CardHeader>
  //           <CardTitle>Change Password Required</CardTitle>
  //           <CardDescription>You must change your password before accessing the dashboard.</CardDescription>
  //         </CardHeader>
  //         <CardContent className="space-y-4">
  //           <div className="space-y-2">
  //             <Label htmlFor="current-password">Current Password</Label>
  //             <Input id="current-password" type="password" />
  //           </div>
  //           <div className="space-y-2">
  //             <Label htmlFor="new-password">New Password</Label>
  //             <Input id="new-password" type="password" />
  //           </div>
  //           <div className="space-y-2">
  //             <Label htmlFor="confirm-password">Confirm New Password</Label>
  //             <Input id="confirm-password" type="password" />
  //           </div>
  //           <Button className="w-full" onClick={() => setPasswordChanged(true)}>
  //             Change Password
  //           </Button>
  //         </CardContent>
  //       </Card>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 sm:mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">Judge Dashboard</h1>
            <p className="text-sm sm:text-base text-slate-600 mt-1">Welcome, {judgeInfo.name}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch id="hide-evaluated" checked={hideEvaluated} onCheckedChange={setHideEvaluated} />
              <Label htmlFor="hide-evaluated" className="text-xs sm:text-sm">
                Hide Evaluated Teams
              </Label>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Gavel className="h-4 w-4 sm:h-5 sm:w-5" />
                Judge Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label className="text-xs sm:text-sm font-medium">Assigned Floor</Label>
                <p className="text-base sm:text-lg">{judgeInfo.floor}</p>
              </div>
              <div>
                <Label className="text-xs sm:text-sm font-medium">Total Teams</Label>
                <p className="text-base sm:text-lg">{judgeInfo.assignedTeams}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                Evaluation Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-green-600">
                  {teams.filter((t) => t.evaluated).length}/{teams.length}
                </div>
                <p className="text-xs sm:text-sm text-slate-500">Teams Evaluated</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Calculator className="h-4 w-4 sm:h-5 sm:w-5" />
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-blue-600">
                  {teams.filter((t) => t.evaluated).length > 0
                    ? (
                        teams.filter((t) => t.evaluated).reduce((sum, t) => sum + t.totalScore, 0) /
                        teams.filter((t) => t.evaluated).length
                      ).toFixed(1)
                    : "0.0"}
                </div>
                <p className="text-xs sm:text-sm text-slate-500">Out of 10</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              Teams - {judgeInfo.floor}
            </CardTitle>
            <CardDescription className="text-sm">Click on a team to evaluate or edit scores</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {filteredTeams.map((team) => (
                <Card
                  key={team.id}
                  className={`cursor-pointer transition-colors hover:bg-slate-50 border-l-4 ${team.evaluated ? "border-l-hackx" : ""}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0">
                      <div className="flex-1">
                        <CardTitle className="text-base sm:text-lg flex flex-col sm:flex-row sm:items-center gap-2">
                          <span>{team.teamName}</span>
                          {team.evaluated && (
                            <Badge variant="default" className="bg-green-500 text-xs w-fit">
                              Evaluated
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm">
                          <strong>PS:</strong> {team.problemStatement}
                        </CardDescription>
                        <CardDescription className="text-sm">
                          <strong>Room:</strong> {team.roomNumber}
                        </CardDescription>
                      </div>
                      <div className="text-left lg:text-right">
                        <Badge
                          variant={
                            team.submissionStatus === "submitted"
                              ? "default"
                              : team.submissionStatus === "partial"
                                ? "secondary"
                                : "destructive"
                          }
                          className="text-xs"
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
                      <div className="flex flex-col sm:flex-row gap-2">
                        {team.githubLink ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(team.githubLink, "_blank")}
                            className="text-xs w-full sm:w-auto"
                          >
                            <Github className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            GitHub Repo
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="text-xs w-full sm:w-auto bg-transparent"
                          >
                            <Github className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            No GitHub
                          </Button>
                        )}

                        {team.presentationLink ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(team.presentationLink, "_blank")}
                            className="text-xs w-full sm:w-auto"
                          >
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            Presentation
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="text-xs w-full sm:w-auto bg-transparent"
                          >
                            <FileText className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                            No Presentation
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0">
                        <div className="flex items-center gap-4">
                          {team.evaluated && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm text-slate-600">Score:</span>
                              <Badge variant="outline" className="font-mono text-xs">
                                {team.totalScore}/10
                              </Badge>
                            </div>
                          )}
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant={team.evaluated ? "outline" : "default"}
                              onClick={() => setSelectedTeam(team.id)}
                              className="text-xs w-full sm:w-auto"
                            >
                              {team.evaluated ? (
                                <>
                                  <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                  Edit Score
                                </>
                              ) : (
                                <>
                                  <Gavel className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                                  Evaluate
                                </>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-lg sm:text-xl">Evaluate Team: {team.teamName}</DialogTitle>
                              <DialogDescription className="text-sm">
                                Score each criteria on a scale of 0-10. The weighted score will be calculated
                                automatically.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              {scoringCriteria.map((criteria) => (
                                <div key={criteria.id} className="space-y-3">
                                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                    <Label className="text-sm font-medium">{criteria.name}</Label>
                                    <div className="flex items-center gap-2">
                                      <Badge variant="outline" className="text-xs">
                                        Weight: {criteria.weight}%
                                      </Badge>
                                      <Badge variant="secondary" className="text-xs">
                                        {scores[team.id]?.[criteria.id] || 0}/{criteria.maxScore}
                                      </Badge>
                                    </div>
                                  </div>
                                  <Slider
                                    value={[scores[team.id]?.[criteria.id] || 0]}
                                    onValueChange={(value) => handleScoreChange(team.id, criteria.id, value)}
                                    max={criteria.maxScore}
                                    step={0.1}
                                    className="w-full"
                                  />
                                </div>
                              ))}
                              <Separator />
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-2 sm:space-y-0">
                                <span className="text-base sm:text-lg font-semibold">Weighted Total Score:</span>
                                <Badge variant="default" className="text-sm sm:text-lg px-3 py-1 w-fit">
                                  {calculateWeightedScore(team.id)}/10
                                </Badge>
                              </div>
                            </div>
                            <DialogFooter className="flex-col sm:flex-row gap-2">
                              <Button variant="outline" className="w-full sm:w-auto bg-transparent">
                                Cancel
                              </Button>
                              <Button variant="outline" onClick={() => {
                                setSelectedTeam(null)
                                setScores((prev) => ({ ...prev, [team.id]: {} }))
                              }} className="w-full sm:w-auto bg-transparent">
                                Reset
                              </Button>
                              <Button onClick={() => handleSaveScore(team.id)} className="w-full sm:w-auto">
                                Save Score
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
