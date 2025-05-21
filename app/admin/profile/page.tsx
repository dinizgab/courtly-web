"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Eye, EyeOff, Save } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { validateCNPJ } from "@/lib/validator"

const perfilFormSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  nomeEmpresa: z.string().min(3, { message: "Nome da empresa deve ter pelo menos 3 caracteres" }),
  cnpj: z
    .string()
    .min(14, { message: "CNPJ deve ter 14 dígitos" })
    .max(18, { message: "CNPJ deve ter 14 dígitos" })
    .refine((cnpj) => validateCNPJ(cnpj), { message: "CNPJ inválido" }),
  telefone: z.string().optional(),
  endereco: z.string().optional(),
})

// Schema de validação do formulário de senha
const senhaFormSchema = z
  .object({
    senhaAtual: z.string().min(1, { message: "Senha atual é obrigatória" }),
    novaSenha: z
      .string()
      .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
      .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
      .regex(/[a-z]/, { message: "Senha deve conter pelo menos uma letra minúscula" })
      .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número" }),
    confirmarSenha: z.string(),
  })
  .refine((data) => data.novaSenha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  })

type PerfilFormValues = z.infer<typeof perfilFormSchema>
type SenhaFormValues = z.infer<typeof senhaFormSchema>

export default function PerfilPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isSubmittingPerfil, setIsSubmittingPerfil] = useState(false)
  const [isSubmittingSenha, setIsSubmittingSenha] = useState(false)
  const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false)
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false)
  const [mostrarConfirmacaoSenha, setMostrarConfirmacaoSenha] = useState(false)

  // Inicializar o formulário de perfil
  const perfilForm = useForm<PerfilFormValues>({
    resolver: zodResolver(perfilFormSchema),
    defaultValues: {
      email: "empresa@exemplo.com",
      nomeEmpresa: "Quadras Esportivas Ltda",
      cnpj: "12.345.678/0001-90",
      telefone: "(11) 98765-4321",
      endereco: "Rua das Quadras, 123 - Centro, São Paulo - SP",
    },
  })

  // Inicializar o formulário de senha
  const senhaForm = useForm<SenhaFormValues>({
    resolver: zodResolver(senhaFormSchema),
    defaultValues: {
      senhaAtual: "",
      novaSenha: "",
      confirmarSenha: "",
    },
  })

  const onSubmitPerfil = async (data: PerfilFormValues) => {
    try {
      setIsSubmittingPerfil(true)

      // Formatar CNPJ para armazenamento (remover caracteres não numéricos)
      const cnpjFormatado = data.cnpj.replace(/[^\d]/g, "")

      // Dados do perfil
      const perfilData = {
        email: data.email,
        nomeEmpresa: data.nomeEmpresa,
        cnpj: cnpjFormatado,
        telefone: data.telefone,
        endereco: data.endereco,
      }

      console.log("Dados do perfil:", perfilData)

      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mostrar toast de sucesso
      toast({
        title: "Perfil atualizado com sucesso!",
        description: "Suas informações foram atualizadas.",
      })
    } catch (error) {
      console.error("Erro ao atualizar perfil:", error)
      toast({
        title: "Erro ao atualizar perfil",
        description: "Não foi possível atualizar suas informações. Tente novamente.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingPerfil(false)
    }
  }

  const onSubmitSenha = async (data: SenhaFormValues) => {
    try {
      setIsSubmittingSenha(true)

      // Dados da senha
      const senhaData = {
        senhaAtual: data.senhaAtual,
        novaSenha: data.novaSenha,
      }

      console.log("Dados da senha:", senhaData)

      // Simulação de envio para API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Mostrar toast de sucesso
      toast({
        title: "Senha alterada com sucesso!",
        description: "Sua senha foi atualizada.",
      })

      // Limpar formulário
      senhaForm.reset({
        senhaAtual: "",
        novaSenha: "",
        confirmarSenha: "",
      })
    } catch (error) {
      console.error("Erro ao alterar senha:", error)
      toast({
        title: "Erro ao alterar senha",
        description: "Não foi possível alterar sua senha. Verifique se a senha atual está correta.",
        variant: "destructive",
      })
    } finally {
      setIsSubmittingSenha(false)
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
    <div className="flex min-h-screen bg-green-50">
      <AdminSidebar activePage="perfil" />
      <div className="flex-1">
        <AdminHeader title="Perfil da Empresa" />
        <main className="p-6">
          <Tabs defaultValue="informacoes" className="space-y-6">
            <TabsList>
              <TabsTrigger value="informacoes">Informações da Empresa</TabsTrigger>
              <TabsTrigger value="senha">Alterar Senha</TabsTrigger>
            </TabsList>

            <TabsContent value="informacoes">
              <Card>
                <CardHeader>
                  <CardTitle>Informações da Empresa</CardTitle>
                  <CardDescription>
                    Atualize as informações da sua empresa. Estas informações serão exibidas para os clientes.
                  </CardDescription>
                </CardHeader>
                <Form {...perfilForm}>
                  <form onSubmit={perfilForm.handleSubmit(onSubmitPerfil)}>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={perfilForm.control}
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
                          control={perfilForm.control}
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
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={perfilForm.control}
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
                          control={perfilForm.control}
                          name="telefone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Telefone</FormLabel>
                              <FormControl>
                                <Input placeholder="(00) 00000-0000" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={perfilForm.control}
                        name="endereco"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Endereço</FormLabel>
                            <FormControl>
                              <Input placeholder="Endereço completo" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmittingPerfil}>
                        {isSubmittingPerfil ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Salvar Alterações
                          </>
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>

            <TabsContent value="senha">
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                  <CardDescription>
                    Atualize sua senha de acesso. Para sua segurança, é necessário informar a senha atual.
                  </CardDescription>
                </CardHeader>
                <Form {...senhaForm}>
                  <form onSubmit={senhaForm.handleSubmit(onSubmitSenha)}>
                    <CardContent className="space-y-4">
                      <FormField
                        control={senhaForm.control}
                        name="senhaAtual"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha Atual</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type={mostrarSenhaAtual ? "text" : "password"}
                                  placeholder="Digite sua senha atual"
                                  {...field}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                              >
                                {mostrarSenhaAtual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={senhaForm.control}
                        name="novaSenha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type={mostrarNovaSenha ? "text" : "password"}
                                  placeholder="Digite sua nova senha"
                                  {...field}
                                />
                              </FormControl>
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-full px-3"
                                onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                              >
                                {mostrarNovaSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                            <FormMessage />
                            <p className="text-xs text-gray-500 mt-1">
                              A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e
                              um número.
                            </p>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={senhaForm.control}
                        name="confirmarSenha"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Confirmar Nova Senha</FormLabel>
                            <div className="relative">
                              <FormControl>
                                <Input
                                  type={mostrarConfirmacaoSenha ? "text" : "password"}
                                  placeholder="Confirme sua nova senha"
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
                    <CardFooter>
                      <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmittingSenha}>
                        {isSubmittingSenha ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Alterando...
                          </>
                        ) : (
                          "Alterar Senha"
                        )}
                      </Button>
                    </CardFooter>
                  </form>
                </Form>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}