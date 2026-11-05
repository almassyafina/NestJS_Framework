import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Category } from './entities/category-entity.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  // Menambahkan kategori
  async create(createCategoryDto: CreateCategoryDto) {
    const existingCategory = await this.categoryRepository.findOne({
      where: { name: createCategoryDto.name },
    });

    if (existingCategory) {
      throw new ConflictException('Nama kategori sudah digunakan');
    }

    const category = this.categoryRepository.create(createCategoryDto);

    return await this.categoryRepository.save(category);
  }

  // Menampilkan semua kategori
  async findAll() {
    return await this.categoryRepository.find();
  }

  // Menampilkan kategori berdasarkan ID
  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: {
        books: true,
      },
    });

    if (!category) {
      throw new NotFoundException('Kategori tidak ditemukan');
    }

    return category;
  }

  // Mengubah data kategori
  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.findOne(id);

    if (updateCategoryDto.name) {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: updateCategoryDto.name },
      });

      if (existingCategory && existingCategory.id !== id) {
        throw new ConflictException('Nama kategori sudah digunakan');
      }
    }

    Object.assign(category, updateCategoryDto);

    return await this.categoryRepository.save(category);
  }

  // Menghapus kategori
  async remove(id: string) {
    const category = await this.findOne(id);

    if (category.books.length > 0) {
      throw new ConflictException(
        'Kategori tidak dapat dihapus karena masih digunakan oleh buku',
      );
    }

    await this.categoryRepository.remove(category);

    return {
      message: 'Kategori berhasil dihapus',
    };
  }
}