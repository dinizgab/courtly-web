"use client"

import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/axios"
import { useQuery } from "@tanstack/react-query"

const CENTS_VALUE = 100

export function useBalance() {
    const { companyId, token } = useAuth()

    return useQuery<number>({
        queryKey: ["balance"],
        queryFn: async () => {
            const { data } = await api.get(`/admin/companies/${companyId}/balance`, {
                headers: { Authorization: `Bearer ${token}` },
            })

            return data.balance / CENTS_VALUE
        },
    })
}

