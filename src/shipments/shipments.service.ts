import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Shipment } from './entities/shipment-entity.js';
import { Order } from '../orders/entities/order-entity.js';
import { CreateShipmentDto } from './dto/create-shipment.dto.js';
import { UpdateShipmentDto } from './dto/update-shipment.dto.js';

@Injectable()
export class ShipmentsService {
  constructor(
    @InjectRepository(Shipment)
    private readonly shipmentRepository: Repository<Shipment>,

    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async create(createShipmentDto: CreateShipmentDto) {
    const order = await this.orderRepository.findOne({
      where: { id: createShipmentDto.order_id },
    });

    if (!order) {
      throw new NotFoundException('Pesanan tidak ditemukan');
    }

    const existingShipment = await this.shipmentRepository.findOne({
      where: { order_id: createShipmentDto.order_id },
    });

    if (existingShipment) {
      throw new ConflictException(
        'Pesanan sudah memiliki data pengiriman',
      );
    }

    const shipment = this.shipmentRepository.create({
      ...createShipmentDto,
      shipped_at:
        createShipmentDto.status === 'shipped' ? new Date() : null,
      delivered_at:
        createShipmentDto.status === 'delivered' ? new Date() : null,
    });

    return this.shipmentRepository.save(shipment);
  }

  findAll() {
    return this.shipmentRepository.find({
      relations: { order: true },
    });
  }

  async findOne(id: string) {
    const shipment = await this.shipmentRepository.findOne({
      where: { id },
      relations: { order: true },
    });

    if (!shipment) {
      throw new NotFoundException('Data pengiriman tidak ditemukan');
    }

    return shipment;
  }

  async update(id: string, updateShipmentDto: UpdateShipmentDto) {
    const shipment = await this.findOne(id);

    if (updateShipmentDto.order_id) {
      const order = await this.orderRepository.findOne({
        where: { id: updateShipmentDto.order_id },
      });

      if (!order) {
        throw new NotFoundException('Pesanan tidak ditemukan');
      }

      const existingShipment = await this.shipmentRepository.findOne({
        where: { order_id: updateShipmentDto.order_id },
      });

      if (existingShipment && existingShipment.id !== id) {
        throw new ConflictException(
          'Pesanan sudah memiliki data pengiriman',
        );
      }
    }

    Object.assign(shipment, updateShipmentDto);

    if (updateShipmentDto.status === 'shipped' && !shipment.shipped_at) {
      shipment.shipped_at = new Date();
    }

    if (
      updateShipmentDto.status === 'delivered' &&
      !shipment.delivered_at
    ) {
      shipment.delivered_at = new Date();
    }

    return this.shipmentRepository.save(shipment);
  }

  async remove(id: string) {
    const shipment = await this.findOne(id);

    await this.shipmentRepository.remove(shipment);

    return {
      message: 'Data pengiriman berhasil dihapus',
    };
  }
}