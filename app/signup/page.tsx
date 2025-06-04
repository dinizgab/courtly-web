"use client"

import { useEffect, useState } from "react"
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
import { Loader2, ArrowLeft, Eye, EyeOff, AlertCircle, } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GuestHeader } from "@/components/guest-header"
import { GuestFooter } from "@/components/guest-footer"
import { validateCNPJ } from "@/lib/validator"
import { useAuth } from "@/contexts/auth-context"

const signupFormSchema = z
    .object({
        email: z.string().email({ message: "Email inválido" }),
        phone: z.string().min(11, { message: "Telefone deve ter pelo menos 11 dígitos" }),
        companyName: z.string().min(3, { message: "Nome da empresa deve ter pelo menos 3 caracteres" }),
        cnpj: z
            .string()
            .min(14, { message: "CNPJ deve ter 14 dígitos" })
            .max(18, { message: "CNPJ deve ter 14 dígitos" })
            .refine((cnpj) => validateCNPJ(cnpj), { message: "CNPJ inválido" }),
        password: z
            .string()
            .min(8, { message: "Senha deve ter pelo menos 8 caracteres" })
            .regex(/[A-Z]/, { message: "Senha deve conter pelo menos uma letra maiúscula" })
            .regex(/[a-z]/, { message: "Senha deve conter pelo menos uma letra minúscula" })
            .regex(/[0-9]/, { message: "Senha deve conter pelo menos um número" }),
        confirmPassword: z.string(),
        street: z.string().min(3, { message: "Rua é obrigatória" }),
        number: z.string().min(1, { message: "Número é obrigatório" }),
        neighborhood: z.string().min(3, { message: "Bairro é obrigatório" }),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não coincidem",
        path: ["confirmarSenha"],
    })

type SignupFormValues = z.infer<typeof signupFormSchema>

export default function SignupPage() {
    const router = useRouter()
    const { toast } = useToast()
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { signup, isAuthenticated } = useAuth()
    const [error, setError] = useState("")

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/admin/dashboard")
        }
    }, [isAuthenticated, router])

    const form = useForm<SignupFormValues>({
        resolver: zodResolver(signupFormSchema),
        defaultValues: {
            email: "",
            phone: "",
            companyName: "",
            cnpj: "",
            password: "",
            confirmPassword: "",
            street: "",
            number: "",
            neighborhood: "",
        },
    })

    const onSubmit = async (data: SignupFormValues) => {
        try {
            setIsSubmitting(true)
            setError("")
            const cleanedCNPJ = data.cnpj.replace(/[^\d]/g, "")
            const cleanedPhone = data.phone.replace(/[^\d]/g, "")

            await signup({
                name: data.companyName,
                cnpj: cleanedCNPJ,
                phone: cleanedPhone,
                email: data.email,
                password: data.password,
                street: data.street,
                number: data.number,
                neighborhood: data.neighborhood,
            })

            toast({
                title: "Cadastro realizado com sucesso!",
                description: "Bem-vindo à plataforma.",
            })

            router.push("/admin/dashboard")
        } catch (error) {
            console.error("Erro ao fazer cadastro:", error)
            setError(error instanceof Error ? error.message : "Erro ao fazer cadastro. Tente novamente.")
            toast({
                title: "Erro ao fazer cadastro",
                description: "Não foi possível completar seu cadastro. Tente novamente.",
                variant: "destructive",
            })
        } finally {
            setIsSubmitting(false)
        }
    }

    const formatCNPJ = (value: string) => {
        const cleanedCNPJ = value.replace(/[^\d]/g, "")

        return cleanedCNPJ
            .replace(/^(\d{2})(\d)/, "$1.$2")
            .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
            .replace(/\.(\d{3})(\d)/, ".$1/$2")
            .replace(/(\d{4})(\d)/, "$1-$2")
            .substring(0, 18)
    }

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
                                {error && (
                                    <Alert variant="destructive">
                                        <AlertCircle className="h-4 w-4" />
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )}
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
                                        name="companyName"
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
                                                    <Input placeholder="XX.XXX.XXX/XXXX-XX" {...field} value={formatCNPJ(field.value)} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="phone"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Telefone</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="(00) 00000-0000"
                                                        {...field}
                                                        value={formatPhone(field.value)}
                                                        onChange={(e) => field.onChange(formatPhone(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="space-y-4 mt-4">
                                        <h3 className="text-md font-medium">Endereço</h3>
                                        <div className="grid grid-cols-1 gap-4">
                                            <FormField
                                                control={form.control}
                                                name="street"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Rua</FormLabel>
                                                        <FormControl>
                                                            <Input placeholder="Nome da rua" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
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
                                                    control={form.control}
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

                                    <FormField
                                        control={form.control}
                                        name="password"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Senha</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            type={showPassword ? "text" : "password"}
                                                            placeholder="Crie uma senha segura"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() => setShowPassword(!showPassword)}>
                                                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
                                        name="confirmPassword"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Confirmar Senha</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            type={showConfirmPassword ? "text" : "password"}
                                                            placeholder="Confirme sua senha"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="absolute right-0 top-0 h-full px-3"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                    >
                                                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                    </Button>
                                                </div>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </CardContent>
                                <CardFooter className="flex flex-col space-y-4">
                                    <Button type="submit" className="w-full bg-slate-600 hover:bg-slate-700" disabled={isSubmitting}>
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
                                        <Link href="/admin/login" className="text-blue-600 hover:underline">
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
        </div >
    )
}
