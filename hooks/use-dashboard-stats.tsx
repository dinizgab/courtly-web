// hooks/use-dashboard-stats.ts
import { useAuth } from "@/contexts/auth-context"
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import axios from "axios"

const CENTS_VALUE = 100

export interface DashboardStat {
    key: "bookings" | "hours" | "clients" | "revenue"
    value: number
}

export function useDashboardStats() {
    const { companyId, token } = useAuth()
    const [stats, setStats] = useState<DashboardStat[]>([])
    const [isLoading, setLoading] = useState(true)
    const [isError, setIsError] = useState(false)

    console.log("useDashboardStats", { companyId, token })

    useEffect(() => {
        if (!companyId || !token) return
        const ac = new AbortController()

        async function fetchStats() {
            try {
                const { data } = await api.get(`/admin/companies/${companyId}/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` },
                    signal: ac.signal,
                })

                setStats([
                    { key: "bookings", value: data.total_bookings },
                    { key: "hours", value: data.total_booked_hours },
                    { key: "clients", value: data.total_clients },
                    { key: "revenue", value: data.total_earnings / CENTS_VALUE },
                ])
            } catch (err) {
                const isAbort =
                    (axios.isAxiosError(err) && err.code === "ERR_CANCELED") ||
                    (err as Error).name === "CanceledError"
                if (isAbort) return

                setIsError(true)
                console.error("Falha ao buscar dashboard:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchStats()
        return () => ac.abort()
    }, [companyId, token])

    return { data: { stats }, isLoading, isError }
}
