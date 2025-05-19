export type Court = {
    id: string
    companyId: string
    name: string
    isActive: boolean 
    sportType: string
    hourlyPrice: number
    reservationsToday: number
}

export type CourtApi = {
    id: string
    company_id: string
    name: string
    is_active: boolean
    sport_type: string
    hourly_price: number
    reservations_today: number
}