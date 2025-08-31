"use client";

import { useState } from "react";
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
import type { Domain } from "@/lib/types";

interface ProblemStatementsProps {
  domains: Domain[];
  selectedPS: string | null;
  bookmarkedPS: string[];
  psLocked: boolean;
  onSelectPS: (psId: string) => void;
  onBookmark: (psId: string) => void;
}

export function ProblemStatements({
  domains,
  selectedPS,
  bookmarkedPS,
  psLocked,
  onSelectPS,
  onBookmark,
}: ProblemStatementsProps) {
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);
  const { toast } = useToast();

  const handleSelectPS = async (psId: string) => {
    if (psLocked) return;

    try {
      await apiService.selectProblemStatement(psId);
      onSelectPS(psId);
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
      await apiService.bookmarkProblemStatement(psId);
      onBookmark(psId);
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
        <Button variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh (30s)
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
                  {domain.problemStatements.length} PS
                </Badge>
              </CardTitle>
              <CardDescription>
                {domain.problemStatements.reduce(
                  (sum, ps) => sum + ps.selectedCount,
                  0,
                )}{" "}
                total selections
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
                        {bookmarkedPS.includes(ps.id) ? (
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        ) : (
                          <StarOff className="h-4 w-4" />
                        )}
                      </Button>
                      <Badge variant="outline">
                        Selected by {ps.selectedCount} teams
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
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          className="w-full"
                          disabled={psLocked}
                          variant={
                            selectedPS === ps.id ? "secondary" : "default"
                          }
                        >
                          {selectedPS === ps.id
                            ? "Selected"
                            : "Select This Problem"}
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Confirm Selection</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to select &#34;{ps.title}&#34;?
                            {psLocked
                              ? " Selection is locked and cannot be changed."
                              : " You can change this selection within the first 2 hours of the start of hackathon."}
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <DialogClose className={"mr-2"}>Cancel</DialogClose>
                          <Button onClick={() => handleSelectPS(ps.id)}>
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
