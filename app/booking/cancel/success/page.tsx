"use client";

import { useSearchParams, useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { GuestHeader } from "@/components/guest-header";
import { GuestFooter } from "@/components/guest-footer";
import { CheckCircle, Calendar, Clock, MapPin } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import api from "@/lib/axios";
import { Booking } from "@/types/booking";
import { useToast } from "@/components/ui/use-toast";
import { getTimeFromDateString } from "@/lib/utils";
import { RATE, TRANSFER_FEE } from "@/utils/rate";

export default function RefundConfirmationPage() {
    return (
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Carregando...</div>}>
            <RefundConfirmationClient />
        </Suspense>
    );
}

export function RefundConfirmationClient() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const bookingId = searchParams.get("id");
    const { companyId } = useParams() as { companyId: string };
    const [booking, setBooking] = useState<Booking>();
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                setIsLoading(true);

                const response = await api.get(`/showcase/bookings?id=${bookingId}`);
                if (response.status !== 200) {
                    throw new Error("Erro ao buscar a reserva");
                }

                const bookingData = response.data;
                const booking = {
                    startTime: bookingData.start_time,
                    endTime: bookingData.end_time,
                    totalPrice: bookingData.total_price,
                    court: {
                        name: bookingData.court.name,
                        company: {
                            address: bookingData.court.company.address,
                        },
                    },
                } as Booking;

                setBooking(booking);
            } catch (error) {
                console.error("Erro ao buscar a reserva:", error);
                toast({
                    title: "Erro ao buscar a reserva",
                    description:
                        "Não foi possível encontrar a reserva. Tente novamente mais tarde.",
                    variant: "destructive",
                });
            } finally {
                setIsLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    const getBookingDate = () => {
        return new Date(booking!.startTime).toLocaleDateString("pt-BR");
    };

    const getTotalPrice = () => {
        const startTime = new Date(booking!.startTime).getUTCHours();
        const endTime = new Date(booking!.endTime).getUTCHours();

        const totalHours = endTime - startTime;

        return totalHours * booking!.court!.hourlyPrice!;
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <p className="text-gray-500">Carregando...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <GuestHeader />

            {booking && (
                <div className="flex-grow container mx-auto px-4 py-12">
                    <div className="max-w-2xl mx-auto">
                        <Card className="border-green-200 shadow-lg">
                            <CardHeader className="text-center bg-green-50 border-b border-green-100">
                                <div className="flex justify-center mb-4">
                                    <div className="rounded-full bg-green-100 p-3">
                                        <CheckCircle className="h-12 w-12 text-green-600" />
                                    </div>
                                </div>
                                <CardTitle className="text-2xl text-green-800">
                                    Reembolso Confirmado!
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-6">
                                <div className="space-y-6">
                                    <div className="text-center">
                                        <p className="text-gray-600">
                                            Seu reembolso foi processado com sucesso! Um e-mail de
                                            confirmação foi enviado para o endereço cadastrado.
                                        </p>
                                    </div>

                                    <div className="border-t border-b py-4 space-y-4">
                                        <h3 className="font-medium text-lg">Detalhes do Reembolso</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="flex items-start">
                                                <Calendar className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Data</p>
                                                    <p className="font-medium">{getBookingDate()}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-start">
                                                <Clock className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Horário</p>
                                                    <p className="font-medium">{`${getTimeFromDateString(
                                                        booking!.startTime
                                                    )} - ${getTimeFromDateString(booking!.endTime)}`}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-start">
                                                <MapPin className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="text-sm text-gray-500">Local</p>
                                                    <p className="font-medium">{booking!.court!.name}</p>
                                                    <p className="text-sm text-gray-600">
                                                        {booking.court!.company!.address}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">Valor Total:</span>
                                                <span className="font-bold text-green-600">
                                                    R$ {booking.totalPrice * RATE + TRANSFER_FEE}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <h3 className="font-medium">Próximos Passos:</h3>
                                            <ul className="space-y-2">
                                                <li className="flex items-start">
                                                    <CheckCircle className="h-4 w-4 text-green-600 mr-2 mt-0.5" />
                                                    <span>
                                                        Verifique seu e-mail para detalhes sobre o reembolso.
                                                    </span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Button variant="outline" onClick={() => window.print()}>
                                    Imprimir Comprovante
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700"
                                    onClick={() => router.push(`/showcase/${companyId}`)}
                                >
                                    Voltar para Início
                                </Button>
                            </CardFooter>
                        </Card>
                    </div>
                </div>
            )}

            <GuestFooter />
        </div>
    );
}

