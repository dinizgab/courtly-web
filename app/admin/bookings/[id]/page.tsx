"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { VerificationCodeModal } from "@/components/verification-code-modal"
import { useToast } from "@/components/ui/use-toast"
import {
    ArrowLeft,
    Calendar,
    Clock,
    MapPin,
    User,
    Phone,
    Mail,
    DollarSign,
    CheckCircle,
    XCircle,
    AlertTriangle,
    Copy,
} from "lucide-react"
import { Booking, BookingApi } from "@/lib/types"
import { formatBookingTime, getBookingTotalPrice } from "@/lib/utils"
import api from "@/lib/axios"
import { useAuth } from "@/app/contexts/auth-context"

export default function BookingDetailsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [booking, setBooking] = useState<Booking | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
    const { id } = useParams() as { id: string }
    const { token } = useAuth()

    useEffect(() => {
        const fetchBooking = async () => {
            setIsLoading(true)
            try {
                const response = await api.get(`/admin/bookings/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        }
                    }

                )

                if (response.status === 200) {
                    const bookingData: BookingApi = response.data
                    const booking = {
                        id: bookingData.id,
                        courtId: bookingData.court_id,
                        guestName: bookingData.guest_name,
                        guestEmail: bookingData.guest_email,
                        guestPhone: bookingData.guest_phone,
                        startTime: bookingData.start_time,
                        endTime: bookingData.end_time,
                        status: bookingData.status,
                        verificationCode: bookingData.verification_code,
                        totalPrice: bookingData.total_price,
                        court: {
                            name: bookingData.court?.name,
                        }
                    }

                    setBooking(booking)
                } else {
                    toast({
                        title: "Erro ao carregar dados",
                        description: "Não foi possível carregar os detalhes da reserva.",
                        variant: "destructive",
                    })

                    router.push("/admin/bookings")
                }
            } catch (error) {
                console.error("Erro ao buscar dados da reserva:", error)
                toast({
                    title: "Erro ao carregar dados",
                    description: "Não foi possível carregar os detalhes da reserva.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchBooking()
    }, [id, toast, token])

    const handleCancelar = () => {
        if (confirm("Tem certeza que deseja cancelar esta reserva?")) {
            if (booking) {
                setBooking({
                    ...booking,
                    status: "cancelled",
                })

                toast({
                    title: "Reserva cancelada",
                    description: "A reserva foi cancelada com sucesso.",
                })
            }
        }
    }

    const handleConfirmar = () => {
        setIsVerificationModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsVerificationModalOpen(false)
    }

    const handleVerificationSubmit = async (code: string): Promise<boolean> => {
        // Simular verificação do código
        await new Promise((resolve) => setTimeout(resolve, 1500))

        if (booking && booking.verificationCode === code) {
            // Código correto, atualizar status da reserva
            setBooking({
                ...booking,
                status: "confirmed",
            })

            toast({
                title: "Reserva confirmada",
                description: "A reserva foi confirmada com sucesso.",
            })

            return true
        } else {
            // Código incorreto
            toast({
                title: "Código inválido",
                description: "O código de verificação informado é inválido.",
                variant: "destructive",
            })

            return false
        }
    }

    const copyVerificationCode = () => {
        if (booking) {
            navigator.clipboard.writeText(booking.verificationCode)
            toast({
                title: "Código copiado",
                description: "O código de verificação foi copiado para a área de transferência.",
            })
        }
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return (
                    <Badge className="bg-green-500 hover:bg-green-600 text-white">
                        <CheckCircle className="mr-1 h-3 w-3" />
                        Confirmada
                    </Badge>
                )
            case "pending":
                return (
                    <Badge className="bg-yellow-500 hover:bg-yellow-600 text-white">
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        Pendente
                    </Badge>
                )
            case "cancelled":
                return (
                    <Badge className="bg-red-500 hover:bg-red-600 text-white">
                        <XCircle className="mr-1 h-3 w-3" />
                        Cancelada
                    </Badge>
                )
            default:
                return <Badge>{status}</Badge>
        }
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-green-50">
                <AdminSidebar activePage="reservas" />
                <div className="flex-1">
                    <AdminHeader title="Detalhes da Reserva" />
                    <main className="p-6">
                        <div className="flex justify-center items-center h-[60vh]">
                            <div className="animate-pulse text-green-600">Carregando detalhes da reserva...</div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    if (!booking) {
        return (
            <div className="flex min-h-screen bg-green-50">
                <AdminSidebar activePage="reservas" />
                <div className="flex-1">
                    <AdminHeader title="Detalhes da Reserva" />
                    <main className="p-6">
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-700">Reserva não encontrada</h2>
                            <p className="mt-2 text-gray-500">A reserva que você está procurando não existe ou foi removida.</p>
                            <Button className="mt-4" onClick={() => router.push("/admin/bookings")}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar para lista de reservas
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-green-50">
            <AdminSidebar activePage="bookings" />
            <div className="flex-1">
                <AdminHeader title="Detalhes da Reserva" />
                <main className="p-6">
                    <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
                        <Button variant="outline" onClick={() => router.push("/admin/bookings")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para lista
                        </Button>
                        <div className="flex gap-2">
                            {booking.status === "pending" && (
                                <Button className="bg-green-600 hover:bg-green-700" onClick={handleConfirmar}>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Confirmar Reserva
                                </Button>
                            )}
                            {booking.status !== "cancelled" && (
                                <Button variant="destructive" onClick={handleCancelar}>
                                    <XCircle className="mr-2 h-4 w-4" />
                                    Cancelar Reserva
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-2xl">Reserva #{booking.id}</CardTitle>
                                            <div className="mt-2">{getStatusBadge(booking.status)}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-green-600">R$ {booking.totalPrice.toFixed(2)}</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-lg">Informações da Reserva</h3>

                                            <div className="flex items-start">
                                                <Calendar className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium">Data</h4>
                                                    <p className="text-gray-600">{new Date(booking.startTime).toLocaleDateString("pt-BR")}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <Clock className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium">Horário</h4>
                                                    <p className="text-gray-600">{formatBookingTime(booking)}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <MapPin className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium">Quadra</h4>
                                                    <p className="text-gray-600">{booking.court?.name}</p>
                                                    <Button
                                                        variant="link"
                                                        className="p-0 h-auto text-green-600"
                                                        onClick={() => router.push(`/admin/courts/${booking.courtId}`)}
                                                    >
                                                        Ver detalhes da quadra
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="font-semibold text-lg">Informações do Cliente</h3>

                                            <div className="flex items-start">
                                                <User className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium">Nome</h4>
                                                    <p className="text-gray-600">{booking.guestName}</p>
                                                </div>
                                            </div>

                                            {booking.guestPhone && (
                                                <div className="flex items-start">
                                                    <Phone className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-medium">Telefone</h4>
                                                        <p className="text-gray-600">{booking.guestPhone}</p>
                                                    </div>
                                                </div>
                                            )}

                                            {booking.guestEmail && (
                                                <div className="flex items-start">
                                                    <Mail className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-medium">Email</h4>
                                                        <p className="text-gray-600">{booking.guestEmail}</p>
                                                    </div>
                                                </div>
                                            )}

                                            <div className="flex items-start">
                                                <DollarSign className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                                                <div>
                                                    <h4 className="font-medium">Valor</h4>
                                                    <p className="text-gray-600">R$ {getBookingTotalPrice(booking).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {
                                        // reserva.observacoes && (
                                        // <div className="mt-6 pt-6 border-t">
                                        //     <h3 className="font-semibold mb-2">Observações</h3>
                                        //     <p className="text-gray-700">{reserva.observacoes}</p>
                                        // </div>
                                        //)
                                    }
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Código de Verificação</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="bg-gray-50 p-4 rounded-md border text-center">
                                        <p className="text-sm text-gray-500 mb-2">Código para confirmação da reserva:</p>
                                        <div className="text-2xl font-mono font-bold tracking-widest">{booking.verificationCode}</div>
                                        <Button variant="outline" size="sm" className="mt-2" onClick={copyVerificationCode}>
                                            <Copy className="mr-2 h-4 w-4" />
                                            Copiar código
                                        </Button>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        <p className="mb-2">
                                            <strong>Como usar:</strong>
                                        </p>
                                        <ol className="list-decimal pl-5 space-y-1">
                                            <li>Solicite ao cliente o código de verificação enviado por email/SMS</li>
                                            <li>Clique em "Confirmar Reserva" e digite o código</li>
                                            <li>Após a verificação, a reserva será confirmada automaticamente</li>
                                        </ol>
                                    </div>

                                    {booking.status === "pending" ? (
                                        <Button className="w-full bg-green-600 hover:bg-green-700" onClick={handleConfirmar}>
                                            <CheckCircle className="mr-2 h-4 w-4" />
                                            Confirmar Reserva
                                        </Button>
                                    ) : booking.status === "confirmed" ? (
                                        <div className="bg-green-50 p-3 rounded-md border border-green-200 text-green-700 flex items-center justify-center">
                                            <CheckCircle className="mr-2 h-5 w-5" />
                                            Reserva já confirmada
                                        </div>
                                    ) : (
                                        <div className="bg-red-50 p-3 rounded-md border border-red-200 text-red-700 flex items-center justify-center">
                                            <XCircle className="mr-2 h-5 w-5" />
                                            Reserva cancelada
                                        </div>
                                    )}

                                    {booking.status !== "cancelled" && (
                                        <Button variant="outline" className="w-full" onClick={handleCancelar}>
                                            <XCircle className="mr-2 h-4 w-4" />
                                            Cancelar Reserva
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>

            {/* Modal de verificação - Renderizar apenas quando aberto */}
            {isVerificationModalOpen && (
                <VerificationCodeModal
                    isOpen={isVerificationModalOpen}
                    onClose={handleCloseModal}
                    onConfirm={handleVerificationSubmit}
                    reservationId={booking.id}
                />
            )}
        </div>
    )
}

