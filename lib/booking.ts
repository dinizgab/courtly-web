import { Court } from "@/types/court"
import { Booking } from "@/types/booking"
import { getTimeFromDateString } from "./utils"

export const generateAvailableHours = (court: Court, unavailableSlots: Partial<Booking>[], day: number) => {
    if (!court || !unavailableSlots) return []

    const horarios = []
    const [horaInicio] = getTimeFromDateString(court.courtSchedule![day].openingTime).split(":")
    const [horaFim] = getTimeFromDateString(court.courtSchedule![day].closingTime).split(":")

    const occupiedSlots = new Set(unavailableSlots.map(slot => new Date(slot.startTime!).getUTCHours()))

    for (let hour = Number.parseInt(horaInicio); hour < Number.parseInt(horaFim); hour++) {
        const horaFormatada = hour.toString().padStart(2, "0")

        if (occupiedSlots.has(hour)) {
            const slot = unavailableSlots.find((slot) => {
                const slotHora = new Date(slot.startTime!).getUTCHours()
                return slotHora === hour
            })

            if (slot) {
                const endHour = new Date(slot.endTime!).getUTCHours()

                for (let h = hour; h < endHour; h++) {
                    horarios.push({
                        horario: `${h}:00 - ${(h + 1).toString().padStart(2, "0")}:00`,
                        disponivel: false,
                    })
                }
            }
        } else {
            horarios.push({
                horario: `${horaFormatada}:00 - ${(hour + 1).toString().padStart(2, "0")}:00`,
                disponivel: true,
            })
        }
    }

    return horarios
}

export function calculateMaxBookingDuration(
    openingTime: string,
    closingTime: string,
    startHour: number,
    unavailableSlots: { startTime: number, endTime: number }[]
): number {
    const open = new Date(openingTime).getUTCHours()
    const close = new Date(closingTime).getUTCHours()

    if (startHour < open || startHour >= close) return 0

    let max = 0
    for (let h = startHour; h < close; h++) {
        const isOccupied = unavailableSlots.some(
            slot => h >= slot.startTime && h < slot.endTime
        )

        if (isOccupied) break
        max++;
    }

    return max;
}

