import api from '../hooks/useApi'

// Público — no requiere auth
export const getCategorias = () => api.get('/categorias')

// Admin CRUD
export const getCategoriasAdmin       = ()          => api.get('/admin/categorias')
export const crearCategoria           = (data)      => api.post('/admin/categorias', data)
export const actualizarCategoria      = (id, data)  => api.put(`/admin/categorias/${id}`, data)
export const eliminarCategoria        = (id)        => api.delete(`/admin/categorias/${id}`)

export const crearSubcategoria        = (catId, data) => api.post(`/admin/categorias/${catId}/subcategorias`, data)
export const actualizarSubcategoria   = (id, data)   => api.put(`/admin/categorias/subcategorias/${id}`, data)
export const eliminarSubcategoria     = (id)          => api.delete(`/admin/categorias/subcategorias/${id}`)
