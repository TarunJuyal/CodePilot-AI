"use client";

import { Button } from "@/components/ui/button";
import { AddPromptButton } from "../components/add-custom-prompt-button";
import { usePrompt } from "../Context/CustomPromptButtonContext";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import useLoadingDots from "../hooks/useLoadingMessage";

export default function CodeConversionPage() {
  const { getPrompt } = usePrompt();
  const prompt = getPrompt("code-conversion");

  const loadingMessage = useLoadingDots(
    "Converting syntax and adapting logic for the selected framework"
  );

  const [loading, setLoading] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [convertedOutput, setConvertedOutput] = useState("");

  const handleSubmit = () => {
    console.log("Submitting with Code Conversion prompt:", prompt);
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 6000);
  };

  return (
    <div className="h-dvh flex flex-col">
      {/* Header Section */}
      <div className="p-4 flex justify-between items-center border-b">
        <h1 className="text-2xl font-bold">Convert Your Code</h1>
        <div className="flex gap-3">
          <AddPromptButton pageKey="code-conversion" />
          <Button variant="default" onClick={handleSubmit}>
            Submit Conversion
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-9/12">
        {/* Left: Code Input with Dropdown */}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Enter code to convert</h2>
            <Select defaultValue="jsp">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select input" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="jsp">JSP</SelectItem>
                <SelectItem value="html">HTML</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            className="flex-1 resize-none h-full"
            placeholder="Paste your code here..."
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
        </div>

        {/* Right: Converted Output with Dropdown */}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Converted Code</h2>
            <Select defaultValue="react">
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select output" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="react">React</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Textarea
            className="flex-1 resize-none h-full"
            placeholder={
              loading ? loadingMessage : "Converted code will appear here..."
            }
            value={convertedOutput || ""}
            onChange={(e) => setConvertedOutput(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
