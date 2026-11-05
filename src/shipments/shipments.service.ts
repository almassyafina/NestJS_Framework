import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Shipment } from './entities/shipment.entity.js';
import { Order } from '../orders/entities/order.entity.js';

import { CreateShipmentDto } from './dto/create-shipment.dto.js';
import { UpdateShipmentDto } from './dto/update-shipment.dto.js';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private shipmentRepository: Repository<Shipment>,

    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
  ) {}

  // Menambahkan data pengiriman
  async create(createShipmentDto: CreateShipmentDto) {
    const {
      orderId,
      shippedAt,
      deliveredAt,
      trackingNumber,
      ...shipmentData
    } = createShipmentDto;

    const order = await this.orderRepository.findOne({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    const existingShipment = await this.shipmentRepository.findOne({
      where: {
        order: { id: orderId },
      },
    });

    if (existingShipment) {
      throw new ConflictException(
        'Pesanan sudah memiliki data pengiriman',
      );
    }

    const shipment = new Shipment();

    shipment.order = order;
    shipment.courier = shipmentData.courier;
    shipment.status = shipmentData.status ?? 'pending';
    shipment.trackingNumber = trackingNumber ?? null;
    shipment.shippedAt = shippedAt ? new Date(shippedAt) : null;
    shipment.deliveredAt = deliveredAt ? new Date(deliveredAt) : null;

    return await this.shipmentRepository.save(shipment);
  }

  // Menampilkan semua data pengiriman
  async findAll() {
    return await this.shipmentRepository.find({
      relations: {
        order: true,
      },
    });
  }

  // Menampilkan pengiriman berdasarkan ID
  async findOne(id: string) {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: {
        order: true,
      },
    });

    if (!shipment) {
      throw new NotFoundException('Data pengiriman tidak ditemukan');
    }

    return shipment;
  }

  // Mengubah data pengiriman
  async update(
    id: string,
    updateShipmentDto: UpdateShipmentDto,
  ) {
    const shipment = await this.findOne(id);

    const {
      orderId,
      shippedAt,
      deliveredAt,
      trackingNumber,
      ...shipmentData
    } = updateShipmentDto;

    if (orderId) {
      const order = await this.orderRepository.findOne({
        where: { id: orderId },
      });

      if (!order) {
        throw new NotFoundException('Pesanan tidak ditemukan');
      }

      const existingShipment = await this.shipmentRepository.findOne({
        where: {
          order: { id: orderId },
        },
      });

      if (
        existingShipment &&
        existingShipment.id !== id
      ) {
        throw new ConflictException(
          'Pesanan sudah memiliki data pengiriman',
        );
      }

      shipment.order = order;
    }

    Object.assign(shipment, shipmentData);

    if (trackingNumber !== undefined) {
      shipment.trackingNumber = trackingNumber;
    }

    if (shippedAt !== undefined) {
      shipment.shippedAt = new Date(shippedAt);
    }

    if (deliveredAt !== undefined) {
      shipment.deliveredAt = new Date(deliveredAt);
    }

    return await this.shipmentRepository.save(shipment);
  }

  // Menghapus data pengiriman
  async remove(id: string) {
    const shipment = await this.findOne(id);

    await this.shipmentRepository.remove(shipment);

    return {
      message: 'Data pengiriman berhasil dihapus',
    };
  }
}