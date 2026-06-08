import { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../lib/utils'

const NAV_LINKS = [
  { to: '/cotizar',     label: 'Cotizar' },
  { to: '/tienda',      label: 'Tienda' },
  { to: '/marketplace', label: 'Marketplace' },
]

function NavLink({ to, label, active, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className={cn(
        'text-sm font-medium transition-colors px-1',
        active ? 'text-hornet-gold' : 'text-white hover:text-hornet-gold'
      )}
    >
      {label}
    </Link>
  )
}

function UserDropdown({ user, onLogout }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    function close(e) { if (!ref.current?.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const displayName = user.nombre || user.email

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 text-white text-sm font-medium hover:text-hornet-gold transition-colors"
      >
        <span className="w-7 h-7 rounded-full bg-hornet-gold text-hornet-dark flex items-center justify-center text-xs font-black">
          {displayName.charAt(0).toUpperCase()}
        </span>
        <span className="hidden sm:block max-w-[140px] truncate">{displayName}</span>
        <svg className={cn('w-4 h-4 transition-transform', open && 'rotate-180')} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-neutral-200 shadow-lg z-50 py-1">
          {user.tipo === 'admin' && (
            <DropdownItem to="/admin" onClick={() => setOpen(false)} label="Panel admin" />
          )}
          <DropdownItem to="/dashboard" onClick={() => setOpen(false)} label="Mi dashboard" />
          <DropdownItem to="/pedidos"   onClick={() => setOpen(false)} label="Mis pedidos" />
          <DropdownItem to="/cotizaciones" onClick={() => setOpen(false)} label="Mis cotizaciones" />
          <DropdownItem to="/perfil"    onClick={() => setOpen(false)} label="Mi perfil" />
          {user.tipo === 'vendedor' && (
            <DropdownItem to="/vendedor/productos" onClick={() => setOpen(false)} label="Mis productos" />
          )}
          <div className="border-t border-neutral-100 mt-1 pt-1">
            <button
              onClick={() => { setOpen(false); onLogout() }}
              className="w-full text-left px-4 py-2 text-sm text-hornet-error hover:bg-red-50 transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function DropdownItem({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block px-4 py-2 text-sm text-hornet-dark hover:bg-hornet-surface transition-colors"
    >
      {label}
    </Link>
  )
}

export default function Header() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = async () => {
    await logout()
    navigate('/')
  }

  return (
    <header className="bg-hornet-dark sticky top-0 z-40 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img src="/logo.png" alt="Hornet Imports" className="h-8 w-auto" />
            <span className="text-hornet-gold font-black text-xl tracking-tight">HORNET</span>
            <span className="text-white font-medium text-xl tracking-tight">IMPORTS</span>
          </Link>

          {/* Nav desktop */}
          <nav className="hidden md:flex items-center gap-7">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                label={label}
                active={location.pathname.startsWith(to)}
              />
            ))}
          </nav>

          {/* Acciones desktop */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <UserDropdown user={user} onLogout={handleLogout} />
            ) : (
              <Link
                to="/login"
                className="bg-hornet-gold text-hornet-dark text-sm font-black px-4 py-2 hover:brightness-95 transition-all"
              >
                Ingresar
              </Link>
            )}
          </div>

          {/* Hamburger mobile */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Menú"
          >
            {mobileOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-hornet-dark border-t border-neutral-800 px-4 pb-4 space-y-1">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              label={label}
              active={location.pathname.startsWith(to)}
              onClick={() => setMobileOpen(false)}
            />
          ))}
          <div className="pt-3 border-t border-neutral-800 mt-2">
            {user ? (
              <div className="space-y-1">
                <p className="text-hornet-muted text-xs mb-2">{user.nombre || user.email}</p>
                {user.tipo === 'admin' && (
                  <MobileLink to="/admin" onClick={() => setMobileOpen(false)} label="Panel admin" />
                )}
                <MobileLink to="/dashboard"    onClick={() => setMobileOpen(false)} label="Dashboard" />
                <MobileLink to="/pedidos"      onClick={() => setMobileOpen(false)} label="Mis pedidos" />
                <MobileLink to="/cotizaciones" onClick={() => setMobileOpen(false)} label="Mis cotizaciones" />
                <MobileLink to="/perfil"       onClick={() => setMobileOpen(false)} label="Perfil" />
                {user.tipo === 'vendedor' && (
                  <MobileLink to="/vendedor/productos" onClick={() => setMobileOpen(false)} label="Mis productos" />
                )}
                <button
                  onClick={() => { setMobileOpen(false); handleLogout() }}
                  className="block text-hornet-error text-sm font-medium mt-2"
                >
                  Salir
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="block bg-hornet-gold text-hornet-dark text-sm font-black px-4 py-2 text-center"
              >
                Ingresar
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function MobileLink({ to, label, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="block text-white text-sm font-medium py-1 hover:text-hornet-gold transition-colors"
    >
      {label}
    </Link>
  )
}
