import { useEffect, useState } from 'react'
import {
  getCategoriasAdmin,
  crearCategoria, actualizarCategoria, eliminarCategoria,
  crearSubcategoria, actualizarSubcategoria, eliminarSubcategoria,
} from '../../api/categorias'
import { useCategorias } from '../../context/CategoriaContext'
import Button from '../../components/ui/Button'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

const inputCls = 'w-full border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-hornet-gold bg-white'

function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md">
        <div className="flex items-center justify-between bg-hornet-dark text-white px-5 py-3">
          <p className="font-black text-sm uppercase tracking-widest">{title}</p>
          <button onClick={onClose} className="text-white/70 hover:text-white text-lg">✕</button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

// ── Modal para crear/editar categoría ────────────────────────────────────────
function CategoriaModal({ categoria, onClose, onGuardado }) {
  const esNueva = !categoria
  const [id, setId]         = useState(categoria?.id || '')
  const [nombre, setNombre] = useState(categoria?.nombre || '')
  const [orden, setOrden]   = useState(categoria?.orden ?? 0)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const handleGuardar = async () => {
    if (!nombre.trim() || (!esNueva ? false : !id.trim())) {
      setError('Completá todos los campos.')
      return
    }
    setLoading(true)
    setError(null)
    try {
      if (esNueva) {
        await crearCategoria({ id: id.trim().toLowerCase().replace(/\s+/g, '_'), nombre: nombre.trim(), orden })
      } else {
        await actualizarCategoria(categoria.id, { nombre: nombre.trim(), orden, activo: categoria.activo })
      }
      onGuardado()
    } catch (e) {
      setError(e.response?.data?.message || 'Error al guardar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={esNueva ? 'Nueva categoría' : 'Editar categoría'} onClose={onClose}>
      <div className="space-y-3">
        {esNueva && (
          <div>
            <label className="block text-xs font-medium text-hornet-dark mb-1">
              ID (slug, ej: autopartes) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={id}
              onChange={e => setId(e.target.value.toLowerCase().replace(/\s+/g, '_'))}
              placeholder="autopartes"
              className={inputCls}
            />
            <p className="text-xs text-hornet-muted mt-1">Minúsculas, sin espacios. No se puede cambiar después.</p>
          </div>
        )}
        <div>
          <label className="block text-xs font-medium text-hornet-dark mb-1">Nombre *</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Autopartes" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-hornet-dark mb-1">Orden</label>
          <input type="number" value={orden} onChange={e => setOrden(Number(e.target.value))} className={inputCls} />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button loading={loading} onClick={handleGuardar} className="flex-1">Guardar</Button>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </Modal>
  )
}

// ── Modal para crear/editar subcategoría ─────────────────────────────────────
function SubcategoriaModal({ subcategoria, categoriaId, onClose, onGuardado }) {
  const esNueva = !subcategoria
  const [nombre, setNombre] = useState(subcategoria?.nombre || '')
  const [orden, setOrden]   = useState(subcategoria?.orden ?? 0)
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)

  const handleGuardar = async () => {
    if (!nombre.trim()) { setError('El nombre es requerido.'); return }
    setLoading(true)
    setError(null)
    try {
      if (esNueva) {
        await crearSubcategoria(categoriaId, { nombre: nombre.trim(), orden })
      } else {
        await actualizarSubcategoria(subcategoria.id, { nombre: nombre.trim(), orden })
      }
      onGuardado()
    } catch (e) {
      setError(e.response?.data?.message || 'Error al guardar.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal title={esNueva ? 'Nueva subcategoría' : 'Editar subcategoría'} onClose={onClose}>
      <div className="space-y-3">
        <div>
          <label className="block text-xs font-medium text-hornet-dark mb-1">Nombre *</label>
          <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Frenos" className={inputCls} />
        </div>
        <div>
          <label className="block text-xs font-medium text-hornet-dark mb-1">Orden</label>
          <input type="number" value={orden} onChange={e => setOrden(Number(e.target.value))} className={inputCls} />
        </div>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <div className="flex gap-3 pt-2">
          <Button loading={loading} onClick={handleGuardar} className="flex-1">Guardar</Button>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
        </div>
      </div>
    </Modal>
  )
}

// ── Fila de categoría con subcategorías expandibles ──────────────────────────
function CategoriaRow({ cat, onRefresh }) {
  const [expandida, setExpandida] = useState(false)
  const [editando, setEditando] = useState(false)
  const [nuevaSub, setNuevaSub] = useState(false)
  const [editandoSub, setEditandoSub] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleToggle = async () => {
    setLoading(true)
    try {
      await actualizarCategoria(cat.id, { nombre: cat.nombre, orden: cat.orden, activo: !cat.activo })
      onRefresh()
    } finally {
      setLoading(false)
    }
  }

  const handleEliminarSub = async (sub) => {
    if (!confirm(`¿Desactivar subcategoría "${sub.nombre}"?`)) return
    await eliminarSubcategoria(sub.id)
    onRefresh()
  }

  return (
    <div className={`border ${cat.activo ? 'border-neutral-200 bg-white' : 'border-neutral-100 bg-neutral-50 opacity-60'}`}>
      {/* Cabecera categoría */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-3">
        <div
          className="flex items-center gap-3 cursor-pointer flex-1 min-w-0"
          onClick={() => setExpandida(e => !e)}
        >
          <span className="text-hornet-muted text-xs">{expandida ? '▼' : '▶'}</span>
          <div>
            <p className="font-black text-hornet-dark text-sm">{cat.nombre}</p>
            <p className="text-xs text-hornet-muted">
              ID: <code className="font-mono">{cat.id}</code> · orden {cat.orden} ·{' '}
              {cat.subcategorias.length} subcategoría{cat.subcategorias.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        <div className="flex gap-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 border ${cat.activo ? 'bg-green-100 text-green-800 border-green-200' : 'bg-neutral-100 text-neutral-600 border-neutral-200'}`}>
            {cat.activo ? 'Activa' : 'Inactiva'}
          </span>
          <Button size="sm" variant="ghost" onClick={() => setEditando(true)}>Editar</Button>
          <Button size="sm" variant="outline" loading={loading} onClick={handleToggle}>
            {cat.activo ? 'Desactivar' : 'Activar'}
          </Button>
        </div>
      </div>

      {/* Subcategorías */}
      {expandida && (
        <div className="border-t border-neutral-100 px-4 py-3 space-y-2">
          {cat.subcategorias.length === 0 && (
            <p className="text-xs text-hornet-muted">Sin subcategorías.</p>
          )}
          {cat.subcategorias.map(s => (
            <div key={s.id} className={`flex items-center justify-between gap-2 p-2 border ${s.activo ? 'border-neutral-200 bg-neutral-50' : 'border-neutral-100 bg-neutral-100 opacity-50'}`}>
              <div>
                <p className="text-sm text-hornet-dark">{s.nombre}</p>
                <p className="text-xs text-hornet-muted">orden {s.orden} · {s.activo ? 'activa' : 'inactiva'}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="ghost" onClick={() => setEditandoSub(s)}>Editar</Button>
                <Button size="sm" variant="danger" onClick={() => handleEliminarSub(s)}>✕</Button>
              </div>
            </div>
          ))}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setNuevaSub(true)}
            className="mt-2"
          >
            + Nueva subcategoría
          </Button>
        </div>
      )}

      {editando && (
        <CategoriaModal
          categoria={cat}
          onClose={() => setEditando(false)}
          onGuardado={() => { setEditando(false); onRefresh() }}
        />
      )}

      {nuevaSub && (
        <SubcategoriaModal
          categoriaId={cat.id}
          onClose={() => setNuevaSub(false)}
          onGuardado={() => { setNuevaSub(false); onRefresh() }}
        />
      )}

      {editandoSub && (
        <SubcategoriaModal
          subcategoria={editandoSub}
          categoriaId={cat.id}
          onClose={() => setEditandoSub(null)}
          onGuardado={() => { setEditandoSub(null); onRefresh() }}
        />
      )}
    </div>
  )
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function CategoriasAdminPage() {
  const { categorias: contexto } = useCategorias()
  const [categorias, setCategorias] = useState([])
  const [loading, setLoading] = useState(true)
  const [creando, setCreando] = useState(false)

  const cargar = () => {
    setLoading(true)
    getCategoriasAdmin()
      .then(r => setCategorias(r.data ?? []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { cargar() }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-hornet-dark">Categorías</h1>
          <p className="text-hornet-muted mt-1">
            {categorias.length} categorías · los cambios se reflejan inmediatamente en la tienda.
          </p>
        </div>
        <Button onClick={() => setCreando(true)}>+ Nueva categoría</Button>
      </div>

      <div className="space-y-2">
        {categorias.map(c => (
          <CategoriaRow key={c.id} cat={c} onRefresh={cargar} />
        ))}
      </div>

      {categorias.length === 0 && (
        <div className="text-center py-16 border border-dashed border-neutral-300 text-hornet-muted">
          No hay categorías. Creá la primera.
        </div>
      )}

      {creando && (
        <CategoriaModal
          onClose={() => setCreando(false)}
          onGuardado={() => { setCreando(false); cargar() }}
        />
      )}
    </div>
  )
}
