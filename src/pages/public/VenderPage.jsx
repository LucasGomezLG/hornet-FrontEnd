import { Link } from 'react-router'
import Button from '../../components/ui/Button'

const BENEFICIOS = [
  { icon: '🌍', titulo: 'Alcance nacional', desc: 'Tu inventario llega a compradores de todo el país.' },
  { icon: '🔒', titulo: 'Pagos seguros', desc: 'Cobrás por transferencia bancaria, sin fricciones.' },
  { icon: '📦', titulo: 'Sin logística propia', desc: 'Podés usar la red de envíos de Hornet.' },
  { icon: '📊', titulo: 'Panel de gestión', desc: 'Administrá tu stock, precios y ventas desde un solo lugar.' },
]

const PASOS = [
  { n: '01', titulo: 'Completás el formulario', desc: 'Contanos qué tipo de productos vendés y un poco sobre vos.' },
  { n: '02', titulo: 'Revisamos tu postulación', desc: 'El equipo de Hornet evalúa y te da acceso en 24-48hs hábiles.' },
  { n: '03', titulo: 'Publicás', desc: 'Con acceso al panel de vendedor podés cargar tus productos con fotos, descripción y precio.' },
  { n: '04', titulo: 'Empezás a vender', desc: 'Tus publicaciones aparecen en el marketplace y recibís notificaciones por cada venta.' },
]

export default function VenderPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-hornet-dark text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-3">Vendé en el marketplace de Hornet</h1>
          <p className="text-white/70 text-lg mb-8">
            Publicá tus productos y llegá a compradores en toda Argentina.
          </p>
          <a href="mailto:vendedores@hornetimports.com">
            <Button variant="primary" size="lg">Quiero ser vendedor →</Button>
          </a>
        </div>
      </div>

      {/* Beneficios */}
      <div className="max-w-4xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-black text-hornet-dark text-center mb-8">¿Por qué vender en Hornet?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {BENEFICIOS.map(b => (
            <div key={b.titulo} className="border border-neutral-200 p-5">
              <p className="text-3xl mb-3">{b.icon}</p>
              <p className="font-black text-hornet-dark text-sm mb-1">{b.titulo}</p>
              <p className="text-xs text-hornet-muted">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Proceso */}
      <div className="bg-hornet-surface py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl font-black text-hornet-dark text-center mb-10">¿Cómo me uno?</h2>
          <div className="space-y-6">
            {PASOS.map(p => (
              <div key={p.n} className="flex gap-4 items-start">
                <div className="w-10 h-10 bg-hornet-dark text-white flex items-center justify-center text-sm font-black shrink-0">
                  {p.n}
                </div>
                <div>
                  <p className="font-black text-hornet-dark">{p.titulo}</p>
                  <p className="text-sm text-hornet-muted mt-0.5">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Final */}
      <div className="max-w-3xl mx-auto px-4 py-14 text-center">
        <h2 className="text-2xl font-black text-hornet-dark mb-3">¿Tenés consultas?</h2>
        <p className="text-hornet-muted text-sm mb-6">
          Escribinos a <a href="mailto:vendedores@hornetimports.com" className="underline">vendedores@hornetimports.com</a> y te respondemos en menos de 24hs.
        </p>
        <Link to="/marketplace">
          <Button variant="outline">Ver el marketplace →</Button>
        </Link>
      </div>
    </div>
  )
}
