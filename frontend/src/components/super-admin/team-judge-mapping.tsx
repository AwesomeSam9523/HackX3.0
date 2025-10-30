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
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowRight,
  CheckSquare,
  Filter,
  MapPin,
  Search,
  Square,
  Trash2,
  Trophy,
  UserCheck,
  Users,
} from "lucide-react";
import { apiService } from "@/lib/service";
import { useToast } from "@/hooks/use-toast";
import type { Judge, Team, TeamJudgeMapping, TeamScore } from "@/lib/types";

interface TeamJudgeMappingProps {
  teams: Team[];
  judges: Judge[];
}

type ScoreKeys =
  | "innovation"
  | "technical"
  | "presentation"
  | "feasibility"
  | "impact";

export function TeamJudgeMapping({ teams, judges }: TeamJudgeMappingProps) {
  const [mappings, setMappings] = useState<TeamJudgeMapping[]>([]);
  const [teamScores, setTeamScores] = useState<TeamScore[]>([]);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedJudge, setSelectedJudge] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPS, setSelectedPS] = useState<string>("all");
  const [showMappedOnly, setShowMappedOnly] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);
  const [isScoreDialogOpen, setIsScoreDialogOpen] = useState(false);
  const [selectedTeamScores, setSelectedTeamScores] = useState<TeamScore[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    apiService.getTeamJudgeMappings().then(setMappings);
    apiService.getTeamScores().then(setTeamScores);
  }, []);

  const loadMappings = async () => {
    try {
      const data = await apiService.getTeamJudgeMappings();
      setMappings(data);
    } catch (error) {
      console.error("Failed to load mappings:", error);
    }
  };

  // Get unique problem statements and floors for filtering
  const uniquePS = useMemo(() => {
    const map = new Map<string, { id: string; title: string }>();
    teams.forEach((team) => {
      if (team.problemStatement && team.problemStatement.id) {
        map.set(team.problemStatement.id, team.problemStatement);
      }
    });
    return Array.from(map.values()).sort((a, b) =>
      (a.title || "").localeCompare(b.title || ""),
    );
  }, [teams]);

  // Filter teams based on search and filters
  const filteredTeams = useMemo(() => {
    return teams.filter((team) => {
      const matchesSearch =
        team.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        team.round1Room?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPS =
        selectedPS === "all" || team.problemStatement?.title === selectedPS;
      const isMapped = mappings.some((m) => m.teamId === team.id);
      const matchesMappedFilter = !showMappedOnly || isMapped;

      return matchesSearch && matchesPS && matchesMappedFilter;
    });
  }, [teams, searchTerm, selectedPS, showMappedOnly, mappings]);

  const handleBulkAssign = async () => {
    if (selectedTeams.length === 0 || !selectedJudge) {
      toast({
        title: "Error",
        description: "Please select teams and a judge",
        variant: "destructive",
      });
      return;
    }

    try {
      // Assign all selected teams to the judge
      await Promise.all(
        selectedTeams.map((teamId) =>
          apiService.mapTeamToJudge(teamId, selectedJudge),
        ),
      );

      toast({
        title: "Success",
        description: `${selectedTeams.length} teams assigned to judge successfully`,
      });

      setSelectedTeams([]);
      setSelectedJudge("");
      setIsAssignDialogOpen(false);
      loadMappings();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to assign teams to judge",
        variant: "destructive",
      });
    }
  };

  const handleRemoveMapping = async (teamId: string, judgeId: string) => {
    try {
      await apiService.removeTeamJudgeMapping(teamId, judgeId);
      toast({
        title: "Success",
        description: "Team mapping removed successfully",
      });
      loadMappings();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to remove mapping",
        variant: "destructive",
      });
    }
  };

  const handleSelectAll = () => {
    const unmappedTeams = filteredTeams.filter(
      (team) => !mappings.some((m) => m.teamId === team.id),
    );
    setSelectedTeams(unmappedTeams.map((team) => team.id));
  };

  const handleDeselectAll = () => {
    setSelectedTeams([]);
  };

  const handleTeamSelect = (teamId: string, checked: boolean) => {
    if (checked) {
      setSelectedTeams((prev) => [...prev, teamId]);
    } else {
      setSelectedTeams((prev) => prev.filter((id) => id !== teamId));
    }
  };

  const getJudgeName = (judgeId: string) => {
    return (
      judges.find((j) => j.id === judgeId)?.user.username || "Unknown Judge"
    );
  };

  const getTeamName = (teamId: string) => {
    return teams.find((t) => t.id === teamId)?.name || "Unknown Team";
  };

  const getTeamScore = (teamId: string) => {
    return teamScores.find(
      (score) => score.id === teamId && score.teamScores.length > 0,
    );
  };

  const getJudgeStats = (judgeId: string) => {
    const assignedTeams = mappings.filter((m) => m.judge.id === judgeId);
    const evaluatedTeams = assignedTeams.filter((m) => getTeamScore(m.teamId));
    return {
      assigned: assignedTeams.length,
      evaluated: evaluatedTeams.length,
    };
  };

  const viewTeamScores = (teamId: string) => {
    const scores = teamScores.filter((score) => score.id === teamId);
    setSelectedTeamScores(scores);
    setIsScoreDialogOpen(true);
  };

  const unmappedTeamsCount = filteredTeams.filter(
    (team) => !mappings.some((m) => m.teamId === team.id),
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Team-Judge Mapping</h2>
          <p className="text-slate-600">
            {teams.length} total teams • {mappings.length} mapped •{" "}
            {unmappedTeamsCount} unmapped
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog
            open={isAssignDialogOpen}
            onOpenChange={setIsAssignDialogOpen}
          >
            <DialogTrigger asChild>
              <Button disabled={selectedTeams.length === 0}>
                <UserCheck className="mr-2 h-4 w-4" />
                Assign Selected ({selectedTeams.length})
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Assign Teams to Judge</DialogTitle>
                <DialogDescription>
                  Assign {selectedTeams.length} selected teams to a judge
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Selected Teams ({selectedTeams.length})</Label>
                  <div className="max-h-32 overflow-y-auto rounded border p-2">
                    {selectedTeams.map((teamId) => (
                      <div key={teamId} className="py-1 text-sm">
                        {getTeamName(teamId)}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Select Judge</Label>
                  <Select
                    value={selectedJudge}
                    onValueChange={setSelectedJudge}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a judge" />
                    </SelectTrigger>
                    <SelectContent>
                      {judges.map((judge) => {
                        const stats = getJudgeStats(judge.id);
                        return (
                          <SelectItem key={judge.id} value={judge.id}>
                            {judge.user.username} ({stats.assigned} teams)
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsAssignDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleBulkAssign}>
                  Assign {selectedTeams.length} Teams
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Search
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Search Teams</Label>
              <div className="relative">
                <Search className="absolute top-2.5 left-2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Team name or room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Problem Statement</Label>
              <Select value={selectedPS} onValueChange={setSelectedPS}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Problem Statements</SelectItem>
                  {uniquePS.map((ps) => (
                    <SelectItem key={ps.id} value={ps.title}>
                      {ps.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>View Options</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="show-mapped"
                  checked={showMappedOnly}
                  onCheckedChange={(value) =>
                    setShowMappedOnly(value as boolean)
                  }
                />
                <Label htmlFor="show-mapped" className="text-sm">
                  Show mapped only
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Teams Panel */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Teams ({filteredTeams.length})
                </CardTitle>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleSelectAll}>
                    <CheckSquare className="mr-1 h-4 w-4" />
                    Select All Unmapped
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleDeselectAll}
                  >
                    <Square className="mr-1 h-4 w-4" />
                    Deselect All
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="max-h-96 space-y-2 overflow-y-auto">
                {filteredTeams.map((team) => {
                  const mapping = mappings.find((m) => m.teamId === team.id);
                  const isMapped = !!mapping;
                  const isSelected = selectedTeams.includes(team.id);
                  const hasScore = !!getTeamScore(team.id);

                  return (
                    <div
                      key={team.id}
                      className={`rounded-lg border p-3 transition-colors ${
                        isSelected
                          ? "border-blue-200 bg-blue-50"
                          : isMapped
                            ? "border-green-200 bg-green-50"
                            : "hover:bg-slate-50"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {!isMapped && (
                            <Checkbox
                              checked={isSelected}
                              onCheckedChange={(checked) =>
                                handleTeamSelect(team.id, checked as boolean)
                              }
                            />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">{team.name}</h4>
                              {hasScore && (
                                <Badge variant="default" className="text-xs">
                                  <Trophy className="mr-1 h-3 w-3" />
                                  Scored
                                </Badge>
                              )}
                            </div>
                            <p className="text-sm text-slate-500">
                              {team.round1Room?.block ?? ""}{" "}
                              {team.round1Room?.name ?? ""} •{" "}
                              {team.problemStatement?.title ?? "-"}
                            </p>
                            {isMapped && (
                              <p className="text-sm text-green-600">
                                Assigned to: {getJudgeName(mapping.judge.id)}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {hasScore && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewTeamScores(team.id)}
                            >
                              View Score
                            </Button>
                          )}
                          {isMapped && (
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() =>
                                handleRemoveMapping(team.id, mapping.judge.id)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Judges Panel */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Judges ({judges.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {judges.map((judge) => {
                  const stats = getJudgeStats(judge.id);
                  const assignedTeams = mappings.filter(
                    (m) => m.judge.id === judge.id,
                  );

                  return (
                    <div key={judge.id} className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{judge.user.username}</h4>
                        </div>
                        <Badge variant="outline">{stats.assigned} teams</Badge>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span>Progress:</span>
                          <span>
                            {stats.evaluated}/{stats.assigned} evaluated
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

                      {selectedTeams.length > 0 && (
                        <Button
                          size="sm"
                          className="mt-2 w-full"
                          onClick={() => {
                            setSelectedJudge(judge.id);
                            setIsAssignDialogOpen(true);
                          }}
                        >
                          <ArrowRight className="mr-1 h-4 w-4" />
                          Assign {selectedTeams.length} Teams
                        </Button>
                      )}

                      {assignedTeams.length > 0 && (
                        <div className="mt-2">
                          <Label className="text-xs text-slate-500">
                            Assigned Teams:
                          </Label>
                          <div className="max-h-20 overflow-y-auto">
                            {assignedTeams.slice(0, 3).map((mapping) => (
                              <div
                                key={mapping.teamId}
                                className="text-xs text-slate-600"
                              >
                                {getTeamName(mapping.teamId)}
                              </div>
                            ))}
                            {assignedTeams.length > 3 && (
                              <div className="text-xs text-slate-400">
                                +{assignedTeams.length - 3} more...
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Team Scores Dialog */}
      <Dialog open={isScoreDialogOpen} onOpenChange={setIsScoreDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Team Evaluation Scores</DialogTitle>
            <DialogDescription>Detailed scoring breakdown</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTeamScores.length > 0 ? (
              selectedTeamScores.map((score) => (
                <Card
                  key={score.teamId}
                  className="border-l-4 border-l-green-500"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="text-lg">{score.name}</CardTitle>
                        <CardDescription>
                          Evaluated by {score.teamScores[0].judge.name}
                        </CardDescription>
                      </div>
                      <Badge variant="default" className="px-3 py-1 text-lg">
                        {parseFloat(score.teamScores[0].totalScore).toFixed(1)}
                        /10
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="space-y-2">
                      {[
                        "innovation",
                        "impact",
                        "technical",
                        "feasibility",
                        "presentation",
                      ].map((criteria) => (
                        <div
                          key={criteria}
                          className="flex items-center justify-between"
                        >
                          <span className="text-sm capitalize">
                            {criteria.replace(/([A-Z])/g, " $1")}
                          </span>
                          <Badge variant="outline">
                            {score.teamScores[0][criteria as ScoreKeys]}/10
                          </Badge>
                        </div>
                      ))}
                      <div className="mt-2 text-xs text-slate-500">
                        Evaluated on:{" "}
                        {new Date(
                          score.teamScores[0].createdAt,
                        ).toLocaleString()}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="py-8 text-center">
                <Trophy className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <p className="text-slate-500">
                  No scores available for this team
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button onClick={() => setIsScoreDialogOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
