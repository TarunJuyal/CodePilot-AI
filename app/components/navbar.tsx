"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeSwitch } from "./theme-switch";
import Link from "next/link";
import { useState } from "react";
import { BrainCircuit, Menu, X } from "lucide-react";
import { signOut, useSession } from "next-auth/react";

const featureTabs = [
  { label: "Code Review", href: "/code-review" },
  { label: "Code Conversion", href: "/code-conversion" },
  { label: "Epic Generator", href: "/projects/create" },
  { label: "Your Current Projects", href: "/projects" },
];

export default function Navbar() {
  const { data: session } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav className="flex justify-between items-center w-full px-6 py-3 border-b">
        {/* Left side */}
        <div className="flex items-center space-x-4">
          <Link
            href="/"
            className="text-xl font-bold no-underline hidden md:flex items-center space-x-2"
          >
            <span>
              <BrainCircuit className="w-6 h-6 mr-1" />
            </span>
            <span>AI Dashboard</span>
          </Link>
          <div className="hidden md:flex items-center space-x-2">
            {featureTabs.map((tab) => (
              <Link
                key={tab.label}
                href={tab.href}
                className="text-sm font-medium px-3 py-1 rounded hover:bg-muted transition-colors"
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center space-x-3">
          <ThemeSwitch />
          <div className="hidden md:block">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={session?.user.image || ""}
                    alt={session?.user.name || "User Profile"}
                  />
                  <AvatarFallback>{session?.user.name || "?"}</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut({ callbackUrl: "/" })}>
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Burger icon for mobile */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 ml-2"
            aria-label="Open menu"
            onClick={() => setSidebarOpen(true)}
          >
            <span>
              <Menu className="w-6 h-6" />
            </span>
          </button>
        </div>
      </nav>

      {/* Sidebar for mobile */}
      {sidebarOpen && (
        <aside className="fixed inset-0 z-50 bg-black/40 md:hidden">
          <div className="fixed top-0 right-0 h-full w-64 bg-white dark:bg-zinc-900 shadow-lg flex flex-col p-6">
            {/* Title and Avatar */}
            <div className="flex items-center space-x-3 mb-8">
              <Avatar>
                <AvatarImage src="dummy-url" alt="User Profile" />
                <AvatarFallback>TJ</AvatarFallback>
              </Avatar>
              <span className="text-lg font-bold">AI Dashboard</span>
              <button
                className="self-end mb-6"
                aria-label="Close menu"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-6 h-12 pt-7" />
              </button>
            </div>
            <nav className="flex flex-col space-y-4">
              {featureTabs.map((tab) => (
                <Link
                  key={tab.label}
                  href={tab.href}
                  className="text-base font-medium px-3 py-2 rounded hover:bg-muted transition-colors"
                  onClick={() => setSidebarOpen(false)}
                >
                  {tab.label}
                </Link>
              ))}
              <button
                className="text-base font-medium px-3 py-2 rounded hover:bg-muted transition-colors text-left"
                onClick={() => {
                  setSidebarOpen(false);
                  signOut({ callbackUrl: "/" });
                }}
              >
                Sign out
              </button>
            </nav>
          </div>
        </aside>
      )}
    </>
  );
}
