import { useAuth } from "@/contexts/auth-context"
import AuthService from "@/lib/auth-service"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export function withAuth<P extends Record<string, unknown>>(WrappedComponent: React.ComponentType<P>) {
    return function ProtectedComponent(props: P) {
        const router = useRouter()
        const isAuthenticated = AuthService.isAuthenticated();
        useEffect(() => {
            if (isAuthenticated == false) {
                router.push("/")
            }
        }, [isAuthenticated])

        return isAuthenticated ? <WrappedComponent {...props} /> : null
    }
}
