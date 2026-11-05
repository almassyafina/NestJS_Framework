import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Publisher } from './entities/publisher-entity.js';
import { CreatePublisherDto } from './dto/create-publisher.dto.js';
import { UpdatePublisherDto } from './dto/update-publisher.dto.js';

@Injectable()
export class PublishersService {
  constructor(
    @InjectRepository(Publisher)
    private publisherRepository: Repository<Publisher>,
  ) {}

  // Menambahkan penerbit
  async create(createPublisherDto: CreatePublisherDto) {
    const publisher = this.publisherRepository.create(
      createPublisherDto,
    );

    return await this.publisherRepository.save(publisher);
  }

  // Menampilkan semua penerbit
  async findAll() {
    return await this.publisherRepository.find();
  }

  // Menampilkan penerbit berdasarkan ID
  async findOne(id: string) {
    const publisher = await this.publisherRepository.findOne({
      where: { id },
      relations: {
        books: true,
      },
    });

    if (!publisher) {
      throw new NotFoundException('Penerbit tidak ditemukan');
    }

    return publisher;
  }

  // Mengubah data penerbit
  async update(
    id: string,
    updatePublisherDto: UpdatePublisherDto,
  ) {
    const publisher = await this.findOne(id);

    Object.assign(publisher, updatePublisherDto);

    return await this.publisherRepository.save(publisher);
  }

  // Menghapus penerbit
  async remove(id: string) {
    const publisher = await this.findOne(id);

    if (publisher.books.length > 0) {
      throw new ConflictException(
        'Penerbit tidak dapat dihapus karena masih digunakan oleh buku',
      );
    }

    await this.publisherRepository.remove(publisher);

    return {
      message: 'Penerbit berhasil dihapus',
    };
  }
}