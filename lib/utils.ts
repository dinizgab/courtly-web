import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

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
