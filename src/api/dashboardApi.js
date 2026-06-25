import api from './axios'

function mapDashboardBooking(booking) {
  return {
    id: booking.bookingId || booking.bookingId,
    userId: booking.userId || booking.userId,
    userName: booking.userName || booking.userName,
    userPhone: booking.userPhone || booking.userPhone,
    date: booking.date || String(booking.bookingDate || '').slice(0, 10),
    slot: booking.slot || booking.slotTime,
    seatId: booking.seatId ?? booking.seatNumber,
    serviceId: booking.serviceId,
    status: booking.status,
    price: booking.price,
  };
}

export async function fetchDashboard() {
  const response = await api.get('/admin/dashboard')
  const data = response.data.data

  return {
    settings: data.settings,
    totalUsers: data.totalUsers,
    totalBookings: data.totalBookings,
    todayBookings: data.todayBookings,
    todayPendingBookings: data.todayPendingBookings,
    todayConfirmedBookings: data.todayConfirmedBookings,
    todayCompletedBookings: data.todayCompletedBookings,
    todayCancelledBookings: data.todayCancelledBookings,
    todayAllBookings: data.todayAllBookings,
    todayRevenue: data.todayRevenue,
    totalRevenue: data.totalRevenue,
    totalSeats: data.totalSeats,
    totalServices: data.totalServices,
    bookingsByStatus: data.bookingsByStatus || {},
    upcomingBookings: (data.upcomingBookings || []).map(mapDashboardBooking),
  }
}

export const dashboardApi = {
  get: fetchDashboard,
}
