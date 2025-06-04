"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import AuthService from "@/lib/auth-service"
import { decodeToken } from "@/lib/jwt"

interface AuthContextType {
    isAuthenticated: boolean
    isLoading: boolean
    companyId: string | null
    user: any | null
    token: string | null
    login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
    signup: (userData: any) => Promise<void>
    logout: () => void
    refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [companyId, setCompanyId] = useState<string | null>(null)
    const [user, setUser] = useState<any | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const isAuth = AuthService.isAuthenticated()
                setIsAuthenticated(isAuth)

                if (isAuth) {
                    const token = AuthService.getToken()
                    if (token) {
                        const decoded = decodeToken(token)
                        setCompanyId(decoded?.company_id || null)
                        setToken(token)

                        try {
                            //const profile = await AuthService.getProfile()
                            //setUser(profile)
                        } catch (error) {
                            console.error("Error fetching user profile:", error)
                        }
                    }
                }
            } catch (error) {
                console.error("Auth check error:", error)
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()
    }, [])

    const login = async (email: string, password: string, rememberMe = false) => {
        setIsLoading(true)
        try {
            const response = await AuthService.login({ email, password, rememberMe })

            const token = response.token
            const decoded = decodeToken(token)
            setCompanyId(decoded?.company_id || null)
            setToken(token)

            //const profile = await AuthService.getProfile()
            //setUser(profile)

            setIsAuthenticated(true)
        } catch (error) {
            console.error("Login error:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const signup = async (userData: any) => {
        setIsLoading(true)
        try {
            const response = await AuthService.signup(userData)

            const token = response.token
            const decoded = decodeToken(token)
            setCompanyId(decoded?.company_id || null)
            setToken(token)

            //const profile = await AuthService.getProfile()
            //setUser(profile)

            setIsAuthenticated(true)
        } catch (error) {
            console.error("Signup error:", error)
            throw error
        } finally {
            setIsLoading(false)
        }
    }

    const logout = () => {
        AuthService.logout()
        setIsAuthenticated(false)
        setCompanyId(null)
        setUser(null)
        router.push("/admin/login")
    }

    const refreshUser = async () => {
        if (!isAuthenticated) return

        try {
            const profile = await AuthService.getProfile()
            setUser(profile)
        } catch (error) {
            console.error("Error refreshing user data:", error)
        }
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                companyId,
                user,
                login,
                signup,
                logout,
                refreshUser,
                token,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext)
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider")
    }
    return context
}

