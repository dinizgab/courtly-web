"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GuestHeader } from "@/components/guest-header"
import { GuestFooter } from "@/components/guest-footer"
import { ArrowLeft, Clock, Users, Calendar, MapPin, Star, CheckCircle } from "lucide-react"

// Tipo para a quadra
interface Quadra {
  id: string
  nome: string
  tipo: string
  precoHora: number
  capacidade?: number
  descricao?: string
  fotos: string[]
  horaInicio: string
  horaFim: string
  endereco?: string
  avaliacoes: {
    nota: number
    comentario: string
    autor: string
    data: string
  }[]
  recursos: string[]
}

export default function QuadraDetalhesPage() {
  const router = useRouter()
  const [quadra, setQuadra] = useState<Quadra | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [fotoAtiva, setFotoAtiva] = useState(0)
  const { id } = useParams() as { id: string }

  // Simular busca de dados da quadra
  useEffect(() => {
    const fetchQuadra = async () => {
      setIsLoading(true)
      try {
        // Simulação de chamada à API
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Dados simulados
        const quadraData: Quadra = {
          id: id,
          nome: "Quadra de Futsal Coberta",
          tipo: "Futsal",
          precoHora: 80,
          capacidade: 14,
          descricao:
            "Quadra de futsal coberta com piso emborrachado, medindo 25x15 metros. Possui iluminação de LED, redes novas e marcação oficial. Ideal para jogos de 5 a 7 jogadores por equipe. Ambiente climatizado e com vestiários completos.",
          fotos: [
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
            "/placeholder.svg?height=400&width=600",
          ],
          horaInicio: "08:00",
          horaFim: "22:00",
          endereco: "Rua das Quadras, 123 - Centro",
          avaliacoes: [
            {
              nota: 5,
              comentario: "Quadra excelente, piso de qualidade e iluminação perfeita.",
              autor: "João Silva",
              data: "2025-04-15",
            },
            {
              nota: 4,
              comentario: "Muito boa estrutura, apenas o vestiário que poderia ser melhor.",
              autor: "Maria Oliveira",
              data: "2025-04-10",
            },
            {
              nota: 5,
              comentario: "Melhor quadra da região, sempre jogo aqui com meus amigos.",
              autor: "Carlos Santos",
              data: "2025-03-28",
            },
          ],
          recursos: [
            "Iluminação LED",
            "Piso emborrachado",
            "Vestiários",
            "Estacionamento",
            "Bebedouros",
            "Arquibancada",
            "Wi-Fi",
          ],
        }

        setQuadra(quadraData)
      } catch (error) {
        console.error("Erro ao buscar dados da quadra:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuadra()
  }, [id])

  // Gerar horários disponíveis para hoje
  const gerarHorarios = () => {
    if (!quadra) return []

    const horarios = []
    const [horaInicio] = quadra.horaInicio.split(":")
    const [horaFim] = quadra.horaFim.split(":")

    for (let hora = Number.parseInt(horaInicio); hora < Number.parseInt(horaFim); hora++) {
      const horaFormatada = hora.toString().padStart(2, "0")
      // Simulação de disponibilidade (horários pares estão disponíveis)
      const disponivel = hora % 2 === 0

      horarios.push({
        horario: `${horaFormatada}:00 - ${(hora + 1).toString().padStart(2, "0")}:00`,
        disponivel,
      })
    }

    return horarios
  }

  // Calcular média das avaliações
  const calcularMediaAvaliacoes = () => {
    if (!quadra || quadra.avaliacoes.length === 0) return 0
    const soma = quadra.avaliacoes.reduce((acc, avaliacao) => acc + avaliacao.nota, 0)
    return soma / quadra.avaliacoes.length
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <GuestHeader />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-green-600">Carregando detalhes da quadra...</div>
          </div>
        </div>
        <GuestFooter />
      </div>
    )
  }

  if (!quadra) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <GuestHeader />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">Quadra não encontrada</h2>
            <p className="mt-2 text-gray-500">A quadra que você está procurando não existe ou foi removida.</p>
            <Button className="mt-4" onClick={() => router.push("/vitrine")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para lista de quadras
            </Button>
          </div>
        </div>
        <GuestFooter />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GuestHeader />

      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/vitrine")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para lista
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Galeria de Fotos */}
            <div className="mb-8">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <Image
                  src={quadra.fotos[fotoAtiva] || "/placeholder.svg"}
                  alt={quadra.nome}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {quadra.fotos.map((foto, index) => (
                  <div
                    key={index}
                    className={`relative aspect-video rounded-md overflow-hidden cursor-pointer ${index === fotoAtiva ? "ring-2 ring-green-600" : ""
                      }`}
                    onClick={() => setFotoAtiva(index)}
                  >
                    <Image src={foto || "/placeholder.svg"} alt={`Foto ${index + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            </div>

            {/* Informações da Quadra */}
            <div className="mb-8">
              <div className="flex flex-wrap justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{quadra.nome}</h1>
                  <div className="flex items-center mt-2">
                    <Badge className="bg-green-600 mr-2">{quadra.tipo}</Badge>
                    <div className="flex items-center text-yellow-500">
                      <Star className="fill-current h-4 w-4 mr-1" />
                      <span className="font-medium">{calcularMediaAvaliacoes().toFixed(1)}</span>
                      <span className="text-gray-500 ml-1">({quadra.avaliacoes.length} avaliações)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right mt-2 lg:mt-0">
                  <div className="text-2xl font-bold text-green-600">R$ {quadra.precoHora.toFixed(2)}</div>
                  <div className="text-sm text-gray-500">por hora</div>
                </div>
              </div>

              <Tabs defaultValue="descricao" className="mt-6">
                <TabsList className="mb-4">
                  <TabsTrigger value="descricao">Descrição</TabsTrigger>
                  <TabsTrigger value="recursos">Recursos</TabsTrigger>
                  <TabsTrigger value="horarios">Horários</TabsTrigger>
                  <TabsTrigger value="avaliacoes">Avaliações</TabsTrigger>
                </TabsList>

                <TabsContent value="descricao" className="space-y-4">
                  <p className="text-gray-700">{quadra.descricao}</p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <div className="flex items-start">
                      <Clock className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Horário de Funcionamento</h4>
                        <p className="text-gray-600">
                          {quadra.horaInicio} às {quadra.horaFim}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Users className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Capacidade</h4>
                        <p className="text-gray-600">{quadra.capacidade || "Não informada"} pessoas</p>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-green-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-medium">Localização</h4>
                        <p className="text-gray-600">{quadra.endereco || "Não informado"}</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="recursos">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {quadra.recursos.map((recurso, index) => (
                      <div key={index} className="flex items-center p-3 bg-gray-50 rounded-md">
                        <CheckCircle className="h-4 w-4 text-green-600 mr-2" />
                        <span>{recurso}</span>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="horarios">
                  <div className="space-y-4">
                    <h3 className="font-semibold">Disponibilidade para Hoje</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {gerarHorarios().map((slot, index) => (
                        <div
                          key={index}
                          className={`p-3 rounded-md border text-center ${slot.disponivel
                            ? "border-green-200 bg-green-50 text-green-700"
                            : "border-gray-200 bg-gray-100 text-gray-500"
                            }`}
                        >
                          <div className="font-medium">{slot.horario}</div>
                          <div className="text-xs mt-1">{slot.disponivel ? "Disponível" : "Reservado"}</div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      Para ver a disponibilidade em outras datas, prossiga para a tela de reserva.
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="avaliacoes">
                  <div className="space-y-4">
                    {quadra.avaliacoes.map((avaliacao, index) => (
                      <div key={index} className="border-b pb-4 last:border-0">
                        <div className="flex justify-between items-center mb-2">
                          <div className="font-medium">{avaliacao.autor}</div>
                          <div className="flex items-center">
                            <div className="flex">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${i < avaliacao.nota ? "text-yellow-500 fill-current" : "text-gray-300"
                                    }`}
                                />
                              ))}
                            </div>
                            <span className="text-xs text-gray-500 ml-2">
                              {new Date(avaliacao.data).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700">{avaliacao.comentario}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4">Reservar esta quadra</h2>
                <p className="text-gray-600 mb-6">
                  Selecione a data e horário desejados para verificar a disponibilidade e fazer sua reserva.
                </p>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700"
                  size="lg"
                  onClick={() => router.push(`/vitrine/reservar/${quadra.id}`)}
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Reservar Agora
                </Button>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-medium mb-2">Informações importantes:</h3>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Pagamento realizado no local</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Cancelamento gratuito com até 24h de antecedência</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                      <span>Chegue 15 minutos antes do horário reservado</span>
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <GuestFooter />
    </div>
  )
}
