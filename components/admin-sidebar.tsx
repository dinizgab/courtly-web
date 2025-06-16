"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { BarChart3, CalendarDays, Home, LayoutGrid, LogOut, Settings, Users } from "lucide-react"
import AuthService from "@/lib/auth-service"

interface AdminSidebarProps {
  activePage?: string
}

const handleLogout = () => {
        AuthService.removeToken()
}

export function AdminSidebar({ activePage }: AdminSidebarProps) {
  const menuItems = [
    {
      name: "Dashboard",
      href: "/admin/dashboard",
      icon: Home,
      id: "dashboard",
    },
    {
      name: "Quadras",
      href: "/admin/courts",
      icon: LayoutGrid,
      id: "courts",
    },
    {
      name: "Reservas",
      href: "/admin/bookings",
      icon: CalendarDays,
      id: "bookings",
    },
    //{
    //  name: "Clientes",
    //  href: "/admin/clientes",
    //  icon: Users,
    //  id: "clientes",
    //},
    //{
    //  name: "Relatórios",
    //  href: "/admin/relatorios",
    //  icon: BarChart3,
    //  id: "relatorios",
    //},
    //{
    //  name: "Configurações",
    //  href: "/admin/configuracoes",
    //  icon: Settings,
    //  id: "configuracoes",
    //},
  ]

  return (
    <aside className="hidden md:flex h-screen w-64 flex-col border-r bg-primary-heavy text-white">
      <div className="p-6">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <span className="text-xl font-bold">Courtly</span>
        </Link>
      </div>
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              activePage === item.id ? "bg-primary text-white" : "text-slate-100 hover:bg-primary-light hover:text-primary-heavy",
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.name}
          </Link>
        ))}
      </nav>
      <div className="border-t border-slate-700 p-4">
        <Link
          href="/"
          onClick={handleLogout}
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-100 hover:bg-primary-light hover:text-primary-heavy transition-colors"
        >
          <LogOut className="h-5 w-5" />
          Sair
        </Link>
      </div>
    </aside>
  )
}
