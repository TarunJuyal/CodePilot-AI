import { NextRequest, NextResponse } from "next/server";
import { postQuery } from "@/lib/hf";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CODE_CONVERSION_MODEL } from "@/app/utils/constants";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { code, customPrompt } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "No code provided" }, { status: 400 });
    }

    const result = await postQuery(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: CODE_CONVERSION_MODEL,
        messages: [{ role: "user", content: customPrompt }],
      }
    );

    return NextResponse.json({
      output: result?.choices?.[0]?.message?.content || "",
      hfOutput: result,
    });
  } catch (error: unknown) {
    console.error("Conversion API error:", error);
    return NextResponse.json({ error: "Failed to Convert" }, { status: 500 });
  }
}
