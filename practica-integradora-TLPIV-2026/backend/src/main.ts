import './config/env.js'
import { DatabaseConnection } from './database/DatabaseConnection.js'
import app from './app.js';
import { BookRepository } from './repositories/BookRepository.js';
import { EventPublisher } from './observer/EventPublisher.js';
import { BookService } from './services/BookService.js';
import { BookController } from './controllers/BookController.js';
import { createBookRoutes } from './routes/BookRoute.js';
import { UserRepository } from './repositories/UserRepository.js';
import { RoleRepository } from './repositories/RoleRepository.js';
import { AuthService } from './services/AuthService.js';
import { AuthController } from './controllers/AuthController.js';
import { createAuthRoutes } from './routes/AuthRoute.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { UserService } from './services/UserService.js';
import { UserController } from './controllers/UserController.js';
import { createUserRoutes } from './routes/UserRoute.js';

import { NotificationRepository } from './repositories/NotificationRepository.js';
import { SubscriptionRepository } from './repositories/SubscriptionRepository.js';
import { NotificationService } from './services/NotificationService.js';
import { SubscriptionService } from './services/SubscriptionService.js';
import { NotificationController } from './controllers/NotificationController.js';
import { SubscriptionController } from './controllers/SubscriptionController.js';
import { NotificationRoute } from './routes/NotificationRoute.js';
import { SubscriptionRoute } from './routes/SubscriptionRoute.js';

async function start() {
    const db = DatabaseConnection.getInstance()
    await db.connect()

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
        throw new Error('Falta la variable de entorno JWT_SECRET');
    }

    const publisher = new EventPublisher();
    const bookRepository = new BookRepository();
    const notificationRepo = new NotificationRepository();
    const subscriptionRepo = new SubscriptionRepository();
    const userRepository = new UserRepository();
    const roleRepository = new RoleRepository();

    const notificationService = new NotificationService(notificationRepo, subscriptionRepo);
    const subscriptionService = new SubscriptionService(subscriptionRepo);
    const authService = new AuthService(userRepository, roleRepository, jwtSecret);
    const userService = new UserService(userRepository, roleRepository);
    
    publisher.attach(notificationService);

    const bookService = new BookService(bookRepository, publisher);

    const bookController = new BookController(bookService);
    const authController = new AuthController(authService);
    const userController = new UserController(userService);
    const notificationController = new NotificationController(notificationService);
    const subscriptionController = new SubscriptionController(subscriptionService);

    app.use('/api/books', createBookRoutes(bookController));
    app.use('/api/auth', createAuthRoutes(authController));
    app.use('/api/users', createUserRoutes(userController));
    
    app.use('/api/notifications', new NotificationRoute(notificationController).router);
    app.use('/api/subscriptions', new SubscriptionRoute(subscriptionController).router);

    app.use(errorHandler);

    const port = Number(process.env.API_PORT) || 3000;
    app.listen(port, () => {
        console.log(`Servidor escuchando en http://localhost:${port}`);
    });
}

start().catch((err) => {
    console.error('Error al iniciar el servidor:', err)
    process.exit(1)
})