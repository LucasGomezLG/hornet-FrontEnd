import { useEffect, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router'
import { getCotizacion } from '../../api/cotizador'
import { confirmarPedido } from '../../api/pedidos'
import { formatARS, formatUSD, ESTADO_COTIZACION_LABELS } from '../../lib/utils'
import Button from '../../components/ui/Button'
import StatusChip from '../../components/ui/StatusChip'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

const METODOS = [
  {
    id: 'mp',
    label: 'MercadoPago',
    desc: 'Tarjeta de débito, crédito o saldo en MP. Procesamiento inmediato.',
    icon: '💳',
  },
  {
    id: 'transferencia',
    label: 'Transferencia bancaria',
    desc: 'Transferencia en ARS. Validación en 1-24 horas hábiles.',
    icon: '🏦',
  },
  {
    id: 'cripto',
    label: 'Cripto (USDT)',
    desc: 'USDT por la red TRC-20. Validación en 1-24 horas hábiles.',
    icon: '₿',
  },
]

function PanelTransferencia({ inst }) {
  return (
    <div className="border border-neutral-200 bg-white p-5 space-y-3">
      <h3 className="font-black text-hornet-dark">Datos para la transferencia</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {inst.banco    && <Row label="Banco"   valor={inst.banco} />}
        {inst.titular  && <Row label="Titular" valor={inst.titular} />}
        {inst.cbu      && <Row label="CBU"     valor={inst.cbu} copyable />}
        {inst.alias    && <Row label="Alias"   valor={inst.alias} copyable />}
      </div>
      <div className="border-t border-neutral-200 pt-3">
        <Row label="Monto exacto" valor={`${formatARS(inst.monto)} ${inst.moneda}`} highlight />
      </div>
      {inst.nota && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 text-xs text-hornet-warning">
          {inst.nota}
        </div>
      )}
    </div>
  )
}

function PanelCripto({ inst }) {
  return (
    <div className="border border-neutral-200 bg-white p-5 space-y-3">
      <h3 className="font-black text-hornet-dark">Datos para el pago en cripto</h3>
      <div className="grid grid-cols-2 gap-3 text-sm">
        {inst.red      && <Row label="Red"       valor={inst.red} />}
        {inst.direccion && <Row label="Dirección" valor={inst.direccion} copyable />}
      </div>
      <div className="border-t border-neutral-200 pt-3">
        <Row label="Monto exacto" valor={`${inst.montoUsdt} USDT`} highlight />
      </div>
      {inst.nota && (
        <div className="bg-yellow-50 border border-yellow-200 p-3 text-xs text-hornet-warning">
          {inst.nota}
        </div>
      )}
    </div>
  )
}

function Row({ label, valor, copyable = false, highlight = false }) {
  const [copied, setCopied] = useState(false)
  const copy = () => {
    navigator.clipboard.writeText(valor)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <div className="col-span-2 sm:col-span-1">
      <p className="text-xs text-hornet-muted mb-0.5">{label}</p>
      <div className="flex items-center gap-2">
        <p className={`font-mono text-sm break-all ${highlight ? 'font-black text-hornet-dark text-base' : 'text-hornet-dark'}`}>
          {valor}
        </p>
        {copyable && (
          <button onClick={copy}
            className="text-xs text-hornet-muted hover:text-hornet-dark transition-colors shrink-0">
            {copied ? '✓' : 'Copiar'}
          </button>
        )}
      </div>
    </div>
  )
}

export default function SolicitarPage() {
  const { cotizacionId } = useParams()
  const navigate = useNavigate()

  const [cotizacion, setCotizacion] = useState(null)
  const [loading, setLoading] = useState(true)
  const [metodo, setMetodo] = useState('mp')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [resultado, setResultado] = useState(null)

  useEffect(() => {
    getCotizacion(cotizacionId)
      .then(r => setCotizacion(r.data))
      .catch(() => setError('No pudimos cargar la cotización.'))
      .finally(() => setLoading(false))
  }, [cotizacionId])

  const handleConfirmar = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const r = await confirmarPedido({ cotizacionId, metodoPago: metodo })
      const data = r.data

      if (metodo === 'mp' && data.mpInitPoint) {
        window.location.href = data.mpInitPoint
        return
      }
      setResultado(data)
    } catch (e) {
      const msg = e.response?.data?.message
      setError(msg || 'Hubo un error al procesar el pedido. Intentá de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <PageSpinner />

  if (error && !cotizacion) return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <p className="text-4xl mb-4">⚠️</p>
      <p className="font-black text-hornet-dark text-xl mb-2">{error}</p>
      <Link to="/cotizaciones" className="text-sm underline text-hornet-muted">
        Ver mis cotizaciones
      </Link>
    </div>
  )

  const d = cotizacion?.desglose
  const puedeConfirmar = cotizacion?.aprobadaPorAdmin && cotizacion?.estado === 'aprobada'

  if (resultado) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10">
        <div className="text-center mb-6">
          <p className="text-4xl mb-3">🎉</p>
          <h1 className="text-2xl font-black text-hornet-dark">¡Pedido creado!</h1>
          <p className="text-hornet-muted mt-1">N.° de pedido: <span className="font-black text-hornet-dark">{resultado.pedidoId}</span></p>
        </div>
        {resultado.metodoPago === 'transferencia' && resultado.transferencia && (
          <PanelTransferencia inst={resultado.transferencia} />
        )}
        {resultado.metodoPago === 'cripto' && resultado.cripto && (
          <PanelCripto inst={resultado.cripto} />
        )}
        <div className="mt-6 text-center space-y-2">
          <p className="text-xs text-hornet-muted">
            Te avisamos por email cuando confirmemos el pago y tu pedido arranque.
          </p>
          <Link to="/pedidos"
            className="inline-block mt-3 bg-hornet-dark text-white text-sm font-black px-6 py-2">
            Ver mis pedidos →
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-6">
        <Link to="/cotizaciones" className="text-sm text-hornet-muted hover:text-hornet-dark transition-colors">
          ← Mis cotizaciones
        </Link>
        <h1 className="text-3xl font-black text-hornet-dark mt-3">Solicitar importación</h1>
      </div>

      {/* Resumen de cotización */}
      <div className="border border-neutral-200 bg-white mb-6">
        <div className="bg-hornet-dark text-white px-5 py-3 flex items-center justify-between">
          <p className="font-black text-sm uppercase tracking-widest">Resumen del pedido</p>
          <StatusChip type="cotizacion" estado={cotizacion?.estado} />
        </div>
        <div className="p-5">
          <p className="font-medium text-hornet-dark mb-1">{cotizacion?.nombreProducto}</p>
          <p className="text-xs text-hornet-muted mb-4">
            {cotizacion?.tipoServicio === 'completo' ? 'Servicio completo' : 'Forwarding'} ·{' '}
            {cotizacion?.categoria}
          </p>

          {d && (
            <div className="space-y-1 text-sm border-t border-neutral-100 pt-3">
              {d.incluyeProducto && d.precioProducto > 0 && (
                <div className="flex justify-between text-hornet-muted">
                  <span>Producto</span><span>{formatUSD(d.precioProducto)}</span>
                </div>
              )}
              <div className="flex justify-between text-hornet-muted">
                <span>Flete + impuestos</span>
                <span>{formatUSD(d.arancelImportacion + d.ivaImportacion + d.tasaEstadistica + d.costoFlete)}</span>
              </div>
              <div className="flex justify-between text-hornet-muted">
                <span>Fee Hornet</span><span>{formatUSD(d.feeServicio)}</span>
              </div>
              <div className="flex justify-between font-black text-hornet-dark border-t border-neutral-200 pt-2 mt-2">
                <span>Total</span>
                <div className="text-right">
                  <div>{formatUSD(d.total)}</div>
                  <div className="text-hornet-gold text-lg">{formatARS(d.totalArs)}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Estado de la cotizacion */}
      {!puedeConfirmar ? (
        <div className="border border-yellow-200 bg-yellow-50 p-5 text-center">
          <p className="font-black text-hornet-dark mb-1">
            {cotizacion?.estado === 'pendiente'
              ? 'Tu cotización está siendo revisada por el equipo'
              : `Esta cotización está en estado: ${ESTADO_COTIZACION_LABELS[cotizacion?.estado]}`}
          </p>
          <p className="text-sm text-hornet-muted">
            {cotizacion?.estado === 'pendiente'
              ? 'Te avisamos por email cuando esté aprobada y puedas proceder al pago.'
              : 'Solo podés confirmar cotizaciones aprobadas.'}
          </p>
        </div>
      ) : (
        <>
          {/* Selección de método de pago */}
          <div className="mb-6">
            <h2 className="font-black text-hornet-dark mb-3">Método de pago</h2>
            <div className="space-y-3">
              {METODOS.map(m => (
                <label key={m.id}
                  className={`flex items-start gap-4 border p-4 cursor-pointer transition-colors ${metodo === m.id ? 'border-hornet-gold bg-yellow-50' : 'border-neutral-200 hover:border-neutral-400'}`}>
                  <input type="radio" name="metodo" value={m.id}
                    checked={metodo === m.id}
                    onChange={() => setMetodo(m.id)}
                    className="mt-0.5" />
                  <div>
                    <p className="font-black text-hornet-dark text-sm flex items-center gap-2">
                      <span>{m.icon}</span>{m.label}
                    </p>
                    <p className="text-xs text-hornet-muted mt-0.5">{m.desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <div className="mb-4 border border-hornet-error bg-hornet-error-bg p-3 text-sm text-hornet-error">
              {error}
            </div>
          )}

          <Button variant="primary" size="lg" className="w-full"
            onClick={handleConfirmar} loading={submitting}>
            {metodo === 'mp' ? 'Ir a pagar con MercadoPago →' : 'Confirmar pedido →'}
          </Button>

          <p className="text-xs text-hornet-muted text-center mt-3">
            Al confirmar, aceptás los{' '}
            <Link to="/terminos" className="underline">términos y condiciones</Link>.
            El pedido queda en proceso una vez validado el pago.
          </p>
        </>
      )}
    </div>
  )
}
