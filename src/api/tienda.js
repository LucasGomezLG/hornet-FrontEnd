import api from '../hooks/useApi'

export function getProductos({ categoria, subcategoriaId, destacado, page = 0, size = 24 } = {}) {
  return api.get('/tienda', { params: { categoria, subcategoriaId, destacado, page, size } })
}

export function getProducto(id) {
  return api.get(`/tienda/${id}`)
}
