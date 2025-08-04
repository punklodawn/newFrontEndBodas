import type React from "react"
import "./globals.css"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import AuthListener from '@/components/AuthListener'
import MusicPlayer from '@/components/MusicPlayer'

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata = {
  title: "Lilian & Miguel - Invitación de Boda",
  description: "Te invitamos a nuestra boda el 14 de Febrero, 2026",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} font-serif`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
          {children}
          <AuthListener />
          <MusicPlayer/>
        </ThemeProvider>
      </body>
    </html>
  )
}

