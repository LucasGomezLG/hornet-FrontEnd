import { useEffect, useState } from 'react'
import { getPedidosAdmin, actualizarPedido, confirmarPago } from '../../api/admin'
import { formatARS, formatUSD, formatFecha, ESTADO_PEDIDO_LABELS } from '../../lib/utils'
import StatusChip from '../../components/ui/StatusChip'
import Button from '../../components/ui/Button'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

const ESTADOS_PEDIDO = ['', 'en_proceso', 'comprado', 'en_transito', 'en_aduana', 'entregado', 'cancelado']
const METODOS = ['', 'mp', 'transferencia', 'cripto']

function EditarModal({ pedido, onClose, onDone }) {
  const [estado, setEstado] = useState(pedido.estado)
  const [tracking, setTracking] = useState(pedido.trackingCode || '')
  const [referencia, setReferencia] = useState('')
  const [loading, setLoading] = useState(false)

  const handleGuardar = async () => {
    setLoading(true)
    try {
      await actualizarPedido(pedido.id, { estado, trackingCode: tracking || null })
      if (referencia.trim()) {
        await confirmarPago(pedido.id, referencia.trim())
      }
      onDone()
    } finally {
      setLoading(false)
    }
  }

  const inputCls = 'w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold bg-white'

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md">
        <div className="bg-hornet-dark text-white px-5 py-3 flex items-center justify-between">
          <div>
            <p className="font-black text-sm">Editar pedido {pedido.id}</p>
            <p className="text-xs text-white/70">{pedido.productoNombre}</p>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-hornet-dark mb-1">Estado</label>
            <select value={estado} onChange={e => setEstado(e.target.value)} className={inputCls}>
              {ESTADOS_PEDIDO.filter(Boolean).map(e => (
                <option key={e} value={e}>{ESTADO_PEDIDO_LABELS[e] || e}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-hornet-dark mb-1">Código de tracking</label>
            <input type="text" value={tracking} onChange={e => setTracking(e.target.value)}
              placeholder="Ej: UPS123456789" className={inputCls} />
          </div>
          {(pedido.metodoPago === 'transferencia' || pedido.metodoPago === 'cripto') && (
            <div>
              <label className="block text-sm font-medium text-hornet-dark mb-1">
                Confirmar pago (referencia)
                <span className="text-hornet-muted font-normal ml-1 text-xs">— solo si validaste el pago</span>
              </label>
              <input type="text" value={referencia} onChange={e => setReferencia(e.target.value)}
                placeholder="N.° de transferencia o hash cripto" className={inputCls} />
            </div>
          )}
          <div className="flex gap-3 pt-2">
            <Button variant="primary" loading={loading} onClick={handleGuardar} className="flex-1">
              Guardar cambios
            </Button>
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PedidosAdminPage() {
  const [pedidos, setPedidos] = useState([])
  const [estado, setEstado] = useState('')
  const [metodo, setMetodo] = useState('')
  const [loading, setLoading] = useState(true)
  const [editando, setEditando] = useState(null)

  const cargar = () => {
    setLoading(true)
    getPedidosAdmin({ estado: estado || undefined, metodoPago: metodo || undefined })
      .then(r => setPedidos(r.data.content ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [estado, metodo])

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-hornet-dark">Pedidos</h1>
      </div>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {ESTADOS_PEDIDO.map(e => (
            <button key={e} onClick={() => setEstado(e)}
              className={`px-3 py-1.5 text-xs border transition-colors ${estado === e ? 'bg-hornet-dark text-white border-hornet-dark' : 'bg-white text-hornet-dark border-neutral-300 hover:border-hornet-dark'}`}>
              {e ? (ESTADO_PEDIDO_LABELS[e] || e) : 'Todos'}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          {METODOS.map(m => (
            <button key={m} onClick={() => setMetodo(m)}
              className={`px-3 py-1.5 text-xs border transition-colors ${metodo === m ? 'bg-hornet-dark text-white border-hornet-dark' : 'bg-white text-hornet-dark border-neutral-300 hover:border-hornet-dark'}`}>
              {m || 'Todos los métodos'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <PageSpinner /> : (
        pedidos.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-neutral-300 text-hornet-muted">
            No hay pedidos con este filtro.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-hornet-dark text-white text-xs uppercase tracking-widest">
                  <th className="px-3 py-3 text-left">ID</th>
                  <th className="px-3 py-3 text-left">Producto</th>
                  <th className="px-3 py-3 text-left">Usuario</th>
                  <th className="px-3 py-3 text-right">Total ARS</th>
                  <th className="px-3 py-3 text-center">Estado</th>
                  <th className="px-3 py-3 text-center">Pago</th>
                  <th className="px-3 py-3 text-left">Tracking</th>
                  <th className="px-3 py-3 text-left">Fecha</th>
                  <th className="px-3 py-3 text-center">Acción</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p, i) => (
                  <tr key={p.id} className={`border-b border-neutral-100 ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
                    <td className="px-3 py-3 font-mono text-xs font-black text-hornet-dark">{p.id}</td>
                    <td className="px-3 py-3">
                      <p className="line-clamp-1 max-w-[160px] text-hornet-dark">{p.productoNombre}</p>
                      <p className="text-xs text-hornet-muted">{p.tipoServicio}</p>
                    </td>
                    <td className="px-3 py-3 text-xs text-hornet-muted">{p.userEmail}</td>
                    <td className="px-3 py-3 text-right font-black text-hornet-dark text-xs">{formatARS(p.costoTotalArs)}</td>
                    <td className="px-3 py-3 text-center"><StatusChip type="pedido" estado={p.estado} /></td>
                    <td className="px-3 py-3 text-center text-xs text-hornet-muted">{p.metodoPago}</td>
                    <td className="px-3 py-3 text-xs font-mono text-hornet-muted">
                      {p.trackingCodigoCliente || p.trackingCode || '—'}
                    </td>
                    <td className="px-3 py-3 text-xs text-hornet-muted whitespace-nowrap">{formatFecha(p.createdAt)}</td>
                    <td className="px-3 py-3 text-center">
                      <Button variant="outline" size="sm" onClick={() => setEditando(p)}>Editar</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )
      )}

      {editando && (
        <EditarModal
          pedido={editando}
          onClose={() => setEditando(null)}
          onDone={() => { setEditando(null); cargar() }}
        />
      )}
    </div>
  )
}
