"use client"

import { useEffect, useState } from "react"
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
import { Loader2, Save } from "lucide-react"
import { AdminHeader } from "@/components/admin-header"
import { AdminSidebar } from "@/components/admin-sidebar"
import { validateCNPJ } from "@/lib/validator"
import api from "@/lib/axios"
import { useAuth } from "@/app/contexts/auth-context"
import { Company } from "@/lib/types"

const profileFormSchema = z.object({
    email: z.string().email({ message: "Email inválido" }),
    name: z.string().min(3, { message: "Nome da empresa deve ter pelo menos 3 caracteres" }),
    cnpj: z
        .string()
        .min(14, { message: "CNPJ deve ter 14 dígitos" })
        .max(18, { message: "CNPJ deve ter 14 dígitos" })
        .refine((cnpj) => validateCNPJ(cnpj), { message: "CNPJ inválido" }),
    phone: z.string().optional(),
    street: z.string().optional(),
    number: z.string().optional(),
    neighborhood: z.string().optional(),
})

//const passwordFormSchema = z
//    .object({
//        currentPassword: z.string().min(1, { message: "Senha atual é obrigatória" }),
//        newPassword: z
//            .string()
//            .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
//            .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
//            .regex(/[a-z]/, { message: "Senha deve conter pelo menos uma letra minúscula" })
//            .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número" }),
//        confirmPassword: z.string(),
//    })
//    .refine((data) => data.newPassword === data.confirmPassword, {
//        message: "As senhas não coincidem",
//        path: ["confirmPassword"],
//    })

type ProfileFormValues = z.infer<typeof profileFormSchema>
//type PasswordFormValues = z.infer<typeof passwordFormSchema>

export default function PerfilPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmittingPerfil, setIsSubmittingPerfil] = useState(false)
    //const [isSubmittingSenha, setIsSubmittingSenha] = useState(false)
    //const [mostrarSenhaAtual, setMostrarSenhaAtual] = useState(false)
    //const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false)
    //const [mostrarConfirmacaoSenha, setMostrarConfirmacaoSenha] = useState(false)
    const { token, companyId } = useAuth()

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            email: "empresa@exemplo.com",
            name: "Quadras Esportivas Ltda",
            cnpj: "12.345.678/0001-90",
            phone: "(11) 98765-4321",
            street: "Rua das Flores",
            number: "123",
            neighborhood: "Jardim das Palmeiras",
        },
    })

    //const passwordForm = useForm<PasswordFormValues>({
    //    resolver: zodResolver(passwordFormSchema),
    //    defaultValues: {
    //        currentPassword: "",
    //        newPassword: "",
    //        confirmPassword: "",
    //    },
    //})

    const formatPhone = (value: string) => {
        const phoneNums = value.replace(/[^\d]/g, "")

        if (phoneNums.length <= 10) {
            return phoneNums
                .replace(/^(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{4})(\d)/, "$1-$2")
                .substring(0, 14)
        } else {
            return phoneNums
                .replace(/^(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2")
                .substring(0, 15)
        }
    }

    const onSubmitUpdates = async (data: ProfileFormValues) => {
        try {
            setIsSubmittingPerfil(true)
            const formattedCnpj = data.cnpj.replace(/[^\d]/g, "")

            const profileData = {
                email: data.email,
                name: data.name,
                cnpj: formattedCnpj,
                phone: data.phone,
                address: `${data.street}, ${data.number} - ${data.neighborhood}`
            }

            const response = await api.put(`/admin/companies/${companyId}`, profileData, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            })

            if (response.status !== 200) {
                throw new Error("Erro ao atualizar perfil: ", response.data)
            }

            toast({
                title: "Perfil atualizado com sucesso!",
                description: "Suas informações foram atualizadas.",
            })
        } catch (error) {
            console.error(error)

            toast({
                title: "Erro ao atualizar perfil",
                description: "Não foi possível atualizar suas informações. Tente novamente.",
                variant: "destructive",
            })
        } finally {
            setIsSubmittingPerfil(false)
        }
    }

    //const onPasswordSubmit = async (data: PasswordFormValues) => {
    //    try {
    //        setIsSubmittingSenha(true)
    //
    //        const passwordData = {
    //            actualPassword: data.currentPassword,
    //            newPassword: data.newPassword,
    //        }
    //
    //        // Simulação de envio para API
    //        await new Promise((resolve) => setTimeout(resolve, 1500))
    //
    //        // Mostrar toast de sucesso
    //        toast({
    //            title: "Senha alterada com sucesso!",
    //            description: "Sua senha foi atualizada.",
    //        })
    //
    //        // Limpar formulário
    //        passwordForm.reset({
    //            currentPassword: "",
    //            newPassword: "",
    //            confirmPassword: "",
    //        })
    //    } catch (error) {
    //        console.error("Erro ao alterar senha:", error)
    //        toast({
    //            title: "Erro ao alterar senha",
    //            description: "Não foi possível alterar sua senha. Verifique se a senha atual está correta.",
    //            variant: "destructive",
    //        })
    //    } finally {
    //        setIsSubmittingSenha(false)
    //    }
    //}

    useEffect(() => {
        const fetchProfile = async () => {
            if (!token || !companyId) return

            try {
                const response = await api.get(`/adming/companies/${companyId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                })

                if (response.status === 200) {
                    const { name, cnpj, phone, address, email } = response.data as Company
                    const [street, numberAndNeighborhood] = address.split(",").map((item) => item.trim())
                    const [number, neighborhood] = numberAndNeighborhood.split("-").map((item) => item.trim())

                    profileForm.reset({
                        email,
                        name,
                        cnpj,
                        phone,
                        street,
                        number,
                        neighborhood,
                    })
                }
            } catch (error) {
                console.error("Erro ao buscar perfil:", error)
            }
        }

        fetchProfile()
    }, [token, companyId])

    const formatCNPJ = (value: string) => {
        const cnpjNumerico = value.replace(/[^\d]/g, "")

        return cnpjNumerico
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .substring(0, 18)
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
                            {
                                //<TabsTrigger value="senha">Alterar Senha</TabsTrigger>
                            }
                        </TabsList>

                        <TabsContent value="informacoes">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informações da Empresa</CardTitle>
                                    <CardDescription>
                                        Atualize as informações da sua empresa. Estas informações serão exibidas para os clientes.
                                    </CardDescription>
                                </CardHeader>
                                <Form {...profileForm}>
                                    <form onSubmit={profileForm.handleSubmit(onSubmitUpdates)}>
                                        <CardContent className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <FormField
                                                    control={profileForm.control}
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
                                                    control={profileForm.control}
                                                    name="name"
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
                                                    control={profileForm.control}
                                                    name="cnpj"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>CNPJ</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="XX.XXX.XXX/XXXX-XX" {...field} value={formatCNPJ(field.value)} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={profileForm.control}
                                                    name="phone"
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

                                            <div className="space-y-4 mt-4">
                                                <h3 className="text-md font-medium">Endereço</h3>
                                                <div className="grid grid-cols-1 gap-4">
                                                    <FormField
                                                        control={profileForm.control}
                                                        name="street"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Rua</FormLabel>
                                                                <FormControl>
                                                                    <div className="flex">
                                                                        <Input placeholder="Nome da rua" {...field} />
                                                                    </div>
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />

                                                    <div className="grid grid-cols-2 gap-4">
                                                        <FormField
                                                            control={profileForm.control}
                                                            name="number"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Número</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="123" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />

                                                        <FormField
                                                            control={profileForm.control}
                                                            name="neighborhood"
                                                            render={({ field }) => (
                                                                <FormItem>
                                                                    <FormLabel>Bairro</FormLabel>
                                                                    <FormControl>
                                                                        <Input placeholder="Nome do bairro" {...field} />
                                                                    </FormControl>
                                                                    <FormMessage />
                                                                </FormItem>
                                                            )}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
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
                        {
                            //<TabsContent value="senha">
                            //    <Card>
                            //        <CardHeader>
                            //            <CardTitle>Alterar Senha</CardTitle>
                            //            <CardDescription>
                            //                Atualize sua senha de acesso. Para sua segurança, é necessário informar a senha atual.
                            //            </CardDescription>
                            //        </CardHeader>
                            //        <Form {...passwordForm}>
                            //            <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                            //                <CardContent className="space-y-4">
                            //                    <FormField
                            //                        control={passwordForm.control}
                            //                        name="currentPassword"
                            //                        render={({ field }) => (
                            //                            <FormItem>
                            //                                <FormLabel>Senha Atual</FormLabel>
                            //                                <div className="relative">
                            //                                    <FormControl>
                            //                                        <Input
                            //                                            type={mostrarSenhaAtual ? "text" : "password"}
                            //                                            placeholder="Digite sua senha atual"
                            //                                            {...field}
                            //                                        />
                            //                                    </FormControl>
                            //                                    <Button
                            //                                        type="button"
                            //                                        variant="ghost"
                            //                                        size="icon"
                            //                                        className="absolute right-0 top-0 h-full px-3"
                            //                                        onClick={() => setMostrarSenhaAtual(!mostrarSenhaAtual)}
                            //                                    >
                            //                                        {mostrarSenhaAtual ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            //                                    </Button>
                            //                                </div>
                            //                                <FormMessage />
                            //                            </FormItem>
                            //                        )}
                            //                    />

                            //                    <FormField
                            //                        control={passwordForm.control}
                            //                        name="newPassword"
                            //                        render={({ field }) => (
                            //                            <FormItem>
                            //                                <FormLabel>Nova Senha</FormLabel>
                            //                                <div className="relative">
                            //                                    <FormControl>
                            //                                        <Input
                            //                                            type={mostrarNovaSenha ? "text" : "password"}
                            //                                            placeholder="Digite sua nova senha"
                            //                                            {...field}
                            //                                        />
                            //                                    </FormControl>
                            //                                    <Button
                            //                                        type="button"
                            //                                        variant="ghost"
                            //                                        size="icon"
                            //                                        className="absolute right-0 top-0 h-full px-3"
                            //                                        onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                            //                                    >
                            //                                        {mostrarNovaSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            //                                    </Button>
                            //                                </div>
                            //                                <FormMessage />
                            //                                <p className="text-xs text-gray-500 mt-1">
                            //                                    A senha deve ter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma minúscula e
                            //                                    um número.
                            //                                </p>
                            //                            </FormItem>
                            //                        )}
                            //                    />

                            //                    <FormField
                            //                        control={passwordForm.control}
                            //                        name="confirmPassword"
                            //                        render={({ field }) => (
                            //                            <FormItem>
                            //                                <FormLabel>Confirmar Nova Senha</FormLabel>
                            //                                <div className="relative">
                            //                                    <FormControl>
                            //                                        <Input
                            //                                            type={mostrarConfirmacaoSenha ? "text" : "password"}
                            //                                            placeholder="Confirme sua nova senha"
                            //                                            {...field}
                            //                                        />
                            //                                    </FormControl>
                            //                                    <Button
                            //                                        type="button"
                            //                                        variant="ghost"
                            //                                        size="icon"
                            //                                        className="absolute right-0 top-0 h-full px-3"
                            //                                        onClick={() => setMostrarConfirmacaoSenha(!mostrarConfirmacaoSenha)}
                            //                                    >
                            //                                        {mostrarConfirmacaoSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                            //                                    </Button>
                            //                                </div>
                            //                                <FormMessage />
                            //                            </FormItem>
                            //                        )}
                            //                    />
                            //                </CardContent>
                            //                <CardFooter>
                            //                    <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isSubmittingSenha}>
                            //                        {isSubmittingSenha ? (
                            //                            <>
                            //                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            //                                Alterando...
                            //                            </>
                            //                        ) : (
                            //                            "Alterar Senha"
                            //                        )}
                            //                    </Button>
                            //                </CardFooter>
                            //            </form>
                            //        </Form>
                            //    </Card>
                            //</TabsContent>
                        }
                    </Tabs>
                </main>
            </div>
        </div>
    )
}
