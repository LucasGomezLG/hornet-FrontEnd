import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getCotizaciones } from '../../api/cotizador'
import { formatARS, formatUSD, formatFecha } from '../../lib/utils'
import StatusChip from '../../components/ui/StatusChip'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

export default function CotizacionesPage() {
  const [cotizaciones, setCotizaciones] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getCotizaciones({ page, size: 10 })
      .then(r => {
        setCotizaciones(r.data.content ?? [])
        setTotal(r.data.page?.totalElements ?? r.data.totalElements ?? 0)
      })
      .finally(() => setLoading(false))
  }, [page])

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-hornet-dark">Mis cotizaciones</h1>
          <p className="text-hornet-muted mt-1">Historial de todas tus cotizaciones.</p>
        </div>
        <Link to="/cotizar"
          className="bg-hornet-gold text-hornet-dark text-sm font-black px-4 py-2 hover:brightness-95 transition-all">
          Nueva cotización
        </Link>
      </div>

      {cotizaciones.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-300">
          <p className="text-4xl mb-3">🔢</p>
          <p className="font-medium text-hornet-dark mb-1">No tenés cotizaciones aún.</p>
          <Link to="/cotizar"
            className="inline-block bg-hornet-gold text-hornet-dark text-sm font-black px-5 py-2 mt-3">
            Cotizar ahora →
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {cotizaciones.map(c => (
              <div key={c.id} className="border border-neutral-200 bg-white p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-hornet-dark truncate">{c.nombreProducto}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                      <span className="text-xs text-hornet-muted">{formatFecha(c.createdAt)}</span>
                      {c.costoTotalArs && (
                        <span className="text-xs font-medium text-hornet-dark">{formatARS(c.costoTotalArs)}</span>
                      )}
                      <span className="text-xs text-hornet-muted">
                        {c.tipoServicio === 'completo' ? 'Servicio completo' : 'Forwarding'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusChip type="cotizacion" estado={c.estado} />
                    {c.estado === 'aprobada' && (
                      <Link to={`/solicitar/${c.id}`}
                        className="bg-hornet-gold text-hornet-dark text-xs font-black px-3 py-1.5 hover:brightness-95 transition-all whitespace-nowrap">
                        Pagar →
                      </Link>
                    )}
                  </div>
                </div>

                {c.estado === 'pendiente' && (
                  <div className="mt-3 p-2 bg-neutral-50 border border-neutral-200 text-xs text-hornet-muted">
                    El equipo está revisando tu cotización. Te avisamos por email cuando esté aprobada.
                  </div>
                )}
                {c.estado === 'rechazada' && (
                  <div className="mt-3 p-2 bg-hornet-error-bg border border-hornet-error text-xs text-hornet-error">
                    Esta cotización fue rechazada. Podés hacer una nueva cotización o contactarnos para más información.
                  </div>
                )}
              </div>
            ))}
          </div>

          {total > 10 && (
            <div className="flex justify-center gap-3 mt-8">
              <button disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border border-neutral-300 text-sm disabled:opacity-40 hover:border-hornet-dark transition-colors">
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-hornet-muted">Página {page + 1}</span>
              <button disabled={(page + 1) * 10 >= total}
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
