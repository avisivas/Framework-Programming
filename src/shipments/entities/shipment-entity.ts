import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import type { Relation } from 'typeorm';

import { Order } from '../../orders/entities/order-entity.js';

@Entity('shipments')
export class Shipment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid', unique: true })
  order_id: string;

  @Column({ type: 'varchar', length: 100 })
  courier: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  tracking_number: string | null;

  @Column({ type: 'varchar', length: 30 })
  status: string;

  @Column({ type: 'timestamp', nullable: true })
  shipped_at: Date | null;

  @Column({ type: 'timestamp', nullable: true })
  delivered_at: Date | null;

  @OneToOne(() => Order)
  @JoinColumn({ name: 'order_id' })
  order: Relation<Order>;
}