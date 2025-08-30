"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type PromptContextType = {
  prompts: Record<string, string>;
  setPrompt: (page: string, value: string) => void;
  getPrompt: (page: string) => string;
};

const PromptContext = createContext<PromptContextType | undefined>(undefined);

export function PromptProvider({ children }: { children: ReactNode }) {
  const [prompts, setPrompts] = useState<Record<string, string>>({});

  const setPrompt = (page: string, value: string) => {
    setPrompts((prev) => ({ ...prev, [page]: value }));
  };

  const getPrompt = (page: string) => prompts[page] || "";

  return (
    <PromptContext.Provider value={{ prompts, setPrompt, getPrompt }}>
      {children}
    </PromptContext.Provider>
  );
}

export function usePrompt() {
  const context = useContext(PromptContext);
  if (!context) {
    throw new Error("usePrompt must be used within a PromptProvider");
  }
  return context;
}
