import api from './axios'
import { SEATS } from '../utils/constants'
import { formatDate } from '../utils/dates'

function buildSeats(totalSeats = SEATS.length) {
  return Array.from({ length: totalSeats }, (_, index) => {
    const fallbackSeat = SEATS[index]
    return fallbackSeat || {
      id: index + 1,
      name: `Chair ${index + 1}`,
      stylist: `Stylist ${index + 1}`,
    }
  })
}

function dateOnly(date) {
  return date ? String(date).slice(0, 10) : ''
}

function getWeeklyStartDate(weekDates) {
  const today = formatDate(new Date())
  return weekDates.includes(today) ? today : weekDates[0]
}

function mapSlotAvailability(slotRows = []) {
  const totalSeats = slotRows[0]?.totalSeats || SEATS.length
  const seats = buildSeats(totalSeats)
  const slots = slotRows.map((slot) => slot.slotTime)
  const availability = {}

  for (const seat of seats) {
    availability[seat.id] = {}
  }

  for (const slot of slotRows) {
    const perSeat = slot.seats?.length
      ? new Map(slot.seats.map((s) => [Number(s.seatNumber), s.isAvailable]))
      : null
    const slotOpen = slot.availabilityStatus === 'available'

    for (const seat of seats) {
      availability[seat.id][slot.slotTime] = perSeat
        ? Boolean(perSeat.get(seat.id))
        : slotOpen && seat.id <= slot.availableSeats
    }
  }

  return { availability, seats, slots }
}

function mapBooking(booking, fallback = {}) {
  const user = typeof booking.userId === 'object' ? booking.userId : null

  return {
    ...fallback,
    id: booking.id || booking._id,
    userId:
      typeof booking.userId === 'string'
        ? booking.userId
        : user?._id || fallback.userId,
    userName: booking.userName || user?.name || fallback.userName,
    date: booking.date || dateOnly(booking.bookingDate),
    slot: booking.slot || booking.slotTime,
    seatId: booking?.seat?.seatId,
    seatName: booking?.seat?.seatName,
    serviceId: booking?.service?.id,
    serviceLabel: booking?.service?.name,
    price: booking?.service?.pricing,
    duration: booking?.service?.duration,
    status: booking.status,
    payment: booking.payment,
    createdAt: booking.createdAt,
    updatedAt: booking.updatedAt,
  };
}

export async function fetchAvailability(date) {
  const response = await api.get('/bookings/slots', { params: { date } })
  const { availability, seats, slots } = mapSlotAvailability(response.data.data.slots)
  return { date: response.data.data.date, availability, seats, slots }
}

export async function fetchWeekAvailability(weekDates) {
  const response = await api.get('/bookings/weekly-slots', {
    params: { startDate: getWeeklyStartDate(weekDates) },
  })
  const weekAvailability = {}
  let weekSeats = []
  let weekSlots = []

  for (const day of response.data.data.slots) {
    const { availability, seats, slots } = mapSlotAvailability(day.slots)
    weekAvailability[day.date] = availability
    if (!weekSeats.length) weekSeats = seats
    if (!weekSlots.length) weekSlots = slots
  }

  return { availability: weekAvailability, seats: weekSeats, slots: weekSlots }
}

export async function createBooking(payload) {
  const response = await api.post('/bookings/create', {
    bookingDate: payload.date,
    slotTime: payload.slot,
    seatNumber: payload.seatId,
    serviceId: payload.serviceId,
  });
  return mapBooking(response.data.data.booking, payload)
}

export async function fetchUserBookings() {
  const response = await api.get('/bookings/my-bookings', {
    params: { limit: 100 },
  })
  return response.data.data.bookings.map((booking) => mapBooking(booking))
}

export async function fetchAllBookings(params = {}) {
  const { page = 1, limit = 10, search = '', orderBy = 'desc' } = params
  const response = await api.get('/admin/bookings', {
    params: {
      page,
      limit,
      orderBy,
      ...(search ? { search } : {}),
    },
  })
  const { bookings = [], pagination } = response.data.data

  return {
    bookings: bookings.map((booking) => mapBooking(booking)),
    pagination,
  }
}

export async function cancelBooking(bookingId, cancellationReason) {
  const response = await api.put(`/bookings/${bookingId}/cancel`, {
    cancellationReason,
  })
  return mapBooking(response.data.data.booking)
}

export async function updateBookingStatus(bookingId, status) {
  const response = await api.put(`/admin/booking-status/${bookingId}`, {
    status,
  });
  return mapBooking(response.data.data.booking)
}

export const bookingApi = {
  getAvailability: fetchAvailability,
  getWeekAvailability: fetchWeekAvailability,
  create: createBooking,
  getByUser: fetchUserBookings,
  getAll: fetchAllBookings,
  cancel: cancelBooking,
  updateStatus: updateBookingStatus,
}
