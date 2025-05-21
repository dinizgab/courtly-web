"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { GuestHeader } from "@/components/guest-header"
import { GuestFooter } from "@/components/guest-footer"
import { CheckCircle, Calendar, Clock, MapPin } from "lucide-react"

export default function ConfirmacaoPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const reservaId = searchParams.get("reserva")

  // Em um caso real, você buscaria os detalhes da reserva usando o ID
  const reservaSimulada = {
    id: reservaId || "123456",
    quadra: "Quadra de Futsal Coberta",
    data: "19/05/2025",
    horario: "16:00 - 17:00",
    valor: 80.0,
    codigo: "QF" + Math.floor(1000 + Math.random() * 9000),
    endereco: "Rua das Quadras, 123 - Centro",
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GuestHeader />

      <div className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <Card className="border-green-200 shadow-lg">
            <CardHeader className="text-center bg-green-50 border-b border-green-100">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-green-100 p-3">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-green-800">Reserva Confirmada!</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-6">
                <div className="text-center">
                  <p className="text-gray-600">
                    Sua reserva foi realizada com sucesso. Guarde o código de confirmação para apresentar no local.
                  </p>
                  <div className="mt-4 py-3 px-6 bg-green-50 rounded-md inline-block">
                    <span className="text-2xl font-bold text-green-800">{reservaSimulada.codigo}</span>
                  </div>
                </div>

                <div className="border-t border-b py-4 space-y-4">
                  <h3 className="font-medium text-lg">Detalhes da Reserva</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                      <Calendar className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Data</p>
                        <p className="font-medium">{reservaSimulada.data}</p>
                      </div>
                    </div>
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Horário</p>
                        <p className="font-medium">{reservaSimulada.horario}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                      <div>
                        <p className="text-sm text-gray-500">Local</p>
                        <p className="font-medium">{reservaSimulada.quadra}</p>
                        <p className="text-sm text-gray-600">{reservaSimulada.endereco}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between items-center">
                      <span className="font-medium">Valor Total:</span>
                      <span className="font-bold text-green-600">R$ {reservaSimulada.valor.toFixed(2)}</span>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Pagamento será realizado no local</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <h3 className="font-medium">Instruções:</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Chegue com 15 minutos de antecedência</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Apresente o código de confirmação na recepção</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Em caso de cancelamento, entre em contato com pelo menos 24h de antecedência</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => window.print()}>
                Imprimir Comprovante
              </Button>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push("/vitrine")}>
                Voltar para Início
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>

      <GuestFooter />
    </div>
  )
}
