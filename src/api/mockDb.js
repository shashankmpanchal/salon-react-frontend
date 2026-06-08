import { STORAGE_KEYS } from '../utils/constants'

const defaultUsers = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@luxecuts.com',
    password: 'admin123',
    role: 'admin',
  },
  {
    id: 'user-1',
    name: 'Jane Doe',
    email: 'jane@example.com',
    password: 'password123',
    role: 'customer',
  },
]

function read(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function write(key, data) {
  localStorage.setItem(key, JSON.stringify(data))
}

export function initMockDb() {
  if (!read(STORAGE_KEYS.users)) {
    write(STORAGE_KEYS.users, defaultUsers)
  }
  if (!read(STORAGE_KEYS.bookings)) {
    write(STORAGE_KEYS.bookings, [])
  }
}

export function getUsers() {
  return read(STORAGE_KEYS.users, [])
}

export function saveUsers(users) {
  write(STORAGE_KEYS.users, users)
}

export function getBookings() {
  return read(STORAGE_KEYS.bookings, [])
}

export function saveBookings(bookings) {
  write(STORAGE_KEYS.bookings, bookings)
}
