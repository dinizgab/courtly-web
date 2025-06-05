"use client"

import { Wallet } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { useBalance } from "@/hooks/use-balance"
import { useWithdrawal } from "@/hooks/use-withdrawal"

export function AvailableBalanceCard() {
    const { data: available, isLoading } = useBalance()
    const withdraw = useWithdrawal()

    if (isLoading || !available) return null

    const minWithdraw = 50
    const disabled = available < minWithdraw || withdraw.isPending

    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Wallet className="h-5 w-5 text-slate-600" />
                    Saldo Disponível
                </CardTitle>
                <CardDescription>Valor disponível para saque em sua conta</CardDescription>
            </CardHeader>

            <CardContent className="space-y-4">
                <div className="text-center">
                    <p className="text-4xl font-bold text-slate-700 mb-2">
                        R$ {available.toFixed(2).replace(".", ",")}
                    </p>
                    <p className="text-sm text-muted-foreground">
                        Saldo acumulado das reservas
                    </p>
                </div>

                {
                    //<div className="bg-slate-100 rounded-lg p-4 space-y-2 text-sm">
                    //  <InfoRow label="Receita do mês:" value={monthRevenue} />
                    //  <InfoRow label="Taxa da plataforma (8%):" value={-platformFee} negative />
                    //  <InfoRow
                    //    label="Saques anteriores:"
                    //    value={previousWithdrawals.reduce((s, w) => s + w.value, 0)}
                    //  />
                    //</div>
                }
                <Button
                    onClick={() => withdraw.mutate({ amount: available })}
                    disabled={disabled}
                    className="w-full bg-slate-700 hover:bg-slate-800"
                >
                    {withdraw.isPending ? "Processando..." : "Solicitar Saque"}
                </Button>
            </CardContent>
        </Card>
    )
}

function InfoRow({ label, value, negative = false }: { label: string; value: number; negative?: boolean }) {
    const format = (v: number) =>
        `${negative ? "- " : ""}R$ ${Math.abs(v).toFixed(2).replace(".", ",")}`

    return (
        <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{label}</span>
            <span className={`font-medium ${negative ? "text-red-600" : ""}`}>{format(value)}</span>
        </div>
    )
}

