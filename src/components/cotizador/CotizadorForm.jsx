import { useState } from 'react'
import { CATEGORIAS } from '../../lib/categorias'
import Button from '../ui/Button'
import { cn } from '../../lib/utils'

const ORIGENES = [
  { id: 'asia',   label: 'Asia (AliExpress, Wish, etc.)' },
  { id: 'eeuu',   label: 'EEUU (Amazon, eBay, etc.)' },
  { id: 'europa', label: 'Europa' },
  { id: 'otro',   label: 'Otro' },
]

const EMPTY = {
  productoUrl: '', nombreProducto: '', precioUsd: '', pesoKg: '',
  categoriaId: '', origen: 'asia', tipo: 'particular', tipoServicio: 'completo',
}

function Field({ label, error, children, hint }) {
  return (
    <div>
      <label className="block text-sm font-medium text-hornet-dark mb-1">{label}</label>
      {children}
      {hint && !error && <p className="text-xs text-hornet-muted mt-1">{hint}</p>}
      {error && <p className="text-xs text-hornet-error mt-1">{error}</p>}
    </div>
  )
}

const inputCls = (hasError) => cn(
  'w-full border px-3 py-2 text-sm text-hornet-dark bg-white focus:outline-none focus:ring-2 focus:ring-hornet-gold transition-colors',
  hasError ? 'border-hornet-error' : 'border-neutral-300 hover:border-neutral-400'
)

export default function CotizadorForm({ onSubmit, loading }) {
  const [values, setValues] = useState(EMPTY)
  const [errors, setErrors] = useState({})

  const set = (field, value) => {
    setValues(v => ({ ...v, [field]: value }))
    if (errors[field]) setErrors(e => ({ ...e, [field]: null }))
  }

  const categoriaSeleccionada = CATEGORIAS.find(c => c.id === values.categoriaId)
  const esBlacklist = categoriaSeleccionada?.blacklist

  const validate = () => {
    const e = {}
    if (!values.nombreProducto.trim()) e.nombreProducto = 'Requerido'
    if (values.tipoServicio === 'completo' && !values.productoUrl.trim())
      e.productoUrl = 'Requerido para servicio completo'
    if (!values.precioUsd || Number(values.precioUsd) <= 0)
      e.precioUsd = 'Debe ser mayor a 0'
    if (!values.pesoKg || Number(values.pesoKg) <= 0)
      e.pesoKg = 'Debe ser mayor a 0'
    if (Number(values.pesoKg) > 30)
      e.pesoKg = 'Máximo 30 kg'
    if (!values.categoriaId)
      e.categoriaId = 'Seleccioná una categoría'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    onSubmit({
      productoUrl:     values.productoUrl.trim() || 'https://ejemplo.com',
      nombreProducto:  values.nombreProducto.trim(),
      precioUsd:       Number(values.precioUsd),
      pesoKg:          Number(values.pesoKg),
      categoriaId:     values.categoriaId,
      origen:          values.origen,
      tipo:            values.tipo,
      tipoServicio:    values.tipoServicio,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">

      {/* Tipo de servicio — primero para orientar al usuario */}
      <Field label="Tipo de servicio">
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'completo',   title: 'Servicio completo', desc: 'Hornet compra, importa y entrega' },
            { id: 'forwarding', title: 'Forwarding',        desc: 'Ya compraste, solo hacemos el flete' },
          ].map(opt => (
            <label key={opt.id} className={cn(
              'border p-3 cursor-pointer transition-colors',
              values.tipoServicio === opt.id
                ? 'border-hornet-gold bg-yellow-50'
                : 'border-neutral-200 hover:border-neutral-400'
            )}>
              <input type="radio" name="tipoServicio" value={opt.id}
                checked={values.tipoServicio === opt.id}
                onChange={e => set('tipoServicio', e.target.value)}
                className="sr-only" />
              <p className="text-sm font-black text-hornet-dark">{opt.title}</p>
              <p className="text-xs text-hornet-muted mt-0.5">{opt.desc}</p>
            </label>
          ))}
        </div>
      </Field>

      {/* Tipo de comprador */}
      <Field label="Tipo de importación">
        <div className="grid grid-cols-2 gap-3">
          {[
            { id: 'particular', title: 'Particular', desc: 'Mínimo USD 25' },
            { id: 'mayorista',  title: 'Mayorista',  desc: 'Mínimo USD 200' },
          ].map(opt => (
            <label key={opt.id} className={cn(
              'border p-3 cursor-pointer transition-colors',
              values.tipo === opt.id
                ? 'border-hornet-gold bg-yellow-50'
                : 'border-neutral-200 hover:border-neutral-400'
            )}>
              <input type="radio" name="tipo" value={opt.id}
                checked={values.tipo === opt.id}
                onChange={e => set('tipo', e.target.value)}
                className="sr-only" />
              <p className="text-sm font-black text-hornet-dark">{opt.title}</p>
              <p className="text-xs text-hornet-muted mt-0.5">{opt.desc}</p>
            </label>
          ))}
        </div>
      </Field>

      {/* Nombre del producto */}
      <Field label="Nombre del producto" error={errors.nombreProducto}>
        <input
          type="text" placeholder="Ej: Amortiguador delantero Toyota Corolla"
          value={values.nombreProducto}
          onChange={e => set('nombreProducto', e.target.value)}
          className={inputCls(errors.nombreProducto)}
        />
      </Field>

      {/* URL del producto */}
      <Field
        label={values.tipoServicio === 'completo' ? 'Link del producto *' : 'Link del producto (opcional)'}
        error={errors.productoUrl}
        hint="AliExpress, Amazon, eBay u otro sitio"
      >
        <input
          type="url" placeholder="https://www.aliexpress.com/item/..."
          value={values.productoUrl}
          onChange={e => set('productoUrl', e.target.value)}
          className={inputCls(errors.productoUrl)}
        />
      </Field>

      {/* Precio y Peso en columnas */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Precio (USD)" error={errors.precioUsd}>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-hornet-muted text-sm">$</span>
            <input
              type="number" min="0.01" step="0.01" placeholder="0.00"
              value={values.precioUsd}
              onChange={e => set('precioUsd', e.target.value)}
              className={cn(inputCls(errors.precioUsd), 'pl-7')}
            />
          </div>
        </Field>

        <Field label="Peso (kg)" error={errors.pesoKg} hint="Máximo 30 kg">
          <div className="relative">
            <input
              type="number" min="0.01" max="30" step="0.01" placeholder="0.0"
              value={values.pesoKg}
              onChange={e => set('pesoKg', e.target.value)}
              className={cn(inputCls(errors.pesoKg), 'pr-10')}
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-hornet-muted text-sm">kg</span>
          </div>
        </Field>
      </div>

      {/* Categoría */}
      <Field label="Categoría" error={errors.categoriaId}>
        <select
          value={values.categoriaId}
          onChange={e => set('categoriaId', e.target.value)}
          className={inputCls(errors.categoriaId)}
        >
          <option value="">Seleccioná una categoría...</option>
          <optgroup label="Cálculo automático">
            {CATEGORIAS.filter(c => !c.blacklist).map(c => (
              <option key={c.id} value={c.id}>{c.label}</option>
            ))}
          </optgroup>
          <optgroup label="Requiere revisión manual">
            {CATEGORIAS.filter(c => c.blacklist).map(c => (
              <option key={c.id} value={c.id}>{c.label} — revisión manual</option>
            ))}
          </optgroup>
        </select>

        {/* Aviso inmediato si seleccionó una categoría blacklist */}
        {esBlacklist && (
          <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 text-sm text-hornet-warning">
            <strong>{categoriaSeleccionada.label}</strong> requiere cotización manual. Podés cotizar igual y te contactamos para darte un precio personalizado.
          </div>
        )}
      </Field>

      {/* Origen */}
      <Field label="Origen del producto">
        <select
          value={values.origen}
          onChange={e => set('origen', e.target.value)}
          className={inputCls(false)}
        >
          {ORIGENES.map(o => (
            <option key={o.id} value={o.id}>{o.label}</option>
          ))}
        </select>
      </Field>

      <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">
        Calcular precio total
      </Button>
    </form>
  )
}
