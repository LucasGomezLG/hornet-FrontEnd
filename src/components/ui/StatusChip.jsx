import { cn } from '../../lib/utils'
import {
  ESTADO_PEDIDO_LABELS,
  ESTADO_COTIZACION_LABELS,
  ESTADO_SOLICITUD_LABELS,
  ESTADO_ITEM_LABELS,
} from '../../lib/utils'

const PEDIDO_STYLES = {
  en_proceso:          'bg-blue-100 text-blue-800 border-blue-200',
  comprado:            'bg-green-100 text-green-800 border-green-200',
  esperando_sena:      'bg-amber-100 text-amber-800 border-amber-200',
  sena_confirmada:     'bg-blue-100 text-blue-800 border-blue-200',
  confirmado_sin_pago: 'bg-sky-100 text-sky-800 border-sky-200',
  en_transito:         'bg-orange-100 text-orange-800 border-orange-200',
  en_aduana:           'bg-yellow-100 text-yellow-800 border-yellow-200',
  esperando_saldo:     'bg-amber-100 text-amber-800 border-amber-200',
  saldo_confirmado:    'bg-teal-100 text-teal-800 border-teal-200',
  esperando_pago:      'bg-amber-100 text-amber-800 border-amber-200',
  pago_confirmado:     'bg-teal-100 text-teal-800 border-teal-200',
  entregado:           'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelado:           'bg-red-100 text-red-800 border-red-200',
}

const COTIZACION_STYLES = {
  pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  aprobada:  'bg-green-100 text-green-800 border-green-200',
  rechazada: 'bg-red-100 text-red-800 border-red-200',
  expirada:  'bg-neutral-100 text-neutral-600 border-neutral-200',
  procesada: 'bg-blue-100 text-blue-800 border-blue-200',
}

const SOLICITUD_STYLES = {
  pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  cotizada:  'bg-blue-100 text-blue-800 border-blue-200',
  procesada: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  cancelada: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  expirada:  'bg-neutral-100 text-neutral-600 border-neutral-200',
}

const ITEM_STYLES = {
  pendiente:  'bg-yellow-100 text-yellow-800 border-yellow-200',
  aprobado:   'bg-green-100 text-green-800 border-green-200',
  rechazado:  'bg-red-100 text-red-800 border-red-200',
  confirmado: 'bg-blue-100 text-blue-800 border-blue-200',
  expirado:   'bg-neutral-100 text-neutral-600 border-neutral-200',
}

const STYLES_MAP = {
  pedido:    PEDIDO_STYLES,
  cotizacion: COTIZACION_STYLES,
  solicitud: SOLICITUD_STYLES,
  item:      ITEM_STYLES,
}

const LABELS_MAP = {
  pedido:    ESTADO_PEDIDO_LABELS,
  cotizacion: ESTADO_COTIZACION_LABELS,
  solicitud: ESTADO_SOLICITUD_LABELS,
  item:      ESTADO_ITEM_LABELS,
}

export default function StatusChip({ estado, tipo = 'pedido', className }) {
  const styles = STYLES_MAP[tipo] ?? PEDIDO_STYLES
  const labels = LABELS_MAP[tipo] ?? ESTADO_PEDIDO_LABELS

  const style = styles[estado] ?? 'bg-neutral-100 text-neutral-600 border-neutral-200'
  const label = labels[estado] ?? estado

  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 text-xs font-medium border',
      style, className
    )}>
      {label}
    </span>
  )
}
