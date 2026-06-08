import { useState } from 'react'
import api from '../../hooks/useApi'
import { formatFecha, ESTADO_PEDIDO_LABELS } from '../../lib/utils'
import Button from '../../components/ui/Button'
import StatusChip from '../../components/ui/StatusChip'

const PASOS_ORDEN = ['en_proceso', 'comprado', 'en_transito', 'en_aduana', 'entregado']

export default function SeguimientoPage() {
  const [codigo, setCodigo] = useState('')
  const [loading, setLoading] = useState(false)
  const [pedido, setPedido] = useState(null)
  const [error, setError] = useState(null)

  const handleBuscar = async (e) => {
    e.preventDefault()
    if (!codigo.trim()) return
    setLoading(true)
    setError(null)
    setPedido(null)
    try {
      const r = await api.get(`/seguimiento/${codigo.trim()}`)
      setPedido(r.data)
    } catch {
      setError('No encontramos ningún pedido con ese código.')
    } finally {
      setLoading(false)
    }
  }

  const pasoActual = pedido ? PASOS_ORDEN.indexOf(pedido.estado) : -1

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-black text-hornet-dark mb-2">Seguimiento de pedido</h1>
      <p className="text-hornet-muted mb-8">Ingresá tu código de seguimiento para ver el estado de tu importación.</p>

      <form onSubmit={handleBuscar} className="flex gap-2 mb-8">
        <input
          type="text"
          placeholder="Ej: HRN-20240315-XXXXX"
          value={codigo}
          onChange={e => setCodigo(e.target.value)}
          className="flex-1 border border-neutral-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold"
        />
        <Button type="submit" variant="primary" loading={loading}>
          Buscar
        </Button>
      </form>

      {error && (
        <div className="border border-hornet-error bg-hornet-error-bg p-4 text-sm text-hornet-error mb-6">
          {error}
        </div>
      )}

      {pedido && (
        <div className="border border-neutral-200 bg-white">
          <div className="bg-hornet-dark text-white px-5 py-3 flex items-center justify-between">
            <p className="font-black text-sm uppercase tracking-widest">Pedido #{pedido.codigoSeguimiento}</p>
            <StatusChip type="pedido" estado={pedido.estado} />
          </div>

          <div className="p-5">
            <p className="text-sm text-hornet-muted mb-1">Producto</p>
            <p className="font-medium text-hornet-dark mb-4">{pedido.nombreProducto}</p>

            {/* Progreso */}
            {pedido.estado !== 'cancelado' && (
              <div className="mb-6">
                <div className="flex items-center gap-0">
                  {PASOS_ORDEN.map((paso, i) => (
                    <div key={paso} className="flex items-center flex-1 last:flex-none">
                      <div className="flex flex-col items-center">
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs
                          ${i <= pasoActual ? 'bg-hornet-dark border-hornet-dark text-white' : 'bg-white border-neutral-300 text-hornet-muted'}`}>
                          {i < pasoActual ? '✓' : i + 1}
                        </div>
                        <p className="text-xs text-hornet-muted mt-1 text-center hidden sm:block" style={{fontSize: '10px'}}>
                          {ESTADO_PEDIDO_LABELS[paso]}
                        </p>
                      </div>
                      {i < PASOS_ORDEN.length - 1 && (
                        <div className={`flex-1 h-0.5 mx-1 ${i < pasoActual ? 'bg-hornet-dark' : 'bg-neutral-200'}`} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {pedido.trackingExterno && (
              <div className="bg-hornet-surface p-3 border border-neutral-200 text-sm">
                <span className="text-hornet-muted">Tracking del courier: </span>
                <span className="font-mono font-medium">{pedido.trackingExterno}</span>
              </div>
            )}

            {pedido.updatedAt && (
              <p className="text-xs text-hornet-muted mt-4">
                Última actualización: {formatFecha(pedido.updatedAt)}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-10 border-t border-neutral-200 pt-8 text-sm text-hornet-muted">
        <p className="font-medium text-hornet-dark mb-2">¿No encontrás tu pedido?</p>
        <p>El código de seguimiento llega por email cuando el pedido es confirmado. Si tenés dudas escribinos a{' '}
          <a href="mailto:soporte@hornetimports.com" className="underline">soporte@hornetimports.com</a>.
        </p>
      </div>
    </div>
  )
}
