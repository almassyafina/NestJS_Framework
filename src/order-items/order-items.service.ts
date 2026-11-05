import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from './entities/order-item.entity.js';
import { Order } from '../orders/entities/order.entity.js';
import { Book } from '../books/entities/book-entity.js';

import { CreateOrderItemDto } from './dto/create-order-item.dto.js';
import { UpdateOrderItemDto } from './dto/update-order-item.dto.js';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
  ) {}

  // Menambahkan item pesanan
  async create(createOrderItemDto: CreateOrderItemDto) {
    const { orderId, bookId, quantity, price } = createOrderItemDto;

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    const book = await this.bookRepository.findOne({
      where: { id: bookId },
    });

    if (!book) {
      throw new NotFoundException('Buku tidak ditemukan');
    }

    const subtotal = quantity * price;

    const orderItem = this.orderItemRepository.create({
      order,
      book,
      quantity,
      price: String(price),
      subtotal: subtotal.toFixed(2),
    });

    return await this.orderItemRepository.save(orderItem);
  }

  // Menampilkan semua item pesanan
  async findAll() {
    return await this.orderItemRepository.find({
      relations: {
        order: true,
        book: true,
      },
    });
  }

  // Menampilkan item berdasarkan ID
  async findOne(id: string) {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: {
        order: true,
        book: true,
      },
    });

    if (!orderItem) {
      throw new NotFoundException('Item pesanan tidak ditemukan');
    }

    return orderItem;
  }

  // Mengubah data item pesanan
  async update(
    id: string,
    updateOrderItemDto: UpdateOrderItemDto,
  ) {
    const orderItem = await this.findOne(id);

    const {
      orderId,
      bookId,
      quantity,
      price,
    } = updateOrderItemDto;

    if (orderId) {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException('Pesanan tidak ditemukan');
      }

      orderItem.order = order;
    }

    if (bookId) {
      const book = await this.bookRepository.findOne({
        where: { id: bookId },
      });

      if (!book) {
        throw new NotFoundException('Buku tidak ditemukan');
      }

      orderItem.book = book;
    }

    if (quantity !== undefined) {
      orderItem.quantity = quantity;
    }

    if (price !== undefined) {
      orderItem.price = String(price);
    }

    orderItem.subtotal = (
      orderItem.quantity * Number(orderItem.price)
    ).toFixed(2);

    return await this.orderItemRepository.save(orderItem);
  }

  // Menghapus item pesanan
  async remove(id: string) {
    const orderItem = await this.findOne(id);

    await this.orderItemRepository.remove(orderItem);

    return {
      message: 'Item pesanan berhasil dihapus',
    };
  }
}