"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Clock } from "lucide-react"
import { GuestHeader } from "@/components/guest-header"
import { GuestFooter } from "@/components/guest-footer"
import { Court, CourtApi } from "@/lib/types"
import api from "@/lib/axios"
import { getTimeFromDateString } from "@/lib/utils"

export default function CompanyShowcasePage() {
    const router = useRouter()
    const [courts, setCourts] = useState<Court[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [filterType, setTipoFiltro] = useState("todos")
    const { id } = useParams()

    useEffect(() => {
        const fetchCourts = async () => {
            setIsLoading(true)
            try {
                const response = await api.get(`/showcase/companies/${id}/courts`)

                const courtsData: Court[] = response.data.map((c: CourtApi) => ({
                    id: c.id,
                    name: c.name,
                    isActive: c.is_active,
                    capacity: c.capacity,
                    sportType: c.sport_type,
                    hourlyPrice: c.hourly_price,
                    description: c.description,
                    openingTime: getTimeFromDateString(c.opening_time),
                    closingTime: getTimeFromDateString(c.closing_time),
                    photos: [] as string[],
                } as Court))

                setCourts(courtsData)
            } catch (error) {
                console.error("Erro ao buscar quadras:", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourts()
    }, [])

    const filteredCourts = courts.filter(
        (court) =>
            (filterType === "todos" || court.sportType.toLowerCase() === filterType.toLowerCase()) &&
            (court.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                court.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                court.sportType.toLowerCase().includes(searchTerm.toLowerCase())),
    )

    const courtTypes = ["todos", ...Array.from(new Set(courts.map((q) => q.sportType.toLowerCase())))]

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
                        <Select value={filterType} onValueChange={setTipoFiltro}>
                            <SelectTrigger className="w-full sm:w-[180px] h-12 bg-white text-gray-800">
                                <SelectValue placeholder="Tipo de quadra" />
                            </SelectTrigger>
                            <SelectContent>
                                {courtTypes.map((tipo) => (
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
                ) : filteredCourts.length === 0 ? (
                    <div className="text-center py-12">
                        <h3 className="text-xl font-medium text-gray-700">Nenhuma quadra encontrada</h3>
                        <p className="mt-2 text-gray-500">Tente ajustar seus filtros de busca</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredCourts.map((c) => (
                            <Card key={c.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                                <div className="relative h-48">
                                    <Image
                                        src={c.photos.length > 0 ? c.photos[0] : "/placeholder.svg"}
                                        alt={c.name}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                    <Badge className="absolute top-2 right-2 bg-green-600">{c.sportType[0].toUpperCase() + c.sportType.slice(1)}</Badge>
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{c.name}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{c.description}</p>
                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                            <Clock className="h-4 w-4 mr-2" />
                                            <span>
                                                {c.openingTime} às {c.closingTime}
                                            </span>
                                        </div>
                                        <div className="flex items-center text-sm font-medium text-green-600">
                                            <span>R$ {c.hourlyPrice.toFixed(2)} / hora</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <Button
                                                variant="outline"
                                                className="text-green-600 border-green-600 hover:bg-green-50"
                                                onClick={() => router.push(`/showcase/courts/${c.id}`)}
                                            >
                                                Ver detalhes
                                            </Button>
                                            <Button
                                                className="bg-green-600 hover:bg-green-700"
                                                onClick={() => router.push(`/showcase/reservar/${c.id}`)}
                                            >
                                                Reservar
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )
                }
            </section >

            < section className="py-12 bg-gray-100" >
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
            </section >

            <GuestFooter />
        </div >
    )
}
