"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"

// Dados simulados de quadras
const quadrasMock = [
  { id: "1", nome: "Quadra de Futsal Coberta", precoHora: 80 },
  { id: "2", nome: "Quadra de Vôlei", precoHora: 60 },
  { id: "3", nome: "Quadra de Beach Tennis", precoHora: 100 },
  { id: "4", nome: "Quadra de Tênis", precoHora: 90 },
  { id: "5", nome: "Quadra de Society", precoHora: 120 },
]

// Gerar horários disponíveis
const gerarHorarios = () => {
  const horarios = []
  for (let hora = 8; hora < 22; hora++) {
    horarios.push(`${hora}:00 - ${hora + 1}:00`)
  }
  return horarios
}

export default function NovaReservaPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [quadraSelecionada, setQuadraSelecionada] = useState("")
  const [data, setData] = useState("")
  const [duracao, setDuracao] = useState("1")
  const [valorTotal, setValorTotal] = useState(0)

  const horarios = gerarHorarios()

  const calcularValorTotal = (quadraId: string, duracaoHoras: string) => {
    const quadra = quadrasMock.find((q) => q.id === quadraId)
    if (quadra) {
      setValorTotal(quadra.precoHora * Number.parseInt(duracaoHoras))
    } else {
      setValorTotal(0)
    }
  }

  const handleQuadraChange = (value: string) => {
    setQuadraSelecionada(value)
    calcularValorTotal(value, duracao)
  }

  const handleDuracaoChange = (value: string) => {
    setDuracao(value)
    calcularValorTotal(quadraSelecionada, value)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/admin/bookings")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar activePage="bookings" />
      <div className="flex-1">
        <AdminHeader title="Nova Reserva" />
        <main className="p-6">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Cadastrar Nova Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="cliente">Nome do Cliente</Label>
                    <Input id="cliente" placeholder="Nome completo" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="contato">Contato</Label>
                    <Input id="contato" placeholder="Email ou telefone" required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quadra">Quadra</Label>
                  <Select required onValueChange={handleQuadraChange}>
                    <SelectTrigger id="quadra">
                      <SelectValue placeholder="Selecione a quadra" />
                    </SelectTrigger>
                    <SelectContent>
                      {quadrasMock.map((quadra) => (
                        <SelectItem key={quadra.id} value={quadra.id}>
                          {quadra.nome} - R$ {quadra.precoHora}/hora
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="data">Data</Label>
                    <Input
                      id="data"
                      type="date"
                      min={new Date().toISOString().split("T")[0]}
                      value={data}
                      onChange={(e) => setData(e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="horario">Horário</Label>
                    <Select required>
                      <SelectTrigger id="horario">
                        <SelectValue placeholder="Selecione o horário" />
                      </SelectTrigger>
                      <SelectContent>
                        {horarios.map((horario) => (
                          <SelectItem key={horario} value={horario}>
                            {horario}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="duracao">Duração (horas)</Label>
                    <Select required value={duracao} onValueChange={handleDuracaoChange}>
                      <SelectTrigger id="duracao">
                        <SelectValue placeholder="Selecione a duração" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 hora</SelectItem>
                        <SelectItem value="2">2 horas</SelectItem>
                        <SelectItem value="3">3 horas</SelectItem>
                        <SelectItem value="4">4 horas</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="valor">Valor Total</Label>
                    <Input id="valor" value={`R$ ${valorTotal.toFixed(2)}`} readOnly className="bg-muted" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="observacoes">Observações</Label>
                  <Input id="observacoes" placeholder="Observações adicionais (opcional)" />
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push("/admin/bookings")}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  className="bg-slate-600 hover:bg-slate-700"
                  disabled={isSubmitting || !quadraSelecionada || !data}
                >
                  {isSubmitting ? "Salvando..." : "Salvar Reserva"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
}
