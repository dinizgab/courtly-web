"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, Users, DollarSign } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  // Dados simulados para o dashboard
  const stats = [
    {
      title: "Reservas Hoje",
      value: "12",
      icon: Calendar,
      change: "+20%",
      trend: "up",
    },
    {
      title: "Horas Reservadas",
      value: "24",
      icon: Clock,
      change: "+15%",
      trend: "up",
    },
    {
      title: "Clientes",
      value: "48",
      icon: Users,
      change: "+10%",
      trend: "up",
    },
    {
      title: "Faturamento",
      value: "R$ 1.200",
      icon: DollarSign,
      change: "+25%",
      trend: "up",
    },
  ]

  return (
    <div className="flex min-h-screen bg-green-50">
      <AdminSidebar activePage="dashboard" />
      <div className="flex-1">
        <AdminHeader title="Dashboard" />
        <main className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>
                Visão Geral
              </TabsTrigger>
              <TabsTrigger value="performance" onClick={() => setActiveTab("performance")}>
                Desempenho
              </TabsTrigger>
              <TabsTrigger value="analytics" onClick={() => setActiveTab("analytics")}>
                Análises
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                        </div>
                        <div className={`rounded-full p-2 ${stat.trend === "up" ? "bg-green-100" : "bg-red-100"}`}>
                          <stat.icon className={`h-5 w-5 ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`} />
                        </div>
                      </div>
                      <div className="mt-4">
                        <p className={`text-xs ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                          {stat.change} em relação à semana anterior
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Próximas Reservas</CardTitle>
                    <CardDescription>Reservas agendadas para as próximas 24 horas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between border-b pb-4">
                          <div>
                            <p className="font-medium">Quadra de Futsal {i}</p>
                            <p className="text-sm text-muted-foreground">
                              Hoje, {14 + i}:00 - {15 + i}:00
                            </p>
                            <p className="text-sm">Cliente: João Silva</p>
                          </div>
                          <Link href={`/admin/bookings/${i}`} className="text-sm text-green-600 hover:underline">
                            Ver detalhes
                          </Link>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Ocupação das Quadras</CardTitle>
                    <CardDescription>Taxa de ocupação das quadras na semana atual</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {["Futsal", "Vôlei", "Beach Tennis", "Tênis"].map((tipo, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <p className="font-medium">Quadra de {tipo}</p>
                            <p className="text-sm font-medium">{70 - i * 10}%</p>
                          </div>
                          <div className="h-2 w-full rounded-full bg-gray-200">
                            <div className="h-2 rounded-full bg-green-600" style={{ width: `${70 - i * 10}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho</CardTitle>
                  <CardDescription>Análise de desempenho das suas quadras</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Conteúdo da aba de desempenho será exibido aqui.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Análises</CardTitle>
                  <CardDescription>Análises detalhadas sobre suas reservas e clientes</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Conteúdo da aba de análises será exibido aqui.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}
