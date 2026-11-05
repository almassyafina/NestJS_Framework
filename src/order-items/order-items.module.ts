import { Module } from '@nestjs/common';
import { OrderItemsController } from './order-items.controller.js';
import { OrderItemsService } from './order-items.service.js';
import { Book } from '../user/entities/user.entity.js';
import { Order } from '../orders/entities/order.entity.js';
import { OrderItem } from './entities/order-item.entity.js';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem, Order, Book])
  ],
  controllers: [OrderItemsController],
  providers: [OrderItemsService]
})
export class OrderItemsModule {}
