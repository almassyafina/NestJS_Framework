
import { Injectable, NotFoundException } from '@nestjs/common';
import { Book } from './entities/book-entity.js';
import { CreateBookDto } from './dto/create-book-dto.js';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../categories/entities/category-entity.js';
import { Publisher } from '../publishers/entities/publisher-entity.js';

@Injectable()
export class BooksService {
    constructor(
        @InjectRepository(Book)
        private readonly bookRepository: Repository<Book>,

        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,

        @InjectRepository(Publisher)
        private readonly publisherRepository: Repository<Publisher>,
    ) {}

    // Mendapatkan semua buku
    async findAll(): Promise<Book[]> {
        return await this.bookRepository.find({
            relations: { category: true, publisher: true },
            order: { createdAt: 'DESC' }
        });
    }

    // Menyimpan data buku
    async simpanData(createBookDto: CreateBookDto): Promise<Book> {
        const category = await this.categoryRepository.findOneBy({
            id: createBookDto.categoryId
        });

        if (!category) {
            throw new NotFoundException('Kategori tidak ditemukan');
        }

        const publisher = await this.publisherRepository.findOneBy({
            id: createBookDto.publisherId
        });

        if (!publisher) {
            throw new NotFoundException('Penerbit tidak ditemukan');
        }

        const newBook = this.bookRepository.create({
            title: createBookDto.title,
            author: createBookDto.author,
            isbn: createBookDto.isbn,
            publishedYear: createBookDto.publishedYear,
            isAvailable: createBookDto.isAvailable ?? true,
            price: String(createBookDto.price),
            stock: createBookDto.stock,
            category: category,
            publisher: publisher
        });

        return await this.bookRepository.save(newBook);
    }

    // Menampilkan buku berdasarkan ID
    async findOne(id: string): Promise<Book> {
        const book = await this.bookRepository.findOne({
            where: { id },
            relations: { category: true, publisher: true }
        });

        if (!book) {
            throw new NotFoundException(`Buku ${id} tidak ditemukan`);
        }

        return book;
    }

    // Mengupdate data buku
    async updateData(id: string, createBookDto: CreateBookDto): Promise<Book> {
        const book = await this.findOne(id);

        const category = await this.categoryRepository.findOneBy({
            id: createBookDto.categoryId
        });

        if (!category) {
            throw new NotFoundException('Kategori tidak ditemukan');
        }

        const publisher = await this.publisherRepository.findOneBy({
            id: createBookDto.publisherId
        });

        if (!publisher) {
            throw new NotFoundException('Penerbit tidak ditemukan');
        }

        this.bookRepository.merge(book, {
            title: createBookDto.title,
            author: createBookDto.author,
            isbn: createBookDto.isbn,
            publishedYear: createBookDto.publishedYear,
            isAvailable: createBookDto.isAvailable ?? book.isAvailable,
            price: String(createBookDto.price),
            stock: createBookDto.stock,
            category,
            publisher
        });

        return await this.bookRepository.save(book);
    }

    // Menghapus buku (soft delete)
    async deleteData(id: string): Promise<{ message: string, deletedId: string }> {
        await this.findOne(id);

        await this.bookRepository.softDelete(id);

        return {
            message: `Buku ${id} berhasil dihapus`,
            deletedId: id
        };
    }
}
