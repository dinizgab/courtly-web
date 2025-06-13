import api from "./axios"
import { decodeToken, isTokenExpired } from "./jwt"
import { SignupData, LoginCredentials, AuthResponse } from "@/types/auth"

const TOKEN_KEY = "courtly_auth_token"

export interface ProfileUpdateData {
    email?: string
    nomeEmpresa?: string
    cnpj?: string
    telefone?: string
    rua?: string
    numero?: string
    bairro?: string
}

export interface PasswordUpdateData {
    senhaAtual: string
    novaSenha: string
}

const AuthService = {
    setToken: (token: string, rememberMe = false): void => {
        if (rememberMe) {
            localStorage.setItem(TOKEN_KEY, token)
        } else {
            sessionStorage.setItem(TOKEN_KEY, token)
        }
    },

    getToken: (): string | null => {
        return sessionStorage.getItem(TOKEN_KEY) || localStorage.getItem(TOKEN_KEY)
    },

    removeToken: (): void => {
        sessionStorage.removeItem(TOKEN_KEY)
        localStorage.removeItem(TOKEN_KEY)
    },

    isAuthenticated: (): boolean => {
        const token = AuthService.getToken()
        return !!token && !isTokenExpired(token)
    },

    getCompanyId: (): string | null => {
        const token = AuthService.getToken()
        if (!token) return null

        return decodeToken(token)?.sub || null
    },

    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        try {
            const response = await api.post("/auth/login",
                {
                    email: credentials.email,
                    password: credentials.password,
                },
                {
                    headers: { "Content-Type": "application/json", }
                }
            )

            if (response.status !== 200) {
                const errorData = await response.data
                throw new Error(errorData.message || "Login failed")
            }

            const data: AuthResponse = await response.data

            AuthService.setToken(data.token, credentials.rememberMe)

            // Setup token refresh
            // AuthService.setupTokenRefresh(data.token)

            return data
        } catch (error) {
            console.error("Login error:", error)
            throw error
        }
    },

    signup: async (signupData: SignupData): Promise<AuthResponse> => {
        try {
            const response = await api.post("/auth/signup", {
                name: signupData.name,
                cnpj: signupData.cnpj,
                address: `${signupData.street}, ${signupData.number} - ${signupData.neighborhood}`,
                phone: signupData.phone,
                email: signupData.email,
                password: signupData.password,
            },
                {
                    headers: { "Content-Type": "application/json", }
                }
            )

            if (response.status !== 201) {
                const errorData = await response.data
                throw new Error(errorData.message || "Signup failed")
            }

            const data: AuthResponse = await response.data
            AuthService.setToken(data.token)

            // Setup token refresh
            // AuthService.setupTokenRefresh(data.token)

            return data
        } catch (error) {
            console.error("Signup error:", error)
            throw error
        }
    },

    logout: (): void => {
        AuthService.removeToken()
    },

    // TODO -Implement this functionality
    //setupTokenRefresh: (token: string): void => {
    //    const timeUntilRefresh = getTimeUntilExpiration(token) - REFRESH_THRESHOLD

    //    if (timeUntilRefresh <= 0) {
    //        // Token is already close to expiration, refresh now
    //        AuthService.refreshToken()
    //        return
    //    }

    //    // Schedule token refresh
    //    setTimeout(() => {
    //        AuthService.refreshToken()
    //    }, timeUntilRefresh)
    //},

    // refreshToken: async (): Promise<void> => {
    //     try {
    //         const token = AuthService.getToken()
    //         if (!token) return

    //         // In a real app, this would be an API call
    //         const response = await fetch("/api/auth/refresh", {
    //             method: "POST",
    //             headers: {
    //                 Authorization: `Bearer ${token}`,
    //                 "Content-Type": "application/json",
    //             },
    //         })

    //         if (!response.ok) {
    //             // If refresh fails, log the user out
    //             AuthService.logout()
    //             return
    //         }

    //         const data: AuthResponse = await response.json()

    //         // Store the new token
    //         const rememberMe = !!localStorage.getItem(TOKEN_KEY)
    //         AuthService.setToken(data.token, rememberMe)

    //         // Setup the next refresh
    //         AuthService.setupTokenRefresh(data.token)
    //     } catch (error) {
    //         console.error("Token refresh error:", error)
    //         // If refresh fails, log the user out
    //         AuthService.logout()
    //     }
    // },

    getProfile: async (): Promise<any> => {
        try {
            const token = AuthService.getToken()
            if (!token) throw new Error("Not authenticated")

            const response = await api.get("/admin/profile", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (response.status !== 200) {
                throw new Error("Failed to fetch profile")
            }

            return await response.data
        } catch (error) {
            console.error("Get profile error:", error)
            throw error
        }
    },

    // TODO - Implement this functionality
    //updateProfile: async (data: ProfileUpdateData): Promise<any> => {
    //    try {
    //        const token = AuthService.getToken()
    //        if (!token) throw new Error("Not authenticated")

    //        const response = api.put("/api/profile", {
    //            headers: {
    //                Authorization: `Bearer ${token}`,
    //                "Content-Type": "application/json",
    //            },
    //            body: JSON.stringify(data),
    //        })

    //        if (response.status !== 200) {
    //            throw new Error("Failed to update profile")
    //        }

    //        return await response.json()
    //    } catch (error) {
    //        console.error("Update profile error:", error)
    //        throw error
    //    }
    //},

    // TODO - Implement this functionality
    //updatePassword: async (data: PasswordUpdateData): Promise<any> => {
    //  try {
    //    const token = AuthService.getToken()
    //    if (!token) throw new Error("Not authenticated")

    //    const response = api.put("/api/profile/password", {
    //      method: "PUT",
    //      headers: {
    //        Authorization: `Bearer ${token}`,
    //        "Content-Type": "application/json",
    //      },
    //      body: JSON.stringify(data),
    //    })

    //    if (!response.ok) {
    //      throw new Error("Failed to update password")
    //    }

    //    return await response.json()
    //  } catch (error) {
    //    console.error("Update password error:", error)
    //    throw error
    //  }
    //},
}

export default AuthService

