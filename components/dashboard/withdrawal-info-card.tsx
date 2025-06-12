"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function WithdrawalInfoCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações Importantes</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
        <Section
          title="Prazos de Saque"
          items={[
            //"Processamento: até 1 dia útil",
            //"Transferência bancária: 1-2 dias úteis",
            "PIX: processamento imediato",
          ]}
        />
        <Section
          title="Taxas e Limites"
          items={[
            //"Taxa da plataforma: 8 % por reserva",
            //"Saque mínimo: R$ 50,00",
            "Para saques abaixo de R$500: R$ 1,00 por transação",
            "Para saques acima de R$500: Sem custo",
          ]}
        />
      </CardContent>
    </Card>
  )
}

function Section({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h4 className="font-medium mb-2">{title}</h4>
      <ul className="space-y-1 list-disc list-inside">
        {items.map((it) => <li key={it}>{it}</li>)}
      </ul>
    </div>
  )
}

