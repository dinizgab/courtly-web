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
import api from "@/lib/axios"
import { Court, CourtApi } from "@/lib/types"

export default function courtsPage() {
  const [courts, setCourts] = useState<Court[]>([])
  const [searchTerm, setSearchTerm] = useState("")

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta quadra?")) {
      setCourts(courts.filter((court) => court.id !== id))

      api.delete(`/courts/${id}`).then((response) => {
        if (response.status === 200) {
          alert("Quadra excluída com sucesso!")
        } else {
          alert("Erro ao excluir a quadra.")
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
    api.get("/companies/11111111-1111-1111-1111-111111111111/courts").then((response) => {
      const courtsData = response.data.map((court: CourtApi) => ({
        id: court.id,
        name: court.name,
        sportType: court.sport_type,
        hourlyPrice: court.hourly_price,
        isActive: court.is_active,
        reservationToday: 0
      }));

      console.log(courtsData);
      setCourts(courtsData);
    })
  }, [])

  const filteredcourts = courts.filter(
    (court) =>
      court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      court.sportType.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="flex min-h-screen bg-green-50">
      <AdminSidebar activePage="courts" />
      <div className="flex-1">
        <AdminHeader title="Gerenciar courts" />
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
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/admin/courts/nova">
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
                        <TableCell>{court.sportType[0].toUpperCase() + court.sportType.slice(1)}</TableCell>
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
                        <TableCell className="text-center">{1}</TableCell>
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
                                <Link href={`/admin/courts/${court.id}/editar`}>
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
