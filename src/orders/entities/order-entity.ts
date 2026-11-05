import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
  OneToOne
} from 'typeorm';

import type { Relation } from 'typeorm';

import { User } from '../../users/entity/user-entity.js';
import { OrderItem } from '../../order-items/entities/order-item.entity.js';
import { Payment } from '../../payments/entities/payment-entity.js';
import {Shipment} from '../../shipments/entities/shipment-entity.js'

@Entity('orders')
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  customer_id: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  order_number: string;

  @Column({ type: 'varchar', length: 30 })
  status: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  total_amount: number;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @ManyToOne(() => User, (user) => user.orders)
  @JoinColumn({ name: 'customer_id' })
  user: Relation<User>;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.order)
orderItems: Relation<OrderItem[]>;

@OneToOne(() => Payment, (payment) => payment.order)
payment: Relation<Payment>;

@OneToOne(() => Shipment, (shipment) => shipment.order)
shipment: Relation<Shipment>;
}