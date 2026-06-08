import { Link } from 'react-router'
import Button from '../../components/ui/Button'

const VALORES = [
  { titulo: 'Transparencia', desc: 'Todos los costos son visibles antes de pagar. Sin sorpresas.' },
  { titulo: 'Eficiencia', desc: 'Procesos optimizados para que tu producto llegue rápido y bien.' },
  { titulo: 'Confianza', desc: 'Cada pedido tiene seguimiento en tiempo real y soporte humano.' },
  { titulo: 'Acceso', desc: 'Democratizamos la importación para que cualquiera pueda importar.' },
]

export default function NosotrosPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-hornet-dark text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-4">Sobre Hornet Imports</h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Somos una empresa argentina especializada en importación personal y mayorista.
            Nuestro objetivo es que cualquier persona pueda traer productos del exterior
            sin burocracia y con costos claros.
          </p>
        </div>
      </div>

      {/* Historia */}
      <div className="max-w-3xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-black text-hornet-dark mb-4">Nuestra historia</h2>
        <div className="prose prose-sm text-hornet-muted space-y-4">
          <p>
            Hornet nació de la frustración de querer importar un producto y no entender cuánto iba a costar
            realmente al llegar a Argentina. Los impuestos, los aranceles, el tipo de cambio: todo era una caja negra.
          </p>
          <p>
            Decidimos construir la herramienta que queríamos tener: un cotizador que calcule todo en segundos y
            un servicio que se haga cargo de todo el proceso de principio a fin.
          </p>
          <p>
            Hoy operamos importaciones particulares y mayoristas, tenemos una tienda con productos en stock y
            un marketplace donde vendedores independientes pueden llegar a todo el país.
          </p>
        </div>
      </div>

      {/* Valores */}
      <div className="bg-hornet-surface py-14 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-black text-hornet-dark text-center mb-10">Nuestros valores</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {VALORES.map(v => (
              <div key={v.titulo} className="border border-neutral-200 bg-white p-5">
                <p className="font-black text-hornet-dark mb-2">{v.titulo}</p>
                <p className="text-xs text-hornet-muted leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contacto */}
      <div className="max-w-3xl mx-auto px-4 py-14 text-center">
        <h2 className="text-2xl font-black text-hornet-dark mb-3">¿Querés contactarnos?</h2>
        <p className="text-hornet-muted text-sm mb-2">
          Soporte: <a href="mailto:soporte@hornetimports.com" className="underline">soporte@hornetimports.com</a>
        </p>
        <p className="text-hornet-muted text-sm mb-2">
          Mayorista: <a href="mailto:mayorista@hornetimports.com" className="underline">mayorista@hornetimports.com</a>
        </p>
        <p className="text-hornet-muted text-sm mb-6">
          Vendedores: <a href="mailto:vendedores@hornetimports.com" className="underline">vendedores@hornetimports.com</a>
        </p>
        <Link to="/cotizar">
          <Button variant="primary">Cotizar ahora →</Button>
        </Link>
      </div>
    </div>
  )
}
