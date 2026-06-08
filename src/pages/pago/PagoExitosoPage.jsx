import { useSearchParams, Link } from 'react-router'
import Button from '../../components/ui/Button'

export default function PagoExitosoPage() {
  const [params] = useSearchParams()
  const pedidoId = params.get('external_reference')

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">✅</div>
      <h1 className="text-3xl font-black text-hornet-dark mb-2">¡Pago exitoso!</h1>
      <p className="text-hornet-muted mb-2">
        Tu pago fue procesado correctamente.
      </p>
      {pedidoId && (
        <p className="text-sm text-hornet-muted mb-6">
          N.° de pedido: <span className="font-black text-hornet-dark">{pedidoId}</span>
        </p>
      )}
      <div className="bg-hornet-success-bg border border-hornet-success p-4 text-sm text-hornet-success mb-8">
        Tu pedido ya está activo. El equipo comenzará con el proceso de compra e importación.
        Te mantenemos al tanto por email en cada paso.
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/pedidos">
          <Button variant="primary" size="lg">Ver mis pedidos →</Button>
        </Link>
        <Link to="/seguimiento">
          <Button variant="outline" size="lg">Seguimiento</Button>
        </Link>
      </div>
    </div>
  )
}
