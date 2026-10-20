import type { ReactNode } from 'react'
import { useAuth } from '../context/AuthContext'

interface CanProps {
	permission: string
	children: ReactNode
	fallback?: ReactNode
}

export function Can({ permission, children, fallback = null }: CanProps) {
	const { hasPermission } = useAuth()

	return hasPermission(permission) ? children : fallback
}
