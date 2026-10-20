import type { ISubscription } from '../../models/Subscription.js';

export interface ISubscriptionRepository {
    create(userId: string, bookId: string): Promise<ISubscription>;
    delete(userId: string, bookId: string): Promise<boolean>;
    findByBook(bookId: string): Promise<ISubscription[]>;
    findByUser(userId: string): Promise<ISubscription[]>;
}