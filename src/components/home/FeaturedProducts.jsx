import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getProductos } from '../../api/tienda'
import ProductCard from '../tienda/ProductCard'
import { ProductGridSkeleton } from '../ui/Skeleton'
import FadeIn from '../ui/FadeIn'

export default function FeaturedProducts() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProductos({ page: 0, size: 8 })
      .then(r => {
        const list = r.data.content ?? r.data
        setProductos(Array.isArray(list) ? list.slice(0, 8) : [])
      })
      .catch(() => setProductos([]))
      .finally(() => setLoading(false))
  }, [])

  if (!loading && productos.length === 0) return null

  return (
    <section className="max-w-6xl mx-auto px-4 py-16">
      <FadeIn className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-hornet-dark">Disponible ahora en Argentina</h2>
          <p className="text-hornet-muted text-sm mt-1">Stock listo para entrega inmediata.</p>
        </div>
        <Link
          to="/tienda"
          className="hidden sm:block text-sm font-black text-hornet-dark underline underline-offset-2 shrink-0 ml-6"
        >
          Ver toda la tienda →
        </Link>
      </FadeIn>

      {loading ? (
        <ProductGridSkeleton count={8} />
      ) : (
        <FadeIn delay={100}>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {productos.map(p => <ProductCard key={p.id} producto={p} />)}
          </div>
        </FadeIn>
      )}

      <div className="mt-6 text-center sm:hidden">
        <Link to="/tienda" className="text-sm font-black text-hornet-dark underline">
          Ver toda la tienda →
        </Link>
      </div>
    </section>
  )
}
