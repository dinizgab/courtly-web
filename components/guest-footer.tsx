import Link from "next/link"
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from "lucide-react"

export function GuestFooter() {
  return (
    <footer className="bg-gray-800 text-white" id="contato">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">Courtly</h3>
            <p className="text-gray-300 mb-4">
              Encontre e reserve as melhores quadras esportivas da sua região de forma rápida e fácil.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-300 hover:text-white">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-gray-300 hover:text-white">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/showcase" className="text-gray-300 hover:text-white">
                  Início
                </Link>
              </li>
              <li>
                <Link href="/showcase#como-funciona" className="text-gray-300 hover:text-white">
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link href="/showcase#contato" className="text-gray-300 hover:text-white">
                  Contato
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-300 hover:text-white">
                  Área Administrativa
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-4">Contato</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-green-500" />
                <a href="mailto:contato@quadrasfacil.com" className="text-gray-300 hover:text-white">
                  contato@quadrasfacil.com
                </a>
              </li>
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-green-500" />
                <a href="tel:+551199999999" className="text-gray-300 hover:text-white">
                  (11) 9999-9999
                </a>
              </li>
              <li className="flex items-start">
                <MapPin className="h-5 w-5 mr-2 mt-1 text-green-500" />
                <span className="text-gray-300">
                  Rua das Quadras, 123 - Centro
                  <br />
                  São Paulo - SP, 01234-567
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="bg-gray-900 py-4">
        <div className="container mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Courtly. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  )
}
