"use client"

import { useAuth } from "@/contexts/auth-context"
import api from "@/lib/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export type WithdrawalStatus = "idle" | "processing" | "completed" | "failed"

export function useWithdrawal() {
    const qc = useQueryClient()
    const { companyId, token } = useAuth()

    // TODO - Implement funcionality to withdraw a specific amount
    return useMutation<
        { message: string },
        Error,
        { amount: number }
    >({
        mutationFn: async ({ amount }) => {
            const { data } = await api.post(`/admin/companies/${companyId}/withdraw`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
            return data
        },
        onSuccess: () => qc.invalidateQueries({ queryKey: ["balance"] }),
    })
}

