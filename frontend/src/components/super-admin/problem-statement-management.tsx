"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, FileText } from "lucide-react"
import { apiService } from "@/lib/service"
import { useToast } from "@/hooks/use-toast"
import type { ProblemStatement, ProblemStatementForm } from "@/lib/types"

interface ProblemStatementManagementProps {
  problemStatements: ProblemStatement[]
  onUpdate: () => void
}

export function ProblemStatementManagement({ problemStatements, onUpdate }: ProblemStatementManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingPS, setEditingPS] = useState<ProblemStatement | null>(null)
  const [formData, setFormData] = useState<ProblemStatementForm>({
    title: "",
    description: "",
    deliverables: [""],
    domain: "",
  })
  const { toast } = useToast()

  const domains = ["AI/ML", "Web Development", "Mobile Development", "Blockchain", "IoT", "Data Science"]

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      deliverables: [""],
      domain: "",
    })
  }

  const handleCreate = async () => {
    try {
      await apiService.createProblemStatement({
        ...formData,
        deliverables: formData.deliverables.filter((d) => d.trim() !== ""),
      })
      toast({
        title: "Success",
        description: "Problem statement created successfully",
      })
      setIsCreateOpen(false)
      resetForm()
      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create problem statement",
        variant: "destructive",
      })
    }
  }

  const handleEdit = async () => {
    if (!editingPS) return

    try {
      await apiService.updateProblemStatement(editingPS.id, {
        ...formData,
        deliverables: formData.deliverables.filter((d) => d.trim() !== ""),
      })
      toast({
        title: "Success",
        description: "Problem statement updated successfully",
      })
      setEditingPS(null)
      resetForm()
      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update problem statement",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteProblemStatement(id)
      toast({
        title: "Success",
        description: "Problem statement deleted successfully",
      })
      onUpdate()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete problem statement",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (ps: ProblemStatement) => {
    setEditingPS(ps)
    setFormData({
      title: ps.title,
      description: ps.description,
      deliverables: ps.deliverables,
      domain: ps.domain,
    })
  }

  const addDeliverable = () => {
    setFormData((prev) => ({
      ...prev,
      deliverables: [...prev.deliverables, ""],
    }))
  }

  const updateDeliverable = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d, i) => (i === index ? value : d)),
    }))
  }

  const removeDeliverable = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter((_, i) => i !== index),
    }))
  }

  const ProblemStatementForm = ({ isEdit = false }: { isEdit?: boolean }) => (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          placeholder="Enter problem statement title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">Domain</Label>
        <Select value={formData.domain} onValueChange={(value) => setFormData((prev) => ({ ...prev, domain: value }))}>
          <SelectTrigger>
            <SelectValue placeholder="Select domain" />
          </SelectTrigger>
          <SelectContent>
            {domains.map((domain) => (
              <SelectItem key={domain} value={domain}>
                {domain}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          placeholder="Enter detailed description"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Deliverables</Label>
        {formData.deliverables.map((deliverable, index) => (
          <div key={index} className="flex gap-2">
            <Input
              value={deliverable}
              onChange={(e) => updateDeliverable(index, e.target.value)}
              placeholder={`Deliverable ${index + 1}`}
            />
            {formData.deliverables.length > 1 && (
              <Button type="button" variant="outline" size="sm" onClick={() => removeDeliverable(index)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button type="button" variant="outline" size="sm" onClick={addDeliverable}>
          <Plus className="h-4 w-4 mr-2" />
          Add Deliverable
        </Button>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Problem Statement Management</h2>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Add Problem Statement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Problem Statement</DialogTitle>
              <DialogDescription>Add a new problem statement for participants to select</DialogDescription>
            </DialogHeader>
            <ProblemStatementForm />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreate}>Create Problem Statement</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Problem Statements
          </CardTitle>
          <CardDescription>Manage all problem statements and their details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {problemStatements.map((ps) => (
              <Card key={ps.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{ps.title}</CardTitle>
                      <CardDescription className="mt-1">{ps.description}</CardDescription>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{ps.domain}</Badge>
                        <Badge variant="secondary">{ps.selectedCount} selections</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog open={editingPS?.id === ps.id} onOpenChange={(open) => !open && setEditingPS(null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" variant="outline" onClick={() => openEditDialog(ps)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Problem Statement</DialogTitle>
                            <DialogDescription>Update the problem statement details</DialogDescription>
                          </DialogHeader>
                          <ProblemStatementForm isEdit />
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setEditingPS(null)}>
                              Cancel
                            </Button>
                            <Button onClick={handleEdit}>Update Problem Statement</Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button size="sm" variant="destructive" onClick={() => handleDelete(ps.id)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
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
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
