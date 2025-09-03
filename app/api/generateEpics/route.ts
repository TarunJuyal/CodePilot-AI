import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { postQuery } from "@/lib/hf";
import { CODE_GENERATION_MODEL } from "@/app/utils/constants";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { projectName, requirements } = await req.json();

    if (!projectName || !requirements) {
      return NextResponse.json(
        { error: "Project name and requirements are required" },
        { status: 400 }
      );
    }

    const prompt = `
        You are a senior Agile Product Owner and Software Architect.
        Your task is to break down the given project into well-defined Epics and User Stories.

        Requirements for output:
        - Write ONLY in plain English, no JSON.
        - Organize the response in a readable outline format (Epic -> Stories).
        - Each **Epic** must include:
        - **Title**
        - **Detailed Description**: high-level requirements, objectives, and scope
        - **Acceptance Criteria**: conditions for considering the Epic complete (covering UI, backend, integrations, performance, and non-functional requirements)
        - Each **Story** must include:
        - **Title**
        - **Detailed Description**: concrete implementation steps (frontend, backend, APIs, DB, setup, etc.)
        - **Acceptance Criteria**: precise testable outcomes including edge cases, error handling, test coverage expectations
        - **Story Points**: Fibonacci (1, 2, 3, 5, 8, 13). If larger, split into smaller stories.
        - Cover **end-to-end delivery**:
        - Repo setup (frontend, backend, CI/CD pipelines)
        - UI components and screens (React, JSP, Angular, etc.)
        - API design and implementation (Java, Node, Python, etc.)
        - Database schema and migrations
        - Authentication & Authorization (OAuth, JWT, Okta, etc.)
        - Logging, monitoring, error handling
        - Testing (unit, integration, coverage targets)
        - Deployment (Docker, cloud, environments)
        - Documentation tasks
        - Expand creatively: if the project is a web app with React frontend and Java backend, deduce all necessary screens, APIs, services, authentication flows, etc.
        - The generated Epics and Stories should give a dev team everything needed to implement a full project from scratch.

        Example format:

        Epic 1: User Authentication  
        Description: Secure login/logout with Google and GitHub. Includes frontend login screen, backend authentication API, session handling, and role-based access.  
        Acceptance Criteria:  
        - Users can log in using Google/GitHub  
        - Sessions stored securely, expire after inactivity  
        - Access is role-based (admin, user)  
        - Error handling and logging in place  

        Stories:  
        - Story 1: Implement login screen in React  
        - Description: Build responsive UI with email/password + OAuth buttons  
        - Acceptance Criteria: Inputs validated, OAuth redirect works, 80% unit test coverage  
        - Story Points: 3  

        - Story 2: Implement OAuth in Java backend  
        - Description: Add Spring Security + OAuth2 integration for Google & GitHub  
        - Acceptance Criteria: JWT tokens issued securely, invalid tokens rejected, integration tests included  
        - Story Points: 5  

        ---
        Project Name: ${projectName}
        Requirements: ${requirements}
        `;

    const result = await postQuery(
      "https://router.huggingface.co/v1/chat/completions",
      {
        model: CODE_GENERATION_MODEL,
        messages: [{ role: "user", content: prompt }],
      }
    );

    return NextResponse.json({
      output: result?.choices?.[0]?.message?.content || "",
      hfOutput: result,
    });
  } catch (err: unknown) {
    console.error("Epic Generation API error:", err);
    return NextResponse.json(
      { error: "Failed to generate epics", details: err },
      { status: 500 }
    );
  }
}
