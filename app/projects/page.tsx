"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Project } from "@/lib/generated/prisma";
import { toast } from "sonner";
import PageLoader from "../components/page-loader";
import { PAGE_SIZE } from "../utils/constants";

interface ProjectResponse {
  projects: Project[];
  total: number;
  currentPage: number;
  totalPages: number;
}

export default function EpicGeneratorPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      const toastId = toast.loading("Loading projects...");
      try {
        const res = await fetch(`/api/projects?currentPage=${currentPage}`);
        if (!res.ok) throw new Error("Failed to fetch projects");

        const data: ProjectResponse = await res.json();
        setProjects(data?.projects);
        setTotalPages(data?.totalPages);
        toast.success("Projects loaded successfully", {
          id: toastId,
        });
      } catch (err) {
        console.error("Error fetching projects:", err);
        toast.error("Error loading projects", {
          id: toastId,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, [currentPage]);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  const handleDelete = async (projectId: string) => {
    if (deleting) return;
    setDeleting(true);
    const toastId = toast.loading("Deleting project...");
    try {
      const res = await fetch(`/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete project");
      setProjects((prev) => prev?.filter((p) => p.id !== projectId));
      toast.success("Project deleted successfully", { id: toastId });
    } catch (err) {
      console.error("Error deleting project:", err);
      toast.error("Error deleting project", { id: toastId });
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Generate Epics for Your Project</h1>
        <Button>
          <Link href="/projects/create">Add Project</Link>
        </Button>
      </div>

      {loading ? (
        <PageLoader />
      ) : projects?.length === 0 ? (
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
              {projects?.map((project, index) => (
                <TableRow key={project.id}>
                  <TableCell>
                    {(currentPage - 1) * PAGE_SIZE + index + 1}
                  </TableCell>
                  <TableCell>{project.name}</TableCell>
                  <TableCell>
                    {new Date(project.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => router.push(`/projects/${project.id}`)}
                      disabled={deleting}
                    >
                      <Eye className="h-4 w-4 text-blue-500" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(project.id)}
                      disabled={deleting}
                    >
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
