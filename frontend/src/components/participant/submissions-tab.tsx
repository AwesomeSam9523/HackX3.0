"use client";

import type React from "react";
import { useState } from "react";
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
import { Clock, FileText, Github, Upload } from "lucide-react";
import { apiService } from "@/lib/service";
import { useToast } from "@/hooks/use-toast";
import { Submission } from "@/lib/types";

interface SubmissionsTabProps {
  submissions: Submission[];
  round1Locked: boolean;
  onSubmissionUpdateAction: () => void;
}

export function SubmissionsTab({
  submissions,
  round1Locked,
  onSubmissionUpdateAction,
}: SubmissionsTabProps) {
  const [githubLink, setGithubLink] = useState("");
  const [pptLink, setPptLink] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (round1Locked) {
      toast({
        title: "Error",
        description: "Submissions are locked for Round 1",
        variant: "destructive",
      });
      return;
    }

    if (!githubLink.trim() || !pptLink.trim()) {
      toast({
        title: "Error",
        description: "Please provide both GitHub and PPT links",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await apiService.submitProject(githubLink, pptLink);
      toast({
        title: "Success",
        description: "Project submitted successfully",
      });
      setGithubLink("");
      setPptLink("");
      onSubmissionUpdateAction();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to submit project",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Submissions</h2>
        <Badge variant="outline">
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Submission Form */}
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Submit Your Project
            </CardTitle>
            <CardDescription>
              Submit your GitHub repository and presentation links for
              evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="github-link"
                  className="flex items-center gap-2"
                >
                  <Github className="h-4 w-4" />
                  GitHub Repository Link
                </Label>
                <Input
                  id="github-link"
                  type="url"
                  placeholder="https://github.com/username/repository"
                  value={githubLink}
                  onChange={(e) => setGithubLink(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ppt-link" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Presentation Link (Google Drive/OneDrive)
                </Label>
                <Input
                  id="ppt-link"
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={pptLink}
                  onChange={(e) => setPptLink(e.target.value)}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting || round1Locked}
                onClick={handleSubmit}
              >
                {round1Locked
                  ? "Submissions are closed"
                  : isSubmitting
                    ? "Submitting..."
                    : "Submit Project"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Submission History */}
        <Card>
          <CardHeader>
            <CardTitle>Submission History</CardTitle>
            <CardDescription>All your project submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {submissions.length > 0 ? (
              <div className="space-y-4">
                {submissions.map((submission, index) => (
                  <div key={submission.id} className="rounded-lg border p-4">
                    <div className="mb-2 flex items-center justify-between">
                      <Badge variant={"secondary"}>
                        Submission no. {submissions.length - index}
                      </Badge>
                      <span className="flex items-center gap-1 text-sm text-slate-500">
                        <Clock className="h-3 w-3" />
                        {new Date(submission.submittedAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div>
                        <strong>GitHub:</strong>{" "}
                        <a
                          href={submission.githubRepo}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {submission.githubRepo}
                        </a>
                      </div>
                      <div>
                        <strong>Presentation:</strong>{" "}
                        <a
                          href={submission.presentationLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {submission.presentationLink}
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center">
                <Upload className="mx-auto mb-4 h-12 w-12 text-slate-300" />
                <p className="text-slate-500">No submissions yet</p>
                <p className="mt-2 text-sm text-slate-400">
                  Submit your project using the form above
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
