"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { GuestHeader } from "@/components/guest-header"
import { GuestFooter } from "@/components/guest-footer"
import api from "@/lib/axios"
import { useAuth } from "@/app/contexts/auth-context"
import { Checkbox } from "@radix-ui/react-checkbox"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [mostrarSenha, setMostrarSenha] = useState(false)
    const [rememberMe, setRememberMe] = useState(false)
    const { login, isAuthenticated, companyId } = useAuth()

    useEffect(() => {
        if (isAuthenticated) {
            router.push("/admin/dashboard")
        }
    }, [isAuthenticated, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)
        setError("")

        const response = await api.post("/auth/login", {
            email,
            password,
        })

        try {
            await login(
                email,
                password,
                rememberMe,
            )

            router.push("/admin/dashboard")
        }
        catch (error) {
            setError(error instanceof Error ? error.message : "Email ou senha inválidos")
        } finally {
            setIsLoading(false)
        }

        if (response.status === 200) {
            router.push("/admin/dashboard")
        } else {
            setError("Email ou senha inválidos")
        }

        setIsLoading(false)
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <GuestHeader />
            <div className="flex-grow flex items-center justify-center p-4">
                <Card className="w-full max-w-md">
                    <CardHeader>
                        <CardTitle className="text-2xl text-center text-green-800">Login Administrativo</CardTitle>
                        <CardDescription className="text-center">
                            Acesse o painel para gerenciar suas quadras e reservas
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Senha</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={mostrarSenha ? "text" : "password"}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
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
                            </div>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="rememberMe"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                                />
                                <Label htmlFor="rememberMe" className="text-sm font-normal">
                                    Lembrar de mim
                                </Label>
                                <div className="flex-1 text-right">
                                    <Link href="/recuperar-senha" className="text-sm text-green-600 hover:underline">
                                        Esqueceu sua senha?
                                    </Link>
                                </div>
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col space-y-4">
                            <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isLoading}>
                                {isLoading ? "Entrando..." : "Entrar"}
                            </Button>
                            <div className="text-center text-sm">
                                Não tem uma conta?{" "}
                                <Link href="/signup" className="text-green-600 hover:underline">
                                    Cadastre-se
                                </Link>
                            </div>
                        </CardFooter>
                    </form>
                </Card>
            </div>
            <GuestFooter />
        </div>
    )
}
