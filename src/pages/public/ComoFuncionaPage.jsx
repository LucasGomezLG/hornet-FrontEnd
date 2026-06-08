import { Link } from 'react-router'
import Button from '../../components/ui/Button'

const PASOS = [
  {
    n: '01',
    titulo: 'Cotizás',
    desc: 'Usá el cotizador con el link del producto, el precio y el peso. En segundos ves el costo total con aranceles, IVA y flete.',
    icon: '🔢',
  },
  {
    n: '02',
    titulo: 'Solicitás',
    desc: 'Creás tu cuenta, confirmás el pedido y pagás. Hornet compra el producto en tu nombre y se hace cargo de toda la logística.',
    icon: '📋',
  },
  {
    n: '03',
    titulo: 'Despachamos',
    desc: 'El producto viaja desde el exterior a nuestro depósito. Nosotros hacemos el despacho aduanero y todos los trámites.',
    icon: '✈️',
  },
  {
    n: '04',
    titulo: 'Recibís',
    desc: 'Una vez en Argentina, coordinamos la entrega a tu domicilio. Seguís el estado en tiempo real con tu código de seguimiento.',
    icon: '📦',
  },
]

const MODALIDADES = [
  {
    titulo: 'Servicio completo',
    desc: 'Hornet compra, importa y entrega. Vos solo ponés el link del producto.',
    items: ['Compra del producto', 'Flete internacional', 'Despacho aduanero', 'Entrega en domicilio'],
  },
  {
    titulo: 'Forwarding',
    desc: 'Ya compraste el producto. Nosotros lo recibimos en el exterior y lo traemos.',
    items: ['Dirección de recepción en EEUU/Asia', 'Consolidación de bultos', 'Flete internacional', 'Despacho aduanero'],
  },
]

export default function ComoFuncionaPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-black text-hornet-dark mb-3">¿Cómo funciona?</h1>
        <p className="text-hornet-muted max-w-xl mx-auto">
          Importar nunca fue tan simple. Hornet se ocupa de todo el proceso, desde la compra hasta la entrega.
        </p>
      </div>

      <div className="space-y-0 mb-16">
        {PASOS.map((paso, i) => (
          <div key={paso.n} className={`flex gap-6 p-6 border-l-2 ml-4 relative ${i < PASOS.length - 1 ? 'border-l-neutral-200' : 'border-l-transparent'}`}>
            <div className="absolute -left-4 top-6 w-8 h-8 bg-hornet-dark text-white flex items-center justify-center text-xs font-black rounded-full shrink-0">
              {paso.n}
            </div>
            <div className="text-3xl ml-4">{paso.icon}</div>
            <div>
              <h2 className="text-lg font-black text-hornet-dark mb-1">{paso.titulo}</h2>
              <p className="text-hornet-muted text-sm leading-relaxed">{paso.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-neutral-200 pt-12 mb-12">
        <h2 className="text-2xl font-black text-hornet-dark mb-2 text-center">Modalidades de servicio</h2>
        <p className="text-center text-hornet-muted mb-8 text-sm">Elegí la que mejor se adapta a tu situación.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MODALIDADES.map(m => (
            <div key={m.titulo} className="border border-neutral-200 p-6">
              <h3 className="text-lg font-black text-hornet-dark mb-2">{m.titulo}</h3>
              <p className="text-sm text-hornet-muted mb-4">{m.desc}</p>
              <ul className="space-y-1">
                {m.items.map(item => (
                  <li key={item} className="text-sm flex items-start gap-2">
                    <span className="text-hornet-success mt-0.5">✓</span>
                    <span className="text-hornet-dark">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-hornet-dark text-white p-8 text-center">
        <p className="text-xl font-black mb-2">¿Listo para importar?</p>
        <p className="text-white/70 text-sm mb-6">Calculá el precio total de tu producto en menos de 30 segundos.</p>
        <Link to="/cotizar">
          <Button variant="primary" size="lg">Ir al cotizador →</Button>
        </Link>
      </div>
    </div>
  )
}
