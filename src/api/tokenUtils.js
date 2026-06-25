export function isTokenExpired(token, bufferSeconds = 30) {
  if (!token) return true

  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    if (!payload.exp) return false
    return Date.now() >= payload.exp * 1000 - bufferSeconds * 1000
  } catch {
    return false
  }
}
