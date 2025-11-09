// client/src/components/ProtectedRoute.tsx
import { useAuth } from '../context/AuthContext'
import { Navigate, Outlet } from 'react-router-dom'

const ProtectedRoute = () => {
  const { state } = useAuth()

  if (state.isLoading) {
    return <div className="text-white">Loading...</div>
  }

  if (!state.user) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default ProtectedRoute