import type { INotifier } from './INotifier.js';
import type { INotification } from '../models/Notification.js';

export class ConsoleNotifierAdapter implements INotifier {
    async send(notificationData: Partial<INotification>): Promise<void> {
        // Adapta los datos crudos a un string formateado para la consola
        const mensaje = `[ALERTA ADAPTER] Libro ID: ${notificationData.book} | Usuario ID: ${notificationData.user} | Mensaje: "${notificationData.message}"`;
        console.log(mensaje);
    }
}