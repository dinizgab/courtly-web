export type Court = {
    id: string
    companyId: string
    name: string
    description: string
    isActive: boolean
    sportType: string
    hourlyPrice: number
    reservationsToday: number
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
    reservations_today: number
    opening_time: string
    closing_time: string
    capacity: number
    photos: string[]
}
