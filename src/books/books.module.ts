import { Module } from '@nestjs/common';
import { BooksController } from './books.controller.js';
import { BooksService } from './books.service.js';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Book } from './entities/book-entity.js';
import { Publisher } from '../publishers/entities/publisher-entity.js';
import { Category } from '../categories/entities/category-entity.js';

@Module({
  imports:[TypeOrmModule.forFeature([Book, Category, Publisher])],
  controllers: [BooksController],
  providers: [BooksService],
  exports: [BooksService]
})
export class BooksModule {}