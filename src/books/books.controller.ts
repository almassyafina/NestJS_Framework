import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BooksService } from './books.service.js';
import { CreateBookDto } from './dto/create-book-dto.js';

@Controller('books')
export class BooksController {

    constructor(private readonly booksService: BooksService) {}
    // menampilkan data 
    @Get()
    findAll() :string {
        return this.booksService.findAll().toString();
    }

    // menyimpan data
    @Post()
    simpanData(@Body() createBookDto: CreateBookDto){
        return this.booksService.simpanData(createBookDto);
    }

//     // mengudate data
//     @Put(':id')
//     updateData(
//         @Param('id') id: string, 
//         @Body() createBookDto: CreateBookDto){
//         return this.booksService.updateData(parseInt(id), createBookDto);
//     }


//     // menghapus data
//     @Delete(':id')
//     hapusData(
//         @Param('id') id: string, 
//         @Body() createBookDto: CreateBookDto){
//         return this.booksService.hapusData(parseInt(id), createBookDto);
//     }
 }