"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Upload, Github, FileText, CheckCircle, Clock } from "lucide-react"
import { apiService } from "@/lib/service"
import { useToast } from "@/hooks/use-toast"

interface Submission {
  id: string
  githubLink: string
  pptLink: string
  submittedAt: string
  status: "submitted" | "pending" | "reviewed"
}

interface SubmissionsTabProps {
  teamId: string
  submissions: Submission[]
  onSubmissionUpdate: () => void
}

export function SubmissionsTab({ teamId, submissions, onSubmissionUpdate }: SubmissionsTabProps) {
  const [githubLink, setGithubLink] = useState("")
  const [pptLink, setPptLink] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!githubLink.trim() || !pptLink.trim()) {
      toast({
        title: "Error",
        description: "Please provide both GitHub and PPT links",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      await apiService.submitProject(githubLink, pptLink)
      toast({
        title: "Success",
        description: "Project submitted successfully",
      })
      setGithubLink("")
      setPptLink("")
      onSubmissionUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit project",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const latestSubmission = submissions[0]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Project Submissions</h2>
        <Badge variant="outline">
          {submissions.length} submission{submissions.length !== 1 ? "s" : ""}
        </Badge>
      </div>

      {/* Submission Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Submit Your Project
          </CardTitle>
          <CardDescription>Submit your GitHub repository and presentation links for evaluation</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-link" className="flex items-center gap-2">
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
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Submitting..." : "Submit Project"}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Latest Submission Status */}
      {latestSubmission && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            <strong>Latest Submission:</strong> Submitted on {new Date(latestSubmission.submittedAt).toLocaleString()}
            <br />
            Status:{" "}
            <Badge variant="outline" className="ml-1">
              {latestSubmission.status}
            </Badge>
          </AlertDescription>
        </Alert>
      )}

      {/* Submission History */}
      <Card>
        <CardHeader>
          <CardTitle>Submission History</CardTitle>
          <CardDescription>All your project submissions</CardDescription>
        </CardHeader>
        <CardContent>
          {submissions.length > 0 ? (
            <div className="space-y-4">
              {submissions.map((submission) => (
                <div key={submission.id} className="p-4 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant={submission.status === "submitted" ? "default" : "secondary"}>
                      {submission.status}
                    </Badge>
                    <span className="text-sm text-slate-500 flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(submission.submittedAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>GitHub:</strong>{" "}
                      <a
                        href={submission.githubLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {submission.githubLink}
                      </a>
                    </div>
                    <div>
                      <strong>Presentation:</strong>{" "}
                      <a
                        href={submission.pptLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {submission.pptLink}
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Upload className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No submissions yet</p>
              <p className="text-sm text-slate-400 mt-2">Submit your project using the form above</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
