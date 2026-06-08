import { Navigate } from 'react-router'
import { useAuth } from '../hooks/useAuth'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <LoadingSpinner size="lg" className="text-hornet-gold" />
      </div>
    )
  }

  if (!user || user.tipo !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}
