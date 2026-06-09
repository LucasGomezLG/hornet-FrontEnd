import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../../context/AuthContext'
import { crearSolicitud } from '../../api/solicitudes'
import { useCategorias } from '../../context/CategoriaContext'
import Button from '../../components/ui/Button'

const ORIGENES  = ['asia', 'europa', 'eeuu', 'otro']
const ORIGEN_LABELS = { asia: 'Asia', europa: 'Europa', eeuu: 'EEUU', otro: 'Otro' }

const ITEM_VACÍO = {
  nombreProducto: '',
  urlProducto: '',
  precioUsdRef: '',
  pesoKg: '',
  categoria: '',
  cantidad: 1,
  origen: 'asia',
  tipoServicio: 'completo',
  tipo: 'particular',
}

function ItemForm({ item, onChange, onRemove, index, total, categorias }) {
  const set = (field, value) => onChange({ ...item, [field]: value })

  return (
    <div className="border border-neutral-200 bg-white">
      <div className="flex items-center justify-between px-4 py-2.5 bg-hornet-dark text-white">
        <span className="text-xs font-black uppercase tracking-wider">Producto {index + 1}</span>
        {total > 1 && (
          <button onClick={onRemove} className="text-white/60 hover:text-white text-xs transition-colors">
            Quitar ✕
          </button>
        )}
      </div>

      <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-hornet-dark mb-1">
            Nombre del producto <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={item.nombreProducto}
            onChange={e => set('nombreProducto', e.target.value)}
            placeholder="Ej: Pastillas de freno Ferodo DS2500"
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-hornet-dark mb-1">Link del producto</label>
          <input
            type="url"
            value={item.urlProducto}
            onChange={e => set('urlProducto', e.target.value)}
            placeholder="https://www.amazon.com/..."
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-hornet-dark mb-1">Precio de referencia (USD)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            value={item.precioUsdRef}
            onChange={e => set('precioUsdRef', e.target.value)}
            placeholder="Ej: 89.99"
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-hornet-dark mb-1">
            Peso estimado (kg)
            <span className="ml-1 text-hornet-muted font-normal" title="El peso real puede variar. Si es mayor al declarado, se ajusta el costo.">
              ⓘ
            </span>
          </label>
          <input
            type="number"
            min="0.1"
            max="30"
            step="0.1"
            value={item.pesoKg}
            onChange={e => set('pesoKg', e.target.value)}
            placeholder="Ej: 1.5"
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-hornet-dark mb-1">Categoría</label>
          <select
            value={item.categoria}
            onChange={e => set('categoria', e.target.value)}
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold bg-white"
          >
            <option value="">Seleccioná una categoría</option>
            {categorias.map(c => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-hornet-dark mb-1">Origen</label>
          <select
            value={item.origen}
            onChange={e => set('origen', e.target.value)}
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold bg-white"
          >
            {ORIGENES.map(o => (
              <option key={o} value={o}>{ORIGEN_LABELS[o]}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-hornet-dark mb-1">Cantidad</label>
          <input
            type="number"
            min="1"
            value={item.cantidad}
            onChange={e => set('cantidad', parseInt(e.target.value) || 1)}
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-hornet-dark mb-1">Tipo de cliente</label>
          <select
            value={item.tipo}
            onChange={e => set('tipo', e.target.value)}
            className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold bg-white"
          >
            <option value="particular">Particular</option>
            <option value="mayorista">Mayorista</option>
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-medium text-hornet-dark mb-1">Tipo de servicio</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { v: 'completo', title: 'Servicio completo', desc: 'Hornet compra el producto por vos' },
              { v: 'forwarding', title: 'Forwarding', desc: 'Vos ya compraste, Hornet trae el envío' },
            ].map(({ v, title, desc }) => (
              <button
                key={v}
                type="button"
                onClick={() => set('tipoServicio', v)}
                className={`text-left p-3 border text-xs transition-colors ${
                  item.tipoServicio === v
                    ? 'border-hornet-dark bg-hornet-dark text-white'
                    : 'border-neutral-300 hover:border-hornet-dark'
                }`}
              >
                <p className="font-black">{title}</p>
                <p className={item.tipoServicio === v ? 'text-white/70' : 'text-hornet-muted'}>{desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function CotizarPage() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const { categorias } = useCategorias()
  const [items, setItems] = useState([{ ...ITEM_VACÍO }])
  const [notaCliente, setNotaCliente] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const addItem = () => setItems(prev => [...prev, { ...ITEM_VACÍO }])

  const updateItem = (idx, updated) =>
    setItems(prev => prev.map((item, i) => i === idx ? updated : item))

  const removeItem = (idx) =>
    setItems(prev => prev.filter((_, i) => i !== idx))

  const handleEnviar = async () => {
    if (!user) {
      navigate('/login', { state: { from: '/cotizar' } })
      return
    }

    const itemsValidos = items.filter(i => i.nombreProducto.trim())
    if (itemsValidos.length === 0) {
      setError('Agregá al menos un producto con nombre.')
      return
    }

    setLoading(true)
    setError(null)
    try {
      const payload = {
        notaCliente: notaCliente.trim() || null,
        items: itemsValidos.map(i => ({
          nombreProducto: i.nombreProducto.trim(),
          urlProducto:    i.urlProducto.trim() || null,
          precioUsdRef:   i.precioUsdRef ? parseFloat(i.precioUsdRef) : null,
          pesoKg:         i.pesoKg       ? parseFloat(i.pesoKg)       : null,
          categoria:      i.categoria    || null,
          cantidad:       i.cantidad,
          origen:         i.origen,
          tipoServicio:   i.tipoServicio,
          tipo:           i.tipo,
        })),
      }
      await crearSolicitud(payload)
      navigate('/cotizaciones', {
        state: { toast: '¡Solicitud enviada! Te avisamos por email cuando esté cotizada.' },
      })
    } catch (e) {
      setError('Hubo un error al enviar la solicitud. Intentá de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-hornet-dark">Solicitar cotización</h1>
        <p className="text-hornet-muted mt-2">
          Agregá los productos que querés importar y te mandamos el precio final por email.
        </p>
      </div>

      <div className="space-y-4">
        {items.map((item, idx) => (
          <ItemForm
            key={idx}
            index={idx}
            total={items.length}
            item={item}
            categorias={categorias}
            onChange={updated => updateItem(idx, updated)}
            onRemove={() => removeItem(idx)}
          />
        ))}
      </div>

      <button
        onClick={addItem}
        className="mt-4 w-full border-2 border-dashed border-neutral-300 py-3 text-sm text-hornet-muted hover:border-hornet-dark hover:text-hornet-dark transition-colors"
      >
        + Agregar otro producto
      </button>

      <div className="mt-6">
        <label className="block text-xs font-medium text-hornet-dark mb-1">
          Nota adicional (opcional)
        </label>
        <textarea
          value={notaCliente}
          onChange={e => setNotaCliente(e.target.value)}
          rows={3}
          placeholder="¿Alguna aclaración sobre tus productos o el envío?"
          className="w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold resize-none"
        />
      </div>

      <div className="mt-2 p-3 bg-amber-50 border border-amber-200 text-xs text-amber-800">
        <strong>Nota sobre el peso:</strong> el peso declarado es una estimación. Si el peso real al llegar
        a Miami es mayor, el costo se ajusta antes del despacho.
      </div>

      {error && (
        <div className="mt-4 p-3 bg-hornet-error-bg border border-hornet-error text-sm text-hornet-error">
          {error}
        </div>
      )}

      <div className="mt-6">
        {user ? (
          <Button
            onClick={handleEnviar}
            loading={loading}
            size="lg"
            className="w-full"
          >
            Enviar a cotizar →
          </Button>
        ) : (
          <div className="text-center border border-neutral-200 p-6">
            <p className="text-sm text-hornet-muted mb-3">
              Necesitás iniciar sesión para enviar tu solicitud.
            </p>
            <Button onClick={() => navigate('/login', { state: { from: '/cotizar' } })} size="lg">
              Iniciar sesión con Google →
            </Button>
          </div>
        )}
      </div>

      <div className="mt-10 border-t border-neutral-200 pt-8 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
        {[
          { icon: '📦', title: 'Varios productos', desc: 'Mandá todo en una sola solicitud.' },
          { icon: '🔍', title: 'Revisión manual', desc: 'El equipo de Hornet revisa y cotiza cada ítem.' },
          { icon: '✉️', title: 'Respuesta por email', desc: 'Te avisamos cuando tengamos los precios.' },
        ].map(item => (
          <div key={item.title}>
            <p className="text-2xl mb-2">{item.icon}</p>
            <p className="font-black text-hornet-dark text-sm">{item.title}</p>
            <p className="text-xs text-hornet-muted mt-1">{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
