let syncSessionHandler = null

export function registerSessionSync(handler) {
  syncSessionHandler = handler
}

export function syncSessionToStore(session) {
  syncSessionHandler?.(session)
}

export function clearSessionFromStore() {
  syncSessionHandler?.({ token: null, user: null })
}
