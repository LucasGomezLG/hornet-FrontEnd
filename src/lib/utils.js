import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// Formatea número como ARS: 138901.5 → "$138.901,50"
export function formatARS(amount) {
  if (amount == null) return '-'
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Formatea número como USD: 102.89 → "USD 102,89"
export function formatUSD(amount) {
  if (amount == null) return '-'
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

// Formatea fecha a dd/mm/aaaa: "2024-03-15T..." → "15/03/2024"
export function formatFecha(isoString) {
  if (!isoString) return '-'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date(isoString))
}

// Formatea fecha con hora: "15/03/2024 14:30"
export function formatFechaHora(isoString) {
  if (!isoString) return '-'
  return new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Argentina/Buenos_Aires',
  }).format(new Date(isoString))
}

// Labels en español para los estados de pedido
export const ESTADO_PEDIDO_LABELS = {
  // Legacy
  en_proceso:           'En proceso',
  comprado:             'Comprado',
  // Nuevo completo
  esperando_sena:       'Esperando seña',
  sena_confirmada:      'Seña confirmada',
  // Forwarding
  confirmado_sin_pago:  'Confirmado',
  // Logística compartida
  en_transito:          'En tránsito',
  en_aduana:            'En aduana',
  // Pago final
  esperando_saldo:      'Esperando saldo',
  saldo_confirmado:     'Saldo confirmado',
  esperando_pago:       'Esperando pago',
  pago_confirmado:      'Pago confirmado',
  // Finales
  entregado:            'Entregado',
  cancelado:            'Cancelado',
}

// Labels en español para los estados de cotización (legacy)
export const ESTADO_COTIZACION_LABELS = {
  pendiente: 'Pendiente revisión',
  aprobada:  'Aprobada',
  rechazada: 'Rechazada',
  expirada:  'Expirada',
  procesada: 'Procesada',
}

// Labels para solicitudes (nuevo flujo)
export const ESTADO_SOLICITUD_LABELS = {
  pendiente:  'Pendiente revisión',
  cotizada:   'Cotizada',
  procesada:  'Procesada',
  cancelada:  'Cancelada',
  expirada:   'Expirada',
}

export const ESTADO_ITEM_LABELS = {
  pendiente:   'Pendiente',
  aprobado:    'Aprobado',
  rechazado:   'Rechazado',
  confirmado:  'Confirmado',
  expirado:    'Expirado',
}
