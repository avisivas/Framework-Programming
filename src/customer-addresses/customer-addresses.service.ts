import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { CustomerAddress } from '../customer-addresses/entities/costomer-addresses.entity.js';
import { User } from '../users/entity/user-entity.js';

import { CreateCustomerAddressDto } from '../customer-addresses/dto/create-customer-address.dto.js';
import { UpdateCustomerAddressDto } from '../customer-addresses/dto/update-customer-address.dto.js';

@Injectable()
export class CustomerAddressesService {
  constructor(
    @InjectRepository(CustomerAddress)
    private customerAddressRepository: Repository<CustomerAddress>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // CREATE
  async create(createCustomerAddressDto: CreateCustomerAddressDto) {
    const user = await this.userRepository.findOne({
      where: { id: createCustomerAddressDto.user_id },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    const customerAddress = this.customerAddressRepository.create(
      createCustomerAddressDto,
    );

    return await this.customerAddressRepository.save(customerAddress);
  }

  // FIND ALL
  async findAll() {
    return await this.customerAddressRepository.find({
      relations: {
      user: true,
},
    });
  }

  // FIND ONE
  // FIND ONE
async findOne(id: string) {
  const customerAddress = await this.customerAddressRepository.findOne({
    where: { id },
    relations: {
      user: true,
    },
  });

  if (!customerAddress) {
    throw new NotFoundException('Alamat pelanggan tidak ditemukan');
  }

  return customerAddress;
}

  // UPDATE
  // UPDATE
async update(
  id: string,
  updateCustomerAddressDto: UpdateCustomerAddressDto,
) {
  const customerAddress = await this.findOne(id);

  if (updateCustomerAddressDto.user_id) {
    const user = await this.userRepository.findOne({
      where: { id: updateCustomerAddressDto.user_id },
    });

    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }

    customerAddress.user = user;
  }

  Object.assign(customerAddress, updateCustomerAddressDto);

  return await this.customerAddressRepository.save(customerAddress);
}

  // DELETE
  async remove(id: string) {
    const customerAddress = await this.findOne(id);

    await this.customerAddressRepository.remove(customerAddress);

    return {
      message: 'Alamat pelanggan berhasil dihapus',
    };
  }
}