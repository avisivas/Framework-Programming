
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

import { CustomerAddressesService } from '../customer-addresses/customer-addresses.service.js';

import { CreateCustomerAddressDto } from '../customer-addresses/dto/create-customer-address.dto.js';
import { UpdateCustomerAddressDto } from '../customer-addresses/dto/update-customer-address.dto.js';

@Controller('customer-addresses')
export class CustomerAddressesController {
  constructor(
    private readonly customerAddressesService: CustomerAddressesService,
  ) {}

  // CREATE
  @Post()
  create(
    @Body() createCustomerAddressDto: CreateCustomerAddressDto,
  ) {
    return this.customerAddressesService.create(createCustomerAddressDto);
  }

  // FIND ALL
  @Get()
  findAll() {
    return this.customerAddressesService.findAll();
  }

  // FIND ONE
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerAddressesService.findOne(id);
  }

  // UPDATE
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerAddressDto: UpdateCustomerAddressDto,
  ) {
    return this.customerAddressesService.update(
      id,
      updateCustomerAddressDto,
    );
  }

  // DELETE
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerAddressesService.remove(id);
  }
}