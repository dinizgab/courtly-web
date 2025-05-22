"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"

export function LandingHeader() {
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  // Handle scroll event to change header style
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navItems = [
    { label: "Recursos", href: "#recursos" },
    { label: "Como Funciona", href: "#como-funciona" },
    //{ label: "Preços", href: "#precos" },
    { label: "FAQ", href: "#faq" },
    { label: "Contato", href: "#contato" },
  ]

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-md py-2" : "bg-transparent py-4"
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-600">
            
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  isScrolled ? "text-gray-700 hover:text-green-600" : "text-gray-700 hover:text-green-600"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              className="text-green-600 border-green-600 hover:bg-green-50"
              onClick={() => router.push("/admin/login")}
            >
              Login
            </Button>
            <Button className="bg-green-600 hover:bg-green-700" onClick={() => router.push("/signup")}>
              Cadastre-se
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-gray-700">
                  <Menu className="h-6 w-6" />
                  <span className="sr-only">Menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-6 mt-8">
                  {navItems.map((item, index) => (
                    <Link
                      key={index}
                      href={item.href}
                      className="text-lg font-medium text-gray-700 hover:text-green-600"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <div className="pt-6 space-y-4">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        router.push("/admin/login")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700"
                      onClick={() => {
                        router.push("/signup")
                        setIsMobileMenuOpen(false)
                      }}
                    >
                      Cadastre-se
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

