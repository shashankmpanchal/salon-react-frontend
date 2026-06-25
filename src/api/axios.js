import axios from 'axios'
import { API_BASE_URL, ROUTES, STORAGE_KEYS } from '../utils/constants'
import { clearSession } from './session'
import { ensureValidAccessToken } from './tokenRefresh'
import { clearSessionFromStore } from './authStoreSync'

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

function shouldSkipTokenRefresh(config) {
  const url = config?.url || ''
  return (
    config?._skipAuthRefresh ||
    url.includes('/auth/login') ||
    url.includes('/auth/register') ||
    url.includes('/auth/refresh-token')
  )
}

function redirectToLogin() {
  clearSession()
  clearSessionFromStore()

  if (window.location.pathname !== ROUTES.LOGIN) {
    window.location.replace(ROUTES.LOGIN)
  }
}

api.interceptors.request.use(async (config) => {
  if (shouldSkipTokenRefresh(config)) {
    return config
  }

  try {
    const token = await ensureValidAccessToken()
    config.headers.Authorization = `Bearer ${token}`
  } catch {
    const token = localStorage.getItem(STORAGE_KEYS.token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status !== 401 || !originalRequest) {
      return Promise.reject(error)
    }

    if (shouldSkipTokenRefresh(originalRequest)) {
      if ((originalRequest.url || '').includes('/auth/refresh-token')) {
        redirectToLogin()
      }
      return Promise.reject(error)
    }

    if (originalRequest._retry) {
      redirectToLogin()
      return Promise.reject(error)
    }

    originalRequest._retry = true

    try {
      const newToken = await ensureValidAccessToken({ force: true })
      originalRequest.headers.Authorization = `Bearer ${newToken}`
      return api(originalRequest)
    } catch (refreshError) {
      redirectToLogin()
      return Promise.reject(refreshError)
    }
  },
)

export default api
