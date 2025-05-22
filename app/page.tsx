"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, MapPin, Clock } from "lucide-react"
import { GuestHeader } from "@/components/guest-header"
import { GuestFooter } from "@/components/guest-footer"

// Tipo para a quadra
interface Quadra {
  id: string
  nome: string
  tipo: string
  precoHora: number
  descricao?: string
  fotoPrincipal: string
  horaInicio: string
  horaFim: string
  endereco?: string
}

export default function VitrinePage() {
  const router = useRouter()
  const [quadras, setQuadras] = useState<Quadra[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [tipoFiltro, setTipoFiltro] = useState("todos")

  // Simular busca de dados das quadras
  useEffect(() => {
    const fetchQuadras = async () => {
      setIsLoading(true)
      try {
        // Simulação de chamada à API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Dados simulados
        const quadrasData: Quadra[] = [
          {
            id: "1",
            nome: "Quadra de Futsal Coberta",
            tipo: "Futsal",
            precoHora: 80,
            descricao: "Quadra de futsal coberta com piso emborrachado, medindo 25x15 metros.",
            fotoPrincipal: "/placeholder.svg?height=300&width=500",
            horaInicio: "08:00",
            horaFim: "22:00",
            endereco: "Rua das Quadras, 123 - Centro",
          },
          {
            id: "2",
            nome: "Quadra de Vôlei",
            tipo: "Vôlei",
            precoHora: 60,
            descricao: "Quadra de vôlei com piso de madeira e iluminação profissional.",
            fotoPrincipal: "/placeholder.svg?height=300&width=500",
            horaInicio: "09:00",
            horaFim: "21:00",
            endereco: "Rua das Quadras, 123 - Centro",
          },
          {
            id: "3",
            nome: "Quadra de Beach Tennis",
            tipo: "Beach Tennis",
            precoHora: 100,
            descricao: "Quadra de beach tennis com areia fina e redes profissionais.",
            fotoPrincipal: "/placeholder.svg?height=300&width=500",
            horaInicio: "08:00",
            horaFim: "20:00",
            endereco: "Rua das Quadras, 123 - Centro",
          },
          {
            id: "4",
            nome: "Quadra de Tênis",
            tipo: "Tênis",
            precoHora: 90,
            descricao: "Quadra de tênis com piso rápido e iluminação noturna.",
            fotoPrincipal: "/placeholder.svg?height=300&width=500",
            horaInicio: "07:00",
            horaFim: "22:00",
            endereco: "Rua das Quadras, 123 - Centro",
          },
          {
            id: "5",
            nome: "Quadra de Society",
            tipo: "Society",
            precoHora: 120,
            descricao: "Quadra de society com grama sintética de alta qualidade.",
            fotoPrincipal: "/placeholder.svg?height=300&width=500",
            horaInicio: "08:00",
            horaFim: "23:00",
            endereco: "Rua das Quadras, 123 - Centro",
          },
        ]

        setQuadras(quadrasData)
      } catch (error) {
        console.error("Erro ao buscar quadras:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuadras()
  }, [])

  // Filtrar quadras
  const quadrasFiltradas = quadras.filter(
    (quadra) =>
      (tipoFiltro === "todos" || quadra.tipo.toLowerCase() === tipoFiltro.toLowerCase()) &&
      (quadra.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quadra.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        quadra.tipo.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Tipos de quadras para o filtro
  const tiposQuadras = ["todos", ...Array.from(new Set(quadras.map((q) => q.tipo.toLowerCase())))]

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GuestHeader />

      {/* Hero Section */}
      <section className="relative bg-green-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Reserve sua quadra esportiva</h1>
          <p className="text-xl mb-8">Encontre e reserve a quadra ideal para seu esporte favorito</p>
          <div className="max-w-3xl mx-auto flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                placeholder="Buscar quadras..."
                className="pl-10 h-12 bg-white text-gray-800"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
              <SelectTrigger className="w-full sm:w-[180px] h-12 bg-white text-gray-800">
                <SelectValue placeholder="Tipo de quadra" />
              </SelectTrigger>
              <SelectContent>
                {tiposQuadras.map((tipo) => (
                  <SelectItem key={tipo} value={tipo}>
                    {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Quadras Section */}
      <section className="py-12 container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Quadras Disponíveis</h2>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-green-600">Carregando quadras...</div>
          </div>
        ) : quadrasFiltradas.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-medium text-gray-700">Nenhuma quadra encontrada</h3>
            <p className="mt-2 text-gray-500">Tente ajustar seus filtros de busca</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quadrasFiltradas.map((quadra) => (
              <Card key={quadra.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative h-48">
                  <Image
                    src={quadra.fotoPrincipal || "/placeholder.svg"}
                    alt={quadra.nome}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                  <Badge className="absolute top-2 right-2 bg-green-600">{quadra.tipo}</Badge>
                </div>
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-2">{quadra.nome}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{quadra.descricao}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-4 w-4 mr-2" />
                      <span>{quadra.endereco}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>
                        {quadra.horaInicio} às {quadra.horaFim}
                      </span>
                    </div>
                    <div className="flex items-center text-sm font-medium text-green-600">
                      <span>R$ {quadra.precoHora.toFixed(2)} / hora</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Button
                      variant="outline"
                      className="text-green-600 border-green-600 hover:bg-green-50"
                      onClick={() => router.push(`/showcase/courts/${quadra.id}`)}
                    >
                      Ver detalhes
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => router.push(`/vitrine/reservar/${quadra.id}`)}
                    >
                      Reservar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Como Funciona Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Como Funciona</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Escolha sua quadra</h3>
              <p className="text-gray-600">
                Navegue pelas quadras disponíveis e escolha a que melhor atende suas necessidades
              </p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Selecione data e horário</h3>
              <p className="text-gray-600">Escolha a data e o horário disponível que você deseja reservar</p>
            </div>
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Confirme sua reserva</h3>
              <p className="text-gray-600">Informe seus dados e confirme sua reserva. O pagamento é feito no local</p>
            </div>
          </div>
        </div>
      </section>

      <GuestFooter />
    </div>
  )
}
