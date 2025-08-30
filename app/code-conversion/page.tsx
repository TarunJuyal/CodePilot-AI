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

export default function CodeConversionPage() {
  const { getPrompt } = usePrompt();
  const prompt = getPrompt("code-conversion");

  const handleSubmit = () => {
    console.log("Submitting with Code Conversion prompt:", prompt);
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
            placeholder="Converted code will appear here..."
          />
        </div>
      </div>
    </div>
  );
}
