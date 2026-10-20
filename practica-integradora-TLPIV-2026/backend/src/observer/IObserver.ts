//este archivo es el contrato que deben cumplir los observadores para recibir notificaciones de cambios en el estado de un libro
import type { IBookStatusChangedEvent } from './IBookStatusChangedEvent.js'

export interface IObserver { 
    update(event: IBookStatusChangedEvent): Promise<void>;//se usa Promise<void> porque se trata de una operacion asincrona, por si se necesita hacer una llamada a una API o a una base de datos
}