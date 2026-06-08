import { Link } from 'react-router'

export default function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <p className="text-8xl font-black text-hornet-gold mb-4">404</p>
      <h1 className="text-2xl font-black text-hornet-dark mb-2">Página no encontrada</h1>
      <p className="text-hornet-muted mb-8 max-w-sm">
        La página que buscás no existe o fue movida.
      </p>
      <div className="flex gap-4">
        <Link
          to="/"
          className="bg-hornet-dark text-white font-black px-6 py-3 text-sm hover:bg-neutral-800 transition-colors"
        >
          Ir al inicio
        </Link>
        <Link
          to="/cotizar"
          className="bg-hornet-gold text-hornet-dark font-black px-6 py-3 text-sm hover:brightness-95 transition-all"
        >
          Cotizar producto
        </Link>
      </div>
    </div>
  )
}
