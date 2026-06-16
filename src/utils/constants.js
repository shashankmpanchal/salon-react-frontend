export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  BOOK: '/book-appointment',
  HISTORY: '/booking-history',
  ADMIN: '/admin',
  SEATS: '/seats',
  SERVICES: '/services',
};

export const SEATS = [
  { id: 1, name: 'Chair 1', stylist: 'Emma' },
  { id: 2, name: 'Chair 2', stylist: 'James' },
  { id: 3, name: 'Chair 3', stylist: 'Sofia' },
  { id: 4, name: 'Chair 4', stylist: 'Marcus' },
  { id: 5, name: 'Chair 5', stylist: 'Lily' },
  { id: 6, name: 'Chair 6', stylist: 'Noah' },
]

export const TIME_SLOTS = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
]

export const SERVICES = [
  { id: 'cut', label: 'Haircut', duration: 30, price: 200 },
  { id: 'color', label: 'Color', duration: 90, price: 300 },
  { id: 'style', label: 'Styling', duration: 45, price: 450 },
  { id: 'treatment', label: 'Treatment', duration: 60, price: 600 },
]

export const STORAGE_KEYS = {
  token: 'salon_auth_token',
  refreshToken: 'salon_refresh_token',
  user: 'salon_auth_user',
  bookings: 'salon_bookings',
  users: 'salon_users',
}

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'
