import { useEffect, useState } from 'react'
import {
  getMisProductos, crearListing, actualizarListing,
  toggleListing, eliminarListing, getFirmaImagen,
} from '../../api/vendedor'
import { formatARS, formatUSD } from '../../lib/utils'
import { useCategorias } from '../../context/CategoriaContext'
import Button from '../../components/ui/Button'
import ImageUploader from '../../components/ui/ImageUploader'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

const EMPTY_FORM = {
  nombre: '', descripcion: '', categoria: '',
  precioUsd: '', stock: '0', imagenUrl: '',
}

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between bg-hornet-dark text-white px-5 py-3">
          <p className="font-black text-sm uppercase tracking-widest">{title}</p>
          <button onClick={onClose} className="text-white/70 hover:text-white text-lg">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

const inputCls = 'w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold bg-white'

export default function ProductosPage() {
  const { categorias } = useCategorias()
  const [listings, setListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null) // null | 'crear' | listing
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const cargar = () => {
    setLoading(true)
    getMisProductos().then(r => setListings(r.data.content ?? [])).finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }))

  const abrirCrear = () => {
    setForm(EMPTY_FORM)
    setError(null)
    setModal('crear')
  }

  const abrirEditar = (l) => {
    setForm({
      nombre:      l.nombre      || '',
      descripcion: l.descripcion || '',
      categoria:   l.categoria   || '',
      precioUsd:   l.precioUsd   || '',
      stock:       l.stock != null ? String(l.stock) : '0',
      imagenUrl:   l.imagenUrl   || '',
    })
    setError(null)
    setModal(l)
  }

  const handleGuardar = async () => {
    if (!form.nombre.trim() || !form.categoria || !form.precioUsd) {
      setError('Nombre, categoría y precio son requeridos.')
      return
    }
    setSaving(true)
    setError(null)
    const payload = {
      nombre:      form.nombre.trim(),
      descripcion: form.descripcion.trim() || null,
      categoria:   form.categoria,
      precioUsd:   Number(form.precioUsd),
      stock:       Number(form.stock) || 0,
      imagenUrl:   form.imagenUrl || null,
    }
    try {
      if (modal === 'crear') {
        await crearListing(payload)
      } else {
        await actualizarListing(modal.id, payload)
      }
      setModal(null)
      cargar()
    } catch (e) {
      setError(e.response?.data?.message || 'Error al guardar.')
    } finally {
      setSaving(false)
    }
  }

  const handleToggle = async (id) => {
    await toggleListing(id)
    cargar()
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar esta publicación?')) return
    await eliminarListing(id)
    cargar()
  }

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-hornet-dark">Mis publicaciones</h1>
          <p className="text-hornet-muted mt-1">Administrá tus productos en el marketplace.</p>
        </div>
        <Button variant="primary" onClick={abrirCrear}>+ Nueva publicación</Button>
      </div>

      {listings.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-300">
          <p className="text-4xl mb-3">🏪</p>
          <p className="font-medium text-hornet-dark mb-4">No tenés publicaciones activas.</p>
          <Button variant="primary" onClick={abrirCrear}>Crear primera publicación</Button>
        </div>
      ) : (
        <div className="space-y-3">
          {listings.map(l => (
            <div key={l.id} className="border border-neutral-200 bg-white flex items-center gap-4 p-4">
              <div className="w-16 h-16 shrink-0 bg-hornet-surface overflow-hidden">
                {l.imagenUrl
                  ? <img src={l.imagenUrl} alt={l.nombre} className="w-full h-full object-cover" />
                  : <div className="w-full h-full flex items-center justify-center text-xs text-hornet-muted">Sin img</div>
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-hornet-dark truncate">{l.nombre}</p>
                <p className="text-xs text-hornet-muted">{l.categoria} · Stock: {l.stock}</p>
                <p className="text-sm font-black text-hornet-dark mt-0.5">
                  {formatUSD(l.precioUsd)}
                  {l.precioArs && <span className="text-hornet-muted font-normal ml-2 text-xs">{formatARS(l.precioArs)}</span>}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
                <Button variant="outline" size="sm" onClick={() => handleToggle(l.id)}>
                  {l.activo !== false ? 'Pausar' : 'Activar'}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => abrirEditar(l)}>Editar</Button>
                <Button variant="danger" size="sm" onClick={() => handleEliminar(l.id)}>Eliminar</Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modal && (
        <Modal
          title={modal === 'crear' ? 'Nueva publicación' : 'Editar publicación'}
          onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-hornet-dark mb-1">Imagen</label>
              <ImageUploader
                getFirma={getFirmaImagen}
                currentUrl={form.imagenUrl}
                onUploaded={url => set('imagenUrl', url)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-hornet-dark mb-1">Nombre *</label>
              <input type="text" value={form.nombre} maxLength={200}
                onChange={e => set('nombre', e.target.value)} className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-medium text-hornet-dark mb-1">Categoría *</label>
              <select value={form.categoria} onChange={e => set('categoria', e.target.value)} className={inputCls}>
                <option value="">Seleccioná...</option>
                {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-hornet-dark mb-1">Precio USD *</label>
                <input type="number" min="0.01" step="0.01" value={form.precioUsd}
                  onChange={e => set('precioUsd', e.target.value)} className={inputCls} />
              </div>
              <div>
                <label className="block text-sm font-medium text-hornet-dark mb-1">Stock</label>
                <input type="number" min="0" value={form.stock}
                  onChange={e => set('stock', e.target.value)} className={inputCls} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-hornet-dark mb-1">Descripción</label>
              <textarea value={form.descripcion} rows={3}
                onChange={e => set('descripcion', e.target.value)}
                className={inputCls + ' resize-none'} />
            </div>

            {error && (
              <div className="p-3 border border-hornet-error bg-hornet-error-bg text-sm text-hornet-error">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="primary" loading={saving} onClick={handleGuardar} className="flex-1">
                Guardar
              </Button>
              <Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
