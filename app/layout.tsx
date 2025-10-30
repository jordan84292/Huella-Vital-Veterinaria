import type React from "react";
import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "VetCare - Sistema de Gestión Veterinaria",
  description: "Sistema completo de gestión para clínicas veterinarias",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`font-sans antialiased`}>{children}</body>
    </html>
  );
}
