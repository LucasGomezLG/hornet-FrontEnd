import { useEffect, useState } from 'react'
import {
  getTiendaAdmin, crearTiendaProducto, actualizarTiendaProducto,
  toggleTiendaProducto, eliminarTiendaProducto, getFirmaImagenAdmin,
} from '../../api/admin'
import { formatARS, formatUSD } from '../../lib/utils'
import { CATEGORIAS } from '../../lib/categorias'
import Button from '../../components/ui/Button'
import ImageUploader from '../../components/ui/ImageUploader'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

const EMPTY_FORM = {
  nombre: '', descripcion: '', categoria: '',
  precioUsd: '', stock: '0', destacado: false, imagenUrl: '',
}

const inputCls = 'w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold bg-white'

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

export default function TiendaAdminPage() {
  const [productos, setProductos] = useState([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const cargar = () => {
    setLoading(true)
    getTiendaAdmin().then(r => setProductos(r.data.content ?? [])).finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  const set = (f, v) => setForm(prev => ({ ...prev, [f]: v }))

  const abrirCrear = () => {
    setForm(EMPTY_FORM)
    setError(null)
    setModal('crear')
  }

  const abrirEditar = (p) => {
    setForm({
      nombre:      p.nombre      || '',
      descripcion: p.descripcion || '',
      categoria:   p.categoria   || '',
      precioUsd:   p.precioUsd   || '',
      stock:       p.stock != null ? String(p.stock) : '0',
      destacado:   p.destacado   || false,
      imagenUrl:   p.imagenUrl   || '',
    })
    setError(null)
    setModal(p)
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
      destacado:   form.destacado,
      imagenUrl:   form.imagenUrl || null,
    }
    try {
      if (modal === 'crear') {
        await crearTiendaProducto(payload)
      } else {
        await actualizarTiendaProducto(modal.id, payload)
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
    await toggleTiendaProducto(id)
    cargar()
  }

  const handleEliminar = async (id) => {
    if (!confirm('¿Eliminar este producto?')) return
    await eliminarTiendaProducto(id)
    cargar()
  }

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-hornet-dark">Tienda</h1>
          <p className="text-hornet-muted mt-1">{productos.length} productos.</p>
        </div>
        <Button variant="primary" onClick={abrirCrear}>+ Nuevo producto</Button>
      </div>

      {productos.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-300 text-hornet-muted">
          No hay productos en la tienda.
        </div>
      ) : (
        <div className="overflow-x-auto border border-neutral-200 bg-white">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-hornet-dark text-white text-xs uppercase tracking-widest">
                <th className="px-4 py-3 text-left">Imagen</th>
                <th className="px-4 py-3 text-left">Nombre</th>
                <th className="px-4 py-3 text-left">Categoría</th>
                <th className="px-4 py-3 text-right">Precio USD</th>
                <th className="px-4 py-3 text-center">Stock</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((p, i) => (
                <tr key={p.id} className={`border-b border-neutral-100 ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 bg-hornet-surface overflow-hidden">
                      {p.imagenUrl
                        ? <img src={p.imagenUrl} alt={p.nombre} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-[10px] text-hornet-muted">Sin img</div>
                      }
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-hornet-dark line-clamp-1 max-w-[180px]">{p.nombre}</p>
                    {p.destacado && <span className="text-[10px] bg-hornet-gold text-hornet-dark px-1.5 py-0.5">Destacado</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-hornet-muted">{p.categoria}</td>
                  <td className="px-4 py-3 text-right font-black text-hornet-dark text-xs">{formatUSD(p.precioUsd)}</td>
                  <td className="px-4 py-3 text-center text-hornet-dark">{p.stock}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={`text-xs px-2 py-0.5 border ${p.activo !== false ? 'bg-green-100 text-green-800 border-green-200' : 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
                      {p.activo !== false ? 'Activo' : 'Pausado'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 justify-center">
                      <Button variant="outline" size="sm" onClick={() => handleToggle(p.id)}>
                        {p.activo !== false ? 'Pausar' : 'Activar'}
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => abrirEditar(p)}>Editar</Button>
                      <Button variant="danger" size="sm" onClick={() => handleEliminar(p.id)}>✕</Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modal && (
        <Modal
          title={modal === 'crear' ? 'Nuevo producto' : 'Editar producto'}
          onClose={() => setModal(null)}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-hornet-dark mb-1">Imagen</label>
              <ImageUploader
                getFirma={() => getFirmaImagenAdmin(modal !== 'crear' ? modal.id : undefined)}
                currentUrl={form.imagenUrl}
                onUploaded={url => set('imagenUrl', url)} />
            </div>

            <div>
              <label className="block text-sm font-medium text-hornet-dark mb-1">Nombre *</label>
              <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)} className={inputCls} />
            </div>

            <div>
              <label className="block text-sm font-medium text-hornet-dark mb-1">Categoría *</label>
              <select value={form.categoria} onChange={e => set('categoria', e.target.value)} className={inputCls}>
                <option value="">Seleccioná...</option>
                {CATEGORIAS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
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

            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={form.destacado} onChange={e => set('destacado', e.target.checked)} />
              <span className="text-sm text-hornet-dark">Marcar como destacado</span>
            </label>

            {error && (
              <div className="p-3 border border-hornet-error bg-hornet-error-bg text-sm text-hornet-error">{error}</div>
            )}

            <div className="flex gap-3 pt-2">
              <Button variant="primary" loading={saving} onClick={handleGuardar} className="flex-1">Guardar</Button>
              <Button variant="outline" onClick={() => setModal(null)}>Cancelar</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
