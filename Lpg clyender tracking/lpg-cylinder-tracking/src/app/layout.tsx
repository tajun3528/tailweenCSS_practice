import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LPG Cylinder Tracker | এলপিজি সিলিন্ডার ট্র্যাকার",
  description:
    "LPG Cylinder Distribution & Tracking Software for Bangladesh | বাংলাদেশের জন্য এলপিজি সিলিন্ডার বিতরণ ও ট্র্যাকিং সফটওয়্যার",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
