import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';

import { CustomerAddressesService } from './customer-addresses.service.js';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto.js';
import { UpdateCustomerAddressDto } from './dto/update-customer-address.dto.js';

@Controller('customer-addresses')
export class CustomerAddressesController {
  constructor(
    private readonly customerAddressesService: CustomerAddressesService,
  ) {}

  // Menambahkan alamat customer
  @Post()
  create(@Body() createDto: CreateCustomerAddressDto) {
    return this.customerAddressesService.create(createDto);
  }

  // Menampilkan semua alamat
  @Get()
  findAll() {
    return this.customerAddressesService.findAll();
  }

  // Menampilkan alamat berdasarkan ID
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerAddressesService.findOne(id);
  }

  // Memperbarui alamat
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateCustomerAddressDto,
  ) {
    return this.customerAddressesService.update(id, updateDto);
  }

  // Menghapus alamat
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerAddressesService.remove(id);
  }
}