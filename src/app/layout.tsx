import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

// Optimize font loading with display swap
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
  preload: true,
});

export const metadata: Metadata = {
  title: "Fusion Gadgets - Premium Tech Store",
  description: "Discover the latest in premium technology with Fusion Gadgets. Shop laptops, smartphones, headphones, and more with fast shipping and expert support.",
  keywords: ["technology", "gadgets", "electronics", "laptops", "smartphones", "headphones"],
  authors: [{ name: "Fusion Gadgets" }],
  creator: "Fusion Gadgets",
  publisher: "Fusion Gadgets",
  icons: {
    icon: '/logo.ico',
    shortcut: '/logo.ico',
    apple: '/logo.ico',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://fusion-gadgets.com",
    title: "Fusion Gadgets - Premium Tech Store",
    description: "Discover the latest in premium technology with Fusion Gadgets.",
    siteName: "Fusion Gadgets",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fusion Gadgets - Premium Tech Store",
    description: "Discover the latest in premium technology with Fusion Gadgets.",
  },
  // Enhanced SEO and performance metadata
  other: {
    'theme-color': '#ffffff',
    'color-scheme': 'light dark',
    'format-detection': 'telephone=no',
    'mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Fusion Gadgets',
    'application-name': 'Fusion Gadgets',
    'msapplication-TileColor': '#ffffff',
    'msapplication-config': '/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Favicon */}
        <link rel="icon" href="/logo.ico" sizes="any" />
        <link rel="shortcut icon" href="/logo.ico" />
        <link rel="apple-touch-icon" href="/logo.ico" />
        
        {/* Resource hints for performance */}
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Preload critical resources */}
        <link rel="preload" href="/assets/hero-bg.jpg" as="image" type="image/jpeg" />
        <link rel="preload" href="/placeholder.svg" as="image" type="image/svg+xml" />
        
        {/* Prefetch likely next pages */}
        <link rel="prefetch" href="/products" />
        <link rel="prefetch" href="/categories" />
        
        {/* Viewport meta for responsive design */}
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        
        {/* Performance hints */}
        <meta httpEquiv="x-dns-prefetch-control" content="on" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
