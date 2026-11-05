import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomerAddress } from './entities/customers-address.entity.js';
import { Customer } from '../customers/entities/customer.entity.js';

import { CreateCustomerAddressDto } from './dto/create-customer-address.dto.js';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto.js';

@Injectable()
export class CustomerAddressesService {
  constructor(
    @InjectRepository(CustomerAddress)
    private readonly addressRepository: Repository<CustomerAddress>,

    @InjectRepository(Customer)
    private readonly customerRepository: Repository<Customer>,
  ) {}

  // Menambahkan alamat customer
  async create(createDto: CreateCustomerAddressDto) {
    const customer = await this.customerRepository.findOne({
      where: { id: createDto.customerId },
    });

    if (!customer) {
      throw new NotFoundException('Customer tidak ditemukan');
    }

    const { customerId, ...addressData } = createDto;

    const address = this.addressRepository.create({
      ...addressData,
      customer,
    });

    return this.addressRepository.save(address);
  }

  // Mengambil seluruh alamat
  async findAll() {
    return this.addressRepository.find({
      relations: {
        customer: true,
      },
    });
  }

  // Mengambil alamat berdasarkan ID
  async findOne(id: string) {
    const address = await this.addressRepository.findOne({
      where: { id },
      relations: {
        customer: true,
      },
    });

    if (!address) {
      throw new NotFoundException('Alamat customer tidak ditemukan');
    }

    return address;
  }

  // Memperbarui alamat
  async update(id: string, updateDto: UpdateCustomerAddressDto) {
    const address = await this.findOne(id);

    const { customerId, ...addressData } = updateDto;

    if (customerId) {
      const customer = await this.customerRepository.findOne({
        where: { id: customerId },
      });

      if (!customer) {
        throw new NotFoundException('Customer tidak ditemukan');
      }

      address.customer = customer;
    }

    Object.assign(address, addressData);

    return this.addressRepository.save(address);
  }

  // Menghapus alamat
  async remove(id: string) {
    const address = await this.findOne(id);

    await this.addressRepository.remove(address);

    return {
      message: 'Alamat customer berhasil dihapus',
    };
  }
}