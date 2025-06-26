import { CheckCircle, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { format } from "date-fns";
import { RATE, TRANSFER_FEE } from "@/utils/rate";

interface BookingSummaryProps {
    courtName: string;
    date: Date | null;
    startTime: string | null;
    duration: string | null;
    totalValue: number;
    paymentMethod: string;
}

export default function BookingSummary({ courtName, date, startTime, duration, totalValue, paymentMethod }: BookingSummaryProps) {
    return (
        <div
            className="sticky top-20">
            <Card>
                <CardHeader>
                    <CardTitle>Resumo da Reserva</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b">
                        <span className="font-medium">Quadra:</span>
                        <span>{courtName}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                        <span className="font-medium">Data:</span>
                        <span>{date ? format(date, "dd/MM/yyyy") : "-"}</span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                        <span className="font-medium">Horário:</span>
                        <span>
                            {startTime
                                ? `${startTime} - ${startTime &&
                                `${(Number.parseInt(startTime.split(":")[0]) + Number.parseInt(duration || "1"))
                                    .toString()
                                    .padStart(2, "0")}:${startTime.split(":")[1]}`
                                }`
                                : "-"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pb-2 border-b">
                        <span className="font-medium">Duração:</span>
                        <span>
                            {duration ? `${duration} hora${Number.parseInt(duration) > 1 ? "s" : ""}` : "-"}
                        </span>
                    </div>
                    <div className="flex justify-between items-center text-lg font-bold text-primary">
                        <span>Valor Total:</span>
                        <span>R$ {totalValue * RATE + TRANSFER_FEE}</span>
                    </div>

                    <div className="pt-4 space-y-2 text-sm text-gray-600">
                        {
                            paymentMethod === "pix" ?
                                <div className="flex items-start">
                                    <CheckCircle className="h-4 w-4 text-primary-heavy mr-2 mt-0.5" />
                                    <span>Pagamento via PIX</span>
                                </div> :

                                <div className="flex items-start">
                                    <Clock className="h-4 w-4 text-primary-heavy mr-2 mt-0.5" />
                                    <span>O pagamento será realizado no local</span>
                                </div>
                        }
                        <div className="flex items-start">
                            <CheckCircle className="h-4 w-4 text-primary-heavy mr-2 mt-0.5" />
                            <span>Você receberá um código de confirmação por email</span>
                        </div>
                    </div>
                </CardContent>
            </Card >
        </div>
    )

}
