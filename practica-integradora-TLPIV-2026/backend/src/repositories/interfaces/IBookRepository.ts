import type { IBook, BookStatus } from '../../models/Book.js';

//creamos una plantilla con funciones obligatorias, y cualquier parte del codigo que guarde o lea los libros debe tener estas 6 funciones

export interface IBookRepository {
    findAll(): Promise<IBook[]>; //la palabra promise significa que puede tomar unos segundos en lo q va a la bd y luego devolvera una lista con los libros
    findById(id: string): Promise<IBook | null>;
    create(bookData: Partial<IBook>): Promise<IBook>; //la palabra partial significa que perimite enviar los datos incompletos y devuelve el libro creado
    update(id: string, bookData: Partial<IBook>): Promise<IBook | null>;
    changeStatus(id: string, status: BookStatus): Promise<IBook | null>;
    delete(id: string): Promise<boolean>;
}