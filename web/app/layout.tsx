import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/hooks/useAuth"
import { ToastProvider } from "@/components/providers/toast-provider"
import { ThemeProvider } from "@/components/providers/theme-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PhytoVigil - Intelligence Artificielle pour la Santé Végétale",
  description:
    "Détectez instantanément les maladies de vos plantes grâce à l'IA avancée et obtenez des solutions naturelles personnalisées.",
  keywords: "plantes, maladies, IA, intelligence artificielle, jardinage, agriculture",
  authors: [{ name: "PhytoVigil Team" }],
  openGraph: {
    title: "PhytoVigil - IA pour la Santé Végétale",
    description: "Révolutionnez vos soins végétaux avec l'intelligence artificielle",
    type: "website",
    locale: "fr_FR",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ToastProvider>{children}</ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
