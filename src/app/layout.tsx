import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ── Update SITE_URL to your actual domain before deploying ────────────────────
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://sarveshmore.dev";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#061220" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sarvesh More | Cybersecurity & Cloud Engineer",
    template: "%s | Sarvesh More",
  },
  description:
    "Portfolio of Sarvesh More — Cybersecurity & Cloud Engineer specialising in secure systems, AI-driven analytics, and automation.",
  keywords: [
    "cybersecurity", "cloud engineer", "DevSecOps", "automation",
    "portfolio", "Sarvesh More",
  ],
  authors: [{ name: "Sarvesh More", url: SITE_URL }],
  creator: "Sarvesh More",
  robots: { index: true, follow: true },
  icons: {
    icon: "/globe.svg",
    shortcut: "/globe.svg",
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Sarvesh More",
    title: "Sarvesh More | Cybersecurity & Cloud Engineer",
    description:
      "Cybersecurity & Cloud Engineer — secure systems, AI-driven analytics, automation.",
    images: [
      {
        url: "/og-image.png",   // add a 1200×630 png to /public when ready
        width: 1200,
        height: 630,
        alt: "Sarvesh More – Cybersecurity & Cloud Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sarvesh More | Cybersecurity & Cloud Engineer",
    description:
      "Cybersecurity & Cloud Engineer — secure systems, AI-driven analytics, automation.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen flex flex-col">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
