"use client";

import PageLoader from "@/app/components/page-loader";
import { StoryInput } from "@/app/utils/constants";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save, Trash2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function StoryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const mode = params?.mode as "view" | "edit";
  const storyId = params?.id as string;
  const isEdit = mode === "edit";
  const [editMode, setEditMode] = useState(isEdit);
  const [storyDetails, setStoryDetails] = useState<StoryInput | null>(null);
  const [storyChanges, setStoryChanges] = useState<Partial<StoryInput>>({});
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchStoryDetails = async () => {
      setLoading(true);
      const toastId = toast.loading("Loading story details");
      try {
        const res = await fetch(`/api/story/${storyId}`);
        if (res.status === 404) {
          toast.error("Story not found", { id: toastId });
          router.push("/not-found");
        }
        if (!res.ok) {
          throw new Error("Failed to fetch story details");
        }
        const data = await res.json();
        setStoryDetails(data);
        toast.success("Story details loaded", { id: toastId });
      } catch (error: unknown) {
        console.error("Error fetching story details:", error);
        toast.error("Failed to load story details.", { id: toastId });
      } finally {
        setLoading(false);
      }
    };
    fetchStoryDetails();
  }, [mode, storyId]);

  const handleSaveOrEdit = async () => {
    if (editMode) {
      if (Object.keys(storyChanges).length > 0) {
        setSaving(true);
        const toastId = toast.loading("Saving story changes");
        try {
          const res = await fetch(`/api/story/${storyId}`, {
            method: "PATCH",
            body: JSON.stringify({
              title: storyChanges?.title,
              description: storyChanges?.description,
              acceptanceCriteria: storyChanges?.acceptanceCriteria,
              storyPoints: storyChanges?.storyPoints,
            }),
          });
          if (!res.ok) {
            throw new Error("Failed to save story changes");
          }
          const updatedStory = await res.json();
          setStoryDetails(updatedStory);
          setStoryChanges({});
          setEditMode(false);
          toast.success("Story changes saved", { id: toastId });
        } catch (error: unknown) {
          console.error("Error saving story changes:", error);
          toast.error("Failed to save story changes.", { id: toastId });
        } finally {
          setSaving(false);
        }
      } else {
        setEditMode(false);
      }
    } else {
      setEditMode(true);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    const toastId = toast.loading("Deleting story");
    try {
      const res = await fetch(`/api/story/${storyId}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete story");
      }
      toast.success("Story deleted", { id: toastId });
      router.push(localStorage.getItem("epicParentPage") || "/");
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
                  value={storyChanges?.title || storyDetails?.title || ""}
                  onChange={(e) =>
                    setStoryChanges({ ...storyChanges, title: e.target.value })
                  }
                  className="mt-1 font-bold w-3xl text-2xl h-[2.5rem] overflow-ellipsis"
                  style={{ fontSize: "1.5rem", height: "2.5rem" }}
                />
              ) : (
                <h1 className="text-2xl font-bold">{storyDetails?.title}</h1>
              )}
            </div>

            <div className="space-x-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSaveOrEdit}
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
                disabled={saving || editMode || deleting}
                onClick={handleDelete}
              >
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-4">
            <div>
              <h2 className="font-semibold">Description</h2>
              {editMode ? (
                <Textarea
                  value={
                    storyChanges?.description || storyDetails?.description || ""
                  }
                  onChange={(e) =>
                    setStoryChanges({
                      ...storyChanges,
                      description: e.target.value,
                    })
                  }
                  className="p-2 mt-3"
                />
              ) : (
                <pre className="w-full max-w-full overflow-x-auto whitespace-pre-wrap break-words p-2">
                  {storyDetails?.description}
                </pre>
              )}
            </div>
            <div>
              <h2 className="font-semibold">Acceptance Criteria</h2>
              {editMode ? (
                <Textarea
                  value={
                    storyChanges?.acceptanceCriteria ||
                    storyDetails?.acceptanceCriteria ||
                    ""
                  }
                  onChange={(e) =>
                    setStoryChanges({
                      ...storyChanges,
                      acceptanceCriteria: e.target.value,
                    })
                  }
                  className="p-2 mt-3"
                />
              ) : (
                <pre className="w-full max-w-full overflow-x-auto whitespace-pre-wrap break-words p-2">
                  {storyDetails?.acceptanceCriteria}
                </pre>
              )}
            </div>
            <div>
              <h2 className="font-semibold">Story Points</h2>
              {editMode ? (
                <Input
                  type="number"
                  value={
                    storyChanges?.storyPoints || storyDetails?.storyPoints || 0
                  }
                  onChange={(e) =>
                    setStoryChanges({
                      ...storyChanges,
                      storyPoints: Number(e.target.value),
                    })
                  }
                  className="mt-1 w-13"
                />
              ) : (
                <p className="w-full max-w-full overflow-x-auto whitespace-pre-wrap break-words p-2">
                  {storyDetails?.storyPoints} points
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
