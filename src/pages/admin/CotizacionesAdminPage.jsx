import { useEffect, useState } from 'react'
import { getCotizacionesAdmin, aprobarCotizacion, rechazarCotizacion } from '../../api/admin'
import { formatARS, formatUSD, formatFechaHora } from '../../lib/utils'
import StatusChip from '../../components/ui/StatusChip'
import Button from '../../components/ui/Button'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

const ESTADOS = ['', 'pendiente', 'aprobada', 'rechazada', 'expirada', 'procesada']

function RechazarModal({ id, onClose, onDone }) {
  const [motivo, setMotivo] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRechazar = async () => {
    if (!motivo.trim()) return
    setLoading(true)
    try {
      await rechazarCotizacion(id, motivo.trim())
      onDone()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md">
        <div className="bg-hornet-dark text-white px-5 py-3 flex items-center justify-between">
          <p className="font-black text-sm">Rechazar cotización</p>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>
        <div className="p-5">
          <label className="block text-sm font-medium text-hornet-dark mb-2">Motivo del rechazo</label>
          <textarea value={motivo} onChange={e => setMotivo(e.target.value)} rows={3}
            placeholder="Ej: El producto está en categoría restringida..."
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold resize-none" />
          <div className="flex gap-3 mt-4">
            <Button variant="danger" loading={loading} onClick={handleRechazar} className="flex-1">
              Rechazar y notificar
            </Button>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CotizacionesAdminPage() {
  const [cotizaciones, setCotizaciones] = useState([])
  const [estado, setEstado] = useState('pendiente')
  const [loading, setLoading] = useState(true)
  const [rechazarId, setRechazarId] = useState(null)

  const cargar = () => {
    setLoading(true)
    getCotizacionesAdmin({ estado: estado || undefined })
      .then(r => setCotizaciones(r.data.content ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [estado])

  const handleAprobar = async (id) => {
    if (!confirm('¿Aprobar esta cotización?')) return
    await aprobarCotizacion(id)
    cargar()
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black text-hornet-dark">Cotizaciones</h1>
        <div className="flex gap-2 flex-wrap">
          {ESTADOS.map(e => (
            <button key={e} onClick={() => setEstado(e)}
              className={`px-3 py-1.5 text-xs border transition-colors ${estado === e ? 'bg-hornet-dark text-white border-hornet-dark' : 'bg-white text-hornet-dark border-neutral-300 hover:border-hornet-dark'}`}>
              {e || 'Todas'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <PageSpinner /> : (
        cotizaciones.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-300 text-hornet-muted">
            No hay cotizaciones con este filtro.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-hornet-dark text-white text-xs uppercase tracking-widest">
                  <th className="px-4 py-3 text-left">Producto</th>
                  <th className="px-4 py-3 text-left">Usuario</th>
                  <th className="px-4 py-3 text-right">Precio USD</th>
                  <th className="px-4 py-3 text-right">Total ARS</th>
                  <th className="px-4 py-3 text-center">Estado</th>
                  <th className="px-4 py-3 text-left">Fecha</th>
                  <th className="px-4 py-3 text-center">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {cotizaciones.map((c, i) => (
                  <tr key={c.id} className={`border-b border-neutral-100 ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
                    <td className="px-4 py-3">
                      <p className="font-medium text-hornet-dark line-clamp-1 max-w-[200px]">{c.nombreProducto}</p>
                      <p className="text-xs text-hornet-muted">{c.categoria} · {c.tipoServicio}</p>
                      {c.productoUrl && (
                        <a href={c.productoUrl} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-hornet-muted underline">Link →</a>
                      )}
                    </td>
                    <td className="px-4 py-3 text-hornet-muted text-xs">{c.userEmail}</td>
                    <td className="px-4 py-3 text-right font-mono text-xs">{formatUSD(c.precioUsd)}</td>
                    <td className="px-4 py-3 text-right font-black text-hornet-dark">{formatARS(c.costoTotalArs)}</td>
                    <td className="px-4 py-3 text-center">
                      <StatusChip type="cotizacion" estado={c.estado} />
                    </td>
                    <td className="px-4 py-3 text-xs text-hornet-muted whitespace-nowrap">{formatFechaHora(c.createdAt)}</td>
                    <td className="px-4 py-3 text-center">
                      {c.estado === 'pendiente' && (
                        <div className="flex gap-2 justify-center">
                          <Button variant="primary" size="sm" onClick={() => handleAprobar(c.id)}>
                            Aprobar
                          </Button>
                          <Button variant="danger" size="sm" onClick={() => setRechazarId(c.id)}>
                            Rechazar
                          </Button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {rechazarId && (
        <RechazarModal
          id={rechazarId}
          onClose={() => setRechazarId(null)}
          onDone={() => { setRechazarId(null); cargar() }}
        />
      )}
    </div>
  )
}
