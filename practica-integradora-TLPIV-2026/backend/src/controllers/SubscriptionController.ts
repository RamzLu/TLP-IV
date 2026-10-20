import type { Request, Response } from 'express';
import mongoose from 'mongoose';
import type { SubscriptionService } from '../services/SubscriptionService.js';

export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService) {}

    subscribe = async (req: Request, res: Response): Promise<void> => {
        try {
            const { bookId } = req.body;
            const userId = req.user!.sub;

            // se validan los ids antes de llegar a la base de datos
            if (!mongoose.isValidObjectId(bookId)) {
                res.status(400).json({ message: 'El id del libro no es válido' });
                return;
            }
            if (!mongoose.isValidObjectId(userId)) {
                res.status(400).json({ message: 'El id del usuario en el token no es válido' });
                return;
            }

            const result = await this.subscriptionService.subscribe(userId, bookId);
            res.status(201).json(result);
        } catch (error) {
            console.error('Error en subscribe:', error);
            res.status(500).json({ message: 'Error al crear la suscripción' });
        }
    }

    unsubscribe = async (req: Request, res: Response): Promise<void> => {
        try {
            const bookId = req.params.bookId as string;
            const userId = req.user!.sub;
            await this.subscriptionService.unsubscribe(userId, bookId);
            res.status(200).json({ message: 'Suscripción cancelada' });
        } catch (error) {
            console.error('Error en unsubscribe:', error);
            res.status(500).json({ message: 'Error al cancelar la suscripción' });
        }
    }
}