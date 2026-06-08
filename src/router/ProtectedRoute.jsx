import { Navigate, useLocation } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function ProtectedRoute({ children, requireRole }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <LoadingSpinner size="lg" className="text-hornet-gold" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />
  }

  if (requireRole && user.tipo !== requireRole && user.tipo !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
