"use client"

import { useState, useEffect, useMemo } from "react"
import { useParams, useRouter } from "next/navigation"
import { format, addDays, isBefore, isAfter, startOfDay } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GuestHeader } from "@/components/guest-header"
import { GuestFooter } from "@/components/guest-footer"
import { ArrowLeft, CalendarIcon, Loader2, QrCode, CreditCard } from "lucide-react"
import { cn } from "@/lib/utils"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import api from "@/lib/axios"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import BookingSummary from "@/components/booking/booking-summary"
import { useCourtShowcase } from "@/hooks/use-court"
import { useAlreadyBookedHours } from "@/hooks/use-already-booked-hours"
import { calculateMaxBookingDuration } from "@/lib/booking"


const bookFormSchema = z.object({
    name: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
    email: z.string().email({ message: "Email inválido" }),
    phone: z.string().min(10, { message: "Telefone deve ter pelo menos 10 dígitos" }),
    date: z.date({ required_error: "Data é obrigatória" }),
    startTime: z.string({ required_error: "Horário de início é obrigatório" }),
    duration: z.string({ required_error: "Duração é obrigatória" }),
    paymentMethod: z.enum(["pix", "on-site"], {
        required_error: "Método de pagamento é obrigatório",
        invalid_type_error: "Método de pagamento inválido",
    }),
})

type BookFormValues = z.infer<typeof bookFormSchema>

export default function CreateBookingPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [paymentMethod, setPaymentMethod] = useState("pix")
    const [valorTotal, setValorTotal] = useState(0)
    const { companyId, courtId } = useParams() as { companyId: string, courtId: string }

    const form = useForm<BookFormValues>({
        resolver: zodResolver(bookFormSchema),
        defaultValues: {
            name: "",
            email: "",
            phone: "",
            date: new Date(),
            startTime: "",
            duration: "1",
            paymentMethod: "pix",
        },
    })

    const watchDate = form.watch("date")
    const watchStartTime = form.watch("startTime")
    const watchDuration = form.watch("duration")

    const { data: court, isLoading, isError } = useCourtShowcase(courtId)
    const { data: alreadyBookedHours, isLoading: isBookedHoursLoading } = useAlreadyBookedHours(court?.id, watchDate)

    const maxDuration = useMemo(() => {
        if (!court || !watchStartTime || !alreadyBookedHours) return 1
        const startHour = Number.parseInt(watchStartTime.split(":")[0])

        const selectedDaySchedule = court.courtSchedule?.find(
            (schedule) => schedule.weekday === watchDate.getDay()
        )

        return calculateMaxBookingDuration(
            selectedDaySchedule!.openingTime,
            selectedDaySchedule!.closingTime,
            startHour,
            alreadyBookedHours
        )
    }, [court, watchStartTime, alreadyBookedHours])

    const durationOptions = useMemo(
        () => Array.from({ length: maxDuration }, (_, i) => (i + 1)),
        [maxDuration]
    )

    const availableSlots = useMemo(() => {
        if (!court || !alreadyBookedHours) return []

        const selectedDaySchedule = court.courtSchedule?.find(
            (schedule) => schedule.weekday === watchDate.getDay()
        )

        let open = new Date(selectedDaySchedule!.openingTime).getUTCHours()
        let close = new Date(selectedDaySchedule!.closingTime).getUTCHours()

        const occupied = new Set<number>()
        alreadyBookedHours.forEach(({ startTime, endTime }) => {
            for (let h = startTime; h < endTime; h++) occupied.add(h)
        })

        const crossesMidnight = close <= open;
        if (crossesMidnight) close += 24;

        const times: string[] = []
        for (let h = open; h < close; h++) {
             const hour = h % 24;

            if (!occupied.has(hour)) times.push(`${hour.toString().padStart(2, "0")}:00`)
        }

        return times
    }, [court, alreadyBookedHours])


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
            const totalDuration = Number.parseInt(data.duration)
            const horaFim = hora + totalDuration
            const horarioFim = `${horaFim.toString().padStart(2, "0")}:${minuto.toString().padStart(2, "0")}`
            const date = format(data.date, "yyyy-MM-dd")

            const reservaData = {
                guest_name: data.name,
                guest_email: data.email,
                guest_phone: data.phone,
                company_id: court?.companyId,
                start_time: `${date}T${data.startTime}:00Z`,
                end_time: `${date}T${horarioFim}:00Z`,
                court: {
                    company_id: court?.companyId,
                },
                payment_method: data.paymentMethod,
            }

            const response = await api.post(`/showcase/courts/${courtId}/bookings`, reservaData)
            if (response.status !== 201) {
                throw new Error("Erro ao criar reserva")
            }

            toast({
                title: "Reserva realizada com sucesso!",
                description: "Você receberá um email com os detalhes da sua reserva.",
            })

            const bookingId = response.data.id
            // TODO - Check this redirect
            router.push(`/showcase/${companyId}/payment/pix?bookingId=${bookingId}`)
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

    if (isLoading || isBookedHoursLoading) {
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

    if (!court || isError) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <GuestHeader />
                <div className="flex-grow container mx-auto px-4 py-8">
                    <div className="text-center py-12">
                        <h2 className="text-2xl font-bold text-gray-700">Quadra não encontrada</h2>
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
                    <Button variant="outline" onClick={() => router.push(`/showcase/${companyId}/court/${courtId}`)} className="mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para detalhes da quadra
                    </Button>
                    <h1 className="text-3xl font-bold text-slate-800">Reservar Quadra</h1>
                    <p className="text-slate-600 mt-2">Complete os dados para finalizar sua reserva</p>
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

                                        <div className="pt-4 space-y-4">
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
                                                                    disabled={(date) =>
                                                                        isBefore(date, startOfDay(new Date())) ||
                                                                        isAfter(date, startOfDay(addDays(new Date(), 30)))
                                                                    }
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
                                                                    {availableSlots.length > 0 ? (
                                                                        availableSlots.map((slot) => (
                                                                            <SelectItem key={slot} value={slot}>
                                                                                {slot}
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
                                                                    {durationOptions.map((duration) => (
                                                                        <SelectItem key={duration} value={duration.toString()}>
                                                                            {duration} hora{duration > 1 ? "s" : ""}
                                                                        </SelectItem>
                                                                    ))}
                                                                </SelectContent>

                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <h3 className="text-lg font-semibold text-slate-700">Forma de Pagamento</h3>
                                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                                                <div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                                                    <RadioGroupItem value="pix" id="pix" />
                                                    <QrCode className="h-5 w-5 text-blue-600" />
                                                    <Label htmlFor="pix" className="flex-1 cursor-pointer">
                                                        <div>
                                                            <div className="font-medium">PIX</div>
                                                            <div className="text-sm text-slate-600">Pagamento instantâneo</div>
                                                        </div>
                                                    </Label>
                                                </div>
                                                {
                                                    //<div className="flex items-center space-x-3 p-4 border border-slate-200 rounded-lg hover:bg-slate-50">
                                                    //    <RadioGroupItem value="on-site" id="on-site" />
                                                    //    <CreditCard className="h-5 w-5 text-blue-600" />
                                                    //    <Label htmlFor="on-site" className="flex-1 cursor-pointer">
                                                    //        <div>
                                                    //            <div className="font-medium">Pagar no Local</div>
                                                    //            <div className="text-sm text-slate-600">Dinheiro ou cartão na hora</div>
                                                    //        </div>
                                                    //    </Label>
                                                    //</div>
                                                }
                                            </RadioGroup>
                                        </div>

                                    </CardContent>
                                    <CardFooter className="flex justify-between">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push(`/showcase/${companyId}`)}
                                        >
                                            Cancelar
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="bg-primary hover:bg-primary-heavy"
                                            disabled={isSubmitting || !watchStartTime}
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
                        <BookingSummary
                            courtName={court.name}
                            date={watchDate}
                            startTime={watchStartTime}
                            duration={watchDuration}
                            totalValue={valorTotal}
                            paymentMethod={paymentMethod}
                        />
                    </div>
                </div>
            </div>

            <GuestFooter />
        </div>
    )
}
