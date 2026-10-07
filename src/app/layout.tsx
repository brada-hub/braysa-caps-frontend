import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BRAYSA Caps | Gorras Exclusivas y Colecciones Oficiales",
  description:
    "Descubrí gorras BRAYSA originales con diseños exclusivos, snapbacks, curvas y trucker disponibles en Bolivia.",
  icons: {
    icon: "/BRAYSA_logos/negro/BRAYSA_04_icono_negro.png",
  },
};

import { AuthProvider } from "@/context/AuthContext";
import AppNavigation from "@/components/AppNavigation";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full bg-slate-50 text-slate-900 flex flex-col font-sans" suppressHydrationWarning>
        <AuthProvider>
          <AppNavigation>{children}</AppNavigation>
        </AuthProvider>
      </body>
    </html>
  );
}
