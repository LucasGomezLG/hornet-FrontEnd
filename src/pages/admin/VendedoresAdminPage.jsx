import { useEffect, useState } from 'react'
import { getVendedores } from '../../api/admin'
import { formatFecha } from '../../lib/utils'
import { PageSpinner } from '../../components/ui/LoadingSpinner'

export default function VendedoresAdminPage() {
  const [vendedores, setVendedores] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getVendedores().then(r => setVendedores(r.data)).finally(() => setLoading(false))
  }, [])

  if (loading) return <PageSpinner />

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black text-hornet-dark">Vendedores</h1>
        <p className="text-hornet-muted mt-1">{vendedores.length} vendedores habilitados.</p>
      </div>

      {vendedores.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-neutral-300 text-hornet-muted">
          No hay vendedores registrados.
        </div>
      ) : (
        <div className="border border-neutral-200 bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-hornet-dark text-white text-xs uppercase tracking-widest">
                <th className="px-4 py-3 text-left">Nombre / Email</th>
                <th className="px-4 py-3 text-center">Publicaciones</th>
                <th className="px-4 py-3 text-left">Miembro desde</th>
              </tr>
            </thead>
            <tbody>
              {vendedores.map((v, i) => (
                <tr key={v.id} className={`border-b border-neutral-100 ${i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
                  <td className="px-4 py-3">
                    {v.nombre && <p className="font-medium text-hornet-dark">{v.nombre}</p>}
                    <p className="text-xs text-hornet-muted">{v.email}</p>
                  </td>
                  <td className="px-4 py-3 text-center font-black text-hornet-dark">{v.cantidadListings}</td>
                  <td className="px-4 py-3 text-xs text-hornet-muted">{formatFecha(v.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
