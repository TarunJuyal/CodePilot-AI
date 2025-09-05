import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { postQuery } from "@/lib/hf";
import { EPIC_JSON_SUMMARIZATION_MODEL } from "@/app/utils/constants";
import { cleanJsonString } from "@/app/utils/utils";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectName, generatedEpics } = await req.json();

    if (!projectName || !generatedEpics) {
      return NextResponse.json(
        { error: "Project name and Generated Epics are required" },
        { status: 400 }
      );
    }

    const prompt = `
        You are a senior Agile Product Owner. 
        Convert the following backlog into structured Agile artifacts in strict JSON format.

        Rules:
        - Do NOT include explanations or extra text. Only output JSON.
        - JSON structure:
        - Be sure to follow this exact structure and nesting with exact types to avoid failure when saving to db:
        {
        "project": {
            "name": "Project Name",
            "epics": [
            {
                "title": "Epic title",
                "description": "Epic description",
                "acceptanceCriteria": "Epic-level acceptance criteria",
                "stories": [
                {
                    "title": "Story title",
                    "description": "Story description",
                    "acceptanceCriteria": "Story acceptance criteria",
                    "storyPoints": 3
                }
                ]
            }
            ]
        }
        }

        Notes:
        - Only use the provided backlog text.
        - Do not invent extra features.
        - Use Fibonacci story points (1, 2, 3, 5, 8, 13). 
        - Try and Break stories down if they are 8 or 13 points.

        Project Name: ${projectName}

        Plain English Backlog:
        ${generatedEpics}
        `;

    const result = await postQuery(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: EPIC_JSON_SUMMARIZATION_MODEL,
        messages: [{ role: "user", content: prompt }],
      }
    );

    return NextResponse.json({
      output:
        JSON.parse(cleanJsonString(result?.choices?.[0]?.message?.content)) ||
        {},
      hfOutput: result,
    });
  } catch (err: unknown) {
    console.error("Epic Saving API error:", err);
    return NextResponse.json(
      { error: "Failed to Save Epics", details: err },
      { status: 500 }
    );
  }
}
