import { NextRequest, NextResponse } from "next/server";
import { postQuery } from "@/lib/hf";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { CODE_REVIEW_MODEL } from "@/app/utils/constants";

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

    const prompt = customPrompt
      ? `${customPrompt} ${code}`
      : `
      You are acting as a **Senior Software Engineer** with expertise in multiple programming languages, code quality, and secure development practices.  

      Review the following code carefully. The code could be written in **any programming language**, so apply relevant best practices for that language.  

      Provide your review in **clear, structured, point-wise format** covering the following aspects:

      1. **Bugs & Errors**  
        - Identify potential logical errors, runtime issues, or language-specific pitfalls.  

      2. **Performance & Optimization**  
        - Suggest ways to improve runtime efficiency, memory usage, or algorithmic complexity.  

      3. **Readability & Maintainability**  
        - Highlight naming conventions, code clarity, comments, and adherence to clean coding principles.  

      4. **Linting & Style Compliance**  
        - Point out any deviations from common linting/style rules for the language (e.g., ESLint for JS, PEP8 for Python).  

      5. **Security & Vulnerabilities**  
        - Identify common security issues (e.g., SQL injection, unsafe input handling, hardcoded secrets).  
        - Suggest fixes inspired by tools like **SonarQube** or **Veracode**.  

      6. **Best Practices & Design**  
        - Recommend improvements in modularity, error handling, testability, and use of patterns.  

        If there are **multiple issues of the same type**, group them together.  
        Provide code snippets in your suggestions where possible.  

      Here is the code for review:

      \`\`\`
      ${code}
      \`\`\`
      `;

    const result = await postQuery(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: CODE_REVIEW_MODEL,
        messages: [{ role: "user", content: prompt }],
      }
    );

    return NextResponse.json({
      output: result?.choices?.[0]?.message?.content || "",
      hfOutput: result,
    });
  } catch (error: unknown) {
    console.error("Code Review API error:", error);
    return NextResponse.json(
      { error: "Failed to generate review" },
      { status: 500 }
    );
  }
}
