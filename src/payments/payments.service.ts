import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from './entities/payment.entity.js';
import { Order } from '../orders/entities/order.entity.js';

import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  // Menambahkan pembayaran
  async create(createPaymentDto: CreatePaymentDto) {
    const {
      orderId,
      amount,
      paidAt,
      ...paymentData
    } = createPaymentDto;

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    const existingPayment = await this.paymentRepository.findOne({
      where: {
        order: { id: orderId },
      },
    });

    if (existingPayment) {
      throw new ConflictException(
        'Pesanan sudah memiliki data pembayaran',
      );
    }

    const payment = this.paymentRepository.create({
      ...paymentData,
      order,
      amount: String(amount),
      paidAt: paidAt ? new Date(paidAt) : null,
    });

    return await this.paymentRepository.save(payment);
  }

  // Menampilkan semua pembayaran
  async findAll() {
    return await this.paymentRepository.find({
      relations: {
        order: true,
      },
    });
  }

  // Menampilkan pembayaran berdasarkan ID
  async findOne(id: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: {
        order: true,
      },
    });

    if (!payment) {
      throw new NotFoundException('Pembayaran tidak ditemukan');
    }

    return payment;
  }

  // Mengubah data pembayaran
  async update(
    id: string,
    updatePaymentDto: UpdatePaymentDto,
  ) {
    const payment = await this.findOne(id);

    const {
      orderId,
      amount,
      paidAt,
      ...paymentData
    } = updatePaymentDto;

    if (orderId) {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException('Pesanan tidak ditemukan');
      }

      const existingPayment = await this.paymentRepository.findOne({
        where: {
          order: { id: orderId },
        },
      });

      if (existingPayment && existingPayment.id !== id) {
        throw new ConflictException(
          'Pesanan sudah memiliki data pembayaran',
        );
      }

      payment.order = order;
    }

    Object.assign(payment, paymentData);

    if (amount !== undefined) {
      payment.amount = String(amount);
    }

    if (paidAt !== undefined) {
      payment.paidAt = new Date(paidAt);
    }

    return await this.paymentRepository.save(payment);
  }

  // Menghapus pembayaran
  async remove(id: string) {
    const payment = await this.findOne(id);

    await this.paymentRepository.remove(payment);

    return {
      message: 'Pembayaran berhasil dihapus',
    };
  }
}