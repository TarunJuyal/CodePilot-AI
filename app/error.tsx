"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("App Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center text-center bg-background px-6 mt-15">
      <h1 className="text-5xl font-bold text-destructive mb-4">
        Something went wrong
      </h1>
      <p className="text-muted-foreground mb-6 text-xl">
        We encountered an unexpected error while processing your request. Please
        try again.
      </p>
      <div className="flex">
        <Button variant="secondary">
          <Link href="/">Go Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}
