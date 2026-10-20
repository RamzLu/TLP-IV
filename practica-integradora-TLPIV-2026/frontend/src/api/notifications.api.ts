import { apiClient } from './client'
import type { Notification } from '../types'

// el backend devuelve _id, user, book (populado con el libro), message, isRead y createdAt
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeNotification(raw: any): Notification {
	const book = raw.book
	const bookIsObject = book !== null && typeof book === 'object'

	return {
		id: String(raw._id ?? raw.id),
		userId: String(raw.user),
		bookId: bookIsObject ? String(book._id ?? book.id) : book ? String(book) : undefined,
		bookTitle: bookIsObject ? book.title : undefined,
		message: raw.message ?? '',
		isRead: Boolean(raw.isRead),
		createdAt: raw.createdAt ?? new Date().toISOString(),
	}
}

export async function getNotifications(): Promise<Notification[]> {
	const data = await apiClient<unknown>('/notifications')
	return (Array.isArray(data) ? data : []).map(normalizeNotification)
}

export async function markNotificationAsRead(id: string): Promise<Notification> {
	const data = await apiClient<unknown>(`/notifications/${id}/read`, { method: 'PATCH' })
	return normalizeNotification(data)
}