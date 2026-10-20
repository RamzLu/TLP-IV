import type { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { BookService } from '../services/BookService.js';
import { BookStatus } from '../models/Book.js';

function isValidId(id: unknown): boolean {
    return typeof id === 'string' && mongoose.Types.ObjectId.isValid(id);
}

export class BookController {
    constructor(private readonly bookService: BookService) {}

    // listar todos los libros
    getAll = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const books = await this.bookService.getAll();
            res.status(200).json(books);
        } catch (error) {
            next(error);
        }
    };

    // obtener un libro por id
    getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                res.status(404).json({ message: 'Libro no encontrado' });
                return;
            }
            const book = await this.bookService.getById(id as string);
            if (!book) {
                res.status(404).json({ message: 'Libro no encontrado' });
                return;
            }
            res.status(200).json(book);
        } catch (error) {
            next(error);
        }
    };

    // crear un libro
    create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { title, description } = req.body;
            if (!title || !description) {
                res.status(400).json({ message: 'title y description son obligatorios' });
                return;
            }
            const newBook = await this.bookService.create(req.body);
            res.status(201).json(newBook);
        } catch (error) {
            next(error);
        }
    };

    // actualizar un libro
    update = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                res.status(404).json({ message: 'Libro no encontrado' });
                return;
            }
            const updatedBook = await this.bookService.update(id as string, req.body);
            if (!updatedBook) {
                res.status(404).json({ message: 'Libro no encontrado' });
                return;
            }
            res.status(200).json(updatedBook);
        } catch (error) {
            next(error);
        }
    };

    // cambiar el estado de un libro
    changeStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            const { status } = req.body;

            if (!isValidId(id)) {
                res.status(404).json({ message: 'Libro no encontrado' });
                return;
            }

            // validar que sea un valor real del enum, no solo que exista
            if (!Object.values(BookStatus).includes(status)) {
                res.status(400).json({
                    message: `Estado inválido. Valores permitidos: ${Object.values(BookStatus).join(', ')}`
                });
                return;
            }

            const updatedBook = await this.bookService.changeStatus(id as string, status as BookStatus);
            if (!updatedBook) {
                res.status(404).json({ message: 'Libro no encontrado' });
                return;
            }
            res.status(200).json(updatedBook);
        } catch (error) {
            next(error);
        }
    };

    // eliminar un libro
    delete = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { id } = req.params;
            if (!isValidId(id)) {
                res.status(404).json({ message: 'Libro no encontrado' });
                return;
            }
            const deleted = await this.bookService.delete(id as string);
            if (!deleted) {
                res.status(404).json({ message: 'Libro no encontrado' });
                return;
            }
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    };
}