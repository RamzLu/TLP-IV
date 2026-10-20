import type { INotifier } from './INotifier.js';
import { InAppNotifier } from './InAppNotifier.js';
import { ConsoleNotifierAdapter } from './ConsoleNotifierAdapter.js';
import type { INotificationRepository } from '../repositories/interfaces/INotificationRepository.js';

export class NotifierFactory {
    static createNotifier(type: 'inapp' | 'console', repo?: INotificationRepository): INotifier {
        if (type === 'inapp') {
            if (!repo) throw new Error('InAppNotifier requiere inyectar un repositorio');
            return new InAppNotifier(repo);
        } else if (type === 'console') {
            return new ConsoleNotifierAdapter();
        }
        throw new Error('Tipo de notificador no soportado por la Factory');
    }
}