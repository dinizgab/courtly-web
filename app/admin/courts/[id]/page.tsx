"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import {
    ArrowLeft,
    Edit,
    Trash,
    Clock,
    Users,
    Calendar,
    DollarSign,
    ImageIcon,
    CheckCircle,
    XCircle,
} from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/axios"
import { Booking, BookingApi, Court, CourtApi } from "@/lib/types"
import { getBookingTotalPrice, getTimeFromDateString, strToTitle } from "@/lib/utils"
import { AxiosResponse } from "axios"

export default function CourtDetailsPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [court, setCourt] = useState<Court | null>(null)
    const [bookings, setBookings] = useState<Booking[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const { id } = useParams() as { id: string }

    useEffect(() => {
        const fetchCourt = async () => {
            setIsLoading(true)
            try {
                await api.get(`/courts/${id}`).then((response: AxiosResponse<CourtApi>) => {
                    const court: CourtApi = response.data
                    const parsedCourt: Court = {
                        id: court.id,
                        companyId: court.company_id,
                        name: court.name,
                        sportType: court.sport_type,
                        hourlyPrice: court.hourly_price,
                        isActive: court.is_active,
                        description: court.description,
                        openingTime: court.opening_time,
                        closingTime: court.closing_time,
                        capacity: court.capacity,
                        bookingsToday: 0,
                        photos: court.photos || [],
                    }

                    setCourt(parsedCourt)
                })

                await api.get(`/courts/${id}/bookings`).then((response: AxiosResponse<BookingApi[]>) => {
                    const bookings = response.data.map((booking: BookingApi) => ({
                        id: booking.id,
                        courtId: booking.court_id,
                        guestName: booking.guest_name,
                        guestEmail: booking.guest_email,
                        guestPhone: booking.guest_phone,
                        data: getTimeFromDateString(booking.start_time),
                        startTime: booking.start_time,
                        endTime: booking.end_time,
                        verificationCode: booking.verification_code,
                        status: booking.status
                    }))

                    setBookings(bookings)
                })
            } catch (error) {
                console.error("Erro ao buscar dados da quadra:", error)
                toast({
                    title: "Erro ao carregar dados",
                    description: "Não foi possível carregar os detalhes da quadra.",
                    variant: "destructive",
                })
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourt()
    }, [id, toast])

    const handleDelete = async () => {
        if (confirm("Tem certeza que deseja excluir esta quadra? Esta ação não pode ser desfeita.")) {
            await api.delete(`/courts/${id}`).then((response: AxiosResponse) => {
                if (response.status === 200) {
                    toast({
                        title: "Quadra excluída",
                        description: "A quadra foi excluída com sucesso.",
                    })

                    router.push("/admin/courts")
                } else {
                    toast({
                        title: "Erro ao excluir quadra",
                        description: "Não foi possível excluir a quadra. Tente novamente mais tarde.",
                        variant: "destructive",
                    })
                }

            })

        }
    }

    const toggleStatus = () => {
        if (!court) return
        const newStatus = !court.isActive

        setCourt({
            ...court,
            isActive: newStatus,
        })

        toast({
            title: `Quadra ${newStatus ? "ativada" : "desativada"}`,
            description: `A quadra foi ${newStatus ? "ativada" : "desativada"} com sucesso.`,
        })
    }

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "confirmed":
                return <Badge className="bg-green-500 hover:bg-green-600">Confirmada</Badge>
            case "pending":
                return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendente</Badge>
            case "cancelled":
                return <Badge className="bg-red-500 hover:bg-red-600">Cancelada</Badge>
            default:
                return <Badge>{status}</Badge>
        }
    }

    //const gerarHorarios = () => {
    //    if (!court) return []

    //    const horarios = []
    //    const [horaInicio] = court.openingTime.split(":")
    //    const [horaFim] = court.closingTime.split(":")

    //        for (let hora = Number.parseInt(horaInicio); hora < Number.parseInt(horaFim); hora++) {
    //            const horaFormatada = hora.toString().padStart(2, "0")
    //            const disponivel = !bookings.some((r) => {
    //                const [inicio] = r.horario.split(" - ")[0].split(":")
    //                return Number.parseInt(inicio) === hora && new Date(r.data).toDateString() === new Date().toDateString()
    //            })

    //            horarios.push({
    //                horario: `${horaFormatada}:00 - ${(hora + 1).toString().padStart(2, "0")}:00`,
    //                disponivel,
    //            })
    //        }

    //    return horarios
    //}

    const getFormattedBookingText = (booking: Booking) => {
        return `${new Date(booking.startTime).toLocaleDateString("pt-BR")} • ${getTimeFromDateString(booking.startTime)} - ${getTimeFromDateString(booking.endTime)}`
    }

    // TODO - Componentize this page
    // TODO - Check if its better to use loading component instead of creating a component here
    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-green-50">
                <AdminSidebar activePage="quadras" />
                <div className="flex-1">
                    <AdminHeader title="Detalhes da Quadra" />
                    <main className="p-6">
                        <div className="flex justify-center items-center h-[60vh]">
                            <div className="animate-pulse text-green-600">Carregando detalhes da quadra...</div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    if (!court) {
        return (
            <div className="flex min-h-screen bg-green-50">
                <AdminSidebar activePage="quadras" />
                <div className="flex-1">
                    <AdminHeader title="Detalhes da Quadra" />
                    <main className="p-6">
                        <div className="text-center py-12">
                            <h2 className="text-2xl font-bold text-gray-700">Quadra não encontrada</h2>
                            <p className="mt-2 text-gray-500">A quadra que você está procurando não existe ou foi removida.</p>
                            <Button className="mt-4" onClick={() => router.push("/admin/courts")}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Voltar para lista de quadras
                            </Button>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-green-50">
            <AdminSidebar activePage="quadras" />
            <div className="flex-1">
                <AdminHeader title="Detalhes da Quadra" />
                <main className="p-6">
                    <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
                        <Button variant="outline" onClick={() => router.push("/admin/courts")}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para lista
                        </Button>
                        <div className="flex gap-2">
                            <Button
                                variant="outline"
                                className={
                                    court.isActive ? "text-red-500 border-red-500" : "text-green-500 border-green-500"
                                }
                                onClick={toggleStatus}
                            >
                                {court.isActive ? (
                                    <>
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Desativar
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="mr-2 h-4 w-4" />
                                        Ativar
                                    </>
                                )}
                            </Button>
                            <Button variant="outline" onClick={() => router.push(`/admin/courts/${id}/edit`)}>
                                <Edit className="mr-2 h-4 w-4" />
                                Editar
                            </Button>
                            <Button variant="destructive" onClick={handleDelete}>
                                <Trash className="mr-2 h-4 w-4" />
                                Excluir
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader className="pb-2">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-2xl">{court.name}</CardTitle>
                                            <div className="flex items-center mt-2 space-x-2">
                                                <Badge className="bg-blue-500 hover:bg-blue-600">{strToTitle(court.sportType)}</Badge>
                                                <Badge
                                                    className={
                                                        court.isActive
                                                            ? "bg-green-500 hover:bg-green-600"
                                                            : "bg-gray-500 hover:bg-gray-600"
                                                    }
                                                >
                                                    {court.isActive ? "Ativa" : "Inativa"}
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="text-2xl font-bold text-green-600">R$ {court.hourlyPrice.toFixed(2)}</div>
                                            <div className="text-sm text-gray-500">por hora</div>
                                        </div>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="info" className="mt-4">
                                        <TabsList className="mb-4">
                                            <TabsTrigger value="info">Informações</TabsTrigger>
                                            {
                                                //<TabsTrigger value="fotos">Fotos</TabsTrigger>
                                            }
                                            {
                                                //<TabsTrigger value="horarios">Horários</TabsTrigger>
                                            }
                                            <TabsTrigger value="reservas">Reservas</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value="info" className="space-y-4">
                                            <div>
                                                <h3 className="font-semibold mb-2">Descrição</h3>
                                                <p className="text-gray-700">{court.description || "Nenhuma descrição disponível."}</p>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                                <div className="flex items-start">
                                                    <Clock className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-medium">Horário de Funcionamento</h4>
                                                        <p className="text-gray-600">
                                                            {getTimeFromDateString(court.openingTime)} às {getTimeFromDateString(court.closingTime)}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start">
                                                    <Users className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-medium">Capacidade</h4>
                                                        <p className="text-gray-600">{court.capacity > 0 ? `${court.capacity} pessoas` : "Não informada"}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-start">
                                                    <Calendar className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                                                    <div>
                                                        <h4 className="font-medium">Reservas Hoje</h4>
                                                        <p className="text-gray-600">{court.bookingsToday} reservas</p>
                                                    </div>
                                                </div>

                                                {
                                                    // TODO - Adicionar campo de endereço na quadra
                                                    //<div className="flex items-start">
                                                    //    <MapPin className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                                                    //    <div>
                                                    //        <h4 className="font-medium">Localização</h4>
                                                    //        <p className="text-gray-600">{court.endereco || "Não informado"}</p>
                                                    //    </div>
                                                    //</div>
                                                }
                                            </div>
                                        </TabsContent>
                                        <TabsContent value="fotos">
                                            {court.photos && court.photos.length > 0 ? (
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    {court.photos.map((photo, index) => (
                                                        <div key={index} className="relative aspect-video rounded-md overflow-hidden border">
                                                            <Image
                                                                src={photo || "/placeholder.svg"}
                                                                alt={`Foto ${index + 1} da ${court.name}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 border rounded-md">
                                                    <ImageIcon className="h-12 w-12 mx-auto text-gray-400" />
                                                    <p className="mt-2 text-gray-500">Nenhuma foto disponível</p>
                                                </div>
                                            )}
                                        </TabsContent>

                                        {
                                            //<TabsContent value="horarios">
                                            //    <div className="space-y-4">
                                            //        <h3 className="font-semibold">Disponibilidade para Hoje</h3>
                                            //
                                            //            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                            //                {gerarHorarios().map((slot, index) => (
                                            //                    <div
                                            //                        key={index}
                                            //                        className={`p-3 rounded-md border text-center ${slot.disponivel
                                            //                            ? "border-green-200 bg-green-50 text-green-700"
                                            //                            : "border-gray-200 bg-gray-100 text-gray-500"
                                            //                            }`}
                                            //                    >
                                            //                        <div className="font-medium">{slot.horario}</div>
                                            //                        <div className="text-xs mt-1">{slot.disponivel ? "Disponível" : "Reservado"}</div>
                                            //                    </div>
                                            //                ))}
                                            //            </div>
                                            //        }
                                            //    </div>
                                            //</TabsContent>
                                        }

                                        <TabsContent value="reservas">
                                            {bookings.length > 0 ? (
                                                <div className="space-y-4">
                                                    <h3 className="font-semibold">Próximas Reservas</h3>
                                                    <div className="space-y-3">
                                                        {bookings.map((booking) => (
                                                            <div
                                                                key={booking.id}
                                                                className="p-4 border rounded-md flex flex-col sm:flex-row justify-between"
                                                            >
                                                                <div>
                                                                    <div className="font-medium">{booking.guestName}</div>
                                                                    <div className="text-sm text-gray-500">{booking.guestEmail}</div>
                                                                    <div className="text-sm text-gray-500">{booking.guestPhone}</div>
                                                                    <div className="text-sm mt-1">
                                                                        {getFormattedBookingText(booking)}
                                                                    </div>
                                                                </div>
                                                                <div className="mt-2 sm:mt-0 flex flex-col sm:items-end">
                                                                    {
                                                                        <div className="flex items-center">
                                                                            <DollarSign className="h-4 w-4 text-green-600 mr-1" />
                                                                            <span className="font-medium">R$ {getBookingTotalPrice(booking).toFixed(2)}</span>
                                                                        </div>
                                                                    }
                                                                    <div className="mt-1">{getStatusBadge(booking.status)}</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                    <Button
                                                        variant="outline"
                                                        className="w-full mt-4"
                                                        onClick={() => router.push("/admin/bookings?court=" + court.id)}
                                                    >
                                                        Ver todas as reservas
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div className="text-center py-12 border rounded-md">
                                                    <Calendar className="h-12 w-12 mx-auto text-gray-400" />
                                                    <p className="mt-2 text-gray-500">Nenhuma reserva encontrada</p>
                                                    <Button
                                                        variant="outline"
                                                        className="mt-4"
                                                        onClick={() => router.push("/admin/bookings/nova?court=" + court.id)}
                                                    >
                                                        Criar nova reserva
                                                    </Button>
                                                </div>
                                            )}
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>

                        <div>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Ações Rápidas</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <Button
                                        className="w-full bg-green-600 hover:bg-green-700"
                                        onClick={() => router.push("/admin/bookings/new?quadra=" + court.id)}
                                    >
                                        <Calendar className="mr-2 h-4 w-4" />
                                        Nova Reserva
                                    </Button>

                                    <Button
                                        variant="outline"
                                        className="w-full"
                                        onClick={() => router.push(`/admin/courts/${id}/edit`)}
                                    >
                                        <Edit className="mr-2 h-4 w-4" />
                                        Editar Quadra
                                    </Button>

                                    {
                                        //<Button
                                        //    variant="outline"
                                        //    className="w-full"
                                        //    onClick={() => {
                                        //        // Aqui você poderia abrir um modal para configurar horários específicos
                                        //        alert("Funcionalidade de configuração de horários será implementada em breve.")
                                        //    }}
                                        //>
                                        //    <Clock className="mr-2 h-4 w-4" />
                                        //    Configurar Horários
                                        //</Button>
                                        // TODO - Adicionar funcionalidade de estatísticas
                                        //<div className="pt-4 border-t">
                                        //    <h3 className="font-medium mb-3">Estatísticas</h3>
                                        //    <div className="space-y-3">
                                        //        <div className="flex justify-between">
                                        //            <span className="text-gray-600">Taxa de ocupação:</span>
                                        //            <span className="font-medium">65%</span>
                                        //        </div>
                                        //        <div className="flex justify-between">
                                        //            <span className="text-gray-600">Reservas este mês:</span>
                                        //            <span className="font-medium">24</span>
                                        //        </div>
                                        //        <div className="flex justify-between">
                                        //            <span className="text-gray-600">Faturamento mensal:</span>
                                        //            <span className="font-medium text-green-600">R$ 1.920,00</span>
                                        //        </div>
                                        //    </div>
                                        //</div>
                                    }
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    )
}

