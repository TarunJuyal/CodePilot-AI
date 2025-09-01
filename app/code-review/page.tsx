"use client";

import { Button } from "@/components/ui/button";
import { AddPromptButton } from "../components/add-custom-prompt-button";
import { usePrompt } from "../Context/CustomPromptButtonContext";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import useLoadingDots from "../hooks/useLoadingMessage";

export default function CodeReviewPage() {
  const { getPrompt } = usePrompt();
  const prompt = getPrompt("code-review");

  const loadingMessage = useLoadingDots(
    "Analyzing your code for potential improvements"
  );

  const [loading, setLoading] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [reviewOutput, setReviewOutput] = useState("");

  const handleSubmit = () => {
    console.log("Submitting with Code Review prompt:", prompt);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 6000);
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
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
        </div>

        {/* Right: Review Output */}
        <div className="flex flex-col flex-1 p-4">
          <h2 className="text-lg font-semibold mb-2">Review</h2>
          <Textarea
            className="flex-1 resize-none h-full"
            placeholder={
              loading ? loadingMessage : "AI review will appear here..."
            }
            value={reviewOutput || ""}
            onChange={(e) => setReviewOutput(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
