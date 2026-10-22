import type { Metadata, Viewport } from "next";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const serif = DM_Serif_Display({ weight: "400", style: ["normal", "italic"], subsets: ["latin"], variable: "--font-serif", display: "swap" });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });

const siteUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "VenCare | Emergency epinephrine, on the wall where it's needed",
  description: "VenCare is an on-site emergency epinephrine station for restaurants and public venues. Like an AED, but for severe allergic reactions.",
  openGraph: {
    type: "website",
    title: "VenCare | Like an AED, but for severe allergic reactions",
    description: "An on-site emergency epinephrine station for restaurants and public venues.",
    images: ["/assets/station.webp"],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#0B2345" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body>{children}</body>
    </html>
  );
}
