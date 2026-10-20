import type { INotification } from '../../models/Notification.js';

export interface INotificationRepository {
    create(notificationData: Partial<INotification>): Promise<INotification>;
    findByUser(userId: string): Promise<INotification[]>;
    markAsRead(notificationId: string): Promise<INotification | null>;
    getUnreadCount(userId: string): Promise<number>;
}