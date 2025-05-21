"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, ArrowLeft, Eye, EyeOff } from "lucide-react"
import { GuestHeader } from "@/components/guest-header"
import { GuestFooter } from "@/components/guest-footer"

// Função para validar CNPJ
function validarCNPJ(cnpj: string) {
  cnpj = cnpj.replace(/[^\d]/g, "")

  if (cnpj.length !== 14) return false

  // Elimina CNPJs inválidos conhecidos
  if (
    cnpj === "00000000000000" ||
    cnpj === "11111111111111" ||
    cnpj === "22222222222222" ||
    cnpj === "33333333333333" ||
    cnpj === "44444444444444" ||
    cnpj === "55555555555555" ||
    cnpj === "66666666666666" ||
    cnpj === "77777777777777" ||
    cnpj === "88888888888888" ||
    cnpj === "99999999999999"
  )
    return false

  // Valida DVs
  let tamanho = cnpj.length - 2
  let numeros = cnpj.substring(0, tamanho)
  const digitos = cnpj.substring(tamanho)
  let soma = 0
  let pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--
    if (pos < 2) pos = 9
  }

  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== Number(digitos.charAt(0))) return false

  tamanho = tamanho + 1
  numeros = cnpj.substring(0, tamanho)
  soma = 0
  pos = tamanho - 7

  for (let i = tamanho; i >= 1; i--) {
    soma += Number(numeros.charAt(tamanho - i)) * pos--
    if (pos < 2) pos = 9
  }

  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11)
  if (resultado !== Number(digitos.charAt(1))) return false

  return true
}

// Schema de validação do formulário
const cadastroFormSchema = z
  .object({
    email: z.string().email({ message: "Email inválido" }),
    nomeEmpresa: z.string().min(3, { message: "Nome da empresa deve ter pelo menos 3 caracteres" }),
    cnpj: z
      .string()
      .min(14, { message: "CNPJ deve ter 14 dígitos" })
      .max(18, { message: "CNPJ deve ter 14 dígitos" })
      .refine((cnpj) => validarCNPJ(cnpj), { message: "CNPJ inválido" }),
    senha: z
      .string()
      .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
      .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
      .regex(/[a-z]/, { message: "Senha deve conter pelo menos uma letra minúscula" })
      .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número" }),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })

type CadastroFormValues = z.infer<typeof cadastroFormSchema>

export default function CadastroPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [mostrarSenha, setMostrarSenha] = useState(false)
  const [mostrarConfirmacaoSenha, setMostrarConfirmacaoSenha] = useState(false)

  // Inicializar o formulário
  const form = useForm<CadastroFormValues>({
    resolver: zodResolver(cadastroFormSchema),
    defaultValues: {
      email: "",
      nomeEmpresa: "",
      cnpj: "",
      senha: "",
      confirmarSenha: "",
    },
  })

  const onSubmit = async (data: CadastroFormValues) => {
    try {
      setIsSubmitting(true)

      // Formatar CNPJ para armazenamento (remover caracteres não numéricos)
      const cnpjFormatado = data.cnpj.replace(/[^\d]/g, "")

      // Dados do cadastro
      const cadastroData = {
        email: data.email,
        nomeEmpresa: data.nomeEmpresa,
        cnpj: cnpjFormatado,
        senha: data.senha, // Em produção, isso seria hasheado no backend
      }

      console.log("Dados do cadastro:", cadastroData)

      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mostrar toast de sucesso
      toast({
        title: "Cadastro realizado com sucesso!",
        description: "Você já pode fazer login na plataforma.",
      })

      // Redirecionar para página de login
      router.push("/admin/login")
    } catch (error) {
      console.error("Erro ao fazer cadastro:", error)
      toast({
        title: "Erro ao fazer cadastro",
        description: "Não foi possível completar seu cadastro. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Função para formatar CNPJ enquanto o usuário digita
  const formatarCNPJ = (value: string) => {
    // Remove caracteres não numéricos
    const cnpjNumerico = value.replace(/[^\d]/g, "")

    // Aplica a máscara do CNPJ: XX.XXX.XXX/XXXX-XX
    return cnpjNumerico
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/\.(\d{3})(\d)/, ".$1/$2")
      .replace(/(\d{4})(\d)/, "$1-$2")
      .substring(0, 18) // Limita o tamanho máximo
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <GuestHeader />

      <div className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="outline" onClick={() => router.push("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para início
          </Button>
        </div>

        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Cadastro de Empresa</CardTitle>
              <CardDescription className="text-center">
                Crie sua conta para gerenciar suas quadras e reservas
              </CardDescription>
            </CardHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="empresa@exemplo.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="nomeEmpresa"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome da Empresa</FormLabel>
                        <FormControl>
                          <Input placeholder="Razão social da empresa" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="cnpj"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CNPJ</FormLabel>
                        <FormControl>
                          <Input placeholder="XX.XXX.XXX/XXXX-XX" {...field} value={formatarCNPJ(field.value)} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="senha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={mostrarSenha ? "text" : "password"}
                              placeholder="Crie uma senha segura"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setMostrarSenha(!mostrarSenha)}
                          >
                            {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <FormMessage />
                        <p className="text-xs text-gray-500 mt-1">
                          A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e um
                          número.
                        </p>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmarSenha"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <div className="relative">
                          <FormControl>
                            <Input
                              type={mostrarConfirmacaoSenha ? "text" : "password"}
                              placeholder="Confirme sua senha"
                              {...field}
                            />
                          </FormControl>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setMostrarConfirmacaoSenha(!mostrarConfirmacaoSenha)}
                          >
                            {mostrarConfirmacaoSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
                <CardFooter className="flex flex-col space-y-4">
                  <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      "Cadastrar"
                    )}
                  </Button>
                  <div className="text-center text-sm">
                    Já tem uma conta?{" "}
                    <Link href="/admin/login" className="text-green-600 hover:underline">
                      Faça login
                    </Link>
                  </div>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </div>
      </div>

      <GuestFooter />
    </div>
  )
}
