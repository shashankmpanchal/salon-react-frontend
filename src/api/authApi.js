import api from './axios'
import { STORAGE_KEYS } from '../utils/constants'
import {
  clearSession,
  getStoredToken,
  getStoredUser,
  normalizeUser,
  storeSession,
} from './session'
import { refreshAccessToken } from './tokenRefresh'

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
    clearSession()
  }
}

export async function refreshTokenRequest() {
  const session = await refreshAccessToken()
  return session
}

export async function profileRequest() {
  const response = await api.get('/auth/profile')
  const user = normalizeUser(response.data.data.user)
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(user))
  return user
}

export { clearSession as clearStoredSession, getStoredToken, getStoredUser }

export const authApi = {
  login: (data) => loginRequest(data),
  register: (data) => registerRequest(data),
  logout: () => logoutRequest(),
  refreshToken: () => refreshTokenRequest(),
  profile: () => profileRequest(),
}
