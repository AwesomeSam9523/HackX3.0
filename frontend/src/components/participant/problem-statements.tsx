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
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RefreshCw, Star, StarOff } from "lucide-react";
import { apiService } from "@/lib/service";
import { useToast } from "@/hooks/use-toast";
import type { Domain, ProblemStatement } from "@/lib/types";

interface ProblemStatementsProps {
  domains: Domain[];
  selectedPS: ProblemStatement | null;
  bookmarkedPS: ProblemStatement[];
  psLocked: boolean;
  onSelectPSAction: (ps: ProblemStatement) => void;
  onBookmarkAction: (psId: string) => void;
  refreshDomainsAction: () => void;
}

export function ProblemStatements({
  domains,
  selectedPS,
  bookmarkedPS,
  psLocked,
  onSelectPSAction,
  onBookmarkAction,
  refreshDomainsAction,
}: ProblemStatementsProps) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const [activePSId, setActivePSId] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // refresh domains every 30 seconds
    const interval = setInterval(refreshDomainsAction, 30000);
    return () => clearInterval(interval);
  }, [refreshDomainsAction]);

  const handleSelectPS = async (psId: string) => {
    if (psLocked) return;

    try {
      const ps = await apiService.selectProblemStatement(psId);
      onSelectPSAction(ps.problemStatement);
      setActivePSId(null);
      toast({
        title: "Success",
        description: "Problem statement selected successfully",
      });
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to select problem statement",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = async (psId: string) => {
    try {
      // await apiService.bookmarkProblemStatement(psId);
      onBookmarkAction(psId);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to bookmark problem statement",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Problem Statements</h2>
        <Button variant="outline" size="sm" disabled={true}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Auto refreshing (30s)
        </Button>
      </div>

      {/* Domain Widgets */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {domains.map((domain) => (
          <Card
            key={domain.id}
            className="cursor-pointer border-2 transition-shadow hover:border-blue-300 hover:shadow-md"
            onClick={() =>
              setSelectedDomain(selectedDomain === domain.id ? null : domain.id)
            }
          >
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between text-lg">
                {domain.name}
                <Badge variant="outline">
                  {domain.problemStatements.reduce(
                    (sum, ps) => sum + ps._count.teams,
                    0,
                  )}{" "}
                  selections
                </Badge>
              </CardTitle>
              <CardDescription>
                {domain.problemStatements.length} problem statements available
              </CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Selected Domain Problem Statements */}
      {selectedDomain && (
        <div className="space-y-4">
          <h3 className="text-xl font-semibold">
            {domains.find((d) => d.id === selectedDomain)?.name} Problem
            Statements
          </h3>
          {domains
            .find((d) => d.id === selectedDomain)
            ?.problemStatements.map((ps) => (
              <Card key={ps.id} className="border-l-4 border-l-blue-500">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{ps.title}</CardTitle>
                      <CardDescription className="mt-2">
                        {ps.description}
                      </CardDescription>
                    </div>
                    <div className="ml-4 flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleBookmark(ps.id)}
                      >
                        {bookmarkedPS
                          .map((problem) => problem.id)
                          .includes(ps.id) ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Badge variant="outline">
                        Selected by {ps._count.teams}{" "}
                        {ps._count.teams > 1 ? "teams" : "team"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">
                        Deliverables:
                      </Label>
                      <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
                        {ps.deliverables.map((deliverable, index) => (
                          <li key={index}>{deliverable}</li>
                        ))}
                      </ul>
                    </div>
                    <Dialog
                      open={activePSId === ps.id}
                      onOpenChange={(open) =>
                        setActivePSId(open ? ps.id : null)
                      }
                    >
                      <DialogTrigger asChild>
                        <Button
                          className="w-full"
                          disabled={psLocked || selectedPS?.id === ps.id}
                          variant={
                            selectedPS?.id === ps.id ? "secondary" : "default"
                          }
                          onClick={(event) => {
                            if (selectedPS?.id === ps.id) {
                              event.preventDefault();
                              event.stopPropagation();
                            }
                          }}
                        >
                          {selectedPS?.id === ps.id
                            ? "Selected"
                            : "Select This Problem"}
                        </Button>
                      </DialogTrigger>

                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Selection</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to select “{ps.title}”?
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose
                            className="mr-2"
                            onClick={() => setActivePSId(null)}
                          >
                            Cancel
                          </DialogClose>
                          <Button
                            onClick={() => {
                              handleSelectPS(ps.id);
                              setActivePSId(null);
                            }}
                          >
                            Confirm Selection
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
