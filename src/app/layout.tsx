import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { NextAuthProvider } from "@/components/auth/NextAuthProvider";
import { Toaster } from "sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CreatorBoost AI | Grow Faster With AI",
  description: "AI-powered analytics, content generation, and growth suggestions for creators.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} dark antialiased`}
    >
      <body className="min-h-screen bg-background text-foreground font-sans selection:bg-primary/30">
        <NextAuthProvider>
          {children}
          <Toaster theme="dark" position="bottom-right" />
        </NextAuthProvider>
      </body>
    </html>
  );
}
