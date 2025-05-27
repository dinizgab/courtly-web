"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function GuestHeader() {
    return (
        <header className="sticky top-0 z-10 bg-white border-b shadow-sm">
            <div className="container mx-auto px-4">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/showcase" className="text-xl font-bold text-slate-600">
                            Courtly
                        </Link>
                    </div>

                    {/* Menu para desktop */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/showcase" className="text-gray-600 hover:text-slate-600 transition-colors">
                            Início
                        </Link>
                        <Link href="/showcase#como-funciona" className="text-gray-600 hover:text-slate-600 transition-colors">
                            Como Funciona
                        </Link>
                        <Link href="/showcase#contato" className="text-gray-600 hover:text-slate-600 transition-colors">
                            Contato
                        </Link>
                        <Button asChild className="bg-slate-600 hover:bg-slate-700">
                            <Link href="/">Área Administrativa</Link>
                        </Button>
                    </nav>

                    {/* Menu para mobile */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right">
                                <nav className="flex flex-col space-y-4 mt-8">
                                    <Link href="/" className="text-lg font-medium">
                                        Início
                                    </Link>
                                    <Link href="/#como-funciona" className="text-lg font-medium">
                                        Como Funciona
                                    </Link>
                                    <Link href="/#contato" className="text-lg font-medium">
                                        Contato
                                    </Link>
                                    <Button asChild className="mt-2 bg-slate-600 hover:bg-slate-700">
                                        <Link href="/">Área Administrativa</Link>
                                    </Button>
                                </nav>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </header>
    )
}
