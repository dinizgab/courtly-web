import { Booking, Court } from "./types"
import { getTimeFromDateString } from "./utils"

export const generateAvailableHours = (court: Court, unavailableSlots: Partial<Booking>[]) => {
    if (!court || !unavailableSlots) return []

    const horarios = []
    const [horaInicio] = getTimeFromDateString(court.openingTime).split(":")
    const [horaFim] = getTimeFromDateString(court.closingTime).split(":")

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
