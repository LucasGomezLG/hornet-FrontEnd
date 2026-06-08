import { useSearchParams, Link } from 'react-router'
import Button from '../../components/ui/Button'

export default function PagoPendientePage() {
  const [params] = useSearchParams()
  const pedidoId = params.get('external_reference')

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">⏳</div>
      <h1 className="text-3xl font-black text-hornet-dark mb-2">Pago pendiente</h1>
      <p className="text-hornet-muted mb-2">
        Tu pago está siendo procesado por MercadoPago.
      </p>
      {pedidoId && (
        <p className="text-sm text-hornet-muted mb-6">
          N.° de pedido: <span className="font-black text-hornet-dark">{pedidoId}</span>
        </p>
      )}
      <div className="bg-hornet-warning-bg border border-hornet-warning p-4 text-sm text-hornet-warning mb-8">
        Los pagos pendientes se confirman generalmente en minutos. Cuando MP procese el pago,
        te notificamos por email y tu pedido quedará activo automáticamente.
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/pedidos">
          <Button variant="primary" size="lg">Ver mis pedidos →</Button>
        </Link>
        <Link to="/dashboard">
          <Button variant="outline" size="lg">Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
