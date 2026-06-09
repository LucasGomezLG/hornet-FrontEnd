import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import { getStats } from '../../api/admin'
import { formatARS, formatUSD } from '../../lib/utils'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

export default function AdminOverviewPage() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStats().then(r => setStats(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  const CARDS = [
    { label: 'Pedidos hoy',              valor: stats?.pedidosHoy ?? 0,           to: '/admin/pedidos',       icon: '📦' },
    { label: 'Ingresos USD (este mes)',  valor: formatUSD(stats?.ingresosUsdMes),  to: '/admin/pedidos',       icon: '💰' },
    { label: 'Vendedores activos',       valor: stats?.vendedoresActivos ?? 0,     to: '/admin/vendedores',    icon: '🏪' },
    { label: 'Cotizaciones pendientes',  valor: stats?.cotizacionesPendientes ?? 0, to: '/admin/cotizaciones', icon: '⏳', highlight: (stats?.cotizacionesPendientes ?? 0) > 0 },
    { label: 'Solicitudes pendientes',   valor: stats?.solicitudesPendientes ?? 0,  to: '/admin/solicitudes',  icon: '📋', highlight: (stats?.solicitudesPendientes ?? 0) > 0 },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-hornet-dark">Panel de administración</h1>
        <p className="text-hornet-muted mt-1">Resumen general de la plataforma.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {CARDS.map(c => (
          <Link key={c.label} to={c.to}
            className={`border p-5 hover:border-hornet-gold transition-colors ${c.highlight ? 'border-hornet-gold bg-yellow-50' : 'border-neutral-200 bg-white'}`}>
            <p className="text-2xl mb-2">{c.icon}</p>
            <p className={`text-2xl font-black ${c.highlight ? 'text-hornet-gold' : 'text-hornet-dark'}`}>{c.valor}</p>
            <p className="text-xs text-hornet-muted mt-1">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          { label: 'Solicitudes',    desc: 'Cotizar solicitudes de importación de usuarios.', to: '/admin/solicitudes',  icon: '📋' },
          { label: 'Categorías',    desc: 'Gestionar categorías y subcategorías de la tienda.', to: '/admin/categorias', icon: '🏷️' },
          { label: 'Cotizaciones',  desc: 'Aprobar o rechazar cotizaciones pendientes.',    to: '/admin/cotizaciones', icon: '🔢' },
          { label: 'Pedidos',       desc: 'Actualizar estado y tracking de pedidos.',        to: '/admin/pedidos',      icon: '📦' },
          { label: 'Vendedores',    desc: 'Ver vendedores habilitados en el marketplace.',   to: '/admin/vendedores',   icon: '🏪' },
          { label: 'Tienda',        desc: 'CRUD de productos de la tienda propia.',          to: '/admin/tienda',       icon: '🛒' },
        ].map(a => (
          <Link key={a.label} to={a.to}
            className="border border-neutral-200 bg-white p-5 hover:border-hornet-gold transition-colors flex gap-4 items-start">
            <p className="text-2xl shrink-0">{a.icon}</p>
            <div>
              <p className="font-black text-hornet-dark">{a.label}</p>
              <p className="text-xs text-hornet-muted mt-0.5">{a.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
