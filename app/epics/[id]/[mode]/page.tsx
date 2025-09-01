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
import { useParams } from "next/navigation";
import { useState } from "react";

// Mock Data
const mockEpic = {
  id: 101,
  title: "Cash Close Report Epic",
  description:
    "This epic covers the implementation of Cash Close Report module.",
  acceptanceCriteria:
    "All subreports should load with correct data from APIs within 2 seconds.",
  stories: [
    { id: 1001, title: "Build API for Subreport 1", storyPoints: 3 },
    { id: 1002, title: "UI for Subreport 1", storyPoints: 5 },
  ],
};

export default function EpicDetailsPage() {
  const params = useParams();
  const mode = params?.mode as "view" | "edit";
  const isEdit = mode === "edit";
  const [editMode, setEditMode] = useState(isEdit);

  return (
    <div className="container mx-auto py-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-3">
        <div>
          <p className="text-base text-muted-foreground mb-3">
            Epic ID: {mockEpic.id}
          </p>
          {editMode ? (
            <Input
              defaultValue={mockEpic.title}
              className="mt-1 font-bold w-full text-2xl h-[2.5rem]"
              style={{ fontSize: "1.5rem", height: "2.5rem" }}
            />
          ) : (
            <h1 className="text-2xl font-bold">{mockEpic.title}</h1>
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
      <div className="space-y-4 mb-3">
        <div>
          <h2 className="font-semibold">Description</h2>
          {editMode ? (
            <Textarea defaultValue={mockEpic.description} />
          ) : (
            <p>{mockEpic.description}</p>
          )}
        </div>
        <div>
          <h2 className="font-semibold">Acceptance Criteria</h2>
          {editMode ? (
            <Textarea defaultValue={mockEpic.acceptanceCriteria} />
          ) : (
            <p>{mockEpic.acceptanceCriteria}</p>
          )}
        </div>
      </div>

      {/* Subtasks */}
      <div>
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
              {mockEpic.stories.map((story, index) => (
                <TableRow key={story.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>
                    <span>{story.title}</span>
                  </TableCell>
                  <TableCell>{story.storyPoints}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Link href={`/stories/${story.id}/view`}>
                      <Button variant="ghost" size="icon">
                        <Eye className="h-4 w-4 text-blue-500" />
                      </Button>
                    </Link>
                    <Link href={`/stories/${story.id}/edit`}>
                      <Button variant="ghost" size="icon">
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </Link>
                    {/* <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
