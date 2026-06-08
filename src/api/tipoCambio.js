import api from '../hooks/useApi'

export function getTipoCambio() {
  return api.get('/tipo-cambio')
}
