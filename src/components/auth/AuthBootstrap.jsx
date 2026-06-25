import { useEffect } from 'react'
import { getStoredRefreshToken, getStoredToken } from '../../api/session'
import { ensureValidAccessToken } from '../../api/tokenRefresh'
import { isTokenExpired } from '../../api/tokenUtils'

export default function AuthBootstrap({ children }) {
  useEffect(() => {
    const refreshToken = getStoredRefreshToken()
    const accessToken = getStoredToken()

    if (!refreshToken || (accessToken && !isTokenExpired(accessToken))) {
      return
    }

    ensureValidAccessToken().catch(() => {
      // axios interceptors will retry refresh on the next API call
    })
  }, [])

  return children
}
