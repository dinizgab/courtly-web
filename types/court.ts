import { Company } from "./company"

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
    photos?: CourtPhoto[]
    company?: Partial<Company>
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
    photos: CourtPhotoApi[]
}

export type CourtPhoto = {
    id : string
    courtId: string
    path: string
    position: number
    isCover: boolean
}

export type CourtPhotoApi = {
    id: string
    court_id: string
    path: string
    position: number
    is_cover: boolean
}
