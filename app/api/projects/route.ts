import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { Story, Epic } from "@/lib/generated/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { project } = body;

    if (!project?.name) {
      return NextResponse.json(
        { error: "Project name is required" },
        { status: 400 }
      );
    }

    const savedProject = await prisma.project.create({
      data: {
        name: project.name,
        userId: session.user.id,
        epics: {
          create: project?.epics?.map((epic: Epic & { stories?: Story[] }) => ({
            title: epic?.title,
            description: epic?.description,
            acceptanceCriteria: epic?.acceptanceCriteria,
            stories: {
              create: epic?.stories?.map((story: Story) => ({
                title: story?.title,
                description: story?.description,
                acceptanceCriteria: story?.acceptanceCriteria,
                storyPoints: story?.storyPoints,
              })),
            },
          })),
        },
      },
      include: { epics: { include: { stories: true } } },
    });

    return NextResponse.json(savedProject, { status: 201 });
  } catch (err: unknown) {
    console.error("Save Project API error:", err);
    return NextResponse.json(
      { error: "Failed to save project", details: err },
      { status: 500 }
    );
  }
}

export async function GET(_req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        createdAt: true,
      },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (err: unknown) {
    console.error("Get Projects API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 }
    );
  }
}
