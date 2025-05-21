import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { Booking } from "./types";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getTimeFromDateString(dateString: string): string {
    const date = new Date(dateString);

    return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "UTC",
    });
}

export function strToTitle(str: string): string {
    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

export function getBookingTotalPrice(booking: Booking) {
    const startTime = new Date(booking.startTime)
    const endTime = new Date(booking.endTime)
    const durationInHours = (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)
    return (booking.court?.hourlyPrice || 0) * durationInHours
}

export function formatBookingTime(booking: Booking) {
return `${getTimeFromDateString(booking.startTime)} - ${getTimeFromDateString(booking.endTime)}`;
}
