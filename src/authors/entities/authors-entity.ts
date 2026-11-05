import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';
import { Book } from '../../books/entities/book-entity.js';
import { BookAuthor } from '../../book-authors/entities/book-author.entity.js';

@Entity({ name: 'authors' })
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;
  // Satu penulis dapat menulis banyak buku (M:N)
  @OneToMany(() => BookAuthor, (bookAuthor) => bookAuthor.author)
  bookAuthors: Relation<BookAuthor[]>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}