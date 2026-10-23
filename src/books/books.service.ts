import { Injectable } from '@nestjs/common';
import { Book } from './entities/book-entity.js';
import { CreateBookDto } from './dto/create-book-dto.js';
import { inject } from 'vitest';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm'; 

@Injectable()
export class BooksService {
  //FUNGSI UNTUK AKSES KE DATABASE
  constructor(
      @InjectRepository(Book)
      private readonly bookRepository: Repository<Book>
  ){}
      //logic menampilkan data
      async findAll(): Promise<Book[]> {  
        return await this.bookRepository.find({
          order:{createdAt:'DESC'}
        })
      }; 

      //Simpan data
      async simpanData(createBookDto: CreateBookDto): Promise <Book> {
        const newBook = this.bookRepository.create(createBookDto);

        return await this.bookRepository.save(newBook);
      };

    //Update data
//     updateData(id: number, createBookDto: CreateBookDto): Book {
//       const bookIndex = this.books.findIndex(book => book.id === id);
//       if (bookIndex === -1) {
//           throw new Error(`Buku dengan id ${id} tidak ditemukan`);
//       } 

//       const updatedBook: Book = {
//         ...this.books[bookIndex],
//         title: createBookDto.title,
//         author: createBookDto.author,
//         isbn: createBookDto.isbn,
//         publishedYear: createBookDto.publishedYear
//     }

//       this.books[bookIndex] = updatedBook;
//       return updatedBook;
//     };

//     //Hapus data
//     hapusData(id: number, createBookDto: CreateBookDto): Book {
//       const bookIndex = this.books.findIndex(book => book.id === id);
//       if (bookIndex === -1) {
//           throw new Error(`Buku dengan id ${id} tidak ditemukan`);
//       }
//       const deletedBook = this.books[bookIndex];
//       this.books.splice(bookIndex, 1);
//       return deletedBook;
//     }

}
