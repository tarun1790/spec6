import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "SpecFlow AI - Spec-Driven Development Dashboard & Artifact Generator",
  description: "Automated software architecture and 6-stage specification suite generator with live Mermaid diagrams, Monaco editor, and one-click ZIP export.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-slate-950 text-slate-100 min-h-screen">
        {children}
      </body>
    </html>
  );
}
