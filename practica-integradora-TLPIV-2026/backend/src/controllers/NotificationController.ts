import type { Request, Response } from 'express';
import type { NotificationService } from '../services/NotificationService.js';

export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    getUserNotifications = async (req: Request, res: Response): Promise<void> => {
        try {
            // el id del usuario viene en "sub" del token, igual que en SubscriptionController
            const userId = req.user!.sub;
            const notifications = await this.notificationService.getUserNotifications(userId);
            res.status(200).json(notifications);
        } catch (error) {
            console.error('Error en getUserNotifications:', error);
            res.status(500).json({ message: 'Error al obtener notificaciones' });
        }
    }

    markAsRead = async (req: Request, res: Response): Promise<void> => {
        try {
            const id = req.params.id as string;
            const notification = await this.notificationService.markAsRead(id);
            res.status(200).json(notification);
        } catch (error) {
            console.error('Error en markAsRead:', error);
            res.status(500).json({ message: 'Error al actualizar la notificación' });
        }
    }

    getUnreadCount = async (req: Request, res: Response): Promise<void> => {
        try {
            const userId = req.user!.sub;
            const count = await this.notificationService.getUnreadCount(userId);
            res.status(200).json({ count });
        } catch (error) {
            console.error('Error en getUnreadCount:', error);
            res.status(500).json({ message: 'Error al obtener el contador' });
        }
    }
}