type ConversionPromptInput = {
  inputCode: string;
  inputLang: string;
  outputLang: string;
  customPrompt?: string;
};

export function buildConversionPrompt({
  inputCode,
  inputLang,
  outputLang,
  customPrompt,
}: ConversionPromptInput): string {
  if (customPrompt && customPrompt.trim().length > 0) {
    return `
    You are a highly experienced senior software engineer with deep knowledge of ${inputLang} and ${outputLang}.  

    Your task: Follow the custom request provided below with maximum accuracy, best practices, and framework-specific conventions.  
    If optimizations, bug fixes, or improvements are possible, apply them while maintaining the intent of the code.  

    Custom Conversion Request:
    ${customPrompt}

    Here is the code to work with:
    \`\`\`${inputLang.toLowerCase()}
    ${inputCode}
    \`\`\`
    `;
  }

  let taskDetails = "";

  switch (true) {
    case inputLang === "JSP" && ["React.js", "Next.js"].includes(outputLang):
      taskDetails = `
- Convert JSP code into a modern ${outputLang} component.
- Use idiomatic JSX/TSX, hooks, and props where relevant.
- Replace inline Java logic with appropriate API calls or state management.
- Ensure responsive, accessible UI and remove legacy JSP-specific tags.
`;
      break;

    case inputLang === "HTML" && ["React.js", "Next.js"].includes(outputLang):
      taskDetails = `
- Convert static HTML into a reusable ${outputLang} component.
- Ensure modular component structure.
- Replace inline styles with CSS-in-JS or Tailwind classes if possible.
- Add client/server-side rendering optimizations (Next.js if chosen).
`;
      break;

    case inputLang === "React" && outputLang === "Next.js":
      taskDetails = `
- Convert React component into a Next.js page/component.
- Implement SSR/ISR where relevant.
- Ensure routing is adapted to Next.js conventions.
`;
      break;

    case inputLang === "React" && ["Vue.js", "Angular"].includes(outputLang):
      taskDetails = `
- Translate React component logic into ${outputLang} framework syntax.
- Preserve state management and lifecycle equivalents.
- Ensure event handling and props are correctly adapted.
`;
      break;

    case inputLang === "Java" && outputLang === "Spring JPA":
      taskDetails = `
- Convert Java classes into Spring JPA entities and repositories.
- Map fields with @Entity, @Table, @Column, and @Id annotations.
- Generate CRUD repository interfaces.
`;
      break;

    case inputLang === "Java" && outputLang === "Controller Class":
      taskDetails = `
- Convert Java service/business logic into a Spring REST Controller.
- Use @RestController, @GetMapping, @PostMapping annotations.
- Ensure request validation and error handling.
`;
      break;

    case inputLang === "Swagger":
      taskDetails = `
- Generate ${outputLang} code from the provided Swagger/OpenAPI definition.
- Include endpoints, DTOs, and service stubs.
- Ensure OpenAPI spec compliance.
`;
      break;

    case inputLang === "SoapXML" && outputLang === "REST API (JSON)":
      taskDetails = `
- Convert SOAP XML API into REST JSON endpoints.
- Map SOAP operations into RESTful routes.
- Ensure correct request/response structure with proper validation.
`;
      break;

    case inputLang === "Java" && outputLang === "JUnit":
    case inputLang === "Test_Case" && outputLang === "JUnit":
      taskDetails = `
- Generate JUnit test cases for the provided code.
- Follow AAA (Arrange, Act, Assert) pattern.
- Include edge cases and exception scenarios.
`;
      break;

    case inputLang === "HTML" && outputLang === "Jest Test Cases":
    case inputLang === "React" && outputLang === "Jest Test Cases":
      taskDetails = `
- Generate Jest test cases for the provided component.
- Test rendering, props, events, and conditional logic.
- Ensure tests are isolated and reproducible.
`;
      break;

    case inputLang === "Python" && outputLang === "Pytest Unit Tests":
      taskDetails = `
- Generate Pytest unit tests for the given Python code.
- Include happy path, edge cases, and error handling.
- Ensure test functions follow pytest conventions.
`;
      break;

    case inputLang === "SQL" &&
      ["Prisma Schema", "Sequelize Model", "TypeORM Entity"].includes(
        outputLang
      ):
      taskDetails = `
- Convert SQL schema into ${outputLang}.
- Map tables into entities/models with correct field types.
- Add primary keys, foreign keys, and relations.
`;
      break;

    case inputLang === "CSharp" && outputLang === "Entity Framework Core Model":
      taskDetails = `
- Convert DB schema into C# EF Core entity classes.
- Use Data Annotations like [Key], [Required], [ForeignKey].
- Implement DbContext class.
`;
      break;

    default:
      taskDetails = `
- Convert the provided ${inputLang} code into ${outputLang}.
- Maintain functionality while adopting idiomatic practices of ${outputLang}.
- Optimize for performance, readability, and best practices.
`;
  }

  return `
You are an expert developer with deep knowledge of both ${inputLang} and ${outputLang}.

Your task: Convert the following ${inputLang} code into ${outputLang}.

Requirements:
${taskDetails}

Here is the code:
\`\`\`${inputLang.toLowerCase()}
${inputCode}
\`\`\`
`;
}

export function cleanJsonString(aiOutput: string) {
  return aiOutput
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();
}
