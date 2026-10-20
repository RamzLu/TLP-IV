import { Router } from 'express';
import type { BookController } from '../controllers/BookController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

export function createBookRoutes(controller: BookController): Router {
    const router = Router();
    router.use(authenticate);

    router.get('/', authorize('book:read'), controller.getAll);
    router.get('/:id', authorize('book:read'), controller.getById);
    router.post('/', authorize('book:create'), controller.create);
    router.put('/:id', authorize('book:update'), controller.update);
    router.patch('/:id/status', authorize('book:change-status'), controller.changeStatus);
    router.delete('/:id', authorize('book:delete'), controller.delete);

    return router;
}