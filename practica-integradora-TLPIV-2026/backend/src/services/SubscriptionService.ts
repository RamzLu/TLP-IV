import type { ISubscriptionRepository } from '../repositories/interfaces/ISubscriptionRepository.js';

export class SubscriptionService {
    constructor(private readonly subscriptionRepository: ISubscriptionRepository) {}

    async subscribe(userId: string, bookId: string) {
        return await this.subscriptionRepository.create(userId, bookId);
    }

    async unsubscribe(userId: string, bookId: string) {
        return await this.subscriptionRepository.delete(userId, bookId);
    }
}