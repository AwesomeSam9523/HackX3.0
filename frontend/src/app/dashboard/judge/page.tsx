"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import {
  Calculator,
  Edit,
  FileText,
  Gavel,
  Github,
  MapPin,
  Users,
} from "lucide-react";
import { Evaluation, Judge } from "@/lib/types";
import { apiService } from "@/lib/service";
import { useToast } from "@/hooks/use-toast";

type ScoreKeys =
  | "innovation"
  | "technical"
  | "presentation"
  | "feasibility"
  | "impact";
interface Criterion {
  id: ScoreKeys;
  name: string;
  weight: number;
  maxScore: number;
}

export default function JudgeDashboard() {
  // const [passwordChanged, setPasswordChanged] = useState(true);
  const [hideEvaluated, setHideEvaluated] = useState(false);
  const [scores, setScores] = useState<
    Record<ScoreKeys, number> & { feedback: string }
  >({
    innovation: 0,
    technical: 0,
    feasibility: 0,
    presentation: 0,
    impact: 0,
    feedback: "",
  });
  const [judge, setJudge] = useState<Judge>();
  const [assignedTeams, setAssignedTeams] = useState<Evaluation[]>([]);
  const [openTeamId, setOpenTeamId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    apiService.getProfile().then((value) => setJudge(value as Judge));
    apiService.getEvaluations().then(setAssignedTeams);
  }, []);

  const scoringCriteria: Criterion[] = [
    {
      id: "innovation",
      name: "Innovation & Creativity",
      weight: 25,
      maxScore: 10,
    },
    {
      id: "technical",
      name: "Technical Implementation",
      weight: 30,
      maxScore: 10,
    },
    {
      id: "presentation",
      name: "Presentation Quality",
      weight: 15,
      maxScore: 10,
    },
    {
      id: "feasibility",
      name: "Feasibility of the Project",
      weight: 15,
      maxScore: 10,
    },
    {
      id: "impact",
      name: "Impact on Real Life",
      weight: 15,
      maxScore: 10,
    },
  ];

  const loadScores = async (teamId: string) => {
    const teamScores = await apiService.getTeamScoresById(teamId);
    if (!teamScores) {
      resetScores();
    } else {
      setScores({
        innovation: teamScores.innovation,
        impact: teamScores.impact,
        technical: teamScores.technical,
        presentation: teamScores.presentation,
        feasibility: teamScores.feasibility,
        feedback: teamScores.feedback || "",
      });
    }
    setOpenTeamId(teamId);
  };

  const calculateWeightedScore = () => {
    let totalWeightedScore = 0;

    scoringCriteria.forEach((criteria) => {
      const score = scores[criteria.id] || 0;
      totalWeightedScore += (score * criteria.weight) / 100;
    });
    return totalWeightedScore.toFixed(1);
  };

  const handleScoreChange = (criteriaId: string, value: number[]) => {
    setScores((prev) => ({
      ...prev,
      [criteriaId]: value[0],
    }));
  };

  const handleSaveScore = async (teamId: string) => {
    const payload = { teamId, scores };
    await apiService.submitScore(payload);
    apiService.getEvaluations().then(setAssignedTeams);
    toast({
      title: "Team marked!",
      description: `Successfully updated the score of ${teamId}`,
    });
    setOpenTeamId(null);
  };

  const resetScores = () => {
    const reset = scoringCriteria.reduce(
      (acc, criteria) => {
        acc[criteria.id] = 0;
        return acc;
      },
      {} as Record<ScoreKeys, number>,
    );

    setScores({ ...reset, feedback: "" });
  };

  const filteredEvaluations = hideEvaluated
    ? assignedTeams.filter((team) => !team.evaluated)
    : assignedTeams;

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

  if (!judge) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col space-y-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">
              Welcome, {judge.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="hide-evaluated"
                checked={hideEvaluated}
                onCheckedChange={setHideEvaluated}
              />
              <Label htmlFor="hide-evaluated" className="text-xs sm:text-sm">
                Hide Evaluated Teams
              </Label>
            </div>
          </div>
        </div>

        <div className="mb-6 grid grid-cols-1 gap-4 sm:mb-8 sm:grid-cols-3 sm:gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                <Gavel className="h-4 w-4 sm:h-5 sm:w-5" />
                Judge Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <Label className="text-xs font-medium sm:text-sm">
                  User ID
                </Label>
                <p className="text-base sm:text-lg">{judge.user.username}</p>
              </div>
              <div>
                <Label className="text-xs font-medium sm:text-sm">
                  Teams Assigned
                </Label>
                <p className="text-base sm:text-lg">{assignedTeams.length}</p>
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
                <div className="text-2xl font-bold text-green-600 sm:text-3xl">
                  {assignedTeams.filter((t) => t.evaluated).length}/
                  {assignedTeams.length}
                </div>
                <p className="text-xs text-slate-500 sm:text-sm">
                  Teams Evaluated
                </p>
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
                <div className="text-2xl font-bold text-blue-600 sm:text-3xl">
                  {assignedTeams.filter((t) => t.evaluated).length > 0
                    ? (
                        assignedTeams
                          .filter((t) => t.evaluated)
                          .reduce(
                            (sum, t) => sum + t.team.latestScore.totalScore,
                            0,
                          ) / assignedTeams.filter((t) => t.evaluated).length
                      ).toFixed(1)
                    : "0.0"}
                </div>
                <p className="text-xs text-slate-500 sm:text-sm">Out of 10</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <MapPin className="h-4 w-4 sm:h-5 sm:w-5" />
              Teams Assigned for Evaluation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {filteredEvaluations.map((evaluation) => (
                <Card
                  key={evaluation.evaluationId}
                  className={`cursor-pointer border-l-4 transition-colors hover:bg-slate-50 ${evaluation.evaluated ? "border-l-hackx" : ""}`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex flex-col space-y-3 lg:flex-row lg:items-center lg:justify-between lg:space-y-0">
                      <div className="flex-1">
                        <CardTitle className="flex flex-col gap-2 text-base sm:flex-row sm:items-center sm:text-lg">
                          <span>{evaluation.team.name}</span>
                          {evaluation.evaluated && (
                            <Badge
                              variant="default"
                              className="w-fit bg-green-500 text-xs"
                            >
                              Evaluated
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1 text-sm">
                          <strong>PS:</strong>{" "}
                          {evaluation.team.problemStatement.title}
                        </CardDescription>
                        <CardDescription className="text-sm">
                          <strong>Room:</strong>{" "}
                          {evaluation.team.round1Room.block}{" "}
                          {evaluation.team.round1Room.name}
                        </CardDescription>
                      </div>
                      <div className="text-left lg:text-right">
                        <Badge
                          variant={
                            evaluation.team.submissionStatus === "SUBMITTED"
                              ? "default"
                              : "destructive"
                          }
                          className="text-xs"
                        >
                          {evaluation.team.submissionStatus === "SUBMITTED"
                            ? "Submitted"
                            : "Not Submitted"}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      <div className="flex flex-col gap-2 sm:flex-row">
                        {evaluation.team.latestSubmission?.githubRepo ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(
                                evaluation.team.latestSubmission?.githubRepo,
                                "_blank",
                              )
                            }
                            className="w-full text-xs sm:w-auto"
                          >
                            <Github className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            GitHub Repo
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="w-full bg-transparent text-xs sm:w-auto"
                          >
                            <Github className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            No GitHub
                          </Button>
                        )}

                        {evaluation.team.latestSubmission?.presentationLink ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              window.open(
                                evaluation.team.latestSubmission
                                  ?.presentationLink,
                                "_blank",
                              )
                            }
                            className="w-full text-xs sm:w-auto"
                          >
                            <FileText className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            Presentation
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            disabled
                            className="w-full bg-transparent text-xs sm:w-auto"
                          >
                            <FileText className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                            No Presentation
                          </Button>
                        )}
                      </div>

                      <div className="flex flex-col space-y-3 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                        <div className="flex items-center gap-4">
                          {evaluation.evaluated && (
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-slate-600 sm:text-sm">
                                Score:
                              </span>
                              <Badge
                                variant="outline"
                                className="font-mono text-xs"
                              >
                                {evaluation.team.latestScore.totalScore}/10
                              </Badge>
                            </div>
                          )}
                        </div>
                        <Dialog
                          open={openTeamId === evaluation.team.id}
                          onOpenChange={(open) =>
                            setOpenTeamId(open ? evaluation.team.id : null)
                          }
                        >
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant={
                                evaluation.evaluated ? "outline" : "default"
                              }
                              className="w-full text-xs sm:w-auto"
                              onClick={() => loadScores(evaluation.team.id)}
                            >
                              {evaluation.evaluated ? (
                                <>
                                  <Edit className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                  Edit Score
                                </>
                              ) : (
                                <>
                                  <Gavel className="mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                                  Evaluate
                                </>
                              )}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-h-[90vh] w-[95vw] max-w-2xl overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle className="text-lg sm:text-xl">
                                Evaluate Team: {evaluation.team.name}
                              </DialogTitle>
                              <DialogDescription className="text-sm">
                                Score each criteria on a scale of 0-10. The
                                weighted score will be calculated automatically.
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6">
                              {scoringCriteria.map((criteria) => (
                                <div key={criteria.id} className="space-y-3">
                                  <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                    <Label className="text-sm font-medium">
                                      {criteria.name}
                                    </Label>
                                    <div className="flex items-center gap-2">
                                      <Badge
                                        variant="outline"
                                        className="text-xs"
                                      >
                                        Weight: {criteria.weight}%
                                      </Badge>
                                      <Badge
                                        variant="secondary"
                                        className="text-xs"
                                      >
                                        {scores[criteria.id] || 0}/
                                        {criteria.maxScore}
                                      </Badge>
                                    </div>
                                  </div>
                                  <Slider
                                    value={[scores[criteria.id] || 0]}
                                    onValueChange={(value) =>
                                      handleScoreChange(criteria.id, value)
                                    }
                                    max={criteria.maxScore}
                                    step={0.1}
                                    className="w-full"
                                  />
                                </div>
                              ))}
                              <Separator />
                              <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
                                <span className="text-base font-semibold sm:text-lg">
                                  Weighted Total Score:
                                </span>
                                <Badge
                                  variant="default"
                                  className="w-fit px-3 py-1 text-sm sm:text-lg"
                                >
                                  {calculateWeightedScore()}
                                  /10.0
                                </Badge>
                              </div>
                            </div>
                            <DialogFooter className="flex-col gap-2 sm:flex-row">
                              <Button
                                variant="outline"
                                className="w-full bg-transparent sm:w-auto"
                                onClick={() => setOpenTeamId(null)}
                              >
                                Cancel
                              </Button>
                              <Button
                                variant="outline"
                                onClick={resetScores}
                                className="w-full bg-transparent sm:w-auto"
                              >
                                Reset
                              </Button>
                              <Button
                                onClick={() =>
                                  handleSaveScore(evaluation.team.id)
                                }
                                className="w-full sm:w-auto"
                              >
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
  );
}
