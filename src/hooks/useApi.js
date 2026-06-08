import axios from 'axios'
import { getAccessToken, triggerRefresh, triggerLogout } from '../context/AuthContext'

// Instancia única — se configura una vez, se reutiliza en toda la app
const api = axios.create({
  baseURL: (import.meta.env.VITE_API_BASE_URL || '') + '/api',
  withCredentials: true,
})

// Agrega el Bearer token a cada request
api.interceptors.request.use(config => {
  const token = getAccessToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Si llega un 401, intenta renovar el token y reintentar el request original
api.interceptors.response.use(
  res => res,
  async error => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      try {
        await triggerRefresh()
        const newToken = getAccessToken()
        if (newToken) original.headers.Authorization = `Bearer ${newToken}`
        return api(original)
      } catch {
        triggerLogout()
      }
    }
    return Promise.reject(error)
  }
)

export default api
