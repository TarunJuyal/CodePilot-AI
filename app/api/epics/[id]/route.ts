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
    const epic = await prisma.epic.findUnique({
      where: { id },
      include: { stories: true, project: true },
    });

    if (!epic || epic.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Epic not found" }, { status: 404 });
    }

    return NextResponse.json(epic, { status: 200 });
  } catch (err: unknown) {
    console.error("Fetch Epic error:", err);
    return NextResponse.json(
      { error: "Failed to fetch epic" },
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
    const { title, description, acceptanceCriteria } = body;

    const epic = await prisma.epic.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!epic || epic.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const updatedEpic = await prisma.epic.update({
      where: { id },
      data: {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
        ...(acceptanceCriteria !== undefined && { acceptanceCriteria }),
      },
    });

    return NextResponse.json(updatedEpic, { status: 200 });
  } catch (err: unknown) {
    console.error("Update Epic error:", err);
    return NextResponse.json(
      { error: "Failed to update epic", details: err },
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
    const epic = await prisma.epic.findUnique({
      where: { id },
      include: { project: true },
    });

    if (!epic) {
      return NextResponse.json({ error: "Epic not found" }, { status: 404 });
    }

    if (epic.project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.epic.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (err: unknown) {
    console.error("Delete Epic error:", err);
    return NextResponse.json(
      { error: "Failed to delete epic", details: err },
      { status: 500 }
    );
  }
}
