import api from '../hooks/useApi'

export function getListings({ categoria, search, page = 0, size = 24 } = {}) {
  return api.get('/marketplace', { params: { categoria, search, page, size } })
}

export function getListing(id) {
  return api.get(`/marketplace/${id}`)
}
