"use client"

// import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import AuthWrapper from "@/components/AuthWrapper";
import { Toaster } from "sonner"; // Import the Toaster directly from sonner
import { useEffect } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"], // Fixed typo 'suihbsets' -> 'subsets'
});

// export const metadata: Metadata = {
//   title: "Messaging App",
//   description: "A great messaging app created for IP",
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/messaging/sw.js")
        .then(() => console.log("SW registered"))
        .catch(console.error);
    }
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/messaging/manifest.json" />
        <meta name="theme-color" content="#0f172a" />
        {/* iOS splash/login: */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <link rel="apple-touch-icon" href="/messaging/icons/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
        >
          <AuthWrapper>
            {children}
          </AuthWrapper>
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </body>
    </html>
  );
}