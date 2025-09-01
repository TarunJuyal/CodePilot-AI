"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Save, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";

// Mock Data
const mockStory = {
  id: 1001,
  title: "Build API for Subreport 1",
  description: "Develop a Java Spring Boot REST API for Subreport 1.",
  acceptanceCriteria:
    "API should return correct JSON schema with valid data for subreport 1.",
  storyPoints: 3,
};

export default function StoryDetailsPage() {
  const params = useParams();
  const mode = params?.mode as "view" | "edit";
  const isEdit = mode === "edit";
  const [editMode, setEditMode] = useState(isEdit);

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-sm text-muted-foreground mb-3">
            Story ID: {mockStory.id}
          </p>
          {editMode ? (
            <Input
              defaultValue={mockStory.title}
              className="mt-1 font-bold w-full text-2xl h-[2.5rem]"
              style={{ fontSize: "1.5rem", height: "2.5rem" }}
            />
          ) : (
            <h1 className="text-2xl font-bold">{mockStory.title}</h1>
          )}
        </div>

        <div className="space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? (
              <Save className="h-5 w-5 text-green-500" />
            ) : (
              <Pencil className="h-5 w-5" />
            )}
          </Button>
          {/* <Button variant="ghost" size="icon">
            <Trash2 className="h-5 w-5 text-red-500" />
          </Button> */}
        </div>
      </div>

      {/* Info */}
      <div className="space-y-4">
        <div>
          <h2 className="font-semibold">Description</h2>
          {editMode ? (
            <Textarea defaultValue={mockStory.description} />
          ) : (
            <p>{mockStory.description}</p>
          )}
        </div>
        <div>
          <h2 className="font-semibold">Acceptance Criteria</h2>
          {editMode ? (
            <Textarea defaultValue={mockStory.acceptanceCriteria} />
          ) : (
            <p>{mockStory.acceptanceCriteria}</p>
          )}
        </div>
        <div>
          <h2 className="font-semibold">Story Points</h2>
          {editMode ? (
            <Input
              type="number"
              defaultValue={mockStory.storyPoints}
              className="mt-1 w-13"
            />
          ) : (
            <p>{mockStory.storyPoints} points</p>
          )}
        </div>
      </div>
    </div>
  );
}
