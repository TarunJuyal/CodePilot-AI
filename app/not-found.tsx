"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center text-center bg-background px-6 mt-15">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <h2 className="text-4xl font-semibold mb-2">Page Not Found</h2>
      <p className="text-muted-foreground mb-6 text-2xl">
        Oops! The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Button variant="secondary">
        <Link href="/">Go Back to Dashboard</Link>
      </Button>
    </div>
  );
}
