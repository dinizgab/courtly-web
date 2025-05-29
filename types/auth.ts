export interface SignupData {
    email: string
    name: string
    cnpj: string
    phone: string
    password: string
    street: string
    number: string
    neighborhood: string
}

export interface LoginCredentials {
    email: string
    password: string
    rememberMe?: boolean
}

export interface AuthResponse {
    message: string
    token: string
}
