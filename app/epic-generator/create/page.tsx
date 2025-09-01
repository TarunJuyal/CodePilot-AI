"use client";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import useLoadingDots from "../../hooks/useLoadingMessage";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

export default function CreateEpicPage() {
  const loadingMessage = useLoadingDots(
    "Analyzing requirements and breaking down features into epics and tasks"
  );

  const [loading, setLoading] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [requirementInput, setRequirementInput] = useState("");
  const [epicOutput, setEpicOutput] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [saveConfirmed, setSaveConfirmed] = useState(false);

  const handleSubmit = () => {
    console.log("Generating epics for project:", projectName);
    console.log("Requirements:", requirementInput);

    setLoading(true);
    setTimeout(() => {
      setEpicOutput("✅ Mock generated epics go here...");
      setLoading(false);
    }, 3000);
  };

  const handleSaveConfirmed = () => {
    console.log("Saving project:", projectName);
    console.log("Requirements:", requirementInput);
    console.log("Generated Epics:", epicOutput);
    setSaveConfirmed(true);
    setConfirmOpen(false);
    const toastId = toast.loading("Saving project and epics...");

    setTimeout(() => {
      setSaveConfirmed(false);
      toast.success("Project and Epics saved successfully!", {
        id: toastId,
      });
    }, 2000);
  };

  return (
    <div className="h-dvh flex flex-col">
      {/* Header Section */}
      <div className="p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold">Generate Epics for Your Project</h1>
        <div className="flex gap-3">
          <Button
            variant="secondary"
            onClick={handleSubmit}
            disabled={!projectName || !requirementInput}
          >
            Generate Epics from Requirements
          </Button>

          {/* Save Button triggers confirmation */}
          <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
            <AlertDialogTrigger asChild>
              <Button
                variant="default"
                disabled={!projectName || !epicOutput || saveConfirmed}
              >
                {saveConfirmed ? "Saving the Epics" : "Save Generated Epics"}
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Save</AlertDialogTitle>
                <AlertDialogDescription>
                  Save project{" "}
                  <span className="font-semibold">{projectName}</span> and its
                  generated epics to the database?
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleSaveConfirmed}>
                  Yes, Save
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Main Section */}
      <div className="flex flex-col lg:flex-row h-9/12">
        {/* Left: Project Details & Requirements Input */}
        <div className="flex flex-col flex-1 p-4">
          <h2 className="text-lg font-semibold mb-2">Project Name</h2>
          <Input
            placeholder="Enter project name..."
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            className="mb-4"
          />

          <h2 className="text-lg font-semibold mb-2">Project Requirements</h2>
          <Textarea
            className="flex-1 resize-none h-full"
            placeholder="Enter your project requirements here..."
            value={requirementInput}
            onChange={(e) => setRequirementInput(e.target.value)}
          />
        </div>

        {/* Right: Epic Output */}
        <div className="flex flex-col flex-1 p-4">
          <h2 className="text-lg font-semibold mb-2">Generated Epics</h2>
          <Textarea
            className="flex-1 resize-none h-full"
            placeholder={
              loading
                ? loadingMessage
                : "AI generated epics will appear here..."
            }
            value={epicOutput}
            onChange={(e) => setEpicOutput(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
