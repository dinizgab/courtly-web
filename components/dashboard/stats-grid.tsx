import { Calendar, Clock, Users, DollarSign } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const ICONS = {
  bookings: Calendar,
  hours: Clock,
  clients: Users,
  revenue: DollarSign,
} as const

export function StatsGrid({ stats }: { stats: { key: keyof typeof ICONS; value: number }[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map(({ key, value }) => {
        const Icon = ICONS[key]
        const formatted =
          key === "revenue"
            ? new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(value)
            : value.toString()

        return (
          <Card key={key}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {labelFor(key)}
                  </p>
                  <p className="text-2xl font-bold">{formatted}</p>
                </div>
                <div className="rounded-full p-2 bg-primary-light">
                  <Icon className="h-5 w-5 text-primary-heavy" />
                </div>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}

function labelFor(key: string) {
  switch (key) {
    case "bookings":
      return "Reservas na semana"
    case "hours":
      return "Horas Reservadas"
    case "clients":
      return "Clientes"
    case "revenue":
      return "Faturamento"
    default:
      return key
  }
}
