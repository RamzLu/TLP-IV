//este archivo forma un array de observadores y notifica a todos los observadores cuando cambia el estado de un libro, este archivo contiene la logica de agregar, eliminar y notificar a los observadores
import type { ISubject } from './ISubject.js';
import type { IObserver } from './IObserver.js';
import type { IBookStatusChangedEvent } from './IBookStatusChangedEvent.js';


export class EventPublisher implements ISubject {
    private observers: IObserver[] = []; 

    attach(observer: IObserver): void {
       if (!this.observers.includes(observer)) {
            this.observers.push(observer);
        }
    }
    detach(observer: IObserver): void {
        this.observers = this.observers.filter(obs => obs !== observer); 
    }
    async notify(event: IBookStatusChangedEvent): Promise<void> {
        for (const observer of this.observers) {
            try {
                await observer.update(event);
            } catch (error) {
                console.error('Error notificando al observador:', error);
            }
        }
    } 

}
