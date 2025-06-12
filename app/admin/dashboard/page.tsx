"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminHeader } from "@/components/admin-header";
import { AdminSidebar } from "@/components/admin-sidebar";
import { useDashboardStats } from "@/hooks/use-dashboard-stats";
import { StatsGrid } from "@/components/dashboard/stats-grid";
import { AvailableBalanceCard } from "@/components/dashboard/available-balance-card";
import { WithdrawalStatusCard } from "@/components/dashboard/withdrawal-status-card";
import { WithdrawalInfoCard } from "@/components/dashboard/withdrawal-info-card";
import { useBookingFromNextHours } from "@/hooks/use-booking-next-hours";
import { Loader2 } from "lucide-react";
import { getTimeFromDateString } from "@/lib/utils";

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const { data, isLoading, isError } = useDashboardStats();
  const startDate: Date = new Date();
  const endDate: Date = new Date(Date.now() + 24 * 60 * 60 * 1000);

  const {
    data: nextBookings,
    isLoading: isLoadingBookings,
    isError: isErroFromNextBookings,
  } = useBookingFromNextHours(startDate, endDate);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Carregando…
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Erro ao carregar dados
      </div>
    );
  }
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar activePage="dashboard" />
      <div className="flex-1">
        <AdminHeader title="Dashboard" />
        <main className="p-6">
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger
                value="overview"
                onClick={() => setActiveTab("overview")}
              >
                Visão Geral
              </TabsTrigger>
              <TabsTrigger
                value="balance"
                onClick={() => setActiveTab("performance")}
              >
                Saldo
              </TabsTrigger>
              {
                //<TabsTrigger value="performance" onClick={() => setActiveTab("performance")}>
                //Desempenho
                //</TabsTrigger>
                //<TabsTrigger value="analytics" onClick={() => setActiveTab("analytics")}>
                //Análises
                //</TabsTrigger>
              }
            </TabsList>
            <StatsGrid stats={data.stats} />

            <TabsContent value="overview" className="space-y-6">
              <div className="">
                <Card>
                  <CardHeader>
                    <CardTitle>Próximas Reservas</CardTitle>
                    <CardDescription>
                      Reservas agendadas para as próximas 24 horas
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {isLoadingBookings ? (
                        <div className="flex justify-center items-center h-full">
                          <Loader2/>
                        </div>
                      ) : isErroFromNextBookings ? (
                        <div className="text-red-500 text-center">
                          Erro ao carregar as reservas. Por favor, tente
                          novamente.
                        </div>
                      ) : nextBookings && nextBookings.length > 0 ? ( 
                        nextBookings.map((booking) => (
                          <div
                            key={booking.id} 
                            className="flex items-center justify-between border-b pb-4 mb-4" 
                          >
                            <div>
                              <p className="font-medium">
                                {booking.court?.name || " - "}
                              </p>{" "}
                              <p className="text-sm text-muted-foreground">
                                Hoje, {getTimeFromDateString(booking.startTime)} - {getTimeFromDateString(booking.endTime)}{" "}
                              </p>
                              <p className="text-sm">
                                Cliente: {booking.guestName || " -"}
                              </p>{" "}
                            </div>
                            <Link
                              href={`/admin/bookings/${booking.id}`}
                              className="text-sm text-slate-600 hover:underline"
                            >
                              Ver detalhes
                            </Link>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 text-center">
                          Nenhuma reserva futura encontrada.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* <Card>
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
                                                        <div className="h-2 rounded-full bg-primary" style={{ width: `${70 - i * 10}%` }} />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </CardContent>
                                </Card> */}
              </div>
            </TabsContent>

            <TabsContent value="performance">
              <Card>
                <CardHeader>
                  <CardTitle>Desempenho</CardTitle>
                  <CardDescription>
                    Análise de desempenho das suas quadras
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Conteúdo da aba de desempenho será exibido aqui.</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="balance" className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <AvailableBalanceCard />
                <WithdrawalStatusCard />
              </div>
              <WithdrawalInfoCard />
            </TabsContent>

            <TabsContent value="analytics">
              <Card>
                <CardHeader>
                  <CardTitle>Análises</CardTitle>
                  <CardDescription>
                    Análises detalhadas sobre suas reservas e clientes
                  </CardDescription>
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
  );
}
