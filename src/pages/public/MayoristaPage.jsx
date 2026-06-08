import { Link } from 'react-router'
import Button from '../../components/ui/Button'

const VENTAJAS = [
  { icon: '💰', titulo: 'Tarifas preferenciales', desc: 'Fees reducidos a partir de USD 200 por pedido.' },
  { icon: '📦', titulo: 'Grandes volúmenes', desc: 'Gestionamos pedidos de múltiples unidades con consolidación de carga.' },
  { icon: '🏭', titulo: 'Fuentes directas', desc: 'Acceso a fábricas y distribuidores en Asia y EEUU.' },
  { icon: '🤝', titulo: 'Asesoramiento', desc: 'Un asesor dedicado para cada cliente mayorista.' },
]

const TABLA = [
  { monto: 'USD 200 – 999',   fee: '12%', tiempo: '30-45 días' },
  { monto: 'USD 1.000 – 4.999', fee: '10%', tiempo: '30-45 días' },
  { monto: 'USD 5.000+',      fee: 'A convenir', tiempo: 'A convenir' },
]

export default function MayoristaPage() {
  return (
    <div>
      {/* Hero */}
      <div className="bg-hornet-dark text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-hornet-gold text-xs font-black uppercase tracking-widest mb-3">Importación mayorista</p>
          <h1 className="text-4xl font-black mb-3">Importá en cantidad, pagá menos</h1>
          <p className="text-white/70 text-lg mb-8">
            Servicios B2B para comerciantes y empresas que necesitan traer volumen del exterior.
          </p>
          <a href="mailto:mayorista@hornetimports.com">
            <Button variant="primary" size="lg">Hablar con un asesor →</Button>
          </a>
        </div>
      </div>

      {/* Ventajas */}
      <div className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-2xl font-black text-hornet-dark text-center mb-10">¿Por qué importar mayorista con Hornet?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {VENTAJAS.map(v => (
            <div key={v.titulo} className="border border-neutral-200 p-5">
              <p className="text-3xl mb-3">{v.icon}</p>
              <p className="font-black text-hornet-dark text-sm mb-1">{v.titulo}</p>
              <p className="text-xs text-hornet-muted">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Tabla de tarifas */}
      <div className="bg-hornet-surface py-14 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-black text-hornet-dark text-center mb-8">Tarifas según volumen</h2>
          <div className="border border-neutral-200 bg-white overflow-hidden">
            <div className="grid grid-cols-3 bg-hornet-dark text-white text-xs font-black uppercase tracking-widest px-5 py-3">
              <span>Monto (USD)</span>
              <span className="text-center">Fee de servicio</span>
              <span className="text-right">Tiempo estimado</span>
            </div>
            {TABLA.map((row, i) => (
              <div key={i} className={`grid grid-cols-3 px-5 py-4 text-sm border-b border-neutral-100 last:border-0 ${i % 2 === 0 ? 'bg-white' : 'bg-hornet-surface'}`}>
                <span className="text-hornet-dark font-medium">{row.monto}</span>
                <span className="text-center text-hornet-gold font-black">{row.fee}</span>
                <span className="text-right text-hornet-muted">{row.tiempo}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-hornet-muted text-center mt-3">
            Fee sobre precio del producto. Arancel, IVA y flete se calculan aparte.
          </p>
        </div>
      </div>

      {/* CTA + cotizador */}
      <div className="max-w-3xl mx-auto px-4 py-14 text-center">
        <h2 className="text-2xl font-black text-hornet-dark mb-3">¿Querés cotizar un pedido?</h2>
        <p className="text-hornet-muted text-sm mb-6">
          Usá el cotizador y seleccioná <strong>Mayorista</strong> para ver el precio con la tarifa reducida.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/cotizar">
            <Button variant="primary" size="lg">Cotizar ahora →</Button>
          </Link>
          <a href="mailto:mayorista@hornetimports.com">
            <Button variant="outline" size="lg">Hablar con un asesor</Button>
          </a>
        </div>
      </div>
    </div>
  )
}
