import Link from "next/link";
import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function LandingFooter() {
  return (
    <footer className="bg-gray-900 text-white" id="contato">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-bold">Courtly</h3>
            <p className="text-gray-400">
              A plataforma completa para gestão de quadras esportivas.
              Simplifique suas reservas e aumente seus resultados.
            </p>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-bold">Links Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#recursos"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Recursos
                </Link>
              </li>
              <li>
                <Link
                  href="#como-funciona"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Como Funciona
                </Link>
              </li>
              <li>
                <Link
                  href="#precos"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Preços
                </Link>
              </li>
              <li>
                <Link
                  href="#faq"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/vitrine"
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Vitrine Demo
                </Link>
              </li>
            </ul>
          </div>
          {
            <div>
              <h3 className="text-xl font-bold mb-4">Contato</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <Mail className="h-5 w-5 mr-2 text-gray-100" />
                  <a
                    href="mailto:suporte@courtly.com.br"
                    className="text-gray-300 hover:text-white"
                  >
                    suporte@courtly.com.br
                  </a>
                </li>
                <li className="flex items-center">
                  <Phone className="h-5 w-5 mr-2 text-gray-100" />
                  <a
                    href="tel:+5583986644385"
                    className="text-gray-300 hover:text-white"
                  >
                    (83) 98664-4385
                  </a>
                </li>

              </ul>
            </div>

            //
            //<div className="space-y-4">
            //  <h3 className="text-lg font-bold">Newsletter</h3>
            //  <p className="text-gray-400">Receba novidades e dicas para melhorar seu negócio.</p>
            //  <div className="flex space-x-2">
            //    <Input type="email" placeholder="Seu email" className="bg-gray-800 border-gray-700 text-white" />
            //    <Button className="bg-green-600 hover:bg-green-700">Assinar</Button>
            //  </div>
            //</div>
          }
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; {new Date().getFullYear()} Courtly. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
