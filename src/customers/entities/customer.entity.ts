import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import type { Relation } from 'typeorm';
import { CustomerAddress } from '../../customer-addresses/entities/customers-address.entity.js';
import { Order } from '../../orders/entities/order.entity.js';

@Entity({ name: 'customers' })
export class Customer {

  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  phone: string | null;

  // Satu pelanggan dapat memiliki banyak alamat (1:M)
  @OneToMany(() => CustomerAddress, (address) => address.customer)
  addresses: Relation<CustomerAddress[]>;

  @OneToMany(() => Order, (order) => order.customer)
  orders: Relation<Order[]>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}