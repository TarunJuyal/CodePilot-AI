"use client";

import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Eye, Pencil, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

// Mock data
const mockProject = {
  id: 1,
  name: "Reporting Project",
  epics: [
    {
      id: 101,
      title: "Cash Close Report",
      stories: [
        { id: 1001, title: "Build API for Subreport 1", storyPoints: 3 },
        { id: 1002, title: "UI for Subreport 1", storyPoints: 5 },
      ],
    },
    {
      id: 102,
      title: "Realtime Report",
      stories: [
        { id: 2001, title: "Backend service for streaming", storyPoints: 8 },
        { id: 2002, title: "Frontend React integration", storyPoints: 5 },
      ],
    },
  ],
};

export default function ProjectDetailsPage() {
  const router = useRouter();
  const [exporting, setExporting] = useState(false);

  const onExport = () => {
    console.log("Export to PDF clicked");
    setExporting(true);
    const toastId = toast.loading("Exporting to PDF...");

    setTimeout(() => {
      setExporting(false);
      toast.success("Exported to PDF successfully!", { id: toastId });
    }, 2000);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{mockProject.name}</h1>
        <Button variant="outline" onClick={onExport} disabled={exporting}>
          {exporting ? "Exporting" : "Export to PDF"}
        </Button>
      </div>

      {/* Epics Accordion */}
      <Accordion type="single" collapsible className="w-full">
        {mockProject.epics.map((epic, epicIndex) => (
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
                      e.stopPropagation();
                      router.push(`/epics/${epic.id}/view`);
                    }}
                  >
                    <Eye className="h-4 w-4 text-blue-500" />
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    className="p-2 rounded hover:bg-accent focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      router.push(`/epics/${epic.id}/edit`);
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </span>
                  {/* <span
                    role="button"
                    tabIndex={0}
                    className="p-2 rounded hover:bg-accent focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      // handle delete
                    }}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </span> */}
                </div>
              </div>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-2 pl-10">
                {epic.stories.map((story, storyIndex) => (
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
                        onClick={() => router.push(`/stories/${story.id}/view`)}
                      >
                        <Eye className="h-4 w-4 text-blue-500" />
                      </span>
                      <span
                        role="button"
                        tabIndex={0}
                        className="p-2 rounded hover:bg-accent focus:outline-none"
                        onClick={() => router.push(`/stories/${story.id}/edit`)}
                      >
                        <Pencil className="h-4 w-4" />
                      </span>
                      {/* <span
                        role="button"
                        tabIndex={0}
                        className="p-2 rounded hover:bg-accent focus:outline-none"
                        onClick={() => {
                          // handle delete
                        }}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </span> */}
                    </div>
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
