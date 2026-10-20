import type { INotifier } from './INotifier.js';
import type { INotificationRepository } from '../repositories/interfaces/INotificationRepository.js';
import type { INotification } from '../models/Notification.js';

export class InAppNotifier implements INotifier {
    constructor(private readonly notificationRepository: INotificationRepository) {}

    async send(notificationData: Partial<INotification>): Promise<void> {
        await this.notificationRepository.create(notificationData);
    }
}