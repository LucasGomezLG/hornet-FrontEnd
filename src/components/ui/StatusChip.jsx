import { cn } from '../../lib/utils'
import { ESTADO_PEDIDO_LABELS, ESTADO_COTIZACION_LABELS } from '../../lib/utils'

const PEDIDO_STYLES = {
  en_proceso:  'bg-blue-100 text-blue-800 border-blue-200',
  comprado:    'bg-green-100 text-green-800 border-green-200',
  en_transito: 'bg-orange-100 text-orange-800 border-orange-200',
  en_aduana:   'bg-yellow-100 text-yellow-800 border-yellow-200',
  entregado:   'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelado:   'bg-red-100 text-red-800 border-red-200',
}

const COTIZACION_STYLES = {
  pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  aprobada:  'bg-green-100 text-green-800 border-green-200',
  rechazada: 'bg-red-100 text-red-800 border-red-200',
  expirada:  'bg-neutral-100 text-neutral-600 border-neutral-200',
  procesada: 'bg-blue-100 text-blue-800 border-blue-200',
}

export default function StatusChip({ estado, tipo = 'pedido', className }) {
  const styles = tipo === 'cotizacion' ? COTIZACION_STYLES : PEDIDO_STYLES
  const labels = tipo === 'cotizacion' ? ESTADO_COTIZACION_LABELS : ESTADO_PEDIDO_LABELS

  const style = styles[estado] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200'
  const label = labels[estado] ?? estado

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 text-xs font-medium border',
        style,
        className
      )}
    >
      {label}
    </span>
  )
}
