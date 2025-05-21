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
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"

// Tipo para a quadra
interface Quadra {
  id: string
  nome: string
  tipo: string
  precoHora: number
  horaInicio: string
  horaFim: string
}

// Tipo para horário disponível
interface HorarioDisponivel {
  inicio: string
  fim: string
}

// Schema de validação do formulário
const reservaFormSchema = z.object({
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  email: z.string().email({ message: "Email inválido" }),
  telefone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }),
  data: z.date({ required_error: "Data é obrigatória" }),
  horarioInicio: z.string({ required_error: "Horário de início é obrigatório" }),
  duracao: z.string({ required_error: "Duração é obrigatória" }),
})

type ReservaFormValues = z.infer<typeof reservaFormSchema>

export default function ReservarPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [quadra, setQuadra] = useState<Quadra | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<HorarioDisponivel[]>([])
  const [valorTotal, setValorTotal] = useState(0)
  const { id } = useParams() as { id: string }

  // Inicializar o formulário
  const form = useForm<ReservaFormValues>({
    resolver: zodResolver(reservaFormSchema),
    defaultValues: {
      nome: "",
      email: "",
      telefone: "",
      data: new Date(),
      horarioInicio: "",
      duracao: "1",
    },
  })

  // Observar mudanças nos campos de data, horário e duração para calcular o valor total
  const watchData = form.watch("data")
  const watchHorarioInicio = form.watch("horarioInicio")
  const watchDuracao = form.watch("duracao")

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
          horaInicio: "08:00",
          horaFim: "22:00",
        }

        setQuadra(quadraData)
      } catch (error) {
        console.error("Erro ao buscar dados da quadra:", error)
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os detalhes da quadra.",
          variant: "destructive",
        })
        router.push("/vitrine")
      } finally {
        setIsLoading(false)
      }
    }

    fetchQuadra()
  }, [id, router, toast])

  // Buscar horários disponíveis quando a data mudar
  useEffect(() => {
    const fetchHorariosDisponiveis = async () => {
      if (!quadra || !watchData) return

      try {
        // Simulação de chamada à API
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Dados simulados - em um caso real, isso viria do backend
        const horaInicio = Number.parseInt(quadra.horaInicio.split(":")[0])
        const horaFim = Number.parseInt(quadra.horaFim.split(":")[0])
        const horarios: HorarioDisponivel[] = []

        for (let hora = horaInicio; hora < horaFim; hora++) {
          // Simulação de disponibilidade (horários pares estão disponíveis)
          if (hora % 2 === 0) {
            horarios.push({
              inicio: `${hora.toString().padStart(2, "0")}:00`,
              fim: `${(hora + 1).toString().padStart(2, "0")}:00`,
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
  }, [quadra, watchData, toast])

  // Calcular valor total quando horário ou duração mudar
  useEffect(() => {
    if (!quadra || !watchHorarioInicio || !watchDuracao) {
      setValorTotal(0)
      return
    }

    const duracaoHoras = Number.parseInt(watchDuracao)
    setValorTotal(quadra.precoHora * duracaoHoras)
  }, [quadra, watchHorarioInicio, watchDuracao])

  const onSubmit = async (data: ReservaFormValues) => {
    try {
      setIsSubmitting(true)

      // Calcular horário de fim
      const [hora, minuto] = data.horarioInicio.split(":").map(Number)
      const duracaoHoras = Number.parseInt(data.duracao)
      const horaFim = hora + duracaoHoras
      const horarioFim = `${horaFim.toString().padStart(2, "0")}:${minuto.toString().padStart(2, "0")}`

      // Dados da reserva
      const reservaData = {
        ...data,
        quadraId: params.id,
        horarioFim,
        valorTotal,
        dataFormatada: format(data.data, "yyyy-MM-dd"),
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
      router.push(`/vitrine/confirmacao?reserva=${Math.random().toString(36).substring(2, 15)}`)
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
          <Button variant="outline" onClick={() => router.push(`/vitrine/quadras/${params.id}`)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para detalhes da quadra
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Reservar {quadra.nome}</CardTitle>
              </CardHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Selecione a data e horário</h3>

                      <FormField
                        control={form.control}
                        name="data"
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
                          name="horarioInicio"
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
                                      <SelectItem key={horario.inicio} value={horario.inicio}>
                                        {horario.inicio}
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
                          name="duracao"
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
                          name="nome"
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
                            name="telefone"
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
                      onClick={() => router.push(`/vitrine/quadras/${params.id}`)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="bg-green-600 hover:bg-green-700"
                      disabled={isSubmitting || !watchHorarioInicio || horariosDisponiveis.length === 0}
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
                  <span className="font-medium">Quadra:</span>
                  <span>{quadra.nome}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Data:</span>
                  <span>{watchData ? format(watchData, "dd/MM/yyyy") : "-"}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Horário:</span>
                  <span>
                    {watchHorarioInicio
                      ? `${watchHorarioInicio} - ${watchHorarioInicio &&
                      `${(Number.parseInt(watchHorarioInicio.split(":")[0]) + Number.parseInt(watchDuracao || "1"))
                        .toString()
                        .padStart(2, "0")}:${watchHorarioInicio.split(":")[1]}`
                      }`
                      : "-"}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="font-medium">Duração:</span>
                  <span>
                    {watchDuracao ? `${watchDuracao} hora${Number.parseInt(watchDuracao) > 1 ? "s" : ""}` : "-"}
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
