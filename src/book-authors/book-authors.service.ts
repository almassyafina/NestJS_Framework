import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BookAuthor } from './entities/book-author.entity.js';
import { Book } from '../books/entities/book-entity.js';
import { Author } from '../authors/entities/authors-entity.js';

import { CreateBookAuthorDto } from './dto/create-book-author.dto.js';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto.js';

@Injectable()
export class BookAuthorsService {
  constructor(
    @InjectRepository(BookAuthor)
    private bookAuthorRepository: Repository<BookAuthor>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,

    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  // Menghubungkan buku dengan penulis
  async create(createBookAuthorDto: CreateBookAuthorDto) {
    const { bookId, authorId } = createBookAuthorDto;

    const book = await this.bookRepository.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Buku tidak ditemukan');
    }

    const author = await this.authorRepository.findOne({
      where: { id: authorId },
    });

    if (!author) {
      throw new NotFoundException('Penulis tidak ditemukan');
    }

    const existingRelation = await this.bookAuthorRepository.findOne({
      where: { bookId, authorId },
    });

    if (existingRelation) {
      throw new ConflictException('Relasi buku dan penulis sudah ada');
    }

    const bookAuthor = this.bookAuthorRepository.create({
      book,
      author,
    });

    return await this.bookAuthorRepository.save(bookAuthor);
  }

  // Menampilkan semua relasi buku dan penulis
  async findAll() {
    return await this.bookAuthorRepository.find({
      relations: {
        book: true,
        author: true,
      },
    });
  }

  // Menampilkan relasi berdasarkan ID buku dan ID penulis
  async findOne(bookId: string, authorId: string) {
    const bookAuthor = await this.bookAuthorRepository.findOne({
      where: { bookId, authorId },
      relations: {
        book: true,
        author: true,
      },
    });

    if (!bookAuthor) {
      throw new NotFoundException('Relasi buku dan penulis tidak ditemukan');
    }

    return bookAuthor;
  }

  // Mengubah relasi buku dan penulis
  async update(
    bookId: string,
    authorId: string,
    updateBookAuthorDto: UpdateBookAuthorDto,
  ) {
    const existingRelation = await this.findOne(bookId, authorId);

    const newBookId = updateBookAuthorDto.bookId ?? bookId;
    const newAuthorId = updateBookAuthorDto.authorId ?? authorId;

    const book = await this.bookRepository.findOne({
      where: { id: newBookId },
    });

    if (!book) {
      throw new NotFoundException('Buku tidak ditemukan');
    }

    const author = await this.authorRepository.findOne({
      where: { id: newAuthorId },
    });

    if (!author) {
      throw new NotFoundException('Penulis tidak ditemukan');
    }

    const duplicate = await this.bookAuthorRepository.findOne({
      where: {
        bookId: newBookId,
        authorId: newAuthorId,
      },
    });

    if (
      duplicate &&
      (newBookId !== bookId || newAuthorId !== authorId)
    ) {
      throw new ConflictException('Relasi buku dan penulis sudah ada');
    }

    await this.bookAuthorRepository.remove(existingRelation);

    const updatedRelation = this.bookAuthorRepository.create({
      book,
      author,
    });

    return await this.bookAuthorRepository.save(updatedRelation);
  }

  // Menghapus relasi buku dan penulis
  async remove(bookId: string, authorId: string) {
    const bookAuthor = await this.findOne(bookId, authorId);

    await this.bookAuthorRepository.remove(bookAuthor);

    return {
      message: 'Relasi buku dan penulis berhasil dihapus',
    };
  }
}