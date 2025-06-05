"use client"

import { CheckCircle, Loader2, Wallet, XCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useWithdrawal } from "@/hooks/use-withdrawal"
import React from "react"

export function WithdrawalStatusCard() {
  const withdraw = useWithdrawal()

  const status = withdraw.status
  const msg = withdraw.data?.message ?? ""

  const icon =
    status === "pending" ? Loader2 :
    status === "success" ? CheckCircle :
    status === "error" ? XCircle : Wallet

  const color =
    status === "pending" ? "text-blue-600 bg-blue-50 border-blue-200" :
    status === "success" ? "text-green-600 bg-green-50 border-green-200" :
    status === "error" ? "text-red-600 bg-red-50 border-red-200" :
    "text-slate-600 bg-slate-50 border-slate-200"

  return (
    <Card>
      <CardHeader>
        <CardTitle>Status do Saque</CardTitle>
        <CardDescription>Acompanhe o status da sua solicitação de saque</CardDescription>
      </CardHeader>

      <CardContent>
        {status === "idle" ? (
          <div className="text-center py-8">
            <Wallet className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <p className="text-muted-foreground">Nenhuma solicitação de saque ativa</p>
          </div>
        ) : (
          <div className={`border rounded-lg p-4 ${color}`}>
            <div className="flex items-start gap-3">
              {React.createElement(icon, { className: `h-5 w-5 ${status === "pending" ? "animate-spin" : ""}` })}
              <div className="flex-1">
                <p className="font-medium mb-1">
                  {status === "pending" && "Processando Saque"}
                  {status === "success" && "Saque Concluído"}
                  {status === "error" && "Falha no Saque"}
                </p>
                <p className="text-sm opacity-90">{msg}</p>
                <p className="text-xs mt-2 opacity-75">{new Date().toLocaleString("pt-BR")}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

