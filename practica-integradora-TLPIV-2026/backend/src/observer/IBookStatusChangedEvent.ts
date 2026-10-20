//este archivo se usa para definir la interfaz del evento que se dispara cuando cambia el estado de un libro
import type { BookStatus } from '../models/Book.js';

//el evento se usa BookStatus porque solo necesitamos el cambio de estado del libro
export interface IBookStatusChangedEvent {
    bookId: string;
    title: string;
    previousStatus: BookStatus;
    newStatus: BookStatus;
}