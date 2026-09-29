import { Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';

@Controller('books')
export class BooksController {
    // menampilkan data 
    @Get()
    findAll() :string {
        return 'Menmapilkan semua data buku';
    }

    // menyimpan data
    @Post()
    simpanData(): string {
        return 'Menyimpan data buku';
    }

    // mengudate data
    @Put(':id')
    updateData(@Param('id') id: string): string {
        return `Mengupdate data buku dengan id ${id}`;
    }


    // menghapus data
    @Delete(':id')
    hapusData(@Param('id') id: string): string {
        return `Menghapus data buku dengan id ${id}`;
    }
}