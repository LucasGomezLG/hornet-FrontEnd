import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export const useToast = () => useContext(ToastContext)

const ICONS = {
  success: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  ),
  error: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  ),
  warning: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
    </svg>
  ),
  info: (
    <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
}

const STYLES = {
  success: 'bg-white border-l-4 border-hornet-success text-hornet-success',
  error:   'bg-white border-l-4 border-hornet-error   text-hornet-error',
  warning: 'bg-white border-l-4 border-yellow-500     text-yellow-700',
  info:    'bg-white border-l-4 border-blue-500        text-blue-700',
}

function Toast({ id, message, type, onRemove }) {
  return (
    <div
      className={`flex items-start gap-3 px-4 py-3 shadow-lg min-w-[260px] max-w-sm cursor-pointer ${STYLES[type]}`}
      style={{ animation: 'toast-in 0.3s ease forwards' }}
      onClick={() => onRemove(id)}
      role="alert"
    >
      <span className="mt-0.5">{ICONS[type]}</span>
      <p className="text-sm font-medium text-hornet-dark flex-1">{message}</p>
      <button className="text-hornet-muted hover:text-hornet-dark transition-colors ml-1 mt-0.5">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}

function ToastContainer({ toasts, onRemove }) {
  if (toasts.length === 0) return null
  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(t => (
        <div key={t.id} className="pointer-events-auto">
          <Toast {...t} onRemove={onRemove} />
        </div>
      ))}
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const remove = useCallback((id) => {
    setToasts(t => t.filter(x => x.id !== id))
  }, [])

  const add = useCallback((message, type = 'info', duration = 4000) => {
    const id = Date.now() + Math.random()
    setToasts(t => [...t.slice(-4), { id, message, type }])
    if (duration > 0) setTimeout(() => remove(id), duration)
  }, [remove])

  const toast = {
    success: (msg, dur)  => add(msg, 'success', dur),
    error:   (msg, dur)  => add(msg, 'error',   dur),
    warning: (msg, dur)  => add(msg, 'warning',  dur),
    info:    (msg, dur)  => add(msg, 'info',     dur),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onRemove={remove} />
    </ToastContext.Provider>
  )
}
