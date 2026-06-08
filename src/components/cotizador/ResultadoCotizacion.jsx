import { useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { formatARS, formatUSD } from '../../lib/utils'
import Button from '../ui/Button'

const RAZONES = {
  categoria_manual:    { titulo: 'Requiere cotización manual', msg: 'Esta categoría no se calcula automáticamente. El equipo te contacta con un precio personalizado.' },
  precio_minimo:       { titulo: 'Precio por debajo del mínimo', msg: 'El monto mínimo para servicio completo particular es USD 25.' },
  precio_minimo_mayor: { titulo: 'Precio por debajo del mínimo mayorista', msg: 'El monto mínimo para importación mayorista es USD 200.' },
  peso_excedido:       { titulo: 'Peso excedido', msg: 'El peso máximo por envío es 30 kg. Para cargas más pesadas contactanos.' },
  categoria_invalida:  { titulo: 'Categoría inválida', msg: 'La categoría seleccionada no es válida.' },
  rate_limit:          { titulo: 'Demasiadas consultas', msg: 'Esperá un momento antes de cotizar de nuevo.' },
}

function Linea({ label, valor, total = false }) {
  return (
    <div className={`flex justify-between items-center py-2 ${total ? 'border-t-2 border-hornet-dark mt-1 pt-3' : 'border-b border-neutral-100'}`}>
      <span className={`text-sm ${total ? 'font-black text-hornet-dark' : 'text-hornet-muted'}`}>{label}</span>
      <span className={`text-sm ${total ? 'font-black text-hornet-dark' : 'text-hornet-dark'}`}>{valor}</span>
    </div>
  )
}

export default function ResultadoCotizacion({ resultado }) {
  const { user } = useAuth()
  const navigate = useNavigate()

  if (!resultado) return null

  if (!resultado.ok) {
    const info = RAZONES[resultado.razon] ?? { titulo: 'No se pudo cotizar', msg: resultado.razon }
    return (
      <div className="border border-yellow-200 bg-yellow-50 p-5">
        <p className="font-black text-hornet-dark mb-1">{info.titulo}</p>
        <p className="text-sm text-hornet-muted">{info.msg}</p>
        {resultado.razon === 'categoria_manual' && (
          <a href="mailto:cotizaciones@hornetimports.com"
            className="inline-block mt-3 text-sm font-black text-hornet-dark underline">
            Contactar al equipo →
          </a>
        )}
      </div>
    )
  }

  const d = resultado.desglose
  const cotizacionId = resultado.cotizacionId
  const precioProd = d.incluyeProducto ? d.cif - d.costoFlete : null
  const pctArancel = d.cif > 0 ? (d.arancelImportacion / d.cif * 100).toFixed(0) : 0

  const handleSolicitar = () => {
    if (!user) {
      if (cotizacionId) sessionStorage.setItem('pendingCotizacionId', cotizacionId)
      navigate('/login', { state: { from: `/solicitar/${cotizacionId}` } })
    } else {
      navigate(`/solicitar/${cotizacionId}`)
    }
  }

  return (
    <div className="border border-neutral-200 bg-white">
      <div className="bg-hornet-dark text-white px-5 py-3">
        <p className="font-black text-sm uppercase tracking-widest">Desglose de costos</p>
      </div>

      <div className="p-5">
        {d.alertaOrigenEuropa && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 text-sm text-hornet-warning">
            ⚠ Productos de Europa pueden tener demoras adicionales en aduana argentina.
          </div>
        )}

        {precioProd != null && <Linea label="Precio del producto" valor={formatUSD(precioProd)} />}
        <Linea label={`Flete internacional (${d.pesoFacturable} kg)`} valor={formatUSD(d.costoFlete)} />
        <Linea label="CIF (producto + flete)" valor={formatUSD(d.cif)} />
        <Linea label={`Arancel de importación (${pctArancel}%)`} valor={formatUSD(d.arancelImportacion)} />
        <Linea label="IVA de importación (21%)" valor={formatUSD(d.ivaImportacion)} />
        <Linea label="Tasa estadística (3%)" valor={formatUSD(d.tasaEstadistica)} />
        <Linea label={`Fee de servicio (${(d.feeRatio * 100).toFixed(0)}%)`} valor={formatUSD(d.feeServicio)} />

        <Linea label="TOTAL (USD)" valor={formatUSD(d.total)} total />

        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-hornet-muted">Total estimado en ARS</span>
          <span className="text-xl font-black text-hornet-gold">{formatARS(d.totalArs)}</span>
        </div>

        <p className="text-xs text-hornet-muted mt-1 pb-3 border-b border-neutral-100">
          Tipo de cambio blue: {formatARS(d.tipoCambio)} — precio en ARS estimado.
        </p>

        <div className="flex gap-2 flex-wrap text-xs mt-3 mb-4">
          <span className="bg-hornet-surface px-2 py-1 border border-neutral-200">
            {d.tipoServicio === 'completo' ? 'Servicio completo' : 'Forwarding'}
          </span>
          <span className="bg-hornet-surface px-2 py-1 border border-neutral-200">
            {d.tipoImportacion === 'particular' ? 'Particular' : 'Mayorista'}
          </span>
        </div>

        {cotizacionId && (
          <>
            <Button onClick={handleSolicitar} variant="primary" size="lg" className="w-full">
              Solicitar importación →
            </Button>
            <p className="text-xs text-hornet-muted text-center mt-2">
              El equipo revisa la cotización antes del pago. Te avisamos por email cuando esté lista.
            </p>
          </>
        )}
      </div>
    </div>
  )
}
