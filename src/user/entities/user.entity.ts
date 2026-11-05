import { 
  Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  Entity, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn, 
} from 'typeorm';


  @Entity({ name: 'books' }) 
  export class Book { 
  @PrimaryGeneratedColumn('uuid') 
  id: string; 
 
  @Column({ type: 'varchar', length: 30 }) 
  title: string; 
 
  @Column({ type: 'varchar', length: 25 }) 
  author: string; 
 
  @Column({ type: 'varchar', length: 45, unique: true }) 
  isbn: string; 
 
  @Column({ type: 'int', default: 0 }) 
  publishedYear: number; 
 
  @Column({ type: 'boolean', default: true }) 
  isAvailable: boolean; 
 
  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0 
})
price: number; 
@Column({ type: 'int', default: 0 }) 
stock: number; 
@CreateDateColumn({ name: 'created_at' }) 
createdAt: Date; 
@UpdateDateColumn({ name: 'updated_at' }) 
updatedAt: Date; 
@DeleteDateColumn({ name: 'deleted_at', nullable: true }) 
deletedAt: Date | null; 
}