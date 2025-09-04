"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter, useParams, redirect } from "next/navigation";
import { ProjectInput } from "@/app/utils/constants";
import PageLoader from "@/app/components/page-loader";

export default function ProjectDetailsPage() {
  const params = useParams();
  const projectId = params?.id;
  const router = useRouter();
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projectDetails, setProjectDetails] = useState<ProjectInput | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);

  if (!projectId) {
    redirect("/projects");
  }

  useEffect(() => {
    const fetchProjectDetails = async () => {
      setLoading(true);
      const toastId = toast.loading("Loading project details...");
      try {
        const res = await fetch(`/api/projects/${projectId}`);
        if (res.status === 404) {
          toast.error("Project not found", { id: toastId });
          router.push("/not-found");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch project details");
        }
        const data = await res.json();
        setProjectDetails(data);
        toast.success("Project details loaded", { id: toastId });
      } catch (error: unknown) {
        console.error("Failed to fetch project details", error);
        toast.error("Failed to load project details", { id: toastId });
        redirect("/projects");
      } finally {
        setLoading(false);
      }
    };
    fetchProjectDetails();
  }, [projectId]);

  const handleStoryDelete = (storyId: string) => async () => {
    if (deleting) return;
    setDeleting(true);
    const toastId = toast.loading("Deleting story");
    try {
      const res = await fetch(`/api/story/${storyId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete story");
      }
      const updatedEpics = projectDetails?.epics?.map((epic) => ({
        ...epic,
        stories: epic.stories?.filter((story) => story.id !== storyId),
      }));

      if (projectDetails) {
        setProjectDetails({
          ...projectDetails,
          epics: updatedEpics,
          id: projectDetails.id,
        });
      }
      toast.success("Story deleted", { id: toastId });
    } catch (error: unknown) {
      console.error("Error deleting story:", error);
      toast.error("Failed to delete story.", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  const handleEpicDelete = (epicId: string) => async () => {
    setDeleting(true);
    const toastId = toast.loading("Deleting epic");
    try {
      const res = await fetch(`/api/epics/${epicId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete epic");
      }
      const updatedEpics = projectDetails?.epics?.filter(
        (epic) => epic.id !== epicId
      );
      setProjectDetails({
        ...projectDetails!,
        epics: updatedEpics,
        id: projectDetails!.id,
      });
      toast.success("Epic deleted", { id: toastId });
    } catch (error: unknown) {
      console.error("Error deleting epic:", error);
      toast.error("Failed to delete epic.", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  const onExport = async () => {
    setExporting(true);
    const toastId = toast.loading("Exporting to PDF...");

    try {
      const res = await fetch(`/api/projects/${projectId}/export`);
      if (res.status === 404) {
        toast.error("Project not found", { id: toastId });
        return;
      }
      if (!res.ok) throw new Error("Failed to export PDF");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${projectDetails?.name}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast.success("Exported to PDF successfully", { id: toastId });
    } catch (err) {
      console.error("Export failed", err);
      toast.error("Failed to export to PDF", { id: toastId });
    } finally {
      setExporting(false);
    }
  };

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <div className="container mx-auto py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{projectDetails?.name}</h1>
            <Button
              variant="outline"
              onClick={onExport}
              disabled={exporting || deleting}
            >
              {exporting ? "Exporting" : "Export to PDF"}
            </Button>
          </div>

          {/* Epics Accordion */}
          <Accordion type="single" collapsible className="w-full">
            {projectDetails?.epics?.map((epic, epicIndex) => (
              <AccordionItem key={epic.id} value={`epic-${epic.id}`}>
                <AccordionTrigger>
                  <div className="flex items-center gap-4 w-full">
                    <div className="flex items-center gap-3 flex-1">
                      <span className="font-mono w-6">{epicIndex + 1}.</span>
                      <span>{epic.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span
                        role="button"
                        tabIndex={0}
                        className="p-2 rounded hover:bg-accent focus:outline-none"
                        onClick={(e) => {
                          if (deleting) return;
                          e.stopPropagation();
                          localStorage.setItem(
                            "epicParentPage",
                            window.location.pathname
                          );
                          router.push(`/epics/${epic.id}/view`);
                        }}
                        aria-disabled={deleting}
                        style={
                          deleting
                            ? { pointerEvents: "none", opacity: 0.5 }
                            : {}
                        }
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        className="p-2 rounded hover:bg-accent focus:outline-none"
                        onClick={(e) => {
                          if (deleting) return;
                          e.stopPropagation();
                          localStorage.setItem(
                            "epicParentPage",
                            window.location.pathname
                          );
                          router.push(`/epics/${epic.id}/edit`);
                        }}
                        aria-disabled={deleting}
                        style={
                          deleting
                            ? { pointerEvents: "none", opacity: 0.5 }
                            : {}
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        className="p-2 rounded hover:bg-accent focus:outline-none"
                        onClick={handleEpicDelete(epic.id)}
                        aria-disabled={deleting}
                        style={
                          deleting
                            ? { pointerEvents: "none", opacity: 0.5 }
                            : {}
                        }
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-2 pl-10">
                    {epic?.stories?.map((story, storyIndex) => (
                      <div
                        key={story.id}
                        className="flex justify-between items-center py-2"
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono w-6">
                            {epicIndex + 1}.{storyIndex + 1}
                          </span>
                          <span>{story.title}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {story.storyPoints} points
                          </span>
                          <span
                            role="button"
                            tabIndex={0}
                            className="p-2 rounded hover:bg-accent focus:outline-none"
                            onClick={() => {
                              if (deleting) return;
                              localStorage.setItem(
                                "epicParentPage",
                                window.location.pathname
                              );
                              router.push(`/stories/${story.id}/view`);
                            }}
                            aria-disabled={deleting}
                            style={
                              deleting
                                ? { pointerEvents: "none", opacity: 0.5 }
                                : {}
                            }
                          >
                            <Eye className="h-4 w-4 text-blue-500" />
                          </span>
                          <span
                            role="button"
                            tabIndex={0}
                            className="p-2 rounded hover:bg-accent focus:outline-none"
                            onClick={() => {
                              if (deleting) return;
                              localStorage.setItem(
                                "epicParentPage",
                                window.location.pathname
                              );
                              router.push(`/stories/${story.id}/edit`);
                            }}
                            aria-disabled={deleting}
                            style={
                              deleting
                                ? { pointerEvents: "none", opacity: 0.5 }
                                : {}
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </span>
                          <span
                            role="button"
                            tabIndex={0}
                            className="p-2 rounded hover:bg-accent focus:outline-none"
                            onClick={handleStoryDelete(story.id)}
                            aria-disabled={deleting}
                            style={
                              deleting
                                ? { pointerEvents: "none", opacity: 0.5 }
                                : {}
                            }
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      )}
    </>
  );
}
