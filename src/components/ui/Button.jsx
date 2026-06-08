import { cn } from '../../lib/utils'
import LoadingSpinner from './LoadingSpinner'

const variants = {
  primary:   'bg-hornet-gold text-hornet-dark font-black hover:brightness-95 border border-hornet-gold',
  secondary: 'bg-hornet-dark text-white font-black hover:bg-neutral-800 border border-hornet-dark',
  outline:   'bg-transparent text-hornet-dark border border-hornet-dark hover:bg-hornet-surface',
  ghost:     'bg-transparent text-hornet-dark hover:bg-hornet-surface border border-transparent',
  danger:    'bg-hornet-error text-white font-black hover:brightness-95 border border-hornet-error',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 transition-all duration-150 cursor-pointer',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && <LoadingSpinner size="sm" />}
      {children}
    </button>
  )
}
