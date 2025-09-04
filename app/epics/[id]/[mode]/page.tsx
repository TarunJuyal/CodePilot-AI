"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Eye, Save } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EpicInput } from "@/app/utils/constants";
import { toast } from "sonner";
import PageLoader from "@/app/components/page-loader";

export default function EpicDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const mode = params?.mode as "view" | "edit";
  const epicId = params?.id as string;
  const isEdit = mode === "edit";
  const [editMode, setEditMode] = useState(isEdit);
  const [epicDetails, setEpicDetails] = useState<EpicInput | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [epicChanges, setEpicChanges] = useState<Partial<EpicInput>>({});
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchEpicDetails = async () => {
      setLoading(true);
      const toastId = toast.loading("Loading epic details...");
      try {
        const res = await fetch(`/api/epics/${epicId}`);
        if (res.status === 404) {
          toast.error("Epic not found", { id: toastId });
          router.push("/not-found");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch epic details");
        }
        const data = await res.json();
        setEpicDetails(data);
        toast.success("Epic details loaded", { id: toastId });
      } catch (error: unknown) {
        console.error("Error fetching epic details:", error);
        toast.error("Failed to load epic details.", {
          id: toastId,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchEpicDetails();
  }, [mode, epicId]);

  const handleEditOrSave = async () => {
    if (editMode) {
      if (Object.keys(epicChanges).length === 0) {
        setEditMode(false);
        return;
      }
      setSaving(true);
      const toastId = toast.loading("Saving epic details...");
      try {
        const res = await fetch(`/api/epics/${epicId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            title: epicChanges?.title,
            description: epicChanges?.description,
            acceptanceCriteria: epicChanges?.acceptanceCriteria,
          }),
        });
        if (!res.ok) {
          throw new Error("Failed to save epic details");
        }
        const updatedEpic = await res.json();
        setEpicDetails(updatedEpic);
        setEpicChanges({});
        setEditMode(false);
        toast.success("Epic details saved", { id: toastId });
      } catch (error: unknown) {
        console.error("Error saving epic details:", error);
        toast.error("Failed to save epic details.", {
          id: toastId,
        });
      } finally {
        setSaving(false);
      }
    } else {
      setEditMode(true);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const toastId = toast.loading("Deleting epic");
    try {
      const res = await fetch(`/api/epics/${epicId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete epic");
      }
      toast.success("Epic deleted", { id: toastId });
      router.push(localStorage.getItem("epicParentPage") || "/");
    } catch (error: unknown) {
      console.error("Error deleting epic:", error);
      toast.error("Failed to delete epic.", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  const handleStoryDelete = (storyId: string) => async () => {
    setDeleting(true);
    const toastId = toast.loading("Deleting story");
    try {
      const res = await fetch(`/api/story/${storyId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete story");
      }
      const updatedStories = epicDetails?.stories?.filter(
        (story) => story.id !== storyId
      );
      if (epicDetails) {
        setEpicDetails({
          ...epicDetails,
          stories: updatedStories,
          id: epicDetails.id,
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

  return (
    <>
      {loading ? (
        <PageLoader />
      ) : (
        <div className="container mx-auto py-8 space-y-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-3">
            <div>
              {editMode ? (
                <Input
                  value={epicChanges?.title || epicDetails?.title || ""}
                  onChange={(e) =>
                    setEpicChanges({ ...epicChanges, title: e.target.value })
                  }
                  className="mt-1 font-bold w-3xl text-2xl h-[2.5rem] overflow-ellipsis"
                  style={{ fontSize: "1.5rem", height: "2.5rem" }}
                />
              ) : (
                <h1 className="text-2xl font-bold">{epicDetails?.title}</h1>
              )}
            </div>

            <div className="space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleEditOrSave}
                disabled={saving || deleting}
              >
                {editMode ? (
                  <Save className="h-5 w-5 text-green-500" />
                ) : (
                  <Pencil className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                disabled={saving || deleting || editMode}
                onClick={handleDelete}
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4 mb-3">
            <div>
              <h2 className="font-semibold">Description</h2>
              {editMode ? (
                <Textarea
                  value={
                    epicChanges?.description || epicDetails?.description || ""
                  }
                  onChange={(e) =>
                    setEpicChanges({
                      ...epicChanges,
                      description: e.target.value,
                    })
                  }
                  className="p-2 mt-3"
                />
              ) : (
                <pre className="w-full max-w-full overflow-x-auto whitespace-pre-wrap break-words p-2">
                  {epicDetails?.description}
                </pre>
              )}
            </div>
            <div>
              <h2 className="font-semibold">Acceptance Criteria</h2>
              {editMode ? (
                <Textarea
                  value={
                    epicChanges?.acceptanceCriteria ||
                    epicDetails?.acceptanceCriteria ||
                    ""
                  }
                  onChange={(e) =>
                    setEpicChanges({
                      ...epicChanges,
                      acceptanceCriteria: e.target.value,
                    })
                  }
                  className="p-2 mt-3"
                />
              ) : (
                <pre className="w-full max-w-full overflow-x-auto whitespace-pre-wrap break-words p-2">
                  {epicDetails?.acceptanceCriteria}
                </pre>
              )}
            </div>
          </div>

          {/* Subtasks */}
          <div>
            {epicDetails?.stories && epicDetails.stories.length > 0 && (
              <>
                <h2 className="text-lg font-semibold mb-2">Subtasks</h2>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Story Points</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {epicDetails?.stories?.map((story, index) => (
                        <TableRow key={story.id}>
                          <TableCell>{index + 1}</TableCell>
                          <TableCell>
                            <span>{story.title}</span>
                          </TableCell>
                          <TableCell>{story.storyPoints}</TableCell>
                          <TableCell className="text-right space-x-2">
                            <Link
                              href={`/stories/${story.id}/view`}
                              onClick={() =>
                                localStorage.setItem(
                                  "epicParentPage",
                                  window.location.pathname
                                )
                              }
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={saving || deleting}
                              >
                                <Eye className="h-4 w-4 text-blue-500" />
                              </Button>
                            </Link>
                            <Link
                              href={`/stories/${story.id}/edit`}
                              onClick={() =>
                                localStorage.setItem(
                                  "epicParentPage",
                                  window.location.pathname
                                )
                              }
                            >
                              <Button
                                variant="ghost"
                                size="icon"
                                disabled={saving || deleting}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                            </Link>
                            <Button
                              variant="ghost"
                              size="icon"
                              disabled={saving || deleting}
                              onClick={handleStoryDelete(story.id)}
                            >
                              <Trash2 className="h-4 w-4 text-red-500" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
