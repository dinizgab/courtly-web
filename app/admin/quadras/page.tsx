"use client"

import { useState } from "react"
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

// Dados simulados de quadras
const quadrasMock = [
  {
    id: "1",
    nome: "Quadra de Futsal Coberta",
    tipo: "Futsal",
    precoHora: 80,
    status: "ativa",
    reservasHoje: 3,
  },
  {
    id: "2",
    nome: "Quadra de Vôlei",
    tipo: "Vôlei",
    precoHora: 60,
    status: "ativa",
    reservasHoje: 2,
  },
  {
    id: "3",
    nome: "Quadra de Beach Tennis",
    tipo: "Beach Tennis",
    precoHora: 100,
    status: "ativa",
    reservasHoje: 5,
  },
  {
    id: "4",
    nome: "Quadra de Tênis",
    tipo: "Tênis",
    precoHora: 90,
    status: "inativa",
    reservasHoje: 0,
  },
  {
    id: "5",
    nome: "Quadra de Society",
    tipo: "Society",
    precoHora: 120,
    status: "ativa",
    reservasHoje: 4,
  },
]

export default function QuadrasPage() {
  const [quadras, setQuadras] = useState(quadrasMock)
  const [searchTerm, setSearchTerm] = useState("")

  const filteredQuadras = quadras.filter(
    (quadra) =>
      quadra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quadra.tipo.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta quadra?")) {
      setQuadras(quadras.filter((quadra) => quadra.id !== id))
    }
  }

  const toggleStatus = (id: string) => {
    setQuadras(
      quadras.map((quadra) =>
        quadra.id === id
          ? {
              ...quadra,
              status: quadra.status === "ativa" ? "inativa" : "ativa",
            }
          : quadra,
      ),
    )
  }

  return (
    <div className="flex min-h-screen bg-green-50">
      <AdminSidebar activePage="quadras" />
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
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <Link href="/admin/quadras/nova">
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
                  {filteredQuadras.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-6">
                        Nenhuma quadra encontrada
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredQuadras.map((quadra) => (
                      <TableRow key={quadra.id}>
                        <TableCell className="font-medium">{quadra.nome}</TableCell>
                        <TableCell>{quadra.tipo}</TableCell>
                        <TableCell className="text-right">R$ {quadra.precoHora.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={quadra.status === "ativa" ? "default" : "secondary"}
                            className={
                              quadra.status === "ativa"
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-500 hover:bg-gray-600"
                            }
                          >
                            {quadra.status === "ativa" ? "Ativa" : "Inativa"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">{quadra.reservasHoje}</TableCell>
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
                                <Link href={`/admin/quadras/${quadra.id}`}>
                                  <Eye className="mr-2 h-4 w-4" />
                                  Ver detalhes
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link href={`/admin/quadras/${quadra.id}/editar`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Editar
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleStatus(quadra.id)}>
                                {quadra.status === "ativa" ? (
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
                                onClick={() => handleDelete(quadra.id)}
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
