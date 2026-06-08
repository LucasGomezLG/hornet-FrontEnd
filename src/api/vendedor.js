import api from '../hooks/useApi'

// Listings del vendedor
export function getMisProductos({ page = 0, size = 24 } = {}) {
  return api.get('/vendedor/productos', { params: { page, size } })
}
export function crearListing(data) {
  return api.post('/vendedor/productos', data)
}
export function actualizarListing(id, data) {
  return api.put(`/vendedor/productos/${id}`, data)
}
export function toggleListing(id) {
  return api.patch(`/vendedor/productos/${id}/toggle`)
}
export function eliminarListing(id) {
  return api.delete(`/vendedor/productos/${id}`)
}

// Firma Cloudinary para subir imágenes
export function getFirmaImagen() {
  return api.post('/vendedor/imagenes/firma')
}
