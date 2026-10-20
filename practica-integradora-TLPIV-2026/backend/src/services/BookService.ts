// este service se encarga de las tareas CRUD y la lógica de negocio
import type { IBookRepository } from '../repositories/interfaces/IBookRepository.js';
import type { ISubject } from '../observer/ISubject.js';
import type { IBookStatusChangedEvent } from '../observer/IBookStatusChangedEvent.js';
import type { IBook, BookStatus } from '../models/Book.js';

export class BookService {
    constructor(
        private readonly bookRepository: IBookRepository,
        private readonly publisher: ISubject
    ) {}

    async getAll(): Promise<IBook[]> {
        return await this.bookRepository.findAll();
    }

    async getById(id: string): Promise<IBook | null> {
        return await this.bookRepository.findById(id);
    }

    async create(bookData: Partial<IBook>): Promise<IBook> {
        return await this.bookRepository.create(bookData);
    }

    async update(id: string, bookData: Partial<IBook>): Promise<IBook | null> {
        // el estado se separa porque su cambio tiene que notificar a los suscriptores
        const { status, ...fields } = bookData;

        let result: IBook | null;
        if (Object.keys(fields).length > 0) {
            result = await this.bookRepository.update(id, fields);
        } else {
            result = await this.bookRepository.findById(id);
        }
        if (!result) {
            return null;
        }

        // si cambió el estado, se usa changeStatus para disparar el observer
        if (status !== undefined && status !== result.status) {
            return await this.changeStatus(id, status as BookStatus);
        }

        return result;
    }

    async delete(id: string): Promise<boolean> {
        return await this.bookRepository.delete(id);
    }

    async changeStatus(id: string, newStatus: BookStatus): Promise<IBook | null> {
        //se busca el libro con findById, si es null devuelve null
        const book = await this.bookRepository.findById(id);
        if (!book) {
            return null;
        }

        // el estado anterior del libro antes de actualizarlo
        const previousStatus = book.status;

        // si el estado anterior es igual al nuevo, no cambia nada
        if (previousStatus === newStatus) {
            return book;
        }

        // actualizar el estado en la base de datos a través del repositorio
        const updated = await this.bookRepository.changeStatus(id, newStatus);
        if (!updated) {
            return null;
        }

        // armar el evento con la interfaz correspondiente
        const event: IBookStatusChangedEvent = {
            bookId: book._id.toString(),
            title: book.title,
            previousStatus,
            newStatus
        };

        // notificar a todos los observadores registrados mediante el publicador
        await this.publisher.notify(event);

        // devolvemos el libro actualizado 
        return updated;
    }
}