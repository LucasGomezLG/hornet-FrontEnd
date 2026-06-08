import api from '../hooks/useApi'

export function getPerfil() {
  return api.get('/perfil')
}

export function actualizarPerfil(data) {
  return api.patch('/perfil', data)
}
