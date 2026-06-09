import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { getProductos } from '../../api/tienda'
import { useCategorias } from '../../context/CategoriaContext'
import ProductCard from '../../components/tienda/ProductCard'
import { ProductGridSkeleton } from '../../components/ui/Skeleton'

function FilterChips({ opciones, activo, onSelect, size = 'md' }) {
  const base = size === 'sm'
    ? 'shrink-0 px-3 py-1.5 text-xs border transition-colors'
    : 'shrink-0 px-4 py-2 text-sm border transition-colors'

  return (
    <div className="flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:h-0">
      {opciones.map(({ id, label }) => (
        <button
          key={id}
          onClick={() => onSelect(id)}
          className={`${base} ${
            activo === id
              ? 'bg-hornet-gold text-hornet-dark border-hornet-gold font-black'
              : 'bg-white text-hornet-dark border-neutral-200 hover:border-hornet-dark'
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  )
}

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
  const [searchActivo, setSearchActivo] = useState(searchParams.get('q') || '')

  const categoriaActiva = categorias.find(c => c.id === categoriaParam)
  const subcategorias   = categoriaActiva?.subcategorias?.filter(s => s.activo) ?? []

  useEffect(() => {
    setLoading(true)
    getProductos({
      categoria:      categoriaParam    || undefined,
      subcategoriaId: subcategoriaParam || undefined,
      search:         searchActivo      || undefined,
      page,
      size: 24,
    })
      .then(r => {
        setProductos(r.data.content ?? r.data)
        setTotal(r.data.page?.totalElements ?? r.data.totalElements ?? r.data.length ?? 0)
      })
      .finally(() => setLoading(false))
  }, [categoriaParam, subcategoriaParam, searchActivo, page])

  const setCategoria = (id) => {
    const p = new URLSearchParams()
    if (id) p.set('categoria', id)
    if (searchActivo) p.set('q', searchActivo)
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
    const q = search.trim()
    const p = new URLSearchParams()
    if (categoriaParam) p.set('categoria', categoriaParam)
    if (subcategoriaParam) p.set('subcategoria', subcategoriaParam)
    if (q) p.set('q', q)
    setSearchActivo(q)
    setPage(0)
    setSearchParams(p)
  }

  const limpiarFiltros = () => {
    setSearch('')
    setSearchActivo('')
    setPage(0)
    setSearchParams(new URLSearchParams())
  }

  const hayFiltros = categoriaParam || subcategoriaParam || searchActivo

  const opcionesCategorias = [
    { id: '', label: 'Todas las categorías' },
    ...categorias.map(c => ({ id: c.id, label: c.nombre })),
  ]
  const opcionesSubcategorias = [
    { id: '', label: `Todo en ${categoriaActiva?.nombre ?? ''}` },
    ...subcategorias.map(s => ({ id: s.id, label: s.nombre })),
  ]

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-hornet-dark">Tienda</h1>
        <p className="text-hornet-muted mt-1">Productos disponibles para entrega inmediata en Argentina.</p>
      </div>

      {/* Barra de búsqueda */}
      <form onSubmit={handleSearch} className="flex gap-2 mb-6 max-w-lg">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-hornet-muted pointer-events-none"
            fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
          <input
            type="text"
            placeholder="Buscar en la tienda..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full border border-neutral-300 pl-9 pr-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold"
          />
        </div>
        <button type="submit"
          className="bg-hornet-dark text-white px-5 py-2.5 text-sm font-black hover:opacity-90 transition-opacity whitespace-nowrap">
          Buscar
        </button>
      </form>

      {/* Filtros */}
      <div className="bg-hornet-surface border border-neutral-200 p-4 mb-6 space-y-4">

        {/* Categoría */}
        <div>
          <p className="text-xs font-black text-hornet-muted uppercase tracking-widest mb-2">
            Categoría
          </p>
          <FilterChips
            opciones={opcionesCategorias}
            activo={categoriaParam}
            onSelect={setCategoria}
          />
        </div>

        {/* Subcategoría (solo si la categoría activa las tiene) */}
        {subcategorias.length > 0 && (
          <div className="pt-3 border-t border-neutral-200">
            <p className="text-xs font-black text-hornet-muted uppercase tracking-widest mb-2">
              Subcategoría — {categoriaActiva?.nombre}
            </p>
            <FilterChips
              opciones={opcionesSubcategorias}
              activo={subcategoriaParam}
              onSelect={setSubcategoria}
              size="sm"
            />
          </div>
        )}
      </div>

      {/* Barra de resultados */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-hornet-muted">
          {loading ? 'Cargando…' : `${total} producto${total !== 1 ? 's' : ''}`}
          {categoriaActiva && !loading && (
            <span className="ml-1">en <strong className="text-hornet-dark">{categoriaActiva.nombre}</strong></span>
          )}
          {searchActivo && !loading && (
            <span className="ml-1">· búsqueda: <strong className="text-hornet-dark">"{searchActivo}"</strong></span>
          )}
        </p>
        {hayFiltros && !loading && (
          <button onClick={limpiarFiltros}
            className="text-xs text-hornet-muted underline hover:text-hornet-dark transition-colors">
            Limpiar filtros
          </button>
        )}
      </div>

      {/* Grid */}
      {loading ? (
        <ProductGridSkeleton count={24} />
      ) : productos.length === 0 ? (
        <div className="text-center py-16 text-hornet-muted border border-dashed border-neutral-300">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-medium text-hornet-dark">No hay productos en esta categoría aún.</p>
          {hayFiltros && (
            <button onClick={limpiarFiltros}
              className="mt-3 text-sm underline text-hornet-muted hover:text-hornet-dark">
              Ver todos los productos
            </button>
          )}
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
                ← Anterior
              </button>
              <span className="px-4 py-2 text-sm text-hornet-muted">Página {page + 1}</span>
              <button disabled={(page + 1) * 24 >= total} onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border border-neutral-300 text-sm disabled:opacity-40 hover:border-hornet-dark transition-colors">
                Siguiente →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
