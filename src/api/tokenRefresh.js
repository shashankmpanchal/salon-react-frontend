import axios from 'axios'
import { API_BASE_URL } from '../utils/constants'
import { syncSessionToStore } from './authStoreSync'
import { getStoredRefreshToken, getStoredToken, storeSession } from './session'
import { isTokenExpired } from './tokenUtils'

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
})

let isRefreshing = false
let failedQueue = []

function processQueue(error, token = null) {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else resolve(token)
  })
  failedQueue = []
}

async function performRefresh() {
  const refreshToken = getStoredRefreshToken()
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }

  const response = await refreshClient.post('/auth/refresh-token', { refreshToken })
  return storeSession(response.data.data)
}

export async function refreshAccessToken() {
  const session = await performRefresh()
  syncSessionToStore(session)
  return session
}

export async function ensureValidAccessToken({ force = false } = {}) {
  const currentToken = getStoredToken()

  if (!force && currentToken && !isTokenExpired(currentToken)) {
    return currentToken
  }

  if (!getStoredRefreshToken()) {
    throw new Error('No refresh token available')
  }

  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject })
    })
  }

  isRefreshing = true

  try {
    const session = await performRefresh()
    syncSessionToStore(session)
    processQueue(null, session.token)
    return session.token
  } catch (error) {
    processQueue(error, null)
    throw error
  } finally {
    isRefreshing = false
  }
}
