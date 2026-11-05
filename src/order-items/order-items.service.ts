import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OrderItem } from './entities/order-item.entity.js';
import { Order } from '../orders/entities/order-entity.js';
import { Book } from '../books/entities/book-entity.js';
import { CreateOrderItemDto } from './dto/create-order-item.dto.js';
import { UpdateOrderItemDto } from './dto/update-order-item.dto.js';

@Injectable()
export class OrderItemsService {
  constructor(
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,

    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async create(createOrderItemDto: CreateOrderItemDto) {
    const order = await this.orderRepository.findOne({
      where: { id: createOrderItemDto.order_id },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    const book = await this.bookRepository.findOne({
      where: { id: createOrderItemDto.book_id },
    });

    if (!book) {
      throw new NotFoundException('Buku tidak ditemukan');
    }

    const subtotal =
      createOrderItemDto.quantity * createOrderItemDto.price;

    const orderItem = this.orderItemRepository.create({
      ...createOrderItemDto,
      subtotal,
    });

    return this.orderItemRepository.save(orderItem);
  }

  findAll() {
    return this.orderItemRepository.find({
      relations: {
        order: true,
        book: true,
      },
    });
  }

  async findOne(id: string) {
    const orderItem = await this.orderItemRepository.findOne({
      where: { id },
      relations: {
        order: true,
        book: true,
      },
    });

    if (!orderItem) {
      throw new NotFoundException('Detail pesanan tidak ditemukan');
    }

    return orderItem;
  }

  async update(id: string, updateOrderItemDto: UpdateOrderItemDto) {
    const orderItem = await this.findOne(id);

    if (updateOrderItemDto.order_id) {
      const order = await this.orderRepository.findOne({
        where: { id: updateOrderItemDto.order_id },
      });

      if (!order) {
        throw new NotFoundException('Pesanan tidak ditemukan');
      }
    }

    if (updateOrderItemDto.book_id) {
      const book = await this.bookRepository.findOne({
        where: { id: updateOrderItemDto.book_id },
      });

      if (!book) {
        throw new NotFoundException('Buku tidak ditemukan');
      }
    }

    Object.assign(orderItem, updateOrderItemDto);

    orderItem.subtotal =
      orderItem.quantity * orderItem.price;

    return this.orderItemRepository.save(orderItem);
  }

  async remove(id: string) {
    const orderItem = await this.findOne(id);

    await this.orderItemRepository.remove(orderItem);

    return {
      message: 'Detail pesanan berhasil dihapus',
    };
  }
}