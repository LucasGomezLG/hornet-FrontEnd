import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { getListings } from '../../api/marketplace'
import ListingCard from '../../components/marketplace/ListingCard'
import { useCategorias } from '../../context/CategoriaContext'
import { ProductGridSkeleton } from '../../components/ui/Skeleton'

export default function MarketplacePage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoriaParam = searchParams.get('categoria') || ''

  const { categorias } = useCategorias()
  const [listings, setListings] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    getListings({ categoria: categoriaParam || undefined, page, size: 24 })
      .then(r => {
        setListings(r.data.content ?? r.data)
        setTotal(r.data.page?.totalElements ?? r.data.totalElements ?? r.data.length ?? 0)
      })
      .finally(() => setLoading(false))
  }, [categoriaParam, page])

  const handleCategoria = (id) => {
    const p = new URLSearchParams()
    if (id) p.set('categoria', id)
    setPage(0)
    setSearchParams(p)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    setLoading(true)
    getListings({ search: search.trim() || undefined, categoria: categoriaParam || undefined, page: 0, size: 24 })
      .then(r => {
        setListings(r.data.content ?? r.data)
        setTotal(r.data.page?.totalElements ?? r.data.totalElements ?? r.data.length ?? 0)
        setPage(0)
      })
      .finally(() => setLoading(false))
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-hornet-dark">Marketplace</h1>
        <p className="text-hornet-muted mt-1">Comprá a vendedores independientes verificados.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
        <input
          type="text"
          placeholder="Buscar publicaciones..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold"
        />
        <button type="submit"
          className="bg-hornet-dark text-white px-4 py-2 text-sm font-black hover:opacity-90 transition-opacity">
          Buscar
        </button>
      </form>

      <div className="flex flex-wrap gap-2 mb-6">
        <button onClick={() => handleCategoria('')}
          className={`px-3 py-1.5 text-xs border transition-colors ${!categoriaParam ? 'bg-hornet-dark text-white border-hornet-dark' : 'bg-white text-hornet-dark border-neutral-300 hover:border-hornet-dark'}`}>
          Todos
        </button>
        {categorias.map(c => (
          <button key={c.id} onClick={() => handleCategoria(c.id)}
            className={`px-3 py-1.5 text-xs border transition-colors ${categoriaParam === c.id ? 'bg-hornet-dark text-white border-hornet-dark' : 'bg-white text-hornet-dark border-neutral-300 hover:border-hornet-dark'}`}>
            {c.nombre}
          </button>
        ))}
      </div>

      {loading ? (
        <ProductGridSkeleton count={24} />
      ) : listings.length === 0 ? (
        <div className="text-center py-16 text-hornet-muted">
          <p className="text-4xl mb-3">🛒</p>
          <p className="font-medium">No hay publicaciones en esta categoría aún.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {listings.map(l => <ListingCard key={l.id} listing={l} />)}
          </div>
          {total > 24 && (
            <div className="flex justify-center gap-3 mt-8">
              <button disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border border-neutral-300 text-sm disabled:opacity-40 hover:border-hornet-dark transition-colors">
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-hornet-muted">Página {page + 1}</span>
              <button disabled={(page + 1) * 24 >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border border-neutral-300 text-sm disabled:opacity-40 hover:border-hornet-dark transition-colors">
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
