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
    courtSchedule?: CourtSchedule[]
}

export type CourtPhoto = {
    id : string
    courtId: string
    path: string
    position: number
    isCover: boolean
}

export type CourtSchedule = {
    id: string
    courtId: string
    weekday: number
    isOpen: boolean
    openingTime: string
    closingTime: string
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
    court_schedule: CourtScheduleApi[]
}

export type CourtPhotoApi = {
    id: string
    court_id: string
    path: string
    position: number
    is_cover: boolean
}

export type CourtScheduleApi = {
    id: string
    court_id: string
    weekday: number
    is_open: boolean
    opening_time: string
    closing_time: string
}
