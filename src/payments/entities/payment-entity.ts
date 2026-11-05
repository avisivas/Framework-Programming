import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

import { Order } from '../../orders/entities/order-entity.js';

@Entity('payments')
export class Payment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  order_id: string;

  @Column({ type: 'varchar', length: 50 })
  payment_method: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  amount: number;

  @Column({ type: 'varchar', length: 30 })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  paid_at: Date | null;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @OneToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Relation<Order>;
}