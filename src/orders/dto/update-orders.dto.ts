import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-orders.dto.js';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
    [x: string]: any;
}