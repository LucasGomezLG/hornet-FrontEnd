import { createContext, useState, useEffect, useCallback } from 'react'

export const AuthContext = createContext(null)

const API = import.meta.env.VITE_API_BASE_URL || ''

// Module-level refs — el interceptor de axios los necesita fuera del ciclo de React
let _accessToken = null
let _refreshFn = null
let _logoutFn = null

export const getAccessToken = () => _accessToken
export const triggerRefresh = () => _refreshFn?.()
export const triggerLogout = () => _logoutFn?.()

function decodeJWT(token) {
  try {
    const b64 = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const json = decodeURIComponent(
      atob(b64).split('').map(c => '%' + c.charCodeAt(0).toString(16).padStart(2, '0')).join('')
    )
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const applyToken = useCallback((token) => {
    _accessToken = token
    if (!token) {
      setUser(null)
      return
    }
    const payload = decodeJWT(token)
    if (payload) {
      // Poblar con lo que hay en el JWT; nombre se carga aparte via /api/perfil
      setUser({ id: payload.sub, email: payload.email, tipo: payload.tipo, nombre: null })
      // Fetch del nombre en background — no bloquea el render
      fetch(`${API}/api/perfil`, {
        credentials: 'include',
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(r => r.ok ? r.json() : null)
        .then(p => { if (p) setUser(u => ({ ...u, nombre: p.nombre })) })
        .catch(() => {})
    }
  }, [])

  const refreshSession = useCallback(async () => {
    const res = await fetch(`${API}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
    if (!res.ok) {
      applyToken(null)
      throw new Error('No session')
    }
    const data = await res.json()
    applyToken(data.accessToken)
  }, [applyToken])

  const loginWithGoogle = useCallback(async (idToken) => {
    const res = await fetch(`${API}/api/auth/google`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    })
    if (!res.ok) throw new Error('Login fallido')
    const data = await res.json()
    localStorage.setItem('hi_session', '1')
    applyToken(data.accessToken)
    return decodeJWT(data.accessToken)
  }, [applyToken])

  const logout = useCallback(async () => {
    try {
      await fetch(`${API}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: _accessToken ? { Authorization: `Bearer ${_accessToken}` } : {},
      })
    } catch {
      // best-effort
    }
    localStorage.removeItem('hi_session')
    applyToken(null)
  }, [applyToken])

  // Sincronizar refs de módulo cuando los callbacks se recrean
  useEffect(() => { _refreshFn = refreshSession }, [refreshSession])
  useEffect(() => { _logoutFn = logout }, [logout])

  // Restaurar sesión desde cookie de refresh al montar — solo si hay sesión previa
  useEffect(() => {
    if (!localStorage.getItem('hi_session')) {
      setLoading(false)
      return
    }
    refreshSession()
      .catch(() => localStorage.removeItem('hi_session'))
      .finally(() => setLoading(false))
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <AuthContext.Provider value={{ user, loading, loginWithGoogle, logout, refreshSession }}>
      {children}
    </AuthContext.Provider>
  )
}
