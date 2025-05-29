import { mapCourtApi } from '@/utils/mapping';
import api from '@/lib/axios';
import { QUERY_STALE_TIME } from '@/lib/constants';
import { Court } from '@/types/court';
import { useQuery } from '@tanstack/react-query';

export function useCourtShowcase(courtId: string) {
    return useQuery<Court>({
        queryKey: ['court', courtId],
        queryFn: async () => {
            const { data } = await api.get(`/showcase/courts/${courtId}`)

            return mapCourtApi(data);
        },
        staleTime: QUERY_STALE_TIME,
        retry: 2
    })
}
