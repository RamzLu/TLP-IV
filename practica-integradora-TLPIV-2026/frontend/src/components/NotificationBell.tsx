import { useCallback, useEffect, useState } from 'react'
import { getNotifications, markNotificationAsRead } from '../api/notifications.api'
import { useAuth } from '../context/AuthContext'
import type { Notification } from '../types'

// cada cuánto se vuelve a pedir las notificaciones al backend
const REFRESH_INTERVAL_MS = 30000

function formatDate(date: string) {
	return new Intl.DateTimeFormat('es-AR', {
		day: '2-digit',
		month: 'short',
	}).format(new Date(date))
}

export function NotificationBell() {
	const { user } = useAuth()
	const [notifications, setNotifications] = useState<Notification[]>([])

	const loadNotifications = useCallback(async () => {
		try {
			const data = await getNotifications()
			setNotifications(data)
		} catch (error) {
			console.error('Error al cargar las notificaciones:', error)
		}
	}, [])

	// carga al iniciar sesión (o al cambiar de usuario) y se actualiza cada tanto
	useEffect(() => {
		if (!user) {
			setNotifications([])
			return
		}

		loadNotifications()
		const interval = window.setInterval(loadNotifications, REFRESH_INTERVAL_MS)
		return () => window.clearInterval(interval)
	}, [user?.id, loadNotifications])

	const unreadCount = notifications.filter((notification) => !notification.isRead).length

	const markAsRead = async (id: string) => {
		try {
			await markNotificationAsRead(id)
			setNotifications((current) => current.map((notification) => (
				notification.id === id ? { ...notification, isRead: true } : notification
			)))
		} catch (error) {
			console.error('Error al marcar la notificación como leída:', error)
		}
	}

	return (
		<details
			className="notification-menu"
			onToggle={(event) => {
				// al abrir la campanita se refresca la lista
				if (event.currentTarget.open) {
					loadNotifications()
				}
			}}
		>
			<summary
				className="notification-trigger"
				aria-label={unreadCount > 0 ? `Notificaciones, ${unreadCount} sin leer` : 'Notificaciones'}
				title="Notificaciones"
			>
				<svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
					<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
				</svg>
				{unreadCount > 0 && <span className="notification-count" aria-hidden="true">{unreadCount}</span>}
			</summary>
			<section className="notification-panel" aria-label="Bandeja de notificaciones">
				<header className="notification-panel-heading">
					<div>
						<p className="notification-panel-title">Notificaciones</p>
					</div>
					<span className="notification-unread-summary">{unreadCount} sin leer</span>
				</header>
				{notifications.length === 0 ? (
					<p>No tienes notificaciones.</p>
				) : (
					<ul className="notification-list">
						{notifications.map((notification) => (
							<li className={notification.isRead ? 'notification-item' : 'notification-item is-unread'} key={notification.id}>
								<p>
									{notification.bookTitle ? `${notification.bookTitle}: ` : ''}
									{notification.message}
								</p>
								<time dateTime={notification.createdAt}>{formatDate(notification.createdAt)}</time>
								{!notification.isRead && (
									<button className="notification-read-button" type="button" onClick={() => markAsRead(notification.id)}>
										Marcar como leída
									</button>
								)}
							</li>
						))}
					</ul>
				)}
			</section>
		</details>
	)
}