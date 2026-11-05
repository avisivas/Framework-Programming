import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CustomerAddressesService } from '../customer-addresses/customer-addresses.service.js';
import { CustomerAddressesController } from '../customer-addresses/customer-addresses.controller.js';

import { CustomerAddress } from '../customer-addresses/entities/costomer-addresses.entity.js';
import { User } from '../users/entity/user-entity.js';

@Module({
  imports: [
    TypeOrmModule.forFeature([CustomerAddress, User]),
  ],
  controllers: [CustomerAddressesController],
  providers: [CustomerAddressesService],
  exports: [CustomerAddressesService],
})
export class CustomerAddressesModule {}