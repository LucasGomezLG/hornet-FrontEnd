import { Link } from 'react-router'
import Button from '../../components/ui/Button'

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
      {/* Hero */}
      <section className="bg-hornet-dark text-white px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-hornet-gold text-xs font-black uppercase tracking-widest mb-4">
            Importación desde cualquier parte del mundo
          </p>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-5">
            Sabé exactamente cuánto<br />cuesta importar antes de pagar
          </h1>
          <p className="text-white/70 text-lg max-w-xl mx-auto mb-8">
            Cotizador instantáneo con aranceles, IVA y flete incluidos.
            Importación particular y mayorista, sin sorpresas.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/cotizar">
              <Button variant="primary" size="lg">Cotizar gratis →</Button>
            </Link>
            <Link to="/como-funciona">
              <Button variant="secondary" size="lg">¿Cómo funciona?</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Cómo funciona — 3 pasos */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black text-hornet-dark text-center mb-10">Tres pasos, sin burocracia</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {PASOS.map(p => (
            <div key={p.n} className="border border-neutral-200 p-6">
              <p className="text-3xl font-black text-hornet-gold mb-3">{p.n}</p>
              <h3 className="text-lg font-black text-hornet-dark mb-2">{p.titulo}</h3>
              <p className="text-sm text-hornet-muted leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/como-funciona" className="text-sm font-black text-hornet-dark underline">
            Ver proceso completo →
          </Link>
        </div>
      </section>

      {/* Orígenes soportados */}
      <section className="bg-hornet-surface py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-hornet-dark text-center mb-2">Importamos desde cualquier tienda</h2>
          <p className="text-center text-hornet-muted text-sm mb-8">Si tiene envío internacional, lo traemos.</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {ORIGENES.map(o => (
              <div key={o.label} className="border border-neutral-200 bg-white p-4 text-center">
                <p className="font-black text-hornet-dark text-sm">{o.label}</p>
                <p className="text-xs text-hornet-muted mt-0.5">{o.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-black text-hornet-dark text-center mb-10">Todo bajo un mismo techo</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="border border-neutral-200 p-6">
            <p className="text-2xl mb-3">🛒</p>
            <h3 className="font-black text-hornet-dark mb-2">Importación a pedido</h3>
            <p className="text-sm text-hornet-muted mb-4">
              Traemos cualquier producto desde el exterior. Cotizá y solicitá en minutos.
            </p>
            <Link to="/cotizar" className="text-sm font-black text-hornet-dark underline">
              Cotizar →
            </Link>
          </div>
          <div className="border border-neutral-200 p-6">
            <p className="text-2xl mb-3">📦</p>
            <h3 className="font-black text-hornet-dark mb-2">Tienda</h3>
            <p className="text-sm text-hornet-muted mb-4">
              Productos ya importados, disponibles en stock en Argentina para entrega rápida.
            </p>
            <Link to="/tienda" className="text-sm font-black text-hornet-dark underline">
              Ver tienda →
            </Link>
          </div>
          <div className="border border-neutral-200 p-6">
            <p className="text-2xl mb-3">🏪</p>
            <h3 className="font-black text-hornet-dark mb-2">Marketplace</h3>
            <p className="text-sm text-hornet-muted mb-4">
              Comprá a vendedores independientes verificados que publican sus productos.
            </p>
            <Link to="/marketplace" className="text-sm font-black text-hornet-dark underline">
              Ver marketplace →
            </Link>
          </div>
        </div>
      </section>

      {/* Mayorista banner */}
      <section className="bg-hornet-gold px-4 py-12">
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
      </section>

      {/* CTA Final */}
      <section className="bg-hornet-dark text-white px-4 py-16 text-center">
        <h2 className="text-3xl font-black mb-3">Empezá hoy, es gratis cotizar</h2>
        <p className="text-white/70 text-sm mb-8 max-w-md mx-auto">
          Sin registro, sin obligaciones. Calculá cuánto cuesta importar tu producto en menos de 30 segundos.
        </p>
        <Link to="/cotizar">
          <Button variant="primary" size="lg">Ir al cotizador →</Button>
        </Link>
      </section>
    </div>
  )
}
