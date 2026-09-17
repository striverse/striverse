import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ThemeRotator from "@/components/ThemeRotator";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "STRIVERSE",
  description: "STRIVERSE Crypto Presale Platform",
  manifest: "/app-manifest.webmanifest",
  icons: { icon: "/striverse-new-logo.png" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
  className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#050816] text-white`}
>
  <ThemeRotator />

  {children}

        <Toaster
          position="top-right"
          reverseOrder={false}
          gutter={10}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#0B1220",
              color: "#ffffff",
              border: "1px solid rgba(6,182,212,.25)",
              borderRadius: "16px",
              padding: "14px 18px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#06b6d4",
                secondary: "#ffffff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}