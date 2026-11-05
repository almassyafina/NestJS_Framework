import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Author } from './entities/authors-entity.js';
import { CreateAuthorDto } from './dto/create-author.dto.js';
import { UpdateAuthorDto } from './dto/update-author.dto.js';

@Injectable()
export class AuthorsService {
  constructor(
    @InjectRepository(Author)
    private authorRepository: Repository<Author>,
  ) {}

  // Menambahkan penulis
  async create(createAuthorDto: CreateAuthorDto) {
    const author = this.authorRepository.create(createAuthorDto);

    return await this.authorRepository.save(author);
  }

  // Menampilkan semua penulis
  async findAll() {
    return await this.authorRepository.find();
  }

  // Menampilkan penulis berdasarkan ID
  async findOne(id: string) {
    const author = await this.authorRepository.findOne({
      where: { id },
      relations: {
        bookAuthors: {
          book: true,
        },
      },
    });

    if (!author) {
      throw new NotFoundException('Penulis tidak ditemukan');
    }

    return author;
  }

  // Mengubah data penulis
  async update(id: string, updateAuthorDto: UpdateAuthorDto) {
    const author = await this.findOne(id);

    Object.assign(author, updateAuthorDto);

    return await this.authorRepository.save(author);
  }

  // Menghapus penulis
  async remove(id: string) {
    const author = await this.findOne(id);

    if (author.bookAuthors.length > 0) {
      throw new ConflictException(
        'Penulis tidak dapat dihapus karena masih terhubung dengan buku',
      );
    }

    await this.authorRepository.remove(author);

    return {
      message: 'Penulis berhasil dihapus',
    };
  }
}