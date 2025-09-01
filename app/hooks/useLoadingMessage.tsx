"use client";

import { useState, useEffect } from "react";

export default function useLoadingDots(message: string) {
  const [text, setText] = useState(message + ".");

  useEffect(() => {
    const interval = setInterval(() => {
      setText((prev) => {
        const base = message;
        const dotCount = prev.replace(base, "").length;
        return dotCount < 5 ? base + ".".repeat(dotCount + 1) : base + ".";
      });
    }, 400);
    return () => clearInterval(interval);
  }, [message]);

  return text;
}
