import { Booking, BookingApi } from "@/types/booking"
import { CourtApi, CourtPhoto, CourtPhotoApi, CourtSchedule, CourtScheduleApi } from "@/types/court"

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
        photos: (api.photos ?? []).map(mapCourtPhotoApi),
        courtSchedule: (api.court_schedule ?? []).map(mapCourtScheduleApi),
    }
}

export function mapBookingApi(api: BookingApi): Booking {
    return {
        id: api.id,
        startTime: api.start_time,
        endTime: api.end_time,
        totalPrice: api.total_price,
        court: api.court ? mapCourtApi(api.court) : undefined,
        courtId: api.court_id,
        guestName: api.guest_name,
        guestEmail: api.guest_email,
        guestPhone: api.guest_phone,
        status: api.status,
        verificationCode: api.verification_code,
    }
}

export function mapChargeApi(api: ChargeApi): Charge {
    return {
        brCode: api.br_code,
        qrCodeImage: api.qr_code_image,
    }
}

export function mapCourtPhotoApi(api: CourtPhotoApi): CourtPhoto {
    return {
        id: api.id,
        courtId: api.court_id,
        path: api.path,
        position: api.position,
        isCover: api.is_cover,
    }
}

export function mapCourtScheduleApi(api: CourtScheduleApi): CourtSchedule {
    return {
        id: api.id,
        courtId: api.court_id,
        weekday: api.weekday,
        isOpen: api.is_open,
        openingTime: api.opening_time,
        closingTime: api.closing_time,
    }
}
