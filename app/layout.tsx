import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { SiteNavbar } from "@/components/site/navbar";
import { SiteFooter } from "@/components/site/footer";
import { ThemeScript } from "@/components/site/theme";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const grotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-grotesk", display: "swap" });

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "ChannelForge AI — Turn your YouTube idea into a complete channel brand",
    template: "%s | ChannelForge AI",
  },
  description: "AI YouTube channel generator: create your channel name, logo, banner, watermark, SEO keywords, content pillars and 40 video ideas from one idea. Download your complete channel starter kit.",
  keywords: ["AI YouTube channel generator", "YouTube channel starter kit", "YouTube logo generator", "YouTube banner generator", "YouTube keyword generator", "YouTube channel name generator"],
  openGraph: {
    type: "website",
    url: APP_URL,
    siteName: "ChannelForge AI",
    title: "ChannelForge AI — Launch your YouTube channel with AI",
    description: "From one simple idea, generate your channel name, branding, keywords, content strategy and visual identity.",
  },
  twitter: { card: "summary_large_image", title: "ChannelForge AI", description: "Turn your YouTube idea into a complete channel brand in minutes." },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#4f46e5", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${grotesk.variable}`}>
      <head>
        <ThemeScript />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "ChannelForge AI",
              url: APP_URL,
              description: "AI-powered YouTube channel launch workflow.",
              potentialAction: { "@type": "SearchAction", target: `${APP_URL}/generate?idea={search_term_string}`, "query-input": "required name=search_term_string" },
            }),
          }}
        />
      </head>
      <body className="flex min-h-screen flex-col font-sans">
        <SiteNavbar />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
