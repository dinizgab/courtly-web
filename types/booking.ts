import { Court, CourtApi } from "@/types/court"

export type Booking = {
    id: string
    courtId: string
    startTime: string
    endTime: string
    status: string
    guestName: string
    guestEmail: string
    guestPhone: string
    verificationCode: string
    totalPrice: number 
    court?: Partial<Court>
}

export type BookingApi = {
    id: string
    court_id: string
    start_time: string
    end_time: string
    status: string
    guest_name: string
    guest_email: string
    guest_phone: string
    verification_code: string
    total_price: number 
    court?: CourtApi
}
