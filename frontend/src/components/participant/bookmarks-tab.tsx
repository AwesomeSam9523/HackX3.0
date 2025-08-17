"use client"

import { Label } from "@/components/ui/label"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, Trash2 } from "lucide-react"
import { apiService } from "@/lib/service"
import { useToast } from "@/hooks/use-toast"
import type { ProblemStatement } from "@/lib/types"

interface BookmarksTabProps {
  bookmarkedPS: string[]
  allProblemStatements: ProblemStatement[]
  onBookmarkUpdate: (psId: string) => void
}

export function BookmarksTab({ bookmarkedPS, allProblemStatements, onBookmarkUpdate }: BookmarksTabProps) {
  const { toast } = useToast()

  const bookmarkedStatements = allProblemStatements.filter((ps) => bookmarkedPS.includes(ps.id))

  const handleRemoveBookmark = async (psId: string) => {
    try {
      await apiService.bookmarkProblemStatement(psId)
      onBookmarkUpdate(psId)
      toast({
        title: "Success",
        description: "Bookmark removed",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove bookmark",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Bookmarked Problem Statements</h2>
        <Badge variant="outline" className="bg-yellow-50">
          <Star className="h-3 w-3 mr-1 fill-yellow-400 text-yellow-400" />
          {bookmarkedStatements.length} bookmarked
        </Badge>
      </div>

      <div className="space-y-4">
        {bookmarkedStatements.length > 0 ? (
          bookmarkedStatements.map((ps) => (
            <Card key={ps.id} className="border-l-4 border-l-yellow-500">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      {ps.title}
                    </CardTitle>
                    <CardDescription className="mt-2">{ps.description}</CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">{ps.domain}</Badge>
                      <Badge variant="secondary">{ps.selectedCount} teams selected</Badge>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => handleRemoveBookmark(ps.id)}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Remove
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div>
                  <Label className="text-sm font-medium">Deliverables:</Label>
                  <ul className="mt-1 list-disc list-inside text-sm text-slate-600">
                    {ps.deliverables.map((deliverable, index) => (
                      <li key={index}>{deliverable}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <Star className="h-12 w-12 mx-auto text-slate-300 mb-4" />
              <p className="text-slate-500">No bookmarked problem statements</p>
              <p className="text-sm text-slate-400 mt-2">
                Bookmark problem statements from the Problem Statements tab to save them here
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
