import { Book, BookStatus, type IBook } from '../models/Book.js';
import type { IBookRepository } from './interfaces/IBookRepository.js';

export class BookRepository implements IBookRepository {
    async findAll(): Promise<IBook[]> {
        return await Book.find();
    }

    async findById(id: string): Promise<IBook | null> {
        return await Book.findById(id);
    }

    async create(bookData: Partial<IBook>): Promise<IBook> {
        const book = new Book(bookData);
        return await book.save();
    }

    async update(id: string, bookData: Partial<IBook>): Promise<IBook | null> {
        return await Book.findByIdAndUpdate(id, bookData, { new: true });
    }

    async changeStatus(id: string, status: BookStatus): Promise<IBook | null> {
        return await Book.findByIdAndUpdate(id, { status }, { new: true });
    }

    async delete(id: string): Promise<boolean> {
        const result = await Book.findByIdAndDelete(id);
        return result !== null;
    }
}