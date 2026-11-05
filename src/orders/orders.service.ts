import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Order } from './entities/order-entity.js';
import { CreateOrderDto } from './dto/create-orders.dto.js';
import { UpdateOrderDto } from './dto/update-orders.dto.js';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createOrderDto: CreateOrderDto) {
    const existingOrder = await this.orderRepository.findOne({
      where: { order_number: createOrderDto.order_number },
    });

    if (existingOrder) {
      throw new ConflictException('Nomor pesanan sudah digunakan');
    }

    const order = this.orderRepository.create(createOrderDto);
    return this.orderRepository.save(order);
  }

  findAll() {
    return this.orderRepository.find({
      relations: { user: true },
    });
  }

  async findOne(id: string) {
    const order = await this.orderRepository.findOne({
      where: { id },
      relations: { user: true },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    return order;
  }

  async update(id: string, updateOrderDto: UpdateOrderDto) {
    const order = await this.findOne(id);

    if (updateOrderDto.order_number) {
      const existingOrder = await this.orderRepository.findOne({
        where: { order_number: updateOrderDto.order_number },
      });

      if (existingOrder && existingOrder.id !== id) {
        throw new ConflictException('Nomor pesanan sudah digunakan');
      }
    }

    Object.assign(order, updateOrderDto);
    return this.orderRepository.save(order);
  }

  async remove(id: string) {
    const order = await this.findOne(id);
    await this.orderRepository.remove(order);

    return {
      message: 'Pesanan berhasil dihapus',
    };
  }
}