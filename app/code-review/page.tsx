"use client";

import { Button } from "@/components/ui/button";
import { AddPromptButton } from "../components/add-custom-prompt-button";
import { usePrompt } from "../Context/CustomPromptButtonContext";
import { Textarea } from "@/components/ui/textarea";

export default function CodeReviewPage() {
  const { getPrompt } = usePrompt();
  const prompt = getPrompt("code-review");

  const handleSubmit = () => {
    console.log("Submitting with Code Review prompt:", prompt);
  };

  return (
    <div className="h-dvh flex flex-col">
      {/* Header Section */}
      <div className="p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold">Review Your Code</h1>
        <div className="flex gap-3">
          <AddPromptButton pageKey="code-review" />
          <Button variant="default" onClick={handleSubmit}>
            Submit Code Review
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-9/12">
        {/* Left: Code Input */}
        <div className="flex flex-col flex-1 p-4">
          <h2 className="text-lg font-semibold mb-2">Enter code to review</h2>
          <Textarea
            className="flex-1 resize-none h-full"
            placeholder="Paste your code here..."
          />
        </div>

        {/* Right: Review Output */}
        <div className="flex flex-col flex-1 p-4">
          <h2 className="text-lg font-semibold mb-2">Review</h2>
          <Textarea
            className="flex-1 resize-none h-full"
            placeholder="AI review will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
