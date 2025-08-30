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

export default function Navbar() {
  return (
    <nav className="flex justify-between items-center w-full px-6 py-3 border-b">
      {/* Left side */}
      <div className="flex items-center space-x-2">
        <span className="text-xl font-bold">⚡ AI Dashboard</span>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-4">
        <ThemeSwitch />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage src="/avatar.png" alt="User" />
              <AvatarFallback>TJ</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                // NextAuth signOut will go here
                console.log("Sign out clicked");
              }}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
}
