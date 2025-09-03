import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { RouteParams } from "@/app/utils/constants";

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const id = (await params).id;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const story = await prisma.story.findUnique({
      where: { id },
      include: {
        epic: { include: { project: true } },
      },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (story.epic.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(story, { status: 200 });
  } catch (err: unknown) {
    console.error("Get Story error:", err);
    return NextResponse.json(
      { error: "Failed to fetch story", details: err },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  const id = (await params).id;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { title, description, acceptanceCriteria, storyPoints } = body;

    const story = await prisma.story.findUnique({
      where: { id },
      include: { epic: { include: { project: true } } },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (story.epic.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedStory = await prisma.story.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(acceptanceCriteria !== undefined && { acceptanceCriteria }),
        ...(storyPoints !== undefined && { storyPoints }),
      },
    });

    return NextResponse.json(updatedStory, { status: 200 });
  } catch (err: unknown) {
    console.error("Update Story error:", err);
    return NextResponse.json(
      { error: "Failed to update story", details: err },
      { status: 500 }
    );
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  const id = (await params).id;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const story = await prisma.story.findUnique({
      where: { id },
      include: { epic: { include: { project: true } } },
    });

    if (!story) {
      return NextResponse.json({ error: "Story not found" }, { status: 404 });
    }

    if (story.epic.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.story.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Delete Story error:", err);
    return NextResponse.json(
      { error: "Failed to delete story", details: err },
      { status: 500 }
    );
  }
}
