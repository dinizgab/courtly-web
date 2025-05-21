/**
 * Decodes a JWT token without verification
 * @param token JWT token string
 * @returns Decoded token payload or null if invalid
 */
export function decodeToken(token: string): any {
    try {
        const parts = token.split(".")
        if (parts.length !== 3) return null

        const payload = parts[1]
        const decoded = atob(payload
            .replace(/-/g, "+")
            .replace(/_/g, "/")
            .padEnd(Math.ceil(payload.length / 4) * 4, "="))

        console.log("Decoded payload:", JSON.parse(decoded))

        return JSON.parse(decoded)
    } catch (error) {
        console.error("Error decoding token:", error)
        return null
    }
}

/**
 * Checks if a token is expired
 * @param token JWT token string
 * @returns boolean indicating if token is expired
 */
export function isTokenExpired(token: string): boolean {
    const payload = decodeToken(token)
    if (!payload || !payload.exp) return true

    // exp is in seconds, Date.now() is in milliseconds
    const currentTime = Math.floor(Date.now() / 1000)
    return payload.exp < currentTime
}

/**
 * Extracts company ID from token
 * @param token JWT token string
 * @returns company_id from token or null
 */
export function getCompanyIdFromToken(token: string): string | null {
    const payload = decodeToken(token)
    return payload?.company_id || null
}

/**
 * Calculates time until token expiration in milliseconds
 * @param token JWT token string
 * @returns Time in milliseconds until expiration or 0 if expired/invalid
 */
export function getTimeUntilExpiration(token: string): number {
    const payload = decodeToken(token)
    if (!payload || !payload.exp) return 0

    const expirationTime = payload.exp * 1000 // Convert to milliseconds
    const currentTime = Date.now()
    const timeRemaining = expirationTime - currentTime

    return timeRemaining > 0 ? timeRemaining : 0
}

