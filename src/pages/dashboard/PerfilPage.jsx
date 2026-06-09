import { useEffect, useRef, useState } from 'react'
import { getPerfil, actualizarPerfil } from '../../api/perfil'
import { formatFecha } from '../../lib/utils'
import Button from '../../components/ui/Button'
import { PageSpinner } from '../../components/ui/LoadingSpinner'
import { cn } from '../../lib/utils'

const TIPO_LABELS = {
  particular: 'Particular',
  mayorista:  'Mayorista',
  vendedor:   'Vendedor',
  admin:      'Administrador',
}

const inputCls = 'w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold bg-white'
function validarCuit(cuit) {
  if (!cuit) return null
  if (/^\d{11}$/.test(cuit)) return null
  if (/^\d{2}-\d{8}-\d$/.test(cuit)) return null
  return 'Formato inválido. Usá: XX-XXXXXXXX-X o 11 dígitos'
}

export default function PerfilPage() {
  const [perfil, setPerfil] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState(null)

  const [form, setForm] = useState({ nombre: '', apellido: '', telefono: '', cuit: '' })
  const savedTimerRef = useRef(null)

  useEffect(() => {
    return () => { if (savedTimerRef.current) clearTimeout(savedTimerRef.current) }
  }, [])

  useEffect(() => {
    getPerfil()
      .then(r => {
        setPerfil(r.data)
        setForm({
          nombre:   r.data.nombre   || '',
          apellido: r.data.apellido || '',
          telefono: r.data.telefono || '',
          cuit:     r.data.cuit     || '',
        })
      })
      .finally(() => setLoading(false))
  }, [])

  const set = (field, value) => setForm(f => ({ ...f, [field]: value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    const cuitError = validarCuit(form.cuit)
    if (cuitError) { setError(cuitError); return }
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      const r = await actualizarPerfil({
        nombre:   form.nombre   || null,
        apellido: form.apellido || null,
        telefono: form.telefono || null,
        cuit:     form.cuit     || null,
      })
      setPerfil(r.data)
      setSaved(true)
      if (savedTimerRef.current) clearTimeout(savedTimerRef.current)
      savedTimerRef.current = setTimeout(() => setSaved(false), 3000)
    } catch {
      setError('Error al guardar. Intentá de nuevo.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-hornet-dark">Mi perfil</h1>
        <p className="text-hornet-muted mt-1">Actualizá tus datos de contacto.</p>
      </div>

      {/* Info de cuenta */}
      <div className="border border-neutral-200 bg-white p-5 mb-6">
        <h2 className="text-xs font-black text-hornet-muted uppercase tracking-widest mb-3">Cuenta</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-hornet-muted text-xs mb-0.5">Email</p>
            <p className="text-hornet-dark font-medium">{perfil?.email}</p>
          </div>
          <div>
            <p className="text-hornet-muted text-xs mb-0.5">Tipo de cuenta</p>
            <p className="text-hornet-dark font-medium">{TIPO_LABELS[perfil?.tipo] || perfil?.tipo}</p>
          </div>
          <div>
            <p className="text-hornet-muted text-xs mb-0.5">Miembro desde</p>
            <p className="text-hornet-dark font-medium">{formatFecha(perfil?.createdAt)}</p>
          </div>
        </div>
      </div>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="border border-neutral-200 bg-white p-5">
        <h2 className="text-xs font-black text-hornet-muted uppercase tracking-widest mb-4">Datos personales</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium text-hornet-dark mb-1">Nombre</label>
            <input type="text" value={form.nombre} maxLength={100}
              onChange={e => set('nombre', e.target.value)}
              placeholder="Juan" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-hornet-dark mb-1">Apellido</label>
            <input type="text" value={form.apellido} maxLength={100}
              onChange={e => set('apellido', e.target.value)}
              placeholder="Pérez" className={inputCls} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-hornet-dark mb-1">Teléfono</label>
            <input type="tel" value={form.telefono} maxLength={30}
              onChange={e => set('telefono', e.target.value)}
              placeholder="+54 11 1234-5678" className={inputCls} />
          </div>
          <div>
            <label className="block text-sm font-medium text-hornet-dark mb-1">
              CUIT / CUIL
              <span className="text-hornet-muted font-normal ml-1 text-xs">(para trámites aduaneros)</span>
            </label>
            <input type="text" value={form.cuit} maxLength={13}
              onChange={e => set('cuit', e.target.value)}
              placeholder="20-12345678-9"
              className={`${inputCls} ${form.cuit && validarCuit(form.cuit) ? 'border-red-400 focus:ring-red-400' : ''}`} />
            {form.cuit && validarCuit(form.cuit) && (
              <p className="text-xs text-red-600 mt-1">{validarCuit(form.cuit)}</p>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 border border-hornet-error bg-hornet-error-bg text-sm text-hornet-error">
            {error}
          </div>
        )}
        {saved && (
          <div className="mb-4 p-3 border border-hornet-success bg-hornet-success-bg text-sm text-hornet-success">
            Perfil actualizado correctamente.
          </div>
        )}

        <Button type="submit" variant="primary" loading={saving}>
          Guardar cambios
        </Button>
      </form>

      <div className="mt-6 p-4 bg-neutral-50 border border-neutral-200 text-xs text-hornet-muted">
        Tu cuenta usa Google para autenticarse. El email no puede cambiarse desde acá.
        Para importaciones mayoristas con factura, el CUIT es requerido.
      </div>
    </div>
  )
}
