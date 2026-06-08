import { cn } from '../../lib/utils'

export default function LoadingSpinner({ size = 'md', className }) {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-10 h-10' }
  return (
    <div
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        sizes[size],
        className
      )}
      role="status"
      aria-label="Cargando"
    />
  )
}

// Spinner de página completa — cubre el viewport
export function PageSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
      <LoadingSpinner size="lg" className="text-hornet-gold" />
    </div>
  )
}
