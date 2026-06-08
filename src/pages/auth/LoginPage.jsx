import { useEffect } from 'react'
import { useNavigate, useLocation, Link } from 'react-router'
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { useAuth } from '../../hooks/useAuth'
import { reclamarCotizacion } from '../../api/auth'

export default function LoginPage() {
  const { user, loading, loginWithGoogle } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const destino = location.state?.from || '/dashboard'

  // Si ya está logueado, redirigir directo
  useEffect(() => {
    if (!loading && user) navigate(destino, { replace: true })
  }, [user, loading, navigate, destino])

  const handleSuccess = async (credentialResponse) => {
    try {
      await loginWithGoogle(credentialResponse.credential)

      // Reclamar cotización anónima si había una pendiente
      const pendingId = sessionStorage.getItem('pendingCotizacionId')
      if (pendingId) {
        try { await reclamarCotizacion(pendingId) } catch { /* no bloquear el login */ }
        sessionStorage.removeItem('pendingCotizacionId')
      }

      navigate(destino, { replace: true })
    } catch {
      // El error lo muestra el componente de Google si falla el token
    }
  }

  if (loading) return null

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <div className="min-h-screen bg-hornet-surface flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-sm">

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <span className="text-hornet-gold font-black text-3xl tracking-tight">HORNET</span>
              <span className="text-hornet-dark font-medium text-3xl tracking-tight">IMPORTS</span>
            </div>
            <p className="text-hornet-muted text-sm">
              Importamos desde cualquier parte del mundo
            </p>
          </div>

          {/* Card */}
          <div className="bg-white border border-neutral-200 p-8">
            <h1 className="text-xl font-black text-hornet-dark mb-1">Ingresá a tu cuenta</h1>
            <p className="text-hornet-muted text-sm mb-6">
              Usamos Google para que no tengas que recordar otra contraseña.
            </p>

            <div className="flex justify-center">
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {}}
                useOneTap={false}
                text="signin_with"
                shape="rectangular"
                width="300"
              />
            </div>

            <p className="text-xs text-hornet-muted text-center mt-6 leading-relaxed">
              Al ingresar aceptás nuestros{' '}
              <Link to="/terminos" className="underline hover:text-hornet-dark">
                Términos y condiciones
              </Link>{' '}
              y{' '}
              <Link to="/privacidad" className="underline hover:text-hornet-dark">
                Política de privacidad
              </Link>.
            </p>
          </div>

          {/* Nota sobre cotizaciones pendientes */}
          {destino.startsWith('/solicitar') && (
            <div className="mt-4 p-4 bg-hornet-warning-bg border border-yellow-200 text-sm text-hornet-warning">
              <strong>Nota:</strong> Tu cotización requiere aprobación del equipo antes de poder confirmar el pedido. Te notificamos por email cuando esté lista.
            </div>
          )}

        </div>
      </div>
    </GoogleOAuthProvider>
  )
}
