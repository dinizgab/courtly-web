import api from "@/lib/axios"
import { QUERY_STALE_TIME } from "@/lib/constants"
import { useQuery } from "@tanstack/react-query"

export function useChargePaymentInformation(bookingId: string) {
    return useQuery<Charge>({
        queryKey: ['charge', bookingId],
        enabled: !!bookingId,
        queryFn: async () => {
            const { data } = await api.get(`/showcase/bookings/${bookingId}/charge`)

            return {
                brCode: data.charge.brcode,
                qrCodeImage: data.charge.qr_code_image,
            } as Charge 
        },
        staleTime: QUERY_STALE_TIME,
        retry: 2
    })
}
