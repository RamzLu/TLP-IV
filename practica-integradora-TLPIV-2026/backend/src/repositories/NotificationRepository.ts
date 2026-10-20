import { Notification, type INotification } from '../models/Notification.js';
import type { INotificationRepository } from './interfaces/INotificationRepository.js';

export class NotificationRepository implements INotificationRepository {
    async create(notificationData: Partial<INotification>): Promise<INotification> {
        const notification = new Notification(notificationData);
        return await notification.save();
    }

    async findByUser(userId: string): Promise<INotification[]> {
        // Devuelve las notificaciones más recientes primero
        return await Notification.find({ user: userId }).sort({ createdAt: -1 }).populate('book');
    }

    async markAsRead(notificationId: string): Promise<INotification | null> {
        return await Notification.findByIdAndUpdate(notificationId, { isRead: true }, { new: true });
    }

    async getUnreadCount(userId: string): Promise<number> {
        return await Notification.countDocuments({ user: userId, isRead: false });
    }
}