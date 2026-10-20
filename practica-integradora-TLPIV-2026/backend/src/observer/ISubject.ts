//este archivo usa tanto BookStatusChangedEvent como IObserver para definir la interfaz del sujeto que notifica a los observadores cuando cambia el estado de un libro
import type { IBookStatusChangedEvent } from './IBookStatusChangedEvent.js';
import type { IObserver } from './IObserver.js';

export interface ISubject {
    attach(observer: IObserver): void;
    detach(observer: IObserver): void;
    notify(event: IBookStatusChangedEvent): Promise<void>;
}
