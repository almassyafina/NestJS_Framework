import { Body, Controller, Delete, Get, Param, Post, Put, } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book-dto.js';
import { BooksService } from './books.service.js';

@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) {}

    //menampilkan data
    @Get()
    findAll() {
        return this.booksService.findAll();
    }

    //TAMBAHAN: menampilkan satu data berdasarkan ID
    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.booksService.findOne(id);
    }

    //menyimpan data 
    @Post()
    simpanData(@Body() createBookDto: CreateBookDto) {
        return this.booksService.simpanData(createBookDto);
    }

    //mengupdate data
    @Put(':id')
    updateData(
        @Param('id') id: string,@Body() createBookDto: CreateBookDto) {
        return this.booksService.updateData(id, createBookDto);
    }

    //menghapus data
    @Delete(':id')
    hapusdata(@Param('id') id: string) {
        return this.booksService.deleteData(id);
    }
}