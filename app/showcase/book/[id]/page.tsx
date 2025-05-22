"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { format, addDays } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GuestHeader } from "@/components/guest-header"
import { GuestFooter } from "@/components/guest-footer"
import { ArrowLeft, CalendarIcon, Clock, CheckCircle, Loader2 } from "lucide-react"
import { cn, getTimeFromDateString } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/axios"
import { Court, CourtApi } from "@/lib/types"
import { watch } from "fs"

interface HorarioDisponivel {
  start: string
  end: string
}

const bookFormSchema = z.object({
  name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }),
  date: z.date({ required_error: "Data é obrigatória" }),
  startTime: z.string({ required_error: "Horário de início é obrigatório" }),
  duration: z.string({ required_error: "Duração é obrigatória" }),
})

type BookFormValues = z.infer<typeof bookFormSchema>

export default function ReservarPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [court, setCourt] = useState<Court | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioDisponivel[]>([])
  const [valorTotal, setValorTotal] = useState(0)
  const { id } = useParams() as { id: string }

  const form = useForm<BookFormValues>({
    resolver: zodResolver(bookFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      date: new Date(),
      startTime: "",
      duration: "1",
    },
  })

  const watchDate = form.watch("date")
  const watchStartTime = form.watch("startTime")
  const watchDuration = form.watch("duration")

  useEffect(() => {
    const fetchCourt = async () => {
      setIsLoading(true)
      try {
        const response = await api.get(`/showcase/courts/${id}`)

        const court: CourtApi = response.data
        const parsedCourt: Court = {
          id: court.id,
          companyId: court.company_id,
          name: court.name,
          sportType: court.sport_type,
          hourlyPrice: court.hourly_price,
          isActive: court.is_active,
          description: court.description,
          openingTime: court.opening_time,
          closingTime: court.closing_time,
          capacity: court.capacity,
          bookingsToday: 0,
          photos: court.photos || [],
        }


        setCourt(parsedCourt)
      } catch (error) {
        console.error("Erro ao buscar dados da court.", error)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os detalhes da quadra.",
          variant: "destructive",
        })
        router.push("/showcase")
      } finally {
        setIsLoading(false)
      }
    }

    fetchCourt()
  }, [id, router, toast])

  useEffect(() => {
    const fetchHorariosDisponiveis = async () => {
      if (!court || !watchDate) return

      try {
        const startTime = Number.parseInt(getTimeFromDateString(court.openingTime).split(":")[0])
        const endTime = Number.parseInt(getTimeFromDateString(court.closingTime).split(":")[0])
        const horarios: HorarioDisponivel[] = []

        for (let hora = startTime; hora < endTime; hora++) {
          if (hora % 2 === 0) {
            horarios.push({
              start: `${hora.toString().padStart(2, "0")}:00`,
              end: `${(hora + 1).toString().padStart(2, "0")}:00`,
            })
          }
        }

        setHorariosDisponiveis(horarios)
      } catch (error) {
        console.error("Erro ao buscar horários disponíveis:", error)
        toast({
          title: "Erro ao carregar horários",
          description: "Não foi possível carregar os horários disponíveis.",
          variant: "destructive",
        })
      }
    }

    fetchHorariosDisponiveis()
  }, [court, watchDate, toast])

  // Calcular valor total quando horário ou duração mudar
  useEffect(() => {
    if (!court || !watchStartTime || !watchDuration) {
      setValorTotal(0)
      return
    }

    const durationHours = Number.parseInt(watchDuration)
    setValorTotal(court.hourlyPrice * durationHours)
  }, [court, watchStartTime, watchDuration])

  const onSubmit = async (data: BookFormValues) => {
    try {
      setIsSubmitting(true)

      const [hora, minuto] = data.startTime.split(":").map(Number)
      const duracaoHoras = Number.parseInt(data.duration)
      const horaFim = hora + duracaoHoras
      const horarioFim = `${horaFim.toString().padStart(2, "0")}:${minuto.toString().padStart(2, "0")}`

      const reservaData = {
        ...data,
        id,
        horarioFim,
        valorTotal,
        dataFormatada: format(data.date, "yyyy-MM-dd"),
      }

      console.log("Dados da reserva:", reservaData)

      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mostrar toast de sucesso
      toast({
        title: "Reserva realizada com sucesso!",
        description: "Você receberá um email com os detalhes da sua reserva.",
      })

      // Redirecionar para página de confirmação
      router.push(`/showcase/confirmacao?reserva=${Math.random().toString(36).substring(2, 15)}`)
    } catch (error) {
      console.error("Erro ao fazer reserva:", error)
      toast({
        title: "Erro ao fazer reserva",
        description: "Não foi possível completar sua reserva. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <GuestHeader />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse text-green-600">Carregando dados para reserva...</div>
          </div>
        </div>
        <GuestFooter />
      </div>
    )
  }

  if (!court) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <GuestHeader />
        <div className="flex-grow container mx-auto px-4 py-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-700">court.não encontrada</h2>
            <p className="mt-2 text-gray-500">A court.que você está procurando não existe ou foi removida.</p>
            <Button className="mt-4" onClick={() => router.push("/showcase")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar para lista de court.
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
          <Button variant="outline" onClick={() => router.push(`/showcase/courts/${id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para detalhes da quadra
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Reservar {court.name}</CardTitle>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Selecione a data e horário</h3>

                      <FormField
                        control={form.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Data</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-full pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP", { locale: ptBR })
                                    ) : (
                                      <span>Selecione uma data</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent className="w-auto p-0" align="start">
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) => date < new Date() || date > addDays(new Date(), 30)}
                                  initialFocus
                                  locale={ptBR}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="startTime"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Horário de Início</FormLabel>
                              <Select onValueChange={field.onChange} value={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione o horário" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {horariosDisponiveis.length > 0 ? (
                                    horariosDisponiveis.map((horario) => (
                                      <SelectItem key={horario.start} value={horario.start}>
                                        {horario.start}
                                      </SelectItem>
                                    ))
                                  ) : (
                                    <SelectItem value="indisponivel" disabled>
                                      Nenhum horário disponível
                                    </SelectItem>
                                  )}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="duration"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Duração</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione a duração" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="1">1 hora</SelectItem>
                                  <SelectItem value="2">2 horas</SelectItem>
                                  <SelectItem value="3">3 horas</SelectItem>
                                  <SelectItem value="4">4 horas</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <h3 className="text-lg font-medium mb-4">Seus dados</h3>
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nome completo</FormLabel>
                              <FormControl>
                                <Input placeholder="Digite seu nome completo" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="seu@email.com" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Telefone</FormLabel>
                                <FormControl>
                                  <Input placeholder="(00) 00000-0000" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => router.push(`/showcase/courts/${id}`)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting || !watchStartTime || horariosDisponiveis.length === 0}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Processando...
                        </>
                      ) : (
                        "Confirmar Reserva"
                      )}
                    </Button>
                  </CardFooter>
                </form>
              </Form>
            </Card>
          </div>

          <div>
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Resumo da Reserva</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">court.</span>
                  <span>{court.name}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Data:</span>
                  <span>{watchDate ? format(watchDate, "dd/MM/yyyy") : "-"}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Horário:</span>
                  <span>
                    {watchStartTime
                      ? `${watchStartTime} - ${watchStartTime &&
                      `${(Number.parseInt(watchStartTime.split(":")[0]) + Number.parseInt(watchDuration || "1"))
                        .toString()
                        .padStart(2, "0")}:${watchStartTime.split(":")[1]}`
                      }`
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Duração:</span>
                  <span>
                    {watchDuration ? `${watchDuration} hora${Number.parseInt(watchDuration) > 1 ? "s" : ""}` : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-lg font-bold text-green-600">
                  <span>Valor Total:</span>
                  <span>R$ {valorTotal.toFixed(2)}</span>
                </div>

                <div className="pt-4 space-y-2 text-sm text-gray-600">
                  <div className="flex items-start">
                    <Clock className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <span>O pagamento será realizado no local</span>
                  </div>
                  <div className="flex items-start">
                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                    <span>Você receberá um código de confirmação por email</span>
                  </div>
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
