import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ProgressBar } from "@/components/nav/progress-bar";
import { QueryProvider } from "@/providers/query-provider";
import { Suspense } from "react";
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
  title: "RentalApp — Manage your rentals",
  description: "Track homes, tenants, and bills in one place.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <QueryProvider>
          {children}
          <Suspense fallback={null}><ProgressBar /></Suspense>
        </QueryProvider>
      </body>
    </html>
  );
}
