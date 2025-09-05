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
import { useTypingEffect } from "../hooks/useTypingEffect";
import { codeConversionMap } from "../utils/constants";
import { toast } from "sonner";
import { buildConversionPrompt } from "../utils/utils";

export default function CodeConversionPage() {
  const { getPrompt } = usePrompt();
  const prompt = getPrompt("code-conversion");

  const loadingMessage = useLoadingDots(
    "Converting syntax and adapting logic for the selected framework"
  );

  const [loading, setLoading] = useState(false);
  const [codeInput, setCodeInput] = useState("");
  const [convertedOutput, setConvertedOutput] = useState("");
  const [inputLang, setInputLang] = useState("");
  const [outputLang, setOutputLang] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setConvertedOutput("");

    try {
      const finalPrompt = buildConversionPrompt({
        inputCode: codeInput,
        inputLang: inputLang === "defaultInputLang" ? "" : inputLang,
        outputLang: outputLang === "defaultOutputLang" ? "" : outputLang,
        customPrompt: prompt,
      });
      const res = await fetch("/api/convert", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: codeInput, customPrompt: finalPrompt }),
      });

      const data = await res.json();
      setLoading(false);

      if (data?.output) {
        setConvertedOutput(data.output);
        toast.success("Converted successfully!");
      } else {
        setConvertedOutput("Failed to covert.");
        toast.error(data?.error || "Failed to convert.");
      }
    } catch (error: unknown) {
      console.error("Error submitting conversion:", error);
      toast.error("An error occurred while submitting your request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-dvh flex flex-col">
      {/* Header Section */}
      <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center border-b gap-4 md:gap-0">
        <h1 className="text-2xl font-bold">Convert Your Code</h1>
        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
          <AddPromptButton pageKey="code-conversion" />
          <Button
            variant="default"
            onClick={handleSubmit}
            disabled={loading || !codeInput.trim() || !inputLang || !outputLang}
          >
            Submit For Conversion
          </Button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row h-9/12">
        {/* Left: Code Input with Dropdown */}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Enter code to convert</h2>
            <Select
              value={inputLang}
              onValueChange={(value) => {
                setInputLang(value);
                setOutputLang("");
              }}
              defaultValue="defaultInputLang"
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select Source" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem key="input-defaultLang" value="defaultInputLang">
                  Select Source
                </SelectItem>
                {Object.keys(codeConversionMap).map((lang) => (
                  <SelectItem key={`input-${lang}`} value={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            className="flex-1 resize-none h-full"
            placeholder="Write/Paste your code/input here..."
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
          />
        </div>

        {/* Right: Converted Output with Dropdown */}
        <div className="flex flex-col flex-1 p-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold">Converted Code</h2>
            <Select
              value={outputLang}
              onValueChange={(value) => {
                setOutputLang(value);
              }}
              defaultValue="defaultOutputLang"
              disabled={!inputLang || inputLang === "defaultInputLang"}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="Select Target" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="defaultOutputLang">Select Target</SelectItem>
                {inputLang &&
                  inputLang !== "defaultInputLang" &&
                  codeConversionMap[inputLang]?.map((lang) => (
                    <SelectItem key={`output-${lang}`} value={lang}>
                      {lang}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
          <Textarea
            className="flex-1 resize-none h-full"
            placeholder={
              loading
                ? loadingMessage
                : "Converted code/output will appear here..."
            }
            value={useTypingEffect(convertedOutput) || ""}
            onChange={(e) => setConvertedOutput(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
