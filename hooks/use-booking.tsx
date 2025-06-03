import api from '@/lib/axios';
import { QUERY_STALE_TIME } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import { Booking } from '@/types/booking';

export function useBookingInformationShowcase(bookingId: string) {
    return useQuery<Booking>({
        queryKey: ['booking', bookingId],
        enabled: !!bookingId,
        queryFn: async () => {
            const { data } = await api.get(`/showcase/bookings?id=${bookingId}`)

            return {
                startTime: data.start_time,
                endTime: data.end_time,
                totalPrice: data.total_price,
                court: {
                    name: data.court.name,
                    company: {
                        address: data.court.company.address,
                    }
                },
            } as Booking
        },
        staleTime: QUERY_STALE_TIME,
        retry: 2
    })
}
