import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm"
import type { Relation } from "typeorm"
import { Category } from "../../categories/entities/category-entity.js";
import { Publisher } from "../../publishers/entities/publisher-entity.js";
import { Author } from "../../authors/entities/authors-entity.js";
import { BookAuthor } from "../../book-authors/entities/book-author.entity.js";
import { OrderItem } from "../../order-items/entities/order-item.entity.js";

@Entity({name: 'books'})
export class Book{

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:'varchar', length: 65})
    title: string;

    @Column({type:'varchar', length: 100})
    author: string;

    @Column({type:'varchar', length: 45, unique: true})
    isbn: string;

    @Column({type:'int', default: 0})
    publishedYear: number;

    @Column({type:'boolean', default:true})
    isAvailable: boolean;

    @Column({ type: 'decimal', precision:12, scale: 2, default:0})
    price: string;

    @Column({type: 'int', default: 0})
    stock: number;

    // Banyak buku mempunyai satu kategori (M:1)
    @ManyToOne(() => Category, (category) => category.books)
    @JoinColumn({ name: 'category_id' })
    category: Category;

    // Banyak buku di terbitkan oleh satu penerbit (M:1)
    @ManyToOne(() => Publisher, (publisher) => publisher.books)
    @JoinColumn({ name: 'publisher_id' })
    publisher: Publisher;

    // Satu buku dapat memiliki banyak penulis (M:N)
    // Satu buku dapat memiliki banyak data penghubung penulis
    @OneToMany(() => BookAuthor, (bookAuthor) => bookAuthor.book)
    bookAuthors: Relation<BookAuthor[]>;

    @OneToMany(() => OrderItem, (item) => item.book)
    orderItems: Relation<OrderItem[]>;

    @CreateDateColumn({name: 'created_at'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updated_at'})
    updatedAt: Date;

    @DeleteDateColumn({name: 'deleted_at', nullable:true})
    deletedAt: Date | null;
  


}
