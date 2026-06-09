import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { getPedidos } from '../../api/pedidos'
import { getSolicitudes } from '../../api/solicitudes'
import { formatFecha } from '../../lib/utils'
import StatusChip from '../../components/ui/StatusChip'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

export default function DashboardPage() {
  const { user } = useAuth()
  const [pedidos, setPedidos] = useState([])
  const [solicitudes, setSolicitudes] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getPedidos({ page: 0, size: 5 }),
      getSolicitudes({ page: 0, size: 5 }),
    ]).then(([p, s]) => {
      setPedidos(p.data.content ?? [])
      setSolicitudes(s.data.content ?? [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  const pedidosActivos     = pedidos.filter(p => !['entregado', 'cancelado'].includes(p.estado)).length
  const solicitudesPend    = solicitudes.filter(s => s.estado === 'pendiente').length
  const solicitudesCotizadas = solicitudes.filter(s => s.estado === 'cotizada').length

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
          { label: 'Pedidos activos',       valor: pedidosActivos,         link: '/pedidos' },
          { label: 'Solicitudes en espera', valor: solicitudesPend,        link: '/cotizaciones' },
          { label: 'Cotizaciones listas',   valor: solicitudesCotizadas,   link: '/cotizaciones', highlight: solicitudesCotizadas > 0 },
          { label: 'Total solicitudes',     valor: solicitudes.length,     link: '/cotizaciones' },
        ].map(s => (
          <Link key={s.label} to={s.link}
            className={`border p-4 hover:border-hornet-gold transition-colors ${s.highlight ? 'border-hornet-gold bg-yellow-50' : 'border-neutral-200 bg-white'}`}>
            <p className={`text-3xl font-black ${s.highlight ? 'text-hornet-gold' : 'text-hornet-dark'}`}>{s.valor}</p>
            <p className="text-xs text-hornet-muted mt-1">{s.label}</p>
          </Link>
        ))}
      </div>

      {/* Banner — acción requerida */}
      {solicitudesCotizadas > 0 && (
        <div className="mb-8 border border-hornet-gold bg-yellow-50 p-5">
          <p className="font-black text-hornet-dark mb-1">
            ¡Tenés {solicitudesCotizadas} solicitud{solicitudesCotizadas > 1 ? 'es' : ''} cotizada{solicitudesCotizadas > 1 ? 's' : ''}!
          </p>
          <p className="text-sm text-hornet-muted mb-3">
            El equipo cotizó tus productos. Revisá los precios y confirmá antes de que expiren.
          </p>
          <Link to="/cotizaciones"
            className="inline-block bg-hornet-gold text-hornet-dark text-sm font-black px-4 py-2 hover:brightness-95 transition-all">
            Ver solicitudes →
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
                Solicitar cotización →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {pedidos.map(p => (
                <div key={p.id} className="border border-neutral-200 p-3 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-hornet-dark truncate">{p.productoNombre}</p>
                    <p className="text-xs text-hornet-muted">{formatFecha(p.createdAt)}</p>
                  </div>
                  <StatusChip tipo="pedido" estado={p.estado} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Solicitudes recientes */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-hornet-dark">Solicitudes</h2>
            <Link to="/cotizaciones" className="text-xs underline text-hornet-muted">Ver todas</Link>
          </div>
          {solicitudes.length === 0 ? (
            <div className="border border-dashed border-neutral-300 p-6 text-center text-hornet-muted text-sm">
              <p>No tenés solicitudes aún.</p>
              <Link to="/cotizar" className="font-black text-hornet-dark underline mt-2 inline-block">
                Solicitar cotización →
              </Link>
            </div>
          ) : (
            <div className="space-y-2">
              {solicitudes.map(s => (
                <Link key={s.id} to="/cotizaciones"
                  className="block border border-neutral-200 p-3 hover:border-hornet-gold transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-hornet-dark">
                        {s.items?.length ?? 0} producto{(s.items?.length ?? 0) !== 1 ? 's' : ''}
                      </p>
                      <p className="text-xs text-hornet-muted">{formatFecha(s.createdAt)}</p>
                    </div>
                    <StatusChip tipo="solicitud" estado={s.estado} />
                  </div>
                  {s.estado === 'cotizada' && (
                    <p className="text-xs text-hornet-gold font-black mt-1">Acción requerida →</p>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Accesos rápidos */}
      <div className="mt-10 border-t border-neutral-200 pt-8 grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Nueva solicitud', to: '/cotizar',      icon: '📋' },
          { label: 'Mis solicitudes', to: '/cotizaciones', icon: '🔢' },
          { label: 'Mis pedidos',     to: '/pedidos',      icon: '📦' },
          { label: 'Mi perfil',       to: '/perfil',       icon: '👤' },
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
