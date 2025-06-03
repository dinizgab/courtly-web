import api from '@/lib/axios'
import { useQuery } from '@tanstack/react-query'

export function useBookingPaymentStatus(reservationId: string) {
  return useQuery({
    queryKey: ['paymentStatus', reservationId],
    queryFn: async () => {
      const r = await api.get(`/showcase/bookings/status?id=${reservationId}`)

      return r.data.status as 'pending' | 'paid' | 'expired'
    },
    refetchInterval: 3000,
  })
}
