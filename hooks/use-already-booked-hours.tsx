import api from "@/lib/axios"
import { QUERY_STALE_TIME } from "@/lib/constants"
import { BookingApi } from "@/types/booking"
import { useQuery } from "@tanstack/react-query"
import { format } from "date-fns"

export function useAlreadyBookedHours(courtId: string | undefined, date: Date | null) {
    const day = date ? format(date, "yyyy-MM-dd") : null

    return useQuery<{ startTime: number, endTime: number }[]>({
        queryKey: ["slots", courtId, day],
        queryFn: async () => {
            const { data } = await api.get(`/showcase/courts/${courtId}/available-slots`, {
                params: { date: day },
            })

            return data.map((slot: Partial<BookingApi>) => ({
                startTime: new Date(slot.start_time!).getUTCHours(),
                endTime: new Date(slot.end_time!).getUTCHours(),
            }))
        },
        placeholderData: [],
        enabled: !!courtId && !!day,
        staleTime: QUERY_STALE_TIME
    })
}
