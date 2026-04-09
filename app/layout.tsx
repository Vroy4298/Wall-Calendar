import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Wall Calendar Planner | Interactive Monthly Calendar",
  description:
    "A production-quality interactive wall calendar planner with date range selection, notes, dark mode, and dynamic monthly themes.",
  keywords: ["calendar", "planner", "date range", "notes", "interactive"],
  openGraph: {
    title: "Wall Calendar Planner",
    description: "Plan your month beautifully.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="">
      <body className={`${inter.variable} antialiased`}>{children}</body>
    </html>
  );
}
