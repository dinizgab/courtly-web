import api from '@/lib/axios';
import { QUERY_STALE_TIME } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import { Booking } from '@/types/booking';
import { mapBookingApi } from '@/utils/mapping';

export function useBookingFromNextHours(startDate: Date, endDate:Date) {
    return useQuery<Booking[]>({
        queryKey: ['next-bookings', startDate, endDate],
        enabled: !!startDate && !!endDate,
        queryFn: async () => {
            const { data } = await api.get(`/showcase/bookings?startDate=${startDate}&endDate=${endDate}`)

            return data.map(mapBookingApi)
        },
        staleTime: QUERY_STALE_TIME,
        retry: 2
    })
}
