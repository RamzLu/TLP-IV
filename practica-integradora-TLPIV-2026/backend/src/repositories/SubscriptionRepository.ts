import { Subscription, type ISubscription } from '../models/Subscription.js';
import type { ISubscriptionRepository } from './interfaces/ISubscriptionRepository.js';

export class SubscriptionRepository implements ISubscriptionRepository {
    async create(userId: string, bookId: string): Promise<ISubscription> {
        // si el usuario ya sigue el libro, se devuelve la suscripción existente
        // (el índice único user + book no permite duplicados)
        const existing = await Subscription.findOne({ user: userId, book: bookId });
        if (existing) {
            return existing;
        }

        const subscription = new Subscription({ user: userId, book: bookId });
        return await subscription.save();
    }

    async delete(userId: string, bookId: string): Promise<boolean> {
        const result = await Subscription.findOneAndDelete({ user: userId, book: bookId });
        return result !== null;
    }

    async findByBook(bookId: string): Promise<ISubscription[]> {
        return await Subscription.find({ book: bookId });
    }

    async findByUser(userId: string): Promise<ISubscription[]> {
        return await Subscription.find({ user: userId }).populate('book');
    }
}