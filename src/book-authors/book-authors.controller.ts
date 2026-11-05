import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';

import { BookAuthorsService } from './book-authors.service.js';
import { CreateBookAuthorDto } from './dto/create-book-author.dto.js';
import { UpdateBookAuthorDto } from './dto/update-book-author.dto.js';

@Controller('book-authors')
export class BookAuthorsController {
  constructor(
    private readonly bookAuthorsService: BookAuthorsService,
  ) {}

  @Post()
  create(@Body() createBookAuthorDto: CreateBookAuthorDto) {
    return this.bookAuthorsService.create(createBookAuthorDto);
  }

  @Get()
  findAll() {
    return this.bookAuthorsService.findAll();
  }

  @Get(':bookId/:authorId')
  findOne(
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Param('authorId', ParseUUIDPipe) authorId: string,
  ) {
    return this.bookAuthorsService.findOne(bookId, authorId);
  }

  @Patch(':bookId/:authorId')
  update(
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Param('authorId', ParseUUIDPipe) authorId: string,
    @Body() updateBookAuthorDto: UpdateBookAuthorDto,
  ) {
    return this.bookAuthorsService.update(
      bookId,
      authorId,
      updateBookAuthorDto,
    );
  }

  @Delete(':bookId/:authorId')
  remove(
    @Param('bookId', ParseUUIDPipe) bookId: string,
    @Param('authorId', ParseUUIDPipe) authorId: string,
  ) {
    return this.bookAuthorsService.remove(bookId, authorId);
  }
}