"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, Clock, Eye, Filter, MapPin, Search } from "lucide-react";
import { apiService } from "@/lib/service";
// import { useToast } from "@/hooks/use-toast";
import type { Judge, Team, TeamJudgeMapping } from "@/lib/types";

interface JudgeTeamMappingTabProps {
  teams: Team[];
  judges: Judge[];
}

export function JudgeTeamMappingTab({
  teams,
  judges,
}: JudgeTeamMappingTabProps) {
  const [mappings, setMappings] = useState<TeamJudgeMapping[]>([]);
  const [evaluatedTeams, setEvaluatedTeams] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJudge, setSelectedJudge] = useState<string>("all");
  const [selectedJudgeTeams, setSelectedJudgeTeams] = useState<Team[]>([]);
  const [isTeamsDialogOpen, setIsTeamsDialogOpen] = useState(false);
  // const { toast } = useToast();

  useEffect(() => {
    loadMappings();
    loadEvaluatedTeams();
  }, []);

  const loadMappings = async () => {
    try {
      const data = await apiService.getTeamJudgeMappings();
      setMappings(data);
    } catch (error) {
      console.error("Failed to load mappings:", error);
    }
  };

  const loadEvaluatedTeams = async () => {
    try {
      const scores = await apiService.getTeamScores();
      const minScores = scores.map((score) => {
        return {
          teamId: score.teamId,
          status: score.teamScores?.length > 0 ? "EVALUATED" : "PENDING",
        };
      });
      setEvaluatedTeams(
        minScores.filter((s) => s.status === "EVALUATED").map((s) => s.teamId),
      );
    } catch (error) {
      console.error("Failed to load evaluated teams:", error);
    }
  };

  // Filter judges based on search and filters
  const filteredJudges = useMemo(() => {
    return judges.filter((judge) => {
      const matchesSearch = judge.user.username
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesJudge =
        selectedJudge === "all" || judge.id === selectedJudge;

      return matchesSearch && matchesJudge;
    });
  }, [judges, searchTerm, selectedJudge]);

  const getJudgeStats = (judgeId: string) => {
    const assignedTeams = mappings.filter((m) => m.judge.id === judgeId);
    const evaluatedCount = assignedTeams.filter((m) =>
      evaluatedTeams.includes(m.teamId),
    ).length;
    return {
      assigned: assignedTeams.length,
      evaluated: evaluatedCount,
    };
  };

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || "Unknown Team";
  };

  const getTeamDetails = (teamId: string) => {
    return teams.find((t) => t.id === teamId);
  };

  const viewJudgeTeams = (judgeId: string) => {
    const judgeTeamMappings = mappings.filter((m) => m.judge.id === judgeId);
    const judgeTeams = judgeTeamMappings
      .map((mapping) => getTeamDetails(mapping.team.id))
      .filter((team): team is Team => team !== undefined);
    setSelectedJudgeTeams(judgeTeams);
    setIsTeamsDialogOpen(true);
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedJudge("all");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Judge-Team Mapping Overview</h2>
          <p className="text-slate-600">
            View team assignments and evaluation progress
          </p>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Search & Filters
          </CardTitle>
          <CardDescription>
            Filter judges by name, floor, or specific judge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex w-full flex-row gap-4">
            <div className="w-full space-y-2">
              <Label>Search Judges</Label>
              <div className="relative">
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search by judge name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Actions</Label>
              <Button
                variant="outline"
                onClick={clearFilters}
                className="w-full bg-transparent"
              >
                Clear Filters
              </Button>
            </div>
          </div>
          <div className="mt-4">
            <Badge variant="secondary">
              Showing {filteredJudges.length} judges
            </Badge>
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
          <CardDescription>
            View team assignments and evaluation progress for each judge
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredJudges.map((judge) => {
              const stats = getJudgeStats(judge.id);
              const assignedTeams = mappings.filter(
                (m) => m.judge.id === judge.id,
              );

              return (
                <Card key={judge.id} className="border-l-hackx border-l-4">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{judge.name}</CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">
                          {stats.assigned} teams assigned
                        </Badge>
                        <Badge
                          variant={
                            stats.evaluated === stats.assigned
                              ? "default"
                              : "secondary"
                          }
                        >
                          {stats.evaluated}/{stats.assigned} evaluated
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-3">
                      {/* Progress Bar */}
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>Evaluation Progress</span>
                          <span>
                            {stats.assigned > 0
                              ? Math.round(
                                  (stats.evaluated / stats.assigned) * 100,
                                )
                              : 0}
                            %
                          </span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-slate-200">
                          <div
                            className="h-2 rounded-full bg-green-500"
                            style={{
                              width:
                                stats.assigned > 0
                                  ? `${(stats.evaluated / stats.assigned) * 100}%`
                                  : "0%",
                            }}
                          />
                        </div>
                      </div>

                      {/* Quick Team Preview */}
                      {assignedTeams.length > 0 && (
                        <div>
                          <Label className="text-sm text-slate-600">
                            Assigned Teams:
                          </Label>
                          <div className="mt-1 flex flex-wrap gap-1">
                            {assignedTeams.slice(0, 3).map((mapping) => {
                              const isEvaluated = evaluatedTeams.includes(
                                mapping.teamId,
                              );
                              return (
                                <Badge
                                  key={mapping.team.id}
                                  variant={
                                    isEvaluated ? "default" : "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {isEvaluated ? (
                                    <CheckCircle className="mr-1 h-3 w-3" />
                                  ) : (
                                    <Clock className="mr-1 h-3 w-3" />
                                  )}
                                  {getTeamName(mapping.team.id)}
                                </Badge>
                              );
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
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => viewJudgeTeams(judge.id)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          View All Teams ({stats.assigned})
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Judge Teams Dialog */}
      <Dialog open={isTeamsDialogOpen} onOpenChange={setIsTeamsDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Judge Team Assignments</DialogTitle>
            <DialogDescription>
              Teams assigned to this judge and their evaluation status
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-96 space-y-4 overflow-y-auto">
            {selectedJudgeTeams.map((team) => {
              const isEvaluated = evaluatedTeams.includes(team.id);
              return (
                <Card
                  key={team.id}
                  className={`border-l-4 ${isEvaluated ? "border-l-green-500" : "border-l-orange-500"}`}
                >
                  <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2 text-lg">
                          {team.name}
                          {isEvaluated ? (
                            <Badge variant="default">
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Evaluated
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <Clock className="mr-1 h-3 w-3" />
                              Pending
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription className="mt-1 mb-0">
                          {team.teamId} • {team.round1Room.block}-{" "}
                          {team.round1Room.name} • PS:{" "}
                          {team.problemStatement.title}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </DialogContent>
      </Dialog>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Total Judges</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {judges.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Teams Mapped</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {mappings.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Teams Evaluated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-600">
              {evaluatedTeams.length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Evaluation Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {mappings.length > 0
                ? Math.round((evaluatedTeams.length / mappings.length) * 100)
                : 0}
              %
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
