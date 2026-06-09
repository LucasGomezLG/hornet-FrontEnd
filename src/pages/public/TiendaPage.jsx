import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { getProductos } from '../../api/tienda'
import { useCategorias } from '../../context/CategoriaContext'
import ProductCard from '../../components/tienda/ProductCard'
import { ProductGridSkeleton } from '../../components/ui/Skeleton'

export default function TiendaPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const categoriaParam    = searchParams.get('categoria') || ''
  const subcategoriaParam = searchParams.get('subcategoria') || ''

  const { categorias } = useCategorias()

  const [productos, setProductos] = useState([])
  const [total, setTotal]         = useState(0)
  const [page, setPage]           = useState(0)
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState(searchParams.get('q') || '')

  const categoriaActiva = categorias.find(c => c.id === categoriaParam)
  const subcategorias   = categoriaActiva?.subcategorias?.filter(s => s.activo) ?? []

  useEffect(() => {
    setLoading(true)
    getProductos({
      categoria:      categoriaParam    || undefined,
      subcategoriaId: subcategoriaParam || undefined,
      page,
      size: 24,
    })
      .then(r => {
        setProductos(r.data.content ?? r.data)
        setTotal(r.data.page?.totalElements ?? r.data.totalElements ?? r.data.length ?? 0)
      })
      .finally(() => setLoading(false))
  }, [categoriaParam, subcategoriaParam, page])

  const setCategoria = (id) => {
    const p = new URLSearchParams()
    if (id) p.set('categoria', id)
    setPage(0)
    setSearchParams(p)
  }

  const setSubcategoria = (id) => {
    const p = new URLSearchParams(searchParams)
    if (id) p.set('subcategoria', id); else p.delete('subcategoria')
    setPage(0)
    setSearchParams(p)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    const p = new URLSearchParams()
    if (search.trim()) p.set('q', search.trim())
    setPage(0)
    setSearchParams(p)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-hornet-dark">Tienda</h1>
        <p className="text-hornet-muted mt-1">Productos disponibles para entrega inmediata en Argentina.</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-md">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold"
        />
        <button type="submit"
          className="bg-hornet-dark text-white px-4 py-2 text-sm font-black hover:opacity-90 transition-opacity">
          Buscar
        </button>
      </form>

      {/* Filtro de categorías */}
      <div className="flex flex-wrap gap-2 mb-2">
        <button onClick={() => setCategoria('')}
          className={`px-3 py-1.5 text-xs border transition-colors ${!categoriaParam ? 'bg-hornet-dark text-white border-hornet-dark' : 'bg-white text-hornet-dark border-neutral-300 hover:border-hornet-dark'}`}>
          Todas
        </button>
        {categorias.map(c => (
          <button key={c.id} onClick={() => setCategoria(c.id)}
            className={`px-3 py-1.5 text-xs border transition-colors ${categoriaParam === c.id ? 'bg-hornet-dark text-white border-hornet-dark' : 'bg-white text-hornet-dark border-neutral-300 hover:border-hornet-dark'}`}>
            {c.nombre}
          </button>
        ))}
      </div>

      {/* Filtro de subcategorías (aparece si la categoría activa tiene subcategorías) */}
      {subcategorias.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4 pl-2 border-l-2 border-hornet-gold">
          <button onClick={() => setSubcategoria('')}
            className={`px-2.5 py-1 text-xs border transition-colors ${!subcategoriaParam ? 'bg-hornet-gold text-hornet-dark border-hornet-gold' : 'bg-white text-hornet-dark border-neutral-300 hover:border-hornet-gold'}`}>
            Todas
          </button>
          {subcategorias.map(s => (
            <button key={s.id} onClick={() => setSubcategoria(s.id)}
              className={`px-2.5 py-1 text-xs border transition-colors ${subcategoriaParam === s.id ? 'bg-hornet-gold text-hornet-dark border-hornet-gold' : 'bg-white text-hornet-dark border-neutral-300 hover:border-hornet-gold'}`}>
              {s.nombre}
            </button>
          ))}
        </div>
      )}

      {!subcategorias.length && <div className="mb-4" />}

      {loading ? (
        <ProductGridSkeleton count={24} />
      ) : productos.length === 0 ? (
        <div className="text-center py-16 text-hornet-muted">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-medium">No hay productos en esta categoría aún.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {productos.map(p => <ProductCard key={p.id} producto={p} />)}
          </div>
          {total > 24 && (
            <div className="flex justify-center gap-3 mt-8">
              <button disabled={page === 0} onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border border-neutral-300 text-sm disabled:opacity-40 hover:border-hornet-dark transition-colors">
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-hornet-muted">Página {page + 1}</span>
              <button disabled={(page + 1) * 24 >= total} onClick={() => setPage(p => p + 1)}
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
