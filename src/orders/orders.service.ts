import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order.entity.js';
import { Customer } from '../customers/entities/customer.entity.js';

import { CreateOrderDto } from './dto/create-order.dto.js';
import { UpdateOrderDto } from './dto/update-order.dto.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(Customer)
    private customerRepository: Repository<Customer>,
  ) {}

  // Menambahkan pesanan
async create(createOrderDto: CreateOrderDto) {
  const { customerId, ...orderData } = createOrderDto;

  const existingOrder = await this.orderRepository.findOne({
    where: { orderNumber: orderData.orderNumber },
  });

  if (existingOrder) {
    throw new ConflictException('Nomor pesanan sudah digunakan');
  }

  const customer = await this.customerRepository.findOne({
    where: { id: customerId },
  });

  if (!customer) {
    throw new NotFoundException('Pelanggan tidak ditemukan');
  }

  const order = this.orderRepository.create({
    ...orderData,
    totalAmount: String(orderData.totalAmount),
    customer,
  });

  return await this.orderRepository.save(order);
}

  // Menampilkan semua pesanan
  async findAll() {
    return await this.orderRepository.find({
      relations: {
        customer: true,
        items: true,
        payment: true,
        shipment: true,
      },
    });
  }

  // Menampilkan pesanan berdasarkan ID
  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: {
        customer: true,
        items: {
          book: true,
        },
        payment: true,
        shipment: true,
      },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    return order;
  }

  // Mengubah data pesanan
  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    const { customerId, ...orderData } = updateOrderDto;

    if (orderData.orderNumber) {
      const existingOrder = await this.orderRepository.findOne({
        where: { orderNumber: orderData.orderNumber },
      });

      if (existingOrder && existingOrder.id !== id) {
        throw new ConflictException('Nomor pesanan sudah digunakan');
      }
    }

    if (customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: customerId },
      });

      if (!customer) {
        throw new NotFoundException('Pelanggan tidak ditemukan');
      }

      order.customer = customer;
    }

    Object.assign(order, orderData);

    return await this.orderRepository.save(order);
  }

  // Menghapus pesanan
  async remove(id: string) {
    const order = await this.findOne(id);

    if (
      order.items.length > 0 ||
      order.payment ||
      order.shipment
    ) {
      throw new ConflictException(
        'Pesanan tidak dapat dihapus karena masih memiliki item, pembayaran, atau pengiriman',
      );
    }

    await this.orderRepository.remove(order);

    return {
      message: 'Pesanan berhasil dihapus',
    };
  }
}