import api from '../hooks/useApi'

// Stats
export function getStats() {
  return api.get('/admin/stats')
}

// Cotizaciones
export function getCotizacionesAdmin({ estado, page = 0, size = 50 } = {}) {
  return api.get('/admin/cotizaciones', { params: { estado, page, size } })
}
export function aprobarCotizacion(id) {
  return api.post(`/admin/cotizaciones/${id}/aprobar`)
}
export function rechazarCotizacion(id, motivo) {
  return api.post(`/admin/cotizaciones/${id}/rechazar`, { motivo })
}

// Pedidos
export function getPedidosAdmin({ estado, metodoPago, page = 0, size = 200 } = {}) {
  return api.get('/admin/pedidos', { params: { estado, metodoPago, page, size } })
}
export function actualizarPedido(id, { estado, trackingCode }) {
  return api.patch(`/admin/pedidos/${id}`, { estado, trackingCode })
}
export function confirmarPago(id, referencia) {
  return api.post(`/admin/pedidos/${id}/confirmar-pago`, { referencia })
}

// Vendedores
export function getVendedores() {
  return api.get('/admin/vendedores')
}

// Tienda
export function getTiendaAdmin({ page = 0, size = 50 } = {}) {
  return api.get('/admin/tienda', { params: { page, size } })
}
export function crearTiendaProducto(data) {
  return api.post('/admin/tienda', data)
}
export function actualizarTiendaProducto(id, data) {
  return api.put(`/admin/tienda/${id}`, data)
}
export function toggleTiendaProducto(id) {
  return api.patch(`/admin/tienda/${id}/toggle`)
}
export function eliminarTiendaProducto(id) {
  return api.delete(`/admin/tienda/${id}`)
}

// Imágenes (firma Cloudinary para tienda)
export function getFirmaImagenAdmin(productoId) {
  return api.post('/admin/imagenes/firma', null, { params: productoId ? { productoId } : {} })
}
