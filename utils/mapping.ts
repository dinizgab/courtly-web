import { CourtApi } from "@/types/court"

export function mapCourtApi(api: CourtApi) {
    return {
        id: api.id,
        companyId: api.company_id,
        name: api.name,
        sportType: api.sport_type,
        hourlyPrice: api.hourly_price,
        isActive: api.is_active,
        description: api.description,
        openingTime: api.opening_time,
        closingTime: api.closing_time,
        capacity: api.capacity,
        bookingsToday: 0,
        photos: api.photos ?? [],
    }
}
