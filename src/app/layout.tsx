import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://tarot.resonantatlas.com";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sortes by Resonant Atlas — Cast the lots. Read your story.",
    template: "%s | Sortes",
  },
  description:
    "Draw tarot cards and receive personalized readings. Explore all 78 cards of the Rider-Waite deck with rich meanings, daily draws, and AI-powered interpretations.",
  keywords: [
    "tarot",
    "tarot reading",
    "daily tarot",
    "tarot card meanings",
    "Rider-Waite",
    "personalized tarot",
    "tarot spreads",
    "Celtic Cross",
  ],
  authors: [{ name: "Resonant Atlas" }],
  creator: "Resonant Atlas",
  publisher: "Resonant Atlas",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: "Sortes by Resonant Atlas",
    title: "Sortes — Cast the lots. Read your story.",
    description:
      "Draw tarot cards and receive personalized readings. Explore the full Rider-Waite deck.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Sortes by Resonant Atlas — Tarot Readings",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Sortes — Cast the lots. Read your story.",
    description:
      "Draw tarot cards and receive personalized readings. Explore the full Rider-Waite deck.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#0a0a1a] text-[#e8e4d9]">
        {children}
      </body>
    </html>
  );
}
