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
  title: "BRAYSA Caps | Gorras Streetwear y Colecciones con Regulador en Bolivia",
  description:
    "Tienda oficial de gorras urbanas BRAYSA Caps en Bolivia. Modelos con visera curva, snapback planas y trucker con regulador graduable. Envíos inmediatos a todo el país y pedidos directos por WhatsApp.",
  keywords: [
    "gorras bolivia",
    "braysa caps",
    "gorras la paz",
    "gorras santa cruz",
    "gorras cochabamba",
    "gorras con regulador",
    "visera curva bolivia",
    "snapback bolivia",
    "streetwear bolivia",
  ],
  authors: [{ name: "BRAYSA Caps Bolivia" }],
  creator: "BRAYSA Caps",
  metadataBase: new URL("https://braysa-caps-frontend.vercel.app"),
  openGraph: {
    title: "BRAYSA Caps | Gorras Streetwear y Exclusivas en Bolivia",
    description:
      "Catálogo oficial de gorras con regulador graduable. Visera curva, snapback y trucker en más de 10 colores. ¡Pide directo por WhatsApp con envío garantizado!",
    url: "https://braysa-caps-frontend.vercel.app",
    siteName: "BRAYSA Caps Bolivia",
    locale: "es_BO",
    type: "website",
    images: [
      {
        url: "/banners/banner_caps.jpg",
        width: 1200,
        height: 630,
        alt: "BRAYSA Caps - Headwear Vanguard Bolivia",
      },
      {
        url: "/BRAYSA_logos/negro/BRAYSA_01_logo_principal_grande_negro.png",
        width: 800,
        height: 800,
        alt: "Logo BRAYSA Caps",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BRAYSA Caps | Gorras Streetwear Bolivia",
    description:
      "Gorras urbanas con regulador ajustable. Envíos a toda Bolivia y compras directas por WhatsApp.",
    images: ["/banners/banner_caps.jpg"],
  },
  icons: {
    icon: "/BRAYSA_logos/negro/BRAYSA_04_icono_negro.png",
    apple: "/BRAYSA_logos/negro/BRAYSA_04_icono_negro.png",
  },
  robots: {
    index: true,
    follow: true,
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
