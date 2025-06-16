"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Copy, Check, Clock, QrCode } from "lucide-react"
import { GuestHeader } from "@/components/guest-header"
import { GuestFooter } from "@/components/guest-footer"
import { useBookingPaymentStatus } from "@/hooks/use-booking-payment-status"
import { useBookingInformationShowcase } from "@/hooks/use-booking"
import { formatBookingDateTimeString, formatTimePtBr } from "@/utils/date"
import { useChargePaymentInformation } from "@/hooks/use-charge-information"

export default function PixPaymentPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const bookingId = searchParams.get("bookingId")
    const { companyId } = useParams()
    const [timeLeft, setTimeLeft] = useState(30 * 60)
    const [copied, setCopied] = useState(false)
    const [paymentConfirmed, setPaymentConfirmed] = useState(false)
    const { data: status } = useBookingPaymentStatus(bookingId!)
    const { data: booking, isLoading } = useBookingInformationShowcase(bookingId!)
    const { data: charge } = useChargePaymentInformation(bookingId!)

    useEffect(() => {
        // TODO - Handle if the payment time expires
        if (status === "paid") {
            setPaymentConfirmed(true)

            router.replace(`/showcase/${companyId}/confirmation?id=${bookingId}`)
        } else {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)

            return () => clearTimeout(timer)
        }
    }, [status, timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }

    const copyPixCode = async () => {
        try {
            await navigator.clipboard.writeText(charge!.brCode)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error("Failed to copy: ", err)
        }
    }

    const getTimerColor = () => {
        if (timeLeft > 900) return "text-green-600"
        if (timeLeft > 60) return "text-yellow-600"
        return "text-red-600"
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

    if (isLoading || !booking || !charge) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-pulse text-slate-600">Carregando informações...</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-slate-50">
            <GuestHeader />

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
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-slate-800 flex items-center gap-2">
                                    <QrCode className="h-5 w-5" />
                                    QR Code PIX
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="text-center">
                                <div className="bg-white p-6 rounded-lg border-2 border-slate-200 mb-4">
                                    <img src={`${charge.qrCodeImage}?height=200&width=200`} alt="QR Code PIX" className="w-48 h-48 mx-auto" />
                                </div>
                                <p className="text-sm text-slate-600">Abra o app do seu banco e escaneie o código</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-slate-800 flex items-center gap-2">
                                    <Copy className="h-5 w-5" />
                                    Código PIX
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="bg-slate-100 p-4 rounded-lg mb-4">
                                    <code className="text-xs break-all text-slate-700">{charge.brCode}</code>
                                </div>
                                <Button onClick={copyPixCode} className="w-full bg-primary hover:bg-primary-heavy" disabled={copied}>
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

                            <div className="mt-6 p-4 bg-primary-hiper_light rounded-lg">
                                <h4 className="font-semibold text-primary-heavy mb-2">Resumo do Pagamento</h4>
                                <div className="space-y-1 text-sm text-primary">
                                    <div className="flex justify-between">
                                        <span>Quadra:</span>
                                        <span>{booking?.court?.name}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Data/Hora:</span>
                                        <span>
                                            {formatBookingDateTimeString(booking?.startTime!)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Duração:</span>
                                        <span>{`${formatTimePtBr(booking?.startTime!)} - ${formatTimePtBr(booking?.endTime!)}`}</span>
                                    </div>
                                    <div className="flex justify-between font-semibold border-t border-blue-200 pt-2 mt-2">
                                        <span>Total:</span>
                                        <span>R$ {booking?.totalPrice.toFixed(2)}</span>
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
