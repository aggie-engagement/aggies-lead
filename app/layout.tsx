import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/AppShell";
import { AuthProvider } from "@/components/AuthState";
import { PrototypeProvider } from "@/components/PrototypeState";
import { PwaRegistration } from "@/components/PwaRegistration";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Aggies Lead",
  description: "Utah State Athletics student-athlete development app",
  manifest: "/manifest.webmanifest",
  applicationName: "Aggies Lead",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Aggies Lead",
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
  themeColor: "#0f243d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <PrototypeProvider>
            <PwaRegistration />
            <AppShell>{children}</AppShell>
          </PrototypeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
