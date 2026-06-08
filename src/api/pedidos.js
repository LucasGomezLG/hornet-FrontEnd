import api from '../hooks/useApi'

export function getPedidos({ page = 0, size = 10 } = {}) {
  return api.get('/pedidos', { params: { page, size } })
}

export function getPedido(id) {
  return api.get(`/pedidos/${id}`)
}

export function confirmarPedido({ cotizacionId, metodoPago }) {
  return api.post('/pedidos/confirmar', { cotizacionId, metodoPago })
}
