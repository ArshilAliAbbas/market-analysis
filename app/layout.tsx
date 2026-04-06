import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Market Pulse AI — Live Financial Intelligence Dashboard",
  description:
    "Real-time market data, AI-powered news analysis, economic calendar, and institutional-grade trade planning — all in one professional dashboard.",
  keywords: [
    "market dashboard",
    "financial intelligence",
    "AI trading",
    "real-time market data",
    "economic calendar",
    "forex",
    "crypto",
    "stocks",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased bg-[#0B0F14] text-[#F9FAFB]`}
    >
      <body className="min-h-full flex flex-col bg-[#0B0F14] text-[#F9FAFB]">{children}</body>
    </html>
  );
}
