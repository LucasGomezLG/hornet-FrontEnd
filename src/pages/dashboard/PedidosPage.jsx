import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getPedidos } from '../../api/pedidos'
import { formatARS, formatUSD, formatFecha, ESTADO_PEDIDO_LABELS } from '../../lib/utils'
import StatusChip from '../../components/ui/StatusChip'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

const PASOS = ['en_proceso', 'comprado', 'en_transito', 'en_aduana', 'entregado']

function PedidoRow({ pedido }) {
  const pasoActual = PASOS.indexOf(pedido.estado)
  return (
    <div className="border border-neutral-200 bg-white">
      <div className="p-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="font-black text-hornet-dark">{pedido.productoNombre}</p>
          <p className="text-xs text-hornet-muted mt-0.5">
            {pedido.id} · {pedido.tipoServicio === 'completo' ? 'Servicio completo' : 'Forwarding'} · {formatFecha(pedido.createdAt)}
          </p>
          {pedido.costoTotalArs && (
            <p className="text-sm text-hornet-dark mt-1">{formatARS(pedido.costoTotalArs)}</p>
          )}
        </div>
        <StatusChip type="pedido" estado={pedido.estado} />
      </div>

      {/* Barra de progreso */}
      {pedido.estado !== 'cancelado' && (
        <div className="px-4 pb-4">
          <div className="flex items-center">
            {PASOS.map((paso, i) => (
              <div key={paso} className="flex items-center flex-1 last:flex-none">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs shrink-0
                  ${i <= pasoActual ? 'bg-hornet-dark border-hornet-dark text-white' : 'bg-white border-neutral-300 text-hornet-muted'}`}>
                  {i < pasoActual ? '✓' : ''}
                </div>
                {i < PASOS.length - 1 && (
                  <div className={`flex-1 h-0.5 ${i < pasoActual ? 'bg-hornet-dark' : 'bg-neutral-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-1">
            {PASOS.map(paso => (
              <span key={paso} className="text-[10px] text-hornet-muted text-center flex-1">
                {ESTADO_PEDIDO_LABELS[paso]}
              </span>
            ))}
          </div>
        </div>
      )}

      {(pedido.trackingCode || pedido.trackingCodigoCliente) && (
        <div className="border-t border-neutral-100 px-4 py-2 text-xs text-hornet-muted">
          <span>Tracking: </span>
          <span className="font-mono font-medium text-hornet-dark">
            {pedido.trackingCodigoCliente || pedido.trackingCode}
          </span>
        </div>
      )}
    </div>
  )
}

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    getPedidos({ page, size: 10 })
      .then(r => {
        setPedidos(r.data.content ?? [])
        setTotal(r.data.page?.totalElements ?? r.data.totalElements ?? 0)
      })
      .finally(() => setLoading(false))
  }, [page])

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-hornet-dark">Mis pedidos</h1>
        <p className="text-hornet-muted mt-1">Seguí el estado de todas tus importaciones.</p>
      </div>

      {pedidos.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-300">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-medium text-hornet-dark mb-1">No tenés pedidos aún.</p>
          <p className="text-sm text-hornet-muted mb-4">
            Para crear un pedido primero cotizá y luego solicitá la importación.
          </p>
          <Link to="/cotizar"
            className="inline-block bg-hornet-gold text-hornet-dark text-sm font-black px-5 py-2">
            Cotizar ahora →
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {pedidos.map(p => <PedidoRow key={p.id} pedido={p} />)}
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
