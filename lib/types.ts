export type Court = {
    id: string
    companyId: string
    name: string
    description: string
    isActive: boolean
    sportType: string
    hourlyPrice: number
    bookingsToday: number
    openingTime: string
    closingTime: string
    capacity: number
    photos: string[]
}

export type CourtApi = {
    id: string
    company_id: string
    name: string
    description: string
    is_active: boolean
    sport_type: string
    hourly_price: number
    bookings_today: number
    opening_time: string
    closing_time: string
    capacity: number
    photos: string[]
}

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
}

