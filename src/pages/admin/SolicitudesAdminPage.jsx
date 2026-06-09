import { useEffect, useState } from 'react'
import {
  getSolicitudesAdmin, getSolicitudAdmin,
  cotizarSolicitud, getSugerencia
} from '../../api/solicitudes'
import { formatARS, formatUSD, formatFecha, formatFechaHora, ESTADO_SOLICITUD_LABELS } from '../../lib/utils'
import StatusChip from '../../components/ui/StatusChip'
import Button from '../../components/ui/Button'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

const ESTADOS_FILTRO = ['', 'pendiente', 'cotizada', 'procesada', 'expirada']

// ────────────────────────────────────────────────────────────
// Sugerencia modal
// ────────────────────────────────────────────────────────────
function SugerenciaModal({ sugerencia, onClose, onAplicar }) {
  if (!sugerencia) return null
  const { precioFinalUsd, costoTotalArs, desglose } = sugerencia
  const parsed = desglose ? (() => { try { return JSON.parse(desglose) } catch { return null } })() : null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md">
        <div className="bg-hornet-dark text-white px-5 py-3 flex items-center justify-between">
          <p className="font-black text-sm">Sugerencia del motor de cotización</p>
          <button onClick={onClose} className="text-white/70 hover:text-white">✕</button>
        </div>
        <div className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="bg-neutral-50 p-3 border border-neutral-200">
              <p className="text-xs text-hornet-muted mb-1">Precio USD</p>
              <p className="text-lg font-black text-hornet-dark">{formatUSD(precioFinalUsd)}</p>
            </div>
            <div className="bg-hornet-gold/10 p-3 border border-hornet-gold/30">
              <p className="text-xs text-hornet-muted mb-1">Total ARS</p>
              <p className="text-lg font-black text-hornet-dark">{formatARS(costoTotalArs)}</p>
            </div>
          </div>
          {parsed && (
            <div className="text-xs border border-neutral-200 divide-y divide-neutral-100">
              {Object.entries(parsed).map(([k, v]) => (
                <div key={k} className="flex justify-between px-3 py-2">
                  <span className="text-hornet-muted capitalize">{k.replace(/_/g, ' ')}</span>
                  <span className="font-medium">{typeof v === 'number' ? (k.includes('ars') ? formatARS(v) : formatUSD(v)) : v}</span>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-3">
            <Button onClick={() => { onAplicar({ precioFinalUsd, costoTotalArs, desglose }); onClose() }} className="flex-1">
              Aplicar valores →
            </Button>
            <Button variant="outline" onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Fila de item para cotizar
// ────────────────────────────────────────────────────────────
function ItemCotizador({ item, solicitudId, formState, onChange }) {
  const [loadingSugerencia, setLoadingSugerencia] = useState(false)
  const [sugerencia, setSugerencia] = useState(null)
  const [errorSugerencia, setErrorSugerencia] = useState(null)

  const set = (field, value) => onChange({ ...formState, [field]: value })

  const verSugerencia = async () => {
    setLoadingSugerencia(true)
    setErrorSugerencia(null)
    try {
      const params = {
        pesoKg:       item.pesoKg,
        precioUsd:    item.precioUsdRef,
        tipoServicio: item.tipoServicio,
        tipo:         item.tipo,
        categoria:    item.categoria,
        origen:       item.origen,
      }
      const r = await getSugerencia(solicitudId, item.id, params)
      setSugerencia(r.data)
    } catch {
      setErrorSugerencia('No se pudo calcular sugerencia para este ítem.')
    } finally {
      setLoadingSugerencia(false)
    }
  }

  const aplicarSugerencia = ({ precioFinalUsd, costoTotalArs, desglose }) => {
    onChange({ ...formState, precioFinalUsd: precioFinalUsd ?? '', costoTotalArs: costoTotalArs ?? '', desglose: desglose ?? '' })
  }

  return (
    <div className={`border rounded-none ${formState.aprobado === false ? 'border-red-200 bg-red-50/30' : 'border-neutral-200 bg-white'}`}>
      {/* Header ítem */}
      <div className="flex flex-wrap items-start justify-between gap-3 px-4 py-3 bg-neutral-50 border-b border-neutral-200">
        <div className="min-w-0 flex-1">
          <p className="font-medium text-hornet-dark text-sm">{item.nombreProducto}</p>
          <p className="text-xs text-hornet-muted mt-0.5">
            {item.tipoServicio === 'completo' ? 'Servicio completo' : 'Forwarding'} ·{' '}
            {item.tipo} · {item.origen}
            {item.pesoKg && ` · ${item.pesoKg} kg`}
            {item.cantidad > 1 && ` · ×${item.cantidad}`}
          </p>
          {item.urlProducto && (
            <a href={item.urlProducto} target="_blank" rel="noopener noreferrer"
              className="text-xs text-hornet-muted underline hover:text-hornet-dark transition-colors">
              Ver producto →
            </a>
          )}
          {item.precioUsdRef && (
            <p className="text-xs text-hornet-muted">Precio ref: {formatUSD(item.precioUsdRef)}</p>
          )}
        </div>
        <div className="flex flex-col items-end gap-1 shrink-0">
          <div className="flex items-center gap-2">
            <StatusChip tipo="item" estado={item.estadoItem} />
            <Button
              variant="outline"
              size="sm"
              loading={loadingSugerencia}
              onClick={verSugerencia}
              title="Calcular precio sugerido por el motor"
            >
              Sugerencia ✦
            </Button>
          </div>
          {errorSugerencia && (
            <p className="text-xs text-red-600">{errorSugerencia}</p>
          )}
        </div>
      </div>

      {/* Campos de cotización */}
      <div className="p-4 space-y-4">
        {/* Aprobado / Rechazado toggle */}
        <div className="flex items-center gap-3">
          <p className="text-xs font-medium text-hornet-dark">Decisión:</p>
          <div className="flex gap-2">
            {[
              { val: true,  label: 'Aprobar', cls: 'bg-emerald-600 text-white border-emerald-600' },
              { val: false, label: 'Rechazar', cls: 'bg-red-600 text-white border-red-600' },
              { val: null,  label: 'Sin definir', cls: 'bg-neutral-200 text-neutral-700 border-neutral-300' },
            ].map(({ val, label, cls }) => (
              <button
                key={String(val)}
                type="button"
                onClick={() => set('aprobado', val)}
                className={`px-3 py-1 text-xs border transition-colors ${
                  formState.aprobado === val ? cls : 'bg-white text-hornet-muted border-neutral-300 hover:border-hornet-dark'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {formState.aprobado === true && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-hornet-dark mb-1">Precio final USD <span className="text-red-500">*</span></label>
              <input
                type="number" min="0" step="0.01"
                value={formState.precioFinalUsd}
                onChange={e => set('precioFinalUsd', e.target.value)}
                placeholder="Ej: 120.00"
                className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-hornet-dark mb-1">Costo total ARS <span className="text-red-500">*</span></label>
              <input
                type="number" min="0" step="0.01"
                value={formState.costoTotalArs}
                onChange={e => set('costoTotalArs', e.target.value)}
                placeholder="Ej: 450000"
                className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-hornet-dark mb-1">
                Desglose (JSON, opcional)
              </label>
              <textarea
                value={formState.desglose}
                onChange={e => set('desglose', e.target.value)}
                rows={2}
                placeholder='{"flete":"USD 45","arancel":"ARS 120000",...}'
                className="w-full border border-neutral-300 px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-hornet-gold resize-none"
              />
            </div>
          </div>
        )}

        {formState.aprobado === false && (
          <div>
            <label className="block text-xs font-medium text-hornet-dark mb-1">Motivo del rechazo <span className="text-red-500">*</span></label>
            <textarea
              value={formState.motivo}
              onChange={e => set('motivo', e.target.value)}
              rows={2}
              placeholder="Ej: Producto en categoría restringida..."
              className="w-full border border-red-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-medium text-hornet-dark mb-1">Nota para el usuario (opcional)</label>
          <input
            type="text"
            value={formState.nota}
            onChange={e => set('nota', e.target.value)}
            placeholder="Aclaración interna o para el cliente..."
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold"
          />
        </div>
      </div>

      {sugerencia && (
        <SugerenciaModal
          sugerencia={sugerencia}
          onClose={() => setSugerencia(null)}
          onAplicar={aplicarSugerencia}
        />
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Vista de detalle / cotización
// ────────────────────────────────────────────────────────────
function SolicitudDetalle({ solicitudId, onBack, onCotizada }) {
  const [solicitud, setSolicitud] = useState(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [formError, setFormError] = useState(null)
  const [notaAdmin, setNotaAdmin] = useState('')
  const [itemForms, setItemForms] = useState({})

  useEffect(() => {
    getSolicitudAdmin(solicitudId)
      .then(r => {
        const s = r.data
        setSolicitud(s)
        setNotaAdmin(s.notaAdmin || '')
        const forms = {}
        s.items.forEach(item => {
          forms[item.id] = {
            aprobado:      item.estadoItem === 'aprobado' ? true : item.estadoItem === 'rechazado' ? false : null,
            precioFinalUsd: item.precioFinalUsd ?? '',
            costoTotalArs:  item.costoTotalArs ?? '',
            desglose:       item.desglose ?? '',
            nota:           item.notaItem ?? '',
            motivo:         item.motivoRechazo ?? '',
          }
        })
        setItemForms(forms)
      })
      .finally(() => setLoading(false))
  }, [solicitudId])

  const handleCotizar = async () => {
    setFormError(null)
    const items = solicitud.items.map(item => {
      const f = itemForms[item.id]
      if (f.aprobado === null) return null
      return {
        itemId:        item.id,
        aprobado:      f.aprobado,
        precioFinalUsd: f.aprobado ? (parseFloat(f.precioFinalUsd) || null) : null,
        costoTotalArs:  f.aprobado ? (parseFloat(f.costoTotalArs) || null) : null,
        desglose:       f.aprobado && f.desglose.trim() ? f.desglose.trim() : null,
        nota:           f.nota.trim() || null,
        motivo:         !f.aprobado ? f.motivo.trim() || null : null,
      }
    }).filter(Boolean)

    if (items.length === 0) {
      setFormError('Definí la decisión (aprobar/rechazar) para al menos un ítem.')
      return
    }

    const aprobados = items.filter(i => i.aprobado)
    for (const i of aprobados) {
      if (!i.precioFinalUsd || !i.costoTotalArs) {
        setFormError('Los ítems aprobados requieren precio USD y costo ARS.')
        return
      }
    }

    setGuardando(true)
    try {
      await cotizarSolicitud(solicitudId, { items, notaAdmin: notaAdmin.trim() || null })
      onCotizada()
    } catch {
      setFormError('Error al enviar la cotización. Revisá los campos e intentá de nuevo.')
    } finally {
      setGuardando(false)
    }
  }

  if (loading) return <PageSpinner />
  if (!solicitud) return null

  const { user } = solicitud
  const waLink = user.telefono
    ? `https://wa.me/${user.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${user.nombre}, te contactamos desde Hornet Imports sobre tu solicitud de cotización.`)}`
    : null

  const pendientes = solicitud.items.filter(i => i.estadoItem === 'pendiente')
  const yaDecididas = solicitud.estado !== 'pendiente'

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={onBack}
        className="text-sm text-hornet-muted hover:text-hornet-dark mb-6 flex items-center gap-1 transition-colors"
      >
        ← Volver a la lista
      </button>

      {/* Encabezado usuario */}
      <div className="border border-neutral-200 bg-white p-5 mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="font-black text-hornet-dark">{user.nombre}</p>
            <StatusChip tipo="solicitud" estado={solicitud.estado} />
          </div>
          <p className="text-xs text-hornet-muted">{user.email}</p>
          {user.telefono && <p className="text-xs text-hornet-muted">{user.telefono}</p>}
          <p className="text-xs text-hornet-muted">{formatFechaHora(solicitud.createdAt)}</p>
          {solicitud.notaCliente && (
            <p className="text-xs text-hornet-dark mt-2 italic">Nota cliente: "{solicitud.notaCliente}"</p>
          )}
        </div>
        {waLink && (
          <a
            href={waLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-black px-4 py-2 hover:brightness-95 transition-all"
          >
            WhatsApp →
          </a>
        )}
      </div>

      {/* Ítems */}
      <div className="space-y-4 mb-6">
        {solicitud.items.map(item => (
          <ItemCotizador
            key={item.id}
            item={item}
            solicitudId={solicitudId}
            formState={itemForms[item.id] ?? {}}
            onChange={form => setItemForms(prev => ({ ...prev, [item.id]: form }))}
          />
        ))}
      </div>

      {/* Nota admin + enviar */}
      {!yaDecididas && pendientes.length > 0 && (
        <div className="border border-neutral-200 bg-white p-5 space-y-4">
          <div>
            <label className="block text-xs font-medium text-hornet-dark mb-1">Nota general para el usuario (opcional)</label>
            <textarea
              value={notaAdmin}
              onChange={e => setNotaAdmin(e.target.value)}
              rows={2}
              placeholder="Ej: Los precios pueden variar según el tipo de cambio al momento de la compra."
              className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold resize-none"
            />
          </div>
          {formError && (
            <div className="p-3 border border-red-200 bg-red-50 text-sm text-red-700">
              {formError}
            </div>
          )}
          <Button onClick={handleCotizar} loading={guardando} className="w-full">
            Enviar cotización al usuario →
          </Button>
          <p className="text-xs text-hornet-muted text-center">
            El usuario recibirá un email y tendrá 3 días para confirmar los ítems aprobados.
          </p>
        </div>
      )}

      {yaDecididas && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-sm text-emerald-800 text-center">
          Cotización ya enviada. El usuario fue notificado por email.
        </div>
      )}
    </div>
  )
}

// ────────────────────────────────────────────────────────────
// Vista de lista principal
// ────────────────────────────────────────────────────────────
export default function SolicitudesAdminPage() {
  const [solicitudes, setSolicitudes] = useState([])
  const [estadoFiltro, setEstadoFiltro] = useState('pendiente')
  const [loading, setLoading] = useState(true)
  const [detalleId, setDetalleId] = useState(null)

  const cargar = () => {
    setLoading(true)
    getSolicitudesAdmin({ estado: estadoFiltro || undefined, size: 50 })
      .then(r => setSolicitudes(r.data.content ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [estadoFiltro])

  if (detalleId) {
    return (
      <SolicitudDetalle
        solicitudId={detalleId}
        onBack={() => { setDetalleId(null); cargar() }}
        onCotizada={() => { setDetalleId(null); cargar() }}
      />
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-black text-hornet-dark">Solicitudes de cotización</h1>
        <div className="flex gap-2 flex-wrap">
          {ESTADOS_FILTRO.map(e => (
            <button
              key={e}
              onClick={() => setEstadoFiltro(e)}
              className={`px-3 py-1.5 text-xs border transition-colors ${
                estadoFiltro === e
                  ? 'bg-hornet-dark text-white border-hornet-dark'
                  : 'bg-white text-hornet-dark border-neutral-300 hover:border-hornet-dark'
              }`}
            >
              {e ? (ESTADO_SOLICITUD_LABELS[e] || e) : 'Todas'}
            </button>
          ))}
        </div>
      </div>

      {loading ? <PageSpinner /> : solicitudes.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-300 text-hornet-muted">
          No hay solicitudes con este filtro.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-hornet-dark text-white text-xs uppercase tracking-widest">
                <th className="px-4 py-3 text-left">Usuario</th>
                <th className="px-4 py-3 text-center">Ítems</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-left">Fecha</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {solicitudes.map((s, i) => {
                const waLink = s.user?.telefono
                  ? `https://wa.me/${s.user.telefono.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola ${s.user.nombre}, te contactamos desde Hornet Imports sobre tu solicitud.`)}`
                  : null
                return (
                  <tr
                    key={s.id}
                    className={`border-b border-neutral-100 ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}
                  >
                    <td className="px-4 py-3">
                      <p className="font-medium text-hornet-dark">{s.user?.nombre}</p>
                      <p className="text-xs text-hornet-muted">{s.user?.email}</p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-black text-hornet-dark">{s.items.length}</span>
                      <p className="text-xs text-hornet-muted">
                        {s.items.filter(item => item.estadoItem === 'pendiente').length} pendientes
                      </p>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <StatusChip tipo="solicitud" estado={s.estado} />
                    </td>
                    <td className="px-4 py-3 text-xs text-hornet-muted whitespace-nowrap">
                      {formatFecha(s.createdAt)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex gap-2 justify-center">
                        <Button
                          size="sm"
                          onClick={() => setDetalleId(s.id)}
                        >
                          {s.estado === 'pendiente' ? 'Cotizar →' : 'Ver detalle →'}
                        </Button>
                        {waLink && (
                          <a
                            href={waLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center px-3 py-1.5 text-xs bg-[#25D366] text-white font-black hover:brightness-95 transition-all"
                          >
                            WA
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
