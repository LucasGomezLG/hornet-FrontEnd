import { Link } from 'react-router'
import { formatARS, formatUSD } from '../../lib/utils'

export default function ListingCard({ listing }) {
  const { id, nombre, precioUsd, precioArs, imagenUrl, categoria, vendedorNombre } = listing
  return (
    <Link to={`/marketplace/${id}`}
      className="group border border-neutral-200 bg-white hover:border-hornet-gold transition-colors flex flex-col">
      <div className="aspect-square bg-hornet-surface overflow-hidden">
        {imagenUrl
          ? <img src={imagenUrl} alt={nombre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
          : <div className="w-full h-full flex items-center justify-center text-hornet-muted text-sm">Sin imagen</div>
        }
      </div>
      <div className="p-3 flex flex-col gap-1 flex-1">
        {categoria && (
          <span className="text-xs text-hornet-muted uppercase tracking-wide">{categoria}</span>
        )}
        <p className="text-sm font-medium text-hornet-dark line-clamp-2 flex-1">{nombre}</p>
        <div className="mt-2">
          {precioArs != null && (
            <p className="text-lg font-black text-hornet-dark">{formatARS(precioArs)}</p>
          )}
          {precioUsd != null && (
            <p className="text-xs text-hornet-muted">{formatUSD(precioUsd)}</p>
          )}
        </div>
        {vendedorNombre && (
          <p className="text-xs text-hornet-muted border-t border-neutral-100 pt-1 mt-1">
            Vendedor: {vendedorNombre}
          </p>
        )}
      </div>
    </Link>
  )
}
