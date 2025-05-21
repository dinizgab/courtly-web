"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreVertical, Eye, XCircle, CheckCircle } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import api from "@/lib/axios"
import { AxiosResponse } from "axios"
import { Booking, BookingApi } from "@/lib/types"
import { formatBookingTime } from "@/lib/utils"
import { useToast } from "@/hooks/use-toast"
import { VerificationCodeModal } from "@/components/verification-code-modal"

export default function BookingsPage() {
    const [bookings, setBookings] = useState<Booking[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [statusFilter, setStatusFilter] = useState("todas")
    const [isVerificationModalOpen, setIsVerificationModalOpen] = useState(false)
    const [selectedBooking, setSelectedReservation] = useState<string | null>(null)
    const { toast } = useToast()

    const filteredBookings = bookings.filter(
        (b) =>
            (statusFilter === "todas" || b.status === statusFilter) &&
            (b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.court?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.guestEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                b.guestPhone.toLowerCase().includes(searchTerm.toLowerCase())
            ),
    )

    const handleCancelar = (id: string) => {
        if (confirm("Tem certeza que deseja cancelar esta reserva?")) {
            setBookings(bookings.map((b) => (b.id === id ? { ...b, status: "cancelled" } : b)))
        }
    }

    const handleConfirmClick = (id: string) => {
        setSelectedReservation(id)
        setIsVerificationModalOpen(true)
    }

    const handleVerificationSubmit = async (code: string): Promise<boolean> => {
        const response = await api.patch(`/companies/${"11111111-1111-1111-1111-111111111111"}/bookings/${selectedBooking}/confirm`, {
            verification_code: code,
        })

        if (response.status === 200) {
            setBookings(bookings.map((r) => (r.id === selectedBooking ? { ...r, status: "confirmed" } : r)))

            toast({
                title: "Reserva confirmada",
                description: "A reserva foi confirmada com sucesso.",
            })

            return true
        } else {
            toast({
                title: "Código inválido",
                description: "O código de verificação informado é inválido.",
                variant: "destructive",
            })

            return false
        }
    }

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                await api.get(`/companies/${"11111111-1111-1111-1111-111111111111"}/bookings`)
                    .then((res: AxiosResponse<BookingApi[]>) => {
                        const parsedBookings = res.data.map((booking: BookingApi) => ({
                            id: booking.id,
                            courtId: booking.court_id,
                            startTime: booking.start_time,
                            endTime: booking.end_time,
                            status: booking.status,
                            guestName: booking.guest_name,
                            guestEmail: booking.guest_email,
                            guestPhone: booking.guest_phone,
                            verificationCode: booking.verification_code,
                            court: { name: booking.court?.name, hourlyPrice: booking.court?.hourly_price, }
                        } as Booking))

                        setBookings(parsedBookings)
                    })
            } catch (error) {
                toast({
                    title: "Erro ao excluir quadra",
                    description: "Não foi possível carregar as reservas. Tente novamente mais tarde.",
                    variant: "destructive",
                })
                console.error("Erro ao buscar reservas:", error)
            }
        }

        fetchBookings()
    }, [])

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

    const getTotalPrice = (booking: Booking) => {
        const startTime = new Date(booking.startTime)
        const endTime = new Date(booking.endTime)
        const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
        return (booking.court?.hourlyPrice || 0) * durationInHours
    }

    return (
        <div className="flex min-h-screen bg-green-50">
            <AdminSidebar activePage="reservas" />
            <div className="flex-1">
                <AdminHeader title="Gerenciar Reservas" />
                <main className="p-6">
                    <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                            <div className="relative w-full sm:w-64">
                                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Buscar reservas..."
                                    className="pl-8"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={statusFilter} onValueChange={setStatusFilter}>
                                <SelectTrigger className="w-full sm:w-40">
                                    <SelectValue placeholder="Filtrar por status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="todas">Todas</SelectItem>
                                    <SelectItem value="confirmed">Confirmadas</SelectItem>
                                    <SelectItem value="pending">Pendentes</SelectItem>
                                    <SelectItem value="cancelled">Canceladas</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button asChild className="bg-green-600 hover:bg-green-700">
                            <Link href="/admin/bookings/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Reserva
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Cliente</TableHead>
                                        <TableHead>Contato</TableHead>
                                        <TableHead>Quadra</TableHead>
                                        <TableHead>Data</TableHead>
                                        <TableHead>Horário</TableHead>
                                        <TableHead className="text-right">Valor</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredBookings.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={8} className="text-center py-6">
                                                Nenhuma reserva encontrada
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredBookings.map((booking: Booking) => (
                                            <TableRow key={booking.id}>
                                                <TableCell className="font-medium">{booking.guestName}</TableCell>
                                                <TableCell>{booking.guestEmail}</TableCell>
                                                <TableCell>{booking.court?.name}</TableCell>
                                                <TableCell>{new Date(booking.startTime).toLocaleDateString("pt-BR")}</TableCell>
                                                <TableCell>{formatBookingTime(booking)}</TableCell>
                                                <TableCell className="text-right">R$ {getTotalPrice(booking).toFixed(2)}</TableCell>
                                                <TableCell>{getStatusBadge(booking.status)}</TableCell>
                                                <TableCell className="text-right">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button variant="ghost" className="h-8 w-8 p-0">
                                                                <span className="sr-only">Abrir menu</span>
                                                                <MoreVertical className="h-4 w-4" />
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/bookings/${booking.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Ver detalhes
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            {booking.status === "pending" && (
                                                                <DropdownMenuItem onClick={() => handleConfirmClick(booking.id)}>
                                                                    <CheckCircle className="mr-2 h-4 w-4" />
                                                                    Confirmar
                                                                </DropdownMenuItem>
                                                            )}
                                                            {booking.status !== "cancelled" && (
                                                                <DropdownMenuItem
                                                                    onClick={() => handleCancelar(booking.id)}
                                                                    className="text-red-600 focus:text-red-600"
                                                                >
                                                                    <XCircle className="mr-2 h-4 w-4" />
                                                                    Cancelar
                                                                </DropdownMenuItem>
                                                            )}
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </main>
            </div>
            <VerificationCodeModal
                isOpen={isVerificationModalOpen}
                onClose={() => setIsVerificationModalOpen(false)}
                onConfirm={handleVerificationSubmit}
                reservationId={selectedBooking || ""}
            />
        </div>
    )
}
