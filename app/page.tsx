import { FeatureCard } from "./components/feature-card";
import { Code2, GitPullRequest, ClipboardList } from "lucide-react";

export default function Home() {
  const features = [
    {
      icon: <Code2 className="w-6 h-6" />,
      title: "Code Review",
      link: "/code-review",
      description:
        "Get instant AI-powered reviews and improvements for your code.",
      features: [
        "Get instant AI-powered reviews and improvements for your code.",
        "Detect bugs, vulnerabilities, and code smells.",
        "Suggest best practices and code optimizations.",
        "Explain code logic and provide documentation.",
        "Support for multiple programming languages.",
      ],
      isVisible: true,
    },
    {
      icon: <GitPullRequest className="w-6 h-6" />,
      title: "Code Conversion",
      link: "/code-conversion",
      description: "Convert code between languages or frameworks seamlessly.",
      features: [
        "Convert code between popular programming languages.",
        "Preserve logic and structure during conversion.",
        "Support for code snippets and full files.",
      ],
      isVisible: true,
    },
    {
      icon: <ClipboardList className="w-6 h-6" />,
      title: "Epic Generator",
      link: "/projects",
      description:
        "Generate epics and subtasks from a project description automatically.",
      features: [
        "Generate detailed epics and subtasks from project descriptions.",
        "Break down requirements into actionable items.",
        "Customize output for different project management tools.",
        "Accelerate project planning and task breakdown.",
      ],
      isVisible: false,
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-3">Welcome to CodePilot</h1>
      <h3 className="text-xl mb-8">
        Your AI Powered Dev Companion - Currently support Code Review & Code
        Conversion (Epic Generation coming soon)
      </h3>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <FeatureCard key={f.title} {...f} />
        ))}
      </div>
    </div>
  );
}
