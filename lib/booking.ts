import { Court } from "@/types/court"
import { Booking } from "@/types/booking"
import { getTimeFromDateString } from "./utils"

export const generateAvailableHours = (court: Court, unavailableSlots: Partial<Booking>[], day: number) => {
    if (!court || !unavailableSlots) return []

    const horarios = []
    let [open] = getTimeFromDateString(court.courtSchedule![day].openingTime).split(":")
    let [close] = getTimeFromDateString(court.courtSchedule![day].closingTime).split(":")

    const occupiedSlots = new Set(unavailableSlots.map(slot => new Date(slot.startTime!).getUTCHours()))

    const crossesMidnight = close <= open;
    if (crossesMidnight) close += 24;

    for (let hour = Number.parseInt(open); hour < Number.parseInt(close); hour++) {
        const realHour = hour % 24;
        const horaFormatada = hour.toString().padStart(2, "0")

        if (occupiedSlots.has(realHour)) {
            const slot = unavailableSlots.find((slot) => {
                const slotHora = new Date(slot.startTime!).getUTCHours()
                return slotHora === hour
            })

            if (slot) {
                const endHour = new Date(slot.endTime!).getUTCHours()

                for (let h = realHour; h < endHour; h++) {
                    horarios.push({
                        horario: `${h}:00 - ${(h + 1).toString().padStart(2, "0")}:00`,
                        disponivel: false,
                    })
                }
            }
        } else {
            horarios.push({
                horario: `${horaFormatada}:00 - ${(realHour + 1).toString().padStart(2, "0")}:00`,
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
    let open = new Date(openingTime).getUTCHours()
    let close = new Date(closingTime).getUTCHours()

    const crossesMidnight = close <= open;
    if (crossesMidnight) {
        close += 24;

        if (startHour < open) startHour += 24;
    }

    if (startHour < open || startHour >= close) return 0

    const normalizedSlots = unavailableSlots.map(({ startTime, endTime }) => {
        let sStart = startTime;
        let sEnd = endTime;

        if (sEnd <= sStart) sEnd += 24;

        if (crossesMidnight && sStart < open) {
            sStart += 24;
            sEnd += 24;
        }
        return { startTime: sStart, endTime: sEnd };
    });

    let max = 0
    for (let h = startHour; h < close; h++) {
        const isOccupied = normalizedSlots.some(
            slot => h >= slot.startTime && h < slot.endTime
        )

        if (isOccupied) break
        max++;
    }

    return max;
}

