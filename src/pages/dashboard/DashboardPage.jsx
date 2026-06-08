import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { getPedidos } from '../../api/pedidos'
import { getCotizaciones } from '../../api/cotizador'
import { formatARS, formatFecha, ESTADO_PEDIDO_LABELS, ESTADO_COTIZACION_LABELS } from '../../lib/utils'
import StatusChip from '../../components/ui/StatusChip'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

export default function DashboardPage() {
  const { user } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [cotizaciones, setCotizaciones] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getPedidos({ page: 0, size: 5 }),
      getCotizaciones({ page: 0, size: 5 }),
    ]).then(([p, c]) => {
      setPedidos(p.data.content ?? [])
      setCotizaciones(c.data.content ?? [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  const pedidosActivos = pedidos.filter(p => !['entregado', 'cancelado'].includes(p.estado)).length
  const cotizacionesPendientes = cotizaciones.filter(c => c.estado === 'pendiente').length
  const cotizacionesAprobadas = cotizaciones.filter(c => c.estado === 'aprobada').length

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-hornet-dark">
          Hola, {user?.nombre || user?.email?.split('@')[0]} 👋
        </h1>
        <p className="text-hornet-muted mt-1">Este es el resumen de tu cuenta.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Pedidos activos',        valor: pedidosActivos,           link: '/pedidos' },
          { label: 'Cotiz. pendientes',      valor: cotizacionesPendientes,   link: '/cotizaciones' },
          { label: 'Cotiz. aprobadas',       valor: cotizacionesAprobadas,    link: '/cotizaciones', highlight: cotizacionesAprobadas > 0 },
          { label: 'Total cotizaciones',     valor: cotizaciones.length,      link: '/cotizaciones' },
        ].map(s => (
          <Link key={s.label} to={s.link}
            className={`border p-4 hover:border-hornet-gold transition-colors ${s.highlight ? 'border-hornet-gold bg-yellow-50' : 'border-neutral-200 bg-white'}`}>
            <p className={`text-3xl font-black ${s.highlight ? 'text-hornet-gold' : 'text-hornet-dark'}`}>{s.valor}</p>
            <p className="text-xs text-hornet-muted mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Cotizaciones aprobadas — acción requerida */}
      {cotizacionesAprobadas > 0 && (
        <div className="mb-8 border border-hornet-gold bg-yellow-50 p-5">
          <p className="font-black text-hornet-dark mb-1">
            ¡Tenés {cotizacionesAprobadas} cotización{cotizacionesAprobadas > 1 ? 'es' : ''} aprobada{cotizacionesAprobadas > 1 ? 's' : ''}!
          </p>
          <p className="text-sm text-hornet-muted mb-3">
            El equipo revisó y aprobó tu cotización. Podés proceder al pago.
          </p>
          <Link to="/cotizaciones"
            className="inline-block bg-hornet-gold text-hornet-dark text-sm font-black px-4 py-2 hover:brightness-95 transition-all">
            Ver cotizaciones →
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pedidos recientes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-hornet-dark">Pedidos recientes</h2>
            <Link to="/pedidos" className="text-xs underline text-hornet-muted">Ver todos</Link>
          </div>
          {pedidos.length === 0 ? (
            <div className="border border-dashed border-neutral-300 p-6 text-center text-hornet-muted text-sm">
              <p>No tenés pedidos aún.</p>
              <Link to="/cotizar" className="font-black text-hornet-dark underline mt-2 inline-block">
                Cotizar ahora →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {pedidos.map(p => (
                <div key={p.id} className="border border-neutral-200 p-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-hornet-dark truncate">{p.productoNombre}</p>
                    <p className="text-xs text-hornet-muted">{p.id} · {formatFecha(p.createdAt)}</p>
                  </div>
                  <StatusChip type="pedido" estado={p.estado} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cotizaciones recientes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-hornet-dark">Cotizaciones</h2>
            <Link to="/cotizaciones" className="text-xs underline text-hornet-muted">Ver todas</Link>
          </div>
          {cotizaciones.length === 0 ? (
            <div className="border border-dashed border-neutral-300 p-6 text-center text-hornet-muted text-sm">
              <p>No tenés cotizaciones aún.</p>
              <Link to="/cotizar" className="font-black text-hornet-dark underline mt-2 inline-block">
                Cotizar ahora →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {cotizaciones.map(c => (
                <div key={c.id} className="border border-neutral-200 p-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-hornet-dark truncate">{c.nombreProducto}</p>
                    <p className="text-xs text-hornet-muted">{formatFecha(c.createdAt)} · {formatARS(c.costoTotalArs)}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusChip type="cotizacion" estado={c.estado} />
                    {c.estado === 'aprobada' && (
                      <Link to={`/solicitar/${c.id}`}
                        className="text-xs font-black text-hornet-gold underline whitespace-nowrap">
                        Pagar →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="mt-10 border-t border-neutral-200 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Cotizar', to: '/cotizar', icon: '🔢' },
          { label: 'Mis pedidos', to: '/pedidos', icon: '📦' },
          { label: 'Seguimiento', to: '/seguimiento', icon: '📍' },
          { label: 'Mi perfil', to: '/perfil', icon: '👤' },
        ].map(a => (
          <Link key={a.label} to={a.to}
            className="border border-neutral-200 p-4 text-center hover:border-hornet-gold transition-colors">
            <p className="text-2xl mb-1">{a.icon}</p>
            <p className="text-xs font-black text-hornet-dark">{a.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
