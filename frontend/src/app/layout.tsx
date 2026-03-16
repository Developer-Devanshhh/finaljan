import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import NavBar from "@/components/NavBar";
import { Toaster } from "react-hot-toast";
import ChatWidget from "@/features/chatbot/ChatWidget";
import PublicAuthGuard from "@/components/PublicAuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "JanVedha AI - Smart Civic Issue Management",
  description:
    "AI-powered civic complaint management platform. Submit issues, track resolutions, and hold local governance accountable with transparency.",
  keywords: "civic issues, complaints, ward, municipality, AI, governance, transparency",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#3b82f6",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-slate-50 text-gray-900 antialiased font-sans`}>
        <AuthProvider>
          <PublicAuthGuard>
            <NavBar />
            <main>{children}</main>
            <ChatWidget />
            <Toaster
              position="top-right"
              toastOptions={{
                className: "!text-sm !font-medium !rounded-xl !shadow-lg",
                success: { iconTheme: { primary: "#16a34a", secondary: "#fff" } },
                error: { iconTheme: { primary: "#dc2626", secondary: "#fff" } },
              }}
            />
          </PublicAuthGuard>
        </AuthProvider>
      </body>
    </html>
  );
}
