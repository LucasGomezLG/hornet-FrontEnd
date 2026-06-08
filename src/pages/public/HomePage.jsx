import { Link } from 'react-router'
import Button from '../../components/ui/Button'
import HeroCarousel from '../../components/home/HeroCarousel'
import StatsSection from '../../components/home/StatsSection'
import FeaturedProducts from '../../components/home/FeaturedProducts'
import FadeIn from '../../components/ui/FadeIn'

const PASOS = [
  { n: '01', titulo: 'Cotizás', desc: 'Pegás el link del producto, ponés precio y peso. El total con impuestos aparece al instante.' },
  { n: '02', titulo: 'Confirmás', desc: 'Iniciás sesión, aprobás la cotización y pagás. Hornet compra en tu nombre.' },
  { n: '03', titulo: 'Recibís', desc: 'El producto llega a tu puerta en Argentina. Seguimiento en tiempo real incluido.' },
]

const ORIGENES = [
  { label: 'AliExpress', sub: 'Asia' },
  { label: 'Amazon',     sub: 'EEUU' },
  { label: 'eBay',       sub: 'EEUU' },
  { label: 'Alibaba',    sub: 'Asia (mayorista)' },
  { label: 'Shein',      sub: 'Asia' },
  { label: 'Cualquier tienda', sub: 'Mundial' },
]

export default function HomePage() {
  return (
    <div>
      {/* Hero carousel */}
      <HeroCarousel />

      {/* Stats animados */}
      <StatsSection />

      {/* Cómo funciona — 3 pasos */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <FadeIn>
          <h2 className="text-2xl font-black text-hornet-dark text-center mb-10">Tres pasos, sin burocracia</h2>
        </FadeIn>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PASOS.map((p, i) => (
            <FadeIn key={p.n} delay={i * 100}>
              <div className="border border-neutral-200 p-6 h-full">
                <p className="text-3xl font-black text-hornet-gold mb-3">{p.n}</p>
                <h3 className="text-lg font-black text-hornet-dark mb-2">{p.titulo}</h3>
                <p className="text-sm text-hornet-muted leading-relaxed">{p.desc}</p>
              </div>
            </FadeIn>
          ))}
        </div>
        <FadeIn delay={300} className="text-center mt-8">
          <Link to="/como-funciona" className="text-sm font-black text-hornet-dark underline">
            Ver proceso completo →
          </Link>
        </FadeIn>
      </section>

      {/* Productos destacados de la tienda */}
      <div className="bg-hornet-surface py-2">
        <FeaturedProducts />
      </div>

      {/* Orígenes soportados */}
      <section className="bg-white py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl font-black text-hornet-dark text-center mb-2">Importamos desde cualquier tienda</h2>
            <p className="text-center text-hornet-muted text-sm mb-8">Si tiene envío internacional, lo traemos.</p>
          </FadeIn>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {ORIGENES.map((o, i) => (
              <FadeIn key={o.label} delay={i * 60}>
                <div className="border border-neutral-200 bg-hornet-surface p-4 text-center h-full">
                  <p className="font-black text-hornet-dark text-sm">{o.label}</p>
                  <p className="text-xs text-hornet-muted mt-0.5">{o.sub}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <FadeIn>
          <h2 className="text-2xl font-black text-hornet-dark text-center mb-10">Todo bajo un mismo techo</h2>
        </FadeIn>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: '🛒', titulo: 'Importación a pedido', desc: 'Traemos cualquier producto desde el exterior. Cotizá y solicitá en minutos.', to: '/cotizar', cta: 'Cotizar →' },
            { icon: '📦', titulo: 'Tienda',               desc: 'Productos ya importados, disponibles en stock en Argentina para entrega rápida.',   to: '/tienda',    cta: 'Ver tienda →' },
            { icon: '🏪', titulo: 'Marketplace',          desc: 'Comprá a vendedores independientes verificados que publican sus productos.',          to: '/marketplace', cta: 'Ver marketplace →' },
          ].map((s, i) => (
            <FadeIn key={s.titulo} delay={i * 100}>
              <div className="border border-neutral-200 p-6 h-full flex flex-col">
                <p className="text-2xl mb-3">{s.icon}</p>
                <h3 className="font-black text-hornet-dark mb-2">{s.titulo}</h3>
                <p className="text-sm text-hornet-muted mb-4 flex-1">{s.desc}</p>
                <Link to={s.to} className="text-sm font-black text-hornet-dark underline">
                  {s.cta}
                </Link>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* Mayorista banner */}
      <FadeIn as="section" className="bg-hornet-gold px-4 py-12">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-hornet-dark">¿Importás para tu negocio?</h2>
            <p className="text-hornet-dark/70 mt-1 text-sm">
              Tarifas preferenciales para pedidos mayoristas desde USD 200.
            </p>
          </div>
          <Link to="/mayorista" className="shrink-0">
            <Button variant="secondary" size="lg">Ver planes mayorista →</Button>
          </Link>
        </div>
      </FadeIn>

      {/* CTA Final */}
      <FadeIn as="section" className="bg-hornet-dark text-white px-4 py-16 text-center">
        <h2 className="text-3xl font-black mb-3">Empezá hoy, es gratis cotizar</h2>
        <p className="text-white/70 text-sm mb-8 max-w-md mx-auto">
          Sin registro, sin obligaciones. Calculá cuánto cuesta importar tu producto en menos de 30 segundos.
        </p>
        <Link to="/cotizar">
          <Button variant="primary" size="lg">Ir al cotizador →</Button>
        </Link>
      </FadeIn>
    </div>
  )
}
