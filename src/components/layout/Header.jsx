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
        <div
          className="md:hidden bg-hornet-dark border-t border-neutral-800"
          style={{ animation: 'menu-slide-down 0.2s ease' }}
        >
          {/* Nav principal */}
          <nav className="px-2 pt-2 pb-1">
            {NAV_LINKS.map(({ to, label }) => {
              const active = location.pathname.startsWith(to)
              return (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    'flex items-center justify-between px-3 py-3.5 border-b border-neutral-800 text-sm font-medium transition-colors',
                    active ? 'text-hornet-gold' : 'text-white/90 hover:text-white'
                  )}
                >
                  {label}
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-hornet-gold" />}
                </Link>
              )
            })}
          </nav>

          {/* Sección usuario */}
          <div className="px-2 pt-1 pb-4">
            {user ? (
              <>
                {/* Avatar + nombre */}
                <div className="flex items-center gap-3 px-3 py-3 mb-1">
                  <span className="w-9 h-9 rounded-full bg-hornet-gold text-hornet-dark flex items-center justify-center text-sm font-black shrink-0">
                    {(user.nombre || user.email).charAt(0).toUpperCase()}
                  </span>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{user.nombre || user.email}</p>
                    <p className="text-hornet-muted text-xs capitalize">{user.tipo}</p>
                  </div>
                </div>

                {/* Links de cuenta */}
                {user.tipo === 'admin' && (
                  <MobileLink to="/admin" onClick={() => setMobileOpen(false)} label="Panel admin" icon="⚙️" />
                )}
                <MobileLink to="/dashboard"    onClick={() => setMobileOpen(false)} label="Mi dashboard"      icon="📊" />
                <MobileLink to="/pedidos"      onClick={() => setMobileOpen(false)} label="Mis pedidos"        icon="📦" />
                <MobileLink to="/cotizaciones" onClick={() => setMobileOpen(false)} label="Mis cotizaciones"   icon="🧾" />
                <MobileLink to="/perfil"       onClick={() => setMobileOpen(false)} label="Mi perfil"          icon="👤" />
                {user.tipo === 'vendedor' && (
                  <MobileLink to="/vendedor/productos" onClick={() => setMobileOpen(false)} label="Mis productos" icon="🏪" />
                )}

                {/* Cerrar sesión */}
                <button
                  onClick={() => { setMobileOpen(false); handleLogout() }}
                  className="flex items-center gap-3 w-full px-3 py-3.5 mt-1 border-t border-neutral-800 text-hornet-error text-sm font-medium hover:bg-red-950/30 transition-colors"
                >
                  <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="px-2 pt-2">
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center bg-hornet-gold text-hornet-dark text-sm font-black py-3.5"
                >
                  Ingresar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  )
}

function MobileLink({ to, label, icon, onClick }) {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="flex items-center gap-3 px-3 py-3 text-white/80 hover:text-white hover:bg-white/5 transition-colors text-sm"
    >
      {icon && <span className="text-base w-5 text-center">{icon}</span>}
      {label}
    </Link>
  )
}
