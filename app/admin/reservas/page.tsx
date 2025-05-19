"use client"

import { useState } from "react"
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

// Dados simulados de reservas
const reservasMock = [
  {
    id: "1",
    cliente: "João Silva",
    contato: "joao@email.com",
    quadra: "Quadra de Futsal Coberta",
    data: "2025-05-18",
    horario: "14:00 - 15:00",
    valor: 80,
    status: "confirmada",
  },
  {
    id: "2",
    cliente: "Maria Oliveira",
    contato: "(11) 98765-4321",
    quadra: "Quadra de Vôlei",
    data: "2025-05-18",
    horario: "16:00 - 17:00",
    valor: 60,
    status: "pendente",
  },
  {
    id: "3",
    cliente: "Carlos Santos",
    contato: "carlos@email.com",
    quadra: "Quadra de Beach Tennis",
    data: "2025-05-19",
    horario: "10:00 - 12:00",
    valor: 200,
    status: "confirmada",
  },
  {
    id: "4",
    cliente: "Ana Pereira",
    contato: "(11) 91234-5678",
    quadra: "Quadra de Tênis",
    data: "2025-05-19",
    horario: "18:00 - 19:00",
    valor: 90,
    status: "cancelada",
  },
  {
    id: "5",
    cliente: "Roberto Almeida",
    contato: "roberto@email.com",
    quadra: "Quadra de Society",
    data: "2025-05-20",
    horario: "20:00 - 22:00",
    valor: 240,
    status: "confirmada",
  },
]

export default function ReservasPage() {
  const [reservas, setReservas] = useState(reservasMock)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("todas")

  const filteredReservas = reservas.filter(
    (reserva) =>
      (statusFilter === "todas" || reserva.status === statusFilter) &&
      (reserva.cliente.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.quadra.toLowerCase().includes(searchTerm.toLowerCase()) ||
        reserva.contato.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const handleCancelar = (id: string) => {
    if (confirm("Tem certeza que deseja cancelar esta reserva?")) {
      setReservas(reservas.map((reserva) => (reserva.id === id ? { ...reserva, status: "cancelada" } : reserva)))
    }
  }

  const handleConfirmar = (id: string) => {
    setReservas(reservas.map((reserva) => (reserva.id === id ? { ...reserva, status: "confirmada" } : reserva)))
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmada":
        return <Badge className="bg-green-500 hover:bg-green-600">Confirmada</Badge>
      case "pendente":
        return <Badge className="bg-yellow-500 hover:bg-yellow-600">Pendente</Badge>
      case "cancelada":
        return <Badge className="bg-red-500 hover:bg-red-600">Cancelada</Badge>
      default:
        return <Badge>{status}</Badge>
    }
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
                  <SelectItem value="confirmada">Confirmadas</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="cancelada">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/admin/reservas/nova">
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
                  {filteredReservas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-6">
                        Nenhuma reserva encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredReservas.map((reserva) => (
                      <TableRow key={reserva.id}>
                        <TableCell className="font-medium">{reserva.cliente}</TableCell>
                        <TableCell>{reserva.contato}</TableCell>
                        <TableCell>{reserva.quadra}</TableCell>
                        <TableCell>{new Date(reserva.data).toLocaleDateString("pt-BR")}</TableCell>
                        <TableCell>{reserva.horario}</TableCell>
                        <TableCell className="text-right">R$ {reserva.valor.toFixed(2)}</TableCell>
                        <TableCell>{getStatusBadge(reserva.status)}</TableCell>
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
                                <Link href={`/admin/reservas/${reserva.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalhes
                                </Link>
                              </DropdownMenuItem>
                              {reserva.status === "pendente" && (
                                <DropdownMenuItem onClick={() => handleConfirmar(reserva.id)}>
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Confirmar
                                </DropdownMenuItem>
                              )}
                              {reserva.status !== "cancelada" && (
                                <DropdownMenuItem
                                  onClick={() => handleCancelar(reserva.id)}
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
    </div>
  )
}
