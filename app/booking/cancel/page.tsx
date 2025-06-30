"use client";

import { useToast } from "@/components/ui/use-toast";
import { Booking } from "@/types/booking";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import api from "@/lib/axios";
import { GuestHeader } from "@/components/guest-header";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Calendar, Clock, MapPin } from "lucide-react";
import { getTimeFromDateString } from "@/lib/utils";
import { GuestFooter } from "@/components/guest-footer";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RATE, TRANSFER_FEE } from "@/utils/rate";

export default function CancelBooking() {
  const router = useRouter();
  const { companyId } = useParams() as {
    companyId: string;
  };
  const searchParams = useSearchParams();
  const bookingId = searchParams.get("id");
  const token = searchParams.get("token");
  const [booking, setBooking] = useState<Booking>();
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationCode, setConfirmationCode] = useState("");
  const [isCancelling, setIsCancelling] = useState(false);
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

  const handleCancelBooking = async () => {
    try {
      setIsCancelling(true);
      await api.post(`/bookings/cancel`,
        {
            params: {
                id: bookingId,
                token: token
            },
            body:{
                token: confirmationCode
            }
        }

      );
      toast({
        title: "Reserva cancelada com sucesso",
        description: "A reserva foi cancelada.",
      });
      router.push(`/showcase/${companyId}/cancel-success`);
    } catch (error) {
      toast({
        title: "Erro ao cancelar a reserva",
        description:
          "Não foi possível cancelar a reserva. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsCancelling(false);
    }
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
                <CardTitle className="text-2xl text-green-800">
                  Cancelar reserva
                </CardTitle>
              </CardHeader>
              <div className="border-t border-b py-4 space-y-4 px-6">
                <h3 className="font-medium text-lg">Detalhes da Reserva</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Data</p>
                      <p className="font-medium">
                        {new Date(booking.startTime).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Clock className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Horário</p>
                      <p className="font-medium">{`${getTimeFromDateString(
                        booking.startTime
                      )} - ${getTimeFromDateString(booking.endTime)}`}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-start">
                    <MapPin className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                    <div>
                      <p className="text-sm text-gray-500">Local</p>
                      {/* <p className="font-medium">{booking.court.name}</p> */}
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
                      R$ {booking.totalPrice/100 * RATE + TRANSFER_FEE}
                    </span>
                  </div>
                </div>

                <div className="pt-6 space-y-2">
                  <p className="text-sm text-gray-600">
                    Para confirmar o cancelamento:
                  </p>
                  <Input
                    placeholder="Digite o código da reserva"
                    value={confirmationCode}
                    onChange={(e) => setConfirmationCode(e.target.value)}
                  />
                  <Button
                    disabled={!confirmationCode.trim() || isCancelling}
                    onClick={handleCancelBooking}
                    variant="destructive"
                    className="w-full"
                  >
                    {isCancelling ? "Cancelando..." : "Cancelar Reserva"}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      <GuestFooter />
    </div>
  );
}
