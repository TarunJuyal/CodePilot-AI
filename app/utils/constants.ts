export const codeConversionMap: Record<string, string[]> = {
  Query: ["QueryDSL", "Reverse Engineering", "Stored Procedure"],
  Java: [
    "Spring JPA",
    "Service Class",
    "JUnit",
    "Technical Documentation",
    "Business Documentation",
    "Controller Class",
    "Reverse Engineering",
  ],
  JSP: ["React.js", "Next.js"],
  HTML: ["React.js", "Next.js", "Jest Test Cases", "Reverse Engineering"],
  Test_Case: ["JUnit", "Test Script"],
  React: [
    "Next.js",
    "Jest Test Cases",
    "Reverse Engineering",
    "Vue.js",
    "Angular",
  ],
  Swagger: [
    "API Boilerplate (Controller/Service)",
    "API Documentation (Markdown/HTML)",
    "OpenAPI Client SDK",
  ],
  SoapXML: [
    "REST API (JSON)",
    "OpenAPI/Swagger",
    "GraphQL Schema",
    "gRPC Stubs",
  ],
  Python: [
    "Flask/FastAPI Endpoint",
    "Django Model/Serializer",
    "Pytest Unit Tests",
  ],
  SQL: ["Prisma Schema", "Sequelize Model", "TypeORM Entity"],
  CSharp: [
    "ASP.NET Core Controller",
    "Entity Framework Core Model",
    "xUnit Test Case",
  ],
};

export const CODE_REVIEW_MODEL =
  "meta-llama/Llama-4-Scout-17B-16E-Instruct:groq";
export const CODE_CONVERSION_MODEL =
  "meta-llama/Llama-4-Scout-17B-16E-Instruct:groq";
export const CODE_GENERATION_MODEL =
  "meta-llama/Llama-4-Scout-17B-16E-Instruct:groq";
export const EPIC_JSON_SUMMARIZATION_MODEL =
  "meta-llama/Llama-4-Scout-17B-16E-Instruct:groq";

export interface RouteParams {
  params: { id: string };
}
