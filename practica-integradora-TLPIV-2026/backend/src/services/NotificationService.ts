import type { INotificationRepository } from '../repositories/interfaces/INotificationRepository.js';
import type { ISubscriptionRepository } from '../repositories/interfaces/ISubscriptionRepository.js';
import type { IObserver } from '../observer/IObserver.js';
import type { IBookStatusChangedEvent } from '../observer/IBookStatusChangedEvent.js';
import { NotifierFactory } from '../notifications/NotifierFactory.js';

export class NotificationService implements IObserver {
    // Inyectamos también el repo de suscripciones para saber a quién avisarle
    constructor(
        private readonly notificationRepository: INotificationRepository,
        private readonly subscriptionRepository: ISubscriptionRepository
    ) {}

    // Este es el método que exige IObserver y que el EventPublisher llamará automáticamente
    async update(event: IBookStatusChangedEvent): Promise<void> {
        // 1. Buscamos todos los usuarios suscritos a este libro
        const subscriptions = await this.subscriptionRepository.findByBook(event.bookId);
        
        // 2. Usamos el Factory para crear el notificador deseado ('inapp' o 'console')
        const notifier = NotifierFactory.createNotifier('inapp', this.notificationRepository);

        // 3. Enviamos la alerta a cada suscriptor
        for (const sub of subscriptions) {
            await notifier.send({
                user: sub.user,
                book: event.bookId as any,
                message: `El libro ha cambiado su estado a: ${event.newStatus}`,
                isRead: false
            });
        }
    }

    async getUserNotifications(userId: string) {
        return await this.notificationRepository.findByUser(userId);
    }

    async markAsRead(notificationId: string) {
        return await this.notificationRepository.markAsRead(notificationId);
    }

    async getUnreadCount(userId: string) {
        return await this.notificationRepository.getUnreadCount(userId);
    }
}