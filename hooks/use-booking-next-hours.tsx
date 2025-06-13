import api from '@/lib/axios';
import { QUERY_STALE_TIME } from '@/lib/constants';
import { useQuery } from '@tanstack/react-query';
import { Booking } from '@/types/booking';
import { mapBookingApi } from '@/utils/mapping';
import { useAuth } from '@/contexts/auth-context';
import { getHourPrecision } from '@/utils/date';

export function useBookingFromNextHours(startDate: Date, endDate: Date) {
    const { companyId, token } = useAuth()

    return useQuery<Booking[]>({
        queryKey: ['next-bookings', getHourPrecision(startDate), getHourPrecision(endDate), companyId],
        enabled: !!startDate && !!endDate && !!companyId && !!token,
        queryFn: async () => {
            const params = new URLSearchParams({
                company_id: companyId!,
                start_date: startDate.toISOString(),
                end_date: endDate.toISOString(),
            });

            const { data } = await api.get(`/admin/bookings?${params.toString()}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                }
            });

            return data.map(mapBookingApi)
        },
        staleTime: QUERY_STALE_TIME,
        retry: 2
    })
}
