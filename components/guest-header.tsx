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
                        <Link href="/showcase" className="text-xl font-bold text-primary-heavy">
                            Courtly
                        </Link>
                    </div>

                    {/* Menu para desktop */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link href="/" className="text-primary-heavy hover:text-primary transition-colors">
                            Início
                        </Link>
                        <Link href="/#como-funciona" className="text-primary-heavy hover:text-primary transition-colors">
                            Como Funciona
                        </Link>
                        <Link href="/#contato" className="text-primary-heavy hover:text-primary transition-colors">
                            Contato
                        </Link>
                        <Button asChild className="bg-primary hover:bg-primary-heavy">
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
                                    <Button asChild className="mt-2 bg-primary hover:bg-primary-heavy">
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
