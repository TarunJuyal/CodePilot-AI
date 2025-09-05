"use client";

import Link from "next/link";
import { Github, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-background pb-6 mt-auto px-5">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between text-sm text-muted-foreground gap-2">
        <p>© {new Date().getFullYear()} Tarun Juyal — All rights reserved</p>

        <div className="flex gap-4">
          <Link
            href="https://github.com/TarunJuyal/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            <Github className="w-5 h-5" />
          </Link>
          <Link
            href="https://www.linkedin.com/in/tarunjuyal/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-foreground transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
