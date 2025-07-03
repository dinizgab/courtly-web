export interface SignupData {
    email: string
    name: string
    cnpj: string
    phone: string
    password: string
    street: string
    number: string
    neighborhood: string
    pix_key: string
    pix_key_type: string
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
