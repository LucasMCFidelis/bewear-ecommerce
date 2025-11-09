import "./globals.css";

import type { Metadata } from "next";
import { Anton, Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
import { Toaster } from "sonner";

import Footer from "@/components/common/footer";
import Header from "@/components/common/header";
import { NuqsProvider } from "@/providers/nuqs-provider";
import ReactQueryProvider from "@/providers/react-query";
import ThemeProvider from "@/providers/theme-provider";

import { getAllCategories } from "./data/categories/get-all-categories";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const anton = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-anton",
});

export const metadata: Metadata = {
  title: "Bewear E-commerce",
  description:
    "Aplicação FullStack com Next.js, React, TypeScript, Tailwind CSS e shadcn/ui. Uso de React Query, React Hook Form com validação via zod, integração Stripe e API Melhor Envio. Gerenciamento de estado com Nuqs e persistência com Drizzle ORM. Implementação de Data Access Layer para desacoplamento do banco.Ferramentas: Next.js, React, TypeScript, Tailwind CSS, shadcn/ui, React Query, React Hook Form, zod,Drizzle ORM, Nuqs, Git.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const categories = await getAllCategories({
    withProducts: false,
    withVariants: false,
  });

  return (
    <html lang="pt">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${anton.variable} antialiased flex flex-col min-h-screen`}
      >
        <ReactQueryProvider>
          <NuqsProvider>
            <ThemeProvider>
              <Suspense fallback={<p>Carregando...</p>}>
                <Header categories={categories} />
                <div className="flex-1">
                  {children}
                  <Toaster />
                </div>
                <Footer />
              </Suspense>
            </ThemeProvider>
          </NuqsProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
