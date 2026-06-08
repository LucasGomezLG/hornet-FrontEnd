import { useSearchParams, Link } from 'react-router'
import Button from '../../components/ui/Button'

export default function PagoFallidoPage() {
  const [params] = useSearchParams()
  const pedidoId = params.get('external_reference')

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">❌</div>
      <h1 className="text-3xl font-black text-hornet-dark mb-2">Pago fallido</h1>
      <p className="text-hornet-muted mb-2">
        No pudimos procesar tu pago. No se realizó ningún cargo.
      </p>
      {pedidoId && (
        <p className="text-sm text-hornet-muted mb-6">
          N.° de pedido: <span className="font-black text-hornet-dark">{pedidoId}</span>
        </p>
      )}
      <div className="bg-hornet-error-bg border border-hornet-error p-4 text-sm text-hornet-error mb-8">
        Podés intentar de nuevo con otro método de pago. Si el problema persiste, contactanos.
      </div>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link to="/cotizaciones">
          <Button variant="primary" size="lg">Intentar de nuevo →</Button>
        </Link>
        <a href="mailto:soporte@hornetimports.com">
          <Button variant="outline" size="lg">Contactar soporte</Button>
        </a>
      </div>
    </div>
  )
}
