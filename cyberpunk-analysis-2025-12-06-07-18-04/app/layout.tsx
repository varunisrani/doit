import type { Metadata } from "next";
import { Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  variable: "--font-atkinson-hyperlegible",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700", "800"],
});

export const metadata: Metadata = {
  title: "Video Editor Pro | High Contrast Accessibility",
  description: "A high contrast, accessibility-focused video editing application with maximum readability and usability",
  keywords: ["video editor", "accessibility", "high contrast", "accessible video editing", "a11y"],
  authors: [{ name: "Video Editor Team" }],
  viewport: "width=device-width, initial-scale=1",
  themeColor: "#000000",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${atkinsonHyperlegible.variable} antialiased min-h-screen overflow-hidden`}
        style={{ 
          background: 'var(--background)',
          color: 'var(--foreground)',
          fontFamily: '"Atkinson Hyperlegible", "Segoe UI", "Roboto", system-ui, sans-serif',
          fontSize: '16px',
          lineHeight: '1.6'
        }}
      >
        {/* High Contrast Background - Solid Black */}
        <div className="high-contrast-background"></div>

        {/* Content */}
        <div className="relative z-10 min-h-screen">
          {children}
        </div>
      </body>
    </html>
  );
}
