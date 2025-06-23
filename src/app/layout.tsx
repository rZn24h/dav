import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import PreloadBanner from '@/components/PreloadBanner';
import Script from 'next/script';
import { getConfig } from "@/utils/apiCars";
import AsyncCss from "@/components/AsyncCss";

// Optimize font loading
const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'arial'],
});

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  
  return {
    title: config?.siteTitle || "AutoD",
    description: config?.siteDescription || "AutoD - Your Car Service Platform",
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://autodav.ro'),
    openGraph: {
      title: config?.siteTitle || "AutoD",
      description: config?.siteDescription || "AutoD - Your Car Service Platform",
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: config?.siteTitle || "AutoD",
      description: config?.siteDescription || "AutoD - Your Car Service Platform",
    },
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ro">
      <head>
        <AsyncCss />

        {/* DNS prefetch for external domains */}
        <link rel="dns-prefetch" href="//cdn.jsdelivr.net" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* Preconnect to critical domains */}
        <link rel="preconnect" href="https://cdn.jsdelivr.net" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <PreloadBanner />
          <div className="background-wrapper min-vh-100 d-flex flex-column">
            <Navbar />
            <main className="main-content flex-grow-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
        
        {/* Load Bootstrap JS asynchronously */}
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="lazyOnload"
          defer
        />
      </body>
    </html>
  );
}
