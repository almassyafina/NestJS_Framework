import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { Customer } from './entities/customer.entity.js';
import { CreateCustomerDto } from './dto/create-customer.dto.js'
import { UpdateCustomerDto } from './dto/update-customer.dto.js';

@Injectable()
export class CustomersService {
  constructor(
    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // Menambahkan customer baru
  async create(createCustomerDto: CreateCustomerDto) {
    const hashedPassword = await bcrypt.hash(
      createCustomerDto.password,
      10,
    );

    const customer = this.customerRepository.create({
      ...createCustomerDto,
      password: hashedPassword,
    });

    const savedCustomer = await this.customerRepository.save(customer);

    // Tidak mengirim password ke response
    const { password, ...result } = savedCustomer;

    return result;
  }

  // Mengambil seluruh data customer
  async findAll() {
    return this.customerRepository.find({
      relations: {
        addresses: true,
      },
    });
  }

  // Mengambil satu customer berdasarkan ID
  async findOne(id: string) {
    const customer = await this.customerRepository.findOne({
      where: { id },
      relations: {
        addresses: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer dengan ID ${id} tidak ditemukan`,
      );
    }

    return customer;
  }

  // Memperbarui data customer
  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const customer = await this.findOne(id);

    const updateData = { ...updateCustomerDto };

    // Password baru harus di-hash sebelum disimpan
    if (updateData.password) {
      updateData.password = await bcrypt.hash(
        updateData.password,
        10,
      );
    }

    Object.assign(customer, updateData);

    const updatedCustomer = await this.customerRepository.save(customer);

    const { password, ...result } = updatedCustomer;

    return result;
  }

  // Menghapus customer berdasarkan ID
  async remove(id: string) {
    const customer = await this.findOne(id);

    await this.customerRepository.remove(customer);

    return {
      message: 'Customer berhasil dihapus',
    };
  }
}