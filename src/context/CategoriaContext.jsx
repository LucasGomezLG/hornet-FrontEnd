import { createContext, useContext, useEffect, useState } from 'react'
import { getCategorias } from '../api/categorias'

const CategoriaContext = createContext({ categorias: [], loading: true })

export function CategoriaProvider({ children }) {
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getCategorias()
      .then(r => setCategorias(r.data ?? []))
      .catch(() => setCategorias([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <CategoriaContext.Provider value={{ categorias, loading }}>
      {children}
    </CategoriaContext.Provider>
  )
}

export function useCategorias() {
  return useContext(CategoriaContext)
}
