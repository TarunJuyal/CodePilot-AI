"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash2, Eye } from "lucide-react";
import Link from "next/link";

type Project = {
  id: number;
  name: string;
  createdAt: string;
};

const mockProjects: Project[] = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  name: `Project ${i + 1}`,
  createdAt: `2025-08-${(i % 28) + 1}`,
}));

export default function EpicGeneratorPage() {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [currentPage, setCurrentPage] = useState(1);

  const pageSize = 7;
  const totalPages = Math.ceil(projects.length / pageSize);

  const paginatedProjects = projects.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Generate Epics for Your Project</h1>
        <Button>
          <Link href="/epic-generator/create">Add Project</Link>
        </Button>
      </div>

      {/* Conditional Rendering */}
      {projects.length === 0 ? (
        <p className="text-2xl text-muted-foreground text-center mt-30">
          No current projects. Click on the{" "}
          <span className="font-semibold">Add Project</span> button to Start
          your First Project.
        </p>
      ) : (
        <div className="rounded-md border">
          <Table className="text-center">
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/12 text-center">#</TableHead>
                <TableHead className="w-1/3 text-center">
                  Project Name
                </TableHead>
                <TableHead className="w-1/4 text-center">Created At</TableHead>
                <TableHead className="text-right w-1/2 pr-15">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedProjects.map((project, index) => (
                <TableRow key={project.id}>
                  <TableCell>
                    {(currentPage - 1) * pageSize + index + 1}
                  </TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>{project.createdAt}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Pagination Controls */}
          <div className="flex justify-between items-center p-4">
            <Button
              variant="outline"
              size="sm"
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
