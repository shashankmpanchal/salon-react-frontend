import { STORAGE_KEYS } from '../utils/constants'

export function normalizeUser(user) {
  if (!user) return null
  return {
    ...user,
    id: user.id || user._id,
  }
}

export function storeSession({ user, accessToken, refreshToken }) {
  const normalizedUser = normalizeUser(user)
  localStorage.setItem(STORAGE_KEYS.token, accessToken)
  if (refreshToken) {
    localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken)
  }
  localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(normalizedUser))
  return { token: accessToken, refreshToken, user: normalizedUser }
}

export function clearSession() {
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

export function getStoredRefreshToken() {
  return localStorage.getItem(STORAGE_KEYS.refreshToken)
}
