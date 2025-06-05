"use client"

import api from "@/lib/axios"
import { useMutation, useQueryClient } from "@tanstack/react-query"

export type WithdrawalStatus = "idle" | "processing" | "completed" | "failed"

export function useWithdrawal() {
  const qc = useQueryClient()

  return useMutation<
    { message: string },
    Error,
    { amount: number }
  >({
    mutationFn: async ({ amount }) => {
      const { data } = await api.post("/admin/withdraw", { amount })
      return data
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["balance"] }),
  })
}

