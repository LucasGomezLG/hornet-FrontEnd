import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router'
import { getSolicitudes, confirmarItem } from '../../api/solicitudes'
import { formatARS, formatUSD, formatFecha } from '../../lib/utils'
import StatusChip from '../../components/ui/StatusChip'
import Button from '../../components/ui/Button'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

// Días restantes hasta expiresAt
function diasRestantes(expiresAt) {
  if (!expiresAt) return null
  const diff = new Date(expiresAt) - new Date()
  if (diff <= 0) return 0
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

// Modal de instrucciones de pago tras confirmar un ítem
function PagoModal({ response, onClose }) {
  const { pedidoId, tipoServicio, montoSenaArs, montoSaldoArs, montoTotalArs,
          metodoPago, cripto, transferencia, mensaje } = response

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg">
        <div className="bg-hornet-dark text-white px-5 py-3 flex items-center justify-between">
          <p className="font-black text-sm">
            {tipoServicio === 'forwarding' ? '¡Pedido creado!' : '¡Instrucciones de pago — Seña'}
          </p>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <p className="text-sm text-hornet-muted">Pedido: <strong className="text-hornet-dark">{pedidoId}</strong></p>

          {tipoServicio === 'forwarding' && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
              {mensaje}
            </div>
          )}

          {tipoServicio === 'completo' && (
            <>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="border border-neutral-200 p-3 text-center">
                  <p className="text-xs text-hornet-muted mb-1">Seña ahora (50%)</p>
                  <p className="font-black text-lg text-hornet-dark">{formatARS(montoSenaArs)}</p>
                </div>
                <div className="border border-neutral-200 p-3 text-center">
                  <p className="text-xs text-hornet-muted mb-1">Saldo al llegar</p>
                  <p className="font-black text-lg text-hornet-dark">{formatARS(montoSaldoArs)}</p>
                </div>
              </div>

              {cripto && (
                <div className="space-y-2 text-sm border border-neutral-200 p-4">
                  <p className="font-black text-hornet-dark text-xs uppercase tracking-wider">Pago con USDT</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <span className="text-hornet-muted">Red:</span>
                    <span className="font-medium">{cripto.red}</span>
                    <span className="text-hornet-muted">Monto:</span>
                    <span className="font-black">{cripto.monto} USDT</span>
                    <span className="text-hornet-muted">Dirección:</span>
                    <span className="font-mono break-all">{cripto.walletAddress}</span>
                  </div>
                  <p className="text-xs text-hornet-muted mt-2">{cripto.nota}</p>
                </div>
              )}

              {transferencia && (
                <div className="space-y-2 text-sm border border-neutral-200 p-4">
                  <p className="font-black text-hornet-dark text-xs uppercase tracking-wider">Transferencia bancaria</p>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                    <span className="text-hornet-muted">Banco:</span>
                    <span className="font-medium">{transferencia.banco}</span>
                    <span className="text-hornet-muted">Titular:</span>
                    <span className="font-medium">{transferencia.titular}</span>
                    <span className="text-hornet-muted">CBU:</span>
                    <span className="font-mono">{transferencia.cbu}</span>
                    <span className="text-hornet-muted">Alias:</span>
                    <span className="font-mono">{transferencia.alias}</span>
                    <span className="text-hornet-muted">Monto:</span>
                    <span className="font-black">{formatARS(transferencia.monto)}</span>
                  </div>
                  <p className="text-xs text-hornet-muted mt-2">{transferencia.nota}</p>
                </div>
              )}
            </>
          )}

          <Button onClick={onClose} variant="outline" className="w-full">Cerrar</Button>
        </div>
      </div>
    </div>
  )
}

function ItemRow({ item, solicitudId, onConfirmado }) {
  const [expandido, setExpandido] = useState(false)
  const [metodoPago, setMetodoPago] = useState('transferencia')
  const [loading, setLoading] = useState(false)
  const [pagoResponse, setPagoResponse] = useState(null)

  const handleConfirmar = async () => {
    setLoading(true)
    try {
      const res = await confirmarItem(solicitudId, item.id, { metodoPago })
      setPagoResponse(res.data)
      onConfirmado()
    } catch (e) {
      alert('Error al confirmar. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  const esConfirmable = item.estadoItem === 'aprobado'
  const esForwarding  = item.tipoServicio === 'forwarding'

  return (
    <div className="border-t border-neutral-100 first:border-t-0">
      <div
        className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 cursor-pointer hover:bg-neutral-50 transition-colors"
        onClick={() => setExpandido(e => !e)}
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-hornet-dark truncate">{item.nombreProducto}</p>
          <p className="text-xs text-hornet-muted mt-0.5">
            {item.cantidad > 1 && `×${item.cantidad} · `}
            {item.tipoServicio === 'completo' ? 'Servicio completo' : 'Forwarding'}
            {item.categoria && ` · ${item.categoria}`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          {item.costoTotalArs && (
            <span className="text-sm font-black text-hornet-dark">{formatARS(item.costoTotalArs)}</span>
          )}
          <StatusChip tipo="item" estado={item.estadoItem} />
          <span className="text-hornet-muted text-xs">{expandido ? '▲' : '▼'}</span>
        </div>
      </div>

      {expandido && (
        <div className="px-4 pb-4 space-y-3">
          {item.estadoItem === 'rechazado' && (
            <div className="p-3 bg-red-50 border border-red-200 text-xs text-red-700">
              <strong>Rechazado:</strong> {item.motivoRechazo || 'Sin motivo especificado'}
            </div>
          )}

          {item.notaItem && (
            <div className="p-3 bg-neutral-50 border border-neutral-200 text-xs text-hornet-muted">
              Nota del equipo: {item.notaItem}
            </div>
          )}

          {esConfirmable && (
            <div className="border border-neutral-200 p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div className="bg-neutral-50 p-2">
                  <p className="text-xs text-hornet-muted">Precio USD</p>
                  <p className="font-black text-hornet-dark">{formatUSD(item.precioFinalUsd)}</p>
                </div>
                <div className="bg-hornet-gold/10 p-2 border border-hornet-gold/30">
                  <p className="text-xs text-hornet-muted">Total ARS</p>
                  <p className="font-black text-hornet-dark">{formatARS(item.costoTotalArs)}</p>
                </div>
              </div>

              {!esForwarding && (
                <p className="text-xs text-hornet-muted text-center">
                  Seña: {formatARS(item.costoTotalArs / 2)} · Saldo al llegar: {formatARS(item.costoTotalArs / 2)}
                </p>
              )}
              {esForwarding && (
                <p className="text-xs text-hornet-muted text-center">
                  Sin pago ahora — pagás {formatARS(item.costoTotalArs)} cuando llegue a BsAs
                </p>
              )}

              {!esForwarding && (
                <div>
                  <label className="block text-xs font-medium text-hornet-dark mb-1">Método de pago de la seña</label>
                  <select
                    value={metodoPago}
                    onChange={e => setMetodoPago(e.target.value)}
                    className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold bg-white"
                  >
                    <option value="transferencia">Transferencia bancaria</option>
                    <option value="cripto">USDT (TRC-20)</option>
                  </select>
                </div>
              )}

              <Button
                onClick={handleConfirmar}
                loading={loading}
                className="w-full"
              >
                {esForwarding ? 'Confirmar pedido →' : 'Señar y confirmar →'}
              </Button>
            </div>
          )}
        </div>
      )}

      {pagoResponse && (
        <PagoModal
          response={pagoResponse}
          onClose={() => setPagoResponse(null)}
        />
      )}
    </div>
  )
}

function SolicitudCard({ solicitud, onRefresh }) {
  const [expandido, setExpandido] = useState(solicitud.estado === 'cotizada')
  const dias = diasRestantes(solicitud.expiresAt)

  return (
    <div className="border border-neutral-200 bg-white">
      <div
        className="flex flex-wrap items-start justify-between gap-3 p-4 cursor-pointer hover:bg-neutral-50 transition-colors"
        onClick={() => setExpandido(e => !e)}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusChip tipo="solicitud" estado={solicitud.estado} />
            {solicitud.estado === 'cotizada' && dias !== null && (
              <span className={`text-xs font-medium ${dias <= 1 ? 'text-red-600' : 'text-amber-700'}`}>
                {dias === 0 ? '¡Expira hoy!' : `Expira en ${dias} día${dias !== 1 ? 's' : ''}`}
              </span>
            )}
          </div>
          <p className="text-xs text-hornet-muted mt-1">
            {solicitud.items.length} producto{solicitud.items.length !== 1 ? 's' : ''} ·{' '}
            {formatFecha(solicitud.createdAt)}
          </p>
          {solicitud.notaAdmin && (
            <p className="text-xs text-hornet-dark mt-1 italic">"{solicitud.notaAdmin}"</p>
          )}
        </div>
        <span className="text-hornet-muted text-xs shrink-0">{expandido ? '▲' : '▼'}</span>
      </div>

      {expandido && (
        <div className="border-t border-neutral-100">
          {solicitud.items.map(item => (
            <ItemRow
              key={item.id}
              item={item}
              solicitudId={solicitud.id}
              onConfirmado={onRefresh}
            />
          ))}
        </div>
      )}

      {solicitud.estado === 'pendiente' && (
        <div className="px-4 pb-3 pt-0">
          <p className="text-xs text-hornet-muted bg-neutral-50 border border-neutral-200 p-2">
            El equipo está revisando tu solicitud. Te avisamos por email cuando los precios estén listos.
          </p>
        </div>
      )}
    </div>
  )
}

export default function CotizacionesPage() {
  const location = useLocation()
  const [solicitudes, setSolicitudes] = useState([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [toast, setToast] = useState(location.state?.toast || null)

  const cargar = () => {
    setLoading(true)
    getSolicitudes({ page, size: 10 })
      .then(r => {
        setSolicitudes(r.data.content ?? [])
        setTotal(r.data.page?.totalElements ?? r.data.totalElements ?? 0)
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [page])

  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 5000)
      return () => clearTimeout(t)
    }
  }, [toast])

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {toast && (
        <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 text-sm text-emerald-800">
          {toast}
        </div>
      )}

      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-hornet-dark">Mis solicitudes</h1>
          <p className="text-hornet-muted mt-1">Seguí el estado de tus pedidos de cotización.</p>
        </div>
        <Link
          to="/cotizar"
          className="bg-hornet-gold text-hornet-dark text-sm font-black px-4 py-2 hover:brightness-95 transition-all"
        >
          Nueva solicitud
        </Link>
      </div>

      {solicitudes.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-300">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-medium text-hornet-dark mb-1">No tenés solicitudes aún.</p>
          <Link
            to="/cotizar"
            className="inline-block bg-hornet-gold text-hornet-dark text-sm font-black px-5 py-2 mt-3"
          >
            Solicitar cotización →
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {solicitudes.map(s => (
              <SolicitudCard key={s.id} solicitud={s} onRefresh={cargar} />
            ))}
          </div>

          {total > 10 && (
            <div className="flex justify-center gap-3 mt-8">
              <button
                disabled={page === 0}
                onClick={() => setPage(p => p - 1)}
                className="px-4 py-2 border border-neutral-300 text-sm disabled:opacity-40 hover:border-hornet-dark transition-colors"
              >
                Anterior
              </button>
              <span className="px-4 py-2 text-sm text-hornet-muted">Página {page + 1}</span>
              <button
                disabled={(page + 1) * 10 >= total}
                onClick={() => setPage(p => p + 1)}
                className="px-4 py-2 border border-neutral-300 text-sm disabled:opacity-40 hover:border-hornet-dark transition-colors"
              >
                Siguiente
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
