"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Plus, Search, MoreVertical, Edit, Trash, Eye, CheckCircle, XCircle } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { AxiosResponse } from "axios"
import api from "@/lib/axios"
import { Court, CourtApi } from "@/types/court"
import { useToast } from "@/components/ui/use-toast"
import { strToTitle } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

export default function courtsPage() {
    const [courts, setCourts] = useState<Court[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const { toast } = useToast()
    const { companyId, token } = useAuth()

    const handleDelete = (id: string) => {
        if (confirm("Tem certeza que deseja excluir esta quadra?")) {
            setCourts(courts.filter((court) => court.id !== id))

            api.delete(`/courts/${id}`).then((response: AxiosResponse) => {
                if (response.status === 200) {
                    toast({
                        title: "Quadra excluída",
                        description: "Quadra excluída com sucesso!",
                        variant: "default",
                    })
                } else {
                    toast({
                        title: "Erro ao excluir quadra",
                        description: "Não foi possível excluir a quadra.",
                        variant: "destructive",
                    })
                }
            })
        }
    }

    const toggleStatus = (id: string) => {
        setCourts(
            courts.map((court) =>
                court.id === id
                    ? { ...court, isActive: !court.isActive }
                    : court,
            ),
        )
    }

    useEffect(() => {
        const fetchCourts = async () => {
            try {

                if (!companyId || !token) return

                const response = await api.get(`/admin/companies/${companyId}/courts`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                })

                const courtsData = response.data.map((court: CourtApi) => ({
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
                    bookingsToday: court.bookings_today,
                } as Court))

                setCourts(courtsData);
            } catch (error) {
                console.error("Error fetching courts:", error)
                toast({
                    title: "Erro ao carregar quadras",
                    description: "Não foi possível carregar as quadras.",
                    variant: "destructive",
                })
            }
        }

        fetchCourts()
    }, [companyId, token])

    const filteredcourts = courts.filter(
        (court) =>
            court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            court.sportType.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar activePage="courts" />
            <div className="flex-1">
                <AdminHeader title="Gerenciar Quadras" />
                <main className="p-6">
                    <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Buscar quadras..."
                                className="pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button asChild className="bg-slate-600 hover:bg-slate-700">
                            <Link href="/admin/courts/new">
                                <Plus className="mr-2 h-4 w-4" />
                                Nova Quadra
                            </Link>
                        </Button>
                    </div>

                    <Card>
                        <CardContent className="p-0">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nome</TableHead>
                                        <TableHead>Tipo</TableHead>
                                        <TableHead className="text-right">Preço/Hora</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead className="text-center">Reservas Hoje</TableHead>
                                        <TableHead className="text-right">Ações</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredcourts.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={6} className="text-center py-6">
                                                Nenhuma quadra encontrada
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        filteredcourts.map((court) => (
                                            <TableRow key={court.id}>
                                                <TableCell className="font-medium">{court.name}</TableCell>
                                                <TableCell>{strToTitle(court.sportType.replace("_", " "))}</TableCell>
                                                <TableCell className="text-right">R$ {court.hourlyPrice.toFixed(2)}</TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant={court.isActive ? "default" : "secondary"}
                                                        className={
                                                            `${court.isActive
                                                                ? "bg-green-500 hover:bg-green-600"
                                                                : "bg-red-500 hover:bg-red-600"} text-white`
                                                        }
                                                    >
                                                        {court.isActive ? "Ativa" : "Inativa"}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-center">{court.bookingsToday}</TableCell>
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
                                                                <Link href={`/admin/courts/${court.id}`}>
                                                                    <Eye className="mr-2 h-4 w-4" />
                                                                    Ver detalhes
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem asChild>
                                                                <Link href={`/admin/courts/${court.id}/edit`}>
                                                                    <Edit className="mr-2 h-4 w-4" />
                                                                    Editar
                                                                </Link>
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem onClick={() => toggleStatus(court.id)}>
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
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => handleDelete(court.id)}
                                                                className="text-red-600 focus:text-red-600"
                                                            >
                                                                <Trash className="mr-2 h-4 w-4" />
                                                                Excluir
                                                            </DropdownMenuItem>
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
        </div>
    )
}
