import { Router } from 'express';
import type { SubscriptionController } from '../controllers/SubscriptionController.js';
import { authenticate } from '../middlewares/authenticate.js';

export class SubscriptionRoute {
    public router: Router;

    constructor(private readonly subscriptionController: SubscriptionController) {
        this.router = Router();
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post('/', authenticate, this.subscriptionController.subscribe);
        this.router.delete('/:bookId', authenticate, this.subscriptionController.unsubscribe);
    }
}