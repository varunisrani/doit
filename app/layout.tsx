import type { Metadata, Viewport } from "next";
import { Inter, Atkinson_Hyperlegible } from "next/font/google";
import "./globals.css";

// Modern typography stack with accessibility focus
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

const atkinsonHyperlegible = Atkinson_Hyperlegible({
  variable: "--font-atkinson-hyperlegible",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "700"],
  fallback: ["Inter", "system-ui", "sans-serif"],
});

export const metadata: Metadata = {
  title: {
    default: "Video Editor Pro",
    template: "%s | Video Editor Pro",
  },
  description: "Professional video editing application with modern design system, WCAG AAA accessibility, and powerful creative tools",
  keywords: [
    "video editor",
    "professional video editing",
    "accessibility",
    "WCAG AAA",
    "modern design",
    "dark mode",
    "video production",
    "creative tools",
    "film editing",
    "post production"
  ],
  authors: [{ name: "Video Editor Pro Team", url: "https://videoeditor.pro" }],
  creator: "Video Editor Pro Team",
  publisher: "Video Editor Pro",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://videoeditor.pro"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://videoeditor.pro",
    title: "Video Editor Pro",
    description: "Professional video editing with modern design and full accessibility",
    siteName: "Video Editor Pro",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Video Editor Pro - Professional Video Editing",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Video Editor Pro",
    description: "Professional video editing with modern design and full accessibility",
    images: ["/og-image.png"],
    creator: "@videoeditorpro",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  colorScheme: "light dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${atkinsonHyperlegible.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Favicon and app icons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Web app manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme and accessibility */}
        <meta name="theme-color" content="#ffffff" />
        <meta name="color-scheme" content="light dark" />
        <meta name="msapplication-TileColor" content="#ffffff" />
        <meta name="msapplication-config" content="/browserconfig.xml" />

        {/* Performance optimization */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="renderer" content="webkit" />

        {/* Security headers */}
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:;" />
      </head>

      <body
        className="antialiased min-h-screen bg-[var(--background)] text-[var(--text-primary)] font-sans overflow-hidden"
        style={{
          fontFeatureSettings: '"rlig" 1, "calt" 1',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        {/* Skip to main content for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[var(--primary)] text-[var(--text-inverse)] px-4 py-2 rounded-md z-50 focus:outline-none focus:ring-2 focus:ring-[var(--focus-ring)]"
        >
          Skip to main content
        </a>

        {/* Application background */}
        <div className="fixed inset-0 bg-[var(--background)] -z-10" />

        {/* Main content area */}
        <main id="main-content" className="relative z-10 min-h-screen">
          {children}
        </main>

        {/* Loading indicator for screen readers */}
        <div
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
          id="loading-status"
        >
          Application loaded and ready
        </div>

        {/* Keyboard navigation help (shown on first load) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Initialize accessibility features
              document.addEventListener('DOMContentLoaded', () => {
                // Set focus management for better keyboard navigation
                document.body.addEventListener('keydown', (e) => {
                  // Tab navigation enhancement
                  if (e.key === 'Tab') {
                    document.body.classList.add('keyboard-navigation');
                  }
                });

                document.body.addEventListener('mousedown', () => {
                  document.body.classList.remove('keyboard-navigation');
                });

                // Announce page load to screen readers
                const status = document.getElementById('loading-status');
                if (status) {
                  status.textContent = 'Application loaded and ready';
                }
              });
            `,
          }}
        />
      </body>
    </html>
  );
}
