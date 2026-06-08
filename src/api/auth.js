import api from '../hooks/useApi'

export function reclamarCotizacion(id) {
  return api.post(`/cotizaciones/${id}/reclamar`)
}
