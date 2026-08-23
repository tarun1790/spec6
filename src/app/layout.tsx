import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpecFlow AI - SDLC Spec-Driven Development Dashboard",
  description: "Automated 6-stage Software Development Life Cycle (SDLC) specification suite and artifact generator.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-slate-50 text-slate-900 min-h-screen">
        {children}
      </body>
    </html>
  );
}
