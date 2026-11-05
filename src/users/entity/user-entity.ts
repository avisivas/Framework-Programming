
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import type { Relation } from 'typeorm';
import { CustomerAddress } from '../../customer-addresses/entities/costomer-addresses.entity.js'
import { Order } from '../../orders/entities/order-entity.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 150 })
  name: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 150 })
  password: string;

  @Column({ type: 'varchar', length: 20 })
  phone: string;

  @CreateDateColumn({ type: 'timestamp' })
  created_at: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @OneToMany(
  () => CustomerAddress,
  (customerAddress) => customerAddress.user,
)
customerAddresses: Relation<CustomerAddress[]>;

@OneToMany(() => Order, (order) => order.user)
orders: Relation<Order[]>;
}