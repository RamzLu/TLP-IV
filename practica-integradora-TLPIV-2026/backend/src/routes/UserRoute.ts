import { Router } from 'express';
import type { UserController } from '../controllers/UserController.js';
import { authenticate } from '../middlewares/authenticate.js';
import { authorize } from '../middlewares/authorize.js';

export function createUserRoutes(controller: UserController): Router {
    const router = Router();

    router.use(authenticate);

    router.get('/', authorize('user:read'), controller.getAll);
    router.patch('/:id/role', authorize('user:assign-role'), controller.assignRole);

    return router;
}