"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check, Clock, QrCode } from "lucide-react"
import { GuestHeader } from "@/components/guest-header"
import { GuestFooter } from "@/components/guest-footer"

export default function PixPaymentPage({ params }: { params: { companyId: string } }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const [copied, setCopied] = useState(false)
  const [paymentConfirmed, setPaymentConfirmed] = useState(false)

  // Get reservation data from URL params
  const reservationData = {
    name: searchParams.get("name") || "",
    email: searchParams.get("email") || "",
    phone: searchParams.get("phone") || "",
    date: searchParams.get("date") || "",
    time: searchParams.get("time") || "",
    duration: searchParams.get("duration") || "1",
    courtName: searchParams.get("courtName") || "",
    price: searchParams.get("price") || "0",
    reservationId: searchParams.get("reservationId") || "",
    companyName: searchParams.get("companyName") || "",
  }

  // Mock PIX code
  const pixCode =
    "00020126580014BR.GOV.BCB.PIX013636c4b8c4-4c4c-4c4c-4c4c-4c4c4c4c4c4c5204000053039865802BR5925CENTRO ESPORTIVO ELITE6009SAO PAULO62070503***6304"

  // Timer effect
  useEffect(() => {
    if (timeLeft > 0 && !paymentConfirmed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0) {
      // Simulate payment confirmation after timer expires
      setPaymentConfirmed(true)
      setTimeout(() => {
        const confirmationParams = new URLSearchParams()
        Object.entries(reservationData).forEach(([key, value]) => {
          confirmationParams.set(key, value.toString())
        })
        confirmationParams.set("paymentStatus", "confirmed")
        router.push(`/vitrine/${params.companyId}/confirmacao?${confirmationParams.toString()}`)
      }, 2000)
    }
  }, [timeLeft, paymentConfirmed, router, params.companyId])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const copyPixCode = async () => {
    try {
      await navigator.clipboard.writeText(pixCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy: ", err)
    }
  }

  const getTimerColor = () => {
    if (timeLeft > 300) return "text-green-600" // > 5 minutes
    if (timeLeft > 60) return "text-yellow-600" // > 1 minute
    return "text-red-600" // < 1 minute
  }

  if (paymentConfirmed) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Pagamento Confirmado!</h2>
            <p className="text-slate-600 mb-4">Redirecionando para confirmação...</p>
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-700 mx-auto"></div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <GuestHeader companyId={params.companyId} />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-6">
            <Button variant="outline" onClick={() => router.back()} className="mb-4">
              ← Voltar
            </Button>
            <h1 className="text-3xl font-bold text-slate-800">Pagamento PIX</h1>
            <p className="text-slate-600 mt-2">Escaneie o QR Code ou copie o código PIX</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* QR Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <QrCode className="h-5 w-5" />
                  QR Code PIX
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <div className="bg-white p-6 rounded-lg border-2 border-slate-200 mb-4">
                  <img src="/placeholder.svg?height=200&width=200" alt="QR Code PIX" className="w-48 h-48 mx-auto" />
                </div>
                <p className="text-sm text-slate-600">Abra o app do seu banco e escaneie o código</p>
              </CardContent>
            </Card>

            {/* PIX Code */}
            <Card>
              <CardHeader>
                <CardTitle className="text-slate-800 flex items-center gap-2">
                  <Copy className="h-5 w-5" />
                  Código PIX
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-slate-100 p-4 rounded-lg mb-4">
                  <code className="text-xs break-all text-slate-700">{pixCode}</code>
                </div>
                <Button onClick={copyPixCode} className="w-full bg-slate-700 hover:bg-slate-800" disabled={copied}>
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Copiado!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4 mr-2" />
                      Copiar Código PIX
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Timer and Instructions */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-slate-500" />
                  <span className="text-slate-600">Tempo restante para pagamento:</span>
                </div>
                <div className={`text-4xl font-bold ${getTimerColor()}`}>{formatTime(timeLeft)}</div>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800">Como pagar:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-slate-600">
                  <li>Abra o aplicativo do seu banco</li>
                  <li>Procure pela opção PIX</li>
                  <li>Escaneie o QR Code ou cole o código PIX</li>
                  <li>Confirme os dados e finalize o pagamento</li>
                  <li>Aguarde a confirmação automática</li>
                </ol>
              </div>

              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Resumo do Pagamento</h4>
                <div className="space-y-1 text-sm text-blue-700">
                  <div className="flex justify-between">
                    <span>Quadra:</span>
                    <span>{reservationData.courtName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Data/Hora:</span>
                    <span>
                      {reservationData.date} às {reservationData.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duração:</span>
                    <span>{reservationData.duration}h</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t border-blue-200 pt-2 mt-2">
                    <span>Total:</span>
                    <span>R$ {reservationData.price}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <GuestFooter />
    </div>
  )
}

