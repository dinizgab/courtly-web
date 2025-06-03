import { Booking, BookingApi } from "@/types/booking"
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

export function mapBookingApi(api: BookingApi): Booking {
    return {
        id: api.id,
        startTime: api.start_time,
        endTime: api.end_time,
        totalPrice: api.total_price,
        court: mapCourtApi(api.court || {} as CourtApi),
        courtId: api.court_id,
        guestName: api.guest_name,
        guestEmail: api.guest_email,
        guestPhone: api.guest_phone,
        status: api.status,
        verificationCode: api.verification_code,
    }
}
