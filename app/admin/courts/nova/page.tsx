"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function NovaQuadraPage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
      router.push("/admin/courts")
    }, 1000)
  }

  return (
    <div className="flex min-h-screen bg-green-50">
      <AdminSidebar activePage="quadras" />
      <div className="flex-1">
        <AdminHeader title="Nova Quadra" />
        <main className="p-6">
          <Card>
            <form onSubmit={handleSubmit}>
              <CardHeader>
                <CardTitle>Cadastrar Nova Quadra</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="nome">Nome da Quadra</Label>
                    <Input id="nome" placeholder="Ex: Quadra de Futsal Coberta" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de Quadra</Label>
                    <Select required>
                      <SelectTrigger id="tipo">
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="futsal">Futsal</SelectItem>
                        <SelectItem value="society">Society</SelectItem>
                        <SelectItem value="volei">Vôlei</SelectItem>
                        <SelectItem value="beach-tennis">Beach Tennis</SelectItem>
                        <SelectItem value="tenis">Tênis</SelectItem>
                        <SelectItem value="basquete">Basquete</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="preco">Preço por Hora (R$)</Label>
                    <Input id="preco" type="number" min="0" step="0.01" placeholder="0.00" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="capacidade">Capacidade (pessoas)</Label>
                    <Input id="capacidade" type="number" min="1" placeholder="10" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="descricao">Descrição</Label>
                  <Textarea
                    id="descricao"
                    placeholder="Descreva detalhes sobre a quadra, como dimensões, tipo de piso, etc."
                    className="min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fotos">Fotos da Quadra</Label>
                  <Input id="fotos" type="file" multiple accept="image/*" />
                  <p className="text-sm text-muted-foreground">
                    Você pode selecionar múltiplas fotos. Formatos aceitos: JPG, PNG.
                  </p>
                </div>

                <div className="space-y-4">
                  <Label>Horários Disponíveis</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="hora-inicio">Horário de Abertura</Label>
                      <Input id="hora-inicio" type="time" defaultValue="08:00" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="hora-fim">Horário de Fechamento</Label>
                      <Input id="hora-fim" type="time" defaultValue="22:00" required />
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="ativa" defaultChecked />
                  <Label htmlFor="ativa">Quadra ativa e disponível para reservas</Label>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.push("/admin/quadras")}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                  {isSubmitting ? "Salvando..." : "Salvar Quadra"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </main>
      </div>
    </div>
  )
}
