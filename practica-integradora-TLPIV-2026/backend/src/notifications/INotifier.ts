import type { INotification } from '../models/Notification.js';

export interface INotifier {
    send(notificationData: Partial<INotification>): Promise<void>;
}