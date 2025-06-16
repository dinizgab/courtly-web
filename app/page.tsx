"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  Calendar,
  Users,
  BarChart3,
  Clock,
  Settings,
  ArrowRight,
} from "lucide-react";
import { LandingHeader } from "@/components/landing-header";
import { LandingFooter } from "@/components/landing-footer";

export default function LandingPage() {
  const router = useRouter();

  const features = [
    {
      icon: Calendar,
      title: "Gestão de Reservas",
      description:
        "Controle total sobre agendamentos, com confirmação automática e lembretes para clientes.",
    },
    {
      icon: Users,
      title: "Cadastro de Clientes",
      description:
        "Mantenha uma base de dados organizada com histórico de reservas e preferências.",
    },
    {
      icon: BarChart3,
      title: "Relatórios Detalhados",
      description:
        "Visualize o desempenho do seu negócio com gráficos e métricas importantes.",
    },
    {
      icon: Clock,
      title: "Disponibilidade em Tempo Real",
      description:
        "Seus clientes veem apenas horários realmente disponíveis, evitando conflitos.",
    },
    {
      icon: Settings,
      title: "Personalização Completa",
      description:
        "Configure preços, horários e regras específicas para cada quadra.",
    },
    {
      icon: Calendar,
      title: "Vitrine Online",
      description:
        "Página personalizada para seus clientes visualizarem e reservarem suas quadras.",
    },
  ];

  const testimonials = [
    {
      name: "Carlos Silva",
      company: "Arena Esportiva Central",
      text: "Desde que implementamos o QuadrasFácil, reduzimos em 80% o tempo gasto com agendamentos e praticamente eliminamos erros de reservas duplicadas.",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Ana Oliveira",
      company: "Centro Esportivo Bola na Rede",
      text: "A vitrine online trouxe novos clientes e o sistema de gestão nos ajudou a organizar melhor nosso negócio. Recomendo fortemente!",
      image: "/placeholder.svg?height=80&width=80",
    },
    {
      name: "Roberto Santos",
      company: "Complexo Esportivo Gol de Placa",
      text: "O suporte é excelente e o sistema é muito intuitivo. Nossos funcionários aprenderam a usar em poucos minutos.",
      image: "/placeholder.svg?height=80&width=80",
    },
  ];

  const faqs = [
    {
      question: "Preciso instalar algum software?",
      answer:
        "Não, o Courtly é uma plataforma 100% online. Você só precisa de um navegador e conexão com a internet para acessar o sistema de qualquer dispositivo.",
    },
    {
      question: "Como os clientes fazem reservas?",
      answer:
        "Seus clientes podem fazer reservas através da sua vitrine online personalizada ou você pode registrar reservas manualmente no sistema administrativo.",
    },
    //{
    //  question: "É possível personalizar a vitrine com minha marca?",
    //  answer:
    //    "Sim, nos planos Profissional e Empresarial você pode personalizar a vitrine com suas cores, logo e informações específicas do seu negócio.",
    //},
    //{
    //  question: "Como funciona o pagamento das reservas?",
    //  answer:
    //    "O sistema permite configurar diferentes métodos de pagamento, incluindo pagamento no local, transferência bancária ou integração com gateways de pagamento (disponível no plano Empresarial).",
    //},
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <LandingHeader />

      <section className="relative bg-gradient-to-r from-primary to-[#2b7556] text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Gerencie suas quadras esportivas com facilidade
              </h1>
              <p className="text-xl opacity-90">
                Automatize reservas, elimine conflitos de horários e aumente sua
                receita com nossa plataforma completa para gestão de quadras
                esportivas.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  size="lg"
                  className="bg-white text-slate-700 hover:bg-gray-200"
                  onClick={() => router.push("/signup")}
                >
                  Começar Agora
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white text-slate-600 hover:bg-primary-heavy hover:text-white"
                  onClick={() => router.push("/admin/login")}
                >
                  Fazer Login
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-lg overflow-hidden hidden lg:block">
              <Image
                src="/header.svg?height=400&width=600"
                alt="Dashboard do sistema de gestão de quadras"
                fill
              />
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 120"
            className="w-full h-auto fill-gray-50"
            preserveAspectRatio="none"
          >
            <path d="M0,64L80,69.3C160,75,320,85,480,80C640,75,800,53,960,48C1120,43,1280,53,1360,58.7L1440,64L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path>
          </svg>
        </div>
      </section>

      {/* Trusted By Section */}
      {
        //            <section className="py-12 bg-white">
        //                <div className="container mx-auto px-4">
        //                    <h2 className="text-center text-gray-500 text-lg mb-8">CONFIADO POR CENTENAS DE EMPRESAS</h2>
        //                    <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
        //                        {[1, 2, 3, 4, 5].map((i) => (
        //                            <div key={i} className="grayscale opacity-60 hover:opacity-100 transition-opacity">
        //                                <Image
        //                                    src={`/placeholder.svg?height=40&width=120&text=LOGO ${i}`}
        //                                    alt={`Logo de empresa parceira ${i}`}
        //                                    width={120}
        //                                    height={40}
        //                                />
        //                            </div>
        //                        ))}
        //                    </div>
        //                </div>
        //            </section>
      }
      {/* Features Section */}
      <section className="py-20 bg-gray-50" id="recursos">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary-light text-primary-heavy hover:bg-slate-300 mb-4">
              Recursos
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tudo o que você precisa para gerenciar suas quadras
            </h2>
            <p className="text-lg text-gray-600">
              Nossa plataforma foi desenvolvida especialmente para atender às
              necessidades de locadores de quadras esportivas, com recursos que
              facilitam o dia a dia e aumentam seus resultados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="border-0 shadow-md hover:shadow-lg transition-shadow"
              >
                <CardContent className="p-6">
                  <div className="rounded-full bg-primary-light w-12 h-12 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-primary-heavy" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white" id="como-funciona">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary-light text-primary-heavy hover:bg-slate-300 mb-4">
              Como Funciona
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Simplifique a gestão das suas quadras em 3 passos
            </h2>
            <p className="text-lg text-gray-600">
              Começar a usar o Courtly é simples e rápido. Em poucos
              minutos você já pode estar gerenciando suas quadras de forma
              eficiente.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "1",
                title: "Cadastre suas quadras",
                description:
                  "Adicione suas quadras, configure preços, horários de funcionamento e regras específicas para cada uma.",
                image: "/cadastro-quadras.svg",
              },
              {
                step: "2",
                title: "Personalize sua vitrine",
                description:
                  "Customize a página de vitrine que seus clientes verão, com suas cores, logo e informações do seu negócio.",
                image: "/personalize-vitrine.svg?height=200&width=300",
              },
              {
                step: "3",
                title: "Comece a receber reservas",
                description:
                  "Compartilhe o link da sua vitrine e comece a receber reservas online ou registre manualmente no sistema.",
                image: "/reservas.svg?height=200&width=300",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="relative mb-6">
                  <div className="rounded-lg overflow-hidden">
                    <Image
                      src={step.image || "/placeholder.svg"}
                      alt={step.title}
                      width={300}
                      height={200}
                      className="w-full object-cover"
                    />
                  </div>
                  <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-primary-heavy text-white flex items-center justify-center text-lg font-bold">
                    {step.step}
                  </div>
                </div>
                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary-heavy"
              onClick={() => router.push("/signup")}
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {
        //      <section className="py-20 bg-gray-50">
        //          <div className="container mx-auto px-4">
        //              <div className="text-center max-w-3xl mx-auto mb-16">
        //                  <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-200 mb-4">Depoimentos</Badge>
        //                  <h2 className="text-3xl md:text-4xl font-bold mb-4">O que nossos clientes dizem</h2>
        //                  <p className="text-lg text-gray-600">
        //                      Centenas de locadores de quadras já transformaram seus negócios com o QuadrasFácil.
        //                  </p>
        //              </div>
        //              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        //                  {testimonials.map((testimonial, index) => (
        //                      <Card key={index} className="border-0 shadow-md">
        //                          <CardContent className="p-6">
        //                              <div className="flex items-center mb-4">
        //                                  <div className="relative w-12 h-12 rounded-full overflow-hidden mr-4">
        //                                      <Image
        //                                          src={testimonial.image || "/placeholder.svg"}
        //                                          alt={testimonial.name}
        //                                          fill
        //                                          className="object-cover"
        //                                      />
        //                                  </div>
        //                                  <div>
        //                                      <h4 className="font-bold">{testimonial.name}</h4>
        //                                      <p className="text-sm text-gray-500">{testimonial.company}</p>
        //                                  </div>
        //                              </div>
        //                              <p className="text-gray-600 italic">"{testimonial.text}"</p>
        //                          </CardContent>
        //                      </Card>
        //                  ))}
        //              </div>
        //          </div>
        //      </section>
      }

      {/* Pricing Section */}
      <section className="py-20 bg-white" id="precos">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary-light text-primary-heavy hover:bg-slate-200 mb-4">
              Preços
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Pague apenas pelo que você vende!
            </h2>
            <p className="text-lg text-gray-600">
              Com a nossa plataforma, a gestão das suas quadras é totalmente
              gratuita. Você só nos paga uma pequena taxa quando seu negócio
              prospera!
            </p>
          </div>

          <div className="flex justify-center">
            <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow relative max-w-lg w-full">
              <CardContent className="p-8 text-center">
                <h3 className="text-3xl font-bold mb-4 text-slate-700">
                  Apenas <span className="text-green-600">5%</span> por
                  reserva!
                </h3>
                <p className="text-gray-700 text-lg mb-6">
                  <strong>É simples, transparente e justo.</strong> Você não tem
                  mensalidades, nem taxas escondidas. Você só paga uma taxa fixa
                  de 5% do valor de cada reserva confirmada através da plataforma.
                </p>

                <div className="text-left space-y-4 mb-8">
                  <h4 className="text-xl font-semibold text-slate-600">
                    O que você ganha gratuitamente:
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Cadastro ilimitado de quadras:</strong> Adicione quantas
                        quadras quiser, de diferentes esportes e modalidades.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Controle total de ocupação:</strong> Gerencie horários,
                        disponibilidade e bloqueios de forma intuitiva.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Vitrine online personalizada:</strong> Sua página exclusiva
                        para atrair mais clientes.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Relatórios de desempenho:</strong> Acompanhe o crescimento do
                        seu negócio.
                      </span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="text-primary h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        <strong>Suporte dedicado:</strong> Estamos aqui para te ajudar em
                        cada passo.
                      </span>
                    </li>
                  </ul>
                </div>

                <p className="text-gray-700 text-lg mb-6">
                  <strong>Receba seus pagamentos a qualquer momento:</strong> Os valores das
                  reservas (descontando nossa pequena taxa) ficam disponíveis
                  para saque direto na sua conta, quando você quiser!
                </p>

                <Button
                  className="w-full bg-primary hover:bg-primary-heavy py-3 text-lg"
                  onClick={() => router.push("/signup")}
                >
                  Comece a receber reservas Agora!
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              Tem alguma dúvida ou precisa de mais informações?
            </p>
            <Button variant="outline" onClick={() => router.push("https://wa.me/5583986644385")}>
              Falar com um Consultor
            </Button>
          </div>
        </div>
      </section>
      {/* FAQ Section */}
      <section className="py-20 bg-gray-50" id="faq">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge className="bg-primary-light text-primary-heavy hover:bg-slate-300 mb-4">
              Perguntas Frequentes
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Dúvidas comuns
            </h2>
            <p className="text-lg text-gray-600">
              Encontre respostas para as perguntas mais frequentes sobre nossa
              plataforma.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4">
                <h3 className="text-lg font-bold mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">Não encontrou o que procurava?</p>
            <Button variant="outline" onClick={() => router.push("https://wa.me/5583986644385")}>
              Entre em Contato
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Pronto para transformar a gestão das suas quadras?
          </h2>
          <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
            Comece hoje mesmo e deixe que nos da courtly vamos te auxiliar em todo o processo das reservas de suas quadras.
            Sem compromisso, sem necessidade de cartão de crédito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-white text-slate-700 hover:bg-gray-100"
              onClick={() => router.push("/signup")}
            >
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-white text-slate-700 hover:bg-primary-heavy hover:text-white"
              onClick={() => router.push("/admin/login")}
            >
              Fazer Login
            </Button>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
