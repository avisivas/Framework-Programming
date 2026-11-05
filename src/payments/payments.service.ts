import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Payment } from './entities/payment-entity.js';
import { Order } from '../orders/entities/order-entity.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { UpdatePaymentDto } from './dto/update-payment.dto.js';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepository: Repository<Payment>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createPaymentDto: CreatePaymentDto) {
    const order = await this.orderRepository.findOne({
      where: { id: createPaymentDto.order_id },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    const existingPayment = await this.paymentRepository.findOne({
      where: { order_id: createPaymentDto.order_id },
    });

    if (existingPayment) {
      throw new ConflictException(
        'Pesanan sudah memiliki data pembayaran',
      );
    }

    const payment = this.paymentRepository.create({
      ...createPaymentDto,
      paid_at:
        createPaymentDto.status === 'paid' ? new Date() : null,
    });

    return this.paymentRepository.save(payment);
  }

  findAll() {
    return this.paymentRepository.find({
      relations: { order: true },
    });
  }

  async findOne(id: string) {
    const payment = await this.paymentRepository.findOne({
      where: { id },
      relations: { order: true },
    });

    if (!payment) {
      throw new NotFoundException('Data pembayaran tidak ditemukan');
    }

    return payment;
  }

  async update(id: string, updatePaymentDto: UpdatePaymentDto) {
    const payment = await this.findOne(id);

    if (updatePaymentDto.order_id) {
      const order = await this.orderRepository.findOne({
        where: { id: updatePaymentDto.order_id },
      });

      if (!order) {
        throw new NotFoundException('Pesanan tidak ditemukan');
      }

      const existingPayment = await this.paymentRepository.findOne({
        where: { order_id: updatePaymentDto.order_id },
      });

      if (existingPayment && existingPayment.id !== id) {
        throw new ConflictException(
          'Pesanan sudah memiliki data pembayaran',
        );
      }
    }

    Object.assign(payment, updatePaymentDto);

    if (updatePaymentDto.status === 'paid' && !payment.paid_at) {
      payment.paid_at = new Date();
    }

    return this.paymentRepository.save(payment);
  }

  async remove(id: string) {
    const payment = await this.findOne(id);

    await this.paymentRepository.remove(payment);

    return {
      message: 'Data pembayaran berhasil dihapus',
    };
  }
}