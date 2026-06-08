import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router'
import { getListing } from '../../api/marketplace'
import { formatARS, formatUSD } from '../../lib/utils'
import Button from '../../components/ui/Button'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

export default function MarketplaceListingPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [listing, setListing] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getListing(id)
      .then(r => setListing(r.data))
      .catch(() => setError('Publicación no encontrada.'))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) return <PageSpinner />

  if (error) return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <p className="text-4xl mb-4">🛒</p>
      <p className="font-black text-hornet-dark text-xl mb-2">{error}</p>
      <Link to="/marketplace" className="text-sm underline text-hornet-muted">Volver al marketplace</Link>
    </div>
  )

  const { nombre, descripcion, precioUsd, precioArs, imagenUrl, categoria, vendedorNombre } = listing

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Link to="/marketplace" className="text-sm text-hornet-muted hover:text-hornet-dark transition-colors mb-6 inline-block">
        ← Volver al marketplace
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-hornet-surface border border-neutral-200 overflow-hidden">
          {imagenUrl
            ? <img src={imagenUrl} alt={nombre} className="w-full h-full object-cover" />
            : <div className="w-full h-full flex items-center justify-center text-hornet-muted">Sin imagen</div>
          }
        </div>

        <div>
          {categoria && (
            <span className="text-xs text-hornet-muted uppercase tracking-widest">{categoria}</span>
          )}
          <h1 className="text-2xl font-black text-hornet-dark mt-1 mb-4">{nombre}</h1>

          <div className="mb-6">
            {precioArs != null && (
              <p className="text-3xl font-black text-hornet-dark">{formatARS(precioArs)}</p>
            )}
            {precioUsd != null && (
              <p className="text-sm text-hornet-muted mt-1">{formatUSD(precioUsd)}</p>
            )}
          </div>

          {descripcion && (
            <p className="text-sm text-hornet-muted mb-6 leading-relaxed">{descripcion}</p>
          )}

          <div className="p-4 bg-hornet-surface border border-neutral-200 mb-4">
            <p className="text-xs text-hornet-muted uppercase tracking-wide mb-1">Vendedor</p>
            <p className="text-sm font-medium text-hornet-dark">{vendedorNombre}</p>
          </div>

          <div className="space-y-3">
            <Button variant="primary" size="lg" className="w-full"
              onClick={() => navigate(`/cotizar`)}>
              Cotizar importación similar
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
