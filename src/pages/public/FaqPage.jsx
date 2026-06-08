import { useState } from 'react'
import { Link } from 'react-router'

const FAQS = [
  {
    cat: 'General',
    items: [
      {
        q: '¿Qué es Hornet Imports?',
        a: 'Somos un servicio de importación personal y mayorista. Compramos productos en el exterior y los traemos a Argentina con todos los impuestos incluidos.',
      },
      {
        q: '¿Desde qué países puedo importar?',
        a: 'Principalmente Asia (AliExpress, Alibaba, etc.), EEUU (Amazon, eBay) y Europa. Consultanos para otros orígenes.',
      },
      {
        q: '¿Qué productos NO puedo importar?',
        a: 'Electrónica, cosméticos, alimentos y productos de la categoría "Otro" requieren gestión manual por restricciones aduaneras. Contactanos para estos casos.',
      },
    ],
  },
  {
    cat: 'Precios y pagos',
    items: [
      {
        q: '¿Qué incluye el precio final?',
        a: 'Precio del producto + flete internacional + arancel de importación + IVA de importación (21%) + tasa estadística (3%) + fee de servicio de Hornet.',
      },
      {
        q: '¿Cuál es el monto mínimo?',
        a: 'Para servicio completo particular el mínimo es USD 25. Para importación mayorista el mínimo es USD 200.',
      },
      {
        q: '¿Cómo se paga?',
        a: 'Aceptamos transferencia bancaria y MercadoPago. El pago se realiza antes de que compremos el producto.',
      },
      {
        q: '¿El tipo de cambio que usan es el oficial?',
        a: 'No. Usamos el tipo de cambio blue/informal para calcular el estimado en ARS. El precio final en USD es fijo y se actualiza al tipo de cambio del día del pago.',
      },
    ],
  },
  {
    cat: 'Tiempos y logística',
    items: [
      {
        q: '¿Cuánto tarda en llegar?',
        a: 'Desde Asia: 30 a 60 días hábiles. Desde EEUU: 15 a 30 días hábiles. Los tiempos pueden variar según aduana.',
      },
      {
        q: '¿Cómo sigo mi pedido?',
        a: 'Una vez confirmado el pedido recibís un código de seguimiento. Podés rastrear el estado en la sección Seguimiento o desde tu dashboard.',
      },
      {
        q: '¿Dónde me entregan?',
        a: 'Entregamos en domicilio en toda Argentina. El costo de entrega final depende de la localidad.',
      },
    ],
  },
  {
    cat: 'Vendedores y marketplace',
    items: [
      {
        q: '¿Puedo vender en el marketplace?',
        a: 'Sí. Podés postularte como vendedor desde la sección Vender. Revisamos cada postulación y te habilitamos para publicar.',
      },
      {
        q: '¿Qué diferencia hay entre la tienda y el marketplace?',
        a: 'La tienda tiene productos de Hornet con stock disponible en Argentina. El marketplace son publicaciones de vendedores independientes verificados.',
      },
    ],
  },
]

function AccordionItem({ q, a }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="border-b border-neutral-200 last:border-0">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full text-left py-4 flex items-start justify-between gap-4 hover:text-hornet-gold transition-colors">
        <span className="text-sm font-medium text-hornet-dark">{q}</span>
        <span className={`text-hornet-muted text-lg mt-0.5 transition-transform ${open ? 'rotate-45' : ''}`}>+</span>
      </button>
      {open && (
        <p className="pb-4 text-sm text-hornet-muted leading-relaxed">{a}</p>
      )}
    </div>
  )
}

export default function FaqPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-black text-hornet-dark mb-3">Preguntas frecuentes</h1>
        <p className="text-hornet-muted">Todo lo que necesitás saber sobre el proceso de importación.</p>
      </div>

      <div className="space-y-8">
        {FAQS.map(sec => (
          <div key={sec.cat}>
            <h2 className="text-xs font-black text-hornet-muted uppercase tracking-widest mb-3 border-b border-neutral-200 pb-2">
              {sec.cat}
            </h2>
            <div>
              {sec.items.map(item => (
                <AccordionItem key={item.q} q={item.q} a={item.a} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center border-t border-neutral-200 pt-8">
        <p className="text-hornet-muted text-sm mb-4">¿No encontraste lo que buscabas?</p>
        <a href="mailto:soporte@hornetimports.com"
          className="inline-block bg-hornet-dark text-white px-6 py-3 text-sm font-black hover:opacity-90 transition-opacity">
          Escribinos →
        </a>
      </div>
    </div>
  )
}
