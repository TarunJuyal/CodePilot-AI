import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./components/theme-provider";
import Navbar from "./components/navbar";
import { PromptProvider } from "./Context/CustomPromptButtonContext";
import { Toaster } from "@/components/ui/sonner";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import { redirect } from "next/navigation";
import NextAuthProvider from "./components/session-provider";
import { Analytics } from "@vercel/analytics/next";
import Footer from "./components/footer";

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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={roboto.variable}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <NextAuthProvider>
            <Navbar />
            <div className="m-4 p-4 h-full">
              <PromptProvider>
                {children}
                <Toaster richColors position="bottom-right" closeButton />
              </PromptProvider>
            </div>
            <Footer />
          </NextAuthProvider>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
