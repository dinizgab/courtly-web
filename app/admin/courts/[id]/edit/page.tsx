"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, Trash, ImageIcon } from "lucide-react"
import Image from "next/image"
import api from "@/lib/axios"
import { Court, CourtApi } from "@/types/court"
import { getTimeFromDateString } from "@/lib/utils"
import { useAuth } from "@/contexts/auth-context"

const courtFormSchema = z.object({
    name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    sportType: z.string({ required_error: "Selecione o tipo de quadra" }),
    hourlyPrice: z.coerce.number().positive({ message: "Preço deve ser maior que zero" }),
    capacity: z.coerce.number().int().positive().optional(),
    description: z.string().optional(),
    openingTime: z.string({ required_error: "Horário de abertura é obrigatório" }),
    closingTime: z.string({ required_error: "Horário de fechamento é obrigatório" }),
    isActive: z.boolean().default(true),
})

type CourtFormValues = z.infer<typeof courtFormSchema>

export default function EditCourtPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isLoading, setIsLoading] = useState(true)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fotos, setFotos] = useState<FileList | null>(null)
    const [fotosExistentes, setFotosExistentes] = useState<string[]>([])
    const [fotosParaRemover, setFotosParaRemover] = useState<string[]>([])
    const { id } = useParams() as { id: string }
    const { token, companyId } = useAuth()

    const form = useForm<CourtFormValues>({
        resolver: zodResolver(courtFormSchema),
        defaultValues: {
            name: "",
            sportType: "",
            hourlyPrice: 0,
            capacity: undefined,
            description: "",
            openingTime: "08:00",
            closingTime: "22:00",
            isActive: true,
        },
    })

    useEffect(() => {
        const fetchCourt = async () => {
            setIsLoading(true)
            try {
                if (!token) return
                const response = await api.get(`/admin/courts/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        }
                    })

                const court: CourtApi = response.data
                const parsedCourt: Court = {
                    id: court.id,
                    companyId: court.company_id,
                    name: court.name,
                    sportType: court.sport_type,
                    hourlyPrice: court.hourly_price,
                    isActive: court.is_active,
                    description: court.description,
                    openingTime: getTimeFromDateString(court.opening_time),
                    closingTime: getTimeFromDateString(court.closing_time),
                    capacity: court.capacity,
                    bookingsToday: 0,
                    photos: court.photos || [],
                }

                form.reset({
                    name: parsedCourt.name,
                    sportType: parsedCourt.sportType,
                    hourlyPrice: parsedCourt.hourlyPrice,
                    capacity: parsedCourt.capacity,
                    description: parsedCourt.description || "",
                    openingTime: parsedCourt.openingTime,
                    closingTime: parsedCourt.closingTime,
                    isActive: parsedCourt.isActive
                })

                setFotosExistentes(parsedCourt.photos)
            } catch (error) {
                console.error("Erro ao buscar dados da quadra:", error)
                toast({
                    title: "Erro ao carregar dados",
                    description: "Não foi possível carregar os detalhes da quadra para edição.",
                    variant: "destructive",
                })
                router.push("/admin/courts")
            } finally {
                setIsLoading(false)
            }
        }

        fetchCourt()
    }, [id, form, toast, router, token])

    const onSubmit = async (data: CourtFormValues) => {
        try {
            setIsSubmitting(true)
            const formData = new FormData()

            formData.append("court_info", JSON.stringify(
                {
                    name: data.name,
                    company_id: companyId,
                    sport_type: data.sportType,
                    hourly_price: data.hourlyPrice,
                    capacity: data.capacity,
                    description: data.description,
                    opening_time: `1970-01-01T${data.openingTime}:00Z`,
                    closing_time: `1970-01-01T${data.closingTime}:00Z`,
                    is_active: data.isActive,
                }
            ))

            // TODO - Check how to send photos to the backend
            //fotosParaRemover.forEach((foto, index) => {
            //    formData.append(`remover_foto_${index}`, foto)
            //})

            //if (fotos) {
            //    Array.from(fotos).forEach((file, index) => {
            //        formData.append(`foto_${index}`, file)
            //    })
            //}

            const response = await api.put(`/admin/courts/${id}`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            })

            if (response.status === 200) {
                toast({
                    title: "Quadra atualizada com sucesso!",
                    description: `A quadra ${data.name} foi atualizada com sucesso.`,
                })

                router.push(`/admin/courts/${id}`)
            } else {
                toast({
                    title: "Erro ao atualizar quadra",
                    description: "Não foi possível atualizar a quadra. Tente novamente mais tarde.",
                    variant: "destructive",
                })
            }
        } catch (error) {
            console.error("Erro ao atualizar quadra:", error)
            toast({
                title: "Erro ao atualizar quadra",
                description: error instanceof Error ? error.message : "Ocorreu um erro ao atualizar a quadra",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFotos(e.target.files)
        }
    }

    const handleRemoveFoto = (foto: string) => {
        setFotosExistentes(fotosExistentes.filter((f) => f !== foto))
        setFotosParaRemover([...fotosParaRemover, foto])
    }

    if (isLoading) {
        return (
            <div className="flex min-h-screen bg-slate-50">
                <AdminSidebar activePage="quadras" />
                <div className="flex-1">
                    <AdminHeader title="Editar Quadra" />
                    <main className="p-6">
                        <div className="flex justify-center items-center h-[60vh]">
                            <div className="animate-pulse text-slate-600">Carregando dados da quadra...</div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="flex min-h-screen bg-slate-50">
            <AdminSidebar activePage="quadras" />
            <div className="flex-1">
                <AdminHeader title="Editar Quadra" />
                <main className="p-6">
                    <div className="mb-6">
                        <Button variant="outline" onClick={() => router.push(`/admin/courts/${id}`)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Voltar para detalhes
                        </Button>
                    </div>

                    <Card>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <CardHeader>
                                    <CardTitle>Editar Quadra</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Nome da Quadra</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Ex: Quadra de Futsal Coberta" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="sportType"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tipo de Quadra</FormLabel>
                                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Selecione o sportType" />
                                                            </SelectTrigger>
                                                        </FormControl>
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
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <FormField
                                            control={form.control}
                                            name="hourlyPrice"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Preço por Hora (R$)</FormLabel>
                                                    <FormControl>
                                                        <Input type="number" min="0" step="0.01" placeholder="0.00" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <FormField
                                            control={form.control}
                                            name="capacity"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Capacidade (pessoas)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="1"
                                                            placeholder="10"
                                                            {...field}
                                                            value={field.value || ""}
                                                            onChange={(e) => {
                                                                const value = e.target.value === "" ? undefined : Number.parseInt(e.target.value)
                                                                field.onChange(value)
                                                            }}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {
                                        //     <FormField
                                        //         control={form.control}
                                        //         name="endereco"
                                        //         render={({ field }) => (
                                        //             <FormItem>
                                        //                 <FormLabel>Endereço</FormLabel>
                                        //                 <FormControl>
                                        //                     <Input placeholder="Endereço da quadra" {...field} value={field.value || ""} />
                                        //                 </FormControl>
                                        //                 <FormMessage />
                                        //             </FormItem>
                                        //         )}
                                        //     />
                                    }

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descrição</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Descreva detalhes sobre a quadra, como dimensões, sportType de piso, etc."
                                                        className="min-h-[100px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-4">
                                        <Label>Fotos Existentes</Label>
                                        {fotosExistentes.length > 0 ? (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                                {fotosExistentes.map((foto, index) => (
                                                    <div key={index} className="relative group">
                                                        <div className="relative aspect-video rounded-md overflow-hidden border">
                                                            <Image
                                                                src={foto || "/placeholder.svg"}
                                                                alt={`Foto ${index + 1}`}
                                                                fill
                                                                className="object-cover"
                                                            />
                                                        </div>
                                                        <Button
                                                            type="button"
                                                            variant="destructive"
                                                            size="sm"
                                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            onClick={() => handleRemoveFoto(foto)}
                                                        >
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-8 border rounded-md">
                                                <ImageIcon className="h-10 w-10 mx-auto text-gray-400" />
                                                <p className="mt-2 text-gray-500">Nenhuma foto disponível</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="fotos">Adicionar Novas Fotos</Label>
                                        <Input id="fotos" type="file" multiple accept="image/*" onChange={handleFileChange} />
                                        <p className="text-sm text-muted-foreground">
                                            Você pode selecionar múltiplas fotos. Formatos aceitos: JPG, PNG.
                                        </p>
                                    </div>

                                    <div className="space-y-4">
                                        <Label>Horários Disponíveis</Label>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="openingTime"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Horário de Abertura</FormLabel>
                                                        <FormControl>
                                                            <Input type="time" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="closingTime"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Horário de Fechamento</FormLabel>
                                                        <FormControl>
                                                            <Input type="time" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="isActive"
                                        render={({ field }) => (
                                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                                                <FormControl>
                                                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                </FormControl>
                                                <FormLabel>Quadra ativa e disponível para reservas</FormLabel>
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter className="flex justify-between">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => router.push(`/admin/quadras/${id}`)}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className="bg-blue-500 hover:bg-blue-600" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Atualizando...
                                            </>
                                        ) : (
                                            "Atualizar Quadra"
                                        )}
                                    </Button>
                                </CardFooter>
                            </form>
                        </Form>
                    </Card>
                </main>
            </div>
        </div>
    )
}
