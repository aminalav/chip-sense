import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chip Sense",
  description: "Semiconductor supply chain views — memory, CPUs, GPUs, data centers",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
