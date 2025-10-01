"use client";

import React, { useEffect, useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
import { Edit, FileText, Lock, Plus, Trash2, Unlock } from "lucide-react";
import { apiService } from "@/lib/service";
import { useToast } from "@/hooks/use-toast";
import type {
  Domain,
  ProblemStatement,
  ProblemStatementForm,
} from "@/lib/types";
import { Switch } from "@/components/ui/switch";

interface ProblemStatementManagementProps {
  problemStatements: ProblemStatement[];
  psLocked: boolean;
  onUpdateAction: () => Promise<void>;
  onToggleAction: (locked: boolean) => Promise<void>;
}

interface ProblemStatementFormProps {
  formData: ProblemStatementForm;
  setFormData: React.Dispatch<React.SetStateAction<ProblemStatementForm>>;
  domains: Domain[];
  selectedDomain: string;
}

async function getDomains() {
  return apiService.getDomains();
}

function ProblemStatementForm({
  formData,
  setFormData,
  domains,
  selectedDomain,
}: ProblemStatementFormProps) {
  const addDeliverable = () => {
    setFormData((prev) => ({
      ...prev,
      deliverables: [
        ...prev.deliverables,
        { id: String(prev.deliverables.length), value: "" },
      ],
    }));
  };

  const updateDeliverable = (id: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.map((d) =>
        d.id === id ? { ...d, value } : d,
      ),
    }));
  };

  const removeDeliverable = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      deliverables: prev.deliverables.filter((d) => d.id !== id),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          placeholder="Enter problem statement title"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="domain">Domain</Label>
        <Select
          value={selectedDomain}
          onValueChange={(value) =>
            setFormData((prev) => ({ ...prev, domain: value }))
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select domain" />
          </SelectTrigger>
          <SelectContent>
            {domains.map((domain) => (
              <SelectItem key={domain.id} value={domain.name}>
                {domain.name}
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
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          placeholder="Enter detailed description"
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label>Deliverables</Label>
        {formData.deliverables.map((deliverable, index) => (
          <div key={deliverable.id} className="flex gap-2">
            <Input
              value={deliverable.value}
              onChange={(e) =>
                updateDeliverable(deliverable.id, e.target.value)
              }
              placeholder={`Deliverable ${index + 1}`}
            />
            {formData.deliverables.length > 1 && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeDeliverable(deliverable.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addDeliverable}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Deliverable
        </Button>
      </div>
    </div>
  );
}

export function ProblemStatementManagement({
  problemStatements,
  psLocked,
  onUpdateAction,
  onToggleAction,
}: ProblemStatementManagementProps) {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingPS, setEditingPS] = useState<ProblemStatement | null>(null);
  const [domains, setDomains] = useState<Domain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [formData, setFormData] = useState<ProblemStatementForm>({
    title: "",
    description: "",
    deliverables: [],
    domainId: "",
    domain: "",
  });
  const { toast } = useToast();

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      deliverables: [],
      domain: "",
      domainId: "",
    });
  };

  useEffect(() => {
    getDomains().then((data) => {
      setDomains(data);
      const domain = data.find((d) => d.id === formData.domainId);
      if (domain) {
        setSelectedDomain(domain.name);
      }
    } );
  }, [formData.domainId]);

  useEffect(() => {
    if (formData.domain) {
      formData.domainId = domains.map((d => d.name))
        .indexOf(formData.domain) !== -1
        ? domains.find(d => d.name === formData.domain)!.id
        : "";
      setSelectedDomain(formData.domain);
    }
  }, [domains, formData]);

  const handleCreate = async () => {
    try {
      await apiService.createProblemStatement(formData);
      toast({
        title: "Success",
        description: "Problem statement created successfully",
      });
      setIsCreateOpen(false);
      resetForm();
      await onUpdateAction();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to create problem statement",
        variant: "destructive",
      });
    }
  };

  const handleEdit = async () => {
    if (!editingPS) return;

    try {
      await apiService.updateProblemStatement(editingPS.id, formData);
      toast({
        title: "Success",
        description: "Problem statement updated successfully",
      });
      setEditingPS(null);
      setIsEditDialogOpen(false);
      resetForm();
      await onUpdateAction();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to update problem statement",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await apiService.deleteProblemStatement(id);
      toast({
        title: "Success",
        description: "Problem statement deleted successfully",
      });
      await onUpdateAction();
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to delete problem statement",
        variant: "destructive",
      });
    }
  };

  const openEditDialog = (ps: ProblemStatement) => {
    setEditingPS(ps);
    setFormData({
      title: ps.title,
      description: ps.description,
      deliverables: ps.deliverables.map((d, i) => ({
        id: String(i),
        value: d,
      })),
      domain: ps.domain.name,
      domainId: ps.domain.id,
    });
    setIsEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Problem Statement Management</h2>
        <div className="flex flex-row gap-4 items-center">
          <div className="flex w-fit items-center space-x-2">
            <Switch
              id="ps-lock"
              checked={psLocked}
              onCheckedChange={onToggleAction}
            />
            <Label
              htmlFor="ps-lock"
              className="flex items-center gap-2 text-sm"
            >
              {psLocked ? (
                <Lock className="h-4 w-4" />
              ) : (
                <Unlock className="h-4 w-4" />
              )}
              {psLocked ? "Locked" : "Unlocked"}
            </Label>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button onClick={resetForm}>
                <Plus className="mr-2 h-4 w-4" />
                Add Problem Statement
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Problem Statement</DialogTitle>
                <DialogDescription>
                  Add a new problem statement for participants to select
                </DialogDescription>
              </DialogHeader>
              <ProblemStatementForm
                formData={formData}
                setFormData={setFormData}
                domains={domains}
                selectedDomain={selectedDomain}
              />
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsCreateOpen(false)}
                >
                  Cancel
                </Button>
                <Button onClick={handleCreate}>Create Problem Statement</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Problem Statements
          </CardTitle>
          <CardDescription>
            Manage all problem statements and their details
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {problemStatements.map((ps) => (
              <Card key={ps.id} className="border-l-4 border-l-blue-500">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{ps.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {ps.description}
                      </CardDescription>
                      <div className="mt-2 flex items-center gap-2">
                        <Badge variant="outline">{ps.domain.name}</Badge>
                        <Badge variant="secondary">
                          {ps.selectedCount} selections
                        </Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Dialog
                        open={isEditDialogOpen}
                        onOpenChange={(open) => {
                          if (!open) {
                            setIsEditDialogOpen(false);
                            setEditingPS(null); // reset when closing
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openEditDialog(ps)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>Edit Problem Statement</DialogTitle>
                            <DialogDescription>
                              Update the problem statement details
                            </DialogDescription>
                          </DialogHeader>
                          <ProblemStatementForm
                            formData={formData}
                            setFormData={setFormData}
                            domains={domains}
                            selectedDomain={selectedDomain}
                          />
                          <DialogFooter>
                            <Button
                              variant="outline"
                              onClick={() => setIsEditDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button onClick={handleEdit}>
                              Update Problem Statement
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDelete(ps.id)}
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div>
                    <Label className="text-sm font-medium">Deliverables:</Label>
                    <ul className="mt-1 list-inside list-disc text-sm text-slate-600">
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
  );
}
