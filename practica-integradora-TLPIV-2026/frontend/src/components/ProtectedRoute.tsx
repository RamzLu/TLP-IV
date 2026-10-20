import { Navigate, Outlet, useLocation } from 'react-router'
import { useAuth } from '../context/AuthContext'

export function ProtectedRoute() {
	const { user, isLoading } = useAuth()
	const location = useLocation()

	if (isLoading) {
		return <div role="status" aria-live="polite">Cargando sesión...</div>
	}

	if (!user) {
		return <Navigate to="/login" replace state={{ from: location }} />
	}

	return <Outlet />
}
