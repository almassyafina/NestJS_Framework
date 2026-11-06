import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomersController } from './customers.controller.js';
import { CustomersService } from './customers.service.js';
import { Customer } from './entities/customer.entity.js';
import { CustomerAddress } from '../customer-addresses/entities/customers-address.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Customer, CustomerAddress])],
  controllers: [CustomersController],
  providers: [CustomersService],
  exports: [TypeOrmModule],
})
export class CustomersModule {}