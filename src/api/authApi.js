import api from './axios'
import { STORAGE_KEYS } from '../utils/constants'

function normalizeUser(user) {
  if (!user) return null
  return {
    ...user,
    id: user.id || user._id,
  }
}

function storeSession({ user, accessToken, refreshToken }) {
  const normalizedUser = normalizeUser(user)
  localStorage.setItem(STORAGE_KEYS.token, accessToken)
  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken)
  }
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(normalizedUser))
  return { token: accessToken, refreshToken, user: normalizedUser }
}

export async function loginRequest({ email, password }) {
  const response = await api.post('/auth/login', { email, password })
  return storeSession(response.data.data)
}

export async function registerRequest({ name, phone, email, password }) {
  const response = await api.post('/auth/register', { name, phone, email, password })
  return storeSession(response.data.data)
}

export async function logoutRequest() {
  try {
    await api.post('/auth/logout')
  } catch {
    // Clear local session even if the server token is already expired.
  } finally {
    localStorage.removeItem(STORAGE_KEYS.token)
    localStorage.removeItem(STORAGE_KEYS.refreshToken)
    localStorage.removeItem(STORAGE_KEYS.user)
  }
}

export async function refreshTokenRequest() {
  const refreshToken = localStorage.getItem(STORAGE_KEYS.refreshToken)
  const response = await api.post('/auth/refresh-token', { refreshToken })
  return storeSession(response.data.data)
}

export async function profileRequest() {
  const response = await api.get('/auth/profile')
  const user = normalizeUser(response.data.data.user)
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
  return user
}

export function clearStoredSession() {
  localStorage.removeItem(STORAGE_KEYS.token)
  localStorage.removeItem(STORAGE_KEYS.refreshToken)
  localStorage.removeItem(STORAGE_KEYS.user)
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.user)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function getStoredToken() {
  return localStorage.getItem(STORAGE_KEYS.token)
}

export const authApi = {
  login: (data) => loginRequest(data),
  register: (data) => registerRequest(data),
  logout: () => logoutRequest(),
  refreshToken: () => refreshTokenRequest(),
  profile: () => profileRequest(),
}
