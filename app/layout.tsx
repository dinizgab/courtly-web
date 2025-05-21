import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "./contexts/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "Sistema de Reserva de Quadras",
    description: "Gerencie suas quadras esportivas e reservas de forma simples e eficiente.",
}

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="pt-BR">
            <body className={inter.className}>
                <ThemeProvider attribute="class" defaultTheme="light">
                    <AuthProvider>
                        {children}
                        <Toaster />
                    </AuthProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
