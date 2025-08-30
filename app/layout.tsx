import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/navbar";
import { PromptProvider } from "./Context/CustomPromptButtonContext";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "CodePilot AI",
  description:
    "Leverage AI to review code, convert code between languages, and generate epics and user stories from project descriptions. Boost your software development workflow with intelligent automation and agile planning tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.variable}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar />
          <div className="m-4 p-4 h-dvh">
            <PromptProvider>{children}</PromptProvider>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
