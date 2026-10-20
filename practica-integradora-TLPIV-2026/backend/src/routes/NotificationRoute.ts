import { Router } from 'express';
import type { NotificationController } from '../controllers/NotificationController.js';
import { authenticate } from '../middlewares/authenticate.js';

export class NotificationRoute {
    public router: Router;

    constructor(private readonly notificationController: NotificationController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get('/', authenticate, this.notificationController.getUserNotifications);
        this.router.get('/unread-count', authenticate, this.notificationController.getUnreadCount);
        this.router.patch('/:id/read', authenticate, this.notificationController.markAsRead);
    }
}