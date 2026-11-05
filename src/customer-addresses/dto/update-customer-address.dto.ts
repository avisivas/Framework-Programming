import {PartialType } from '@nestjs/mapped-types'
import { CreateCustomerAddressDto } from '../dto/create-customer-address.dto.js';

export class UpdateCustomerAddressDto extends PartialType(
  CreateCustomerAddressDto,
) {}