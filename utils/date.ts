import { format, differenceInMinutes } from "date-fns";
import { ptBR } from "date-fns/locale";

export const formatDatePtBr = (iso: string | Date) =>
    format(new Date(iso), "dd/MM/yyyy", { locale: ptBR });

export const formatTimePtBr = (iso: string | Date) =>
    format(new Date(iso), "HH:mm");

export const formatBookingDateTimeString = (
    startIso: string | Date,
) => {
    return `${formatDatePtBr(startIso)} às ${formatTimePtBr(startIso)}`;
}
export const formatBookingDuration = (
    startIso: string | Date,
    endIso: string | Date,
) => {
    const minutes = differenceInMinutes(new Date(endIso), new Date(startIso));
    if (minutes <= 0) return "00m";

    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return [h > 0 ? `${h}h` : "", `${m.toString().padStart(2, "0")}m`]
        .filter(Boolean)
        .join(" ");
};

export const getHourPrecision = (date: Date) =>
  date.toISOString().slice(0, 13);
