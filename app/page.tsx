"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Calendar, Users, BarChart3, Clock, Settings, ArrowRight } from "lucide-react"
import { LandingHeader } from "@/components/landing-header"
import { LandingFooter } from "@/components/landing-footer"

export default function LandingPage() {
    const router = useRouter()
    const [activeTab, setActiveTab] = useState("mensal")

    const features = [
        {
            icon: Calendar,
            title: "Gestão de Reservas",
            description: "Controle total sobre agendamentos, com confirmação automática e lembretes para clientes.",
        },
        {
            icon: Users,
            title: "Cadastro de Clientes",
            description: "Mantenha uma base de dados organizada com histórico de reservas e preferências.",
        },
        {
            icon: BarChart3,
            title: "Relatórios Detalhados",
            description: "Visualize o desempenho do seu negócio com gráficos e métricas importantes.",
        },
        {
            icon: Clock,
            title: "Disponibilidade em Tempo Real",
            description: "Seus clientes veem apenas horários realmente disponíveis, evitando conflitos.",
        },
        {
            icon: Settings,
            title: "Personalização Completa",
            description: "Configure preços, horários e regras específicas para cada quadra.",
        },
        {
            icon: Calendar,
            title: "Vitrine Online",
            description: "Página personalizada para seus clientes visualizarem e reservarem suas quadras.",
        },
    ]

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
    ]

    const pricingPlans = [
        {
            name: "Básico",
            price: {
                mensal: "R$ 99,90",
                anual: "R$ 79,90",
            },
            description: "Ideal para locadores com até 2 quadras",
            features: [
                "Até 2 quadras",
                "Sistema de reservas",
                "Vitrine online",
                "Cadastro de clientes",
                "Relatórios básicos",
            ],
            cta: "Começar Agora",
            popular: false,
        },
        {
            name: "Profissional",
            price: {
                mensal: "R$ 199,90",
                anual: "R$ 159,90",
            },
            description: "Perfeito para negócios em crescimento",
            features: [
                "Até 5 quadras",
                "Sistema de reservas avançado",
                "Vitrine online personalizada",
                "Cadastro de clientes com histórico",
                "Relatórios detalhados",
                "Notificações por email",
                "Suporte prioritário",
            ],
            cta: "Escolher Plano",
            popular: true,
        },
        {
            name: "Empresarial",
            price: {
                mensal: "R$ 349,90",
                anual: "R$ 279,90",
            },
            description: "Para complexos esportivos completos",
            features: [
                "Quadras ilimitadas",
                "Sistema de reservas avançado",
                "Vitrine online premium",
                "Gestão completa de clientes",
                "Relatórios avançados e exportáveis",
                "Notificações por email e SMS",
                "Suporte VIP",
                "API para integrações",
            ],
            cta: "Falar com Consultor",
            popular: false,
        },
    ]

    const faqs = [
        {
            question: "Como funciona o período de teste gratuito?",
            answer:
                "Oferecemos 14 dias de teste gratuito com acesso a todas as funcionalidades do plano Profissional. Não é necessário cartão de crédito para começar o teste.",
        },
        {
            question: "Preciso instalar algum software?",
            answer:
                "Não, o QuadrasFácil é uma plataforma 100% online. Você só precisa de um navegador e conexão com a internet para acessar o sistema de qualquer dispositivo.",
        },
        {
            question: "Como os clientes fazem reservas?",
            answer:
                "Seus clientes podem fazer reservas através da sua vitrine online personalizada ou você pode registrar reservas manualmente no sistema administrativo.",
        },
        {
            question: "É possível personalizar a vitrine com minha marca?",
            answer:
                "Sim, nos planos Profissional e Empresarial você pode personalizar a vitrine com suas cores, logo e informações específicas do seu negócio.",
        },
        {
            question: "Como funciona o pagamento das reservas?",
            answer:
                "O sistema permite configurar diferentes métodos de pagamento, incluindo pagamento no local, transferência bancária ou integração com gateways de pagamento (disponível no plano Empresarial).",
        },
        {
            question: "Posso cancelar minha assinatura a qualquer momento?",
            answer:
                "Sim, você pode cancelar sua assinatura quando quiser. Se cancelar uma assinatura anual, o serviço continuará disponível até o final do período pago.",
        },
    ]

    return (
        <div className="flex flex-col min-h-screen">
            <LandingHeader />

            {/* Hero Section */}
            <section className="relative bg-gradient-to-r from-green-600 to-green-700 text-white py-20">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="space-y-6">
                            {
                                //<Badge className="bg-white text-green-700 hover:bg-gray-100">Novo: Relatórios Avançados</Badge>
                            }
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                                Gerencie suas quadras esportivas com facilidade
                            </h1>
                            <p className="text-xl opacity-90">
                                Automatize reservas, elimine conflitos de horários e aumente sua receita com nossa plataforma completa
                                para gestão de quadras esportivas.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 pt-4">
                                <Button
                                    size="lg"
                                    className="bg-white text-green-700 hover:bg-gray-100"
                                    onClick={() => router.push("/signup")}
                                >
                                    Começar Gratuitamente
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    className="border-white text-white hover:bg-white/20 hover:text-white"
                                    onClick={() => router.push("/admin/login")}
                                >
                                    Fazer Login
                                </Button>
                            </div>
                            {
                                //<p className="text-sm opacity-80">Teste grátis por 14 dias. Sem necessidade de cartão de crédito.</p>
                            }
                        </div>
                        <div className="relative h-[400px] rounded-lg overflow-hidden shadow-2xl hidden lg:block">
                            <Image
                                src="/placeholder.svg?height=400&width=600"
                                alt="Dashboard do sistema de gestão de quadras"
                                fill
                                className="object-cover"
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
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 mb-4">Recursos</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Tudo o que você precisa para gerenciar suas quadras</h2>
                        <p className="text-lg text-gray-600">
                            Nossa plataforma foi desenvolvida especialmente para atender às necessidades de locadores de quadras
                            esportivas, com recursos que facilitam o dia a dia e aumentam seus resultados.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                                <CardContent className="p-6">
                                    <div className="rounded-full bg-green-100 w-12 h-12 flex items-center justify-center mb-4">
                                        <feature.icon className="h-6 w-6 text-green-600" />
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
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 mb-4">Como Funciona</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Simplifique a gestão das suas quadras em 3 passos</h2>
                        <p className="text-lg text-gray-600">
                            Começar a usar o QuadrasFácil é simples e rápido. Em poucos minutos você já pode estar gerenciando suas
                            quadras de forma eficiente.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                step: "1",
                                title: "Cadastre suas quadras",
                                description:
                                    "Adicione suas quadras, configure preços, horários de funcionamento e regras específicas para cada uma.",
                                image: "/placeholder.svg?height=200&width=300",
                            },
                            {
                                step: "2",
                                title: "Personalize sua vitrine",
                                description:
                                    "Customize a página de vitrine que seus clientes verão, com suas cores, logo e informações do seu negócio.",
                                image: "/placeholder.svg?height=200&width=300",
                            },
                            {
                                step: "3",
                                title: "Comece a receber reservas",
                                description:
                                    "Compartilhe o link da sua vitrine e comece a receber reservas online ou registre manualmente no sistema.",
                                image: "/placeholder.svg?height=200&width=300",
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
                                    <div className="absolute -top-4 -left-4 w-10 h-10 rounded-full bg-green-600 text-white flex items-center justify-center text-lg font-bold">
                                        {step.step}
                                    </div>
                                </div>
                                <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                                <p className="text-gray-600">{step.description}</p>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Button size="lg" className="bg-green-600 hover:bg-green-700" onClick={() => router.push("/cadastro")}>
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
                //                  <Badge className="bg-green-100 text-green-700 hover:bg-green-200 mb-4">Depoimentos</Badge>
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
            {
                //      <section className="py-20 bg-white" id="precos">
                //        <div className="container mx-auto px-4">
                //          <div className="text-center max-w-3xl mx-auto mb-16">
                //            <Badge className="bg-green-100 text-green-700 hover:bg-green-200 mb-4">Preços</Badge>
                //            <h2 className="text-3xl md:text-4xl font-bold mb-4">Planos que se adaptam ao seu negócio</h2>
                //            <p className="text-lg text-gray-600">
                //              Escolha o plano ideal para o tamanho do seu negócio. Todos os planos incluem teste gratuito de 14 dias.
                //            </p>
                //
                //            <div className="mt-8 inline-block bg-gray-100 p-1 rounded-lg">
                //              <Tabs defaultValue="mensal" value={activeTab} onValueChange={setActiveTab}>
                //                <TabsList className="grid grid-cols-2 w-[300px]">
                //                  <TabsTrigger value="mensal">Mensal</TabsTrigger>
                //                  <TabsTrigger value="anual">Anual (20% OFF)</TabsTrigger>
                //                </TabsList>
                //              </Tabs>
                //            </div>
                //          </div>
                //
                //          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                //            {pricingPlans.map((plan, index) => (
                //              <Card
                //                key={index}
                //                className={`border-0 shadow-md hover:shadow-lg transition-shadow relative ${
                //                  plan.popular ? "border-t-4 border-t-green-600" : ""
                //                }`}
                //              >
                //                {plan.popular && (
                //                  <div className="absolute top-0 right-0 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                //                    MAIS POPULAR
                //                  </div>
                //                )}
                //                <CardContent className="p-6">
                //                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                //                  <div className="mb-4">
                //                    <span className="text-3xl font-bold">{plan.price[activeTab]}</span>
                //                    <span className="text-gray-500">/mês</span>
                //                  </div>
                //                  <p className="text-gray-600 mb-6">{plan.description}</p>
                //
                //                  <ul className="space-y-3 mb-8">
                //                    {plan.features.map((feature, i) => (
                //                      <li key={i} className="flex items-start">
                //                        <CheckCircle className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                //                        <span>{feature}</span>
                //                      </li>
                //                    ))}
                //                  </ul>
                //
                //                  <Button
                //                    className={`w-full ${
                //                      plan.popular ? "bg-green-600 hover:bg-green-700" : "bg-gray-800 hover:bg-gray-900"
                //                    }`}
                //                    onClick={() => router.push("/cadastro")}
                //                  >
                //                    {plan.cta}
                //                  </Button>
                //                </CardContent>
                //              </Card>
                //            ))}
                //          </div>
                //
                //          <div className="mt-12 text-center">
                //            <p className="text-gray-600 mb-4">
                //              Precisa de um plano personalizado para seu negócio? Entre em contato conosco.
                //            </p>
                //            <Button variant="outline" onClick={() => router.push("/contato")}>
                //              Falar com um Consultor
                //            </Button>
                //          </div>
                //        </div>
                //      </section>
            }
            {/* FAQ Section */}
            <section className="py-20 bg-gray-50" id="faq">
                <div className="container mx-auto px-4">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 mb-4">Perguntas Frequentes</Badge>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Dúvidas comuns</h2>
                        <p className="text-lg text-gray-600">
                            Encontre respostas para as perguntas mais frequentes sobre nossa plataforma.
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
                        <Button variant="outline" onClick={() => router.push("/contato")}>
                            Entre em Contato
                        </Button>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Pronto para transformar a gestão das suas quadras?</h2>
                    <p className="text-xl opacity-90 mb-8 max-w-3xl mx-auto">
                        Comece hoje mesmo com nosso período de teste gratuito de 14 dias. Sem compromisso, sem necessidade de cartão
                        de crédito.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            size="lg"
                            className="bg-white text-green-700 hover:bg-gray-100"
                            onClick={() => router.push("/cadastro")}
                        >
                            Começar Gratuitamente
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            className="border-white text-white hover:bg-white/20 hover:text-white"
                            onClick={() => router.push("/admin/login")}
                        >
                            Fazer Login
                        </Button>
                    </div>
                </div>
            </section>

            <LandingFooter />
        </div>
    )
}

