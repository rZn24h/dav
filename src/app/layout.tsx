import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Script from 'next/script';
import { getConfig } from "@/utils/apiCars";

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const config = await getConfig();
  
  return {
    title: config?.siteTitle || "AutoD",
    description: config?.siteDescription || "AutoD - Your Car Service Platform",
  };
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" 
          rel="stylesheet"
        />
        <link 
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.13.1/font/bootstrap-icons.css" 
          rel="stylesheet"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="background-wrapper min-vh-100 d-flex flex-column">
            <Navbar />
            <main className="main-content flex-grow-1">
              {children}
            </main>
            <Footer />
          </div>
        </AuthProvider>
        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
