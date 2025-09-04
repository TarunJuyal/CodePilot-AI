import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import PDFDocument from "pdfkit";
import { RouteParams } from "@/app/utils/constants";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import path from "path";
import fs from "fs";

export async function GET(req: NextRequest, { params }: RouteParams) {
  const id = (await params).id;
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const project = await prisma.project.findUnique({
      where: { id: id, userId: session.user.id },
      include: { epics: { include: { stories: true } } },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const doc = new PDFDocument({ margin: 50 });

    const fontPath = path.join(
      process.cwd(),
      "public",
      "fonts",
      "Roboto-Regular.ttf"
    );
    doc.registerFont("Roboto", fs.readFileSync(fontPath));
    doc.font("Roboto");

    const chunks: Buffer[] = [];

    doc.on("data", (chunk) => chunks.push(chunk));

    doc.fontSize(20).text(`Project: ${project.name}`, { underline: true });
    doc.moveDown(1.5);

    project.epics.forEach((epic, i) => {
      doc
        .fontSize(14)
        .text(`• Epic ${i + 1}: ${epic.title}`, { continued: false });
      if (epic.description) {
        doc.fontSize(10).text(`   Description: ${epic.description}`);
      }
      if (epic.acceptanceCriteria) {
        doc.fontSize(10).text(`   Acceptance: ${epic.acceptanceCriteria}`);
      }
      doc.moveDown(0.5);

      epic.stories.forEach((story, j) => {
        doc.fontSize(12).text(`   ○ Story ${j + 1}: ${story.title}`);
        if (story.description)
          doc.fontSize(9).text(`      Description: ${story.description}`);
        if (story.acceptanceCriteria)
          doc.fontSize(9).text(`      Acceptance: ${story.acceptanceCriteria}`);
        doc.fontSize(9).text(`      Story Points: ${story.storyPoints}`);
        doc.moveDown(0.5);
      });

      doc.moveDown(1);
    });

    doc.end();

    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(chunks)));
      doc.on("error", reject);
    });

    return new NextResponse(new Uint8Array(pdfBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${project.name}.pdf"`,
      },
    });
  } catch (err: unknown) {
    console.error("Export PDF error:", err);
    return NextResponse.json(
      { error: "Failed to export PDF" },
      { status: 500 }
    );
  }
}
