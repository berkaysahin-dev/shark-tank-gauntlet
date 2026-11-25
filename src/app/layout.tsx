import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Geist_Mono, Inter } from "next/font/google";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { PreferencesScript } from "@/components/providers/PreferencesScript";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const titleFont = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-title",
  display: "swap",
  weight: ["500", "600", "700", "800"],
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const SITE_URL = "https://gauntlet.berkaysahin.net";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "The Gauntlet — Berkay Şahin",
    template: "%s | The Gauntlet — Berkay Şahin",
  },
  description:
    "Test your startup pitch against 5 ruthless buyer archetypes. Zero retention, BYOK and built-in offline simulator.",
  keywords: [
    "The Gauntlet",
    "Startup Pitch Simulator",
    "Berkay Şahin",
    "berkaysahin.net",
    "gauntlet.berkaysahin.net",
    "AI Boardroom Simulator",
  ],
  authors: [{ name: "Berkay Şahin", url: "https://berkaysahin.net" }],
  creator: "Berkay Şahin",
  publisher: "Berkay Şahin",
  alternates: {
    canonical: SITE_URL,
    languages: {
      en: SITE_URL,
      tr: SITE_URL,
      "x-default": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["tr_TR"],
    url: SITE_URL,
    title: "The Gauntlet — Adversarial Founder Arena | Berkay Şahin",
    description:
      "Test your startup pitch against 5 ruthless buyer archetypes. Zero retention, BYOK and offline simulator.",
    siteName: "gauntlet.berkaysahin.net",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Gauntlet — Berkay Şahin",
    description:
      "Test your startup pitch against 5 ruthless buyer archetypes. Zero retention, BYOK & offline simulator.",
  },
  icons: {
    icon: [
      { url: "/icon", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/apple-icon", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      data-theme="light"
      className={`${plusJakartaSans.variable} ${titleFont.variable} ${geistMono.variable} light h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
        <PreferencesScript />
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
