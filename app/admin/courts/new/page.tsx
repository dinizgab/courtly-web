"use client"

import type React from "react"

import { useContext, useState } from "react"
import { useRouter } from "next/navigation"
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
import { Loader2 } from "lucide-react"
import api from "@/lib/axios"
import { AxiosResponse } from "axios"
import { useAuth } from "@/app/contexts/auth-context"

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

export default function NewCourtPage() {
    const router = useRouter()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [fotos, setFotos] = useState<FileList | null>(null)
    const { toast } = useToast()
    const { companyId, token } = useAuth()

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
            //if (fotos) {
            //  Array.from(fotos).forEach((file, index) => {
            //    formData.append(`photo_${index}`, file)
            //  })
            //}

            await api.post("/api/courts", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            })
                .then((response: AxiosResponse) => {
                    if (response.status === 201) {
                        toast({
                            title: "Quadra cadastrada com sucesso!",
                            description: `A quadra ${data.name} foi cadastrada com sucesso.`,
                        })
                        router.push("/admin/courts")
                    } else {
                        toast({
                            title: "Erro ao cadastrar quadra",
                            description: "Não foi possível cadastrar a quadra.",
                            variant: "destructive",
                        })
                    }
                })
        } catch (error) {
            console.error("Erro ao cadastrar quadra:", error)
            toast({
                title: "Erro ao cadastrar quadra",
                description: error instanceof Error ? error.message : "Ocorreu um erro ao cadastrar a quadra",
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

    return (
        <div className="flex min-h-screen bg-green-50">
            <AdminSidebar activePage="courts" />
            <div className="flex-1">
                <AdminHeader title="Nova Quadra" />
                <main className="p-6">
                    <Card>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <CardHeader>
                                    <CardTitle>Cadastrar Nova Quadra</CardTitle>
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
                                                                <SelectValue placeholder="Selecione o tipo" />
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

                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Descrição</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Descreva detalhes sobre a quadra, como dimensões, tipo de piso, etc."
                                                        className="min-h-[100px]"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-2">
                                        <Label htmlFor="fotos">Fotos da Quadra</Label>
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
                                        onClick={() => router.push("/admin/courts")}
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </Button>
                                    <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Salvando...
                                            </>
                                        ) : (
                                            "Salvar Quadra"
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

