"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  const router = useRouter()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-b from-green-50 to-green-100">
      <div className="max-w-3xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold text-green-800">Sistema de Reserva de Quadras</h1>
        <p className="text-xl text-green-700">
          Gerencie suas quadras esportivas e reservas de forma simples e eficiente.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-6">
          <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => router.push("/admin/login")}>
            Acessar como Administrador
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-green-600 text-green-600 hover:bg-green-50"
            onClick={() => router.push("/vitrine")}
          >
            Ver Vitrine de Quadras
          </Button>
        </div>
      </div>
    </main>
  )
}
