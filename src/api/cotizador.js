import api from '../hooks/useApi'

// POST público — no requiere auth
export function cotizar(data) {
  return api.post('/cotizar', data)
}

export function getCotizacion(id) {
  return api.get(`/cotizar/${id}`)
}

export function getCotizaciones({ page = 0, size = 10 } = {}) {
  return api.get('/cotizaciones', { params: { page, size } })
}

export function reclamarCotizacion(id) {
  return api.post(`/cotizaciones/${id}/reclamar`)
}
