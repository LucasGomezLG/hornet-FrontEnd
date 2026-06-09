import api from '../hooks/useApi'

// ── Usuario ───────────────────────────────────────────────────────────────────

export const crearSolicitud    = (data)                  => api.post('/solicitudes', data)
export const getSolicitudes    = (params)                => api.get('/solicitudes', { params })
export const getSolicitud      = (id)                    => api.get(`/solicitudes/${id}`)
export const cancelarSolicitud = (id)                    => api.delete(`/solicitudes/${id}`)

export const agregarItem       = (solicitudId, data)     => api.post(`/solicitudes/${solicitudId}/items`, data)
export const editarItem        = (solicitudId, itemId, data) => api.put(`/solicitudes/${solicitudId}/items/${itemId}`, data)
export const eliminarItem      = (solicitudId, itemId)   => api.delete(`/solicitudes/${solicitudId}/items/${itemId}`)

export const confirmarItem     = (solicitudId, itemId, data) =>
  api.post(`/solicitudes/${solicitudId}/items/${itemId}/confirmar`, data)

// ── Admin ─────────────────────────────────────────────────────────────────────

export const getSolicitudesAdmin = (params)  => api.get('/admin/solicitudes', { params })
export const getSolicitudAdmin   = (id)      => api.get(`/admin/solicitudes/${id}`)
export const cotizarSolicitud    = (id, data) => api.post(`/admin/solicitudes/${id}/cotizar`, data)
export const getSugerencia       = (solicitudId, itemId, params) =>
  api.get(`/admin/solicitudes/${solicitudId}/items/${itemId}/sugerencia`, { params })

// ── Admin pedidos seña/saldo ──────────────────────────────────────────────────

export const confirmarSena      = (pedidoId, data) => api.post(`/admin/pedidos/${pedidoId}/confirmar-sena`, data)
export const notificarLlegada   = (pedidoId)       => api.post(`/admin/pedidos/${pedidoId}/notificar-llegada`)
export const confirmarSaldo     = (pedidoId, data) => api.post(`/admin/pedidos/${pedidoId}/confirmar-saldo`, data)
