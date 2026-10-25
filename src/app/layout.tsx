import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "The Gauntlet | Karar Masası & Girişimci Değerlendirme Arenası",
  description:
    "Test your startup pitch against 5 ruthless psychological buyer archetypes who actively test every assumption before buying. Zero AI slop, pure adversarial feedback.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col studio-stage-bg text-slate-100 selection:bg-amber-500/30 selection:text-amber-300 font-sans">
        {children}
      </body>
    </html>
  );
}
