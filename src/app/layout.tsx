import type { Metadata } from "next";
import { Fraunces, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  axes: ["SOFT", "opsz"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"),
  title: { default: "How's My Accent · Latin American Spanish pronunciation", template: "%s · How's My Accent" },
  description: "Practice Latin American Spanish pronunciation. Read a passage aloud and get warm, AI-assisted accent feedback.",
  keywords: ["Spanish accent", "Latin American Spanish", "pronunciation", "accent practice", "learn Spanish"],
  openGraph: { type: "website", locale: "en_US", title: "How's My Accent", description: "Practice Latin American Spanish pronunciation with AI-assisted accent feedback." },
  twitter: { card: "summary", title: "How's My Accent", description: "Practice Latin American Spanish pronunciation with AI-assisted accent feedback." },
  robots: { index: true, follow: true },
  alternates: { canonical: "/" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased font-sans",
        inter.variable,
        fraunces.variable,
        geistMono.variable
      )}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
