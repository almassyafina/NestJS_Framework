import { 
  Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity, 
  OneToMany, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn, 
} from 'typeorm';
import { Book } from '../../books/entities/book-entity.js';


@Entity('categories')
export class Category{
  @PrimaryGeneratedColumn('uuid')
  id: string;


  @Column({type: 'varchar'})
  name: string;

  
// Satu kategori mempunyai banyak buku (1:M)
@OneToMany(() => Book, (book) => book.category, {
  cascade: true
})
books: Book[];

  @CreateDateColumn({name: 'created_at'})
  createdAt: Date;

  @UpdateDateColumn({name: 'updated_at'})
  updatedAt: Date;

}
