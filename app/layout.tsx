import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import { ProviderRedux } from "@/components/Provider";
import { InterfaceProvider } from "@/components/interfaceProvider";

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Huella vital",
  description: "Gestión veterinaria",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <ProviderRedux>
        <body className={`font-sans antialiased`}>
          <InterfaceProvider />
          {children}
        </body>
      </ProviderRedux>
    </html>
  );
}
